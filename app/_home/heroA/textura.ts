import {
  CanvasTexture,
  type Texture,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";

/**
 * Hormigón visto, generado en el cliente.
 *
 * La textura NO es lo que da el realismo —eso es el entorno de entorno.ts—, es
 * lo que trae las MARCAS DE FABRICACIÓN. El ruido solo da un gris cualquiera; lo
 * que se lee como hormigón visto son las juntas de la cimbra, los agujeros del
 * tirante y los escurrimientos.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠ TRES PASADAS DEL PROTOTIPO NO ESCRIBÍAN NADA
 *
 * En el prototipo, `separadores`, `escurrimientos` y `poros` modificaban CERO
 * celdas del mapa de altura. Medido: 0, 0 y 0 de 1 048 576. El motivo es el
 * mismo en las tres — el bucle arrancaba en un valor fraccionario:
 *
 *   const grueso = 6 + Math.random()*26;          // 23.47
 *   for (let dx = -grueso; dx <= grueso; dx++)    // dx = -23.47, -22.47, …
 *     alt[(y%s)*s + ((px+dx+s)%s)] -= …           // índice FRACCIONARIO
 *
 * Un Float32Array indexado con una clave no entera devuelve `undefined` al leer
 * y DESCARTA LA ESCRITURA en silencio. Y encima es lentísimo: V8 abandona la
 * ruta rápida del array tipado y hace una búsqueda genérica de propiedad, unas
 * 870 000 veces. Los escurrimientos costaban 275-300 ms de los 365-375 totales
 * sin pintar un solo píxel.
 *
 * Aquí los radios pasan por Math.ceil y el grosor por Math.round, así que los
 * bucles recorren enteros. Resultado medido en node 24 sobre Apple Silicon:
 *
 *              prototipo          este archivo
 *   total      365-375 ms         57-75 ms
 *   separad.   0 celdas           ~6 700
 *   escurr.    0 celdas           ~870 000
 *   poros      0 celdas           ~42 000
 *
 * 5x más rápido Y además dibuja. Por eso no hace falta ni worker ni hornear la
 * textura a archivo: hornearla serían 3-4 MB de descarga —el ruido no comprime—
 * para ahorrar 60 ms de CPU, que es un mal trato en cualquier conexión.
 *
 * Si algún día hiciera falta el worker: mapaDeAltura() es matemática pura sin
 * DOM, y los tres Uint8ClampedArray de mapasRGBA() vuelven como buffers
 * transferibles. Está separado en dos funciones justamente para eso.
 */

/** Lado de los mapas. 1024 es el mínimo donde la cimbra no se ve pixelada. */
const LADO = 1024;

/**
 * Ruido por octavas, no ruido plano.
 *
 * El hormigón tiene manchas grandes, grano medio y árido fino a la vez. Con una
 * sola frecuencia se ve a televisión sin señal.
 */
function ruido(lado: number, celdas: number): Float32Array {
  const rej = celdas + 1;
  const semilla = new Float32Array(rej * rej);
  for (let i = 0; i < semilla.length; i++) semilla[i] = Math.random();

  const out = new Float32Array(lado * lado);
  const suave = (t: number) => t * t * (3 - 2 * t);
  for (let y = 0; y < lado; y++) {
    for (let x = 0; x < lado; x++) {
      const fx = (x / lado) * celdas;
      const fy = (y / lado) * celdas;
      const x0 = Math.floor(fx);
      const y0 = Math.floor(fy);
      const tx = suave(fx - x0);
      const ty = suave(fy - y0);
      const a = semilla[y0 * rej + x0];
      const b = semilla[y0 * rej + x0 + 1];
      const c = semilla[(y0 + 1) * rej + x0];
      const d = semilla[(y0 + 1) * rej + x0 + 1];
      const arriba = a + (b - a) * tx;
      const abajo = c + (d - c) * tx;
      out[y * lado + x] = arriba + (abajo - arriba) * ty;
    }
  }
  return out;
}

/** Cinco tablas por baldosa: el paso real de una cimbra de obra. */
const TABLAS = 5;

/** Sin DOM: se puede mover a un worker tal cual. */
function mapaDeAltura(s: number): Float32Array {
  const capas: [Float32Array, number][] = [
    [ruido(s, 5), 0.4],
    [ruido(s, 17), 0.27],
    [ruido(s, 58), 0.19],
    [ruido(s, 190), 0.14],
  ];
  const alt = new Float32Array(s * s);
  for (let i = 0; i < s * s; i++) {
    let n = 0;
    for (const [capa, peso] of capas) n += capa[i] * peso;
    alt[i] = n * 0.55 + 0.22;
  }

  /*
   * CIMBRA. El hormigón arquitectónico se cuela contra tablones, y esas juntas
   * horizontales son su firma. Sin ellas el material es un gris cualquiera.
   */
  const ancho = s / TABLAS;
  for (let t = 0; t < TABLAS; t++) {
    const y0 = Math.round(t * ancho);
    /* ninguna tabla es igual a la siguiente: su tono y su panza */
    const tono = (Math.random() - 0.5) * 0.09;
    const resalte = 0.012 + Math.random() * 0.02;
    for (let y = y0; y < y0 + ancho && y < s; y++) {
      const dentro = (y - y0) / ancho;
      /* la junta: un rebaje estrecho arriba y abajo de la tabla */
      const junta = dentro < 0.016 || dentro > 0.984 ? -0.09 : 0;
      /* y el abombamiento de la madera hacia el centro */
      const panza = Math.sin(dentro * Math.PI) * resalte;
      for (let x = 0; x < s; x++) alt[y * s + x] += tono + junta + panza;
    }
  }

  /* SEPARADORES: los agujeros que deja el tirante de la cimbra, con su labio. */
  const REJ = 4;
  for (let a = 0; a < REJ; a++) {
    for (let b = 0; b < TABLAS; b++) {
      const px = Math.round(((a + 0.5) * s) / REJ + (Math.random() - 0.5) * 26);
      const py = Math.round((b + 0.5) * ancho + (Math.random() - 0.5) * 10);
      const r = 7 + Math.random() * 3;
      /* Math.ceil: el radio es fraccionario, el BUCLE no puede serlo. */
      const alcance = Math.ceil(r) + 2;
      for (let dy = -alcance; dy <= alcance; dy++) {
        for (let dx = -alcance; dx <= alcance; dx++) {
          const d = Math.hypot(dx, dy);
          const ix = ((py + dy + s) % s) * s + ((px + dx + s) % s);
          if (d <= r) alt[ix] -= 0.34 * (1 - (d / r) * (d / r));
          else if (d <= r + 2) alt[ix] += 0.03 * (1 - (d - r) / 2);
        }
      }
    }
  }

  /* ESCURRIMIENTOS: las manchas verticales de intemperie. */
  for (let k = 0; k < 26; k++) {
    const px = (Math.random() * s) | 0;
    /* Math.round por lo mismo que arriba: este era el bucle de los 300 ms. */
    const grueso = Math.round(6 + Math.random() * 26);
    const fuerza = 0.02 + Math.random() * 0.05;
    const desde = (Math.random() * s * 0.5) | 0;
    for (let y = desde; y < s; y++) {
      const caida = Math.min(1, (y - desde) / 120);
      for (let dx = -grueso; dx <= grueso; dx++) {
        const peso = 1 - Math.abs(dx) / grueso;
        alt[(y % s) * s + ((px + dx + s) % s)] -= fuerza * peso * caida * 0.5;
      }
    }
  }

  /* POROS del árido. */
  for (let k = 0; k < 3400; k++) {
    const px = (Math.random() * s) | 0;
    const py = (Math.random() * s) | 0;
    const r = 0.8 + Math.random() * 2.2;
    const alcance = Math.ceil(r);
    for (let dy = -alcance; dy <= alcance; dy++) {
      for (let dx = -alcance; dx <= alcance; dx++) {
        const d = Math.hypot(dx, dy);
        if (d > r) continue;
        alt[((py + dy + s) % s) * s + ((px + dx + s) % s)] -= (1 - d / r) * 0.2;
      }
    }
  }

  return alt;
}

/** Cuánto exagera el mapa de normales las pendientes del mapa de altura. */
const RELIEVE = 3.4;

/** Tampoco toca el DOM: los tres buffers son transferibles a un worker. */
function mapasRGBA(alt: Float32Array, s: number) {
  const color = new Uint8ClampedArray(new ArrayBuffer(s * s * 4));
  const normal = new Uint8ClampedArray(new ArrayBuffer(s * s * 4));
  const rugosidad = new Uint8ClampedArray(new ArrayBuffer(s * s * 4));
  const H = (a: number, b: number) => alt[((b + s) % s) * s + ((a + s) % s)];

  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const i = y * s + x;
      const n = alt[i];

      const g = 146 + (n - 0.5) * 58;
      color[i * 4] = g + 4;
      color[i * 4 + 1] = g + 1;
      color[i * 4 + 2] = g - 5;
      color[i * 4 + 3] = 255;

      const dx = (H(x + 1, y) - H(x - 1, y)) * RELIEVE;
      const dy = (H(x, y + 1) - H(x, y - 1)) * RELIEVE;
      const largo = Math.hypot(-dx, -dy, 1);
      normal[i * 4] = ((-dx / largo) * 0.5 + 0.5) * 255;
      normal[i * 4 + 1] = ((-dy / largo) * 0.5 + 0.5) * 255;
      normal[i * 4 + 2] = ((1 / largo) * 0.5 + 0.5) * 255;
      normal[i * 4 + 3] = 255;

      /* Lo hundido está más rugoso y retiene más suciedad: es lo que hace que
         la luz no resbale igual por toda la pieza. */
      const rr = 150 + (1 - n) * 88;
      rugosidad[i * 4] = rr;
      rugosidad[i * 4 + 1] = rr;
      rugosidad[i * 4 + 2] = rr;
      rugosidad[i * 4 + 3] = 255;
    }
  }
  return { color, normal, rugosidad };
}

