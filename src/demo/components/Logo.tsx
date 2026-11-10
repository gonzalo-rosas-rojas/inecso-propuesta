import { cn } from "@/lib/utils";

/** Proposed INECSO mark: the single-line-diagram symbol of a generator (a circle with a sine wave). */
export function Logo({ claro = false, className }: { claro?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 36 36" className="size-9 shrink-0" aria-hidden="true">
        <rect width="36" height="36" rx="4" className={claro ? "fill-blanco" : "fill-cianotipo"} />
        <circle cx="18" cy="18" r="10.5" fill="none" strokeWidth="2.4" className={claro ? "stroke-cianotipo" : "stroke-blanco"} />
        <path
          d="M11.5 18c1.6-4.2 4.9-4.2 6.5 0s4.9 4.2 6.5 0"
          fill="none"
          strokeWidth="2.4"
          strokeLinecap="round"
          className={claro ? "stroke-cianotipo" : "stroke-energia"}
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={cn("wdth-125 text-[1.18rem] font-extrabold tracking-tight", claro ? "text-blanco" : "text-tinta")}>INECSO</span>
        <span className={cn("wdth-75 mt-0.5 text-[0.78rem] font-medium", claro ? "text-blanco/75" : "text-tinta-suave")}>Ingeniería</span>
      </span>
    </span>
  );
}
