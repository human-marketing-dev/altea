import { Pagina404 } from "../_404/Pagina404";

/**
 * La 404 en inglés: toda URL bajo /en que no existe. Llega aquí por el comodín
 * app/en/[...resto], y por eso va dentro del layout de /en, con su `lang`. Sobre el
 * título de la pestaña, ver el comodín.
 */
export default function NotFoundEn() {
  return <Pagina404 idioma="en" />;
}
