import { metadataDe, PaginaUnidad } from "../_unidad/PaginaUnidad";
import { FORESTAL } from "../_unidad/contenido/forestal";

export const metadata = metadataDe(FORESTAL);
export default function Forestal() {
  return <PaginaUnidad contenido={FORESTAL} />;
}
