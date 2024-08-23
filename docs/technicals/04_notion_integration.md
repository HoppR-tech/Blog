# Intégration Notion

## Configuration de l'API et authentification

L'intégration avec Notion utilise l'API officielle de Notion. La configuration et l'authentification sont gérées dans le dossier `/server/services/notion`. Les clés d'API et autres paramètres de configuration sont stockés de manière sécurisée et ne sont pas exposés publiquement.

## Extraction de contenu des pages Notion

L'extraction du contenu des pages Notion est réalisée par la fonction `getPageContent` dans le fichier `pageContentExtractor.ts`. Cette fonction :

1. Récupère les blocs de contenu de la page Notion
2. Convertit ces blocs en Markdown
3. Extrait les métadonnées importantes comme les auteurs, les relecteurs, les tags, et les images de couverture

Voici un extrait du code pertinent :

https://github.com/HoppR-tech/blog/blob/c54baa845f3324a1abdd434dbae9a0f7df71763d/server/services/notion/pageContentExtractor.ts#L7-L43

## Mappage des structures Notion vers le format d'article de blog

Le mappage des structures Notion vers le format d'article de blog se fait en plusieurs étapes :

1. **Extraction des métadonnées** : Les propriétés de la page Notion (titre, auteurs, relecteurs, tags, etc.) sont extraites et converties dans le format approprié pour le blog.

2. **Conversion du contenu** : Le contenu de la page Notion est converti en Markdown à l'aide de la fonction `convertBlocksToMarkdown`. Cette fonction gère divers types de blocs Notion (paragraphes, listes, images, etc.) et les transforme en syntaxe Markdown équivalente.

3. **Gestion des images** : Les images sont extraites, converties au format webp et leurs URL sont ajustées pour correspondre à la structure du blog.

4. **Création de la structure finale** : Toutes ces informations sont combinées pour créer un objet `PageContent` qui représente l'article de blog complet.

Le résultat final est une structure qui peut être facilement utilisée par le système de blog pour générer les pages Markdown et les métadonnées associées.

Cette approche permet une transition fluide du contenu de Notion vers le format requis par le blog, tout en préservant le contenu initial et les métadonnées importantes.
