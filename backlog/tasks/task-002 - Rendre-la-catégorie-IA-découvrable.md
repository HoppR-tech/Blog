---
id: TASK-002
title: Rendre la catégorie IA découvrable
status: In Progress
assignee:
  - mderoullers
created_date: '2026-08-19 15:35'
updated_date: '2026-08-19 16:11'
labels:
  - feature
  - design
dependencies: []
references:
  - /categories
  - /categories/ia
documentation:
  - docs/ia/ia-blog-category/technical-decisions.md
  - docs/ia/ia-blog-category/ux-audit.md
  - docs/ia/ia-blog-category/user-guide.md
  - docs/DOMAIN.md
modified_files:
  - utils/categories.ts
  - pages/categories/index.vue
  - server/routes/llms.txt.ts
  - server/routes/ai/summary.json.ts
  - tests/seo/category-pages.test.ts
  - tests/seo/sitemap.test.ts
  - docs/DOMAIN.md
  - docs/ia/ia-blog-category/technical-decisions.md
  - docs/ia/ia-blog-category/ux-audit.md
  - docs/ia/ia-blog-category/user-guide.md
priority: medium
type: feature
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Les lecteurs ne peuvent pas découvrir depuis /categories les six articles déjà classés avec le tag exact ia. Le résultat attendu est une catégorie officielle IA découvrable, navigable et cohérente avec la taxonomie canonique.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 L’annuaire /categories présente la catégorie officielle IA avec son compteur dérivé des articles ayant le tag exact ia.
- [ ] #2 L’activation de la catégorie ouvre /categories/ia et ne liste que les articles portant le tag exact ia.
- [ ] #3 Les quatre catégories existantes conservent leur libellé, URL et comportement.
- [ ] #4 La taxonomie canonique documente IA parmi les catégories officielles.
- [ ] #5 Le rendu de la carte est vérifié au clavier, en mobile et dans les modes clair et sombre.
- [ ] #6 Les pages de catégorie et de tag présentent les articles par date de publication décroissante.
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Le parcours manuel /categories vers /categories/ia est documenté avec son résultat observable.
<!-- DOD:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Register the existing `ia` tag as the approved official category ‘Intelligence artificielle’ in the shared registry. 2. Keep existing category pages/components and tag frontmatter unchanged. 3. Align the canonical glossary plus category, llms.txt, and AI-summary discovery metadata. 4. Prove the registry contract with targeted tests, suite tests, focused lint, static contrast calculation, and a runtime smoke once the local SQLite ABI blocker is fixed.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-08-19: User requested recent-first order across category and tag article listings. Both dynamic routes now reuse the repository’s existing `queryCollection('blogs').order('date', 'DESC')` convention before exact-tag filtering. Runtime proof: /tags/craft and /categories/craft both start with the 13 August 2026 article and descend. `bun test` passes (306 tests); focused ESLint passes.
<!-- SECTION:NOTES:END -->
