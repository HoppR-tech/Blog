# Configuration Nuxt

La configuration de Nuxt est essentielle pour le bon fonctionnement du blog HoppR. Elle définit les modules utilisés, les options de génération de contenu, et les paramètres SEO.

## Fichier de configuration principal

Le fichier principal de configuration est `nuxt.config.ts` à la racine du projet.

## Modules clés

1. **Nuxt Content** : Gère le contenu Markdown du blog.
2. **@nuxtjs/tailwindcss** : Intègre Tailwind CSS pour le styling.
3. **@nuxtjs/color-mode** : Permet le mode sombre/clair.
4. **@nuxtjs/robots** : Gère le fichier robots.txt pour le SEO.
5. **@nuxtjs/sitemap** : Génère automatiquement le sitemap du blog.

## Configuration du contenu

La configuration de Nuxt Content est essentielle pour la gestion des articles de blog :

https://github.com/hoppr-tech/blog/blob/main/nuxt.config.ts#L15-L25

## Configuration SEO

Les métadonnées SEO par défaut sont définies dans la configuration :

https://github.com/hoppr-tech/blog/blob/main/nuxt.config.ts#L30-L45

## Génération d'images OG

La configuration pour la génération d'images Open Graph (OG) est définie comme suit :

```typescript
defineOgImageComponent('About', {
  headline: 'Bienvenue 👋',
  title: 'Blog Hoppr Tech',
  description: 'Partage, veille et ressources de la communauté sur les thématiques du Software Craftsmanship, du Cloud, de l\'architecture et de la Tech en générale.',
  imageTop: '/images/og-post.png',
  imageBottom: '/images/og-home.png',
})
```

## Bonnes pratiques

- Gardez la configuration Nuxt à jour avec les dernières versions des modules.
- Testez régulièrement la génération du site pour vous assurer que les changements de configuration n'ont pas d'effets indésirables.
- Optimisez les paramètres de génération pour améliorer les performances du site.

Pour plus d'informations sur l'architecture globale du blog, consultez la section [Architecture](01_architecture.md).
