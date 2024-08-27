# Publier un article

Ce guide explique comment publier un article sur le blog HoppR une fois qu'il a été rédigé dans Notion.

## Processus de publication

1. **Finalisation du contenu** :
   - Assurez-vous que votre article est complet et bien structuré dans Notion.
   - Vérifiez que toutes les métadonnées sont correctement remplies (titre, description, tags, auteurs, etc.).

2. **Gestion des auteurs** :
   - Si l'auteur n'existe pas encore, créez son profil dans la base de données Notion dédiée aux auteurs.
   - Liez le profil de l'auteur à l'article dans Notion.

3. **Relecture et validation** :
   - Demandez à un relecteur de vérifier votre article.
   - Effectuez les corrections nécessaires suite aux retours du relecteur.

4. **Marquer l'article comme prêt pour publication** :
   - Dans Notion, changez le statut de l'article à "Bon pour Publication".

5. **Processus automatisé** :
   Une fois l'article marqué comme "Bon pour Publication", le système :
   - Extrait le contenu de Notion.
   - Convertit le contenu en Markdown.
   - Crée une nouvelle branche sur GitHub.
   - Pousse le contenu sur cette branche.
   - Crée et fusionne automatiquement une pull request.

6. **Vérification post-publication** :
   - Attendez quelques minutes pour que le processus s'exécute.
   - Vérifiez le statut de l'article dans Notion (il devrait passer à "Publié").
   - Visitez le blog pour voir votre article publié.

## Résolution des problèmes

Si vous rencontrez des problèmes lors de la publication :

1. Vérifiez les logs pour identifier d'éventuelles erreurs.
2. Assurez-vous que toutes les métadonnées sont correctement remplies dans Notion.
3. Si le problème persiste, contactez l'équipe technique.

Pour plus de détails sur le processus technique, consultez la section [Processus de publication d'articles de blog](../technical/02_blog_post_publication_process.md).
