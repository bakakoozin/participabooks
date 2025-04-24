import { useTitle } from "../hooks/useTitle";

import { useMetaDescription } from "../hooks/useMetaDescription";
import styles from "../assets/style/scss/Pages.module.scss";

export function CGU() {
  useTitle("CGU");
  useMetaDescription("Conditions générales d'utilisation de Participabooks. Règles d'usage du service et droits des utilisateurs.");

  return (
    <main className={styles.mainContainer}>
      <h2>Conditions Générales d’Utilisation</h2>

      <section className={styles.card}>
        <article>
          <h3>1. Objet</h3>
          <p>
            Les présentes CGU encadrent l’utilisation de l’application
            ParticipaBooks. En utilisant la plateforme, vous acceptez pleinement
            et entièrement ces conditions.
          </p>
        </article>

        <article>
          <h3>2. Accès au service</h3>
          <p>
            L’accès à ParticipaBooks est gratuit. Certaines fonctionnalités sont
            réservées aux utilisateurs enregistrés, aux modérateurs ou aux
            administrateurs selon leur rôle.
          </p>
        </article>

        <article>
          <h3>3. Données utilisateur</h3>
          <p>
            Seules les données strictement nécessaires sont collectées
            (identifiant, mot de passe, email). Les utilisateurs peuvent à tout
            moment modifier ou supprimer leur compte.
          </p>
        </article>

        <article>
          <h3>4. Contenus partagés</h3>
          <p>
            Les utilisateurs peuvent enrichir la base de données. ParticipaBooks
            se réserve le droit de modérer tout contenu inapproprié.
          </p>
        </article>

        <article>
          <h3>5. Responsabilité</h3>
          <p>
            ParticipaBooks n’est pas responsable des erreurs dans les données
            partagées par les utilisateurs, mais s’engage à les modérer dans les
            meilleurs délais.
          </p>
        </article>

        <article>
          <h3>6. Modifications</h3>
          <p>
            Les présentes CGU peuvent être modifiées à tout moment. Les
            utilisateurs seront informés des mises à jour importantes.
          </p>
        </article>
      </section>
    </main>
  );
}
