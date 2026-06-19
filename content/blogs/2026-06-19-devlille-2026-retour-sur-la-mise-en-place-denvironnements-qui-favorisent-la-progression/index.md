---
title: "Devlille 2026 : Retour sur la mise en place d’environnements qui favorisent la progression"
date: 2026-06-19T07:15:49.811Z
description: "La semaine dernière, j'ai eu la chance d'assister à DevLille, l'un des rendez-vous incontournables de l'écosystème tech lillois. Au-delà des sujets purement techniques, plusieurs conférences ont parti"
image: ./assets/cover-image.webp
alt: "Photo de groupe au DevLille"
ogImage: ./assets/cover-image.webp
tags: ['2026', 'événement', 'veille tech', 'others']
published: true
authors:
  - id: 0bb914a6-f882-4951-bee6-53e8e8abb807
    name: Emmanuelle Gouvart
    image: ./assets/author-emmanuelle-gouvart.webp
    linkedin: https://www.linkedin.com/in/emmanuellegouvart-182b6ab2/
    x: 
reviewers:
  - id: e8163b24-7e01-41c5-adbf-0dc655f929d0
    name: Nicolas Zago 
    image: ./assets/reviewer-nicolas-zago.webp
    linkedin: https://www.linkedin.com/in/nicolaszago/
    x: 
    jobTitle: "CEO HoppR"
  - id: 33bf4462-cd38-80da-845c-c63b2fd024bf
    name: Florian Hirson
    image: ./assets/reviewer-florian-hirson.webp
    linkedin: https://www.linkedin.com/in/florian-hirson/
    x: 
  - id: 320f4462-cd38-8071-8eb7-f90621a068a3
    name: Marjorie Dieusart
    image: /default-author-image.webp
    linkedin: 
    x: 
---

<!-- markdownlint-disable-file -->


La semaine dernière, j'ai eu la chance d'assister à DevLille, l'un des rendez-vous incontournables de l'écosystème tech lillois. Au-delà des sujets purement techniques, plusieurs conférences ont particulièrement retenu mon attention car elles abordaient des enjeux très actuels chez HoppR : la culture de l'erreur, l'expérience développeur à grande échelle et les perspectives de carrière des experts techniques.

Voici les principaux enseignements que j'en retiens.

## Failure MUST be an option : faire de l'échec un levier d'apprentissage

