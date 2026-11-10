# INECSO proposal and website demo

A proposal page (in Spanish) for INECSO Ingeniería, an electrical engineering company in Santiago, Chile, specialised in standby generator sets. Along with it comes a working demo of their new website and a preview of a client portal.

- `index.html` → `src/pitch/`: the proposal. You read it like an electrical job, from "no power" to commissioning. A single-line diagram on the left energizes as you scroll. The acts:
  - where they are headed, and the day-to-day pains;
  - the solution: the website as the shop window, then the client portal;
  - the new site playing on a laptop;
  - the client portal on a phone, and full screen to try it;
  - the time the portal gives back, as a calculator;
  - three ways of working, each priced for the same job and charted month by month;
  - a scope and price configurator for the website;
  - the work plan;
  - after-sales: commitments, maintenance plans and what happens when something breaks;
  - quality checks, the conditions, and the final act, where the lights come on.
- `demo/index.html` → `src/demo/`: the website demo, with these pages:
  - home, including a power-cut simulation of an automatic transfer switch;
  - services;
  - works, with filters and a lightbox;
  - company;
  - quote, a multi-step form with a generator-size estimator;
  - a playable client portal (`#/portal`) with example jobs and equipment: roles for INECSO, the main contractor and each client, maintenance schedules, field work orders with checklist, photos and signatures, reports that print, a monthly management summary with an access log, and finished jobs that publish to the website's works page. Its state lives in the browser and "Reiniciar demo" resets it.

The INECSO texts and photos come from the company's own earlier websites (2008 to 2025, via the Internet Archive). The job descriptions and all portal data are fictional and labelled as such. Those texts and photos belong to INECSO and are used here only for this proposal.

## How it is built

- **Stack:** Vite, React and TypeScript, with Tailwind CSS 4 and Motion for animation. Lenis smooths the scrolling on the proposal page.
- **Components:** `marquee` and `number-ticker` come from Magic UI (MIT) through its shadcn registry. Everything else is hand-written.
- **Self-contained:** one self-hosted font (Archivo, SIL Open Font License, `src/assets/fonts/OFL-archivo.txt`) and no requests to other sites.
- **Security policy:** the build adds a strict Content Security Policy to both pages. There are no inline scripts or styles; values set from JavaScript go through the CSSOM.

```
npm ci
npm run dev      # http://127.0.0.1:5181/
npm run build    # writes dist/; its contents are published on the gh-pages branch, which GitHub Pages serves
```

Made by Gonzalo Rosas Rojas.
