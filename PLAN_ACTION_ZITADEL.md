# Plan d'action — authentification Zitadel

Objectif : utiliser une organisation Zitadel dédiée à Participabooks pour l'authentification, les rôles et la vérification des adresses e-mail. La base MySQL Participabooks ne crée un profil local qu'après une première connexion avec une adresse e-mail vérifiée.

## 1. Préparer la branche et la base de test

- [x] Conserver `feat/zitadel-access` comme branche d'implémentation.
- [x] Vérifier les modifications locales déjà présentes et les conserver si elles sont validées.
- [x] Sauvegarder la base de test si nécessaire.
- [x] Exécuter `pbooks-api/migrations/20260927_zitadel_access.sql` sur la base de test.
- [x] Vérifier que la colonne `users.zitadel_subject` est présente et unique.

## 2. Créer l'organisation Zitadel dédiée

- [x] Créer l'organisation `Participabooks` dans l'instance Zitadel existante.
- [x] Attribuer les droits d'administration de cette organisation aux personnes concernées.
- [x] Configurer le nom affiché et les e-mails envoyés aux utilisateurs.
- [x] Configurer la politique de connexion et exiger la vérification de l'adresse e-mail.
- [x] Vérifier que les utilisateurs de Participabooks sont isolés de ceux de l'autre projet.

## 3. Créer le projet et les rôles Participabooks

- [x] Créer le projet Zitadel `Participabooks` dans l'organisation dédiée.
- [x] Créer les rôles de projet `user`, `moderator` et `admin`.
- [x] Activer l'assertion des rôles dans les jetons et UserInfo.
- [x] Exiger une attribution de rôle au projet pour autoriser une connexion à Participabooks.
- [x] Attribuer manuellement le rôle `admin` au premier compte administrateur.

## 4. Créer les applications Zitadel

- [x] Créer l'application SPA du client React avec Authorization Code et PKCE.
- [x] Ajouter les URI locales de redirection et de déconnexion, notamment `http://localhost:5173`.
- [ ] Configurer les URI de production quand le domaine sera disponible.
- [ ] Autoriser les scopes `openid`, `profile`, `email` et l'audience du projet Participabooks.
- [x] Créer un compte de service dédié à l'API Node.js.
- [x] Lui accorder les droits minimaux pour créer des utilisateurs et gérer leurs attributions de rôles dans l'organisation Participabooks.
- [x] Configurer son mode d'authentification Client Credentials et conserver son secret hors du dépôt.

## 5. Configurer l'API

- [x] Compléter les variables Zitadel dans `pbooks-api/.env` à partir de `.env.example`.
- [x] Configurer l'émetteur, l'audience, l'identifiant de projet et les URL Zitadel.
- [x] Configurer les identifiants du compte de service API.
- [x] Générer et configurer `ALTCHA_HMAC_KEY` et `SIGNUP_IP_HASH_KEY`.
- [x] Vérifier que les secrets ne sont ni committés ni exposés dans les journaux.

## 6. Finaliser le parcours d'inscription

- [x] Conserver ALTCHA et la limitation de débit avant toute création de compte.
- [x] Créer le compte humain dans Zitadel avec une adresse e-mail non vérifiée.
- [x] Récupérer l'identifiant Zitadel créé.
- [x] Attribuer immédiatement le rôle de projet `user` au nouveau compte.
- [x] Déclencher l'e-mail de vérification Zitadel.
- [x] Renvoyer une réponse neutre sans indiquer si l'adresse existe déjà.
- [x] Retirer l'attribution tardive du rôle `user` à la première session, puisqu'elle aura lieu à la création du compte.

## 7. Finaliser l'authentification et les autorisations

- [x] Vérifier les jetons par leur signature, leur émetteur et leur audience.
- [x] Refuser toute session dont l'adresse e-mail n'est pas vérifiée.
- [x] Lire le rôle Participabooks depuis le jeton Zitadel.
- [x] Créer ou rattacher le profil MySQL uniquement lors de la première connexion valide.
- [x] Vérifier que les routes d'administration requièrent `admin`.
- [x] Vérifier que les routes de modération requièrent `moderator` ou `admin`.
- [x] Vérifier que la désactivation d'un compte via l'administration bloque son accès.

## 8. Adapter le client React

- [ ] Remplacer la connexion locale par le flux OIDC Zitadel.
- [ ] Remplacer le JWT et le cookie locaux par l'access token Zitadel.
- [ ] Envoyer l'access token via `Authorization: Bearer <token>` pour les routes protégées.
- [ ] Conserver le formulaire d'inscription Participabooks avec ALTCHA.
- [ ] Afficher une confirmation invitant l'utilisateur à vérifier son e-mail.

## 9. Tester sur la base de test

- [ ] Inscription valide : compte Zitadel créé et rôle `user` attribué.
- [ ] Compte non vérifié : accès à l'API refusé.
- [ ] Compte vérifié : première connexion crée ou rattache un profil MySQL.
- [ ] Compte existant : réponse d'inscription neutre.
- [ ] Tentatives répétées : ALTCHA ou la limitation de débit bloque l'inscription.
- [ ] Rôle `moderator` et rôle `admin` : les routes correspondantes sont accessibles.
- [ ] Utilisateur désactivé : la connexion ou l'accès API est refusé.
- [ ] Exécuter les tests automatisés de l'API et compléter les tests manquants.

## 10. Préparer la production

- [ ] Déplacer ou compléter la limitation de débit avec Redis, un reverse proxy ou un WAF.
- [ ] Définir les URI HTTPS de production dans Zitadel.
- [ ] Déployer les variables d'environnement de production de façon sécurisée.
- [ ] Sauvegarder la base avant la migration de production.
- [ ] Documenter la rotation du secret du compte de service.
- [ ] Documenter les procédures d'administration des rôles et des comptes.

## Évolution différée — supprimer les mots de passe MySQL

À faire seulement après validation complète de Zitadel sur la base de test, puis après un plan de migration des comptes existants en production.

- [ ] Vérifier qu'aucun code ne lit ou n'écrit `users.password`.
- [ ] Prévoir un parcours de réinitialisation de mot de passe Zitadel pour les anciens comptes de production.
- [ ] Ajouter une migration supprimant la colonne `users.password`.
- [ ] Retirer les dépendances et fichiers de l'ancienne authentification locale devenus inutiles.
