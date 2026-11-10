import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlarmClock, ClipboardCheck, Download, HardHat, Monitor, Send, ShieldCheck, Smartphone, Timer, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMPRESA } from "@/data/inecso";
import { ETAPAS, MANDANTE, fecha, sumarDias, type Acceso } from "./datos";
import { usePortal, ROL_NOMBRE } from "./estado";
import { PortalShell, Encabezado } from "./Shell";
import { AHORRO_INFORME, HORAS_INFORME, cumplimiento, horasAhorradas, mesCorto, nombreMes, resumenMes, ultimosMeses, type ResumenMes } from "./resumen-gestion";
import { Kpi, Panel, Vacio } from "./ui";

const nf = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 1 });
const pct = (n: number) => `${Math.round(n * 100)} %`;

export function PortalGestion() {
  const { e, hoy, sesion } = usePortal();
  const meses = useMemo(() => ultimosMeses(hoy), [hoy]);
  // An executive summary is read for the month that just closed; the month in progress is one click away.
  const [mes, setMes] = useState(meses[1] ?? meses[0]);
  const resumenes = useMemo(() => meses.map((m) => resumenMes(e, sesion, m, hoy)), [e, sesion, meses, hoy]);

  if (sesion.rol === "cliente") {
    return (
      <PortalShell>
        <Encabezado antes="Para la gerencia" titulo="Resumen de gestión" />
        <div className="max-w-2xl">
          <Vacio>
            Este resumen es para INECSO y la {MANDANTE.toLowerCase()}. Lo de su empresa (obras, mantenciones e informes) está en{" "}
            <a href="#/portal/tablero" className="font-semibold text-cianotipo hover:underline">
              Resumen
            </a>
            .
          </Vacio>
        </div>
      </PortalShell>
    );
  }

  const r = resumenes.find((x) => x.mes === mes) ?? resumenes[0];
  const admin = sesion.rol === "inecso";
  const c = cumplimiento(r);
  const [hb, ha] = horasAhorradas(r.informes);
  const total6 = resumenes.reduce((n, x) => n + x.informes, 0);
  const [tb, ta] = horasAhorradas(total6);
  const activas = r.porEtapa.reduce((a, b) => a + b, 0);
  const cuando = r.enCurso ? `${nombreMes(r.mes)}, al ${fecha(hoy)}` : nombreMes(r.mes);

  return (
    <PortalShell>
      <div className="hoja">
        {/* on paper: a plain report header instead of the portal's page header */}
        <header className="hidden items-start justify-between gap-4 border-b-2 border-grafito pb-3 print:flex">
          <div>
            <p className="wdth-125 text-[1.3rem] leading-none font-extrabold">INECSO Ingeniería</p>
            <p className="mt-1 text-[0.8rem] text-tinta-suave">{EMPRESA.especialidad}.</p>
          </div>
          <div className="text-right">
            <p className="text-[0.82rem] font-semibold text-tinta-suave">{admin ? "Resumen de gestión" : `Resumen de gestión para la ${MANDANTE.toLowerCase()}`}</p>
            <p className="wdth-112 text-[1.25rem] leading-tight font-extrabold first-letter:uppercase">{nombreMes(r.mes)}</p>
            {r.enCurso && <p className="text-[0.8rem] text-tinta-suave">Mes en curso, al {fecha(hoy)}</p>}
          </div>
        </header>

        <div className="print:hidden">
          <Encabezado antes={admin ? "Para la gerencia, una vez al mes" : "Trabajos subcontratados a INECSO"} titulo="Resumen de gestión">
            <button type="button" className="btn btn-azul px-3.5 py-2.5 text-[0.88rem]" onClick={() => window.print()}>
              <Download className="size-4" aria-hidden="true" />
              Descargar resumen (PDF)
            </button>
          </Encabezado>
          <p className="mt-2 max-w-3xl text-tinta-suave">
            {admin
              ? "Lo que pasó en el mes, sacado de lo mismo que el equipo ya registra en el portal: nadie arma esta planilla."
              : `Solo lo que la ${MANDANTE.toLowerCase()} subcontrató a INECSO, de todos sus clientes.`}
          </p>

          <div className="sin-barra -mx-4 mt-5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div role="group" aria-label="Mes del resumen" className="flex w-max gap-1.5">
              {meses.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mes === m}
                  onClick={() => setMes(m)}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-[0.88rem] font-semibold whitespace-nowrap ring-1 transition-colors",
                    mes === m ? "text-blanco ring-grafito" : "bg-blanco text-tinta-suave ring-linea hover:text-tinta",
                  )}
                >
                  {mes === m && <motion.span layoutId="mes-chip" className="absolute inset-0 rounded-full bg-grafito" transition={{ type: "spring", stiffness: 480, damping: 36 }} />}
                  <span className="relative first-letter:uppercase">
                    {nombreMes(m)}
                    {i === 0 && <span className="opacity-70"> (en curso)</span>}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <h2 className="mt-6 text-[0.95rem] font-bold first-letter:uppercase print:hidden">{cuando}</h2>
        <ul className="mt-2 print:mt-4 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 print:grid-cols-3 print:gap-2">
          <Kpi
            icon={Wrench}
            n={`${r.realizadas} de ${r.programadas}`}
            t="mantenciones realizadas de las programadas"
            sub={c === null ? "Sin mantenciones programadas" : r.enCurso ? `Cumplimiento ${c} % a la fecha` : `Cumplimiento ${c} %`}
            tono={c === null || c >= 90 ? "tierra" : c >= 70 || r.enCurso ? "energia" : "falla"}
          />
          <Kpi
            icon={ClipboardCheck}
            n={r.informes}
            t={r.informes === 1 ? "orden de trabajo cerrada" : "órdenes de trabajo cerradas"}
            sub={`${r.preventivas} ${r.preventivas === 1 ? "preventiva" : "preventivas"}, ${r.correctivas} ${r.correctivas === 1 ? "correctiva" : "correctivas"}`}
          />
          <Kpi icon={Send} n={r.informes} t={r.informes === 1 ? "informe enviado" : "informes enviados"} sub="Salen solos al cerrar cada orden" />
          <Kpi icon={Timer} n="Al instante" t="del cierre de la orden al informe en manos del cliente" sub="Antes: días, armando el informe a mano" tono="tierra" />
          <Kpi icon={HardHat} n={activas} t={activas === 1 ? "obra activa" : "obras activas"} sub={`${r.entregadas} ${r.entregadas === 1 ? "entregada" : "entregadas"} en el mes`} />
          <Kpi
            icon={AlarmClock}
            n={r.atrasadas}
            t={r.atrasadas === 1 ? "mantención atrasada" : "mantenciones atrasadas"}
            sub={r.enCurso ? "Equipos con la pauta vencida hoy" : "Quedaron pendientes al cierre del mes"}
            tono={r.atrasadas ? "falla" : "tierra"}
          />
        </ul>

        <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.35fr_1fr] print:grid-cols-[1.35fr_1fr] print:gap-3">
          <Panel titulo="Mantenciones de los últimos 6 meses" className="print:p-4">
            <Tendencia resumenes={resumenes} sel={r.mes} />
          </Panel>

          <Panel titulo="Horas de oficina que volvieron" className="print:p-4">
            <p className="mt-3 leading-none">
              {r.informes ? (
                <>
                  <b className="wdth-112 text-[2rem] font-extrabold text-cianotipo tabular-nums">
                    {nf.format(hb)} a {nf.format(ha)} h
                  </b>
                  <span className="mt-1.5 block text-[0.88rem] text-tinta-suave">{r.enCurso ? "en lo que va del mes" : "en el mes"}</span>
                </>
              ) : (
                <span className="text-tinta-suave">Todavía no hay informes este mes.</span>
              )}
            </p>
            <p className="mt-4 rounded-[3px] bg-papel px-3 py-2.5 text-[0.88rem] tabular-nums">
              En los últimos 6 meses:{" "}
              <b>
                {nf.format(tb)} a {nf.format(ta)} h
              </b>
              , entre {nf.format(tb / 8)} y {nf.format(ta / 8)} jornadas de 8 horas.
            </p>
            <p className="mt-3 text-[0.8rem] leading-snug text-tinta-suave">
              Cómo se calcula: informes enviados × {nf.format(HORAS_INFORME)} h que tomaba armar cada uno a mano × entre {pct(AHORRO_INFORME[0])} y {pct(AHORRO_INFORME[1])} de ese
              tiempo que ahorra el informe que sale de la orden de trabajo. Son los mismos supuestos de la calculadora de la propuesta, con los 8 equipos de ejemplo; con la
              cartera real, la cuenta crece con cada visita.
            </p>
          </Panel>
        </div>

        <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_1.35fr] print:grid-cols-[1fr_1.9fr] print:gap-3">
          <Panel titulo="Obras activas por etapa" className="print:p-4">
            <PorEtapa r={r} />
          </Panel>
          <Panel titulo="Por cliente" className="print:p-4">
            <TablaClientes r={r} />
          </Panel>
        </div>

        {admin && <Accesos accesos={e.accesos} hoy={hoy} />}

        <p className="mt-6 text-[0.82rem] text-tinta-suave print:mt-3 print:text-[0.75rem]">
          Empresas, equipos y cifras de ejemplo. El mes en curso sale del estado de la demo; los meses anteriores son cifras ficticias fijas. Resumen generado por el portal de INECSO
          el {fecha(hoy)}.
        </p>
      </div>
    </PortalShell>
  );
}

