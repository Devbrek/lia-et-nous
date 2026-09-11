"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vy: number;
};

type HeroCanvasProps = {
  /**
   * "full" (défaut) : densité du Hero/Closing, lignes de proximité et
   * interaction souris actives.
   * "subtle" : moins de particules, pas de lignes ni de curseur — pensé
   * pour un fond discret derrière du contenu dense à lire (ex. Sources).
   */
  density?: "full" | "subtle";
};

// Réglages de l'effet "particle drift" — aucune donnée éditoriale ici,
// uniquement ce qui sert le rendu visuel du fond.
const LINK_DISTANCE = 120; // px — au-delà, plus de ligne de proximité entre deux nœuds
const CURSOR_DISTANCE = 180; // px — au-delà, plus de ligne ni d'accent vers le curseur
const NODE_COUNT_DESKTOP = 80;
const NODE_COUNT_MOBILE = 40;
const SUBTLE_NODE_COUNT_DESKTOP = 30;
const SUBTLE_NODE_COUNT_MOBILE = 16;
const MOBILE_BREAKPOINT = 640; // aligné sur le breakpoint sm: de Tailwind
const DRIFT_SPEED = 0.15; // px/frame, dérive verticale lente
const NODE_RGB = "148, 163, 184"; // gris clair discret (proche de slate-400)
const ACCENT_RGB = "96, 165, 250"; // bleu doux (proche de blue-400), seule couleur d'accent

export default function HeroCanvas({ density = "full" }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const subtle = density === "subtle";

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let frameId = 0;
    const mouse = { x: -9999, y: -9999 };

    function randomDrift() {
      const v = (Math.random() - 0.5) * DRIFT_SPEED * 2;
      // évite une dérive quasi nulle qui rendrait le nœud visuellement figé
      if (Math.abs(v) < 0.04) return v < 0 ? -0.04 : 0.04;
      return v;
    }

    function createNodes(count: number): Node[] {
      return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: randomDrift(),
      }));
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = subtle
        ? width < MOBILE_BREAKPOINT
          ? SUBTLE_NODE_COUNT_MOBILE
          : SUBTLE_NODE_COUNT_DESKTOP
        : width < MOBILE_BREAKPOINT
          ? NODE_COUNT_MOBILE
          : NODE_COUNT_DESKTOP;
      nodes = createNodes(count);
    }

    function handleMouseMove(e: MouseEvent) {
      if (subtle) return;
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function handleMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function step() {
      ctx!.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.y += node.vy;
        if (node.y < -10) node.y = height + 10;
        if (node.y > height + 10) node.y = -10;
      }

      // Lignes de proximité entre nœuds proches (désactivées en mode subtle)
      if (!subtle) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < LINK_DISTANCE) {
              const alpha = 1 - dist / LINK_DISTANCE;
              ctx!.strokeStyle = `rgba(${NODE_RGB}, ${alpha * 0.35})`;
              ctx!.lineWidth = 1;
              ctx!.beginPath();
              ctx!.moveTo(a.x, a.y);
              ctx!.lineTo(b.x, b.y);
              ctx!.stroke();
            }
          }
        }
      }

      // Nœuds + interaction curseur (curseur désactivé en mode subtle)
      for (const node of nodes) {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isNear = !subtle && dist < CURSOR_DISTANCE;

        if (isNear) {
          const alpha = 1 - dist / CURSOR_DISTANCE;
          ctx!.strokeStyle = `rgba(${ACCENT_RGB}, ${alpha * 0.5})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(node.x, node.y);
          ctx!.lineTo(mouse.x, mouse.y);
          ctx!.stroke();
        }

        ctx!.beginPath();
        ctx!.fillStyle = isNear
          ? `rgba(${ACCENT_RGB}, 0.9)`
          : `rgba(${NODE_RGB}, ${subtle ? 0.35 : 0.6})`;
        ctx!.arc(node.x, node.y, isNear ? 2.2 : 1.6, 0, Math.PI * 2);
        ctx!.fill();
      }

      frameId = requestAnimationFrame(step);
    }

    resize();
    window.addEventListener("resize", resize);
    if (!subtle) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
    }
    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      if (!subtle) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
