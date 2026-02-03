---
title: "Le Manifeste du Platform Craftsmanship : L'engagement HoppR"
date: 2026-02-03T11:10:29.021Z
description: "Dans le monde du développement, le _Software Craftsmanship_ a rappelé que le code n'est pas une simple commodité, mais un artisanat. Chez **HoppR**, nous pensons qu'il est temps d'appliquer cette même"
image: ./assets/cover-image.webp
alt: "Platform Craftsmanship Manifesto par HoppR - L'alliance de l'artisanat et du Cloud DevOps"
ogImage: ./assets/cover-image.webp
tags: ['plateform engineering', 'cloud-platform', 'craft', 'devops']
published: true
authors:
  - id: 45c76823-ab7d-4c1f-84b3-0bad16ab91e1
    name: Paul-Alexandre Chrétien
    image: ./assets/author-paul-alexandre-chrtien.webp
    linkedin: https://www.linkedin.com/in/paulalexandrechretien/
    x: 
reviewers:
  - id: 0bb914a6-f882-4951-bee6-53e8e8abb807
    name: Emmanuelle Gouvart
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c88f5dfa-16db-4e6f-acf1-34dd80ee8766/emma_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UOV6GZ74%2F20260203%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260203T111028Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDMaCXVzLXdlc3QtMiJHMEUCIQD6Xyjo9rBgI%2BiSNB06ysaRWlEErYThlHdyupC4mg6OfwIgeNXezDDUaziy4g%2F8AJ24c4Uu0XH2LvdJI%2FDifqoDE5sqiAQI%2FP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDImm6RPPUAAURsSINyrcA5yvDNzDU25JinN6%2FCQ0N5f5pLF62qj6gCNdwKdSFNsFgZvPmi%2B5XmL3yRjR0YHUbqR8C%2FGSTnhvnNHLQeo3aSM9p5Y%2BA40LpF9ZmshckX4DpZThaH5MiaDl4S6XeGjBMqrnfQgSIBoPxbJxbdzXVu9GGQHxG5ZGiDXR3k%2FeRoFKG02CMxVBIeXnjcZrRExNaoh3bkl5edW1TggLVcOOlinHNG8nX2BGeTRD230AktYA0mfa%2FPb7K4zrE4W7xiv5MqOF3Sqf86hJIgDpJsm9nZkiRwR%2B45OOxp4VrB64L4D9lPKNBlRcaoLvlls2%2BBE5ONDWwYDeye3tbgGrl894pomySdjg%2BoCUPylDKExU2W4CaQXBLxBSO1ib2E2w5nlKUqLeaEuX%2B85Kp9QHpfCT7J5TrOJW96aT5kJf8mx1EaFzMD7XJ3YrYJbJ8Lq2Vwyf5C%2FWgoxnQLIjgv2IJpNhdHonnJooOPUbVQHXmKCjvxi3e%2F6xCL0tWsv2fJezKpr9Srt%2FFFH%2FjrBiVnxLR41yrkMcoKBBXfjF5qwPezkdSPvjwBeDG3YdZh0BRzEOpKjjl9QAYUFuQq7JdvmKV1tN%2Bl3sPvgGp87rug0GymKWAGT5IoyAa9LGY6EqbIgeMJiih8wGOqUBhj0Jgyltd2MkQOGI%2BPkpkl3EnVNkjxMFs5hzA7FfunDz3RMyq83%2BjRJBMRkguGb0%2FYNEK%2FzeeVARgjo%2FQIeQDSwqz5y1kMvQwnESP99TfcR%2BeFkbAB9ytqe26Lrz1Ngd2iVyANLEvo5sVw5rTrG6JjSG60McNLMPXS2FlwCtZZ2NRrnZj8AQbGPbdmeCFLfkO9FLKB%2FAgmEPSk%2BWurHfw7O8S0u9&X-Amz-Signature=be52c0a8f0df4d8ac737692d68ab0319fb85093713bb4b58bf60cfc58a95814c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
    linkedin: https://www.linkedin.com/in/emmanuellegouvart-182b6ab2/
    x: 
---

<!-- markdownlint-disable-file -->


Dans le monde du développement, le _Software Craftsmanship_ a rappelé que le code n'est pas une simple commodité, mais un artisanat. Chez **HoppR**, nous pensons qu'il est temps d'appliquer cette même exigence à l'infrastructure.

Le **Platform Engineering** ne doit pas être une usine à gaz technique, mais un ouvrage d'art au service de ceux qui créent la valeur : les développeurs.

Voici les quatre piliers de notre manifeste.

### 1. L’expérience au-delà de la technique

> Pas seulement des logiciels bien conçus, mais aussi des plateformes au service des développeurs.

Une infrastructure peut être techniquement parfaite mais inutilisable. L'ingénieur plateforme ne se contente pas de "monter un cluster K8s". Il conçoit une **Internal Developer Platform (IDP)** pensée pour la fluidité et l'autonomie.

- **La vision HoppR :** Si un développeur doit ouvrir un ticket pour obtenir une base de données, la plateforme a échoué. Le Craftsmanship, c'est offrir le "Self-Service" sans sacrifier la sécurité.

### 2. La vision au-delà de la livraison

> Pas seulement l’ajout constant de valeur, mais aussi une vision continue.

Livrer des fonctionnalités infra ne suffit pas si on avance à l'aveugle. Le Craftsmanship impose une transparence totale du système.

- **La vision HoppR :** Nous intégrons l’**observabilité** nativement. Une plateforme "Crafted" est un système transparent et mesurable, où chaque décision est guidée par la donnée et alignée sur la stratégie long terme de l'entreprise.

### 3. La responsabilité au-delà de la performance

> Pas seulement une communauté de professionnels, mais aussi des personnes responsables.

L'ingénieur plateforme moderne ne peut plus ignorer l'impact de son travail. Il est responsable de son empreinte.

- **La vision HoppR :** Nous intégrons le **FinOps** (contrôle des coûts) et le **GreenOps** (durabilité) dès la conception. Être un professionnel responsable, c'est garantir que la plateforme est aussi efficiente pour le budget de l'entreprise que pour la planète.

### 4. Le sens au-delà de la tendance

> Pas seulement des partenariats productifs, mais aussi une innovation porteuse de sens.

L'IA et les technologies émergentes sont partout, mais le Craftsmanship refuse le "hype-driven development".

- **La vision HoppR :** Nous utilisons l’IA comme un levier d’accélération et non comme un gadget. Innover avec sens, c'est choisir l'outil qui apporte un résultat concret, pas celui qui fait simplement parler sur LinkedIn.

---

### Pourquoi ce manifeste change la donne pour nos clients ?

En recherchant les éléments de gauche: la qualité, la valeur, le professionnalisme et le partenariat, nous avons réalisé que les éléments de droite: DevEx, Observabilité, FinOps, Innovation choisie, sont les véritables piliers de la réussite moderne.

Le **Platform Craftsmanship** n'est pas qu'une philosophie ; c'est notre méthode de travail chez HoppR pour transformer votre infrastructure en un avantage compétitif durable.

---

### 