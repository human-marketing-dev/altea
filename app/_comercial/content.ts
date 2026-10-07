import { PROYECTOS } from "@/lib/proyectos";

/**
 * Contenido de la página de Comercial.
 *
 * Vive fuera de los componentes por la misma razón que en _home y _nosotros:
 * casi nada está confirmado por Altea y cambiarlo no debería ser tocar JSX.
 * Todo lo marcado PENDIENTE es provisional.
 */

const CENTROS = "/images/comercial/centros-comerciales";

/* ============================ 1 · Hero ============================= */

export interface DiapositivaHero {
  id: string;
  foto?: string;
  alt: string;
  label: string;
  dato: string;
  proyecto: string;
  ubicacion: string;
}

/**
 * ⚠ SIN CONSUMIDOR desde que el hero pasó de carrusel a una sola imagen.
 *
 * No se borra porque las cuatro entradas son datos reales de proyecto —foto,
 * nombre y ubicación— y el `dato` de Paseo La Fe sale de lib/proyectos.ts.
 *
 * El componente del carrusel SÍ se borró: si vuelve, hay que rehacerlo (está en
 * el historial de git, como SliderProyectos).
 *
 * PENDIENTE: de los siete centros sólo Paseo La Fe tiene datos documentados.
 * Para los otros seis la frase del pie está redactada aquí y hay que
 * confirmarla —o, mejor, llevar el dato a lib/proyectos.ts y leerlo de allí.
 */
/*
 * ⚠ SIN CONSUMIDOR, y lo estaba ya antes del rediseño: el slider del hero se
 * quitó hace varias iteraciones. Hoy las ocho fotos que lista las usa el hero
 * calado, pero las toma de PLAZAS, que es su fuente.
 */
export const HERO_DIAPOSITIVAS: DiapositivaHero[] = [
  {
    id: "paseo-la-fe",
    foto: `${CENTROS}/paseo-la-fe-altea.webp`,
    alt: "Paseo La Fe, centro comercial de Altea en San Nicolás, Nuevo León",
    label: "Paseo La Fe",
    dato: "34 locales comerciales y 94% de ocupación.",
    proyecto: "Paseo La Fe",
    ubicacion: "San Nicolás, Nuevo León",
  },
  {
    id: "paseo-durango",
    foto: `${CENTROS}/paseo-durango-altea.webp`,
    alt: "Paseo Durango, centro comercial de Altea",
    label: "Paseo Durango",
    /** PENDIENTE */
    dato: "Centro comercial regional en el corredor norte de la ciudad.",
    proyecto: "Paseo Durango",
    ubicacion: "Durango, Durango",
  },
  {
    id: "paseo-juarez",
    foto: `${CENTROS}/paseo-juarez-altea.webp`,
    alt: "Paseo Juárez, centro comercial de Altea",
    label: "Paseo Juárez",
    /** PENDIENTE */
    dato: "Mezcla de comercio, servicios y entretenimiento en un solo punto.",
    proyecto: "Paseo Juárez",
    ubicacion: "Ciudad Juárez, Chihuahua",
  },
  {
    id: "paseo-los-mochis",
    foto: `${CENTROS}/paseo-los-mochis-altea.webp`,
    alt: "Paseo Los Mochis, centro comercial de Altea",
    label: "Paseo Los Mochis",
    /** PENDIENTE */
    dato: "Ancla regional en una de las zonas de mayor crecimiento del estado.",
    proyecto: "Paseo Los Mochis",
    ubicacion: "Los Mochis, Sinaloa",
  },
];

/**
 * HERO CALADO.
 *
 * La palabra a tamaño de pantalla con la fotografía recortada dentro de las
 * letras, alternando entre las ocho plazas cada 4.2 s.
 *
 * `palabra` y no la frase larga: a ese cuerpo —de 48 a 240 px— la foto se lee
 * dentro de las letras, y con la frase completa las letras son tan chicas que la
 * imagen deja de distinguirse y el recorte no significa nada.
 *
 * Las fotos son LAS MISMAS ocho de PLAZAS, así que no hace falta material aparte.
 */
export const HERO_CALADO = {
  palabra: "Comercial",
  /* Confirmado por Altea, el mismo texto que llevaba el hero anterior. */
  descripcion:
    "Espacios que conectan personas, marcas y experiencias. Nuestros desarrollos reúnen marcas, servicios y entretenimiento en entornos diseñados para conectar con las comunidades.",
  /** Segundos en cada foto. */
  segundos: 4.2,
  pieDesliza: "Desliza",
};

