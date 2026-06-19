---
title: "Le vert ne suffit pas : 3 façons de douter de son code"
date: 2026-06-19T08:07:56.401Z
description: "Retour de DevLille 2026, côté Java/Kotlin/Springboot.  BUILD SUCCESS. Coverage à 98 %. Toute la suite de tests au vert. On connaît tous ce petit shot de dopamine du pipeline tout propre. Et on connaît"
image: ./assets/cover-image.webp
alt: "Illustration de couverture pour l'article \"Le vert ne suffit pas\". Au centre, un grand badge vert fissuré affichant \"ALL TESTS GREEN : Coverage 98%\" avec une coche, entouré de flammes et de fumée : symbolisant une fausse confiance. 
Trois personnages cartoon l'entourent : à gauche, un petit monstre vert avec des cornes tenant un drapeau \"SURVIVED\" : représentant les mutants survivants du mutation testing ; au centre-bas, un petit robot bleu avec un point d'interrogation tenant un badge \"✅ COMPILES\" et l'air perplexe : représentant les limites de l'analyse statique ; à droite, un singe malicieux tirant des fils : représentant le Chaos Monkey et le chaos engineering. En bas, le titre en gras : \"Le vert ne suffit pas\". Fond bleu clair."
ogImage: ./assets/cover-image.webp
tags: ['craft', 'test', 'testing', 'java', 'rex', 'kotlin', 'événement', '2026', 'veille tech']
published: true
authors:
  - id: 33bf4462-cd38-80da-845c-c63b2fd024bf
    name: Florian Hirson
    image: ./assets/author-florian-hirson.webp
    linkedin: https://www.linkedin.com/in/florian-hirson/
    x: 
reviewers:
  - id: 67adfd77-4b84-4496-b55d-3391541f59c5
    name: Michaël Bernasinski
    image: ./assets/reviewer-michael-bernasinski.webp
    linkedin: https://www.linkedin.com/in/michael-bernasinski
    x: 
    bio: "Principal Lead - Software Engineer - HoppR Lyon"
  - id: 02c620f8-3576-4943-b5cf-6117f99220a2
    name: Edouard Cattez
    image: ./assets/reviewer-edouard-cattez.webp
    linkedin: https://www.linkedin.com/in/edouard-cattez-865794133/
    x: https://x.com/ecattez
  - id: 37bf4462-cd38-8041-92af-c7e51809adcc
    name: Clement Godet
    image: ./assets/reviewer-clement-godet.webp
    linkedin: https://www.linkedin.com/in/cgodet59/
    x: 
---

<!-- markdownlint-disable-file -->


_Retour de DevLille 2026, côté Java/Kotlin/Springboot._

BUILD SUCCESS. Coverage à 98 %. Toute la suite de tests au vert. On connaît tous ce petit shot de dopamine du pipeline tout propre. Et on connaît aussi le bug qui passe en prod le lendemain, l'air de rien.

À DevLille 2026, trois talks m'ont posé la même question dérangeante, chacun sous un angle différent : **et si tout ce vert nous mentait ?** Mon coverage **qui me rassure à tort**, mon compilateur qui me laisse passer des erreurs qu'il aurait pu voir, mon appli qui fonctionne bien… tant que l'infra ne tremble pas.

Je travaille aujourd'hui avec Kotlin / Springboot / Kotest, et la plupart de ces talks étaient présentés côté Java. Le but de cet article, c'est donc autant un récap qu'un REX : qu'est-ce que ces idées donnent une fois ramenées dans une stack Kotlin ? Spoiler : parfois le langage fait le boulot à notre place, parfois pas du tout.

---

## 1. « Mes tests passent », mais testent-ils vraiment quelque chose ?

On a toutes et tous appris à regarder le **code coverage**. Le piège, c'est ce qu'il mesure vraiment : le _line coverage_ dit quelles lignes ont été **exécutées**, le _branch coverage_ quels chemins logiques ont été empruntés. Aucun des deux ne dit si tes tests **vérifient** réellement quelque chose.

La démonstration est cruelle. Prends ce bout de code et son test :

```kotlin
fun applyDiscount(price: Double, rate: Double): Double =
    price - (price * rate)

class DiscountTest : FunSpec({
    test("applique une remise") {
        applyDiscount(100.0, 0.2) shouldBeGreaterThan 0.0
    }
})
```

