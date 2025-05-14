---
title: "Bref, j’ai mis en place les DORA Metrics dans un grand groupe ! (REX 🦖)"
date: 2025-05-14T21:54:13.241Z
description: "  Nouvel article qui fait suite à mon [introduction aux DORA Metrics](https://blog.hoppr.tech/blogs/2024-10-31-dora-metrics-valuer-la-performance-de-livraison-logiciellePour rappel, je vous avais défi"
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
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/82ebd0fe-de28-43f3-ab7b-0431af41baad/Photo_HoppR.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663S5O24IL%2F20250514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250514T215412Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGYaCXVzLXdlc3QtMiJGMEQCIATNFRIk120z3lzzlcS0zBwshL3dOh3wLBWetKwDjXXXAiAgQOjRsZyplgByIhq05BWLSBJEuu%2F9YhtM5EJgMhKS3Sr%2FAwgfEAAaDDYzNzQyMzE4MzgwNSIMPbAH%2BiyXLncnPjwJKtwDOAdCDHxSHbFb%2BC983fwczUfQ3m9%2FrzQkNNnFqoZ6FGF0T54G%2Bmw8J42ogrqWqIzERsuL2Ax8Owc3GevaBpQKoQ1YbToAHYx8BzmYNWU%2BZ0jNksBxSaOgMunDxHwxTh4nkXae1V7IwlbTQ%2BkLTfEWJjONTJPkxkPgFI0778zcZ5FoV6x6H7TMZrMiKiFpHJC7NJbdxLGBWYUK7JcgcekTAJYa7MgAfT2kqI2ZVIEnP4kxP2QZs1kM%2FwupWLWOKpcKI3onwcLPoi%2FW%2Fj1YJwkP93VEbskSOg2OhqT0jIOJ%2B2hglfTTcIkd6q3P2MCcVzu%2FFCm9H%2BTgrZxNJQY%2Fe5FuW%2F2%2By1uTkPVLcbJICN%2BJb17lxO%2FTEw2PuUdDRNsSwVlKZkWMErIua3%2F3aJ19gB4Y%2FWqd494ZDe32XsemqOfxCHhM6PwFE%2FMjRNW1XdTQjgEBD%2FwlrdFMyEwjFRi3YmRpYUEhcYkYsWh63sP1MKSvRFg7XWczahyrskpaZGxMQHSuUUbJA5u442PwcSbCN2owjuk%2FbDvk4%2FJOTht3ehAeA9sqZRpPJbK5mg44pUN4tXtSMdqdPA%2Bbax09knBwMYybL2KuhVDkreVdB10y%2FSfc2eupSShjUnwa2r%2B58aYw%2BJ%2BUwQY6pgHgzn%2F%2BmiN9aclNSvnOedAo8Ry1AHHlgk0ZO1v3ny8GwVwmw8iB2g%2B%2BnS%2FCgk9CBliNEWI5whG6%2BUByDPktw%2FRwJJnumCvljiZR4cbP3BiswzhzNDRt0fWjreUBdMEusmnKzVwN97%2BRZib8q9PMDa%2BMqMlQTXcHSaGmG2ShjKLGQ%2BfRv8AXFSPkEW8vGjZZi1AwJDQ0xMf06dJujRWJAhfWRCwLfvLR&X-Amz-Signature=a2cbe0550f2c00a4718f6ce0fad914f56e5e117a57d8fde9aa738846f9a09281&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/michael-bernasinski
    x: 
  - id: 0bb914a6-f882-4951-bee6-53e8e8abb807
    name: Emmanuelle Gouvart
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c88f5dfa-16db-4e6f-acf1-34dd80ee8766/emma_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46652KTGDF3%2F20250514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250514T215412Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGYaCXVzLXdlc3QtMiJHMEUCIQDnmWo%2Bp%2FhzJlgn9LgbgJ1%2B4a87txKADETNmQh%2B%2FSlpfQIgG9CuIaGXDE6Hof2DNc7R1FM%2FTWr65SzA30MAwOd%2BWYgq%2FwMIHxAAGgw2Mzc0MjMxODM4MDUiDF9l8JpvSzZ1QTGEiCrcAxDvJUark3stdB6Fi4BR8lrF4hOpJrS9QX4JFa6X5GfrvKw1oi%2FZCVorIaLATGd1ryM1gwosI9%2BFOaAgPsMYBoq%2FiEM0eiG0s%2FKOF6AUAvQb4W5puARW%2FensaUEvBG%2BoC0W3kdh6oSdB%2BgADBgI0P4liZbt9Xolkg4AnJC%2F0dgVmNQaF%2FomXc%2FsuYOOpQq8zXoYcyQ9PFM2K6fJ3jOGbrsC6aBO4xXzKzkVFhysRVm4uUklCeS8JyFZRH1rTU5gU6Vun9WTlFPM26IjIWw6wapqlreP6fBtrp8MfHtmgl7g7KOu3dk742h9iREfYsocfSNu%2FO6YKVcZ2MDB65Cta5AFH4ZpIf98n%2B1S28glQWTHYy8t9A4AU%2B81sVGMgV1IQOV6A3jfpG5ZCbL11W%2F4R6FuOlq%2BbCBzG8cSgmElMkZzS0dS5NjQqu3jNC9%2FwmCpkzcHcHsva2v8GXNEIOxon3lr%2BmOSgTjrRu2gR0ZQmyaztkLLi0S%2FnkeFOngQ0ck6Skx48WAWpTbF6tp0kysJQqMnVaw6Nl4t5dTRLVFBDDLSZxGEtNhf0X1pTLVU2DeRsgynckUI57v3vlLYkfnEem04jAiSPDQbf2OzqVnKjhLQgUCI1xyklU1Y9RI6MMMmflMEGOqUBUcJmL04LAs%2BOBwcVMKbr%2B8BYDqa2NXr%2BO0RXYT5gFsLqt5X4JGfch6j4jh4c3Cr0ry7dhUACjSwY9UAJek%2FgvbVZfGpDBUZ9QoRotkSNUy8lgdEQUgdv%2BbLiT4mtgXKObQwTAptrrMUIYtoPtXeU7g2MLeQNKxRPNGDKGJurLugjA%2BOXZyLutdYOrdL34qhg17K5PZXu606oUCWl4VyzqmAD0baU&X-Amz-Signature=a9d24d9fb5a50be2c5d78c29a8da9d6aeaaa11a3ec4b326a97b44c2b069462f8&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/emmanuellegouvart-182b6ab2/
    x: 
  - id: e8163b24-7e01-41c5-adbf-0dc655f929d0
    name: Nicolas Zago
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/f8f82a79-9d41-4302-b1a5-37882985167f/nicoz_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667ACMBP4Z%2F20250514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250514T215413Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGYaCXVzLXdlc3QtMiJHMEUCIGl5X%2BjMmRIVSuIIWui%2BE6nMWB6VVZ1awnOPim%2FvuZoEAiEA9WNey3wUpwoSfo3W%2BANEtvYJZhu1I9BsurAgibw%2BRRQq%2FwMIHxAAGgw2Mzc0MjMxODM4MDUiDNN5mfDVoBcLULjEdCrcA0VoX3Bi7xZK%2B5G%2FzcYbHj6t1qMVDkHYkxIOjtAUAUaeoD6USgUo%2BIll3%2BFnCI2TdwUU74cXvDTV6rvjQK4iatRdQAb2o9GyjS%2BTp96Q0llo2yq59gSqAfgmdpoUahxnj61aMK8IyuQav8odgO0t%2Bybj1tkeeg4XuWLtKWqttm2mhsyz7AvUSD4aeYgjPKKpHp%2FAxrOJhL0l4vX1nbDt3Cg0bMEHt1Q0IDm6dA9y85ExPJKgRokOkzpJmvPuh2lMVU%2BtcKtzMikFJ24wwa05ZaV3iKQSBv5gJaVRXoB0vabAvhTAJkJpn0IsEEQD7hAwsf8QftguDOYQvZj9hy8AzC%2FpOe6CyD4pTRMNhK7LKD8nF4innK5HT4ls0wqS4W0wPu5w6p3Rk%2BIBKiMejMJNYTo30qZbfd57JxB%2BUtfe%2FHlmhZcAm%2FZkbdDAgRyYPyzuEAOEOsmJ%2F7KourabIcCcnd3%2BEKBO9xTsfuWsdVqpSTYmV1Ua%2F8B2jCDO%2B3AUlJKLWsmJIMBbVSnLdZLocKbh3gUH9m%2B6KHe1cNcARvvsl0C8pusuF3nBN%2B2mWRCGXKOqUxQGa7cdpYxoIgIFnoIwKJ0rDfr9aU1larZVoo%2F5in4AdJW5WLSvzNJ51SCqMOOflMEGOqUBBrH2tkbmo81kvisSUua8k6ilzCJPzQhHvSpNYwBjJ%2Bqco1TIjjc0iDEwVXmhTWfKMHmHMBC4fb%2BsvSXAQFuzWGZLwQKdc4iyQtjRj5Gp9EFXWn0PaukQuFmczAtFvvQ5wnzWlzIO%2BSgPwePKqX%2FG7TxpaJ4AfcyxD1FHm5SydBYR%2FfybAzXoeiLRT%2BOgj6FejLVW8PLpHK6V5Gp3rMmbENqTo0Cr&X-Amz-Signature=4b6d4495317b3afbb64a1d5c7e3fbfbf9dc3c44f8537b59329fd8f6cd9d52666&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/nicolaszago/
    x: 
