import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Phone, X, LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMPRESA } from "@/data/inecso";
import { navOf, type Route } from "../router";
import { Logo } from "./Logo";

const NAV = [
  { id: "servicios", t: "Servicios", href: "#/servicios" },
  { id: "obras", t: "Obras", href: "#/obras" },
  { id: "empresa", t: "Empresa", href: "#/empresa" },
  { id: "contacto", t: "Contacto", href: "#/contacto" },
];

export function Header({ route }: { route: Route }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = route.page === "inicio" && !scrolled && !open;
  const current = navOf(route.page);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [route.key]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow,color] duration-300 print:hidden",
        overHero ? "bg-transparent text-blanco" : "bg-blanco/92 text-tinta shadow-[0_1px_0_rgb(0_0_0/0.08)] backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[76px]">
        <a href="#/inicio" className="rounded-sm" aria-label="INECSO Ingeniería, inicio">
          <Logo claro={overHero} />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={n.href}
              aria-current={current === n.id ? "page" : undefined}
              className={cn(
                "relative rounded-sm px-3.5 py-2 text-[0.95rem] font-medium transition-colors",
                overHero ? "text-blanco/85 hover:text-blanco" : "text-tinta-suave hover:text-tinta",
                current === n.id && (overHero ? "text-blanco" : "text-tinta"),
              )}
            >
              {n.t}
              {current === n.id && (
                <motion.span layoutId="nav-activo" className="absolute inset-x-3.5 -bottom-0.5 h-0.5 bg-energia" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
              )}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={EMPRESA.telefonoHref}
            className={cn("mr-2 inline-flex items-center gap-1.5 text-[0.9rem] font-medium tabular-nums", overHero ? "text-blanco/85" : "text-tinta-suave")}
          >
            <Phone className="size-4" aria-hidden="true" />
            {EMPRESA.telefono}
          </a>
          <a
            href="#/portal"
            aria-current={current === "portal" ? "page" : undefined}
            className={cn("btn py-2.5", overHero ? "btn-linea-claro" : "btn-linea text-tinta")}
          >
            <LockKeyhole className="size-4" aria-hidden="true" />
            Acceso clientes
          </a>
          <a href="#/contacto" className="btn btn-energia py-2.5">
            Cotizar
          </a>
        </div>

        <button
          type="button"
          className={cn("inline-flex items-center gap-2 rounded-sm px-2 py-2 text-[0.95rem] font-semibold lg:hidden")}
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          {open ? "Cerrar" : "Menú"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            className="absolute inset-x-0 top-full border-t border-linea/60 bg-blanco text-tinta shadow-xl lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <nav aria-label="Principal, móvil" className="flex flex-col px-4 pt-2 pb-5">
              {NAV.map((n, i) => (
                <motion.a
                  key={n.id}
                  href={n.href}
                  aria-current={current === n.id ? "page" : undefined}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.04 }}
                  className="wdth-112 flex items-center justify-between border-b border-linea/50 py-3.5 text-[1.25rem] font-bold aria-[current=page]:text-cianotipo"
                >
                  {n.t}
                  <span aria-hidden="true" className="h-0.5 w-5 bg-energia opacity-0 aria-[current=page]:opacity-100" />
                </motion.a>
              ))}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <a href="#/portal" className="btn btn-linea text-tinta">
                  <LockKeyhole className="size-4" aria-hidden="true" />
                  Acceso clientes
                </a>
                <a href="#/contacto" className="btn btn-energia">
                  Cotizar
                </a>
              </div>
              <a href={EMPRESA.telefonoHref} className="mt-4 inline-flex items-center gap-2 text-[0.95rem] text-tinta-suave tabular-nums">
                <Phone className="size-4" aria-hidden="true" />
                {EMPRESA.telefono}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