/** Planned vs done maintenance per month: inline SVG bars, with the same numbers as a table for screen readers. */
function Tendencia({ resumenes, sel }: { resumenes: ResumenMes[]; sel: string }) {
  const id = useId();
  const lista = [...resumenes].reverse();
  const max = Math.max(1, ...lista.map((x) => x.programadas));
  const H = 150;
  const alto = (n: number) => (n / max) * (H - 12);
  const desc = lista.map((x) => `${nombreMes(x.mes)}: ${x.realizadas} realizadas de ${x.programadas} programadas`).join("; ");

  return (
    <>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.82rem] text-tinta-suave" aria-hidden="true">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-[2px] bg-linea" />
          Programadas
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-[2px] bg-cianotipo" />
          Realizadas
        </span>
      </p>
      <svg viewBox={`0 0 600 ${H + 4}`} preserveAspectRatio="none" className="mt-3 h-36 w-full print:h-28" role="img" aria-labelledby={`${id}-t ${id}-d`}>
        <title id={`${id}-t`}>Mantenciones programadas y realizadas, últimos 6 meses</title>
        <desc id={`${id}-d`}>{desc}</desc>
        {lista.map((x, i) => {
          const x0 = i * 100;
          return (
            <g key={x.mes}>
              {x.mes === sel && <rect x={x0 + 4} y={0} width={92} height={H + 4} className="fill-energia/15" />}
              <rect x={x0 + 20} width={28} y={H - alto(x.programadas)} height={alto(x.programadas)} className="fill-linea" />
              <rect x={x0 + 52} width={28} y={H - alto(x.realizadas)} height={alto(x.realizadas)} className={x.enCurso ? "fill-cianotipo/75" : "fill-cianotipo"} />
            </g>
          );
        })}
        <line x1={0} x2={600} y1={H + 0.5} y2={H + 0.5} className="stroke-tinta-suave/50" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </svg>
      <ol className="grid grid-cols-6 text-center text-[0.78rem] leading-tight" aria-hidden="true">
        {lista.map((x) => (
          <li key={x.mes} className={cn("pt-1.5", x.mes === sel ? "font-bold text-tinta" : "text-tinta-suave")}>
            <span className="block first-letter:uppercase">{mesCorto(x.mes)}</span>
            <span className="tabular-nums">
              {x.realizadas}/{x.programadas}
            </span>
          </li>
        ))}
      </ol>
      <div className="sr-only">
      <table>
        <caption>Mantenciones por mes</caption>
        <thead>
          <tr>
            <th scope="col">Mes</th>
            <th scope="col">Programadas</th>
            <th scope="col">Realizadas</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((x) => (
            <tr key={x.mes}>
              <th scope="row">
                {nombreMes(x.mes)}
                {x.enCurso ? " (en curso)" : ""}
              </th>
              <td>{x.programadas}</td>
              <td>{x.realizadas}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p className="mt-3 text-[0.8rem] text-tinta-suave">El mes en curso se completa a medida que el equipo cierra órdenes de trabajo.</p>
    </>
  );
}

function PorEtapa({ r }: { r: ResumenMes }) {
  const max = Math.max(1, ...r.porEtapa);
  const total = r.porEtapa.reduce((a, b) => a + b, 0);
  if (!total) return <Vacio>{r.enCurso ? "No hay obras en curso." : "No hubo obras en curso ese mes."}</Vacio>;
  return (
    <>
      <ul className="mt-3 grid gap-2">
        {ETAPAS.map((et, k) => (
          <li key={et} className="grid grid-cols-[8.5rem_1fr_1.5rem] items-center gap-2 text-[0.88rem] print:grid-cols-[minmax(0,1fr)_2.5rem_1.25rem] print:text-[0.8rem]">
            <span className={cn("truncate", r.porEtapa[k] ? "text-tinta" : "text-tinta-suave/70")}>{et}</span>
            <span className="h-2 overflow-hidden rounded-full bg-linea/40">
              <motion.span
                className="block h-full origin-left rounded-full bg-cianotipo"
                initial={false}
                animate={{ scaleX: r.porEtapa[k] / max }}
                transition={{ duration: 0.4 }}
              />
            </span>
            <b className="text-right tabular-nums">{r.porEtapa[k]}</b>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[0.8rem] text-tinta-suave">
        {r.enCurso ? "Hoy" : "Al cierre del mes"}: {total} {total === 1 ? "obra activa" : "obras activas"}; {r.entregadas} {r.entregadas === 1 ? "entregada" : "entregadas"} en el mes.
      </p>
    </>
  );
}

function TablaClientes({ r }: { r: ResumenMes }) {
  const t = r.clientes.reduce(
    (a, c) => ({ equipos: a.equipos + c.equipos, programadas: a.programadas + c.programadas, realizadas: a.realizadas + c.realizadas, aldia: a.aldia + c.aldia, atrasadas: a.atrasadas + c.atrasadas, informes: a.informes + c.informes }),
    { equipos: 0, programadas: 0, realizadas: 0, aldia: 0, atrasadas: 0, informes: 0 },
  );
  if (!r.clientes.length) return <Vacio>No hay clientes con equipos o obras.</Vacio>;
  return (
    <div className="-mx-5 mt-2 overflow-x-auto px-5 sm:-mx-6 sm:px-6 print:mx-0 print:px-0">
      <table className="w-full min-w-[30rem] border-collapse text-[0.88rem] print:min-w-0 print:text-[0.8rem]">
        <thead>
          <tr className="border-b border-linea text-left text-[0.78rem] text-tinta-suave">
            <th scope="col" className="py-2 pr-3 font-semibold">
              Cliente
            </th>
            <th scope="col" className="py-2 pr-3 text-right font-semibold">
              Equipos
            </th>
            <th scope="col" className="py-2 pr-3 text-right font-semibold">
              Mantenciones del mes
            </th>
            <th scope="col" className="py-2 pr-3 text-right font-semibold">
              Al día / atrasadas
            </th>
            <th scope="col" className="py-2 text-right font-semibold">
              Informes
            </th>
          </tr>
        </thead>
        <tbody>
          {r.clientes.map((c) => (
            <tr key={c.id} className="border-b border-linea/60">
              <th scope="row" className="py-2.5 pr-3 text-left font-semibold">
                {c.nombre}
              </th>
              <td className="py-2.5 pr-3 text-right tabular-nums">{c.equipos}</td>
              <td className="py-2.5 pr-3 text-right tabular-nums">
                {c.realizadas} de {c.programadas}
              </td>
              <td className="py-2.5 pr-3 text-right tabular-nums">
                {c.aldia} / <span className={c.atrasadas ? "font-semibold text-falla" : undefined}>{c.atrasadas}</span>
              </td>
              <td className="py-2.5 text-right tabular-nums">{c.informes}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="text-[0.85rem] font-bold">
            <th scope="row" className="py-2.5 pr-3 text-left">
              Total
            </th>
            <td className="py-2.5 pr-3 text-right tabular-nums">{t.equipos}</td>
            <td className="py-2.5 pr-3 text-right tabular-nums">
              {t.realizadas} de {t.programadas}
            </td>
            <td className="py-2.5 pr-3 text-right tabular-nums">
              {t.aldia} / {t.atrasadas}
            </td>
            <td className="py-2.5 text-right tabular-nums">{t.informes}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function cuandoAcceso(a: Acceso, hoy: string) {
  const dia = a.fecha === hoy ? "Hoy" : a.fecha === sumarDias(hoy, -1) ? "Ayer" : fecha(a.fecha);
  return `${dia}, ${a.hora}`;
}

function Accesos({ accesos, hoy }: { accesos: Acceso[]; hoy: string }) {
  const lista = accesos.slice(0, 10);
  return (
    <Panel titulo="Registro de accesos" className="mt-4 print:p-4" accion={<span className="text-[0.82rem] text-tinta-suave">Últimos {lista.length}</span>}>
      {lista.length === 0 ? (
        <Vacio>Todavía no hay accesos registrados.</Vacio>
      ) : (
        <ul className="mt-2 divide-y divide-linea/60">
          <AnimatePresence initial={false}>
            {lista.map((a, i) => {
              const Icono = a.disp === "Celular" ? Smartphone : Monitor;
              const firma = `${a.fecha}-${a.hora}-${a.rol}-${a.quien}-${a.entidad}`;
              // identical older entries (same minute, same profile): counted from the older side, so keys stay put when a new one arrives
              const iguales = accesos.slice(i + 1).filter((b) => `${b.fecha}-${b.hora}-${b.rol}-${b.quien}-${b.entidad}` === firma).length;
              return (
                <motion.li
                  key={`${firma}-${iguales}`}
                  layout="position"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-[1.25rem_1fr] items-start gap-x-3 gap-y-0.5 py-2.5 sm:grid-cols-[1.25rem_1fr_9rem_8.5rem] sm:items-center"
                >
                  <Icono className="mt-0.5 size-4 text-tinta-suave sm:mt-0" aria-label={a.disp} />
                  <p className="min-w-0 text-[0.9rem]">
                    <b className={cn(a.demo && "text-cianotipo")}>{a.quien}</b>
                    <span className="text-tinta-suave">, {a.entidad}</span>
                  </p>
                  <p className="col-start-2 text-[0.8rem] text-tinta-suave sm:col-start-auto">
                    {a.rol === "cliente" ? "Cliente" : a.rol === "inecso" ? "INECSO" : ROL_NOMBRE.mandante} · {a.disp}
                  </p>
                  <p className="col-start-2 text-[0.8rem] text-tinta-suave tabular-nums sm:col-start-auto sm:text-right">{cuandoAcceso(a, hoy)}</p>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
      <p className="mt-3 flex items-start gap-2 rounded-[3px] bg-papel px-3 py-2.5 text-[0.85rem]">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-tierra" aria-hidden="true" />
        Cada acceso queda registrado. En el portal real se entra con verificación en dos pasos y cada uno ve solo lo suyo.
      </p>
    </Panel>
  );
}
