// Content of the INECSO website demo.
// Real: texts, services and photos come from INECSO's earlier websites (inecso.cl 2008–2017, inecsoingenieria.cl
// 2017–2025, via the Internet Archive). Examples: the wording of each job, the portal client and its data.
// Facts still to confirm with INECSO are marked `porConfirmar`.

import portada from "@/assets/img/portada-grupo-jaula.jpg";
import grupoJaula from "@/assets/img/obra-grupo-jaula.jpg";
import terraza from "@/assets/img/obra-terraza-cobertizo.jpg";
import izaje from "@/assets/img/obra-izaje-recorte.jpg";
import desarmeMotor from "@/assets/img/obra-desarme-motor.jpg";
import hipot from "@/assets/img/obra-hipot.jpg";
import piping from "@/assets/img/obra-piping.jpg";
import ducto from "@/assets/img/obra-ducto.jpg";
import grupoMovil from "@/assets/img/obra-grupo-movil.jpg";
import desarmeSala from "@/assets/img/obra-desarme-sala.jpg";

export const IMG = { portada, grupoJaula, terraza, izaje, desarmeMotor, hipot, piping, ducto, grupoMovil, desarmeSala };

export const EMPRESA = {
  nombre: "INECSO Ingeniería",
  especialidad: "Grupos electrógenos, baja y media tensión",
  sec: "Instalador SEC clase A",
  domicilio: "Av. Trinidad Oriente 473, La Florida, Santiago",
  comuna: "La Florida, Santiago",
  telefono: "2 2291 5748",
  telefonoHref: "tel:+56222915748",
  cobertura: "Santiago y regiones",
};

export const RIBBON =
  "Demo de propuesta. Textos y fotos de las webs anteriores de INECSO (2008–2025). Las obras descritas y el portal son ejemplos; dirección, teléfono y clientes se confirman antes de publicar.";

export type AreaId = "gen" | "ing" | "civil";

export interface Servicio {
  t: string;
  d: string;
}

export interface Area {
  id: AreaId;
  titulo: string;
  resumen: string;
  servicios: Servicio[];
}

export const AREAS: Area[] = [
  {
    id: "gen",
    titulo: "Grupos electrógenos",
    resumen:
      "Respaldo de energía ante cortes de la red: traslado, obras civiles, instalación, conexiones, pruebas y puesta en marcha, en todas sus potencias.",
    servicios: [
      { t: "Montaje e instalación en todas sus potencias", d: "Traslado, obras civiles, instalación, conexiones, pruebas y puesta en marcha." },
      { t: "Armado y desarme", d: "Cuando el acceso es reducido, el grupo se lleva por partes (motor, alternador, chasis, panel, cabinas, ductos) y se arma y ancla en su lugar." },
      { t: "Izaje, posicionamiento y anclaje", d: "Con camión pluma propio y la planificación de cada maniobra." },
      { t: "Ductos de escape y evacuación de aire", d: "Fabricación de ductos, revestimiento térmico con manta de fibra cerámica y mangas de evacuación de aire caliente." },
      { t: "Piping para combustible", d: "Trasvasije automático desde estanque auxiliar o sub base, según DS 169, con supervisión de un ingeniero civil mecánico." },
      { t: "Amortiguadores de vibración", d: "Instalación y desmontaje para bajar ruidos y vibraciones hacia pisos y recintos vecinos." },
      { t: "Trabajos en altura y espacios confinados", d: "Con procedimientos y personal especializado para reducir riesgos." },
      { t: "Packing", d: "Embalaje, limpieza, paletizado y pintura de grupos, cabinas, transformadores y cables." },
    ],
  },
  {
    id: "ing",
    titulo: "Ingeniería eléctrica",
    resumen:
      "Proyectos y obras en baja y media tensión, mediciones de aislación HIPOT, puesta a tierra, alumbrado y subestaciones.",
    servicios: [
      { t: "Proyectos eléctricos", d: "Consultorías, asesorías y elaboración de proyectos eléctricos industriales y comerciales." },
      { t: "Obras en baja y media tensión", d: "Ejecución de obras eléctricas, inspección técnica y gerenciamiento de proyectos." },
      { t: "Medición de aislación con equipo HIPOT", d: "En cables de fuerza de media tensión (15, 17, 24 y 35 kV), para evitar fugas y arcos que dañen equipos y pongan en riesgo a las personas." },
      { t: "Cables de fuerza, control y comunicación", d: "Selección, tendido y conexión según norma." },
      { t: "Mallas de puesta a tierra", d: "En baja y media tensión, dimensionadas según el terreno, con medición y certificación." },
      { t: "Alumbrado y mantención en autopistas", d: "Postes, luminarias, canalizaciones y luces de seguridad en autopistas y plazas de peaje." },
      { t: "Bancos de condensadores y subestaciones", d: "Corrección del factor de potencia; diseño, montaje y mantención de subestaciones." },
      { t: "Iluminación de emergencia y corrientes débiles", d: "Sistemas de emergencia, redes de datos, telefonía y energía para salas de computación." },
    ],
  },
  {
    id: "civil",
    titulo: "Obras civiles y estructuras",
    resumen:
      "Radieres, contenedores de derrames y estructuras metálicas calculadas para llevar un grupo electrógeno a una azotea.",
    servicios: [
      { t: "Obras civiles", d: "Radieres, contenedores de derrames, reposición de veredas y calzadas, con cálculo estructural." },
      { t: "Estructuras metálicas y plataformas", d: "Para poner grupos electrógenos en azoteas y techos cuando no caben a piso, calculadas por un profesional del rubro." },
      { t: "Plataformas de muestreo isocinético", d: "Para medir emisiones en grupos electrógenos de más de 300 kW." },
    ],
  },
];

