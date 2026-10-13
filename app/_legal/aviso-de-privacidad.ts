import type { DocumentoLegal } from "./tipos";

/**
 * AVISO DE PRIVACIDAD, con el texto que entregó Altea.
 *
 * ⚠ TAL CUAL, CON SUS ERRATAS. No se corrige redacción en un documento legal:
 * eso le toca a quien lo firma. Ver la nota de tipos.ts sobre lo único que se
 * normalizó (escapes de la exportación y la numeración romana).
 *
 * ⚠ PENDIENTES DEL TEXTO, para devolverlos a Altea:
 *   · Sección I: el segundo párrafo arranca "es el responsable…" sin sujeto;
 *     parece que se perdió el nombre del responsable al pegar.
 *   · Sección I: "México,," con dos comas.
 *   · Entre V y VI va un encabezado sin número ("¿CÓMO PUEDE ACCEDER…?"), que
 *     en el original venía pegado al final de un párrafo. Aquí va como
 *     subtítulo de V.
 *   · La firma del final dice "info@alteadesarrollos", sin ".com".
 *   · VII remite a https://www.alteadesarrollos.com/privacidad, pero esta
 *     página vive en /aviso-de-privacidad (la ruta que ya enlazaba el footer).
 *   · IV dice que el correo es un dato OPCIONAL, y el formulario de /contacto
 *     lo pide obligatorio.
 *   · VIII dice que el sitio no usa cookies. Hoy es cierto —no hay analítica,
 *     ni incrustados de terceros, ni cookies propias—; si se añade cualquiera
 *     de esas cosas, esta sección deja de serlo.
 */
