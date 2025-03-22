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
  - /shelf/volume/status -> *(PATCH)*         **en cours** 🔴
  - /shelf/volume/:id    -> *(DELETE)*        ✅
  - /shelf/work          -> *(POST ajouter)*  ✅
  - /shelf/work/:id      -> *(GET une)*       ✅
  - /shelf/work/:id      -> *(DELETE)*        ✅
  REVIEWS
  - /shelf/volumes/:id/reviews -> *(POST)*          **à faire** 🔴
  - /shelf/volumes/:id/reviews/comment -> *(PATCH)* **à faire** 🔴
  - /shelf/volumes/:id/reviews/score -> *(PATCH)*   **à faire** 🔴
  - /shelf/volumes/:id/reviews/:id -> *(PDELETE)*   **à faire** 🔴

- /library -> **en cours** 🟠
  PUBLIC
  - /        -> *(GET tous)*         `vérif token sans blocage` ✅
  - /:id    -> *(GET une)*                                      ✅
  - /volumes/:id/reviews -> *(GET)*                             **à faire** 🔴
  USERS
  - /works/create -> *(POST créer)*              `token requis` ✅
  - /works/work/:id -> *(DELETE)*                `token requis` ✅
  - /works/volume/create -> *(POST créer)*       `token requis` ✅
  - /works/volumes/:id -> *(GET)*                `token requis` ✅
  - /works/volumes/:id -> *(PATCH)*              `token requis` ✅
  - /works/volume/:id -> *(DELETE)*              `token requis` ✅
  - /works/uploads -> *(PATCH)*                  `token requis` ✅
  MODERATOR
  - /volumes/:id/status -> *(PATCH)* `token requis` `moderator` **à faire** 🔴
  ADMIN
  - /authors/search -> *(GET recherche)* `token requis` `admin` **à faire** 🔴
 
- /admin -> **à faire** 🔴 `token requis` `admin`
  - /       -> *(GET tous)* **à faire** 🔴
  - /       -> *(PATCH)*    **à faire** 🔴
  - /       -> *(DELETE)*   **à faire** 🔴
  - /search -> *(GET)*      **à faire** 🔴

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

- reviews.model -> **terminé** ✔️
  - findByVolume -> *(SELECT)*  ✔️
  - addReview -> *(INSERT)*     ✔️
  - updateScore -> *(UPDATE)*   ✔️
  - updateComment -> *(UPDATE)* ✔️
  - deleteReview -> *(DELETE)*  ✔️



**terminé** ✔️
**à faire** ❗
**en cours** 🚧