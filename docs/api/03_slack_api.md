# API Slack

## Introduction

L'API Slack est utilisée dans le blog HoppR pour envoyer des notifications automatiques lors de la publication de nouveaux articles ou d'autres événements importants.

## Configuration

Configurez l'API Slack en définissant la variable d'environnement suivante :

- `SLACK_WEBHOOK_URL`: L'URL du webhook Slack pour votre canal de notification

## Fonctions principales

### Envoyer une notification

```typescript
async function sendSlackNotification(message: string): Promise<void>
```

Cette fonction envoie une notification Slack avec le message spécifié.

## Utilisation

Les notifications Slack sont généralement envoyées automatiquement lors des événements suivants :

1. Publication d'un nouvel article
2. Mise à jour majeure d'un article existant
3. Ajout d'un nouvel auteur

## Gestion des erreurs

Les erreurs lors de l'envoi de notifications Slack sont gérées et loguées. Vérifiez les logs du serveur si les notifications ne semblent pas être envoyées.

## Limites et considérations

- Évitez d'envoyer trop de notifications pour ne pas surcharger le canal Slack.
- Assurez-vous que le webhook Slack est correctement configuré et actif.

Pour plus d'informations sur l'intégration Slack, consultez la section correspondante dans la [documentation technique](../technical/01_architecture.md).
