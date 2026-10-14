import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { Footer, NavBar, SectionHeading } from "@/app/ui";
import { ruta } from "@/lib/rutas";
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
export function PaginaLegal({ documento }: { documento: DocumentoLegal }) {
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
            {documento.intro && <Bloques bloques={documento.intro} />}
            {documento.secciones.map((seccion) => (
              <section className="leg__seccion" key={seccion.titulo}>
                <h2 className="leg__titulo">{seccion.titulo}</h2>
                <Bloques bloques={seccion.bloques} />
              </section>
            ))}
            {documento.cierre && (
              <div className="leg__cierre">
                <Bloques bloques={documento.cierre} />
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

export const metadataDe = (documento: DocumentoLegal): Metadata =>
  documento.metadata;

function Bloques({ bloques }: { bloques: Bloque[] }) {
  return bloques.map((bloque, i) => {
    if (bloque.tipo === "lista")
      return (
        <ul className="leg__lista" key={i}>
          {bloque.items.map((item) => (
            <li key={item}>{enLinea(item)}</li>
          ))}
        </ul>
      );
    if (bloque.tipo === "subtitulo")
      return (
        <h3 className="leg__subtitulo" key={i}>
          {enLinea(bloque.texto)}
        </h3>
      );
    return <p key={i}>{enLinea(bloque.texto)}</p>;
  });
}

/** `**negrita**`, `[texto](url)` y saltos de línea. Ver tipos.ts. */
function enLinea(texto: string): ReactNode {
  const lineas = texto.split("\n");
  return lineas.map((linea, n) => (
    <Fragment key={n}>
      {n > 0 && <br />}
      {trozos(linea)}
    </Fragment>
  ));
}

function trozos(linea: string): ReactNode[] {
  const out: ReactNode[] = [];
  const patron = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let ultimo = 0;
  for (const m of linea.matchAll(patron)) {
    const i = m.index ?? 0;
    if (i > ultimo) out.push(linea.slice(ultimo, i));
    if (m[1] !== undefined) {
      out.push(<strong key={i}>{trozos(m[1])}</strong>);
    } else {
      const [, , etiqueta, url] = m;
      out.push(
        url.startsWith("/") ? (
          <Link key={i} href={ruta(url)}>
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
