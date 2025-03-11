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
  - /shelf/search        -> *(GET recherche)* **en cours** ❗ Problème à résoudre
  - /shelf/volume        -> *(POST ajouter)*  ✅
  - /shelf/volume/status -> *(PATCH)*         **en cours** 🔴
  - /shelf/volume/:id    -> *(DELETE)*        ✅
  - /shelf/work          -> *(POST ajouter)*  ✅
  - /shelf/work/:id      -> *(GET une)*       ✅
  - /shelf/work/:id      -> *(DELETE)*        ✅
  REVIEWS
  - /shelf/volumes/:id/reviews -> *(POST)*          **en cours** 🟠
  - /shelf/volumes/:id/reviews/comment -> *(PATCH)* **en cours** 🟠
  - /shelf/volumes/:id/reviews/score -> *(PATCH)*   **en cours** 🟠
  - /shelf/volumes/:id/reviews/:id -> *(PDELETE)*   **en cours** 🟠

- /library -> **en cours** 🟠
  PUBLIC
  - /works        -> *(GET tous)*                               ✅
  - /works/search -> *(GET recherche)*                          **en cours** ❗ Problème à résoudre
  - /works/:id    -> *(GET une)*                                ✅
  - /volumes/:id/reviews -> *(GET)*                             **en cours** 🟠
  USERS
  - /works/create -> *(POST créer)*              `token requis` **en cours** 🔴
  - /works/:id -> *(PATCH)*                      `token requis` **en cours** 🟠
  - /works/:id -> *(DELETE)*                     `token requis` **en cours** 🟠
  - /volumes/:id -> *(DELETE)*                   `token requis` **en cours** 🟠
  MODERATOR
  - /volumes/:id/status -> *(PATCH)* `token requis` `moderator` **en cours** 🟠
  ADMIN
  - /authors/search -> *(GET recherche)* `token requis` `admin` **en cours** 🟠
 
- /admin -> **en cours** 🟠 `token requis` `admin`
  - /       -> *(GET tous)* **en cours** 🟠
  - /       -> *(PATCH)*    **en cours** 🟠
  - /       -> *(DELETE)*   **en cours** 🟠
  - /search -> *(GET)*      **en cours** 🟠

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
  - findBySearch -> *(SELECT rechercher)* ✔️
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
  - findBySearch -> *(SELECT rechercher)*   ✔️
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