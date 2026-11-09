import type { Idioma } from "@/lib/idioma";

/**
 * LOS TEXTOS FIJOS DE LOS COMPONENTES, en los dos idiomas (noviembre de 2026).
 *
 * Lo que dice el CONTENIDO —titulares, párrafos, fichas— vive en los módulos de
 * contenido (content.ts y su content.en.ts, contenido/ y contenido/en/). Aquí va
 * lo que es de la interfaz: botones, etiquetas de datos, nombres para lectores
 * de pantalla, avisos del formulario.
 *
 * El inglés se declara con el tipo del español: si se agrega una clave en uno y
 * no en el otro, no compila.
 */
const ES = {
  nav: {
    inicio: "Inicio",
    nosotros: "Nosotros",
    comercial: "Comercial",
    industrial: "Industrial",
    vivienda: "Vivienda",
    forestal: "Forestal",
    contacto: "Contacto",
    marcaInicio: "Altea — inicio",
    abrirMenu: "Abrir menú",
    cerrarMenu: "Cerrar menú",
    idioma: "Idioma",
  },
  footer: {
    unidades: "Unidades de negocio",
    altea: "Altea",
    contacto: "Contacto",
    whatsapp: "WhatsApp",
    aviso: "Aviso de privacidad",
    terminos: "Términos",
    derechos: "Todos los derechos reservados.",
  },
  cta: {
    whatsapp: "Contáctanos por WhatsApp",
    irContacto: "Ir a contacto",
  },
  ficha: {
    cerrar: "Cerrar ficha",
    de: (nombre: string) => `Ficha de ${nombre}`,
    delProyecto: "Ficha del proyecto",
    deLaPlaza: "Ficha de la plaza",
    delGiro: "Ficha del giro",
    unidad: "Unidad",
    ubicacion: "Ubicación",
    estado: "Estado",
    visitarSitio: "Visitar sitio web",
    otraPestana: " (se abre en otra pestaña)",
  },
  carrusel: {
    anterior: "Anterior",
    siguiente: "Siguiente",
    fotoAnterior: "Foto anterior",
    fotoSiguiente: "Foto siguiente",
    fotosDe: (nombre: string) => `Fotos de ${nombre}`,
    historia: "Fotos de la historia de Altea",
    deTotal: (n: number, total: number) => `${n} de ${total}`,
    verFoto: (n: number, total: number) => `Ver foto ${n} de ${total}`,
    /* Los `aria-roledescription`: lo que anuncia un lector de pantalla en vez
       de «región» y «grupo». */
    rolCarrusel: "carrusel",
    rolFoto: "foto",
  },
  carpetas: {
    explorar: "Explorar",
  },
  atributos: {
    porQue: (unidad: string) => `Por qué Altea ${unidad}`,
  },
  video: {
    activarSonido: "Activar sonido del video",
    silenciar: "Silenciar video",
  },
  mapa: {
    lienzo: "Mapa de presencia de Altea en México",
    construidos: "m² construidos",
  },
  datoPendiente: "Dato pendiente",
  formulario: {
    nombre: "Nombre",
    nombrePista: "Tu nombre",
    correo: "Correo electrónico",
    correoPista: "tu@correo.com",
    telefono: "Teléfono (opcional)",
    unidad: "Unidad de interés",
    unidadElegir: "Selecciona una",
    mensaje: "Mensaje",
    mensajePista: "Cuéntanos sobre tu proyecto",
    noLlenar: "No llenar",
    enviando: "Enviando…",
    enviar: "Enviar mensaje",
    gracias2: "Un asesor de Altea te contactará para revisar tu proyecto.",
    gracias: "Gracias, recibimos tu mensaje.",
  },
  whatsappFab: {
    abrir: "Abrir chat de WhatsApp",
    cerrar: "Cerrar chat",
    tuMensaje: "Tu mensaje",
    escribe: "Escribe tu mensaje…",
    abrirWhatsApp: "Abrir WhatsApp",
  },
  contacto: {
    canales: "Canales directos",
    domicilio: "Domicilio",
  },
  noEncontrada: {
    eyebrow: "Error 404",
    titulo: "No encontramos esta página",
    descripcion:
      "Es posible que la dirección haya cambiado o que la página ya no exista.",
    inicio: "Volver al inicio",
    contacto: "Contáctanos",
  },
} as const;