/*
 * `Uint8ClampedArray<ArrayBuffer>` y no el genérico a secas: desde TS 5.7 los
 * arrays tipados llevan parámetro de buffer, e `ImageData` solo acepta los
 * respaldados por un ArrayBuffer normal, nunca por un SharedArrayBuffer.
 */
type Bytes = Uint8ClampedArray<ArrayBuffer>;

function aTextura(datos: Bytes, s: number, esColor: boolean): CanvasTexture {
  const lienzo = document.createElement("canvas");
  lienzo.width = lienzo.height = s;
  const ctx = lienzo.getContext("2d");
  if (!ctx) throw new Error("sin contexto 2d");
  ctx.putImageData(new ImageData(datos, s, s), 0, 0);
  const tex = new CanvasTexture(lienzo);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  /* Solo el mapa de color va en sRGB. El de normales y el de rugosidad son
     datos, no color: etiquetarlos como sRGB les aplicaría la curva y el
     relieve saldría mal. */
  if (esColor) tex.colorSpace = SRGBColorSpace;
  return tex;
}

export type Mapas = {
  color: Texture;
  normal: Texture;
  rugosidad: Texture;
  liberar: () => void;
};

export function texturaHormigon(anisotropia: number): Mapas {
  const s = LADO;
  const { color, normal, rugosidad } = mapasRGBA(mapaDeAltura(s), s);
  const mapas = {
    color: aTextura(color, s, true),
    normal: aTextura(normal, s, false),
    rugosidad: aTextura(rugosidad, s, false),
  };
  for (const t of Object.values(mapas)) t.anisotropy = anisotropia;
  return {
    ...mapas,
    liberar: () => {
      for (const t of Object.values(mapas)) t.dispose();
    },
  };
}
