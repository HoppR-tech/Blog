# Tests sur branche/preview

Il est possible de tester le résultat de sa branche sur l'environnement de preview de Vercel, voire à y faire des appels à l'API Notion pour récupérer des articles, en les publiant uniquement sur la preview.

## Processus tests déploiement sur preview

- Création feature branch sur GitHub
- Le déploiement d'une branche se fait automatiquement sur preview par Vercel

## Processus tests publication d'articles sur preview

- Pour ne pas déployer des articles en prod mais sur la preview, changer la [variable d'environnement Vercel](https://vercel.com/team-hoppr-tech/blog/settings/environment-variables) **GITHUB_BRANCH** par le nom de la branche pour preview (_main_ en prod) 
- Pour tester la pulication d'un article, avoir un article en "bon pour publication" dans le [board des articles de Blog sur Notion](https://www.notion.so/hoppr-tech/cc3d5da28fc54ad982362d663b51e129).
- Appeler l'API du blog ([service syncPosts](../../server/api/syncPosts.ts)) avec l'URL de la preview  
    - Exemple : https://blog-git-feat-change-markdown-conversion-team-hoppr-tech.vercel.app/api/syncPosts

**N'oubliez pas de supprimer les articles de test avant de merger la branche de feature !**