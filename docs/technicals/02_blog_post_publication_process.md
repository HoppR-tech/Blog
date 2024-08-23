# Processus de publication d'articles de blog

## 1. Création de contenu dans Notion

Les auteurs créent le contenu initial dans Notion. Cette plateforme sert d'interface conviviale pour la rédaction et la collaboration.

## 2. Extraction et conversion en Markdown

Le contenu est extrait de Notion et converti en Markdown. Ce processus est géré par le service Notion :

https://github.com/HoppR-tech/blog/blob/c54baa845f3324a1abdd434dbae9a0f7df71763d/server/services/notion/postRepository.ts#L1-L42

## 3. Intégration GitHub pour le contrôle de version

Le service GitHub gère l'intégration avec le repository :

https://github.com/HoppR-tech/blog/blob/c54baa845f3324a1abdd434dbae9a0f7df71763d/server/services/github/githubService.ts#L10-L59

Ce service :

- Crée une nouvelle branche pour l'article
- Télécharge les images, les convertit en webp et met à jour le contenu
- Génère le contenu Markdown final
- Crée une pull request pour la publication

## 4. Workflow de publication automatisé

Le processus de publication est automatisé :

1. L'article est extrait de Notion quand il est marqué comme "Bon pour Publication"
2. Le contenu est converti en Markdown et les images sont traitées
3. Une nouvelle branche est créée sur GitHub
4. Le contenu est poussé sur cette branche
5. Une pull request est créée et fusionnée automatiquement
6. Le statut de l'article est mis à jour dans Notion comme "Publié" et la date de publication est mise à jour

Ce workflow assure une transition fluide du contenu de Notion vers le blog public, avec un contrôle de version via GitHub.