export const AVISO_DE_PRIVACIDAD: DocumentoLegal = {
  metadata: {
    title: "Aviso de privacidad — Altea",
    description:
      "Aviso de privacidad de Altea Desarrollos: cómo tratamos los datos personales que recabamos y cómo ejercer los derechos ARCO.",
  },
  titulo: "Aviso de privacidad",
  secciones: [
    {
      titulo: "I. SERVICIO A CLIENTES",
      bloques: [
        {
          tipo: "p",
          texto:
            "ALTEA DESARROLLOS asi como cualquiera de sus subsidiarias y/o filiales, con domicilio en calle Paricutin 390, Colonia Roma, C.P. 64700 Monterrey, Nuevo León, México,, tratará los datos personales que recabe de usted en los términos del presente aviso de privacidad.",
        },
        {
          tipo: "p",
          texto:
            "es el responsable del uso y protección de sus datos personales, y al respecto le informamos lo siguiente:",
        },
      ],
    },
    {
      titulo: "II. FINALIDADES",
      bloques: [
        {
          tipo: "p",
          texto:
            "Los datos personales que recabamos de usted, los utilizaremos para las siguientes finalidades:",
        },
        {
          tipo: "p",
          texto:
            "Relación jurídica con ALTEA DESARROLLOS, para iniciar una relación comercial, evaluar información laboral de personas físicas para una posible relación laboral, obtener referencias laborales, recibir, atender, dar seguimiento y resolver quejas, consultas, solicitudes, sugerencias, aclaraciones de nuestros clientes.",
        },
      ],
    },
    {
      titulo: "III. LIMITAR USO DE DATOS PERSONALES",
      bloques: [
        {
          tipo: "p",
          texto:
            "Usted podrá limitar el uso de sus datos personales a través de una solicitud que deberá presentar en el domicilio señalado en este aviso u a través de medios electrónicos.\nAsí mismo, podrá inscribirse en el Registro Público para Evitar Publicidad (REPEP), a través de la página de Internet de la Procuraduría Federal del Consumidor (“PROFECO”) cuya dirección es: [http://repep.profeco.gob.mx/index.jsp](http://repep.profeco.gob.mx/index.jsp)",
        },
      ],
    },
    {
      titulo: "IV. ¿QUÉ DATOS PERSONALES UTILIZAREMOS PARA ESTOS FINES?",
      bloques: [
        {
          tipo: "p",
          texto:
            "Para llevar a cabo las finalidades descritas en el presente aviso de privacidad, utilizaremos los siguientes datos personales:",
        },
        {
          tipo: "p",
          texto:
            "Datos de Identificación.\nDatos de contacto.\nCorreo electrónico, este dato personal se recopila como dato opcional, para que el usuario reciba mayor y mejor información.\nSe informa que ALTEA DESARROLLOS, no recabará datos personales sensibles para cumplir con las finalidades señaladas en el presente aviso.",
        },
      ],
    },
    {
      titulo: "V. ¿CON QUIÉN COMPARTIMOS SU INFORMACIÓN PERSONAL Y PARA QUÉ FINES?",
      bloques: [
        {
          tipo: "p",
          texto:
            "Para cumplir con las finalidades antes descritas y en términos de lo dispuesto en la legislación aplicable, le informamos que ALTEA DESARROLLOS; podrá compartir sus datos personales dentro del país, sin requerir su consentimiento, con las siguientes:",
        },
        {
          tipo: "p",
          texto:
            "ALTEA DESARROLLOS; y demás empresas afiliadas, controladas o subsidiarias que pertenecen al mismo grupo corporativo que ALTEA DESARROLLOS;",
        },
        {
          tipo: "subtitulo",
          texto:
            "¿CÓMO PUEDE ACCEDER, RECTIFICAR O CANCELAR SUS DATOS PERSONALES, U OPONERSE A SU TRATAMIENTO?",
        },
        {
          tipo: "p",
          texto:
            "Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué finalidades los utilizamos y las condiciones del uso que les damos (Acceso).",
        },
        {
          tipo: "p",
          texto:
            "Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación).",
        },
        {
          tipo: "p",
          texto:
            "Tiene derecho a que eliminemos su información de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada adecuadamente, de acuerdo con los requisitos de eliminación señalados en la legislación aplicable vigente (Cancelación).",
        },
        {
          tipo: "p",
          texto:
            "De igual manera, usted puede oponerse al uso de sus datos personales para fines específicos (Oposición).",
        },
        {
          tipo: "p",
          texto:
            "Estos derechos se conocen como derechos ARCO. Para el ejercicio de cualquiera de los derechos ARCO, usted deberá presentar la solicitud respectiva a través del siguiente medio:",
        },
        {
          tipo: "p",
          texto:
            "Llamando al teléfono: [81 1772 7272](tel:+528117727272), mediante el correo electrónico: [info@alteadesarrollos.com](mailto:info@alteadesarrollos.com) o acudiendo personalmente al domicilio señalado en este aviso.",
        },
        {
          tipo: "p",
          texto:
            "Con relación al procedimiento y requisitos para el ejercicio de sus derechos ARCO, le informamos lo siguiente:",
        },
        {
          tipo: "p",
          texto:
            "a) ¿A través de qué medios pueden acreditar su identidad el titular y, en su caso, su representante, así como la personalidad este último?",
        },
        {
          tipo: "p",
          texto:
            "Mediante el correo electrónico: [info@alteadesarrollos.com](mailto:info@alteadesarrollos.com) o acudiendo personalmente al domicilio señalado en este aviso.",
        },
        {
          tipo: "p",
          texto:
            "b) ¿Qué información y/o documentación deberá contener la solicitud?",
        },
        {
          tipo: "p",
          texto:
            "Nombre, teléfono y domicilio o dato del medio idóneo que permita notificarle la respuesta a la solicitud, su identificación oficial o en su caso, el poder e identificación oficial de su representante legal, la descripción clara y precisa de los datos respecto a los cuales se pretende ejercer algún derecho ARCO y cualquier otro elemento que facilite la localización de los datos personales.",
        },
        {
          tipo: "p",
          texto: "c) ¿En cuántos días le daremos respuesta a su solicitud?",
        },
        {
          tipo: "p",
          texto:
            "20 (veinte) días hábiles, contados a partir de la fecha de recepción de la misma.",
        },
        {
          tipo: "p",
          texto:
            "d) ¿Por qué medio le comunicaremos la respuesta a su solicitud?",
        },
        {
          tipo: "p",
          texto:
            "Por el medio que haya señalado para notificación en su solicitud, de conformidad con lo señalado en el inciso inmediato anterior.",
        },
        {
          tipo: "p",
          texto:
            "e) ¿En qué medios se pueden reproducir los datos personales que, en su caso, solicite?",
        },
        {
          tipo: "p",
          texto: "Archivos electrónicos, grabaciones y fotografías.",
        },
        {
          tipo: "p",
          texto:
            "Los datos de contacto de la persona o departamento de datos personales, que está a cargo de dar trámite a las solicitudes de derechos ARCO, son los siguientes:",
        },
        {
          tipo: "p",
          texto:
            "a) El facilitador de protección de datos personales por cuenta del Responsable es la Lic. Debanhi Cecilia Varguez Sánchez.",
        },
        {
          tipo: "p",
          texto:
            "b) Domicilio: Calle Paricutin 390, Colonia Roma, C.P. 64700, Monterrey, Nuevo León, México.",
        },
      ],
    },
    {
      titulo:
        "VI. USTED PUEDE REVOCAR SU CONSENTIMIENTO PARA EL USO DE SUS DATOS PERSONALES",
      bloques: [
        {
          tipo: "p",
          texto:
            "Usted puede revocar el consentimiento que, en su caso, nos haya otorgado para el tratamiento de sus datos personales. Sin embargo, es importante que tenga en cuenta que no en todos los casos podremos atender su solicitud o concluir el uso de forma inmediata, ya que es posible que por alguna obligación legal requiramos seguir tratando sus datos personales.",
        },
        {
          tipo: "p",
          texto:
            "Asimismo, usted deberá considerar que para ciertos fines, la revocación de su consentimiento implicará que no le podamos seguir prestando el servicio que nos solicitó, o la conclusión de su relación con nosotros.",
        },
        {
          tipo: "p",
          texto:
            "Para pedir la revocación de consentimiento deberá presentar su solicitud bajo los mismos términos establecidos en el apartado anterior en relación con los Derechos ARCO.",
        },
      ],
    },
    {
      titulo: "VII. ¿CÓMO PUEDO CONOCER LOS CAMBIOS EN ESTE AVISO DE PRIVACIDAD?",
      bloques: [
        {
          tipo: "p",
          texto:
            "ALTEA DESARROLLOS podrá efectuar en cualquier momento modificaciones o actualizaciones al presente aviso de privacidad. La forma de notificar cualquier cambio a este Aviso de Privacidad será a través de https://www.alteadesarrollos.com/privacidad. En caso de que Usted no esté de acuerdo con los cambios efectuados a este Aviso de Privacidad, Usted podrá manifestar su negativa en un plazo de 5 (cinco) días hábiles siguientes a aquel en que tuvo conocimiento del presente aviso, en cualquiera de los siguientes medios: llamando al teléfono: [81 1772 7272](tel:+528117727272), mediante el correo electrónico: [info@alteadesarrollos.com](mailto:info@alteadesarrollos.com) o acudiendo personalmente al domicilio señalado en este aviso",
        },
      ],
    },
    {
      titulo:
        "VIII. Uso de cookies, web beacons u otras tecnologías similares.",
      bloques: [
        {
          tipo: "p",
          texto:
            "En términos del artículo 14 último párrafo del Reglamento de la Ley Federal de Protección de Datos Personales en Posesión de Particulares, le indicamos que en ALTEA DESARROLLOS no utilizamos cookies en nuestro sitio web ni otras tecnologías.",
        },
      ],
    },
  ],
  /* ⚠ "info@alteadesarrollos" sin ".com", como viene: no se enlaza. */
  cierre: [
    {
      tipo: "p",
      texto: "ALTEA DESARROLLOS\n81 1772 7272\ninfo@alteadesarrollos",
    },
  ],
};
