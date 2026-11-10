import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// Strict Content Security Policy, added only to the built pages (the dev server needs inline scripts for hot reload).
// Styles set from JS go through the CSSOM (element.style), which style-src does not restrict.
const CSP =
  "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; " +
  "frame-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'";

function csp(): Plugin {
  return {
    name: "inecso-csp",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n<meta http-equiv="Content-Security-Policy" content="${CSP}">`);
    },
  };
}

// Two pages: the proposal (index.html) and the website demo (demo/index.html).
// base "./" keeps every URL relative, so the build works on GitHub Pages under /inecso-propuesta/.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), csp()],
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  server: { port: 5181, strictPort: true, host: "127.0.0.1" },
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        pitch: resolve(__dirname, "index.html"),
        demo: resolve(__dirname, "demo/index.html"),
      },
    },
  },
});
