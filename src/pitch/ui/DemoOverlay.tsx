import { useEffect, useRef, useState } from "react";
import { Monitor, Smartphone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { demoUrl } from "./demoUrl";

/**
 * "Recórranla ustedes": the demo, live and full screen, in a native <dialog> (top layer, Escape closes it, the page
 * behind is inert and focus returns to the button that opened it). The iframe is created only when it opens.
 */
export function DemoOverlay({
  open,
  hash,
  onClose,
  titulo = "Demo de la web nueva",
}: {
  open: boolean;
  hash: string;
  onClose: () => void;
  titulo?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [disp, setDisp] = useState<"pc" | "movil">(() => (window.innerWidth < 720 ? "movil" : "pc"));

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label={`${titulo} de INECSO`}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-grafito p-0 text-papel backdrop:bg-grafito/80 open:flex open:flex-col"
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-linea-osc px-4 py-3">
        <p className="wdth-87 font-semibold">
          {titulo} <span className="font-normal text-linea">· datos de obras y portal de ejemplo</span>
        </p>
        <div className="ml-auto flex rounded-lg border border-linea-osc p-1" role="group" aria-label="Tamaño de pantalla">
          {(
            [
              ["pc", "Computador", Monitor],
              ["movil", "Celular", Smartphone],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              aria-pressed={disp === id}
              onClick={() => setDisp(id)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 wdth-87 text-[0.9rem] font-semibold transition-colors",
                disp === id ? "bg-energia text-grafito" : "text-papel hover:bg-grafito-3",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
        <a href={demoUrl(hash)} target="_blank" rel="noopener" className="wdth-87 text-[0.9rem] font-semibold text-energia underline-offset-4 hover:underline">
          Abrir en otra pestaña
        </a>
        <button
          type="button"
          onClick={onClose}
          className="grid size-10 place-items-center rounded-lg border border-linea-osc hover:bg-grafito-3"
          aria-label="Cerrar la demo"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      <div className="grid min-h-0 flex-1 place-items-center overflow-hidden p-3 sm:p-6">
        {open && (
          <iframe
            src={demoUrl(hash)}
            title={`${titulo} de INECSO, navegable`}
            className={cn(
              "h-full rounded-xl border border-linea-osc bg-blanco shadow-2xl transition-[width] duration-500 ease-obra",
              disp === "pc" ? "w-full max-w-[1440px]" : "w-[390px] max-w-full",
            )}
          />
        )}
      </div>
    </dialog>
  );
}
