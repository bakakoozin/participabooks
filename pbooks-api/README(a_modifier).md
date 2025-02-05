# Doc

## Définitions des dossiers et fichiers

- **config** : Gère les configurations globales du projet.
  - `db.js`  : Configure la connexion à la base de données via les variables d'environnement.
- **controllers**: Contient la logique métier pour chaque entité.
- **middlewares**: Définit les validations et sécurités de l'application.
  - **validators/** : Valide les données reçues via des schémas prédéfinis
    - `validate.js` :  Applique le schéma défini dans validationSchema.js.
    - `validationSchema.js` : Contient les règles de validation des données.
  - `checkToken.js` : Vérifie la validité du token d'authentification.
  - `checkIsAdmin`  : Vérifie si l'utilisateur est administrateur.
- **models** : Interagit avec la base de données.
- **router** : Contient les routes organisées par entité.
- **utils** : Contient les fichiers utilitaires.
  - `token.js`: Crée un token JWT.

---

## Flux de données : Création de compte

### Fichiers parcourus et rôles

1. **server.js** : Configure l'application et monte les routes.
2. **/routes/index.routes.js** : Route principale pour charger `auth.routes.js`.
3. **/routes/auth.routes.js** : Gère les endpoints login/register.
4. **/middlewares/validators/validate.js** : Valide les données utilisateurs.
5. **/middlewares/validators/validationSchema.js** : Définit les règles de validation (username, password)
6. **/controllers/auth.controller.js** : Vérifie si un compte existe avec le username donné.
7. **/models/auth.model.js** : Effectue la requête pour chercher l'utilisateur.
8. **/controllers/auth.controller.js** : Hache le mot de passe et effectue une requête via le modèle pour créer le compte.
9. **/models/auth.model.js** : Insère les données du nouvel utilisateur dans la base de données.
10. **/controllers/auth.controller.js** : Renvoie une réponse JSON confirmant la création réussie du compte.

### Remarques

> Les middlewares `validate.js` et `validationSchema.js` sont appelés dans les routes avant de transmettre les données aux contrôleurs.

> Si une validation ou une requête échoue, une réponse JSON au format `{ status: "error", message: "Message d'erreur" }` est envoyée au client depuis les middlewares ou les catch dans les contrôleurs.


