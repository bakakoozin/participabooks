
import { useTitle } from "../hooks/useTitle";

import { useMetaDescription } from "../hooks/useMetaDescription";
import styles from "../assets/style/scss/Pages.module.scss";

export function Legal() {
  useTitle("Mentions Légales");
  useMetaDescription("Mentions légales de Participabooks. Informations légales et éditeur du site.");

  return (
    <main className={styles.mainContainer}>
      <h2>Mentions Légales</h2>

      <section className={styles.card}>
        <article>
          <h3>Éditeur du site</h3>
          <p>Cyril PEBRE - bakadev</p>
          <a
            href="https://linktr.ee/bakadev"
            target="_blank"
            rel="lien vers formulaire de contact"
          >
            Nous contacter
          </a>
        </article>

        <article>
          <h3>Hébergement</h3>
          <p>Hébergeur : IDE de la 3WAccademy</p>
        </article>

        <article>
          <h3>Responsabilité</h3>
          <p>
            ParticipaBooks décline toute responsabilité quant à l’usage qui
            pourrait être fait des contenus du site. Les utilisateurs restent
            responsables des données qu’ils soumettent.
          </p>
        </article>

        <article>
          <h3>Propriété intellectuelle</h3>
          <p>
            Tous les éléments du site ParticipaBooks (textes, images, logo, code
            source) sont protégés par le droit d’auteur. Toute reproduction non
            autorisée est interdite.
          </p>
        </article>

        <article>
          <h3>Données personnelles</h3>
          <p>
            Conformément au RGPD, vous disposez d’un droit d’accès, de
            rectification et de suppression de vos données. Pour toute demande,
            contactez-nous via ce lien :{" "}
            <a
              href="https://linktr.ee/bakadev"
              target="_blank"
              rel="lien vers formulaire de contact"
            >
              Nous contacter
            </a>
            .
          </p>
        </article>
      </section>
    </main>
  );
}
