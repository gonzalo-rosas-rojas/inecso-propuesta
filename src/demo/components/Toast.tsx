import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, X } from "lucide-react";
import { useStore } from "../store";

export function Toast() {
  const { toastMsg, cerrarToast } = useStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 print:hidden" aria-live="polite">
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            key={toastMsg}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="pointer-events-auto flex max-w-md items-start gap-3 rounded-md bg-grafito px-4 py-3 text-[0.92rem] text-papel shadow-2xl ring-1 ring-blanco/10"
            role="status"
          >
            <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-tierra" aria-hidden="true" />
            <p className="flex-1">{toastMsg}</p>
            <button type="button" onClick={cerrarToast} className="-mr-1 rounded p-1 text-papel/70 hover:text-papel" aria-label="Cerrar aviso">
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
