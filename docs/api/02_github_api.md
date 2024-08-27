# API GitHub

## Introduction

L'API GitHub est utilisée dans le blog HoppR pour gérer le contrôle de version et la publication automatisée des articles.

## Configuration

Configurez l'API GitHub en définissant les variables d'environnement suivantes :

- `GITHUB_TOKEN`: Votre token d'accès personnel GitHub
- `GITHUB_REPO_OWNER`: Le propriétaire du dépôt GitHub
- `GITHUB_REPO_NAME`: Le nom du dépôt GitHub

## Fonctions principales

### Créer une branche

```typescript
async function createBranch(branchName: string): Promise<void>
```

Cette fonction crée une nouvelle branche dans le dépôt GitHub pour un nouvel article.

### Créer une pull request

```typescript
async function createPullRequest(title: string, body: string, head: string, base: string): Promise<void>
```

Cette fonction crée une pull request pour fusionner le contenu d'un nouvel article dans la branche principale.

## Gestion des erreurs

Les erreurs de l'API GitHub sont gérées et loguées. Consultez les logs du serveur en cas de problème lors de l'interaction avec GitHub.

## Limites et considérations

- Assurez-vous d'avoir les permissions nécessaires pour créer des branches et des pull requests dans le dépôt configuré.
- Respectez les limites de taux de l'API GitHub pour éviter les restrictions temporaires.

Pour plus d'informations sur l'intégration GitHub, consultez la [documentation technique sur l'intégration GitHub](../technical/03_github_integration.md).
