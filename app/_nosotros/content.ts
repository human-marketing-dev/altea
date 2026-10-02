import { ESTADOS_CON_PRESENCIA, PRESENCIA_INTERNACIONAL } from "@/lib/proyectos";

/**
 * Página NOSOTROS, rediseñada.
 *
 *   1. hero — la nube de puntos      5. pilares de identidad
 *   2. origen                        6. quiénes somos (acordeón)
 *   3. Grupo Firma                   7. responsabilidad social
 *   4. nuestra huella
 *
 * Lo marcado PENDIENTE es texto provisional, no confirmado por Altea.
 *
 * Se fueron con el rediseño: BANNER (el copy del hero por capas),
 * QUE_HACEMOS_INTRO y su interruptor, MOSTRAR_GRUPO_FIRMA —la sección ya tiene
 * contenido real, así que no hay nada que esconder—, MOSTRAR_LEAD_NOSOTROS, la
 * interfaz BloqueQuienesSomos y la fotografía de ORIGEN.
 */


/* ─── 1 · Hero: la nube de puntos ──────────────────────────────────────── */

export const HERO = {
  /**
   * El titular, partido en las líneas que se revelan por separado. El aria-label
   * del <h1> se calcula uniéndolas, así que lo que se lee en voz alta y lo que se
   * ve no pueden separarse.
   */
  lineas: [
    [{ texto: "Transformamos" }],
    [{ texto: "territorio en" }],
    [{ texto: "oportunidades", acento: true }],
  ] as { texto: string; acento?: boolean }[][],
  bajada:
    "Somos una desarrolladora inmobiliaria integral ubicada en Monterrey, Nuevo León, con sólida experiencia y una vasta reserva territorial. Desarrollamos, ejecutamos y operamos proyectos comerciales, industriales, de vivienda, salud, educación y turismo bajo una misma visión.",
  /**
   * El rótulo del pie cambia con la forma que está mostrando la nube. Son dos
   * lecturas del mismo dato: la A habla de territorio, la pirámide de tiempo.
   */
  pie: {
    isotipo: `${ESTADOS_CON_PRESENCIA.length} estados · ${PRESENCIA_INTERNACIONAL.length + 1} países`,
    piramide: "Cuatro décadas construyendo",
  },
};

export const ORIGEN = {
  title: "¿Cómo nació Altea?",

  /**
   * La frase de apertura, partida para poder acentuar "40 años".
   *
   * Es el ÚNICO sitio de la página donde el texto se enciende palabra por
   * palabra. Repetirlo en otra sección lo convierte en un tic — en el home pasa
   * lo mismo con la frase de entrada y el emblema, y no más.
   */
  frase: [
    { texto: "Más de" },
    { texto: "40 años", acento: true },
    { texto: "transformando metros cuadrados en oportunidades." },
  ] as { texto: string; acento?: boolean }[],

  parrafos: [
    "En Altea contamos con más de 40 años de experiencia en el desarrollo inmobiliario en México. Nuestros orígenes se remontan a ser propietarios de cines, donde iniciamos nuestra trayectoria desarrollando espacios de entretenimiento y adquiriendo una experiencia que con el tiempo nos permitió ampliar nuestra visión y capacidades.",
    "Gracias a nuestra constante evolución y adaptación, en Altea seguimos construyendo el futuro con el mismo compromiso de nuestros inicios: generar valor, calidad y oportunidades en cada metro cuadrado que transformamos.",
  ],

  /*
   * Sin fotografía: el rediseño de Origen es puramente tipográfico —rótulo,
   * frase grande, regla y dos columnas—, así que el hueco desapareció. Antes
   * llevaba Paseo La Fe prestado de /comercial, que ni era de los cines del
   * relato ni había otra cosa en el repositorio.
   */
};


/**
 * Interruptor del bloque de captación en /nosotros.
 *
 * En `false` por decisión de contenido, no por diseño: la página termina en
 * Responsabilidad social y va directo al pie. Apagado y no borrado — el
 * componente <LeadCTA> lo siguen montando las otras CINCO rutas (home,
 * comercial, industrial, vivienda y forestal), así que reactivarlo aquí es
 * cambiar este `false` por `true`.
 */

/**
 * Altea forma parte de Grupo Firma.
 *
 * ⚠ PENDIENTE DE CONTENIDO — TODO. Altea no ha entregado título, texto ni
 * imagen. La estructura ya está montada, así que rellenar esto es lo único que
 * falta; el componente no cambia.
 */
