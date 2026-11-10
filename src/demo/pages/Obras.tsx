import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { FILTROS, IMG, OBRAS, type FiltroObra } from "@/data/inecso";
import { obrasWeb } from "@/data/portal-demo";
import { usePortal } from "./portal/estado";
import { PageHead } from "../components/PageHead";
import { ObraCard } from "../components/ObraCard";
import { Lightbox } from "../components/Lightbox";
import { CtaBanda } from "../components/CtaBanda";

export function Obras() {
  const [f, setF] = useState<FiltroObra>("todas");
  const [i, setI] = useState<number | null>(null);
  const { e } = usePortal();
  // Jobs published from the client portal come first; the website never needs editing for them.
  const delPortal = useMemo(() => obrasWeb(e), [e]);
  const todas = useMemo(() => [...delPortal, ...OBRAS], [delPortal]);
  const lista = useMemo(() => (f === "todas" ? todas : todas.filter((o) => o.f === f)), [f, todas]);
  const cuenta = (id: FiltroObra) => (id === "todas" ? todas.length : todas.filter((o) => o.f === id).length);

  return (
    <>
      <PageHead titulo="Obras" img={IMG.izaje}>
        Una muestra de lo que hacemos. Cada obra con su tipo y lo que resolvió.
      </PageHead>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="sin-barra -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div role="group" aria-label="Filtrar obras por tipo" className="flex w-max gap-2">
            {FILTROS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={f === x.id}
                onClick={() => setF(x.id)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-[0.9rem] font-semibold whitespace-nowrap ring-1 transition-colors",
                  f === x.id ? "text-blanco ring-grafito" : "bg-blanco text-tinta-suave ring-linea hover:text-tinta",
                )}
              >
                {f === x.id && <motion.span layoutId="chip" className="absolute inset-0 rounded-full bg-grafito" transition={{ type: "spring", stiffness: 480, damping: 36 }} />}
                <span className="relative">
                  {x.t} <span className="tabular-nums opacity-60">{cuenta(x.id)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {delPortal.length > 0 && (
          <p className="mt-6 max-w-3xl text-[0.92rem] text-tinta-suave">
            {delPortal.length === 1 ? "La primera obra llegó" : `Las primeras ${delPortal.length} obras llegaron`} desde el portal de clientes: el equipo de INECSO la
            {delPortal.length === 1 ? "" : "s"} actualizó una vez allí y esta página se puso al día sola.
          </p>
        )}
        <LayoutGroup>
          <motion.ul layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {lista.map((o, k) => (
                <ObraCard key={o.cod} o={o} onOpen={() => setI(k)} />
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
        <p className="mt-8 max-w-3xl text-[0.82rem] text-tinta-suave">
          Tipos de obra y fotos reales de la web anterior de INECSO (2015–2018); las descripciones son ejemplos. En la web final, cada obra lleva su lugar, su año y el
          permiso del cliente.{" "}
          {delPortal.length === 0 && (
            <>
              En la demo, una obra publicada desde el{" "}
              <a href="#/portal/obras" className="font-semibold text-cianotipo hover:underline">
                portal
              </a>{" "}
              (como INECSO, en la página de la obra) aparece aquí primera.
            </>
          )}
        </p>
      </section>
      <Lightbox obras={lista} index={i} onClose={() => setI(null)} onIndex={setI} />
      <CtaBanda />
    </>
  );
}
