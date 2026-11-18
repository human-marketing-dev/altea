import type { Bloque, DocumentoLegal } from "@/app/_legal/tipos";
import type { Idioma } from "@/lib/idioma";
import { consultar } from "./cliente";

/**
 * UN DOCUMENTO LEGAL DESDE SANITY (noviembre de 2026).
 *
 * En Sanity el texto es Portable Text (párrafos, subtítulos, listas, negritas y
 * enlaces: el tipo `textoLegal`). PaginaLegal.tsx pinta otro formato, el de
 * app/_legal/tipos.ts: bloques con `**negrita**` y `[texto](url)`. Aquí se pasa
 * de uno a otro, así el componente no cambia y se ve igual que antes.
 *
 * Un documento por idioma: `legal-aviso` y `legal-aviso-en`, etc.
 */

type Span = { _type: "span"; text?: string; marks?: string[] };
type MarkDef = { _key: string; _type: string; href?: string };
type BloquePT = {
  _type: "block";
  style?: string;
  listItem?: string;
  children?: Span[];
  markDefs?: MarkDef[];
};

type LegalSanity = {
  titulo?: string;
  bajada?: string;
  intro?: BloquePT[];
  secciones?: { titulo?: string; cuerpo?: BloquePT[] }[];
  cierre?: BloquePT[];
  metaTitulo?: string;
  metaDescripcion?: string;
};

/** El texto de un bloque con sus negritas y enlaces en el formato de PaginaLegal. */
function enMarcado(b: BloquePT): string {
  const enlaces = new Map((b.markDefs ?? []).filter((m) => m._type === "link").map((m) => [m._key, m.href ?? ""]));
  return (b.children ?? [])
    .map((s) => {
      let texto = s.text ?? "";
      const marcas = s.marks ?? [];
      const enlace = marcas.find((m) => enlaces.has(m));
      if (enlace && texto) texto = `[${texto}](${enlaces.get(enlace)})`;
      if (marcas.includes("strong") && texto) texto = `**${texto}**`;
      return texto;
    })
    .join("");
}

/** Portable Text → bloques de PaginaLegal; los ítems seguidos de lista van juntos. */
function aBloques(pt: BloquePT[] | undefined): Bloque[] {
  const out: Bloque[] = [];
  for (const b of pt ?? []) {
    if (b._type !== "block") continue;
    const texto = enMarcado(b);
    if (b.listItem) {
      const anterior = out.at(-1);
      if (anterior?.tipo === "lista") anterior.items.push(texto);
      else out.push({ tipo: "lista", items: [texto] });
    } else if (b.style === "h3") out.push({ tipo: "subtitulo", texto });
    else out.push({ tipo: "p", texto });
  }
  return out;
}

export type ClaveLegal = "aviso" | "terminos";

export async function documentoLegal(
  clave: ClaveLegal,
  idioma: Idioma,
  base: DocumentoLegal,
): Promise<DocumentoLegal> {
  const id = `legal-${clave}${idioma === "en" ? "-en" : ""}`;
  const d = await consultar<LegalSanity | null>(`*[_id == $id][0]`, { id });
  if (!d) throw new Error(`Sanity no tiene el documento ${id}.`);
  const intro = aBloques(d.intro);
  const cierre = aBloques(d.cierre);
  return {
    metadata: {
      title: d.metaTitulo || base.metadata.title,
      description: d.metaDescripcion || base.metadata.description,
    },
    titulo: d.titulo || base.titulo,
    bajada: d.bajada || base.bajada,
    intro: intro.length ? intro : base.intro,
    secciones: d.secciones?.length
      ? d.secciones.map((s) => ({ titulo: s.titulo ?? "", bloques: aBloques(s.cuerpo) }))
      : base.secciones,
    cierre: cierre.length ? cierre : base.cierre,
  };
}
