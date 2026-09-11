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
  /** PENDIENTE */
  title: "Construimos el entorno donde crece el norte de México",
  /** Copy real, del manual de identidad. */
  description:
    "Altea es una inmobiliaria con sólida experiencia y una vasta reserva territorial: diseña y ejecuta proyectos inmobiliarios comerciales, industriales y de vivienda a la medida de cualquier necesidad.",
  image: "/images/stock/nosotros-hero-trabajadores-altea.webp",
  alt: "Dos ingenieros revisan planos frente a un edificio en construcción",
  imageNote: "Trabajadores revisando planos en obra",
};

export const ORIGEN = {
  title: "¿Cómo nació Altea?",
  /** PENDIENTE: confirmar el relato de origen y la relación con Grupo GFG. */
  body: [
    "Altea nace de la compra de una cadena de cines, el primer activo inmobiliario que el grupo operó por cuenta propia. Ese origen marcó la forma de trabajar: entender un inmueble no como una transacción, sino como un lugar que tiene que llenarse de gente para funcionar.",
    "Hoy Altea forma parte de Grupo GFG, y opera cuatro divisiones —comercial, industrial, vivienda y forestal— sobre una misma reserva territorial.",
  ],
  image: "/images/comercial/proximos-proyectos/paseo-la-fe-altea-proximo.webp",
  alt: "Render del desarrollo Paseo La Fe",
  imageNote: "Los cines que compró Altea",
};

export const HUELLA = {
  title: "Nuestra Huella",
  body: "Con presencia en 21 Estados de México, Estados Unidos, España y Costa Rica, impulsamos desarrollos que entran en operación y se vuelven parte de entornos vivos, dinámicos y duraderos.",
  stats: [
    { prefix: "+", to: 400, label: "Propiedades" },
    { prefix: "+", to: 44_000_000, suffix: " m²", label: "Superficie" },
  ],
  /** Desglose de la superficie total. Suma 44,000,000 m². */
  desglose: [
    { label: "Nuevo León", value: 24_000_000 },
    { label: "Resto del país", value: 13_000_000 },
    { label: "Externas", value: 7_000_000 },
  ],
  /** PENDIENTE: mapa interactivo, probablemente con un componente de terceros. */
  mapNote: "Mapa interactivo de presencia",
};

export const QUE_HACEMOS_INTRO = {
  /** Por palabras, para poder acentuar una en coral. */
  palabras: [
    "Quiénes", "somos,", "nuestro", "propósito,", "y", "el", "modelo",
    "integral", "nos", "distingue",
  ],
  /** Índice de la palabra en coral. */
  acento: 7,
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

export const QUIENES_SOMOS = {
  /** Va en la columna fija, y entra letra por letra. */
  titulo:
    "Quiénes somos, nuestro propósito y el modelo integral que nos distingue",
  bloques: [
    {
      id: "territorio",
      numero: "01",
      title:
        "Donde otros ven un terreno, nosotros vemos el potencial para transformar un territorio.",
      description:
        "Antes de diseñar un proyecto, entendemos el mercado, analizamos el entorno y descubrimos cómo ese espacio puede generar valor para las personas, las empresas y las comunidades.",
      image: "/images/stock/donde-otros-ven-terreno-altea.webp",
      alt: "Equipo de proyecto analizando planos y mediciones sobre una mesa de trabajo",
    },
    {
      id: "talento",
      numero: "02",
      title: "Nuestro talento",
      description:
        "Contamos con el talento necesario para convertir esa visión en realidad. Investigación de mercado, estrategia, finanzas, desarrollo, área legal, marketing, comercialización y operación trabajan como un solo equipo para dar continuidad a cada decisión y asegurar que cada proyecto nazca con una visión integral.",
      image: "/images/stock/nuestro-talento-altea.webp",
      alt: "Equipo multidisciplinario revisando juntos un proyecto en la oficina",
    },
    {
      id: "ecosistemas",
      numero: "03",
      title: "Creamos mucho más que infraestructura",
      description:
        "Desarrollamos ecosistemas donde convergen industria, comercio, vivienda, salud, educación y turismo, generando espacios capaces de evolucionar junto con las necesidades de quienes los habitan.",
      image: "/images/comercial/galeria/galeria-altea-1.webp",
      alt: "Conjunto de Altea con hotel, comercio y plaza pública",
    },
  ] satisfies BloqueQuienesSomos[],
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
  /** PENDIENTE: copy sin confirmar por Altea. */
  descripcion: [
    "Cada desarrollo cambia el entorno donde aterriza. Antes de construir ya hay comunidades, familias y comercios alrededor, y lo que hagamos con ese terreno les afecta a diario.",
    "Por eso el equipo participa de forma directa: posadas y actividades para los niños de las comunidades vecinas, y visitas a casas de adultos mayores. Los espacios que operamos se vuelven el lugar donde eso ocurre.",
  ],
  galeria: GALERIA_RS,
};
