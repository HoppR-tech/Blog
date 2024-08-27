# Installation du Blog HoppR

Ce guide vous aidera à installer et configurer le Blog HoppR sur votre environnement local.

## Prérequis

- Node.js (version 14 ou supérieure)
- npm (généralement installé avec Node.js)
- Git

## Étapes d'installation

1. Clonez le repository GitHub :

```bash
git clone https://github.com/HoppR-tech/blog.git
```

2. Accédez au répertoire du projet :

```bash
cd blog
```

3. Installez les dépendances du projet :

```bash
npm install
```

4. Créez un fichier `.env` à partir du fichier `.env.example` :

```bash
cp .env.example .env
```

5. Remplissez les variables d'environnement avec les valeurs appropriées.

6. Démarrez le serveur de développement :

```bash
npm run dev
```

Le blog devrait maintenant être accessible à l'adresse `http://localhost:3000`.

Pour plus d'informations sur la configuration, veuillez consulter le fichier [02_configuration.md](02_configuration.md).