_Par Olivier Breda - 45 min -_ [_Abstract_](https://devlille.fr/talk-page-514b8eb2-885c-4c24-ab24-cd575fb9b9bc/) 

Lors de sa conférence, Olivier Breda a abordé un sujet souvent inconfortable mais essentiel : l'échec

Nous produisons des logiciels qui ont des effets réels sur des utilisateurs, des clients et parfois même sur des organisations entières. Pourtant, lorsqu'une erreur survient, notre premier réflexe est souvent de vouloir nous cacher ou de chercher un responsable.



L'approche proposée est tout autre : comprendre avant de juger.

> Nous faisons mieux face aux situations que nous comprenons.

Les erreurs peuvent avoir différentes origines :

- un manque de connaissances ;

- une situation trop complexe ou imprévisible ;

- une inattention ;

- une décision intentionnelle qui s'est révélée mauvaise.

Dans les environnements complexes, notamment lors de phases d'expérimentation ou de testing exploratoire, il est impossible de tout maîtriser. Certaines erreurs sont même qualifiées "d'intelligentes" : elles résultent d'une prise de risque réfléchie dans un contexte d'incertitude.

L'objectif n'est donc pas d'éliminer toute erreur, mais de comprendre les causes racines et d'améliorer les systèmes qui les entourent.

Cette logique rappelle d'ailleurs de nombreuses découvertes majeures réalisées grâce à des essais infructueux : la pénicilline, le Post-it ou encore certains usages médicaux du Viagra.

### Les équipes performantes rendent visibles leurs erreurs

Un point particulièrement marquant concerne la sécurité psychologique.

Les équipes qui fonctionnent le mieux ne sont pas celles qui commettent le moins d'erreurs. Ce sont celles qui les remontent le plus facilement.

Lorsque l'erreur est sanctionnée :

- les problèmes restent cachés ;

- les équipes n'analysent plus leurs pratiques ;

- les mêmes erreurs se reproduisent.

À l'inverse, lorsque les difficultés sont visibles, il devient possible de réagir et d'ajuster rapidement.

L'intervenant évoquait notamment les "indicateurs pastèques" : verts à l'extérieur mais rouges à l'intérieur. Ces indicateurs donnent l'illusion que tout va bien alors que les problèmes s'accumulent sous la surface.

### Quel rôle pour les managers ?

La conférence s'est conclue sur une question essentielle :

**Est-ce que je crée un environnement de travail suffisamment sécurisant pour que les erreurs puissent être remontées ?**

Le rôle du manager est alors de :

- définir un cadre clair ;

- encourager la participation ;

- écouter les signaux faibles ;

- agir face aux difficultés ;

- chercher des solutions plutôt que des coupables.

Créer une culture de l'erreur ne signifie pas accepter la médiocrité. Cela signifie transformer chaque échec en opportunité d'apprentissage collectif.

Chez HoppR, cette idée résonne particulièrement avec notre manière d’accompagner les équipes. Dans un environnement où les technologies, les projets et les besoins clients évoluent constamment, il est illusoire de penser que tout peut être anticipé. En revanche, nous avons choisi de créer les conditions pour que chacun ose poser des questions, partager ses difficultés et apprendre de ses expériences. C’est aussi ce qui permet à nos consultants de progresser plus rapidement, de développer leur expertise et de construire une culture d’amélioration continue au service de nos clients comme de nos collaborateurs.

## 3 ans de DevEx pour 3000 ingénieurs : construire l'expérience développeur à grande échelle

---

Julien Roynette & Thomas Rumas - 45 min - [Abstract](https://devlille.fr/talk-page-cd139e37-593a-458b-859e-cba078578315/) 

Cette conférence présentait le retour d'expérience d'une organisation (Adéo) ayant structuré une démarche Developer Experience (DevEx) pour plusieurs milliers d'ingénieurs.

Le premier défi était simple en apparence :

**Qui sont réellement nos développeurs ?**

Les estimations variaient entre 1 000 et 5 000 personnes. En analysant GitHub, l'entreprise a identifié environ 2 500 développeurs actifs. Aujourd'hui, ce suivi est automatisé et permet de mesurer l'évolution de la population tech.

### Cartographier l'écosystème technique

Pour améliorer l'expérience des développeurs, il faut d'abord comprendre leur environnement :

- les technologies utilisées ;

- les dépendances des applications ;

- les outils du quotidien ;

- les usages occasionnels.

Un Tech Radar automatisé a été construit à partir de plusieurs sources de données (GitHub, FinOps, [SBOM](https://about.gitlab.com/fr-fr/blog/the-ultimate-guide-to-sboms/)).

L'objectif est double :

- faciliter les décisions technologiques ;

- donner à chacun une vision claire de l'écosystème existant.

Un portail central, le DevHub, est devenu le point d'entrée unique pour les développeurs.

### La communication comme accélérateur

La deuxième année s'est concentrée sur la communication.

Les équipes DevEx ont compris qu'identifier les problèmes ne suffisait pas. Il fallait également créer des espaces d'échange.

Parmi les initiatives mises en place :

- une newsletter technique hebdomadaire ;

- des événements de partage d'expertise ;

- des communautés organisées par technologies ;

- des démarches d'innersource permettant de contribuer à des projets transverses.

L'un des enseignements intéressants concerne justement l'[innersource](https://about.gitlab.com/fr-fr/topics/version-control/what-is-innersource/) : cette approche fonctionne très bien dans des communautés d'une centaine de personnes mais devient plus complexe à maintenir à grande échelle.

### Réinventer l'onboarding

L'onboarding a également été entièrement repensé autour de plusieurs dimensions :

- Compréhension de la stratégie technologique ;

- Découverte des outils ;

- Bonnes pratiques internes ;

- Accès à l'aide et aux communautés.

Grâce à l'automatisation et à l'intégration avec l'annuaire d'entreprise, les parcours sont préremplis selon les métiers et personnalisés dès l'arrivée du collaborateur.

Résultat : plus de 100 outils référencés et plusieurs nouveaux collaborateurs accompagnés chaque semaine via un parcours structuré.



Visuel de l’onboarding journey d’Adéo

Une démarche qui fait particulièrement écho à notre vision chez HoppR. Nous savons que l’expérience collaborateur ne se limite pas aux avantages ou aux processus RH : elle se construit aussi dans les outils, l’environnement de travail et la capacité donnée à chacun d’être efficace au quotidien. Faciliter l’onboarding, rendre l’information accessible et fluidifier les pratiques sont autant de leviers qui permettent aux consultants de monter en compétence plus rapidement et de se concentrer sur ce qui crée réellement de la valeur.

---

## Staff et Principal Engineer : créer une carrière d'expert sans passer par le management

Par François Descamps & Alexis Dubois - 45 min - [Abstract](https://devlille.fr/talk-page-4d5e40d0-3160-4d5f-ac40-f47073b914aa/)

La dernière conférence qui m'a marqué abordait un sujet récurrent dans de nombreuses entreprises : que propose-t-on aux experts techniques après plusieurs années d'expérience ?

L'un des intervenants a démarré avec une question révélatrice :

> Levez la main si votre entreprise a un plan de carrière clair pour vous après six ans d'expérience.

Peu de mains se sont levées.

### Pourquoi créer une filière d'expertise ?

Chez AXA, le constat était simple :

De nombreux experts techniques se retrouvaient bloqués dans leur progression. Pour évoluer, ils devaient souvent devenir managers, même lorsque ce n'était pas leur aspiration.

Cette situation générait de la frustration, une perte de reconnaissance et du turnover.

L'entreprise a donc décidé de construire une filière d'expertise structurée, ouverte à plusieurs métiers et pas uniquement à la tech.

Les objectifs étaient multiples :

- fidéliser les talents ;

- reconnaître l'expertise ;

- offrir des perspectives d'évolution crédibles ;

- renforcer les liens entre les métiers et l'IT.

### Mesurer l'impact plutôt que l'ancienneté

L'un des concepts les plus intéressants est celui de l'échelle d'impact.

L'évolution ne dépend plus uniquement du niveau de maîtrise technique mais de la capacité à influencer son environnement :

- son équipe ;

- sa tribu ;

- sa ligne métier ;

- l'entreprise ;

- voire son industrie.

Les rôles de Staff Engineer et Principal Engineer se distinguent notamment par leur influence transverse.

L'expertise est évaluée selon quatre dimensions :

Technologie : la profondeur technique et la capacité à résoudre des problématiques complexes 

Business : l’influence sur les décisions et les orientations stratégiques.

People : la transmission des connaissances et l'accompagnement des collaborateurs.

Visibilité : la capacité à partager son expertise, fédérer et convaincre à l'intérieur comme à l'extérieur de l'entreprise.



Visuel des quatre dimensions d’expertise 

### Trois ans plus tard : les résultats

Parmi les succès observés :

- une meilleure reconnaissance des experts ;

- une visibilité accrue auprès des RH et du management ;

- une plus grande qualité des décisions ;

- un signal positif sur la rétention des talents.

Mais plusieurs difficultés persistent :

- un impact business parfois insuffisant ;

- une transversalité complexe à mettre en œuvre ;

- des questions de gouvernance encore floues.

Un autre enseignement important : au démarrage, l'entreprise a voulu intégrer trop de personnes dans le dispositif. Certaines y voyaient davantage une promotion qu'un véritable rôle d'expertise.

L'accompagnement des managers s'est également révélé indispensable pour faire vivre durablement la démarche.

---

## Ce que je retiens de DevLille

Ces trois conférences abordaient des sujets très différents, mais elles partageaient finalement un même fil conducteur : la création d'environnements où les individus peuvent progresser.

Que ce soit :

- en apprenant de leurs erreurs ;

- en améliorant leur expérience quotidienne de travail ;

- ou en construisant des parcours de carrière adaptés à leurs aspirations.

La performance durable ne repose pas uniquement sur la technologie. Elle repose avant tout sur les systèmes, les pratiques et les cultures que nous mettons en place autour des personnes.

Et si le véritable enjeu des organisations de demain n'était pas seulement d'attirer les talents, mais surtout de leur permettre d'apprendre, de contribuer et d'évoluer durablement ?