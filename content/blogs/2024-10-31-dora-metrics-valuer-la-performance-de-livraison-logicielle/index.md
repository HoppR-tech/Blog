---
title: "DORA Metrics : Évaluer la performance de livraison logicielle"
date: 2024-10-31T16:02:59.930Z
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
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c4f79dcc-a6ed-4a79-9947-416b33e5b90a/Photo_Profil_CV_1200px_%2813%29.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45GO43JXI4%2F20241031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241031T160259Z&X-Amz-Expires=3600&X-Amz-Signature=ee0ac486e3a9b81560341bbdc184d5d85b9bf3106e5ed6ec58fdf126d7a72742&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/paulalexandrechretien/
    x: 
  - id: 0bb914a6-f882-4951-bee6-53e8e8abb807
    name: Emmanuelle Gouvart
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c88f5dfa-16db-4e6f-acf1-34dd80ee8766/emma_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45GO43JXI4%2F20241031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241031T160259Z&X-Amz-Expires=3600&X-Amz-Signature=8d218c2e21d50e5266ab34a16558acd1a6afdb55199bb38239c354fcb1c6dd98&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/emmanuellegouvart-182b6ab2/
    x: 
  - id: e8163b24-7e01-41c5-adbf-0dc655f929d0
    name: Nicolas Zago
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/f8f82a79-9d41-4302-b1a5-37882985167f/nicoz_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45GO43JXI4%2F20241031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241031T160259Z&X-Amz-Expires=3600&X-Amz-Signature=624ebcc1a5ac198c3e9d1a1f210b4f8d9599d760c24bb9b055c906f28c6884bb&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/nicolaszago/
    x: 
  - id: 02c620f8-3576-4943-b5cf-6117f99220a2
    name: Edouard Cattez
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/02dd23b5-238a-4713-ad54-432f3fa5119b/ecattez_profile.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45GO43JXI4%2F20241031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241031T160259Z&X-Amz-Expires=3600&X-Amz-Signature=85c73c9573dc3d20237a3e4b75379924834aa9dc0406e64182858e8214fcef81&X-Amz-SignedHeaders=host&x-id=GetObject
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

1. Lead Time for Changes (Délai de livraison des changements)
Cette métrique mesure le temps écoulé entre le moment où un changement est codé et le moment où il est déployé en production. Un délai plus court indique une capacité à répondre rapidement aux besoins des utilisateurs, améliorant ainsi l'expérience utilisateur.

1. Deployment Frequency (Fréquence de déploiement)
Elle mesure la fréquence à laquelle les changements sont déployés en production. Une fréquence élevée suggère que le déploiement est devenu une opération de routine, ce qui permet une réponse rapide aux besoins des utilisateurs et améliore la boucle de feedback.

1. Mean Time to Restore (MTTR) (Temps moyen de restauration)
Le MTTR mesure le temps nécessaire pour restaurer le service après un incident en production. Un MTTR court indique une réactivité élevée et une boucle de feedback courte, ce qui devrait améliorer l'expérience utilisateur.

1. Change Failure Rate (Taux d'échec des changements)
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

![L'image présente un tableau intitulé "Software delivery performance metric" (Métrique de performance de livraison logicielle) avec quatre colonnes : "Software delivery performance metric", "Low", "Medium", et "High".

Le tableau contient quatre lignes de métriques :

Deployment frequency (Fréquence de déploiement) :

Low : Entre une fois par mois et une fois tous les 6 mois
Medium : Entre une fois par semaine et une fois par mois
High : À la demande (plusieurs déploiements par jour)

Lead time for changes (Délai de livraison des changements) :

Low : Entre un mois et six mois
Medium : Entre une semaine et un mois
High : Entre un jour et une semaine

Time to restore service (Temps de restauration du service) :

Low : Entre une semaine et un mois
Medium : Entre un jour et une semaine
High : Moins d'un jour

Change failure rate (Taux d'échec des changements) :

Low : 46%-60%
Medium : 16%-30%
High : 0%-15%](https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/5d7fbdeb-1ce8-458c-b86b-c015b6a86e78/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45GO43JXI4%2F20241031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241031T160259Z&X-Amz-Expires=3600&X-Amz-Signature=e856c90765e2c9a4d0bf0ad3d45305f925f3301aa7cc924d85aeb791b8c24291&X-Amz-SignedHeaders=host&x-id=GetObject)



Pour plus de détails sur ces seuils de performance, vous pouvez [consulter la documentation DORA officielle](https://cloud.google.com/blog/products/devops-sre/dora-2022-accelerate-state-of-devops-report-now-out?hl=en).

## Pourquoi ces métriques sont-elles importantes ?

En mesurant et en surveillant ces métriques, les équipes de développement obtiennent une vue d'ensemble de leur performance et peuvent identifier des axes d'amélioration. Par exemple, si le délai de livraison des changements est élevé (disons 2 semaines au lieu de plusieurs livraisons par jour pour une performance élevée), l'équipe peut se concentrer sur l'amélioration de ses processus de développement. Si le MTTR est élevé (par exemple, 24 heures au lieu de moins d'une heure pour une performance élevée), l'accent peut être mis sur l'amélioration des processus de réponse aux incidents.

## Une approche “Data-Driven”

En utilisant ces métriques, les équipes peuvent prendre des décisions fondées sur des données concrètes plutôt que sur l'intuition. Ces décisions deviennent ainsi objectives et communicables, s'appuyant sur des preuves tangibles plutôt que sur des émotions ou des biais.

De plus, l'utilisation de métriques communes à travers les équipes et les projets facilite le partage d'expériences et l'amélioration continue. En collectant et en analysant ces données, les équipes peuvent mesurer les résultats de leurs efforts d'amélioration continue et partager leurs expériences à travers l'organisation.

## Conclusion

Les métriques DORA (Four Keys) offrent un cadre pour évaluer et améliorer la performance de livraison logicielle. Ces quatre indicateurs  permettent aux équipes d'être en amélioration continue, de répondre plus efficacement aux besoins des utilisateurs et, en fin de compte, de livrer des logiciels de meilleure qualité, plus rapidement et de manière plus fiable.

[Dans un prochain article](https://blog.hoppr.tech/tags/dora%20metrics), nous aborderons l'aspect pratique et verrons qu'il n'est pas si simple de mettre en place les métriques DORA, et surtout de les adapter au contexte métier et organisationnel de l’entreprise.



