# Gestion des auteurs et des relecteurs

## Profils et métadonnées des auteurs

Les profils des auteurs sont gérés via Notion et intégrés dans les articles de blog. Voici un exemple de structure pour les métadonnées d'un auteur dans un article de blog Markdown:

```md
authors:
  - id: 838dcf96-f9fd-404f-b302-07719225s785
    name: Maxime Deroullers
    image: ./assets/author-maxime-deroullers.webp
    linkedin: https://www.linkedin.com/in/maxime-deroullers-1b5791137/
    x: https://x.com/mderoullers
  - id: e8163b24-7001-2703-adbf-0dc6554929d0
    name: Nicolas Zago
    image: ./assets/author-nicolas-zago.webp
    linkedin: https://www.linkedin.com/in/nicolaszago/
    x: 
```

Chaque auteur possède :

- Un identifiant unique
- Un nom
- Une image de profil
- Des liens vers ses profils LinkedIn et X (en option)

## Attribution et suivi des relecteurs

Les relecteurs sont également gérés dans Notion et associés aux articles. Voici un exemple de structure pour les métadonnées d'un relecteur :

```md
reviewers:
  - id: 838dcf86-f9bd-404c-b302-07719225f785
    name: Maxime Deroullers
    image: ./assets/author-maxime-deroullers.webp
    linkedin: https://www.linkedin.com/in/maxime-deroullers-1b5791137/
    x: https://x.com/mderoullers
```

Les relecteurs ont des métadonnées similaires aux auteurs, permettant une identification et un suivi clairs.

## Intégration avec Notion pour les informations des auteurs et des relecteurs

Les informations des auteurs et des relecteurs sont extraites de Notion lors du processus de publication. Le service Notion gère cette extraction :

https://github.com/HoppR-tech/blog/blob/c54baa845f3324a1abdd434dbae9a0f7df71763d/server/services/notion/postRepository.ts#L1-L42

Ce processus assure que les informations les plus récentes des auteurs et des relecteurs sont toujours incluses dans les articles publiés.

La gestion via Notion offre plusieurs avantages :

1. Centralisation des informations
2. Mise à jour facile des profils
3. Intégration fluide avec le processus de publication

Cette approche permet une gestion efficace et flexible des auteurs et des relecteurs, tout en maintenant la cohérence des informations à travers le blog.
