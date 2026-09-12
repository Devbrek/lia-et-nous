import Container from "@/components/lia-et-nous/Container";
import HeroCanvas from "@/components/lia-et-nous/HeroCanvas";

type Source = {
  href: string;
  label: string;
  detail: string;
};

const sourcesTitle = "Sources citées sur cette page";

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
    <section className="relative min-h-dvh flex flex-col justify-center overflow-hidden bg-zinc-950 text-white py-10 md:py-16 border-t-2  border-sky-500 text-center ">
      <HeroCanvas />

      {/* Voile léger : laisse les particules et lignes bien visibles
          (comme dans Hero/Closing), juste assez de contraste pour lire
          les liens par-dessus. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-5"
        style={{
          background:
            "radial-gradient(ellipse 900px 500px at 50% 40%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 75%)",
        }}
      />

      <Container className="relative z-10 bg-black/30 p-5">
        <h2 className="font-body text-base font-medium text-gray-300 mb-4 md:mb-6 ">
          {sourcesTitle}
        </h2>
        <ul className="mx-auto grid max-w-3xl grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-10 gap-y-3 text-sm list-none">
          {sources.map((source) => (
            <li key={source.href}>
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-sky-500 hover:underline"
              >
                {source.label}
              </a>
              <span className="block text-xs text-gray-400 mt-0.5">
                {source.detail}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
