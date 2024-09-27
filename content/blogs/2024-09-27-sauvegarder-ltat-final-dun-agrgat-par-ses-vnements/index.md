---
title: Sauvegarder l’état final d’un agrégat par ses événements
date: 2024-09-27T09:33:34.264Z
description: Pré-requis pour ne pas être trop perdu  - quelques bases en Domain Driven Design (DDD) - quelques bases en JPA / Hibernate   La notion d’agrégat du Domain Driven Design désigne un ensemble cohérent d’
image: ./assets/cover-image.webp
alt: Des aggregats imaginés sous la forme de cellules organiques
ogImage: ./assets/cover-image.webp
tags: ['craft', 'ddd', 'jpa']
published: true
authors:
  - id: 02c620f8-3576-4943-b5cf-6117f99220a2
    name: Edouard Cattez
    image: ./assets/author-edouard-cattez.webp
    linkedin: https://www.linkedin.com/in/edouard-cattez-865794133/
    x: https://x.com/ecattez
reviewers:
  - id: 0bb914a6-f882-4951-bee6-53e8e8abb807
    name: Emmanuelle Gouvart
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c88f5dfa-16db-4e6f-acf1-34dd80ee8766/emma_hoppr.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240927%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240927T093334Z&X-Amz-Expires=3600&X-Amz-Signature=79fc8167b197f482c4bd87d3d40b54e1c53d1b4fe8c478ea78dbaf9250fdb750&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/emmanuellegouvart-182b6ab2/
    x: 
  - id: 67adfd77-4b84-4496-b55d-3391541f59c5
    name: Michaël Bernasinski
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/82ebd0fe-de28-43f3-ab7b-0431af41baad/Photo_HoppR.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240927%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240927T093333Z&X-Amz-Expires=3600&X-Amz-Signature=7a4418996d6bb7aac5876de858fe01b816d0b62f1f1c7b761f697d218080dac3&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/michael-bernasinski
    x: 
  - id: 838dec96-f9fc-404f-a302-07719225d785
    name: Maxime Deroullers
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c69d0b59-558d-4e48-879f-bea3fec1fdef/Linkedin_Profile.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240927%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240927T093333Z&X-Amz-Expires=3600&X-Amz-Signature=824e4bf8f3ec04e004c2c1869033ea8cb59a4b4592fa9a25af8b59caa28bdbbd&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/maxime-deroullers-1b5791137/
    x: https://x.com/mderoullers
  - id: 45c76823-ab7d-4c1f-84b3-0bad16ab91e1
    name: Paul-Alexandre Chrétien
    image: https://prod-files-secure.s3.us-west-2.amazonaws.com/5863e833-64f2-4f13-9f7a-2c92c72b5bbf/c4f79dcc-a6ed-4a79-9947-416b33e5b90a/Photo_Profil_CV_1200px_%2813%29.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240927%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240927T093333Z&X-Amz-Expires=3600&X-Amz-Signature=03af5b1a4f1831ca5b0e776cfe5fe96613027c1589f760f3089fa5ac4db41e79&X-Amz-SignedHeaders=host&x-id=GetObject
    linkedin: https://www.linkedin.com/in/paulalexandrechretien/
    x: 
---

<!-- markdownlint-disable-file -->


Pré-requis pour ne pas être trop perdu

- quelques bases en Domain Driven Design (DDD)
- quelques bases en JPA / Hibernate


La notion d’agrégat du Domain Driven Design désigne un ensemble cohérent d’objets du domaine qui doit être manipulé comme une seule unité métier. Dans cette logique, les décisions métiers sont prises par l'agrégat et prennent la forme d'événements (Domain Event). L'événement est donc la représentation d'une mutation: l'agrégat a changé d'état.

Je vous propose ainsi de voir comme l'on peut persister l'état final d'un agrégat en ne se basant que sur les décisions qu'il a prises.

# L'agrégat

L'exemple que nous allons prendre parle de l'accès d'un utilisateur dont les règles de gestion sont les suivantes:

- l'accès peut être suspendu
- si l'accès est suspendu, il ne peut pas être suspendu à nouveau (erreur)
- l'accès peut être réactivé
```java
@Aggregate // Annotation personnalisée à des fins de documentation
class UserAccess {

    // Le mot clé "transient" est faculatif, il me sert surtout à indiquer que les événements ne seront pas persistés en tant que tel
    private final transient List<UserAccessEvent> occurredEvents = new ArrayList<>();

    private final UserId id;
    private Instant suspendedAt;

    public List<UserEvent> occurredEvents() {
        return List.copyOf(occurredEvents);
    }

    public void suspend(Clock now) {
        if (suspendedAt != null) {
            throw new UserAccessIsAlreadySuspended(id);
        }

        UserAccessSuspended event = UserAccessSuspended.builder()
                .userId(id)
                .suspendedAt(now.instant())
                .build();

        // La décision prise par l'aggrégat est stockée
        this.occurredEvents.add(event);

        // L'état interne de l'aggrégat est muté
        this.apply(event);
    }

    private void apply(UserAccessSuspended event) {
        this.suspendedAt = event.suspendedAt();
    }

    // ... d'autres règles ici ...
}
```

