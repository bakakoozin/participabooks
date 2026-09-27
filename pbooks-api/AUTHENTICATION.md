# Authentification Zitadel

## Mise en service

1. Exécuter `migrations/20260927_zitadel_access.sql` sur la base MySQL après une sauvegarde.
2. Créer un projet Zitadel Participabooks, une application SPA utilisant Authorization Code avec PKCE et les rôles de projet `user`, `moderator` et `admin`. En local, configurer `http://localhost:5173` comme URI de redirection et de redirection après déconnexion.
3. Activer l'assertion des rôles dans l'access token. Le front demande `openid profile email urn:zitadel:iam:org:project:id:<PROJECT_ID>:aud` ; l'API valide l'audience du projet et lit la revendication `urn:zitadel:iam:org:project:<PROJECT_ID>:roles`.
4. Créer un compte technique dans la même organisation, avec l'authentification Client Credentials et le rôle d'administrateur Zitadel `ORG_USER_MANAGER`. Lui attribuer le scope `openid urn:zitadel:iam:org:project:id:zitadel:aud`.
5. Renseigner les variables de `.env.example` et attribuer manuellement le premier rôle `admin` dans Zitadel.

## Contrat avec participabooks-front

- Le front demande les scopes `openid profile email` et envoie `Authorization: Bearer <access_token>` pour les appels authentifiés.
- `GET /api/v1/auth/registration-challenge` donne le défi de preuve de travail à résoudre. Le front recherche un entier `number` tel que `SHA-256(salt + number + nonce) === challenge` et renvoie `signature` et `number` dans `altcha`.
- `POST /api/v1/auth/register` reçoit `{ email, pseudo, password, altcha }`. Une réponse `202` signifie que Zitadel a pris en charge le parcours de vérification ; le front ne doit pas en déduire qu'une adresse est nouvelle.
- La connexion, la déconnexion et le renouvellement des jetons passent par Zitadel, pas par l'API. `GET /api/v1/auth/session` retourne le profil Participabooks après vérification Zitadel.
- Le pseudo, l'e-mail et le mot de passe se modifient dans Zitadel. L'API conserve uniquement les préférences Participabooks, telles que le thème et l'avatar.

Les profils existants sont rattachés à leur première connexion si l'adresse e-mail Zitadel vérifiée correspond à un compte MySQL sans `zitadel_subject`.

À la première session dont l'adresse e-mail est vérifiée, l'API attribue le rôle de projet `user` si l'utilisateur n'a encore aucun rôle Participabooks. Elle préserve toute attribution existante. Seul un utilisateur portant le rôle `admin` peut attribuer ou retirer le rôle `moderator` par les routes `/admin`.
