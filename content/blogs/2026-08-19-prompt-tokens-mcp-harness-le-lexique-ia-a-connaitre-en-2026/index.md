---
title: "Prompt, tokens, MCP, harness... le lexique IA à connaître en 2026"
date: 2026-08-19T16:35:59.667Z
description: "L’IA est dans toutes les bouches aujourd’hui, que ce soit celles des développeurs, des personnes au produit, des gens au board, des ressources humaines, bref partout.  Mais, êtes-vous bien sûr de comp"
image: ./assets/cover-image.webp
alt: "Une image abstraite pour illustrer mon article qui pose le vocabulaire de l’IA"
ogImage: ./assets/cover-image.webp
tags: ['ia', '2026']
published: true
authors:
  - id: 188f4462-cd38-80d5-b9e6-ec28a94d11e5
    name: Bastien Dufour
    image: ./assets/author-bastien-dufour.webp
    linkedin: https://www.linkedin.com/in/b-dufour/
    x: 
    jobTitle: "Senior Software Engineer"
    bio: "I use vim btw"
reviewers:
  - id: 838dec96-f9fc-404f-a302-07719225d785
    name: Maxime Deroullers
    image: ./assets/reviewer-maxime-deroullers.webp
    linkedin: https://www.linkedin.com/in/maxime-deroullers-1b5791137/
    x: https://x.com/mderoullers
  - id: f09c2e62-135b-40c0-a141-b239e8e1e761
    name: Elisa Degobert
    image: ./assets/reviewer-elisa-degobert.webp
    linkedin: https://www.linkedin.com/in/degobert/
    x: 
  - id: 33bf4462-cd38-80da-845c-c63b2fd024bf
    name: Florian Hirson
    image: ./assets/reviewer-florian-hirson.webp
    linkedin: https://www.linkedin.com/in/florian-hirson/
    x: 
  - id: 320f4462-cd38-8071-8eb7-f90621a068a3
    name: Marjorie Dieusart
    image: ./assets/reviewer-marjorie-dieusart.webp
    linkedin: https://www.linkedin.com/in/marjorie-dieusart/
    x: 
---

<!-- markdownlint-disable-file -->


L’IA est dans toutes les bouches aujourd’hui, que ce soit celles des développeurs, des personnes au produit, des gens au board, des ressources humaines, bref partout.

Mais, _êtes-vous bien sûr de comprendre de quoi on parle ?_ Depuis la genèse de l’IA générative en fin 2022, jusqu’à maintenant _(août 2026)_ en passant par l’essor des coding agents, un vocabulaire complet s’est construit autour de ces outils, le maîtriser peut tout changer.

Une grosse partie de ce vocabulaire est souvent en anglais, beaucoup d’incompréhensions viennent du fait que les gens ont tendance à mélanger les termes. Donc si vous avez le sentiment d’être perdu ou simplement de ne pas savoir comment on appelle cette partie précise qu’évoquent vos devs au quotidien, alors cet article est pour vous !

Voici les briques à connaître, de la plus simple à la plus avancée :

## Le “model”

Le modèle, c’est le LLM (Large Language Model) que vous utilisez. Quand les gens disent : « tu utilises quelle IA ? ». La vraie question derrière c’est quel modèle utilises-tu ? Par exemple : les modèles GPT d’OpenAI, les modèles Claude d’Anthropic, Kimi, etc…

Le modèle, en pratique, c’est quoi ? En simplifiant, un modèle de langage est un système entraîné à prédire la suite la plus probable d’une séquence de tokens. C’est à partir de ce mécanisme qu’il est capable de générer du texte, du code, de raisonner sur des informations ou encore de suivre des instructions.

