---
title: "Bref, j’ai mis en place les DORA Metrics dans un grand groupe ! (REX 🦖)"
date: 2025-04-17T15:27:24.638Z
description: "  Dans mon précédent article (voir [DORA Metrics : évaluer la performance de livraison logicielle](https://blog.hoppr.tech/blogs/2024-10-31-dora-metrics-valuer-la-performance-de-livraison-logicielle >"
image: ./assets/cover-image.webp
alt: "Image abstraite représentant les metrics avec un tyrannosaure pour illustrer le REX"
ogImage: ./assets/cover-image.webp
tags: ['dora metrics', 'devops', 'cloud-platform', 'observabilité', 'cloud', 'performance']
published: true
authors:
  - id: 838dec96-f9fc-404f-a302-07719225d785
    name: Maxime Deroullers
    image: ./assets/author-maxime-deroullers.webp
    linkedin: https://www.linkedin.com/in/maxime-deroullers-1b5791137/
    x: https://x.com/mderoullers
reviewers:
  - id: 67adfd77-4b84-4496-b55d-3391541f59c5
    name: Michaël Bernasinski
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/82ebd0fe-de28-43f3-ab7b-0431af41baad/Photo_HoppR.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4665AFDF7DU%2F20250417%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250417T152724Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIAb6Ckugl%2Bg5tGzXkCjWlVIHNYqwcEn7rKZUyesfXq33AiBrI828EgUD%2F4PaDkLFOI2FsMAjyVrZ%2F4DjhX3Sx1M%2BpSr%2FAwhgEAAaDDYzNzQyMzE4MzgwNSIMkzy7a56TRDQCMnV7KtwDF1z9dSdGzVrPdZJ9nPnpyz%2BJy9zcbYgLBaYuyPFpxsq%2FWb5mbuOuewkO2tMhdYSK6lnImh6enghKbrlyWE%2BfUZOemndb4PvvLpaW8D5dqy4K3rLRJO7LBb%2FTHUlLI2r5mGJnSTJEv2rj0xkllA4SkApybUw5FWPj%2FTrJjNbT6JXZoFScZSu8ED4KbOPMr9EDqcZo1YiU%2BIm8C501zcGAZIcCnjhG%2BbsCoekla42icvnFwf3xbYoWaBAPIXHZMo103zdXx9EvG3waWNGL5yMIf2yFys5%2BFCEa8%2BMdQ2nmcxKRdWsHVZaialCyk%2FT%2FZagGZMnQBU3SpW0grAVHWWK7ETcuEWimtF6lwQIogLctCZRMENA0jtPoLj6pi2tT%2BsUlLJnonph6ETZcJr4UIOqA53RRmv2fwSe5Po%2FI14XlsbESYqFmJtfbE98NiaPQR93hctqgrHZlcT5LGYgMGRCTCVXo2ByjWrF4GADrxjdCVkBF7wVwRBcNVMObeG6NKPPyHpUR51Ly4kS1OMFpl%2Bae9erIC1uyEQBQKG5v3o4KF5S8SCQiaSc25CQ0W1dO0s60xu6Kqmg%2FwX%2F7Um9G3Q1miMpV9%2FmiPTSWsvDsi7EAw06DgqsVQaHS%2FMG1pKww9K2EwAY6pgGaQ%2BtQtOVhuolauvI0HUP8atg9F5lrsahBbCXnzvLVxrruZi7%2FwWE9zTYHkaM1P8kZqneJSeSO97PKhCaTThQBPBwgd3zq6qk3LO3Ys%2FvKRqMgo78oxfbgAm62zsayqI0oVCAIbad3T4wsN4fwzqIo142UF4vSzYuI9YatAVXgC6DpTkpVote%2B5xpANSFdhRWZraNluzBrlv16DCAVuxB9S1XSutcs&X-Amz-Signature=6fceed4fb095646ad12eb5cf679dd27d047f750f01d092fa199e163d54dc6803&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/michael-bernasinski
    x: 
---

<!-- markdownlint-disable-file -->




