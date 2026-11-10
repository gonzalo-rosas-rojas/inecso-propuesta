import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Item } from "@/data/precios";

/** One included feature: the plain benefit, what it means, and its technical name as a small tag. */
export function Punto({ x, oscuro = false }: { x: Item; oscuro?: boolean }) {
  return (
    <li className="flex gap-2.5">
      <Check className={cn("mt-0.5 size-4 shrink-0", oscuro ? "text-energia" : "text-tierra")} aria-hidden="true" />
      <span>
        <b className="wdth-87">{x.t}</b>
        {x.d && <span className={cn("block leading-snug", oscuro ? "text-papel/70" : "text-tinta-suave")}>{x.d}</span>}
        {x.tec && (
          <span className={cn("mt-1 inline-block rounded px-1.5 py-0.5 text-[0.74rem] leading-tight", oscuro ? "bg-papel/10 text-papel/70" : "bg-cianotipo/8 text-cianotipo")}>{x.tec}</span>
        )}
      </span>
    </li>
  );
}