Il a été entraîné sur un certain nombre de paramètres qui vont représenter ses capacités, son _“intelligence”_. Si vous souhaitez approfondir, on a _**cet**_ [_**article**_](https://blog.hoppr.tech/blogs/2026-07-24-llm-ce-qui-se-passe-vraiment-du-token-a-la-reponse) qui vous explique plus en détail comment fonctionne un LLM. Mais retenez qu’il ingère des tokens et en recrache également.

Pour imager, on pourrait dire que le modèle, c’est le cerveau, il orchestre les actions.

## Le “prompt”

Un prompt, c’est simplement l’instruction ou la demande que vous envoyez au modèle. Ça peut être une simple question comme « explique-moi ce code », mais aussi une consigne beaucoup plus détaillée avec du contexte, des contraintes ou un format de réponse attendu.

Le prompt fait donc partie du _context_ du modèle : c’est l’une des informations qu’il va utiliser pour comprendre ce que vous attendez de lui et décider de la réponse à produire.

Pour imager, si le modèle est le cerveau, le prompt est simplement ce que vous lui demandez de faire.

## Un “chat”

Le chat, c’est la conversation dans laquelle vous échangez avec le modèle. Vous lui envoyez des prompts, il vous répond, et ces échanges viennent progressivement enrichir son contexte.

Chaque nouveau chat démarre donc avec un nouveau contexte de conversation sans avoir automatiquement accès aux échanges de vos autres chats.

## Les tokens

Un token, c’est l’unité de texte que manipule réellement le modèle.

Contrairement à nous qui avons tendance à raisonner en mots ou en caractères, un LLM découpe le texte en petits morceaux appelés _tokens_. Un token peut représenter un mot entier, une partie de mot, un signe de ponctuation ou parfois simplement quelques caractères.

Une phrase de dix mots ne correspond donc pas forcément à dix tokens. Le découpage dépend notamment du modèle et de la manière dont son [_tokenizer_](https://huggingface.co/learn/llm-course/fr/chapter2/4) découpe le texte. [Voici un exemple](https://platform.openai.com/tokenizer) interactif des tokenizers d’OpenAI.

Pourquoi est-ce important ? Parce qu’absolument tout ce que le modèle reçoit consomme des tokens : vos messages, les réponses précédentes, les instructions du harness, le contenu d’un fichier, les résultats des tools ou encore les informations injectées par un MCP.

Et c’est également vrai dans l’autre sens : tout ce que le modèle génère en sortie est produit sous forme de tokens.

C’est donc avec cette unité que l’on mesure la quantité d’informations qu’un modèle peut avoir dans son contexte à un instant donné. On parlera un peu plus loin de _context window_, qui représente justement le nombre maximal de tokens qu’il peut garder dans son contexte simultanément.

Pour reprendre notre image du cerveau : les tokens sont les petits morceaux d’information que le cerveau peut lire et manipuler.

Vous comprendrez donc assez vite pourquoi une bonne partie des mécanismes dont nous allons parler – skills, MCP, subagents ou compaction – cherchent directement ou indirectement à mieux gérer ces tokens.

## Le “harness”

Le _harness_, c’est l’environnement dans lequel tourne le modèle. Codex App/CLI, Claude Code, Amp, OpenCode, Pi en sont des exemples.

C’est bien beau mais à quoi ça sert en pratique ? D’abord, il fournit au LLM des pré-instructions qui vont définir _les agents_. Ensuite, il met à disposition du modèle un éventail de _tools_ qu’il pourra utiliser. C’est majoritairement ce point qui lui donne sa force, la qualité des outils mit à disposition.

Un même modèle peut donner des résultats drastiquement différents selon le harness dans lequel il tourne.

Pour imager, on pourrait dire que le harness, c’est le corps; il peut faire différentes choses notamment grâce au point suivant.

## Les “tools”

Les _tools_, littéralement “outils”, sont mis à disposition par le harness pour étendre les capacités du modèle.

Un harness sans tools ne peut rien faire de plus que naïvement générer du texte. Faire une recherche sur internet, utiliser des commandes de votre shell, lire un fichier, en éditer un, manipuler un pdf, etc… Ils en fournissent donc de base, certains vont plus loin : Codex App inclut un navigateur. Vous pouvez donc ouvrir votre application web – si vous faites du web – directement dans ce browser et autoriser votre agent à l’utiliser pour faire des vérifications ou vous même, y mettre des annotations que l’agent pourra interpréter. D’autres comme Pi vont encore plus loin en vous laissant implémenter vous-même vos propres _tools_.

Pour imager, le modèle est le cerveau, le harness le corps, les tools sont des capacités données au corps.

## Les agents

Un agent, au fond, c’est simplement un modèle auquel on ajoute trois éléments : des instructions spécifiques, des permissions précises et un ensemble de tools.

L’image la plus simple est celle de l’acteur. Le modèle, c’est l’acteur lui-même: ses capacités de base restent les mêmes. L’agent, c’est le rôle qu’on lui attribue. On lui donne un script – ses instructions –, on définit ce qu’il a le droit de faire sur le plateau – ses permissions – et, on met certains accessoires à sa disposition – ses outils.

Même acteur donc, mais des comportements très différents selon le rôle qu’on lui confie.

C’est exactement ce qui se passe lorsque vous utilisez les modes “Plan” ou “Build” de votre _harness_ : derrière, vous retrouvez le même modèle de base, configuré avec des instructions, des permissions ainsi que des outils différents selon la tâche qu’on attend de lui (_et aussi certaines intégrations qui sont propres à votre harness, tel qu’un affichage dédié pour le plan mode par exemple)_

## Le “context”

Le _context_, c’est l’ensemble des informations auxquelles le modèle a accès au moment où il réfléchit et génère une réponse.

Cela comprend notamment votre conversation, les instructions du harness, les éventuelles instructions propres à l’agent, mais aussi les fichiers, résultats de tools ou autres informations qui lui ont été fournies.

Le modèle ne “se souvient” pas magiquement de tout. Il travaille à partir de ce qui est présent dans son context à un instant donné. Si une information n’y est pas, il ne peut tout simplement pas s’appuyer dessus.

La qualité du context est donc particulièrement importante : plus les informations qu’on lui fournit sont pertinentes, plus le modèle a de chances de prendre de bonnes décisions. À l’inverse, un contexte bruité, incomplet ou rempli d’informations inutiles peut dégrader ses performances.

Pour imager, si le modèle est le cerveau, le contexte représente tout ce qu’il a actuellement en tête : ce qu’on vient de lui dire, ce qu’il a lu, ce qu’il a observé et les informations qu’il peut utiliser pour décider de la suite.

## La “Context Window”

La context window, elle, représente la quantité maximale d’informations que le modèle peut avoir dans son contexte à un instant donné.

Elle est généralement mesurée en tokens. Plus cette fenêtre est grande, plus le modèle peut théoriquement travailler avec une longue conversation, de nombreux fichiers ou une grande quantité d’informations simultanément. Sa taille varie d’un modèle à l’autre et surtout d’un provider a l’autre.

Mais une grande context window ne veut pas forcément dire un meilleur context. On peut la remplir avec beaucoup d’informations inutiles et obtenir de moins bons résultats qu’avec un contexte plus petit mais, soigneusement sélectionné. C’est d’ailleurs ce que tendent à démontrer beaucoup de providers où, on voit la pertinence et la qualité se dégrader à mesure que la fenêtre s’agrandit. Notamment sur les context window ayant une capacité d’un million de tokens.

Quand la quantité d’information dépasse la taille de la context window, le harness doit donc faire des choix :

- retirer certains éléments

- retirer les anciens échanges

- ne conserver que les informations qu’il juge pertinentes

C’est ce qu’on appelle la _Compaction_ que nous aborderons à la fin.

Pour reprendre l’image du cerveau : la context window, elle, représente la quantité maximale de ces morceaux qu’il peut garder en tête en même temps.

## Les “skills”

Un skill, littéralement “compétence”, ça répond à quelle problématique ?

À chaque nouveau chat, votre conversation reprend de zéro. Vous êtes sur un contexte tout neuf et votre modèle a tout oublié.

À quoi sert un skill ? Il permet d’encapsuler un savoir ou une action spécifique à réaliser dans un fichier markdown. Le harness a connaissance de vos skills et de leurs descriptions, il les garde en mémoire. L’avantage c’est qu’il ne charge le skill que lorsque le modèle en a réellement le besoin, ou que vous le mentionnez explicitement.

Plus concrètement, c’est très pratique pour expliquer au modèle notre façon de coder, s’assurer qu’il respecte les pratiques et préférences de l’équipe. D’ailleurs on entend également beaucoup parler de **workflow IA**, les plus connus étant probablement speck-kit, BMAD ou encore superpowers. En pratique, ces workflows ne sont qu’une succession bien définie de skills.

Cela permet donc une économie de temps – celle de ne pas avoir à systématiquement tout re-expliquer. En plus, de permettre également de ne pas polluer le context avec des informations non essentielles à la réalisation de votre tâche. Car si vous faites du backend, votre modèle n’a pas besoin de savoir faire du frontend.

## Les MCP

MCP, c’est peut-être un mot que vous avez vu énormément passer, alors qu’est-ce que c’est ?

Le MCP (Model Context Protocol) est un protocole qui permet à un agent de se connecter à un service externe et de l’utiliser.

Ça permet à votre agent de piloter différents services. Chaque service parle sa propre langue, le MCP permet à votre modèle de communiquer avec tous ces services sans apprendre toutes leurs langues, ils parlent le même dialecte: le MCP.

Par exemple un service ferroviaire tel que la SNCF ou une compagnie aérienne pourraient proposer un MCP pour vous permettre de consulter les horaires d’embarquement ou réserver un trajet.

Autrement dit, les MCP permettent d’ajouter des tools – [mais pas que](https://modelcontextprotocol.io/specification/2026-07-28/server) – à votre agent sans que ceux-ci aient besoin d’être directement intégrés au harness.

Contrairement à un skill qui peut charger son contenu à la demande. Un MCP injecte en général la description de tous ses outils afin que le modèle en ait connaissance. La description de chacun de ces outils reste chargée dans votre contexte toute la session, que vous les utilisiez ou non. 

Donc veillez à en avoir un usage raisonnable.

## Parce qu’un schéma vaut mille mots

Voici la représentation visuelle des éléments définis jusqu’à maintenant :

![L’image présente le fonctionnement d’un agent IA. Le Harness est l’environnement qui encadre le modèle et définit les agents, les outils et les autorisations. L’Agent peut planifier ou exécuter une tâche en utilisant le LLM, qui représente le cerveau du système. Le LLM travaille avec un contexte, limité par une fenêtre de contexte, et peut recevoir des Skills, c’est-à-dire des compétences ou instructions supplémentaires. Enfin, l’agent peut utiliser des outils et commandes pour agir, et certains peuvent communiquer avec des services externes grâce au protocole MCP.](./assets/img1.webp)

## Les subagents

Un subagent, c’est quoi ? L’idée est très simple, vous avez votre chat avec votre agent principal qui va “spawner” des sous-agents dans le but d’effectuer des tâches à sa place. Prenons de suite un exemple :

Admettons que vous souhaitiez effectuer des recherches sur une problématique avant la réalisation de votre tâche. Votre agent principal devrait faire des tools call afin d’appeler peut-être un MCP, utiliser un skill ou exécuter les tools mis à disposition par le harness. Tout cela a un coût, ça ajoute du bruit à votre context. Or, ce qui vous intéresse vous c’est uniquement la réponse, pas tout le processus de recherche. De fait, pour éviter cette pollution dans votre discussion, votre chat principal va démarrer et orchestrer des sous agents, ici il pourrait faire un subagent qui fait la recherche ou plusieurs subagents qui font plusieurs recherches. Ensuite ils remontent les informations recherchées à l’agent parent pour qu’il n’ait qu’à consommer ce résultat.

C’est un exemple pour de la recherche mais les subagents ont leurs intérêts pour tout un tas d’autres usages tels que : de la review, des audits de sécurités, des audits de performances, traiter des tâches en parallèle, etc…

![L’image montre une organisation composée d’un agent orchestrateur et de plusieurs sous-agents. L’agent orchestrateur, placé en haut, répartit le travail entre différents sous-agents en leur déléguant des tâches. Chaque sous-agent réalise une partie du travail puis renvoie son résultat à l’orchestrateur, qui les agrège pour produire une réponse globale. Le schéma montre aussi qu’un sous-agent peut lui-même déléguer une tâche à un autre sous-agent puis récupérer son résultat.](./assets/img2.webp)

## La compaction

Vous parlez à votre agent, et la discussion remplit la context window. Mais on fait quoi une fois qu’elle est pleine ?

C’est là qu’intervient la _compaction_. C’est un mécanisme qui résume le context actuel pour le rendre plus léger. Quand on approche de la taille maximale de la context window, le harness prend l’ensemble de la conversation et en produit un résumé qui sera réinjecté afin que l’agent puisse continuer de travailler.

Il faut noter que : qui dit résumé, dit également perte d’informations. En compactant, une partie des informations (importantes ou pas) peut passer à la trappe. Donc si vous lui aviez spécifié de ne pas faire X et Y, il se peut que l’un ou l’autre voire même les deux soient oubliés.

Et c’est en cela que la compaction est le point central autour du quel s’articulent toutes les autres définitions de cet article. Car tous les mécanismes évoqués – comme les skills, les MCP, les subagents – ne sont là que pour répondre à cette problématique : ne pas remplir la context window trop rapidement.

## Pour continuer

Cet autre article pourrait également vous plaire :

- [https://blog.hoppr.tech/blogs/2026-06-09-du-prototype-a-la-prod-ce-quon-ne-te-dit-pas-sur-la-construction-dune-solution-ia-solide](https://blog.hoppr.tech/blogs/2026-06-09-du-prototype-a-la-prod-ce-quon-ne-te-dit-pas-sur-la-construction-dune-solution-ia-solide)