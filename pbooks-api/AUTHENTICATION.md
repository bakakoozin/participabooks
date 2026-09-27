# Authentification Zitadel

## Mise en service

1. Exécuter `migrations/20260927_zitadel_access.sql` sur la base MySQL après une sauvegarde.
2. Créer un projet Zitadel Participabooks, une application SPA utilisant Authorization Code avec PKCE et les rôles de projet `admin` et `moderator`.
3. Configurer le compte technique avec le droit de créer des utilisateurs, de les désactiver et d'attribuer les rôles du projet.
4. Renseigner les variables de `.env.example` et attribuer le premier rôle `admin` dans Zitadel.

## Contrat avec participabooks-front

- Le front demande les scopes `openid profile email` et envoie `Authorization: Bearer <access_token>` pour les appels authentifiés.
- `GET /api/v1/auth/registration-challenge` donne le défi de preuve de travail à résoudre. Le front recherche un entier `number` tel que `SHA-256(salt + number + nonce) === challenge` et renvoie `signature` et `number` dans `altcha`.
- `POST /api/v1/auth/register` reçoit `{ email, pseudo, password, altcha }`. Une réponse `202` signifie que Zitadel a pris en charge le parcours de vérification ; le front ne doit pas en déduire qu'une adresse est nouvelle.
- La connexion, la déconnexion et le renouvellement des jetons passent par Zitadel, pas par l'API. `GET /api/v1/auth/session` retourne le profil Participabooks après vérification Zitadel.
- Le pseudo, l'e-mail et le mot de passe se modifient dans Zitadel. L'API conserve uniquement les préférences Participabooks, telles que le thème et l'avatar.

Les profils existants sont rattachés à leur première connexion si l'adresse e-mail Zitadel vérifiée correspond à un compte MySQL sans `zitadel_subject`.
