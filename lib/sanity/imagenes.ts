import { dataset, projectId } from "@/sanity/env";

/**
 * Las imágenes de Sanity, sin librería: la URL del CDN sale del id del asset.
 *
 *   image-<hash>-<ancho>x<alto>-<formato>  →  https://cdn.sanity.io/images/<proyecto>/<dataset>/<hash>-<ancho>x<alto>.<formato>
 *
 * El ancho y el alto vienen en el propio id, así que la proporción se sabe sin
 * pedir nada más (la usan las tarjetas y el hero para reservar su caja).
 */
export type ImagenSanity = {
  asset?: { _ref?: string };
  hotspot?: { x?: number; y?: number };
  alt?: { es?: string; en?: string };
};

const PATRON = /^image-([a-f0-9]+)-(\d+)x(\d+)-([a-z0-9]+)$/;

export function datosDeImagen(imagen: ImagenSanity | undefined) {
  const m = imagen?.asset?._ref?.match(PATRON);
  if (!m) return null;
  const [, hash, ancho, alto, formato] = m;
  return {
    url: `https://cdn.sanity.io/images/${projectId}/${dataset}/${hash}-${ancho}x${alto}.${formato}`,
    ancho: Number(ancho),
    alto: Number(alto),
    ratio: Number(ancho) / Number(alto),
    /** El punto focal vertical (0 arriba, 1 abajo), si lo marcaron en el Studio. */
    focoY: imagen?.hotspot?.y,
  };
}

/**
 * La URL de la imagen a un ancho máximo, para lo que NO pasa por el optimizador
 * de Next (el fondo del hero de las unidades). Sanity la reduce y la convierte
 * en su CDN; nunca la agranda.
 */
export function urlAncho(url: string, ancho: number, calidad = 85) {
  return `${url}?w=${ancho}&q=${calidad}&fm=webp&fit=max`;
}
