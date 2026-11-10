import { createContext, useContext, useState, type ReactNode } from "react";
import type { TipoTrabajo } from "@/data/inecso";

/** What the generator estimator hands to the quote form. */
export interface Borrador {
  tipo?: TipoTrabajo;
  kva?: number;
  mensaje?: string;
}

interface Ctx {
  borrador: Borrador;
  setBorrador: (b: Borrador) => void;
  toast: (msg: string) => void;
  toastMsg: string | null;
  cerrarToast: () => void;
}

const C = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [borrador, setBorrador] = useState<Borrador>({});
  const [toastMsg, setToast] = useState<string | null>(null);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const toast = (msg: string) => {
    if (timer) clearTimeout(timer);
    setToast(msg);
    setTimer(setTimeout(() => setToast(null), 6000));
  };
  return (
    <C.Provider value={{ borrador, setBorrador, toast, toastMsg, cerrarToast: () => setToast(null) }}>
      {children}
    </C.Provider>
  );
}

export function useStore() {
  const c = useContext(C);
  if (!c) throw new Error("useStore outside StoreProvider");
  return c;
}
