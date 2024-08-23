# Configuration Nuxt et Déploiement

## Configuration du module Nuxt Content

Le blog HoppR utilise le module Nuxt Content pour gérer les articles de blog en Markdown. La configuration de base se trouve dans le fichier `nuxt.config.ts`. Voici les points clés :

1. Installation du module Nuxt Content
2. Configuration des options du module, notamment pour la gestion des articles de blog
3. Activation des fonctionnalités nécessaires, comme la recherche et le filtrage

## Génération dynamique des routes pour les articles de blog

Nuxt génère automatiquement les routes pour chaque article de blog basé sur la structure des fichiers dans le dossier `content/blogs`. Cette fonctionnalité est gérée par Nuxt Content et ne nécessite pas de configuration supplémentaire.

Les routes sont générées selon le modèle suivant :

- `/blog/[slug]` où `[slug]` est dérivé du nom du fichier Markdown de l'article

## Optimisation SEO et configuration des métadonnées

L'optimisation SEO est cruciale pour la visibilité du blog. Voici les principales configurations :

1. Utilisation du composant `<Head>` de Nuxt pour définir les métadonnées de base
2. Configuration des balises Open Graph pour un meilleur partage sur les réseaux sociaux
3. Génération automatique du sitemap

La configuration des métadonnées se fait principalement dans le fichier `app.vue` :

https://github.com/HoppR-tech/blog/blob/c54baa845f3324a1abdd434dbae9a0f7df71763d/app.vue#L1-L60

## Processus de déploiement

Le blog HoppR est conçu pour être facilement déployé sur des plateformes comme Netlify ou Vercel. Voici les étapes générales du processus de déploiement :

1. **Préparation du build** :
   - Exécution de `npm run build` pour générer les fichiers statiques

2. **Configuration de la plateforme de déploiement** :
   - Connexion du repository GitHub à la plateforme choisie
   - Configuration des variables d'environnement nécessaires

3. **Déploiement automatique** :
   - Mise en place d'un déclencheur de déploiement sur chaque push sur la branche principale

4. **Vérification post-déploiement** :
   - Tests automatisés pour s'assurer que le site fonctionne correctement
   - Vérification manuelle des principales fonctionnalités

## Variables d'environnement à renseigner

Pour le bon fonctionnement du blog, assurez-vous de configurer les variables d'environnement suivantes sur votre plateforme de déploiement :

- `NOTION_API_KEY` : Clé API pour l'intégration avec Notion
- `NOTION_DATABASE_ID` : ID de la base de données Notion contenant les articles
- `GITHUB_REPO_OWNER` : Nom du propriétaire du repository GitHub
- `GITHUB_REPO_NAME` : Nom du repository GitHub
- `GITHUB_BRANCH` : Branche GitHub où la pull request est mergée et les articles de blog sont publiés
- `GITHUB_APP_ID` : ID de l'application GitHub pour l'intégration avec le repository
- `GITHUB_PRIVATE_KEY` : Clé privée de l'application GitHub pour l'intégration avec le repository
- `SLACK_BOT_TOKEN` : Token du bot Slack pour les notifications
- `SLACK_CHANNEL_ID` : ID du channel Slack où les notifications sont envoyées

Ces variables sont essentielles pour l'intégration avec Notion, GitHub et Slack, ainsi que pour le bon fonctionnement du processus de publication automatisé.

Cette configuration assure un déploiement automatisé du blog HoppR, permettant une mise à jour rapide et efficace du contenu.
