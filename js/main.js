(() => {
  const S = window.SITE, T = window.TYPES, P = window.PROJECTS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s = "") => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // newest first; numbering follows this order
  const items = [...P].sort((a, b) => b.year - a.year);
  items.forEach((p, i) => (p.no = String(i + 1).padStart(2, "0")));

  /* ── header: location + Seoul clock ────────────────── */
  $("#loc").textContent = `${S.base} ${S.coords}`;
  $("#yr").textContent = new Date().getFullYear();
  const clockFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const tick = () => ($("#clock").textContent = clockFmt.format(new Date()) + " KST");
  tick(); setInterval(tick, 1000);

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
    return `<div class="ph"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs><pattern id="h-${seed}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#d9d9d9"/></pattern></defs>${out.join("")}</svg><em>${esc(label)}</em></div>`;
  }

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

  /* ── filters / modes ────────────────────────────────── */
  $("#filters").innerHTML = `<button data-type="all" class="on">All</button>` +
    Object.entries(T).map(([k, v]) => `<button data-type="${k}"><span class="mk" data-type="${k}" style="position:static;display:inline-grid;width:auto;height:auto;margin:0 6px 0 0"><i></i></span>${v.label}</button>`).join("");
  $$("#filters button").forEach(b => b.addEventListener("click", () => {
    activeType = b.dataset.type;
    $$("#filters button").forEach(x => x.classList.toggle("on", x === b));
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

  /* ── field: year × scale ────────────────────────────── */
  const tiers = [
    { name: "Material", unit: "10⁻³ m" },
    { name: "Object",   unit: "10⁰ m" },
    { name: "Interior", unit: "10¹ m" },
    { name: "Public",   unit: "10² m" },
    { name: "Virtual",  unit: "∞" }
  ];
  const years = items.map(p => p.year);
  const x0 = Math.floor(Math.min(...years)) - 0.4, x1 = Math.ceil(Math.max(...years)) + 0.4;
  const px = y => ((y - x0) / (x1 - x0)) * 100;
  const py = s => (1 - s / tiers.length) * 100;

  const plane = $("#plane"), marks = $("#marks");
  let gridHTML = "";
  for (let y = Math.ceil(x0); y <= x1; y++) gridHTML += `<div class="grid-v" style="left:${px(y)}%"></div>`;
  tiers.forEach((t, i) => (gridHTML += `<div class="grid-h${i === 4 ? " dashed" : ""}" style="top:${py(i)}%"></div>`));
  gridHTML += `<div class="band" style="top:0;height:${py(4)}%"></div>`;
  plane.insertAdjacentHTML("afterbegin", gridHTML);

  $("#axis-x").innerHTML = Array.from({ length: Math.floor(x1) - Math.ceil(x0) + 1 }, (_, i) => Math.ceil(x0) + i)
    .filter(y => y + 0.5 < x1).map(y => `<span style="left:${px(y + 0.5)}%">${y}</span>`).join("");
  $("#axis-y").innerHTML = tiers.map((t, i) => `<span style="top:${py(i + 0.5)}%">${t.name}<em>${t.unit}</em></span>`).join("");

  items.forEach((p, i) => {
    const el = document.createElement("a");
    el.className = "mk pre"; el.href = `#/p/${p.id}`; el.dataset.type = p.type;
    el.style.left = px(p.year) + "%"; el.style.top = py(p.scale) + "%";
    el.innerHTML = `<i></i><span>${esc(p.title)}</span>`;
    el.setAttribute("aria-label", `${p.title} — ${T[p.type].label}, ${Math.floor(p.year)}`);
    marks.appendChild(el); p._mk = el;
    setTimeout(() => el.classList.remove("pre"), 300 + i * 70);
  });

  const tip = $("#tip"), readout = $("#readout"), cx = $(".cross-x"), cy = $(".cross-y");
  let near = null;
  function setNear(p, rect) {
    if (near === p) return;
    near && near._mk.classList.remove("near");
    near = p;
    if (!p) return tip.classList.remove("on");
    p._mk.classList.add("near");
    tip.innerHTML = `${drawing(p.id, T[p.type].label)}<b>${esc(p.title)}</b><small>${esc(p.venue)} · ${Math.floor(p.year)}</small>`;
    const mx = (px(p.year) / 100) * rect.width, my = (py(p.scale) / 100) * rect.height;
    tip.style.left = Math.min(mx + 20, rect.width - 232) + "px";
    tip.style.top = (my > rect.height - 200 ? my - 200 : my + 16) + "px";
    tip.classList.add("on");
  }
  plane.addEventListener("pointermove", e => {
    const r = plane.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    plane.classList.add("live");
    cx.style.top = y + "px"; cy.style.left = x + "px";
    const yr = x0 + (x / r.width) * (x1 - x0), sc = (1 - y / r.height) * tiers.length;
    const tier = tiers[Math.min(tiers.length - 1, Math.max(0, Math.floor(sc)))];
    readout.textContent = `${Math.floor(yr)}.${String(Math.floor((yr % 1) * 12) + 1).padStart(2, "0")}  ·  ${tier.name} ${tier.unit}`;
    readout.style.left = Math.min(x + 10, r.width - 170) + "px";
    readout.style.top = r.height - 18 + "px";
    let best = null, bd = 56;
    items.forEach(p => {
      if (p._mk.classList.contains("dim")) return;
      const d = Math.hypot((px(p.year) / 100) * r.width - x, (py(p.scale) / 100) * r.height - y);
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
    r.addEventListener("pointerenter", () => { hov.innerHTML = drawing(p.id, p.no); hov.classList.add("on"); });
    r.addEventListener("pointerleave", () => hov.classList.remove("on"));
    rows.appendChild(r); p._row = r;
  });
  document.addEventListener("pointermove", e => { hov.style.left = e.clientX + 24 + "px"; hov.style.top = e.clientY - 85 + "px"; });

  /* ── stage pages: 01 material & ideation · 02 conferences & awards · 03 publications ── */
  const STAGES = S.stages, TALKS = window.TALKS || [], IDEAS = window.IDEAS || [];
  $$("[data-strip]").forEach(el => {
    el.innerHTML = STAGES.map(st => `<a href="${st.route}" class="${st.key === el.dataset.strip ? "on" : ""}"><span>${st.no}</span>${esc(st.label)}</a>`).join("");
  });
  $("#material-cards").innerHTML = items.filter(p => p.type === "material").map(p =>
    `<a class="card" href="#/p/${p.id}">${drawing(p.id, p.no)}<b>${esc(p.title)}</b><small>${esc(p.venue)} · ${Math.floor(p.year)}</small></a>`).join("");
  $("#ideas").innerHTML = IDEAS.map(d =>
    `<div class="cv-row"><span class="mono">${d.year}</span><span><b>${esc(d.title)}</b><small>${esc(d.note)}</small></span></div>`).join("");
  const kinds = ["All", ...new Set(TALKS.map(x => x.kind))];
  $("#talk-filters").innerHTML = `<div class="filters">${kinds.map((k, i) => `<button data-kind="${k}" class="${i ? "" : "on"}">${k}</button>`).join("")}</div>`;
  const renderTalks = kind => {
    $("#talks").innerHTML = TALKS.filter(x => kind === "All" || x.kind === kind).sort((a, b) => b.year - a.year).map(x =>
      `<div class="cv-row talk"><span class="mono">${Math.floor(x.year)}</span><span><b>${esc(x.title)}</b><small>${esc(x.venue)}</small></span><span class="mono kind">${esc(x.kind)}</span></div>`).join("");
  };
  $$("#talk-filters button").forEach(b => b.addEventListener("click", () => {
    $$("#talk-filters button").forEach(x => x.classList.toggle("on", x === b));
    renderTalks(b.dataset.kind);
  }));
  renderTalks("All");

  /* ── publications / hello ──────────────────────────── */
  $("#research-lead").textContent = "Research on the role space plays where the digital meets the non-digital — looking at public and exhibition spaces through affordance, digital inclusion and digital wellbeing.";
  $("#interests").innerHTML = S.interests.map(i => `<li>${esc(i)}</li>`).join("");
  $("#pubs").innerHTML = items.filter(p => p.type === "paper").map(p =>
    `<a class="pub" href="#/p/${p.id}"><span class="mono">${Math.floor(p.year)}</span><span><b>${esc(p.title)}</b><small>${esc(p.venue)} · ${esc(p.role)}</small></span></a>`).join("");
  $("#bio").textContent = S.bio;
  $("#cv").innerHTML = S.cv.map(g => `<h3 class="mono label">${esc(g.group)}</h3>` + g.items.map(it =>
    `<div class="cv-row"><span class="mono">${esc(it.when)}</span><span><b>${esc(it.what)}</b>${it.note ? `<small>${esc(it.note)}</small>` : ""}</span></div>`).join("")).join("");
  $("#contact").innerHTML = `<a href="mailto:${esc(S.email)}">${esc(S.email)}</a>` + S.links.map(l => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("");

  /* ── project sheet ──────────────────────────────────── */
  let current = null;
  function openSheet(p) {
    current = p;
    $("#s-no").textContent = `${p.no} / ${String(items.length).padStart(2, "0")} — ${T[p.type].label}`;
    const n = p.type === "paper" ? 1 : 5;
    const gal = Array.from({ length: n }, (_, i) => drawing(p.id + i, `IMAGE ${String(i + 1).padStart(2, "0")}`).replace('class="ph"', `class="ph${i % 3 === 0 ? " wide" : ""}"`)).join("");
    $("#sheet-body").innerHTML = `
      <h1>${esc(p.title)}</h1>
      <h2>${esc(p.venue)}</h2>
      <div class="facts">
        <div><span class="mono">Year</span>${Math.floor(p.year)}</div>
        <div><span class="mono">Type</span>${esc(T[p.type].label)}</div>
        <div><span class="mono">Role</span>${esc(p.role)}</div>
        <div><span class="mono">${p.type === "paper" ? "Venue" : "Medium"}</span>${esc(p.type === "paper" ? p.venue : p.material || "—")}</div>
      </div>
      <p class="desc">${esc(p.summary)}${p.type !== "paper" ? `<br><span style="color:var(--mid)">${esc(p.venue)}</span>` : ""}</p>
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

  /* ── routing ────────────────────────────────────────── */
  let lastView = "#/";
  function go(h) { location.hash = h; }
  function route() {
    const h = location.hash || "#/";
    const pm = h.match(/^#\/p\/(.+)$/);
    if (pm) {
      const p = items.find(x => x.id === pm[1]);
      if (p) return openSheet(p);
    }
    closeSheet();
    const views = { "#/search": "search", "#/material": "material", "#/conferences": "talks", "#/talks": "talks", "#/publications": "publications", "#/research": "publications", "#/hello": "about", "#/about": "about" };
    const view = views[h] || "home";
    const changed = lastView !== h || document.body.dataset.view !== view;
    lastView = h;
    document.body.dataset.view = view;
    $$(".view").forEach(v => (v.hidden = v.id !== `view-${view}`));
    $$("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === view));
    if (changed) window.scrollTo(0, 0);
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
