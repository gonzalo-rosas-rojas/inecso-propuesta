import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X, ImageOff } from "lucide-react";
import type { Obra } from "@/data/inecso";

/**
 * Accessible lightbox for the works gallery. Hand-built (no Radix Dialog) because the scroll-lock helper it uses
 * injects a <style> tag, which the page's Content Security Policy blocks.
 */
export function Lightbox({
  obras,
  index,
  onClose,
  onIndex,
}: {
  obras: Obra[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const open = index !== null;
  const o = open ? obras[index] : null;

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndex(((index ?? 0) + 1) % obras.length);
      else if (e.key === "ArrowLeft") onIndex(((index ?? 0) - 1 + obras.length) % obras.length);
      else if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("button");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, index, obras.length, onClose, onIndex]);

  return createPortal(
    <AnimatePresence>
      {o && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-grafito/92 p-3 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lb-t"
            className="relative grid max-h-full w-full max-w-6xl overflow-hidden rounded-md bg-grafito-2 text-papel shadow-2xl ring-1 ring-blanco/10 lg:grid-cols-[1.6fr_1fr]"
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[3/2] bg-grafito">
              <AnimatePresence mode="popLayout" initial={false}>
                {o.img ? (
                  <motion.img
                    key={o.cod}
                    src={o.img}
                    alt={o.t}
                    className="absolute inset-0 size-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  />
                ) : (
                  <motion.div key={o.cod} className="trama absolute inset-0 grid place-items-center text-papel/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <span className="flex flex-col items-center gap-2 text-[0.9rem]">
                      <ImageOff className="size-7" aria-hidden="true" />
                      Sin foto aún
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto p-5 sm:p-7">
              <p className="wdth-75 text-[0.85rem] font-semibold text-energia">
                {o.cod}. {o.tipo}
              </p>
              <h2 id="lb-t" className="wdth-112 text-[1.45rem] leading-tight font-extrabold text-blanco">
                {o.t}
              </h2>
              <p className="text-[0.98rem] text-papel/80">{o.c}.</p>
              <p className="text-[0.95rem] leading-relaxed text-papel/70">{o.detalle}</p>
              <p className="mt-auto text-[0.78rem] text-papel/45">
                {o.portal
                  ? "Publicada desde el portal de INECSO: el equipo la actualizó una vez y la web se puso al día sola. Obra y cliente de ejemplo."
                  : `${o.img ? "Foto de INECSO, de su web anterior." : "Sin foto todavía."} La descripción es un ejemplo: en la web final cada obra lleva su lugar, su año y el permiso del cliente.`}
              </p>
              <div className="flex items-center justify-between gap-3 border-t border-blanco/10 pt-4">
                <span className="text-[0.85rem] text-papel/55 tabular-nums">
                  {(index ?? 0) + 1} de {obras.length}
                </span>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-linea-claro px-3 py-2.5" onClick={() => onIndex(((index ?? 0) - 1 + obras.length) % obras.length)} aria-label="Obra anterior">
                    <ChevronLeft className="size-4" />
                  </button>
                  <button type="button" className="btn btn-linea-claro px-3 py-2.5" onClick={() => onIndex(((index ?? 0) + 1) % obras.length)} aria-label="Obra siguiente">
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-grafito/80 text-blanco ring-1 ring-blanco/20 hover:bg-grafito"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
