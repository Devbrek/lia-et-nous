"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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

function useInView<T extends HTMLElement>(threshold = 0.3) {
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

/**
 * Sépare l'amorce déjà présente dans le texte source ("Le constat : ...",
 * "La démarche : ...") pour l'afficher en gras. Pur découpage de mise en
 * forme — aucun mot n'est ajouté, retiré ou reformulé. Si le paragraphe ne
 * contient pas ce motif (3e paragraphe), il s'affiche tel quel.
 */
function splitLead(paragraph: string): { lead: string | null; rest: string } {
  const match = paragraph.match(/^([^:]{2,40}?)\s*:\s*/);
  if (!match) return { lead: null, rest: paragraph };
  return { lead: match[1], rest: paragraph.slice(match[0].length) };
}

function AboutStep({
  paragraph,
  index,
  isLast,
}: {
  paragraph: string;
  index: number;
  isLast: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const show = reduced || inView;
  const delayMs = index * 200;
  const { lead, rest } = splitLead(paragraph);

  return (
    <div ref={ref} className="relative pl-8 md:pl-10 pb-8 md:pb-10 last:pb-0">
      {/* Connecteur vertical : segment fixe (repère visuel discret) +
          segment qui se dessine (scaleY) au moment où l'item entre dans
          le viewport, pour suggérer une progression plutôt qu'un simple
          fondu. */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute left-[9px] top-7 bottom-0 w-px bg-gray-200"
        />
      )}
      {!isLast && (
        <span
          aria-hidden="true"
          className={`absolute left-[9px] top-7 bottom-0 w-px bg-sky-500 origin-top transition-transform duration-700 ease-out ${
            show ? "scale-y-100" : "scale-y-0"
          }`}
          style={{ transitionDelay: reduced ? "0ms" : `${delayMs + 200}ms` }}
        />
      )}

      <span
        aria-hidden="true"
        className={`absolute left-0 top-1 w-[19px] h-[19px] rounded-full border-2 transition-all duration-500 ${
          show
            ? "border-sky-500 bg-sky-500 scale-100"
            : "border-gray-300 bg-white scale-75"
        }`}
        style={{ transitionDelay: reduced ? "0ms" : `${delayMs}ms` }}
      />

      <p
        className={`font-body text-gray-600 transition-all duration-600 ease-out ${
          show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
        }`}
        style={{ transitionDelay: reduced ? "0ms" : `${delayMs + 100}ms` }}
      >
        {lead && (
          <span className="font-heading font-medium text-gray-900">
            {lead} :{" "}
          </span>
        )}
        {rest}
      </p>
    </div>
  );
}

export default function About() {
  return (
    <section
      id="apropos"
      className="min-h-dvh flex flex-col justify-center bg-white py-12 md:py-20 border-t border-gray-200"
    >
      <Container>
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl mb-8 md:mb-10 text-center">
          {about.title}
        </h2>
        <div className="mx-auto max-w-xl">
          {about.paragraphs.map((p, i) => (
            <AboutStep
              key={i}
              paragraph={p}
              index={i}
              isLast={i === about.paragraphs.length - 1}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
