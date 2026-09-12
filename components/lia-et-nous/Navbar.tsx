"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Container from "@/components/lia-et-nous/Container";
import Image from "next/image";

type NavLink = {
  label: string;
  href: string;
};

type NavbarContent = {
  brand: string;
  navLinks: NavLink[];
};

const navbar: NavbarContent = {
  brand: "",
  navLinks: [
    { label: "Accueil", href: "#home" },
    { label: "Le mécanisme", href: "#mecanisme" },
    { label: "Les chiffres", href: "#chiffres" },
    { label: "À l'échelle mondiale", href: "#wordscale" },
    { label: "Le modèle", href: "#model" },
    { label: "En pratique", href: "#pratique" },
    { label: "Pour finir", href: "#closing" },
    { label: "À propos", href: "#apropos" },
    { label: "Sources", href: "#sources" },
  ],
};

const SCROLL_THRESHOLD = 400;

export function handleScrollTo(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
) {
  e.preventDefault();
  const target = document.querySelector(href);
  if (!target) return;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

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

function useScrolledPast(threshold: number) {
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    function handleScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold);
        ticking.current = false;
      });
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}

function useActiveSection(hrefs: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = hrefs
      .map((href) => ({ href, el: document.querySelector(href) }))
      .filter((entry): entry is { href: string; el: Element } => !!entry.el);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const match = elements.find((e) => e.el === visible.target);
          if (match) setActive(match.href);
        }
      },
      { threshold: 0.5 },
    );

    elements.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, [hrefs]);

  return active;
}

