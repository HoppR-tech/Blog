# Déploiement

Le déploiement du blog HoppR est automatisé pour assurer une mise en production fluide et cohérente.

## Processus de déploiement

1. **Préparation du contenu** : Le contenu est extrait de Notion et converti en Markdown.
2. **Intégration GitHub** : Les changements sont poussés sur une branche GitHub.
3. **Génération du site** : Nuxt génère le site statique.
4. **Déploiement** : Le site est déployé sur la plateforme d'hébergement.

## Plateforme de déploiement

Le blog HoppR est déployé sur Vercel.

## Configuration du déploiement

La configuration du déploiement est définie dans le fichier `vercel.json`.

## Variables d'environnement

Assurez-vous que les variables d'environnement suivantes sont correctement configurées sur la plateforme de déploiement :

https://github.com/hoppr-tech/blog/blob/main/docs/getting-started/02_configuration.md#L7-L16

## Workflow de déploiement automatisé

Le déploiement est déclenché automatiquement lors de la fusion d'une pull request dans la branche principale. Le processus est le suivant :

1. La pull request est fusionnée.
2. Vercel déclenche le workflow de déploiement.
3. Le site est généré avec les nouveaux contenus.
4. Le site généré est déployé sur Vercel.

## Vérification post-déploiement

Après chaque déploiement, vérifiez les points suivants :

1. Le site est accessible et fonctionne correctement.
2. Les nouveaux articles sont visibles et correctement formatés.
3. Les performances du site sont optimales (utilisez des outils comme Lighthouse).

## Rollback

En cas de problème après un déploiement, un rollback peut être effectué en redéployant la version précédente du site.
