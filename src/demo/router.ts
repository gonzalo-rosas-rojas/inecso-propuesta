import { useEffect, useState } from "react";

export type Page =
  | "inicio"
  | "servicios"
  | "obras"
  | "empresa"
  | "contacto"
  | "portal"
  | "portal-obras"
  | "portal-obra"
  | "portal-tablero"
  | "portal-mantenciones"
  | "portal-informes"
  | "portal-ot"
  | "portal-informe"
  | "portal-gestion";

export interface Route {
  page: Page;
  id?: string;
  key: string;
}

const PAGES: Page[] = ["inicio", "servicios", "obras", "empresa", "contacto", "portal"];

export function parse(hash: string): Route {
  // "?como=inecso" after a portal route only picks the role in the proposal's previews (see estado.tsx); routing ignores it.
  const h = (hash || "#/inicio").replace(/^#\/?/, "").split("?")[0];
  const parts = h.split("/");
  let page = (parts[0] || "inicio") as Page;
  if (page === "portal") {
    const sub = parts[1];
    if (sub === "obras" || sub === "tablero" || sub === "mantenciones" || sub === "informes" || sub === "gestion") {
      const p = ("portal-" + sub) as Page;
      return { page: p, key: p };
    }
    // pages of one item: #/portal/obra/1, #/portal/ot/OT-0142, #/portal/informe/OT-0142
    if (sub === "obra" || sub === "ot" || sub === "informe") {
      const id = decodeURIComponent(parts[2] || (sub === "obra" ? "1" : ""));
      const p = ("portal-" + sub) as Page;
      return { page: p, id, key: p + "-" + id };
    }
  }
  if (!PAGES.includes(page)) page = "inicio";
  return { page, key: page };
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState(() => parse(window.location.hash));
  useEffect(() => {
    const on = () => setRoute(parse(window.location.hash));
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

export function go(hash: string) {
  const h = hash.startsWith("#") ? hash : "#" + hash;
  if (window.location.hash === h) window.dispatchEvent(new HashChangeEvent("hashchange"));
  else window.location.hash = h;
}

/** Which top-level nav item is current for a page. */
export function navOf(page: Page): string {
  if (page.startsWith("portal")) return "portal";
  return page;
}
