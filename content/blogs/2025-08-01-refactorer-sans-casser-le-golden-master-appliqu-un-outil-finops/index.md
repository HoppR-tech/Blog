---
title: "Refactorer sans casser : le Golden Master appliqué à un outil FinOPS"
date: 2025-08-01T14:37:21.374Z
description: "appliqué à un outil FinOPS  Refondre un outil critique sans casser l’existant ? Pas simple. La mission était claire : continuer à faire évoluer la solution FinOPS de notre client tout en garantissant "
image: ./assets/cover-image.webp
alt: "Illustration d’un Golden Master sous forme de disquette"
ogImage: ./assets/cover-image.webp
tags: ['craft', 'veille tech', 'test', 'testing']
published: true
authors:
  - id: 23ff4462-cd38-8078-b550-c960c1e6ebdb
    name: Sandrine Miras
    image: ./assets/author-sandrine-miras.webp
    linkedin: https://www.linkedin.com/in/sandrine-miras/
    x: 
  - id: 70a8663a-742d-4937-a6d4-5cef079b12c8
    name: Théo Lanord
    image: ./assets/author-tho-lanord.webp
    linkedin: https://www.linkedin.com/in/th%C3%A9o-lanord/
    x: 
reviewers:
  - id: 197f4462-cd38-801b-859a-c33742e0ed0d
    name: Pierre-Emmanuel Denys
    image: 
    linkedin: 
    x: 
  - id: 174f4462-cd38-8061-bc88-f29602fcef5d
    name: Guillaume Ferlin
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/27c18bae-6c33-403c-b7fd-7d46ce96c376/Guillaume_Ferlin_Image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ULFPFZUH%2F20250801%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250801T143721Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG1mqZcKiAMfFxyUrFUGHfaT4CcUgj%2BLoBszrMnBcKdXAiAzDBfUqsdSt4Q4ipOxsQZieesJXoa7qrGJlD350URqQiqIBAjv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMdcI0v36Q64VtIlbtKtwDL%2BNrlFhdx1Ke4l94CtVPwXsIzuwNu4ZcUAnnbi29HkBC9nOvGrDrEzbdydY0p6ZBhhd3md7q1HhIgSeKa7dyJN84TeFlkYMgZCqmV2unHi2B%2FOvARfm7%2FhpF7VKbXYFsssXA7%2Bojou0hb%2BeRXUjjqCHJ%2B4l%2B7wkgzufa9aS4OaGfoJj%2Bld06GnqJMjNrzMpCcjxyzOo5BUDGxv8H8Q%2FEZCQKeeG%2B%2BlffOAHpbcaa4YGG6ebhh4PwCZNiJtrMsLlTT076jFJEYyG%2FIUmyXY4pwPYuhX3kceWV2%2FFdZ7xLvvLK3STrjdcHfinSzf2bvjKmSInnRVf27B7QpS0SlvzQBtEX2g4EI7bUDbw2z5x4pgPfhceoX6R2yZFzaC48izTkcsmmwOQLDY6Rl8iAShSURx%2FM1JLq0ThwFdiAosmqhKfgxrbfOMr9KcPyfPdXPWmstqwaMS%2BJdk19a21v0ttyf84J3D6hCTKffSJFn7jsqJcyq78gEqO%2BTUkrs%2BAgLlQSz7kXSXYTkSmI8xTtl8FYscnz61uH2KOCBJlHLjZMCm4ElhjNho1hCnj9FJOQQfXHxJzBtxnkb%2Bs%2B9BAcvtzVNIdr0zxoPc5qttMsp9p88RALtgdpzRGjaWXRUtYwkZazxAY6pgFtPfWHqkUKY%2B2ZtC9UZtQu8d9o%2BD1i%2Bqs2B8iimvVqpJnlCAkGL3KSV%2FlDPd0PrFfrsiTf1gF4CPLtVb1N68fdMMUv8TCpVC0sFfHn0jeqyzT3FBPezG14nCfqkWX8j9%2BjSxTk7XNBg1y5YP0c0GoLFvWODluLCeivL8O%2Fq%2BwV8BmSxNj8HIaH5NBPkmvFN13vcIrHIoEQ41kIRqSdpc5l8AttcKt3&X-Amz-Signature=b37ba0b7d8ebcfef63a5b3d2f7b75ff8c4c2539d2f6e8b41d1a5d76e62704901&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
    linkedin: https://www.linkedin.com/in/guillaume-ferlin-262681272/
    x: 
  - id: 188f4462-cd38-80d5-b9e6-ec28a94d11e5
    name: Bastien Dufour
    image: 
    linkedin: 
    x: 
---

<!-- markdownlint-disable-file -->


# Refactorer sans casser : le Golden Master
appliqué à un outil FinOPS

Refondre un outil critique sans casser l’existant ? Pas simple.
La mission était claire : continuer à faire évoluer la solution FinOPS de notre client tout en garantissant que chaque chiffre affiché reste juste. Parce qu’ici, une erreur, ça ne se compte pas en lignes de code… mais en euros.

Pour sécuriser le projet, Théo Lanord, consultant et développeur Full Stack chez HoppR, a choisi une arme simple et efficace : le Golden Master. Une pratique Craft qui n’est pas systématiquement utilisée, mais qui peut sauver un projet. On lui a demandé : pourquoi cette méthode, et qu’est-ce que ça change concrètement ?

## Théo, c’était quoi le contexte quand tu es arrivé sur le projet ?


