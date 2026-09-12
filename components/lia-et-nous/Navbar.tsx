"use client";

import Container from "@/components/lia-et-nous/Container";

type NavbarContent = {
  brand: string;
  navLinks: { label: string; href: string }[];
};

const navbar: NavbarContent = {
  brand: "L'IA et nous",
  navLinks: [
    { label: "Le mécanisme", href: "#mecanisme" },
    { label: "Les chiffres", href: "#chiffres" },
    { label: "À l'échelle mondiale", href: "#wordscale" },
    { label: "En pratique", href: "#pratique" },
    { label: "Pour finir", href: "#closing" },
    { label: "À propos", href: "#apropos" },
    { label: "Sources", href: "#sources" },
  ],
};

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

export default function Navbar() {
  return (
    <Container>
      <nav className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="font-heading text-base sm:text-lg">{navbar.brand}</div>
        <div className="flex flex-wrap gap-3 sm:gap-8">
          {navbar.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-xs sm:text-sm text-gray-300 hover:text-sky-400 transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </Container>
  );
}
