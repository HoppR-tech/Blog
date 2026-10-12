# Diagrammes Mermaid

Le blog HoppR affiche les diagrammes [Mermaid](https://mermaid.js.org/) (flowcharts, diagrammes de séquence, etc.) comme dans Notion.

## Ajouter un diagramme

Dans Notion, insérez un bloc de code et choisissez le langage **Mermaid**. Lors de la synchronisation, il devient un bloc ` ```mermaid ` dans le Markdown de l'article, puis il est dessiné en diagramme sur le blog.

Exemple :

```text
flowchart LR
    A[Feedback explicite<br/>👍 / 👎] --> B[Agrégation + seuil]
    B --> C[Ajuste le retrieval]
```

## Bon à savoir

- Le diagramme suit le thème clair / sombre du lecteur.
- Un diagramme large est réduit pour tenir dans la colonne, sans descendre sous une taille de texte lisible : au-delà, il défile horizontalement. Préférez des diagrammes compacts, en particulier pour les lecteurs sur mobile.
- Si la syntaxe est invalide, le blog affiche le code source du diagramme à la place. Vérifiez votre diagramme sur [mermaid.live](https://mermaid.live) en cas de doute.
