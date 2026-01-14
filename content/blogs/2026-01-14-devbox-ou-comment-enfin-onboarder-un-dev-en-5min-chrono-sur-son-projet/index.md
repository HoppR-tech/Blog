---
title: "Devbox, ou comment (enfin) onboarder un dev en 5min chrono sur son projet"
date: 2026-01-14T14:07:08.940Z
description: "**Le scénario est un classique du film d'horreur en entreprise.**  C'est le \"Day 1\" d'un nouveau développeur. Il est motivé, son café est chaud, sa machine est prête. On lui donne l'accès au repo. Il "
image: ./assets/cover-image.webp
alt: "Caisse à outils futuriste \"DEVBOX\" d'où émanent des outils virtuels et des logos de langages de programmation, posée sur un établi technologique avec un cube Docker lumineux."
ogImage: ./assets/cover-image.webp
tags: ['devops', 'cloud-platform', 'craft', 'veille tech']
published: true
authors:
  - id: 45c76823-ab7d-4c1f-84b3-0bad16ab91e1
    name: Paul-Alexandre Chrétien
    image: ./assets/author-paul-alexandre-chrtien.webp
    linkedin: https://www.linkedin.com/in/paulalexandrechretien/
    x: 
  - id: 70a8663a-742d-4937-a6d4-5cef079b12c8
    name: Théo Lanord
    image: ./assets/author-tho-lanord.webp
    linkedin: https://www.linkedin.com/in/th%C3%A9o-lanord/
    x: 
  - id: 838dec96-f9fc-404f-a302-07719225d785
    name: Maxime Deroullers
    image: ./assets/author-maxime-deroullers.webp
    linkedin: https://www.linkedin.com/in/maxime-deroullers-1b5791137/
    x: https://x.com/mderoullers
reviewers:
  - id: 67adfd77-4b84-4496-b55d-3391541f59c5
    name: Michaël Bernasinski
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/82ebd0fe-de28-43f3-ab7b-0431af41baad/Photo_HoppR.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WN3QLNCE%2F20260114%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260114T140708Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFYaCXVzLXdlc3QtMiJHMEUCIFD3v6TLnk5GmyhshqA5BlfwHhBJHcTihKFMH1xh8FAAAiEA6B%2F6vytfoyOMPoOmMOnmMsfzWqvIbVIVyk9SxRBOb5Uq%2FwMIHxAAGgw2Mzc0MjMxODM4MDUiDL6nPHU6OObivJIC6yrcAw%2BGMSR0gWkd909KwYy29%2BOOtd07YmkbUBPfyKQy5r44ubZUvnyvSe0bsnZlS%2BiruXV%2BAGH1i6YY8%2FfO0eW3%2F6bHTqgYg4jmlDqi3uQUyvSa%2B9ROYDaQonWsR1xQGJFRh3Q0FO67nIAv%2FDdPhejHVyc3bu5Yw6WNUkEb8av9H113ExC32mV6U3wm1Glrfc4rYfmQRxxrI9tyYnqjb17BDGot7eqAk5vTw2WgEqj1yLJfwOvOc9Vuvj2TDCT6XHPDxcraBQrDGZdVPhGEWQVOha%2BX0ZXI4ITciElRdlYY%2B4Xxf56q8ql1BFwBeWrjA7zO89T1ldzL4DYM6VVsTI%2BVD8ynF7EoZSRQoDt3FBWNyq0c1mkW%2BJKMcE8sYeppX8dTMf2fLezwknNN0aLAHVZnK4XxoAraRFbu3BRS1JQYOiMEle%2FtcErTA3X1Ta1llKaHRPRxdhMXr5uxW5D9%2BLLE%2B32QkD41lsPHdo%2FOOIPaaf8nG6mGZ6ZBUZnwpIjT8dntPtp3pI2c8d7f7VkQvVivaHWIc72JqjEavGmr4f01RxRFzPXzBA2c5Of4DJfXt3ZzRfhvCzATG5HpgWu5GVBFuYViCkRLytXHpet%2BTTZFhl5dlnBcBH%2Bnqkyy%2FJoJMJy%2FnssGOqUBaV15zB5j5%2BzO0TjePo5cVh5oNvLqVlrJGOL%2BiCjTFmTh%2Bq9TqZAWqhBDL%2Fow4sOiBPVNznBM5914QXUCD%2BT%2BryQHcsg5HeY2UQ6h1yy0DP4ktlenXm4U%2BcfXro6crhACbchkrLUpf2qANNrGa2I1SHj2%2F0yVPzquFLuh52qN6R9WsGQToQ9%2FlG3dzMlsgTMwiceoH4DcDiVxprDPl%2BIIjFNGb2lK&X-Amz-Signature=ba45c2556cf07a2dee7a1066cc21084b7f2a43679687bbef04b8c401bf1a63e5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
    linkedin: https://www.linkedin.com/in/michael-bernasinski
    x: 
