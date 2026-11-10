// Scope and price, in Chilean pesos, without VAT (receipt for fees, "boleta de honorarios").
// Prices are per result, never per hour; the launch price (−25 %) applies to the web only.

export type Item = { t: string; d?: string; tec?: string };

export type Nivel = {
  id: "esencial" | "medida" | "completa";
  nombre: string;
  para: string;
  lista: number;
  lanzamiento: number;
  incluye: Item[];
  noIncluye: string[];
  pagos: { cuando: string; pct: number }[];
  nota?: string;
  /** weeks from signing to publishing, if the content arrives on time */
  semanas: string;
};

/** The tier recommended to start with (the client wants something basic first); also the web used in the modalities. */
export const NIVEL_RECOMENDADO: Nivel["id"] = "esencial";

/** What all three tiers share: the technical base, in plain words, with the technical name next to it. */
export const BASE: Item[] = [
  { t: "Rápida, incluso con mala señal", d: "Abre en segundos en un celular en terreno.", tec: "Sitio estático + CDN" },
  { t: "Segura por diseño", d: "Nadie puede meterle código ni suplantarla, y todo viaja cifrado.", tec: "HTTPS + CSP estricta" },
  { t: "Sin rastreadores", d: "No sigue a sus visitantes: sin datos que se filtren ni avisos de cookies.", tec: "Cero cookies ni terceros" },
  { t: "Encontrable en Google y en Maps", d: "Google entiende qué hacen y dónde, y aparecen cuando alguien busca cerca.", tec: "Datos estructurados, sitemap, Google Business" },
  { t: "Se ve bien en todo", d: "Celular, tablet, computador y lector de pantalla.", tec: "Diseño adaptable, WCAG 2.2" },
  { t: "Es de ustedes", d: "Dominio, servidor y código a nombre de INECSO: si cambian de proveedor, se llevan todo.", tec: "Código en repositorio Git" },
  { t: "Cada cambio queda guardado", d: "Si algo sale mal, se vuelve a la versión anterior en minutos.", tec: "Publicación automática con historial" },
];

