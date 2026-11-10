// Client portal demo: fictional clients, jobs, generator sets and work orders. Everything here is an example.
// Dates are relative to the day the seed is built, so the demo looks alive whenever it is opened.
// The main contractor is always called "Empresa mandante": never its real name.

import { CLIENTE_PORTAL, FILTROS, IMG, type FiltroObra, type Obra, type PObra } from "./inecso";

export type Rol = "inecso" | "mandante" | "cliente";

export const MANDANTE = "Empresa mandante";

export interface Cliente {
  id: string;
  nombre: string;
  /** what the public website says instead of the name, unless the job allows naming the client */
  sector: string;
}

export const CLIENTES_PORTAL: Cliente[] = [
  { id: "maipo", nombre: CLIENTE_PORTAL, sector: "Planta de alimentos, Región Metropolitana" },
  { id: "aromos", nombre: "Clínica Los Aromos", sector: "Clínica, Región Metropolitana" },
  { id: "rioclaro", nombre: "Frigorífico Río Claro SpA", sector: "Frigorífico, Región Metropolitana" },
];

export function clienteNombre(id: string) {
  return CLIENTES_PORTAL.find((c) => c.id === id)?.nombre ?? "Cliente";
}

export function clienteSector(id: string) {
  return CLIENTES_PORTAL.find((c) => c.id === id)?.sector ?? "Cliente industrial, Región Metropolitana";
}

// ---------- dates (local calendar days, ISO yyyy-mm-dd) ----------

const pad = (n: number) => String(n).padStart(2, "0");
export const isoDe = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const hoyIso = () => isoDe(new Date());
const partes = (iso: string) => iso.split("-").map(Number) as [number, number, number];
export function sumarDias(iso: string, n: number) {
  const [y, m, d] = partes(iso);
  return isoDe(new Date(y, m - 1, d + n));
}
export function sumarMeses(iso: string, n: number) {
  const [y, m, d] = partes(iso);
  return isoDe(new Date(y, m - 1 + n, d));
}
/** Days from a to b (b - a). */
export function diasEntre(a: string, b: string) {
  const [ya, ma, da] = partes(a);
  const [yb, mb, db] = partes(b);
  return Math.round((Date.UTC(yb, mb - 1, db) - Date.UTC(ya, ma - 1, da)) / 86_400_000);
}
export const finDeMes = (iso: string) => {
  const [y, m] = partes(iso);
  return isoDe(new Date(y, m, 0));
};
export const horaAhora = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const miles = (n: number) => n.toLocaleString("es-CL");

// ---------- jobs ----------

export interface ObraP extends PObra {
  clienteId: string;
  /** subcontracted by the main contractor, which then sees it too */
  mandante: boolean;
  /** photos of the job (bundled demo photos only), to choose one for the public website */
  fotos?: ClaveImg[];
}

/** Planned cumulative progress for a job of n weeks (a smooth S). */
export function curvaPlan(semanas: number) {
  const n = Math.max(2, semanas);
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return Math.round(100 * (3 * t * t - 2 * t * t * t));
  });
}

/** Minimum progress when each stage starts (used when a stage is advanced). */
export const PISO_ETAPA = [0, 8, 20, 75, 90, 97];

export const QUIENES = ["Jefe de proyecto", "Supervisor de obra", "Prevención de riesgos", "Técnico de grupos electrógenos"];

// ---------- equipment and maintenance ----------

export interface Equipo {
  id: string;
  clienteId: string;
  mandante: boolean;
  marca: string;
  modelo: string;
  kva: number;
  serie: string;
  ubicacion: string;
  /** latest hour-meter reading */
  horometro: number;
  /** estimated operating hours per month, to project when the hour rule is reached */
  usoMes: number;
  regla: { horas?: number; meses: number };
  ultima: { fecha: string; horometro: number; ot?: string };
}

export const nombreEquipo = (e: Equipo) => `Grupo electrógeno ${miles(e.kva)} kVA`;
export const modeloEquipo = (e: Equipo) => `${e.marca} ${e.modelo}`;