export type FiltroObra = "todas" | "gen" | "mt" | "civil" | "alu";

export const FILTROS: { id: FiltroObra; t: string }[] = [
  { id: "todas", t: "Todas" },
  { id: "gen", t: "Grupos electrógenos" },
  { id: "mt", t: "Baja y media tensión" },
  { id: "civil", t: "Obras civiles y estructuras" },
  { id: "alu", t: "Alumbrado" },
];

export interface Obra {
  cod: string;
  f: Exclude<FiltroObra, "todas">;
  img?: string;
  t: string;
  c: string;
  tipo: string;
  detalle: string;
  /** set when the job was published from the client portal: the small mark shown on its card */
  portal?: string;
}

// The photos are INECSO's (their last website, 2015–2018). Each description is an example until INECSO gives the
// real project, place and client permission.
export const OBRAS: Obra[] = [
  { cod: "OB-01", f: "gen", img: grupoJaula, t: "Montaje de grupo electrógeno en recinto enrejado", c: "Instalación, conexiones, pruebas y puesta en marcha", tipo: "Grupos electrógenos", detalle: "El grupo queda anclado sobre su base, con el recinto cerrado y señalizado. Se conecta al tablero de transferencia y se prueba con carga antes de entregarlo." },
  { cod: "OB-02", f: "civil", img: terraza, t: "Grupo electrógeno en terraza, con cobertizo metálico", c: "Estructura calculada y obras civiles asociadas", tipo: "Obras y estructuras", detalle: "Cuando el grupo no cabe a piso, va arriba: estructura metálica calculada, cobertizo para la intemperie y anclajes que reparten la carga sobre la losa." },
  { cod: "OB-03", f: "gen", img: izaje, t: "Izaje, posicionamiento y anclaje", c: "Grupo electrógeno izado sobre un recinto de acceso difícil", tipo: "Grupos electrógenos", detalle: "La maniobra se planifica antes: radio de la pluma, peso del equipo, cierre de la calle y señalero. El grupo baja directo a su base." },
  { cod: "OB-04", f: "gen", img: desarmeMotor, t: "Desarme de grupo electrógeno para un acceso reducido", c: "Motor, alternador y chasis llevados por partes", tipo: "Grupos electrógenos", detalle: "Si el equipo no pasa por la puerta, se desarma: motor, alternador, chasis y panel viajan por separado y se arman y alinean en su lugar." },
  { cod: "OB-05", f: "mt", img: hipot, t: "Medición de aislación con equipo HIPOT", c: "Cables de fuerza de media tensión antes de energizar", tipo: "Media tensión", detalle: "Antes de energizar, cada cable de media tensión se somete a prueba de aislación. El protocolo queda firmado y se entrega con la obra." },
  { cod: "OB-06", f: "gen", img: piping, t: "Piping de combustible desde estanque auxiliar", c: "Trasvasije automático según DS 169", tipo: "Grupos electrógenos", detalle: "Línea de combustible desde el estanque auxiliar hasta la sub base del grupo, con trasvasije automático y su prueba de hermeticidad." },
  { cod: "OB-07", f: "civil", img: ducto, t: "Fabricación de ductos de escape", c: "Codos y bridas soldados, con revestimiento térmico", tipo: "Obras y estructuras", detalle: "Ductos fabricados a medida del recorrido, con manta de fibra cerámica para que el calor no llegue a muros ni personas." },
  { cod: "OB-08", f: "gen", img: grupoMovil, t: "Grupo electrógeno móvil con carrete de cables", c: "Respaldo en terreno sobre carro", tipo: "Grupos electrógenos", detalle: "Respaldo temporal para una faena o una mantención programada: el grupo llega sobre su carro, se conecta y sostiene la carga mientras dure el trabajo." },
  { cod: "OB-09", f: "gen", img: desarmeSala, t: "Armado de grupo electrógeno en sala", c: "Faena señalizada y aislada del resto del recinto", tipo: "Grupos electrógenos", detalle: "Armado dentro de la sala de máquinas, con la faena aislada del resto del edificio y el orden que pide un recinto en operación." },
  { cod: "OB-10", f: "alu", t: "Mantención eléctrica en plaza de peaje", c: "Postes, luminarias, canalización y luces de seguridad", tipo: "Alumbrado", detalle: "Mantención de postes, luminarias y canalizaciones en una plaza de peaje, en horarios que no interrumpen el tránsito." },
  { cod: "OB-11", f: "mt", t: "Malla de puesta a tierra de protección", c: "Dimensionada según el terreno, con medición", tipo: "Baja tensión", detalle: "Malla calculada con la resistividad medida del terreno, construida y medida otra vez al terminar, con su certificado." },
];

