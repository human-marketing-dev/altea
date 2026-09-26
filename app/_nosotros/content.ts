import { ESTADOS_CON_PRESENCIA, PRESENCIA_INTERNACIONAL } from "@/lib/proyectos";

/**
 * Página NOSOTROS — secciones 1 a 4 del sitemap (Renovación Web Altea 2026, p.11):
 *   1. Banner · 2. ¿Cómo nació Altea? · 3. Nuestra Huella/mapa
 *   4. Introducción a "qué hacemos"
 *
 * Faltan por definir: 5. Qué hacemos (3 secciones) · 6. CTA · 7. Responsabilidad social.
 *
 * Lo marcado PENDIENTE es texto provisional, no confirmado por Altea.
 */

export const BANNER = {
  eyebrow: "Nosotros",
  title: "Transformamos territorio en oportunidades",
  /**
   * El MISMO título, partido para la composición del hero.
   *
   * El corte en tres es de diseño, no de contenido: el <h1> lleva `title` entero
   * en su aria-label y estas partes van aria-hidden, así que un lector de
   * pantalla oye la frase de una pieza. Mismo criterio que el logotipo del hero
   * del home y el título de "Quiénes somos".
   *
   * La última línea se pinta calada.
   */
  lineas: ["Transformamos", "territorio en", "oportunidades"],
  /* Sin la coma antes de "y turismo": en una enumeración española la
     conjunción no la lleva. */
  description:
    "Somos una desarrolladora inmobiliaria integral ubicada en Monterrey, Nuevo León, con sólida experiencia y una vasta reserva territorial. Desarrollamos, ejecutamos y operamos proyectos inmobiliarios comerciales, industriales, de vivienda, salud, educación y turismo bajo una misma visión: identificar oportunidades, integrar capacidades y crear espacios que generan valor a largo plazo.",
  image: "/images/stock/nosotros-hero-trabajadores-altea.webp",
  alt: "Dos ingenieros revisan planos frente a un edificio en construcción",
  imageNote: "Trabajadores revisando planos en obra",
};

export const ORIGEN = {
  title: "¿Cómo nació Altea?",

  parrafos: [
    "En Altea contamos con más de 40 años de experiencia en el desarrollo inmobiliario en México. Nuestros orígenes se remontan a ser propietarios de cines, donde iniciamos nuestra trayectoria desarrollando espacios de entretenimiento y adquiriendo una experiencia que con el tiempo nos permitió ampliar nuestra visión y capacidades.",
    "Gracias a nuestra constante evolución y adaptación, en Altea seguimos construyendo el futuro con el mismo compromiso de nuestros inicios: generar valor, calidad y oportunidades en cada metro cuadrado que transformamos.",
  ],

  /*
   * Paseo La Fe, por decisión explícita.
   *
   * La comparte con /comercial, donde es el centro comercial de portada. No
   * habla de los cines del relato —no hay ninguna foto de cines en el repo—,
   * así que `imageNote` se queda apuntando qué material sería el propio si
   * algún día llega.
   */
  image: "/images/comercial/centros-comerciales/paseo-la-fe-altea.webp",
  alt: "Paseo La Fe, centro comercial de Altea en San Nicolás, Nuevo León",
  imageNote: "Los cines que compró Altea",
};

/**
 * Interruptor de la sección de Grupo Firma.
 *
 * En `true` porque el marcador de posición ES el entregable de este turno: hay
 * que poder ver el hueco. Pasarlo a `false` la oculta entera, sin borrar nada,
 * si hay que enseñar la página antes de que llegue el contenido.
 */
export const MOSTRAR_GRUPO_FIRMA = true;

/**
 * Interruptor del bloque de captación en /nosotros.
 *
 * En `false` por decisión de contenido, no por diseño: la página termina en
 * Responsabilidad social y va directo al pie. Apagado y no borrado — el
 * componente <LeadCTA> lo siguen montando las otras CINCO rutas (home,
 * comercial, industrial, vivienda y forestal), así que reactivarlo aquí es
 * cambiar este `false` por `true`.
 */
export const MOSTRAR_LEAD_NOSOTROS = false;

/**
 * Altea forma parte de Grupo Firma.
 *
 * ⚠ PENDIENTE DE CONTENIDO — TODO. Altea no ha entregado título, texto ni
 * imagen. La estructura ya está montada, así que rellenar esto es lo único que
 * falta; el componente no cambia.
 */
