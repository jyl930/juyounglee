/*
 * Intro drawing — one line of particles, three states.
 *   01 Line   a dotted pen line wanders across the page
 *   02 Plan   the same particles flow, one after another, into a floor plan
 *   03 Space  the walls rise as stacked rows of particles, then the whole
 *             model keeps twisting and springing back while particles travel it
 * Particles sit on a "goo" canvas (blur + alpha threshold), so dots that pass
 * close to each other merge like liquid and separate again. Thin marks —
 * dimensions, the pen tip, the walker — live on a second, crisp canvas.
 */
(() => {
  const root = document.getElementById("intro");
  if (!root) return;
  const gcv = root.querySelector("canvas.goo"), fcv = root.querySelector("canvas.fine");
  const g = gcv.getContext("2d"), f = fcv.getContext("2d");
  const steps = [...root.querySelectorAll("[data-step]")];
  const INK = "#111", MID = "#8c8c8c", ACCENT = "#ff4a1c";
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // timeline (seconds)
  const T_PLAN = 3.2, T_SPACE = 6.6, END = 9.8;
  let LEVELS = 4;            // rows of particles up a wall (3 on small drawings)
  const WALL = 0.26;         // wall height, plan units (longest side = 2)
  const MM = 12000;          // plan unit → millimetres, for the dimension marks
  let GAP = 13;              // particle spacing on screen, px (wider on small drawings)

  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = v => (v = clamp(v), v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
  const prog = (t, start, dur) => ease((t - start) / dur);
  const lerp = (a, b, k) => a + (b - a) * k;

  /* ── the plan: a loop traced around a random spanning tree of unequal bays,
        so it reads as rooms and walls with thickness ── */
  function makePlan(cols, rows) {
    const id = (x, y) => y * cols + x, key = (a, b) => (a < b ? a + "," + b : b + "," + a);
    const link = new Set(), seen = new Set([0]), stack = [[0, 0]];
    while (stack.length) {
      const [x, y] = stack[stack.length - 1];
      const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [x + dx, y + dy])
        .filter(([a, b]) => a >= 0 && b >= 0 && a < cols && b < rows && !seen.has(id(a, b)));
      if (!nb.length) { stack.pop(); continue; }
      const [a, b] = nb[Math.floor(rnd() * nb.length)];
      seen.add(id(a, b)); link.add(key(id(x, y), id(a, b)));
      stack.push([a, b]);
    }
    const linked = (x1, y1, x2, y2) => x2 >= 0 && y2 >= 0 && x2 < cols && y2 < rows && link.has(key(id(x1, y1), id(x2, y2)));
    const axis = n => {
      const pos = [0], wall = 0.14;
      for (let i = 0; i < n; i++) { pos.push(pos[pos.length - 1] + 0.75 + rnd() * 0.9); if (i < n - 1) pos.push(pos[pos.length - 1] + wall); }
      return pos;
    };
    const X = axis(cols), Y = axis(rows);
    const right = (x, y) => {
      const cx = x >> 1, cy = y >> 1;
      return x % 2 === 0 ? !linked(cx, cy, cx, y % 2 ? cy + 1 : cy - 1) : linked(cx, cy, cx + 1, cy);
    };
    const down = (x, y) => {
      const cx = x >> 1, cy = y >> 1;
      return y % 2 === 0 ? !linked(cx, cy, x % 2 ? cx + 1 : cx - 1, cy) : linked(cx, cy, cx, cy + 1);
    };
    const loop = [[0, 0]];
    let prev = [-1, -1], cur = [0, 0];
    for (let guard = 0; guard < cols * rows * 4; guard++) {
      const [x, y] = cur, opts = [];
      if (x + 1 < cols * 2 && right(x, y)) opts.push([x + 1, y]);
      if (x > 0 && right(x - 1, y)) opts.push([x - 1, y]);
      if (y + 1 < rows * 2 && down(x, y)) opts.push([x, y + 1]);
      if (y > 0 && down(x, y - 1)) opts.push([x, y - 1]);
      const next = opts.find(p => p[0] !== prev[0] || p[1] !== prev[1]);
      if (!next || (next[0] === 0 && next[1] === 0)) break;
      loop.push(next); prev = cur; cur = next;
    }
    const w = X[X.length - 1], d = Y[Y.length - 1], k = 2 / Math.max(w, d);
    const pts = loop.map(([x, y]) => [(X[x] - w / 2) * k, (Y[y] - d / 2) * k]);
    return pts.filter((p, i) => {
      const a = pts[(i - 1 + pts.length) % pts.length], b = pts[(i + 1) % pts.length];
      return Math.abs((p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0])) > 1e-9;
    });
  }

  /* ── the free line ── */
  function catmull(pts, steps) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      for (let s = 0; s < steps; s++) {
        const t = s / steps, t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map(j => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }
  function resample(path, n) {
    const acc = [0];
    for (let i = 1; i < path.length; i++) acc.push(acc[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
    const total = acc[acc.length - 1], out = [];
    for (let k = 0, j = 1; k < n; k++) {
      const s = (k / (n - 1)) * total;
      while (j < acc.length - 1 && acc[j] < s) j++;
      const q = (s - acc[j - 1]) / (acc[j] - acc[j - 1] || 1);
      out.push([lerp(path[j - 1][0], path[j][0], q), lerp(path[j - 1][1], path[j][1], q)]);
    }
    return { pts: out, length: total };
  }

  /* ── model ── */
  let plan, ctrl, perim, cum, parts, freeLen, dims;
  function newPlan(portrait) {
    plan = portrait ? makePlan(3, 4) : makePlan(7, 4);
    ctrl = [[portrait ? rnd() - 0.5 : -1.6, portrait ? -1.6 : rnd() - 0.5]];
    for (let i = 0; i < 22; i++) ctrl.push([(rnd() - 0.5) * (portrait ? 1.8 : 2.9), (rnd() - 0.5) * (portrait ? 2.9 : 1.8)]);
    const closed = plan.concat([plan[0]]);
    cum = [0];
    for (let i = 1; i < closed.length; i++) cum.push(cum[i - 1] + Math.hypot(closed[i][0] - closed[i - 1][0], closed[i][1] - closed[i - 1][1]));
    perim = cum[cum.length - 1];
    dims = plan.map((a, i) => {
      const b = closed[i + 1], len = cum[i + 1] - cum[i];
      return { x: (a[0] + b[0]) / 2, z: (a[1] + b[1]) / 2, text: String(Math.round((len * MM) / 100) * 100), show: len > 0.28 };
    });
  }
  // particles along the loop at ~GAP px; corners are kept exact and drawn larger
  function sample() {
    const step = GAP / (S * 0.8), closed = plan.concat([plan[0]]), ring = [];
    for (let i = 0; i < plan.length; i++) {
      const a = closed[i], b = closed[i + 1], n = Math.max(1, Math.round((cum[i + 1] - cum[i]) / step));
      for (let k = 0; k < n; k++) ring.push({ x: lerp(a[0], b[0], k / n), z: lerp(a[1], b[1], k / n), corner: k === 0 });
    }
    const free = resample(catmull(ctrl, 30), ring.length);
    freeLen = free.length;
    ring.forEach((p, i) => { p.fx = free.pts[i][0]; p.fz = free.pts[i][1]; p.lift = 1; p.i = i; p.u = i / ring.length; });
    parts = ring;
  }

  /* ── camera: plan on the ground (x, z), y up; `twist` turns higher rows further ── */
  let W, H, S = 1, portrait;
  const TOP = { yaw: 0, pitch: Math.PI / 2 }, AXO = { yaw: -0.52, pitch: 0.6 };
  function project(x, z, y, cam) {
    const yaw = cam.yaw + cam.twist * (y / WALL - 0.35);
    const ca = Math.cos(yaw), sa = Math.sin(yaw);
    const x1 = x * ca - z * sa, z1 = x * sa + z * ca;
    return [W / 2 + x1 * S, H * 0.47 + (z1 * Math.sin(cam.pitch) - (y - WALL / 2) * Math.cos(cam.pitch)) * S];
  }
  function layout() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = root.clientWidth; H = root.clientHeight;
    [gcv, fcv].forEach(c => { c.width = W * dpr; c.height = H * dpr; c.style.width = W + "px"; c.style.height = H + "px"; });
    g.setTransform(dpr, 0, 0, dpr, 0, 0); f.setTransform(dpr, 0, 0, dpr, 0, 0);
    const p = W / H < 0.9;
    if (p !== portrait || !plan) { portrait = p; newPlan(portrait); }
    S = 1;
    const size = cam => {
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      plan.forEach(([x, z]) => [0, WALL * 2.2].forEach(y => {
        const [a, b] = project(x, z, y, { ...cam, twist: 0 });
        x0 = Math.min(x0, a); x1 = Math.max(x1, a); y0 = Math.min(y0, b); y1 = Math.max(y1, b);
      }));
      return [x1 - x0, y1 - y0];
    };
    const [tw, th] = size(TOP), [aw, ah] = size(AXO);
    S = Math.min((W * (portrait ? 0.84 : 0.58)) / Math.max(tw, aw), (H * 0.64) / Math.max(th, ah));
    LEVELS = S < 260 ? 3 : 4; GAP = S < 260 ? 17 : 13;
    sample();
  }

  /* ── state ── */
  let t0 = performance.now(), t = 0, visible = true, mouse = null, twist = 0;

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    t = still ? END + 2 : (now - t0) / 1000;
    draw();
  }

  const dot = (ctx, x, y, r) => { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2); };

  function draw() {
    g.clearRect(0, 0, W, H); f.clearRect(0, 0, W, H);
    const idle = Math.max(0, t - END);
    const pTilt = prog(t, T_SPACE, 2.0);

    // the twist: an elastic loop that lingers at rest; the cursor takes it over
    const loop = Math.sin((idle / 7.5) * Math.PI * 2), cycle = loop * loop * loop * 0.85 * clamp(idle / 1.5);
    const target = mouse && pTilt >= 1 ? (mouse[0] / W - 0.5) * 1.8 : still ? 0 : cycle;
    twist += (target - twist) * 0.06;
    const cam = {
      yaw: lerp(TOP.yaw, AXO.yaw, pTilt) + (still ? 0 : Math.sin(idle * 0.15) * 0.05),
      pitch: lerp(TOP.pitch, AXO.pitch, pTilt),
      twist: twist * pTilt
    };
    const phase = t < T_PLAN ? 0 : t < T_SPACE ? 1 : 2;
    steps.forEach((el, i) => el.classList.toggle("on", i === phase));

    const n = parts.length, drawn = prog(t, 0.2, 2.8) * n;
    g.fillStyle = INK; g.beginPath();
    let tip = null;

    for (const p of parts) {
      if (p.i > drawn) continue;
      // 01 → 02: flow from the free line to the plan, swinging out on a curve
      const k = prog(t, T_PLAN + p.u * 1.9, 1.3);
      const dx = p.x - p.fx, dz = p.z - p.fz, swing = Math.sin(Math.PI * k) * 0.18;
      let x = lerp(p.fx, p.x, k) - dz * swing, z = lerp(p.fz, p.z, k) + dx * swing;
      if (!still && k < 1) { x += Math.sin(t * 0.9 + p.i * 0.05) * 0.01; z += Math.cos(t * 0.8 + p.i * 0.04) * 0.01; }
      let [sx, sy] = project(x, z, 0, cam);
      if (mouse && k < 1) {
        const ex = sx - mouse[0], ey = sy - mouse[1], d = Math.hypot(ex, ey), R = 70;
        if (d < R && d > 0) { const push = Math.pow(1 - d / R, 2) * 26 * (1 - k); sx += (ex / d) * push; sy += (ey / d) * push; }
      }
      // particles pop in just behind the pen tip
      const born = clamp((drawn - p.i) / 8);
      dot(g, sx, sy, (p.corner && k > 0.6 ? 4.2 : 3.3) * born);
      if (drawn < n && p.i === Math.floor(drawn)) tip = [sx, sy];

      // 03: rows rise off the floor one after another; walls near the cursor rise higher
      if (pTilt > 0) {
        let hk = 1;
        if (mouse && idle > 0) { const d = Math.hypot(sx - mouse[0], sy - mouse[1]); hk += 1.2 * Math.exp(-(d * d) / (120 * 120)); }
        p.lift = still ? 1 : lerp(p.lift, hk, 0.12);
        for (let l = 1; l < LEVELS; l++) {
          const r = prog(t, T_SPACE + 0.7 + p.u * 0.9 + l * 0.22, 1.1);
          if (r <= 0) continue;
          const [ux, uy] = project(p.x, p.z, (WALL * l / (LEVELS - 1)) * r * p.lift, cam);
          dot(g, ux, uy, (p.corner ? 4 : 3.2) * Math.min(1, r * 3));
        }
      }
    }

    // travelling particles: they swell the dots they pass, like drops along a thread
    if (idle > 0 && !still) {
      const appear = clamp(idle / 1.2);
      for (let j = 0; j < 7; j++) {
        const lvl = j % 2 ? LEVELS - 1 : 0, dir = j % 2 ? -1 : 1;
        const s = ((((idle * 0.018 * dir + j / 7) % 1) + 1) % 1) * perim;
        const [x, z] = along(s);
        const [px, py] = project(x, z, (WALL * lvl) / (LEVELS - 1), cam);
        dot(g, px, py, 5 * appear);
      }
    }
    g.fill();

    // crisp layer: pen tip and its running length, plan dimensions, the walker
    f.font = '10px "IBM Plex Mono", ui-monospace, monospace';
    f.textBaseline = "middle";
    if (tip) {
      f.fillStyle = ACCENT; f.beginPath(); dot(f, tip[0], tip[1], 3); f.fill();
      f.fillStyle = MID; f.fillText(String(Math.round((drawn / n) * freeLen * MM)).replace(/\B(?=(\d{3})+(?!\d))/g, " "), tip[0] + 9, tip[1] - 9);
    }
    const pd = prog(t, T_PLAN + 1.6, 1.0) * (1 - 0.35 * prog(t, T_SPACE + 1.5, 1.0));
    if (pd > 0) {
      f.globalAlpha = pd; f.fillStyle = MID; f.textAlign = "center";
      dims.forEach(d => { if (!d.show) return; const [x, y] = project(d.x, d.z, 0, cam); f.fillText(d.text, x, y - 10); });
      f.textAlign = "start"; f.globalAlpha = 1;
    }
    const pw = prog(t, END - 0.2, 0.8);
    if (pw > 0) {
      const [x, z] = along(((idle * 0.011) % 1) * perim);
      const [px, py] = project(x, z, 0, cam);
      f.globalAlpha = pw; f.fillStyle = ACCENT; f.beginPath(); dot(f, px, py, 3.2); f.fill(); f.globalAlpha = 1;
    }
  }

  function along(s) {
    let i = 1; while (i < cum.length - 1 && cum[i] < s) i++;
    const a = plan[i - 1], b = plan[i % plan.length], q = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
    return [lerp(a[0], b[0], q), lerp(a[1], b[1], q)];
  }

  /* ── interaction ── */
  const toIndex = () => document.getElementById("index-body").scrollIntoView({ behavior: still ? "auto" : "smooth" });
  root.addEventListener("pointermove", e => {
    const r = fcv.getBoundingClientRect();
    mouse = [e.clientX - r.left, e.clientY - r.top];
  });
  root.addEventListener("pointerleave", () => (mouse = null));
  fcv.addEventListener("click", () => (t < END ? (t0 = performance.now() - END * 1000) : toIndex()));
  root.querySelector("[data-replay]").addEventListener("click", () => {
    seed = 1 + Math.floor(Math.random() * 1e6); // every replay draws a new plan
    plan = null; layout(); t0 = performance.now();
  });
  root.querySelector("[data-down]").addEventListener("click", toIndex);

  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(root);
  let rz;
  window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { layout(); draw(); }, 120); });

  layout();
  requestAnimationFrame(frame);
})();
