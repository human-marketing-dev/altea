import Image from "next/image";
import Link from "next/link";
import { CANALES, enlaceWhatsApp } from "@/lib/contacto";

export interface FooterColumn {
  title: string;
  links: { label: string; href: string; externo?: boolean }[];
}

export interface FooterProps {
  /** Párrafo corto bajo el wordmark. */
  description?: string;
  columns?: FooterColumn[];
  legalLinks?: { label: string; href: string }[];
  className?: string;
}

/** PENDIENTE: descripción sin confirmar por Altea. */
const DESCRIPCION =
  "Inmobiliaria con sólida experiencia y una vasta reserva territorial. Diseñamos y ejecutamos proyectos comerciales, industriales, de vivienda y forestales a la medida de cada necesidad.";

/**
 * Tres columnas con contenido distinto cada una. La versión anterior repetía
 * "Proyectos / Contacto" bajo las cuatro unidades: cuatro columnas para dos
 * links únicos.
 */
const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Unidades de negocio",
    links: [
      { label: "Comercial", href: "/comercial" },
      { label: "Industrial", href: "/industrial" },
      { label: "Vivienda", href: "/vivienda" },
      { label: "Forestal", href: "/forestal" },
    ],
  },
  {
    title: "Altea",
    links: [
      { label: "Inicio", href: "/" },
      { label: "Nosotros", href: "/nosotros" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    title: "Contacto",
    links: [
      { label: CANALES.correo, href: `mailto:${CANALES.correo}` },
      { label: CANALES.telefono, href: `tel:${CANALES.telefono.replace(/\s/g, "")}` },
      { label: "WhatsApp", href: enlaceWhatsApp(), externo: true },
    ],
  },
];

const DEFAULT_LEGAL_LINKS = [
  { label: "Aviso de privacidad", href: "/aviso-de-privacidad" },
  { label: "Términos", href: "/terminos" },
];

/** Pie de sitio: marca y descripción a la izquierda, navegación a la derecha. */
export function Footer({
  description = DESCRIPCION,
  columns = DEFAULT_COLUMNS,
  legalLinks = DEFAULT_LEGAL_LINKS,
  className,
}: FooterProps) {
  const classes = ["altea-footer", className].filter(Boolean).join(" ");
  const year = new Date().getFullYear();

  return (
    <footer className={classes}>
      <div className="altea-footer__top">
        <div className="altea-footer__marca">
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
          {description && <p className="altea-footer__descripcion">{description}</p>}
        </div>

        <div className="altea-footer__columns">
          {columns.map((column) => (
            <div key={column.title} className="altea-footer__column">
              <span className="altea-footer__column-title">{column.title}</span>
              {column.links.map((link) =>
                link.externo ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="altea-footer__link"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className="altea-footer__link">
                    {link.label}
                  </Link>
                ),
              )}
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
