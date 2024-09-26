---
title: Low Carbon dans le Cloud - Partie 1
date: 2024-09-26T15:54:07.595Z
description: Le Green Code aurait permis d'économiser des centaines de millions de tonnes de CO2 rien que ces 3 dernières années. Et si nous faisions un effort supplémentaire côté infrastructure ?  Auprès des part
image: ./assets/cover-image.webp
alt: Error 404. This is not green enough
ogImage: ./assets/cover-image.webp
tags: ['green', 'cloud', 'cloud-platform']
published: true
authors:
  - id: 4f37105b-9f64-4dcc-8a19-a1f4d5489826
    name: Samuel Bally
    image: 
    linkedin: 
    x: 
reviewers:
  - id: 67adfd77-4b84-4496-b55d-3391541f59c5
    name: Michaël Bernasinski
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/82ebd0fe-de28-43f3-ab7b-0431af41baad/Photo_HoppR.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240926%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240926T155407Z&X-Amz-Expires=3600&X-Amz-Signature=3cfc8d44f443f642b85c913ba64f62400f9e1921ca1d0ce8c57023d0e35d2346&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: www.linkedin.com/in/michael-bernasinski
    x: 
  - id: 0bb914a6-f882-4951-bee6-53e8e8abb807
    name: Emmanuelle Gouvart
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c88f5dfa-16db-4e6f-acf1-34dd80ee8766/emma_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240926%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240926T155406Z&X-Amz-Expires=3600&X-Amz-Signature=1fd2e9a0a9bdaa3893499e0fedf86a2bb7a4fbf71c1926bea07781f4c81ea359&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/emmanuellegouvart-182b6ab2/
    x: 
---

<!-- markdownlint-disable-file -->


Le Green Code aurait permis d'économiser des centaines de millions de tonnes de CO2 rien que ces 3 dernières années. Et si nous faisions un effort supplémentaire côté infrastructure ?

Auprès des particuliers, ce sont sûrement les applications mobiles qui sont le plus consommées. Toutefois, en entreprise, les centres de données avec des climatiseurs de la taille de Matignon sont encore la norme. Sans parler de l'IA qui vient tuer le match.

Heureusement, nous pouvons limiter la casse et revenir dans les bonnes grâces de Greta.

## Notions

Reprenons les basiques: comment notre application génère du CO2 ? Le stockage, la charge CPU, le refroidissement consomment de l'énergie. Pour produire cette énergie exprimée en kWh, nous brûlons des matières premières, nous extrayons de l'uranium, nous produisons des panneaux solaires, etc. Toutes ces solutions produisent plus ou moins de polluants comme: le CO2, des métaux lourds, des gaz acidifiants, etc. Et bien sûr, tout ça a aussi un coût financier variable : par exemple l'énergie dite verte est plus chère.

Il est important de souligner que la source d'énergie du centre de données est le facteur numéro 1 pour ajuster sa production de CO2.

En effet, un centre de données qui consomme 2 fois plus d'électricité qu'un autre peut produire moins de CO2. Comme nous allons le voir en fonction de l'origine électrique, la différence peut être de facteur 100 !

## La France reste un des meilleurs choix

Le site [electricitymaps](https://app.electricitymaps.com/) nous propose une carte monde des émissions de CO2. Il est facile de comparer la production de CO2 par pays tout en analysant l'origine de cette production (charbon, nucléaire, solaire, …).

Il y a d'énormes différences entre les pays. À l'heure où j'écris cet article, l'Inde produit 66 fois plus de gaz carboné que la Suède pour produire 1 kWh.

Intensité carbone de la France -

![electricity Map de l’Europe](./assets/img1.webp)

La France, grâce essentiellement au nucléaire et aux énergies renouvelables, est dans les meilleurs élèves de la planète. Bonne nouvelle pour les consommateurs de Cloud, nous avons un grand nombre de Cloud en France (OVH, Scaleway, Outscale, …) et les grands fournisseurs américains proposent une région (exécution des services et stockage) dans notre beau pays.

Malheureusement, il y a une contrepartie ! En effet, héberger ses données en France (23 g d'équivalent Co2 pour 1 kWh) coûte plus cher qu'en Irlande (525 g) ou en Allemagne (187 g) avec les fournisseurs américains.

Il est important de souligner que certains centres de données peuvent être alimentés par une production d'énergie indépendante du pays (autoproduction, contrat privé, …).

## Le GreenOps un adversaire du FinOps ?

Le cas précédent met en avant une dualité entre le CO2 et les impacts budgétaires. Heureusement, le Cloud n'est pas un univers cornélien ou nous devons choisir entre pollution et économie financière. Il faut être capable d'ajuster les curseurs entre les coûts et l'écologie.

### Pauvreté et sobriété numérique

Il n'est pas question de se priver d'utiliser les services Cloud pour réduire son CO2. Les compromis seront de mise mais permettront d'atteindre la sobriété et ne vous brideront aucunement. Parfois les planètes seront alignées : c'est le cas pour conjuguer souveraineté des données et diminution de l'impact carbone pour les entreprises françaises.

### Marketing

L'écologie est bankable, nous n'allons pas nous mentir, avant tout pour son attrait marketing. En effet, l'impact commercial d'acte Green est réel. Il doit être mis dans la balance afin d'ajuster le curseur GreenOps/FinOps.

### Réglementation

Pour le respect des lois à caractère RSE, une démarche GreenOps est un grand atout.

## En introduction de la partie 2

Il est important de pouvoir suivre ces deux métriques: coût et production de carbone. Ce qui ne peut pas être mesuré est difficilement améliorable. Le Cloud amène avec lui de belles pratiques et de belles améliorations notamment en terme de vision. Dans la seconde partie, nous parlerons d'observabilité avec un focus particulier sur l'impact carbone.



