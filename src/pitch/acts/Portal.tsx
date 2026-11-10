import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { BarChart3, Bell, CalendarClock, ClipboardList, FileCheck, FileText, KeyRound, ListChecks, MousePointerClick, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion, useViewport } from "../hooks";
import { DemoFrame, type DemoFrameHandle } from "../ui/DemoFrame";
import { DemoOverlay } from "../ui/DemoOverlay";

type Cap = { Icon: typeof Bell; t: string; d: string; hash: string; frac: number };

const CAPS: Cap[] = [
  { Icon: KeyRound, t: "Control de acceso", d: "Cada uno entra con su usuario y ve solo lo suyo.", hash: "#/portal", frac: 0 },
  { Icon: ClipboardList, t: "Todas las obras", d: "Cada obra con su etapa y su avance, al día.", hash: "#/portal/obras?como=cliente", frac: 0 },
  { Icon: ListChecks, t: "Etapas y avance", d: "Cotización, proyecto, ejecución, pruebas, declaración SEC y entrega: lo planificado contra lo real.", hash: "#/portal/obra/1?como=cliente", frac: 0 },
  { Icon: NotebookPen, t: "Bitácora de terreno", d: "Lo que pasa en obra, con fecha y autor; los cortes programados se avisan antes.", hash: "#/portal/obra/1?como=cliente", frac: 0.45 },
  { Icon: FileText, t: "Documentos a mano", d: "Planos, protocolos, certificados y declaración SEC, en un solo lugar.", hash: "#/portal/obra/1?como=cliente", frac: 0.8 },
  { Icon: CalendarClock, t: "Mantenciones por equipo", d: "Cada grupo con su pauta y su estado: al día, próxima o atrasada.", hash: "#/portal/mantenciones?como=cliente", frac: 0 },
  { Icon: FileCheck, t: "El informe se envía solo", d: "Al cerrar la orden en terreno, el informe llega a la empresa mandante y al cliente.", hash: "#/portal/informe/OT-0138?como=cliente", frac: 0 },
  { Icon: BarChart3, t: "Resumen de gestión", d: "Cada mes: pautas cumplidas, órdenes cerradas y atrasos por cliente, en PDF.", hash: "#/portal/gestion?como=inecso", frac: 0 },
];

/** Act 4: the client portal on a phone, stepping through what a client sees. */
export function Portal() {
  const ref = useRef<HTMLElement>(null);
  const demo = useRef<DemoFrameHandle>(null);
  const rm = usePrefersReducedMotion();
  const { w, h } = useViewport();
  const pinned = !rm && w >= 900 && h >= 680;
  const [cap, setCap] = useState(2);
  const [overlay, setOverlay] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const show = (i: number) => {
    const c = CAPS[i];
    demo.current?.go(c.hash);
    window.setTimeout(() => demo.current?.scrollTo(c.frac), 60);
  };

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!pinned) return;
    const i = Math.min(CAPS.length - 1, Math.floor(Math.max(0, p - 0.04) * CAPS.length * 1.08));
    if (i !== cap) {
      setCap(i);
      show(i);
    }
  });

  return (
    <section id="portal" ref={ref} aria-labelledby="h-portal" className={cn("relative bg-grafito text-papel", pinned && "h-[510vh]")}>
      <div className={cn("grilla-osc px-5 py-20 sm:px-10 min-[1100px]:px-16", pinned && "sticky top-0 flex h-[100svh] items-center py-6")}>
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 md:grid-cols-[1fr_minmax(260px,340px)]">
          <div>
            <p className="wdth-87 font-semibold text-energia">Portal de clientes, segundo hito</p>
            <h2 id="h-portal" className="mt-2 max-w-[18ch] wdth-125 text-[clamp(1.9rem,1.2rem+2vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.015em]">
              La empresa mandante y cada cliente ven el avance sin llamar.
            </h2>
            <p className="mt-4 max-w-[58ch] text-[1.02rem] leading-relaxed text-papel/75">
              Para INECSO es, además, su herramienta de trabajo diaria.
            </p>
            <ul className="mt-8 space-y-1">
              {CAPS.map((c, i) => {
                const on = i === cap;
                return (
                  <li key={c.t}>
                    <button
                      type="button"
                      onClick={() => {
                        setCap(i);
                        show(i);
                      }}
                      className={cn("relative flex w-full gap-4 rounded-lg py-3 pl-4 pr-3 text-left transition-colors", on ? "bg-grafito-2" : "hover:bg-grafito-2/60")}
                    >
                      {on && <motion.span layoutId="portal-marca" className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-energia" />}
                      <c.Icon className={cn("mt-0.5 size-5 shrink-0", on ? "text-energia" : "text-linea")} aria-hidden="true" />
                      <span>
                        <b className={cn("block wdth-87", !on && "text-papel/70")}>{c.t}</b>
                        <span className={cn("block text-[0.94rem] leading-snug", on ? "text-papel/80" : "text-papel/45")}>{c.d}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 max-w-[62ch] rounded-lg bg-grafito-2 px-4 py-3 text-[0.95rem] text-papel/75">Se diseña con ustedes, sobre cómo trabajan hoy.</p>
            <button
              type="button"
              onClick={() => setOverlay(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-energia px-5 py-3 wdth-87 font-bold text-grafito shadow-[0_8px_24px_-10px_var(--color-energia-osc)] transition-transform hover:-translate-y-0.5"
            >
              <MousePointerClick className="size-5" aria-hidden="true" />
              Pruébenlo ustedes
            </button>
          </div>
          <div className="mx-auto w-full max-w-[330px]">
            <div className="rounded-[40px] border border-linea-osc bg-black p-2.5 shadow-[0_40px_90px_-30px_rgb(0_0_0/0.9)]">
              <DemoFrame
                ref={demo}
                layoutWidth={390}
                interactive={!pinned}
                hash="#/portal/obra/1"
                title="Adelanto del portal de clientes en un celular"
                className="aspect-[390/800] rounded-[31px]"
              />
            </div>
            <p className="mt-3 text-center wdth-87 text-[0.82rem] text-linea">Clientes, obras y cifras de ejemplo</p>
          </div>
        </div>
      </div>
      <DemoOverlay open={overlay} hash="#/portal" titulo="Demo del portal de clientes" onClose={() => setOverlay(false)} />
    </section>
  );
}
