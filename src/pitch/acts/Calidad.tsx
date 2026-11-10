import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bot, Gauge, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Medicion = { t: string; v: string; ok: boolean; d: string };

/** What the visitor's own browser can check about this page, right now. */
function medir(): Medicion[] {
  const recursos = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  const externos = recursos.filter((r) => {
    try {
      return new URL(r.name).origin !== location.origin;
    } catch {
      return false;
    }
  }).length;
  const kb = Math.round(recursos.reduce((s, r) => s + (r.transferSize || 0), 0) / 1024);
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const ms = nav ? Math.round(nav.domContentLoadedEventEnd) : 0;
  const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  return [
    { t: "Conexiones a otros sitios", v: String(externos), ok: externos === 0, d: "Ni rastreadores, ni fuentes ni librerías cargadas desde terceros." },
    { t: "Cookies", v: document.cookie ? String(document.cookie.split(";").length) : "0", ok: !document.cookie, d: "Nada que pedir permiso para guardar." },
    {
      t: "Política de seguridad",
      v: csp ? "Estricta" : "En la versión publicada",
      ok: !!csp,
      d: "El navegador se niega a ejecutar cualquier código que no venga de esta misma página.",
    },
    { t: "Lista para usar en", v: ms ? `${(ms / 1000).toLocaleString("es-CL", { maximumFractionDigits: 1 })} s` : "—", ok: ms > 0 && ms < 3000, d: "Medido en su conexión, al abrir esta página." },
    { t: "Descargado hasta ahora", v: kb ? `${kb.toLocaleString("es-CL")} KB` : "—", ok: true, d: "Incluye las fotos y la demo." },
  ];
}

const PILARES = [
  {
    Icon: Bot,
    t: "Rápido, porque trabajo con agentes de inteligencia artificial",
    d: "Agentes de IA escriben, prueban y revisan el código bajo mi dirección y criterio. Esta propuesta y su demo tomaron días.",
  },
  {
    Icon: Gauge,
    t: "Bien hecho, y se puede comprobar",
    d: "Pruebas automáticas, revisión de cada cambio antes de publicarlo y uso con teclado y lector de pantalla.",
  },
  {
    Icon: ShieldCheck,
    t: "Seguro desde el diseño",
    d: "Sigo los estándares de OWASP, la referencia mundial en seguridad de aplicaciones web.",
  },
];

/** Act: quality, speed and security, with live measurements of this very page. */
export function Calidad() {
  const [m, setM] = useState<Medicion[] | null>(null);
  useEffect(() => {
    const go = () => setM(medir());
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    const t = window.setTimeout(go, 2500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section id="calidad" aria-labelledby="h-cal" className="grilla-osc bg-grafito px-5 py-24 text-papel sm:px-10 min-[1100px]:px-16">
      <div className="mx-auto max-w-[1180px]">
        <p className="wdth-87 font-semibold text-energia">Calidad y seguridad</p>
        <h2 id="h-cal" className="mt-2 max-w-[20ch] wdth-125 text-[clamp(1.9rem,1.2rem+2.2vw,3.2rem)] font-extrabold leading-[1.02] tracking-[-0.015em] text-balance">
          Rápido no significa improvisado.
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {PILARES.map((p, i) => (
            <motion.div
              key={p.t}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
            >
              <p.Icon className="size-8 text-energia" aria-hidden="true" />
              <h3 className="mt-4 wdth-100 text-[1.15rem] font-bold leading-snug">{p.t}</h3>
              <p className="mt-2 leading-relaxed text-papel/75">{p.d}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-linea-osc bg-grafito-2 p-5 sm:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="wdth-112 text-[1.15rem] font-extrabold">No me crean: midan esta misma página</h3>
            <p className="wdth-87 text-[0.85rem] text-linea">Lo calcula su navegador, ahora</p>
          </div>
          <dl className="mt-5 grid gap-px overflow-hidden rounded-xl bg-linea-osc sm:grid-cols-2 lg:grid-cols-5">
            {(m ?? medir()).map((x, i) => (
              <motion.div
                key={x.t}
                className="bg-grafito px-4 py-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 * i }}
              >
                <dt className="wdth-87 text-[0.8rem] text-linea">{x.t}</dt>
                <dd className={cn("mt-1 wdth-100 text-[1.45rem] font-extrabold leading-none tabular-nums", x.ok ? "text-energia" : "text-papel")}>{x.v}</dd>
                <dd className="mt-2 text-[0.8rem] leading-snug text-papel/60">{x.d}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