/** Una sub-marca. Con `categoria`, la lleva encima; sin ella, va suelta. */
export interface SubMarca {
  nombre: string;
  /** Sólo Deportes la necesita: Béisbol sobre Sultanes, Básquetbol sobre Fuerza
   *  Regia. En las demás ramas la columna ya dice de qué sector son. */
  categoria?: string;
  /**
   * El logotipo, SÓLO donde la sub-marca es una marca de verdad.
   *
   * No todas las columnas tienen el mismo tipo de sub-elemento, y eso es lo que
   * decide qué lleva logotipo y qué sigue en texto:
   *
   *   Alimentos y Deportes  →  marcas reales (KFC, Sultanes…). Logotipo.
   *   Medios                →  categorías (Prensa, Radio…). No son marcas: texto.
   *   Inmobiliaria          →  las divisiones de Altea. Tampoco: texto.
   *
   * Conciertos, dentro de Deportes, es el único de su columna sin marca propia y
   * se queda en texto junto a dos que sí la tienen.
   */
  logo?: string;
  /** Proporción ancho/alto del archivo. La consume la corrección óptica. */
  logoRatio?: number;
}

export interface SectorFirma {
  id: string;
  /** La categoría de la columna, arriba en versalitas. */
  categoria: string;
  /** El nombre que va en la caja del logotipo. */
  marca: string;
  subs: SubMarca[];
  /** Altea. Cambia de material, no de sitio: ver [data-nuestra] en nosotros.css. */
  nuestra?: boolean;
  /**
   * El logotipo. Sin él, la caja pinta el nombre — que es el caso de Deportes,
   * el único de los seis que no tiene archivo.
   *
   * La caja conserva su proporción fija (5/2) para que al llegar los archivos la
   * maqueta no se mueva, y el logotipo se ajusta dentro con un ALTO OBJETIVO en
   * vez de a la caja: ver .nos-firma__logo y la nota sobre las proporciones.
   */
  logo?: string;
  /** Proporción ancho/alto del archivo. La consume el ancho máximo del logotipo. */
  logoRatio?: number;
}

/**
 * La carpeta de los logotipos del grupo.
 *
 * Trae 13 archivos .webp, todos con alfa. DOCE SON NEGRO PURO sobre transparente
 * —comprobado píxel a píxel: rgb(0,0,0)—, así que el gris de la sección sale de la
 * opacidad y no del grayscale, que sobre negro no hace nada.
 *
 * El decimotercero, logo-grupo-firmas-globales.webp, es el único en color
 * (turquesa #60E0D0 sobre verde oscuro #103030) y NO se usa: ver la nota de
 * .nos-firma__gfg en nosotros.css.
 */
const GF = "/images/logo/logos-grupo-firmas-globales";

/**
 * Los seis sectores, en el orden en que se leen.
 *
 * SIN LÍNEAS CONECTORAS. Con sub-marcas en casi todas las ramas, cualquier
 * trazado acaba cruzándose con el texto: aquí la jerarquía la hace la
 * alineación —lo que está debajo de un logotipo le pertenece— y la separación
 * entre columnas es una línea fina, no un hueco, para que se lea como tabla y
 * no como seis tarjetas.
 */
/*
 * Va como const TIPADA y no con `satisfies`: `satisfies` conserva el tipo
 * literal de cada entrada, así que en las sub-marcas que no traen `categoria`
 * el campo no existiría y el componente no podría consultarlo.
 */
