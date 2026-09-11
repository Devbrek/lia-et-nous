import Container from "@/components/lia-et-nous/Container";
import HeroCanvas from "@/components/lia-et-nous/HeroCanvas";

type ModelSizeContent = {
  ledeBefore: string;
  ledeEmphasis: string;
  ledeAfter: string;
  ledeSource: string;
  nuanceBefore: string;
  nuanceEmphasis: string;
  nuanceAfter: string;
};

const modelSize: ModelSizeContent = {
  ledeBefore:
    "Un grand modèle d'IA généraliste — capable de répondre à toutes sortes de questions — peut consommer ",
  ledeEmphasis: "jusqu'à 61 000 fois plus d'énergie",
  ledeAfter:
    " qu'un petit modèle spécialisé, conçu pour une seule tâche précise, pour une tâche équivalente.",
  ledeSource:
    "AI Energy Score — Hugging Face, Carnegie Mellon, Cohere, Salesforce, 2025 (166 modèles comparés à l'inférence, c'est-à-dire au moment où l'IA est utilisée pour répondre, et non quand elle apprend).",
  nuanceBefore:
    "Mais la taille seule ne dit pas tout. Un petit modèle appelé des milliards de fois peut, au total, consommer plus qu'un modèle immense utilisé rarement. Ce qui compte vraiment, c'est un calcul simple : ",
  nuanceEmphasis: "taille × fréquence d'usage",
  nuanceAfter:
    " — pas la taille seule. Pour donner une idée concrète : générer 1 000 réponses texte consomme à peu près autant qu'une charge complète de smartphone. Générer 1 000 images peut consommer l'équivalent de 950 charges de smartphone.",
};

export default function ModelSize() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white py-12 md:py-20 text-center">
      <HeroCanvas />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-5"
        style={{
          background:
            "radial-gradient(ellipse 800px 500px at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 75%)",
        }}
      />

      <Container className="relative z-10">
        <p className="mx-auto max-w-md font-heading font-normal text-xl sm:text-2xl md:text-3xl leading-snug mb-2">
          {modelSize.ledeBefore}
          <b className="font-semibold text-sky-500">{modelSize.ledeEmphasis}</b>
          {modelSize.ledeAfter}
        </p>
        <p className="mx-auto max-w-md font-body text-xs text-gray-300 mb-6 md:mb-9">
          {modelSize.ledeSource}
        </p>
        <div className="mx-auto max-w-2xl bg-gray-800 border border-sky-100 p-5 sm:p-7 textmd text-white-600">
          {modelSize.nuanceBefore}
          <strong className="font-medium text-sky-500">
            {modelSize.nuanceEmphasis}
          </strong>
          {modelSize.nuanceAfter}
        </div>
      </Container>
    </section>
  );
}
