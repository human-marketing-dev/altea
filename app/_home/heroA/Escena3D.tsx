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
import { CORAL } from "@/lib/isotipo";
import { entorno } from "./entorno";
import type { EstadoHero } from "./estado";
import {
  BISEL,
  CANTO,
  CENTROIDE_Y,
  centroide,
  PIEZAS,
  RECENTRADO_X,
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

/**
 * Repeticiones de textura por unidad de escena.
 *
 * No es un número de gusto: la foto cubre 1.6 m de superficie real y el isotipo
 * mide 1.95 unidades, que en la escena se leen como unos 2 m. A 1.25
 * repeticiones por unidad el árido queda a su tamaño verdadero. El
 * procedimental de antes iba a 1.9 porque su grano estaba dibujado a una escala
 * arbitraria y lo que se ajustaba era el paso de la cimbra, no el tamaño de una
 * piedra.
 */
const UV_ESCALA = 1.25;

/**
 * El acabado, BRUTO. Es el que eligió el cliente.
 *
 * Son dos palancas distintas y conviene no confundirlas: `normal` INCLINA la
 * superficie —más contraste entre lo alto y lo hundido— y `oclusion` OSCURECE
 * LOS HUECOS. Una normal alta sola se ve plástica, porque la luz rebota raro
 * pero nada ensombrece; las dos juntas son las que sacan la textura.
 */
const ACABADO = { normal: 2.4, oclusion: 1.6, rugosidad: 0.93, entorno: 0.72 };

/**
 * ⚠ EL FACTOR π DE LAS LUCES. Sin esto la escena se ve plana y no es la textura.
 *
 * El prototipo está escrito contra three r128, donde el shader de
 * MeshStandardMaterial lleva esto —comprobado en el código de r128, no de
 * memoria:
 *
 *   void RE_Direct_Physical( … ) {
 *     vec3 irradiance = dotNL * directLight.color;
 *     #ifndef PHYSICALLY_CORRECT_LIGHTS
 *       irradiance *= PI;
 *     #endif
 *
 * y lo mismo en getAmbientLightIrradiance. `physicallyCorrectLights` valía false
 * por defecto, así que la macro NO estaba definida y TODA luz directa y ambiente
 * entraba multiplicada por π. En three 0.186 esas dos líneas ya no existen —la
 * iluminación es física y punto—, de modo que las intensidades del prototipo
 * valen aquí 3.1416 veces menos de lo que valían allí.
 *
 * LO QUE NO SE MULTIPLICA ES EL ENTORNO: el IBL nunca llevó ese factor, en
 * ninguna de las dos versiones. O sea que el error no oscurecía la escena por
 * igual: le cambiaba el REPARTO entre luz directa y entorno, y eso es
 * exactamente lo que se ve como material plano. Con las intensidades sin
 * corregir, el entorno aportaba 3.14 veces más de lo que le toca frente a la
 * clave, y una pieza iluminada sobre todo por un domo no tiene ni una cara
 * claramente más iluminada que otra.
 *
 * Y es el caso fácil de diagnosticar mal: lo que se ve es un hormigón sin
 * textura, así que lo primero que uno toca es normalScale y aoMapIntensity, que
 * no tienen nada que ver.
 *
 * Nota de versiones: la renombrada que suele citarse para esto —`useLegacyLights`
 * y su desaparición en r165— es la MISMA familia pero no es lo que aplica aquí.
 * Esa bandera se introdujo en r155 para poder recuperar el comportamiento viejo;
 * en r128 lo que hay es la macro de arriba, y en 0.186 no hay ni una cosa ni la
 * otra. El factor, en los dos casos, es π.
 */
const LEGADO = Math.PI;

/**
 * Respiro a cada lado de la banda libre, en píxeles.
 *
 * La banda es lo que queda entre el borde inferior de la barra superior y su
 * reflejo por abajo. El obstáculo de arriba se MIDE del DOM, no se escribe aquí:
 * si cambia el alto de la barra, el encuadre lo sigue solo.
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
 * Los vectores de llegada están en unidades de letra, así que los escala el
 * grupo. Eso significaba que la distancia de partida dependía del tamaño al que
 * hubiera quedado la A: al ajustar la escala al encuadre las piezas empezaban
 * MÁS CERCA del centro, y la zapata izquierda pisaba el titular con el titular
 * todavía al 100 % de opacidad. Por eso `aplicar` divide por la escala vigente.
 *
 * El valor sale de barrer el recorrido entero contra las cajas REALES de las dos
 * líneas del titular —métrica de Gotham, no la caja del bloque—, en nueve
 * viewports de 360x640 a 2560x1440: a 1.8 hasta un 2.63 % del texto queda pisado
 * con el titular al 50 % o más, a 2.0 un 1.34 % y sólo en viewports anchos y
 * bajos, y a 2.4 cero pero no queda constelación de alambre alrededor del
 * titular, que es parte de lo que se ve al entrar.
 */
const SALIDA = 2.0;

/**
 * Radio base del anillo de dispersión, en unidades de letra.
 *
 * LAS PIEZAS SE REPARTEN EN UN ANILLO, no hacia afuera desde su propio centro.
 * Con la dirección saliendo del centroide de cada una, como cuatro de las ocho
 * están en la mitad de abajo, se iban casi todas por el mismo lado: al cargar
 * sólo se veían dos y el resto entraba desde fuera de cuadro por el mismo sitio.
 * Repartirlas por ángulo las mantiene a todas en escena y hace que se lea como
 * un despiece.
 *
 * El prototipo usa 1.52 de base. Aquí es 1.7 porque el anillo decide la
 * DIRECCIÓN, no la distancia: la distancia la gobierna SALIDA, y 1.7 es el
 * mínimo que mide el barrido contra el titular. Bajarlo a 1.52 acerca la pieza
 * más próxima un 11 % y devuelve el solape que SALIDA está ahí para evitar.
 */
const RADIO_BASE = 1.7;

/** La clave viaja mientras la A se endereza. Ver `cenit` más abajo. */
const LUZ_INICIO = { x: 3.2, y: 4.4, z: 4.6 };
const LUZ_FINAL = { x: 1.3, y: 14, z: 1.9 };

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
  /** Ritmo y fase propios de su flotación. Ver el bucle. */
  fase: number;
  vel: number;
};

