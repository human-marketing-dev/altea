import type { Unidad } from "@/lib/contacto";

/**
 * La forma del contenido de una página de unidad de negocio.
 *
 * Las cuatro —/comercial, /industrial, /vivienda, /forestal— son la MISMA página
 * (<PaginaUnidad>) con distinto contenido, y esto es lo único que cambia entre
 * ellas. Cada una tiene su archivo en contenido/, y la ruta se limita a pasarlo.
 *
 * ⚠ LA REGLA DE LAS LISTAS VACÍAS. Una sección cuya lista llega vacía NO SE
 * PINTA: ni con tarjetas de ejemplo ni con un hueco rotulado. Una sección que
 * falta se ve y se arregla; una con datos de relleno se queda en producción.
 * Lo mismo con las cifras del hero y con la banderola.
 */

/** Para una foto sin `ancla` medida. Ver el campo en Proyecto. */
export const ANCLA_POR_DEFECTO = 0.52;

/** Proporción de respaldo si una foto no declara la suya. */
export const RATIO_POR_DEFECTO = 1.5;

/** Una foto del hero calado. */
export interface FotoHero {
  foto: string;
  /** Ancho/alto del archivo, medido. Ver `fotoRatio` en Proyecto. */
  ratio: number;
  /**
   * Qué punto del ALTO de la foto cae en el centro de la ventana. Es una
   * corrección por archivo, no por unidad: ver `ancla` en Proyecto.
   */
  ancla: number;
}

/**
 * Los dos triángulos del logotipo de la unidad que cuelgan del vértice de la
 * palabra del hero. Son dos `path` sobre el mismo viewBox: el izquierdo recibe
 * la foto y el derecho va en el color de la unidad.
 */
export interface FormaBandera {
  viewBox: string;
  izquierda: string;
  derecha: string;
}

/** Un proyecto en desarrollo: tarjeta en "Próximos proyectos" y su ficha. */
export interface ProximoProyecto {
  slug: string;
  name: string;
  /** Lo que va de pie en la tarjeta y como "Unidad" en la ficha. */
  unit: string;
  /** Sin valor, la ficha pinta un guion: el copy no siempre la da. */
  location?: string;
  image?: string;
  /** Ancho/alto del archivo; la caja de la ficha la adopta. */
  fotoRatio?: number;
  descripcion?: string;
  /** Pares extra para la ficha, después de Unidad y Ubicación. */
  datos?: ParDato[];
}

export interface ContenidoUnidad {
  /** La unidad tal como la conoce el formulario y el cierre de contacto. */
  unidad: Unidad;
  metadata: { title: string; description: string };
  hero: {
    /**
     * La palabra calada. ⚠ El cuerpo es EL MISMO para las cuatro: ver el
     * comentario de .uni-hero__t en unidad.css antes de tocar nada.
     */
    palabra: string;
    /** Sin consumidor en la página; se conserva como copy de la unidad. */
    descripcion?: string;
    /** Segundos en cada foto. Con una sola foto no hay relevo. */
    segundos: number;
    fotos: FotoHero[];
    /**
     * El color de la unidad: la mitad derecha de la banderola y los signos de
     * las cifras. Sin valor, la banderola no se pinta y los signos van en el
     * color de la cifra. NO se rellena con el de otra unidad.
     */
    color?: string;
    /** Sin valor, la palabra va sola. */
    bandera?: FormaBandera;
  };
  /** Vacía: el hero se compone sin cifras, en la apertura y en el cierre. */
  cifras: Cifra[];
  proyectos: { titulo: string; lista: Proyecto[] };
  /** Sin `eyebrow`, la sección arranca en el título. */
  giros: { eyebrow?: string; titulo: string; nota?: string; bloques: Giro[] };
  marcas: {
    /** Interruptor propio de cada unidad. Ver el de Comercial. */
    mostrar: boolean;
    titulo: string;
    lista: Marca[];
  };
  proximos: { titulo: string; proyectos: ProximoProyecto[] };
}

