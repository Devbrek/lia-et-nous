"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/lia-et-nous/Container";

type PracticeItem = {
  order: string;
  title: string;
  text: string;
};

const sectionHead = {
  title: "Ce qui dépend de nous",
  intro:
    "Pas des gestes symboliques. Des choix concrets, sur les outils qu'on choisit et la façon de les utiliser.",
};

const practiceItems: PracticeItem[] = [
  {
    order: "01",
    title: "Texte avant image, image avant vidéo.",
    text: "La génération de vidéo consomme de très loin le plus d'énergie et d'eau des trois. Réservez-la aux cas où elle est vraiment nécessaire.",
  },
  {
    order: "02",
    title: "Le bon outil pour la bonne tâche.",
    text: "Un modèle plus petit et spécialisé dans une tâche fait souvent aussi bien qu'un grand modèle généraliste, pour cette même tâche. Il consomme nettement moins d'eau et d'énergie.",
  },
  {
    order: "03",
    title: "Éviter l'appel qu'on peut éviter.",
    text: "Garder en mémoire une réponse déjà donnée (ce qu'on appelle la \"mise en cache\"), réutiliser une réponse déjà connue, grouper plusieurs demandes en une seule : la meilleure requête à l'IA reste celle qu'on ne fait pas deux fois.",
  },
  {
    order: "04",
    title: "Demander ce que le chiffre couvre.",
    text: "Face à un chiffre \"vert\" annoncé par une entreprise, il faut toujours se poser la même question : qu'est-ce que ce chiffre compte, et qu'est-ce qu'il laisse de côté ?",
  },
];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  return { ref, inView };
}

function PracticeRow({
  item,
  isLast,
}: {
  item: PracticeItem;
  isLast: boolean;
}) {
  const { ref, inView } = useInView<HTMLLIElement>();
  const [open, setOpen] = useState(false);
  const panelId = `practice-panel-${item.order}`;

  return (
    <li
      ref={ref}
      className={`border-t border-gray-300 transition-all duration-500 ease-out ${
        isLast ? "border-b" : ""
      } ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full flex items-center justify-center gap-3 py-4 sm:py-5 text-center group"
      >
        <span
          className={`font-heading text-sm shrink-0 transition-colors duration-500 ${
            inView ? "text-emerald-600" : "text-gray-400"
          }`}
        >
          {item.order}
        </span>
        <span className="font-body font-medium text-gray-800 group-hover:text-emerald-700 transition-colors">
          {item.title}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <path
            d="M2,4 L6,8 L10,4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      </button>

      {/* Truc grid-template-rows 0fr/1fr : anime une hauteur "auto" sans jamais
          mesurer scrollHeight en JS. La transition disparaît d'elle-même sous
          prefers-reduced-motion via la classe motion-reduce ci-dessous. */}
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="font-body text-gray-600 pb-4 sm:pb-5 max-w-lg mx-auto">
            {item.text}
          </p>
        </div>
      </div>
    </li>
  );
}

export default function Practice() {
  return (
    <section
      id="pratique"
      className="min-h-dvh flex flex-col justify-center bg-white py-12 md:py-20 text-center"
    >
      <Container>
        <div className="mx-auto max-w-xl mb-8 md:mb-12">
          <h2 className="font-heading text-2xl md:text-3xl mb-3">
            {sectionHead.title}
          </h2>
          <p className="font-body text-gray-600">{sectionHead.intro}</p>
        </div>

        <ul className="mx-auto max-w-2xl list-none">
          {practiceItems.map((item, i) => (
            <PracticeRow
              key={item.order}
              item={item}
              isLast={i === practiceItems.length - 1}
            />
          ))}
        </ul>
      </Container>
    </section>
  );
}
