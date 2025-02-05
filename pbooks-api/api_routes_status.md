# API ROUTES STATUS

- /auth -> **à faire** 🔴
  - /register -> **à faire** 🔴
  - /login ->    **à faire** 🔴
  - /logout ->   **à faire** 🔴

- /user -> **à faire** 🔴 `token requis`
  - /userLibrary     -> *(GET tous)*   **à faire** 🔴
  - /userLibrary/:id -> *(GET un)*     **à faire** 🔴
  - /userLibrary/add -> *(POST créer)* **à faire** 🔴
  - /profile        -> *(POST céer)*   **à faire** 🔴
  - /profile            -> *(PATCH)*   **à faire** 🔴
  - /profile             -> *(DELETE)* **à faire** 🔴

- /library -> **en cours** 🟠
  - /       -> *(GET tous)*                                     **en cours** 🟠
  - /search -> *(GET )*                                          **à faire** 🔴
  - /:id    -> *(GET une)*                                       **à faire** 🔴
  - /add    -> *(POST créer)* `token requis` `moderator` `admin` **à faire** 🔴
  - /:id    -> *(PATCH)*      `token requis` `moderator` `admin` **à faire** 🔴
  - /:id    -> *(DELETE)*     `token requis` `moderator` `admin` **à faire** 🔴

- /admin -> **à faire** 🔴 `token requis` `admin`
  - /users    -> *(GET)* **à faire** 🔴
  - /users  -> *(PATCH)* **à faire** 🔴
  - /users -> *(DELETE)* **à faire** 🔴

✅ -> accomplie
🟠 -> priorité dépendante d'une autre tâche
🔴 -> priorité absolue

**terminé** ✅
**en cours** 🟠
**à faire** 🔴