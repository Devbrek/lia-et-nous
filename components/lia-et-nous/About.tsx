import Container from "@/components/lia-et-nous/Container";

type AboutContent = {
  title: string;
  paragraphs: string[];
};

const about: AboutContent = {
  title: "À propos de ce site",
  paragraphs: [
    "Le constat : on entend beaucoup de chiffres sur l'impact de l'IA, rarement leur méthodologie. Une requête « coûte » 0,3 mL d'eau selon une entreprise, 45 mL selon une autre — et les deux peuvent être vraies en même temps, parce qu'elles ne mesurent pas la même chose.",
    "La démarche : chaque chiffre affiché vient d'une source publique, citée en bas de page, avec son degré de fiabilité quand il est connu (mesuré, déclaré, audité) ainsi que quand une donnée est contestée ou incomplète.",
    "Ce site n'a pas vocation à culpabiliser ni à vendre une IA « verte » qui n'existerait pas. L'objectif est de donner de quoi comprendre — et de quoi utiliser l'IA un peu mieux, en connaissance de cause.",
  ],
};

export default function About() {
  return (
    <section id="apropos" className="bg-white py-12 md:py-20 border-t border-gray-200 text-center">
      <Container>
      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl mb-5 md:mb-7">
        {about.title}
      </h2>
      <div className="mx-auto max-w-xl space-y-4">
        {about.paragraphs.map((p, i) => (
          <p key={i} className="font-body text-gray-600">
            {p}
          </p>
        ))}
      </div>
      </Container>
    </section>
  );
}
