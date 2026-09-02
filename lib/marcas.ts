/**
 * Marcas que operan en los desarrollos de Altea.
 *
 * Son de terceros: inquilinos y ocupantes, no clientes en el sentido que se lee
 * a primera vista. De ahí el encabezado de la sección.
 *
 * ⚠ PENDIENTE LEGAL: usar marcas ajenas implica endoso. Normalmente lo cubre el
 * contrato de arrendamiento, pero hay que confirmarlo antes de publicar.
 *
 * De los 40 archivos disponibles se eligieron 16, los más reconocibles y con
 * mezcla de retail e industrial para que se lea la amplitud del portafolio.
 */
export interface Marca {
  nombre: string;
  src: string;
}

const RETAIL = "/images/comercial/logos-marcas";
const INDUSTRIAL = "/images/industrial/logo-marcas";

export const MARCAS: Marca[] = [
  { nombre: "Walmart", src: `${RETAIL}/walmart-logo-black.webp` },
  { nombre: "Liverpool", src: `${RETAIL}/liverpool-logo-black.webp` },
  { nombre: "Cinépolis", src: `${RETAIL}/cinepolis-logo-black.webp` },
  { nombre: "H&M", src: `${RETAIL}/h-and-m-logo-black.webp` },
  { nombre: "Sephora", src: `${RETAIL}/sephora-logo-black.webp` },
  { nombre: "Bershka", src: `${RETAIL}/bershka-logo-black.webp` },
  { nombre: "Pull&Bear", src: `${RETAIL}/pull-and-bear-logo-black.webp` },
  { nombre: "Calvin Klein", src: `${RETAIL}/calvin-klein-logo-black.webp` },
  { nombre: "Suburbia", src: `${RETAIL}/suburbia-logo-black.webp` },
  { nombre: "Bodega Aurrera", src: `${RETAIL}/bodega-aurrera-logo-black.webp` },
  { nombre: "KFC", src: `${RETAIL}/kfc-logo-black.webp` },
  { nombre: "Banorte", src: `${RETAIL}/banorte-logo-black.webp` },
  { nombre: "Mazda", src: `${INDUSTRIAL}/mazda-logo-black.webp` },
  { nombre: "CEVA Logistics", src: `${INDUSTRIAL}/ceva-logistics-logo-black.webp` },
  { nombre: "Viakable", src: `${INDUSTRIAL}/viakable-logo-black.webp` },
  { nombre: "Güntner", src: `${INDUSTRIAL}/guntner-logo-black.webp` },
];
