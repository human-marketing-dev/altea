import { metadataDe, PaginaLegal } from "@/app/_legal/PaginaLegal";
import { AVISO_DE_PRIVACIDAD } from "@/app/_legal/en/aviso-de-privacidad";

export const metadata = metadataDe(AVISO_DE_PRIVACIDAD, "/aviso-de-privacidad", "en");
export default function PrivacyNotice() {
  return <PaginaLegal documento={AVISO_DE_PRIVACIDAD} idioma="en" />;
}
