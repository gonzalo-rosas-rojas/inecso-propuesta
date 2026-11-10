import { Info } from "lucide-react";
import { RIBBON } from "@/data/inecso";

export function Ribbon() {
  return (
    <div className="relative z-50 bg-grafito text-papel/85 print:hidden">
      <p className="mx-auto flex max-w-7xl items-start gap-2 px-4 py-2 text-[0.78rem] leading-snug sm:items-center sm:px-6">
        <Info className="mt-px size-3.5 shrink-0 text-energia sm:mt-0" aria-hidden="true" />
        <span className="hidden sm:inline">{RIBBON}</span>
        <span className="sm:hidden">Demo de propuesta: textos y fotos de las webs anteriores de INECSO; obras, contacto y portal de ejemplo.</span>
      </p>
    </div>
  );
}
