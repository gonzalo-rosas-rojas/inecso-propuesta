// The client portal in concrete stages: scope, time and price for each one (asked for the meeting with the owner).
// Time is two clocks: the build on Gonzalo's side, in business days, and what depends on INECSO, explained but not promised.
// The three stages add up to the portal reference price; the closed price is set after the free survey.
import { PORTAL_REF, type Item } from "./precios";

export type EtapaPortal = {
  n: 1 | 2 | 3;
  id: "mantenciones" | "avance" | "gestion";
  nombre: string;
  /** what the stage solves, in one line */
  resuelve: string;
  /** business days to build it, from the moment Gonzalo has what the stage needs */
  dias: number;
  /** what the stage needs from INECSO */
  conUstedes: string;
  clp: number;
  incluye: Item[];
  /** the moment that tells them the stage is working */
  hito: string;
};

export const ETAPAS_PORTAL: EtapaPortal[] = [
  {
    n: 1,
    id: "mantenciones",
    nombre: "Mantenciones e informes",
    resuelve: "Lo que más horas les quita hoy: armar cada informe a mano y seguir las pautas en planillas.",
    dias: 3,
    conUstedes: "Sus planillas de clientes y equipos, y el formato de informe que pide la empresa mandante.",
    clp: 3_000_000,
    hito: "El primer informe que le llega solo al cliente y a la empresa mandante.",
    incluye: [
      { t: "Entrar seguro, cada uno a lo suyo", d: "INECSO decide qué ve la empresa mandante y qué ve cada cliente.", tec: "Roles y permisos, 2FA" },
      { t: "Cada equipo con su pauta", d: "Por horas de uso o por fecha, con su estado a la vista.", tec: "Mantenimiento preventivo" },
      { t: "Avisos antes de que venza", d: "Qué mantenciones vienen y cuáles se atrasaron.", tec: "Alertas por correo" },
      { t: "La orden de trabajo en el celular", d: "Pauta, mediciones, fotos y firma del cliente, incluso sin señal.", tec: "PWA sin conexión" },
      { t: "El informe se arma y se envía solo", d: "Al cerrar la orden, al cliente y a la empresa mandante.", tec: "PDF y envío automático" },
      { t: "Sus planillas, adentro", d: "Clientes, equipos y pautas de hoy: no se parte de cero.", tec: "Migración desde Excel" },
    ],
  },
  {
    n: 2,
    id: "avance",
    nombre: "Avance para la empresa mandante y los clientes",
    resuelve: "Las llamadas y los correos para preguntar cómo va una obra.",
    dias: 2,
    conUstedes: "Que la empresa mandante revise su vista y diga qué necesita ver.",
    clp: 1_800_000,
    hito: "La empresa mandante revisa el avance de sus obras sin llamar.",
    incluye: [
      { t: "Cada obra con sus etapas", d: "Cotización, proyecto, ejecución, pruebas, declaración SEC y entrega: planificado contra real.", tec: "Curva S" },
      { t: "Bitácora de terreno", d: "Qué pasó, con fecha, fotos y autor; los cortes programados se avisan antes.", tec: "Registro con fecha y autor" },
      { t: "Documentos en un solo lugar", d: "Planos, protocolos, certificados y declaración SEC, siempre a mano.", tec: "Almacenamiento cifrado, acceso controlado" },
      { t: "La empresa mandante ve lo suyo", d: "Sus obras y mantenciones subcontratadas; aprueba u observa cada informe.", tec: "Flujo de aprobación" },
      { t: "Aviso cuando hay novedades", d: "Cambios de etapa, documentos e informes llegan por correo a quien corresponde.", tec: "Notificaciones" },
    ],
  },
  {
    n: 3,
    id: "gestion",
    nombre: "Gestión y web",
    resuelve: "Saber cómo va la empresa sin juntar datos a mano, y una web al día sola.",
    dias: 2,
    conUstedes: "Nada nuevo. El primer resumen completo sale al cerrar el primer mes de uso.",
    clp: 1_600_000,
    hito: "El primer resumen de gestión del mes, listo sin que nadie lo arme.",
    incluye: [
      { t: "Resumen de gestión del mes", d: "Pautas cumplidas, órdenes cerradas, informes y atrasos, por cliente y en total.", tec: "Tablero de indicadores" },
      { t: "Para la gerencia, en un archivo", d: "El resumen en PDF y los datos en planilla.", tec: "Exportación a PDF y Excel" },
      { t: "De la obra terminada a la web", d: "Una obra entregada pasa a inecso.cl con un clic.", tec: "Portal y web conectados" },
      { t: "Registro de quién hizo qué", d: "Cada acceso y cada cambio, con fecha y usuario.", tec: "Bitácora de auditoría" },
    ],
  },
];

export const PORTAL_TOTAL = ETAPAS_PORTAL.reduce((s, e) => s + e.clp, 0);
export const PORTAL_DIAS = ETAPAS_PORTAL.reduce((s, e) => s + e.dias, 0);
if (PORTAL_TOTAL !== PORTAL_REF.referencia) throw new Error(`portal stages add up to ${PORTAL_TOTAL}, not ${PORTAL_REF.referencia}`);

/** How each stage is paid when the portal is a fixed-price project. */
export const PAGO_ETAPA = "Mitad al partir la etapa y mitad al entregarla funcionando.";

/** The data security every stage is built on. */
export const SEGURIDAD: Item[] = [
  { t: "Cada uno ve solo lo suyo", d: "Un cliente nunca ve lo de otro: se controla en el servidor.", tec: "Control de acceso por roles" },
  { t: "Verificación en dos pasos", d: "Una clave filtrada no basta: además se pide un código en el celular.", tec: "2FA" },
  { t: "Todo cifrado, al viajar y guardado", tec: "TLS 1.3 y cifrado en reposo" },
  { t: "Respaldo diario, fuera del servidor", tec: "Restauración probada" },
  { t: "Los datos son de INECSO", d: "Los descargan completos cuando quieran; se firma un acuerdo de tratamiento de datos.", tec: "Ley 21.719" },
];

/** When the build clock starts on Gonzalo's side. */
export const RELOJ = "Mi plazo corre desde que tengo lo que cada etapa necesita. Si algo de su lado se demora, la entrega se corre lo mismo.";

export type Fila = { t: string; d: string; desde: number; hasta: number; tono: "web" | "lev" | "portal" };

/** The whole job in business days from signing (5 a week): three weeks with nothing delayed, a fourth as slack. */
export const CALENDARIO: Fila[] = [
  { t: "Web", d: "Lista para revisar en 2 días; una ronda de ajustes y se publica", desde: 0, hasta: 5, tono: "web" },
  { t: "Levantamiento del portal", d: "Una o dos reuniones, sin costo", desde: 1, hasta: 5, tono: "lev" },
  { t: "Portal, etapa 1", d: "Mantenciones e informes", desde: 5, hasta: 10, tono: "portal" },
  { t: "Portal, etapa 2", d: "Avance para la mandante y los clientes", desde: 10, hasta: 13, tono: "portal" },
  { t: "Portal, etapa 3", d: "Gestión y web", desde: 13, hasta: 15, tono: "portal" },
];
export const DIAS_SIN_RETRASOS = 15;
export const DIAS_CON_HOLGURA = 20;
export const HITOS = [
  { dia: 5, t: "Web publicada" },
  { dia: 10, t: "Primer informe que se envía solo" },
  { dia: 15, t: "Portal completo" },
];
