# Brouillons de contenu éditorial pour les catégories

Ces 3 fichiers (`craft.md`, `cloud-platform.md`, `architecture.md`) sont des
**brouillons** de contenu éditorial sur les domaines d'expertise HoppR. Ils ont
été initialement intégrés comme « pillar pages » sur `/categories/<slug>` puis
retirés : une page catégorie est une archive utilitaire (regrouper des articles),
pas une page guide.

## Que faire de ces brouillons ?

Trois options :

1. **Les transformer en articles de blog publiés** via la pipeline Notion
   habituelle. Chaque article serait attribué à un·e auteur·rice, daté, avec ses
   stats d'engagement. Modèle de référence : l'article
   [Manifeste du Platform Craftsmanship](../../content/blogs/2026-02-03-le-manifeste-du-platform-craftsmanship-lengagement-hoppr/index.md)
   qui joue ce rôle pour le pilier Cloud & Platform.

2. **Les utiliser comme matière de communication HoppR** (LinkedIn, présentations
   commerciales, plaquette « nos domaines d'expertise ») hors blog.

3. **Les supprimer** s'ils ne servent plus.

## Pourquoi ils ne sont plus en prod

- Modèle UX : page catégorie = archive. Un visiteur arrive sur
  `/categories/craft` pour voir les articles tag craft, pas pour lire 500 mots
  qui dupliquent ce que les articles disent déjà.
- Modèle SEO : Google reconnaît les topic clusters via des articles-pilier
  datés avec auteurs, pas via des pages statiques. Un article daté
  « Notre approche du Software Craftsmanship » a plus de valeur SEO qu'une
  page catégorie surchargée.
- Maintenance : ces textes ne suivent pas le cycle de vie d'un article
  (publication, mise à jour, attribution), donc difficiles à maintenir.

## Tâche associée (si exploitation décidée)

Créer une carte Backlog.md du type `task-NNN-publish-pillar-article-<slug>`
qui propose un·e auteur·rice volontaire, un angle d'article concret, et planifie
la publication via Notion.