const SECTORES: SectorFirma[] = [
  {
    id: "medios",
    logo: `${GF}/logo-multimedios-grupo-firma-globales.webp`,
    logoRatio: 7.065,
    categoria: "Medios",
    marca: "Multimedios",
    subs: [
      { nombre: "Prensa" },
      { nombre: "Digital" },
      { nombre: "Televisión" },
      { nombre: "Exteriores" },
      { nombre: "Radio" },
      { nombre: "Educación" },
    ],
  },
  {
    id: "inmobiliaria",
    logo: "/brand/logos/altea-logo-light.svg",
    logoRatio: 5.037,
    categoria: "Inmobiliaria",
    marca: "ALTEA",
    nuestra: true,
    subs: [
      { nombre: "Comercial" },
      { nombre: "Industrial" },
      { nombre: "Vivienda" },
      { nombre: "Hoteles" },
      { nombre: "Sector salud" },
      { nombre: "Forestal" },
    ],
  },
  {
    id: "vinos",
    categoria: "Vinos y licores",
    marca: "Bornos",
    logo: `${GF}/logo-bornos-grupo-firma-globales.webp`,
    logoRatio: 2.755,
    subs: [],
  },
  {
    id: "alimentos",
    logo: `${GF}/logo-foodplay-grupo-firma-globales.webp`,
    logoRatio: 2.692,
    categoria: "Alimentos y diversiones",
    marca: "Foodplay",
    subs: [
      { nombre: "KFC", logo: `${GF}/logo-kfc-grupo-firma-globales.webp`, logoRatio: 1.058 },
      {
        nombre: "Tim Hortons",
        logo: `${GF}/logo-tim-hortons-grupo-firma-globales.webp`,
        logoRatio: 3.744,
      },
      {
        nombre: "Firehouse Subs",
        logo: `${GF}/logo-firehouse-subs-grupo-firma-globales.webp`,
        logoRatio: 3.356,
      },
      {
        nombre: "Bolerama",
        logo: `${GF}/logo-bolerama-grupo-firma-globales.webp`,
        logoRatio: 3.523,
      },
      {
        nombre: "Helados Dreambox",
        logo: `${GF}/logo-helados-dreambox-grupo-firma-globales.webp`,
        logoRatio: 3.425,
      },
    ],
  },
  {
    id: "deportes",
    /* ⚠ SIN LOGOTIPO, el único de los seis. En logos-grupo-firmas-globales/ están
       Sultanes y Fuerza Regia, pero no hay archivo de "Deportes" como marca
       paraguas. La caja se queda con el nombre en texto antes que improvisar. */
    categoria: "Deportes",
    marca: "Deportes",
    /* La única rama que se abre dos veces: cada equipo necesita decir de qué
       deporte es, y Conciertos no es un deporte, así que va suelto. */
    subs: [
      {
        nombre: "Sultanes",
        categoria: "Béisbol",
        logo: `${GF}/logo-sultanes-grupo-firma-globales.webp`,
        logoRatio: 1.183,
      },
      {
        nombre: "Fuerza Regia",
        categoria: "Básquetbol",
        logo: `${GF}/logo-fuerza-regia-grupo-firma-globales.webp`,
        logoRatio: 1.084,
      },
      /* Conciertos no es una marca y no tiene archivo: se queda en texto, junto a
         dos que sí lo tienen. */
      { nombre: "Conciertos" },
    ],
  },
  {
    id: "energia",
    categoria: "Energía",
    marca: "Delta Electric",
    logo: `${GF}/logo-delta-electric-grupo-firma-globales.webp`,
    /*
     * 2.44 y no 1.538: EL ARCHIVO SE RECORTÓ. Venía en 360x234 con el 46.6 % del
     * alto y el 15.3 % del ancho en margen transparente, así que declaraba 1.538:1
     * mientras la marca era 2.440:1. Ahora el lienzo es 305x125 y coincide con la
     * mancha. El original está fuera del repositorio; si se repone, este número
     * vuelve a 1.538.
     */
    logoRatio: 2.44,
    subs: [],
  },
];

export const GRUPO_FIRMA = {
  title: "Formamos parte de Grupo Firma",
  intro:
    "Altea es la división inmobiliaria de un grupo con presencia en medios, alimentos, energía, deportes y vinos. Esa estructura nos da músculo financiero y una visión de largo plazo que pocos desarrolladores tienen.",
  /** La raíz del grupo, encima de la fila de sectores. */
  raiz: { sigla: "GFG", nombre: "Grupo Firma" },
  /** Goal Capital va aparte: es el family office, no un sector operativo. */
  aparte: {
    nombre: "Goal Capital",
    rol: "Family office",
    logo: `${GF}/logo-goal-capital-grupo-firma-globales.webp`,
    logoRatio: 4.48,
  },
  sectores: SECTORES,
  pie: ["Seis sectores", "Una sola visión de largo plazo"],
};

/**
 * "a, b y c" — la coordinación española, sin la coma antes de la conjunción.
 *
 * Existe para que la lista de países del cuerpo de Nuestra Huella NO esté
 * escrita a mano: sale de PRESENCIA_INTERNACIONAL, que es la fuente.
 */