export function reglaTexto(r: Equipo["regla"]) {
  const meses = r.meses === 12 ? "una vez al año" : `cada ${r.meses} meses`;
  return r.horas ? `Cada ${r.horas} h de operación o ${meses}, lo que ocurra primero` : meses[0].toUpperCase() + meses.slice(1);
}

export type EstadoMant = "atrasada" | "proxima" | "aldia";
export const ESTADO_MANT: Record<EstadoMant, string> = { atrasada: "Atrasada", proxima: "Próxima", aldia: "Al día" };

export interface Vencimiento {
  fecha: string;
  dias: number;
  estado: EstadoMant;
  motivo: "horas" | "calendario";
  horasLimite?: number;
  horasRestantes?: number;
}

/** When the next maintenance is due: the first of the hour rule (projected with the monthly use) and the calendar rule. */
export function vencimiento(e: Equipo, hoy: string): Vencimiento {
  const porFecha = sumarMeses(e.ultima.fecha, e.regla.meses);
  let fecha = porFecha;
  let motivo: Vencimiento["motivo"] = "calendario";
  let horasLimite: number | undefined;
  let horasRestantes: number | undefined;
  if (e.regla.horas) {
    horasLimite = e.ultima.horometro + e.regla.horas;
    horasRestantes = horasLimite - e.horometro;
    const porHoras = sumarDias(hoy, Math.round((horasRestantes / Math.max(e.usoMes, 0.5)) * 30));
    if (porHoras < porFecha) {
      fecha = porHoras;
      motivo = "horas";
    }
  }
  const dias = diasEntre(hoy, fecha);
  const estado: EstadoMant = dias < 0 ? "atrasada" : dias <= 30 ? "proxima" : "aldia";
  return { fecha, dias, estado, motivo, horasLimite, horasRestantes };
}

export const TECNICOS = ["Técnico de grupos, cuadrilla 1", "Técnico de grupos, cuadrilla 2", "Supervisor eléctrico"];

// ---------- standard work order ----------

export const PAUTA = [
  { id: "niveles", t: "Niveles de aceite y refrigerante", d: "Nivel y estado de ambos; sin fugas a la vista." },
  { id: "filtros", t: "Filtros", d: "Aire, aceite y combustible: estado o cambio según la pauta." },
  { id: "bateria", t: "Batería y cargador", d: "Voltaje en reposo, bornes limpios y cargador funcionando." },
  { id: "correas", t: "Correas y mangueras", d: "Tensión de correas; grietas y abrazaderas en mangueras." },
  { id: "combustible", t: "Combustible", d: "Nivel del estanque, agua en el filtro separador y fugas." },
  { id: "partida", t: "Prueba de partida", d: "Arranque en vacío: tiempo de partida, voltaje y frecuencia." },
  { id: "carga", t: "Prueba con carga", d: "Con la carga del recinto o un banco de carga: temperatura y presión de aceite." },
  { id: "transferencia", t: "Prueba de transferencia automática", d: "Corte simulado: el tablero transfiere a grupo y vuelve a la red." },
  { id: "horometro", t: "Lectura de horómetro", d: "Horas de operación al terminar la visita." },
] as const;

export type ItemId = (typeof PAUTA)[number]["id"];
export type Resultado = "ok" | "atencion" | "na";
export const RESULTADO: Record<Resultado, string> = { ok: "OK", atencion: "Requiere atención", na: "N/A" };

export interface ItemRes {
  r?: Resultado;
  nota?: string;
}

/** A signature: strokes as flat [x0, y0, x1, y1, ...] lists in a 1000 x 300 box, or a typed name. */
export interface Firma {
  trazos?: number[][];
  texto?: string;
}

export type ClaveImg = keyof typeof IMG;
export type Foto = { tipo: "demo"; clave: ClaveImg } | { tipo: "local"; url: string; nombre: string };

export interface Comentario {
  fecha: string;
  autor: Rol;
  texto: string;
}

