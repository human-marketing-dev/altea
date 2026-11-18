import { AVISO_DE_PRIVACIDAD } from "@/app/_legal/aviso-de-privacidad";
import { metadataDe, PaginaLegal } from "@/app/_legal/PaginaLegal";
import { documentoLegal } from "@/lib/sanity/legal";

/* El texto viene de Sanity (un documento por idioma); el del código es respaldo campo por campo. */
const documento = () => documentoLegal("aviso", "es", AVISO_DE_PRIVACIDAD);
export const generateMetadata = async () => metadataDe(await documento(), "/aviso-de-privacidad", "es");
export default async function Pagina() {
  return <PaginaLegal documento={await documento()} idioma="es" />;
}
