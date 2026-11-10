// Three ways to hire the work, all as a service paid for results (never for hours or time in a chair).
// Each one is priced for the SAME job so they can be compared: web (the recommended tier) + client portal phase 1
// (reference $6.400.000) + maintenance. The process survey before the portal is free. Payments follow milestones, not calendar dates:
// how long each step takes is agreed when signing. Amounts in Chilean pesos, no VAT.

import { ETAPAS_PORTAL } from "./portal";
import { MANT, NIVEL_RECOMENDADO, NIVELES, SUSCRIPCION } from "./precios";

export const FECHA_PRECIOS = "6 de noviembre de 2026";
export const MESES_USO = 24; // the comparison window once the portal is in use

export type Concepto = "web" | "portal" | "plan";

export const CONCEPTOS: Record<Concepto, { nombre: string; color: string }> = {
  web: { nombre: "Web", color: "var(--color-cianotipo)" },
  portal: { nombre: "Portal de clientes", color: "var(--color-energia)" },
  plan: { nombre: "Cuotas del plan", color: "var(--color-energia-osc)" },
};

export type Hito = { hito: string; concepto: Concepto; clp: number };

export type Modalidad = {
  id: "proyecto" | "suscripcion" | "plan";
  nombre: string;
  corto: string;
  comoFunciona: string;
  comoSePaga: string;
  conviene: string;
  ojo: string;
  riesgo: string; // who carries a delay
  codigo: string; // who owns the code
  compromiso: string;
  hitos: Hito[]; // one-off payments, in order
  mensual: { clp: number; que: string }; // what they pay each month once the portal is in use
  puntajes: { inicio: number; total: number; certeza: number; flexibilidad: number; propiedad: number };
};

const r = (n: number) => Math.round(n / 1000) * 1000;
const WEB = NIVELES.find((n) => n.id === NIVEL_RECOMENDADO)!.lanzamiento;
const INSTALACION_NETA = SUSCRIPCION.instalacion;
// 8 x 850.000 = 6.800.000: a small premium over the fixed price, with maintenance included while it runs.
export const PLAN = { cuota: 850_000, cuotas: 8 };

const web: Hito[] = [
  { hito: "Firma", concepto: "web", clp: r(WEB * 0.4) },
  { hito: "Diseño aprobado", concepto: "web", clp: r(WEB * 0.3) },
  { hito: "Web publicada", concepto: "web", clp: WEB - r(WEB * 0.4) - r(WEB * 0.3) },
];

export const MODALIDADES: Modalidad[] = [
  {
    id: "proyecto",
    nombre: "Proyecto a precio cerrado",
    corto: "Precio cerrado",
    comoFunciona: "Cada etapa con alcance escrito y precio fijo: saben desde el principio cuánto van a pagar.",
    comoSePaga: "Web: 40 % al firmar, 30 % al aprobar el diseño y 30 % al publicar. Portal: cada etapa, mitad al partir y mitad al entregarla funcionando.",
    conviene: "Si prefieren un precio conocido y ser dueños de todo desde el inicio.",
    ojo: "Es la inversión más grande antes de tener el portal.",
    riesgo: "Gonzalo",
    codigo: "INECSO",
    compromiso: "Por etapa: pueden parar al terminar cualquiera.",
    hitos: [
      ...web,
      // the portal at a fixed price is paid stage by stage, half when it starts and half when it is delivered working
      ...ETAPAS_PORTAL.flatMap((e): Hito[] => [
        { hito: `Portal, etapa ${e.n}: al partir`, concepto: "portal", clp: r(e.clp / 2) },
        { hito: `Portal, etapa ${e.n}: al entregar`, concepto: "portal", clp: e.clp - r(e.clp / 2) },
      ]),
    ],
    mensual: { clp: MANT.todo, que: "Mantención de la web y el portal" },
    puntajes: { inicio: 2, total: 5, certeza: 5, flexibilidad: 3, propiedad: 5 },
  },
  {
    id: "suscripcion",
    nombre: "Portal en suscripción",
    corto: "Suscripción",
    comoFunciona: "El portal se arrienda, hecho a su medida: instalación y una cuota mensual con servidor, soporte y una mejora chica al mes.",
    comoSePaga: "Instalación de $2.500.000 en dos pagos y luego una cuota mensual por un mínimo de 24 meses. Al final pueden comprar el código.",
    conviene: "Si quieren el portal sin una inversión grande al inicio.",
    ojo: "En dos años pagan algo más, y el código es mío hasta que lo compren.",
    riesgo: "Gonzalo",
    codigo: "Gonzalo, hasta que INECSO lo compre",
    compromiso: "24 meses de suscripción desde que el portal entra en uso.",
    hitos: [
      ...web,
      { hito: "Instalación del portal: inicio", concepto: "portal", clp: r(INSTALACION_NETA / 2) },
      { hito: "Instalación del portal: en uso", concepto: "portal", clp: INSTALACION_NETA - r(INSTALACION_NETA / 2) },
    ],
    mensual: { clp: SUSCRIPCION.mensual + MANT.web, que: "Suscripción del portal y mantención de la web" },
    puntajes: { inicio: 5, total: 3, certeza: 4, flexibilidad: 2, propiedad: 2 },
  },
  {
    id: "plan",
    nombre: "Plan mensual por entregables",
    corto: "Plan mensual",
    comoFunciona: "El portal se arma de a poco: cada mes acordamos qué se entrega, y pueden cambiar prioridades sobre la marcha.",
    comoSePaga: "Cuota fija de $850.000 al mes, con la mantención incluida, mientras sigan agregando al portal. Con 8 cuotas se paga algo más que a precio cerrado.",
    conviene: "Si el portal crecerá según lo que necesiten y prefieren una cuota pareja.",
    ojo: "Cada cuota se usa en las entregas acordadas para ese mes: no se acumulan.",
    riesgo: "Compartido: lo que se entrega cada mes se ajusta a la cuota",
    codigo: "INECSO",
    compromiso: "Aviso de 30 días para pausar o terminar.",
    hitos: [...web, ...Array.from({ length: PLAN.cuotas }, (_, i): Hito => ({ hito: `Cuota ${i + 1} del plan`, concepto: "plan", clp: PLAN.cuota }))],
    mensual: { clp: MANT.todo, que: "Mantención de la web y el portal, al terminar las cuotas" },
    puntajes: { inicio: 4, total: 4, certeza: 3, flexibilidad: 5, propiedad: 5 },
  },
];

/** Everything they pay until the portal is in use. */
export const antes = (m: Modalidad) => m.hitos.reduce((s, h) => s + h.clp, 0);
/** One-off payments plus 24 months of use: the fair comparison. */
export const dosAnios = (m: Modalidad) => antes(m) + MESES_USO * m.mensual.clp;

export const CRITERIOS: { key: keyof Modalidad["puntajes"]; nombre: string; ayuda: string }[] = [
  { key: "inicio", nombre: "Poca inversión al inicio", ayuda: "Cuánto pagan antes de que el portal esté funcionando." },
  { key: "total", nombre: "Menor costo en dos años", ayuda: "Lo pagado más 24 meses de uso." },
  { key: "certeza", nombre: "Precio conocido de antemano", ayuda: "Si saben desde el principio cuánto van a pagar." },
  { key: "flexibilidad", nombre: "Libertad para cambiar", ayuda: "Qué tan fácil es cambiar prioridades sobre la marcha." },
  { key: "propiedad", nombre: "El código es suyo", ayuda: "Si INECSO es dueña del código desde el principio." },
];
