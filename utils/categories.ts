export const categoryColors = {
  'craft': { light: '#00853E', dark: '#10B981' },
  'cloud-platform': { light: '#8b5cf6', dark: '#A78BFA' },
  'architecture': { light: '#f43f5e', dark: '#FB7185' },
  'others': { light: '#3b82f6', dark: '#60A5FA' },
}

/**
 * SEO descriptions per category (150-160 chars, optimized for SERP snippets
 * and LLM ingestion). One source of truth — consumed by category pages and
 * the homepage llms.txt indirectly via the sitemap.
 */
export const categorySeoDescriptions = {
  'craft': 'Articles HoppR sur le Software Craftsmanship : TDD, refactoring, DDD, clean code, BDD, hexagonal. REX et patterns issus du terrain par l\'équipe tech HoppR.',
  'cloud-platform': 'Articles HoppR sur le Cloud et Platform Engineering : AWS, GCP, Kubernetes, Terraform, observabilité Datadog, FinOps, plateformes internes et IDP.',
  'architecture': 'Articles HoppR sur l\'architecture logicielle : Domain-Driven Design, événementiel, microservices vs modular monolith, patterns de résilience, contrats API.',
  'others': 'Articles HoppR sur la communauté tech : retours de conférences (DevFest, Lyon Craft, Cloud Nord), interviews, formations, événements tech francophones.',
}

export const categories = [
  { label: 'Craft', value: 'craft', icon: 'mdi:hammer-wrench', colors: categoryColors.craft, seoDescription: categorySeoDescriptions.craft },
  { label: 'Cloud & Platform', value: 'cloud-platform', icon: 'mdi:cloud-outline', colors: categoryColors['cloud-platform'], seoDescription: categorySeoDescriptions['cloud-platform'] },
  { label: 'Architecture', value: 'architecture', icon: 'mdi:office-building', colors: categoryColors.architecture, seoDescription: categorySeoDescriptions.architecture },
  { label: 'Autres & Événements', value: 'others', icon: 'mdi:dots-horizontal', colors: categoryColors.others, seoDescription: categorySeoDescriptions.others },
]