// Client list published on the 2012 website; INECSO confirms which current clients can appear.
export const CLIENTES = [
  "Pontificia Universidad Católica de Chile",
  "Cervecera CCU Chile",
  "Agrícola Ariztía",
  "Banco BCI",
  "Finning Chile",
  "VTR",
  "Correos de Chile",
  "Alimentos Champion",
  "Cía. Industrial El Volcán",
  "Abastible",
  "Diario La Nación",
  "Corporación Municipal de La Florida",
];

export const PROCESO = [
  { t: "Visita técnica", d: "Vamos a terreno, medimos y entendemos qué necesita." },
  { t: "Proyecto y cotización", d: "Planos, cálculos y un presupuesto detallado, según la normativa SEC vigente." },
  { t: "Ejecución", d: "Equipo propio, prevención de riesgos y avances informados." },
  { t: "Pruebas y protocolos", d: "Mediciones de aislación, pruebas con carga y protocolos firmados." },
  { t: "Declaración SEC (TE1)", d: "Declaramos la instalación ante la SEC como instalador clase A." },
  { t: "Mantención", d: "Pautas de mantención y respuesta ante fallas, para que el respaldo funcione el día que se necesita." },
];

// Own equipment listed on the 2017 website (to confirm).
export const RECURSOS = [
  { n: "10 t", t: "Camión con grúa pluma de 6 t", d: "Para izajes y traslado de grupos electrógenos." },
  { n: "1.700 kg", t: "Camionetas de carga", d: "Para materiales y cuadrillas en terreno." },
  { n: "HIPOT", t: "Instrumentos de medida propios", d: "Aislación, puesta a tierra y calidad de energía." },
];

export const NORMAS = [
  { c: "DS 8 de 2019", t: "Reglamento de seguridad de las instalaciones de consumo de energía eléctrica" },
  { c: "RIC N°01", t: "Empalmes" },
  { c: "RIC N°04", t: "Conductores, materiales y sistemas de canalización" },
  { c: "RIC N°08", t: "Sistemas de emergencia" },
  { c: "RIC N°18", t: "Presentación de proyectos" },
  { c: "RIC N°19", t: "Puesta en servicio" },
];

export const TIPOS_TRABAJO = [
  { id: "grupo", t: "Grupo electrógeno", d: "Venta, montaje, traslado o puesta en marcha" },
  { id: "mantencion", t: "Mantención o falla", d: "Un equipo que no parte o una pauta anual" },
  { id: "proyecto", t: "Proyecto eléctrico", d: "Planos, cálculos y declaración SEC" },
  { id: "obra", t: "Obra en baja o media tensión", d: "Tableros, alimentadores, subestaciones" },
  { id: "tierra", t: "Puesta a tierra o mediciones", d: "Mallas, HIPOT, certificación" },
  { id: "civil", t: "Obra civil o estructura", d: "Radieres, plataformas, ductos" },
] as const;

