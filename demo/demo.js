// INECSO demo website: hash router, works list with filters, quote form, and a client-portal mock.
// Every list is built with createElement/textContent (no innerHTML). All works and portal data are fictional.
(function () {
  "use strict";

  // ---------- data (fictional examples, labelled as such in the page) ----------
  // Real kinds of work and real photos from INECSO's last site (inecsoingenieria.cl, photos 2015-2018); the
  // wording of each item is an example until INECSO gives the real project, place and client permission.
  var OBRAS = [
    { cod: "OB-01", f: "gen", ic: "i-gen", img: "img/obra-grupo-jaula.jpg", t: "Montaje de grupo electrógeno en recinto enrejado", c: "Instalación, conexiones, pruebas y puesta en marcha", tipo: "Grupos electrógenos" },
    { cod: "OB-02", f: "civil", ic: "i-gen", img: "img/obra-terraza-cobertizo.jpg", t: "Grupo electrógeno en terraza, con cobertizo metálico", c: "Estructura calculada y obras civiles asociadas", tipo: "Obras y estructuras" },
    { cod: "OB-03", f: "gen", ic: "i-poste", img: "img/obra-izaje.jpg", t: "Izaje, posicionamiento y anclaje", c: "Grupo electrógeno izado sobre un recinto de acceso difícil", tipo: "Grupos electrógenos" },
    { cod: "OB-04", f: "gen", ic: "i-gen", img: "img/obra-desarme-motor.jpg", t: "Desarme de grupo electrógeno para un acceso reducido", c: "Motor, alternador y chasis llevados por partes y armados en su lugar", tipo: "Grupos electrógenos" },
    { cod: "OB-05", f: "mt", ic: "i-trafo", img: "img/obra-hipot.jpg", t: "Medición de aislación con equipo HIPOT", c: "Cables de fuerza de media tensión antes de energizar", tipo: "Media tensión" },
    { cod: "OB-06", f: "gen", ic: "i-red", img: "img/obra-piping.jpg", t: "Piping de combustible desde estanque auxiliar", c: "Trasvasije automático según DS 169", tipo: "Grupos electrógenos" },
    { cod: "OB-07", f: "civil", ic: "i-fibra", img: "img/obra-ducto.jpg", t: "Fabricación de ductos de escape", c: "Codos y bridas soldados, con revestimiento térmico", tipo: "Obras y estructuras" },
    { cod: "OB-08", f: "gen", ic: "i-gen", img: "img/obra-grupo-movil.jpg", t: "Grupo electrógeno móvil con carrete de cables", c: "Respaldo en terreno sobre carro", tipo: "Grupos electrógenos" },
    { cod: "OB-09", f: "gen", ic: "i-gen", img: "img/obra-desarme-sala.jpg", t: "Armado de grupo electrógeno en sala", c: "Faena señalizada y aislada del resto del recinto", tipo: "Grupos electrógenos" },
    { cod: "OB-10", f: "alu", ic: "i-poste", t: "Mantención eléctrica en plaza de peaje", c: "Postes, luminarias, canalización y luces de seguridad", tipo: "Alumbrado" },
    { cod: "OB-11", f: "mt", ic: "i-tierra", t: "Malla de puesta a tierra de protección", c: "Dimensionada según el terreno, con medición", tipo: "Baja tensión" }
  ];

  var ETAPAS = ["Cotización", "Proyecto", "Ejecución", "Pruebas y mediciones", "Declaración SEC", "Entrega"];

  var P_OBRAS = [
    {
      id: "1", titulo: "Ampliación de tablero general y nuevo alimentador", lugar: "Planta Buin", codigo: "Obra OB-121", etapa: 2, avance: 64,
      bitacora: [
        { d: "2026-11-05", q: "Supervisor de obra", t: "Terminado el tendido del alimentador por la bandeja norte. Mañana se conecta el tablero nuevo; habrá un corte programado de 40 minutos a las 07:30." },
        { d: "2026-11-03", q: "Prevención de riesgos", t: "Charla de inicio de faena y revisión de bloqueo y etiquetado con el personal de mantención de la planta." },
        { d: "2026-10-29", q: "Jefe de proyecto", t: "Llegó el tablero desde fábrica. Se adjunta su protocolo de pruebas." },
        { d: "2026-10-21", q: "Jefe de proyecto", t: "Proyecto aprobado por su equipo. Se programa el inicio de obra." }
      ],
      docs: [
        { n: "Plano unifilar, revisión C", f: "PDF", d: "2026-10-20" },
        { n: "Cotización aprobada", f: "PDF", d: "2026-10-14" },
        { n: "Protocolo de pruebas del tablero", f: "PDF", d: "2026-10-29" },
        { n: "Carta Gantt de la obra", f: "PDF", d: "2026-10-21" }
      ],
      equipo: [
        { n: "Jefe de proyecto", r: "Responde sus consultas técnicas y de plazos" },
        { n: "Supervisor de obra", r: "En terreno de lunes a viernes" },
        { n: "Prevención de riesgos", r: "Seguridad de la faena" }
      ]
    },
    {
      id: "2", titulo: "Mantención anual del grupo electrógeno", lugar: "Planta Buin", codigo: "Obra OB-119", etapa: 3, avance: 85,
      bitacora: [
        { d: "2026-11-04", q: "Técnico", t: "Prueba con carga durante 2 horas sin observaciones. Falta el informe de mediciones." },
        { d: "2026-10-30", q: "Técnico", t: "Cambio de filtros y aceite. Se reemplaza una batería de partida." }
      ],
      docs: [{ n: "Pauta de mantención", f: "PDF", d: "2026-10-30" }],
      equipo: [{ n: "Técnico de grupos electrógenos", r: "Mantención y pruebas" }]
    },
    {
      id: "3", titulo: "Malla de puesta a tierra de la sala eléctrica", lugar: "Bodega San Bernardo", codigo: "Obra OB-108", etapa: 5, avance: 100,
      bitacora: [{ d: "2026-09-12", q: "Jefe de proyecto", t: "Obra entregada. Certificado de medición de resistencia de puesta a tierra disponible en documentos." }],
      docs: [
        { n: "Certificado de medición de puesta a tierra", f: "PDF", d: "2026-09-12" },
        { n: "Declaración de instalación ante la SEC", f: "PDF", d: "2026-09-10" }
      ],
      equipo: [{ n: "Jefe de proyecto", r: "Garantía y consultas" }]
    }
  ];

  // ---------- helpers ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function icon(id, cls) {
    var NS = "http://www.w3.org/2000/svg";
    var s = document.createElementNS(NS, "svg");
    s.setAttribute("aria-hidden", "true");
    if (cls) s.setAttribute("class", cls);
    var u = document.createElementNS(NS, "use");
    u.setAttribute("href", "#" + id);
    s.appendChild(u);
    return s;
  }
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
  function fecha(iso) { var p = iso.split("-"); return Number(p[2]) + " " + MESES[Number(p[1]) - 1] + " " + p[0]; }

  // ---------- works list ----------
  function obraItem(o) {
    var li = el("li", "obra");
    li.dataset.f = o.f;
    li.appendChild(el("span", "obra-cod", o.cod));
    var fig = el("span", "obra-fig" + (o.img ? " con-foto" : ""));
    if (o.img) {
      var im = el("img");
      im.src = o.img;
      im.alt = o.t;
      im.loading = "lazy";
      im.width = 192;
      im.height = 144;
      fig.appendChild(im);
    } else fig.appendChild(icon(o.ic));
    li.appendChild(fig);
    var txt = el("div", "obra-txt");
    txt.appendChild(el("h3", null, o.t));
    txt.appendChild(el("p", null, o.c));
    li.appendChild(txt);
    li.appendChild(el("span", "obra-tipo", o.tipo));
    li.appendChild(el("span", "obra-anio", o.img ? "Foto de INECSO" : "Sin foto aún"));
    return li;
  }
  function renderObras() {
    var all = $("[data-obras]");
    OBRAS.forEach(function (o) { all.appendChild(obraItem(o)); });
    var dest = $("[data-obras-dest]");
    OBRAS.slice(0, 4).forEach(function (o) { dest.appendChild(obraItem(o)); });
    $$("[data-filtros] button").forEach(function (b) {
      b.addEventListener("click", function () {
        var f = b.dataset.f;
        $$("[data-filtros] button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        $$("[data-obras] .obra").forEach(function (li) { li.hidden = !(f === "todas" || li.dataset.f === f); });
      });
    });
  }

  // ---------- portal ----------
  function renderPortalList() {
    var ul = $("[data-p-obras]");
    P_OBRAS.forEach(function (o) {
      var li = el("li", "p-obra");
      var a = el("a");
      a.href = "#/portal/obra/" + o.id;
      var main = el("div");
      main.appendChild(el("h2", null, o.titulo));
      main.appendChild(el("p", null, o.lugar + ". " + o.codigo));
      a.appendChild(main);
      var col = el("div", "p-etapa-col");
      col.appendChild(el("span", "p-etapa", o.avance === 100 ? "Entregada" : ETAPAS[o.etapa]));
      var bar = el("div", "mini" + (o.avance === 100 ? " listo" : ""));
      var i = el("i");
      i.style.transform = "scaleX(" + o.avance / 100 + ")";
      bar.appendChild(i);
      col.appendChild(bar);
      a.appendChild(col);
      a.appendChild(el("span", "p-pct", o.avance + " %"));
      li.appendChild(a);
      ul.appendChild(li);
    });
  }
  function renderPortalObra(id) {
    var o = P_OBRAS.filter(function (x) { return x.id === id; })[0] || P_OBRAS[0];
    $('[data-o="titulo"]').textContent = o.titulo;
    $('[data-o="lugar"]').textContent = o.lugar;
    $('[data-o="codigo"]').textContent = o.codigo;
    $('[data-o="avance"]').textContent = o.avance === 100 ? "Obra entregada" : "Avance de la obra: " + o.avance + " %";
    var st = $("[data-stepper]");
    st.textContent = "";
    ETAPAS.forEach(function (name, k) {
      var li = el("li", k < o.etapa || o.avance === 100 ? "hecho" : k === o.etapa ? "actual" : "");
      li.appendChild(el("b", null, name));
      li.appendChild(el("span", null, k < o.etapa || o.avance === 100 ? "Lista" : k === o.etapa ? "En curso" : "Pendiente"));
      if (k === o.etapa && o.avance !== 100) li.setAttribute("aria-current", "step");
      st.appendChild(li);
    });
    var bar = $("[data-avance-bar]");
    bar.style.transform = "scaleX(0)";
    requestAnimationFrame(function () { requestAnimationFrame(function () { bar.style.transform = "scaleX(" + o.avance / 100 + ")"; }); });
    var bit = $("[data-bitacora]");
    bit.textContent = "";
    o.bitacora.forEach(function (b) {
      var li = el("li");
      var t = el("time", null, fecha(b.d));
      t.setAttribute("datetime", b.d);
      li.appendChild(t);
      li.appendChild(el("p", null, b.t));
      li.appendChild(el("span", "quien", b.q));
      bit.appendChild(li);
    });
    var docs = $("[data-docs]");
    docs.textContent = "";
    o.docs.forEach(function (d) {
      var li = el("li");
      li.appendChild(icon("i-doc"));
      var a = el("a", null, d.n);
      a.href = "#/portal/obra/" + o.id;
      a.addEventListener("click", function (e) { e.preventDefault(); toast("En la web real, aquí se abre o descarga el " + d.f + ". En la demo no hay archivos."); });
      li.appendChild(a);
      li.appendChild(el("small", null, fecha(d.d)));
      docs.appendChild(li);
    });
    var eq = $("[data-equipo]");
    eq.textContent = "";
    o.equipo.forEach(function (p) {
      var li = el("li");
      li.appendChild(el("b", null, p.n));
      li.appendChild(el("span", null, p.r));
      eq.appendChild(li);
    });
    $("[data-toast]").hidden = true;
  }
  var toastTimer = 0;
  function toast(msg) {
    var t = $("[data-toast]");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 6000);
  }

  // ---------- router ----------
  var NAV_OF = { inicio: "", servicios: "servicios", obras: "obras", empresa: "empresa", contacto: "contacto", portal: "portal", "portal-obras": "portal", "portal-obra": "portal" };
  function route() {
    var h = (location.hash || "#/inicio").replace(/^#\/?/, "");
    var parts = h.split("/");
    var page = parts[0] || "inicio";
    if (page === "portal" && parts[1] === "obras") page = "portal-obras";
    else if (page === "portal" && parts[1] === "obra") { page = "portal-obra"; renderPortalObra(parts[2]); }
    if (!$('[data-page="' + page + '"]')) page = "inicio";
    $$("[data-page]").forEach(function (s) { s.hidden = s.dataset.page !== page; });
    $$("[data-nav]").forEach(function (a) {
      if (a.dataset.nav === NAV_OF[page]) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    closeMenu();
    window.scrollTo(0, 0);
    var h1 = $('[data-page="' + page + '"] h1');
    if (h1) document.title = (page === "inicio" ? "INECSO Ingeniería: obras eléctricas desde 1991" : h1.textContent + ": INECSO Ingeniería") + " (demo)";
    if (routed) { var m = $("#contenido"); m.focus({ preventScroll: true }); }
    routed = true;
  }
  var routed = false;

  // ---------- menu ----------
  var menuBtn, nav;
  function closeMenu() { if (!nav) return; nav.classList.remove("abierto"); menuBtn.setAttribute("aria-expanded", "false"); }

  // ---------- forms ----------
  function initForms() {
    var f = $("[data-form]");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var req = ["#f-nombre", "#f-correo", "#f-msg"].map(function (s) { return $(s); });
      var bad = req.filter(function (i) { return !i.value.trim() || (i.type === "email" && !/^\S+@\S+\.\S+$/.test(i.value)); });
      req.forEach(function (i) { i.setAttribute("aria-invalid", String(bad.indexOf(i) >= 0)); });
      $("[data-form-err]").hidden = bad.length === 0;
      $("[data-form-ok]").hidden = bad.length > 0;
      if (bad.length) bad[0].focus();
    });
    $("[data-login]").addEventListener("submit", function (e) { e.preventDefault(); location.hash = "#/portal/obras"; });
    $("[data-visita]").addEventListener("click", function () { toast("Solicitud de visita enviada al jefe de proyecto. Le confirmará la fecha por correo. (Demo: no se envió nada.)"); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    menuBtn = $("[data-menu]");
    nav = $("#nav");
    menuBtn.addEventListener("click", function () {
      var open = !nav.classList.contains("abierto");
      nav.classList.toggle("abierto", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    renderObras();
    renderPortalList();
    initForms();
    window.addEventListener("hashchange", route);
    route();
  });
})();
