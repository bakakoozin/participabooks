
![logo_pbooks_light](https://github.com/user-attachments/assets/ffa0d713-07ae-497d-abd2-9a4312955082)

# ![favicon-32x32](https://github.com/user-attachments/assets/a21be71a-4f76-4eca-86b3-a4eee5a7b691) Participabooks

**Participabooks** est une application web développée avec React (Vite) pour le front-end et Node.js / Express pour le back-end.
Elle permet de répertorier l’ensemble des ouvrages d’une bibliothèque physique afin d’en faciliter la gestion.
L’utilisateur peut également ajouter manuellement de nouveaux ouvrages s’ils ne sont pas encore présents dans la base.
Elle permet ainsi d’avoir une vision rapide et accessible à tout moment de sa collection personnelle.


## Fonctionnalités principales
 - 🔍 Rechercher des ouvrages dans sa bibliothèque

 - ➕ Ajouter de nouveaux livres (saisie manuelle)

 - 📱 Accès à sa collection en tout lieu

 - 🔐 Authentification sécurisée via JWT

 - 📦 API RESTful avec validation (Joi, express-validator)


## Stack technique
### Frontend
 - React 18 (avec Vite)

 - React Router DOM

 - Redux Toolkit

 - FontAwesome

 - React Toastify

 - Sass

### Backend
 - Node.js

 - Express

 - JWT (authentification)

 - MySQL (via mysql2)

 - Joi / express-validator (validation)

 - dotenv, cors, bcrypt, cookie-parser


## Structure des dossiers
```
participabooks/
├── pbooks-api       ← Backend Node/Express
└── pbooks-client    ← Frontend React/Vite
```


## Installation & Lancement

1. Cloner le projet
```
git clone https://github.com/bakakoozin/participabooks.git
cd participabooks
```

2. Installer les dépendances
 - Frontend
```
bash:
cd pbooks-client
npm install
```

 - Backend
bash:
```
cd ../pbooks-api
npm install
```

3. Lancer le projet
Dans deux terminaux séparés :
 - Backend
bash:
```
cd pbooks-api
npm run start
```

- Frontend
bash:
```
cd pbooks-client
npm run dev
```


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

JWT_SECRET=
 ```

 - Frontend (pbooks-client/.env)
```
VITE_API_URL=
VITE_BASE_URL_MEDIAS=
```


## Scripts utiles

 - Frontend
Script	Description
`npm run dev`	Lance le serveur Vite en développement
`npm run build`	Build de l’app pour production
`npm run preview`	Prévisualisation post-build
`npm run lint`	Linter avec ESLint

 - Backend
Script	Description
`npm run start` Lance le serveur Express
`npm run dev` Lance le serveur Express avec nodemon

✨ Auteur
Développé par bakaDev
[Linktree](https://linktr.ee/bakadev)
[GIT](https://github.com/bakakoozin)

## Licence
Ce projet est sous licence ISC.
