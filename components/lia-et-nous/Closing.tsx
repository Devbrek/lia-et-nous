"use client";

import { useEffect, useState } from "react";
import Container from "@/components/lia-et-nous/Container";
import HeroCanvas from "@/components/lia-et-nous/HeroCanvas";

type Step = {
  id: string;
  label: string;
  tip: string;
  before: string;
  after: string;
  metric: string;
};

const steps: Step[] = [
  {
    id: "prompt",
    label: "Un prompt précis",
    tip: "Une requête vague déclenche souvent 2 ou 3 relances avant d'obtenir ce qu'on voulait. Autant le faire dès la première fois.",
    before: "Fais-moi un truc sur le marketing",
    after:
      "Rédige un post LinkedIn de 150 mots sur l'A/B testing d'emailing, ton professionnel",
    metric: "1 requête au lieu de 3",
  },
  {
    id: "contexte",
    label: "Un contexte maîtrisé",
    tip: "Un historique de conversation qui s'accumule sans raison alourdit chaque nouvel échange, même quand il n'est plus utile.",
    before: "Conversation de 40 messages, sujets mélangés",
    after: "Nouvelle conversation ciblée, contexte pertinent seulement",
    metric: "Contexte réduit, réponse plus rapide",
  },
  {
    id: "modele",
    label: "Le bon modèle",
    tip: "Un modèle plus petit ou spécialisé suffit pour la majorité des tâches simples. Le modèle le plus puissant disponible n'est pas toujours le bon réflexe.",
    before: "Modèle le plus avancé pour reformuler une phrase",
    after: "Modèle léger, largement suffisant pour la tâche",
    metric: "Jusqu'à plusieurs dizaines de fois moins d'énergie",
  },
  {
    id: "regeneration",
    label: "Pas de boucle",
    tip: "Relancer une génération 5 fois parce que le résultat ne plaît pas à 100 % coûte objectivement plus qu'une demande réfléchie une seule fois.",
    before: "5 régénérations d'image pour affiner un détail",
    after: "1 prompt détaillé, résultat attendu du premier coup",
    metric: "1 génération au lieu de 5",
  },
  {
    id: "format",
    label: "Le bon format",
    tip: "Le texte suffit la plupart du temps. Image et surtout vidéo coûtent nettement plus pour un gain souvent minime.",
    before: "Vidéo générée pour illustrer une idée simple",
    after: "Texte ou schéma suffisant pour la même idée",
    metric: "Coût énergétique très inférieur",
  },
];

function useTypewriter(text: string, active: boolean, speed = 28) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!active) {
      setDisplay("");
      return;
    }
    let i = 0;
    setDisplay("");
    const interval = setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, active, speed]);

  return display;
}

function StepDemo({ step, active }: { step: Step; active: boolean }) {
  const before = useTypewriter(step.before, active, 22);
  const afterActive = active && before.length === step.before.length;
  const after = useTypewriter(step.after, afterActive, 22);

  return (
    <div className="mx-auto mt-6 max-w-xl rounded-lg border border-gray-700 bg-gray-800 p-4 font-body text-sm text-left">
      <div className="mb-3">
        <span className="text-gray-500">avant · </span>
        <span className="text-gray-400 line-through decoration-gray-600">
          {before}
          {active && before.length < step.before.length && (
            <span className="animate-pulse">|</span>
          )}
        </span>
      </div>
      <div className="mb-3">
        <span className="text-gray-500">après · </span>
        <span className="text-white">
          {after}
          {afterActive && after.length < step.after.length && (
            <span className="animate-pulse">|</span>
          )}
        </span>
      </div>
      <div className="text-xs text-sky-400">{step.metric}</div>
    </div>
  );
}

export default function Closing() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="closing"
      className="relative min-h-dvh flex flex-col justify-center overflow-hidden bg-zinc-950 text-white py-12 md:py-20 text-center"
    >
      <HeroCanvas />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-5"
        style={{
          background:
            "radial-gradient(ellipse 700px 480px at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 72%)",
        }}
      />

      <Container className="relative z-10">
        <h2 className="mx-auto max-w-sm font-heading text-2xl sm:text-3xl md:text-4xl mb-4 md:mb-5">
          Ce que tu peux faire dès maintenant.
        </h2>

        <div className="flex flex-wrap justify-center gap-2 mb-2">
          {steps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(i)}
              className={`font-body text-sm px-3 py-2 rounded-full border transition-colors ${
                activeStep === i
                  ? "border-sky-950 bg-sky-500 text-gray-900"
                  : "border-sky-600 text-gray-300 hover:border-sky-200"
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>

        <p className="mx-auto max-w-xl font-body text-gray-300 mt-4">
          {steps[activeStep].tip}
        </p>

        <StepDemo
          step={steps[activeStep]}
          active={true}
          key={steps[activeStep].id}
        />
      </Container>
    </section>
  );
}
