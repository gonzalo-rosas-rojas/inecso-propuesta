import { forwardRef } from "react";
import { motion } from "motion/react";
import { ImageOff, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Obra } from "@/data/inecso";

export const ObraCard = forwardRef<HTMLLIElement, { o: Obra; onOpen: () => void; className?: string; grande?: boolean }>(function ObraCard(
  { o, onOpen, className, grande },
  ref,
) {
  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
      className={cn("list-none", className)}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group flex h-full w-full flex-col overflow-hidden rounded-md bg-blanco text-left ring-1 ring-linea/70 transition-shadow hover:shadow-[0_16px_40px_-20px_rgb(0_0_0/0.45)]"
        aria-label={`${o.t}. Ver detalle`}
      >
        <span className={cn("relative block w-full overflow-hidden bg-grafito", grande ? "aspect-[16/10]" : "aspect-[4/3]")}>
          {o.img ? (
            <img src={o.img} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
          ) : (
            <span className="trama flex size-full flex-col items-center justify-center gap-2 bg-papel-2 text-[0.85rem] text-tinta-suave">
              <ImageOff className="size-6" aria-hidden="true" />
              Sin foto aún
            </span>
          )}
          <span className="absolute top-3 left-3 rounded-sm bg-grafito/80 px-2 py-1 text-[0.75rem] font-semibold text-blanco tabular-nums backdrop-blur-sm">{o.cod}</span>
          <span className="absolute right-3 bottom-3 grid size-8 place-items-center rounded-full bg-blanco/90 text-grafito opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Maximize2 className="size-4" aria-hidden="true" />
          </span>
        </span>
        <span className="flex flex-1 flex-col gap-1.5 p-4">
          {o.portal && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-energia/25 px-2.5 py-0.5 text-[0.75rem] font-semibold text-energia-osc">
              <span className="size-1.5 rounded-full bg-energia-osc" aria-hidden="true" />
              {o.portal}
            </span>
          )}
          <span className="wdth-75 text-[0.8rem] font-semibold text-cianotipo">{o.tipo}</span>
          <span className="text-[1.02rem] leading-snug font-bold text-tinta">{o.t}</span>
          <span className="text-[0.88rem] text-tinta-suave">{o.c}</span>
        </span>
      </button>
    </motion.li>
  );
});
