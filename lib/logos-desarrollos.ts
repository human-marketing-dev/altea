/**
 * Los logotipos de los desarrollos, por id de proyecto (2 nov 2026).
 *
 * Los lee la FICHA —el pop up— de cada proyecto, en el home y en Comercial,
 * Industrial y Vivienda: donde hay logo, va EN LUGAR DEL NOMBRE sobre la foto.
 * Las tarjetas no cambian. Un proyecto que no está aquí sigue con su nombre en
 * texto: hoy Reserva Mezquital (pendiente), los próximos de Vivienda y los
 * otros giros de Comercial.
 *
 * ⚠ SON BLANCOS (algunos con un acento de color): sólo se leen sobre oscuro,
 * por eso van sobre la foto, encima de su degradado, y no en el cuerpo claro
 * de la ficha.
 *
 * Los archivos son RECORTES A LA MANCHA de los originales de
 * public/images/logo/logos-desarrollos/, que traen de 0 a 241 px de aire
 * alrededor y en tamaños distintos: sin recortar, a la misma altura unos se
 * veían más chicos que otros. Se sacaron con PIL (recorte al canal alfa, hasta
 * 2400 px de ancho, WebP sin pérdida). Si cambia un original, se vuelve a
 * sacar su recorte y sus medidas.
 *
 * La clave es el `id` (o el `slug`) del proyecto en el contenido, que es
 * también el nombre del archivo. Para sumar uno —Reserva Mezquital, cuando
 * llegue—: su recorte en recorte/ y su línea aquí.
 */
export interface LogoDesarrollo {
  src: string;
  /** Del recorte, en px: dan la proporción sin esperar a que cargue. */
  ancho: number;
  alto: number;
}

const DIR = "/images/logo/logos-desarrollos/recorte";

export const LOGOS_DESARROLLOS: Record<string, LogoDesarrollo> = {
  "aeropuerto-industrial-park": { src: `${DIR}/aeropuerto-industrial-park-logo-altea.webp`, ancho: 2400, alto: 140 },
  "aeropuerto-saltillo": { src: `${DIR}/aeropuerto-saltillo-logo-altea.webp`, ancho: 2400, alto: 455 },
  "amarantha": { src: `${DIR}/amarantha-logo-altea.webp`, ancho: 1157, alto: 368 },
  "bajio-industrial-park": { src: `${DIR}/bajio-industrial-park-logo-altea.webp`, ancho: 2053, alto: 200 },
  "cadereyta-industrial-park": { src: `${DIR}/cadereyta-industrial-park-logo-altea.webp`, ancho: 2400, alto: 154 },
  "huinala-industrial-park": { src: `${DIR}/huinala-industrial-park-logo-altea.webp`, ancho: 2396, alto: 186 },
  "lopez-mateos-industrial-park": { src: `${DIR}/lopez-mateos-industrial-park-logo-altea.webp`, ancho: 2400, alto: 132 },
  "paseo-durango": { src: `${DIR}/paseo-durango-logo-altea.webp`, ancho: 2400, alto: 533 },
  "paseo-gomez-palacio": { src: `${DIR}/paseo-gomez-palacio-logo-altea.webp`, ancho: 2400, alto: 398 },
  "paseo-juarez": { src: `${DIR}/paseo-juarez-logo-altea.webp`, ancho: 2400, alto: 613 },
  "paseo-la-fe": { src: `${DIR}/paseo-la-fe-logo-altea.webp`, ancho: 2400, alto: 706 },
  /* La ampliación lleva el mismo logo que la plaza (2 nov 2026). */
  "paseo-la-fe-ampliacion": { src: `${DIR}/paseo-la-fe-logo-altea.webp`, ancho: 2400, alto: 706 },
  "paseo-los-mochis": { src: `${DIR}/paseo-los-mochis-logo-altea.webp`, ancho: 2400, alto: 481 },
  "paseo-tec": { src: `${DIR}/paseo-tec-logo-altea.webp`, ancho: 2400, alto: 809 },
  "pocket-park-aeropuerto": { src: `${DIR}/pocket-park-aeropuerto-logo-altea.webp`, ancho: 2379, alto: 418 },
  "primavera-industrial-park": { src: `${DIR}/primavera-industrial-park-logo-altea.webp`, ancho: 2400, alto: 155 },
  "punto-cumbres": { src: `${DIR}/punto-cumbres-logo-altea.webp`, ancho: 2400, alto: 174 },
  "punto-guaymas": { src: `${DIR}/punto-guaymas-logo-altea.webp`, ancho: 2400, alto: 173 },
  "punto-huinala": { src: `${DIR}/punto-huinala-logo-altea.webp`, ancho: 2400, alto: 230 },
  "punto-la-pastora": { src: `${DIR}/punto-la-pastora-logo-altea.webp`, ancho: 2400, alto: 150 },
  "punto-las-misiones": { src: `${DIR}/punto-las-misiones-logo-altea.webp`, ancho: 2400, alto: 144 },
  "punto-lincoln": { src: `${DIR}/punto-lincoln-logo-altea.webp`, ancho: 2400, alto: 182 },
  "punto-lopez-mateos": { src: `${DIR}/punto-lopez-mateos-logo-altea.webp`, ancho: 2400, alto: 175 },
  "punto-rio-nilo": { src: `${DIR}/punto-rio-nilo-logo-altea.webp`, ancho: 2400, alto: 229 },
  "punto-versalles": { src: `${DIR}/punto-versalles-logo-altea.webp`, ancho: 2400, alto: 158 },
  "salinas-victoria-industrial-park": { src: `${DIR}/salinas-victoria-industrial-park-logo-altea.webp`, ancho: 2400, alto: 116 },
};

export const logoDe = (id: string): LogoDesarrollo | undefined =>
  LOGOS_DESARROLLOS[id];
