import type { Metadata } from "next";
import type { Idioma } from "@/lib/idioma";
import { contenidoUnidad, type ClaveUnidad } from "@/lib/sanity/unidad";
import { metadataDe, PaginaUnidad } from "./PaginaUnidad";
import type { ContenidoUnidad } from "./tipos";

/**
 * LA RUTA DE UNA UNIDAD, CON SU CONTENIDO DE SANITY (noviembre de 2026).
 *
 * Las ocho páginas de unidad —cuatro por idioma— son esto con otros datos:
 *
 *   const ruta = rutaDeUnidad("comercial", "es", COMERCIAL, "/comercial");
 *   export const generateMetadata = ruta.generateMetadata;
 *   export default ruta.Pagina;
 *
 * `base` es el contenido del código (contenido/<unidad>.ts o su versión en
 * inglés): pone lo que no se edita en Sanity y sirve de respaldo campo por
 * campo. Ver lib/sanity/unidad.ts.
 *
 * Las dos llamadas a Sanity —la de los metadatos y la de la página— son la
 * misma consulta: Next la hace una sola vez por armado.
 */
export function rutaDeUnidad(
  clave: ClaveUnidad,
  idioma: Idioma,
  base: ContenidoUnidad,
  caminoEs: string,
) {
  const contenido = () => contenidoUnidad(clave, idioma, base);
  return {
    generateMetadata: async (): Promise<Metadata> => metadataDe(await contenido(), caminoEs, idioma),
    Pagina: async function Pagina() {
      return <PaginaUnidad contenido={await contenido()} idioma={idioma} />;
    },
  };
}
