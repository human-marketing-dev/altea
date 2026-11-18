import { FORESTAL } from "@/app/_unidad/contenido/en/forestal";
import { rutaDeUnidad } from "@/app/_unidad/rutaUnidad";

/* El contenido editable viene de Sanity; ver app/_unidad/rutaUnidad.tsx. */
const ruta = rutaDeUnidad("forestal", "en", FORESTAL, "/forestal");
export const generateMetadata = ruta.generateMetadata;
export default ruta.Pagina;
