# Intégration GitHub

L'intégration GitHub est un composant essentiel du processus de publication du blog HoppR. Elle permet de gérer le contrôle de version et la publication automatisée des articles.

## Configuration

La configuration de l'intégration GitHub se fait via les variables d'environnement suivantes :

https://github.com/hoppr-tech/blog/blob/main/docs/getting-started/02_configuration.md#L9-L13

## Fonctionnalités principales

1. **Création de branches** : Pour chaque nouvel article, une branche dédiée est créée.

2. **Gestion des pull requests** : Le système crée et fusionne automatiquement les pull requests pour les nouveaux articles.

3. **Conversion et téléchargement des images** : Les images sont converties au format WebP et téléchargées sur le repository.

4. **Génération du contenu Markdown** : Le contenu final en Markdown est généré et poussé sur la branche courante si elle est détectée, sinon sur la branche configurée dans le fichier `.env`.

## Processus d'intégration

Le service GitHub gère l'intégration avec le repository :

https://github.com/hoppr-tech/blog/blob/main/docs/technical/02_blog_post_publication_process.md#L15-L24

## Détection automatique de la branche

Le système détecte automatiquement la branche Git courante et l'utilise pour pousser les fichiers générés (markdown, images webp). Cela permet de travailler sur une branche de fonctionnalité et de voir les modifications sans affecter la branche principale.

Si vous êtes sur une branche autre que `main`, les fichiers générés seront poussés sur cette branche. Si vous êtes sur `main` ou si la branche ne peut pas être détectée, le système utilisera la valeur de `GITHUB_BRANCH` définie dans le fichier `.env`.

## Gestion des erreurs

En cas d'erreur lors de l'intégration GitHub, consultez les logs du processus de publication pour identifier le problème. Les erreurs courantes peuvent inclure des problèmes d'authentification ou des conflits de fusion.
