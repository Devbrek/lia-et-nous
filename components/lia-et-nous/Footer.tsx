import Container from "@/components/lia-et-nous/Container";

const footer = {
  brand: "L'IA et nous",
  tagline: "Un site vitrine sur l'impact eau et énergie de l'IA générative.",
  links: [
    { label: "Sources", href: "#sources" },
    { label: "Mentions légales", href: "/mentions-legales" },
  ],
  legal: {
    editor: "Benjamin SANNA - Devbrek",
    host: "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis",
  },
  credit: "Conçu et développé par Benjamin SANNA - Devbrek",
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-400 py-8 md:py-10 border-t border-gray-800">
      <Container>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-8">
          <div className="max-w-sm">
            <div className="font-heading text-sm text-white mb-2">
              {footer.brand}
            </div>
            <p className="font-body text-xs text-gray-500">{footer.tagline}</p>
          </div>

          <nav className="flex gap-5">
            {footer.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-xs text-gray-400 hover:text-sky-500 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-600">
          <p className="font-body">
            © {year} — {footer.legal.editor} · Hébergé par {footer.legal.host}
          </p>
          <p className="font-body">{footer.credit}</p>
        </div>
      </Container>
    </footer>
  );
}
