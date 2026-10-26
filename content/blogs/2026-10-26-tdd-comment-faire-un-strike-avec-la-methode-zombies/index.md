---
title: "TDD: comment faire un strike avec la méthode ZOMBIES"
date: 2026-10-26T09:23:15.193Z
description: "Les zombies, ça vous parle ? Ceux que nous allons évoquer ici n’ont aucun lien avec ceux de Walking Dead ou du superbe titre du groupe The Cranberries. Non, les zombies dont nous allons parler aujourd"
image: ./assets/cover-image.webp
alt: "Illustration abstraite d’un développeur lançant une boule de bowling sur une piste traversée de symboles et schémas de code, tandis que des silhouettes de zombies numériques émergent en arrière-plan et que des quilles lumineuses l’attendent au bout de la piste."
ogImage: ./assets/cover-image.webp
tags: ['tdd', 'rust', 'craft']
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
  - id: 3f3f4462-cd38-80e4-9d5b-e3b8f7378c03
    name: Maxime Gonzalez
    image: ./assets/reviewer-maxime-gonzalez.webp
    linkedin: www.linkedin.com/in/maxime-gonzalez-4a70b111a
    x: 
    jobTitle: "Senior Software Engineer"
  - id: 33bf4462-cd38-80da-845c-c63b2fd024bf
    name: Florian Hirson
    image: ./assets/reviewer-florian-hirson.webp
    linkedin: https://www.linkedin.com/in/florian-hirson/
    x: 
  - id: 3d0f4462-cd38-80c3-9ded-e6303c15ff2f
    name: Nuno
    image: /default-author-image.webp
    linkedin: 
    x: 
---

<!-- markdownlint-disable-file -->


Les zombies, ça vous parle ? Ceux que nous allons évoquer ici n’ont aucun lien avec ceux de Walking Dead ou du superbe titre du groupe The Cranberries. Non, les zombies dont nous allons parler aujourd’hui se trouvent dans votre code.

**Long story short :**

