# INECSO proposal and website demo

A single-page proposal (in Spanish) for INECSO Ingeniería, an electrical engineering company in Santiago, Chile, specialised in standby generator sets since 1991. Along with it comes a clickable demo of their new website and a preview of a client portal.

- `index.html`: the proposal. You read it like an electrical job, from "no power" to commissioning. A single-line diagram on the left energizes as you scroll.
- `demo/`: the website demo (home, services, works, company, quote form) and a client-portal mock with one example job.

The INECSO texts and photos come from the company's own earlier websites (2008 to 2025, via the Internet Archive). The job descriptions and all portal data are fictional and labelled as such. Those texts and photos belong to INECSO and are used here only for this proposal.

How it is built: static HTML, CSS and JavaScript, with no dependencies and no external requests. One self-hosted font (Archivo, SIL Open Font License, see `assets/fonts/OFL-archivo.txt`) and a strict Content Security Policy. To view it, open `index.html` in a browser; no server is needed.

Made by Gonzalo Rosas Rojas.
