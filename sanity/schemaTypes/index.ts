import { giro } from "./giro";
import { objetos } from "./objetos";
import {
  ajustesSitio,
  cierre,
  cifraHome,
  cifraHuella,
  documentoLegal,
  lineasHome1,
  lineasHome2,
  lineasNos1,
  lineasNos2,
  lineasNos3,
  paginaContacto,
  paginaInicio,
  paginaNosotros,
  presencia,
} from "./paginas";
import { proyecto } from "./proyecto";
import { cifraUnidad, unidad } from "./unidad";

export const schemaTypes = [
  /* documentos */
  paginaInicio,
  paginaNosotros,
  paginaContacto,
  unidad,
  documentoLegal,
  presencia,
  cierre,
  ajustesSitio,
  proyecto,
  giro,
  /* piezas */
  ...objetos,
  ...lineasHome1,
  ...lineasHome2,
  ...lineasNos1,
  ...lineasNos2,
  ...lineasNos3,
  cifraHome,
  cifraHuella,
  cifraUnidad,
];

/**
 * LOS DOCUMENTOS ÚNICOS, con su id fijo. Uno de cada uno: no se crean ni se
 * borran desde el Studio, se abren directo desde la navegación.
 */
export const UNICOS: { id: string; tipo: string; titulo: string }[] = [
  { id: "paginaInicio", tipo: "paginaInicio", titulo: "Inicio" },
  { id: "paginaNosotros", tipo: "paginaNosotros", titulo: "Nosotros" },
  { id: "paginaContacto", tipo: "paginaContacto", titulo: "Contacto" },
  { id: "unidad-comercial", tipo: "unidad", titulo: "Comercial" },
  { id: "unidad-industrial", tipo: "unidad", titulo: "Industrial" },
  { id: "unidad-vivienda", tipo: "unidad", titulo: "Vivienda" },
  { id: "unidad-forestal", tipo: "unidad", titulo: "Forestal" },
  { id: "legal-aviso", tipo: "documentoLegal", titulo: "Aviso de privacidad" },
  { id: "legal-aviso-en", tipo: "documentoLegal", titulo: "Privacy notice (English)" },
  { id: "legal-terminos", tipo: "documentoLegal", titulo: "Términos y condiciones" },
  { id: "legal-terminos-en", tipo: "documentoLegal", titulo: "Terms and conditions (English)" },
  { id: "presencia", tipo: "presencia", titulo: "Presencia (mapa)" },
  { id: "cierre", tipo: "cierre", titulo: "Cierre de las páginas" },
  { id: "ajustesSitio", tipo: "ajustesSitio", titulo: "Datos de contacto y del sitio" },
];

/** Los tipos que sólo existen como documento único. */
export const TIPOS_UNICOS = new Set(UNICOS.map((u) => u.tipo));