export interface OT {
  id: string;
  equipoId: string;
  tipo: "preventiva" | "correctiva";
  estado: "programada" | "abierta" | "cerrada";
  fecha: string;
  tecnico: string;
  items: Partial<Record<ItemId, ItemRes>>;
  horometro?: number;
  observaciones: string;
  fotos: Foto[];
  firmaTecnico?: Firma;
  recibe: { nombre: string; cargo: string };
  firmaRecibe?: Firma;
  cierre?: { fecha: string; hora: string; enviadoA: string[] };
  revision?: { fecha: string };
  comentarios: Comentario[];
}

export const TIPO_OT: Record<OT["tipo"], string> = { preventiva: "Mantención preventiva", correctiva: "Visita correctiva" };

// ---------- from the portal to the public website ----------

/** How a job appears on the public website when INECSO publishes it from the portal. */
export interface PubWeb {
  on: boolean;
  texto: string;
  foto?: ClaveImg;
  /** show the client's name; off by default, so the website shows the sector instead */
  conNombre: boolean;
  /** first day it was published */
  desde?: string;
}

/** Default image for a job with no photos of its own. */
export const FOTO_WEB_DEFAULT: ClaveImg = "portada";

export function textoWebDefault(o: ObraP) {
  const t = o.titulo.endsWith(".") ? o.titulo : `${o.titulo}.`;
  return `${t} Proyecto, ejecución y pruebas a cargo de INECSO${o.etapa >= 4 || o.avance >= 100 ? ", con declaración ante la SEC" : ""}.`;
}

/** The publication of a job, with defaults filled in (also guards against a partial saved entry). */
export function pubDe(e: EstadoPortal, o: ObraP): PubWeb {
  const p = e.web[o.id];
  return {
    on: !!p?.on,
    texto: typeof p?.texto === "string" ? p.texto : textoWebDefault(o),
    foto: p?.foto && p.foto in IMG ? p.foto : (o.fotos?.[0] ?? FOTO_WEB_DEFAULT),
    conNombre: !!p?.conNombre,
    desde: p?.desde,
  };
}

type Filtro = Exclude<FiltroObra, "todas">;

/** The website's filter for a job, from its title. */
function filtroDe(titulo: string): Filtro {
  if (/grupo|bater|cargador|transferencia/i.test(titulo)) return "gen";
  if (/civil|estructura|radier|ducto|plataforma/i.test(titulo)) return "civil";
  if (/alumbrado|luminaria/i.test(titulo)) return "alu";
  return "mt";
}

/** A published portal job as a card of the website's Obras page. The client is named only if the job allows it. */
export function obraWeb(e: EstadoPortal, o: ObraP): Obra {
  const p = pubDe(e, o);
  const f = filtroDe(o.titulo);
  return {
    cod: o.codigo,
    f,
    img: IMG[p.foto ?? FOTO_WEB_DEFAULT],
    t: o.titulo,
    c: p.conNombre ? `${clienteNombre(o.clienteId)}, ${o.lugar}` : clienteSector(o.clienteId),
    tipo: FILTROS.find((x) => x.id === f)?.t ?? "Obra",
    detalle: p.texto.trim() || o.titulo,
    portal: o.avance >= 100 ? "Recién terminada, desde el portal" : "En curso, desde el portal",
  };
}

/** Published portal jobs, the most recently published first. */
export function obrasWeb(e: EstadoPortal): Obra[] {
  return e.obras
    .filter((o) => e.web[o.id]?.on)
    .sort((a, b) => (e.web[b.id]?.desde ?? "").localeCompare(e.web[a.id]?.desde ?? "") || Number(b.id) - Number(a.id))
    .map((o) => obraWeb(e, o));
}

// ---------- access log ----------

export type Dispositivo = "Celular" | "Computador";

export interface Acceso {
  /** person or position (never a real name) */
  quien: string;
  /** company: INECSO, the main contractor or the client */
  entidad: string;
  rol: Rol;
  fecha: string;
  hora: string;
  disp: Dispositivo;
  /** entered from this demo */
  demo?: boolean;
}