const enumerar = (xs: readonly string[]) =>
  xs.length < 2 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} y ${xs.at(-1)}`;

export const HUELLA = {
  title: "Nuestra Huella",
  /*
   * Copy confirmado por Altea, con las dos cifras DERIVADAS: el 21 sale de
   * ESTADOS_CON_PRESENCIA y la lista de países de PRESENCIA_INTERNACIONAL. Si
   * mañana entra otro estado o otro país, el párrafo no se queda mintiendo.
   *
   * Eso resuelve la nota que llevaba PRESENCIA_INTERNACIONAL en lib/proyectos.ts,
   * que avisaba de que estos tres países sólo existían escritos dentro de este
   * texto en vez de leerse de allí.
   */
  body: `Nuestra presencia abarca ${ESTADOS_CON_PRESENCIA.length} estados de México, ${enumerar(
    PRESENCIA_INTERNACIONAL,
  )}, reflejando la capacidad de Altea para llevar nuestra visión de desarrollo a distintos territorios.`,
  stats: [
    { prefix: "+", to: 400, label: "Propiedades" },
    { prefix: "+", to: 44_000_000, suffix: " m²", label: "Superficie" },
  ],
  /** Desglose de la superficie total. Suma 44,000,000 m². */
  desglose: [
    { label: "Nuevo León", value: 24_000_000 },
    { label: "Resto del país", value: 13_000_000 },
    { label: "Fuera del país", value: 7_000_000 },
  ],
  /** Lo que dice el panel del mapa mientras no se ha señalado nada. */
  mapa: {
    etiqueta: "Presencia",
    titulo: `${ESTADOS_CON_PRESENCIA.length} estados de México`,
    pista: "Señala un estado para ver su superficie construida.",
    /* Y lo que dice cuando sí. */
    etiquetaEstado: "Superficie construida",
    sinDato: "Sin superficie construida registrada",
  },
};

/* ─── 5 · Pilares de identidad ─────────────────────────────────────────── */

/** Los tres iconos de los pilares. Ver ICONOS_PILAR en Pilares.tsx. */
export type IconoPilar = "retícula" | "red" | "triángulo";

export const PILARES = {
  title: "Los pilares de nuestra identidad",
  /**
   * Los tres, con su texto AL LADO del título y no en una banda aparte.
   *
   * La referencia del cliente separaba los textos abajo, y eso obliga a mirar
   * arriba y abajo para emparejar cada uno con su pilar. Juntos se leen de una
   * pasada.
   */
  bloques: [
    {
      id: "innovacion",
      icono: "retícula",
      title: "Innovación disruptiva",
      description:
        "Reinventamos el hábitat. Desafiamos el status quo de la construcción e integramos tecnologías y diseño de vanguardia para crear espacios que anticipan las necesidades futuras.",
    },
    {
      id: "comunidades",
      icono: "red",
      title: "Comunidades vibrantes",
      description:
        "Diseñamos para las personas. Creamos ecosistemas de conexión con infraestructura social y comunitaria que activa la interacción, el bienestar y el sentido de pertenencia en cada desarrollo.",
    },
    {
      id: "trascendencia",
      icono: "triángulo",
      title: "Trascendencia",
      description:
        "Construimos un patrimonio. La calidad es nuestro estándar. Entregamos desarrollos con una estética atemporal y una solidez perdurable que añaden valor a la ciudad y a la vida de sus propietarios por generaciones.",
    },
  ] satisfies { id: string; icono: IconoPilar; title: string; description: string }[],
};

/**
 * Interruptor de la sección de la frase a sangre.
 *
 * Apagada a propósito, no comentada: repetía casi literalmente el titular de
 * "Quiénes somos", que va justo debajo. El componente y sus datos siguen en su
 * sitio y volver a mostrarla es cambiar este `false` por `true`.
 */


/** Sección 5 del sitemap — "Quiénes somos". */

export interface BloqueQuienes {
  id: string;
  title: string;
  description: string;
}

/**
 * Sección 6 — Quiénes somos, en acordeón.
 *
 * UNO ABIERTO A LA VEZ: con tres textos de este largo, dos abiertos ya obligan a
 * desplazarse para comparar, que es justo lo que el acordeón venía a evitar.
 *
 * Los tres textos son los mismos de siempre. Lo que se fue con el rediseño son el
 * icono de cada bloque y la fotografía vertical de la sección: el acordeón no
 * tiene dónde ponerlos.
 *
 * ⚠ PENDIENTE: el modelo integral está a la espera de retroalimentación de Ruva.
 * Los tres textos son los que entregó Altea, pero pueden cambiar.
 */
export const QUIENES_SOMOS = {
  /** PENDIENTE: la ceja no venía en el copy de Altea. */
  eyebrow: "Quiénes somos",
  /* El titular que ya traía la sección antes de rediseñarse. */
  titulo:
    "Quiénes somos, nuestro propósito y el modelo integral que nos distingue",
  bloques: [
    {
      id: "territorio",
      title:
        "Donde otros ven un terreno, nosotros vemos el potencial para transformar un territorio.",
      description:
        "Antes de diseñar un proyecto, entendemos el mercado, analizamos el entorno y descubrimos cómo ese espacio puede generar valor para las personas, empresas y comunidades.",
    },
    {
      id: "talento",
      title: "Nuestro talento",
      description:
        "Contamos con el talento necesario para convertir esa visión en realidad. Investigación de mercado, estrategia, finanzas, desarrollo arquitectónico, área legal, marketing, comercialización y operación trabajan como un solo equipo para dar continuidad a cada decisión y asegurar que cada proyecto nazca con una visión integral.",
    },
    {
      id: "ecosistemas",
      title: "Creamos mucho más que infraestructura",
      description:
        "Desarrollamos ecosistemas donde convergen industria, comercio, vivienda, salud, educación, turismo y entretenimiento, creando espacios que conectan personas, actividades y oportunidades.",
    },
  ] satisfies BloqueQuienes[],
};



/** Sección 7 del sitemap — Responsabilidad social. */
export interface FotoGaleria {
  id: string;
  /** Qué debe ir en el hueco mientras no haya imagen. */
  nota: string;
  src?: string;
  alt?: string;
}

/**
 * Ojo: la carpeta en disco viene con una errata de origen —"responsabildiad"—.
 * Se referencia tal cual para que las rutas resuelvan.
 */
const GALERIA_RS: FotoGaleria[] = [
  {
    id: "rs-1",
    nota: "Evento infantil",
    src: "/images/responsabildiad-social/responsabilidad-social-altea-1.webp",
    alt: "Niña sonriendo en la alberca de pelotas durante un evento infantil de Altea",
  },
  {
    id: "rs-2",
    nota: "Casa de adultos mayores",
    src: "/images/responsabildiad-social/responsabilidad-social-altea-2.webp",
    alt: "Voluntaria de Altea acompañando a una residente de una casa de adultos mayores",
  },
  {
    id: "rs-3",
    nota: "Actividades en familia",
    src: "/images/responsabildiad-social/responsabilidad-social-altea-3.webp",
    alt: "Madre e hijo jugando juntos en un evento navideño organizado por Altea",
  },
  {
    id: "rs-4",
    nota: "Entrega de regalos",
    src: "/images/responsabildiad-social/responsabilidad-social-altea-4.webp",
    alt: "Niñas y niños de una escuela muestran los regalos recibidos en una posada de Altea",
  },
  {
    id: "rs-5",
    nota: "Posada navideña",
    src: "/images/responsabildiad-social/responsabilidad-social-altea-5.webp",
    alt: "Foto grupal de la posada navideña de Altea, con niños y voluntarios bajo una lluvia de confeti",
  },
  {
    id: "rs-6",
    nota: "Convivencia con adultos mayores",
    src: "/images/responsabildiad-social/responsabilidad-social-altea-6.webp",
    alt: "Voluntarias de Altea jugando lotería con residentes de una casa de adultos mayores",
  },
];

export const RESPONSABILIDAD = {
  eyebrow: "Compromiso",
  title: "Responsabilidad social",
  /** Entre el título y el cuerpo. Campo nuevo. */
  subtitulo: "Nuestro compromiso con las comunidades",
  descripcion: [
    "En Altea creemos que nuestro compromiso con las comunidades va más allá de los proyectos que desarrollamos. Por eso, impulsamos iniciativas que nos permiten contribuir de manera cercana y activa con nuestro entorno.",
    "Porque crear proyectos que materialicen sueños también significa contribuir a construir comunidades más humanas, conectadas y solidarias.",
  ],
  galeria: GALERIA_RS,
};
