import Image from "next/image";
import Link from "next/link";

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterProps {
  /** One column per business unit by default. */
  columns?: FooterColumn[];
  legalLinks?: { label: string; href: string }[];
  className?: string;
}

const BUSINESS_UNITS = [
  { name: "Comercial", slug: "comercial" },
  { name: "Industrial", slug: "industrial" },
  { name: "Vivienda", slug: "vivienda" },
  { name: "Forestal", slug: "forestal" },
];

const DEFAULT_COLUMNS: FooterColumn[] = BUSINESS_UNITS.map(({ name, slug }) => ({
  title: name,
  links: [
    { label: "Proyectos", href: `/${slug}` },
    { label: "Contacto", href: `/contacto?unidad=${slug}` },
  ],
}));

const DEFAULT_LEGAL_LINKS = [
  { label: "Aviso de privacidad", href: "/aviso-de-privacidad" },
  { label: "Términos", href: "/terminos" },
];

/**
 * Site footer with wordmark, per-unit link columns and legal row. Used once at
 * the bottom of every page.
 */
export function Footer({
  columns = DEFAULT_COLUMNS,
  legalLinks = DEFAULT_LEGAL_LINKS,
  className,
}: FooterProps) {
  const classes = ["altea-footer", className].filter(Boolean).join(" ");
  const year = new Date().getFullYear();

  return (
    <footer className={classes}>
      <div className="altea-footer__top">
        <Link href="/" aria-label="Altea — inicio">
          <Image
            className="altea-footer__logo"
            src="/brand/logos/altea-logo-light.svg"
            alt="Altea"
            width={1632}
            height={324}
            unoptimized
          />
        </Link>
        <div className="altea-footer__columns">
          {columns.map((column) => (
            <div key={column.title} className="altea-footer__column">
              <span className="altea-footer__column-title">{column.title}</span>
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="altea-footer__link"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="altea-footer__legal">
        <span>© {year} Altea. Todos los derechos reservados.</span>
        <div className="altea-footer__legal-links">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="altea-footer__link">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
