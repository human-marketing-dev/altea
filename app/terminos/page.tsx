import { TERMINOS } from "@/app/_legal/terminos";
import { metadataDe, PaginaLegal } from "@/app/_legal/PaginaLegal";
import { documentoLegal } from "@/lib/sanity/legal";

/* El texto viene de Sanity (un documento por idioma); el del código es respaldo campo por campo. */
const documento = () => documentoLegal("terminos", "es", TERMINOS);
export const generateMetadata = async () => metadataDe(await documento(), "/terminos", "es");
export default async function Pagina() {
  return <PaginaLegal documento={await documento()} idioma="es" />;
}
