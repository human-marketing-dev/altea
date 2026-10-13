import { metadataDe, PaginaUnidad } from "../_unidad/PaginaUnidad";
import { INDUSTRIAL } from "../_unidad/contenido/industrial";

export const metadata = metadataDe(INDUSTRIAL);
export default function Industrial() {
  return <PaginaUnidad contenido={INDUSTRIAL} />;
}
