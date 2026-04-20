---
title: "Docker, volumes et perte de données : pourquoi vos données “disparaissent”"
date: 2026-04-20T12:21:10.137Z
description: "Récemment, j’ai vécu ma première “vraie” perte de données dans mon homelab. Rien de critique… mais suffisamment frustrant pour me rappeler une règle essentielle avec Docker : 👉 Les données ne dispara"
image: ./assets/cover-image.webp
alt: "Image d’illustration: un conteneur cassé avec le texte “data lost” et un conteneur sécurisé avec une porte blindée"
ogImage: ./assets/cover-image.webp
tags: ['docker', 'cloud native', 'devops', 'rex', 'cloud-platform']
published: true
authors:
  - id: 33bf4462-cd38-80da-845c-c63b2fd024bf
    name: Florian Hirson
    image: ./assets/author-florian-hirson.webp
    linkedin: https://www.linkedin.com/in/florian-hirson/
    x: 
reviewers:
  - id: 67adfd77-4b84-4496-b55d-3391541f59c5
    name: Michaël Bernasinski
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/1f0a6cf7-edf2-44dc-babb-f1624e4f52b0/Photo_profil.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663TQKRAGF%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T122109Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJIMEYCIQCg0ObFNQFkHjuomoore1BPHaTxH09aHKDrX0xXqGgT9gIhAPq76mOOH4u1fvoqTo55SzrEk4stLmWlazOdFgjnCfh3Kv8DCBwQABoMNjM3NDIzMTgzODA1IgxYqcwNRzb5dQ1Vtpsq3AOuYmRM3pA%2BzCawOIVonAPnKrZAu7JCXOWJKfb4nEpeQqOxdqpni%2B7f5XNrj7%2Fr459jQ%2BZ3Q0XKijsRoUTJ7UG3r4kswDRjsmhx%2FC7Yx8tEIlh2nm%2BYnf%2BG%2B0gL5sf02P3j1Dk%2B%2Fme1iiwixLsI8OLbq7OBZ6MdWP0SlyJPQ8rUKV5P5EoltxRT7vrqW5O9p9YT%2FoUh%2BaZMMHScMccBsXovVy8546gy7n2ZieRZMesueJ8oA11nA1YnlwvYItYL3Cghsre%2BQWCMc28eUtLtrZcQ0u59VkULo35tiU4Elstd%2FsxbqMMrC0BH9H0ZvVeB2xrzWnXtdtWyHySGzExDsKFBjc0nXmuRpsy%2FgDiZJfQKg8FnZKPITNeQQ9AXZRzL6TVnIlltvGYPzqwVwzs8hyggxXHuWyjRWuKXHX%2F8D3bMHu7Eq5zLHPCe9PomqDSch0ht%2BdXYmjBJ9hyXcTjzi%2FAFaK5rgbRyA5tPslZ%2BdKZ2rCulaAtg2mnRElJM7xHuo4d7OZLIsI6zlNra7%2Brp7aHnFAKAhzuG7RUyNc%2BKPjYCW3Nx4fyj%2FuTOLzjdaUDx3Zc2QkTYH2ddyvwekX%2FdZBo92cmSv%2FxQ%2F5xLnaEdcEApVutFKUy44F1WKBDniDDklpjPBjqkAUTd0oQmPaF4RlDyRGyQGY%2F0lTzt0WBGr2eVZiWxsaYt62PiHaiPngXlQ1vdgeh66R7TDVFb3BbxEc3I0C2khxblxO68Pj0CDnh%2BCICNhq2c7IP53qDXo1Fvtok4tnWxAzxKbsks3oigNn3JnnHPNFYUHvlvtqxkPe6KJsHo%2F1Imp0Csaqthkb0Blwut9jPKiGKmhIoBXzUo7LwuPr7XvqwMTj3P&X-Amz-Signature=b7a75c2cfa8302cbc7e736ceba5003afdf84a8a6567b786b5628dbc3b7718a77&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
    linkedin: https://www.linkedin.com/in/michael-bernasinski
    x: 
  - id: 0bb914a6-f882-4951-bee6-53e8e8abb807
    name: Emmanuelle Gouvart
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c88f5dfa-16db-4e6f-acf1-34dd80ee8766/emma_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664YLE4Y53%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T122110Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFMaCXVzLXdlc3QtMiJHMEUCIQDz%2FxId2FpGz0f%2BeuhuP1jhshgRHgJsTjqguKOdeEO3qQIgZ8S9FJKryWM1Uwz1Llp0FgJS9CV5ZAepNexa4ZnM%2FHYq%2FwMIHBAAGgw2Mzc0MjMxODM4MDUiDI1xToCcu1LdvI7R2ircA%2Ba7w07%2FWFLCqDGSLzuI%2BESjovJLS2NgUWf8WTH6mGt4m8T%2F3eLswtdEtSgowTk0QE3ka%2FjH9JTgK%2Fu2BMTGs5jdBnT7afFWqg6wXgxlXByFxsbSSx%2BlZrUZsgalm6jBCurxA9XbCzBFp2ZTFP4LlebyZeijl9dxqoZRXkc7G%2BVxizucCTMvHkY%2BD1XXpZErcKnNdlFTcB2p88AfkS6nomailJJQLji4aPPMiTbVUKoTFQ7wrpM95kyemc4vHba2UuCmMDoN%2B%2BbEwSeeiJP6tV%2FMwqKane0lkIyCx9oxXE1iZX6FQlAV2DpLrro5ELB6a%2FnKAECFYzfbow%2BZxvsVnnKHseNPZRNoqsLozH8bMT0T4IuWykCQR6XUrHalXlReOjxZ10G74R%2FxgqWdoh6Y4F8KlwRWV0PhQc6JIP5u6%2B66n%2FvcqeYXkEnwlRUM2OKghiz5XW4V1C2zqAAwXJyrt9KSOD6zYwZ8uuM9Dp5EkegZH4%2Ftyx7F5Enl0zti2IrCaalLg4Y9brjMdLRTgmJMis9bKKsnKFGmZW%2FOmRx5yAtZrmKq7tCoH3Rrpx86vDH0%2BsbWQ%2BcoaegYqZuVKstFCkxraQDSpr4J8CWQzneE0Eb3gjJ6FXM330luElpjMNaWmM8GOqUBFrb%2BIFTapYz2nMqbi5hUI5EkXqtx73fc9lK3lXVdLGV1RS74toJNdI7xERnR6Ya3c4HohHOZuVRIPGbkuUilnEoMrwibwHdC0DMBZ1AKz%2Byw9iAmXDU9em9I1uEb40MDkOCXPGTQ6%2Bad3yqHoWGk6ACUwS8fBTU%2FA1N7G9WvEO8T2zz2Zsi%2FP586DfYa9UUj9zdMFX3mHXIVRS6aoVAff%2BjcxHCG&X-Amz-Signature=55fde89f97831dc3443a5994cc3208133c0c5374e4cd99fcd067b43242158736&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
    linkedin: https://www.linkedin.com/in/emmanuellegouvart-182b6ab2/
    x: 
