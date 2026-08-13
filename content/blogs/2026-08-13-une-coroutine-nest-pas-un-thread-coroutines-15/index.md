---
title: "Une coroutine n'est pas un thread : Coroutines (1/5)"
date: 2026-08-13T16:35:13.002Z
description: "Premier épisode d'une série sur les coroutines Kotlin. On part de définitions puis on regardera sous le capot. Fil rouge tout du long : la comparaison avec les threads Java.   Lors d’une mission précé"
image: ./assets/cover-image.webp
alt: "Couverture de blog HoppR : paysage surréaliste avec ciel vert et champs dorés. Logo HoppR en blanc en haut à droite. Boîte arrondie semi-transparente en bas à gauche contenant le titre \"Une coroutine n'est pas un thread\" en blanc et la ligne \"Kotlin Coroutines 1/5\" en orange."
ogImage: ./assets/cover-image.webp
tags: ['kotlin', 'java', 'craft']
published: true
authors:
  - id: 33bf4462-cd38-80da-845c-c63b2fd024bf
    name: Florian Hirson
    image: ./assets/author-florian-hirson.webp
    linkedin: https://www.linkedin.com/in/florian-hirson/
    x: 
reviewers:
  - id: 188f4462-cd38-80d5-b9e6-ec28a94d11e5
    name: Bastien Dufour
    image: ./assets/reviewer-bastien-dufour.webp
    linkedin: 
    x: 
    jobTitle: "Senior Software Engineer"
  - id: 37bf4462-cd38-8041-92af-c7e51809adcc
    name: Clement Godet
    image: ./assets/reviewer-clement-godet.webp
    linkedin: https://www.linkedin.com/in/cgodet59/
    x: 
---

<!-- markdownlint-disable-file -->


_Premier épisode d'une série sur les coroutines Kotlin. On part de définitions puis on regardera sous le capot. Fil rouge tout du long : la comparaison avec les threads Java._

## Le batch qui gardait des fantômes en mémoire