/*
 * ⚠ SIN CONSUMIDOR desde el rediseño. <HeroUnidad> —la tarjeta de foto con la
 * ceja y el titular— lo sustituyó el hero calado de arriba, que usa las ocho
 * fotos de las plazas en vez de una propia. Se conserva porque el archivo
 * `altea-hero-comercial.webp` sigue en el repo y porque <HeroUnidad> lo siguen
 * usando /industrial, /vivienda y /forestal con su propio contenido.
 */
export const HERO_COMERCIAL = {
  ceja: "Comercial",
  /* Confirmado por Altea. */
  titulo: "Espacios que conectan personas, marcas y experiencias",
  /* Confirmado por Altea. */
  descripcion:
    "Nuestros desarrollos comerciales reúnen marcas, experiencias, servicios y entretenimiento en entornos diseñados para conectar con las comunidades y responder a la evolución de cada ciudad.",
  foto: {
    /* Casi cuadrada (2565×2613): la tarjeta se ajusta a SU proporción en vez de
       forzarla a 4/3, que le recortaba el 26% del alto. */
    src: "/images/comercial/altea-hero-comercial.webp",
    alt: "Centro comercial de Altea",
    label: "Imagen del hero de Comercial",
  },
};

/* ====================== 2 · Banda a todo lo ancho ================== */

/*
 * ⚠ SIN CONSUMIDOR. La banda de imagen a todo lo ancho se quitó de la página.
 * Se conserva la referencia a la foto porque el archivo sigue en el repo y lo usa
 * también el bloque "ecosistemas" de /nosotros; si la banda no vuelve, esta
 * constante se puede borrar sin tocar nada más.
 */
export const BANDA_COMERCIAL = {
  foto: "/images/comercial/galeria/galeria-altea-1.webp",
  alt: "",
  label: "Imagen de banda",
};

/* ============================ 3 · Cifras =========================== */

/*
 * Derivadas de lib/proyectos.ts, NO escritas a mano: si mañana entra un centro
 * más, la cifra sube sola. `descripcion` es lo único que distingue un centro
 * comercial del aeropuerto, que también está en la lista y no es de esta unidad.
 */
const CENTROS_COMERCIALES = PROYECTOS.filter((p) =>
  p.descripcion?.startsWith("Centro comercial"),
);
const ESTADOS_COMERCIAL = new Set(CENTROS_COMERCIALES.map((p) => p.estado));

export interface Cifra {
  /** Signo que va ANTES del número, en coral. */
  prefijo?: string;
  /** El número, sin unidad ni signo, y sin formatear: lo cuenta <CountUp>. */
  valor: number;
  /** La unidad o el signo que va DESPUÉS, en coral: "M", "%"… */
  signo?: string;
  etiqueta: string;
  /** Lo que lee el lector de pantalla: la cifra entera, sin partir. */
  lectura: string;
}

/*
 * Las tres, confirmadas por Altea.
 *
 * ⚠ Ojo con dos coincidencias que NO son la misma cosa:
 *   · El 34 de aquí son INMUEBLES comerciales del portafolio. En
 *     lib/proyectos.ts, el 34 de Paseo La Fe son sus LOCALES. Números iguales,
 *     unidades distintas.
 *   · El 94% de ocupación coincide con el que lib/proyectos.ts atribuye sólo a
 *     Paseo La Fe. Aquí es la tasa del portafolio.
 * No se derivan de lib/proyectos.ts: allí hay 8 proyectos con ficha, no 34
 * inmuebles, así que contarlos daría otro número.
 */
export const CIFRAS_COMERCIAL: Cifra[] = [
  {
    prefijo: "+",
    valor: 3,
    signo: "M",
    etiqueta: "de visitantes al mes",
    lectura: "Más de 3 millones de visitantes al mes",
  },
  {
    valor: 34,
    etiqueta: "inmuebles comerciales",
    lectura: "34 inmuebles comerciales",
  },
  {
    valor: 94,
    signo: "%",
    etiqueta: "Tasa de ocupación",
    lectura: "94 por ciento de tasa de ocupación",
  },
];


/* ====================== 4 · Descripción de la unidad =============== */

