import Container from "@/components/lia-et-nous/Container";
import HeroCanvas from "@/components/lia-et-nous/HeroCanvas";

type Source = {
  href: string;
  label: string;
  detail: string;
};

const sourcesTitle = "Sources citées sur cette page";
const sourcesIntro =
  "Chaque chiffre affiché sur cette page renvoie à l'une des sources ci-dessous.";

const sources: Source[] = [
  {
    href: "https://news.un.org/fr/story/2026/06/1158934",
    label: "ONU Info — L'IA menace les ressources en eau et en énergie",
    detail: "Institut pour l'eau, l'environnement et la santé de l'ONU, 2026",
  },
  {
    href: "https://www.franceinfo.fr/internet/intelligence-artificielle/il-y-a-un-probleme-de-transparence-que-sait-on-de-la-consommation-en-eau-des-data-centers-qui-abreuvent-internet-et-l-ia_7809896.html",
    label: "franceinfo — La consommation d'eau des data centers",
    detail: "Estimation de Sam Altman citée, 2026",
  },
  {
    href: "https://nation.fr/consommation-eau-ia/",
    label:
      "Nation.fr — Quelle quantité d'eau l'IA consomme-t-elle réellement ?",
    detail: "Chiffres Google et Mistral, 2026",
  },
  {
    href: "https://www.lemagit.fr/actualites/366619735/LAI-Energy-Score-affiche-un-ecart-energetique-colossal-entre-les-modeles-dIA",
    label: "LeMagIT — L'AI Energy Score et l'écart énergétique entre modèles",
    detail: "Hugging Face, Carnegie Mellon, Cohere, Salesforce, 2025",
  },
  {
    href: "https://www.lemagit.fr/conseil/IA-generative-petit-modele-petit-bilan-carbone",
    label: "LeMagIT — Petit modèle, petit bilan carbone ?",
    detail: "Nuances sur la taille des modèles, 2025",
  },
  {
    href: "https://projetcelsius.com/blog/ia-empreinte-eau/",
    label: "Projet Celsius — Combien d'eau consomme une requête ChatGPT ?",
    detail: "Synthèse Google / OpenAI / AIE, 2026",
  },
];

export default function Sources() {
  return (
    <section
      id="sources"
      className="relative min-h-dvh flex flex-col overflow-hidden bg-zinc-950 text-white py-6 md:py-16 border-t-2 border-sky-500"
    >
      <HeroCanvas />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-5"
        style={{
          background:
            "radial-gradient(ellipse 1100px 600px at 50% 40%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 75%)",
        }}
      />

      <Container className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="text-center mb-4 md:mb-12">
          <h2 className="font-heading text-lg sm:text-2xl md:text-3xl mb-1.5 md:mb-2">
            {sourcesTitle}
          </h2>
          <p className="font-body text-xs md:text-sm text-gray-400 max-w-md mx-auto">
            {sourcesIntro}
          </p>
        </div>

        <ul className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 list-none">
          {sources.map((source, i) => (
            <li key={source.href}>
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full rounded-lg border border-gray-800 bg-black/30 p-2.5 md:p-4 transition-all duration-300 hover:border-sky-600 hover:bg-black/50 hover:-translate-y-0.5"
              >
                <span className="font-heading text-[10px] md:text-xs text-sky-500 mb-1 md:mb-2 inline-block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="block text-xs md:text-sm text-gray-200 group-hover:text-sky-400 transition-colors">
                  {source.label}
                </span>
                <span className="block text-[10px] md:text-xs text-gray-500 mt-1 md:mt-1.5">
                  {source.detail}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
