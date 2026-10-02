"use client";

import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BufferAttribute,
  Color,
  DirectionalLight,
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  Shape,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
  type BufferGeometry,
} from "three";
import { entorno } from "./entorno";
import type { EstadoHero } from "./estado";
import {
  BISEL,
  CANTO,
  CENTROIDE_Y,
  centroide,
  PIEZAS,
  SEMI_ALTO,
  SEMI_ANCHO,
  TURNOS,
} from "./isotipo";
import { texturaHormigon } from "./textura";

/**
 * La A de hormigón. Es el único módulo que importa `three`, y llega por
 * `next/dynamic` con `ssr: false` desde HeroA — ver allí el por qué.
 *
 * No renderiza nada de React salvo el <canvas>: todo lo demás son imperativos
 * sobre la escena, y el puente con el scroll es el objeto mutable `estado`, que
 * escribe GSAP y lee el bucle de render. Ni un setState por frame.
 */

/** Cuánto se solapan los turnos de llegada. Ver `turno` en isotipo.ts. */
const DESFASE = 0.3;

/** Repeticiones de textura por unidad. Con 5 tablas por baldosa y la A midiendo
 *  1.95 unidades, salen ~19 tablas de alto: el paso real de una cimbra. */
const UV_ESCALA = 1.9;

/**
 * Respiro a cada lado de la banda libre, en píxeles.
 *
 * La banda es lo que queda entre el borde inferior de la barra superior y el
 * borde superior del rótulo de fase. Los dos se MIDEN del DOM, no se escriben
 * aquí: si cambia el alto de cualquiera de los dos, el encuadre lo sigue solo.
 */
const AIRE = 24;

/**
 * Cuánto se corrige el centrado óptico. 0 centra la CAJA del isotipo, 1 centra
 * su MASA (ver CENTROIDE_Y en isotipo.ts).
 *
 * A 1 la letra sube demasiado: queda con más del doble de aire abajo que arriba y
 * se lee flotando. A 0.5 la razón es ~1.6:1, que es lo que hace falta para que
 * deje de verse apoyada en el borde sin parecer suelta.
 */
const SESGO = 0.5;

/**
 * Distancia de partida de las piezas, en unidades de MUNDO.
 *
 * Los vectores de llegada de isotipo.ts están en unidades de letra, así que los
 * escala el grupo. Eso significaba que la distancia de partida dependía del
 * tamaño al que hubiera quedado la A: al ajustar la escala al encuadre —que la
 * baja de 1.75 a ~1.16-1.37 según el viewport— las piezas empezaron a arrancar
 * MÁS CERCA del centro, y la zapata izquierda pisaba el titular con el titular
 * todavía al 100 % de opacidad.
 *
 * Por eso `aplicar` divide por la escala vigente: el desplazamiento resultante es
 * el mismo en todas partes, y a cuántos píxeles corresponde depende sólo del alto
 * del viewport, que es lo razonable.
 *
 * El valor sale de barrer el recorrido entero contra las cajas REALES de las dos
 * líneas —métrica de Gotham, no la caja del bloque—, en el peor caso del balanceo
 * ambiental y en nueve viewports de 360x640 a 2560x1440:
 *
 *   K = 1.8   hasta 2.63 % del texto con el titular al 50 % o más
 *   K = 2.0   hasta 1.34 %, y sólo en viewports anchos y bajos (1440x720)
 *   K = 2.4   cero, pero deja UNA sola pieza en cuadro en el primer fotograma
 *
 * 2.0 y no 2.4 porque la constelación de alambre alrededor del titular es parte
 * de lo que se ve al entrar, y a 2.4 no queda constelación. El 1.34 % que queda es
 * el solape de la CAJA de una pieza que en ese instante es sólo alambre —un
 * contorno, no una superficie—, así que la medida exagera bastante la tinta real.
 */
const SALIDA = 2.0;

type Trozo = {
  nodo: Group;
  solido: Mesh<BufferGeometry, MeshStandardMaterial>;
  alambre: LineSegments<BufferGeometry, LineBasicMaterial>;
  turno: number;
  /** De dónde viene: desplazamiento y giro en el instante 0. */
  dx: number;
  dy: number;
  dz: number;
  rx: number;
  ry: number;
  rz: number;
};

/**
 * Proyección de caja para las UV.
 *
 * ExtrudeGeometry da coordenadas distintas a las caras frontales y a los cantos:
 * el grano sale enorme en una cara y estirado en la vecina, y eso es lo que más
 * delata un material procedimental. Aquí se mira hacia dónde apunta cada normal
 * y se proyecta sobre el plano que le toca.
 */
