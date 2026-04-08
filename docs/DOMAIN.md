# Ubiquitous Language (Glossaire Métier)

> Ce glossaire définit les termes du domaine métier. Il est la **source de vérité** pour la communication entre développeurs, stakeholders et IA.

## Comment utiliser ce glossaire

1. **Avant d'écrire du code** : Vérifie que tu utilises les termes officiels
2. **Nouveau concept ?** : Ajoute-le ici AVANT de l'implémenter
3. **Désaccord sur un terme ?** : Discute et mets à jour ce document

---

## Termes du Domaine

| Terme | Définition | Contexte |
|-------|------------|----------|
| Rich Snippet | Résultat de recherche enrichi avec des informations supplémentaires (image, auteur, breadcrumbs, date) | SEO, Google Search |
| Open Graph (OG) | Protocole de métadonnées utilisé par les réseaux sociaux pour générer les aperçus de liens partagés | SEO, Réseaux sociaux |
| JSON-LD | Format de données structurées recommandé par Google pour décrire le contenu d'une page | SEO, Structured Data |
| Canonical URL | URL de référence d'une page, indiquant aux moteurs de recherche quelle version indexer | SEO, Déduplication |
| Crawl Budget | Nombre de pages qu'un moteur de recherche va explorer sur un site dans un temps donné | SEO, Performance |
| Sitemap | Fichier XML listant toutes les URLs d'un site pour faciliter l'exploration par les moteurs | SEO, Indexation |
| Breadcrumb | Fil d'Ariane -- navigation hiérarchique montrant le chemin vers la page courante | SEO, UX, Navigation |
| Noindex | Directive indiquant aux moteurs de recherche de ne pas indexer une page | SEO, Crawl budget |
| lastmod | Date de dernière modification dans le sitemap, utilisée par les moteurs pour prioriser le crawl | SEO, Sitemap |
| Thin Content | Page avec peu de contenu propre, considérée comme de faible valeur par les moteurs | SEO, Qualité |
| Tag (taxonomie) | Mot-clé libre associé à un article pour le classifier | Blog, Classification |
| Catégorie (taxonomie) | Classification officielle d'un article parmi 4 thématiques prédéfinies (Craft, Cloud & Platform, Architecture, Autres & Événements) | Blog, Classification |
| Maillage interne | Ensemble des liens entre les pages d'un même site, favorisant la navigation et le référencement | SEO, Navigation |
| Related Posts | Articles connexes suggérés en fin d'article, basés sur un scoring par tags communs | Blog, Maillage interne |

---

## Entités

> Objets avec une identité unique qui persiste dans le temps.

| Entité | Description | Identifiant |
|--------|-------------|-------------|
| *[Entity]* | *[Rôle dans le domaine]* | *[Type d'ID]* |

---

## Value Objects

> Objets immuables définis uniquement par leurs attributs.

| Value Object | Description | Attributs |
|--------------|-------------|-----------|
| *[VO]* | *[Ce qu'il représente]* | *[Liste des attributs]* |

---

## Domain Events

> Faits métier qui se sont produits.

| Événement | Déclencheur | Données |
|-----------|-------------|---------|
| *[EventName]* | *[Quand il se produit]* | *[Informations transportées]* |

---

## Anti-Patterns (Termes à Éviter)

| Ne PAS utiliser | Utiliser à la place | Raison |
|--------------------|------------------------|--------|
| *[terme technique]* | *[terme métier]* | *[explication]* |