export const GRUPO_FIRMA = {
  eyebrow: "Grupo Firma",
  /** PENDIENTE */
  title: undefined as string | undefined,
  /** PENDIENTE: dos párrafos. Vacío mientras no lleguen. */
  parrafos: [] as string[],
  /** PENDIENTE. Sin `src`, <MediaSlot> pinta el hueco etiquetado. */
  image: undefined as string | undefined,
  imageNote: "Imagen de Grupo Firma",
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
  /** PENDIENTE: mapa interactivo, probablemente con un componente de terceros. */
  mapNote: "Mapa interactivo de presencia",
};

/**
 * Interruptor de la sección de la frase a sangre.
 *
 * Apagada a propósito, no comentada: repetía casi literalmente el titular de
 * "Quiénes somos", que va justo debajo. El componente y sus datos siguen en su
 * sitio y volver a mostrarla es cambiar este `false` por `true`.
 */
export const MOSTRAR_QUE_HACEMOS_INTRO = false;

export const QUE_HACEMOS_INTRO = {
  /*
   * Texto corrido con la palabra de acento aparte. NO volver a partirlo en un
   * array de palabras: iban como ítems de un flex y el hueco lo ponía su `gap`,
   * o sea que en el DOM no había espacios y la frase copiada salía toda pegada.
   */
  fraseInicio: "Quiénes somos, nuestro propósito, y el modelo",
  acento: "integral",
  fraseFin: "nos distingue",
  /* Horizontal, con mucho cielo: aguanta bien el velo oscuro y el texto
     centrado encima. No se usa en ninguna otra sección. */
  image: "/images/industrial/galeria/galeria-industrial-altea-2.webp",
  imageNote: "Imagen de fondo — sección a sangre",
};

/** Sección 5 del sitemap — "Quiénes somos". */
export interface BloqueQuienesSomos {
  id: string;
  /** Se pinta en coral junto al título. */
  numero: string;
  title: string;
  description: string;
  /**
   * PENDIENTE: las tres fotos no existen todavía. Mientras el campo esté vacío
   * el bloque pinta un relleno; poner la ruta aquí es todo lo que hace falta
   * para que salga la imagen.
   */
  image?: string;
  alt?: string;
}

/** Los tres iconos disponibles. Ver ICONOS_GIRO en QuienesSomos.tsx. */
export type IconoQuienes = "analisis" | "equipo" | "ecosistema";

export interface BloqueQuienes {
  id: string;
  icono: IconoQuienes;
  title: string;
  description: string;
}

/**
 * Sección 5 — Quiénes somos. Tres bloques compactos con icono.
 *
 * Se acortó a pedido del cliente: antes era una columna fija con el título
 * partido palabra por palabra, un índice y tres fotografías que se revelaban en
 * paralelogramo con el scroll. Ahora son tres columnas parejas y las fotos las
 * sustituyen iconos.
 *
 * ⚠ PENDIENTE: el modelo integral está a la espera de retroalimentación de Ruva.
 * Los tres textos de abajo son los que entregó Altea, pero pueden cambiar.
 */
export const QUIENES_SOMOS = {
  /** PENDIENTE: la ceja no venía en el copy de Altea. */
  eyebrow: "Quiénes somos",
  /* El titular que ya traía la sección antes de rediseñarse. */
  titulo:
    "Quiénes somos, nuestro propósito y el modelo integral que nos distingue",
  /**
   * PENDIENTE — la imagen NO EXISTE. Va en una columna muy alta y estrecha
   * (28% del cuerpo), así que al recortarse con `cover` hay que pedirla
   * VERTICAL: una apaisada perdería casi todo. Sin `src`, <MediaSlot> pinta el
   * hueco etiquetado.
   */
  foto: {
    src: undefined as string | undefined,
    alt: "",
    label: "Imagen vertical de la sección",
  },
  bloques: [
    {
      id: "territorio",
      icono: "analisis",
      title:
        "Donde otros ven un terreno, nosotros vemos el potencial para transformar un territorio.",
      description:
        "Antes de diseñar un proyecto, entendemos el mercado, analizamos el entorno y descubrimos cómo ese espacio puede generar valor para las personas, empresas y comunidades.",
    },
    {
      id: "talento",
      icono: "equipo",
      title: "Nuestro talento",
      description:
        "Contamos con el talento necesario para convertir esa visión en realidad. Investigación de mercado, estrategia, finanzas, desarrollo arquitectónico, área legal, marketing, comercialización y operación trabajan como un solo equipo para dar continuidad a cada decisión y asegurar que cada proyecto nazca con una visión integral.",
    },
    {
      id: "ecosistemas",
      icono: "ecosistema",
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