Coverage : 100 %. Tout est vert. Sauf que cette assertion ne teste presque rien : remplace le `-` par un `+` dans la fonction, et `120.0 > 0.0` reste vrai. Le test ne le verra jamais.

C'était tout le sujet du talk de [**Victoire de Lacharrière**](https://www.linkedin.com/in/victoire-ladreit-de-lacharri%C3%A8re/), « Testez vos tests avant qu'ils ne vous trahissent », et de la technique qu'elle y présentait : le **mutation testing**. L'outil introduit volontairement des bugs, les _mutants_ (inverser un opérateur, remplacer une condition, supprimer un appel), puis relance ta suite. Si un test échoue, le mutant est **tué**. S'il survit, c'est qu'aucun de tes tests ne couvrait vraiment ce comportement.



La métrique qui en sort, le **mutation score** (`mutants tués / total des mutants`), est bien plus honnête qu'un pourcentage de lignes. Le talk insistait aussi sur la **test strength**, une variante qui ignore le code non couvert pour ne juger que la qualité des tests existants.

Un mutant survivant n'est pas toujours un oubli de test : c'est parfois le symptôme d'un test écrit sans avoir vu le rouge, ce que le [TDD](/p/19ff4462cd388034b74eecb49e31630d) aurait évité dès le départ.

