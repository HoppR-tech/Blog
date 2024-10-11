---
title: Retour "Survivre dans la JS-jungle des outils de tests" de Lise QUESNEL au Devfest 2024
date: 2024-10-11T12:52:42.324Z
description:  Cet article fait suite au [retour de HoppR sur le DevFest 2024](https://blog.hoppr.tech/blogs/2024-08-27-retour-sur-le-devfest) et se concentre sur la conférence de Lise QUESNEL qui aborde les outils
image: ./assets/cover-image.webp
alt: Conférence de Lise QUESNEL au DevFest 2024
ogImage: ./assets/cover-image.webp
tags: ['devfest', '2024', 'veille tech', 'js', 'testing', 'others']
published: true
authors:
  - id: 70a8663a-742d-4937-a6d4-5cef079b12c8
    name: Théo Lanord
    image: ./assets/author-tho-lanord.webp
    linkedin: https://www.linkedin.com/in/th%C3%A9o-lanord/
    x: 
reviewers:
  - id: 67adfd77-4b84-4496-b55d-3391541f59c5
    name: Michaël Bernasinski
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/82ebd0fe-de28-43f3-ab7b-0431af41baad/Photo_HoppR.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20241011%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241011T125242Z&X-Amz-Expires=3600&X-Amz-Signature=dfeb6b874b089d1b0802df82a5a3f85d6ab5167b870d244e384d1c65947e1aca&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/michael-bernasinski
    x: 
  - id: 0bb914a6-f882-4951-bee6-53e8e8abb807
    name: Emmanuelle Gouvart
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c88f5dfa-16db-4e6f-acf1-34dd80ee8766/emma_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20241011%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241011T125242Z&X-Amz-Expires=3600&X-Amz-Signature=a0d7333f5bdeefc5c004ae47d547f6548bfe142cd76f8676bc5bbf202d4f08d3&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/emmanuellegouvart-182b6ab2/
    x: 
---

<!-- markdownlint-disable-file -->


### Introduction

Cet article fait suite au [retour de HoppR sur le DevFest 2024](https://blog.hoppr.tech/blogs/2024-08-27-retour-sur-le-devfest) et se concentre sur la conférence de Lise QUESNEL qui aborde les outils de tests JavaScript.

Pour être concis, je vous résume les points qui m'ont le plus intéressés et ne reprendrai pas toutes les métaphores utilisées dans sa conférence.
Bref ! Re-déroulons le chemin de JS-Jungle ensemble !

### Tester, c'est douter ?

Avant de rentrer véritablement dans la JS-Jungle, répondons au pourquoi ? Et oui, pourquoi tester ?
Tester manuellement est une activité chronophage avec des résultats non répétables. Les forces des tests automatisés sont leur rapidité et leur répétabilité.
Ces deux qualités diminuent la longueur des boucles de feedback que ce soit en local, en pipeline de CI/CD ou même en recette.

Et en quoi réduire la longueur des boucles de feedback est intéressant ?
Plus l'erreur est détectée tard dans la chaîne de valeur, plus elle sera coûteuse à réparer (Localisation, recontextualisation, etc).
Associé à de petites incrémentations, tester permet de délivrer de la valeur plus rapidement toute en augmentant la qualité.
De mon point de vue, il est aussi l'occasion d'augmenter la confiance entre les différentes parties prenantes (développeurs, PO, QA, etc) pour, à terme, diminuer la pression au quotidien.

### Les typologies d'outils de test

Il est nécessaire de comprendre les différentes typologies car elles ne doivent pas être utilisées toutes en même temps. Chaque contexte a son besoin.

### Les lanceurs (Test runner)

Leur but est d'exécuter les tests et d'exporter leurs résultats.

Exemple: [Karma](https://karma-runner.github.io/latest/index.html)

### Les structurateurs

Leur but est de structurer l'écriture des tests pour facilité leur lisibilité, écriture et maintenance.

Les deux syntaxes, aussi appelées modèles de tests ou patterns, les plus connues sont AAA ([Arrange Act Assert](https://wiki.c2.com/?ArrangeActAssert=)) et Gerkhin ([Given When Then](https://en.wikipedia.org/wiki/Given-When-Then)).
Toutes les deux expriment un contexte, une action puis des conséquences. Gerkhin se distingue par son approche [comportementale](https://fr.wikipedia.org/wiki/Programmation_pilot%C3%A9e_par_le_comportement) des sujets métiers.
Cela permet notamment d'obtenir un nommage/langage commun compréhensible par les développeurs et le métier.

Exemple: [Cucumber](https://github.com/cucumber/cucumber-js)

### Les utilitaires

Leur but est de vérifier les attendus et de lever des exceptions claires. Cette notion est appelé "Assertion".

Exemple: [Chai](https://www.chaijs.com/)

### Les spies, stubs et mocks

Leur but est d'isoler la partie du code testée par la simulation du fonctionnement de ces dépendances ou encore l'analyse à l'appel de ces dépendances.

Exemple: [Sinon](https://sinonjs.org/)

### Les multi-typologies

Si vous ne vous sentez pas d'avoir trop de dépendances dans votre projet, il existe aussi des outils couvrants toutes ces typologies :

Exemples:

- [Jest](https://jestjs.io/fr/)
- [Vite](https://vitejs.dev/)
- [Jasmine](https://jasmine.github.io/)
### Les contrôleurs de navigateurs

La typologie des contrôleurs de navigateurs est à part dans le sens où leur but est de simuler un comportement utilisateur au plus proche du navigateur.
Il y a 3 manières de contrôler un navigateur :

- Via ces drivers : [Selenium](https://www.selenium.dev/selenium/docs/api/javascript/index.html)
- Via script JS : [Cypress](https://www.cypress.io/)
- Via API Native : [Playwright](https://playwright.dev/) ou [Puppeteer](https://pptr.dev/)
### Les tests bancals

Si vous avez déjà commencé vos premiers tests, vous tomberez sur des tests bancals (Flaky en anglais) dont le résultat n'est pas répétable de manière certaine. Un jour il passe, l'autre non...

Un élément de réponse pour comprendre pourquoi il ne passe pas tout le temps est que le test est basé sur “quelque chose” de variable. Dans certains cas, pour contourner cette variabilité, nous pouvons simuler (mocker) ou remplacer l’élément variant.

Exemple:

- Lecture d'un tableau de données dans un ordre non déterministe
- Modification des données par un test précédent
- Appel à une date relative (Aujourd'hui, demain, hier)
- Sélecteur CSS non sûr (Vous pouvez utiliser les rôles: [Testing-library](https://testing-library.com/))
Des conseils pour garder une base de tests saine et, en conséquence, une confiance envers vos tests:

- "N'hésitez pas à mettre vos tests bancals en quarantaine"
- "Mettez des règles sur vos quarantaines (Nombre de jours maximums en quarantaine, nombre de tests maximum, etc)"
- “De manière générale, respectez les principes [FIRST](https://dzone.com/articles/first-principles-solid-rules-for-tests)”
Il existe des questions ouvertes que sont l'unité d'un test unitaire, la sociabilité des tests ou l'utilité d'un test qui sont en fait des sujets exploratoires.
Si vous êtes totalement perdu, les langages front étant orientés composant, il est plus simple de prendre comme unité par défaut le composant (attention, [simple n'est pas facile](https://www.entropywins.wtf/blog/2017/01/02/simple-is-not-easy/)).
Pour explorer ces notions, vous pouvez essayer [le test-first ou encore le test driven developement](https://medium.com/@imenezzine/tdd-vs-test-first-development-quelle-est-la-diff%C3%A9rence-ccbea4771484).

### Les stratégies de tests

Vous trouverez dans la JS-Jungle de nombreux noms de tests (unitaire, intégration, bout en bout, acceptance, composants, contracts, etc).
Leurs significations varient en fonction des équipes, ce sont vos collègues qui vous expliquerons, au mieux, leur vision.

De manière simplifiée, nous dirons que nous avons des tests unitaires pour les fonctions utilitaires, des tests d’intégration pour les composants et des tests de bout en bout pour simuler le comportement utilisateur.
Plus vous vous rapprochez des tests unitaires, plus vos unités de test sont fines et rapides mais moins vous pouvez avoir confiance en ceux-ci seules.

La question finale sera donc lesquels utiliser et en quelle proportion ?
Vous trouverez de nombreuses distributions de tests : [la pyramide, l'alvéole, le trophée](https://thetestingarchitect.substack.com/p/test-pyramid-test-honeycomb-test).
L'orientation des langages front modernes pousse vers l'utilisation de la distribution en trophée (Plus de tests de bout en bout que de tests unitaires et moins de tests de bout en bout que de tests d'intégration).

### Ouverture

J'aimerais insister sur l'analyse statique de votre langage. Même si ce n'est pas un test en soit, le fait de typer, de créer des interfaces pour vos échanges, cela vous aidera à donner de la confiance en votre code et même à visualiser les sujets métiers.

Enfin, les tests manuels ne sont pas à bannir. Ils ne sont pas adaptés pour garantir la non-régression. Par contre, leur flexibilité est avantageuse pour des sujets exploratoires (Nouvelles erreurs, cas à la marge, etc). Peut-être devrions nous les appeler “tests exploratoires” ? A vous d'y répondre et de continuer de délivrer de la valeur pour vos utilisateurs et clients !


Merci de votre lecture et merci aussi à Lise QUESNEL pour son talk !
J'en profite pour la féliciter pour la qualité de la narration et de son écriture.
N'hésitez pas à regarder la [rediffusion](https://www.youtube.com/watch?v=LqwfhxyiwXU&list=PLuZ_sYdawLiXf92Uq5iE5LlYKrOv1IUvx&index=7) de cette conférence.



