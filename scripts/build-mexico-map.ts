/**
 * Genera `lib/mexico-estados.ts` a partir de `data/estados.geojson`.
 *
 *   npm run build:map
 *
 * Se corre una sola vez (o cuando cambie el GeoJSON). Ni d3-geo ni el GeoJSON
 * llegan al bundle del cliente: este script solo escribe un módulo de datos.
 *
 * El GeoJSON ya trae la clave ISO 3166-2:MX en `properties.id`, así que no hay
 * matching por nombre: se lee directo y se valida contra EstadoId.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { geoArea, geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry, Position } from "geojson";
import { ESTADOS as ESTADOS_ACTUALES } from "../lib/mexico-estados";

const ENTRADA = resolve(process.cwd(), "data/estados.geojson");
const SALIDA = resolve(process.cwd(), "lib/mexico-estados.ts");
const ANCHO = 1000;
const ALTO = 620;

/** Contrato de claves: es exactamente el union EstadoId. */
const ESTADOS_ESPERADOS = new Set<string>(ESTADOS_ACTUALES.map((estado) => estado.id));

/**
 * Sobrescribe el centroide donde el geométrico cae mal (formas irregulares o
 * estados con islas). Vacío por ahora; llenar tras la revisión visual.
 */
const AJUSTES_PIN: Partial<Record<string, [number, number]>> = {};

type PropsEstado = { id?: unknown; name?: unknown };

const MEDIA_ESFERA = 2 * Math.PI;

/**
 * d3-geo es anterior a RFC 7946 y espera el bobinado contrario: exteriores en
 * sentido horario. Con anillos antihorarios (los de RFC 7946, que es lo que
 * traen casi todos los GeoJSON modernos) interpreta cada polígono como "toda la
 * esfera menos esta forma", y entonces fitSize mide el planeta, cada path
 * arrastra el contorno del recorte y todos los centroides caen en el mismo
 * punto.
 *
 * En vez de asumir la convención de origen, se mide: si d3 le ve al polígono
 * más de media esfera, está invertido y se voltean sus anillos. Es idempotente.
 */
function rebobinarAnillos(anillos: Position[][]): Position[][] {
  const area = geoArea({ type: "Polygon", coordinates: anillos });
  return area > MEDIA_ESFERA ? anillos.map((anillo) => [...anillo].reverse()) : anillos;
}

function rebobinarGeometria(geometria: Geometry): Geometry {
  if (geometria.type === "Polygon") {
    return { ...geometria, coordinates: rebobinarAnillos(geometria.coordinates) };
  }
  if (geometria.type === "MultiPolygon") {
    return { ...geometria, coordinates: geometria.coordinates.map(rebobinarAnillos) };
  }
  return geometria;
}

/** Extrae los pares (x, y) de un atributo `d` para medir su bounding box. */
function puntosDePath(d: string): [number, number][] {
  const numeros = d.match(/-?\d+(?:\.\d+)?/g);
  if (!numeros) return [];
  const puntos: [number, number][] = [];
  for (let i = 0; i + 1 < numeros.length; i += 2) {
    puntos.push([Number(numeros[i]), Number(numeros[i + 1])]);
  }
  return puntos;
}

/**
 * geoPath emite coordenadas con precisión flotante completa
 * ("M123.45678901234,456.789..."), y este módulo sí viaja al bundle del cliente.
 * A un viewBox de 1000×620, una décima de píxel ya es invisible, así que
 * redondear ahí recorta el archivo sin que se note en pantalla.
 */
const redondearPath = (d: string) =>
  d.replace(/-?\d+\.\d+/g, (numero) => Number(numero).toFixed(1));

function morir(titulo: string, detalle: string[]): never {
  console.error(`\n✗ ${titulo}\n`);
  for (const linea of detalle) console.error(`    ${linea}`);
  console.error("");
  process.exit(1);
}