La décision métier est représentée ici de deux manières:

- l'exception UserAccessIsAlreadySuspended
- l'événement UserAccessSuspended
> Bon à savoir, un événement s'étant déjà produit, une bonne manière de le nommer est de l'écrire au passé. L'exception quant à elle est écrite avec la convention IsXX pour décrire un fait.

# Persister l'agrégat

L'agrégat sera manipulé dans la couche application par un service qui couvrira la totalité du geste métier:

- Récupération de l'agrégat
- Prise de décision
- Gestion des erreurs
- Persistance de l'agrégat
> Dans la clean architecture, ce service prend souvent le nom de Use case.

L'agrégat sera récupéré et persisté au travers d'une interface qui va abstraire toute la logique d'infrastructure.

> Dans l'architecture hexagonale, cette interface porte le nom de port.

```java
interface UserAccessPort {

    UserAccess getById(UserId userId);

    void save(UserAccess access);

}
```

## Implémentation

Nous pourrions exposer un getter pour la propriété suspendedAt. Le problème s'il en est de cette méthode réside dans le fait que l'agrégat se mettrait à exposer tout ou partie de son état interne. D'une certaine manière, la modélisation de notre agrégat serait dépendante de la manière de la consommer. C'est là où les événements jouent un rôle important: ils sont faits pour être consommés.

Pour sauvegarder l'agrégat, nous allons parcourir chaque événement qu'il aura pu créer. Pour chaque événement, nous allons effectuer une opération JPA. A contrario, récupérer l'agrégat depuis la persistance se fera par un mapping direct des propriétés.

```java
class UserAccessAdapter implements UserAccessPort {

    private final JpaUserAccesses jpaUserAccesses;

    @Override
    public UserAccess getById(UserId userId) {
        return jpaUserAccesses.findById(userId)
                .map(UserAccessAdapter::toUserAccess)
                .orElseThrow(() -> new UserAccessNotFound(userId));
    }

    private static UserAccess toUserAccess(UserAccessEntity entity) {
        // Ici, on recrée l'agrégat à partir d'un pattern builder
        // Demain, nous pourrions peut être le récréer à partir des événements
        return UserAccess.builder()
                .id(UserId.from(entity.getId()))
                .suspendedAt(entity.getSuspendedAt())
                .build();
    }

    @Override
    public void save(User user) {
        user.occurredEvents().forEach(event -> {
            switch(event) {
                case UserAccessSuspended e -> apply(e);
                case UserAccessUnlocked e -> apply(e);
                // ... other events ...
            }
        });
    }

    private void apply(UserAccessSuspended event) {
        jpaUserAccesses.apply(event);
    }

    private void apply(UserAccessUnlocked event) {
        jpaUserAccesses.apply(event);
    }

}
```

L’association de [HQL](https://docs.jboss.org/hibernate/orm/3.5/reference/fr/html/queryhql.html) et de [SPEL](https://docs.spring.io/spring-framework/reference/core/expressions.html) nous permet ainsi d'écrire nos requêtes SQL à partir de nos événements.

```java
@Repository
interface JpaUserAccesses extends JpaRepository<UserAccessEntity, String> {

    @Modifying
    @Query("""
        UPDATE UserAccess u
        SET u.suspendedAt = :#{#event.suspendedAt()}
        WHERE u.id = :#{#event.userId().value()}
    """)
    void apply(UserAccessSuspended event);

    @Modifying
    @Query("""
        UPDATE UserAccess u
        SET u.suspendedAt = null
        WHERE u.id = :#{#event.userId().value()}
        """)
    void apply(UserAccessUnlocked event);

    // ... apply other events ...
}
```

Notez qu’il est bien sûr possible d’appliquer les événements en utilisant pleinement l’entity manager de Hibernate plutôt que d’exécuter des UPDATE directement sur la base.

# Conclusion

Il n'est pas très compliqué de modéliser les décisions métiers sous forme d'événements. Au travers d'une histoire, nous sommes capables de sauvegarder un état de fait. 
Serions-nous maintenant capables de reconstruire l'agrégat à partir de ses décisions ? L'event sourcing attendra une prochaine fois.

