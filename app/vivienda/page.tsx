import { metadataDe, PaginaUnidad } from "../_unidad/PaginaUnidad";
import { VIVIENDA } from "../_unidad/contenido/vivienda";

export const metadata = metadataDe(VIVIENDA);
export default function Vivienda() {
  return <PaginaUnidad contenido={VIVIENDA} />;
}
