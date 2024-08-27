# Configuration du Blog HoppR

Ce guide vous aidera à configurer correctement le Blog HoppR après l'installation.

## Variables d'environnement

Créez un fichier `.env` à la racine du projet et configurez les variables suivantes :

```env
NOTION_API_KEY=votre_clé_api_notion
NOTION_DATABASE_ID=id_de_votre_base_de_données_notion
GITHUB_REPO_OWNER=propriétaire_du_repo_github
GITHUB_REPO_NAME=nom_du_repo_github
GITHUB_BRANCH=branche_principale
GITHUB_APP_ID=id_de_votre_app_github
GITHUB_PRIVATE_KEY=clé_privée_de_votre_app_github
SLACK_BOT_TOKEN=token_de_votre_bot_slack
SLACK_CHANNEL_ID=id_du_canal_slack
```

Assurez-vous de remplacer les valeurs par vos propres informations.

## Configuration de Nuxt

Le fichier `nuxt.config.ts` contient la configuration principale de l'application. Voici les points clés à vérifier :

1. Modules : Assurez-vous que tous les modules nécessaires sont activés.
2. Configuration de Nuxt Content : Vérifiez que les options de Nuxt Content sont correctement définies.
3. Métadonnées SEO : Personnalisez les métadonnées par défaut pour le SEO.

## Configuration de l'intégration Notion

1. Créez une intégration Notion et obtenez votre clé API.
2. Partagez votre base de données Notion avec l'intégration.
3. Copiez l'ID de la base de données Notion.

## Configuration de l'intégration GitHub

1. Créez une application GitHub pour votre organisation.
2. Générez une clé privée pour l'application.
3. Notez l'ID de l'application et la clé privée.

## Configuration de l'intégration Slack

1. Créez une application Slack pour votre espace de travail.
2. Obtenez le token du bot et l'ID du canal pour les notifications.

Pour plus de détails sur chaque intégration, consultez les sections correspondantes dans la documentation technique.

## Vérification de la configuration

Après avoir configuré toutes les variables et intégrations, exécutez les commandes suivantes pour vérifier que tout fonctionne correctement :

```bash
npm run dev
```

Accédez à `http://localhost:3000` dans votre navigateur pour vérifier que le blog s'affiche correctement.

Pour plus d'informations sur le déploiement, consultez la section [Déploiement](../technical/06_deployment.md).