function uvDeCaja(geo: BufferGeometry, escala: number) {
  const pos = geo.attributes.position;
  const nor = geo.attributes.normal;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const nx = Math.abs(nor.getX(i));
    const ny = Math.abs(nor.getY(i));
    const nz = Math.abs(nor.getZ(i));
    let u: number;
    let v: number;
    if (nz >= nx && nz >= ny) {
      u = x; // frente y dorso
      v = y;
    } else if (nx >= ny) {
      u = z; // cantos verticales
      v = y;
    } else {
      u = x; // cantos horizontales
      v = z;
    }
    uv[i * 2] = u * escala;
    uv[i * 2 + 1] = v * escala;
  }
  geo.setAttribute("uv", new BufferAttribute(uv, 2));
}

export default function Escena3D({
  estado,
  reducido,
}: {
  estado: React.RefObject<EstadoHero>;
  reducido: boolean;
}) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      /* Sin WebGL no hay objeto, y ya está: el hero se ve entero sin él —titular,
         fondo y muro son HTML y CSS—, así que no hay nada que avisar ni ningún
         estado alternativo que enseñar. */
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    /* Sin esto los grises salen lavados y el material no cuaja. En three 0.186
       ya no existen outputEncoding ni sRGBEncoding, que es lo que usaba el
       prototipo: son outputColorSpace y SRGBColorSpace. */
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    /* 1.0 y no 1.05: el entorno de entorno.ts es ahora 1.79x más luminoso —el
       hero pasó a tono claro— y con la exposición de antes los brillos del
       ventanal se empastaban. */
    renderer.toneMappingExposure = 1.0;
    /* La sombra propia entre piezas es lo que las vuelve materia en lugar de
       siluetas pintadas. */
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    const escena = new Scene();
    const amb = entorno(renderer);
    escena.environment = amb.textura;

    const camara = new PerspectiveCamera(32, 1, 0.1, 100);
    camara.position.set(0, 0, 6.6);

    /* 0.12 y no 0.05. La ambiente es el suelo de luz de las caras que no ven
       ninguna fuente; sobre fondo claro esas caras eran las que se veían negras. */
    escena.add(new AmbientLight(0xffffff, 0.12));
    const principal = new DirectionalLight(0xfff3e6, 0.85);
    principal.position.set(3.2, 4.4, 4.6);
    principal.castShadow = true;
    principal.shadow.mapSize.set(1024, 1024);
    principal.shadow.camera.near = 0.5;
    principal.shadow.camera.far = 20;
    principal.shadow.camera.left = -4;
    principal.shadow.camera.right = 4;
    principal.shadow.camera.top = 4;
    principal.shadow.camera.bottom = -4;
    principal.shadow.bias = -0.0012;
    principal.shadow.radius = 3;
    escena.add(principal);

    /* Coral por un lado y un azul frío por el otro: los dos cantos de una misma
       pieza dejan de tener el mismo color y el volumen se lee. */
    const relleno = new DirectionalLight(0xf15d4d, 0.22);
    relleno.position.set(-4, -2, 2);
    escena.add(relleno);
    const contra = new DirectionalLight(0x9fc4dc, 0.3);
    contra.position.set(-3, 3, -4);
    escena.add(contra);

    /* Un plano detrás que SOLO recoge sombra: invisible salvo por lo que se
       proyecta en él. */
    /* 0.18 y no 0.32: ShadowMaterial pinta negro, y sobre el gris claro de la
       página una sombra al 32 % se leía como suciedad en vez de como apoyo. */
    const telon = new Mesh(new PlaneGeometry(26, 26), new ShadowMaterial({ opacity: 0.18 }));
    telon.position.z = -1.35;
    telon.receiveShadow = true;
    escena.add(telon);

    const mapas = texturaHormigon(renderer.capabilities.getMaxAnisotropy());

    const grupo = new Group();
    escena.add(grupo);
    const trozos: Trozo[] = PIEZAS.map((pieza, i) => {
      const forma = new Shape();
      pieza.contorno.forEach(([x, y], k) => (k ? forma.lineTo(x, y) : forma.moveTo(x, y)));
      forma.closePath();

      const geo = new ExtrudeGeometry(forma, {
        depth: CANTO,
        bevelEnabled: true,
        bevelThickness: BISEL,
        bevelSize: BISEL,
        bevelSegments: 2,
        curveSegments: 4,
      });
      uvDeCaja(geo, UV_ESCALA);

      /* Ninguna colada sale igual que otra: un punto de variación por pieza y
         deja de parecer un objeto clonado. */
      /* Subido de 0x8a8780. Contra el fondo claro el albedo de antes daba 3.28 de
         contraste —más que un texto secundario— y la pieza se leía como un
         recorte oscuro pegado encima. En 0x9c9890 baja a 2.63 y sigue teniendo
         cuerpo; 0xa8a49c (2.28) ya empieza a desvanecerse. */
      const tinte = new Color(0x9c9890).offsetHSL(0, 0, ((i % 3) - 1) * 0.018);
      const solido = new Mesh(
        geo,
        new MeshStandardMaterial({
          color: tinte,
          roughness: 0.78,
          metalness: 0.04,
          map: mapas.color,
          normalMap: mapas.normal,
          normalScale: new Vector2(1, 1),
          roughnessMap: mapas.rugosidad,
          envMapIntensity: 0.95,
          transparent: true,
          opacity: 0,
        }),
      );
      solido.castShadow = true;
      solido.receiveShadow = true;

      /* El alambre: las aristas, que es como llegan las piezas antes de ser
         materia. Se apaga conforme entra el hormigón. */
      const alambre = new LineSegments(
        new EdgesGeometry(geo, 24),
        /* Ink, no cream: el hero es de tono claro. Cream sobre --surface-page da
           1.21 de contraste —invisible—, e ink da 14.61. */
        new LineBasicMaterial({ color: 0x212222, transparent: true, opacity: 0.75 }),
      );

      const nodo = new Group();
      nodo.add(solido, alambre);
      grupo.add(nodo);

      /* De dónde viene cada pieza: hacia afuera desde el centro. No es azar, la
         dirección sale de su propia posición dentro de la letra. */
      const [cx, cy] = centroide(pieza);
      const largo = Math.hypot(cx, cy) || 0.4;
      return {
        nodo,
        solido,
        alambre,
        turno: pieza.turno,
        dx: (cx / largo) * (1.7 + i * 0.32),
        dy: (cy / largo) * (1.5 + i * 0.24) + (i % 2 ? 0.35 : -0.3),
        dz: (i % 2 ? 1.5 : -1.2) - i * 0.2,
        rx: (i % 2 ? 1 : -1) * 0.7,
        ry: (i % 2 ? -1 : 1) * 0.9,
        rz: i % 2 ? 0.5 : -0.45,
      };
    });

    /** Reparte el avance global entre los turnos: un pórtico se levanta de abajo
     *  arriba, así que las zapatas llegan antes que la clave. */
    const ventana = 1 - DESFASE;
    function aplicar(p: number) {
      /* Ver SALIDA: dividir por la escala convierte el desplazamiento de unidades
         de letra a unidades de mundo, para que la distancia de partida no dependa
         del tamaño al que haya quedado la A en este viewport. */
      const salida = SALIDA / (grupo.scale.x || 1);
      for (const z of trozos) {
        const arranque = TURNOS > 1 ? (z.turno / (TURNOS - 1)) * DESFASE : 0;
        const propio = Math.max(0, Math.min(1, (p - arranque) / ventana));
        const e = 1 - Math.pow(1 - propio, 2.6);
        const fuera = salida * (1 - e);
        z.nodo.position.set(z.dx * fuera, z.dy * fuera, z.dz * fuera);
        z.nodo.rotation.set(z.rx * (1 - e), z.ry * (1 - e), z.rz * (1 - e));
        /* El hormigón entra sobre el último tercio, cuando la pieza ya casi está
           en su sitio: primero se arma, después se materializa. */
        const materia = Math.max(0, Math.min(1, (e - 0.55) / 0.4));
        z.solido.material.opacity = materia;
        z.alambre.material.opacity = 0.75 * (1 - materia * 0.92);
      }
    }

    /*
     * ENCUADRE.
     *
     * La escala NO sale del ancho del viewport, que es de donde salía antes
     * (`min(1, w/1200) * 1.75`). Esa fórmula tenía dos fallos medidos: en
     * escritorio dejaba la A a 4 px de los dos bordes y con los pies 83-89 px
     * DENTRO del rótulo de fase, y en teléfono la encogía a un tercio del alto
     * disponible. Es lo que pasa al dimensionar por el ancho una figura cuya
     * restricción es el alto.
     *
     * Aquí la A se ajusta a la BANDA LIBRE —entre la barra superior y el rótulo de
     * fase, los dos medidos del DOM— y se limita además por el ancho útil. Manda
     * la más restrictiva de las dos, así que en escritorio decide el alto y en
     * teléfono el ancho, que es lo correcto en cada caso.
     *
     * La cámara NO se toca, y es deliberado: alejarla encuadraría igual pero
     * aplanaría la perspectiva, y el escorzo del ensamble es justo lo que hace que
     * se lean los cantos de las piezas. Se ajusta el objeto, no el ojo.
     */
    const TG = Math.tan((camara.fov * Math.PI) / 360);
    const dimensionar = () => {
      const caja = canvas.parentElement;
      const w = caja?.clientWidth || window.innerWidth;
      const h = caja?.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camara.aspect = w / h;
      camara.updateProjectionMatrix();

      /*
       * La banda libre.
       *
       * Arriba el obstáculo es real y se mide: la barra superior, que al ser
       * `fixed` ya da su rect en coordenadas de viewport.
       *
       * Abajo ya no hay ninguno. Antes se medía el rótulo de fase, pero ese
       * bloque se quitó y con él la fila entera del pie del hero. La reserva
       * inferior REFLEJA la superior en vez de irse al borde: sin obstáculo, dejar
       * que la A crezca hasta 24px del canto la devolvería a lo que estaba antes
       * de encuadrarla —pegada abajo—, y una letra con aire arriba y nada abajo se
       * lee cayéndose. El sesgo óptico de SESGO sigue dándole más aire abajo que
       * arriba sobre esta base simétrica.
       */
      const barra = document.querySelector(".altea-navbar")?.getBoundingClientRect().bottom ?? 0;
      const arriba = barra + AIRE;
      const abajo = Math.max(arriba + 1, h - arriba);

      /* El margen lateral se lee del padding ya resuelto del titular, que es quien
         consume --container-pad. Leer la variable daría el clamp() sin resolver. */
      const titular = caja?.querySelector<HTMLElement>(".hero-a__titular");
      const lateral = titular ? parseFloat(getComputedStyle(titular).paddingLeft) || 20 : 20;

      const medioPx = (arriba + abajo) / 2;
      const semiPx = (abajo - arriba) / 2;
      const semiAnchoPx = Math.max(1, (w - 2 * lateral) / 2);

      /*
       * Punto fijo: los píxeles por unidad dependen de la distancia a la cámara, y
       * ésa depende de la escala, porque la cara frontal de la pieza está a
       * z = CANTO * escala y por tanto más cerca del ojo. Seis pasadas sobran —la
       * corrección es de 0.45 sobre 6.6— pero no cuestan nada.
       *
       * Al semialto se le suma el sesgo del centrado óptico: subir la letra gasta
       * margen por arriba, así que la escala tiene que contemplarlo o la clave se
       * saldría por el techo.
       */
      let esc = 1;
      for (let i = 0; i < 6; i++) {
        const ppu = h / (2 * (camara.position.z - CANTO * esc) * TG);
        const porAlto = semiPx / ppu / (SEMI_ALTO + SESGO * Math.abs(CENTROIDE_Y));
        const porAncho = semiAnchoPx / ppu / SEMI_ANCHO;
        esc = Math.min(porAlto, porAncho);
      }

      const d = camara.position.z - CANTO * esc;
      /* El centro de la banda, pasado a coordenadas de mundo a esa profundidad. */
      const medioMundo = (1 - (2 * medioPx) / h) * TG * d;
      grupo.scale.setScalar(esc);
      grupo.position.y = medioMundo + esc * SESGO * Math.abs(CENTROIDE_Y);
    };
    dimensionar();
    const observador = new ResizeObserver(dimensionar);
    if (canvas.parentElement) observador.observe(canvas.parentElement);

    let libre = 0;
    let cuadro = 0;
    const bucle = () => {
      cuadro = requestAnimationFrame(bucle);
      const est = estado.current;
      if (!est) return;
      aplicar(est.ensamble);
      if (!reducido) libre += 0.0026;
      /*
       * El balanceo ambiental vive SOLO durante el ensamble y se apaga conforme
       * la pieza se endereza. Si no se apagase, la posición final nunca quedaría
       * recta: seguiría oscilando con la A ya montada y de frente.
       */
      const resto = Math.min(1, Math.abs(est.giro) / 0.74);
      grupo.rotation.y = est.giro + Math.sin(libre * 1.1) * 0.13 * resto;
      grupo.rotation.x = est.alto + Math.sin(libre * 1.45) * 0.06 * resto;
      grupo.rotation.z = Math.sin(libre * 0.8) * 0.035 * resto;
      renderer.render(escena, camara);
    };
    bucle();

    return () => {
      cancelAnimationFrame(cuadro);
      observador.disconnect();
      for (const z of trozos) {
        z.solido.geometry.dispose();
        z.solido.material.dispose();
        z.alambre.geometry.dispose();
        z.alambre.material.dispose();
      }
      telon.geometry.dispose();
      (telon.material as ShadowMaterial).dispose();
      mapas.liberar();
      amb.liberar();
      renderer.dispose();
    };
  }, [estado, reducido]);

  return <canvas ref={lienzo} className="hero-a__lienzo" aria-hidden="true" />;
}
