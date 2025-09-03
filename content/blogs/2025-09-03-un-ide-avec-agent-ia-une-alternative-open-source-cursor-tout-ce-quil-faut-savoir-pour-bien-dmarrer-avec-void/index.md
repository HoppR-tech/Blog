---
title: "Un IDE avec agent IA, une alternative Open Source à Cursor : tout ce qu’il faut savoir pour bien démarrer avec Void !"
date: 2025-09-03T07:35:06.710Z
description: "Cursor séduit par son interface familière, sa compatibilité avec les extensions existantes, et son intégration poussée avec des modèles comme _GPT-4_ et _Claude_. Mais derrière cette puissance se cach"
image: ./assets/cover-image.webp
alt: "Logo de l’IDE Void"
ogImage: ./assets/cover-image.webp
tags: ['others', 'documentation', 'void', 'ide', 'ia']
published: true
authors:
  - id: 70a8663a-742d-4937-a6d4-5cef079b12c8
    name: Théo Lanord
    image: ./assets/author-tho-lanord.webp
    linkedin: https://www.linkedin.com/in/th%C3%A9o-lanord/
    x: 
reviewers:
  - id: e8163b24-7e01-41c5-adbf-0dc655f929d0
    name: Nicolas Zago 
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/f8f82a79-9d41-4302-b1a5-37882985167f/nicoz_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466ZDLKRYVF%2F20250903%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250903T073506Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJGMEQCIG%2BvaXFMQt%2B6Qj8eNPF9N%2BSUaZ0cNFSYx2baFXn%2FbKW6AiB%2B3P5tZFm9jlWPtGCaF4DLnQM3zhKIq%2B9K1uaRu86vnir%2FAwg%2FEAAaDDYzNzQyMzE4MzgwNSIMw5bxg3sltrFNkUxOKtwDSPFYwesUC22hxfy2kHqgnD3lNSSuItCcUQ4D2B97GRE65RzXTWyuJEjU9lXyw0faxArG2NbcoPniX4bE8fwbuMcKV4tugd2BfRB8YnKKm%2FdUSbAmAlXx9Js5nifbWH0mz5L0OK7EhmXYZw%2FO48DOtzIKGei4YFCghhW4%2FYYa9FzQKdjbeM8oEOFaR9h9uK1hEOe7zAvN%2FvzaTyA0gjNR3FwW%2BtmvaYQDQlWqXvdHMXHs8FfJjEYO4SY6BjnDkF9lWlGpnv6BKvaEIyJQai1mARLgQ%2B5gjM5LEnq%2BkSAddwGYXtXp%2FI237%2BmWMbUboqNZeYyFf3UJSJkrW%2Fyqo%2FC6fhqb1k9sS1ytKASXiWgBNPoUN6eZHXi5l0qFJAyXRwpYTJiuidc%2BgVtrOmkSMVm6Eg77ieUq8H6T6Qt6UsVPLWMTRfieE9a4ax0keUk9PFR%2BonQ0Nb%2BfSNlsLrBv6cIo68a42GyZ3jpn4JbMBN4%2Ff%2BnRHg%2FiU%2BWy7NzoTy1QvlZ22%2BfUo0nApRTcnCg%2F647J5OqkDlkoZn6NsrJ0lXgIBxNgRfaQOG4L6q5WSzU%2BbGO2ci89EJqkS32Msug9IjzrK%2F5obEXxrs1NbR5y3KQFLNsUlIVr%2F5%2F%2BvY%2BfjB0w6bjfxQY6pgH4Qs%2Bft%2Fnfe0Fphwrc%2B6PKxo0pBzJsnGHLgN2ghniYkK8tKxZ6GAVtKXnpvqtr5UKhOS%2Ft%2FeS93kZrRV9V5kAZ3xCEq9G9ewA%2FbzgtFtQ6xVAsn6n57V2U8e7e5sXbHtyd780KexydA2%2F%2FelidNyBI5bCZSV8JdqkinYKVwRyw9q2rwEsKmYVBj6E1Rc%2FNLuxtncPdjAWOM2ydYlly118Bry3aufLW&X-Amz-Signature=4e04cd8aee99b1e1f1045840307945dc87a3a9be1036625ac33254fc598ef394&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
    linkedin: https://www.linkedin.com/in/nicolaszago/
    x: 
  - id: 0bb914a6-f882-4951-bee6-53e8e8abb807
    name: Emmanuelle Gouvart
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c88f5dfa-16db-4e6f-acf1-34dd80ee8766/emma_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663B3BM6TB%2F20250903%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250903T073506Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIG9fB1ykwU%2FbGIaGsJvhCPPFqNNxLym7wZJL2IBrrfByAiEA2dAwm9ubQtgkLGO%2FFfFNhn3sWE%2FTFr8sHTc0Xkpklfoq%2FwMIPxAAGgw2Mzc0MjMxODM4MDUiDCRssieECgWoB2hW9CrcA7GhvJZ2CKT8EoZg3VZPvy670nbucj7%2F6cMOgZD1XxfmYMplYVipz5WRjLwwevWAwXoE1mKhz6zd0oQyeIDP9CuHGXUsrvr6Q2sCuhXhT3RTnE13AO5rhH1dpXfz3kEI87JZy07LvKVUvO%2B6B2xhJq1sy%2B9XvEzffS7L5mUFFIpWs0%2FtJkj01hFq4qgDsPwJ3cdlR7CQpo5bIYAn%2BMwPWsSOoDciHA5ZwqixPZV0u9YvA1NeBGBHP3KHzDoiNWxuBuCpcxeCYFGrWe5O7VSEBOSbSl4vXuxlC6wyJhf%2FmlPnqigdg%2FvfrgZRTy0xE3dV99Z8H9EubyucSlmkVctU58qO4UolWQzTL4I0X5lE%2Bkkfl32%2F2pek7dZyI9N7sCkyxxBfEpXteOoZuGvDrEg3XaDOv%2FZmkcbpfuOwqUSelFSg8Gn8OTalUUWn17GtN1LjCaXoPgsbnrdDZR8B1XUkGbGWDm%2F0zxZEsUWPMocXnICc15HXYSmCj6p49STA4VhMnTDeuGLDYCp7id%2B0JUld6IhNwwVy%2FotUYzJ2OEt0DvmYwFfO3G4HVGV8qHMezrZl%2BDlPjTEiqyhGJNY0o8VJNgPQIEm0ty1O0L5UFBPtS1KXbCaYTUk8j258SoVQMPS438UGOqUBvKpEkUYaVgCRzjUR%2FZldhU5j3j7K%2FQaMUl6dyQEBTObMLMRndG69O6%2BmXG64%2Fr70Bfna5zX7dlSYIi%2FuoiJgFC2U7E%2BhMXIx%2Fj1G7uCZcCFxj%2FSQHZcSuTb06IrCq%2BR%2Bnk%2FNbUPVdqR27Iy5jWH1kwsToggvfdZZpu4uEANo2eIywrfnbeS9DFtIRvQ0QU1wX16503etcJfbx%2FkK5XctZJf6NccA&X-Amz-Signature=f38eb48ec7cf12e65f4309d7f2f18155ec4d49c9d0bf1c92e7b5e766e531cb1e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
    linkedin: https://www.linkedin.com/in/emmanuellegouvart-182b6ab2/
    x: 
  - id: 838dec96-f9fc-404f-a302-07719225d785
    name: Maxime Deroullers
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c69d0b59-558d-4e48-879f-bea3fec1fdef/Linkedin_Profile.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4667JYBD3L7%2F20250903%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250903T073505Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDNcPq3tjGuMjsX2jiE05qzyBCZlZJd7vSyfz8pUACQIwIhALHMUKQBWe8Q50wZnCaM2SaWqzMy%2BNu6ui6T6FcbYUBXKv8DCD8QABoMNjM3NDIzMTgzODA1Igylzx0C5ER%2BTcsz62wq3ANW0VQXJ9phcHpCMqjXYADIQj83r%2BaNpCT7Avsl5pIFfcsm5sv2sIydUsNgPFEEjCO8sy4LVpeLZeZAIg6d8KZRDoSzoqXKjPIAmUTu5R6EKTr0lY0pNz9460KriIQEujLc75DMkbNskJsaCF%2F6w3x9siUXkK%2BMGKI6ctlRgN%2FGAmwE%2F326tODQ4dI%2Fnaiux%2BUqOvUbEqvoEUAQA65KDci%2FHPBYrrMl4Ux%2B8qGyPYwhpEPF5YVagJKyfVtbA0i47Res9FAF0IroZeKLwW%2FT%2Fj9nUOuA%2BdwkcXd9tgqIp97wVz7F%2FIZIssQqnGD%2BHRWCo8TLO0fPyHM3a9S1GxD2FaabMkyDQL2dx%2BKdd7tV5%2BqzmHf3GvnZG8mF89kIgAuXvyIkL6pnGPZ2c6yN4cLEpSEmjKJs7Eb2%2Bl9u2VCj06nkkwzioo88MiaMQY7uNLGZpZbzHBSezjp4A5XwZIenzSnmD7kFwmcN5jJ9WwyZkk8aiaL%2BLw0ZFI2Mn4V4kZjNHtshKyW%2B6SDW4dJ3m6e8Smzb0yfKsry2%2BIS2dQALSMF7IlcV2HBWQ3U6sTWshkQrk00%2FAkKoUQ9PHdKZw57AgSBIZKiAz5AWM23NJxP5TWLnhS%2FR4LIodJck3z4qUDCNud%2FFBjqkAb%2FKIeBwUN7B%2BizO9jiaQpFlaSZ5MsnstclqDJSmIUeBl8Blmoo47GyO%2FtAO1CdGW%2FigELwrrFw61xd6fJY3Nz4dSXi5YOnx%2BFhkOae0ulyDAgfBkSb%2BYocPzjqDI%2FFluWCHiB74bRqoTWIbj6n82U8uwSdMAV8JJ5vLDR%2B%2FcdZSj8pTeFbpMIcPn0Gyib7rryVu9ZVJeK%2B3HJnfWPSWggXfhLtU&X-Amz-Signature=8f393726be490557a096afcb84d2658e4eecb9f480bcbd1334ee2d4c7aa71a78&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
    linkedin: https://www.linkedin.com/in/maxime-deroullers-1b5791137/
    x: https://x.com/mderoullers
