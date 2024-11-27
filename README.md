# Blog HoppR - Documentation

Bienvenue dans la documentation du Blog HoppR. Ce projet est une plateforme de blog moderne utilisant Nuxt.js, intégrant Notion pour la gestion de contenu et GitHub pour le contrôle de version.

## Table des matières

1. [Blog HoppR - Documentation](#blog-hoppr---documentation)
   1. [Table des matières](#table-des-matières)
   2. [Pour commencer](#pour-commencer)
   3. [Guide utilisateur](#guide-utilisateur)
   4. [Documentation technique](#documentation-technique)
   5. [API](#api)

## Pour commencer

- [Installation](docs/getting-started/01_installation.md)
- [Configuration](docs/getting-started/02_configuration.md)
- [Démarrage rapide](docs/getting-started/03_quick_start.md)

## Guide utilisateur

- [Rédiger un article de blog](docs/user-guide/01_writing_blog_post.md)
- [Publier un article](docs/user-guide/02_publishing_article.md)
- [Gérer les auteurs](docs/user-guide/03_managing_authors.md)

## Documentation technique

- [Architecture globale](docs/technical/01_architecture.md)
- [Intégration Notion](docs/technical/02_notion_integration.md)
- [Intégration GitHub](docs/technical/03_github_integration.md)
- [Génération de Markdown](docs/technical/04_markdown_generation.md)
- [Configuration Nuxt](docs/technical/05_nuxt_configuration.md)
- [Déploiement](docs/technical/06_deployment.md)
- [Tests sur branche/preview](docs/technical/07_tests_on_branch_preview.md)

## API

- [API Notion](docs/api/01_notion_api.md)
- [API GitHub](docs/api/02_github_api.md)
- [API Slack](docs/api/03_slack_api.md)

Pour plus d'informations sur l'utilisation du blog, veuillez consulter notre [documentation utilisateur sur Notion](https://www.notion.so/hoppr-tech/Blog-HoppR-2cb814dde33e4356b0034a4457d6d3c4?p=95fafd7733564616b75bc8947216a4da&pm=s).
# Scripts de formatage pour le blog

Ce dépôt contient des scripts utilitaires pour formater le contenu du blog.

## Scripts disponibles

### Formatage des guillemets dans le frontmatter (`addFrontmatterQuotes.ts`)

Ce script ajoute des guillemets doubles autour des valeurs des champs spécifiques dans le frontmatter des fichiers Markdown.

**Champs concernés :**
- `title`
- `description`
- `alt`

Les guillemets doubles existantes dans ces champs sont automatiquement échappées avec un backslash.

**Utilisation :**
```bash
npx tsx scripts/addFrontmatterQuotes.ts
```

**Exemple de transformation :**
```yaml
# Avant
title: Mon titre avec "guillemets"
```

```yaml
# Après
title: "Mon titre avec \"guillemets\""
```

## Contribution

Pour contribuer, assurez-vous de :
1. Tester vos modifications sur des fichiers de test avant de les appliquer sur le contenu réel
2. Maintenir la compatibilité avec le format YAML existant
3. Documenter tout nouveau script ou modification majeure