---

<!-- markdownlint-disable-file -->


**Le scénario est un classique du film d'horreur en entreprise.**

C'est le "Day 1" d'un nouveau développeur. Il est motivé, son café est chaud, sa machine est prête. On lui donne l'accès au repo. Il clone. Il lance le projet.

Et là, le drame :

🔴 _Error: Node version 18.x required (found 14.x)._

🔴 _Error: libssl.so.1.1: cannot open shared object file._

S'ensuivent deux jours de "bricolage". On modifie le `.zshrc`, on installe `nvm`, `jenv`, `pyenv`, on casse la config d'un autre projet... Le fameux "purgatoire de l'environnement local".

L'onboarding ne devrait pas être une cérémonie mystique. En 2026 ça devrait être un simple script. Surtout si l’on rapporte cela à l’échelle du nombre de développeurs et consultants avec une moyenne (ambitieuse) de 2 ou 3 jours à chaque démarrage. Que de temps perdu ! 

Et si le fichier de configuration de votre projet suffisait à installer tous les outils, sans la lourdeur de Docker ?

C'est la promesse de [**DevBox**](https://www.jetify.com/devbox) **: une boîte à outils en ligne de commande qui transforme un simple fichier de configuration en un environnement de développement complet, isolé et nat****if.**  Lancé en 2022 par l'entreprise Jetify, le projet open-source connaît une adoption rapide et cumule déjà plus de 11K étoiles sur GitHub.

## DevBox : La puissance de Nix, sans la douleur

