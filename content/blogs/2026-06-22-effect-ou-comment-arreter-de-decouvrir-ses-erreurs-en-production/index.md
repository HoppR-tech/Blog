---
title: "Effect, ou comment arrêter de découvrir ses erreurs en production"
date: 2026-06-22T09:39:11.503Z
description: "À mesure que les systèmes gagnent en complexité, les approches traditionnelles montrent leurs limites. Dépendances cachées, erreurs silencieuses, tests laborieux : autant de symptômes qui ralentissent"
image: ./assets/cover-image.webp
alt: "Illustration abstraite et futuriste sur fond bleu nuit, montrant un hexagone lumineux au centre protégeant un noyau doré. Des lignes néon, nœuds géométriques et formes translucides convergent autour de la structure, évoquant une architecture logicielle modulaire, la sûreté de typage, les dépendances et les tests automatisés."
ogImage: ./assets/cover-image.webp
tags: ['typescript', 'architecture', 'craft']
published: true
authors:
  - id: 376f4462-cd38-8049-8778-fd9ed33a7ddc
    name: Alex Deneuvillers
    image: ./assets/author-alex-deneuvillers.webp
    linkedin: https://www.linkedin.com/in/alex-deneuvillers/
    x: 
reviewers:
  - id: 188f4462-cd38-80d5-b9e6-ec28a94d11e5
    name: Bastien Dufour
    image: /default-author-image.webp
    linkedin: 
    x: 
---

<!-- markdownlint-disable-file -->


À mesure que les systèmes gagnent en complexité, les approches traditionnelles montrent leurs limites. Les dépendances cachées, les erreurs silencieuses et les tests laborieux ralentissent l'évolution de nos applications.
 