export type TipoTrabajo = (typeof TIPOS_TRABAJO)[number]["id"];

// ---------- client portal (fictional clients and jobs) ----------

export const ETAPAS = ["Cotización", "Proyecto", "Ejecución", "Pruebas y mediciones", "Declaración SEC", "Entrega"];

export interface PObra {
  id: string;
  titulo: string;
  lugar: string;
  codigo: string;
  etapa: number;
  avance: number;
  inicio: string;
  entrega: string;
  // cumulative % per week: planned and real (real stops at the current week)
  plan: number[];
  real: number[];
  bitacora: { d: string; q: string; t: string }[];
  docs: { n: string; f: string; d: string; nuevo?: boolean }[];
  equipo: { n: string; r: string; ini: string }[];
}

export const CLIENTE_PORTAL = "Alimentos del Maipo S.A.";

// The portal's jobs, equipment and work orders live in ./portal-demo.ts (dates relative to the day the demo opens).

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
export function fecha(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${Number(d)} ${MESES[Number(m) - 1]} ${y}`;
}

// ---- Version B of the homepage (vision → pain → solution → growth → proof) ----

// Default hours of power cuts per year in the "¿Cuánto le cuesta un corte?" estimator.
// Conservative: Chile's 2023 average (13.58 h per customer, a normal year); 2024 was 27.59 h national and 29.43 h in
// the RM (SEC figures, reported by Diario Financiero on 17 Mar 2025 and 15 Mar 2024). Change it here only.
export const CORTE_HORAS_DEFAULT = 13;
// Default cost of one hour stopped, in pesos: deliberately modest; the visitor replaces it with their own.
export const CORTE_COSTO_HORA_DEFAULT = 300_000;
// Default share of the operation that stops during a cut.
export const CORTE_AFECTADO_DEFAULT = 50;
// What an automatic standby generator avoids of that loss: low end = it backs up only the critical loads,
// high end = it backs up the whole affected load (the few seconds of the transfer are not covered).
export const CORTE_EVITA = { bajo: 0.6, alto: 0.95 };

export const DOLORES = [
  {
    id: "corte",
    t: "Un corte detiene todo",
    d: "La producción se para, la cadena de frío corre riesgo, los ascensores quedan detenidos y los servidores se apagan sin aviso.",
  },
  {
    id: "falla",
    t: "El grupo que no parte el día que se necesita",
    d: "Sin pruebas con carga ni mantención, la batería, el combustible o la transferencia fallan justo en la emergencia.",
  },
  {
    id: "sec",
    t: "La instalación sin declaración SEC al día",
    d: "Sin su TE1 vigente aparecen problemas con el seguro, con las inspecciones y con la fiscalización.",
  },
  {
    id: "proveedores",
    t: "Tres proveedores para un solo trabajo",
    d: "Uno vende el grupo, otro hace la obra civil y otro trae la grúa. Cuando algo falla, nadie responde por el conjunto.",
  },
  {
    id: "lugar",
    t: "El lugar que nadie quiere tocar",
    d: "Azoteas sin acceso, subterráneos estrechos y salas donde el equipo no entra entero por la puerta.",
  },
] as const;

export const SOLUCION = [
  { dolor: "corte", t: "Transferencia automática", d: "El tablero detecta el corte, arranca el grupo y le pasa la carga en segundos, sin que nadie tenga que hacer nada." },
  { dolor: "falla", t: "Mantención y pruebas con carga", d: "Pautas periódicas, pruebas reales y respuesta ante fallas, para que el respaldo funcione el día que importa." },
  { dolor: "sec", t: "Declaración SEC como instalador clase A", d: "Proyecto, protocolos y TE1 según el DS 8 de 2019 y los pliegos RIC vigentes." },
  { dolor: "proveedores", t: "Un solo responsable", d: "Proyecto, suministro, obras civiles, izaje con camión grúa, pruebas y mantención: una sola empresa responde por todo." },
  { dolor: "lugar", t: "Montaje donde se necesite", d: "Desarmamos, izamos y armamos de nuevo grupos en azoteas, subterráneos y recintos de acceso difícil." },
] as const;
