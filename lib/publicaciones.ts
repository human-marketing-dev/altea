/**
 * Últimas publicaciones de Instagram.
 *
 * ⚠ NO ESTÁ CONECTADO A INSTAGRAM. Hoy es una lista estática con imágenes que
 * ya están en el repo, para poder maquetar la sección.
 *
 * Para traerlas de verdad hacen falta dos cosas que no tengo:
 *   1. La cuenta (@handle) de Altea.
 *   2. Credenciales. La Basic Display API está descontinuada; hoy se usa la
 *      Instagram Graph API, que exige cuenta de empresa vinculada a una página
 *      de Facebook, una app de Meta y un token de larga duración. La
 *      alternativa sin desarrollo es un widget de terceros (Behold,
 *      LightWidget, Elfsight), que también pide la cuenta.
 *
 * Cuando exista la fuente, esto se reemplaza por un fetch en el servidor con
 * revalidación; el componente no cambia porque recibe las publicaciones por prop.
 */
export interface Publicacion {
  id: string;
  imagen: string;
  alt: string;
  /** Pie corto, como el primer renglón del caption. */
  texto: string;
  url: string;
}

export const INSTAGRAM_USUARIO = "altea_desarrollos";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_USUARIO}/`;

export const PUBLICACIONES: Publicacion[] = [
  {
    id: "p1",
    imagen: "/images/comercial/galeria/galeria-altea-1.webp",
    alt: "Conjunto comercial de Altea al anochecer",
    texto: "Nuestros espacios comerciales al caer la tarde.",
    url: INSTAGRAM_URL,
  },
  {
    id: "p2",
    imagen: "/images/responsabildiad-social/responsabilidad-social-altea-5.webp",
    alt: "Posada navideña organizada por Altea",
    texto: "Posada con las comunidades vecinas.",
    url: INSTAGRAM_URL,
  },
  {
    id: "p3",
    imagen: "/images/industrial/galeria/galeria-industrial-altea-2.webp",
    alt: "Nave industrial de Altea al atardecer",
    texto: "Infraestructura lista para operar.",
    url: INSTAGRAM_URL,
  },
  {
    id: "p4",
    imagen: "/images/vivienda/amarantha/amarantha-vivienda-altea.webp",
    alt: "Acceso al desarrollo residencial Amarantha",
    texto: "Amarantha, donde comienza tu historia.",
    url: INSTAGRAM_URL,
  },
];
