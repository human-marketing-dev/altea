import { VIVIENDA } from "@/app/_unidad/contenido/en/vivienda";
import { rutaDeUnidad } from "@/app/_unidad/rutaUnidad";

/* El contenido editable viene de Sanity; ver app/_unidad/rutaUnidad.tsx. */
const ruta = rutaDeUnidad("vivienda", "en", VIVIENDA, "/vivienda");
export const generateMetadata = ruta.generateMetadata;
export default ruta.Pagina;