const icons: Record<string, React.ReactNode> = {
  "#home": (
    <path
      d="M3.5 9.5L10 4l6.5 5.5M5.5 8v8h9V8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "#mecanisme": (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.8 2.5h2.4l.4 2.1c.5.15.95.35 1.4.6l1.75-1.25 1.7 1.7-1.25 1.75c.25.45.45.9.6 1.4l2.1.4v2.4l-2.1.4c-.15.5-.35.95-.6 1.4l1.25 1.75-1.7 1.7-1.75-1.25c-.45.25-.9.45-1.4.6l-.4 2.1H8.8l-.4-2.1c-.5-.15-.95-.35-1.4-.6l-1.75 1.25-1.7-1.7 1.25-1.75c-.25-.45-.45-.9-.6-1.4l-2.1-.4v-2.4l2.1-.4c.15-.5.35-.95.6-1.4L3.55 5.65l1.7-1.7 1.75 1.25c.45-.25.9-.45 1.4-.6l.4-2.1ZM10 7.3a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Z"
      fill="currentColor"
    />
  ),
  "#chiffres": (
    <path
      d="M4 16V9M10 16V4M16 16v-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  ),
  "#wordscale": (
    <>
      <circle
        cx="10"
        cy="10"
        r="7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M2.5 10h15M10 2.5c2.2 2 2.2 13 0 15M10 2.5c-2.2 2-2.2 13 0 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </>
  ),
  "#model": (
    <>
      <rect
        x="2.5"
        y="2.5"
        width="8"
        height="8"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <rect
        x="11.5"
        y="11.5"
        width="6"
        height="6"
        rx="1.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </>
  ),
  "#pratique": (
    <path
      d="M10 3a4.5 4.5 0 0 0-2.5 8.2c.4.3.6.7.6 1.1v.7h3.8v-.7c0-.4.2-.8.6-1.1A4.5 4.5 0 0 0 10 3ZM8.3 15.5h3.4M8.8 17h2.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  "#closing": (
    <>
      <path
        d="M5 17.5V3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M5 4h10l-2.2 2.5L15 9H5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M7 4.9h1.3v1.3H7zM9.6 4.9h1.3v1.3H9.6zM8.3 6.2h1.3v1.3H8.3zM11 6.2h1.3v1.3H11zM7 7.5h1.3v1.3H7zM9.6 7.5h1.3v1.3H9.6z"
        fill="currentColor"
      />
    </>
  ),
  "#apropos": (
    <>
      <circle
        cx="10"
        cy="10"
        r="7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="10" cy="6.8" r="0.9" fill="currentColor" />
      <path
        d="M10 9.5v4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
  "#sources": (
    <path
      d="M8 12l4-4M7 9.5l-1.8 1.8a2.5 2.5 0 0 0 3.5 3.5L10.5 13M13 10.5l1.8-1.8a2.5 2.5 0 0 0-3.5-3.5L9.5 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  ),
};

export default function Navbar() {
  const reduced = usePrefersReducedMotion();
  const scrolledRaw = useScrolledPast(SCROLL_THRESHOLD);
  const scrolled = !reduced && scrolledRaw;
  const hrefs = navbar.navLinks.map((l) => l.href);
  const active = useActiveSection(hrefs);
  const [menuOpen, setMenuOpen] = useState(false);

  // Menu mobile en dropdown (nav horizontale du Hero, en dessous de md:)
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function scrollToTop(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: reduced ? "auto" : "smooth",
    });
  }

  return (
    <>
      {/* Nav horizontale : visible en haut du Hero. Sur mobile (< md:), les
          liens sont remplacés par un bouton hamburger qui ouvre un menu
          déroulant plein-largeur, pour ne jamais wrapper ni chevaucher le
          contenu en dessous. À partir de md:, la liste de liens s'affiche
          normalement comme avant. */}
      <div
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ease-out ${
          scrolled
            ? "opacity-0 -translate-y-4 pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
      >
        <Container className="pt-6 sm:pt-10 pb-3">
          <nav className="flex items-center justify-between gap-3">
            <a
              href="#top"
              onClick={scrollToTop}
              className="flex items-center hover:opacity-80 transition-opacity duration-200"
            >
              <Image
                src="/iaetnous.svg"
                alt="L'IA et nous"
                width={36}
                height={36}
                className="w-10 h-10 sm:w-15 sm:h-15"
              />
            </a>

            {/* Bouton hamburger, toujours visible, toujours en haut à droite —
          même comportement à toutes les tailles d'écran. */}
            <button
              type="button"
              onClick={() => setMobileNavOpen((o) => !o)}
              aria-expanded={mobileNavOpen}
              aria-label={mobileNavOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="flex items-center justify-center lg:w-15 lg:h-15 w-10 h-10 bg-sky-500 rounded-full text-zinc-950"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                {mobileNavOpen ? (
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M3 6h14M3 10h14M3 14h14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </nav>

          {/* Menu déroulant : grille de liens avec icône, identique à toutes les
        tailles d'écran. Plus de colonnes disponibles sur grand écran. */}
          <div
            className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
              mobileNavOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 rounded-lg bg-black/80 p-3">
                {navbar.navLinks.map((link) => {
                  const isActive = active === link.href;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        handleScrollTo(e, link.href);
                        setMobileNavOpen(false);
                      }}
                      className={`flex items-center gap-2 rounded px-2.5 py-2 text-xs sm:text-sm transition-colors duration-200 ${
                        isActive
                          ? "bg-sky-500/20 text-sky-400"
                          : "text-gray-300 hover:bg-white/5 hover:text-sky-400"
                      }`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className="shrink-0"
                      >
                        {icons[link.href]}
                      </svg>
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Bouton bascule de la colonne de ronds (post-scroll), inchangé */}
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Fermer la navigation" : "Ouvrir la navigation"}
        className={`fixed right-3 sm:right-5 bottom-4 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-gray-900 text-white shadow-lg transition-all duration-300 ${
          scrolled
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75 pointer-events-none"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
          {menuOpen ? (
            <path
              d="M5 5l10 10M15 5L5 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M4 6h12M4 10h12M4 14h12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      <nav
        aria-label="Navigation par section"
        className={`fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2.5 sm:gap-3 transition-all duration-500 ease-out ${
          scrolled && menuOpen
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-4 pointer-events-none"
        }`}
      >
        {navbar.navLinks.map((link) => {
          const isActive = active === link.href;
          return (
            <div key={link.href} className="relative flex items-center group">
              <span className="absolute right-full mr-3 whitespace-nowrap text-xs text-white bg-gray-900 px-2 py-1 rounded opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-md">
                {link.label}
              </span>

              <a
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                aria-label={link.label}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-md transition-all duration-300 ${
                  isActive
                    ? "bg-sky-500 text-white scale-110"
                    : "bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-sky-400"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  {icons[link.href]}
                </svg>
              </a>
            </div>
          );
        })}
      </nav>
    </>
  );
}
