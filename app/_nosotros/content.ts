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
  /** PENDIENTE: foto de stock de trabajadores revisando planos en obra. */
  image: undefined as string | undefined,
  imageNote: "Trabajadores revisando planos en obra",
};

export const ORIGEN = {
  title: "¿Cómo nació Altea?",
  /** PENDIENTE: confirmar el relato de origen y la relación con Grupo GFG. */
  body: [
    "Altea nace de la compra de una cadena de cines, el primer activo inmobiliario que el grupo operó por cuenta propia. Ese origen marcó la forma de trabajar: entender un inmueble no como una transacción, sino como un lugar que tiene que llenarse de gente para funcionar.",
    "Hoy Altea forma parte de Grupo GFG, y opera cuatro divisiones —comercial, industrial, vivienda y forestal— sobre una misma reserva territorial.",
  ],
  /** PENDIENTE: fotografía de los cines que compró Altea. */
  image: undefined as string | undefined,
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
  phrase: "Quiénes somos, nuestro propósito, y el modelo integral nos distingue",
  /** PENDIENTE: imagen de fondo a sangre. */
  image: undefined as string | undefined,
  imageNote: "Imagen de fondo — sección a sangre",
};

/** Sección 5 del sitemap — "Qué hacemos", tres bloques angulados. */
export interface BloqueAngulado {
  id: string;
  title: string;
  description: string;
  /** De qué lado va la imagen; el texto ocupa el otro. */
  imagen: "izquierda" | "derecha";
  /** Fondo del bloque. Alterna para dar ritmo a la secuencia. */
  tono: "ink" | "cream";
  /**
   * Dónde cae la división, en % desde la izquierda de la sección — sin importar
   * de qué lado esté la imagen. Más alto la corre a la derecha, más bajo a la
   * izquierda. @default 50
   */
  division?: number;
  image?: string;
  imageNote: string;
  alt?: string;
}

export const QUE_HACEMOS: BloqueAngulado[] = [
  {
    id: "territorio",
    title:
      "Donde otros ven un terreno, nosotros vemos el potencial para transformar un territorio.",
    description:
      "Antes de diseñar un proyecto, entendemos el mercado, analizamos el entorno y descubrimos cómo ese espacio puede generar valor para las personas, empresas y las comunidades.",
    imagen: "derecha",
    tono: "cream",
    division: 58,
    // PENDIENTE: no hay fotografía de terreno o reserva sin desarrollar.
    imageNote: "Terreno o vista aérea de reserva territorial",
  },
  {
    id: "talento",
    title: "Nuestro Talento",
    description:
      "Contamos con el talento necesario para convertir esa visión en realidad. Investigación de mercado, estrategia, finanzas, desarrollo, área legal, marketing, comercialización y operación trabajan como un solo equipo para dar continuidad a cada decisión y asegurar que cada proyecto nazca con una visión integral.",
    imagen: "izquierda",
    tono: "ink",
    division: 42,
    // PENDIENTE: no hay ni una fotografía de personas en el material entregado.
    imageNote: "Equipo de Altea",
  },
  {
    id: "ecosistemas",
    title: "Creamos mucho más que infraestructura",
    description:
      "Desarrollamos ecosistemas donde convergen industria, comercio, vivienda, salud, educación, y turismo, generado espacios capaces de evolucionar junto con las necesidades de quienes los habitan.",
    imagen: "derecha",
    tono: "cream",
    division: 58,
    // PROVISIONAL: hotel, comercio, restaurantes y plaza pública en un mismo
    // encuadre — es literalmente el ecosistema que describe el texto.
    image: "/images/comercial/galeria/galeria-altea-1.webp",
    alt: "Conjunto de Altea con hotel, comercio y plaza pública",
    imageNote: "Ecosistema Altea",
  },
];
