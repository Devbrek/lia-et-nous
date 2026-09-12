"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import HeroCanvas from "@/components/lia-et-nous/HeroCanvas";
import Container from "@/components/lia-et-nous/Container";
import Navbar, { handleScrollTo } from "@/components/lia-et-nous/Navbar";
import Image from "next/image";

type HeroContent = {
  titlePart1: string;
  titlePart2: string;
  subtitle: string;
  /**
   * Brouillon à valider — texte provisoire proposé en attendant la version
   * définitive écrite par l'équipe éditoriale.
   */
  intro: string;
  scrollCue: string;
};

const hero: HeroContent = {
  titlePart1: "L'IA",
  titlePart2: "et nous",
  subtitle: "Ce que ça consomme vraiment, et comment s'en servir.",
  intro:
    "Chaque requête à une IA générative consomme de l'eau et de l'électricité, quelque part sur la planète. Les chiffres qui circulent à ce sujet racontent rarement la même histoire. Cette page rassemble des données sourcées pour répondre à une question simple : qu'est-ce que ça consomme vraiment, et comment s'en servir sans se mentir ?",
  scrollCue: "Comprendre le mécanisme",
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

/** Effet machine à écrire : révèle le texte caractère par caractère, tant
 * que `active` est vrai. Un seul `setInterval` actif à la fois, nettoyé au
 * démontage ou si `active` repasse à faux. */
function useTypewriter(text: string, active: boolean, speed = 14) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!active) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, active, speed]);

  return display;
}

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    // Déclenche l'animation d'entrée juste après le premier rendu — le Hero
    // est visible dès le chargement, donc pas d'IntersectionObserver ici,
    // contrairement aux sections plus bas dans la page.
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (reduced) return;
    // Le texte se tape une fois que le titre et le logo ont fini d'arriver
    // (dernière transition à 300ms + 1200ms de durée ≈ 1500ms).
    const timeout = setTimeout(() => setStartTyping(true), 1500);
    return () => clearTimeout(timeout);
  }, [reduced]);

  const show = reduced || mounted;
  const typedIntro = useTypewriter(hero.intro, reduced || startTyping, 2);
  const displayedIntro = reduced ? hero.intro : typedIntro;

  return (
    <section
      id="home"
      className="relative flex flex-col min-h-dvh overflow-hidden bg-[#0a0a0a] text-white py-6 sm:py-10 border-b-2 border-sky-500"
    >
      <HeroCanvas />

      {/* Voile de lisibilité : assombrit la zone où vit le texte (gauche, haut, bas)
          sans couvrir uniformément le canvas, pour que les particules restent visibles
          sur le reste de l'écran. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-5"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.55) 100%), " +
            "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0) 65%)",
        }}
      />

      <Navbar />

      <Container className="relative z-10 flex-1 flex items-center justify-center">
        <div className="max-w-4xl w-full flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 lg:gap-20 text-center sm:text-left">
          <div className="flex-shrink-0 order-1 sm:order-2">
            {/* Logo scindé en deux moitiés qui se rejoignent : la gauche monte
          depuis le bas, la droite descend depuis le haut, les deux en
          fondu. Chaque moitié est un conteneur overflow-hidden de
          largeur 50% ; l'image à l'intérieur est doublée en largeur
          (200%) et calée sur le bord correspondant, pour ne laisser
          voir que sa moitié. */}
            <div className="relative w-16 sm:w-32 md:w-44 lg:w-56 aspect-square">
              <div
                className={`absolute inset-y-0 left-0 w-1/2 overflow-hidden transition-all duration-1200 ease-out ${
                  show
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-14"
                }`}
                style={{ transitionDelay: reduced ? "0ms" : "300ms" }}
              >
                <Image
                  src="/iaetnous.svg"
                  alt=""
                  width={280}
                  height={280}
                  className="absolute left-0 top-0 w-[200%] max-w-none h-full"
                  priority
                />
              </div>
              <div
                className={`absolute inset-y-0 right-0 w-1/2 overflow-hidden transition-all duration-1200 ease-out ${
                  show
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-14"
                }`}
                style={{ transitionDelay: reduced ? "0ms" : "300ms" }}
              >
                <Image
                  src="/iaetnous.svg"
                  alt="L'IA et nous"
                  width={280}
                  height={280}
                  className="absolute right-0 top-0 w-[200%] max-w-none h-full"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="max-w-lg order-2 sm:order-1">
            <h1 className="font-heading font-bold text-sky-500 text-4xl sm:text-6xl md:text-7xl flex flex-wrap justify-center sm:justify-start gap-x-3">
              <span
                className={`inline-block transition-all duration-1200 ease-out ${
                  show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                {hero.titlePart1}
              </span>
              <span
                className={`inline-block transition-all duration-1200 ease-out ${
                  show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: reduced ? "0ms" : "550ms" }}
              >
                {hero.titlePart2}
              </span>
            </h1>
            <p className="font-heading text-lg sm:text-xl md:text-2xl text-gray-200 mt-3 sm:mt-4">
              {hero.subtitle}
            </p>
            <p className="font-body text-sm sm:text-base text-gray-300 mt-4 sm:mt-6 max-w-prose mx-auto sm:mx-0 min-h-[6.5rem] sm:min-h-[5.5rem]">
              {displayedIntro}
              {!reduced &&
                startTyping &&
                displayedIntro.length < hero.intro.length && (
                  <span className="animate-pulse">|</span>
                )}
            </p>
          </div>
        </div>
      </Container>

      <Container>
        <a
          href="#mecanisme"
          onClick={(e) => handleScrollTo(e, "#mecanisme")}
          className="relative z-10 flex items-center gap-2 text-sm text-gray-300 hover:text-sky-400 transition-colors duration-200 w-fit"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M2,5 L7,10 L12,5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
          {hero.scrollCue}
        </a>
      </Container>
    </section>
  );
}
