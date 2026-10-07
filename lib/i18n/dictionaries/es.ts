import type { Dictionary } from "./en";

const es = {
  meta: {
    title: "Unlockd — webs para creadores que convierten seguidores en suscriptores",
    description:
      "Plantillas de webs de suscripción para creadores: feed bloqueado, vistas previas, pago en un paso y panel de administración. En tu propio dominio, sin comisión de plataforma.",
    templatesTitle: "Plantillas — Unlockd",
  },
  nav: {
    templates: "Plantillas",
    how: "Cómo convierte",
    admin: "Panel",
    pricing: "Precios",
    faq: "Preguntas",
    order: "Pedir una web",
    menu: "Menú",
    close: "Cerrar",
    language: "Idioma",
  },
  hero: {
    title: "Tu propia web de creador, hecha para convertir seguidores en suscriptores.",
    lead: "Plantillas con las mecánicas de suscripción que los fans ya conocen: feed bloqueado, vistas previas y pago en un solo paso. En tu dominio, sin comisión de plataforma.",
    primary: "Ver plantillas",
    secondary: "Pedir una web a medida",
    facts: ["Sin comisión de plataforma", "Tu dominio y tu lista de fans", "Seis idiomas, según la ubicación"],
    unlock: "Desbloquear la vista previa",
    relock: "Volver a bloquear",
  },
  mock: {
    posts: "publicaciones",
    photos: "fotos",
    videos: "vídeos",
    subscribe: "Suscríbete por 9,99 $",
    locked: "Suscríbete para desbloquear",
    free: "Gratis",
  },
  showcase: {
    title: "Cuatro puntos de partida",
    lead: "Todas las plantillas usan el mismo motor y el mismo panel. Tú eliges el estilo; nosotros lo adaptamos a tu marca.",
    seeAll: "Ver todas las plantillas",
  },
  templates: {
    velvet: { description: "Oscura, cálida e íntima, con detalles dorados.", bestFor: "Glamour, boudoir" },
    bloom: { description: "Luminosa y suave. Parece la página privada de una amiga.", bestFor: "Lifestyle, fitness" },
    neon: { description: "Color intenso, tipografía grande, scroll rápido.", bestFor: "Cosplay, gaming, alternativo" },
    editorial: { description: "Diseños de revista con espacio para fotos grandes.", bestFor: "Fotógrafos, modelos" },
  },
  funnel: {
    title: "Cómo un visitante se convierte en suscriptor",
    lead: "Cada plantilla está construida alrededor de cuatro momentos, cada uno con sus propias mecánicas.",
    steps: [
      {
        title: "Llegar",
        text: "Los visitantes llegan desde el enlace de la bio, casi siempre desde el móvil.",
        items: [
          "Contadores que muestran cuánto hay detrás del muro de pago",
          "Un botón de suscripción siempre al alcance del pulgar",
          "Paquetes de 3 y 6 meses con descuento",
        ],
      },
      {
        title: "Provocar",
        text: "Ven lo suficiente como para querer el resto.",
        items: ["Un feed de publicaciones borrosas y bloqueadas", "Una publicación gratis cada pocas", "Vistas previas cortas de vídeo"],
      },
      {
        title: "Suscribirse",
        text: "El pago cabe en una sola pantalla.",
        items: [
          "Registro y pago en un solo paso",
          "Un nombre discreto en el extracto de la tarjeta",
          "Cancela cuando quieras, dicho con claridad",
        ],
      },
      {
        title: "Quedarse",
        text: "Los suscriptores vuelven y gastan más.",
        items: [
          "Un mensaje de bienvenida automático",
          "Calendario de publicaciones, historias y encuestas",
          "Oferta de pausa o descuento al cancelar, y un mensaje para recuperarlos después",
        ],
      },
    ],
  },
  admin: {
    title: "El panel desde el que tu cliente lo gestiona todo",
    lead: "Sin código. Todo lo que un creador hace cada día, en un solo panel.",
    items: [
      { title: "Panel de ingresos", text: "Ingresos mensuales, suscriptores nuevos y perdidos, y cuántos visitantes se convierten en fans." },
      { title: "Subida masiva y programación", text: "Arrastra una carpeta, marca publicaciones como gratis, bloqueadas o de pago por ver, y elige una fecha." },
      { title: "Vistas previas automáticas", text: "Las vistas previas borrosas se generan en el servidor, así el original nunca llega a quien no está suscrito." },
      { title: "Marca de agua por suscriptor", text: "Cada copia lleva el nombre del comprador, para poder rastrear una filtración." },
      { title: "Fans y mensajes", text: "Mira quién gasta más, escribe a grupos de fans y vende contenido por mensaje." },
      { title: "Campañas", text: "Códigos de descuento, enlaces de prueba gratis y qué red social trae fans que pagan." },
      { title: "Pagos", text: "Stripe, CCBill, Segpay, Verotel o cripto, según el contenido." },
      { title: "Cumplimiento legal", text: "Aviso de edad, conexión con verificación de edad, consentimiento de cookies, páginas legales, etiquetas de contenido IA y bloqueo por país." },
    ],
  },
  pricing: {
    title: "Precios",
    lead: "Un solo pago por la web. Tras la entrega, la web y todo su contenido pertenecen al creador.",
    popular: "La más elegida",
    order: "Pedir",
    plans: [
      {
        id: "starter",
        name: "Starter",
        price: "490 $",
        text: "Una plantilla con tu marca, instalada en tu servidor.",
        features: ["Cualquier plantilla", "Tu logo, colores y tipografías", "Instalación y configuración del dominio"],
      },
      {
        id: "pro",
        name: "Pro",
        price: "1.290 $",
        text: "Lista para cobrar desde el primer día.",
        features: ["Todo lo de Starter", "Proveedor de pagos conectado", "Automatizaciones configuradas", "Una hora de formación"],
      },
      {
        id: "custom",
        name: "A medida",
        price: "desde 2.500 $",
        text: "Un diseño hecho solo para ti.",
        features: ["Todo lo de Pro", "Tu propio diseño", "Funciones extra a petición"],
      },
    ],
    support: "Actualizaciones y soporte opcionales: 49 $ al mes.",
  },
  process: {
    title: "Cómo funciona un pedido",
    steps: [
      { title: "Brief", text: "Cuéntanos el estilo que quieres, tu dominio y cómo vas a cobrar." },
      { title: "Construcción", text: "Se paga la mitad por adelantado y configuramos la plantilla con tu marca." },
      { title: "Revisión", text: "Lo revisas todo en un enlace de vista previa privado." },
      { title: "Entrega", text: "Pagas el resto y la web es tuya, con acceso completo al panel." },
    ],
  },
  faq: {
    title: "Preguntas",
    items: [
      { q: "¿De quién es la web?", a: "Del creador. Tras la entrega no tenemos acceso, salvo que nos lo dé." },
      { q: "¿Alojáis o veis el contenido?", a: "No. El creador sube su contenido a su propio servidor y almacenamiento. Nunca tenemos su contenido." },
      {
        q: "¿Qué proveedores de pago funcionan?",
        a: "Stripe para la mayoría de creadores. Stripe no permite contenido para adultos; para eso conectamos CCBill, Segpay, Verotel o cripto. El creador abre la cuenta de comercio y nosotros la configuramos.",
      },
      {
        q: "¿La web puede mostrar contenido para adultos?",
        a: "Sí, si el hosting y el proveedor de pagos del creador lo permiten. El aviso de edad, la conexión con verificación de edad y las páginas legales vienen incluidos. El creador es responsable de su contenido y de la ley local.",
      },
      {
        q: "¿Qué idiomas admite una web?",
        a: "Inglés, alemán, español, portugués, ruso y ucraniano. Cada visitante ve su idioma según dónde esté y puede cambiarlo cuando quiera.",
      },
      { q: "¿Qué necesito para empezar?", a: "Un dominio, una cuenta de hosting, tu logo y algunas fotos. Te diremos qué más hace falta después de leer tu brief." },
    ],
  },
  order: {
    title: "¿Quieres tu propia web?",
    lead: "Envíanos un brief: la plantilla que te gusta, tu dominio y cómo piensas cobrar. Te responderemos con un plan y un precio.",
    email: "Escríbenos un email",
    telegram: "Escríbenos por Telegram",
  },
  listing: {
    title: "Plantillas",
    lead: "Todas las plantillas comparten el mismo motor y el mismo panel. Elige la más cercana a tu estilo; adaptamos colores, tipografías y diseño a tu marca.",
    filterLabel: "Filtrar plantillas",
    filters: { all: "Todas", dark: "Oscuras", light: "Claras" },
    bestFor: "Ideal para",
    from: "desde",
    preview: "Demo en vivo muy pronto",
    orderThis: "Pedir esta plantilla",
  },
  footer: {
    note: "Las imágenes de demostración están generadas con IA. Todos los personajes son adultos ficticios.",
    rights: "Todos los derechos reservados.",
  },
} satisfies Dictionary;

export default es;
