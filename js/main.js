(() => {
  const S = window.SITE, T = window.TYPES, P = window.PROJECTS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s = "") => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // newest first; numbering follows this order
  const items = [...P].sort((a, b) => b.year - a.year);
  items.forEach((p, i) => (p.no = String(i + 1).padStart(2, "0")));

  $("#yr").textContent = new Date().getFullYear();

  /* ── drawn image placeholders (seeded, so each project keeps its drawing) ── */
  function rng(seed) {
    let h = 2166136261;
    for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
  }
  function drawing(seed, label) {
    const r = rng(seed), W = 400, H = 300, out = [];
    const n = 3 + Math.floor(r() * 4);
    for (let i = 0; i < n; i++) {
      const x = 20 + r() * 240, y = 20 + r() * 160, w = 60 + r() * 160, h = 40 + r() * 120;
      out.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="none" stroke="#bdbdbd" stroke-width="1"/>`);
      if (r() > 0.55) out.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="url(#h-${seed})"/>`);
    }
    if (r() > 0.4) { const cx = 80 + r() * 240, cy = 60 + r() * 180, rad = 20 + r() * 60; out.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rad.toFixed(1)}" fill="none" stroke="#d3d3d3"/>`); }
    const y = 30 + r() * 240;
    out.push(`<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="#ff4a1c" stroke-opacity=".35" stroke-dasharray="6 4"/>`);
    return `<div class="ph"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs><pattern id="h-${seed}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#d9d9d9"/></pattern></defs>${out.join("")}</svg>${label ? `<em>${esc(label)}</em>` : ""}</div>`;
  }

  // a text "page" stands in for a picture where the work has none (papers, talks, ideas)
  const doc = (kicker, title) => `<div class="doc"><span class="mono">${esc(kicker)}</span><b>${esc(title)}</b><i></i><i></i><i></i></div>`;
  const textual = p => p.type === "paper" || p.type === "conference";
  const thumb = p => textual(p) ? doc(p.award || p.venue.split(" (")[0], p.title) : drawing(p.id, "");

  /* ── search ─────────────────────────────────────────── */
  let activeType = "all", query = "";
  const hay = p => [p.title, T[p.type].label, p.venue, p.role, p.material, p.summary, Math.floor(p.year)].join(" ").toLowerCase();
  items.forEach(p => (p._hay = hay(p)));

  function matches() {
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    const pool = items.filter(p => activeType === "all" || p.type === activeType);
    if (!words.length) return new Set(pool);
    let hit = pool.filter(p => words.every(w => p._hay.includes(w)));
    if (!hit.length) hit = pool.filter(p => words.some(w => w.length > 2 && p._hay.includes(w)));
    return new Set(hit);
  }

  function apply() {
    const m = matches();
    items.forEach(p => {
      p._mk && p._mk.classList.toggle("dim", !m.has(p));
      p._row && p._row.classList.toggle("dim", !m.has(p));
    });
    $("#q-count").textContent = `${String(m.size).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
  }

  /* typed queries — the HED LAB search-bar gesture, now driving the drawing */
  const input = $("#q"), wrap = $(".q-wrap"), ghost = $("#q-text");
  let auto = true, timer;
  function typeLoop(qi = 0, ci = 0, dir = 1) {
    if (!auto) return;
    const word = S.queries[qi % S.queries.length];
    ghost.textContent = word.slice(0, ci);
    query = ghost.textContent; apply();
    if (dir > 0 && ci === word.length) return (timer = setTimeout(() => typeLoop(qi, ci, -1), 2200));
    if (dir < 0 && ci === 0) return (timer = setTimeout(() => typeLoop(qi + 1, 0, 1), 500));
    timer = setTimeout(() => typeLoop(qi, ci + dir, dir), dir > 0 ? 65 + Math.random() * 70 : 28);
  }
  input.addEventListener("focus", () => { auto = false; clearTimeout(timer); wrap.classList.add("typing"); query = input.value; apply(); });
  input.addEventListener("input", () => { query = input.value; apply(); });
  input.addEventListener("blur", () => {
    if (input.value) return;
    wrap.classList.remove("typing"); auto = true; typeLoop();
  });
  input.addEventListener("keydown", e => {
    if (e.key === "Escape") { input.value = ""; input.blur(); }
    if (e.key === "Enter") { const first = [...matches()][0]; first && go(`#/p/${first.id}`); }
  });
  // any printable key on the index starts a search
  document.addEventListener("keydown", e => {
    if (document.body.dataset.view !== "search" || document.body.classList.contains("sheet-open")) return;
    if (document.activeElement === input || e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
    input.focus();
  });

  /* ── tabs: one per category; they are also the columns of the field ── */
  const COLS = Object.keys(T);
  const count = k => items.filter(p => p.type === k).length;
  $("#filters").innerHTML = `<button data-type="all" class="on">All <em>${items.length}</em></button>` +
    COLS.map(k => `<button data-type="${k}"><span class="mk" data-type="${k}"><i></i></span>${T[k].label} <em>${count(k)}</em></button>`).join("");
  $$("#filters button").forEach(b => b.addEventListener("click", () => {
    activeType = activeType === b.dataset.type ? "all" : b.dataset.type;   // a second click returns to All
    $$("#filters button").forEach(x => x.classList.toggle("on", x.dataset.type === activeType));
    apply();
  }));

  const modes = $(".modes");
  modes.insertAdjacentHTML("afterbegin", `<button data-labels>Labels</button><span style="color:var(--line)">|</span>`);
  $("[data-labels]").addEventListener("click", e => { e.currentTarget.classList.toggle("on"); $("#field").classList.toggle("labels"); });
  $$("[data-mode]").forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));
  function setMode(mode) {
    $$("[data-mode]").forEach(x => x.classList.toggle("on", x.dataset.mode === mode));
    $("#field").hidden = mode !== "field";
    $("#list").hidden = mode !== "list";
    $("[data-labels]").hidden = $("[data-labels]").nextElementSibling.hidden = mode !== "field";
    try { localStorage.setItem("jy-mode", mode); } catch (_) {}
  }

  /* ── field: category (x, the tabs) × year (y, newest on top) ── */
  const years = items.map(p => p.year);
  const Y0 = Math.floor(Math.min(...years)), Y1 = Math.floor(Math.max(...years)) + 1;
  const pyr = y => ((Y1 - y) / (Y1 - Y0)) * 100;
  // spread each item across its column with a stable jitter, so the same work always sits in the same place
  items.forEach(p => { p._x = ((COLS.indexOf(p.type) + 0.14 + rng(p.id)() * 0.72) / COLS.length) * 100; p._y = pyr(p.year); });

  const plane = $("#plane"), marks = $("#marks");
  let gridHTML = "";
  for (let c = 1; c < COLS.length; c++) gridHTML += `<div class="grid-v" style="left:${(c / COLS.length) * 100}%"></div>`;
  for (let y = Y0 + 1; y < Y1; y++) gridHTML += `<div class="grid-h" style="top:${pyr(y)}%"></div>`;
  plane.insertAdjacentHTML("afterbegin", gridHTML);
  $("#axis-y").innerHTML = Array.from({ length: Y1 - Y0 }, (_, i) => Y0 + i).map(y => `<span style="top:${pyr(y + 0.5)}%">${y}</span>`).join("");

  items.forEach((p, i) => {
    const el = document.createElement("a");
    el.className = "mk pre"; el.href = `#/p/${p.id}`; el.dataset.type = p.type;
    el.style.left = p._x + "%"; el.style.top = p._y + "%";
    el.innerHTML = `<i></i><span>${esc(p.title)}</span>`;
    el.setAttribute("aria-label", `${p.title} — ${T[p.type].label}, ${Math.floor(p.year)}`);
    marks.appendChild(el); p._mk = el;
    setTimeout(() => el.classList.remove("pre"), 300 + i * 50);
  });

  const tip = $("#tip"), readout = $("#readout"), cx = $(".cross-x"), cy = $(".cross-y");
  let near = null;
  function setNear(p, rect) {
    if (near === p) return;
    near && near._mk.classList.remove("near");
    near = p;
    if (!p) return tip.classList.remove("on");
    p._mk.classList.add("near");
    tip.innerHTML = `${thumb(p)}<b>${esc(p.title)}</b><small>${esc(p.venue)} · ${Math.floor(p.year)}</small>`;
    const mx = (p._x / 100) * rect.width, my = (p._y / 100) * rect.height;
    tip.style.left = Math.min(mx + 20, rect.width - 232) + "px";
    tip.style.top = (my > rect.height - 200 ? my - 200 : my + 16) + "px";
    tip.classList.add("on");
  }
  plane.addEventListener("pointermove", e => {
    const r = plane.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    plane.classList.add("live");
    cx.style.top = y + "px"; cy.style.left = x + "px";
    const yr = Y1 - (y / r.height) * (Y1 - Y0), col = COLS[Math.min(COLS.length - 1, Math.max(0, Math.floor((x / r.width) * COLS.length)))];
    readout.textContent = `${T[col].label}  ·  ${Math.floor(yr)}.${String(Math.floor((yr % 1) * 12) + 1).padStart(2, "0")}`;
    readout.style.left = Math.min(x + 10, r.width - 170) + "px";
    readout.style.top = r.height - 18 + "px";
    let best = null, bd = 56;
    items.forEach(p => {
      if (p._mk.classList.contains("dim")) return;
      const d = Math.hypot((p._x / 100) * r.width - x, (p._y / 100) * r.height - y);
      if (d < bd) { bd = d; best = p; }
    });
    setNear(best, r);
  });
  // exploring the drawing pauses the typed query so every point can be reached
  plane.addEventListener("pointerenter", () => {
    if (!auto) return;
    auto = false; clearTimeout(timer); ghost.textContent = ""; query = ""; apply();
  });
  plane.addEventListener("pointerleave", () => {
    plane.classList.remove("live"); setNear(null);
    if (!input.value && document.activeElement !== input) { auto = true; typeLoop(); }
  });
  plane.addEventListener("click", e => { if (near && !e.target.closest(".mk")) go(`#/p/${near.id}`); });

  /* ── list ───────────────────────────────────────────── */
  const rows = $("#rows"), hov = $("#hover-img");
  items.forEach(p => {
    const r = document.createElement("a");
    r.className = "row"; r.href = `#/p/${p.id}`;
    r.innerHTML = `<span class="mono">${p.no}</span><span class="t"><b>${esc(p.title)}</b></span><span>${T[p.type].label}</span><span>${esc(p.venue)}</span><span class="mono">${Math.floor(p.year)}</span>`;
    r.addEventListener("pointerenter", () => { hov.innerHTML = thumb(p); hov.classList.add("on"); });
    r.addEventListener("pointerleave", () => hov.classList.remove("on"));
    rows.appendChild(r); p._row = r;
  });
  document.addEventListener("pointermove", e => { hov.style.left = e.clientX + 24 + "px"; hov.style.top = e.clientY - 85 + "px"; });

  /* ── sub-pages: one per item under research / design — intro text + cards ── */
  const IDEAS = window.IDEAS || [], PAGES = S.pages;
  const pad = n => String(n).padStart(2, "0");
  const card = (i, title, art, meta, href, note) => {
    const open = href ? `<a class="card" href="${href}">` : `<div class="card">`;
    return `${open}<div class="card-top"><span>${esc(title)}</span><span class="mono">${pad(i + 1)}</span></div>${art}` +
      `<div class="card-meta">${meta}</div>${note ? `<div class="card-note">${esc(note)}</div>` : ""}${href ? "</a>" : "</div>"}`;
  };
  const workCard = (p, i) => card(i, p.title, thumb(p),
    `${esc(p.type === "paper" ? p.role : p.venue)} · ${Math.floor(p.year)}`, `#/p/${p.id}`, p.award);
  // hover menus under "research" and "design"
  Object.entries(PAGES).forEach(([group, list]) => {
    $(`[data-drop="${group}"]`).innerHTML = list.map(pg => `<a href="#/${group}/${pg.id}" data-sub="${group}/${pg.id}">${esc(pg.label)}</a>`).join("");
  });
  function renderSub(group, pg) {
    $("#sib").innerHTML = PAGES[group].map(x => `<a href="#/${group}/${x.id}" class="${x === pg ? "on" : ""}">${esc(x.label)}</a>`).join("");
    $("#sub-lead").textContent = pg.lead;
    const work = items.filter(p => p.type === pg.type);
    const cards = work.map(workCard);
    if (pg.type === "material") IDEAS.forEach((d, i) => cards.push(card(work.length + i, d.title, doc("Ideation", d.title), `${esc(d.note)} · ${d.year}`)));
    $("#sub-grid").innerHTML = cards.join("");
  }

  $("#bio").textContent = S.bio;
  $("#cv").innerHTML = S.cv.map(g => `<div class="cv-col"><h3 class="mono label">${esc(g.group)}</h3>` + g.items.map(it =>
    `<div class="cv-row"><span class="mono">${esc(it.when)}</span><span><b>${esc(it.what)}</b>${it.note ? `<small>${esc(it.note)}</small>` : ""}</span></div>`).join("") + "</div>").join("");
  $("#contact").innerHTML = `<a href="mailto:${esc(S.email)}">${esc(S.email)}</a>` + S.links.map(l => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("");

  /* ── project sheet ──────────────────────────────────── */
  let current = null;
  function openSheet(p) {
    current = p;
    $("#s-no").textContent = `${p.no} / ${String(items.length).padStart(2, "0")} — ${T[p.type].label}`;
    const gal = textual(p) ? "" : Array.from({ length: 5 }, (_, i) => drawing(p.id + i, `IMAGE ${String(i + 1).padStart(2, "0")}`).replace('class="ph"', `class="ph${i % 3 === 0 ? " wide" : ""}"`)).join("");
    $("#sheet-body").innerHTML = `
      <h1>${esc(p.title)}</h1>
      <h2>${esc(p.venue)}</h2>
      <div class="facts">
        <div><span class="mono">Year</span>${Math.floor(p.year)}</div>
        <div><span class="mono">Type</span>${esc(T[p.type].label)}</div>
        <div><span class="mono">Role</span>${esc(p.role)}</div>
        <div><span class="mono">${textual(p) ? "Venue" : "Medium"}</span>${esc(textual(p) ? p.venue : p.material || "—")}</div>
      </div>
      ${p.award ? `<p class="award mono">${esc(p.award)}</p>` : ""}
      <p class="desc">${esc(p.summary)}${textual(p) ? "" : `<br><span style="color:var(--mid)">${esc(p.venue)}</span>`}</p>
      <div class="gallery">${gal}</div>`;
    $("#sheet-body").scrollTop = 0;
    document.body.classList.add("sheet-open");
    $("#sheet").setAttribute("aria-hidden", "false");
  }
  function closeSheet() {
    document.body.classList.remove("sheet-open");
    $("#sheet").setAttribute("aria-hidden", "true");
    current = null;
  }
  const step = d => { const i = items.indexOf(current); go(`#/p/${items[(i + d + items.length) % items.length].id}`); };
  $("#s-prev").addEventListener("click", () => step(-1));
  $("#s-next").addEventListener("click", () => step(1));
  $("#s-close").addEventListener("click", () => go(lastView));
  $("#scrim").addEventListener("click", () => go(lastView));
  document.addEventListener("keydown", e => {
    if (!current) return;
    if (e.key === "Escape") go(lastView);
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  /* ── routing ──────────────────────────────────────────
        #/ home · #/search · #/hello · #/research/<page> · #/design/<page> · #/p/<id>
        Older addresses still land in the right place.                          */
  const ALIAS = { "#/about": "#/hello", "#/material": "#/design/exhibition", "#/research/exhibitions": "#/design/exhibition",
                  "#/conferences": "#/research/conferences", "#/talks": "#/research/conferences", "#/publications": "#/research/publications" };
  let lastView = "#/", lastPage = null;
  function go(h) { location.hash = h; }
  function route() {
    const raw = location.hash || "#/", h = ALIAS[raw] || raw;
    const pm = h.match(/^#\/p\/(.+)$/);
    if (pm) {
      const p = items.find(x => x.id === pm[1]);
      if (p) return openSheet(p);
    }
    closeSheet();
    const [, base = "", sub] = h.split("/");
    let view = ["search", "hello"].includes(base) ? base : "home", subKey = "";
    if (PAGES[base]) {                         // research / design: show the sub-page (the first one by default)
      const pg = PAGES[base].find(x => x.id === sub) || PAGES[base][0];
      view = "sub"; subKey = `${base}/${pg.id}`;
      renderSub(base, pg);
    }
    const moved = h !== lastPage;              // closing a sheet returns to the same page without scrolling
    lastView = raw; lastPage = h;
    document.body.dataset.view = view;
    $$(".view").forEach(v => (v.hidden = v.id !== `view-${view}`));
    $$("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === (view === "sub" ? base : view)));
    $$("[data-sub]").forEach(a => a.classList.toggle("on", a.dataset.sub === subKey));
    if (moved) window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  /* ── init ───────────────────────────────────────────── */
  let mode = matchMedia("(max-width: 760px)").matches ? "list" : "field";
  try { mode = localStorage.getItem("jy-mode") || mode; } catch (_) {}
  setMode(mode);
  route();
  apply();
  setTimeout(typeLoop, 900);
})();
