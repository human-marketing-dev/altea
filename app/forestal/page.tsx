import { FORESTAL } from "@/app/_unidad/contenido/forestal";
import { rutaDeUnidad } from "@/app/_unidad/rutaUnidad";

/* El contenido editable viene de Sanity; ver app/_unidad/rutaUnidad.tsx. */
const ruta = rutaDeUnidad("forestal", "es", FORESTAL, "/forestal");
export const generateMetadata = ruta.generateMetadata;
export default ruta.Pagina;