---

<!-- markdownlint-disable-file -->


Cursor séduit par son interface familière, sa compatibilité avec les extensions existantes, et son intégration poussée avec des modèles comme _GPT-4_ et _Claude_. Mais derrière cette puissance se cache une infrastructure propriétaire, où la confidentialité et le contrôle des données peuvent soulever des questions.

Depuis 5 mois, j’utilise, une alternative Open Source, Void. Il m’accompagne dans mes développements notamment dans la reprise de base de code (Suppression de code mort, Abstraction de conditions complexes, Extraction de méthode, etc) et l’ajout de fonctionnalités en Java, Python, Go. A travers ce guide, je souhaite vous partager mon retour d’expérience et vous faire découvrir Void, de ses fonctionnalités essentielles à quelques cas d’usage.

## Pourquoi l’open-source ? 

Quand on parle de développement et d’IA, la principale problématique est la confidentialité d’envoi de code propriétaire à des services tiers. Par exemple, avec Cursor, vous devez envoyer vos données privées via le backend de Cursor à chaque utilisation. Cela entraîne des problèmes évidents de confidentialité. C'est également coûteux pour les développeur·euse·s, et cela signifie qu'une seule personne a le contrôle total d'un puissant modèle d'IA.

Vous l’aurez compris Void, répond à cette problématique. Il propose de nombreuses fonctionnalités dont nous avons maintenant l’habitude : 

