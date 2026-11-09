import type { DocumentoLegal } from "../tipos";

/**
 * Versión en inglés de app/_legal/aviso-de-privacidad.ts. La forma, los
 * pendientes del texto y el porqué viven allá; aquí solo cambia el texto.
 *
 * Traducción fiel: las erratas que afectan a datos (el "México,," del
 * domicilio, el correo sin ".com" de la firma, el párrafo de I sin sujeto) se
 * conservan para que se corrijan a la vez en los dos idiomas. La nota de que
 * prevalece la versión en español va como `intro`, antes de la sección I.
 */
export const AVISO_DE_PRIVACIDAD: DocumentoLegal = {
  metadata: {
    title: "Privacy notice — Altea",
    description:
      "Altea Desarrollos privacy notice: how we process the personal data we collect and how to exercise ARCO rights.",
  },
  titulo: "Privacy notice",
  intro: [
    {
      tipo: "p",
      texto:
        "This English version is provided for reference only. In the event of any discrepancy, the Spanish version shall prevail.",
    },
  ],
  secciones: [
    {
      titulo: "I. CUSTOMER SERVICE",
      bloques: [
        {
          tipo: "p",
          texto:
            "ALTEA DESARROLLOS, as well as any of its subsidiaries and/or affiliates, domiciled at calle Paricutin 390, Colonia Roma, C.P. 64700 Monterrey, Nuevo León, México,, will process the personal data it collects from you under the terms of this privacy notice.",
        },
        {
          tipo: "p",
          texto:
            "is the data controller responsible for the use and protection of your personal data, and in this regard we inform you of the following:",
        },
      ],
    },
    {
      titulo: "II. PURPOSES",
      bloques: [
        {
          tipo: "p",
          texto:
            "We will use the personal data we collect from you for the following purposes:",
        },
        {
          tipo: "p",
          texto:
            "Legal relationship with ALTEA DESARROLLOS, to initiate a commercial relationship, to evaluate employment information of natural persons for a potential employment relationship, to obtain employment references, and to receive, address, follow up on and resolve complaints, inquiries, requests, suggestions and clarifications from our customers.",
        },
      ],
    },
    {
      titulo: "III. LIMITING THE USE OF PERSONAL DATA",
      bloques: [
        {
          tipo: "p",
          texto:
            "You may limit the use of your personal data by means of a request, which must be submitted at the address indicated in this notice or by electronic means.\nLikewise, you may register with the Registro Público para Evitar Publicidad (Public Registry to Avoid Advertising, REPEP) through the website of the Procuraduría Federal del Consumidor (Federal Consumer Protection Agency, “PROFECO”), at the following address: [http://repep.profeco.gob.mx/index.jsp](http://repep.profeco.gob.mx/index.jsp)",
        },
      ],
    },
    {
      titulo: "IV. WHAT PERSONAL DATA WILL WE USE FOR THESE PURPOSES?",
      bloques: [
        {
          tipo: "p",
          texto:
            "In order to carry out the purposes described in this privacy notice, we will use the following personal data:",
        },
        {
          tipo: "p",
          texto:
            "Identification data.\nContact data.\nEmail address; this personal data is collected on an optional basis, so that the user may receive more and better information.\nYou are hereby informed that ALTEA DESARROLLOS will not collect sensitive personal data in order to fulfill the purposes set forth in this notice.",
        },
      ],
    },
    {
      titulo:
        "V. WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION AND FOR WHAT PURPOSES?",
      bloques: [
        {
          tipo: "p",
          texto:
            "In order to fulfill the purposes described above, and pursuant to the provisions of the applicable legislation, we inform you that ALTEA DESARROLLOS may share your personal data within the country, without requiring your consent, with the following:",
        },
        {
          tipo: "p",
          texto:
            "ALTEA DESARROLLOS and other affiliated, controlled or subsidiary companies belonging to the same corporate group as ALTEA DESARROLLOS.",
        },
        {
          tipo: "subtitulo",
          texto:
            "HOW CAN YOU ACCESS, RECTIFY OR CANCEL YOUR PERSONAL DATA, OR OBJECT TO ITS PROCESSING?",
        },
        {
          tipo: "p",
          texto:
            "You have the right to know what personal data we hold about you, the purposes for which we use it, and the conditions of the use we make of it (Access).",
        },
        {
          tipo: "p",
          texto:
            "Likewise, you have the right to request the correction of your personal information if it is outdated, inaccurate or incomplete (Rectification).",
        },
        {
          tipo: "p",
          texto:
            "You have the right to have us delete your information from our records or databases when you consider that it is not being used properly, in accordance with the deletion requirements set forth in the applicable legislation in force (Cancellation).",
        },
        {
          tipo: "p",
          texto:
            "Similarly, you may object to the use of your personal data for specific purposes (Opposition).",
        },
        {
          tipo: "p",
          texto:
            "These rights are known as ARCO rights (Access, Rectification, Cancellation and Opposition). To exercise any of the ARCO rights, you must submit the respective request through the following means:",
        },
        {
          tipo: "p",
          texto:
            "By calling: [81 1772 7272](tel:+528117727272), by email at: [info@alteadesarrollos.com](mailto:info@alteadesarrollos.com) or by appearing in person at the address indicated in this notice.",
        },
        {
          tipo: "p",
          texto:
            "With regard to the procedure and requirements for exercising your ARCO rights, we inform you of the following:",
        },
        {
          tipo: "p",
          texto:
            "a) By what means may the data subject and, where applicable, their representative prove their identity, as well as the latter's capacity to act as representative?",
        },
        {
          tipo: "p",
          texto:
            "By email at: [info@alteadesarrollos.com](mailto:info@alteadesarrollos.com) or by appearing in person at the address indicated in this notice.",
        },
        {
          tipo: "p",
          texto:
            "b) What information and/or documentation must the request contain?",
        },
        {
          tipo: "p",
          texto:
            "Name, telephone number and address, or details of the appropriate means by which the response to the request may be notified to you; your official identification or, where applicable, the power of attorney and official identification of your legal representative; a clear and precise description of the data in respect of which any ARCO right is sought to be exercised; and any other element that facilitates the location of the personal data.",
        },
        {
          tipo: "p",
          texto: "c) Within how many days will we respond to your request?",
        },
        {
          tipo: "p",
          texto:
            "20 (twenty) business days, counted from the date of its receipt.",
        },
        {
          tipo: "p",
          texto:
            "d) By what means will we communicate the response to your request?",
        },
        {
          tipo: "p",
          texto:
            "By the means you indicated for notification in your request, in accordance with the immediately preceding item.",
        },
        {
          tipo: "p",
          texto:
            "e) In what media may the personal data that you request, if applicable, be reproduced?",
        },
        {
          tipo: "p",
          texto: "Electronic files, recordings and photographs.",
        },
        {
          tipo: "p",
          texto:
            "The contact details of the person or personal data department in charge of processing ARCO rights requests are as follows:",
        },
        {
          tipo: "p",
          texto:
            "a) The personal data protection facilitator on behalf of the Data Controller is Lic. Debanhi Cecilia Varguez Sánchez.",
        },
        {
          tipo: "p",
          texto:
            "b) Address: Calle Paricutin 390, Colonia Roma, C.P. 64700, Monterrey, Nuevo León, México.",
        },
      ],
    },
    {
      titulo:
        "VI. YOU MAY REVOKE YOUR CONSENT TO THE USE OF YOUR PERSONAL DATA",
      bloques: [
        {
          tipo: "p",
          texto:
            "You may revoke the consent that, where applicable, you have granted us for the processing of your personal data. However, it is important that you bear in mind that we will not be able to address your request or cease the use immediately in all cases, since we may be required by a legal obligation to continue processing your personal data.",
        },
        {
          tipo: "p",
          texto:
            "Likewise, you must take into account that, for certain purposes, the revocation of your consent will mean that we can no longer provide you with the service you requested from us, or the termination of your relationship with us.",
        },
        {
          tipo: "p",
          texto:
            "To request the revocation of consent, you must submit your request under the same terms established in the preceding section with respect to ARCO Rights.",
        },
      ],
    },
    {
      titulo: "VII. HOW CAN I LEARN OF CHANGES TO THIS PRIVACY NOTICE?",
      bloques: [
        {
          tipo: "p",
          texto:
            "ALTEA DESARROLLOS may make modifications or updates to this privacy notice at any time. Any change to this Privacy Notice will be notified through https://www.alteadesarrollos.com/privacidad. Should you not agree with the changes made to this Privacy Notice, you may express your objection within 5 (five) business days following the day on which you became aware of this notice, by any of the following means: by calling: [81 1772 7272](tel:+528117727272), by email at: [info@alteadesarrollos.com](mailto:info@alteadesarrollos.com) or by appearing in person at the address indicated in this notice",
        },
      ],
    },
    {
      titulo:
        "VIII. Use of cookies, web beacons or other similar technologies.",
      bloques: [
        {
          tipo: "p",
          texto:
            "Pursuant to the last paragraph of Article 14 of the Reglamento de la Ley Federal de Protección de Datos Personales en Posesión de Particulares (Regulations of the Federal Law on the Protection of Personal Data Held by Private Parties), we inform you that at ALTEA DESARROLLOS we do not use cookies or other technologies on our website.",
        },
      ],
    },
  ],
  /* Como en español: el correo viene sin ".com" y no se enlaza. */
  cierre: [
    {
      tipo: "p",
      texto: "ALTEA DESARROLLOS\n81 1772 7272\ninfo@alteadesarrollos",
    },
  ],
};
