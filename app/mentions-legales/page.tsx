import Link from "next/link";
import Container from "@/components/lia-et-nous/Container";

const legalContent = {
  title: "Mentions légales",
  sections: [
    {
      heading: "Éditeur du site",
      body: "Benjamin Sanna (Devbrek), micro-entrepreneur, Montpellier, France. SIRET en cours d'immatriculation. Contact : contact@devbrek.fr",
    },
    {
      heading: "Hébergement",
      body: "Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.",
    },
    {
      heading: "Propriété intellectuelle",
      body: "Les contenus éditoriaux de ce site sont la propriété de Benjamin Sanna. Les chiffres cités proviennent de sources tierces, référencées dans la section Sources de la page d'accueil.",
    },
    {
      heading: "Données personnelles",
      body: "Ce site ne collecte aucune donnée personnelle et n'utilise aucun cookie de suivi.",
    },
  ],
};

export default function MentionsLegales() {
  return (
    <section className="bg-white py-10 md:py-20 min-h-dvh">
      <Container>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-sky-600 transition-colors duration-200 mb-8 md:mb-12"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            aria-hidden="true"
            className="rotate-90"
          >
            <path
              d="M2,5 L7,10 L12,5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
          Retour au site
        </Link>

        <h1 className="font-heading text-2xl md:text-3xl mb-8 md:mb-10 text-gray-900">
          {legalContent.title}
        </h1>

        <div className="max-w-2xl space-y-6 md:space-y-8">
          {legalContent.sections.map((s, i) => (
            <div
              key={s.heading}
              className={`pb-6 md:pb-8 ${
                i < legalContent.sections.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <h2 className="font-heading text-base font-medium mb-2 text-gray-900">
                {s.heading}
              </h2>
              <p className="font-body text-sm leading-relaxed !text-gray-600">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
