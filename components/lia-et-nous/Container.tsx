import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Bande de contenu centrée — une seule largeur maximale de référence pour
 * tout le site, afin que les blocs de texte s'alignent d'une section à
 * l'autre. Le fond de couleur et le padding vertical restent sur la
 * <section> elle-même ; ce composant ne gère que la largeur et le centrage
 * horizontal (avec le padding horizontal qui allait auparavant sur la
 * section).
 */
export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`relative mx-auto max-w-5xl px-5 sm:px-8 ${className}`.trim()}>
      {children}
    </div>
  );
}
