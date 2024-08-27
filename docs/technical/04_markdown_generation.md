# Génération de Markdown

La génération de Markdown est une étape cruciale dans le processus de publication des articles du blog HoppR. Elle permet de convertir le contenu créé dans Notion en format Markdown compatible avec le système de blog.

## Processus de génération

1. **Extraction du contenu Notion** : Le contenu est extrait de la page Notion de l'article.

2. **Conversion en Markdown** : Les blocs de contenu Notion sont convertis en syntaxe Markdown.

3. **Traitement des métadonnées** : Les métadonnées de l'article (titre, auteurs, tags, etc.) sont extraites et formatées.

4. **Gestion des images** : Les images sont téléchargées, converties en WebP, et les liens sont mis à jour dans le Markdown.

## Code d'extraction et de conversion

L'extraction et la conversion du contenu sont gérées par le service Notion :

https://github.com/HoppR-tech/blog/blob/c54baa845f3324a1abdd434dbae9a0f7df71763d/server/services/notion/postRepository.ts#L1-L42

## Structure du Markdown généré

Le Markdown généré suit une structure spécifique :

```markdown
title: Exemple d'article
date: 2024-01-01T00:00:00.000Z
description:    Ceci est un exemple de description pour un article. Il sert à illustrer le format Markdown.
image: ./assets/exemple-image.webp
alt: Exemple d'image
ogImage: /images/og-image.png
tags: ['Technology', 'DDD', 'Java']
published: true
authors:
  - id: exemple-id-1
    name: Auteur Exemple 1
    image: ./assets/auteur-exemple-1.webp
    linkedin: https://www.linkedin.com/in/auteur-exemple-1/
    x: https://x.com/auteur1
  - id: exemple-id-2
    name: Auteur Exemple 2
    image: ./assets/auteur-exemple-2.webp
    linkedin: https://www.linkedin.com/in/auteur-exemple-2/
    x: 
reviewers:
  - id: exemple-id-3
    name: Relecteur Exemple
    image: ./assets/relecteur-exemple.webp
    linkedin: https://www.linkedin.com/in/relecteur-exemple/
    x: 
---

<!-- Contenu de l'article -->
```

## Gestion des éléments de texte enrichi

La conversion des éléments de texte enrichi est effectuée dans la fonction `convertBlocksToMarkdown`. Cette fonction traite différents types de blocs Notion et les convertit en syntaxe Markdown équivalente. Les principales opérations incluent :

- Conversion des paragraphes, titres, listes et citations.
- Traitement des images et ajustement de leurs URL.
- Conversion des blocs de code avec préservation de la coloration syntaxique.
- Gestion des liens et du formatage de texte (gras, italique, etc.).

## Extraction et formatage des métadonnées

L'extraction et le formatage des métadonnées sont réalisés en deux étapes principales :

1. Dans `pageContentExtractor.ts`, les métadonnées de base sont extraites de la page Notion.

2. Ces métadonnées sont ensuite formatées en frontmatter Markdown dans la fonction `generateMarkdownContent` du fichier `markdownGenerator.ts`.

https://github.com/HoppR-tech/blog/blob/c54baa845f3324a1abdd434dbae9a0f7df71763d/server/services/notion/markdownGenerator.ts#L3-L39

## Bonnes pratiques

- Assurez-vous que le contenu dans Notion est bien structuré pour une conversion optimale.
- Vérifiez la cohérence des métadonnées entre Notion et le Markdown généré.
- Testez régulièrement le processus de génération pour détecter d'éventuels problèmes.

Pour plus d'informations sur l'intégration avec Notion, consultez la section [Intégration Notion](02_notion_integration.md).