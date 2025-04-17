export function LegalNotices() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mentions Légales</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Éditeur du site</h2>
        <p>
          ParticipaBooks
          <br />
          Contact : contact@participabooks.com
          <br />
          Adresse : 123 rue de la Lecture, 75000 Paris, France
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Hébergement</h2>
        <p>
          Hébergeur : Vercel, 440 N Barranca Ave #4133, Covina, CA 91723, USA
          <br />
          Site :{" "}
          <a
            className="text-blue-600 underline"
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            vercel.com
          </a>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Responsabilité</h2>
        <p>
          ParticipaBooks décline toute responsabilité quant à l’usage qui
          pourrait être fait des contenus du site. Les utilisateurs restent
          responsables des données qu’ils soumettent.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
        <p>
          Tous les éléments du site ParticipaBooks (textes, images, logo, code
          source) sont protégés par le droit d’auteur. Toute reproduction non
          autorisée est interdite.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Données personnelles</h2>
        <p>
          Conformément au RGPD, vous disposez d’un droit d’accès, de
          rectification et de suppression de vos données. Pour toute demande,
          contactez-nous à l’adresse : contact@participabooks.com.
        </p>
      </section>
    </div>
  );
}