Lors d’une mission précédente, j'hérite d'un job [Spring Batch](https://spring.io/projects/spring-batch) sur une base de code legacy en Java 8. Son travail : lire un CSV de 2 à 3 Go, supprimer les données existantes en cascade puis réinsérer le tout en base. La demande qui tombe : arrêter le delete en cascade, passer à un **update en delta**. Vu la volumétrie, les données étaient traitées par paquets de 1000 items pour grouper les écritures.

Sur le papier, rien de méchant. Sauf qu'en ouvrant le code, je trouve des [`Future`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/Future.html) un peu partout, des variables quasi globales qui trimballent l'état d'un traitement, et zéro documentation. Le job ne tournait jamais en parallèle d'un autre, une seule instance à la fois. Cependant les données des jobs précédents étaient encore présentes en mémoire quand le suivant démarrait, et venaient polluer le delta. Le premier job passait et tous les autres plantaient.

![Meme tiré de "Les Simpsons" montrant Bart Simpson à l'étage supérieur (inquiet)
et Homer Simpson à l'étage inférieur (criant). Texte : "This is the worst
multithreading bug of my life" (haut) et "so far The worst of your life
threading multibug" (bas). Meme humoristique sur les bugs de programmation
concurrente.](./assets/img1.webp)

Spring Batch n’y était pour rien, la concurrence était bricolée avec des threads lancés manuellement, des `Future` dispersés et de l'état mutable partagé sans personne pour dire qui écrit quoi, quand et pourquoi.

```kotlin
// Le type de code qui a mal tourné : état partagé mutable + Futures dispersés
var cache: MutableList<Row> = mutableListOf()   // variable quasi globale

fun processChunk(chunk: List<Row>): Future<*> = executor.submit {
    cache.addAll(transform(chunk))   // qui écrit ? quand ? dans quel ordre ?
}
```

À l'intérieur d'une même exécution, plusieurs threads écrivaient dans ce cache sans la moindre synchronisation. Cette écriture concurrente sur une liste non protégée n'a jamais provoqué de plantage visible, mais elle pouvait perdre des lignes ou corrompre la structure interne de la liste à n'importe quel moment. Deux problèmes distincts se superposaient donc, un état qui débordait de la durée de vie du job et des accès concurrents non gérés sur ce même état.

On était en Java 8 : les virtual threads n'existaient pas et n'arriveraient que bien plus tard. Mais même avec les virtual threads, ce bug-là serait resté. Le problème n'était pas le nombre de threads, c'était l'**absence de structure** autour de la concurrence.

C'est le manque que les coroutines viennent combler. Avant de voir comment, il faut se débarrasser d'une idée reçue : non une coroutine n'est pas thread léger.

## Rappel : process, thread et coroutine

Avant d'aller plus loin, il est important de souligner la distinction entre un processus et un thread. Les deux permettent d'exécuter plusieurs actions en même temps, mais pas à la même échelle.

Un **process**, c'est une instance de programme en cours d'exécution avec son environnement isolé. Comme le rappelle la documentation Java, [chaque process a son propre espace mémoire](https://docs.oracle.com/javase/tutorial/essential/concurrency/procthread.html). Deux process ne peuvent pas partager le même espace mémoire : pour échanger, ils passent par une [communication inter-process (IPC)](https://fr.wikipedia.org/wiki/Communication_inter-processus) plus lourde et plus lente.

Le code exécuté sur un **thread**, appartient à un process. Ce sont des unités d'exécution qui[ partagent les ressources du process, comme le même espace d'adressage mémoire](https://docs.oracle.com/javase/tutorial/essential/concurrency/procthread.html), la `heap`, et autres. Parce qu'ils se comportent de manière autonome, on a tendance à les appeler parfois “lightweight processes”. Chaque thread garde tout de même sa propre pile d'exécution, ce fameux ~1 Mo qu'on détaille juste après.

Cette mémoire partagée est à double tranchant. Communiquer entre threads est direct et rapide, mais c'est aussi le terrain le plus favorable aux [race conditions](https://fr.wikipedia.org/wiki/Situation_de_comp%C3%A9tition) et aux [deadlocks](https://fr.wikipedia.org/wiki/Interblocage). Le problème de fond reste la gestion des accès concurrents à une ressource partagée, un problème qui se pose aussi entre deux processus qui échangent par IPC. La mémoire partagée le rend simplement immédiat. On retrouve la moitié du problème de mon batch, de l'état mutable partagé entre threads sans personne pour gérer les accès. L'autre moitié tenait à sa durée de vie.

Une autre distinction à clarifier, celle qui revient souvent (logique contre physique) : le thread dont on parle est un **thread OS** (logiciel), celui que l’application crée. A ne pas confondre avec un **thread physique**, matériel qui est une vraie unité d'exécution du processeur. Un cœur en offre un, ou [deux avec l'hyper-threading / SMT](https://www.intel.com/content/www/us/en/gaming/resources/hyper-threading.html) : un CPU 8 cœurs présente ainsi souvent 16 “processeurs logiques” à l'OS. Le CPU n'exécute donc vraiment qu'une poignée de threads OS en parallèle. On peut en créer des milliers côté logiciel, mais c'est le **scheduler de l'OS** qui les fait tourner à tour de rôle sur ces quelques threads physiques, par tranches de temps. Le parallélisme massif qu'on croit avoir est en bonne partie une illusion entretenue par ce scheduler. 

Et les coroutines ? Elles vivent à un niveau d'abstraction plus élevé, tout en s'exécutant à l'intérieur des threads. Un process porte quelques threads ; un thread peut porter des milliers de coroutines multiplexées. D'où la hiérarchie d'imbrication :

![Diagramme hiérarchique montrant la relation "process > threads > coroutines". Un processus contient la mémoire isolée des autres process, partagée entre ses threads. Trois colonnes représentent trois Thread OS identiques, chacun avec sa propre pile (~1 Mo). Dans chaque thread, plusieurs coroutines (représentées en vert) s'exécutent, avec la mention "des centaines de milliers" pour montrer l'échelle.](./assets/img2.webp)



L'échelle à retenir : **process > threads > coroutines**. Chaque étage descend d'un cran en utilisation mémoire et monte d'un cran en nombre. Les process sont isolés (l'un tombe, les autres tiennent) ; les threads d'un même process partagent son sort, puisqu'ils partagent sa mémoire. C'est cette propriété qui explique à la fois la puissance et les risques de l’utilisation des threads, et c'est le contexte dans lequel les coroutines vont mettre de l'ordre.

Concrètement, une coroutine est une fonction qui sait s'interrompre en cours de route puis reprendre plus tard, exactement là où elle s'était arrêtée. Un thread réserve une pile complète pour tenir cet état. Une coroutine garde seulement un petit objet sur le tas, avec son point de reprise et ses variables locales. C'est ce qui permet d'en empiler des milliers sur un seul thread. Le reste de l'article détaille les conséquences de cette différence.

## Pourquoi les threads coûtent cher

Un thread de la JVM c'est un thread du système d'exploitation : il est solide, mais lourd. Chacun réserve sa propre pile mémoire, en général autour de 1 Mo par défaut sur une JVM 64 bits (réglable via `-Xss`). Et c'est l'OS qui les gère.

Concrètement ça veut dire deux choses. D'abord, on ne peut pas en créer des centaines de milliers : la mémoire explose avant. Ensuite, un thread **bloqué** (sur un traitement synchrone lourd, un `Thread.sleep`, une requête réseau, un accès disque) reste un thread mobilisé qui ne fait rien, tout en occupant sa mémoire.

Il y a un troisième coût, moins visible : le changement de contexte. Quand l'OS bascule d'un thread à l'autre, il passe en mode noyau pour sauvegarder les registres du thread sortant et recharger ceux du suivant. Au passage, les caches CPU et le [TLB](https://fr.wikipedia.org/wiki/Translation_lookaside_buffer) se retrouvent remplis de données qui ne servent plus. Chaque bascule coûte de l'ordre de la microseconde. Sur un pool surdimensionné, le CPU finit par passer plus de temps à jongler entre les threads qu'à faire avancer le travail.

![Diagramme comparatif "Thread OS vs Coroutine : ce que porte une unité de travail". Colonne gauche (bleue) : Thread OS géré par le scheduler du noyau, contenant pile d'exécution (~1 Mo réservé par thread), structures noyau (descripteur de tâche), TLS/errno/masque de signaux, entrée dans la table du scheduler. Empreinte ~1 Mo, changement de contexte ~1 µs en mode noyau. Colonne droite (verte) : Coroutine gérée par le dispatcher dans la JVM, contenant objet Continuation (reprend l'exécution) et variables locales capturées. Pas de réserve de pile, l'OS ignore son existence. Empreinte quelques centaines d'octets, changement de contexte ~10 ns par retour de fonction. Note en bas : schéma non proportionnel, rapport réel d'empreinte de l'ordre de 1 pour 10 000.](./assets/img3.webp)

