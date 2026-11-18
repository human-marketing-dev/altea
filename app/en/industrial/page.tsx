import { INDUSTRIAL } from "@/app/_unidad/contenido/en/industrial";
import { rutaDeUnidad } from "@/app/_unidad/rutaUnidad";

/* El contenido editable viene de Sanity; ver app/_unidad/rutaUnidad.tsx. */
const ruta = rutaDeUnidad("industrial", "en", INDUSTRIAL, "/industrial");
export const generateMetadata = ruta.generateMetadata;
export default ruta.Pagina;
