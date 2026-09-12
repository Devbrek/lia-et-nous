"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/lia-et-nous/Container";

type WorldStat = {
  value: string;
  label: string;
  source: string;
};

const sectionHead = {
  title: "À l'échelle du monde",
  intro:
    "Une goutte d'eau, seule, ne pèse rien. Mais il y a des centaines de millions de requêtes par jour dans le monde. À cette échelle, la question se pose vraiment — et même les organismes qui l'étudient ne s'accordent pas sur le total.",
};

const worldStats: WorldStat[] = [
  {
    value: "4 500 Md L",
    label: "consommés par les centres de données en 2025",
    source: "ONU — Institut pour l'eau, l'environnement et la santé, 2026",
  },
  {
    value: "560 Md L",
    label: "estimés pour l'IA spécifiquement en 2025",
    source: "Agence internationale de l'énergie",
  },
  {
    value: "×2,1",
    label: "de croissance projetée d'ici 2030",
    source:
      "AIE — part de l'IA dans l'électricité des data centers : 5-15 % aujourd'hui, 35-50 % projetés",
  },
];

const discrepancyNote =
  "Ces deux organismes ne mesurent pas la même chose. L'un compte l'ensemble des centres de données, dans le monde entier. L'autre isole seulement la part utilisée par l'IA. C'est pour ça qu'il y a un écart entre 4 500 et 560 milliards de litres — ce n'est pas une contradiction. C'est exactement le genre de nuance qui disparaît dans un titre choc.";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

function useInView<T extends HTMLElement>(threshold = 0.4) {
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

function useDigitScramble(target: string, active: boolean, duration = 900) {
  const [display, setDisplay] = useState(() => target.replace(/\d/g, "0"));

  useEffect(() => {
    if (!active) return;

    const chars = target.split("");
    const digitIndexes = chars
      .map((c, i) => (/\d/.test(c) ? i : -1))
      .filter((i) => i !== -1);

    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      const lockedCount = Math.floor(progress * digitIndexes.length);

      const next = chars.map((c, i) => {
        if (!/\d/.test(c)) return c;
        const posAmongDigits = digitIndexes.indexOf(i);
        if (posAmongDigits < lockedCount) return c;
        return String(Math.floor(Math.random() * 10));
      });

      setDisplay(next.join(""));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return display;
}

function WorldStatCard({
  stat,
  isFirst,
  delayMs,
}: {
  stat: WorldStat;
  isFirst: boolean;
  delayMs: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const active = reduced ? false : inView;
  const scrambled = useDigitScramble(stat.value, active);
  const displayValue = reduced ? stat.value : scrambled;

  return (
    <div
      ref={ref}
      className={`flex-1 md:min-w-55 pt-6 px-5 sm:px-7 md:pt-7 border-t md:border-t-0 md:border-l border-gray-300 ${
        isFirst ? "border-t-0 md:border-l-0 md:pl-0" : ""
      }`}
    >
      <div className="font-heading text-3xl sm:text-4xl text-gray-800 tabular-nums">
        {displayValue}
      </div>
      <div className="font-body text-sm text-gray-600 mt-1.5">{stat.label}</div>
      <div className="font-body text-xs text-gray-500 mt-2">{stat.source}</div>
    </div>
  );
}

function DiscrepancyNote() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reduced = usePrefersReducedMotion();
  const show = reduced || inView;

  return (
    <div
      ref={ref}
      className={`mt-8 p-5 sm:mt-11 sm:p-6 bg-gray-100 border-l-4 border-gray-400 text-sm text-gray-800 max-w-2xl transition-all duration-700 ease-out ${
        show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
      }`}
      style={{ transitionDelay: reduced ? "0ms" : "450ms" }}
    >
      {discrepancyNote}
    </div>
  );
}

export default function WorldScale() {
  return (
    <section
      id="wordscale"
      className="min-h-dvh flex flex-col justify-center bg-white py-12 md:py-20"
    >
      <Container>
        <div className="max-w-xl mb-8 md:mb-12">
          <h2 className="font-heading text-2xl md:text-3xl mb-3">
            {sectionHead.title}
          </h2>
          <p className="font-body text-gray-600">{sectionHead.intro}</p>
        </div>

        <div className="flex flex-col md:flex-row border-t border-gray-300">
          {worldStats.map((stat, i) => (
            <WorldStatCard
              key={stat.value + stat.label}
              stat={stat}
              isFirst={i === 0}
              delayMs={i * 150}
            />
          ))}
        </div>

        <DiscrepancyNote />
      </Container>
    </section>
  );
}
