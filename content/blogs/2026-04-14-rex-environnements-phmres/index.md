---
title: "REX: Environnements éphémères"
date: 2026-04-14T07:29:50.497Z
description: "Tout au long de ma carrière de développeur web, une question s’est toujours posée : comment tester une nouvelle fonctionnalité développée ? Une anomalie corrigée ?  Certes les tests automatisés répond"
image: ./assets/cover-image.webp
alt: "Image d’illustration, une usine à environnements éphémères qui sont créés, validés puis détruits"
ogImage: ./assets/cover-image.webp
tags: ['craft', 'rex']
published: true
authors:
  - id: 67adfd77-4b84-4496-b55d-3391541f59c5
    name: Michaël Bernasinski
    image: ./assets/author-michal-bernasinski.webp
    linkedin: https://www.linkedin.com/in/michael-bernasinski
    x: 
reviewers:
  - id: 0bb914a6-f882-4951-bee6-53e8e8abb807
    name: Emmanuelle Gouvart
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c88f5dfa-16db-4e6f-acf1-34dd80ee8766/emma_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663EVYACVJ%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T072949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEL7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIGZtaRbA4cSdTwdKuo6iJWkH8%2F7Mf4%2F7P2W6PXte3kjGAiEAok6aw4VityW2XGt3RF9AGdcuCRas9ZE5wwRFKdD8whcqiAQIh%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDJYMPZlPCPZ%2B%2BEq4XyrcA0HVbqp5SrmxfwBpOmpGhgMIg2gTLjV3M6tzdLTdz1DY3m5Zswt94ObBgZT2zhyiePmuVZBd1Yg1lc3W5l4Plvp1OTzIp4BRtM5hZrAXZfoBHQWnigkX1G6zQbPZUIgWCLbbCRfsX0MMT0k49aDA2T2%2B8kuBS8gWNYR1P1hwkZtrA02V4rtsmCfaFrkZZB7EItp9LNTxhmjx9Z7YNBJx9n%2F5ZNY2MIIwLM%2BoEhgaCs4ReNV608nFYY8f0%2F9QzMZye3PM5WlCN9Sgf1O%2FfCO31or9a0z%2FCfxAL37zIa6parPGRxTaGuGT1V2q%2Ftn%2FD%2FVaFbFq0tsFOU5vDyhrQRTjHVOC9i0Bxr%2Bu3Ak9jtAgSZk5gcMpBe1Gwvsu0G8ZWVcPFk0gio%2BfOHd%2BPPJaDoGo5eGVGw5gyBGbovOThBvyvMT6eXcrDWWntNs4IA8iJgFkhRDOI0WPwf3Z%2BASr9UFvNBIGFwOJWG6nRfqJ1c2e7z9yFAhtmFO%2FIAu3p0QMoZ7diWXeFiPcptFAary1LxEwUC9ajIIaF92J%2FIcsZzX%2BUujpZZXDCM7clyCayH%2BgBBdk5ZCXXtuxzLHQG9CWt%2F4HOmafqFTCwhwO3l1BU8fjUNzofspm0KV4sf8cP4yrMKq0984GOqUB4D0QZc81PuEfU5nOGA8R6pZbugM8G6tdhcqL%2BDIjVIXKvGD7pUh8JrnWiiJttpmlBsSRPNT712UTe6nfpUsgIoYecV5eladz3QX4lKzPcT6DFOK1QyILpjC%2BYfO4yoLETTJ0kMmTpOEZMJDhT%2B1qbyLmH3tunIsjs5KTzObbxMOPWCum76IZMm%2Ft7V53%2BjfXdBwkLQRu7hgyITrMqz2603DNgwUd&X-Amz-Signature=52a40968af7f41c867e910c4f5f34edb18ae5a028da26372aaa8b48db773f820&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
    linkedin: https://www.linkedin.com/in/emmanuellegouvart-182b6ab2/
    x: 
  - id: 320f4462-cd38-8071-8eb7-f90621a068a3
    name: Marjorie Dieusart
    image: 
    linkedin: 
    x: 
  - id: 33bf4462-cd38-80da-845c-c63b2fd024bf
    name: Florian Hirson
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/2b6052d3-047d-4e1d-9256-fea2c2adc9e6/Photo_Profil_CV_1200px_%289%29.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663SBXKDNX%2F20260414%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260414T072949Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEL7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQDoQ2zeta%2FyHTI540wsMH0HxSAY%2BATUU8y1DXJo49%2FR3QIgfgYpE8rnxVjQjdXQSdfSs4FkbukBGNmM4mYPxzHzNsoqiAQIh%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDH%2FXA22vPQpx%2FkhClCrcA479MmEEV6I9eigvXgytlLjiNUm7v9pTEdM6CFlyZps94bpHWFfG1VfrFw5wOqXSNRFgPrU%2BgGOGKxBi49qeUtd1KdV%2FAPniG8hILB88TLq0EP1yYuBzeSzZmQ%2FqW2T8t92AsCFIedtwHr2DEc%2BKS9q4BREb75QOIKQukTD4iyXiMTaQOHGbu1wYT7I0NUnIHCYv6MyctXcxvPMrjVuxcHmU9EqjvvBHhzpZSzZWHdoR7NhEiNn3ia5TEEurHsuCHtwJP33t86%2FWvgmpv3eqDKI1h8U84OHcINLxPkHCjNytazhXEsDQii%2FC1ejswGUQajdRdLTT6orMRQ1jiUqWYYLtHUUluWzswhoWbBQF2Gd0DaN5AlEh4LjA92uMSg7Ooz6EkIEX2IfuKc6P%2B6v2BVD3wrrJwaCJUJK38ponmF03%2B5WYj0BOvHc6QpkSqO3ptcz2m2NTsHSJJQIdXInRtGGkcfIpLKPeRVr%2F4ueugg%2BTdv05AwuLXcwhOiBDx%2FiSPKxu8DzESmpt1KL7097NPp33PkgeOi%2BoMuGjNn0mJQCL6aTfQHl%2FGwVCu8fC04fqlmgDI4bGR9uT0VWcLEtS93V%2FWCVctavIuyFfTjm3bW3YnQqmDWvoTF5bglFAMMi1984GOqUBpwexbiOU10bG1oXGEC8pAoGR1qleIYaJFatZ3Hn2l02%2ByqIleJqpNHHJunG9BF04s4vtqS4IOIhpUc6y63prUVltgzFyGsM7q46WZwKClOYQ%2BHR9DQTSdAv7ujF3tdq%2BezDPIBWNstYKoWlRBL7cGoqdzL9Rs0SnZtD4ZSEFTkSEXVLeb8klio4AlBqqsVoslyJMFnZurcUaJ0HQyVxlldG%2FFXzY&X-Amz-Signature=760c14d682562a02818ac9dd16ece58d593677ef6cde7d10ff42bcb67502a42e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
    linkedin: https://www.linkedin.com/in/florian-hirson/
    x: 
