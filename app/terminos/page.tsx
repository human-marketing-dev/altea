import { metadataDe, PaginaLegal } from "../_legal/PaginaLegal";
import { TERMINOS } from "../_legal/terminos";

export const metadata = metadataDe(TERMINOS, "/terminos");
export default function Terminos() {
  return <PaginaLegal documento={TERMINOS} />;
}