**Théo :**
_« J’ai rejoint l’équipe tech d’un acteur majeur de la distribution présent dans plusieurs pays, qui développe et maintient des outils internes pour les entreprises du groupe._ _Leur mission est de fournir des services fiables et industrialisés à toutes les équipes de développement du groupe, pour qu’elles puissent livrer rapidement et en toute sécurité._

_Pour ça, on s’appuie sur un écosystème_ allant de _GitHub pour le versioning, GitHub Actions pour automatiser les déploiements, SonarQube pour analyser la qualité du code, Ghas pour la sécurité, JFrog pour gérer les images, Jira pour le suivi et enfin Confluence pour la doc. Bref, un environnement complet mais complexe, où tout doit s’enchaîner sans faille._

_Dans ce contexte, l’outil FinOPS est un produit clé. Il analyse la consommation des ressources Cloud et la traduit en euros permettant aux différentes entités du groupe de savoir combien elles dépensent et sur quoi._ _L’enjeu est fort_ puisque chaque entité _a ses propres projets, ses propres besoins, et doit pouvoir maîtriser ses coûts._

_Avant, il y avait un budget global pour tout le monde. Aujourd’hui, on est dans une logique de refacturation interne par Business Unit. Ça change tout : chaque équipe doit rendre des comptes et optimiser sa consommation. Et cet outil est le cœur de ce pilotage. »_

## Où se situait le challenge principal ?



**Théo :**
_« Le problème, c’est que l’entreprise utilisait déjà un outil FinOPS au quotidien. Mais on devait le faire évoluer sans compromettre son fonctionnement actuel. Or, il y avait peu de tests automatisés pour garantir que les comportements en place resteraient corrects._

_Quand tu touches à un code hérité sans filet de sécurité, chaque modification est un pari risqué. Tu peux introduire des régressions invisibles… qui auront un impact direct sur la facturation et les arbitrages budgétaires. Et là, l’erreur ne se compte pas en millisecondes de temps de calcul mais en milliers d’euros. »_

## Pourquoi avoir choisi le Golden Master ?

_« Parce qu’on avait besoin de figer le comportement actuel avant d’aller plus loin. Le Golden Master, c’est une pratique simple mais redoutablement efficace :_

- _On capture l’existant en enregistrant les entrées et sorties du système._

- _On crée une “photo” de référence qui servira de point de comparaison._

- _À chaque évolution, on compare les résultats à cette référence pour détecter toute régression.
En clair, c’est comme mettre un miroir en face du logiciel : tant que l’image reste identique, tu sais que tu n’as rien cassé. Ça nous a permis de refactorer, modulariser et optimiser le code en toute sérénité, sans réécrire tout le produit. »_

👉 **Pour résumer**, on peut définir le Golden Master comme une méthode de validation utilisée principalement dans les tests de non-régression. Elle consiste à conserver une version de référence du comportement attendu d’un système – souvent sous forme de données d’entrée et de sortie – afin de pouvoir comparer automatiquement les résultats des versions futures et garantir qu'aucune modification n’altère le fonctionnement prévu.



![Mise en avant de l’importance de la comparaison des output dans le Golden Master](./assets/img1.webp)

## La méthode du Golden Master est parfois critiquée. Était-elle la meilleure solution dans ce contexte ?

_« Si tu pars from scratch, tu peux faire autrement. Mais dans une situation comme celle-ci, un outil critique, déjà en production, avec des impacts financiers, c’est une assurance vie. Le Golden Master, c’est comme mettre un filet sous un funambule : tu avances serein, tu sais que même si tu tombes, tu ne te blesseras pas._ 

_A noter que_ _ça ne remplace pas les tests unitaires ni le TDD. Ça vient en complément, comme un filet de sécurité quand tu n’as pas d’historique fiable. Et ça s’inscrit parfaitement dans une logique Craft : on ne fait pas de la qualité “pour faire joli”, on le fait pour apporter de la confiance et réduire le risque métier. »_

**👉 Le Golden Master en 3 points clés :**

- **Objectif :** prévenir les régressions dans un code hérité.

- **Quand l’utiliser :** reprise de legacy sans confiance dans les tests actuels.

- **Limite :** il ne valide pas la justesse métier, mais garantit la stabilité des comportements existants.

## Et concrètement, quel a été l’impact pour le client ?


_« On a pu faire évoluer le produit plus efficacement, avec moins de stress, parce qu’on savait qu’on ne casserait rien d’essentiel. L’équipe a gagné en sérénité, le client en fiabilité. Et au-delà de la technique, ça a changé notre_ _posture_ _en tant que consultant et celle de notre client en tant qu’utilisateur: on peut refactorer en toute confiance, innover sans risquer de mettre en péril la facturation. »_

## Si tu devais résumer, pourquoi le Craft est indispensable dans ce genre de projet ?


**Théo :**
_« Parce que ça crée de la confiance. Pour les devs, qui savent qu’ils peuvent intervenir sans crainte. Pour le client, qui sait que son outil critique ne tombera pas à cause d’une évolution mal contrôlée. Et cette confiance, ça se traduit par plus de qualité, plus de sérénité et plus de vitesse. »_

Chez HoppR, on croit que la qualité n’est jamais un luxe, mais une assurance. Le Golden Master est une des pratiques que nous utilisons, mais pas la seule : TDD, pair programming, revue de code… autant de leviers pour livrer des solutions robustes.

Merci de votre lecture ! 
