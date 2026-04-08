---
title: "Architecture hexagonale en programmation fonctionnelle, mythe ou réalité ?"
date: 2026-04-08T07:34:28.327Z
description: "À mesure que les systèmes logiciels gagnent en complexité, les approches traditionnelles de conception montrent leurs limites. Couplage excessif, difficulté à tester, rigidité face au changement : aut"
image: ./assets/cover-image.webp
alt: "Quand l’architecture hexagonale rencontre la programmation fonctionnelle"
ogImage: ./assets/cover-image.webp
tags: ['craft']
published: true
authors:
  - id: 02c620f8-3576-4943-b5cf-6117f99220a2
    name: Edouard Cattez
    image: ./assets/author-edouard-cattez.webp
    linkedin: https://www.linkedin.com/in/edouard-cattez-865794133/
    x: https://x.com/ecattez
  - id: 188f4462-cd38-80d5-b9e6-ec28a94d11e5
    name: Bastien Dufour
    image: /default-author-image.webp
    linkedin: 
    x: 
reviewers:
  - id: 0bb914a6-f882-4951-bee6-53e8e8abb807
    name: Emmanuelle Gouvart
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c88f5dfa-16db-4e6f-acf1-34dd80ee8766/emma_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466YZGE5L65%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T073428Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEC4aCXVzLXdlc3QtMiJHMEUCIQC89XiI4LV2nPeP5GwelaGxITa1i8vxE7nDPN%2FCOOIGPAIgIMuadU2XMtNuvRqanOfvVI6kHru%2B2YCLP1W9z9BRL6UqiAQI9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDMWjV%2FO1zt1H6KDcMCrcA7q8rYPD7JArUtRE2XmtlGFi0Gb1u2jY%2B9Y3SPAbwzgUQRWQ1LEqXfyjuHcnYUj6O%2BiWWlqVuXmzWt1l7lG5Y7arPfzt6AjsXPmIzlmAvYMctlE1uESBOaThTr8QcjJR42skKrqwlIVe%2FFOfTIaN80P8yI23zbwYPGbrre3Q34lTWnE77vQ1FHlDAEnF4q6vCNLknS7i4J4vDz%2FPhtjrQMHSV1BSwg4czuhoUylgbdW1CL8HRfEeFraXH3AJ4wGhuMoxGCakNRvrw7KrF0jpzkULBEC4PwztMJcaWUnD6T2miI%2FUuL5g7ASMT7NtTPiiRFtg3beSatik6dY6JMEdSVElz5yspss5kTYq8YsIQlT8tLRejU4zgp78leO47JOHzmJnro2wd9YdGm%2BEqqiHPsku1HbLTV3oHwYEtPB9FBFqSC9V8AbocksXRXhfmXn8WnZbebEXMu7XiIp%2BiZjIcQC9Brq%2BicBi7iHaUQoAljN8RHny0jm%2FGsm4PRQNiCYbWJnmahrKNRWNkP5RiXqGZnjsXHInBSqkupWnekY9Bd9Vd11JiKSuGkj2ebN%2BuuF4KEtNARclVCjiTEQDt6jwpswqxeH4fTDflh5XXLwZvxU6RIJ1tjcQWwAxRLGRMObb184GOqUB6QApw17fi31uRcyevbEhsIVcF7cbhz5DT9rK2wxOH0%2FJF55Z%2BYpWz%2FPU%2B5b2R7H0t6SkCITFdxrerbjTKeo3ANn6Maeo3qDIWvnyFCzBZT4MaZW3wqjClgUj7X3KTeNPimG82xZWapTks839ysnOLg36HeDcQuWXHFJ73l4hJVzt84hWxgfsDVAj2LWIvdLzbEUnbJwlOUNalA4bSFXi3%2B%2BZSVGf&X-Amz-Signature=b23db6b30ffaf694e97c7283799bfd5930ff0c8de4e984d08997a4e68c32080e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
    linkedin: https://www.linkedin.com/in/emmanuellegouvart-182b6ab2/
    x: 
  - id: 838dec96-f9fc-404f-a302-07719225d785
    name: Maxime Deroullers
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c69d0b59-558d-4e48-879f-bea3fec1fdef/Linkedin_Profile.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XRONKPNZ%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T073428Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDAaCXVzLXdlc3QtMiJIMEYCIQDm83y7rflR2VODU5aP5Qz692idMY%2BBAiAN%2BSxy%2BIDx8QIhAOa4gMORM%2FaT6TWEmlAYAB1EFUTqVOd8ObAa36VRLn1ZKogECPn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1Igx2JIBqc1%2BH7MVdyPMq3AMwmiKyWYDt3nYnDnPmTWKFpHTuLOkgcCjGctfi8lEGyGwb8HnDFp3AGSj883xVmpSFG3ov9Gr0jbfhSvKTLITWxqJygrQWcaGjzsOJf2a%2BCJ1YrRQsGcOq9WQmDm%2BZhHrG5pNgk31O2f2hxAQP8kGkOC8Jxgz5i%2ByBwCv2fghEPKWCxHIu%2FnLv%2FhXKVET9jUK6L6WptG48fnveHprIygQH86y8dPYXMgAN9T0vx6kBoo%2B08NKPdTqNPAVqVyc9pqmixVE5%2FYYWUF9bJj3TbgGOM7nD84%2FvSBbwXZ6tNimPrdF1CmwsAID4sHly9nv3xvml6AWX09lwlYBpvChHrg88DKCJyzlX3fQoIJuUFMssgpP06IgkjTu%2Fnr3Xn5uGFTrIfL5rQ%2BzaYK%2FZEydEOzHikjrCo7K6xcZ52KaSP60Vn9BeslZ59%2BgDLrczqnXYc%2BKmYDxA%2BOsXObXQid1ODmY8uyRcVIogTAZZXhZ0A%2Bi4Jab9uw4tYXRJe%2BrKHn2xyU6qVUV8Yk%2BfK6ZiFWDz2V%2BwgHyegcnDoE%2BS2x1ckw6xTTeoJTZLnLrQOfKKsfbUnZhS%2Bz9vc1iZ%2BvyfWl4WCQPtFwu3AbDHGveoR2wvwgkrm1njJEU%2BkGJmdJJuszC5iNjOBjqkAYLjzrk9PZ61PMzHm%2FL6BGmd9EAJ05SyolUKGsI0gCLqm4I0mFF9BvGTn7y679fSfLS7vBM%2FDT1t2h5TD0H1yXt66PKQIFXPPMIFEQkFoMF4JwsmgNsAwbBRkURagTfGs50qrviYMBbEFKlnmiB4x%2FWI0IOonbk9v0ZBs7OlLZJHOwHgH5nN9Z1KuBEUGhdP9V%2B4zpiZTAlCThrQxBqa1eSxr%2FZb&X-Amz-Signature=ebff0fd05509337077f565c3ea9b944db6f15a3995bdd1bdfb7c90fa020e82fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
    linkedin: https://www.linkedin.com/in/maxime-deroullers-1b5791137/
    x: https://x.com/mderoullers
  - id: 67adfd77-4b84-4496-b55d-3391541f59c5
    name: Michaël Bernasinski
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/1f0a6cf7-edf2-44dc-babb-f1624e4f52b0/Photo_profil.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WIK4JRTG%2F20260408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260408T073428Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEC4aCXVzLXdlc3QtMiJHMEUCICuqELPi893QSyfwnyFTnMqcLUW8j4oiAxjFNZ3gFDtCAiEAgcg%2BHl1dGG5cM0uNfUCb0JlwgkzZ9eZmwtsFG5AyCuMqiAQI9%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGHa9MlsDbZfN%2FYCKircA5gcGnNJ%2FBjl5mcv6g1TMFzbf7dYZESahFgAifbuK%2BBonIuiW%2FfR%2BTBODtvfbiNDgpbOjHteJv7%2FLOgZgpSP1epkw0qahEvYFogVnIgmzLd1roYHs626IPYVOS0RunsFyTGcQwSmc6hVyS4pfODT4OKwUE7EiGUqaQWg%2Fj7j12kZ2vv1FnXda7kxpzNDmLuLzlZp70ozboHb6%2FOUf3BhqdOVAAb1Y%2BK2xHnkdYAr%2BPVJ0v5qUPazBQAtUzMVwAgYxG2JugfVSn2sofk97v9b5pcJIhED4A4Cob%2F21PV2d9RiMTHjuKP2GoO6t96A%2BwpXcyFgb4GLlGugrJ%2B40w0Joq8w3Pfd0SayKfc72LE3%2B0NgPDdD3%2BPBxX8e6RYAxjGHSwwxoqXn0rwbRoa5e94lavTTwWEGXmlhJK6vyL7oMNAh76VCuiKU8zQR9iO4PwyYCOeyYXmwY9uSsjv1Xhnl5Jm6VsP%2BKqUR%2Bm8WmG3%2FSIxpZt0kkz2aF82DYYtBr0odjMLSWzxkezG0APvFa%2F%2FG%2B05zRflCS2EHTC7c3KyVP%2FO0Oz7QkF5vuXU%2F2fPrV4W1%2FSaX6M1s4y8UbTneRMlxLoqt5JSLJAsGyo6eo50VIh%2FeKCkQymrPWjIEIkaIMO7a184GOqUBK3sKSMU%2BE8%2FdgcSKNfCHNWUjsc3Q4%2FwCLEpB3gKjjU2rM9gS1cUnM9ROHr0wmcL3WKMsNhQ0m48hnO45ibaQ7AuaY9YmTTVOucTGGtqI6%2BQ%2FzksdZtEIgKbuMSFIR4TAp0QnGLKg%2B38rtJH3GS%2FB41z21vB74NsTbOLmVnnRN7b%2BUxPfPhInd7VMo9OVUSCVgqOXPGht2WN3qTzRkojiBxAGb%2FIq&X-Amz-Signature=03e3a75c38948c108cfd727f230ff460bccfea1ad49530d77d843f9e4556e253&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
    linkedin: https://www.linkedin.com/in/michael-bernasinski
    x: 
