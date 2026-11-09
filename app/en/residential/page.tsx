import { metadataDe, PaginaUnidad } from "@/app/_unidad/PaginaUnidad";
import { VIVIENDA } from "@/app/_unidad/contenido/en/vivienda";

export const metadata = metadataDe(VIVIENDA, "/vivienda", "en");
export default function ResidentialEn() {
  return <PaginaUnidad contenido={VIVIENDA} idioma="en" />;
}
