import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { OBRAS } from "@/data/inecso";
import { ObraCard } from "./ObraCard";
import { Lightbox } from "./Lightbox";

const DEST = OBRAS.filter((o) => o.img).slice(0, 4);

export function ObrasDestacadas() {
  const [i, setI] = useState<number | null>(null);
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28" aria-labelledby="od-h">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="od-h" className="wdth-125 text-[clamp(1.9rem,1.2rem+2.6vw,3.2rem)] leading-[1.02] font-extrabold">
            Obras recientes
          </h2>
          <p className="mt-3 max-w-xl text-tinta-suave">Fotos de INECSO en terreno. Los grupos llegan por partes, por grúa o por la puerta que haya.</p>
        </div>
        <a href="#/obras" className="inline-flex items-center gap-2 font-semibold text-cianotipo hover:underline">
          Ver todas las obras
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
      <ul className="sin-barra -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {DEST.map((o, k) => (
          <ObraCard key={o.cod} o={o} onOpen={() => setI(k)} className="w-[78%] shrink-0 snap-start sm:w-auto" />
        ))}
      </ul>
      <Lightbox obras={DEST} index={i} onClose={() => setI(null)} onIndex={setI} />
    </section>
  );
}