[Un précédent article l'a montré](https://blog.hoppr.tech/blogs/2026-04-08-architecture-hexagonale-en-programmation-fonctionnelle-mythe-ou-ralit), l'architecture hexagonale et la programmation fonctionnelle partagent une même ambition : recentrer le métier, le protéger de la technique. Ce mariage tenait aussi bien en Gleam qu'en Java.
 
Restait une question : et en TypeScript ? Le langage est partout, mais il traîne deux angles morts tenaces.
 
Une fonction qui renvoie `Promise<Tâche>` ne dit ni qu'elle interroge une base de données, ni qu'elle peut échouer de cinq manières différentes. On le découvre en production.
 
Effect, une bibliothèque qui fait remonter les erreurs et les dépendances dans le système de types, répond précisément à ce manque. Vous en trouverez la [documentation ici](https://effect.website/docs).
 
Nous n'empilerons pas les « hello world » : nous construirons une petite **API de gestion de tâches**, fil rouge pour montrer ce qu'Effect facilite, l'architecture hexagonale et le TDD, non plus comme une discipline qu'on s'impose mais comme le chemin de moindre résistance.
 
> Les exemples ciblent **Effect 3.x** (version stable courante : `3.21`). Une v4 est en bêta, mais le code de production tourne aujourd'hui sur la 3.x. Épinglez `effect@^3`.
 
## Le problème : ce que TypeScript ne vous dit pas
 
Commençons par un service de tâches « normal », tel qu'on l'écrit tous les jours.
 
```typescript
async function completeTask(id: string): Promise<Task> {
  const task = await db.tasks.findById(id)        // dépendance cachée n°1
  if (!task) throw new Error("not found")         // erreur invisible n°1
  if (task.done) throw new Error("already done")  // erreur invisible n°2
  const completed = { ...task, done: true }
  await db.tasks.save(completed)                   // dépendance cachée n°2
  await mailer.send(/* ... */)                     // dépendance cachée n°3
  return completed
}
```
 
Vous voyez le problème ? Sans doute pas tout de suite, et c'est bien là le souci. La signature `(id: string) => Promise<Task>` est un _mensonge par omission_ :
 
- Elle **tait** que la fonction a besoin de db et de mailer. Et chacune de ces dépendances **traîne ses propres possibilités d'échec :** connexion DB perdue, SMTP injoignable, qui n'apparaissent ni dans la signature, ni même dans le corps de la fonction.
- Pire, ces dépendances sont **couplées en dur** à des implémentations concrètes (import), pas à des abstractions. C'est ce couplage qui rend les tests pénibles : mock, jest.mock, monkey-patching…
- Elle tait le fait qu'elle puisse échouer, et pourquoi. Le type de rejet d'une `Promise` est `any`. Rien ne vous oblige à traiter le cas « tâche introuvable ».
- Les `Promise` sont _eager_ : elles démarrent dès leur création. Impossible de décrire un calcul, de le réessayer ou de l'instrumenter sans relancer ses effets de bord.
Effect répond à ces trois problèmes avec un seul type.
 
## Un type, trois canaux : `Effect<A, E, R>`
 
Un `Effect` est une _description immuable et paresseuse_ d'un calcul, celui-ci pouvant être synchrone comme asynchrone. C'est un plan explicite de ce qui _peut_ se produire. Rien ne tourne tant que vous ne le confiez pas à un _runtime_ qui sera chargé de l'exécuter. Il expose trois canaux :
 
- `A` (**Success**) est la valeur produite en cas de succès ;
- `E` (**Error**) regroupe les erreurs _attendues_ et récupérables ;
- `R` (**Requirements**) liste les services dont le programme a **besoin** pour être exécuté.
```typescript
import { Effect } from "effect"
 
// Effect<Task, TaskNotFound | TaskAlreadyCompleted, TaskRepository | Notifier>
declare const completeTask: (id: string) => Effect.Effect<
  Task,                                  // A : ce qu'on obtient
  TaskNotFound | TaskAlreadyCompleted,   // E : comment ça peut échouer
  TaskRepository | Notifier              // R : ce dont on a besoin
>
```
 
Reprenons notre `completeTask`, mais cette fois en Effect. La signature dit désormais _toute la vérité_ : la valeur de retour, les deux façons d'échouer, les deux dépendances.
 
Mieux : le compilateur refusera de lancer ce programme tant que `TaskRepository` et `Notifier` ne seront pas fournis. C'est cette propriété qui rend l'hexagonal et le TDD naturels (nous y reviendrons).
 
On pourrait résumer ainsi : un `Effect` est un processus virtuel décrit de manière déclarative, que le runtime Effect peut exécuter, suspendre, reprendre, interrompre et composer avec d'autres processus.
 
### Les briques de base
 
Avant de bâtir, posons les outils. Trois suffisent pour comprendre 90 % du code Effect que vous lirez.
 
**Créer un effect.** Le choix du constructeur tient à une seule question : le calcul peut-il échouer ?
 
```typescript
import { Effect } from "effect"
 
Effect.succeed(42)                      // Effect<number, never, never>
Effect.fail(new Error("boom"))          // Effect<never, Error, never>
Effect.sync(() => console.log("hi"))    // effet de bord qui NE PEUT pas échouer
Effect.tryPromise({                      // Promise qui PEUT rejeter, avec erreur typée
  try: () => fetch(url),
  catch: (cause) => new NetworkError({ cause })
})
```
 
La règle est simple : `sync`/`promise` quand ça ne peut pas échouer, `try`/`tryPromise` quand ça peut.
 
**Composer avec `Effect.gen`.** C'est l'équivalent de `async/await`, mais qui propage aussi `E` et `R`. On `yield*` un effect pour « l'attendre » ; un échec court-circuite automatiquement la suite.
 
```typescript
const program = Effect.gen(function* () {
  const amount = yield* fetchAmount       // unwrap le succès
  const rate = yield* fetchRate
  return yield* applyDiscount(amount, rate)
})
```
 
**Nommer ses erreurs.** Fini le `throw new Error("...")` anonyme. On déclare des erreurs de domaine, chacune avec son `_tag` discriminant.
 
```typescript
import { Data } from "effect"
 
class TaskNotFound extends Data.TaggedError("TaskNotFound")<{
  readonly id: string
}> {}
 
class TaskAlreadyCompleted extends Data.TaggedError("TaskAlreadyCompleted")<{
  readonly id: string
}> {}
```
 
On les traite ensuite de façon exhaustive, le compilateur tenant le décompte de ce qu'il reste à gérer :
 
```typescript
program.pipe(
  Effect.catchTag("TaskNotFound", (e) => Effect.succeed(`Pas de tâche ${e.id}`))
)
// Après ce catchTag, "TaskNotFound" disparaît du canal E.
```
 
Impossible d'oublier un cas d'erreur : il reste inscrit dans le type tant que vous ne l'avez pas traité.
 
## L'injection de dépendances : le cœur du réacteur
 
Effect se distingue vraiment sur ce point. Le canal `R` est un _conteneur d'injection de dépendances vérifié à la compilation_, sans décorateurs, sans réflexion ni magie au runtime : rien que des types.
 
Dans l'article précédent, en Gleam, un port n'était qu'un _type de fonction_ ; en Java, une interface. En Effect, c'est un **Tag** : un identifiant unique associé à une interface.
 
```typescript
import { Context, Effect, Option } from "effect"
import { Task } from "../domain/Task.js"
 
export class TaskRepository extends Context.Tag("TaskRepository")<
  TaskRepository,
  {
    readonly findById: (id: string) => Effect.Effect<Option.Option<Task>>
    readonly save: (task: Task) => Effect.Effect<void>
  }
>() {}
```
 
Dès qu'un effet `yield*` ce tag, le service apparaît dans son canal `R`. La dépendance n'est plus cachée : elle est inscrite dans le type, exactement comme le `GetFinancialDataPort` de notre exemple Gleam était un argument explicite de la fonction.
 
### Aparté sur les Layers et le câblage
 
Un Tag décrit le _quoi_ (l'interface). Reste le _comment_, la construction concrète du service : c'est le rôle des **Layers**.
 
Un `Layer<ROut, E, RIn>` est une recette : il _produit_ `ROut`, peut échouer pendant sa construction (`E`, par exemple une connexion à la base qui rate), et a lui-même besoin de `RIn`.
 
Voici une implémentation en mémoire de notre repository :
 
```typescript
import { Layer, Effect, Ref, Option } from "effect"
 
export const InMemoryTaskRepository = Layer.effect(
  TaskRepository,
  Effect.gen(function* () {
    const ref = yield* Ref.make<ReadonlyArray<Task>>([])
    return TaskRepository.of({
      findById: (id) =>
        Ref.get(ref).pipe(
          Effect.map((ts) => Option.fromNullable(ts.find((t) => t.id === id)))
        ),
      save: (task) =>
        Ref.update(ref, (ts) => [...ts.filter((t) => t.id !== task.id), task])
    })
  })
)
```
 
Le point de bascule arrive avec `Effect.provide` : tant que `R` n'est pas `never`, le compilateur refuse de lancer le programme. Fournir un Layer fait disparaître de la signature de l'effect le `R` correspondant.
 
```typescript
const runnable = findTask("1").pipe(
  Effect.provide(InMemoryTaskRepository) // R passe de TaskRepository à never
)
Effect.runPromise(runnable) // ✅ compile et tourne
```
 
Et tout l'enchaînement des dépendances se lit directement dans les types :
 
```plain text
ConfigLive      Layer<Config, never, never>
   │
   ▼
LoggerLive      Layer<Logger, never, Config>            ← a besoin de Config
   │
   ▼
DatabaseLive    Layer<Database, never, Config | Logger> ← a besoin des deux
   │
   ▼
AppLive         Layer<Database, never, never>           ← tout est câblé ✔ lançable
```
 
En clair, vous ne pouvez pas oublier de câbler une dépendance : si vous le faites, le code ne compile pas.
 
Ni un conteneur d'injection à base de réflexion (comme NestJS avec reflect-metadata par exemple), ni un câblage manuel ne vous donnent cette garantie : les premiers échouent au runtime, le second repose sur votre seule discipline.
 
## Architecture hexagonale : une correspondance presque parfaite
 
Nous arrivons à la thèse de l'article. En architecture hexagonale, la logique métier dépend d'interfaces abstraites (les _ports_), et l'infrastructure fournit des implémentations concrètes (les _adaptateurs_).
 
Avec Effect, la correspondance est quasi un pour un.
 
| Concept hexagonal | Construction Effect |
| --- | --- |
| Port (interface dont dépend le métier) | un Tag de service |
| Adaptateur (implémentation concrète) | une Layer qui implémente ce Tag |
| Logique métier / cas d'usage | des Effect qui yield* les ports |
| Composition root (câblage) | Layer.provide / Layer.merge, à la frontière |
| Adaptateur primaire (HTTP, CLI) | handlers @effect/platform, point d'entrée |
 
La propriété clé est celle qui nous tient à cœur depuis le début : **le domaine n'importe jamais l'infrastructure.** Il ne référence que le _Tag_ du port.
 
Remplacer Postgres par une implémentation en mémoire revient à remplacer _une seule Layer_ ; rien ne change dans le domaine.
 
Concrètement, on structure le projet pour matérialiser l'hexagone :
 
```plain text
src/
├── domain/                # types purs + règles métier + erreurs de domaine
│   ├── Task.ts
│   └── errors.ts
│
├── ports/                 # les interfaces (Tags) dont dépend le domaine
│   ├── TaskRepository.ts
│   └── Notifier.ts
│
├── application/           # cas d'usage orchestrant les ports (intérieur de l'hexagone)
│   └── completeTask.ts
│
├── adapters/              # implémentations (Layers) — l'extérieur
│   ├── persistence/
│   │   ├── PgTaskRepository.ts        # adaptateur DB réel
│   │   └── InMemoryTaskRepository.ts  # adaptateur de test/dev
│   │
│   ├── notification/
│   │   ├── EmailNotifier.ts
│   │   └── NoopNotifier.ts
│   │
│   └── http/
│       └── handlers.ts
│
└── main.ts                # composition root : seul endroit où l'on choisit les adaptateurs
```
 
Le cas d'usage `completeTask` devient alors de la pure orchestration de ports : l'équivalent direct de notre `calculate_consultant_annual_packaging` en Gleam, qui recevait ses ports en argument.
 
```typescript
// application/completeTask.ts
import { Effect, Option } from "effect"
import { TaskRepository } from "../ports/TaskRepository.js"
import { Notifier } from "../ports/Notifier.js"
import { Task } from "../domain/Task.js"
import { TaskNotFound, TaskAlreadyCompleted } from "../domain/errors.js"
 
export const completeTask = (id: string) =>
  Effect.gen(function* () {
    const repo = yield* TaskRepository
    const notifier = yield* Notifier
 
    const maybe = yield* repo.findById(id)
    const task = yield* Option.match(maybe, {
      onNone: () => Effect.fail(new TaskNotFound({ id })),
      onSome: Effect.succeed
    })
 
    if (task.done) return yield* Effect.fail(new TaskAlreadyCompleted({ id }))
 
    const completed = new Task({ ...task, done: true })
    yield* repo.save(completed)
    yield* notifier.notify({ to: "owner@example.com", body: `Tâche ${id} terminée` })
    return completed
  })
 
// Type inféré :
// Effect<Task, TaskNotFound | TaskAlreadyCompleted, TaskRepository | Notifier>
```
 
Regardez le type inféré, car c'est lui qui fait foi. Le canal `R` annonce _exactement_ les deux ports ; le canal `E` annonce _exactement_ les deux erreurs métier.
 
Aucune fuite d'infrastructure dans le cas d'usage. La logique métier est explicite, pure et déterministe, et le compilateur en est le gardien.
 
## TDD : tester devient trivial (et sans framework de mock)
 
C'est la conséquence directe du système de DI, et sans doute le bénéfice le plus concret au quotidien. Pour tester un cas d'usage, on _fournit un Layer de test à la place de celui de production_.
 
On ne recourt ni à `jest.mock` ni au monkey-patching : on fournit simplement un autre adaptateur. Le compilateur garantit que ce fake respecte _exactement_ la même interface de port.
 
On installe `@effect/vitest`, qui fournit `it.effect`. Il exécute l'effect en injectant un contexte de test déterministe.
 
```typescript
// application/completeTask.test.ts
import { it, expect } from "@effect/vitest"
import { Effect, Layer } from "effect"
import { completeTask } from "./completeTask.js"
import { InMemoryTaskRepository } from "../adapters/persistence/InMemoryTaskRepository.js"
import { NoopNotifier } from "../adapters/notification/NoopNotifier.js"
import { TaskRepository } from "../ports/TaskRepository.js"
import { Task } from "../domain/Task.js"
 
const TestLayer = Layer.mergeAll(InMemoryTaskRepository, NoopNotifier)
 
it.effect("échoue avec TaskNotFound sur un id inconnu", () =>
  Effect.gen(function* () {
    const exit = yield* completeTask("nope").pipe(Effect.exit)
    expect(exit._tag).toBe("Failure")
  }).pipe(Effect.provide(TestLayer))
)
 
it.effect("complète une tâche existante et la persiste", () =>
  Effect.gen(function* () {
    const repo = yield* TaskRepository
    yield* repo.save(new Task({ id: "1", title: "écrire l'article", done: false }))
 
    const result = yield* completeTask("1")
 
    expect(result.done).toBe(true)
  }).pipe(Effect.provide(TestLayer))
)
```
 
Le cycle TDD coule de source : on écrit le test, on l'exécute en rouge avec le Layer en mémoire, on rend le cas d'usage vert.
 
Et plus tard, lorsqu'on branchera l'adaptateur Postgres, _le code de production restera identique_. Seule la Layer fournie change entre `main.ts` et le test. C'est, en une phrase, toute la promesse de l'article.
 
Cadeau bonus : comme `it.effect` injecte une horloge de test (`TestClock`), tout code dépendant du temps ou de timeouts, `Schedule`, `Effect.sleep`, peut être avancé manuellement. Vos tests temporels deviennent déterministes et instantanés, sans la moindre attente réelle.
 
## Du domaine au monde réel : HTTP et composition root
 
Reste à brancher l'extérieur. Avec `@effect/platform`, on décrit l'API de façon déclarative, et les erreurs typées du domaine deviennent naturellement des réponses HTTP.
 
```typescript
// adapters/http/handlers.ts (extrait)
import { HttpApi, HttpApiEndpoint, HttpApiGroup, HttpApiBuilder, HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { Task } from "../../domain/Task.js"
import { TaskNotFound, TaskAlreadyCompleted } from "../../domain/errors.js"
import { completeTask } from "../../application/completeTask.js"
 
const idParam = HttpApiSchema.param("id", Schema.String)
 
const tasksGroup = HttpApiGroup.make("tasks").add(
  HttpApiEndpoint.post("complete")`/tasks/${idParam}/complete`
    .addSuccess(Task)
    .addError(TaskNotFound)          // erreur typée → réponse HTTP
    .addError(TaskAlreadyCompleted)
)
 
export const api = HttpApi.make("tasksApi").add(tasksGroup)
 
export const TasksLive = HttpApiBuilder.group(api, "tasks", (handlers) =>
  handlers.handle("complete", ({ path: { id } }) => completeTask(id))
)
```
 
Tout converge dans `main.ts`, le _composition root_ : le seul fichier où l'on décide quels adaptateurs concrets utiliser.
 
```typescript
// main.ts (extrait)
const ApiLive = HttpApiBuilder.api(api).pipe(
  Layer.provide(TasksLive),
  Layer.provide(PgTaskRepository),  // ← l'adaptateur RÉEL est branché ici
  Layer.provide(EmailNotifier)      // ← devient InMemory/Noop dans les tests
)
```
 
Passer de la production aux tests, ou de Postgres à un SQLite local, revient à changer une ligne ici, jamais dans le domaine.
 
## Pour aller plus loin
 
Effect ne s'arrête pas aux erreurs et à la DI. Le même type unifié vous offre, sans bibliothèque tierce :
 
- **Schema** - validation, parsing et (dé)sérialisation réversibles, à la fois types TypeScript et validateurs au runtime ;
- **`Effect.Config`** - configuration typée et testable (`Config.redacted` masque les secrets), surchargeable dans les tests ;
- **`Scope` / `acquireRelease`** - gestion de ressources avec libération garantie, même en cas d'échec ou d'interruption ;
- **Concurrence structurée** - `Effect.all(effects, { concurrency: 2 })`, fibers, nettoyage automatique ;
- **`Schedule` / `Effect.retry`** - système de retry composables (backoff exponentiel, intervalle fixe) ;
- **Observabilité** - logs structurés, métriques et traces (`Effect.withSpan`, OpenTelemetry) comme services par défaut.
## Conclusion
 
Nous l'avions établi pour Gleam et Java : ce n'est pas le paradigme qui fait l'architecture, c'est la place qu'on donne au métier. Effect prolonge ce constat jusqu'en TypeScript, et y ajoute quelque chose de précieux : le compilateur cesse d'être un correcteur orthographique pour devenir le gardien de votre architecture.
 
- Les erreurs et les dépendances deviennent _visibles_ dans la signature `Effect<A, E, R>`, rien ne peut être oublié.
- Un port est un Tag, un adaptateur un Layer : l'architecture hexagonale tombe naturellement.
- On teste en fournissant une Layer en mémoire, sans le moindre framework de mock, avec un code de production strictement identique.
Écrire du TypeScript avec des `Promise` ne vous condamne donc pas aux dépendances cachées ni aux erreurs silencieuses.
 
Avec Effect, le métier reste au centre, et l'hexagonal comme le TDD cessent d'être une discipline pour devenir la voie de moindre effort. Le revers de la médaille, c'est qu'Effect ne reste pas à la frontière : il devra être présent dans toutes les couches de l'hexagone, y compris le domaine, qui importe Effect et n'est plus fait de fonctions « pures » au sens strict. La direction des dépendances hexagonale tient (le cœur ne connaît que des ports), mais l'engagement est total : retirer Effect, c'est tout réécrire.
 
Notre conseil pour commencer : installez `effect@^3` et `@effect/vitest`, parcourez la [documentation officielle](https://effect.website/docs), puis réécrivez _une seule_ fonction de votre codebase en `Effect.gen`. Faites remonter ses erreurs et ses dépendances dans le type, et observez ce que votre compilateur avait à vous dire depuis le début.
 
Reste une question légitime : à force de repousser les limites de TypeScript jusqu'à en faire, via les fonctions génératrices, un système d'effets à part entière, on finit par écrire des fichiers .ts qui ne ressemblent plus tout à fait à du TypeScript. À partir de quand vaudrait-il mieux changer de langage ?
 
Si je devais donner une première approche, ce serait presque jamais. On ne choisit pas toujours son runtime, ni son écosystème, ni son équipe, et Effect amène justement le système d'effects là où l'on travaille déjà, sans quitter npm ni tsc. Mais si vous démarrez de zéro, libre de tout, et sans TypeScript comme prérequis, la question mérite d'être posée.

