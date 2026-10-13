import { metadataDe, PaginaLegal } from "../_legal/PaginaLegal";
import { AVISO_DE_PRIVACIDAD } from "../_legal/aviso-de-privacidad";

export const metadata = metadataDe(AVISO_DE_PRIVACIDAD);
export default function AvisoDePrivacidad() {
  return <PaginaLegal documento={AVISO_DE_PRIVACIDAD} />;
}