/**
 * Proyección de caja para las UV.
 *
 * ExtrudeGeometry da coordenadas distintas a las caras frontales y a los cantos:
 * el grano sale enorme en una cara y estirado en la vecina, y eso es lo que más
 * delata un material falso. Aquí se mira hacia dónde apunta cada normal y se
 * proyecta sobre el plano que le toca.
 *
 * UN SOLO JUEGO DE UV, y es correcto: ver en textura.ts por qué en three moderna
 * el aoMap ya lee `uv` como todos los demás y el segundo atributo sobra.
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
      /* Sin WebGL no hay objeto, y ya está: el hero se ve entero sin él —titular
         y campo de puntos son HTML y canvas 2D—, así que no hay nada que avisar
         ni ningún estado alternativo que enseñar. */
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    /* Sin esto los grises salen lavados y el material no cuaja. En three 0.186
       ya no existen outputEncoding ni sRGBEncoding, que es lo que usaba el
       prototipo: son outputColorSpace y SRGBColorSpace. */
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    /*
     * 1.05, la del prototipo. Estuvo en 1.0 mientras las luces iban sin el factor
     * π de abajo, por miedo a que el entorno aclarado empastara los brillos del
     * ventanal. Medido con las luces ya corregidas y a 1.05, el píxel más claro
     * del hormigón es 224 de 255 y ni uno pasa de 245: no hay nada que empastar.
     */
    renderer.toneMappingExposure = 1.05;
    /* La sombra propia entre piezas es lo que las vuelve materia en lugar de
       siluetas pintadas. */
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    const escena = new Scene();
    const amb = entorno(renderer);
    escena.environment = amb.textura;

    const camara = new PerspectiveCamera(32, 1, 0.1, 100);
    camara.position.set(0, 0, 6.6);

    /*
     * La ambiente es el suelo de luz de las caras que no ven ninguna fuente, que
     * sobre un fondo claro son las que se veían negras. Estuvo subida a mano a
     * 0.12 por eso; con el factor π recuperado, el 0.05 del prototipo vale 0.157,
     * o sea más de lo que se había puesto a ojo. El parche sobraba.
     */
    escena.add(new AmbientLight(0xffffff, 0.05 * LEGADO));
    const principal = new DirectionalLight(0xfff3e6, 0.85 * LEGADO);
    principal.position.set(LUZ_INICIO.x, LUZ_INICIO.y, LUZ_INICIO.z);
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
    const relleno = new DirectionalLight(CORAL, 0.22 * LEGADO);
    relleno.position.set(-4, -2, 2);
    escena.add(relleno);
    const contra = new DirectionalLight(0x9fc4dc, 0.3 * LEGADO);
    contra.position.set(-3, 3, -4);
    escena.add(contra);

    /* Un plano detrás que SOLO recoge sombra: invisible salvo por lo que se
       proyecta en él. */
    /* 0.18 y no el 0.32 del prototipo: ShadowMaterial pinta negro, y sobre el
       cream de la página una sombra al 32 % se leía como suciedad en vez de como
       apoyo. */
    const telon = new Mesh(new PlaneGeometry(26, 26), new ShadowMaterial({ opacity: 0.18 }));
    telon.position.z = -1.35;
    telon.receiveShadow = true;
    escena.add(telon);

    let listo = false;
    const mapas = texturaHormigon(renderer, () => {
      if (listo) renderer.render(escena, camara);
    });

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

      /*
       * LA BANDEROLA VA PIGMENTADA: el relieve del hormigón pero no su mapa de
       * color. Queda como un hormigón coloreado en masa —misma materia que el
       * resto, distinto color—, que es lo que es el acento de la marca.
       *
       * Las otras dos salidas se probaron y se descartaron: el coral liso sin
       * relieve se lee como un plástico pegado sobre una pieza de hormigón, y
       * dejarla gris como las demás es honesto con el material pero le quita a
       * la marca su único color.
       */
      const esCoral = pieza.coral === true;
      /*
       * El color base MULTIPLICA a la textura, así que parte de blanco y no de
       * gris: el gris ya viene en la foto, cuyo albedo medio es 107 de 255. El
       * procedimental de antes necesitaba que el color aportara el tono, y por
       * eso llevaba un 0x9c9890 calibrado a mano que aquí sobra.
       *
       * La desviación de 0.022 por pieza es a propósito: ninguna colada sale
       * igual que otra, y sin ella se ve como un objeto clonado.
       */
      const tinte = esCoral
        ? new Color(CORAL)
        : new Color(0xffffff).offsetHSL(0, 0, ((i % 3) - 1) * 0.022);
      const solido = new Mesh(
        geo,
        new MeshStandardMaterial({
          color: tinte,
          roughness: ACABADO.rugosidad,
          metalness: 0.04,
          map: esCoral ? null : mapas.color,
          normalMap: mapas.normal,
          normalScale: new Vector2(ACABADO.normal, ACABADO.normal),
          roughnessMap: mapas.rugosidad,
          aoMap: mapas.oclusion,
          aoMapIntensity: ACABADO.oclusion,
          /* El coral sube a 1.15: al perder el mapa de color pierde también su
             variación de brillo, y el entorno es lo que se la devuelve. */
          envMapIntensity: esCoral ? 1.15 : ACABADO.entorno,
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

      /*
       * De dónde viene cada pieza: un ANILLO repartido por ángulo (ver
       * RADIO_BASE), con un empujón pequeño en la dirección de su propia
       * posición dentro de la letra para que el despiece no se lea sorteado.
       */
      const [cx, cy] = centroide(pieza);
      const largo = Math.hypot(cx, cy) || 0.4;
      const ang = (i / PIEZAS.length) * Math.PI * 2 + 0.6;
      const radio = RADIO_BASE + (i % 3) * 0.24;
      return {
        nodo,
        solido,
        alambre,
        turno: pieza.turno,
        dx: Math.cos(ang) * radio * 1.32 + (cx / largo) * 0.24,
        dy: Math.sin(ang) * radio + (cy / largo) * 0.2,
        /* la profundidad alterna para que no caigan todas en un plano */
        dz: (i % 2 ? 1.05 : -0.9) - (i % 3) * 0.22,
        rx: (i % 2 ? 1 : -1) * 0.58,
        ry: (i % 2 ? -1 : 1) * 0.74,
        rz: i % 2 ? 0.42 : -0.38,
        /*
         * Cada pieza flota con SU PROPIO ritmo y SU PROPIA fase: los periodos
         * salen entre 43 y 73 segundos. Distintos a propósito — si fueran
         * iguales el conjunto subiría y bajaría en bloque, que es justo lo
         * contrario de flotar.
         */
        fase: i * 1.7,
        vel: 0.55 + (i % 4) * 0.13,
      };
    });

    /** Reparte el avance global entre los turnos: un pórtico se levanta de abajo
     *  arriba, así que las zapatas llegan antes que la clave. */
    const ventana = 1 - DESFASE;
    /**
     * Coloca las ocho piezas para un avance `p`, con su flotación encima.
     *
     * ⚠ LA FLOTACIÓN NO PUEDE SUMARSE SOBRE LA POSICIÓN DEL FOTOGRAMA ANTERIOR.
     * Un `position.x += …` se acumula indefinidamente y las piezas se van a la
     * deriva en vez de oscilar. Aquí la posición de reposo se recalcula entera
     * cada vez y la flotación se le suma al vuelo, así que no hay nada que
     * acumular: se escribe con `position.set`, nunca con `+=`.
     *
     * Y se apaga conforme cada pieza encaja —con SU propio avance, no con el
     * global—, porque una pieza ya montada que sigue meciéndose se lee como un
     * fallo y no como vida.
     */
    function aplicar(p: number, libre: number) {
      /* Ver SALIDA: dividir por la escala convierte el desplazamiento de unidades
         de letra a unidades de mundo, para que la distancia de partida no dependa
         del tamaño al que haya quedado la A en este viewport. */
      const salida = SALIDA / (grupo.scale.x || 1);
      for (const z of trozos) {
        const arranque = TURNOS > 1 ? (z.turno / (TURNOS - 1)) * DESFASE : 0;
        const propio = Math.max(0, Math.min(1, (p - arranque) / ventana));
        const e = 1 - Math.pow(1 - propio, 2.6);
        const fuera = salida * (1 - e);
        const suelta = reducido ? 0 : 1 - propio;
        const f = libre * z.vel + z.fase;
        z.nodo.position.set(
          z.dx * fuera + Math.sin(f) * 0.07 * suelta,
          z.dy * fuera + Math.sin(f * 1.31 + 1.1) * 0.09 * suelta,
          z.dz * fuera + Math.sin(f * 0.84 + 2.3) * 0.06 * suelta,
        );
        z.nodo.rotation.set(
          z.rx * (1 - e),
          z.ry * (1 - e),
          z.rz * (1 - e) + Math.sin(f * 0.62) * 0.05 * suelta,
        );
        /* El hormigón entra sobre el último tercio, cuando la pieza ya casi está
           en su sitio: primero se arma, después se materializa. */
        const materia = Math.max(0, Math.min(1, (e - 0.55) / 0.4));
        z.solido.material.opacity = materia;
        z.alambre.material.opacity = 0.75 * (1 - materia * 0.92);
        /*
         * ⚠ UN MATERIAL TRANSPARENTE SIGUE PROYECTANDO SOMBRA ENTERA: el mapa de
         * sombras no mira la opacidad. Sin esto se ve un borrón flotando debajo
         * de piezas que todavía son sólo alambre.
         */
        z.solido.castShadow = materia > 0.12;
      }
    }

    /*
     * ENCUADRE.
     *
     * La escala NO sale del ancho del viewport, que es de donde salía antes
     * (`min(1, w/1200) * 1.38` en el prototipo). Esa fórmula tenía dos fallos
     * medidos: en escritorio dejaba la A a 4 px de los dos bordes, y en teléfono
     * la encogía a un tercio del alto disponible. Es lo que pasa al dimensionar
     * por el ancho una figura cuya restricción es el alto.
     *
     * Aquí la A se ajusta a la BANDA LIBRE —entre la barra superior, medida del
     * DOM, y su reflejo por abajo— y se limita además por el ancho útil. Manda la
     * más restrictiva de las dos, así que en escritorio decide el alto y en
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

      const barra = document.querySelector(".altea-navbar")?.getBoundingClientRect().bottom ?? 0;
      const arriba = barra + AIRE;
      /* La reserva inferior REFLEJA la superior: no hay obstáculo abajo, pero
         dejar que la A crezca hasta el canto la devuelve a verse cayéndose. */
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
      /* En x, el recentrado por la caja real: la banderola sobresale por la
         derecha y el eje de la A ya no es su centro. Ver RECENTRADO_X. */
      grupo.position.x = esc * RECENTRADO_X;
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
      if (!reducido) libre += 0.0026;
      aplicar(est.ensamble, libre);
      /*
       * El balanceo ambiental vive SOLO durante el ensamble y se apaga conforme
       * la pieza se endereza. Si no se apagase, la posición final nunca quedaría
       * recta: seguiría oscilando con la A ya montada y de frente.
       */
      const resto = Math.min(1, Math.abs(est.giro) / 0.74);
      grupo.rotation.y = est.giro + Math.sin(libre * 1.1) * 0.13 * resto;
      grupo.rotation.x = est.alto + Math.sin(libre * 1.45) * 0.06 * resto;
      grupo.rotation.z = Math.sin(libre * 0.8) * 0.035 * resto;

      /*
       * LA SOMBRA LA MUEVE LA LUZ, Y SÓLO LA LUZ.
       *
       * Al final del recorrido la sombra se salía por abajo de la sección. Subir
       * la pieza lo arreglaba y descolocaba el encuadre, que está medido contra
       * la banda libre. Lo que viaja es la clave: de su posición de trabajo
       * —baja y lateral, que es la que modela el hormigón durante el ensamble— a
       * casi cenital. La distancia horizontal baja de 5.6 a 2.3, su elevación
       * sube de 38° a 76° y la sombra se acorta de 1.27x a 0.24x el alto de la
       * pieza. La A no se mueve ni un píxel.
       */
      const c = est.cenit;
      principal.position.set(
        LUZ_INICIO.x + (LUZ_FINAL.x - LUZ_INICIO.x) * c,
        LUZ_INICIO.y + (LUZ_FINAL.y - LUZ_INICIO.y) * c,
        LUZ_INICIO.z + (LUZ_FINAL.z - LUZ_INICIO.z) * c,
      );
      renderer.render(escena, camara);
    };
    listo = true;
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
