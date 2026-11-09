import { metadataDe, PaginaUnidad } from "@/app/_unidad/PaginaUnidad";
import { INDUSTRIAL } from "@/app/_unidad/contenido/en/industrial";

export const metadata = metadataDe(INDUSTRIAL, "/industrial", "en");
export default function IndustrialEn() {
  return <PaginaUnidad contenido={INDUSTRIAL} idioma="en" />;
}
