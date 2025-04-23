# API ROUTES STATUS

- /auth -> **terminé** ✅
  - /register      -> *(POST créer)* `validate` ✅
  - /login         -> *(POST)*       `validate` ✅
  - /logout        -> *(POST)*                  ✅
  - /session -> *(GET)*          `token requis` ✅

- /user -> **terminé** ✅ `token requis`
  - /                    -> *(GET)*           ✅
  PROFILE
  - /profile             -> *(PATCH)*         ✅
  - /profile             -> *(DELETE)*        ✅
  - /profile/avatar      -> *(PATCH)*         ✅
  - /profile/theme       -> *(PATCH)*         ✅
  SHELF
  - /shelf ->               *(GET tous)*      ✅
  - /shelf/volume ->        *(POST ajouter)*  ✅
  - /shelf/volume/:id    -> *(DELETE)*        ✅
  - /shelf/volume/:id/status -> *(PATCH)*     ✅
  - /shelf/work -> *(POST ajouter)*           ✅
  - /shelf/work/:id -> *(GET une)*            ✅
  - /shelf/work/:id -> *(DELETE)*             ✅
  REVIEWS
  - /shelf/volumes/:id/reviews -> *(POST)*          **à faire plus tard** 🔴
  - /shelf/volumes/:id/reviews/comment -> *(PATCH)* **à faire plus tard** 🔴
  - /shelf/volumes/:id/reviews/score -> *(PATCH)*   **à faire plus tard** 🔴
  - /shelf/volumes/:id/reviews/:id -> *(PDELETE)*   **à faire plus tard** 🔴

- /works ->**terminé** ✅
  PUBLIC
  - / -> *(GET tous)*        `vérif token sans blocage` ✅
  - /:id -> *(GET une)*                                 ✅
  - /volumes/:id/reviews -> *(GET)*           **à faire plus tard** 🔴
  USERS
  - /:id -> *(PATCH)*                    `token requis` ✅
  - /create -> *(POST créer)*            `token requis` ✅
  - /uploads/:id -> *(PATCH)*            `token requis` ✅
  - /work/:id -> *(DELETE)*              `token requis` ✅
  - /volumes/:id -> *(GET)*              `token requis` ✅
  - /volumes/:id -> *(PATCH)*            `token requis` ✅
  - /volume/:id -> *(DELETE)*            `token requis` ✅
  - /volumes/create -> *(POST créer)*    `token requis` ✅
  MODERATOR & ADMIN
  - /volumes/:id/status -> *(PATCH)*     `token requis` ✅
 
- /admin -> **terminé** ✅ `token requis` `admin`
  - /users -> *(GET tous)*   ✅
  - /users -> *(PATCH)*      ✅
  - /users -> *(DELETE)*     ✅
  - /users/search -> *(GET)* ✅

**terminé** ✅
**en cours** 🚧
**à faire** ❗