## Concurrence et parallélisme

Deuxième point à aborder : la confusion entre concurrence et parallélisme.

La **concurrence**, c'est gérer plusieurs tâches en cours au même moment, sans forcément les faire avancer au même instant. Le **parallélisme**, c'est exécuter plusieurs tâches littéralement en même temps, sur des unités de calcul distinctes. Rob Pike résume la nuance en une formule connue : la concurrence consiste à s'occuper de plusieurs choses à la fois, le parallélisme à en exécuter plusieurs à la fois.

Le parallélisme dépend du matériel. Il vous faut plusieurs cœurs, sinon il n'existe pas. La concurrence est un modèle d'organisation du code qui tient même sur un seul cœur.

Une coroutine est concurrente par nature. Lancer mille coroutines avec `launch` ne les fait pas tourner en même temps, ça déclare mille tâches qui vont s'entrelacer sur les threads disponibles. Le parallélisme arrive seulement si le dispatcher les répartit sur plusieurs threads, ce que fait `Dispatchers.Default` avec un pool dimensionné sur le nombre de cœurs. Sur un dispatcher mono-thread, vous avez de la concurrence sans une once de parallélisme.

C'est exactement l'illusion que le scheduler de l'OS entretient déjà avec les threads, reproduite un étage plus haut par le dispatcher.

