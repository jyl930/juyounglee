/*
 * Intro — the research sequence, in three stages that are also doors.
 *
 *   01 Material & Ideation   soft particles (non-digital): material samples
 *                            that pool, scatter into grains, or pull into
 *                            fibres; loose ideas drift between them.
 *   02 Presentations/Awards  crossing into the digital, particles become
 *                            pixels and travel a narrowing network whose
 *                            nodes are the conference talks and awards, joined by organic,
 *                            neuron-like fibres.
 *   03 Publications          pixels drift into a field of depth — soft, edgeless
 *                            clouds of points, one per paper, seen in
 *                            perspective — a sense of space rather than a model.
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
  const TALKS = PROJ.filter(p => p.type === "conference").sort((a, b) => a.year - b.year);
  const MATS = PROJ.filter(p => p.type === "material").sort((a, b) => b.year - a.year);
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
    // at most six samples in the drawing (newest first); the page lists every work
    const K = Math.max(3, Math.min(6, MATS.length)), many = K > 4;
    clusters = Array.from({ length: K }, (_, k) => {
      const kind = KINDS[k % 3], n = Math.round({ pool: 46, grain: 30, fiber: 42 }[kind] * (many ? 0.7 : 1));
      const c = { k, kind, item: MATS[k] || null, u: 0.1 + (k % 2 ? 0.14 : 0.02) + rnd() * 0.04, v: -0.33 + (k + 0.5) * (0.66 / K), rot: rnd() * Math.PI, parts: [] };
      for (let i = 0; i < n; i++) c.parts.push({
        a: rnd() * Math.PI * 2, w: (rnd() < 0.5 ? -1 : 1) * (0.15 + rnd() * 0.45),
        rr: (many ? 0.75 : 1) * (kind === "pool" ? Math.sqrt(rnd()) * 34 : kind === "grain" ? 14 + rnd() * 54 : 0.6 + rnd() * 0.4),
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

  /* ── 02: the network; its nodes are the talks — scattered in a narrowing
        envelope like cell bodies, joined by organic, slightly swaying fibres
        that thicken where they meet them. Entry fibres reach back into the
        material clusters: entry fibres → nodes → exit fibres, all curves. ── */
  let nodes = [], edges = [], entries = [], final = null;
  function addEdge(p, q, kind, from, to, o = {}) {
    const e = { p, q, kind, from, to, k1: 0.5, k2: 0.5, b1: 0, b2: 0, amp: 0, ph: rnd() * 7, pts: [], len: 1, ...o };
    edges.push(e);
    if (from) from.out.push(e);
    if (kind === "entry") entries.push(e);
    return e;
  }
  function buildNetwork() {
    const T = Math.max(3, TALKS.length);
    nodes = []; edges = []; entries = [];
    const node = (u, v, i) => ({ u, v, item: TALKS[i] || null, out: [], ph: rnd() * 7 });
    // older talks upstream and spread wide, newer ones downstream and close together
    for (let i = 0; i < T; i++) {
      const r = i / (T - 1), env = 0.3 * (1 - r) + 0.03;
      let n, tries = 0;
      do { n = node(0.41 + r * 0.21 + (rnd() - 0.5) * 0.04, i === T - 1 ? 0 : (2 * ((i * 0.618 + rnd() * 0.25) % 1) - 1) * env, i); }
      while (tries++ < 30 && nodes.some(m => Math.hypot((m.u - n.u) * 2.4, m.v - n.v) < 0.11));
      nodes.push(n);
    }
    final = nodes[T - 1];
    const organic = () => ({ k1: 0.3 + rnd() * 0.3, k2: 0.3 + rnd() * 0.3, b1: (rnd() - 0.5) * 0.07, b2: (rnd() - 0.5) * 0.07, amp: 2 + rnd() * 3 });
    const dist = (a, b) => Math.hypot((a.u - b.u) * 2.4, a.v - b.v);
    nodes.forEach((a, i) => {
      if (a === final) return;
      const down = nodes.slice(i + 1).sort((x, y) => dist(a, x) - dist(a, y));
      down.slice(0, down.length > 2 && rnd() < 0.3 ? 3 : 2).forEach(b => addEdge([a.u, a.v], [b.u, b.v], "link", a, b, organic()));
    });
    // a few side branches between neighbours: they carry nothing, they make it a tissue
    nodes.forEach((a, i) => {
      const b = nodes[i + 1 + Math.floor(rnd() * 2)];
      if (b && rnd() < 0.5 && !a.out.some(e => e.to === b)) addEdge([a.u, a.v], [b.u, b.v], "syn", null, null, { ...organic(), amp: 4 + rnd() * 4 });
    });
    // dendrites reaching back into the material clusters
    nodes.slice(0, 4).forEach(a => {
      for (let j = 0; j < 2; j++) {
        const c = clusters[Math.floor(rnd() * clusters.length)];
        addEdge([c.u + 0.04 + rnd() * 0.06, c.v + (rnd() - 0.5) * 0.12], [a.u, a.v], "entry", null, a, { ...organic(), amp: 3 + rnd() * 3 });
      }
    });
    for (let j = 0; j < 2; j++) addEdge([final.u, final.v], [0.69, (rnd() - 0.5) * 0.08], "exit", final, null, organic());
  }
  // an edge as a screen polyline: a cubic curve that may bend, plus a slow sway
  function curvePts(e, t) {
    const [pu, pv] = e.p, [qu, qv] = e.q, du = qu - pu;
    const P = map(pu, pv), C1 = map(pu + du * e.k1, pv + e.b1), C2 = map(qu - du * e.k2, qv + e.b2), Q = map(qu, qv);
    const out = [], n = 28, nx = -(Q[1] - P[1]), ny = Q[0] - P[0], nl = Math.hypot(nx, ny) || 1;
    for (let i = 0; i <= n; i++) {
      const s = i / n, a = (1 - s) ** 3, b = 3 * (1 - s) ** 2 * s, c = 3 * (1 - s) * s * s, d = s ** 3;
      const w = still ? 0 : e.amp * sc * Math.sin(Math.PI * s) * Math.sin(t * 0.7 + e.ph + s * 3);
      out.push([a * P[0] + b * C1[0] + c * C2[0] + d * Q[0] + (nx / nl) * w, a * P[1] + b * C1[1] + c * C2[1] + d * Q[1] + (ny / nl) * w]);
    }
    return out;
  }
  function pickRoute() {
    const route = [entries[Math.floor(rnd() * entries.length)]];
    let n = route[0].to;
    for (let guard = 0; n && guard < 20; guard++) {
      const outs = n.out.filter(e => e.kind !== "syn");
      if (!outs.length) break;
      const e = outs[Math.floor(rnd() * outs.length)];
      route.push(e); n = e.to;
    }
    return route;
  }

  /* ── 03: a field of depth — one soft cloud of points per paper.
        No edges, no frame: layers at different heights and offsets, seen in
        perspective with fog, slowly turning, so only the sense of space remains. ── */
  let layers = [], cam = { f: 1, D: 3, c: [0, 0] };
  const LN = 170, RX = 1.5, RZ = 1.5;
  function buildLayers() {
    const P = Math.max(3, PAPERS.length);
    layers = Array.from({ length: P }, (_, k) => {
      const pts = [];
      for (let i = 0; i < LN; i++) {
        const r = Math.sqrt(-2 * Math.log(1 - rnd() * 0.995)) * (P > 3 ? 0.3 : 0.38), a = rnd() * Math.PI * 2;
        pts.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, lit: rnd() < (still ? 0.5 : 0.1), ph: rnd() * 7 });
      }
      return { k, item: PAPERS[k] || null, pts, y: (k - (P - 1) / 2) * (P <= 3 ? 1 : 3.4 / (P - 1)), dx: (k % 2 ? 1 : -1) * (0.12 + rnd() * 0.18), box: null };
    });
  }
  function proj3(x, y, z, yaw, pitch) {
    const ca = Math.cos(yaw), sa = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const X = x * ca - z * sa, Z0 = x * sa + z * ca;
    const Y = y * cp - Z0 * sp, Z = y * sp + Z0 * cp;
    const s = cam.D / (cam.D + Z);
    return [cam.c[0] + X * s * cam.f, cam.c[1] - Y * s * cam.f, s];
  }
  const DEPTH_SIZE = 1.5;
  function layerGeometry() {
    const [ax, ay] = map(ZONES[2][0], -0.5), [bx, by] = map(ZONES[2][1], 0.5);
    const bw = Math.abs(bx - ax), bh = Math.abs(by - ay);
    cam.c = map(0.835, 0); cam.f = 1;
    let x0 = 0, x1 = 0, y0 = 0, y1 = 0;
    [0, Math.PI / 4, Math.PI / 2].forEach(yaw => layers.forEach(L => [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => {
      const [x, y] = proj3(L.dx + a * RX * 0.8, L.y, b * RZ * 0.8, yaw, 0.3);
      x0 = Math.min(x0, x - cam.c[0]); x1 = Math.max(x1, x - cam.c[0]); y0 = Math.min(y0, y - cam.c[1]); y1 = Math.max(y1, y - cam.c[1]);
    })));
    // DEPTH_SIZE > 1 lets the field spill past its zone (the bounds above are generous)
    cam.f = DEPTH_SIZE * Math.min((bw * 0.9) / (x1 - x0), (bh * 0.8) / (y1 - y0));
  }
  const layerPt = (L, p, view, t) => proj3(L.dx + p.x * RX, L.y + (still ? 0 : Math.sin(t * 0.5 + p.ph) * 0.03), p.z * RZ, view.yaw, view.pitch);

  /* ── flowing particles ── */
  let flow = [], nextSpawn = 0;
  function spawn(t) {
    const c = clusters[Math.floor(rnd() * clusters.length)], p = c.parts[Math.floor(rnd() * c.parts.length)];
    const route = pickRoute(), start = particlePos(c, p, t), a = route[0].pts[0] || map(...route[0].p);
    const mid = [(start[0] + a[0]) / 2 + (rnd() - 0.5) * 90 * sc, (start[1] + a[1]) / 2 + (rnd() - 0.5) * 90 * sc];
    const layer = Math.floor(rnd() * layers.length), pt = Math.floor(rnd() * LN);
    flow.push({ born: t, start, mid, route, layer, pt, dur: 1.1 + rnd() * 0.7, trail: [] });
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
    layerGeometry();
    flow = [];
    // stage links sit at the head of each zone
    const counts = [MATS.length, TALKS.length, PAPERS.length];
    linksEl.innerHTML = STAGES.map((s, i) => `<a href="${s.route}" data-zone="${i}"><span><b>${s.no}</b>${esc(s.label)}<i>${counts[i]}</i></span></a>`).join("");
    [...linksEl.children].forEach((a, i) => {
      const [x, y] = map(ZONES[i][0], 0);
      if (portrait) { a.style.left = "16px"; a.style.top = (i ? y + 8 : 10) + "px"; }
      else { a.style.left = (i ? x + 16 : 24) + "px"; a.style.top = "22px"; }
      a.addEventListener("pointerenter", () => (hoverZone = i));
    });
  }

  /* ── state ── */
  const view = { yaw: 0, pitch: 0.3 };
  let t0 = performance.now(), t = 0, visible = true, mouse = null, hoverZone = -1, hit = null;

  // The build-up plays at full speed; once every stage has appeared the clock
  // eases down to PACE (< 1 = slower flow, drift and sway). The cursor always responds in real time.
  const PACE = 0.55, EASE_OUT = 1.5;
  const builtAt = () => T3 + (layers.length - 1) * 0.4 + 1.2;
  function clock(real) {
    const B = builtAt(), x = real - B;
    if (x <= 0) return real;
    if (x < EASE_OUT) return B + x - ((1 - PACE) * x * x) / (2 * EASE_OUT);
    return B + EASE_OUT * (1 + PACE) / 2 + (x - EASE_OUT) * PACE;
  }
  let lastNow = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    t = still ? 30 : clock((now - t0) / 1000);
    const dt = Math.min(0.05, (now - lastNow) / 1000); lastNow = now;
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

    // no dividing lines — only two faint words where one state turns into the next
    f.font = '9px "Noto Sans", Inter, sans-serif'; f.fillStyle = DIM; f.textAlign = "center";
    [[ZONES[1][0], "NON-DIGITAL → DIGITAL"], [ZONES[2][0], "DIGITAL → SPACE"]].forEach(([u, label], i) => {
      const k = prog(t, [T2, T3][i] - 0.2, 0.8);
      if (k <= 0) return;
      f.globalAlpha = k;
      const [x1, y1] = map(u, 0.46);
      if (portrait) { f.textAlign = "right"; f.fillText(label, W - 16, y1 - 6); f.textAlign = "center"; }
      else f.fillText(label, x1, y1 + 16);
    });
    f.globalAlpha = 1;

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
    const k2 = prog(t, T2, 1.6);
    edges.forEach(e => { e.pts = curvePts(e, t); e.len = pathLen(e.pts); });
    if (k2 > 0) {
      edges.forEach(e => {
        const reveal = clamp(k2 * 1.25 - (e.kind === "exit" ? 0.25 : e.kind === "syn" ? 0.2 : 0)), pts = e.pts;
        if (reveal <= 0) return;
        f.lineWidth = 0.8;
        f.strokeStyle = e.kind === "syn" ? (on(1) ? "#d6d6d6" : "#ececec") : on(1) ? "#b0b0b0" : "#e2e2e2";
        let left = e.len * reveal;
        f.beginPath(); f.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length && left > 0; i++) {
          const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), q = Math.min(1, left / l);
          f.lineTo(lerp(pts[i - 1][0], pts[i][0], q), lerp(pts[i - 1][1], pts[i][1], q)); left -= l;
        }
        f.stroke();
        // fibres thicken where they meet a cell body (goo turns the taper into flesh)
        if (e.kind !== "syn" && reveal >= 1) {
          g.fillStyle = on(1) ? INK : DIM; g.beginPath();
          const n = pts.length - 1, m = 7;
          for (let j = 0; j < m; j++) {
            const r = lerp(2.8, 0.6, j / m);
            if (e.from) dot(g, pts[j][0], pts[j][1], r);
            if (e.to) dot(g, pts[n - j][0], pts[n - j][1], r);
          }
          g.fill();
        }
      });
      nodes.forEach((n, i) => {
        const kn = prog(t, T2 + 0.3 + (n.u - 0.4) * 4 + i * 0.02, 0.6);
        if (kn <= 0) return;
        const [x, y] = map(n.u, n.v), hot = hit && hit.node === n;
        const kind = n.item && n.item.award ? "Award" : "Presentation";
        // cell body: a soft blob with a few lobes that breathe
        const r = (kind === "Award" ? 8 : 6.5) * kn + (hot ? 1.5 : 0);
        g.fillStyle = hot ? ACCENT : on(1) ? INK : DIM; g.beginPath(); dot(g, x, y, r);
        for (let j = 0; j < 3; j++) {
          const a = n.ph + j * 2.1 + (still ? 0 : Math.sin(t * 0.8 + n.ph + j) * 0.4);
          dot(g, x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.55);
        }
        g.fill();
        // kind, as a small white mark inside: □ presentation · solid = award
        f.fillStyle = "#fff"; f.beginPath();
        if (kind === "Presentation") f.rect(x - 1.6, y - 1.6, 3.2, 3.2);
        f.fill();
        if (n.item && hz === 1) { f.font = '9px "Noto Sans", Inter, sans-serif'; f.fillStyle = MID; f.textAlign = "left"; f.fillText(String(Math.floor(n.item.year)), x + 10, y - 10); }
      });
    }

    /* 03 — depth field */
    const lookX = mouse && hz === 2 ? (mouse[0] - cam.c[0]) / W : 0, lookY = mouse && hz === 2 ? (mouse[1] - cam.c[1]) / H : 0;
    view.yaw += ((still ? 0.5 : t * 0.07) + lookX * 1.2 - view.yaw) * 0.05;
    view.pitch += (0.3 + lookY * 0.5 - view.pitch) * 0.05;
    layers.forEach((L, k) => {
      const kp = prog(t, T3 + k * 0.4, 1.2);
      if (kp <= 0) { L.box = null; return; }
      const hot = hit && hit.layer === L;
      const [cx, cy] = proj3(L.dx, L.y, 0, view.yaw, view.pitch);
      const [ex] = proj3(L.dx + RX * 0.55, L.y, 0, view.yaw, view.pitch), [, ez] = proj3(L.dx, L.y, RZ * 0.55, view.yaw, view.pitch);
      L.box = { cx, cy, rx: Math.max(30, Math.hypot(ex - cx, 0) + 20), ry: Math.max(18, Math.abs(ez - cy) + 14) };
      L.pts.forEach((p, i) => {
        const appear = clamp(kp * 1.5 - (i / LN) * 0.5);
        if (appear <= 0) return;
        const [x, y, sd] = layerPt(L, p, view, t);
        const fog = clamp((sd - 0.7) / 0.55);           // farther = fainter
        f.globalAlpha = appear * (0.15 + 0.85 * fog);
        f.fillStyle = p.lit ? (hot ? ACCENT : on(2) ? INK : DIM) : hot ? "#9a9a9a" : "#cfcfcf";
        f.beginPath(); dot(f, x, y, (p.lit ? 2.4 : 1.3) * sd); f.fill();
      });
    });
    f.globalAlpha = 1;

    /* flow: soft drop → crossing into the digital it becomes a pixel → a point in the depth field */
    const DIGITAL = portrait ? map(ZONES[1][0], 0)[1] : map(ZONES[1][0], 0)[0];
    const speed = 150 * sc, trails = [];
    g.fillStyle = INK; g.beginPath(); f.fillStyle = INK; f.beginPath();
    flow = flow.filter(q => {
      const age = t - q.born;
      let x, y;
      if (age < q.dur) {
        const s = ease(age / q.dur), a = q.route[0].pts[0];
        x = (1 - s) * (1 - s) * q.start[0] + 2 * (1 - s) * s * q.mid[0] + s * s * a[0];
        y = (1 - s) * (1 - s) * q.start[1] + 2 * (1 - s) * s * q.mid[1] + s * s * a[1];
      } else {
        let d = (age - q.dur) * speed, pos = null;
        for (const e of q.route) { if (d <= e.len) { pos = alongPath(e.pts, d); break; } d -= e.len; }
        if (pos) [x, y] = pos;
        else {
          const k = clamp(d / (110 * sc)), last = q.route[q.route.length - 1].pts, end = last[last.length - 1];
          const L = layers[q.layer], [tx, ty, sd] = layerPt(L, L.pts[q.pt], view, t);
          x = lerp(end[0], tx, ease(k)); y = lerp(end[1], ty, ease(k)) - Math.sin(Math.PI * k) * 20 * sc;
          if (k >= 1) { land(q); return false; }
          const r = lerp(2, 1.6 * sd, k);                 // the pixel softens into a point as it enters the depth
          if (k < 0.5) f.rect(x - r, y - r, r * 2, r * 2); else dot(f, x, y, r);
          return true;
        }
      }
      if ((portrait ? y : x) > DIGITAL) {                 // past the threshold a drop becomes a crisp pixel with a short signal trail
        f.rect(x - 2, y - 2, 4, 4);
        q.trail.push([x, y]); if (q.trail.length > 8) q.trail.shift();
        trails.push(q.trail);
      } else dot(g, x, y, 3.8);
      return true;
    });
    g.fill(); f.fill();
    f.strokeStyle = "rgba(17,17,17,.18)"; f.lineWidth = 1;
    trails.forEach(tr => { f.beginPath(); tr.forEach(([x, y], i) => (i ? f.lineTo(x, y) : f.moveTo(x, y))); f.stroke(); });

    // hovered item / stage tooltip
    if (mouse && hz >= 0) {
      const s = STAGES[hz];
      let html = `<span>${s.no}</span><b>${esc(s.label)}</b><span>Enter →</span>`;
      if (hit && hit.title) html = `<span>${esc(hit.kicker)}</span><b>${esc(hit.title)}</b><span>${esc(hit.sub)}</span>`;
      tipEl.innerHTML = html;
      tipEl.style.left = Math.min(mouse[0] + 16, W - 270) + "px";
      tipEl.style.top = Math.min(mouse[1] + 16, H - 80) + "px";
      tipEl.classList.add("on");
    } else tipEl.classList.remove("on");
  }

  function land(q) {
    const L = layers[q.layer];
    L.pts[q.pt].lit = true;
    if (L.pts.filter(p => p.lit).length > LN * 0.7) for (let i = 0; i < 12; i++) L.pts[Math.floor(rnd() * LN)].lit = false;
  }

  /* ── hit testing ── */
  function findHit(x, y) {
    if (hoverZone === 0) {
      for (const d of ideas) { const [ix, iy] = ideaPos(d, t); if (Math.hypot(ix - x, iy - y) < 14) return { idea: d, route: STAGES[0].route, kicker: `Ideation · ${d.item.year}`, title: d.item.title, sub: d.item.note }; }
      let best = null, bd = 80 * sc;
      clusters.forEach(c => { const [cx, cy] = clusterCenter(c), dd = Math.hypot(cx - x, cy - y); if (dd < bd) { bd = dd; best = c; } });
      if (best) return best.item
        ? { cluster: best, route: `#/p/${best.item.id}`, kicker: `Material · ${Math.floor(best.item.year)}`, title: best.item.title, sub: best.item.venue }
        : { cluster: best, route: STAGES[0].route };
    }
    if (hoverZone === 1) {
      for (const n of nodes) { const [nx, ny] = map(n.u, n.v); if (Math.abs(nx - x) < 14 && Math.abs(ny - y) < 14 && n.item) return { node: n, route: STAGES[1].route, kicker: `${n.item.award || "Presentation"} · ${Math.floor(n.item.year)}`, title: n.item.title, sub: n.item.venue }; }
    }
    if (hoverZone === 2) {
      let best = null, bd = 1;
      layers.forEach(L => {
        if (!L.box) return;
        const d = Math.hypot((x - L.box.cx) / L.box.rx, (y - L.box.cy) / L.box.ry);
        if (d < bd) { bd = d; best = L; }
      });
      if (best) return best.item
        ? { layer: best, route: `#/p/${best.item.id}`, kicker: `Publication · ${Math.floor(best.item.year)}`, title: best.item.title, sub: best.item.venue }
        : { layer: best, route: STAGES[2].route };
    }
    return null;
  }

  /* ── interaction ── */
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
    t0 = performance.now(); nextSpawn = 0; flow = [];
    layers.forEach(L => L.pts.forEach(p => (p.lit = rnd() < 0.1)));
  });

  // the page may open on another view, so size the drawing whenever it comes into view
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && (W !== root.clientWidth || H !== root.clientHeight)) layout();
  }).observe(root);
  let rz;
  window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { layout(); draw(0); }, 120); });

  buildMaterial(); buildNetwork(); buildLayers();
  layout();
  requestAnimationFrame(frame);
})();