Dans mon précédent article (voir [DORA Metrics : évaluer la performance de livraison logicielle](https://blog.hoppr.tech/blogs/2024-10-31-dora-metrics-valuer-la-performance-de-livraison-logicielle#quest-ce-que-les-m%C3%A9triques-dora)), j'ai introduit les **4 métriques (4 Keys)** qui permettent de mesurer l'efficacité de la livraison logicielle:

> **Deployment Frequency** | **Lead Time for Changes** | **Mean Time to Restore** | **Change Failure Rate**

Aujourd'hui, je souhaite partager mon retour d'expérience (REX) sur leur mise en place chez un client qui souhaitait objectiver et améliorer sa performance de livraison.

## 1. Comprendre l'organisation et définir les concepts 🏢

### L'organisation du groupe

Lorsque je suis arrivé chez ce client, j'ai pu constater qu'il y avait de nombreux produits (> 1000) avec des technologies hétérogènes. Mais d'ailleurs, c'est quoi un produit ? La première chose à faire a été de se mettre d'accord sur les définitions !



L'organisation de l'entreprise était la suivante :

- Le groupe est divisé en plateformes

- Les plateformes sont divisées en domaines

- Les domaines sont divisés en produits



Après quelques ateliers le management et des projets pilotes, nous sommes tombés d'accord sur les définitions suivantes :

- **Plateforme** : Niveau le plus haut de l'organisation, regroupe plusieurs domaines fonctionnels liés

- **Domaine** : Regroupe des produits ayant des fonctionnalités similaires ou complémentaires

- **Produit** : Périmètre fonctionnel perceptible par l'utilisateur final, pour lequel les changements lui sont communiqués. Un produit peut être composé de plusieurs composants (microservices ou briques monolithiques) et peut être déployé sur différents environnements de production

### Les cas d'usage identifiés

Une fois l'organisation de la société comprise et les concepts définis, il a fallu comprendre tous les cas d'usage des DORA Metrics avec des ateliers comme l'Example Mapping.



Je ne veux pas vous mettre tous les cas d'usage, car ça serait trop long et ce n'est pas l'objectif de l'article, mais je vais vous donner quelques exemples :

- En tant que CTO, je souhaite comparer les performances de livraison entre les plateformes (par exemple entre la plateforme Commerce et la plateforme Gestion Clients) pour identifier les meilleures pratiques DevOps à généraliser au niveau du groupe.

- En tant que Lead Tech d'un produit e-commerce, je souhaite comparer nos métriques avec celles des autres produits du domaine Commerce (comme le panier ou le catalogue) pour comprendre pourquoi leurs déploiements génèrent moins d'incidents en production.

- En tant que Domain Leader Catalogue, je souhaite analyser l'impact du multi-instance sur la fréquence de déploiement. Par exemple, comprendre si les produits déployés sur plusieurs environnements de production (pour différentes BU) ont plus de difficultés à maintenir un rythme de livraison élevé et si oui, comprendre les causes.

- En tant que Product Owner, je veux suivre l'évolution de nos métriques après le passage d'une architecture monolithique à des microservices, notamment pour vérifier si la fréquence de déploiement de chaque composant s'améliore comme prévu.

## 2. Les défis techniques et organisationnels 🔧

La mise en place des DORA Metrics dans un groupe de cette taille présentait beaucoup de défis majeurs. Avec mon client, nous avons fait le choix d'implémenter les DORA Metrics que sur les produits déployés sur Kubernetes (cela représente environ 80% des produits et Kubernetes est la cible du groupe). Voici les principaux obstacles que nous avons dû surmonter :

### Une architecture complexe à appréhender

**L'entreprise comportait :**

- Plus de 1000 produits utilisant des technologies différentes

- Des produits déployés plusieurs fois pour différentes BU

- Un mix d'architectures monolithiques et microservices

- Des relations complexes entre composants et produits



Face à cette complexité, nous avons adopté une approche pragmatique : sélectionner quelques produits pilotes représentatifs de l'écosystème pour implémenter les DORA Metrics. Après avoir validé notre méthodologie sur ces cas concrets, nous avons pu déployer progressivement la solution à l'ensemble du portefeuille de produits.

### Des données éparpillées

**Il fallait collecter les données depuis :**

- Les clusters **Kubernetes** pour les logs de déploiements

- **GitHub** pour l'historique des versions

- **ServiceNow** pour les incidents



**Le véritable défi ? Corréler ces données hétérogènes pour obtenir une vision cohérente !**

Cette mission a nécessité une collaboration transverse entre plusieurs équipes techniques. Nous avons conçu une architecture cloud robuste pour centraliser l'ensemble des données dans une base de données BigQuery. Cette solution nous a d'ailleurs poussés à optimiser nos requêtes et l'utilisation de BigQuery car nous atteignions rapidement les limites de performance 😅.



L'objectif final était de disposer d'un référentiel unique permettant d'exécuter des requêtes SQL complexes _(cf l’implémentation des métriques plus bas dans cet article)_ pour calculer précisément nos métriques DORA.

### Des pratiques DevOps non standardisées

**Une partie des équipes avait :**

- Leur propre workflow de déploiement

- Leurs conventions de versioning

- Leur façon de gérer les environnements de production



**Il a fallu aider ces équipes à adopter les bonnes pratiques du groupe à savoir :**

- la norme [SemVer](https://semver.org/lang/fr/) pour le versioning

- l'utilisation des solutions groupe pour déployer leurs produits sur Kubernetes

- la déclaration systématique des incidents dans ServiceNow

- etc.



**La standardisation des pratiques DevOps : un prérequis indispensable aux DORA Metrics**

Ce chantier d'harmonisation, bien que colossal pour une organisation de cette envergure, s'est révélé être un puissant levier de transformation ! Même si des standards existaient déjà, les DORA Metrics ont agi comme un révélateur implacable : les projets ne respectant pas les bonnes pratiques étaient immédiatement identifiables par l'absence de données exploitables pour le calcul des métriques.

Cette transparence a créé une incitation naturelle à l'adoption des standards du groupe, bien plus efficace qu'une simple directive top-down.

### Des données pas toujours fiables

**Les principaux problèmes :**

- Pas de standard dans le nommage des composants

- Des déploiements de configuration qui polluaient les métriques

- Une difficulté à identifier les vrais déploiements en production

- Des annotations manquantes ou incohérentes



**Pragmatisme et itération : la clé du succès en environnement réel**

Face à l'imperfection inévitable des données en contexte d'entreprise de grande taille, nous avons adopté une approche pragmatique : formuler des **hypothèses** clairement documentées et acceptées par toutes les parties prenantes. Ces conventions, bien qu'imparfaites, nous ont permis d'**avancer sans attendre la perfection** qui arrivera sans doute jamais.

Cette démarche s'alignait parfaitement avec la philosophie des DORA Metrics : l'objectif n'est pas d'atteindre une précision absolue, mais de capturer des **tendances** significatives permettant d'**orienter l'amélioration continue**.



### Une organisation multi-niveaux à respecter

Il fallait :

- Fournir des **vues adaptées** à chaque niveau (plateforme, domaine, produit)

- Prendre en compte les **particularités** de chaque BU

- Garder des **métriques comparables** malgré les différences

- **Accompagner** les équipes vers de meilleures pratiques



### La dimension humaine à ne pas négliger

**Nous avons rapidement identifié des craintes légitimes :**

- Peur d'être jugé uniquement sur des chiffres

- Inquiétude que les métriques servent à comparer les équipes entre elles

- Tentation de biaiser le système (par exemple en multipliant volontairement les déploiements inutiles pour améliorer artificiellement la fréquence)

- Réticence à reporter certains incidents pour ne pas impacter le Change Failure Rate

- Besoin d'accompagnement pour comprendre l'intérêt des métriques comme outil d'amélioration continue



**Notre approche : transformer les résistances en adhésion**

Plutôt que d'imposer un système de mesure, nous avons choisi d'impliquer les équipes dans sa construction. Nous avons organisé des ateliers de sensibilisation, partagé les objectifs stratégiques derrière ces métriques, et surtout, écouté les préoccupations des équipes.

Cette démarche participative a permis de transformer progressivement la perception des DORA Metrics : d'un outil potentiellement menaçant de surveillance, elles sont devenues un levier d'amélioration continue valorisé par les équipes elles-mêmes.

## 3. Hypothèses techniques retenues 🧐

> **Fondations solides : établir des conventions claires et partagées**

Voici les principales conventions que nous avons établies, organisées par domaine :

### Déploiements 🚀

**Identification des déploiements en production**

- Un déploiement est considéré réussi uniquement quand :

- Seuls les déploiements avec l'annotation `info/environment = prod` sont pris en compte

- Les déploiements de configuration pure sont exclus des métriques

**Impact utilisateur**

- Un déploiement en production impacte potentiellement l'utilisateur final

- Un produit peut être déployé sur plusieurs workspaces (namespace/cluster)