---

<!-- markdownlint-disable-file -->


Récemment, j’ai vécu ma première “vraie” perte de données dans mon homelab.
Rien de critique… mais suffisamment frustrant pour me rappeler une règle essentielle avec Docker : 👉 **Les données ne disparaissent presque jamais. On ne regarde juste pas au bon endroit.**

## Le contexte : Calibre-Web dans mon cluster Docker Swarm

Pour gérer ma bibliothèque d'ebooks, j'ai déployé **Calibre-Web** sur mon cluster [Docker Swarm](https://docs.docker.com/engine/swarm/).

Tout fonctionnait parfaitement : j'uploadais des livres, je les lisais depuis n'importe quel appareil… bref, tout roulait. Quelques jours plus tard, je modifié ma stack et… catastrophe : plus aucun livre. Tout a disparu. 😱

Le plus étrange ? La configuration de Calibre-Web était toujours là. Comment était-ce possible ?

---

## Comprendre comment Docker gère les données

Avant de comprendre le problème, il faut rappeler un point fondamental :

### Par défaut, un conteneur Docker est éphémère

- Les fichiers sont stockés **dans le conteneur**

- Si le conteneur est supprimé → les données disparaissent

Pour éviter ça, on utilise :

- des **volumes Docker**

- des [**bind mounts**](https://docs.docker.com/engine/storage/bind-mounts/)

- ou des stockages distants (NFS, etc.)

👉 Mais Docker ne fait aucune magie :

> Il ne sait pas quels fichiers sont importants.

![Schéma illustrant l’emplacement des données dans Docker. À gauche, la machine hôte est divisée en deux zones : le disque (avec un volume Docker stocké dans `/var/lib/docker/volumes/...` et un répertoire local lié `/home/user/projects/...`) et la RAM (tmpfs, stockage temporaire comme `/tmp` ou `/run/secrets`, perdu à l’arrêt du conteneur). En bas, un conteneur contient trois points de montage : `/data` (volume), `/app/src` (bind mount vers le disque hôte) et `/tmp` (tmpfs en mémoire), utilisés par l’application. À droite, un réseau permet de connecter ces stockages à des systèmes externes comme NFS (Linux), SMB (Windows) ou des services cloud (EBS, EFS).](https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/30f69ec8-5b27-442b-ad9b-fad95a6ce679/Schema_stockage_donnes_docker.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663FQJROCN%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T122109Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIDH0vDjUnK9xgAsK%2BfupmKOGqPbtSQSj%2BJehSHFLtDBLAiAQuO2YNhY%2F0LGGOLZNdw0Q0Gb8RRk1lzsSGzHwZakf2Cr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIM9b5mULVsoJEyqVKaKtwDB4DfMHBZRJDMvffl7W2IXKPZQm4WtJ3pHwHJjdAzEs8ipEuXGsyvPnM5yup9MV0FfIi7DQAgAUhpEAHm4Ly6KsMYaBM0G8oWGJL7GFv7g%2B1p%2BKHLpYLY0jTd7tA8XV4CKcDM9JR5OL%2FWa0A9ibLFy5jRSbEp%2FWi3F3Cq9LgcB9EuEA1OOxb3p%2Bq0K1qsVWA47mSrP8M5kDBwMhryqfleCPelTDCbDBKSjKUKHpDwlU4hS0rxKIHDsSWS%2FCjb%2FKSCOIBSThJ0bTVktNV4nw5u%2BiVB4GET81GShL1%2FAzzD3scSQaGCGcGIwJ6q979DG6g122ds0uAXT2u6Qlg0FGih859JBOj2fodPh43R4DiJ9CFK2iHR1TefQ2cM7Vz6jVAYm%2FWlbIAU2nqfF7k8ihPGzMFYS5ZsMI9x1enI5PraKKja1jL%2FXUGuyWNGIFVY2KiDtQ0yXUXMIzbbb8YJMitdiXEc6O6MiUF2L9i6WZevhbmhnmGSd70mcfe%2FTWEdDAzKfStPztqXNDbOOqFTBDO3Y%2BxCd1eoRoAwWO3ucuzRdLGvLNHlEU2hCeQShBsk46c54lwbGIFVwzZkLjrL2jgGSWKFoDOIvjwPRvfBl3YUDNUtKKrh%2BtyTqjBbBscwkpeYzwY6pgE87%2BVmH0%2FKPLvH6WUMW6MZ25UGmRKPoVVby8xFyFobz0nhQsqaFiNOZdMTx0vYC12%2F6tMGfaim3BTi%2BbLnXRsFbOkNAmernySQmwkUmZq%2FEVueEG8esYnx9WyHONJ%2F0kVa5%2BBL3ZXa31RMAhHKCitCI%2B%2BYAr8gs0mJRZnUPz86%2FLqZ0tWBDVho6Ujg6N1GDd8owAYTU3k3eHpJeJEXVOAyyHXTRTc8&X-Amz-Signature=a95606ee62553139673618529acc0dd3f787884d0b62d2d90e17b8515257ed0d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

---

## L'origine du problème

Après investigation, j'ai identifié la cause :

- J'avais mal lu la documentation du conteneur

- J’avais monté un volume sur un mauvais chemin

- Et surtout : ce chemin **n’était pas utilisé par l’application**

Lors de la recréation du conteneur, Docker a fait exactement ce qu’il est censé faire :
👉 **Créer automatiquement un nouveau volume vide**

Résultat :

- mon application lisait un dossier vide

- mes données existaient toujours… mais dans un autre volume

---

## Une erreur très courante avec Docker

L’erreur que j’ai commise est en réalité assez fréquente avec Docker : monter un volume sur un mauvais chemin, ou sur un répertoire qui n’est tout simplement pas utilisé par l’application.

Dans ce type de situation, le comportement de Docker peut être trompeur. Le conteneur démarre sans problème, aucune erreur n’est remontée, et tout semble fonctionner normalement. Pourtant, les données ne sont pas écrites à l’endroit attendu.

En pratique, cela signifie que la persistance est silencieusement cassée : les fichiers sont stockés ailleurs, voire dans un volume éphémère, sans que cela ne soit immédiatement visible.

## Schéma : ce qu’il s’est vraiment passé

Pour comprendre visuellement :

👉 C’est exactement ce qui rend ce problème piégeux.

![Schéma montrant un conteneur Calibre-Web connecté à un NAS via des volumes Docker montés en NFS. Trois répertoires du conteneur (`/config`, `/library`, `/cwa-book-ingest`) sont reliés par des flèches vertes à des volumes stockés sur le NAS, indiquant un montage correct et fonctionnel. Un quatrième répertoire (`/books`) est représenté avec une ligne rouge en pointillés, signalant un volume mal monté ou non fonctionnel. Le NAS est illustré comme un stockage central recevant et fournissant les données au conteneur.](https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/5310fdfc-ef55-4908-a0bd-ccb3d948bff5/fossflow-diagram.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663FQJROCN%2F20260420%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260420T122109Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJGMEQCIDH0vDjUnK9xgAsK%2BfupmKOGqPbtSQSj%2BJehSHFLtDBLAiAQuO2YNhY%2F0LGGOLZNdw0Q0Gb8RRk1lzsSGzHwZakf2Cr%2FAwgcEAAaDDYzNzQyMzE4MzgwNSIM9b5mULVsoJEyqVKaKtwDB4DfMHBZRJDMvffl7W2IXKPZQm4WtJ3pHwHJjdAzEs8ipEuXGsyvPnM5yup9MV0FfIi7DQAgAUhpEAHm4Ly6KsMYaBM0G8oWGJL7GFv7g%2B1p%2BKHLpYLY0jTd7tA8XV4CKcDM9JR5OL%2FWa0A9ibLFy5jRSbEp%2FWi3F3Cq9LgcB9EuEA1OOxb3p%2Bq0K1qsVWA47mSrP8M5kDBwMhryqfleCPelTDCbDBKSjKUKHpDwlU4hS0rxKIHDsSWS%2FCjb%2FKSCOIBSThJ0bTVktNV4nw5u%2BiVB4GET81GShL1%2FAzzD3scSQaGCGcGIwJ6q979DG6g122ds0uAXT2u6Qlg0FGih859JBOj2fodPh43R4DiJ9CFK2iHR1TefQ2cM7Vz6jVAYm%2FWlbIAU2nqfF7k8ihPGzMFYS5ZsMI9x1enI5PraKKja1jL%2FXUGuyWNGIFVY2KiDtQ0yXUXMIzbbb8YJMitdiXEc6O6MiUF2L9i6WZevhbmhnmGSd70mcfe%2FTWEdDAzKfStPztqXNDbOOqFTBDO3Y%2BxCd1eoRoAwWO3ucuzRdLGvLNHlEU2hCeQShBsk46c54lwbGIFVwzZkLjrL2jgGSWKFoDOIvjwPRvfBl3YUDNUtKKrh%2BtyTqjBbBscwkpeYzwY6pgE87%2BVmH0%2FKPLvH6WUMW6MZ25UGmRKPoVVby8xFyFobz0nhQsqaFiNOZdMTx0vYC12%2F6tMGfaim3BTi%2BbLnXRsFbOkNAmernySQmwkUmZq%2FEVueEG8esYnx9WyHONJ%2F0kVa5%2BBL3ZXa31RMAhHKCitCI%2B%2BYAr8gs0mJRZnUPz86%2FLqZ0tWBDVho6Ujg6N1GDd8owAYTU3k3eHpJeJEXVOAyyHXTRTc8&X-Amz-Signature=495ddfab8a9151e3c998b243c3aac7a1a24312ef179a24be538c8db0fd9e64ae&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

👉 **La clé à comprendre :** Docker ne “perd” pas les données. Il les écrit simplement **ailleurs que là où l’application les lit**.

---

## La configuration corrigée

Voici la stack Compose fonctionnelle :

```yaml
services:
  calibre-web-automated:
    image: crocodilestick/calibre-web-automated:v4.0.6
    networks:
      - proxy
    volumes:
      - calibre-web-config:/config
      - calibre-web-library:/calibre-library
      - calibre-web-ingest:/cwa-book-ingest
      - /etc/localtime:/etc/localtime:ro
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Paris
      - DOCKER_MODS=linuxserver/mods:universal-calibre
    deploy:
      mode: replicated
      replicas: 1

networks:
  proxy:
    external: true

volumes:
  calibre-web-config:
    driver: local
    driver_opts:
      type: nfs
      o: addr=192.168.0.174,nolock,soft,rw
      device:":/volume1/docker-swarm-nfs/calibre-web/config"
  calibre-web-library:
    driver: local
    driver_opts:
      type: nfs
      o: addr=192.168.0.174,nolock,soft,rw
      device:":/volume1/docker-swarm-nfs/calibre-web/library"
  calibre-web-ingest:
    driver: local
    driver_opts:
      type: nfs
      o: addr=192.168.0.174,nolock,soft,rw
      device:":/volume1/docker-swarm-nfs/calibre-web/ingest"
```

Cette fois, tous les répertoires utilisés par l’application sont correctement persistés.

---

## Comment tester la persistance d’un service

Une bonne pratique simple (et souvent oubliée) :

- Démarrer le service

- Ajouter une donnée (ex : un fichier ou un livre en l'occurrence)

- Supprimer le conteneur

- Le recréer

- Vérifier que la donnée est toujours présente et accessible

👉 Si ce test échoue, votre persistance est cassée.

---

## Ce que j'ai appris

Cette expérience m’a appris une chose essentielle :
👉 **Avec Docker, une donnée n’est persistante que si vous savez exactement où elle est écrite.**

Les volumes ne sont pas compliqués… mais ils sont **implicites** :

- Docker ne valide pas votre intention

- Il exécute simplement votre configuration

Résultat : une simple erreur de mapping peut donner l’impression que les données ont disparu, alors qu’elles sont juste… ailleurs.

## Conclusion

Docker est un outil extrêmement puissant, mais aussi très permissif. Et c’est justement ça le danger.

En pratique, ce qu’il faut retenir :

- Identifiez toujours les dossiers critiques d’une application

- Vérifiez où les données sont réellement écrites

- Testez systématiquement vos déploiements

- Et surtout : **ne faites jamais confiance à une configuration non testée**

Parce qu’en production, ce type d’erreur ne pardonne pas.