import Image from "next/image";
import Link from "next/link";
import { CANALES, MENSAJE_WHATSAPP, REDES, enlaceWhatsApp } from "@/lib/contacto";
import { rutaDe, type Idioma } from "@/lib/idioma";
import { textos } from "./textos";
import { ICONOS, ICONOS_RED, type NombreIcono } from "./Iconos";

export interface FooterLink {
  label: string;
  /** Sin `href` la fila es texto, no enlace. */
  href?: string;
  externo?: boolean;
  icono?: NombreIcono;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  /** Párrafo corto bajo el wordmark. */
  /**
   * Altea retiró la descripción del pie: hoy nadie la pasa y la columna se
   * queda sólo con el logotipo. La prop y su <p> siguen porque no estorban y
   * devolver el texto es una línea; si se decide que no vuelve, se van las dos
   * y con ellas .altea-footer__descripcion.
   */
  description?: string;
  columns?: FooterColumn[];
  legalLinks?: { label: string; href: string }[];
  /** El idioma de la página. Es componente de servidor: no lee la URL. */
  idioma?: Idioma;
  className?: string;
}

/**
 * Tres columnas con contenido distinto cada una. La versión anterior repetía
 * "Proyectos / Contacto" bajo las cuatro unidades: cuatro columnas para dos
 * links únicos. En el idioma de la página (noviembre de 2026).
 */
const columnasDe = (idioma: Idioma): FooterColumn[] => {
  const t = textos(idioma);
  return [
    {
      title: t.footer.unidades,
      links: [
        { label: t.nav.comercial, href: rutaDe("/comercial", idioma) },
        { label: t.nav.industrial, href: rutaDe("/industrial", idioma) },
        { label: t.nav.vivienda, href: rutaDe("/vivienda", idioma) },
        { label: t.nav.forestal, href: rutaDe("/forestal", idioma) },
      ],
    },
    {
      title: t.footer.altea,
      links: [
        { label: t.nav.inicio, href: rutaDe("/", idioma) },
        { label: t.nav.nosotros, href: rutaDe("/nosotros", idioma) },
        { label: t.nav.contacto, href: rutaDe("/contacto", idioma) },
      ],
    },
    {
      title: t.footer.contacto,
      links: [
        { label: CANALES.correo, href: `mailto:${CANALES.correo}`, icono: "correo" },
        { label: CANALES.telefono, href: `tel:${CANALES.telefono.replace(/\s/g, "")}`, icono: "telefono" },
        {
          label: t.footer.whatsapp,
          href: enlaceWhatsApp(MENSAJE_WHATSAPP[idioma]),
          externo: true,
          icono: "whatsapp",
        },
        /* El domicilio no se traduce: es una dirección postal. */
        { label: CANALES.domicilio, href: CANALES.mapa, externo: true, icono: "ubicacion" },
      ],
    },
  ];
};

const legalesDe = (idioma: Idioma) => [
  { label: textos(idioma).footer.aviso, href: rutaDe("/aviso-de-privacidad", idioma) },
  { label: textos(idioma).footer.terminos, href: rutaDe("/terminos", idioma) },
];

/** Pie de sitio: marca y descripción a la izquierda, navegación a la derecha. */
export function Footer({
  description,
  columns,
  legalLinks,
  idioma = "es",
  className,
}: FooterProps) {
  const columnas = columns ?? columnasDe(idioma);
  const legales = legalLinks ?? legalesDe(idioma);
  const classes = ["altea-footer", className].filter(Boolean).join(" ");
  const year = new Date().getFullYear();

  return (
    <footer className={classes}>
      <div className="altea-footer__top">
        <div className="altea-footer__marca">
          <Link href={rutaDe("/", idioma)} aria-label={textos(idioma).nav.marcaInicio}>
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

          {/* Fila propia: las redes son navegación, no datos de contacto. */}
          {REDES.length > 0 && (
            <ul className="altea-footer__redes">
              {REDES.map((red) => (
                <li key={red.nombre}>
                  <a
                    className="altea-footer__red"
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* El icono ES el contenido del enlace, así que no va
                        `aria-hidden`: el nombre de la red lo pone el aria-label
                        y es lo único que tiene que anunciar el lector. */}
                    <span aria-hidden="true">{ICONOS_RED[red.icono]}</span>
                    <span className="sr-only">{red.nombre}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="altea-footer__columns">
          {columnas.map((column) => (
            <div key={column.title} className="altea-footer__column">
              <span className="altea-footer__column-title">{column.title}</span>
              {column.links.map((link) => {
                const contenido = (
                  <>
                    {link.icono && (
                      <span className="altea-footer__icono">{ICONOS[link.icono]}</span>
                    )}
                    <span>{link.label}</span>
                  </>
                );
                const clase = link.icono
                  ? "altea-footer__link altea-footer__link--con-icono"
                  : "altea-footer__link";

                if (!link.href) {
                  return (
                    <span key={link.label} className={clase}>
                      {contenido}
                    </span>
                  );
                }
                return link.externo ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clase}
                  >
                    {contenido}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className={clase}>
                    {contenido}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="altea-footer__legal">
        <span>© {year} Altea. {textos(idioma).footer.derechos}</span>
        <div className="altea-footer__legal-links">
          {legales.map((link) => (
            <Link key={link.href} href={link.href} className="altea-footer__link">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