Pour comprendre l'intérêt de DevBox, il faut d'abord saluer le moteur qui tourne en dessous : [**Nix**](https://nixos.org/).

Nix est le Saint Graal de la gestion de paquets : il est purement fonctionnel, immuable et garantit qu'un paquet installé aujourd'hui sera identique au bit près dans 10 ans.

**Le problème ?** Nix est notoirement difficile à apprendre. Il demande de maîtriser un langage de configuration complexe et verbeux. C'est souvent un frein rédhibitoire pour les équipes qui veulent juste coder.

**C'est là qu'intervient DevBox.**
Voyez DevBox comme une "télécommande simplifiée" ou un _wrapper_ élégant.

- **Sans DevBox :** Vous devez écrire des scripts `.nix` cryptiques pour configurer votre environnement.

- **Avec DevBox :** Vous remplissez un simple fichier `devbox.json` (aussi facile à lire qu'un `package.json`) et l'outil se charge de "parler" à Nix pour vous.

Maintenant que la barrière technique est levée, quelle est la différence d'expérience par rapport à Docker ? Utilisons une analogie simple :

- **Docker, c'est l'hôtel.** C'est standardisé, isolé, sécurisé. Mais vous n'êtes pas chez vous. Les fichiers sont montés via des volumes (lent), le réseau est une couche supplémentaire. C'est parfait pour la Production.

- **DevBox, c'est la Réalité Augmentée.** Vous restez chez vous (votre terminal natif, votre OS). Mais quand vous enfilez les lunettes (quand vous lancez DevBox), les outils dont vous avez besoin apparaissent comme par magie. C'est natif, instantané, et ça disparaît quand vous les enlevez.

## La Preuve par l'Exemple (Le "5 Minutes Challenge")

Assez de théorie. Prenons un cas concret qui parle à tout Tech.

Imaginez un projet Python un peu capricieux qui nécessite :

- **Python 3.10** (alors que votre système est en 3.12).

- **Poetry** pour gérer les paquets.

- Un client **PostgreSQL** spécifique.

Avec DevBox, voici à quoi ressemble l'installation :

### Étape 1 : Création du contrat 

Dans votre dossier projet, initialisez l'environnement.

```bash
devbox init
```

### Étape 2 : L'installation isolée

Ajoutez vos outils. DevBox va chercher les binaires pré-compilés (pas de compilation interminable).

```bash
devbox add python@3.10 poetry postgresql
```

### Étape 3 : L'activation

Entrez dans la matrice.

```bash
devbox shell
```

C'est fini.

Si vous tapez `python --version`, le terminal vous répondra 3.10, même si votre système est pollué par d'autres versions.

Pour le nouveau développeur qui arrive, l'onboarding se résume désormais à deux commandes :

`git clone` et `devbox shell`.

## Sous le capot : Pourquoi c'est fiable ?

Je sais ce que vous pensez : "Encore un wrapper node qui va casser mon PATH ?"

Non. DevBox est une interface accessible pour Nix, l'un des gestionnaire de paquets les plus robustes.

- **Le Store Immuable :** DevBox n'installe rien dans `/usr/bin`. Tout va dans `/nix/store`, en lecture seule. Vous pouvez avoir 10 versions de Node.js côte à côte, elles ne se connaissent pas.

- **L'illusion du Shell :** Quand vous lancez le shell, DevBox modifie temporairement votre `PATH` pour pointer vers ces versions isolées.

- **Le Cache Mutualisé :** C'est là que DevBox brille. Si vous avez cinq projets en Node 18, DevBox ne le télécharge qu'une seule fois. Contrairement à Docker qui réinstalle l'OS à chaque image, DevBox partage les binaires communs. Gain de place, gain de temps.

## **Docker & DevBox : Le bon outil au bon endroit**

DevBox et Docker ne sont pas concurrents. Ce sont deux couches différentes de votre stack. Voyez DevBox comme votre Boîte à Outils ultime (Toolbox). Son rôle est de préparer votre établi. Elle vous apporte les langages (Python, Go) et les clients (CLI) nécessaires pour travailler.


Et devinez quoi ? Parmi ces outils, DevBox peut parfaitement installer et configurer... Docker ou Kubernetes.


**Le scénario idéal pour simuler la Production :** vous voulez reproduire un environnement de production complexe (Microservices sur K8s) ?


1. **DevBox** installe les _commandes_ : `kubectl`, `helm`, `terraform`, `aws-cli` (dans les versions exactes de la prod).
2. **DevBox** lance les _scripts_ : Il configure l'accès à votre cluster local.
3. **Docker/K8s** exécutent les _services_ : Ils font tourner les bases de données et les conteneurs applicatifs.


DevBox est le chef d'orchestre, Docker est l'un des instruments.

| Rôle | DevBox (La Boîte à Outils) | Docker / Kubernetes (L'Infrastructure) |
| --- | --- | --- |
| Rôle | DevBox (La Boîte à Outils) | Docker / Kubernetes (L'Infrastructure) |
| Mission | Gérer l'outillage.  S'assurer que le développeur a les bonnes clés à molette. | Exécuter les services.  Faire tourner les briques logicielles lourdes. |
| Ce qu'il contient | Compilateurs (Go, Rust), Interpréteurs (Node, Python), CLI ( docker ,  kubectl ,  terraform ). | Bases de données (Postgres, Redis), Message Brokers (Kafka), Applications conteneurisées. |
| Philosophie | "Je prépare ton environnement de travail." | "Je simule ton environnement de production." |


## Conclusion :  un JSON to run them All

L'infrastructure-as-code a révolutionné la production. Il est temps qu'elle révolutionne l'onboarding. Vos équipes ne devraient pas perdre de temps à configurer des outils. Elles devraient mettre leur énergie sur les tâches où elles ont un maximum de valeurs. 

