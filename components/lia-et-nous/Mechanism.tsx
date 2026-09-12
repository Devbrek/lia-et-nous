"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/lia-et-nous/Container";

type MechanismBlock = {
  number: string;
  title: string;
  text: string;
};

type KwhItem = {
  value: number;
  unit: string;
  label: string;
};

const sectionHead = {
  title: "Deux façons dont l'IA consomme de l'eau",
  intro:
    "L'eau intervient à deux endroits différents. La plupart des chiffres publiés n'en comptent qu'un des deux.",
};

const mechanismBlocks: MechanismBlock[] = [
  {
    number: "1",
    title: "Le refroidissement des serveurs",
    text: "Les serveurs chauffent quand ils fonctionnent. Beaucoup de centres de données — les grands bâtiments qui regroupent des milliers de serveurs — les refroidissent en laissant l'eau s'évaporer, ce qui absorbe la chaleur. C'est cette eau-là que mesurent Google et OpenAI quand ils annoncent un chiffre par requête, c'est-à-dire pour chaque question posée à l'IA.",
  },
  {
    number: "2",
    title: "L'eau utilisée pour produire l'électricité",
    text: "Produire de l'électricité consomme aussi de l'eau. Cette eau est utilisée en amont, dans les centrales qui produisent le courant. Elle alimente ensuite les mêmes serveurs. Ce volume d'eau est presque toujours absent des chiffres \"par requête\", et il dépend entièrement du pays où l'électricité est produite.",
  },
];

const kwhIntro =
  "Le kWh, ou kilowattheure, est l'unité qui sert à mesurer une quantité d'électricité consommée. Voici combien d'eau il faut pour produire un kWh, selon le pays :";

const kwhItems: KwhItem[] = [
  { value: 5, unit: "L", label: "d'eau par kWh aux États-Unis" },
  { value: 7, unit: "L", label: "d'eau par kWh en France" },
  { value: 21, unit: "L", label: "d'eau par kWh en Suisse / Suède" },
  { value: 29, unit: "L", label: "d'eau par kWh au Brésil" },
];

const kwhMax = Math.max(...kwhItems.map((i) => i.value));

const kwhSource =
  "Institut pour l'eau, l'environnement et la santé de l'ONU, relayé par ONU Info, 2026.";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
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

