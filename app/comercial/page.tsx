import { metadataDe, PaginaUnidad } from "../_unidad/PaginaUnidad";
import { COMERCIAL } from "../_unidad/contenido/comercial";

export const metadata = metadataDe(COMERCIAL);
export default function Comercial() {
  return <PaginaUnidad contenido={COMERCIAL} />;
}
