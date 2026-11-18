import { INDUSTRIAL } from "@/app/_unidad/contenido/industrial";
import { rutaDeUnidad } from "@/app/_unidad/rutaUnidad";

/* El contenido editable viene de Sanity; ver app/_unidad/rutaUnidad.tsx. */
const ruta = rutaDeUnidad("industrial", "es", INDUSTRIAL, "/industrial");
export const generateMetadata = ruta.generateMetadata;
export default ruta.Pagina;
