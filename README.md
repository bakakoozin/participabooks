![logo_pbooks_light](https://github.com/user-attachments/assets/ffa0d713-07ae-497d-abd2-9a4312955082)

# ![favicon-32x32](https://github.com/user-attachments/assets/a21be71a-4f76-4eca-86b3-a4eee5a7b691) Participabooks

**Participabooks** est l'API Node.js / Express de l'application Participabooks. Le front-end React est maintenu dans le dépôt distinct `participabooks-front`.
Elle permet de répertorier l’ensemble des ouvrages d’une bibliothèque physique afin d’en faciliter la gestion.
L’utilisateur peut également ajouter manuellement de nouveaux ouvrages s’ils ne sont pas encore présents dans la base.
Elle permet ainsi d’avoir une vision rapide et accessible à tout moment de sa collection personnelle.


## Fonctionnalités principales
 - 🔍 Rechercher des ouvrages dans sa bibliothèque

 - ➕ Ajouter de nouveaux livres (saisie manuelle)

 - 📱 Accès à sa collection en tout lieu

 - 🔐 Authentification sécurisée via Zitadel

 - 📦 API RESTful avec validation (Joi, express-validator)


## Stack technique
### Backend
 - Node.js

 - Express

 - Zitadel (authentification et rôles)

 - MySQL (via mysql2)

 - Joi / express-validator (validation)

 - dotenv, cors


## Structure des dossiers
```
participabooks/
└── pbooks-api       ← API Node/Express
```


## Installation & Lancement

1. Cloner le projet
```
git clone https://github.com/bakakoozin/participabooks.git
cd participabooks
```

2. Installer les dépendances de l'API
```
cd pbooks-api
npm install
```

3. Lancer l'API
```
cd pbooks-api
npm run start
```

Le front-end se trouve dans le dépôt `participabooks-front`.


## Variables d’environnement

Exemple de contenu du fichier .env.local :
 - Backend (pbooks-api/.env)
 ```
NODE_ENV=
CLIENT_URL=

DB_HOST=
DB_NAME=
DB_USER=
DB_PASS=

ZITADEL_ISSUER=
ZITADEL_API_AUDIENCE=
ZITADEL_PROJECT_ID=
```


## Scripts utiles

Script	Description
`npm run start` Lance le serveur Express
`npm run dev` Lance le serveur Express avec nodemon

✨
Développé par bakaDev
[Linktree](https://linktr.ee/bakadev)
[GIT](https://github.com/bakakoozin)

## Licence
Ce projet est sous licence ISC.
