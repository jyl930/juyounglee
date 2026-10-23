/*
 * Intro — the research sequence, in three stages that are also doors.
 *
 *   01 Material & Ideation   soft particles (non-digital): material samples
 *                            that pool, scatter into grains, or pull into
 *                            fibres; loose ideas drift between them.
 *   02 Presentations/Awards  crossing into the digital, particles become
 *                            pixels and move only on a grid, through a
 *                            narrowing network whose nodes are the talks.
 *   03 Publications          pixels land on stacked floor plates — one plate
 *                            per paper — and build up a space.
 *
 * Hover a stage to read it, hover an item to see what it is, click to go.
 * Soft particles are drawn on a "goo" canvas (blur + alpha threshold) so they
 * merge like liquid; everything digital is drawn crisp on a second canvas.
 */
(() => {
  const root = document.getElementById("intro");
  if (!root) return;
  const gcv = root.querySelector("canvas.goo"), fcv = root.querySelector("canvas.fine");
  const g = gcv.getContext("2d"), f = fcv.getContext("2d");
  const tipEl = document.getElementById("intro-tip"), linksEl = document.getElementById("stage-links");
  const SITE = window.SITE, STAGES = SITE.stages;
  const PROJ = window.PROJECTS || [], IDEAS = window.IDEAS || [];
  const TALKS = (window.TALKS || []).slice().sort((a, b) => a.year - b.year);
  const MATS = PROJ.filter(p => p.type === "material");
  const PAPERS = PROJ.filter(p => p.type === "paper").sort((a, b) => a.year - b.year);
  const INK = "#111", DIM = "#c9c9c9", LINE = "#d4d4d4", MID = "#8c8c8c", ACCENT = "#ff4a1c";
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s = "") => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // timeline (seconds): each stage arrives in turn, then particles keep flowing
  const T1 = 0, T2 = 1.8, T3 = 3.4, T_FLOW = 2.4;
  const ZONES = [[0, 0.36], [0.36, 0.66], [0.66, 1]];

  let seed = 5;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = v => (v = clamp(v), v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
  const prog = (t, start, dur) => ease((t - start) / dur);
  const lerp = (a, b, k) => a + (b - a) * k;

  /* ── frame: u runs along the sequence (0 → 1), v across it (−0.5 … 0.5) ── */
  let W, H, portrait, sc;
  const map = (u, v) => portrait ? [W * (0.5 + v * 0.92), H * (0.07 + u * 0.86)] : [W * (0.03 + u * 0.94), H * (0.5 + v * 0.8)];
  const unmap = (x, y) => portrait ? (y / H - 0.07) / 0.86 : (x / W - 0.03) / 0.94;

  /* ── 01: material clusters + drifting ideas ── */
  const KINDS = ["pool", "grain", "fiber"];
  let clusters = [], ideas = [];
  function buildMaterial() {
    const K = Math.max(3, MATS.length);
    clusters = Array.from({ length: K }, (_, k) => {
      const kind = KINDS[k % 3], n = { pool: 46, grain: 30, fiber: 42 }[kind];
      const c = { k, kind, item: MATS[k] || null, u: 0.1 + (k % 2 ? 0.14 : 0.02) + rnd() * 0.04, v: -0.3 + (k + 0.5) * (0.6 / K), rot: rnd() * Math.PI, parts: [] };
      for (let i = 0; i < n; i++) c.parts.push({
        a: rnd() * Math.PI * 2, w: (rnd() < 0.5 ? -1 : 1) * (0.15 + rnd() * 0.45),
        rr: kind === "pool" ? Math.sqrt(rnd()) * 34 : kind === "grain" ? 14 + rnd() * 54 : 0.6 + rnd() * 0.4,
        ph: rnd() * 7, dx: 0, dy: 0
      });
      return c;
    });
    ideas = IDEAS.map((item, i) => ({ item, ph: rnd() * 10, sp: 0.05 + rnd() * 0.05, i }));
  }
  function clusterCenter(c) { return map(c.u, c.v); }
  function particlePos(c, p, t) {
    const [cx, cy] = clusterCenter(c), a = p.a + p.w * t;
    let x, y;
    if (c.kind === "fiber") {
      const rx = 96 * sc * p.rr, ry = 11 * sc, ca = Math.cos(c.rot), sa = Math.sin(c.rot);
      const ex = Math.cos(a) * rx, ey = Math.sin(a) * ry;
      x = cx + ex * ca - ey * sa; y = cy + ex * sa + ey * ca;
    } else {
      const r = p.rr * sc * (1 + 0.18 * Math.sin(t * 1.1 + p.ph));
      x = cx + Math.cos(a) * r; y = cy + Math.sin(a) * r;
      if (c.kind === "grain" && !still) { x += Math.sin(t * 6 + p.ph) * 0.8; y += Math.cos(t * 5 + p.ph) * 0.8; }
    }
    return [x + p.dx, y + p.dy];
  }
  function ideaPos(d, t) {
    const s = still ? 0 : t;
    return map(0.05 + 0.27 * (0.5 + 0.5 * Math.sin(s * d.sp + d.ph)), -0.38 + 0.76 * (0.5 + 0.5 * Math.sin(s * d.sp * 1.7 + d.ph * 2.3)));
  }

  /* ── 02: the narrowing network; its nodes are the talks ── */
  let nodes = [], edges = [], routes = [];
  function buildNetwork() {
    const T = Math.max(3, TALKS.length);
    const nB = Math.max(1, Math.round((T - 1) / 3)), nA = T - 1 - nB;
    const col = (n, u, spread) => Array.from({ length: n }, (_, i) => ({ u, v: n === 1 ? 0 : -spread + (2 * spread * i) / (n - 1) }));
    const A = col(nA, 0.43, 0.3), B = col(nB, 0.52, 0.15), C = col(1, 0.6, 0);
    nodes = [...A, ...B, ...C].map((n, i) => ({ ...n, item: TALKS[i] || null, col: i < nA ? 0 : i < nA + nB ? 1 : 2 }));
    const elbow = (p, q) => { const mu = (p.u + q.u) / 2; return [[p.u, p.v], [mu, p.v], [mu, q.v], [q.u, q.v]]; };
    edges = [];
    A.forEach((a, i) => edges.push(elbow(a, B[nB === 1 ? 0 : Math.round((i * (nB - 1)) / Math.max(1, nA - 1))])));
    B.forEach(b => edges.push(elbow(b, C[0])));
    A.forEach(a => edges.push([[0.37, a.v], [a.u, a.v]]));
    edges.push([[C[0].u, 0], [0.675, 0]]);
    // one route per A node: A → B → C → exit, in flow coords
    routes = A.map((a, i) => {
      const b = B[nB === 1 ? 0 : Math.round((i * (nB - 1)) / Math.max(1, nA - 1))];
      return [...elbow(a, b), ...elbow(b, C[0]).slice(1), [0.675, 0]];
    });
  }

  /* ── 03: floor plates, one per paper ── */
  let plates = [], pl = {};
  const GX = 9, GZ = 5;
  function buildPlates() {
    const P = Math.max(3, PAPERS.length);
    plates = Array.from({ length: P }, (_, k) => ({ k, item: PAPERS[k] || null, cells: new Uint8Array(GX * GZ) }));
    if (still) plates.forEach(p => p.cells.forEach((_, i) => (p.cells[i] = rnd() < 0.45 ? 1 : 0)));
  }
  function plateGeometry() {
    const P = plates.length;
    const [ax, ay] = map(ZONES[2][0], -0.5), [bx, by] = map(ZONES[2][1], 0.5);
    const bw = Math.abs(bx - ax), bh = Math.abs(by - ay);
    const span = Math.min((bw * 0.6) / 0.866, (bh * 0.8) / (0.5 + 0.36 * (P - 1)));
    pl = { c: map(0.835, 0), pw: span * 0.58, pd: span * 0.42, gap: span * 0.36 };
  }
  function platePt(k, a, b, lift = 0) {
    const { c, pw, pd, gap } = pl, P = plates.length;
    const oy = ((P - 1) / 2 - k) * gap - lift;
    return [c[0] + 0.866 * (a * pw - b * pd), c[1] + oy + 0.5 * (a * pw + b * pd)];
  }
  const plateOutline = (k, lift) => [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]].map(([a, b]) => platePt(k, a, b, lift));
  function inPoly(x, y, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }

  /* ── flowing particles ── */
  let flow = [], nextSpawn = 0;
  function spawn(t) {
    const c = clusters[Math.floor(rnd() * clusters.length)], p = c.parts[Math.floor(rnd() * c.parts.length)];
    const r = Math.floor(rnd() * routes.length), route = routes[r].map(([u, v]) => map(u, v));
    const start = particlePos(c, p, t), a = route[0];
    const mid = [(start[0] + a[0]) / 2 + (rnd() - 0.5) * 120 * sc, (start[1] + a[1]) / 2 + (rnd() - 0.5) * 120 * sc];
    const plate = Math.floor(rnd() * plates.length), cell = Math.floor(rnd() * GX * GZ);
    flow.push({ born: t, start, mid, route, plate, cell, dur: 1.5 + rnd() * 0.8, len: pathLen(route) });
  }
  function pathLen(pts) { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; }
  function alongPath(pts, d) {
    for (let i = 1; i < pts.length; i++) {
      const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (d <= l) return [lerp(pts[i - 1][0], pts[i][0], d / l), lerp(pts[i - 1][1], pts[i][1], d / l)];
      d -= l;
    }
    return pts[pts.length - 1];
  }

  /* ── layout ── */
  function layout() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = root.clientWidth; H = root.clientHeight;
    [gcv, fcv].forEach(c => { c.width = W * dpr; c.height = H * dpr; c.style.width = W + "px"; c.style.height = H + "px"; });
    g.setTransform(dpr, 0, 0, dpr, 0, 0); f.setTransform(dpr, 0, 0, dpr, 0, 0);
    portrait = W / H < 0.9;
    sc = Math.max(0.6, Math.min(1.2, Math.min(W, H * 1.4) / 900));
    plateGeometry();
    flow = [];
    // stage links sit at the head of each zone
    const counts = [MATS.length + IDEAS.length, TALKS.length, PAPERS.length];
    linksEl.innerHTML = STAGES.map((s, i) => `<a href="${s.route}" data-zone="${i}"><span><b>${s.no}</b>${esc(s.label)}<i>${counts[i]}</i></span><small>${esc(s.ko)}</small></a>`).join("");
    [...linksEl.children].forEach((a, i) => {
      const [x, y] = map(ZONES[i][0], 0);
      if (portrait) { a.style.left = "16px"; a.style.top = (i ? y + 8 : 10) + "px"; }
      else { a.style.left = (i ? x + 16 : 24) + "px"; a.style.top = "22px"; }
      a.addEventListener("pointerenter", () => (hoverZone = i));
    });
  }

  /* ── state ── */
  let t0 = performance.now(), t = 0, last = 0, visible = true, mouse = null, hoverZone = -1, hit = null;

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    t = still ? 30 : (now - t0) / 1000;
    const dt = Math.min(0.05, t - last); last = t;
    if (!still && t > T_FLOW) {
      const rate = 0.36 - 0.24 * clamp((t - T_FLOW) / 4);
      while (nextSpawn < t) { spawn(t); nextSpawn = Math.max(nextSpawn, t - 1) + rate; }
    }
    draw(dt);
  }

  const dot = (ctx, x, y, r) => { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2); };

  function draw(dt) {
    g.clearRect(0, 0, W, H); f.clearRect(0, 0, W, H);
    const hz = hoverZone, on = i => hz < 0 || hz === i;
    [...linksEl.children].forEach((a, i) => a.classList.toggle("on", hz === i));

    // zone boundaries: non-digital | digital | space
    f.save(); f.strokeStyle = LINE; f.setLineDash([2, 5]); f.lineWidth = 1;
    f.font = '9px "IBM Plex Mono", ui-monospace, monospace'; f.fillStyle = DIM; f.textAlign = "center";
    [[ZONES[1][0], "NON-DIGITAL  |  DIGITAL"], [ZONES[2][0], "DIGITAL  |  SPACE"]].forEach(([u, label], i) => {
      const k = prog(t, [T2, T3][i] - 0.4, 0.8);
      if (k <= 0) return;
      f.globalAlpha = k;
      const [x0, y0] = map(u, -0.46), [x1, y1] = map(u, 0.46);
      f.beginPath(); f.moveTo(x0, y0); f.lineTo(lerp(x0, x1, k), lerp(y0, y1, k)); f.stroke();
      if (portrait) { f.textAlign = "right"; f.fillText(label, W - 16, y1 - 6); f.textAlign = "center"; }
      else f.fillText(label, x1, y1 + 16);
    });
    f.restore(); f.globalAlpha = 1;

    /* 01 — material */
    const k1 = prog(t, T1, 1.6);
    const push = (p, x, y) => {
      let tx = 0, ty = 0;
      if (mouse && hz === 0) {
        const ex = x - p.dx - mouse[0], ey = y - p.dy - mouse[1], d = Math.hypot(ex, ey), R = 90 * sc;
        if (d < R && d > 0) { const m = Math.pow(1 - d / R, 2) * 34 * sc; tx = (ex / d) * m - (ey / d) * m * 0.6; ty = (ey / d) * m + (ex / d) * m * 0.6; }
      }
      p.dx += (tx - p.dx) * Math.min(1, dt * 6); p.dy += (ty - p.dy) * Math.min(1, dt * 6);
    };
    clusters.forEach(c => {
      const hot = hit && hit.cluster === c;
      g.fillStyle = on(0) ? INK : DIM; g.beginPath();
      c.parts.forEach((p, i) => {
        const [x, y] = particlePos(c, p, t);
        push(p, x, y);
        const born = clamp(k1 * 1.6 - (i / c.parts.length) * 0.6);
        dot(g, x, y, ({ pool: 4.4, grain: 3.6, fiber: 4 }[c.kind] + (hot ? 0.6 : 0)) * born);
      });
      g.fill();
    });
    g.fillStyle = on(0) ? INK : DIM; g.beginPath();
    ideas.forEach(d => { const [x, y] = ideaPos(d, t); dot(g, x, y, 3.8 * k1); });
    g.fill();
    // ideas carry a thin ring, so they read as loose thoughts, not matter
    f.strokeStyle = on(0) ? MID : DIM; f.lineWidth = 0.75;
    ideas.forEach(d => { const [x, y] = ideaPos(d, t); f.globalAlpha = k1; f.beginPath(); f.arc(x, y, 9, 0, Math.PI * 2); f.stroke(); });
    f.globalAlpha = 1;

    /* 02 — network */
    const k2 = prog(t, T2, 1.4);
    if (k2 > 0) {
      f.lineWidth = 1; f.strokeStyle = on(1) ? "#b8b8b8" : "#e2e2e2";
      edges.forEach(e => {
        const pts = e.map(([u, v]) => map(u, v)), L = pathLen(pts) * k2;
        f.beginPath(); f.moveTo(pts[0][0], pts[0][1]);
        let left = L;
        for (let i = 1; i < pts.length && left > 0; i++) {
          const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), q = Math.min(1, left / l);
          f.lineTo(lerp(pts[i - 1][0], pts[i][0], q), lerp(pts[i - 1][1], pts[i][1], q)); left -= l;
        }
        f.stroke();
      });
      nodes.forEach((n, i) => {
        const kn = prog(t, T2 + 0.3 + n.col * 0.35 + i * 0.03, 0.5);
        if (kn <= 0) return;
        const [x, y] = map(n.u, n.v), hot = hit && hit.node === n, s = (hot ? 9 : 6) * kn;
        const kind = n.item ? n.item.kind : "Presentation";
        f.strokeStyle = hot ? ACCENT : on(1) ? INK : DIM; f.fillStyle = f.strokeStyle; f.lineWidth = 1;
        f.beginPath();
        if (kind === "Conference") { f.moveTo(x, y - s * 0.7); f.lineTo(x + s * 0.7, y); f.lineTo(x, y + s * 0.7); f.lineTo(x - s * 0.7, y); f.closePath(); }
        else f.rect(x - s / 2, y - s / 2, s, s);
        f.fillStyle = "#fff"; f.fill(); f.stroke();
        if (kind === "Award") { f.fillStyle = f.strokeStyle; f.fillRect(x - s / 2, y - s / 2, s, s); }
        if (n.item && on(1) && hz === 1) { f.font = '9px "IBM Plex Mono", ui-monospace, monospace'; f.fillStyle = MID; f.textAlign = "left"; f.fillText(String(Math.floor(n.item.year)), x + 8, y - 8); }
      });
    }

    /* 03 — plates */
    const P = plates.length;
    plates.forEach((p, k) => {
      const kp = prog(t, T3 + k * 0.35, 0.9);
      if (kp <= 0) return;
      const hot = hit && hit.plate === p, lift = (1 - kp) * 24 + (hot ? 6 : 0);
      const poly = plateOutline(k, lift);
      f.globalAlpha = kp;
      f.fillStyle = hot ? "#f1f1ee" : "#fafaf8"; f.strokeStyle = hot ? INK : on(2) ? "#444" : DIM; f.lineWidth = 1;
      f.beginPath(); poly.forEach(([x, y], i) => (i ? f.lineTo(x, y) : f.moveTo(x, y))); f.closePath(); f.fill(); f.stroke();
      // slab thickness on the two front edges
      f.beginPath(); f.moveTo(poly[3][0], poly[3][1]); f.lineTo(poly[3][0], poly[3][1] + 3); f.lineTo(poly[2][0], poly[2][1] + 3); f.lineTo(poly[1][0], poly[1][1] + 3); f.lineTo(poly[1][0], poly[1][1]); f.stroke();
      // landed pixels
      f.fillStyle = hot ? ACCENT : on(2) ? INK : DIM; f.beginPath();
      p.cells.forEach((v, i) => {
        if (!v) return;
        const [x, y] = platePt(k, ((i % GX) + 0.5) / GX - 0.5, (Math.floor(i / GX) + 0.5) / GZ - 0.5, lift);
        dot(f, x, y, 1.7);
      });
      f.fill(); f.globalAlpha = 1;
    });
    // the frame that makes the plates a space: corner columns and a core
    const kc = prog(t, T3 + P * 0.35, 0.8);
    if (kc > 0) {
      f.strokeStyle = on(2) ? "#bdbdbd" : "#e6e6e6"; f.lineWidth = 0.75; f.globalAlpha = kc;
      [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]].forEach(([a, b]) => {
        const [x0, y0] = platePt(0, a, b), [x1, y1] = platePt(P - 1, a, b, 0);
        f.beginPath(); f.moveTo(x0, y0); f.lineTo(x1, y1); f.stroke();
      });
      f.strokeStyle = ACCENT; f.setLineDash([3, 4]); f.globalAlpha = kc * 0.6;
      const [cx0, cy0] = platePt(0, 0, 0), [cx1, cy1] = platePt(P - 1, 0, 0);
      f.beginPath(); f.moveTo(cx0, cy0 + 18); f.lineTo(cx1, cy1 - 18); f.stroke();
      f.setLineDash([]); f.globalAlpha = 1;
    }

    /* flow: soft drop → pixel on the grid → landed on a plate */
    const DIGITAL = portrait ? map(ZONES[1][0], 0)[1] : map(ZONES[1][0], 0)[0];
    const speed = 150 * sc;
    g.fillStyle = INK; g.beginPath(); f.fillStyle = INK; f.beginPath();
    flow = flow.filter(q => {
      const age = t - q.born;
      let x, y, digital;
      if (age < q.dur) {
        const s = ease(age / q.dur);
        x = (1 - s) * (1 - s) * q.start[0] + 2 * (1 - s) * s * q.mid[0] + s * s * q.route[0][0];
        y = (1 - s) * (1 - s) * q.start[1] + 2 * (1 - s) * s * q.mid[1] + s * s * q.route[0][1];
        digital = (portrait ? y : x) > DIGITAL;
      } else {
        const d = (age - q.dur) * speed;
        if (d < q.len) { [x, y] = alongPath(q.route, d); digital = true; }
        else {
          const k = clamp((d - q.len) / (110 * sc)), end = q.route[q.route.length - 1];
          const ci = q.cell, [tx, ty] = platePt(q.plate, ((ci % GX) + 0.5) / GX - 0.5, (Math.floor(ci / GX) + 0.5) / GZ - 0.5);
          x = lerp(end[0], tx, ease(k)); y = lerp(end[1], ty, ease(k)) - Math.sin(Math.PI * k) * 26 * sc;
          if (k >= 1) { land(q); return false; }
          f.rect(x - 1.8, y - 1.8, 3.6, 3.6);
          return true;
        }
      }
      if (digital) {
        // snap to a 6px grid: the digital side only knows whole steps
        const sx = Math.round(x / 6) * 6, sy = Math.round(y / 6) * 6;
        f.rect(sx - 2, sy - 2, 4, 4);
      } else dot(g, x, y, 3.8);
      return true;
    });
    g.fill(); f.fill();

    // hovered item / stage tooltip
    if (mouse && hz >= 0) {
      const s = STAGES[hz];
      let html = `<span>${s.no} — ${esc(s.label)}</span><b>${esc(s.ko)}</b><span>Enter →</span>`;
      if (hit && hit.title) html = `<span>${esc(hit.kicker)}</span><b>${esc(hit.title)}</b><span>${esc(hit.sub)}</span>`;
      tipEl.innerHTML = html;
      tipEl.style.left = Math.min(mouse[0] + 16, W - 270) + "px";
      tipEl.style.top = Math.min(mouse[1] + 16, H - 80) + "px";
      tipEl.classList.add("on");
    } else tipEl.classList.remove("on");
  }

  function land(q) {
    const p = plates[q.plate];
    p.cells[q.cell] = 1;
    let lit = 0; p.cells.forEach(v => (lit += v));
    if (lit > p.cells.length * 0.8) for (let i = 0; i < 8; i++) p.cells[Math.floor(rnd() * p.cells.length)] = 0;
  }

  /* ── hit testing ── */
  function findHit(x, y) {
    if (hoverZone === 0) {
      for (const d of ideas) { const [ix, iy] = ideaPos(d, t); if (Math.hypot(ix - x, iy - y) < 14) return { idea: d, route: "#/material", kicker: `Ideation · ${d.item.year}`, title: d.item.title, sub: d.item.titleKo }; }
      let best = null, bd = 80 * sc;
      clusters.forEach(c => { const [cx, cy] = clusterCenter(c), dd = Math.hypot(cx - x, cy - y); if (dd < bd) { bd = dd; best = c; } });
      if (best) return best.item
        ? { cluster: best, route: `#/p/${best.item.id}`, kicker: `Material · ${Math.floor(best.item.year)}`, title: best.item.title, sub: best.item.titleKo }
        : { cluster: best, route: "#/material" };
    }
    if (hoverZone === 1) {
      for (const n of nodes) { const [nx, ny] = map(n.u, n.v); if (Math.abs(nx - x) < 14 && Math.abs(ny - y) < 14 && n.item) return { node: n, route: "#/talks", kicker: `${n.item.kind} · ${Math.floor(n.item.year)}`, title: n.item.title, sub: n.item.venue }; }
    }
    if (hoverZone === 2) {
      for (let k = plates.length - 1; k >= 0; k--) {
        if (inPoly(x, y, plateOutline(k, 0))) {
          const p = plates[k];
          return p.item ? { plate: p, route: `#/p/${p.item.id}`, kicker: `Publication · ${Math.floor(p.item.year)}`, title: p.item.title, sub: p.item.venue } : { plate: p, route: "#/publications" };
        }
      }
    }
    return null;
  }

  /* ── interaction ── */
  const toIndex = () => document.getElementById("index-body").scrollIntoView({ behavior: still ? "auto" : "smooth" });
  root.addEventListener("pointermove", e => {
    const r = fcv.getBoundingClientRect();
    mouse = [e.clientX - r.left, e.clientY - r.top];
    const u = unmap(mouse[0], mouse[1]);
    hoverZone = ZONES.findIndex(([a, b]) => u >= a && u < b);
    if (u < 0) hoverZone = 0; if (u >= 1) hoverZone = 2;
    hit = findHit(mouse[0], mouse[1]);
    root.classList.add("over");
  });
  root.addEventListener("pointerleave", () => { mouse = null; hoverZone = -1; hit = null; root.classList.remove("over"); });
  fcv.addEventListener("click", () => {
    if (hoverZone < 0) return;
    location.hash = (hit && hit.route) || STAGES[hoverZone].route;
  });
  root.querySelector("[data-replay]").addEventListener("click", () => {
    t0 = performance.now(); last = 0; nextSpawn = 0; flow = [];
    plates.forEach(p => p.cells.fill(0));
  });
  root.querySelector("[data-down]").addEventListener("click", toIndex);

  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(root);
  let rz;
  window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { layout(); draw(0); }, 120); });

  buildMaterial(); buildNetwork(); buildPlates();
  layout();
  requestAnimationFrame(frame);
})();
