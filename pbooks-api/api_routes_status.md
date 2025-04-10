# API ROUTES STATUS

- /auth -> **terminé** ✅
  - /register      -> *(POST créer)* `validate` ✅
  - /login         -> *(POST)*       `validate` ✅
  - /logout        -> *(POST)*                  ✅
  - /session -> *(GET)*          `token requis` ✅

- /user -> **en cours** 🟠 `token requis`
  - /                    -> *(GET)*           ✅
  PROFILE
  - /profile             -> *(PATCH)*         ✅
  - /profile             -> *(DELETE)*        ✅
  - /profile/avatar      -> *(PATCH)*         ✅
  - /profile/theme       -> *(PATCH)*         ✅
  SHELF
  - /shelf               -> *(GET tous)*      ✅
  - /shelf/volume        -> *(POST ajouter)*  ✅
  - /shelf/volume/status -> *(PATCH)*         **à faire** 🟠
  - /shelf/volume/:id    -> *(DELETE)*        ✅
  - /shelf/work          -> *(POST ajouter)*  ✅
  - /shelf/work/:id      -> *(GET une)*       ✅
  - /shelf/work/:id      -> *(DELETE)*        ✅
  REVIEWS
  - /shelf/volumes/:id/reviews -> *(POST)*          **à faire plus tard** 🔴
  - /shelf/volumes/:id/reviews/comment -> *(PATCH)* **à faire plus tard** 🔴
  - /shelf/volumes/:id/reviews/score -> *(PATCH)*   **à faire plus tard** 🔴
  - /shelf/volumes/:id/reviews/:id -> *(PDELETE)*   **à faire plus tard** 🔴

- /works ->**terminé** ✅
  PUBLIC
  - /        -> *(GET tous)* `vérif token sans blocage` ✅
  - /:id    -> *(GET une)*                              ✅
  - /volumes/:id/reviews -> *(GET)*           **à faire plus tard** 🔴
  USERS
  - /:id -> *(PATCH)*                    `token requis` ✅
  - /create -> *(POST créer)*            `token requis` ✅
  - /uploads -> *(PATCH)*                `token requis` ✅
  - /work/:id -> *(DELETE)*              `token requis` ✅
  - /volumes/:id -> *(GET)*              `token requis` ✅
  - /volumes/:id -> *(PATCH)*            `token requis` ✅
  - /volume/:id -> *(DELETE)*            `token requis` ✅
  - /volumes/create -> *(POST créer)*    `token requis` ✅
  MODERATOR
  - /volumes/:id/status -> *(PATCH)*     `token requis` ✅
  ADMIN
  - /authors/search -> *(GET recherche)* `token requis` `admin` **à faire plus tard** 🔴
 
- /admin -> **terminé** ✅ `token requis` `admin`
  - /users -> *(GET tous)*   ✅
  - /users -> *(PATCH)*      ✅
  - /users -> *(DELETE)*     ✅
  - /users/search -> *(GET)* ✅

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

- shelfs.model -> **terminé** ✔️
  - findAll -> *(SELECT tous)*            ✔️
  - findOne -> *(SELECT un)*              ✔️
  - insertVolume -> *(INSERT)*            ✔️
  - updateStatus -> *(UPDATE)*            ✔️
  - deleteVolume -> *(DELETE)* ->         ✔️
  - deleteAllVolumes -> *(DELETE all)* -> ✔️

- users.model -> **terminé** ✔️
  - findAll -> *(SELECT tous)*            ✔️
  - findOne -> *(SELECT un)*              ✔️
  - findBySearch -> *(SELECT rechercher)* ✔️
  - update -> *(UPDATE)*                  ✔️
  - userTheme -> *(UPDATE)*               ✔️
  - updateAvatar -> *(UPDATE)*            ✔️
  - delete -> *(DELETE)*                  ✔️

- volumes.model -> **terminé** ✔️
  - findAllByWorkId -> *(SELECT)* ✔️
  - insertVolume -> *(INSERT)*    ✔️
  - updateVolume -> *(UPDATE)*    ✔️
  - updateStatus -> *(UPDATE)*    ✔️
  - deleteVolume -> *(DELETE)*    ✔️

- works.model -> **terminé** ✔️
  - findAll -> *(SELECT tous)*              ✔️
  - findOne -> *(SELECT un)*                ✔️
  - findWork -> *(SELECT un)*               ✔️
  - insertWork -> *(INSERT)*                ✔️
  - findOrCreateWork -> *(SELECT / INSERT)* ✔️
  - updateWork -> *(UPDATE)*                ✔️
  - deleteWork -> *(DELETE)*                ✔️

- reviews.model -> **à faire plus tard** ❗
  - findByVolume -> *(SELECT)*  **à faire plus tard** ❗
  - addReview -> *(INSERT)*     **à faire plus tard** ❗
  - updateScore -> *(UPDATE)*   **à faire plus tard** ❗
  - updateComment -> *(UPDATE)* **à faire plus tard** ❗
  - deleteReview -> *(DELETE)*  **à faire plus tard** ❗



**terminé** ✔️
**à faire** ❗
**en cours** 🚧