---

<!-- markdownlint-disable-file -->


Tout au long de ma carrière de développeur web, une question s’est toujours posée : comment tester une nouvelle fonctionnalité développée ? Une anomalie corrigée ?

Certes les tests automatisés répondent en partie à la problématique, par exemple grâce au [TDD](https://hoppr-tech.notion.site/Formation-TDD-HoppR-19ff4462cd388034b74eecb49e31630d), mais **quid de la validation humaine**, par un _product owner_, un testeur, voire un utilisateur final ?

Beaucoup de projets utilisent des environnements de recette. Mais ceux-ci finissent rapidement avec des données bancales/obsolètes, des configurations bricolées, et où plusieurs fonctionnalités mergées récemment s’entremêlent. Et qui n’a jamais entendu une phrase du type “_N’utilisez pas la recette, je fais des tests dessus_”, bloquant ainsi l’ensemble de l’équipe et réduisant la productivité de celle-ci.

De plus, si le développement mergé ne répond pas au besoin, cela entraîne deux choses : soit un commit “parasite” a été introduit sur la branche `main` testée, soit l’évitement de ce problème nécessite un travail sur plusieurs branches Git parallèles et autant de complexité ajoutée.

Dès lors, comment tester manuellement une fonctionnalité de manière isolée ? Sur un environnement propre ? Ou des tests end-to-end peuvent être joués sans difficultés pour chaque _merge request_ ? Sur une MR qui sera validée avant de partir sur une branche `main` ?

## Qu’est-ce qu’un environnement éphémère ?

Comme son nom l’indique, **un environnement éphémère est une instance qui a une durée de vie limitée**, par exemple à la MR à laquelle il est rattaché. Il est construit dans une configuration au plus proche de celle de production, avec des données de test préchargées si nécessaire, pour faciliter les tests automatisés (end-to-end par exemple) et manuels.

Une fois que l’on sait créer un environnement éphémère facilement, plusieurs cas d’usage se présentent :

- Celui que j’ai le plus utilisé, une _merge request_ = un environnement éphémère. Ainsi, n’importe qui dans l’équipe peut visualiser et valider les modifications avant _merge_ de la branche

- Création d’un environnement dédié propre pour des démonstrations, qu’elles soient internes ou aux utilisateurs

- Un environnement créé pour des tests end-to-end, détruit ensuite

## Retour d’expérience

Je vais vous faire mon retour d’expérience de l’utilisation de ces environnements éphémères, lors de mon projet actuel chez mon client. Ces environnements sont systématiquement utilisés, pour chaque MR **sans exception**.

### La mise en place

Sur le projet, nous utilisons les outils suivants : [AWS](https://aws.amazon.com/fr/), [Terraform](https://developer.hashicorp.com/terraform) et [Gitlab](https://about.gitlab.com/). Cela nous permet de facilement automatiser la construction des environnements avec l’**infrastructure-as-code** (IaC).

Pour avoir un environnement disponible à la création de la _merge request_, nous utilisons une [variable prédéfinie de GitLab](https://docs.gitlab.com/ci/variables/predefined_variables/) nommée `CI_MERGE_REQUEST_IID` , un identifiant de la MR spécifique au projet. Cela nous permet d’intégrer la construction de l’environnement à la pipeline de CI/CD.

Bien entendu, hors de question d’installer un environnement inutilement pour un développement qui ne passe pas les tests unitaires. La pipeline ressemble donc  grossièrement à ceci :

![Exemple de pipeline : build ⇒ TU ⇒ environnement éphémère](./assets/img1.webp)

A noter que l’environnement éphémère créé à la volée possède ses propres ressources AWS, (dans notre cas, des buckets S3, des queues SQS, etc.). Un jeu de données spécifique à ces environnements est mis en place via un script [liquibase](https://www.liquibase.com/how-liquibase-works) pour un référentiel de données nécessaire aux tests. Ainsi naît un environnement avec une URL du type 

`https://env-${CI_MERGE_REQUEST_IID}.client.fr`

Bien évidemment, il faut faire attention à ne pas oublier de détruire automatiquement l’environnement à la fermeture de la MR, qu’elle soit mergée ou non (avec l’aide de [webhooks Gitlab](https://docs.gitlab.com/user/project/integrations/webhook_events/#merge-request-events)). On pourra également donner une durée de vie maximum à l’environnement. Cela nécessite également une bonne observabilité pour ne pas garder d’environnements “fantômes” coûteux.

### La mise en situation

Maintenant que nous avons des environnements éphémères pour chaque _merge request,_  comment allons-nous les utiliser ?

Notre principale idée ici est d’intégrer les _product owners_ dans la construction de chaque feature. Ainsi, là où la majorité des projets ne demande qu’une validation technique par un pair technique, nous demandons également une validation fonctionnelle par un PO ou un UX, suivant le sujet.

![Exemple sur une MR sur GitLab : le PO ET un autre dev ont validé la MR, qui a ensuite pu être mergée](./assets/img2.webp)

### Les avantages

- Chaque MR dispose d’un environnement dédié, évitant les interférences entre les fonctionnalités en développement

- Terraform garantit que chaque environnement est identique (mêmes configurations, versions, dépendances), et permet de provisionner/détruire l’infrastructure à la demande.

- D’ailleurs, cela permet la génération de multiples environnements avec la même config, plus besoin de maintenir chaque environnement de recette/formation/démo séparément

- Facilite le développement, l’intégration et le déploiement continu

- Permet une amélioration de vos [DORA Metrics](https://blog.hoppr.tech/blogs/2024-10-31-dora-metrics-valuer-la-performance-de-livraison-logicielle#quest-ce-que-les-m%C3%A9triques-dora)

### Les inconvénients

- La mise en place du fonctionnement est complexe, et nécessite un investissement initial important en début de projet. De plus, cela nécessite une bonne maîtrise des outils utilisés

- La construction automatique d’un environnement complet peut prendre du temps, et rallonger la pipeline

- Avoir un métier (PO/UX) pleinement impliqué et disponible pour faire des revues fonctionnelles.

Pour ce dernier point, c’est le cas sur ce produit, donc pas d’inquiétude là-dessus. Il faut de toute façon toujours impliquer le métier dans le développement et inversement, c’est la clé de la réussite de tous vos projets, et c’est cela que l’on pousse systématiquement chez [HoppR](https://www.hoppr.tech/).

## Conclusion

Toute l’équipe est ravie de ce système de double validation technique/métier sur chaque _merge request_ fonctionnelle. Les _product owners_ et les développeurs travaillent en symbiose sur le produit, ce qui est nécessaire dans une équipe pluri-disciplinaire soudée.

L’investissement initial à la mise en place des environnements éphémères est largement rentabilisé, fluidifiant le processus de développement. Ce système est d’ailleurs petit à petit propagé à d’autres produits chez le même client, suite à nos retours d’expérience positifs.

Alors, qu’attendez-vous pour employer les environnements éphémères, et mieux impliquer le métier dans vos développements ?