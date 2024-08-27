# API Notion

## Introduction

L'API Notion est utilisée pour interagir avec la base de données Notion qui stocke le contenu du blog HoppR. Cette intégration permet d'extraire le contenu des articles et les informations des auteurs.

## Configuration

La configuration de l'API Notion se fait via les variables d'environnement. Assurez-vous que les variables suivantes sont correctement définies :

- `NOTION_API_KEY`: Votre clé d'API Notion
- `NOTION_DATABASE_ID`: L'ID de la base de données Notion contenant les articles

## Fonctions principales

### Extraire le contenu d'un article

```typescript
async function getPageContent(pageId: string): Promise<PageContent>
```

Cette fonction récupère le contenu d'une page Notion spécifique et le convertit en un format utilisable par le blog.

### Lister les articles

```typescript
async function listArticles(): Promise<Article[]>
```

Cette fonction récupère la liste de tous les articles publiés dans la base de données Notion.

## Gestion des erreurs

Les erreurs de l'API Notion sont gérées de manière centralisée. En cas d'erreur, consultez les logs du serveur pour plus de détails.

## Limites et considérations

- Respectez les limites de taux de l'API Notion pour éviter les blocages.
- Assurez-vous que la structure de votre base de données Notion correspond à celle attendue par l'application.

Pour plus de détails sur l'intégration Notion, consultez la [documentation technique sur l'intégration Notion](../technical/02_notion_integration.md).
