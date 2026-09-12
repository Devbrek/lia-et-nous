"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Container from "@/components/lia-et-nous/Container";
import HeroCanvas from "@/components/lia-et-nous/HeroCanvas";

type FigureCard = {
  value: string;
  name: string;
  description: string;
  tag: string;
};

const sectionHead = {
  title: "Trois chiffres, trois façons de mesurer",
  intro:
    "Ce ne sont pas les mêmes mesures. Les comparer directement serait malhonnête. C'est ce qui rend le sujet difficile à suivre.",
};

const figures: FigureCard[] = [
  {
    value: "0,26 mL",
    name: "Google · Gemini",
    description:
      "C'est une requête texte typique : ni la plus ni la moins gourmande de toutes celles mesurées. Le chiffre ne compte que le refroidissement du centre de données — pas le reste. Ce chiffre a été mesuré par Google, qui l'a rendu public : la méthode de calcul est connue.",
    tag: "Mesuré, publié — 2025",
  },
  {
    value: "≈ 0,3 mL",
    name: "OpenAI · ChatGPT",
    description:
      "Une requête moyenne sur ChatGPT, d'après une estimation donnée par Sam Altman. Ce chiffre vient d'une déclaration, sans vérification indépendante : on ne connaît pas exactement comment il a été calculé.",
    tag: "Déclaré, non audité — 2025",
  },
  {
    value: "45 mL",
    name: "Mistral · Le Chat",
    description:
      "Une réponse de 400 tokens — les tokens sont les petites unités de texte que traite un modèle d'IA, à peu près des mots ou des fragments de mots. Ce chiffre compte plus large que les deux précédents (voir ci-dessous). Il vient d'un audit environnemental mené par un organisme extérieur à Mistral.",
    tag: "Audit environnemental — 2025",
  },
];

const figureNote =
  "Le chiffre de Mistral est plus élevé pour une raison simple : il ne mesure pas la même chose que les deux autres. Son audit compte une part de l'entraînement du modèle, c'est-à-dire la phase où l'IA apprend, avant même d'être utilisée. Il compte aussi l'eau utilisée pour produire l'électricité consommée. Google et OpenAI, eux, ne comptent que le refroidissement du serveur au moment de la requête, c'est-à-dire quand l'IA répond à une question. Avant de croire un chiffre \"vert\" annoncé par une entreprise, le premier réflexe est donc de se demander : qu'est-ce qu'il compte exactement, et qu'est-ce qu'il laisse de côté ?";

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function FigureColumn({ fig, delayMs }: { fig: FigureCard; delayMs: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const show = reduced || inView;
  const [open, setOpen] = useState(false);
  const panelId = `figure-panel-${fig.name}`;

  return (
    <div
      ref={ref}
      className={`flex-1 md:min-w-60 bg-zinc-950 p-5 md:p-8 transition-all duration-700 ease-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: reduced ? "0ms" : `${delayMs}ms` }}
    >
      <div
        className={`font-heading text-2xl md:text-4xl transition-all duration-500 ease-out ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        style={{ transitionDelay: reduced ? "0ms" : `${delayMs + 150}ms` }}
      >
        {fig.value}
      </div>
      <div
        className={`font-body text-xs md:text-sm text-gray-300 mt-1 mb-2 md:mb-3 transition-opacity duration-500 ${
          show ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: reduced ? "0ms" : `${delayMs + 220}ms` }}
      >
        {fig.name}
      </div>

      {/* Sur mobile, la description est repliée par défaut derrière un
          bouton persistant (flèche qui pivote) — le texte n'est jamais
          raccourci, juste masqué jusqu'au clic, et reste refermable. Sur
          desktop (md:), tout reste visible en permanence comme avant. */}
      <p
        className={`hidden md:block font-body text-sm text-gray-300 mb-3 transition-opacity duration-500 ${
          show ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: reduced ? "0ms" : `${delayMs + 300}ms` }}
      >
        {fig.description}
      </p>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`md:hidden flex items-center gap-1.5 font-body text-xs text-sky-400 hover:text-sky-300 mb-2 transition-opacity duration-500 ${
          show ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: reduced ? "0ms" : `${delayMs + 300}ms` }}
      >
        <span className="underline underline-offset-2">
          {open ? "Refermer" : "Lire l'explication"}
        </span>
        <svg
          width="10"
          height="10"
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

      <div
        id={panelId}
        className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="font-body text-sm text-gray-300 mb-3">
            {fig.description}
          </p>
        </div>
      </div>

      <span
        className={`inline-block text-xs px-2.5 py-1 border border-gray-500 rounded-full text-gray-300 transition-all duration-500 ease-out ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
        style={{ transitionDelay: reduced ? "0ms" : `${delayMs + 420}ms` }}
      >
        {fig.tag}
      </span>
    </div>
  );
}

function FigureNote() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4 pt-4 sm:mt-9 sm:pt-7 border-t border-sky-800 max-w-3xl">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="figure-note-panel"
        className="md:hidden flex items-center gap-1.5 font-body text-xs text-sky-400 hover:text-sky-300"
      >
        <span className="underline underline-offset-2">
          {open ? "Refermer" : "Pourquoi ces chiffres diffèrent"}
        </span>
        <svg
          width="10"
          height="10"
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

      <p className="hidden md:block font-body text-sm text-gray-300">
        {figureNote}
      </p>

      <div
        id="figure-note-panel"
        className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="font-body text-sm text-gray-300 pt-2">{figureNote}</p>
        </div>
      </div>
    </div>
  );
}

export default function FiguresGrid() {
  return (
    <section
      id="chiffres"
      className="relative min-h-dvh flex flex-col justify-center overflow-hidden bg-zinc-950 text-white py-6 md:py-20"
    >
      <HeroCanvas />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-5"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 78%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <Container className="relative z-10">
        <div className="max-w-xl mb-4 md:mb-12">
          <h2 className="font-heading text-xl md:text-3xl mb-2 md:mb-3">
            {sectionHead.title}
          </h2>
          <p className="font-body text-sm md:text-base text-gray-300">
            {sectionHead.intro}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-px bg-sky-800">
          {figures.map((fig, i) => (
            <FigureColumn key={fig.name} fig={fig} delayMs={i * 200} />
          ))}
        </div>

        <FigureNote />
      </Container>
    </section>
  );
}
