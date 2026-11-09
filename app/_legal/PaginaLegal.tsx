import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { Footer } from "@/app/ui/Footer";
import { NavBar } from "@/app/ui/NavBar";
import { SectionHeading } from "@/app/ui/SectionHeading";
import { metadatosDe, rutaDe, type Idioma } from "@/lib/idioma";
import type { Bloque, DocumentoLegal } from "./tipos";
import "./legal.css";

/**
 * Página de un documento legal: aviso de privacidad y términos y condiciones.
 *
 * La cabecera es la de /contacto —la misma <SectionHeading> sobre ink— y el
 * cuerpo una columna de lectura con los tamaños que el sitio ya tiene
 * (--text-titulo-bloque para las secciones, --text-titulo-ficha para los
 * apartados, --text-body con --leading-body para el texto). No estrena ningún
 * escalón tipográfico.
 */
export function PaginaLegal({
  documento,
  idioma = "es",
}: {
  documento: DocumentoLegal;
  /** El de la página: los enlaces internos del texto llevan a su versión. */
  idioma?: Idioma;
}) {
  return (
    <>
      <NavBar tone="light" />
      <main>
        <section className="bg-ink px-(--container-pad) py-(--space-9)">
          <SectionHeading
            as="h1"
            tone="light"
            title={documento.titulo}
            description={documento.bajada}
          />
        </section>

        <article className="leg">
          <div className="leg__cuerpo">
            {documento.intro && <Bloques bloques={documento.intro} idioma={idioma} />}
            {documento.secciones.map((seccion) => (
              <section className="leg__seccion" key={seccion.titulo}>
                <h2 className="leg__titulo">{seccion.titulo}</h2>
                <Bloques bloques={seccion.bloques} idioma={idioma} />
              </section>
            ))}
            {documento.cierre && (
              <div className="leg__cierre">
                <Bloques bloques={documento.cierre} idioma={idioma} />
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer idioma={idioma} />
    </>
  );
}

/** Con la canónica, los `hreflang` y la vista previa. Ver lib/idioma.ts. */
export const metadataDe = (
  documento: DocumentoLegal,
  caminoEs: string,
  idioma: Idioma = "es",
): Metadata => metadatosDe(caminoEs, idioma, documento.metadata);

function Bloques({ bloques, idioma }: { bloques: Bloque[]; idioma: Idioma }) {
  return bloques.map((bloque, i) => {
    if (bloque.tipo === "lista")
      return (
        <ul className="leg__lista" key={i}>
          {bloque.items.map((item) => (
            <li key={item}>{enLinea(item, idioma)}</li>
          ))}
        </ul>
      );
    if (bloque.tipo === "subtitulo")
      return (
        <h3 className="leg__subtitulo" key={i}>
          {enLinea(bloque.texto, idioma)}
        </h3>
      );
    return <p key={i}>{enLinea(bloque.texto, idioma)}</p>;
  });
}

/** `**negrita**`, `[texto](url)` y saltos de línea. Ver tipos.ts. */
function enLinea(texto: string, idioma: Idioma): ReactNode {
  const lineas = texto.split("\n");
  return lineas.map((linea, n) => (
    <Fragment key={n}>
      {n > 0 && <br />}
      {trozos(linea, idioma)}
    </Fragment>
  ));
}

function trozos(linea: string, idioma: Idioma): ReactNode[] {
  const out: ReactNode[] = [];
  const patron = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let ultimo = 0;
  for (const m of linea.matchAll(patron)) {
    const i = m.index ?? 0;
    if (i > ultimo) out.push(linea.slice(ultimo, i));
    if (m[1] !== undefined) {
      out.push(<strong key={i}>{trozos(m[1], idioma)}</strong>);
    } else {
      const [, , etiqueta, url] = m;
      out.push(
        url.startsWith("/") ? (
          <Link key={i} href={rutaDe(url, idioma)}>
            {etiqueta}
          </Link>
        ) : (
          <a
            key={i}
            href={url}
            {...(url.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {etiqueta}
          </a>
        ),
      );
    }
    ultimo = i + m[0].length;
  }
  if (ultimo < linea.length) out.push(linea.slice(ultimo));
  return out;
}
