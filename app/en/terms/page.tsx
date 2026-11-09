import { metadataDe, PaginaLegal } from "@/app/_legal/PaginaLegal";
import { TERMINOS } from "@/app/_legal/en/terminos";

export const metadata = metadataDe(TERMINOS, "/terminos", "en");
export default function Terms() {
  return <PaginaLegal documento={TERMINOS} idioma="en" />;
}