export interface Cifra {
  /** Signo que va ANTES del número, en el color de la unidad. */
  prefijo?: string;
  /** El número, sin unidad ni signo, y sin formatear: lo cuenta <CountUp>. */
  valor: number;
  /** La unidad o el signo que va DESPUÉS, en el color de la unidad: "M", "%"… */
  signo?: string;
  /**
   * Va en el <dt>. Lo que oye un lector de pantalla es esto más el valor en
   * palabras, que lo arma <CountUp> a partir de prefijo, valor y signo: no hay
   * que escribirlo aparte.
   */
  etiqueta: string;
}

export interface Proyecto {
  id: string;
  nombre: string;
  ubicacion: string;
  foto?: string;
  /**
   * La proporción REAL del archivo, ancho/alto, medida del contenedor WebP.
   *
   * La caja de la ficha la adopta tal cual, así que `cover` no recorta nada. Va
   * en el contenido y no calculada porque el recorte se decide al pintar, antes
   * de que el navegador sepa cuánto mide la imagen: sin el dato de antemano la
   * caja tendría que esperar a la carga y la ficha daría un salto de alto.
   *
   * ⚠ SI SE CAMBIA UNA FOTO, HAY QUE MEDIRLA Y ACTUALIZAR ESTE NÚMERO. Un valor
   * que no corresponda al archivo devuelve el recorte, que es justo lo que esto
   * resuelve.
   */
  fotoRatio?: number;
  /**
   * Qué punto del ALTO de la foto se alinea con el centro de la ventana en el
   * hero calado. 0 es el borde de arriba, 1 el de abajo, 0.5 la foto centrada.
   *
   * ⚠ ES UNA CORRECCIÓN POR ARCHIVO Y NO PUEDE SER UNA CONSTANTE, igual que
   * `tinta` y `alza` en los logotipos del muro de marcas.
   *
   * La palabra calada no está en el centro vertical —las cifras la empujan hacia
   * arriba—, así que su banda cae en el tercio alto de la ventana. Con la foto
   * centrada, ese tercio es CIELO o LONA en casi todas: son tomas de
   * arquitectura con el edificio por debajo de la mitad. En Paseo Durango la
   * palabra quedaba ilegible, y el velo del 25 % no podía salvarla porque el
   * problema no era de contraste sino que ahí no había nada que enseñar.
   *
   * No hay un valor único posible: con 0.58 para todas, Durango quedaba bien y
   * Juárez se iba al estacionamiento. En una el edificio está abajo y en la otra
   * a media altura.
   *
   * EL SÍNTOMA DE UN ANCLA MAL PUESTA es que dentro de las letras se vea cielo o
   * asfalto en vez del edificio. Se mira renderizado, no se calcula.
   *
   * El margen donde moverse lo da SOBRE_CUBRE en HeroCalado: un `cover` a secas
   * deja unos 60 px de holgura vertical en una foto 3:2 sobre una ventana de
   * 900, y con eso no se desplaza nada.
   */
  ancla?: number;
  alt: string;
  label: string;
  descripcion: string;
  /**
   * Los pares del <dl> de la ficha, al menos uno. El PRIMERO es el formato
   * —Fashion Mall, Parque industrial…—: va de chapa en la tarjeta y abre la
   * ficha. Detrás de él la ficha pone la Ubicación, y luego el resto en orden.
   * En Comercial son exactamente dos (Formato y Visitantes); en Industrial el
   * resto son superficies, que varían por parque.
   */
  datos: [ParDato, ...ParDato[]];
}

export interface ParDato {
  etiqueta: string;
  /** `undefined` = dato que el copy no da; la ficha pinta un guion. */
  valor?: string;
}

export interface Giro {
  id: string;
  /** Ordinal grande al lado del texto, p. ej. "01". */
  numero: string;
  title: string;
  /** Sin descripción la lámina va sólo con el título: no se abre al pasar. */
  description?: string;
  /**
   * Sin foto la lámina va sobre ink (ver .uni-gr en la hoja). Es el caso de los
   * servicios de Forestal, que esperan sus iconos.
   */
  image?: string;
  alt?: string;
  /**
   * PENDIENTE — NO EXISTE TODAVÍA en ninguno de los tres. Versalitas cortas
   * bajo el título; algo como "Cuatro operaciones" o "Tránsito diario". Sin
   * valor, la fila no lo pinta y se compone igual.
   */
  subtitulo?: string;
  /**
   * PENDIENTE — NO EXISTE TODAVÍA en ninguno de los tres. Caja de remate al pie
   * del texto: una etiqueta corta y una frase con el dato. Sin valor, no se
   * pinta.
   */
  remate?: { etiqueta: string; frase: string };
}