function MechanismStep({
  block,
  delayMs,
  isLast,
}: {
  block: MechanismBlock;
  delayMs: number;
  isLast: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const show = reduced || inView;
  const [open, setOpen] = useState(false);
  const panelId = `mechanism-panel-${block.number}`;

  return (
    <div ref={ref} className="flex-1 md:min-w-70 relative">
      <div className="relative w-9 h-9 md:w-11 md:h-11 mb-2 md:mb-4">
        {!open && !reduced && (
          <span
            aria-hidden="true"
            className={`absolute inset-0 rounded-full border-2 border-sky-400 animate-ping-slow ${
              show ? "opacity-60" : "opacity-0"
            }`}
          />
        )}

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={
            open
              ? `Masquer le détail : ${block.title}`
              : `Voir le détail : ${block.title}`
          }
          className={`absolute inset-0 font-heading text-xs md:text-sm border rounded-full flex items-center justify-center transition-all duration-500 hover:scale-105 cursor-pointer ${
            show
              ? "border-sky-600 text-sky-700 opacity-100"
              : "border-gray-400 opacity-0 translate-y-2"
          } ${open ? "bg-sky-600 !text-white !border-sky-600" : ""}`}
          style={{ transitionDelay: reduced ? "0ms" : `${delayMs}ms` }}
        >
          <span className="relative">
            {block.number}
            {/* Icône curseur : invitation au clic tant que l'item n'a pas
                été ouvert. Disparaît en fondu au premier clic — son rôle
                s'arrête là, contrairement à un chevron ou un +/× qui
                indiquerait un état permanent. */}
            <svg
              aria-hidden="true"
              width="11"
              height="11"
              viewBox="0 0 16 16"
              fill="none"
              className={`absolute -right-3 -bottom-2 transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            >
              <path
                d="M2 1.5L2 13.5L5.2 10.6L7.2 14.8L9 14L7 9.8L11 9.5L2 1.5Z"
                fill="currentColor"
                stroke="white"
                strokeWidth="0.6"
              />
            </svg>
          </span>
        </button>
      </div>

      {!isLast && (
        <div
          className={`hidden md:block absolute top-4 left-full w-8 lg:w-10 h-px bg-gray-300 origin-left transition-transform duration-700 ${
            show ? "scale-x-100" : "scale-x-0"
          }`}
          style={{ transitionDelay: reduced ? "0ms" : `${delayMs + 250}ms` }}
        />
      )}

      <h3
        onClick={() => setOpen((o) => !o)}
        className={`font-heading text-base md:text-xl mb-1 md:mb-2 font-medium cursor-pointer transition-all duration-500 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
        style={{ transitionDelay: reduced ? "0ms" : `${delayMs + 100}ms` }}
      >
        {block.title}
      </h3>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="font-body text-sm md:text-base text-gray-600">
            {block.text}
          </p>
        </div>
      </div>
    </div>
  );
}

function useCountUp(target: number, active: boolean, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function KwhBar({ item, delayMs }: { item: KwhItem; delayMs: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const reduced = usePrefersReducedMotion();
  const active = reduced || inView;
  const count = useCountUp(item.value, active);
  const displayValue = reduced ? item.value : count;
  const barPercent = (item.value / kwhMax) * 100;

  return (
    <div ref={ref} className="flex-1 md:min-w-37.5 pt-3 md:pt-5 px-5 sm:px-6">
      <div className="font-heading text-lg md:text-2xl text-gray-800 tabular-nums">
        {displayValue} {item.unit}
      </div>
      <div className="font-body text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1 mb-2 md:mb-3">
        {item.label}
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-sky-600 rounded-full transition-all ease-out"
          style={{
            width: active ? `${barPercent}%` : "0%",
            transitionDuration: "900ms",
            transitionDelay: reduced ? "0ms" : `${delayMs}ms`,
          }}
        />
      </div>
    </div>
  );
}

export default function Mechanism() {
  return (
    <section
      id="mecanisme"
      className="min-h-dvh flex flex-col justify-center bg-white py-6 md:py-20"
    >
      <Container>
        <div className="max-w-xl mb-4 md:mb-12">
          <h2 className="font-heading text-xl md:text-3xl mb-2 md:mb-3">
            {sectionHead.title}
          </h2>
          <p className="font-body text-sm md:text-base text-gray-600">
            {sectionHead.intro}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-10">
          {mechanismBlocks.map((block, i) => (
            <MechanismStep
              key={block.number}
              block={block}
              delayMs={i * 350}
              isLast={i === mechanismBlocks.length - 1}
            />
          ))}
        </div>

        <p className="font-body text-xs md:text-sm text-gray-600 mt-4 md:mt-10">
          {kwhIntro}
        </p>

        <div className="grid grid-cols-2 md:flex md:flex-row mt-2 md:mt-4 border-t border-gray-300 md:border-t-0">
          {kwhItems.map((item, i) => (
            <div
              key={item.label}
              className={`flex-1 md:min-w-37.5 border-gray-300 ${
                i % 2 === 0 ? "border-r md:border-r-0" : ""
              } ${
                i < 2 ? "border-b md:border-b-0" : ""
              } md:border-t-0 md:border-l ${i === 0 ? "md:border-l-0" : ""}`}
            >
              <KwhBar item={item} delayMs={i * 120} />
            </div>
          ))}
        </div>
        <p className="font-body text-xs text-gray-500 mt-2 md:mt-4">
          {kwhSource}
        </p>
      </Container>
    </section>
  );
}
