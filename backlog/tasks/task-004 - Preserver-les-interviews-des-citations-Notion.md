---
id: TASK-004
title: Préserver les interviews des citations Notion
status: Done
assignee:
  - mderoullers
created_date: '2026-10-26'
labels:
  - bug
  - test
priority: high
---

## Description

Spec : /Users/mderoullers/Dev/projects/perso/llm-second-brain/projects/hoppr-blog/needs/notion-nested-quotes.md

Source : https://hopprtech.slack.com/archives/C070A2MB9LM/p1792595851796659

## Acceptance Criteria

- [x] Les citations conservent leurs enfants, leur ordre, la pagination et la mise en forme.
- [x] Les erreurs de récupération et les images sans alt ne permettent pas une publication incomplète.
- [x] Les cinq interviews de l'article ergonomie sont restaurées depuis Notion sans changement d'URL.

## Definition of Done

- [x] Régression démontrée RED avant implémentation et tests ciblés GREEN après correction.
- [x] Lint ciblé et vérification du rendu des cinq citations (limite préexistante documentée ci-dessous).
- [x] Changements locaux préexistants conservés ; état de publication indiqué explicitement.

## Notes

- 2026-10-26 : exception utilisateur explicite pour le suivi local sans MCP Backlog et l'enchaînement tests RED → correction → validation.
- RED : 4 nouveaux tests en échec, 9 existants passants. GREEN : 38 tests Notion sous Vitest et 8 tests imageUtils sous Bun.
- Le lancement Vitest global du dossier échoue sur imageUtils.test.ts, qui importe bun:test. Le lancement Bun depuis le repo échoue dans son preload Vue préexistant ; les 8 tests images passent depuis /tmp, sans charger ce preload UI.
- ESLint ciblé : seuls les 5 console.log préexistants du convertisseur restent signalés ; aucun défaut avec no-console désactivé pour cette vérification. git diff --check valide.
- Rendu Nuxt local vérifié avec Node 22 (le Node par défaut est incompatible avec le binaire better-sqlite3 installé) : HTTP 200, six citations au total dont cinq interviews, aucune citation vide, témoignages de Bastien, Florian et Emma présents.
- Restauration par le convertisseur corrigé depuis l'API Notion, source inchangée pendant la lecture (last_edited_time : 2026-10-21T12:49:00.000Z). Comparaison automatisée : seuls les cinq encadrés diffèrent, tous les autres octets sont conservés.
- SHA-256 article avant : 5e7e4c05195e8a654d401d7e1ec34dfe3868cce5e8efca59d9b8e3f38d7ff137 ; après : c63f4fdc5ef8bde9b1389a1c0a79a8995dea0f45484ad5e9b6d4f8dfa1b91537.
- À l'issue de la validation initiale : livraison locale uniquement, aucun commit, push, changement Notion ou déploiement. Ne pas relancer /api/syncPosts pour cette réparation : le chemin de publication utilise la date courante et créerait potentiellement une deuxième URL.

## Intégration

- 2026-10-26 : création de https://github.com/HoppR-tech/Blog/pull/157 à la demande de l'utilisateur, avec fusion sur main demandée.
- Base actualisée : 744b87ed67dc4657ccbf54a5d8e232c656470414. L'article a déjà été restauré par la PR #156 ; son rendu Markdown est identique à la restauration locale depuis Notion. Cette PR conserve donc l'article de main et livre le correctif du convertisseur, les tests et ce suivi.
- Correctif : 75f64c9. Revalidation dans un worktree distinct, avec les dépendances locales réutilisées : 38 tests Notion passants, lint sans no-console et git diff --check passants. Les cinq console.log préexistants restent hors périmètre.
- Le premier lancement des tests du worktree n'a pu charger les suites, car .nuxt/tsconfig.json était absent. Après nuxt prepare sous Node 22, les 38 tests passent.
- Aucun contrôle CI de PR n'est configuré. Le build Docker et le déploiement seront déclenchés après fusion ; leur résultat doit être vérifié séparément de la fusion.