## Suspendre, puis reprendre

Une coroutine part d'une autre idée. Plutôt que de bloquer un thread en attendant, elle sait se **suspendre** à un point précis, libérer le thread pour qu'il fasse autre chose, puis **reprendre** plus tard là où elle s'était arrêtée.

La différence tient dans deux fonctions qui se ressemblent mais n'ont rien à voir :

```kotlin
// Bloque le thread pendant 1 seconde : il ne peut rien faire d'autre
Thread.sleep(1000)

// Suspend la coroutine pendant 1 seconde : le thread est libre entre-temps
delay(1000)
```

`Thread.sleep` immobilise un thread OS. `delay` ne bloque personne : il note « reviens dans une seconde » et rend la main. Pendant cette seconde, le même thread peut faire avancer des milliers d'autres coroutines.

![Diagramme "Bloquer des threads vs suspendre des coroutines". Partie haute (bleue) : Thread.sleep avec deux tâches sur deux threads distincts. Thread 1 exécute print("start 1"), puis sleep(1000) le mobilise, avant print("fin 1"). Thread 2 exécute print("start 2"), sleep(600) le mobilise, avant print("fin 2"). Deux piles réservées pour deux attentes ; aucun thread ne peut servir à autre chose entre-temps. Partie basse (verte) : delay avec les mêmes deux tâches sur un seul thread qui ne s'arrête jamais. Timeline montrant launch{1} et launch{2}, puis Coroutine 1 suspendue via delay(1000), Coroutine 2 suspendue via delay(600), suspension libérant le thread (qui fait avancer d'autres coroutines), puis reprise de fin 2 et fin 1. Une seule pile pour les deux attentes. Coroutine 2 reprend avant Coroutine 1, chacune à la fin de son propre delay.](./assets/img4.webp)

Cette différence de comportement vient du modèle d'ordonnancement.

L'OS **préempte** : il interrompt un thread quand il le décide, par tranches de temps, sans lui demander son avis. Le code n'a aucun contrôle sur le moment de la bascule, ni même conscience qu'elle a eu lieu. C'est robuste, puisqu'un thread parti en boucle infinie n'empêche pas les autres d'avancer.

Une coroutine **coopère**. Elle garde son thread tant qu'elle a du travail à faire, et elle rend la main uniquement à un point de suspension, donc à l'appel d'une fonction `suspend`. Entre deux points de suspension, personne ne l'interrompt.

Ce modèle explique pourquoi les coroutines sont taillées pour l'i/o. Un appel réseau ou une lecture disque passe l'essentiel de son temps à attendre une réponse, sans consommer de CPU. La coroutine se suspend pendant cette attente et rend son thread aux autres. Vous récupérez le temps mort au lieu de le payer en piles immobilisées.

L'envers du décor est tout aussi utile à connaître. Un calcul long sans point de suspension ne rend jamais la main, monopolise son thread et bloque les autres coroutines du même dispatcher. Pour ce genre de travail, on bascule explicitement sur `Dispatchers.Default`, ou on insère un `yield()` pour créer un point de coopération. On y revient avec les dispatchers dans l'épisode 2.

C'est ça, le modèle mental à comprendre : une coroutine est une **unité de travail suspendable**, pas un thread. Plusieurs milliers de coroutines peuvent tourner sur une poignée de threads.

