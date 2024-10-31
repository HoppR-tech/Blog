# Scripts utilitaires

Ce dossier contient des scripts utilitaires pour la maintenance du blog.

## updateColonsInMarkdown.ts

Script qui met à jour le formatage des deux-points dans les fichiers markdown du blog.

### Fonctionnalités

- Ajoute des espaces insécables autour des deux-points (`:`) dans le contenu
- Préserve les deux-points dans les URLs (http:// et https://)
- Gère l'échappement des guillemets dans les champs frontmatter (title, description, alt)
- Ajoute des guillemets autour des valeurs si manquants

### Utilisation

```bash
# Installation des dépendances
npm install

# Exécution du script
npx ts-node scripts/updateColonsInMarkdown.ts
```

Le script parcourt automatiquement tous les fichiers markdown dans `content/blogs/*/index.md` et les met à jour.
