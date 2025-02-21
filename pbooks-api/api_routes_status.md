# API ROUTES STATUS

- /auth -> **en cours** 🟠
  - /register      -> *(POST créer)* **en cours** 🟠
  - /login         -> *(POST)*       **en cours** 🟠
  - /logout        -> *(POST)*       **en cours** 🟠
  - /refresh-login -> *(POST)*       **en cours** 🟠

- /user -> **en cours** 🟠 `token requis`
  - /                -> *(GET)*       **en cours** 🟠
  - /profile         -> *(PATCH)*     **en cours** 🟠
  - /profile/avatar  -> *(PATCH)*     **en cours** 🟠
  - /profile         -> *(DELETE)*    **en cours** 🟠

- /library -> **en cours** 🟠
  - /works        -> *(GET tous)*                               **en cours** 🟠
  - /works/search -> *(GET recherche)*                          **en cours** 🟠
  - /works/:id    -> *(GET une)*                                **en cours** 🟠
  - /works/create -> *(POST créer)*              `token requis` **en cours** 🟠
  - /works/:id -> *(PATCH)*                      `token requis` **en cours** 🟠
  - /works/:id -> *(DELETE)*                     `token requis` **en cours** 🟠
  - /volumes/:id/status -> *(PATCH)* `token requis` `moderator` **en cours** 🟠
  - /volumes/:id -> *(DELETE)*                   `token requis` **en cours** 🟠
  - /authors/search -> *(GET recherche)*                        **en cours** 🟠

- /admin -> **en cours** 🟠 `token requis` `admin`
  - /       -> *(GET tous)* **en cours** 🟠
  - /search -> *(GET)*      **en cours** 🟠
  - /       -> *(PATCH)*    **en cours** 🟠
  - /       -> *(DELETE)*   **en cours** 🟠

✅ -> accomplie
🟠 -> priorité dépendante d'une autre tâche
🔴 -> priorité absolue

**terminé** ✅
**en cours** 🟠
**à faire** 🔴
**route testée sans middleware** ✔️


# API REQUETES SQL STATUS

- auth.model -> **terminé** ✔️
  - findUserForAuth -> *(SELECT)* ✔️
  - createUser -> *(INSERT)*      ✔️

- authors.model -> **terminée** ✔️
  - findByName -> *(SELECT)*             ✔️
  - getAuthorsByVolumeId -> *(SELECT)*   ✔️
  - findOrCreateAuthor -> *(INSERT)*     ✔️
  - linkAuthorToVolume -> *(INSERT)*     ✔️
  - unlinkAuthorFromVolume -> *(DELETE)* ✔️

- medias.model -> **terminé** ✔️
  - insertMedia -> *(INSERT)* ✔️
  - updateMedia -> *(UPDATE)* ✔️

- shelfs.model -> **à faire** ❗
  - findAll -> *(SELECT tous)* **à faire** ❗
  - findBySearch -> *(SELECT rechercher)* **à faire** ❗
  - findOne -> *(SELECT un)* **à faire** ❗
  - addWork -> *(UPDATE)* **à faire** ❗
  - delete -> *(DELETE)* -> **à faire** ❗

- users.model -> **terminé** ✔️
  - findAll -> *(SELECT tous)*            ✔️
  - findOne -> *(SELECT un)*              ✔️
  - findBySearch -> *(SELECT rechercher)* ✔️
  - update -> *(UPDATE)*                  ✔️
  - userTheme -> *(UPDATE)*               ✔️
  - updateAvatar -> *(UPDATE)*            ✔️
  - delete -> *(DELETE)*                  ✔️

- volumes.model -> **terminé** ✔️
  - insertVolume -> *(INSERT)* ✔️
  - updateVolume -> *(UPDATE)* ✔️
  - updateStatus -> *(UPDATE)* ✔️
  - deleteVolume -> *(DELETE)* ✔️

- works.model -> **terminé** ✔️
  - findAll -> *(SELECT tous)*              ✔️
  - findBySearch -> *(SELECT rechercher)*   ✔️
  - findOne -> *(SELECT un)*                ✔️
  - findWork -> *(SELECT un)*               ✔️
  - insertWork -> *(INSERT)*                ✔️
  - findOrCreateWork -> *(SELECT / INSERT)* ✔️
  - updateWork -> *(UPDATE)*                ✔️
  - deleteWork -> *(DELETE)*                ✔️


**terminé** ✔️
**à faire** ❗
**en cours** 🚧