---

<!-- markdownlint-disable-file -->


À mesure que les systèmes logiciels gagnent en complexité, les approches traditionnelles de conception montrent leurs limites. Couplage excessif, difficulté à tester, rigidité face au changement : autant de symptômes qui ralentissent l’évolution des applications modernes. Dans ce contexte, deux courants se distinguent par leur capacité à apporter clarté, robustesse et maintenabilité : l’architecture hexagonale et la programmation fonctionnelle.

L’architecture hexagonale, aussi appelée _Ports and Adapters_, propose de recentrer le cœur métier en le protégeant des dépendances techniques. Elle favorise une séparation nette entre la logique métier et les interactions externes, rendant les systèmes plus modulaires et testables. 
De son côté, la programmation fonctionnelle introduit des principes comme l’immuabilité, les fonctions pures et la composition, permettant de construire des logiciels plus prévisibles et plus faciles à raisonner.

Bien que ces deux approches soient issues de contextes différents, elles partagent une même ambition : réduire la complexité accidentelle pour laisser place à l’essentiel. Leur combinaison ouvre la voie à des architectures élégantes, où le code devient non seulement plus fiable, mais aussi plus expressif.

Dans cet article, nous explorerons comment ces deux paradigmes peuvent se compléter, et en quoi leur adoption conjointe peut transformer en profondeur la manière de concevoir et de faire évoluer nos applications.

