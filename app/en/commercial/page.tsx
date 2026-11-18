import { COMERCIAL } from "@/app/_unidad/contenido/en/comercial";
import { rutaDeUnidad } from "@/app/_unidad/rutaUnidad";

/* El contenido editable viene de Sanity; ver app/_unidad/rutaUnidad.tsx. */
const ruta = rutaDeUnidad("comercial", "en", COMERCIAL, "/comercial");
export const generateMetadata = ruta.generateMetadata;
export default ruta.Pagina;