/**
 * Números pequeños en palabras.
 *
 * Existe para que el remate del relato NO lleve las cifras escritas a mano: se
 * derivan de lib/proyectos.ts igual que las de la sección de datos duros, así
 * que si entra un centro nuevo las dos suben juntas y el párrafo no se queda
 * mintiendo. Escribir "siete" a pelo era exactamente la forma de que se
 * desincronizaran.
 *
 * Cubre del cero al veinte, que es de sobra para lo que cuenta este sitio —hoy
 * son 7 y 5—. Por encima devuelve el dígito, que se lee peor pero nunca miente.
 */
const EN_LETRAS = [
  "cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho",
  "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis",
  "diecisiete", "dieciocho", "diecinueve", "veinte",
];
const enLetras = (n: number) => EN_LETRAS[n] ?? String(n);

export const DESCRIPCION_COMERCIAL = {
  /**
   * PENDIENTE: el texto sigue sin confirmar por Altea, y la partición en
   * etiqueta, frase de apertura y cuerpo es una composición nuestra.
   */
  eyebrow: "Nuestro modelo",

  /* El acento va aparte para pintarlo en coral-dark. Los espacios viven DENTRO
     de las cadenas para que la frase copiada salga entera. */
  apertura: {
    antes: "Centros que ",
    acento: "ordenan la vida",
    despues: " de su zona.",
  },

  /** PENDIENTE */
  parrafos: [
    "Un centro comercial de Altea no se planta sobre un terreno disponible: se coloca donde la ciudad ya está creciendo y le falta un punto de encuentro. Primero se lee el tejido —cuánta vivienda hay alrededor, qué servicios faltan, por dónde pasa la gente— y de ahí sale la mezcla de locales.",
    "Operamos lo que desarrollamos. Eso cambia las decisiones: la ocupación no es un número de cierre de obra sino algo que se sostiene año con año, y el trato con los inquilinos es una relación larga, no una venta.",
  ],

  /* Las dos cifras salen de las MISMAS constantes que alimentan CIFRAS_COMERCIAL. */
  cierre: `Hoy son ${enLetras(CENTROS_COMERCIALES.length)} centros en ${enLetras(
    ESTADOS_COMERCIAL.size,
  )} estados, con anclas nacionales y comercio local conviviendo en la misma plaza.`,
};

/* ====================== 5 · Galería de plazas ====================== */

export interface Plaza {
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
  alt: string;
  label: string;
  descripcion: string;
  /** Exactamente dos pares para el <dl> de la ficha. */
  datos: [ParDato, ParDato];
}

export interface ParDato {
  etiqueta: string;
  /** `undefined` = dato que el copy no da; la ficha pinta un guion. */
  valor?: string;
}

/**
 * Las ocho plazas, con el copy confirmado por Altea.
 *
 * Los dos pares del <dl> salen del propio texto: el FORMATO —Fashion Mall,
 * Street Mall o Power Center, que el copy declara en la primera frase de cada
 * una— y los VISITANTES, que sólo da para Paseo La Fe y Paseo Juárez. Donde no
 * hay cifra va un guion, no un número inventado.
 *
 * ⚠ Paseo Tec entra por fin: estaba fuera esperando confirmación y este copy la
 * da. Su archivo de imagen se llama `paso-tec-altea.webp` —sin la "e"—, que es
 * una errata de origen que no toco.
 *
 * ⚠ Dos ubicaciones que el copy corrige respecto al repo: Punto Río Nilo está en
 * TONALÁ, no en Guadalajara, y Punto Huinalá lleva acento.
 */
