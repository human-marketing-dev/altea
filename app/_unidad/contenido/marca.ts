import type { FormaBandera } from "../tipos";

/**
 * LA BANDEROLA: los dos trazos de la marca de Altea, no de Comercial.
 *
 * Comprobado contra los seis logotipos de public/brand/business-units
 * (comercial, industrial y vivienda, en -color y -flat): los dos trazos son
 * IDÉNTICOS en todos, comando por comando; sólo cambia el punto de partida, unos
 * 3 px de desplazamiento por la posición de la palabra. Así que es una sola
 * forma para las cuatro unidades, y lo único que cambia por unidad es el color
 * de la mitad derecha (`hero.color`).
 *
 * ⚠ EL COLOR NO SALE DE ESTOS ARCHIVOS. En los seis la mitad derecha es coral
 * y la izquierda ink, igual para las tres unidades: los logotipos del repo no
 * traen un color por unidad. El color de cada una lo dio Altea y vive en
 * app/ui/tokens.css (--unidad-*).
 *
 * Va montada como máscara (mask-image con este viewBox), no como clip-path: la
 * máscara se estira sola a su caja y la banderola crece con la palabra sin tocar
 * una coordenada. Y la mitad izquierda NO lleva color: recibe la misma foto que
 * las letras, con el mismo encuadre. Ver .gal__izq en unidad.css.
 */
export const BANDERA_ALTEA: FormaBandera = {
  viewBox: "747.9 33.56 48.72 49.75",
  izquierda:
    "M747.9,83.31h18.44c2.95-24.87,1.02-15.65,5.99-49.75-8.25,16.79-16.29,33.17-24.44,49.75Z",
  derecha:
    "M795.12,80.2c-6.35-12.87-12.66-25.76-18.96-38.65-1.21-2.48-2.38-4.98-3.82-7.99-4.97,34.1-3.04,24.87-5.99,49.75h30.27l-1.5-3.11Z",
};
