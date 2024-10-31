---
title: "DORA Metrics : Évaluer la performance de livraison logicielle"
date: 2024-10-31T16:34:09.365Z
description: "Cet article explore les DORA Metrics, également connues sous le nom de « Four Keys », un standard émergent pour évaluer la performance de la livraison logicielle. Ayant eu l'opportunité de mettre en p"
image: ./assets/cover-image.webp
alt: "Image illustrant les DORA Metrics avec une fusée qui décolle vers la lune dans un style pop"
ogImage: ./assets/cover-image.webp
tags: ['dora metrics', 'devops', 'cloud', 'performance', 'observabilité', 'cloud-platform']
published: true
authors:
  - id: 838dec96-f9fc-404f-a302-07719225d785
    name: Maxime Deroullers
    image: ./assets/author-maxime-deroullers.webp
    linkedin: https://www.linkedin.com/in/maxime-deroullers-1b5791137/
    x: https://x.com/mderoullers
reviewers:
  - id: 45c76823-ab7d-4c1f-84b3-0bad16ab91e1
    name: Paul-Alexandre Chrétien
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c4f79dcc-a6ed-4a79-9947-416b33e5b90a/Photo_Profil_CV_1200px_%2813%29.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45GO43JXI4%2F20241031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241031T163408Z&X-Amz-Expires=3600&X-Amz-Signature=17d42cc8fa7348e15880615a184d9cc03d4312fbba9f691f469ea7575728026d&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/paulalexandrechretien/
    x: 
  - id: 0bb914a6-f882-4951-bee6-53e8e8abb807
    name: Emmanuelle Gouvart
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c88f5dfa-16db-4e6f-acf1-34dd80ee8766/emma_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45GO43JXI4%2F20241031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241031T163408Z&X-Amz-Expires=3600&X-Amz-Signature=199b4667885bca080d58b9704e19238b32d17675e3c643b6f5c73ce405930bc3&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/emmanuellegouvart-182b6ab2/
    x: 
  - id: e8163b24-7e01-41c5-adbf-0dc655f929d0
    name: Nicolas Zago
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/f8f82a79-9d41-4302-b1a5-37882985167f/nicoz_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45GO43JXI4%2F20241031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241031T163408Z&X-Amz-Expires=3600&X-Amz-Signature=b41d2e5cff05fcfcad7a6b7423c10495eeac36a4925a05cac543c2bc49d9c71a&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/nicolaszago/
    x: 
  - id: 02c620f8-3576-4943-b5cf-6117f99220a2
    name: Edouard Cattez
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/02dd23b5-238a-4713-ad54-432f3fa5119b/ecattez_profile.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45GO43JXI4%2F20241031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241031T163409Z&X-Amz-Expires=3600&X-Amz-Signature=62a6fb7395f1a4beceedbc9d816bde48517d66ab1f0715d4174e49c2314436f2&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/edouard-cattez-865794133/
    x: https://x.com/ecattez
---

<!-- markdownlint-disable-file -->


Cet article explore les DORA Metrics, également connues sous le nom de « Four Keys », un standard émergent pour évaluer la performance de la livraison logicielle. Ayant eu l'opportunité de mettre en place ces métriques chez un grand acteur du retail — comptant plus de 50 000 projets, 8 000 développeurs et présent sur les 5 continents — je souhaite partager les leçons et recommandations tirées de cette expérience.