export const PLAZAS: Plaza[] = [
  {
    id: "paseo-la-fe",
    nombre: "Paseo La Fe",
    ubicacion: "San Nicolás, Nuevo León",
    foto: `${CENTROS}/paseo-la-fe-altea.webp`,
    /* 2000x1332 */
    fotoRatio: 1.5015,
    alt: "",
    label: "Paseo La Fe",
    descripcion:
      "Fashion Mall ubicado sobre Av. Miguel Alemán, principal vía de acceso al Aeropuerto Internacional de Monterrey, en San Nicolás de los Garza, Nuevo León. Cuenta con una afluencia de 1 millón de visitantes al mes, consolidándose como uno de los principales destinos comerciales de entretenimiento y experiencias de la zona metropolitana de Monterrey.",
    datos: [
      { etiqueta: "Formato", valor: "Fashion Mall" },
      { etiqueta: "Visitantes", valor: "1 millón al mes" },
    ],
  },
  {
    id: "paseo-tec",
    nombre: "Paseo Tec",
    ubicacion: "Monterrey, Nuevo León",
    foto: `${CENTROS}/paso-tec-altea.webp`,
    /* 2000x1332 */
    fotoRatio: 1.5015,
    alt: "",
    label: "Paseo Tec",
    descripcion:
      "Street Mall ubicado sobre Av. Eugenio Garza Sada, en Distrito Tec, al sur de Monterrey, Nuevo León y a pocos minutos del centro de la ciudad. Su propuesta integra comercio, gastronomía, entretenimiento y servicios para diferentes necesidades. El desarrollo también cuenta con el hotel Fiesta Inn y el salón de eventos GRAND 2411, consolidándose como un punto de encuentro que complementa la vida urbana de la zona Tec.",
    datos: [
      { etiqueta: "Formato", valor: "Street Mall" },
      { etiqueta: "Visitantes", valor: undefined },
    ],
  },
  {
    id: "paseo-juarez",
    nombre: "Paseo Juárez",
    ubicacion: "Juárez, Nuevo León",
    foto: `${CENTROS}/paseo-juarez-altea.webp`,
    /* 2000x1332 */
    fotoRatio: 1.5015,
    alt: "",
    label: "Paseo Juárez",
    descripcion:
      "Fashion Mall ubicado en el centro de Juárez, Nuevo León, que recibe más de 650 mil visitantes al mes. Su oferta comercial reúne marcas reconocidas como Walmart, Cinemex, Suburbia, Coppel y Del Sol, además de una amplia variedad de tiendas, servicios y opciones de entretenimiento, consolidándose como un punto de encuentro para la comunidad de Juárez.",
    datos: [
      { etiqueta: "Formato", valor: "Fashion Mall" },
      { etiqueta: "Visitantes", valor: "+650 mil al mes" },
    ],
  },
  {
    id: "paseo-durango",
    nombre: "Paseo Durango",
    ubicacion: "Durango, Durango",
    foto: `${CENTROS}/paseo-durango-altea.webp`,
    /* 2000x1333 */
    fotoRatio: 1.5004,
    alt: "",
    label: "Paseo Durango",
    descripcion:
      "Fashion Mall ubicado sobre Blvd. Felipe Pescador, en la zona centro de Durango, Durango. Único Fashion Mall de la ciudad, cuenta con marcas como Liverpool, Sears y Play City Casino, además de una amplia oferta comercial, de entretenimiento y servicios que lo convierte en uno de los principales destinos de la ciudad.",
    datos: [
      { etiqueta: "Formato", valor: "Fashion Mall" },
      { etiqueta: "Visitantes", valor: undefined },
    ],
  },
  {
    id: "paseo-los-mochis",
    nombre: "Paseo Los Mochis",
    ubicacion: "Los Mochis, Sinaloa",
    foto: `${CENTROS}/paseo-los-mochis-altea.webp`,
    /* 2000x1042 */
    fotoRatio: 1.9194,
    alt: "",
    label: "Paseo Los Mochis",
    descripcion:
      "Fashion Mall ubicado entre Av. Rosales y Blvd. Centenario, en Los Mochis, Sinaloa. Es el único Fashion Mall de la ciudad y cuenta con una oferta comercial y de entretenimiento encabezada por marcas como Liverpool, Sears y Cinemex, consolidándose como uno de los principales destinos para compras, servicios y experiencias en Los Mochis.",
    datos: [
      { etiqueta: "Formato", valor: "Fashion Mall" },
      { etiqueta: "Visitantes", valor: undefined },
    ],
  },
  {
    id: "paseo-gomez-palacio",
    nombre: "Paseo Gómez Palacio",
    ubicacion: "Gómez Palacio, Durango",
    foto: `${CENTROS}/paseo-gomez-palacio-altea.webp`,
    /* 2000x1116 */
    fotoRatio: 1.7921,
    alt: "",
    label: "Paseo Gómez Palacio",
    descripcion:
      "Fashion Mall ubicado en la región de La Laguna, en Gómez Palacio, Durango. Es el centro comercial más nuevo de nuestro portafolio y el único Fashion Mall de la ciudad. Cuenta con marcas como Cinemex, Suburbia y Del Sol, además de una amplia oferta comercial, de entretenimiento y servicios que lo convierten en un nuevo punto de encuentro para la comunidad.",
    datos: [
      { etiqueta: "Formato", valor: "Fashion Mall" },
      { etiqueta: "Visitantes", valor: undefined },
    ],
  },
  {
    id: "punto-huinala",
    nombre: "Punto Huinalá",
    ubicacion: "Apodaca, Nuevo León",
    foto: `${CENTROS}/punto-huinala-altea.webp`,
    /* 2000x1146 */
    fotoRatio: 1.7452,
    alt: "",
    label: "Punto Huinalá",
    descripcion:
      "Power Center ubicado en el cruce de Carretera Miguel Alemán y Carretera Huinalá, en Apodaca, Nuevo León. Su ubicación ofrece una conexión privilegiada con el Aeropuerto Internacional de Monterrey y uno de los principales corredores industriales de la zona, mientras que su oferta comercial está encabezada por Bodega Aurrera y Cinépolis, complementada por diversos comercios y servicios.",
    datos: [
      { etiqueta: "Formato", valor: "Power Center" },
      { etiqueta: "Visitantes", valor: undefined },
    ],
  },
  {
    id: "punto-rio-nilo",
    nombre: "Punto Río Nilo",
    ubicacion: "Tonalá, Jalisco",
    foto: `${CENTROS}/punto-rio-nilo.webp`,
    /* 2000x1333 */
    fotoRatio: 1.5004,
    alt: "",
    label: "Punto Río Nilo",
    descripcion:
      "Power Center ubicado sobre Av. Río Nilo, en Tonalá, Jalisco. Su oferta está encabezada por Walmart y Cinépolis, complementada por una variedad de comercios y servicios.",
    datos: [
      { etiqueta: "Formato", valor: "Power Center" },
      { etiqueta: "Visitantes", valor: undefined },
    ],
  },
];