type Textos = {
  [K in keyof typeof ES]: (typeof ES)[K] extends string
    ? string
    : { [J in keyof (typeof ES)[K]]: (typeof ES)[K][J] extends string ? string : (typeof ES)[K][J] };
};

const EN: Textos = {
  nav: {
    inicio: "Home",
    nosotros: "About us",
    comercial: "Commercial",
    industrial: "Industrial",
    vivienda: "Residential",
    forestal: "Forestry",
    contacto: "Contact",
    marcaInicio: "Altea — home",
    abrirMenu: "Open menu",
    cerrarMenu: "Close menu",
    idioma: "Language",
  },
  footer: {
    unidades: "Business units",
    altea: "Altea",
    contacto: "Contact",
    whatsapp: "WhatsApp",
    aviso: "Privacy notice",
    terminos: "Terms",
    derechos: "All rights reserved.",
  },
  cta: {
    whatsapp: "Contact us via WhatsApp",
    irContacto: "Go to contact",
  },
  ficha: {
    cerrar: "Close",
    de: (nombre: string) => `${nombre} details`,
    delProyecto: "Project details",
    deLaPlaza: "Shopping center details",
    delGiro: "Sector details",
    unidad: "Business unit",
    ubicacion: "Location",
    estado: "Status",
    visitarSitio: "Visit website",
    otraPestana: " (opens in a new tab)",
  },
  carrusel: {
    anterior: "Previous",
    siguiente: "Next",
    fotoAnterior: "Previous photo",
    fotoSiguiente: "Next photo",
    fotosDe: (nombre: string) => `${nombre} photos`,
    historia: "Photos from Altea's history",
    deTotal: (n: number, total: number) => `${n} of ${total}`,
    verFoto: (n: number, total: number) => `View photo ${n} of ${total}`,
    rolCarrusel: "carousel",
    rolFoto: "photo",
  },
  carpetas: {
    explorar: "Explore",
  },
  atributos: {
    porQue: (unidad: string) => `Why Altea ${unidad}`,
  },
  video: {
    activarSonido: "Turn on video sound",
    silenciar: "Mute video",
  },
  mapa: {
    lienzo: "Map of Altea's presence in Mexico",
    construidos: "m² built",
  },
  datoPendiente: "Data pending",
  formulario: {
    nombre: "Name",
    nombrePista: "Your name",
    correo: "Email",
    correoPista: "you@email.com",
    telefono: "Phone (optional)",
    unidad: "Business unit of interest",
    unidadElegir: "Select one",
    mensaje: "Message",
    mensajePista: "Tell us about your project",
    noLlenar: "Do not fill in",
    enviando: "Sending…",
    enviar: "Send message",
    gracias2: "An Altea advisor will contact you to review your project.",
    gracias: "Thank you, we have received your message.",
  },
  whatsappFab: {
    abrir: "Open WhatsApp chat",
    cerrar: "Close chat",
    tuMensaje: "Your message",
    escribe: "Type your message…",
    abrirWhatsApp: "Open WhatsApp",
  },
  contacto: {
    canales: "Direct channels",
    domicilio: "Address",
  },
  noEncontrada: {
    eyebrow: "Error 404",
    titulo: "We could not find this page",
    descripcion:
      "The address may have changed, or the page may no longer exist.",
    inicio: "Back to home",
    contacto: "Contact us",
  },
};

export const TEXTOS: Record<Idioma, Textos> = { es: ES, en: EN };
export const textos = (idioma: Idioma): Textos => TEXTOS[idioma];
