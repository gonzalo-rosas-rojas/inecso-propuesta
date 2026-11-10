// Monthly management summary: the current month from the live demo state, the five months before it generated from
// fixed seeds (one per month and equipment), so the numbers are stable on every reload and fictional like the rest.

import { ETAPAS, PISO_ETAPA, clienteNombre, diasEntre, finDeMes, sumarMeses, vencimiento, type EstadoPortal, type Equipo, type ObraP } from "./datos";
import { ve, type Sesion } from "./estado";

/** Same assumptions as the proposal's calculator: hours to build one report by hand, and the share the portal saves. */
export const HORAS_INFORME = 1.5;
export const AHORRO_INFORME = [0.3, 0.5] as const;

export const MESES_LARGO = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const MESES_CORTO = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];

export const mesDe = (iso: string) => iso.slice(0, 7);
export const nombreMes = (mes: string) => `${MESES_LARGO[Number(mes.slice(5, 7)) - 1]} ${mes.slice(0, 4)}`;
export const mesCorto = (mes: string) => MESES_CORTO[Number(mes.slice(5, 7)) - 1];

/** The current month and the five before it, newest first. */
export function ultimosMeses(hoy: string, n = 6) {
  const base = `${mesDe(hoy)}-01`;
  return Array.from({ length: n }, (_, k) => mesDe(sumarMeses(base, -k)));
}

export interface FilaCliente {
  id: string;
  nombre: string;
  equipos: number;
  programadas: number;
  realizadas: number;
  aldia: number;
  atrasadas: number;
  informes: number;
}

export interface ResumenMes {
  mes: string;
  enCurso: boolean;
  programadas: number;
  realizadas: number;
  preventivas: number;
  correctivas: number;
  /** closed work orders = reports sent (each closing sends its report) */
  informes: number;
  atrasadas: number;
  /** active jobs at the end of the month (or today), by stage */
  porEtapa: number[];
  entregadas: number;
  clientes: FilaCliente[];
}