/*
 * PENDIENTE — Paso Tec. Hay foto en
 * /images/comercial/centros-comerciales/paso-tec-altea.webp, pero el proyecto
 * NO está en lib/proyectos.ts y Altea no lo ha confirmado. Fuera de la lista
 * hasta entonces; para publicarlo basta con volver a añadir su entrada:
 *
 *   {
 *     id: "paso-tec",
 *     nombre: "Paso Tec",
 *     ubicacion: "Monterrey, Nuevo León",
 *     foto: `${CENTROS}/paso-tec-altea.webp`,
 *     alt: "",
 *     label: "Paso Tec",
 *     datos: [{ etiqueta: "Formato", valor: "Centro comercial" }],
 *   },
 *
 * Y con él, el alta en lib/proyectos.ts — que es de donde salen las cifras.
 */

export const GALERIA_PLAZAS = {
  /** PENDIENTE */
  titulo: "Nuestras plazas comerciales",
  plazas: PLAZAS,
};

/* ============== 6 · Hoteles, hospital y educación ================== */

const OTROS = "/images/comercial";

export interface Giro {
  id: string;
  /** Ordinal grande al lado del texto, p. ej. "01". */
  numero: string;
  title: string;
  description: string;
  image: string;
  alt: string;
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

/*
 * Los tres tienen número, título, descripción y foto. Les faltan `subtitulo` y
 * `remate`, que van marcados opcionales a propósito: montarlos con texto
 * inventado sería peor que no tenerlos.
 */
const GIROS: Giro[] = [
    {
      id: "hoteles",
      numero: "01",
      title: "Hoteles",
      description:
        "Desarrollamos hoteles de marcas reconocidas integrados en nuestros centros comerciales, para convertirlos en destinos más completos y funcionales. Fiesta Inn Durango, Fiesta Inn Tec, One Hotels y NH Hotels, en distintos puntos de la República Mexicana.",
      image: `${OTROS}/hoteles/fiesta-inn-tec-altea.webp`,
      alt: "Fiesta Inn dentro de un desarrollo de Altea",
    },
    {
      id: "hospital",
      numero: "02",
      title: "Hospital",
      description:
        "En el Sierra Madre integramos infraestructura nueva con las instalaciones existentes, atendiendo los requerimientos técnicos y operativos de un hospital moderno para entregarlo listo para operar desde el primer día. Espacios especializados que exigen los más altos estándares de planeación y tecnología.",
      image: `${OTROS}/hospital-y-educacion/hospital-altea.webp`,
      alt: "Hospital dentro de un desarrollo de Altea",
    },
    {
      id: "educacion",
      numero: "03",
      title: "Educación",
      description:
        "Tálisis es infraestructura educativa en el centro de Monterrey, para la creciente demanda de espacios académicos del entorno urbano: coworking académico, laboratorios especializados y espacios modulares adaptables a distintas necesidades pedagógicas.",
      image: `${OTROS}/hospital-y-educacion/educacion-altea.webp`,
      alt: "Centro educativo dentro de un desarrollo de Altea",
    },
];

export const OTROS_GIROS = {
  /** PENDIENTE */
  eyebrow: "Otros giros",
  /** PENDIENTE */
  titulo: "Hoteles, hospital y educación dentro de nuestros desarrollos",
  /**
   * PENDIENTE — NO EXISTE. Nota corta a la derecha de la cabecera, alineada
   * abajo. No la inventé: sin valor, la cabecera se compone sin ella y el
   * encabezado ocupa el ancho que le haga falta.
   */
  nota: undefined as string | undefined,
  bloques: GIROS,
};

/* ====================== 7 · Marcas de comercial ==================== */

/**
 * Interruptor de la sección de marcas de comercial.
 *
 * Propio, NO el MOSTRAR_MARCAS de lib/marcas.ts: aquél gobierna la sección de
 * clientes de la portada y de /nosotros, y son decisiones distintas.
 *
 * ⚠⚠ ENCENDIDA SÓLO PARA EL DEMO. HAY QUE APAGARLA ANTES DE PUBLICAR. ⚠⚠
 *
 * Usar marcas ajenas implica endoso. Lo normal es que lo cubra el contrato de
 * arrendamiento, pero ALTEA TODAVÍA NO LO HA CONFIRMADO POR ESCRITO. Está en
 * `true` para que la sección se vea al enseñar la página, no porque el permiso
 * exista. Si esto sale a producción sin la confirmación, el riesgo es de Altea
 * pero el problema es nuestro.
 */
export const MOSTRAR_MARCAS_COMERCIAL = true;

/**
 * Encabezado del muro. Vivía escrito en la llamada de la página; aquí es
 * contenido, que es donde le toca.
 */
export const TITULO_MARCAS = "Marcas que operan en nuestros centros";

const MARCAS_DIR = "/images/comercial/logos-marcas";

export interface MarcaComercial {
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

/**
 * EL MURO DE MARCAS: 32, en ocho columnas de cuatro filas.
 *
 * Son 32 y no las 34 que hay en disco. La carpeta trae 36 archivos, de los que
 * dos son duplicados —`old-navy-logo-black-2` y `suburbia-logo-black-2`— y de los
 * 34 restantes quedan fuera Hospital Sierra Madre y Tálisis: no son marcas
 * inquilinas sino desarrollos de Altea, y ya salen en "Otros giros". 32 llena
 * además las cuatro filas exactas de la rejilla.
 *
 * ⚠ PENDIENTE LEGAL, el mismo de lib/marcas.ts: usar marcas ajenas implica
 * endoso. Normalmente lo cubre el contrato de arrendamiento, pero hay que
 * confirmarlo antes de publicar.
 *
 * Los archivos son negro sobre transparente, así que el gris de la rejilla sale
 * de la opacidad y no del grayscale — lo mismo que en Grupo Firma.
 */
export const MARCAS_COMERCIAL: MarcaComercial[] = [
  { nombre: "Banorte", src: `${MARCAS_DIR}/banorte-logo-black.webp`, ratio: 5.14, tinta: 0.577, rTinta: 8.11 },
  { nombre: "Bershka", src: `${MARCAS_DIR}/bershka-logo-black.webp`, ratio: 3.40, tinta: 0.557, rTinta: 4.53 },
  { nombre: "Bodega Aurrera", src: `${MARCAS_DIR}/bodega-aurrera-logo-black.webp`, ratio: 5.62, tinta: 0.831, rTinta: 6.07 },
  { nombre: "Bolerama", src: `${MARCAS_DIR}/bolerama-logo-black.webp`, ratio: 1.29, tinta: 0.799, rTinta: 1.01, alza: -0.06, escala: 1.3 },
  { nombre: "Boston Pizza", src: `${MARCAS_DIR}/boston-pizza-logo-black.webp`, ratio: 2.90, tinta: 0.714, rTinta: 3.63 },
  { nombre: "C&A", src: `${MARCAS_DIR}/c-and-a-logo-black.webp`, ratio: 1.21, tinta: 0.821, rTinta: 1.3, escala: 1.3 },
  { nombre: "Calvin Klein", src: `${MARCAS_DIR}/calvin-klein-logo-black.webp`, ratio: 4.00, tinta: 0.549, rTinta: 6.18 },
  { nombre: "Carl's Jr.", src: `${MARCAS_DIR}/carlos-jr-logo-black.webp`, ratio: 3.21, tinta: 0.893, rTinta: 3.28 },
  { nombre: "Chuck E. Cheese", src: `${MARCAS_DIR}/chuck-e-cheese-logo-black.webp`, ratio: 4.50, tinta: 0.854, rTinta: 4.88 },
  { nombre: "Cinemex", src: `${MARCAS_DIR}/cinemex-logo-black.webp`, ratio: 3.75, tinta: 0.714, rTinta: 4.57 },
  { nombre: "Cinépolis", src: `${MARCAS_DIR}/cinepolis-logo-black.webp`, ratio: 4.09, tinta: 0.861, rTinta: 4.44 },
  { nombre: "Fiesta Inn", src: `${MARCAS_DIR}/fiesta-inn-logo-black.webp`, ratio: 3.33, tinta: 0.889, rTinta: 3.12 },
  { nombre: "Firehouse Subs", src: `${MARCAS_DIR}/firehouse-subs-logo-black.webp`, ratio: 2.77, tinta: 0.717, rTinta: 3.36 },
  { nombre: "H&M", src: `${MARCAS_DIR}/h-and-m-logo-black.webp`, ratio: 1.36, tinta: 0.73, rTinta: 1.51 },
  { nombre: "Happyland", src: `${MARCAS_DIR}/happyland-logo-black.webp`, ratio: 4.62, tinta: 0.595, rTinta: 7.14 },
  { nombre: "Helados Dreambox", src: `${MARCAS_DIR}/helados-dreambox-logo-black.webp`, ratio: 3.53, tinta: 0.67, rTinta: 4.36 },
  { nombre: "IHOP", src: `${MARCAS_DIR}/ihop-logo-black.webp`, ratio: 2.14, tinta: 0.834, rTinta: 1.89 },
  { nombre: "IMSS", src: `${MARCAS_DIR}/imss-logo-black.webp`, ratio: 0.94, tinta: 0.784, rTinta: 0.81, alza: -0.05, escala: 1.3 },
  { nombre: "INE", src: `${MARCAS_DIR}/ine-logo-black.webp`, ratio: 3.05, tinta: 0.739, rTinta: 3.25 },
  { nombre: "Innova Sport", src: `${MARCAS_DIR}/innova-sport-logo-black.webp`, ratio: 1.54, tinta: 0.812, rTinta: 1.62 },
  { nombre: "KFC", src: `${MARCAS_DIR}/kfc-logo-black.webp`, ratio: 1.29, tinta: 0.837, rTinta: 1, alza: -0.06, escala: 1.3 },
  { nombre: "Liverpool", src: `${MARCAS_DIR}/liverpool-logo-black.webp`, ratio: 2.77, tinta: 0.754, rTinta: 3.39 },
  { nombre: "Miniso", src: `${MARCAS_DIR}/miniso-logo-black.webp`, ratio: 3.75, tinta: 0.698, rTinta: 4.78 },
  { nombre: "Office Depot", src: `${MARCAS_DIR}/office-depot-logo-black.webp`, ratio: 2.34, tinta: 0.81, rTinta: 2.21 },
  { nombre: "Old Navy", src: `${MARCAS_DIR}/old-navy-logo-black.webp`, ratio: 3.40, tinta: 0.975, rTinta: 3.06 },
  { nombre: "Pandora", src: `${MARCAS_DIR}/pandora-logo-black.webp`, ratio: 4.39, tinta: 0.731, rTinta: 4.74 },
  { nombre: "Pull&Bear", src: `${MARCAS_DIR}/pull-and-bear-logo-black.webp`, ratio: 3.75, tinta: 0.528, rTinta: 6.42 },
  { nombre: "Sephora", src: `${MARCAS_DIR}/sephora-logo-black.webp`, ratio: 3.40, tinta: 0.401, rTinta: 7.57 },
  { nombre: "Suburbia", src: `${MARCAS_DIR}/suburbia-logo-black.webp`, ratio: 3.33, tinta: 0.774, rTinta: 3.89 },
  { nombre: "Tim Hortons", src: `${MARCAS_DIR}/tim-hortons-logo-black.webp`, ratio: 3.67, tinta: 0.605, rTinta: 5.07 },
  { nombre: "Ulta Beauty", src: `${MARCAS_DIR}/ulta-beauty-logo-black.webp`, ratio: 2.19, tinta: 0.771, rTinta: 2.47 },
  { nombre: "Walmart", src: `${MARCAS_DIR}/walmart-logo-black.webp`, ratio: 2.95, tinta: 0.86, rTinta: 3.02 },
];

/*
 * Los logos los pone <Marcas> por defecto, desde lib/marcas.ts — los mismos
 * "clientes actuales" del resto del sitio.
 *
 * PENDIENTE: son provisionales y Altea va a sustituirlos por los inquilinos
 * reales de las plazas. Cuando lleguen, el sitio donde cambiarlos es
 * lib/marcas.ts, no aquí, y ahí habrá que decidir si los cuatro logos
 * industriales que trae la lista —Mazda, CEVA, Viakable, Güntner— siguen
 * teniendo sentido en una página de centros comerciales.
 */


/* ====================== 8 · Próximos proyectos ===================== */

const PROXIMOS = "/images/comercial/proximos-proyectos";

/**
 * Tres, que es exactamente lo que cabe en una banda junto al titular. Con
 * <ProyectosPaneles> no hace falta forzar una segunda: sin sobrantes no se
 * dibuja.
 */
/**
 * Tres, que es exactamente lo que cabe en una banda junto al titular.
 *
 * ⚠ El copy sólo trae DOS descripciones —la ampliación de Paseo La Fe y Punto
 * López Mateos—. Punto La Pastora se queda sin la suya, con el campo vacío: la
 * ficha se compone sin ella. Si ese proyecto ya no va en la lista, se borra su
 * entrada y <ProyectosPaneles> monta dos paneles sin dejar huecos.
 */
export const PROXIMOS_PROYECTOS = {
  titulo: "Próximos\nproyectos",
  proyectos: [
    {
      slug: "paseo-la-fe-ampliacion",
      name: "Paseo La Fe · Ampliación",
      unit: "Ampliación",
      location: "San Nicolás, Nuevo León",
      image: `${PROXIMOS}/paseo-la-fe-altea-proximo.webp`,
      descripcion:
        "El proyecto contempla un Master Plan integral dividido en tres etapas que ampliará la oferta comercial de servicios, entretenimiento y vivienda dentro de un mismo ecosistema urbano. Como parte de esta evolución, destaca la llegada del Acuario Michin así como la incorporación futura de componentes hoteleros, hospitalarios y residenciales. El desarrollo contempla más de 36 mil m² adicionales de expansión comercial y de entretenimiento, así como cerca de 19 mil m² de área rentable para el Acuario.",
    },
    {
      slug: "punto-lopez-mateos",
      name: "Punto López Mateos",
      unit: "Comercial",
      location: "Zapopan, Jalisco",
      image: `${PROXIMOS}/punto-lopez-mateos-altea-proximo.webp`,
      descripcion:
        "La ampliación comercial de Punto López Mateos surge como una intervención destinada a fortalecer y ampliar la oferta comercial del conjunto, donde actualmente se encuentra BBVA, así como la incorporación de nuevos establecimientos como Firehouse y Dreambox. El proyecto busca revitalizar el conjunto y amplificar la diversidad de usos disponibles para los visitantes, dentro de una propuesta arquitectónica renovada y funcional.",
    },
    {
      slug: "punto-la-pastora",
      name: "Punto La Pastora",
      unit: "Comercial",
      /** PENDIENTE: el copy de Altea no trajo descripción para este. */
      location: "Guadalupe, Nuevo León",
      image: `${PROXIMOS}/punto-la-pastora-altea-proximo.webp`,
    },
  ],
};

/* ============================== 9 · CTA ============================ */

/**
 * PENDIENTE: ni un solo teléfono ni correo está confirmado. Mientras falten,
 * el campo va sin valor y <LeadCTA> pinta un guion — un `tel:` a un número
 * inventado marca de verdad.
 */
/**
 * ⚠ SIN CONSUMIDOR. Los cuatro canales alimentaban la prop `canales` de
 * <LeadCTA>, que se sustituyó por <CierreContacto> en las seis páginas — y ése
 * no lleva formulario ni listado de canales.
 *
 * No se borra: los cuatro giros de atención son información real de Altea, y en
 * cuanto lleguen los teléfonos y correos hay dónde ponerlos. El sitio natural
 * ahora sería /contacto.
 */
/*
 * ⚠ SIN CONSUMIDOR. Eran los cuatro canales de atención de la sección de
 * captación, que se sustituyó por <CierreContacto> en las seis rutas. Los
 * teléfonos y correos siguen PENDIENTES de Altea.
 */
export const CANALES_COMERCIAL = [
  { nombre: "Renta de islas" },
  { nombre: "Renta de locales" },
  { nombre: "Renta de espacios publicitarios" },
  { nombre: "Venta de inmuebles" },
];