// ---------- the whole demo state ----------

export interface EstadoPortal {
  v: 2;
  obras: ObraP[];
  equipos: Equipo[];
  ots: OT[];
  sig: { obra: number; ot: number };
  /** publications on the public website, by job id */
  web: Record<string, PubWeb>;
  /** latest first */
  accesos: Acceso[];
}

export const codigoOT = (n: number) => `OT-${String(n).padStart(4, "0")}`;

/** A hand-drawn-looking signature for the seed reports. */
function garabato(semilla: number): number[][] {
  let s = semilla * 7919;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const a: number[] = [];
  for (let i = 0; i <= 70; i++) {
    const t = i / 70;
    a.push(Math.round(90 + t * 640 + Math.sin(t * Math.PI * 9 + semilla) * 22), Math.round(160 + Math.sin(t * Math.PI * 5 + semilla) * 62 * (1 - t * 0.5) + (rnd() - 0.5) * 8));
  }
  const b = [150, 248, 420, 236, 610, 240, 820, 226];
  return [a, b];
}

const todo = (r: Resultado = "ok"): Partial<Record<ItemId, ItemRes>> => Object.fromEntries(PAUTA.map((p) => [p.id, { r }]));

export function semilla(hoy: string): EstadoPortal {
  const d = (n: number) => sumarDias(hoy, n);

  const obras: ObraP[] = [
    {
      id: "1",
      clienteId: "maipo",
      mandante: true,
      titulo: "Ampliación de tablero general y nuevo alimentador",
      lugar: "Planta Buin",
      codigo: "OB-121",
      etapa: 2,
      avance: 64,
      inicio: d(-42),
      entrega: d(21),
      plan: [0, 6, 14, 26, 41, 56, 70, 82, 92, 100],
      real: [0, 5, 12, 22, 38, 53, 64],
      bitacora: [
        { d: d(-1), q: "Supervisor de obra", t: "Terminado el tendido del alimentador por la bandeja norte. Mañana se conecta el tablero nuevo; habrá un corte programado de 40 minutos a las 07:30." },
        { d: d(-3), q: "Prevención de riesgos", t: "Charla de inicio de faena y revisión de bloqueo y etiquetado con el personal de mantención de la planta." },
        { d: d(-8), q: "Jefe de proyecto", t: "Llegó el tablero desde fábrica. Se adjunta su protocolo de pruebas." },
        { d: d(-42), q: "Jefe de proyecto", t: "Proyecto aprobado por su equipo. Se programa el inicio de obra." },
      ],
      docs: [
        { n: "Plano unifilar, revisión C", f: "PDF", d: d(-43) },
        { n: "Protocolo de pruebas del tablero", f: "PDF", d: d(-8), nuevo: true },
        { n: "Carta Gantt de la obra", f: "PDF", d: d(-42) },
        { n: "Cotización aprobada", f: "PDF", d: d(-49) },
      ],
      equipo: [
        { n: "Jefe de proyecto", r: "Responde sus consultas técnicas y de plazos", ini: "JP" },
        { n: "Supervisor de obra", r: "En terreno de lunes a viernes", ini: "SO" },
        { n: "Prevención de riesgos", r: "Seguridad de la faena", ini: "PR" },
      ],
    },
    {
      id: "2",
      clienteId: "maipo",
      mandante: true,
      titulo: "Cambio de batería de partida y cargador del grupo de 500 kVA",
      lugar: "Planta Buin",
      fotos: ["grupoJaula", "desarmeMotor"],
      codigo: "OB-119",
      etapa: 3,
      avance: 85,
      inicio: d(-14),
      entrega: d(3),
      plan: [0, 50, 90, 100],
      real: [0, 45, 85],
      bitacora: [
        { d: d(-2), q: "Técnico de grupos electrógenos", t: "Prueba de partida y prueba con carga durante 2 horas, sin observaciones. Falta el protocolo de mediciones." },
        { d: d(-6), q: "Técnico de grupos electrógenos", t: "Instalada la batería nueva y el cargador. Voltaje en reposo de 12,8 V." },
        { d: d(-14), q: "Jefe de proyecto", t: "Trabajo aprobado a partir de la observación del informe de mantención OT-0138." },
      ],
      docs: [
        { n: "Ficha técnica del cargador", f: "PDF", d: d(-6), nuevo: true },
        { n: "Cotización aprobada", f: "PDF", d: d(-15) },
      ],
      equipo: [{ n: "Técnico de grupos electrógenos", r: "Montaje y pruebas", ini: "TG" }],
    },
    {
      id: "3",
      clienteId: "maipo",
      mandante: false,
      titulo: "Malla de puesta a tierra de la sala eléctrica",
      lugar: "Bodega San Bernardo",
      codigo: "OB-108",
      etapa: 5,
      avance: 100,
      inicio: d(-84),
      entrega: d(-59),
      plan: [0, 25, 60, 90, 100],
      real: [0, 22, 58, 92, 100],
      bitacora: [{ d: d(-59), q: "Jefe de proyecto", t: "Obra entregada. El certificado de medición de resistencia de puesta a tierra está en documentos." }],
      docs: [
        { n: "Certificado de medición de puesta a tierra", f: "PDF", d: d(-59) },
        { n: "Declaración de instalación ante la SEC (TE1)", f: "PDF", d: d(-61) },
      ],
      equipo: [{ n: "Jefe de proyecto", r: "Garantía y consultas", ini: "JP" }],
    },
    {
      id: "4",
      clienteId: "aromos",
      mandante: true,
      titulo: "Grupo electrógeno de 800 kVA y tablero de transferencia para el pabellón nuevo",
      lugar: "Edificio de pabellones",
      fotos: ["izaje", "terraza"],
      codigo: "OB-123",
      etapa: 1,
      avance: 12,
      inicio: d(-10),
      entrega: d(60),
      plan: curvaPlan(10),
      real: [0, 12],
      bitacora: [
        { d: d(-2), q: "Jefe de proyecto", t: "Levantamiento en terreno listo. El proyecto queda en revisión del cliente y de la Empresa mandante." },
        { d: d(-10), q: "Jefe de proyecto", t: "Orden de compra recibida. Se agenda el levantamiento." },
      ],
      docs: [
        { n: "Levantamiento fotográfico", f: "PDF", d: d(-2), nuevo: true },
        { n: "Cotización aprobada", f: "PDF", d: d(-12) },
      ],
      equipo: [
        { n: "Jefe de proyecto", r: "Responde sus consultas técnicas y de plazos", ini: "JP" },
        { n: "Prevención de riesgos", r: "Seguridad de la faena", ini: "PR" },
      ],
    },
    {
      id: "5",
      clienteId: "rioclaro",
      mandante: true,
      titulo: "Medición de aislación HIPOT en alimentadores de media tensión",
      lugar: "Planta Lampa",
      fotos: ["hipot"],
      codigo: "OB-124",
      etapa: 3,
      avance: 70,
      inicio: d(-21),
      entrega: d(7),
      plan: [0, 20, 45, 70, 90, 100],
      real: [0, 18, 40, 70],
      bitacora: [
        { d: d(-1), q: "Supervisor de obra", t: "Medidos 4 de 6 alimentadores, todos dentro de lo esperado. Los dos restantes se miden el sábado, con la planta detenida." },
        { d: d(-21), q: "Jefe de proyecto", t: "Inicio de trabajos. Programa de cortes coordinado con mantención de la planta." },
      ],
      docs: [{ n: "Protocolo de mediciones, parcial", f: "PDF", d: d(-1), nuevo: true }],
      equipo: [{ n: "Supervisor de obra", r: "Mediciones en terreno", ini: "SO" }],
    },
    {
      id: "6",
      clienteId: "rioclaro",
      mandante: false,
      titulo: "Cambio de tablero de transferencia automática",
      lugar: "Planta Lampa, cámaras 3 y 4",
      codigo: "OB-125",
      etapa: 0,
      avance: 0,
      inicio: d(-3),
      entrega: d(45),
      plan: curvaPlan(7),
      real: [0],
      bitacora: [{ d: d(-3), q: "Jefe de proyecto", t: "Visita técnica realizada. La cotización está en preparación." }],
      docs: [],
      equipo: [{ n: "Jefe de proyecto", r: "Cotización y proyecto", ini: "JP" }],
    },
  ];

  const equipos: Equipo[] = [
    { id: "EQ-01", clienteId: "maipo", mandante: true, marca: "Andigen", modelo: "AG-500", kva: 500, serie: "AG5-21877", ubicacion: "Planta Buin, sala de grupos", horometro: 1057, usoMes: 18, regla: { horas: 250, meses: 12 }, ultima: { fecha: d(-75), horometro: 1012, ot: "OT-0138" } },
    { id: "EQ-02", clienteId: "maipo", mandante: false, marca: "Kordel", modelo: "KD-250", kva: 250, serie: "KD2-40311", ubicacion: "Bodega San Bernardo, patio de servicio", horometro: 693, usoMes: 4, regla: { horas: 250, meses: 12 }, ultima: { fecha: d(-400), horometro: 640 } },
    { id: "EQ-03", clienteId: "maipo", mandante: true, marca: "Motrisur", modelo: "MS-200", kva: 200, serie: "MS2-11906", ubicacion: "Planta Buin, cámaras de frío", horometro: 2312, usoMes: 9, regla: { horas: 250, meses: 12 }, ultima: { fecha: d(-345), horometro: 2210 } },
    { id: "EQ-04", clienteId: "aromos", mandante: true, marca: "Andigen", modelo: "AG-800", kva: 800, serie: "AG8-30552", ubicacion: "Sala de máquinas, subsuelo -2", horometro: 1564, usoMes: 6, regla: { horas: 250, meses: 6 }, ultima: { fecha: d(-172), horometro: 1530 } },
    { id: "EQ-05", clienteId: "aromos", mandante: true, marca: "Motrisur", modelo: "MS-400", kva: 400, serie: "MS4-08127", ubicacion: "Torre B, azotea", horometro: 915, usoMes: 5, regla: { horas: 250, meses: 6 }, ultima: { fecha: d(-215), horometro: 880 } },
    { id: "EQ-06", clienteId: "aromos", mandante: true, marca: "Kordel", modelo: "KD-150", kva: 150, serie: "KD1-52260", ubicacion: "Edificio de consultas, patio de servicio", horometro: 418, usoMes: 4, regla: { horas: 250, meses: 6 }, ultima: { fecha: d(-60), horometro: 410 } },
    { id: "EQ-07", clienteId: "rioclaro", mandante: true, marca: "Kordel", modelo: "KD-1000", kva: 1000, serie: "KD10-7741", ubicacion: "Planta Lampa, sala eléctrica", horometro: 6466, usoMes: 70, regla: { horas: 250, meses: 12 }, ultima: { fecha: d(-20), horometro: 6420, ot: "OT-0140" } },
    { id: "EQ-08", clienteId: "rioclaro", mandante: false, marca: "Andigen", modelo: "AG-150", kva: 150, serie: "AG1-66018", ubicacion: "Planta Lampa, cámaras 3 y 4", horometro: 3372, usoMes: 80, regla: { horas: 250, meses: 12 }, ultima: { fecha: d(-100), horometro: 3105 } },
  ];

  const ots: OT[] = [
    {
      id: "OT-0138",
      equipoId: "EQ-01",
      tipo: "preventiva",
      estado: "cerrada",
      fecha: d(-75),
      tecnico: TECNICOS[0],
      items: {
        ...todo(),
        bateria: { r: "atencion", nota: "Batería de partida con 11,9 V en reposo. Se recomienda cambiarla antes del invierno." },
      },
      horometro: 1012,
      observaciones: "Grupo en buen estado general. Prueba con carga de 60 minutos al 70 % sin alarmas. Se cambiaron filtros de aceite y combustible.",
      fotos: [
        { tipo: "demo", clave: "grupoJaula" },
        { tipo: "demo", clave: "desarmeMotor" },
      ],
      firmaTecnico: { trazos: garabato(3) },
      recibe: { nombre: "Jefe de mantención", cargo: "Alimentos del Maipo S.A." },
      firmaRecibe: { trazos: garabato(8) },
      cierre: { fecha: d(-75), hora: "16:20", enviadoA: [MANDANTE, CLIENTE_PORTAL] },
      revision: { fecha: d(-74) },
      comentarios: [{ fecha: d(-74), autor: "mandante", texto: "Recibido. Coordinen con el cliente el cambio de batería antes de la próxima visita." }],
    },
    {
      id: "OT-0140",
      equipoId: "EQ-07",
      tipo: "preventiva",
      estado: "cerrada",
      fecha: d(-20),
      tecnico: TECNICOS[1],
      items: todo(),
      horometro: 6420,
      observaciones: "Mantención de 250 h según pauta. Cambio de aceite, filtros y revisión de correas. Prueba con carga de 2 horas con la planta en horario punta, sin observaciones.",
      fotos: [
        { tipo: "demo", clave: "grupoMovil" },
        { tipo: "demo", clave: "piping" },
      ],
      firmaTecnico: { trazos: garabato(5) },
      recibe: { nombre: "Encargado de mantención", cargo: "Frigorífico Río Claro SpA" },
      firmaRecibe: { trazos: garabato(11) },
      cierre: { fecha: d(-20), hora: "13:05", enviadoA: [MANDANTE, "Frigorífico Río Claro SpA"] },
      comentarios: [],
    },
    {
      id: "OT-0141",
      equipoId: "EQ-02",
      tipo: "preventiva",
      estado: "programada",
      fecha: d(3),
      tecnico: TECNICOS[0],
      items: {},
      observaciones: "",
      fotos: [],
      recibe: { nombre: "", cargo: "" },
      comentarios: [],
    },
    {
      id: "OT-0142",
      equipoId: "EQ-04",
      tipo: "preventiva",
      estado: "abierta",
      fecha: hoy,
      tecnico: TECNICOS[1],
      items: { niveles: { r: "ok" }, filtros: { r: "ok", nota: "Cambio de filtro de aire." }, bateria: { r: "ok" } },
      observaciones: "",
      fotos: [{ tipo: "demo", clave: "desarmeSala" }],
      recibe: { nombre: "", cargo: "Clínica Los Aromos" },
      comentarios: [],
    },
  ];

  // Fictional sign-ins of the last days: positions, never names.
  const accesos: Acceso[] = [
    { quien: "Jefe de proyecto", entidad: "INECSO", rol: "inecso", fecha: d(-1), hora: "18:12", disp: "Computador" },
    { quien: "Encargado de mantención", entidad: "Clínica Los Aromos", rol: "cliente", fecha: d(-1), hora: "16:47", disp: "Celular" },
    { quien: "Técnico de grupos, cuadrilla 2", entidad: "INECSO", rol: "inecso", fecha: d(-1), hora: "07:52", disp: "Celular" },
    { quien: "Supervisor de contratos", entidad: MANDANTE, rol: "mandante", fecha: d(-2), hora: "11:30", disp: "Computador" },
    { quien: "Jefe de mantención", entidad: CLIENTE_PORTAL, rol: "cliente", fecha: d(-2), hora: "09:15", disp: "Computador" },
    { quien: "Administración", entidad: "INECSO", rol: "inecso", fecha: d(-3), hora: "10:04", disp: "Computador" },
    { quien: "Encargado de mantención", entidad: "Frigorífico Río Claro SpA", rol: "cliente", fecha: d(-4), hora: "20:31", disp: "Celular" },
    { quien: "Supervisor de contratos", entidad: MANDANTE, rol: "mandante", fecha: d(-5), hora: "08:58", disp: "Celular" },
  ];

  return { v: 2, obras, equipos, ots, sig: { obra: 126, ot: 143 }, web: {}, accesos };
}