## Le langage ubiquitaire au centre de l'architecture

Nous allons illustrer tout ça avec le calcul de package de [Hoppr](http://hoppr.tech/).

$$
Bonus_{HoppR} =
\sum montant_{facture}
- (salaire_{mensuel} \times nb_{mois} \times taux_{employeur})
- (plafond_{marge} \times nb_{mois})
$$

Vous y avez compris quelque chose ? Ne vous en faites pas, on va expliciter tout ça.

Gardons en tête que:

- Le plafond de la marge HoppR par mois est fixe.

- Le chiffre d'affaire est la somme du montant des factures, une facture peut être négative (note de frais par exemple).

- Le coût employeur est un taux fixe.

- Le package est l'addition du salaire et du bonus HoppR.

- Si le bonus HoppR est négatif, il est considéré comme nul, autrement dit, le package sera le salaire brut.

Nous avons décidé de partir sur [Gleam](https://gleam.run/), un langage fonctionnel, strictement typé, basé sur [Elixir](https://elixir-lang.org/). Ce langage offre la possibilité de créer des alias de type, par exemple `type MaString = string`. Cette mécanique est une vraie force car elle permet de mettre en évidence les mots clés du métier (ici celui du Package chez HoppR).

On retrouve ainsi des types comme `ConsultantId`, `Revenue`, `GrossSalary`, `EmployerRate`, `GrossMargin`.

Notre service métier de calcul de package va quant à lui s'exprimer sous la forme d'une fonction.

```elixir
pub fn calculate_annual_packaging(
  revenues: List(Revenue),
  gross_salary: GrossSalary,
  employer_rate: EmployerRate,
  max_margin: GrossMargin,
) -> Package {
  let employer_cost = gross_salary |> to_employer_cost(employer_rate)

  revenues
  |> cumulate
  |> to_gross_margin(employer_cost)
  |> cap_at(max_margin)
  |> to_bonus(employer_rate)
  |> to_package(gross_salary)
}

// Quelques exemples de ce à quoi peuvent ressembler les tests du domaine
pub fn only_one_mission_full_time_test() {...}
pub fn three_missions_during_the_year_test() {...}
pub fn package_is_the_gross_salary_when_the_company_loses_money_test() {...}
```

Ici la lecture de la règle de calcul se voit facilitée par l'usage du _pipe operator_ `|>` qui envoie dans le premier argument de la fonction du dessous le résultat de la fonction du dessus.

On peut donc lire le code comme on le ferait en langage naturel: on cumule les `revenues` auquel on applique une marge brute capée à la marge max. On applique le bonus si bonus il y a et on transforme le tout en package final.

La logique métier est explicite, pure et déterministe.

### Aparté sur les value objects et le pipe operator

Pour éviter le [primitive obsession](https://refactoring.guru/fr/smells/primitive-obsession) et mettre en évidence les concepts du vocabulaire métier, nous créons ce que l'on appelle des **value objects**.

Dans la programmation orientée objet, nous aurions quelque chose comme:

```java
record Revenue(BigDecimal amount) {}

record Revenues(List<Revenue> revenues) {
    public Revenue cumulate() {
        return new Revenue(revenues.stream()
                .map(Revenue::amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
    }
}
```

L'objet expose ses propres méthodes pour pouvoir faire des opérations métiers. Cela impose que toute nouvelle opération soit portée par le dit value object. Le pipe operator permet d'étendre les possibilités du concept sans modifier le concept lui-même. 
Ceci offre une vraie flexibilité, de la lisibilité. C'est la composition fonctionnelle !

## Services purs et dépendances explicites

Le use case principal dépend de données externes (financier + paie). En programmation fonctionnelle, ces dépendances sont injectées via des fonctions :

```elixir
pub type GetFinancialDataPort =
  fn(ConsultantId) -> FinancialData
pub type GetCompanyPayrollDataPort =
  fn() -> CompanyPayrollData

pub fn calculate_consultant_annual_packaging(
  consultant_id: ConsultantId,
  get_financial_data: GetFinancialDataPort,
  get_company_payroll_data: GetCompanyPayrollDataPort,
) {
  // ici l'implémentation de la fonction va chercher l'info dans une api externe
  let CompanyPayrollDataPort(employer_rate, max_margin) = get_company_payroll_data()
  // ici l'implémentation de la fonction va chercher l'info dans une base de données
  let FinancialDataPort(revenues, gross_salary) = get_financial_data(consultant_id)
  calculate_annual_packaging(revenues, gross_salary, employer_rate, max_margin)
}
```

Les ports sont des types de fonctions, et la composition des règles reste locale au domaine. Le métier ne dépend d'aucune techno (HTTP, DB, etc.).

### Et en programmation orientée objet

En Java, on représente les mêmes concepts via des records, classes et interfaces. Le vocabulaire métier est identique, mais l'encapsulation se fait par objets plutôt que par des fonctions.

```java
public interface FinancialDataPort {
  FinancialData forConsultant(ConsultantId consultantId);
}

public interface CompanyPayrollPort {
  CompanyPayrollData get();
}

public final class PackageCalculator {
  private final FinancialDataPort financialDataPort;
  private final CompanyPayrollPort payrollDataPort;

  public PackageCalculator(FinancialDataPort financialDataPort,
                           CompanyPayrollPort payrollDataPort) {
    this.financialDataPort = financialDataPort;
    this.payrollDataPort = payrollDataPort;
  }

  public Package calculateFor(ConsultantId consultantId) {
    var payroll = payrollDataPort.get();
    var financial = financialDataPort.forConsultant(consultantId);
    return calculateAnnualPackaging(
      financial.revenues(),
      financial.grossSalary(),
      payroll.employerRate(),
      payroll.maxMargin()
    );
  }

  private Package calculateAnnualPackaging(
    Revenues revenues,
    GrossSalary grossSalary,
    EmployerRate employerRate,
    GrossMargin maxMargin
  ) {
    var employerCost = grossSalary.multiply(employerRate);
    var grossMargin = revenues.subtract(employerCost);
    var cappedMargin = grossMargin.subtract(maxMargin);
    var bonus = cappedMargin.apply(employerRate);
    var total = grossSalary.add(bonus);

    return new Package(
      bonus,
      grossSalary,
      total
    );
  }
}
```

Le cœur métier reste le même : règles, vocabulaire, invariants. Les dépendances sont injectées depuis l'extérieur du domaine.

Finalement, seule la forme change.

## Conclusion

En programmation fonctionnelle, les règles sont pures et les dépendances explicites.En programmation objet, elles sont encapsulées dans des objets et des interfaces.  Dans l’un comme dans l’autre, l’architecture hexagonale s’y applique de manière égale: le métier et son vocabulaire au centre de l’application. Autrement dit, c**e n'est pas parce qu'on ne fait que des fonctions qu'il n'y a pas d'architecture en couches: on peut clairement distinguer le domaine métier de l'infrastructure.** La programmation fonctionnelle n'est donc pas un obstacle à la valorisation du métier dans le code. Elle peut au contraire rendre le vocabulaire plus lisible et les règles plus testables.

