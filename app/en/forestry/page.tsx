import { metadataDe, PaginaUnidad } from "@/app/_unidad/PaginaUnidad";
import { FORESTAL } from "@/app/_unidad/contenido/en/forestal";

export const metadata = metadataDe(FORESTAL, "/forestal", "en");
export default function ForestryEn() {
  return <PaginaUnidad contenido={FORESTAL} idioma="en" />;
}