---

<!-- markdownlint-disable-file -->




Nouvel article qui fait suite à mon [introduction aux DORA Metrics](https://blog.hoppr.tech/blogs/2024-10-31-dora-metrics-valuer-la-performance-de-livraison-logicielle#quest-ce-que-les-m%C3%A9triques-dora) 🎉 
Pour rappel, je vous avais défini les **4 métriques (4 Keys)** qui permettent de mesurer l'efficacité de la livraison logicielle:

> **Deployment Frequency** | **Lead Time for Changes** | **Mean Time to Restore** | **Change Failure Rate**

Aujourd'hui, je vous partage mon retour d'expérience (REX) sur leur mise en place chez un client qui souhaitait objectiver et améliorer sa performance de livraison.

## 1. Comprendre l'organisation et définir les concepts 🏢

### L'organisation du groupe

Lorsque je suis arrivé chez ce client, j'ai pu constater qu'il y avait de nombreux produits (> 1000) avec des technologies hétérogènes. Mais d'ailleurs, c'est quoi un produit ? La première chose à faire a été de se mettre d'accord sur les définitions !



L'organisation de l'entreprise était la suivante :

- Le groupe est divisé en plateformes

- Les plateformes sont divisées en domaines

- Les domaines sont divisés en produits



Après quelques ateliers avec le management et des projets pilotes, nous sommes tombés d'accord sur les définitions suivantes :

- **Plateforme** : Niveau le plus haut de l'organisation, regroupe plusieurs domaines fonctionnels liés

- **Domaine** : Regroupe des produits ayant des fonctionnalités similaires ou complémentaires

- **Produit** : Périmètre fonctionnel perceptible par l'utilisateur final, pour lequel les changements lui sont communiqués. Un produit peut être composé de plusieurs composants (microservices ou briques monolithiques) et peut être déployé sur différents environnements de production

![Schéma d’organisation d’un site e-commerce : la plateforme Commerce regroupe les domaines E-Commerce (catalogue, panier, commande web) et Magasins (catalogue, caisse, commande magasin) ; la plateforme Gestion Clients regroupe les domaines Comptes Clients (gestion client web, magasin, data compliance) et Fidélité (programme de fidélité, newsletters).](https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/a2ab348f-1b2b-4327-a0e6-556be2db6238/dora_metrics-exemple_orga.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667YVU74GO%2F20250514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250514T215408Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGYaCXVzLXdlc3QtMiJHMEUCIGBS305CFYApvIDV6LQfIYyGQMcv5zRHpktLGgaqRL8qAiEA7LThd6MZJmpyG6coTkmxWKGpKrCecr8rloKZqr9881Mq%2FwMIHxAAGgw2Mzc0MjMxODM4MDUiDAsLEViXyd3pBDMHRSrcA6sam3zRWkZ4nap%2BqA921tWvsKT0Xlgh8nqwmR1%2Bg8FbpYn0JcoL9SnDkdqFrThsyPJvVJGd4Ynou%2FUepbBZAcZFowygVBDbGIZ3tz64DRY7Omt8hGdoyPJ9433l2bc8KN3mCkMoq38rBlKxalcftvloH%2FK%2F7hxYy6Eys7kKYEDvZWj2wSBtOuh68fqLzaUl%2BT4dW1Upkzy1ntU%2FJtmNpWq8XCVP%2BBRYfoWWP2df8ajOC0jYStG7M2ZFKb%2Fe%2B8%2B4ThzpOYHs2VaP6Ah7PW4MBcAG5WKN0uICM1QZSGAUxO1qJDMkyrR8wWRMwNhDvbQ4it4h5t4i3IiHxVMujENacs9ZIj1fM828VlVd%2FnFml12FW5RFUkF401fTCakgMnQmaFWwiYoYB05I5ikvQo%2F1Enejd1mwnxP9ZJ2awJCHQS9k5nWc%2BAXAj5vdJXZTV2iObuRfbCswtvUaAQtgTuRwFjaMvmv1m1o599cxjNWh6Nc85b4mWtfjba%2BojSbP3JAs3lqRcOak7U3gEuGl8gtjcNskaEFAo98T9ptmoibZNzkWEKiHNGkEZS62cUrfebg9cercbvNkHN0MIzIc2UT%2BGQ82a5kvKETLVSTaiuVtvKbJCcSQoRmDWQ4FW%2BkAMOOflMEGOqUBUdKEcdo8BC%2BhVNZmMqbHgOCqjFbXYbuQhnI8Zc5eqmv81vJTuxG1axPQYg1uFb%2Bkj5HLy5EDXoCG34LLnKPcr4Dr8%2FTTww9Hv%2BNZoIsP6Lh5DflZILZGmT4mUpqKdmppc78U4xH6muhtFQpIsOQInP%2BquwbJ5gKyM3%2FAxM%2B7MNPf4DCznUDSBCuXomBA0RSkumnWrDb1WXjVKGQyJwwL9msP4ghw&X-Amz-Signature=e21f25140683c547a8eeb71ceb5be4163ec98405b11dcb71e20cd419e55f286c&X-Amz-SignedHeaders=host&x-id=GetObject)

### Les cas d'usage identifiés

Une fois l'organisation de la société comprise et les concepts définis, il a fallu comprendre tous les cas d'usage des DORA Metrics avec des ateliers comme l'[Example Mapping](https://draft.io/fr/example/example-mapping).



![Tableau Example Mapping avec quatre catégories : User Stories (jaune), Rules (bleu), Examples (vert), Questions (rose), chacune contenant des post-its de la couleur correspondante.](https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/54c8a0d9-4578-46d6-90aa-cbad2edda847/example_mapping.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667YVU74GO%2F20250514%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250514T215408Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGYaCXVzLXdlc3QtMiJHMEUCIGBS305CFYApvIDV6LQfIYyGQMcv5zRHpktLGgaqRL8qAiEA7LThd6MZJmpyG6coTkmxWKGpKrCecr8rloKZqr9881Mq%2FwMIHxAAGgw2Mzc0MjMxODM4MDUiDAsLEViXyd3pBDMHRSrcA6sam3zRWkZ4nap%2BqA921tWvsKT0Xlgh8nqwmR1%2Bg8FbpYn0JcoL9SnDkdqFrThsyPJvVJGd4Ynou%2FUepbBZAcZFowygVBDbGIZ3tz64DRY7Omt8hGdoyPJ9433l2bc8KN3mCkMoq38rBlKxalcftvloH%2FK%2F7hxYy6Eys7kKYEDvZWj2wSBtOuh68fqLzaUl%2BT4dW1Upkzy1ntU%2FJtmNpWq8XCVP%2BBRYfoWWP2df8ajOC0jYStG7M2ZFKb%2Fe%2B8%2B4ThzpOYHs2VaP6Ah7PW4MBcAG5WKN0uICM1QZSGAUxO1qJDMkyrR8wWRMwNhDvbQ4it4h5t4i3IiHxVMujENacs9ZIj1fM828VlVd%2FnFml12FW5RFUkF401fTCakgMnQmaFWwiYoYB05I5ikvQo%2F1Enejd1mwnxP9ZJ2awJCHQS9k5nWc%2BAXAj5vdJXZTV2iObuRfbCswtvUaAQtgTuRwFjaMvmv1m1o599cxjNWh6Nc85b4mWtfjba%2BojSbP3JAs3lqRcOak7U3gEuGl8gtjcNskaEFAo98T9ptmoibZNzkWEKiHNGkEZS62cUrfebg9cercbvNkHN0MIzIc2UT%2BGQ82a5kvKETLVSTaiuVtvKbJCcSQoRmDWQ4FW%2BkAMOOflMEGOqUBUdKEcdo8BC%2BhVNZmMqbHgOCqjFbXYbuQhnI8Zc5eqmv81vJTuxG1axPQYg1uFb%2Bkj5HLy5EDXoCG34LLnKPcr4Dr8%2FTTww9Hv%2BNZoIsP6Lh5DflZILZGmT4mUpqKdmppc78U4xH6muhtFQpIsOQInP%2BquwbJ5gKyM3%2FAxM%2B7MNPf4DCznUDSBCuXomBA0RSkumnWrDb1WXjVKGQyJwwL9msP4ghw&X-Amz-Signature=7e24a8c495a0a0ea4394c94cdee17800a2f628a9256f269ea4b33aa6840e39df&X-Amz-SignedHeaders=host&x-id=GetObject)



> ℹ️ N’hésitez pas à consulter [notre offre de formations](https://www.hoppr.tech/formations-hoppr) si vous souhaitez approfondir vos connaissances Craft et pratiquer ce type d’atelier.



Je ne veux pas vous mettre tous les cas d'usage, car ça serait trop long et ce n'est pas l'objectif de l'article, mais je vais vous donner quelques exemples :

- En tant que CTO, je souhaite comparer les performances de livraison entre les plateformes (par exemple entre la plateforme Commerce et la plateforme Gestion Clients) pour identifier les meilleures pratiques DevOps à généraliser au niveau du groupe.

- En tant que Lead Tech d'un produit e-commerce, je souhaite comparer nos métriques avec celles des autres produits du domaine Commerce (comme le panier ou le catalogue) pour comprendre pourquoi leurs déploiements génèrent moins d'incidents en production.

- En tant que Domain Leader Catalogue, je souhaite analyser l'impact du multi-instance sur la fréquence de déploiement. Par exemple, comprendre si les produits déployés sur plusieurs environnements de production (pour différentes BU) ont plus de difficultés à maintenir un rythme de livraison élevé et si oui, comprendre les causes.

- En tant que Product Owner, je veux suivre l'évolution de nos métriques après le passage d'une architecture monolithique à des microservices, notamment pour vérifier si la fréquence de déploiement de chaque composant s'améliore comme prévu.

## 2. Les défis techniques et organisationnels 🔧

La mise en place des DORA Metrics dans un groupe de cette taille présentait beaucoup de défis majeurs. Avec mon client, nous avons fait le choix d'implémenter les DORA Metrics uniquement sur les produits déployés sur Kubernetes (cela représente environ 80% des produits). Voici les principaux obstacles que nous avons dû surmonter :

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

- Peur d'être jugé uniquement sur des chiffres et que les métriques servent à comparer les équipes entre elles

- Tentation de biaiser le système (par exemple en multipliant volontairement les déploiements inutiles pour améliorer artificiellement la fréquence)

- Réticence à reporter certains incidents pour ne pas impacter le Change Failure Rate

- Difficultés à voir les DORA metrics comme outil d'amélioration continue



**Notre approche : transformer les résistances en adhésion**

Plutôt que d'imposer un système de mesure, nous avons choisi d'impliquer les équipes dans sa construction. Nous avons organisé des ateliers de sensibilisation, partagé les objectifs stratégiques derrière ces métriques, et surtout, écouté les préoccupations des équipes.

Cette démarche participative a permis de transformer progressivement la perception des DORA Metrics : d'un outil potentiellement menaçant de surveillance, elles sont devenues un levier d'amélioration continue valorisé par les équipes elles-mêmes.

## 3. Hypothèses techniques retenues 🧐

> **Fondations solides : établir des conventions claires et partagées**  
> Pour bâtir un système de mesure fiable dans un environnement complexe, nous avons dû établir un ensemble d'hypothèses et de conventions. Elles ont été clairement documentées et validées collectivement et elles étaient nécessaires pour calculer les métriques avec des données imparfaites.

Voici les principales conventions que nous avons établies, organisées par domaine :

### Déploiements 🚀

**Identification des déploiements en production**

- Un déploiement est considéré réussi uniquement quand :

- Seuls les déploiements avec l'annotation `info/environment = prod` sont pris en compte

- Les déploiements de configuration pure sont exclus des métriques

**Impact utilisateur**

- Un déploiement en production impacte potentiellement l'utilisateur final

- Un produit peut être déployé sur plusieurs workspaces (namespace/cluster)

- Une modification d'un composant ou de sa configuration implique une modification du produit

### Lead Time For Changes ⏱️

**Traçabilité du code**

- Le code source mentionné dans l'annotation est responsable du déploiement du composant

- La correspondance dans le repository Git est matérialisée par un tag

- Le temps entre un commit et son tag est négligeable pour le calcul global

**Limitations acceptées**

- Seuls les tags respectant la norme SemVer sont pris en compte

- Les configurations d'environnement sans code source associé créent des déploiements multiples pour une même version

### Incidents et récupération 🚨

**Temporalité des incidents**

- Le temps entre l'apparition réelle d'un incident et son ouverture dans l'outil est considéré comme négligeable

- Tous les incidents reportés (automatiquement ou manuellement) ont un impact utilisateur

**Association déploiement-incident**

- Le déploiement le plus récent d'un composant du produit avant la création de l'incident est considéré comme la cause

- En l'absence d'information sur l'instance spécifique, l'incident est associé au produit dans son ensemble

### Structure organisationnelle 🏢

**Définition d'un produit**

- Un produit est un périmètre fonctionnel perceptible par l'utilisateur final

- Un produit peut être composé de plusieurs composants (microservices ou briques monolithiques)

- Les changements au niveau produit sont communiqués aux utilisateurs

**Multi-instance**

- Un même produit peut être déployé dans différents environnements de production

- Chaque instance est considérée comme une entité distincte pour les métriques de déploiement

- Les incidents sont agrégés au niveau produit plutôt qu'au niveau instance

### Limitations connues 🚧

**Données manquantes**

- Certains déploiements peuvent manquer d'annotations complètes

- Les tags peuvent ne pas suivre strictement SemVer

- La corrélation entre incidents et instances spécifiques n'est pas toujours possible

**Pistes d'amélioration**

- Implémenter "configuration as code" pour mieux tracer les changements de configuration

- Étendre la prise en compte des tags au-delà de SemVer

- Ajouter la notion d'instance produit dans l'outil de gestion des incidents

Ces hypothèses sont régulièrement revues et ajustées en fonction des retours d'expérience et de l'évolution des pratiques DevOps dans l'organisation.

## 4. La collecte des données : une approche par source 📊

> **L'architecture de collecte : le cœur technique du projet**  
> Le succès des DORA Metrics repose sur notre capacité à collecter, intégrer et corréler des données provenant de multiples systèmes. Cette architecture d'intégration constitue la colonne vertébrale technique de notre solution.

### Architecture de données centralisée

**BigQuery comme référentiel central**

Pour répondre aux besoins d'analyse et de corrélation des données, nous avons mis en place une architecture où toutes les données sont centralisées dans Google BigQuery. Cette approche présente plusieurs avantages :

- Capacité à traiter de grands volumes de données (logs Kubernetes, événements GitHub, tickets ServiceNow)

- Possibilité d'exécuter des requêtes SQL complexes pour calculer les métriques

- Facilité d'intégration avec des outils de visualisation (pour ce projet, Power BI)

- Mise à jour des données en quasi temps réel via des flux de données (streaming)



Examinons maintenant notre approche pour chaque source de données :

### Données de déploiement

| | |
| --- | --- |

### Données de code source

| | |
| --- | --- |

### Données d'incidents

| | |
| --- | --- |

## 5. Implémentation et calcul des métriques 📈

> **De la théorie à la pratique : adapter et calculer les métriques à tous les niveaux**  
> Les définitions théoriques des DORA Metrics sont un point de départ, mais leur implémentation concrète nécessite une adaptation fine au contexte spécifique de l'entreprise et une approche multi-échelle pour répondre aux besoins de tous les niveaux de l'organisation.

### Implémentation des métriques

Voici comment nous avons adapté et implémenté chacune des quatre métriques :



<u>**Lead Time for Changes (Délai de livraison des changements)**</u>

Le Lead Time for Changes mesure le temps qui s'écoule entre la dernière modification de code (commit) et son déploiement effectif en production. Dans cette entreprise, nous avons dû sensibiliser les équipes sur l'importance de taguer chaque version déployée pour tracer correctement le code source.

- **Extraction:** à partir des déploiements Kubernetes (annotation "version" et "repo"), nous retrouvons le commit Git.

- **Calcul:**

- **Agrégation:** comme chaque produit pouvait regrouper plusieurs composants, nous avons choisi de calculer d'abord un Lead Time moyen pour chaque composant, avant de prendre la moyenne de ces composants au niveau du produit.



**Principale difficulté:** éviter les déploiements de "configuration" sans changement de code, qui fausseraient la métrique. Nous avons donc isolé ces cas dans un tableau de bord à part, pour ne pas influencer le Lead Time for Changes général.



<u>**Deployment Frequency (Fréquence de déploiement)**</u>

La Deployment Frequency indique la cadence à laquelle on pousse des mises à jour en production (exprimée en $jours^{-1}
$, ou inverse de l'intervalle entre deux déploiements). 

$$
f_{comp} = \frac{1}{(t_{dep2} - t_{dep1})}
$$

Au niveau d'un produit, nous calculons la moyenne des fréquences de déploiement de tous ses composants. Nous avons aussi mis en évidence quelques "cas limites", par exemple lorsqu'un composant n'a qu'un seul déploiement. Dans ces situations, on ne peut pas déterminer d'intervalle et la fréquence reste "N/A".

C'était essentiel de distinguer un déploiement réellement exposé à l'utilisateur dans l'environnement "prod" (annotation "info/environment=prod") de simples déploiements sur des environnements de test ou d'intégration.



<u>**Mean Time to Restore (MTTR) ou Mean Time to Recover (Temps moyen de restauration)**</u>

Le MTTR calcule le temps moyen nécessaire pour résoudre un incident ou le temps apparent de défaillance pour l'utilisateur. Au départ, nous avons constaté que l'outil de ticketing (ServiceNow) n'enregistrait pas toujours les champs d'ouverture et de clôture de manière cohérente. 

Nous avons donc dû :

- **Sensibiliser les équipes support** : un champ "date de début d'incident" doit être rempli le plus précisément possible dès ouverture (sinon nous utilisons la date de création du ticket).

- **Vérifier la date de résolution ou de clôture** : c'est la référence pour la fin d'incident.

- **Calculer la moyenne** de (date de fin − date de début) sur tous les incidents clôturés, pour chaque produit.

$$
\bar{t}_{recover} = \frac{1}{n} \sum_{k=1}^{n} (t_{end} - t_{start})
$$

Pour la plupart des cas, cela a fonctionné correctement. Mais, comme souvent, nous avons rencontré des écarts (tickets fermés très tardivement, incidents mal catégorisés, etc.). Il a fallu faire accepter les limites de la mesure (la durée de vie d'un ticket n'est pas toujours égale à la durée réelle de l'incident technique).



<u>**Change Failure Rate (Taux d'échec des changements)**</u>

Le Change Failure Rate (CFR) représente la proportion de déploiements qui entraînent au moins un incident en production. Ici, le plus gros challenge a été de lier les incidents ServiceNow au "dernier déploiement" d'un produit. Faute de pouvoir tracer précisément l'instance de composant à l'origine, nous avons adopté la convention suivante :

- **Identifier le "dernier déploiement"** survenu avant la date de création de l'incident, tous composants du produit confondus.

- **Incrémenter un déploiement "défaillant"** si au moins un incident lui est rattaché.

- **Diviser le nombre de déploiements défaillants par le nombre total de déploiements** du produit, sur la période considérée.

$$
{ChangeFailure}_{product} = \frac{\sum{d_{fail}}}{\sum{d_{total}}}
$$

Bien sûr, cela reste une approximation: on ne sait pas distinguer un incident réellement lié à un composant particulier. D'où la nécessité d'améliorer la remontée d'informations dans ServiceNow (par exemple en demandant explicitement quelle version réelle est touchée).

### Calcul des métriques par niveau de granularité 📊

> **Vision multi-échelle : du composant à la plateforme**  
> L'une des forces de notre implémentation réside dans sa capacité à fournir des métriques à différents niveaux de granularité. Cette approche multi-échelle permet à chaque niveau de management d'accéder aux indicateurs pertinents pour son périmètre de responsabilité, tout en garantissant la cohérence globale des mesures.



Différentes vues des Dora Metrics de notre solution pour illustrer les calculs un peu plus bas.



![Vue globale des dora metrics](./assets/img1.webp)



![Vue détaillée des dora metrics au niveau d’un produit](./assets/img2.webp)



![Vue pour suivre l’évolution des dora metrics au niveau d’une plateforme](./assets/img3.webp)

### Lead Time For Changes



**Niveau Composant**

$$
\Delta t_{ltfc_c} = \left(\frac{1}{d_{tag}}\right) \sum (t_{d_i} - t_{co_i})
$$

où :

- $t_{d_i}$ = Date de déploiement en production

- $t_{co_i}$ = Date du dernier commit de la version

- $d_{tag}$ = Nombre de déploiements en production associés à un tag Git

**Niveau Produit**

$$
\Delta t_{ltfc_p} = \frac{1}{n_c} \sum \left( \Delta t_{ltfc_{c_i}} \right)
$$

où :

- $\Delta t_{ltfc_{c_i}}$ = Lead Time du composant i

- $n_c$ = Nombre de composants du produit

**Niveau Domaine**

$$
\Delta t_{ltfc_d} = \frac{1}{n_p} \sum \left( \Delta t_{ltfc_{p_i}} \right)
$$

où :

- $\Delta t_{ltfc_{p_i}}$ = Lead Time du produit i

- ${n_p}$ = Nombre de produits dans le domaine

**Niveau Plateforme**

$$
\Delta t_{ltfc_P} = \frac{1}{n_d} \sum \left( \Delta t_{ltfc_{d_i}} \right)
$$

où :

- $\Delta t_{ltfc_{d_i}} $ = Lead Time du domaine i

- $n_d$ = Nombre de domaines dans la plateforme



### Deployment Frequency

**Niveau Composant**

$$
f_{comp} = \frac{1}{t_{dep2} - t_{dep1}}
$$

où :

- $t_{dep2}$ = Date du déploiement actuel

- $t_{dep1}$ = Date du déploiement précédent

**Niveau Produit**

$$
f_{prod} = \frac{1}{n} \sum \left( f_{comp} \right)
$$

où :

- $n$ = Nombre de déploiements composants

- $f_{comp}$ = Fréquence de déploiement du composant

**Niveau Domaine**

$$
f_{domain} = \frac{1}{m} \sum \left( f_{prod} \right)
$$

où :

- $m$ = Nombre de produits

- $f_{prod}$ = Fréquence de déploiement du produit

**Niveau Plateforme**

$$
f_{platform} = \frac{1}{o} \sum \left( f_{domain} \right)
$$

où :

- $o$ = Nombre de domaines

- $f_{domain}$ = Fréquence de déploiement du domaine



### Change Failure Rate

**Niveau Composant**

- Non calculé à ce niveau en raison de la difficulté à associer précisément les incidents à des composants spécifiques

**Niveau Produit**

$$
ChangeFailure_{product} = \frac{\sum d_{fail}}{\sum d_{total}}
$$

où :

- $d_{fail}$ = Nombre de déploiements précédant au moins un incident

- $d_{total}$ = Nombre total de déploiements du produit

**Niveau Domaine**

$$
ChangeFailure_{domain} = \frac{1}{n_p} \sum \left( ChangeFailure_{product} \right)
$$

où :

- $n_p$ = Nombre de produits dans le domaine

**Niveau Plateforme**

$$
ChangeFailure_{platform} = \frac{1}{n_d} \sum \left( ChangeFailure_{domain} \right)
$$

où :

- $n_d$ = Nombre de domaines dans la plateforme



### Mean Time To Recover

**Niveau Composant**

- Non calculé à ce niveau car les incidents sont tracés au niveau produit

**Niveau Produit**

$$
MTTR_{product} = \frac{1}{n} \sum \left( t_{end} - t_{start} \right)
$$

où :

- $n$ = Nombre d'incidents

- $t_{end}$ = Date de résolution de l'incident

- $t_{start}$ = Date de début de l'incident

**Niveau Domaine**

$$
MTTR_{domain} = \frac{1}{m} \sum \left( MTTR_{product} \right)
$$

où :

- $m$ = Nombre de produits dans le domaine

**Niveau Plateforme**

$$
MTTR_{platform} = \frac{1}{o} \sum \left( MTTR_{domain} \right)
$$

où :

- $o$ = Nombre de domaines dans la plateforme



### Calcul des métriques avec BigQuery



![Image de datacenter](./assets/img4.webp)

_Photo by_ [_Taylor Vick_](https://unsplash.com/@tvick?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) _on_ [_Unsplash_](https://unsplash.com/photos/cable-network-M5tzZtFCOfs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)



Toutes nos métriques sont calculées via des requêtes SQL exécutées sur BigQuery. Voici comment nous procédons pour chaque métrique :



**Lead Time For Changes**

- Mesure le temps entre une modification de code et son déploiement en production

- Formule : $\Delta t_{ltfc} = t_{d_{prod}} - t_{co}$

```sql
-- Calcul du Lead Time For Changes par composant
SELECT d.component_name,
       d.product_id,
       AVG(TIMESTAMP_DIFF(d.deployment_timestamp, c.commit_timestamp, HOUR)) as lead_time_hours
FROM `dora_metrics.deployments` d
         JOIN
     `dora_metrics.git_commits` c
     ON
         d.git_tag = c.tag
WHERE d.environment = 'prod'
  AND d.deployment_timestamp BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY d.component_name, d.product_id
```



**Deployment Frequency**

- Fréquence des déploiements en production

- Calculée par composant puis agrégée au niveau produit

- Exclusion des déploiements de configuration

```sql
-- Calcul de la fréquence de déploiement par composant
WITH deployments_ordered AS (SELECT component_name,
                                    product_id,
                                    deployment_timestamp,
                                    LAG(deployment_timestamp) OVER (
      PARTITION BY component_name
      ORDER BY deployment_timestamp
    ) as previous_deployment
                             FROM `dora_metrics.deployments`
                             WHERE environment = 'prod'
                               AND is_config_only = FALSE
                               AND deployment_timestamp BETWEEN '2024-01-01' AND '2024-12-31')
SELECT component_name,
       product_id,
       COUNT(*)                                                            as deployment_count,
       AVG(TIMESTAMP_DIFF(deployment_timestamp, previous_deployment, DAY)) as avg_days_between_deployments,
       SAFE_DIVIDE(COUNT(*), 365)                                          as deployments_per_day
FROM deployments_ordered
WHERE previous_deployment IS NOT NULL
GROUP BY component_name, product_id
```



**Change Failure Rate**

- Taux de déploiements causant au moins un incident en production

- Exprimé en pourcentage

- Basé sur les déploiements Kubernetes réussis et les incidents ServiceNow résolus

```sql
-- Calcul du Change Failure Rate par produit
WITH deployments_with_incidents AS (SELECT d.deployment_id,
                                           d.product_id,
                                           MAX(CASE WHEN i.incident_id IS NOT NULL THEN 1 ELSE 0 END) as has_incident
                                    FROM `dora_metrics.deployments` d
                                             LEFT JOIN
                                         `dora_metrics.incidents` i
                                         ON
                                             d.product_id = i.product_id
                                                 AND i.created_timestamp > d.deployment_timestamp
                                                 AND i.created_timestamp <= (SELECT MIN(next_d.deployment_timestamp)
                                                                             FROM `dora_metrics.deployments` next_d
                                                                             WHERE next_d.product_id = d.product_id
                                                                               AND next_d.deployment_timestamp > d.deployment_timestamp)
                                    WHERE d.environment = 'prod'
                                      AND d.deployment_timestamp BETWEEN '2024-01-01' AND '2024-12-31'
                                    GROUP BY d.deployment_id, d.product_id)
SELECT product_id,
       COUNT(*)                                       as total_deployments,
       SUM(has_incident)                              as failed_deployments,
       SAFE_DIVIDE(SUM(has_incident), COUNT(*)) * 100 as change_failure_rate_percent
FROM deployments_with_incidents
GROUP BY product_id
```



**Mean Time To Recover**

- Temps moyen de résolution des incidents

- Calculé à partir des dates d'ouverture et de résolution dans ServiceNow

- Agrégé au niveau produit

```sql
-- Calcul du Mean Time To Recover par produit
SELECT product_id,
       COUNT(*)                                                         as incident_count,
       AVG(TIMESTAMP_DIFF(resolved_timestamp, created_timestamp, HOUR)) as mttr_hours
FROM `dora_metrics.incidents`
WHERE status = 'Resolved'
  AND created_timestamp BETWEEN '2024-01-01' AND '2024-12-31'
  AND resolved_timestamp IS NOT NULL
GROUP BY product_id
```

### Fiabilisation et optimisation des données

**Infrastructure as Code**

- Utilisation de Terraform pour standardiser les déploiements

- Configuration automatique des annotations requises

- Validation des formats de données

**Bonnes pratiques**

- Tagging systématique des versions

- Documentation des conventions

- Formation des équipes

**Monitoring**

- Détection des annotations manquantes

- Alertes sur les incohérences

- Suivi de la qualité des données

**Optimisation de BigQuery**

La gestion d'un volume important de données dans BigQuery a nécessité plusieurs optimisations :

```sql
-- Création de tables partitionnées par date pour améliorer les performances
CREATE TABLE `dora_metrics.deployments_partitioned`
    PARTITION BY DATE
(
    deployment_timestamp
)
AS
SELECT *
FROM `dora_metrics.deployments`;

-- Création de vues matérialisées pour les requêtes fréquentes
CREATE
MATERIALIZED VIEW `dora_metrics.lead_time_daily`
AS
SELECT product_id, DATE (deployment_timestamp) as deployment_date, AVG (TIMESTAMP_DIFF(deployment_timestamp, commit_timestamp, HOUR)) as avg_lead_time_hours
FROM
    `dora_metrics.deployments_with_commits`
GROUP BY
    product_id, deployment_date;

```

**Automatisation des flux de données**

Nous avons mis en place plusieurs processus automatisés pour maintenir des données à jour :

- Jobs Cloud Functions pour synchroniser les données ServiceNow toutes les 15 minutes

- Webhooks GitHub pour capturer les événements de commit et de tag en temps réel

- Export des logs Kubernetes via Cloud Logging avec un délai maximum de 5 minutes

Cette approche nous permet d'obtenir des métriques fiables et exploitables pour l'amélioration continue de nos processus de livraison.

### Points clés pour l'agrégation 🔑

> **Garantir la cohérence et la pertinence des métriques agrégées**

- **Pondération**

- **Exclusions**

- **Cas particuliers**

Cette approche d'agrégation garantit :

- Une représentation équitable à chaque niveau

- Une cohérence dans le calcul des métriques

- Une prise en compte appropriée des cas limites

### Synthèse de notre approche d'implémentation

> **Une implémentation progressive et adaptée au contexte**

Notre approche d'implémentation des DORA Metrics a combiné rigueur méthodologique et pragmatisme. Nous avons défini des formules de calcul précises tout en les adaptant aux réalités opérationnelles de l'entreprise. L'agrégation multi-niveaux nous a permis de répondre aux besoins de tous, du développeur individuel jusqu'au comité de direction.

Cette implémentation technique n'était cependant que la première étape. La véritable valeur des DORA Metrics réside dans leur capacité à transformer les pratiques et la culture de l'organisation.

## 6. Bénéfices, enseignements et perspectives 🤔

> **La mise en place des DORA Metrics est un voyage, pas une destination.**

Ce retour d'expérience illustre une réalité fondamentale : implémenter les DORA Metrics dans un grand groupe nécessite bien plus qu'une simple application de formules mathématiques. C'est un projet de transformation qui touche à la fois aux aspects techniques, organisationnels et humains.

### Bénéfices observés

> **Impact transformationnel : au-delà des chiffres**

L'implémentation des DORA Metrics a généré des bénéfices qui dépassent largement le cadre de la simple mesure de performance. Elle a catalysé une véritable transformation des pratiques et de la culture de livraison logicielle au sein de l'organisation.

Voici les principaux impacts positifs observés :

- **Une meilleure visibilité sur la performance de livraison** : Les équipes ont pu objectiver leurs points forts (par exemple, une fréquence de déploiement élevée) et leurs axes d'amélioration (par exemple, un très long "Lead Time for Changes").

- **Un langage commun entre équipes** : Les DORA Metrics servent désormais de référence partagée. Lorsqu'il y a un incident, tout le monde comprend la corrélation possible entre le "dernier déploiement" et le Change Failure Rate.

- **La mise en lumière de la dette de traçabilité** : Le besoin de taguer systématiquement les versions, d'indiquer l'instance concernée dans les tickets, etc. a été rendu évident grâce à la mesure du Lead Time for Changes et du Change Failure Rate.

Ces métriques sont imparfaites (comme tout indicateur), mais elles offrent un "socle" suffisamment solide pour enclencher de vraies discussions et pour s'améliorer en continu.

### Enseignements clés

Cette expérience a impliqué de nombreuses adaptations et m'a permis de tirer plusieurs enseignements importants :

- **Standardisation nécessaire** : Les DORA Metrics nécessitent une standardisation des pratiques DevOps pour être efficaces

- **Adaptation au contexte** : Il est essentiel d'adapter les métriques au contexte spécifique de l'entreprise

- **Qualité des données cruciale** : La fiabilité des métriques dépend directement de la qualité des données collectées

- **Dimension humaine prépondérante** : L'accompagnement des équipes et la gestion du changement sont aussi importants que l'aspect technique

- **Pragmatisme indispensable** : Accepter les imperfections initiales et itérer progressivement est la clé du succès

### Perspectives d'évolution

Cette première phase d'implémentation nous a permis d'identifier plusieurs axes d'amélioration pour l'avenir :

- **Détection des changements de Configuration** : Déployer une solution pour tracer précisément les modifications de configuration, actuellement difficiles à distinguer des déploiements de code.

- **Granularité des incidents** : Enrichir ServiceNow pour associer chaque incident au composant ou à l'instance spécifique concernée, permettant ainsi un calcul plus précis du Change Failure Rate.

- **Automatisation accrue** : Réduire les interventions manuelles dans la collecte et le traitement des données pour améliorer la fiabilité et la fréquence de mise à jour des métriques.

## Conclusion 🙌

Ce retour d'expérience démontre que la mise en place des DORA Metrics dans un grand groupe est un projet de transformation à part entière. Au-delà des aspects techniques, c'est avant tout un projet humain qui nécessite pédagogie, pragmatisme et persévérance. 

Le parcours n’a pas été sans difficultés. Il y des inquiétudes, notamment parmi les personnes directement impliquées dans les projets. Grâce à des sponsors engagés et, surtout, à une approche basée sur la transparence et le temps accordé à chacun, nous avons pu atteindre nos objectifs.

Les bénéfices sont à la hauteur de l'investissement : une meilleure visibilité sur la performance de livraison, un langage commun entre les équipes, et surtout, une culture d'amélioration continue qui s'installe progressivement dans l'organisation.

> J'espère que ce partage d'expérience vous sera utile ! N'hésitez à me contacter [sur Linkedin](https://www.linkedin.com/in/maxime-deroullers-1b5791137/) ou [par mail](mailto:maxime@hoppr.tech) si vous souhaitez échanger sur le sujet 🙂

