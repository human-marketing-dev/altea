import { COMERCIAL } from "@/app/_unidad/contenido/comercial";
import { rutaDeUnidad } from "@/app/_unidad/rutaUnidad";

/* El contenido editable viene de Sanity; ver app/_unidad/rutaUnidad.tsx. */
const ruta = rutaDeUnidad("comercial", "es", COMERCIAL, "/comercial");
export const generateMetadata = ruta.generateMetadata;
export default ruta.Pagina;
