#!/usr/bin/env node
/**
 * Comprueba que los escalones de la escala de títulos no se cruzan.
 *
 *   npm run verificar:escala
 *
 * Lee los tokens de app/globals.css, los resuelve píxel a píxel entre 280 y
 * 2560 px de ventana y falla si en algún ancho un escalón deja de ser mayor que
 * el de abajo. Imprime además la separación mínima entre vecinos.
 *
 * POR QUÉ BASTA CON ESTO. clamp(a, b, c) es la mediana de sus tres argumentos,
 * y la mediana es monótona en cada uno: si el escalón de arriba gana al de abajo
 * en mínimo, en pendiente y en máximo, lo gana a cualquier ancho. El script
 * comprueba las dos cosas —los tres términos y el barrido—, porque la primera
 * explica el fallo y la segunda lo demuestra.
 *
 * Sólo los títulos. Las cifras (--text-cifra*) son otro sistema y pueden ser
 * más grandes que el h1 a propósito: ver la nota en app/globals.css.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ESCALONES = [
  "titulo-pagina",
  "titulo-seccion",
  "titulo-bloque",
  "titulo-ficha",
  "rotulo",
];
const REM = 16;
const DESDE = 280;
const HASTA = 2560;
/* Por debajo de esta razón dos escalones vecinos ya no se leen distintos. */
const SEPARACION_MINIMA = 1.15;

const css = readFileSync(
  fileURLToPath(new URL("../app/globals.css", import.meta.url)),
  "utf8",
);

const aPx = (valor) => {
  const m = valor.trim().match(/^(-?[\d.]+)(rem|px)$/);
  if (!m) throw new Error(`No sé leer «${valor}»`);
  return m[2] === "rem" ? Number(m[1]) * REM : Number(m[1]);
};

/** clamp(min, A vw + B rem, max) → { min, vw, base, max } en px. */
const leer = (nombre) => {
  const m = css.match(new RegExp(`--text-${nombre}:\\s*clamp\\(([^;]+)\\);`));
  if (!m) throw new Error(`No encuentro --text-${nombre} en app/globals.css`);
  const [min, medio, max] = m[1].split(",").map((s) => s.trim());
  const t = medio.match(/^(-?[\d.]+)vw\s*([+-])\s*([\d.]+(?:rem|px))$/);
  if (!t)
    throw new Error(
      `--text-${nombre}: el término central tiene que ser «A vw + B rem», y es «${medio}»`,
    );
  return {
    nombre,
    min: aPx(min),
    vw: Number(t[1]),
    base: (t[2] === "-" ? -1 : 1) * aPx(t[3]),
    max: aPx(max),
  };
};

const resolver = (e, ancho) =>
  Math.min(e.max, Math.max(e.min, (e.vw * ancho) / 100 + e.base));

const escala = ESCALONES.map(leer);
const fallos = [];

for (let i = 0; i < escala.length - 1; i++) {
  const arriba = escala[i];
  const abajo = escala[i + 1];

  /* Los tres términos. */
  for (const termino of ["min", "vw", "max"]) {
    if (!(arriba[termino] > abajo[termino])) {
      fallos.push(
        `${arriba.nombre} no gana a ${abajo.nombre} en ${termino}: ` +
          `${arriba[termino]} contra ${abajo[termino]}`,
      );
    }
  }

  /* El barrido. */
  let peor = { razon: Infinity, ancho: 0 };
  for (let ancho = DESDE; ancho <= HASTA; ancho++) {
    const razon = resolver(arriba, ancho) / resolver(abajo, ancho);
    if (razon < peor.razon) peor = { razon, ancho };
    if (razon <= 1) {
      fallos.push(
        `${arriba.nombre} y ${abajo.nombre} se cruzan a ${ancho} px: ` +
          `${resolver(arriba, ancho).toFixed(1)} contra ${resolver(abajo, ancho).toFixed(1)}`,
      );
      break;
    }
  }
  if (peor.razon < SEPARACION_MINIMA && peor.razon > 1) {
    fallos.push(
      `${arriba.nombre} y ${abajo.nombre} quedan a ${peor.razon.toFixed(3)}× a ` +
        `${peor.ancho} px: por debajo de ${SEPARACION_MINIMA}× no se leen distintos`,
    );
  }
  console.log(
    `${arriba.nombre.padEnd(15)} > ${abajo.nombre.padEnd(15)} ` +
      `mínimo ${peor.razon.toFixed(3)}× a ${peor.ancho} px`,
  );
}

console.log("");
console.log(
  "                 " +
    [390, 768, 1024, 1440, 1920].map((a) => String(a).padStart(6)).join(""),
);
for (const e of escala) {
  console.log(
    e.nombre.padEnd(17) +
      [390, 768, 1024, 1440, 1920]
        .map((a) => resolver(e, a).toFixed(1).padStart(6))
        .join(""),
  );
}

if (fallos.length) {
  console.error("\n✗ La escala no es un sistema:");
  for (const f of fallos) console.error("  · " + f);
  process.exit(1);
}
console.log(`\n✓ ${escala.length} escalones, 0 cruces entre ${DESDE} y ${HASTA} px.`);