export const NIVELES: Nivel[] = [
  {
    id: "esencial",
    nombre: "Web esencial",
    para: "Su vitrina, seria y lista pronto. Para partir.",
    lista: 1_440_000,
    lanzamiento: 1_080_000,
    semanas: "1 semana",
    incluye: [
      { t: "Cinco páginas con su información real", d: "Inicio, servicios, obras, empresa y contacto, con sus textos y fotos.", tec: "Diseño propio sobre base probada" },
      { t: "Galería de obras", d: "Hasta 12 obras con foto, tipo de trabajo y año.", tec: "Imágenes optimizadas" },
      { t: "Su certificación SEC a la vista", d: "La licencia clase A en su página, para revisarla sin pedirla." },
      { t: "Contacto y WhatsApp", d: "Las consultas llegan a su correo; el botón abre un chat con INECSO.", tec: "Formulario antispam" },
      { t: "Capacitación corta", d: "Qué tiene la web, cómo pedir cambios y cómo leer su ficha de Google." },
    ],
    noIncluye: ["Diseño completamente a medida", "Simulación de corte, calculadora y cotización en pasos", "Editarla ustedes (los cambios van por la mantención)", "Inteligencia artificial e integraciones"],
    pagos: [
      { cuando: "Al firmar", pct: 40 },
      { cuando: "Al aprobar el diseño", pct: 30 },
      { cuando: "Al publicar", pct: 30 },
    ],
    nota: "Si después pasan a la web a medida, lo pagado se descuenta completo: no se bota nada.",
  },
  {
    id: "medida",
    nombre: "Web a medida",
    para: "La web de esta demo, con sus obras reales.",
    lista: 2_720_000,
    lanzamiento: 2_040_000,
    semanas: "1 a 2 semanas",
    incluye: [
      { t: "Todo lo de la esencial" },
      { t: "Diseño completamente a medida", d: "Dos rondas de demo, aprobadas sobre la web funcionando, no sobre dibujos.", tec: "Interfaz a medida" },
      { t: "La simulación de un corte de energía", d: "Muestra en segundos qué hace un tablero de transferencia automática.", tec: "Animación interactiva" },
      { t: "Calculadora de grupo electrógeno", d: "Orienta al cliente sobre la potencia que necesita antes de llamar.", tec: "Cálculo en el navegador" },
      { t: "Obras con filtro y visor", d: "Por tipo de trabajo, con fotos en grande." },
      { t: "Cotización en pasos", d: "Pide potencia, fotos y dirección: llega completa.", tec: "Formulario multipaso con validación" },
      { t: "Panel de contenidos", d: "Por si quieren cambiar un texto o una obra ustedes; si no, me lo piden.", tec: "CMS" },
      { t: "Redacción de los textos", d: "Servicios y obras explicados en simple, pensando en quien los busca." },
    ],
    noIncluye: ["Integraciones con sus sistemas", "Asistente con inteligencia artificial", "Portal (es el paso siguiente)"],
    pagos: [
      { cuando: "Al firmar", pct: 40 },
      { cuando: "Al aprobar el diseño", pct: 30 },
      { cuando: "Al publicar", pct: 30 },
    ],
  },
  {
    id: "completa",
    nombre: "Web inteligente",
    para: "La a medida, conectada a su operación y con inteligencia artificial.",
    lista: 5_200_000,
    lanzamiento: 3_900_000,
    semanas: "2 a 3 semanas",
    incluye: [
      { t: "Todo lo de la web a medida" },
      { t: "Asistente con inteligencia artificial", d: "Conoce sus servicios, normas y obras: responde a toda hora y deja la cotización lista.", tec: "Modelo de lenguaje + RAG" },
      { t: "Cotización que lee fotos y planos", d: "De la foto de la placa o de un plano saca potencia, tensión y marca.", tec: "Visión artificial" },
      { t: "Integración con Google Workspace", d: "Cada solicitud llega clasificada a su correo, queda en una planilla y agenda la visita.", tec: "Integración por API" },
      { t: "WhatsApp Business", d: "Respuesta automática fuera de horario y cada conversación registrada.", tec: "API de WhatsApp Business" },
      { t: "Panel de resultados", d: "Visitas, consultas recibidas y de dónde llegan (Google, Maps, directo).", tec: "Analítica sin cookies" },
      { t: "Posicionamiento técnico", d: "Ficha de cada servicio y de 12 obras para Google, con seguimiento.", tec: "SEO técnico + Search Console" },
    ],
    noIncluye: ["Portal (es el paso siguiente)"],
    pagos: [
      { cuando: "Al firmar", pct: 40 },
      { cuando: "Al aprobar el diseño", pct: 30 },
      { cuando: "Al publicar", pct: 30 },
    ],
    nota: "La inteligencia artificial se contrata a nombre de INECSO y se paga por uso; con su volumen, se espera bajo.",
  },
];

/** The honest contrast with cheap template sites, without naming anyone. */
export const CONTRASTE = {
  t: "¿Y por qué no una web de $300.000?",
  d: [
    "Existen y a algunas empresas les sirven, pero suelen ser una plantilla compartida por miles de sitios, que hay que ir parchando, lenta en el celular y a nombre de quien la hizo.",
    "Esta parte de una base propia, segura y rápida, queda a nombre de INECSO y es el cimiento del portal: no se bota después.",
  ],
};

// The process survey to quote the portal is free (done while the web is built); its reference value is shown so it is not read as worthless.
export const LEVANTAMIENTO = { referencial: 770_000 };
export const PORTAL_REF = { min: 5_100_000, max: 7_700_000, referencia: 6_400_000 };
export const SUSCRIPCION = { instalacion: 2_500_000, mensual: 290_000 };
export const MANT = { web: 80_000, todo: 160_000 };