export interface Marca {
  nombre: string;
  src: string;
  /**
   * Proporción ancho/alto DEL LIENZO. Es la que tiene el elemento <img>, así que
   * de ella salen los atributos width/height y el ancho que ocupa en la celda.
   *
   * Medida de los 32 archivos, no estimada: van de 0.94 (IMSS, más alto que
   * ancho) a 5.60 (Bodega Aurrera), con la celda en 1.67.
   */
  ratio: number;
  /**
   * Fracción del ALTO del lienzo que es tinta: 1 menos el margen transparente de
   * arriba y abajo. Va de 0.42 a 0.90 en los 32.
   *
   * El alto que se le pide al <img> se divide entre esto, porque lo que tiene que
   * medir lo mismo entre logotipos es la MANCHA, no el recuadro que la contiene.
   */
  tinta: number;
  /**
   * Proporción de la MANCHA, que no es la del lienzo. La diferencia llega a ser
   * grande: Banorte declara 5.14:1 y su tinta es 8.11:1; KFC declara 1.29 y su
   * tinta es 1.00 exacto.
   *
   * Es la que entra en la corrección óptica. Alimentarla con la del lienzo era el
   * error: corregía por la forma del archivo en vez de por la de la marca.
   */
  rTinta: number;
  /**
   * Subida vertical, en fracción del alto del propio logotipo. Negativo sube.
   *
   * ⚠ SÓLO LA LLEVAN LOS LOCKUPS APILADOS, y es una corrección de ALINEACIÓN, no
   * de tamaño. Son dos cosas distintas y conviene no confundirlas.
   *
   * En los 29 logotipos restantes el nombre de la marca ES el logotipo entero, así
   * que centrar el recuadro deja las letras sobre la línea media de la fila y todo
   * el muro se lee como un renglón. En tres —Bolerama, IMSS y KFC— el símbolo va
   * ENCIMA y el nombre debajo: centrar el recuadro deja el símbolo sobre la línea
   * y el nombre colgando por abajo, fuera del renglón.
   *
   * La prueba de que es alineación y no tamaño está en Boston Pizza: es igual de
   * alto y también es insignia más texto, pero ahí el símbolo va AL LADO, el nombre
   * cruza la línea, y nunca se vio mal.
   *
   * Los valores son la MITAD de lo que haría falta para poner el nombre justo sobre
   * la línea. Con la corrección entera el símbolo se va al borde superior de la
   * celda y la marca se ve despegada; con la mitad, el nombre llega al renglón y el
   * conjunto sigue dentro de su hueco. Comprobado renderizando el muro.
   */
  alza?: number;
  /**
   * Multiplicador de tamaño sobre el alto que le tocaría por fórmula. 1 = sin tocar.
   *
   * ⚠ ES UNA EXCEPCIÓN DELIBERADA AL TOPE DE BANDA, no un parche. Lo llevan los
   * tres logotipos que, ya con la geometría correcta, se seguían leyendo pequeños
   * en el muro: Bolerama, C&A, IMSS y KFC. Son marcas de mancha compacta y
   * encerrada —una insignia, un marco, una cubeta— y a igual alto pesan menos que
   * un wordmark que cruza la celda de lado a lado.
   *
   * El tope de banda los deja a todos clavados en el mismo alto, que es lo correcto
   * por defecto; estos cuatro lo rebasan un 30 %, afinado mirando el muro
   * renderizado y comprobando en el navegador que ninguno se sale de su hueco.
   *
   * ⚠ VA AQUÍ Y NO SUBIENDO --tope-banda. Subir el tope agrandaría CATORCE
   * logotipos —todos los que topan contra él— y sólo estos cuatro lo necesitan.
   *
   * Y OJO AL CRECER: subir la escala empuja el borde SUPERIOR hacia arriba aunque
   * el centro baje, así que cada vez que se mueve `escala` en un logotipo con
   * `alza` hay que revisar las dos juntas. Pasó con IMSS y KFC.
   */
  escala?: number;
}