Dans cet article, nous nous concentrerons sur les aspects théoriques et fondamentaux des [DORA Metrics](https://blog.hoppr.tech/tags/dora%20metrics). 

L'objectif est de vous permettre de saisir les concepts essentiels, tandis que les articles suivants détailleront la mise en place pratique, les adaptations nécessaires (car il y a toujours un écart entre théorie et pratique), ainsi que les avantages et les limites que j'ai pu observer dans l'application de ce modèle.

## Qu'est-ce que les métriques DORA ?

Les métriques DORA, issues du rapport  "[Accelerate State of DevOps](https://cloud.google.com/devops/state-of-devops)" de DORA (DevOps Research and Assessment), sont un ensemble de quatre indicateurs clés de performance (KPI) qui permettent d'évaluer de manière objective l'efficacité et la stabilité des processus de développement et de déploiement logiciel d'une organisation.

Examinons chacune de ces métriques en détail :

1. **Lead Time for Changes (Délai de livraison des changements)**

Cette métrique mesure le temps écoulé entre le moment où un changement est codé et le moment où il est déployé en production. Un délai plus court indique une capacité à répondre rapidement aux besoins des utilisateurs, améliorant ainsi l'expérience utilisateur.

2. **Deployment Frequency (Fréquence de déploiement)**

Elle mesure la fréquence à laquelle les changements sont déployés en production. Une fréquence élevée suggère que le déploiement est devenu une opération de routine, ce qui permet une réponse rapide aux besoins des utilisateurs et améliore la boucle de feedback.

3. **Mean Time to Restore (MTTR) (Temps moyen de restauration)**

Le MTTR mesure le temps nécessaire pour restaurer le service après un incident en production. Un MTTR court indique une réactivité élevée et une boucle de feedback courte, ce qui devrait améliorer l'expérience utilisateur.

4. **Change Failure Rate (Taux d'échec des changements)**

Cette métrique mesure le taux de changements qui entraînent un échec ou un incident. Un taux faible implique une bonne compréhension des besoins des utilisateurs et une réponse appropriée, ce qui devrait améliorer l'expérience utilisateur.



Pour calculer les 4 keys, l'équipe DORA a développé une solution sur [GitHub](https://github.com/dora-team/fourkeys/tree/main). 
Vous y trouverez les [requêtes SQL nécessaires au calcul des métriques](https://github.com/dora-team/fourkeys/blob/main/METRICS.md). Bien que cette solution soit difficilement applicable telle quelle — car peu adaptée au contexte spécifique de chaque entreprise — elle constitue néanmoins une excellente base théorique pour comprendre le fonctionnement des métriques.

## Les niveaux de performance

Les métriques DORA définissent trois niveaux de performance principaux :

- Low
- Medium
- High
Selon les années, un quatrième niveau peut être ajouté : Elite, mais la logique reste la même.

Ces niveaux de performance permettent aux équipes de se positionner par rapport aux meilleures pratiques de l'industrie et d'identifier les domaines d'amélioration potentiels dans leurs processus de développement et de livraison logicielle.

![Tableau "Software delivery performance metric" avec 4 colonnes (Software delivery performance metric, Low, Medium, High) et 4 lignes de métriques : Deployment frequency, Lead time for changes, Time to restore service, Change failure rate, montrant les valeurs pour chaque niveau de performance (Low, Medium, High).](./assets/img1.webp)

Pour plus de détails sur ces seuils de performance, vous pouvez [consulter la documentation DORA officielle](https://cloud.google.com/blog/products/devops-sre/dora-2022-accelerate-state-of-devops-report-now-out?hl=en).

## Pourquoi ces métriques sont-elles importantes ?

En mesurant et en surveillant ces métriques, les équipes de développement obtiennent une vue d'ensemble de leur performance et peuvent identifier des axes d'amélioration. Par exemple, si le délai de livraison des changements est élevé (disons 2 semaines au lieu de plusieurs livraisons par jour pour une performance élevée), l'équipe peut se concentrer sur l'amélioration de ses processus de développement. Si le MTTR est élevé (par exemple, 24 heures au lieu de moins d'une heure pour une performance élevée), l'accent peut être mis sur l'amélioration des processus de réponse aux incidents.

## Une approche “Data-Driven”

En utilisant ces métriques, les équipes peuvent prendre des décisions fondées sur des données concrètes plutôt que sur l'intuition. Ces décisions deviennent ainsi objectives et communicables, s'appuyant sur des preuves tangibles plutôt que sur des émotions ou des biais.

De plus, l'utilisation de métriques communes à travers les équipes et les projets facilite le partage d'expériences et l'amélioration continue. En collectant et en analysant ces données, les équipes peuvent mesurer les résultats de leurs efforts d'amélioration continue et partager leurs expériences à travers l'organisation.

## Conclusion

Les métriques DORA (Four Keys) offrent un cadre pour évaluer et améliorer la performance de livraison logicielle. Ces quatre indicateurs  permettent aux équipes d'être en amélioration continue, de répondre plus efficacement aux besoins des utilisateurs et, en fin de compte, de livrer des logiciels de meilleure qualité, plus rapidement et de manière plus fiable.

[Dans un prochain article](https://blog.hoppr.tech/tags/dora%20metrics), nous aborderons l'aspect pratique et verrons qu'il n'est pas si simple de mettre en place les métriques DORA, et surtout de les adapter au contexte métier et organisationnel de l’entreprise.



