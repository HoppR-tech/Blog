---
title: "Créer une CLI pour un projet modulaire avec Commander.js"
date: 2024-11-28T11:13:34.740Z
description: "[Dragee.io](https://github.com/dragee-io) est un nouveau projet lié à l'architecture logicielle, permettant entre autres l'analyse d'une architecture dans la vision [Craft](https://blog.hoppr.tech/tag"
image: ./assets/cover-image.webp
alt: "Lignes de code utilisant Commander.js pour créer une CLI, tirées du projet Dragee.io. "
ogImage: ./assets/cover-image.webp
tags: ['dragee.io', 'typescript', 'craft']
published: true
authors:
  - id: 67adfd77-4b84-4496-b55d-3391541f59c5
    name: Michaël Bernasinski
    image: ./assets/author-michal-bernasinski.webp
    linkedin: https://www.linkedin.com/in/michael-bernasinski
    x: 
reviewers:
  - id: 0bb914a6-f882-4951-bee6-53e8e8abb807
    name: Emmanuelle Gouvart
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c88f5dfa-16db-4e6f-acf1-34dd80ee8766/emma_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45FSPPWI6X%2F20241128%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241128T111334Z&X-Amz-Expires=3600&X-Amz-Signature=8f282bfcf2fd4ecfa533b2134eeb79c7a826f565a4cb85f70201b29a8c36d710&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/emmanuellegouvart-182b6ab2/
    x: 
  - id: 838dec96-f9fc-404f-a302-07719225d785
    name: Maxime Deroullers
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c69d0b59-558d-4e48-879f-bea3fec1fdef/Linkedin_Profile.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45FSPPWI6X%2F20241128%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241128T111334Z&X-Amz-Expires=3600&X-Amz-Signature=a50a181059cf3a0711079a280389ae39bec8640f5817ffa9a97725f45cabdc6a&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/maxime-deroullers-1b5791137/
    x: https://x.com/mderoullers
  - id: 02c620f8-3576-4943-b5cf-6117f99220a2
    name: Edouard Cattez
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/02dd23b5-238a-4713-ad54-432f3fa5119b/ecattez_profile.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45FSPPWI6X%2F20241128%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241128T111334Z&X-Amz-Expires=3600&X-Amz-Signature=f7807e7ba693bbf7b14b00075b95009cf0f11d76084b635b9179579417df17b7&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/edouard-cattez-865794133/
    x: https://x.com/ecattez
---

<!-- markdownlint-disable-file -->