// ---------- seeded numbers ----------

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Small deterministic generator (mulberry32) for one key. */
function azar(key: string) {
  let a = hash(key);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * What happened to one generator set in a past month. Visits follow a plan (heavy-use sets every month, the rest every
 * other month, alternating by their place in the list, plus the odd rescheduled one); whether each was done and the
 * corrective calls come from the month's seed.
 */
function historiaEquipo(q: Equipo, i: number, mes: string) {
  const r = azar(`${mes}:${q.id}`);
  const n = Number(mes.slice(0, 4)) * 12 + Number(mes.slice(5, 7));
  const programada = q.usoMes >= 50 || (n + i) % 2 === 0 || r() < 0.12;
  const realizada = programada && r() < 0.88;
  const correctiva = r() < (q.usoMes >= 50 ? 0.3 : 0.12) ? 1 : 0;
  return { programada, realizada, correctiva };
}

// Earlier jobs, already delivered before the current month: fixed slots (client, main contractor or not) whose activity
// in each past month comes from that month's seed.
const SLOTS: { clienteId: string; mandante: boolean }[] = [
  { clienteId: "maipo", mandante: true },
  { clienteId: "aromos", mandante: true },
  { clienteId: "rioclaro", mandante: false },
  { clienteId: "maipo", mandante: false },
  { clienteId: "rioclaro", mandante: true },
];

/** Stage of a live job at a past date, read from its weekly progress. Null if it had not started or was delivered. */
function etapaEn(o: ObraP, fin: string): number | "entregada" | null {
  if (o.inicio > fin) return null;
  if (o.avance >= 100 && o.entrega <= fin) return "entregada";
  const semana = Math.max(0, Math.floor(diasEntre(o.inicio, fin) / 7));
  const av = o.real[Math.min(semana, o.real.length - 1)] ?? 0;
  let k = 0;
  for (let i = 0; i < PISO_ETAPA.length; i++) if (PISO_ETAPA[i] <= av) k = i;
  return Math.min(k, o.etapa);
}

// ---------- one month ----------

export function resumenMes(e: EstadoPortal, sesion: Sesion, mes: string, hoy: string): ResumenMes {
  const enCurso = mes === mesDe(hoy);
  const fin = enCurso ? hoy : finDeMes(`${mes}-01`);
  const equipos = e.equipos.filter((q) => ve(sesion, q));
  const obras = e.obras.filter((o) => ve(sesion, o));
  const enMes = (iso?: string) => !!iso && iso.startsWith(mes);

  const porCliente = new Map<string, FilaCliente>();
  const fila = (id: string) => {
    let f = porCliente.get(id);
    if (!f) {
      f = { id, nombre: clienteNombre(id), equipos: 0, programadas: 0, realizadas: 0, aldia: 0, atrasadas: 0, informes: 0 };
      porCliente.set(id, f);
    }
    return f;
  };

  let preventivas = 0;
  let correctivas = 0;

  for (const q of equipos) {
    const f = fila(q.clienteId);
    // place among all equipment (not only the visible ones), so each set keeps its plan whoever looks
    const i = e.equipos.indexOf(q);
    f.equipos++;
    if (enCurso) {
      const ots = e.ots.filter((o) => o.equipoId === q.id);
      const prevMes = ots.filter((o) => o.tipo === "preventiva" && enMes(o.estado === "cerrada" ? o.cierre?.fecha : o.fecha));
      const hechas = prevMes.filter((o) => o.estado === "cerrada").length;
      const pendiente = ots.some((o) => o.estado !== "cerrada");
      const v = vencimiento(q, hoy);
      // Due this month by its rule and still without a visit: also part of what was planned.
      const sinOT = !pendiente && enMes(v.fecha) ? 1 : 0;
      const cerradas = ots.filter((o) => o.estado === "cerrada" && enMes(o.cierre?.fecha));
      f.programadas += prevMes.length + sinOT;
      f.realizadas += hechas;
      f.informes += cerradas.length;
      preventivas += cerradas.filter((o) => o.tipo === "preventiva").length;
      correctivas += cerradas.filter((o) => o.tipo === "correctiva").length;
      if (v.estado === "atrasada") f.atrasadas++;
      else f.aldia++;
    } else {
      const h = historiaEquipo(q, i, mes);
      f.programadas += h.programada ? 1 : 0;
      f.realizadas += h.realizada ? 1 : 0;
      f.informes += (h.realizada ? 1 : 0) + h.correctiva;
      preventivas += h.realizada ? 1 : 0;
      correctivas += h.correctiva;
      if (h.programada && !h.realizada) f.atrasadas++;
      else f.aldia++;
    }
  }

  // Jobs: the live ones as they stood at the end of that month, plus the earlier ones for past months.
  const porEtapa = ETAPAS.map(() => 0);
  let entregadas = 0;
  for (const o of obras) {
    const k = enCurso ? (o.avance >= 100 ? "entregada" : o.etapa) : etapaEn(o, fin);
    if (k === null) continue;
    if (k === "entregada") {
      if (enMes(o.entrega)) entregadas++;
    } else porEtapa[k]++;
  }
  if (!enCurso) {
    SLOTS.forEach((s, i) => {
      if (!ve(sesion, s)) return;
      const r = azar(`${mes}:obra${i}`);
      if (r() < 0.55) porEtapa[Math.floor(r() * 5)]++;
      if (r() < 0.3) entregadas++;
    });
  }

  for (const o of obras) fila(o.clienteId);
  const clientes = [...porCliente.values()].sort((a, b) => b.equipos - a.equipos || a.nombre.localeCompare(b.nombre));
  const suma = (k: keyof FilaCliente) => clientes.reduce((n, c) => n + (c[k] as number), 0);

  return {
    mes,
    enCurso,
    programadas: suma("programadas"),
    realizadas: suma("realizadas"),
    preventivas,
    correctivas,
    informes: suma("informes"),
    atrasadas: suma("atrasadas"),
    porEtapa,
    entregadas,
    clientes,
  };
}

export const horasAhorradas = (informes: number) => [informes * HORAS_INFORME * AHORRO_INFORME[0], informes * HORAS_INFORME * AHORRO_INFORME[1]] as const;

export const cumplimiento = (r: ResumenMes) => (r.programadas ? Math.round((100 * r.realizadas) / r.programadas) : null);
