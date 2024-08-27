# Démarrage rapide du Blog HoppR

Ce guide vous permettra de démarrer rapidement avec le Blog HoppR après l'installation et la configuration initiales.

## 1. Créer votre premier article

1. Ouvrez votre base de données Notion configurée pour le blog.
2. Créez une nouvelle page pour votre article.
3. Remplissez les champs nécessaires (titre, contenu, tags, etc.).
4. Marquez l'article comme "Bon pour Publication" dans Notion.

## 2. Déclencher la publication

Le processus de publication est automatisé. Une fois que vous avez marqué l'article comme "Bon pour Publication" dans Notion, le système :

1. Extraira le contenu de Notion.
2. Convertira le contenu en Markdown.
3. Créera une nouvelle branche sur GitHub.
4. Poussera le contenu sur cette branche.
5. Créera et fusionnera automatiquement une pull request.

Pour plus de détails sur ce processus, consultez la section [Processus de publication d'articles de blog](../technical/02_blog_post_publication_process.md).

## 3. Vérifier la publication

1. Attendez quelques minutes pour que le processus de publication s'exécute.
2. Vérifiez le statut de l'article dans Notion (il devrait passer à "Publié").
3. Visitez votre blog pour voir l'article publié.

## 4. Personnaliser le blog

Pour personnaliser l'apparence ou le comportement du blog :

1. Modifiez les fichiers de style dans le dossier `assets/`.
2. Ajustez les composants Vue dans le dossier `components/`.
3. Configurez les options SEO dans `nuxt.config.ts`.

## 5. Ajouter des auteurs

Pour ajouter de nouveaux auteurs au blog :

1. Suivez les instructions dans [Ajouter un nouvel auteur au blog](../user-guide/03_managing_authors.md).
2. Assurez-vous que les informations de l'auteur sont correctement renseignées dans Notion.

## Prochaines étapes

- Explorez la [documentation technique](../technical/) pour comprendre l'architecture du blog.
- Consultez le [guide utilisateur](../user-guide/) pour des instructions détaillées sur la création et la gestion du contenu.
- Familiarisez-vous avec l'[API](../api/) si vous prévoyez d'étendre les fonctionnalités du blog.

Pour toute question ou problème, n'hésitez pas à consulter la documentation ou à contacter l'équipe de support.
