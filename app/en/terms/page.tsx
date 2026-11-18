import { TERMINOS } from "@/app/_legal/en/terminos";
import { metadataDe, PaginaLegal } from "@/app/_legal/PaginaLegal";
import { documentoLegal } from "@/lib/sanity/legal";

/* El texto viene de Sanity (un documento por idioma); el del código es respaldo campo por campo. */
const documento = () => documentoLegal("terminos", "en", TERMINOS);
export const generateMetadata = async () => metadataDe(await documento(), "/terminos", "en");
export default async function Pagina() {
  return <PaginaLegal documento={await documento()} idioma="en" />;
}
