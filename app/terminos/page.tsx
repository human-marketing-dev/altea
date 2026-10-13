import { metadataDe, PaginaLegal } from "../_legal/PaginaLegal";
import { TERMINOS } from "../_legal/terminos";

export const metadata = metadataDe(TERMINOS);
export default function Terminos() {
  return <PaginaLegal documento={TERMINOS} />;
}