Lorsque par le passé j’ai commencé le [TDD](https://blog.hoppr.tech/blogs/2026-06-30-tdd-jen-entends-beaucoup-parler-mais-cest-quoi-au-juste), j’avais beau avoir lu énormément de livres sur le sujet, il m’était par moments toujours difficile de savoir par où commencer. 

Plus tard, un de mes amis m’a souvent demandé « Ok c’est cool le TDD mais j’ai toujours du mal à savoir par où commencer », « Quel est le premier test à faire ? », « Est-ce que ma baby step est bonne ? ». Ce sont autant de questions que j’ai pu me poser au cours des différentes problématiques rencontrées. Évidemment avec le temps et la pratique, ces questions tendent à s’estomper. Mais **le** truc qui m’a bien aidé au début c’est une méthodologie qui m’a permis de poser la bonne approche pour le TDD : les **zombies**.

## Z.O.M.B.I.E.S, c'est quoi ?

De son nom de code **Z.O.M.B.I.E.S**. Il s’agit surtout d’une heuristique qui permet de guider le prochain test en TDD.

Il ne s’agit pas d’une méthode TDD complète qui elle, ne change pas et conserve le même cycle :

> Red → Green → Refactor

**Zombies** aide à faire progresser les tests des cas les plus simples aux plus riches.

La méthode se compose ainsi :

- **Z — Zero** : commencer par zéro, vide, `None`, aucune donnée.

- **O — One** : tester avec un seul élément ou un cas minimal.

- **M — Many** : tester avec plusieurs éléments.

- **B — Boundary** : tester les valeurs limites.

- **I — Interface** : vérifier l’interface publique et les interactions avec d’autres composants.

- **E — Exceptions** : tester les erreurs et cas exceptionnels.

- **S — Simple Scenarios / Simple Solutions** : privilégier d’abord les scénarios et implémentations les plus simples.

## Le kata : calculer un score de bowling

Pour notre exemple, nous allons être super originaux ! Nous allons refaire le geste de calcul d’un score de bowling.

Alors, c’est un sujet assez commun je vous l’accorde mais je pense qu’il illustre bien l’application de ZOMBIES – bon il faut aussi avouer que je n’avais pas d’inspiration. Pour ce qui est du langage, on va le faire en [rust](https://rust-lang.org/fr/) parce que ~~c’est le meilleur language ever~~ pourquoi pas ? 

![Un gif avec un homme qui pointe du doigt en disant “YOU STAY RIGHT HERE!”](./assets/img1.webp)

Hop hop hop, ne prenez pas peur en lisant rust, c’est simple et vous allez comprendre ne vous en faites pas.

### Les règles du jeu

Avant cela, petite mise au point sur les règles de scoring au bowling avant d’aborder le sujet afin que tout le monde parte sur la même base :

Une partie comporte **10 frames**. Dans les neuf premières, le joueur **lance une ou deux fois** pour faire tomber les **dix quilles**.

- **Frame ouverte** : les quilles tombées aux deux lancers s’additionnent

- **Spare** (les dix quilles en deux lancers) : 10 points, plus le lancer suivant

- **Strike** (les dix quilles au premier lancer) : 10 points, plus les deux lancers suivants

À la **10e frame**, un spare donne droit à **un** lancer supplémentaire ; un strike, à **deux**. Ces lancers bonus servent à calculer le score de la frame. Le score maximal d’une partie est **300 points** , un total atteignable uniquement en faisant un strike à chaque lancer, soit **12 strikes**.

À des fins de simplification, nous allons éviter de manipuler directement une liste de lancers puisque ce n’est pas le sujet de l’article.

Nous partirons donc du payload suivant : `Vec<(Roll, Roll, Option<Roll>)>`.

Concrètement, il s’agit d’une liste (`Vec<T>`) contenant jusqu’à 10 frames. Chaque frame est représentée par un tuple `(...)` :

- le premier `Roll` correspond au premier lancer

- le deuxième au second lancer

- le type `Option<Roll>` représente un éventuel troisième lancer, uniquement possible lors de la dernière frame

`Roll` est simplement un alias de `i32`. Retenez donc qu’il s’agit d’un entier relatif.

Ce n’est clairement pas une modélisation idéale – à ne pas reproduire chez vous – mais soit ; imaginons que ce payload nous soit fourni par un service externe un peu douteux.

L’objectif ici est surtout d’avoir une représentation simple des frames et des lancers, afin de nous concentrer sur ce qui nous intéresse vraiment : la progression en TDD.

Maintenant que le vocabulaire et le besoin sont posés, par quoi commence-t-on ?

### Mise en place des tests

En rust, les tests unitaires se situent dans le même fichier que le code testé ; commençons donc par un fichier `calculate_bowling_score.rs`.

```rust
type Roll = i32;

fn calculate_bowling_score() {}

#[cfg(test)] // configure le module pour les tests
mod tests {
	use super::*; // nous permet d'avoir acces dans ce module aux elements au dessus

	// il n'y a pas de trace de `Option<i32>` en troisieme position
	// car on ne parle pas **encore** de la derniere frame et de ses 3 lancers
	fn assert_score(frames: Vec<(Roll, Roll)>, expected: i32) {
    assert_eq!(calculate_bowling_score(frames), expected);
	}
		
	#[test]
	fn first_test() {
		todo!();
	}
}
```

Bien, maintenant que nos tests sont setup, nous pouvons commencer.

## Z - Partir de zéro

La première lettre de zombies nous dit **Z pour Zero** ou aucune donnée. Pour notre exemple littéralement “commencer par zéro”, donc allons-y:

**Scénario : dix frames à zéro donnent** **`0`** 

On commence par le test où l’on simule un joueur qui a fait des gouttières toute sa partie – le pauvre – il est donc censé avoir 0 points, super le test est rouge. On peut le faire passer au vert de la manière la plus simple possible : on **retourne 0**.

```rust
fn calculate_bowling_score() {}
pub fn calculate_bowling_score(raw_scores: Vec<(Roll, Roll)>) -> i32 {
   0
}

// ...

#[test]
fn calculate_for_a_loser() {
	let full_lose: Vec<(i32, i32)> = (0..10)
		.map(|_| (0, 0))
		.collect(); // une liste de 10 de (0, 0)
	assert_score(full_lose, 0);
}
```

## O - Introduire un premier cas

La lettre **O pour One** nous invite maintenant à introduire une première donnée qui change le résultat : une seule quille renversée.

**Scénario : une quille à la première frame, puis des zéros, donnent** **`1`** 

Notre joueur renverse une quille sur son premier lancer, puis fait des gouttières jusqu’à la fin de la partie. Le nouveau test est rouge : la fonction retourne toujours `0`. Pour le faire passer au vert, on ajoute un cas spécifique : **si le premier lancer vaut** **`1`****, on retourne** **`1`** .

```rust
pub fn calculate_bowling_score(raw_scores: Vec<(Roll, Roll)>) -> i32 {
    let (first, _second) = raw_scores.first().unwrap();

    if *first == 1 {
        return 1;
    }

    0
}

// ...

#[test]
fn calculate_for_one_pin() {
    let lose: Vec<(Roll, Roll)> = (0..9)
        .map(|_| (0, 0))
        .collect();

    let scores: Vec<(Roll, Roll)> = [vec![(1, 0)], lose].concat();

    assert_score(scores, 1);
}
```

Les deux tests passent désormais : la partie à zéro et celle à un point. On s’arrête là pour cette baby step.

Pour la suivante on reste sur **O pour One**, avec une autre valeur pour le premier lancer. Cet exemple nous aidera à faire émerger une règle plus générale.

**Scénario : cinq quilles à la première frame, puis des zéros, donnent** **`5`** 

Notre joueur renverse maintenant 5 quilles sur son premier lancer. Le nouveau test est rouge : notre fonction retourne `0` pour cette valeur. On avance d’une baby step en ajoutant un deuxième cas spécifique : **si le premier lancer vaut** **`5`****, on retourne** **`5`**.

```rust
pub fn calculate_bowling_score(raw_scores: Vec<(Roll, Roll)>) -> i32 {
    let (first, _second) = raw_scores.first().unwrap();

    if *first == 1 {
        return 1;
    }

    if *first == 5 {
        return 5;
    }

    0
}

// ...

#[test]
fn calculate_for_five_pins() {
    let lose: Vec<(Roll, Roll)> = (0..9)
        .map(|_| (0, 0))
        .collect();

    let scores: Vec<(Roll, Roll)> = [vec![(5, 0)], lose].concat();

    assert_score(scores, 5);
}
```

Les trois exemples attendent désormais la valeur du premier lancer : `0`, `1` ou `5`. On peut donc supprimer les cas particuliers lors du refactoring :

```rust
pub fn calculate_bowling_score(raw_scores: Vec<(Roll, Roll)>) -> i32 {
    let (first, _second) = raw_scores.first().unwrap();

    *first
}
```

On poursuit encore avec **O**, en faisant maintenant marquer des points au deuxième lancer de la première frame.

**Scénario : six quilles, puis deux quilles à la première frame, donnent** **`8`**

Cette fois, le joueur renverse six quilles au premier lancer et deux au second, puis fait uniquement des gouttières. Le nouveau test est rouge : notre fonction retourne seulement `6`. Pour le faire passer au vert, on ajoute un cas spécifique : **si le deuxième lancer vaut** **`2`****, on retourne** **`8`**.

```rust
pub fn calculate_bowling_score(raw_scores: Vec<(Roll, Roll)>) -> i32 {
    let (first, second) = raw_scores.first().unwrap();

    if *first == 6 && *second == 2 {
        return 8;
    }

    *first
}

// ...

#[test]
fn calculate_for_six_then_two_pins() {
    let lose: Vec<(Roll, Roll)> = (0..9)
        .map(|_| (0, 0))
        .collect();

    let scores: Vec<(Roll, Roll)> = [vec![(6, 2)], lose].concat();

    assert_score(scores, 8);
}
```

Cette baby step fait passer notre nouvel exemple. Les suivants nous permettront de généraliser le calcul aux deux lancers de la frame.

**Scénario : deux quilles, puis quatre quilles à la première frame, donnent** **`6`**

Notre joueur renverse deux quilles au premier lancer et quatre au second, puis fait uniquement des gouttières. On ajoute un nouveau cas spécifique : **si le deuxième lancer vaut** **`4`****, on retourne** **`6`**.

```rust
pub fn calculate_bowling_score(raw_scores: Vec<(Roll, Roll)>) -> i32 {
    let (first, second) = raw_scores.first().unwrap();

    if *first == 6 && *second == 2 {
        return 8;
    }

    if *first == 2 && *second == 4 {
        return 6;
    }

    *first
}

// ...

#[test]
fn calculate_for_two_then_four_pins() {
    let lose: Vec<(Roll, Roll)> = (0..9)
        .map(|_| (0, 0))
        .collect();

    let scores: Vec<(Roll, Roll)> = [vec![(2, 4)], lose].concat();

    assert_score(scores, 6);
}
```

Les exemples passent, mais les cas particuliers s’accumulent. Un prochain exemple nous aidera à faire émerger la règle commune.

**Scénario : trois quilles, puis cinq quilles à la première frame, donnent** **`8`**

Le nouveau test est rouge : notre fonction retourne seulement `3`. On ajoute un cas spécifique : **si les deux lancers valent** **`3`** **et** **`5`****, on retourne** **`8`**.

```rust
pub fn calculate_bowling_score(raw_scores: Vec<(Roll, Roll)>) -> i32 {
    let (first, second) = raw_scores.first().unwrap();

    if *first == 3 && *second == 5 {
        return 8;
    }

    if *first == 6 && *second == 2 {
        return 8;
    }

    if *first == 2 && *second == 4 {
        return 6;
    }

    *first
}

// ...

#[test]
fn calculate_for_three_then_five_pins() {
    let lose: Vec<(Roll, Roll)> = (0..9)
        .map(|_| (0, 0))
        .collect();

    let scores: Vec<(Roll, Roll)> = [vec![(3, 5)], lose].concat();

    assert_score(scores, 8);
}
```

Tous nos exemples attendent la somme des deux lancers de la première frame. On peut donc remplacer les cas particuliers par cette addition lors du refactoring :

```rust
pub fn calculate_bowling_score(raw_scores: Vec<(Roll, Roll)>) -> i32 {
    let (first, second) = raw_scores.first().unwrap();

    *first + *second
}
```

## M - Passer à plusieurs cas

La lettre **M pour Many** nous invite maintenant à considérer plusieurs frames qui marquent des points.

**Scénario : dix frames à deux quilles, puis deux quilles, donnent** **`40`** 

Notre joueur renverse deux quilles à chaque lancer, pendant toute la partie. Le nouveau test est rouge : notre fonction calcule uniquement la première frame et retourne `4`. Pour le faire passer au vert, on ajoute un cas spécifique : **si toutes les frames valent** **`2+2`****, on retourne** **`40`**.

```rust
pub fn calculate_bowling_score(raw_scores: Vec<(Roll, Roll)>) -> i32 {
    let (first, second) = raw_scores.first().unwrap();

    if raw_scores
        .iter()
        .all(|(first, second)| *first == 2 && *second == 2)
    {
        return 40;
    }

    *first + *second
}

// ...

#[test]
fn calculate_for_two_then_two_on_every_frame() {
    let scores: Vec<(Roll, Roll)> = (0..10)
        .map(|_| (2, 2))
        .collect();

    assert_score(scores, 40);
}
```

On poursuit avec **M pour Many**, en changeant les valeurs de lancers sur toute la partie. À partir d’ici, nous allons un peu accélérer car je pense que vous avez compris la logique.

**Scénario : dix frames à trois quilles, puis deux quilles, donnent** **`50`**

On refait la même chose qu’au test précédent mais cette fois, toutes les frames font `3+2` on s’attend à `50` comme résultat.

```rust
pub fn calculate_bowling_score(raw_scores: Vec<(Roll, Roll)>) -> i32 {
    // ...

    if raw_scores
        .iter()
        .all(|(first, second)| *first == 3 && *second == 2)
    {
        return 50;
    }

    *first + *second
}

// ...

#[test]
fn calculate_for_three_then_two_on_every_frame() {
    let scores: Vec<(Roll, Roll)> = (0..10)
        .map(|_| (3, 2))
        .collect();

    assert_score(scores, 50);
}
```

Maintenant, j’ai bien envie de refactorer pour que notre algo additionne tous les `Roll`s, pas vous ?

_By the book, il nous faudrait idéalement faire un 3e test qui nous permette de valider que notre supposition (celle d’additionner tous les lancers) soit la bonne. Toujours dans notre idée d’accélérer un peu, on va se permettre de sauter quelques étapes pour passer de suite au refactor la supposition étant suffisamment forte selon moi._

```rust
pub fn calculate_bowling_score(raw_scores: Vec<(Roll, Roll)>) -> i32 {
    let mut result: i32 = 0;

    for (first, second) in raw_scores.iter() {
        result += *first + *second;
    }

    result
}
```

Voici donc notre refactor, on additionne toutes les frames. _« Beurk, une for loop »_ et en rust qui plus est… je vous entends et vous avez raison, c’est pas le truc le plus sexy qui existe. On pourrait partir sur quelque chose de plus déclaratif dès maintenant ; j’ai toutefois tendance à préférer le procédural au début sans trop savoir encore dans quelle direction nous allons partir. Vous verrez qu’on terminera sur du code qui sera plus sympa à lire.

## B - Explorer les limites

### Le spare

La lettre **B pour Boundary** nous invite à explorer une limite où les règles du calcul changent : lorsque les deux lancers d’une frame totalisent dix quilles, on obtient un **spare**.

**Scénario : un spare à cinq puis cinq, suivi de cinq puis zéro, donne** **`20`** 

Notre joueur renverse cinq quilles à chacun des deux premiers lancers, puis cinq quilles au lancer suivant. Le nouveau test est rouge : notre fonction additionne les quilles et retourne `15`. Avec un **spare**, la première frame vaut dix points, auxquels on ajoute le prochain lancer : `10 + 5`. La deuxième frame vaut `5`, soit **`20`** **au total**.

```rust
pub fn calculate_bowling_score(raw_scores: Vec<(Roll, Roll)>) -> i32 {
    let mut result: i32 = 0;

    for index in 0..raw_scores.len() {
        let (first, second) = raw_scores[index];

        if is_spare(first, second) {
            let next = raw_scores[index + 1];
            result += 10 + next.0;
            continue;
        }

        result += first + second;
    }

    result
}

fn is_spare(first: Roll, second: Roll) -> bool {
    first + second == 10
}

// ...

#[test]
fn calculate_for_a_spare_followed_by_five_pins() {
    // ...

    let scores: Vec<(Roll, Roll)> =
        [vec![(5, 5), (5, 0)], lose].concat();

    assert_score(scores, 20);
}
```

Ici, je fais un pas plus large : j’introduis directement la détection du spare et la lecture du lancer suivant. Avec de la pratique, on peut sauter quelques étapes. Si la modification devient difficile, on peut revenir au dernier état vert et reprendre avec des pas plus petits.

Le spare étant pris en compte, on profite de la phase de refactoring pour faire évoluer notre modèle, ce qui va naturellement nous faire toucher la lettre **I de ZOMBIES : Interface**.

**Refactoring : regrouper le calcul dans** **`BowlingGame`**

On introduit une structure `BowlingGame` et on y déplace le calcul du score ainsi que la détection du spare. À ce stade, ce type ne contient aucune donnée : les frames sont toujours passées à la méthode de calcul.

```rust
// pour ceux qui sont habitues a l'oop, imagez la chose ainsi:
// je cree une class `BowlingGame`, elle n'a pour l'instant aucun attribut
pub struct BowlingGame;

// je lui attache des methodes
impl BowlingGame {
    pub fn calculate_score(&self, scores: Vec<(Roll, Roll)>) -> i32 {
        let mut result: i32 = 0;

        for index in 0..scores.len() {
            let (first, second) = scores[index];

            if self.is_spare(first, second) {
                // ...
            }

            result += first + second;
        }

        result
    }

    fn is_spare(first: Roll, second: Roll) -> bool {
        first + second == 10
    }
}

// ...

fn assert_score(frames: Vec<(Roll, Roll)>, expected: i32) {
    let bowling_game = BowlingGame; // "j'instancie" `BowlingGame`

    assert_eq!(bowling_game.calculate_score(frames), expected);
}
```

On adapte notre fonction utilitaire `assert_score` pour appeler cette nouvelle interface. Les tests existants continuent ainsi à exprimer les mêmes scénarios. Cette baby step modifie l’organisation du code, sans ajouter de nouvelle règle de calcul.

Le spare nous a montré que toutes les frames ne se calculent pas de la même manière. **On continue de profiter de la phase de refactoring**.

On introduit donc `Frame`, une énumération qui distingue ces deux situations et conserve les deux lancers.

```rust
enum Frame {
    Score(Roll, Roll),
    Spare(Roll, Roll),
}
```

Pour transformer une paire de lancers en `Frame`, on utilise `TryFrom`, un trait fourni par Rust. Un trait définit un contrat ; ici, celui d’une conversion. `Ok` contient la valeur construite, tandis que `Err` permet de signaler une erreur. Retenez qu’un `trait` est l’équivalent d’une `interface` boostée aux hormones.

```rust
impl TryFrom<(Roll, Roll)> for Frame {
    type Error = String;

    fn try_from(value: (Roll, Roll)) -> Result<Self, Self::Error> {
        let (first, second) = value;

        if first + second == 10 {
            return Ok(Frame::Spare(first, second));
        }

        Ok(Frame::Score(first, second))
    }
}
```

On regroupe ensuite les frames dans `BowlingGame`, une **structure** (`struct`) représentant la partie. Le bloc `impl BowlingGame` lui associe des opérations, comme `calculate_score`.

```rust
pub struct BowlingGame {
    scores: Vec<Frame>,
}
```

On utilise également `TryFrom` pour construire cette partie depuis notre liste de paires : chaque paire devient une `Frame`, et une liste vide ou trop longue retourne une erreur.

Enfin, on adapte notre utilitaire de test à cette nouvelle interface. Les scénarios existants restent identiques.

```rust
fn assert_score(frames: Vec<(Roll, Roll)>, expected: i32) {
    let bowling_game = BowlingGame::try_from(frames).unwrap();

    assert_eq!(bowling_game.calculate_score(), expected);
}
```

Une fois les modifications sur notre fonction de calcul des scores appliquées, nous nous retrouvons avec l’algo suivant :

```rust
impl BowlingGame {
    pub fn calculate_score(&self) -> i32 {
        let scores = &self.scores;
        let mut result: i32 = 0;

        for index in 0..scores.len() {
            let frame = &scores[index];

            if matches!(frame, Frame::Spare(_, _)) { // si c'est un spare
                let next_roll = match &scores[index + 1] { // on prend le lancer suivant
                    Frame::Score(first, _) | Frame::Spare(first, _) => *first,
                };

                result += 10 + next_roll; // et on l'additionne
                continue;
            }

            if let Frame::Score(first, second) = frame { // si c'est une frame normale
                result += first + second; // ca ne change pas, on additionne
            }
        }

        result
    }
}
```

Nous avons bien refactoré, on peut continuer. On revient à **B pour Boundary** avec une nouvelle limite : dix quilles renversées dès le premier lancer constituent un strike. Son bonus correspond aux deux lancers suivants.

### Le strike

**Scénario : un strike, suivi de quatre puis trois quilles, donne** **`24`**

Notre joueur renverse les dix quilles au premier lancer, puis quatre et trois à la frame suivante. Le nouveau test est rouge : notre code considère encore la première frame comme un spare et retourne `21`. Le strike doit valoir `10 + 4 + 3`, puis la frame suivante vaut `7`, soit **`24`** **au total**.

On ajoute une variante `Strike`, que l’on reconnaît avant de vérifier le spare. Pour calculer les bonus, on transforme les frames suivants en une suite de lancers : un strike fournit un seul lancer, les autres en fournissent deux.

```rust
enum Frame {
    // ...
    Strike,
}

impl BowlingGame {
    pub fn calculate_score(&self) -> i32 {
        // ...
        for index in 0..scores.len() {
            let frame = &scores[index];

            if matches!(frame, Frame::Spare(_, _)) {
                let next_roll: Roll = scores
                    .iter()
                    // du chaining de fonctions que je vous épargne
                    .sum();

                result += 10 + next_roll;
                continue;
            }

            if matches!(frame, Frame::Strike) {
                let next_two_rolls: Roll = scores
                    .iter()
                    // exactement le meme chaining
                    .sum();

                result += 10 + next_two_rolls;
                continue;
            }

            if let Frame::Score(first, second) = frame {
                result += first + second;
            }
        }

        result
    }
}

// ...

#[test]
fn calculate_for_a_strike_followed_by_four_then_three_pins() {
    //...
    let scores: Vec<(Roll, Roll)> =
        [vec![(10, 0), (4, 3)], lose].concat();

    assert_score(scores, 24);
}
```

La duplication entre les deux calculs que sont strike et spare est visible ; nous allons refactorer ça un peu plus tard.

### La dernière frame

**Scénario : une partie parfaite donne** **`300`**

Notre joueur est devenu très doué après toutes ces défaites. Il enchaîne maintenant les strikes pendant toute la partie. Le nouveau test est rouge : notre calcul retourne `270`. Les huit premières frames valent chacune `30`, la neuvième vaut `20` et la dernière vaut `10`. Il manque les deux lancers bonus de la dernière frame.

Le truc, c’est que nous devons maintenant faire évoluer notre modèle car nous ne représentons pas _encore_ trois lancers pour la dernière frame. Je vous la fait courte mais on ajoute `LastFrame(Roll, Roll, Roll)` à notre enum. On adapte notre utilitaire et les données des tests : les couples existants deviennent des tuples avec `None`. Le test de la partie parfaite représente maintenant neuf strikes, puis une dernière frame contenant trois strikes.

Enfin, nous faisons la modification dans notre algo.

```rust
// Dans la boucle de calculate_score,
// après le traitement des spares et des strikes:

if let Frame::LastFrame(first, second, third) = frame {
    result += first + second + third;
    continue;
}

if let Frame::Score(first, second) = frame {
    result += first + second;
}

// ...

#[test]
fn calculate_for_a_perfect_game() {
    let strikes: Vec<(Roll, Roll, Option<Roll>)> = (0..9)
        .map(|_| (10, 0, None))
        .collect();

    let scores = [strikes, vec![(10, 10, Some(10))]].concat();

    assert_score(scores, 300);
}
```

Le test de la partie parfaite passe maintenant : les neuf premières frames valent chacune `30`, puis les trois lancers de la dernière frame ajoutent `30`, soit **`300`** **au total**.

Retenez que **boundary** = tester les transitions/valeurs limites où le **comportement risque de changer**.

## Le résultat

Cet article étant déjà bien assez long, je vous passe plusieurs itérations de refactoring. Voici la solution que nous avons développé jusqu’à maintenant.

```rust
const BOWLING_PINS: i32 = 10;

// ...

impl BowlingGame {
    pub fn calculate_score(&self) -> i32 {
        self.scores
            .iter()
            .enumerate()
            .map(|(index, frame)| match frame {
                Frame::Strike => BOWLING_PINS + self.sum_next_rolls(index, 2),
                Frame::Spare(_, _) => BOWLING_PINS + self.sum_next_rolls(index, 1),
                Frame::Score(first, second) => first + second,
                Frame::LastFrame(first, second, third) => first + second + third,
            })
            .sum()
    }

    fn sum_next_rolls(&self, index: usize, nb_rolls: usize) -> i32 {
        self.scores
            .iter()
            .skip(index + 1)
            .flat_map(|frame| match frame {
                Frame::Score(first, second)
                | Frame::Spare(first, second) => vec![*first, *second],
                Frame::Strike => vec![BOWLING_PINS],
                Frame::LastFrame(first, second, third) => {
                    vec![*first, *second, *third]
                }
            })
            .take(nb_rolls)
            .sum()
    }
}
```

Je vous avais bien dit que nous aurions quelque chose de plus sexy à lire par la suite.

## E - Qu’est ce qu’on a oublié ?

Très bien, on a fait le tour selon vous ?

Et bien en réalité, pas vraiment. Nous avons en effet une solution qui fonctionne. Nous avons commencé avec littéralement **Zero** coups réussis puis, nous avons ajouté plusieurs cas minimaux avec **One**. Par la suite, nous avons introduit **Many** coups réussis. Nous avons testé les **Boundary** qui causent des changements de comportement dans le calcul. Nous avons refactor pour encapsuler le domaine métier et tester les **Interface** de nos objets. Le tout en suivant **Simple Solutions**. 

Si vous avez l’oeil, vous l’avez peut-être remarqué depuis le début mais il nous manque des tests pour les **Exception**. Chose plutôt importante, on ne va pas se mentir. C’est en ça que zombies est utile, se dire « Mince j’ai peut-être loupé quelque chose » ou encore « On fait quoi si on reçoit une frame où plus de 10 quilles sont tombées ? ». 

Le but premier de **zombies**, c’est de pousser à la réflexion. Je ne dis pas que c’est une méthode que vous pourrez utiliser systématiquement de manière aussi naïve que pour notre exemple. Ni qu’il faut absolument retranscrire toutes les variantes lors de chaque développement ; non, c’est uniquement là afin de vous aider à vous poser les bonnes questions.

## S - Et le S dans tout ça ?

Le **S** de ZOMBIES n’a pas vraiment eu droit à son propre chapitre, et c’est volontaire.

Contrairement aux autres lettres, il ne représente pas forcément une étape précise de notre progression. Il nous accompagne plutôt tout au long du développement : **commencer par le scénario le plus simple possible et y répondre avec la solution la plus simple possible**.

C’est exactement ce que nous avons fait depuis le début. Pour notre première partie à zéro, nous avons simplement retourné `0`. Puis, lorsqu’un nouveau test nous a demandé de retourner `1`, nous avons ajouté le cas minimum nécessaire. Ce n’est qu’après plusieurs exemples que nous avons fait émerger une règle plus générale.

L’idée n’est donc pas d’anticiper la solution finale, mais de laisser les tests nous y conduire progressivement. Tant que la solution la plus simple permet de passer au vert, elle est suffisante. Le refactoring viendra ensuite lorsque les exemples nous donneront suffisamment d’informations pour généraliser.

**Simple Scenario / Simple Solution**, c’est finalement ce qui permet de conserver nos baby steps… réellement _baby_.

## Z.O.M.B.I.E.S à l’ère de l’IA ?

C’est vrai, c’est une question que l’on pourrait se poser et qui semble plutôt légitime dans la mesure où l’on écrit de moins en moins de code. L’ami dont je vous parlais au début m’a récemment dit « Oui, de toutes manières, j’ai un peu drop le TDD puisque c’est l’IA qui dev ». J’ai trouvé ça dommage.

Je pense qu’il est important de rappeler que le propos du TDD n’a jamais été de tester mais bien de développer. Que ce soit en test first ou en TDD, à la main ou via de la genAI, je suis d’avis que **zombies** peut avoir sa place au sein de votre boite à outils et cela plus que jamais. Surtout dans un monde où l’on ship de plus en plus de code facilement. Couplé au BDD et au _tres amigos_ il pourra vous aider à définir une spec qui fasse sens pour le besoin, pas plus, pas moins.

Le seul que l’on perd dans cette équation c’est le **S de Simple Scénario/Simple Solution**… parce que oui, indéniablement, l’IA a tendance à surcomplexifier ce qu’elle produit ou à le rendre moins _human readable_. Certains poseront la question « Est-ce qu’on ne s’en fiche pas un peu maintenant que l’on produit du code pour que l’IA le lise ? ». J’apporterais un peu de nuance en disant que : « D’accord, peut-être pas besoin d’une fluent API ici ou là, peut-être que simplement le nom de ma variable est suffisant à la compréhension générale du code ». 

En revanche, je pense qu’il est important de définir un juste milieu au sein de vos équipes. _Je suis d’avis_ que le trouver est essentiel ; dans la mesure où il faut relire le code critique que les IA produisent.

Je vous laisse sur cette réflexion en espérant que l’article vous ait appris quelque chose. 

Pour ceux qui voudraient se lancer au TDD ou à rust 🦀, comme on dit : il n’y a plus qu’à. Prenez un Kata, votre IDE et c’est parti !