// Monthly maintenance: INECSO is not technical and wants Gonzalo to take care of everything, so each plan says in
// plain words what he handles and how fast he answers. Response times stay modest on purpose: a static site almost
// never goes down, and stricter guarantees (formal SLAs) cost $200.000-$300.000 a month in the market.
export type Plan = {
  id: "ninguno" | "basico" | "recomendado" | "crecimiento";
  nombre: string;
  clp: number;
  para: string;
  respuesta?: string;
  incluye: Item[];
};
export const PLAN_RECOMENDADO: Plan["id"] = "recomendado";
export const PLANES: Plan[] = [
  {
    id: "ninguno",
    nombre: "Sin plan",
    clp: 0,
    para: "Cada cambio o problema se cotiza aparte.",
    incluye: [
      { t: "Precio cerrado antes de cada trabajo", d: "Me dicen qué necesitan y les cotizo antes de hacerlo." },
      { t: "Ojo: nadie está mirando la web", d: "Si algo falla o vence, se enteran por un cliente. No lo recomiendo." },
    ],
  },
  {
    id: "basico",
    nombre: "Básico",
    clp: 40_000,
    para: "Que nunca se caiga ni se venza nada.",
    respuesta: "Si algo falla, lo reviso dentro del siguiente día hábil.",
    incluye: [
      { t: "La vigilo todo el día", d: "Si deja de cargar, el aviso me llega a mí primero.", tec: "Monitoreo 24/7" },
      { t: "Copias de respaldo", d: "Todo se puede recuperar.", tec: "Respaldo automático" },
      { t: "Seguridad al día", d: "Reviso los avisos de seguridad y aplico lo necesario.", tec: "Revisión de dependencias" },
      { t: "Dominio y servidor", d: "Renuevo inecso.cl y el servidor a tiempo, a nombre de INECSO.", tec: "DNS, certificados y hosting" },
      { t: "Arreglo cualquier falla de la web", d: "Sin costo extra, las veces que haga falta." },
      { t: "Un cambio chico al mes", d: "Un teléfono, una foto, un texto." },
    ],
  },
  {
    id: "recomendado",
    nombre: "Recomendado",
    clp: MANT.web,
    para: "Que no tengan que pensar en la web.",
    respuesta: "Si la web se cae, la reviso el mismo día hábil. Los cambios quedan publicados en dos días hábiles.",
    incluye: [
      { t: "Todo lo del Básico" },
      { t: "Los cambios del mes, los que necesiten", d: "Me los mandan por WhatsApp o correo y yo los publico." },
      { t: "Su ficha de Google al día", d: "Horarios, fotos y datos; les propongo respuesta a cada reseña.", tec: "Google Business Profile" },
      { t: "Su correo y su dominio", d: "El correo @inecso.cl y sus cuentas; no los computadores ni la red.", tec: "Registros MX, SPF y DKIM" },
      { t: "Un informe cada tres meses, en simple", d: "Visitas, cómo los encontraron y velocidad.", tec: "Analítica sin cookies" },
    ],
  },
  {
    id: "crecimiento",
    nombre: "Crecimiento",
    clp: MANT.todo,
    para: "Que la web mejore cada mes.",
    respuesta: "Si la web se cae, tiene prioridad: la reviso dentro de cuatro horas hábiles.",
    incluye: [
      { t: "Todo lo del Recomendado" },
      { t: "Una mejora nueva cada mes", d: "Una sección, una función o un ajuste mayor, acordado con ustedes." },
      { t: "Una conversación cada tres meses", d: "Media hora para revisar qué funciona y qué sigue." },
      { t: "Cuando llegue el portal, cubre los dos", d: "Web y portal en el mismo plan." },
    ],
  },
];

/** After-sales commitments that hold with or without a maintenance plan (the warranty matches the Condiciones act). */
export const COMPROMISOS: Item[] = [
  { t: "Garantía", d: "60 días en la web y 90 en el portal: errores arreglados sin costo." },
  { t: "Todo a nombre de INECSO", d: "Dominio, servidor, código y datos son de ustedes desde el primer día." },
  { t: "Documentado", d: "Si un día yo no pudiera seguir, otra persona continúa sin empezar de cero.", tec: "Repositorio documentado" },
  { t: "Una salida ordenada", d: "Se avisa con 30 días y entrego accesos, código y documentación." },
  { t: "Un solo contacto", d: "Hablan conmigo, que la hice. Sin mesa de ayuda ni tickets." },
];

/** What happens when something goes wrong, in their words. */
export const IMPREVISTOS: { q: string; a: string }[] = [
  { q: "¿Y si la web deja de funcionar?", a: "Me llega el aviso antes que a ustedes y la reviso. Si algo sale mal, se vuelve a la versión anterior en minutos." },
  { q: "¿Y si vence el dominio?", a: "Lo renuevo yo, con tiempo, y el pago queda a nombre de INECSO." },
  { q: "¿Y si quieren agregar una obra o cambiar un teléfono?", a: "Me mandan la foto o el dato por WhatsApp o correo, y queda publicado. Con el plan Básico, uno al mes." },
  { q: "¿Y si alguien intenta hackearla?", a: "Viene protegida de fábrica y reviso los avisos de seguridad. Si pasara algo, restauro la última versión buena y les cuento." },
  { q: "¿Y si dejan de aparecer en Google?", a: "Lo reviso y lo corrijo. Desde el plan Recomendado, además, la ficha de Maps se mantiene al día." },
  { q: "¿Y si un día quieren dejar el plan?", a: "Avisan con 30 días y les entrego todo ordenado. Todo sigue siendo de ustedes." },
];
