// INECSO pitch: the single-line rail follows the reading position, the page tone follows the act
// (dark while "without power" and at the final act), the breaker closes once you start reading, and the
// final act switches its luminaires on once. Scrolling stays native; the loop only runs on scroll/resize.
(function () {
  "use strict";
  var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

  var actos, nodos, linea, corriente, movilBar, movilTxt, final;
  var tops = [], nodeY = [], vh = 0, raf = 0;

  function measure() {
    vh = window.innerHeight;
    var sy = window.scrollY;
    tops = actos.map(function (a) { var r = a.getBoundingClientRect(); return { top: r.top + sy, h: r.height }; });
    var list = $(".riel-nodos");
    if (list && list.offsetParent !== null) {
      var lr = list.getBoundingClientRect();
      var rr = $(".riel").getBoundingClientRect();
      nodeY = nodos.map(function (n) { var r = n.getBoundingClientRect(); return r.top + r.height / 2 - rr.top; });
      var y0 = nodeY[0], y1 = nodeY[nodeY.length - 1];
      linea.style.top = y0 + "px";
      linea.style.height = (y1 - y0) + "px";
      void lr;
    }
    update();
  }

  function update() {
    raf = 0;
    var sy = window.scrollY;
    var probe = sy + vh * 0.45;
    var idx = 0;
    for (var i = 0; i < tops.length; i++) if (probe >= tops[i].top) idx = i;
    var t = tops[idx];
    var frac = clamp((probe - t.top) / Math.max(1, t.h), 0, 1);

    var cerrado = sy > vh * 0.18;
    // rail current: from node idx toward node idx+1 (nothing flows while the breaker is open)
    if (nodeY.length && !cerrado) corriente.style.transform = "scaleY(0)";
    else if (nodeY.length) {
      var y0 = nodeY[0], yEnd = nodeY[nodeY.length - 1];
      var a = nodeY[idx], b = nodeY[Math.min(idx + 1, nodeY.length - 1)];
      var y = a + (b - a) * frac;
      corriente.style.transform = "scaleY(" + clamp((y - y0) / Math.max(1, yEnd - y0), 0, 1).toFixed(4) + ")";
    }
    nodos.forEach(function (n, k) {
      n.classList.toggle("alcanzado", k <= idx && cerrado);
      if (k === idx) n.setAttribute("aria-current", "step"); else n.removeAttribute("aria-current");
    });

    // tone: dark while the first act fills most of the screen, and on the final act
    var first = tops[0];
    var oscuro = sy < first.top + first.h - vh * 0.5 || idx === tops.length - 1;
    document.body.classList.toggle("oscuro", oscuro);
    document.body.classList.toggle("cerrado", cerrado);

    // mobile bar
    var docH = Math.max(1, document.documentElement.scrollHeight - vh);
    movilBar.style.transform = "scaleX(" + clamp(sy / docH, 0, 1).toFixed(4) + ")";
    movilTxt.textContent = nodos[idx] ? nodos[idx].textContent : "";

    // the one big gesture: once the final act is well in view, switch the lights on (and keep them on)
    if (!final.classList.contains("encendida") && final.getBoundingClientRect().top < vh * 0.55) final.classList.add("encendida");
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(update); }

  // ---------- demo frame: scale a real 1280px page (or a 390px phone) into the frame ----------
  var marco, vista, iframe, modo = "pc";
  function fitDemo() {
    var w = vista.clientWidth, h = vista.clientHeight;
    var W = modo === "pc" ? 1280 : 390;
    var H = modo === "pc" ? Math.round(h * (W / w)) : 780;
    var s = modo === "pc" ? w / W : Math.min(1, (h - 24) / H);
    iframe.style.width = W + "px";
    iframe.style.height = H + "px";
    var left = modo === "pc" ? 0 : Math.round((w - W * s) / 2);
    var top = modo === "pc" ? 0 : 12;
    iframe.style.transform = "translate(" + left + "px," + top + "px) scale(" + s.toFixed(4) + ")";
  }
  function initDemo() {
    marco = $("[data-marco]");
    vista = $("[data-vista]");
    iframe = $("[data-demo]");
    if (window.innerWidth < 720) {
      modo = "movil";
      marco.classList.add("movil");
      $$("[data-disp]").forEach(function (x) { x.setAttribute("aria-pressed", String(x.dataset.disp === "movil")); });
    }
    $$("[data-disp]").forEach(function (b) {
      b.addEventListener("click", function () {
        modo = b.dataset.disp;
        $$("[data-disp]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        marco.classList.toggle("movil", modo === "movil");
        fitDemo();
      });
    });
    $$("[data-ir]").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("[data-ir]").forEach(function (x) { if (x === b) x.setAttribute("aria-current", "true"); else x.removeAttribute("aria-current"); });
        try { iframe.contentWindow.location.hash = b.dataset.ir; }
        catch (e) { iframe.src = "demo/index.html" + b.dataset.ir; }
      });
    });
    fitDemo();
  }

  document.addEventListener("DOMContentLoaded", function () {
    actos = $$("[data-acto]");
    nodos = $$("[data-nodo]");
    linea = $(".riel-linea");
    corriente = $("[data-corriente]");
    movilBar = $("[data-corriente-movil]");
    movilTxt = $("[data-etapa-movil]");
    final = $("[data-final]");
    initDemo();
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", function () { measure(); fitDemo(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    window.addEventListener("load", measure);
    void RM;
  });
})();