Côté outillage, chaque écosystème a le sien : [**pitest**](https://pitest.org/) sur la JVM, [Stryker](https://stryker-mutator.io/) en JS/.NET, [mutpy](https://github.com/mutpy/mutpy) en Python. Et c'est là que mon approche sur Kotlin commence : pitest tourne sur le **bytecode**, donc il s'applique à du Kotlin et à mes tests Kotest sans rien changer. Avec une nuance à connaître : le compilateur Kotlin génère pas mal de code synthétique (_null-checks_, branches de `when`, valeurs par défaut) qui produit des **mutants équivalents** : des mutations qui ne changent rien d'observable, que tes tests ne peuvent donc pas tuer. Sur un projet Kotlin, ce bruit n'est pas anecdotique, et c'est là que le choix de l'outillage se complique.

Le plugin historique [`pitest-kotlin`](https://github.com/pitest/pitest-kotlin), gratuit et open source, n'est plus maintenu : son dépôt est archivé et renvoie explicitement vers l'offre commerciale d'**arcmutate**. Le plugin Kotlin d'arcmutate ([`com.arcmutate:pitest-kotlin-plugin`](https://docs.arcmutate.com/docs/kotlin.html)) va bien plus loin : il comprend les fonctions [`inline`](https://kotlinlang.org/docs/inline-functions.html) (le compilateur copie leur corps à chaque appel, ce qui multiplie les mutants sans support spécifique), les coroutines, le destructuring, `lateinit`, les branches non couvertes des `sealed class` et des enums.

Sans ce support, pitest génèrerait un mutant par copie inlinée plutôt que sur la définition d'origine : explosant inutilement le nombre de mutants à analyser. En clair, il filtre le bruit propre à Kotlin que pitest seul ne sait pas distinguer du vrai code métier.

Le revers, c'est le modèle : arcmutate est un produit commercial, facturé au nombre de personnes ayant accès au repo. À noter quand même, c'est **gratuit pour les projets open source** et une licence d'évaluation s'obtient par mail. Pour des projets pro, ça veut dire arbitrer entre une licence payante et le mutation testing en Java « pur » sur les modules qui s'y prêtent. C'est typiquement le genre de coût caché qu'on n'anticipe pas quand on choisit Kotlin pour un projet.

Une bonne assertion suffit à corriger l'exemple :

```kotlin
applyDiscount(100.0, 0.2) shouldBe 80.0
```

Et là, le mutant `+` meurt instantanément.

### Le prix à payer

Soyons honnêtes sur ce que ça coûte. Chaque mutant exige de relancer une partie de la suite de tests, et un projet de taille moyenne en génère vite des centaines : le temps d'exécution explose par rapport à un simple run de tests. Première parade, faire le tri. Limiter le scope aux packages critiques, choisir un groupe de mutateurs pertinent plutôt que de tout activer (plus de mutateurs, c'est une analyse plus fine mais un temps d'exécution qui s'envole), et exploiter l'analyse incrémentale de pitest pour ne muter que le code qui a changé.

Deuxième parade, la parallélisation. Mais elle ne fait que déplacer le problème vers la CI : dans le cloud, c'est la facture qui grimpe ; en self-hosted, ce sont les runners qui saturent. 

En pratique, le mutation testing se prête mieux à un job nightly ou hebdomadaire qu'à un déclenchement à chaque PR.

### Le mutation testing est-il la seule réponse ?

C'est la question que je me pose depuis le talk : existe-t-il d'autres moyens de vérifier que les tests vérifient vraiment quelque chose ?

La version artisanale existe depuis toujours : c'est la discipline du _red_ en [TDD](https://hoppr-tech.notion.site/Formation-TDD-HoppR-19ff4462cd388034b74eecb49e31630d). Un test qu'on a vu échouer au moins une fois a prouvé qu'il était capable de détecter quelque chose. Le mutation testing ne fait au fond qu'automatiser ce « voir le test échouer », a posteriori et à grande échelle, pour tous les tests qu'on n'a pas écrits en TDD.

L'autre piste, complémentaire, c'est le **property-based testing (PBT)**. Au lieu de vérifier un exemple choisi à la main, on affirme une propriété qui doit tenir sur des centaines d'entrées générées automatiquement. [Kotest](https://kotest.io/docs/proptest/property-based-testing.html) le supporte nativement :

```kotlin
test("la remise diminue toujours le prix") {
    checkAll(Arb.double(1.0..10_000.0), Arb.double(0.01..0.9)) { price, rate ->
        applyDiscount(price, rate) shouldBeLessThan price
    }
}
```

Ce test tue le mutant `+` lui aussi, mais il explore en prime tout un espace d'entrées auquel je n'aurais pas pensé. Les deux approches ne répondent pas à la même question : **le mutation testing évalue la qualité des tests** _**existants**_**, le property-based testing rend les tests plus difficiles à tromper** _**dès l'écriture**_**.** Rien n'empêche de combiner : écrire des propriétés là où le domaine s'y prête, et laisser le mutation testing juger le reste.

Petit détour par l'écosystème, parce que le support du PBT n'est pas uniforme sur la JVM. Côté Java, il n'y a rien dans le langage ni dans JUnit : il faut une lib dédiée, et la référence est [**jqwik**](https://jqwik.net/), qui s'intègre comme moteur de test sur la plateforme JUnit 5. On y déclare une propriété avec `@Property` au lieu de `@Test` :

```java
@Property
void laRemiseDiminueLePrix(@ForAll @DoubleRange(min = 1) double price,
                           @ForAll @DoubleRange(min = 0.01, max = 0.9) double rate) {
    assertThat(applyDiscount(price, rate)).isLessThan(price);
}
```

jqwik fonctionne aussi très bien en Kotlin, et son arsenal est plus fourni que celui de Kotest : _shrinking_ plus efficace (la réduction du contre-exemple vers le cas minimal qui fait échouer), générateurs récursifs, tests _stateful_, statistiques sur les données générées. Le revers : jqwik est aujourd'hui en mode maintenance, sans développement de nouvelles fonctionnalités faute de financement.

Le choix dépend donc surtout de ta base de tests existante. Si tu es déjà sur Kotest, son PBT intégré suffit largement pour démarrer et évite d'empiler deux moteurs de test. Si tu es sur JUnit 5 (le cas par défaut en Java, et fréquent en Kotlin aussi), jqwik s'ajoute sans friction et offre les fonctionnalités les plus avancées. Dans les deux cas, l'idée reste la même : arrêter de tester un exemple pour tester une vérité générale.

Deux autres angles, plus discrets, complètent le tableau. D'abord, l'**analyse statique du code de test** : détecter les tests sans assertion, ceux qui passent quoi qu'il arrive ou qui croulent sous les mocks, c'est juger la pertinence d'un test sans même l'exécuter (detekt a des règles pour ça, joli retour de la section précédente). Ensuite, la **chasse aux tests *flaky** : un test non déterministe est pire qu'absent, il érode la confiance dans toute la suite. Plus loin sur le même axe que le property-based testing, le fuzzing_\_ ([Jazzer](https://github.com/CodeIntelligenceTesting/jazzer) sur la JVM) explore les entrées qui maximisent la couverture pour faire tomber le code là où on ne l'attend pas.

> **Mon avis** : le mutation testing a longtemps eu une réputation de truc lent et inexploitable (des rapports de centaines de mutants survivants, bon courage pour trier). C'est précisément là qu'un LLM avec le contexte de la codebase change la donne : lui faire lire le rapport, écarter les mutants équivalents et pointer les _vrais_ trous de test transforme un outil de niche en quelque chose qu'on peut industrialiser. Le talk le mentionnait, et je suis convaincu que c'est ce qui va le démocratiser.  
>   
> Un dernier point pratique : inutile de vouloir tout corriger d'un coup. Un backlog de mutants survivants se résorbe comme n'importe quelle dette : progressivement, en faisant baisser l'entropie logicielle à chaque itération plutôt qu'en bloquant la livraison.

---

## 2. « Mon code compile », mais compiler n'est pas valider



Deuxième couche de fausse confiance : ça compile, donc c'est bon. Dans « Et si vos erreurs se faisaient attraper avant l'exécution ? », [**Remi Taniel**](https://www.linkedin.com/in/le-pinpin/) démonte l'idée avec [**Error Prone**](https://errorprone.info/), l'analyseur statique de Google pour Java. Plus de 500 _bug patterns_ détectés au moment du build, sur des erreurs que `javac` laisse tranquillement passer. Sur un projet aussi mûr que `commons-lang3`, la démo sortait une centaine de warnings et quelques erreurs critiques. Même les gros projets en ont.

L'écosystème qui gravite autour est costaud : [**NullAway**](https://github.com/uber/NullAway) (par Uber) pour traquer les NPE au build, [**Refaster**](https://errorprone.info/docs/refaster) pour écrire ses propres règles de refactoring sous forme de templates `@BeforeTemplate` / `@AfterTemplate`, et le [**Picnic Error Prone Support**](https://github.com/PicnicSupermarket/error-prone-support) de la communauté qui ajoute des dizaines de règles. Le mantra du talk résume tout : _« outillez le compilateur, pas que le dev »_, et son corollaire très 2026 : _« l'IA génère le code, l'analyse statique le vérifie. »_

Et c'est ici que ça devient intéressant pour moi : **Error Prone et NullAway sont des outils pensés pour Java.** Concrètement, ce sont des plugins de `javac` qui analysent le code source au moment de la compilation. Kotlin ayant son propre compilateur, ils ne voient jamais mon code Kotlin (contrairement à pitest qui, lui, travaille sur le bytecode et reste donc agnostique du langage). Alors, qu'est-ce que je récupère vraiment de ce talk dans ma stack ?

**D'abord, une partie du problème disparaît dans le langage.** NullAway existe parce que le `null` est un trou noir en Java. En Kotlin, [la nullabilité est dans le système de types](https://kotlinlang.org/docs/null-safety.html), et le compilateur refuse tout simplement de compiler le code dangereux :

```kotlin
val user: User? = repository.findByName("flo")

// Ne compile pas : user peut être null
val length = user.name.length

// Le compilateur t'oblige à traiter le cas
val length = user?.name?.length ?: 0
```

Ce que NullAway rattrape _a posteriori_ par analyse statique, Kotlin l'interdit _a priori_. Tout un pan d'Error Prone devient sans objet, non pas parce que le problème est moins grave, mais parce que le langage l'a absorbé.

**Ensuite, ce qui reste, c'est detekt.** Parce que tout Error Prone ne se résume pas à la null-safety : il y a les bugs subtils (comparaisons douteuses, ressources non fermées) et surtout l'application des **conventions d'équipe**. Ça, le langage ne le fait pas pour toi. En Kotlin, l'outil c'est [**detekt**](https://detekt.dev/), qui s'active et se configure dans le même esprit d'adoption progressive prônée par le talk :

```yaml
# detekt.yml
potential-bugs:
  active: true
  UnsafeCallOnNullableType:
    active: true
  CastToNullableType:
    active: true

style:
  ReturnCount:
    active: true
    max: 2
```

Ce qui rend detekt facile à adopter, c'est qu'il s'intègre dans à peu près n'importe quel projet : un plugin Gradle, Maven ou Bazel, et il tourne aussi bien sur de l'Android, du JVM pur, du Kotlin/JS, du natif ou du multiplateforme. Mais le détail qui fait vraiment écho au talk sur Error Prone, c'est le [**baseline**](https://detekt.dev/docs/introduction/baseline/). Sur une codebase existante, brancher un analyseur d'un coup, c'est des centaines de warnings et une CI rouge dès le premier jour. Le fichier baseline de detekt fige les problèmes connus dans un instantané : l'outil ne casse plus la build que sur les **nouveaux** écarts, et tu résorbes la dette à ton rythme. C'est exactement l'adoption progressive que prônait le talk (erreurs seulement, on désactive les warnings, on corrige le critique, on configure les exceptions), sauf qu'ici elle est offerte par l'outil.

Deux autres atouts au quotidien. detekt embarque un plugin **formatting** (qui s'appuie sur ktlint) capable de corriger automatiquement une bonne partie des écarts de style, donc moins de bikeshedding en review. Et il exporte ses rapports en HTML, XML, Markdown ou **SARIF**, ce dernier format étant directement digéré par GitHub pour afficher les findings dans l'onglet Security et en annotation de PR. Détail qui n'en est pas un, après la section précédente : contrairement à arcmutate, detekt est **entièrement open source et porté par la communauté**. Aucune licence à arbitrer.

Et là où Error Prone a Refaster pour coder ses propres règles, detekt permet d'écrire des **custom rules**, l'équivalent direct, pour faire respecter une guideline maison au build plutôt qu'en review :

```kotlin
class NoPrintlnRule(config: Config) : Rule(config) {
    override val issue = Issue(
        "NoPrintln",
        Severity.Style,
        "Utilise un logger, pas println.",
        Debt.FIVE_MINS
    )

    override fun visitCallExpression(expression: KtCallExpression) {
        super.visitCallExpression(expression)
        if (expression.calleeExpression?.text == "println") {
            report(CodeSmell(issue, Entity.from(expression), issue.description))
        }
    }
}
```

Une limite à connaître pour que la comparaison reste honnête : par défaut, detekt analyse l'arbre syntaxique sans résolution de types. Les règles les plus puissantes, celles qui ont besoin de savoir _ce qu'est_ une expression et pas seulement comment elle s'écrit, demandent d'activer le mode _type resolution_, plus lourd à mettre en place. Error Prone, lui, vit dans le compilateur et profite de tout le contexte de compilation. Kotlin absorbe donc la null-safety dans le langage, mais perd un peu en finesse d'analyse statique au passage. Le trade-off me semble largement gagnant, mais il existe.

> **Mon avis** : la leçon du talk survit au changement de langage, le compilateur seul ne suffit pas, il faut l'outiller. Mais le détour par Kotlin révèle une hiérarchie des garanties : **un bug rendu impossible par le langage vaut mieux qu'un bug détecté par un outil, qui vaut lui-même mieux qu'un bug attrapé en code review.** Plus la garantie descend vers le langage, moins elle dépend de la discipline humaine. La null-safety native de Kotlin, c'est NullAway rendu inutile. Le vrai job de detekt, du coup, ce n'est pas de rejouer Error Prone : c'est de verrouiller l'étage que le langage ne capturera jamais, les conventions d'équipe.

---

## 3. « Ça marche en local », mais ça tient sous la panne ?

Dernière illusion, la plus humble : ça tourne sur ma machine, ça tourne en recette, donc ça tournera. Dans « Déchaînez le Chaos : tester la résilience de votre application avec Chaos Monkey », [**Erwan Le Tutour**](https://www.linkedin.com/in/erwan-le-tutour/) part du principe inverse : la panne n'est pas un accident, c'est une condition d'exploitation. Autant la provoquer soi-même, à froid, plutôt que de la découvrir un vendredi soir.

L'histoire vient de Netflix et de son **Chaos Monkey** (open source depuis 2012), décliné en une vraie [_Simian Army_](https://netflixtechblog.com/the-netflix-simian-army-16e57fbab116) : Chaos Kong, Conformity Monkey, Security Monkey… Et le talk rappelait qu'en France, la SNCF passe **un mois de chaos engineering** avant chaque grosse mise en prod. Le chaos comme quotidien, littéralement.



La bonne nouvelle pour ma stack : [**Chaos Monkey for Spring Boot**](https://codecentric.github.io/chaos-monkey-spring-boot/latest/) (par Codecentric) rend ça quasi gratuit. Une dépendance, des _watchers_ qui s'injectent sur tes `@Service`, `@Repository`, `@RestController` sans toucher au code métier, et des _assauts_ configurables : latence, exceptions, pression mémoire.

```kotlin
// build.gradle.kts
dependencies {
    implementation("de.codecentric:chaos-monkey-spring-boot:4.0.0")
}
```

```yaml
# application-chaos.yml
chaos:
  monkey:
    watcher:
      service: true
      repository: true
    assaults:
      level: 5            # 1 requête sur 5 est attaquée
      latency-active: true
      latency-range-start: 1000
      latency-range-end: 3000
      exceptions-active: true
```

On active le profil `chaos` en recette, et on regarde l'appli se faire maltraiter. Le confort, c'est que tout se pilote à chaud : les assauts s'activent, se désactivent et se règlent via les endpoints [Actuator](https://docs.spring.io/spring-boot/how-to/actuator.html), sans redéployer. On peut viser précisément un composant, doser le niveau de déterminisme (toutes les requêtes ou une sur cinq) et choisir le type d'attaque (latence, exceptions, pression mémoire). De quoi mener une expérience ciblée plutôt que de tout casser en même temps.

L'autre moitié de l'équation, c'est la **résilience** : [**Resilience4j**](https://resilience4j.readme.io/), la librairie Java de référence pour poser des garde-fous là où le chaos a révélé des fragilités. Elle s'utilise aussi bien en Java qu'en Kotlin, via les mêmes annotations Spring.

```kotlin
@CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
@Retry(name = "paymentService")
fun callPayment(order: Order): PaymentResult =
    paymentClient.charge(order)

fun paymentFallback(order: Order, ex: Throwable): PaymentResult =
    PaymentResult.deferred(order)
```

Le circuit breaker et le retry ne sont que la partie émergée : Resilience4j fournit aussi le **bulkhead** (cloisonner les ressources pour qu'une dépendance lente n'asphyxie pas tout le reste), le **rate limiter** et le **time limiter**. Autant de garde-fous que le chaos sert justement à révéler nécessaires : il trouve les points de rupture, Resilience4j les transforme en dégradations contrôlées.

Et pour aller plus loin côté Kotlin, il existe un module dédié, [**`resilience4j-kotlin`**](https://resilience4j.readme.io/docs/getting-started-4), qui ajoute des extensions pour décorer directement des fonctions `suspend` et des `Flow`. Le circuit breaker, le retry, le rate limiter ou le time limiter s'appliquent alors à du code coroutines sans bloquer un thread : là où la version classique bloque (le temps d'attendre une fenêtre de rate limit, par exemple), l'extension _suspend_ à la place.

```kotlin
val breaker = circuitBreakerRegistry.circuitBreaker("paymentService")

suspend fun callPayment(order: Order): PaymentResult =
    breaker.executeSuspendFunction {
        paymentClient.charge(order) // suspend fun
    }
```

Deux réflexions pour pousser plus loin que le talk. D'abord, sur ce que Chaos Monkey sait vraiment simuler. Comme ses _watchers_ s'injectent dans les beans Spring, dont les `@Repository` et les clients HTTP qui font les I/O, ses assauts de latence et d'exception reproduisent très bien les _symptômes_ d'une base qui rame ou d'un appel réseau qui échoue : c'est exactement ce qu'on veut pour tester comment l'appli réagit à une dépendance lente ou KO. La limite, c'est qu'il simule l'**effet** à la frontière des beans, pas la panne réseau elle-même. Une vraie perte de paquets, un reset de connexion, une résolution DNS qui traîne, ça se passe sous l'application, là où Chaos Monkey ne voit rien. Pour ce niveau, il faut monter d'un cran : un [Toxiproxy](https://github.com/Shopify/toxiproxy) intercalé entre l'appli et ses dépendances, ou du chaos au niveau du cluster. La couche applicative reste le bon premier pas, parce que c'est celle qu'on contrôle entièrement, sans demander la permission aux ops.

Ensuite, et c'est presque un prérequis : le chaos sans observabilité, c'est juste de la casse. Si je ne peux pas voir comment l'appli encaisse (latences, taux d'erreur, état des circuit breakers), l'expérience ne m'apprend rien. Une [expérience de chaos digne de ce nom](https://principlesofchaos.org/), c'est une hypothèse (« si la base ralentit de 2 secondes, l'API répond en mode dégradé »), une mesure, et un verdict. Pas juste débrancher des trucs pour voir ce qui se passe.

> 💡 _Anaïs a également assisté à ce talk lors du DevFest Lyon 2025 et en a fait_ [_un retour sur le blog HoppR_](https://blog.hoppr.tech/blogs/2025-12-23-alors-ctait-comment-ce-premier-devfest-lyon-la-suite#pourquoi-adopter-le-chaos-engineering)_, avec un regard plus orienté business : une bonne lecture complémentaire._

> **Mon avis** : c'est la couche la plus facile à négliger parce qu'elle ne se voit pas tant que tout va bien. Or c'est aussi la seule des trois qui teste le système _complet_ (réseau, dépendances, timeouts) et pas juste mon code. Commencer petit, avec de la latence sur un service en recette, suffit déjà à apprendre beaucoup.

---

## Le vert est une hypothèse, pas une preuve

Trois talks, trois niveaux, une même idée : le vert qu'on voit dans nos outils est une **hypothèse de bon fonctionnement**, jamais une preuve. Le mutation testing met à l'épreuve les assertions, l'analyse statique met à l'épreuve le compilateur, le chaos engineering met à l'épreuve la résilience. À chaque étage, on outille le doute plutôt que de le déléguer à la prod.

Et il y a une raison de prendre ça au sérieux maintenant, plus qu'il y a deux ans : une part croissante de notre code n'est plus écrite à la main mais **générée**. Quand la production de code s'accélère, c'est la capacité à le **vérifier automatiquement** qui devient le goulot, et l'avantage compétitif. Le vert ne suffit pas ; reste à se donner les moyens d'en douter intelligemment.

---

## Pour aller plus loin

**Les talks DevLille 2026**

- [Testez vos tests avant qu'ils ne vous trahissent : le mutation testing !](https://devlille.fr/talk-page-722a6be6-2a65-404b-ad22-d51315b37e8b/), par Victoire Ladreit de Lacharrière

- [Et si vos erreurs se faisaient attraper avant l'exécution ?](https://devlille.fr/talk-page-0280f3e5-41d4-499c-9f43-cf7fcd34fd2c/), par Remi Taniel

- [Déchaînez le Chaos : tester la résilience de votre application avec Chaos Monkey](https://devlille.fr/talk-page-e1f48909-47e7-4a70-b5b3-b4e0e7588195/), par Erwan Le Tutour

**Tester ses tests**

- [pitest](https://pitest.org/) : mutation testing sur la JVM, et [arcmutate](https://docs.arcmutate.com/docs/kotlin.html) pour le support Kotlin

- [Kotest – property-based testing](https://kotest.io/docs/proptest/property-based-testing.html) et [jqwik](https://jqwik.net/) côté JUnit 5

- [Jazzer](https://github.com/CodeIntelligenceTesting/jazzer) : fuzzing coverage-guided sur la JVM

**Analyse statique**

- [Error Prone](https://errorprone.info/), [NullAway](https://github.com/uber/NullAway) et [Refaster](https://errorprone.info/docs/refaster) côté Java

- [detekt](https://detekt.dev/) côté Kotlin (et la [null-safety du langage](https://kotlinlang.org/docs/null-safety.html))

**Résilience & chaos**

- [Chaos Monkey for Spring Boot](https://codecentric.github.io/chaos-monkey-spring-boot/latest/), [Resilience4j](https://resilience4j.readme.io/) et [Toxiproxy](https://github.com/Shopify/toxiproxy)

- [Principles of Chaos Engineering](https://principlesofchaos.org/)