[Dragee.io](https://github.com/dragee-io) est un nouveau projet lié à l'architecture logicielle, permettant entre autres l'analyse d'une architecture dans la vision [Craft](https://blog.hoppr.tech/tags/craft) portée par [HoppR](https://www.hoppr.tech/). Nos ambitions pour ce projet sont fortes, celui-ci se voulant une solution complète et constituée de nombreuses fonctionnalités. Nous aurons d’ailleurs d’autres occasions de vous partager son avancée.

Les fonctionnalités allant être ajoutées de manière itérative, nous avons étudié la meilleure façon de faire grandir le projet. Nous sommes donc partis sur une CLI (_Command-Line Interface_) présentant des commandes simples à l’utilisateur. Elle sera le cœur de notre solution, auquel viendront se greffer les futurs nouveaux modules.

Dans cet article, je vais vous présenter notre manière d’intégrer ces modules dans l’écosystème **Dragee.io**, en créant des commandes qui leurs sont propres, et en les ajoutant à celles déjà existantes dans la CLI centrale.

## Présentation de Commander.js

Tout d’abord, nous avons besoin d’un outil pour développer cette CLI.

Nous avons pour cela choisi le projet [Commander.js](https://github.com/tj/commander.js/tree/master), qui permet d’en créer une facilement, sur des environnements d’exécution JS/TS tels que Node.js, ou, dans le cas du projet **Dragee.io**, [Bun](https://bun.sh/).

Cela nous permet de concevoir [Dragee.io](https://github.com/dragee-io) avec une stack où nos développeurs, principalement issus du monde du web, seront à l’aise, plutôt que d’investir dans une solution non maîtrisée (par exemple Go) ou pas encore assez mature.

Un [package npm](https://www.npmjs.com/package/commander) étant disponible, nous allons ici pouvoir installer **Commander.js** en dépendance de nos projets :

```shell
bun add commander
```

**Commander.js** va nous permettre de gérer le parsing des arguments, de traiter les cas d’erreurs et d’afficher une documentation (description, aide, etc.) pour chaque commande. Cet outil contient beaucoup d’options de configuration, nous resterons ici sur une utilisation simple.

## Création d’une commande

Dans la galaxie des projets [Dragee.io](https://github.com/dragee-io), nous disposons donc d’un projet central, celui exposant cette fameuse CLI, le bien nommé [dragee-cli](https://github.com/dragee-io/dragee-cli).

Il contient de base deux commandes pour nos besoins fonctionnels : une pour générer des rapports (nommée _report_), l’autre pour générer des modélisations d’architecture (_draw_). Écrivons la première, et plaçons-là dans notre [index.ts](https://github.com/dragee-io/dragee-cli/blob/main/index.ts).

```typescript
import { Command } from 'commander';
import { reportCommandhandler } from './src/commands/report-command.handler.ts';

const report = new Command('report')
    .alias('r')
    .summary('builds asserters rules report')
    .description(
        'Builds asserters rules report.\n' +
            '- Lookups dragees in [--from-dir] directory\n' +
            '- Downloads asserters for dragees namespaces\n' +
            '- Executes rules from asserters\n' +
            '- Builds reports in [--to-dir] directory'
    )
    .option('--from, --from-dir <path-to-dir>', 'directory in where to lookup for dragees', '.')
    .option('--to --to-dir <path-to-dir>', 'directory in where to store reports', './dragee/reports')
    .action(reportCommandhandler);
```

Cette commande contient un certain nombre d’informations (description, options), et surtout l’action à réaliser, une fonction passée en paramètre, ici nommée _reportCommandhandler._

La bonne pratique est ici de l’importer d’un fichier à part. En effet, la commande est à la CLI ce que le contrôleur est à nos applications web. L’action est équivalente à un service métier, placée ailleurs et appelée par notre commande, dont seule la définition est décrite dans l’index.

Nous allons ensuite, sur le même modèle, créer la commande _draw_. Pour finaliser notre CLI, nous devons également créer la commande de plus haut niveau, incorporant ces deux commandes :

```typescript
new Command()
    .addCommand(report)
    .addCommand(draw)
    .showHelpAfterError()
    .showSuggestionAfterError()
    .parse(process.argv);
```

L’exécutable de [Dragee.io](https://github.com/dragee-io) est ensuite construit à l’aide d’une [commande native de Bun](https://bun.sh/docs/bundler/executables).

```shell
**> bun run build**
$ bun build index.ts --target bun --compile --outfile dist/dragee-cli
 [237ms]  bundle  151 modules
  [51ms] compile  dist/dragee-cli.exe
```

Et voici ce que tout cela donne, avec les options de documentation (help) sur la commande parent, puis sur la commande _draw_ :

```shell
**> ./dragee-cli --help**
Usage: index [options] [command]

Options:
  -h, --help          display help for command

Commands:
  report|r [options]  builds asserters rules report
  draw|d [options]    builds graphers graphs models
  help [command]      display help for command
```

```shell
**> ./dragee-cli report --help**
Usage: index report|r [options]

Builds asserters rules report.
- Lookups dragees in [--from-dir] directory
- Downloads asserters for dragees namespaces
- Executes rules from asserters
- Builds reports in [--to-dir] directory

Options:
  --from, --from-dir <path-to-dir>  directory in where to lookup for dragees (default: ".")
  --to --to-dir <path-to-dir>       directory in where to store reports (default: "./dragee/reports")
  -h, --help                        display help for command
```

Ce qui donne à l’usage :

```shell
**> ./dragee-cli report --from-dir ./test/approval/sample/ --to-dir ./output**
Looking up for dragees in directory: ./test/approval/sample/
Looking up for namespaces
Looking up for projects
...
```

## Architecture modulaire

### Module enfant

Maintenant que notre projet CLI est créé et fonctionnel, nous allons nous attaquer à un nouveau module, [dragee-asserter-generator](https://github.com/dragee-io/dragee-asserter-generator). Celui-ci a pour mission de générer un squelette d’_asserter_ pour le projet **Dragee.io**, comme [ddd-asserter ](https://github.com/dragee-io/ddd-asserter)par exemple.

Après ajout de la dépendance Commander à ce second projet, on crée la commande nécessaire dans [dragee-asserter-generator](https://github.com/dragee-io/dragee-asserter-generator/blob/main/index.ts) :

```typescript
import { Command } from 'commander';

export const generateAsserter = new Command('generate-asserter')
    .alias('ga')
    .summary('generates a new asserter project')
    .description('Generates a new asserter project.\nBased on a standard dragee asserter template, with mandatory dependancies and a sample rule.')
    .requiredOption('-n, --name <string>', 'name of the new asserter project')
    .requiredOption('-od, --output-dir <string>', 'output dir for the new asserter project')
    .action(generatorHandler);
```

Notez ici que l’on **exporte** la commande _generate-asserter_. Cela va nous permettre de la rendre accessible pour _dragee-cli_, et c’est justement ce que nous allons faire à présent.

### Module parent

Nous allons ajouter la dépendance à _dragee-asserter-generator_ dans _dragee-cli_. Nous ferons ainsi pour chaque autre module à rattacher à notre CLI, comme _dragee-grapher-generator_ par exemple.

Une fois cela fait, nous ajoutons tout simplement ces commandes au CLI central, après import :

```typescript
**import { generateAsserter } from '@dragee-io/asserter-generator';
import { generateGrapher } from '@dragee-io/grapher-generator';**

...
new Command()
    **.addCommand(generateAsserter)
    .addCommand(generateGrapher)**
    .addCommand(report)
    .addCommand(draw)
    .showHelpAfterError()
    .showSuggestionAfterError()
    .parse(process.argv);
```

Et voilà !

```shell
**> ./dragee-cli --help**
Usage: index [options] [command]

Options:
  -h, --help                      display help for command

Commands:
  **generate-asserter|ga [options]  generates a new asserter project
  generate-grapher|gg [options]   generates a new grapher project**
  report|r [options]              builds asserters rules report
  draw|d [options]                builds graphers graphs models
  help [command]                  display help for command
```

## Conclusion

La CLI comme cœur de notre système va nous permettre d’accroître les capacités de [Dragee.io](http://dragee.io/) au fur et à mesure. La modularité alliée à Commander.js nous permet de développer, tester et valider indépendamment chaque fonctionnalité. L’intégration des commandes dans la CLI centrale est simple, comme nous l’avons vu dans cet article. Enfin, le runtime de [Bun](https://bun.sh/) nous permet une exécution rapide des commandes ([démarrage 4 fois plus rapide que Node.js par exemple](https://bun.sh/blog/bun-v1.0)).

N’hésitez pas à consulter [les autres articles en lien avec Dragee.io](https://blog.hoppr.tech/tags/Dragee.io), pour découvrir d’autres solutions techniques à des problématiques posées lors de son développement, et voir avec nous ce beau projet grandir.