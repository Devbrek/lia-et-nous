"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Container from "@/components/lia-et-nous/Container";
import HeroCanvas from "@/components/lia-et-nous/HeroCanvas";

type ModelSizeContent = {
  ledeBefore: string;
  ledeValue: string;
  ledeEmphasisSuffix: string;
  ledeAfter: string;
  ledeSource: string;
  nuanceBefore: string;
  nuanceEmphasis: string;
  nuanceAfter: string;
};

const modelSize: ModelSizeContent = {
  ledeBefore:
    "Un grand modèle d'IA généraliste — capable de répondre à toutes sortes de questions — peut consommer jusqu'à ",
  ledeValue: "61 000",
  ledeEmphasisSuffix: " fois plus d'énergie",
  ledeAfter:
    " qu'un petit modèle spécialisé, conçu pour une seule tâche précise, pour une tâche équivalente.",
  ledeSource:
    "AI Energy Score — Hugging Face, Carnegie Mellon, Cohere, Salesforce, 2025 (166 modèles comparés à l'inférence, c'est-à-dire au moment où l'IA est utilisée pour répondre, et non quand elle apprend).",
  nuanceBefore:
    "Mais la taille seule ne dit pas tout. Un petit modèle appelé des milliards de fois peut, au total, consommer plus qu'un modèle immense utilisé rarement. Ce qui compte vraiment, c'est un calcul simple : ",
  nuanceEmphasis: "taille × fréquence d'usage",
  nuanceAfter: " — pas la taille seule.",
};

const comparisonItems = [
  {
    label: "1 000 réponses texte",
    charges: 0.16,
    unit: "charge de smartphone",
  },
  {
    label: "1 000 images générées",
    charges: 950,
    unit: "charges de smartphone",
  },
];

const maxCharges = Math.max(...comparisonItems.map((i) => i.charges));

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

/** Compteur à rouleaux : chaque chiffre défile aléatoirement puis se fige
 * de gauche à droite. Reprend le principe déjà utilisé dans WorldScale.tsx. */
function useDigitScramble(target: string, active: boolean, duration = 1000) {
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

function LedeValue() {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const reduced = usePrefersReducedMotion();
  const active = reduced ? false : inView;
  const scrambled = useDigitScramble(modelSize.ledeValue, active);
  const displayValue = reduced ? modelSize.ledeValue : scrambled;

  return (
    <b ref={ref} className="font-semibold text-sky-500 tabular-nums">
      {displayValue}
      {modelSize.ledeEmphasisSuffix}
    </b>
  );
}

function useCountUp(target: number, active: boolean, duration = 900) {
  const [value, setValue] = useState(0);
  const decimals = target < 1 ? 2 : 0;

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const raw = eased * target;
      const factor = Math.pow(10, decimals);
      setValue(Math.round(raw * factor) / factor);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration, decimals]);

  return value;
}

function ComparisonBar({
  item,
  delayMs,
}: {
  item: (typeof comparisonItems)[number];
  delayMs: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const reduced = usePrefersReducedMotion();
  const active = reduced || inView;
  const count = useCountUp(item.charges, active);
  const displayValue = reduced ? item.charges : count;
  // Racine carrée pour compresser l'écart visuel (1 vs 950 en linéaire
  // rendrait la première barre quasi invisible) tout en gardant un
  // contraste net et honnête entre les deux hauteurs.
  const heightPercent = Math.max(
    6,
    (Math.sqrt(item.charges) / Math.sqrt(maxCharges)) * 100,
  );

  return (
    <div ref={ref} className="flex flex-col items-center w-32 sm:w-40">
      <div className="font-heading text-xl sm:text-2xl text-white tabular-nums mb-2">
        {displayValue.toString().replace(".", ",")}
      </div>
      <div className="flex items-end h-28 sm:h-36 w-full">
        <div
          className="w-full bg-sky-600 rounded-t transition-all ease-out"
          style={{
            height: active ? `${heightPercent}%` : "0%",
            transitionDuration: "800ms",
            transitionDelay: reduced ? "0ms" : `${delayMs}ms`,
          }}
        />
      </div>
      <div className="font-body text-xs text-gray-400 mt-2 text-center">
        {item.unit} pour
      </div>

      <div className="font-body text-[11px] text-gray-500 mt-1 text-center">
        {item.label}
      </div>
    </div>
  );
}

export default function ModelSize() {
  return (
    <section className="relative min-h-dvh flex flex-col justify-center overflow-hidden bg-zinc-950 text-white py-12 md:py-20 text-center">
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
          <LedeValue />
          {modelSize.ledeAfter}
        </p>
        <p className="mx-auto max-w-md font-body text-xs text-gray-300 mb-6 md:mb-9">
          {modelSize.ledeSource}
        </p>

        <div className="mx-auto max-w-2xl bg-gray-800 border border-sky-900 rounded-lg p-5 sm:p-7 text-sm text-gray-300 text-left sm:text-center">
          <p className="mb-5">
            {modelSize.nuanceBefore}
            <strong className="font-medium text-sky-500">
              {modelSize.nuanceEmphasis}
            </strong>
            {modelSize.nuanceAfter}
          </p>

          <p className="text-xs text-gray-400 mb-5 max-w-md mx-auto">
            Le format compte aussi dans ce calcul : à nombre égal de requêtes,
            générer des images consomme nettement plus que générer du texte.
            Comparaison pour 1 000 générations, en équivalent de charges de
            smartphone (Hugging Face / Carnegie Mellon, 2023 — étude &quot;Power
            Hungry Processing&quot;).
          </p>

          <div className="flex items-end justify-center gap-8 sm:gap-14 pt-2">
            {comparisonItems.map((item, i) => (
              <ComparisonBar key={item.label} item={item} delayMs={i * 200} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
