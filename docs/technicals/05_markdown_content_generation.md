# Génération de contenu Markdown

## Conversion du contenu Notion en Markdown

La conversion du contenu Notion en Markdown est gérée principalement par la fonction `getPageContent` dans le fichier `pageContentExtractor.ts`. Cette fonction effectue les opérations suivantes :

1. Récupère les blocs de contenu de la page Notion.
2. Convertit ces blocs en Markdown à l'aide de la fonction `convertBlocksToMarkdown`.
3. Extrait les métadonnées importantes telles que les auteurs, les relecteurs, les tags et les images de couverture.

Voici la partie pertinente du code :
https://github.com/HoppR-tech/blog/blob/c54baa845f3324a1abdd434dbae9a0f7df71763d/server/services/notion/pageContentExtractor.ts#L7-L43

## Gestion des éléments de texte enrichi

La gestion des éléments de texte enrichi (images, blocs de code, etc.) est effectuée dans la fonction `convertBlocksToMarkdown`. Cette fonction traite différents types de blocs Notion et les convertit en syntaxe Markdown équivalente. Les principales opérations incluent :

- Conversion des paragraphes, titres, listes et citations.
- Traitement des images et ajustement de leurs URL.
- Conversion des blocs de code avec préservation de la coloration syntaxique.
- Gestion des liens et du formatage de texte (gras, italique, etc.).

## Extraction et formatage des métadonnées

L'extraction et le formatage des métadonnées sont réalisés dans plusieurs étapes du processus :

1. Dans `pageContentExtractor.ts`, les métadonnées de base (titre, auteurs, relecteurs, tags, etc.) sont extraites de la page Notion.

2. Ces métadonnées sont ensuite formatées en frontmatter Markdown dans la fonction `generateMarkdownContent` du fichier `markdownGenerator.ts`. Voici un extrait du code pertinent :

https://github.com/HoppR-tech/blog/blob/c54baa845f3324a1abdd434dbae9a0f7df71763d/server/services/notion/markdownGenerator.ts#L3-L39

Cette fonction :

- Crée le frontmatter YAML pour l'article de blog.
- Formate les informations des auteurs et des relecteurs.
- Ajoute les tags, la date de publication, et d'autres métadonnées importantes.

Le résultat final est un fichier Markdown complet avec un frontmatter bien structuré et le contenu de l'article converti à partir de Notion.

Cette approche garantit une conversion fidèle du contenu Notion en Markdown, tout en préservant les métadonnées essentielles et en gérant correctement les éléments de texte enrichi.
