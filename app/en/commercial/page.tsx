import { metadataDe, PaginaUnidad } from "@/app/_unidad/PaginaUnidad";
import { COMERCIAL } from "@/app/_unidad/contenido/en/comercial";

export const metadata = metadataDe(COMERCIAL, "/comercial", "en");
export default function CommercialEn() {
  return <PaginaUnidad contenido={COMERCIAL} idioma="en" />;
}
