---
title: "Ce que 6 000 € de crédits IA ont produit en 7 jours"
date: 2026-11-09T08:26:15.846Z
description: "En une semaine, j'ai consommé environ 6 000 € de crédits Azure Foundry avec Claude Opus 5.5 pour mener une demi-douzaine de chantiers en parallèle : l'équivalent d'environ douze mois de travail d'ing"
image: ./assets/cover-image.webp
alt: "6000€ de credits"
ogImage: ./assets/cover-image.webp
tags: ['ia']
published: true
authors:
  - id: 3d0f4462-cd38-80c3-9ded-e6303c15ff2f
    name: Nuno
    image: /default-author-image.webp
    linkedin: 
    x: 
reviewers:
  - id: 368f4462-cd38-8007-a70f-e818475f22df
    name: Nathan Delenclos
    image: ./assets/reviewer-nathan-delenclos.webp
    linkedin: https://www.linkedin.com/in/nathan-delenclos/
    x: 
  - id: 188f4462-cd38-80d5-b9e6-ec28a94d11e5
    name: Bastien Dufour
    image: ./assets/reviewer-bastien-dufour.webp
    linkedin: https://www.linkedin.com/in/b-dufour/
    x: 
    jobTitle: "Senior Software Engineer"
    bio: "I use vim btw"
---

<!-- markdownlint-disable-file -->


# Ce que 6 000 € de crédits IA ont produit en 7 jours

En une semaine, j'ai consommé environ 6 000 € de crédits Azure Foundry avec Claude Opus 5.5 pour mener une demi-douzaine de chantiers en parallèle : l'équivalent d'environ douze mois de travail d'ingénieur, dont une grande partie est déjà en production ; le tout, sans incident.

## Le dispositif : des agents en parallèle, jour et nuit

L'expérience repose sur un principe simple : ne pas faire travailler un agent après l'autre, mais en lancer plusieurs en même temps, chacun sur un chantier distinct.

Le modèle principal était Claude Opus 5.5, déployé sur Azure Foundry. J'ai réglé son niveau d'effort selon l'enjeu : _xhigh_ sur les sujets où une erreur coûte cher (audits, choix d'architecture), _medium_ sur les tâches plus mécaniques. Pour la relecture de la documentation, un agent Opus pilotait plusieurs [sous-agents](https://blog.hoppr.tech/blogs/2026-08-19-prompt-tokens-mcp-harness-le-lexique-ia-a-connaitre-en-2026#les-subagents) [DeepSeek](https://www.deepseek.com/), moins coûteux, chargés de relire page par page le code ou documentation, en fonction du chantier.

## Ce qui a été produit

L'agent était en charge des 6 chantiers suivants, chacun de nature très différente, tous exécutés en parallèle. Et oui, c'est la beauté des agents : puisqu'ils n'ont pas besoin de sommeil, ils ont pu tourner 24h/24. Je vous joints également le temps estimé si j'avais réalisé les tâches à la main, jusqu'à leur mise en production.

| Chantier | Ce qui a été livré | Effort estimé en manuel |
| --- | --- | --- |
| Application de gestion d'un catalogue de produits | Refonte d'architecture, tests de non-régression, collections Bruno générées automatiquement à partir des tests | 2 mois à temps plein |
| Application métier de recouvrement | Correctif en urgence, documentation Markdown réutilisable sur le projet | 1 semaine |
| Simulateur de crédit amortissable | Suppression du code mort, correctifs, refonte d'architecture et de code | 3 à 4 mois |
| Générateur de dossiers d'architecture et de capacité | Génération automatique à partir des processus et des informations à saisir, CLI pour que les équipes contribuent, skills dédiés (par exemple pour produire les fichiers YAML de schéma et de capacité à partir d'Elastic) | 3 mois |
| Outil de transfert de fichiers vers une  GED  interne | Projet réutilisable, du disque ou d'un blob vers la GED  | 2 mois |
| Frameworks partagés, dont celui d'intégration GED | Refonte et mise à jour vers les dernières versions, au bénéfice de tous les projets qui les utilisent | 1 mois |


_GED étant Gestion électronique de documents._

S'y ajoutent des audits transverses, que je n'ai pas chiffrés, comme des choix techniques d'architecture, la construction d’images de conteneurs ou encore les performances d'une API.

## Le calcul : 6 000 € contre environ 250 jours de travail

En additionnant les estimations du tableau, on arrive à près de douze mois, soit autour de 250 jours de travail à temps plein.

Le rapport coût/valeur dépend du coût journalier que l'on retient, mais il reste très favorable même avec une hypothèse prudente : au-dessus de 1 pour 15. Ce calcul ne compte ni les audits transverses, ni la valeur des tests de non-régression, des collections Bruno et des skills, qui réduiront leur coût.

La vraie différence, pour moi, n'est pas seulement financière. L'IA nous offre cette opportunité folle d'enfin pouvoir adresser ces chantiers pour lesquels nous n'avons jamais le temps. Mais si, vous savez, ceux la : refontes, mises à jour de frameworks, nettoyage de code mort, etc..

## Les garde-fous : rien n'est parti en production sans validation

Produire vite ne dispense pas de contrôler. Aucun livrable n'est passé directement de l'agent à la production.

- Trois à quatre semaines de passage sur nos environnements internes d'UAT (**User Acceptance Testing**)

- Des tests de non-régression exécutés par les équipes QA

- Une vérification humaine en amont de chaque livrable

- Des tests de non-régression ajoutés au code, qui renforcent la couverture sur la durée

Résultat : une grande partie des livrables est aujourd'hui en production, sans incident à ce jour, le reste attend sagement que sont tour viennent. Le gain vient de la vitesse de production du code, pas d'un contournement des contrôles.

## Ce que j'ai appris sur le coût

Soyons honnêtes : 6 000 € en une semaine, ce n'est pas anodin, et une partie de cette somme aurait pu être évitée. Le niveau d'effort maximal et le nombre d'agents en parallèle font vite monter la facture.

Si je recommençais, je ferais trois choses de plus.

- Fixer le niveau d'effort par type de tâche avant de lancer, plutôt qu'au fil de l'eau

- Confier davantage de relecture à des modèles moins coûteux, comme je l'ai fait avec DeepSeek sur la documentation

- Suivre la consommation en continu, plutôt que la découvrir à la fin de la semaine

Il faut aussi cadrer ce que les agents peuvent faire seuls. Un agent qui travaille la nuit sans supervision a besoin d'un périmètre clair et de permissions limitées.

## Ce qui reste, et la suite

La dépense n'a pas seulement produit du code livré : elle laisse des outils que d'autres équipes peuvent reprendre.

- Un outil de transfert vers la GED, réutilisable par tous

- Un générateur de schema d'architecture et de capacité, avec sa CLI permettant de le consommer

- Des skills propres aux projets, qui rendent les prochains chantiers moins coûteux, ex: génération du fichier YML en consommant l’outil d’observabilité; modification du projets de ce qu’il faut et ne faut pas faire et quoi vérifié en priorité, pour ne pas retomber sur les mêmes pièges

- Des frameworks partagés à jour pour tous les projets

- De la documentation Markdown qui capitalise les méthodes et les correctifs

Ma conclusion : l'IA agentique à cette échelle vaut le coup quand les chantiers sont bien cadrés, que le coût est piloté et que la validation des QA reste en place. La prochaine étape est de généraliser l'approche à d'autres équipes, avec un budget plafonné par chantier, afin de s’assuré du cadre par subagent.

