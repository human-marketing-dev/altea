/**
 * El Studio de Sanity, en /studio: el mismo proyecto, una sola cosa que
 * desplegar. Toda la configuración está en sanity.config.ts; el componente que
 * la carga es de cliente (ver Studio.tsx).
 *
 * Estática: el Studio es una aplicación de cliente y no necesita servidor por
 * petición.
 */
import { Studio } from "./Studio";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function PaginaStudio() {
  return <Studio />;
}
