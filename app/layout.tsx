import type { Metadata } from "next";
import { Bricolage_Grotesque, Work_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "L'IA et nous",
  description:
    "Comprendre l'impact eau et énergie de l'IA — sans injonctions, avec des chiffres sourcés.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={cn("font-sans", geist.variable)}>
      <body
        className={`${bricolage.variable} ${workSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
