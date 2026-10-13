import type { DocumentoLegal } from "./tipos";

/**
 * TÉRMINOS Y CONDICIONES DE USO, con el texto que entregó Altea.
 *
 * ⚠ TAL CUAL, CON SUS ERRATAS. Ver la nota de tipos.ts sobre lo único que se
 * normalizó. Los enlaces son lo único añadido: "Aviso de Privacidad" lleva a
 * su página, y el correo y el teléfono completos son mailto: y tel:.
 *
 * ⚠ PENDIENTES DEL TEXTO, para devolverlos a Altea:
 *   · En Contacto la razón social trae el hueco "[RAZÓN SOCIAL COMPLETA]",
 *     visible a propósito: no se publica así.
 *   · En Contacto el correo dice "info@alteadesarrollos", sin ".com", y el
 *     domicilio termina en coma.
 *   · La fecha de actualización va dos veces, arriba y al final, como en el
 *     original.
 */
export const TERMINOS: DocumentoLegal = {
  metadata: {
    title: "Términos y condiciones — Altea",
    description:
      "Términos y condiciones de uso del sitio web de Altea Desarrollos y Proyectos.",
  },
  titulo: "Términos y Condiciones de Uso",
  bajada: "Última actualización: 06 DE OCTUBRE DEL 2026",
  intro: [
    {
      tipo: "p",
      texto:
        "Bienvenido al sitio web de **ALTEA DESARROLLOS Y PROYECTOS** (en adelante, “ALTEA DESARROLLOS”). El acceso y uso de este sitio web implica la aceptación de los presentes Términos y Condiciones de Uso.",
    },
    {
      tipo: "p",
      texto: "Te recomendamos leerlos detenidamente antes de utilizar el sitio.",
    },
  ],
  secciones: [
    {
      titulo: "1. Aceptación de los términos",
      bloques: [
        {
          tipo: "p",
          texto:
            "Al acceder, navegar o utilizar este sitio web, el usuario reconoce haber leído y comprendido estos Términos y Condiciones y acepta sujetarse a ellos y a las disposiciones legales aplicables.",
        },
        {
          tipo: "p",
          texto:
            "Si el usuario no está de acuerdo con alguno de estos términos, deberá abstenerse de utilizar el sitio web.",
        },
      ],
    },
    {
      titulo: "2. Uso del sitio web",
      bloques: [
        {
          tipo: "p",
          texto:
            "El contenido de este sitio tiene como finalidad proporcionar información sobre **ALTEA DESARROLLOS, sus proyectos, desarrollos, servicios, actividades y otros contenidos relacionados con la empresa**.",
        },
        {
          tipo: "p",
          texto:
            "El usuario se compromete a utilizar el sitio de manera lícita y responsable, y a no realizar actividades que puedan afectar su funcionamiento, seguridad o disponibilidad.",
        },
        { tipo: "p", texto: "Queda prohibido utilizar este sitio para:" },
        {
          tipo: "lista",
          items: [
            "Realizar actividades contrarias a las leyes aplicables.",
            "Intentar acceder de manera no autorizada a sistemas, servidores o información.",
            "Introducir virus, código malicioso o cualquier otro elemento que pueda afectar el funcionamiento del sitio.",
            "Utilizar el contenido del sitio con fines comerciales sin autorización previa.",
            "Reproducir, modificar, distribuir o explotar el contenido del sitio sin la autorización correspondiente.",
          ],
        },
      ],
    },
    {
      titulo: "3. Información de proyectos y desarrollos",
      bloques: [
        {
          tipo: "p",
          texto:
            "La información publicada en este sitio sobre proyectos, desarrollos inmobiliarios, superficies, características, imágenes, renders, ubicaciones, amenidades, disponibilidad, precios, fechas y demás especificaciones tiene carácter informativo.",
        },
        {
          tipo: "p",
          texto:
            "Las características, dimensiones, imágenes, acabados, diseños, precios, disponibilidad y demás elementos de los proyectos pueden estar sujetos a modificaciones sin previo aviso.",
        },
        {
          tipo: "p",
          texto:
            "Las imágenes, renders, fotografías y representaciones gráficas utilizadas en el sitio pueden ser ilustrativas y no necesariamente representar de manera exacta el resultado final de un proyecto.",
        },
        {
          tipo: "p",
          texto:
            "La publicación de información sobre un proyecto no constituye, por sí misma, una oferta, promesa de venta, contrato o compromiso de disponibilidad, salvo que expresamente se indique lo contrario y se formalice mediante los instrumentos correspondientes.",
        },
      ],
    },
    {
      titulo: "4. Formularios y solicitudes de información",
      bloques: [
        {
          tipo: "p",
          texto:
            "El sitio puede incluir formularios mediante los cuales el usuario puede solicitar información, establecer contacto con ALTEA DESARROLLOS o manifestar interés en alguno de sus proyectos o servicios.",
        },
        {
          tipo: "p",
          texto:
            "El usuario se compromete a proporcionar información **verdadera, actual y completa** al utilizar dichos formularios.",
        },
        {
          tipo: "p",
          texto:
            "El envío de un formulario no implica la celebración de un contrato ni garantiza la disponibilidad de un proyecto, inmueble, espacio o servicio.",
        },
        {
          tipo: "p",
          texto:
            "La información proporcionada a través de estos formularios será tratada de conformidad con nuestro **[Aviso de Privacidad](/aviso-de-privacidad)**, disponible en este sitio web.",
        },
      ],
    },
    {
      titulo: "5. Propiedad intelectual",
      bloques: [
        {
          tipo: "p",
          texto:
            "Todo el contenido disponible en este sitio, incluyendo de manera enunciativa más no limitativa, textos, fotografías, imágenes, renders, videos, gráficos, logotipos, nombres comerciales, marcas, diseños, elementos visuales, planos y demás materiales, es propiedad de ALTEA DESARROLLOS o se utiliza con las autorizaciones correspondientes.",
        },
        {
          tipo: "p",
          texto:
            "Queda prohibida la copia, reproducción, distribución, modificación, publicación, transmisión o explotación total o parcial de dichos contenidos sin autorización previa y por escrito de ALTEA DESARROLLOS, salvo aquellos usos permitidos por la legislación aplicable.",
        },
        {
          tipo: "p",
          texto:
            "El acceso al sitio web no otorga al usuario ningún derecho de propiedad sobre sus contenidos.",
        },
      ],
    },
    {
      titulo: "6. Marcas y nombres comerciales",
      bloques: [
        {
          tipo: "p",
          texto:
            "Las marcas, logotipos, nombres comerciales y demás signos distintivos utilizados en este sitio son propiedad de sus respectivos titulares.",
        },
        {
          tipo: "p",
          texto:
            "Su uso, reproducción o explotación sin la autorización correspondiente está prohibido.",
        },
      ],
    },
    {
      titulo: "7. Enlaces a sitios externos",
      bloques: [
        {
          tipo: "p",
          texto:
            "Este sitio puede contener enlaces a páginas web, plataformas o servicios de terceros.",
        },
        {
          tipo: "p",
          texto:
            "Dichos enlaces se proporcionan únicamente como referencia o para facilitar el acceso a información adicional. ALTEA DESARROLLOS no controla necesariamente el contenido, funcionamiento, políticas de privacidad o prácticas de dichos sitios externos y, por lo tanto, no asume responsabilidad por ellos.",
        },
        {
          tipo: "p",
          texto:
            "Se recomienda al usuario consultar los términos y políticas aplicables de cualquier sitio de terceros que visite.",
        },
      ],
    },
    {
      titulo: "8. Disponibilidad y funcionamiento del sitio",
      bloques: [
        {
          tipo: "p",
          texto:
            "ALTEA DESARROLLOS procurará mantener disponible y funcionando correctamente el sitio web; sin embargo, no garantiza que este se encuentre disponible de manera permanente, libre de errores o interrupciones.",
        },
        {
          tipo: "p",
          texto:
            "El sitio puede ser modificado, suspendido o actualizado en cualquier momento, sin que ello genere responsabilidad para ALTEA DESARROLLOS.",
        },
      ],
    },
    {
      titulo: "9. Limitación de responsabilidad",
      bloques: [
        {
          tipo: "p",
          texto:
            "ALTEA DESARROLLOS procura que la información publicada en este sitio sea clara y actualizada. Sin embargo, pueden existir errores, omisiones o cambios en la información.",
        },
        {
          tipo: "p",
          texto:
            "ALTEA DESARROLLOS no será responsable por daños o perjuicios derivados del uso que el usuario haga de la información contenida en el sitio, en la medida permitida por la legislación aplicable.",
        },
        {
          tipo: "p",
          texto:
            "La información publicada no sustituye la documentación contractual, técnica, legal o comercial que corresponda a cada proyecto o servicio.",
        },
      ],
    },
    {
      titulo: "10. Modificaciones a los Términos y Condiciones",
      bloques: [
        {
          tipo: "p",
          texto:
            "ALTEA DESARROLLOS podrá modificar o actualizar estos Términos y Condiciones en cualquier momento, cuando resulte necesario por cambios en el funcionamiento del sitio, en sus servicios o por modificaciones legales o regulatorias.",
        },
        {
          tipo: "p",
          texto:
            "Las modificaciones serán publicadas en esta misma sección, indicando la fecha de su última actualización.",
        },
        { tipo: "p", texto: "Se recomienda consultar periódicamente esta sección." },
      ],
    },
    {
      titulo: "11. Legislación aplicable",
      bloques: [
        {
          tipo: "p",
          texto:
            "Estos Términos y Condiciones se regirán e interpretarán de conformidad con las leyes aplicables en los Estados Unidos Mexicanos.",
        },
        {
          tipo: "p",
          texto:
            "Para cualquier controversia relacionada con la interpretación o aplicación de estos términos, las partes se someterán a las autoridades y jurisdicciones que resulten competentes conforme a la legislación aplicable.",
        },
      ],
    },
    {
      titulo: "12. Contacto",
      bloques: [
        {
          tipo: "p",
          texto:
            "Para cualquier duda, comentario o aclaración relacionada con estos Términos y Condiciones, puedes contactarnos a través de:",
        },
        {
          tipo: "p",
          /* ⚠ El correo viene sin ".com": no se enlaza. */
          texto:
            "**ALTEA DESARROLLOS Y PROYECTOS, S.A. DE C.V. [RAZÓN SOCIAL COMPLETA]**\n**Domicilio:** calle Paricutin 390, Colonia Roma, C.P. 64700 Monterrey, Nuevo León, México,\n**Correo electrónico:** info@alteadesarrollos\n**Teléfono:** [81 1772 7272](tel:+528117727272)",
        },
      ],
    },
  ],
  cierre: [
    { tipo: "p", texto: "**Última actualización:** 06 DE OCTUBRE DEL 2026" },
  ],
};