- **Auto-complétion :** Appliquer les suggestions proposées par l’IA en appuyant sur Tab.

- **Éditeur de lignes :** Sélectionner des lignes dont nous voulons modifier le contenu en ouvrant une fenêtre dialogue (Ctrl-K) et demandez les modifications.

- **Éditeur de fichiers :** Nous pouvons aussi inclure des fichiers, voir toute notre base de code, via la fenêtre de dialogue globale (Ctrl-L).

- **“Any LLM, Anywhere”:** Connexion à nos modèles préférés en local ou via le Cloud.

## Qu’est ce que c’est Void ? 

Si vous êtes un habitué de VS Code, vous serez à votre aise avec [Void](https://voideditor.com/). Void est basé sur [VSCodium](https://vscodium.com/), un fork de VS Code. Il met l’accent sur la confidentialité, la personnalisation et l’implication de communauté sans sacrifier les fonctionnalités IA sur les quelles les développeur·euse·s peuvent d’appuyer : 

- **Fondamentaux de VS Codium/Code :** Transférer tous nos thèmes, raccourcis clavier et paramètres en un clic.

- **Fonctionnalités communautaires :** Plugins VS Codium/Code ou même des fonctionnalités d'IA créées par la communauté.

- **Axé sur la confidentialité :** Héberger les modèles localement ou se connecter directement aux fournisseurs sans intermédiaire.

- **Open-source :** Consulter, modifier, contribuer au code source.

## Comment installer Void ?

Void est en version bêta ouverte, les installateurs (Windows, Mac & Linux) sont directement disponibles sur leur site : [https://voideditor.com/](https://voideditor.com/). Si il y a le moindre soucis, la communauté officielle de Void sur [Discord](https://discord.com/invite/RSNjgaugJs) est très active.

### Connexions à un LLM

L'un des principaux avantages de Void repose sur sa flexibilité de connexion à différents LLM. Lors de l’installation, Void propose une connexion a [Gemini via API Key](https://aistudio.google.com/apikey).

A défaut d’être Open Source, cette connexion a un provider externe permet d’avoir accès un LLM puissant à moindre coût en contrôlant nos tokens, voir même gratuit, dans le cas des modèles _gemini-2.0-flash_ et _gemini-2.0-flash-lite._

![Capture d’écran de l’ajout de l’API Key Gemini dans Void](./assets/img1.webp)

Nous verrons qu’il est aussi possible d’héberger nos propres modèles localement. Si vous partez sur le solution [Ollama](https://ollama.com/), Void est déjà pré-configuré en ce sens.

![Configuration par défaut pour l’utilisation d’Ollama dans Void](./assets/img2.webp)

Dans les deux cas, en cliquant sur les liens dans la configuration, Void nous accompagne pour mettre en place notre token Gemini ou installer Ollama.

Si vous avez configuré votre token Gemini, dans les paramètres des modèles Void (Engrenage en haut à droit), vous devriez trouvez les modèles Gemini actifs.

![Modèles Gemini actifs après configuration du token](./assets/img3.webp)

Wouah ! Le nombre de connecteurs disponibles ! 

A vous de jouer avec vos clés des différents providers de LLM ! Ici, nous nous allons passer plus de temps sur comment faire tourner un modèle en local car c’est l’une des façon les plus rapides pour avoir de l’auto-complétion et non seulement une fenêtre de dialogue. 

En effet, comme vous pouvez le voir dans l’onglet “_Feature Options_” des paramètres, les modèles Gemini ne sont pas compatibles avec l’auto-complétion (FIM models).

![L’auto-complétion non compatible avec les modèles de Gemini](./assets/img4.webp)

### Utilisation d’un LLM local

Pour utiliser un LLM en local, nous pouvons utiliser Ollama. Vous trouverez les différents installateurs (Windows, Mac & Linux) sur leur site : [https://ollama.com/download](https://ollama.com/download)

Il est nécessaire de faire un choix dans le LLM à utiliser, et parmis les LLMs dédiés à l’écriture de code voici les références dans leur domaine car développés par des grandes entreprises ou des laboratoires : 

| Nom du modèle | FIM Support | Fonctionnalités liés au code | Poids |
| --- | --- | --- | --- |
| CodeLlama  34B | ✅ | Advanced code generation, refactoring, multi-file context | ~19GB |
| Deepseek-Coder  33B | ✅ | Complex logic generation, Java debugging, test creation | ~17GB |
| Qwen2.5-Coder  32B | ✅ | Multi-language support, strong architectural reasoning | ~16GB |
| CodeLlama  13B | ✅ | Lightweight, good for method-level FIM and snippets | ~7GB |


Un challenger intéressant, Open-Source et particulièrement transparent dans ces résultats d’évaluation est [CodeStral](https://ollama.com/library/codestral) (~13GB). En auto-complétion, voici les scores disponibles :

![Score de différents LLMs en chat](./assets/img5.webp)

![Score de différents LLMs en auto-complétion](./assets/img6.webp)

**Mais** tous ces LLMs demandent des ressources sur votre machine, notamment de la RAM. Aujourd’hui, au vu du coût en énergie et en achat de la machine, pour ces grands LLMs de référence, il reste plus intéressant de passer par des providers et de payer les tokens utilisés. 

Il est toujours possible d’héberger des modèles plus petits sur nos machines. L’un des plus petit est [qwen2.5-coder:0.5b](https://ollama.com/library/qwen2.5-coder), un modèle de 398MB. Pour un compromis entre pertinence et ressources, j’utilise [qwen2.5-coder:3b](https://ollama.com/library/qwen2.5-coder) (~1,9GB).

![Évaluation des différents modèles Qwen2.5-coder ](./assets/img7.webp)

Dans tous les cas, pour lancer votre modèle, il nous suffit de 2 commandes : `ollama pull nom_du_modèle` et `ollama run nom_du_modèle` . Cette opération est unique, il n’est pas nécessaire de le faire à chaque redémarrage de notre machine.

![Détection du modèle local par Void](./assets/img8.webp)

Voilà ! Aucune action supplémentaire n'est requise. Void détecte automatiquement les modèles exécutés localement. Il ne nous reste plus qu’à les activer.

> 💡 Si vous souhaitez modifier le point de terminaison de vos modèles hébergés localement, vous pouvez le faire.

Avant de nous lancer dans l’utilisation des fonctionnalités de Void, n’oubliez pas d’activer l’option d’auto-complétion dans les paramètres “_Features Options_”.

## Utilisation des fonctionnalités de Void

J’ai demandé à notre LLM de créer un projet Java avec un simple Controller retournant “Hello, World!”. Les exemples seront basés dessus :

![Fichier crée par le LLM pour nos futurs exemples](./assets/img9.webp)

### Auto-complétion de code

L’auto-complétion de Void comprend le fichier actuel et le code source. À mesure que nous saisissons du code, nous pouvons accepter les suggestions du LLM en appuyant sur Tab.

![Auto-complétion proposé par le LLM](./assets/img10.webp)

> 💡 L’auto-complétion peut aussi proposer plusieurs lignes à intégrer au code.

### Éditeur de lignes (Ctrl-K)

Nous avons maintenant besoin de refactoriser notre code. Sélectionnons les lignes à modifier, appuyons sur Ctrl+K. Une fenêtre de chat apparaît ! 

![Fenêtre de chat pour la modification de lignes ](./assets/img11.webp)

Les modifications nous sons proposées et nous pouvons les accepter ou non (Dans leur intégralité ou ligne par ligne).

![Suggestions d’insertion de variable par le LLM](./assets/img12.webp)

Nous pouvons aussi lui poser des questions plus complexes (Fonctions, documentation, refactorisation). La limite est notre budget de tokens ou notre machine !

### Éditeur de fichiers (Ctrl-L)

Nous pouvons aussi avoir des questions plus large sur notre code qui inclut soit des fichiers spécifiques, soit l’entièreté de notre base de code. Pour cela, nous pouvons utiliser le chat global de Void.

Choisissons notre LLM et posons notre question pour améliorer notre code : _“Can you suggest me improvements for my code ?”_ 

![Suggestions d’améliorations par le LLM pour toute la base de code](./assets/img13.webp)

Il identifie clairement notre mauvaise gestion des erreurs, de logs et suggère des modifications !

![Suggestions en détails des améliorations](./assets/img14.webp)

Comme précédemment, nous pouvons accepter les modifications dans leur intégralité ou ligne par ligne.

## Mon utilisation en tant que développeur

J’utilise Void depuis maintenant cinq mois principalement dans le cadre de refactoring de mon code. Mes tests restent mes garde-fous et sont conçus et maintenus pour garantir la robustesse de mes développements. 

Pour les tâches plus lourdes comme l’édition de lignes ou de fichiers via interface Chat, je m’appuie sur les modèles Gemini, qui me permettent d’accéder à une puissance de calcul que ma machine ne pourrait pas supporter seule. 

Pour l’auto-complétion, je privilégie les modèles [**Qwen2.5-Coder**](https://ollama.com/library/qwen2.5-coder), qui offrent un compromis entre légèreté et fonctionnalités. Si je disposais de plus de RAM, je basculerais probablement vers [CodeStral](https://ollama.com/library/codestral) qui semble être une alternative prometteuse.

## Pour les curieux !

L’architecture de Void est modulaire et intègre de manière expérimentale de nombreuses fonctionnalités : 

- Indexation de fichiers : capacités de recherche et de navigation améliorées

- Génération de Docstring : assistance automatisée à la documentation

- Intégrations de composants externes : [Greptile](https://www.greptile.com/) (Revue de code), [Ollama](https://ollama.com/) (Hébergement local) et [DocSearch](https://docsearch.algolia.com/) (Recherche de documentation)

N’hésitez pas à faire un tour sur le [Discord officiel](https://discord.com/invite/RSNjgaugJs) et sur le répertoire [Github](https://github.com/voideditor/void) ! 

## Conclusion 

> 1️⃣ Void répond à la problématique de confidentialité en nous permettant d’héberger nos modèles sur nos machines et, en garantissant que notre code ne quitte jamais notre environnement ! 

> 2️⃣ Void reste ouvert et nous propose des connecteurs aux providers de LLMs et donc une accès à des LLMs puissant !

> 3️⃣ Void est transparent dans les modifications que font les LLMs à notre code. A nous de valider ou non les suggestions ! 

Mais… les avantages vont au-delà de la simple confidentialité et des économies de coûts. En tant que projet open source, Void invite la communauté à contribuer pour repousser les limites du développement assisté par l’IA. 

La transparence du projet offre également de précieuses opportunités d’apprentissage aux développeur·euse·s intéressés par l’interaction entre les outils de développement traditionnels et l’IA.

Que vous soyez soucieux de la confidentialité, que vous cherchiez à réduire vos coûts ou que vous préférez simplement les outils open source, Void offre une alternative performante qui mérite d’être explorée. N’hésitez pas à prendre le meilleur des deux mondes ! 

_Merci de votre lecture !_ 