## `suspend` vu de l'extérieur

Le mot-clé qui rend tout ça possible, c'est `suspend`. Une fonction marquée `suspend` est une fonction qui peut se mettre en pause sans bloquer son thread.

```kotlin
suspend fun loadUser(id: Long): User {
    
val profile = api.getProfile(id)    
// appel réseau, potentiellement suspendu
    val rights = api.getRights(id)      // idem
    return User(profile, rights)
}
```

Ce code se lit comme du code séquentiel classique, de haut en bas. Pas de callback, pas de `.then()`, pas de `Future` à composer à la main. Pourtant, aux points d'appel réseau, la fonction peut se suspendre et libérer le thread.

Une seule règle à retenir pour l'instant : une fonction `suspend` ne s'appelle que depuis une autre fonction `suspend` ou depuis un coroutine builder.

Cette règle a un effet de bord pratique. La capacité à se suspendre remonte dans les signatures, et reste donc lisible dans le code. À l'appel, rien ne distingue visuellement `api.getProfile(id)` d'un appel classique, mais IntelliJ marque chaque point de suspension d'une icône dans la gouttière, et la définition de la fonction appelée porte le mot-clé.

## Premiers pas concrets

Pour lancer une coroutine, il faut un [builder](https://kotlinlang.org/docs/coroutines-basics.html#coroutine-builder-functions). Le plus simple pour démarrer, c'est `launch` à l'intérieur d'un `runBlocking` :

```kotlin
fun main() = runBlocking {
    launch {
        delay(1000)
        println("World")
    }
    println("Hello")
}
// Affiche "Hello" tout de suite, puis "World" une seconde plus tard
```

`launch` démarre une coroutine et n'attend pas qu'elle finisse (fire-and-forget). Le `println("Hello")` s'exécute donc avant le `"World"` suspendu. On reviendra en détail sur les builders (`launch`, `async`, `runBlocking`) dans l'épisode 2.

## Le poids de la syntaxe : Java vs Kotlin

Reprenons le `loadUser` d'avant. En Java, pour enchaîner ces appels sans bloquer le thread, on sort `CompletableFuture` :

```java
// Java : non-bloquant, mais la logique se dilue dans les callbacks
CompletableFuture<User> loadUser(long id) {
    return api.getProfileAsync(id)
        .thenCompose(profile ->
            api.getRightsAsync(id)
                .thenApply(rights -> new User(profile, rights)));
}
```

Ça fonctionne, mais la logique métier (construire un `Utilisateur` à partir d'un profil et de droits) se retrouve noyée dans les `thenCompose` / `thenApply`. Ajoutez la gestion d'erreur (`exceptionally`), un timeout, une troisième dépendance, et l'escalier de callbacks s'allonge vite.

La version Kotlin reste plate et séquentielle :

```kotlin
// Kotlin : non-bloquant aussi, mais ça se lit comme du code normal
suspend fun loadUser(id: Long): User {

    val profile = api.getProfile(id)
    val rights = api.getRights(id)

    return User(profile, rights)
}
```

Même comportement non-bloquant, mais le compilateur s'occupe de la tuyauterie (on verra exactement laquelle dans l'épisode 5). C'est ce qu'on résume souvent par “écrire de l'asynchrone comme du synchrone”.

Et pour lancer plusieurs tâches en parallèle ? En Java, on passe par un `ExecutorService` :

```java
// Java : soumettre, garder les Future, join à la main, fermer l'executor
ExecutorService executor = Executors.newFixedThreadPool(8);
List<Future<Outcome>> futures = new ArrayList<>();
for (Task t : tasks) {
    futures.add(executor.submit(() -> process(t)));
}
List<Outcome> results = new ArrayList<>();
for (Future<Outcome> f : futures) {
    results.add(f.get());   // bloque, et peut lever ExecutionException
}
executor.shutdown();
```

C'est très exactement le style qui traînait dans mon batch : des `Future` qu'on collecte, qu'on join, un executor qu'il faut penser à fermer. Et surtout, rien ne relie ces tâches entre elles. Si l'une échoue, les autres continuent dans leur coin, et l'état à moitié écrit reste en mémoire.

En Kotlin :

```kotlin
// Kotlin : les enfants sont liés au scope, attendus et annulés ensemble
suspend fun processAll(tasks: List<Task>): List<Outcome> = coroutineScope {
    tasks.map { t -> async { process(t) } }.awaitAll()
}
```

Pas d'executor à fermer, pas de liste de `Future` à gérer à la main. Le `coroutineScope` attend tous ses enfants, et si l'un plante, il annule les autres au lieu de les laisser tourner. C'est un premier aperçu de la structured concurrency, le sujet de l'épisode 2.

## L'exemple qui frappe

La [documentation officielle de Kotlin](https://kotlinlang.org/docs/coroutines-basics.html) propose une démonstration qui vaut tous les discours. On lance **50 000 coroutines**, chacune attend cinq secondes puis affiche un point :

```kotlin
suspend fun main() = coroutineScope {
    repeat(50_000) {
        launch {
            delay(5.seconds)
            print(".")
        }
    }
}
```

Ça tourne sans problème. La même chose avec 50 000 threads (`repeat(50_000) { thread { Thread.sleep(5000) ... } }`) part en `OutOfMemoryError`, ou ralentit brutalement la création des threads.

![Scène de Star Wars dans une navette spatiale futuriste. Obi-Wan Kenobi au
centre portant l'uniforme Jedi (tunique blanche et robe marron), encadré par
deux figures de côté. Baies vitrées montrant une vue de l'espace et des
structures en arrière-plan. Texte en jaune : "200,000 units are ready, with a
million more well on the way". Meme basé sur une scène célèbre du film.](./assets/img5.webp)

Les ordres de grandeur donnés par la doc Kotlin sont parlants : pour 50 000 unités de travail, on parle d'environ **500 Mo côté coroutines contre jusqu'à 100 Go côté threads**, puisque chaque thread réclame sa propre pile mémoire. C'est le même écart que dans mon batch, à ceci près qu'ici il se voit tout de suite. Cet écart se paie tous les jours sur un backend qui sert plusieurs milliers d'utilisateurs en même temps, où chaque requête attend une base ou des services tiers. Un thread par requête sature la thread pool alors que le CPU tourne à 15%, quand une coroutine qui attend rend simplement son thread aux autres.

## Côté Java : et les virtual threads ?

La question se pose forcément : Java a fini par apporter les **virtual threads**, finalisés dans le [JDK 21](https://www.infoq.com/news/2023/09/java21-released) sorti le 19 septembre 2023 ([JEP 444](https://openjdk.org/jeps/444), après deux previews en JDK 19 et 20). Un virtual thread est justement un thread léger, stocké sur le tas plutôt qu'appuyé en permanence sur un thread OS. On peut en créer des centaines de milliers. Sur le pur “les threads coûtent trop cher”, la JVM a donc comblé son retard.

Côté syntaxe, on reste dans le monde des threads, en un peu plus léger :

```java
// Java 21 : un virtual thread par tâche. La mémoire n'est plus un souci...
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (Task t : tasks) {
        executor.submit(() -> process(t));
    }
} // le try-with-resources attend la fin de toutes les tâches
```

C'est plus léger que l'`ExecutorService` classique, mais le modèle n'a pas changé : on soumet des tâches à un executor, on récupère des `Future`, on raisonne en threads. C'est confortable pour migrer du code bloquant existant, moins pour composer des traitements les uns avec les autres.

Est ce que les coroutines sont devenues inutiles ? Non et pour deux raisons : 

- Les coroutines de Kotlin sont stables depuis la [version 1.3, en octobre 2018](https://blog.jetbrains.com/kotlin/2018/10/kotlin-1-3/), soit cinq ans avant les virtual threads. Elles ont résolu le problème bien plus tôt, au niveau du langage et du compilateur (on verra comment dans l'épisode 5), pas au niveau du runtime de la JVM.

- Ensuite, et c'est le point qui compte pour mon batch : les virtual threads règlent le **coût** des threads, pas la **structure** de la concurrence. Un virtual thread lancé dans le vide fuit tout autant. De l'état mutable partagé entre virtual threads produit exactement les mêmes race conditions. Ce que les coroutines apportent en plus, c'est la **structured concurrency** : un modèle où chaque coroutine vit dans un périmètre défini, avec un cycle de vie clair.

Côté Java, cette fonctionnalité existe aussi, mais elle prend son temps pour arriver. Introduite en preview dès le JDK 21 ([JEP 453](https://openjdk.org/jeps/453)), elle est toujours en preview en [Java 25](https://www.infoq.com/news/2025/09/java25-released), qui est pourtant la dernière LTS, sortie en septembre 2025 (cinquième preview, [JEP 505](https://openjdk.org/jeps/505)). Le chantier se poursuit vers le JDK 26 ([JEP 525](https://openjdk.org/jeps/525)) et le JDK 27 ([JEP 533](https://openjdk.org/jeps/533)), essentiellement autour de la propagation d'exceptions. Java 25 a bien finalisé une fonctionnalité voisine, les [Scoped Values](https://openjdk.org/jeps/506) (le remplaçant moderne de `ThreadLocal`, taillé pour les virtual threads et la structured concurrency), mais la structured concurrency elle-même n'est toujours pas stable. Côté Kotlin, elle l'est depuis 2018.

Les virtual threads auraient rendu mon batch plus économe en mémoire, mais ils ne l'auraient pas empêché de garder des fantômes de jobs précédents. C'est la structure qui manquait, pas la puissance.

## En un coup d'œil

|  | Threads Java classiques | Virtual threads (JDK 21) | Coroutines Kotlin |
| --- | --- | --- | --- |
| Unité de concurrence | Thread OS, lourd | Thread léger sur le tas | Unité de travail suspendable |
| Ordonnancement | préemptif, par l'OS | par la JVM, au blocage | coopératif, aux points de suspension |
| Coût mémoire unitaire | ~1 Mo de pile réservée | ~1 Ko de heap, variable | quelques centaines d'octets |
| Écrire de l'asynchrone | CompletableFuture , callbacks | code bloquant, démonté par la JVM | suspend , code séquentiel |
| Lancer en parallèle | ExecutorService  +  Future | executor virtuel +  Future | coroutineScope  +  async  /  awaitAll |
| Cycle de vie / structure | à gérer à la main | à gérer à la main | structured concurrency intégrée |
| Structured concurrency | absente | en preview depuis JDK 21 | stable depuis 2018 |
| Annulation | interruption de thread, bancale | interruption de thread | coopérative et structurée |
| Disponible depuis | Java 1.0 (1996) | septembre 2023 (JDK 21) | octobre 2018 (Kotlin 1.3) |


* Les trois totaux ne viennent pas de la même source. Les chiffres threads et coroutines sont ceux de la [doc Kotlin](https://kotlinlang.org/docs/coroutines-basics.html), donnés en ordre de grandeur large. Oracle ne publie pas d'équivalent pour les virtual threads, alors la valeur vient de [mesures indépendantes](https://medium.com/@ManideepChinthareddy/virtual-threads-vs-platform-threads-in-java-a-practical-performance-memory-analysis-ba38ec6500a1) sur des tâches à pile courte, autour de 750 octets de tas par thread. La [JEP 444](https://openjdk.org/jeps/444) précise que la pile d'un virtual thread vit sur le tas et se dimensionne à la profondeur d'appel réelle, donc une requête bloquée au fond d'une stack applicative coûte plusieurs kilo-octets. Retenez le coût par unité plutôt que le total, puisqu'un virtual thread et une coroutine se tiennent dans le même ordre de grandeur, loin devant le mégaoctet réservé par un thread OS.

## À retenir

- Une coroutine n'est pas un thread : c'est une unité de travail que l'on peut **suspendre et reprendre** sans bloquer de thread OS.

- `delay` suspend, `Thread.sleep` bloque.

- L'OS préempte les threads quand il veut. Une coroutine coopère et rend la main aux points de suspension. C'est ce qui la rend efficace sur de l'i/o et piégeuse sur du calcul pur.

- Les coroutines apportent de la concurrence. Le parallélisme dépend du dispatcher et du nombre de cœurs disponibles.

- On peut faire tourner des centaines de milliers de coroutines sur une poignée de threads, là où autant de threads feraient exploser la mémoire.

- Les virtual threads Java (JDK 21) règlent le coût des threads, mais pas l'organisation de la concurrence. Le vrai apport des coroutines, c'est la structured concurrency, que Java n'a toujours pas stabilisée, même dans la LTS 25.

Dans l'épisode 2, on attaque justement cette structure : scopes, Job, builders et dispatchers, pour ne plus jamais fuiter une coroutine (ni garder de fantômes en mémoire).

---

## Sources

- Kotlin, _Coroutines basics_ (exemple des 50 000 coroutines, comparaison mémoire) : [https://kotlinlang.org/docs/coroutines-basics.html](https://kotlinlang.org/docs/coroutines-basics.html)

- JetBrains, _Kotlin 1.3 released_ (coroutines stables, octobre 2018) : [https://blog.jetbrains.com/kotlin/2018/10/kotlin-1-3/](https://blog.jetbrains.com/kotlin/2018/10/kotlin-1-3/)

- Oracle, _Processes and Threads_ (process = mémoire isolée, thread partage la mémoire du process) : [https://docs.oracle.com/javase/tutorial/essential/concurrency/procthread.html](https://docs.oracle.com/javase/tutorial/essential/concurrency/procthread.html)

- Intel, _What Is Hyper-Threading?_ (un cœur physique = deux processeurs logiques / threads matériels) : [https://www.intel.com/content/www/us/en/gaming/resources/hyper-threading.html](https://www.intel.com/content/www/us/en/gaming/resources/hyper-threading.html)

- OpenJDK, _JEP 444: Virtual Threads_ (finalisé en JDK 21) : [https://openjdk.org/jeps/444](https://openjdk.org/jeps/444)

- Oracle, _Virtual Threads_ (guide JavaSE 21, API `Thread.ofVirtual` / `newVirtualThreadPerTaskExecutor`) : [https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)

- InfoQ, _Java 21 released_ (disponibilité générale le 19 septembre 2023) : [https://www.infoq.com/news/2023/09/java21-released](https://www.infoq.com/news/2023/09/java21-released)

- InfoQ, _Java 25 released_ (dernière LTS, septembre 2025) : [https://www.infoq.com/news/2025/09/java25-released](https://www.infoq.com/news/2025/09/java25-released)

- OpenJDK, _JEP 453: Structured Concurrency (Preview)_ (introduite en preview en JDK 21) : [https://openjdk.org/jeps/453](https://openjdk.org/jeps/453)

- OpenJDK, _JEP 505: Structured Concurrency (Fifth Preview)_ (toujours en preview en JDK 25) : [https://openjdk.org/jeps/505](https://openjdk.org/jeps/505)

- OpenJDK, _JEP 506: Scoped Values_ (finalisé en JDK 25) : [https://openjdk.org/jeps/506](https://openjdk.org/jeps/506)

- OpenJDK, _JEP 525 / JEP 533: Structured Concurrency_ (re-previews vers JDK 26 et 27) : [https://openjdk.org/jeps/525](https://openjdk.org/jeps/525) · [https://openjdk.org/jeps/533](https://openjdk.org/jeps/533)