function main() {
  if (!existsSync(ENTRADA)) {
    morir(`No existe ${ENTRADA}`, [
      "Descarga un GeoJSON de los 32 estados (revisa la licencia) y simplifícalo:",
      "",
      "  npx mapshaper estados.geojson -simplify 3% keep-shapes \\",
      "    -o precision=0.0001 data/estados.geojson",
    ]);
  }

  const geojson = JSON.parse(readFileSync(ENTRADA, "utf8")) as FeatureCollection<Geometry>;

  if (geojson.type !== "FeatureCollection" || !Array.isArray(geojson.features)) {
    morir("El archivo no es un FeatureCollection de GeoJSON.", [
      `type recibido: ${JSON.stringify(geojson.type)}`,
    ]);
  }

  if (geojson.features.length !== 32) {
    morir("El GeoJSON no trae exactamente 32 entidades.", [
      `features encontrados: ${geojson.features.length}`,
    ]);
  }

  // --- Lectura directa de properties.id / properties.name ---
  const salida: { id: string; nombre: string; d: string; centroide: [number, number] }[] = [];
  const problemas: string[] = [];
  const vistos = new Set<string>();

  // Corrige el bobinado ANTES de proyectar; si no, fitSize mide la esfera.
  let invertidos = 0;
  const features: Feature<Geometry>[] = geojson.features.map((feature) => {
    const geometria = rebobinarGeometria(feature.geometry);
    if (geometria !== feature.geometry) invertidos++;
    return { ...feature, geometry: geometria };
  });
  const coleccion: FeatureCollection<Geometry> = {
    type: "FeatureCollection",
    features,
  };

  // fitSize se ajusta a los 32 estados. Ninguna Sphere participa del ajuste.
  const proyeccion = geoMercator().fitSize([ANCHO, ALTO], coleccion);
  const trazo = geoPath(proyeccion);

  features.forEach((feature, indice) => {
    const props = (feature.properties ?? {}) as PropsEstado;
    const id = props.id;
    const nombre = props.name;

    if (typeof id !== "string" || !id.trim()) {
      problemas.push(`feature #${indice}: properties.id ausente o no es string (${JSON.stringify(id)})`);
      return;
    }
    if (typeof nombre !== "string" || !nombre.trim()) {
      problemas.push(`${id}: properties.name ausente o no es string (${JSON.stringify(nombre)})`);
      return;
    }
    if (vistos.has(id)) {
      problemas.push(`${id}: id duplicado (feature #${indice})`);
      return;
    }
    vistos.add(id);

    const d = trazo(feature);
    if (!d) {
      problemas.push(`${id} (${nombre}): geometría vacía, geoPath no devolvió path`);
      return;
    }

    const [cx, cy] = trazo.centroid(feature);
    if (!Number.isFinite(cx) || !Number.isFinite(cy)) {
      problemas.push(`${id} (${nombre}): centroide no finito [${cx}, ${cy}]`);
      return;
    }

    salida.push({
      id,
      nombre,
      d: redondearPath(d),
      centroide: AJUSTES_PIN[id] ?? [Number(cx.toFixed(1)), Number(cy.toFixed(1))],
    });
  });

  // --- Validación contra EstadoId ---
  const sobran = [...vistos].filter((id) => !ESTADOS_ESPERADOS.has(id)).sort();
  const faltan = [...ESTADOS_ESPERADOS].filter((id) => !vistos.has(id)).sort();

  if (problemas.length || sobran.length || faltan.length) {
    const detalle: string[] = [];
    if (problemas.length) {
      detalle.push("Features con problemas:");
      for (const p of problemas) detalle.push(`  · ${p}`);
      detalle.push("");
    }
    if (sobran.length) {
      detalle.push("Ids en el GeoJSON que no existen en EstadoId:");
      for (const id of sobran) detalle.push(`  · ${id}`);
      detalle.push("");
    }
    if (faltan.length) {
      detalle.push("Ids de EstadoId que no aparecen en el GeoJSON:");
      for (const id of faltan) detalle.push(`  · ${id}`);
      detalle.push("");
    }
    detalle.push("EstadoId se define en lib/mexico-estados.ts. Si el GeoJSON es");
    detalle.push("el correcto, ajusta ese archivo; si no, corrige el GeoJSON.");
    morir("Los ids no cuadran con EstadoId.", detalle);
  }

  // ------------------------------------------------------------------
  // Validaciones de salida. Cada una atrapa un modo de falla que ya ocurrió:
  // la proyección ajustada a la esfera en vez de a México.
  // ------------------------------------------------------------------
  const fallos: string[] = [];

  // 1) Centroides distintos. Si la proyección mide la esfera, los 32 colapsan
  //    al centro del canvas.
  const porCentroide = new Map<string, string[]>();
  for (const estado of salida) {
    const clave = estado.centroide.join(",");
    const lista = porCentroide.get(clave);
    if (lista) lista.push(estado.id);
    else porCentroide.set(clave, [estado.id]);
  }
  const repetidos = [...porCentroide.entries()].filter(([, ids]) => ids.length > 1);
  if (repetidos.length) {
    fallos.push("Centroides duplicados (deben ser 32 valores distintos):");
    for (const [clave, ids] of repetidos) {
      fallos.push(`  · [${clave}] compartido por ${ids.length}: ${ids.join(", ")}`);
    }
    fallos.push("");
  }

  // 2) El dibujo tiene que llenar el canvas. Si México ocupa el 5%, truena.
  const puntos = salida.flatMap((estado) => puntosDePath(estado.d));
  if (!puntos.length) {
    fallos.push("Ningún path contiene coordenadas.", "");
  } else {
    const xs = puntos.map(([x]) => x);
    const ys = puntos.map(([, y]) => y);
    const ancho = Math.max(...xs) - Math.min(...xs);
    const alto = Math.max(...ys) - Math.min(...ys);
    const cobertura = Math.max(ancho / ANCHO, alto / ALTO);
    if (cobertura < 0.9) {
      fallos.push(
        `Los estados cubren solo ${(cobertura * 100).toFixed(1)}% del viewBox ` +
          "(mínimo 90% en alguna dimensión).",
        `  bounding box: ${ancho.toFixed(1)} × ${alto.toFixed(1)} en un canvas de ${ANCHO} × ${ALTO}`,
        "  Síntoma típico de una proyección ajustada a la esfera y no a México.",
        "",
      );
    }
  }

  // 3) Ningún subpath compartido entre estados. El contorno del recorte de la
  //    esfera aparecía idéntico en los 32.
  const porSubpath = new Map<string, Set<string>>();
  for (const estado of salida) {
    for (const trozo of estado.d.split("M").filter(Boolean)) {
      const clave = `M${trozo}`;
      const duenos = porSubpath.get(clave);
      if (duenos) duenos.add(estado.id);
      else porSubpath.set(clave, new Set([estado.id]));
    }
  }
  const compartidos = [...porSubpath.entries()].filter(([, duenos]) => duenos.size > 1);
  if (compartidos.length) {
    fallos.push("Subpaths repetidos entre estados distintos:");
    for (const [clave, duenos] of compartidos.slice(0, 5)) {
      fallos.push(`  · presente en ${[...duenos].sort().join(", ")}`);
      fallos.push(`    ${clave.slice(0, 90)}${clave.length > 90 ? "…" : ""}`);
    }
    if (compartidos.length > 5) {
      fallos.push(`  … y ${compartidos.length - 5} subpath(s) repetido(s) más`);
    }
    fallos.push("");
  }

  if (fallos.length) {
    fallos.push("No se escribió lib/mexico-estados.ts.");
    morir("La geometría generada no pasó las validaciones.", fallos);
  }

  salida.sort((a, b) => a.id.localeCompare(b.id));

  const archivo = `// GENERADO por scripts/build-mexico-map.ts — no editar a mano.
// Regenerar con: npm run build:map
// Fuente: data/estados.geojson · proyección geoMercator ajustada a ${ANCHO}×${ALTO}.

export const MAPA_ANCHO = ${ANCHO};
export const MAPA_ALTO = ${ALTO};

/** true cuando la geometría real ya fue generada. */
export const GEOMETRIA_LISTA = true;

export const ESTADOS = ${JSON.stringify(salida, null, 2)} as const;

export type EstadoId = (typeof ESTADOS)[number]["id"];
`;

  writeFileSync(SALIDA, archivo, "utf8");

  const pesoKb = (Buffer.byteLength(archivo, "utf8") / 1024).toFixed(0);
  console.log(`\n✓ ${salida.length} estados escritos en lib/mexico-estados.ts (${pesoKb} KB)`);
  if (invertidos) {
    console.log(`  ${invertidos} geometría(s) rebobinada(s): el GeoJSON venía en bobinado RFC 7946`);
    console.log("  y d3-geo espera el contrario.");
  }
  console.log("  GEOMETRIA_LISTA = true — el mapa ya renderiza.\n");
  console.log("  Centroides que conviene revisar visualmente (formas irregulares,");
  console.log("  islas o polígonos muy pequeños):");
  for (const id of [
    "MX-BCS", "MX-CMX", "MX-TLA", "MX-MOR", "MX-COL",
    "MX-NAY", "MX-CAM", "MX-QUE", "MX-ROO", "MX-VER",
  ]) {
    const estado = salida.find((s) => s.id === id);
    if (estado) {
      console.log(`    · ${estado.id}  ${estado.nombre.padEnd(20)} [${estado.centroide.join(", ")}]`);
    }
  }
  console.log("\n  Si alguno cae fuera de su estado, corrígelo en AJUSTES_PIN y vuelve a correr.\n");
}

main();
