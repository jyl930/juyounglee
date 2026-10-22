/*
 * Intro drawing — one line, three states.
 *   01 Line   a single free pen line wanders across the page
 *   02 Plan   the same line snaps, point by point, into a floor plan
 *   03 Space  the camera tilts, the walls rise, and someone walks through it
 * Everything is one closed loop in one 3D frame; only the camera and the
 * point positions change. Drawn live on canvas: sharp, light, reacts to the cursor.
 */
(() => {
  const root = document.getElementById("intro");
  if (!root) return;
  const cv = root.querySelector("canvas"), ctx = cv.getContext("2d");
  const steps = [...root.querySelectorAll("[data-step]")];
  const INK = "#111", ACCENT = "#ff4a1c";
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // timeline (seconds)
  const T_PLAN = 3.4, T_SPACE = 6.8, END = 9.6;

  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = v => (v = clamp(v), v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
  const prog = (t, start, dur) => ease((t - start) / dur);
  const lerp = (a, b, k) => a + (b - a) * k;

  /* ── the plan: a random spanning tree over a grid of bays of unequal size.
        Walking around the tree gives one closed loop that reads as walls with
        thickness — rooms where bays join, thin partitions where they don't. ── */
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

    // fine grid: two nodes per bay — a wide gap inside a bay, a thin gap (the wall) between bays
    const axis = n => {
      const pos = [0], wall = 0.14;
      for (let i = 0; i < n; i++) { pos.push(pos[pos.length - 1] + 0.75 + rnd() * 0.9); if (i < n - 1) pos.push(pos[pos.length - 1] + wall); }
      return pos;
    };
    const X = axis(cols), Y = axis(rows);
    // is there a loop edge between fine node (x,y) and its right / lower neighbour?
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
    // centre on the origin, longest side = 2, keep only the corners
    const w = X[X.length - 1], d = Y[Y.length - 1], k = 2 / Math.max(w, d);
    const pts = loop.map(([x, y]) => [(X[x] - w / 2) * k, (Y[y] - d / 2) * k]);
    return pts.filter((p, i) => {
      const a = pts[(i - 1 + pts.length) % pts.length], b = pts[(i + 1) % pts.length];
      return Math.abs((p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0])) > 1e-9;
    });
  }

  /* ── the free line: a smooth random walk, resampled to match the plan ── */
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
      const f = (s - acc[j - 1]) / (acc[j] - acc[j - 1] || 1);
      out.push([lerp(path[j - 1][0], path[j][0], f), lerp(path[j - 1][1], path[j][1], f)]);
    }
    return out;
  }

  /* ── build: plan corners, plan samples (corners kept exact), matching free line ── */
  let plan, planS, freeS, perim, cum;
  function build(portrait) {
    plan = portrait ? makePlan(4, 6) : makePlan(7, 4);
    const closed = plan.concat([plan[0]]);
    cum = [0];
    for (let i = 1; i < closed.length; i++) cum.push(cum[i - 1] + Math.hypot(closed[i][0] - closed[i - 1][0], closed[i][1] - closed[i - 1][1]));
    perim = cum[cum.length - 1];
    planS = [];
    for (let i = 0; i < plan.length; i++) {
      const a = closed[i], b = closed[i + 1], n = Math.max(1, Math.round(((cum[i + 1] - cum[i]) / perim) * 1400));
      for (let k = 0; k < n; k++) planS.push([lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)]);
    }
    planS.push(plan[0]);
    const ctrl = [[portrait ? rnd() - 0.5 : -1.6, portrait ? -1.6 : rnd() - 0.5]];
    for (let i = 0; i < 24; i++) ctrl.push([(rnd() - 0.5) * (portrait ? 1.8 : 2.9), (rnd() - 0.5) * (portrait ? 2.9 : 1.8)]);
    freeS = resample(catmull(ctrl, 30), planS.length);
    plan.forEach(p => (p.h = 0));
  }

  /* ── camera: plan lies on the ground (x, z); y is up ── */
  let W, H, S, portrait;
  const TOP = { yaw: 0, pitch: Math.PI / 2 }, AXO = { yaw: -0.52, pitch: 0.6 };
  const WALL = 0.24;
  function project(x, z, y, cam) {
    const ca = Math.cos(cam.yaw), sa = Math.sin(cam.yaw);
    const x1 = x * ca - z * sa, z1 = x * sa + z * ca;
    return [W / 2 + x1 * S, H * 0.47 + (z1 * Math.sin(cam.pitch) - (y - WALL / 2) * Math.cos(cam.pitch)) * S];
  }
  function layout() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = root.clientWidth; H = root.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const p = W / H < 0.9;
    if (p !== portrait || !plan) { portrait = p; build(portrait); }
    // scale so that both the top view and the finished axonometric fit
    S = 1;
    const size = cam => {
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      plan.forEach(([x, z]) => [0, WALL * 2.4].forEach(y => {
        const [a, b] = project(x, z, y, cam);
        x0 = Math.min(x0, a); x1 = Math.max(x1, a); y0 = Math.min(y0, b); y1 = Math.max(y1, b);
      }));
      return [x1 - x0, y1 - y0];
    };
    const [tw, th] = size(TOP), [aw, ah] = size(AXO);
    S = Math.min((W * (portrait ? 0.84 : 0.6)) / Math.max(tw, aw), (H * 0.66) / Math.max(th, ah));
  }

  /* ── state ── */
  let t0 = performance.now(), t = 0, visible = true, mouse = null, yawOff = 0, yawTarget = 0;

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    t = still ? END + 4 : (now - t0) / 1000;
    draw();
  }

  const ring = pts => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); };

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const idle = Math.max(0, t - END);
    const pTilt = prog(t, T_SPACE, 2.2), pRise = prog(t, T_SPACE + 0.8, 2.0);
    yawOff += (yawTarget - yawOff) * 0.05;
    const cam = {
      yaw: lerp(TOP.yaw, AXO.yaw, pTilt) + (yawOff + (still ? 0 : Math.sin(idle * 0.18) * 0.06)) * pTilt,
      pitch: lerp(TOP.pitch, AXO.pitch, pTilt)
    };
    const phase = t < T_PLAN ? 0 : t < T_SPACE ? 1 : 2;
    steps.forEach((el, i) => el.classList.toggle("on", i === phase));

    ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = INK; ctx.lineWidth = 1;

    if (pTilt <= 0) {
      // 01 + 02: one line is drawn, then snaps point by point into the plan
      const n = planS.length, drawn = Math.max(2, Math.floor(n * prog(t, 0.2, 3.0)));
      const pts = [];
      for (let i = 0; i < drawn; i++) {
        const k = prog(t, T_PLAN + (i / n) * 1.8, 1.1);
        let x = lerp(freeS[i][0], planS[i][0], k), z = lerp(freeS[i][1], planS[i][1], k);
        if (!still) { x += Math.sin(t * 0.9 + i * 0.013) * 0.012 * (1 - k); z += Math.cos(t * 0.8 + i * 0.011) * 0.012 * (1 - k); }
        let [sx, sy] = project(x, z, 0, cam);
        if (mouse && k < 1) {
          const dx = sx - mouse[0], dy = sy - mouse[1], d = Math.hypot(dx, dy), R = 80;
          if (d < R && d > 0) { const f = Math.pow(1 - d / R, 2) * 22 * (1 - k); sx += (dx / d) * f; sy += (dy / d) * f; }
        }
        pts.push([sx, sy]);
      }
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      if (drawn < n) { // the pen tip
        const [x, y] = pts[pts.length - 1];
        ctx.fillStyle = ACCENT; ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
      }
      return;
    }

    // 03: tilt into axonometric and raise the walls — walls near the cursor rise higher
    const base = plan.map(([x, z]) => project(x, z, 0, cam));
    plan.forEach((p, i) => {
      let k = 1;
      if (mouse && idle > 0) { const d = Math.hypot(base[i][0] - mouse[0], base[i][1] - mouse[1]); k += 1.4 * Math.exp(-(d * d) / (110 * 110)); }
      p.h = still ? WALL : lerp(p.h, WALL * pRise * k, 0.15);
    });
    const top = plan.map(([x, z], i) => project(x, z, plan[i].h, cam));

    ctx.fillStyle = "#f5f5f3"; ring(base); ctx.fill("evenodd");
    ctx.globalAlpha = 0.3 + 0.7 * (1 - pRise); ring(base); ctx.stroke();
    if (pRise > 0) {
      ctx.lineWidth = 0.6; ctx.globalAlpha = 0.5;
      ctx.beginPath(); base.forEach(([x, y], i) => { ctx.moveTo(x, y); ctx.lineTo(top[i][0], top[i][1]); }); ctx.stroke();
      ctx.lineWidth = 1; ctx.globalAlpha = 1; ring(top); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // someone moving through the space, along the loop
    const pw = prog(t, END - 0.4, 0.8);
    if (pw > 0) {
      const speed = 0.012, trail = 18;
      for (let k = trail; k >= 0; k--) {
        const s = ((((idle - k * 0.08) * speed) % 1) + 1) % 1 * perim;
        let i = 1; while (i < cum.length - 1 && cum[i] < s) i++;
        const a = plan[i - 1], b = plan[i % plan.length], f = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
        const [x, y] = project(lerp(a[0], b[0], f), lerp(a[1], b[1], f), 0.01, cam);
        ctx.globalAlpha = pw * (k ? 0.45 * (1 - k / trail) : 1);
        ctx.fillStyle = ACCENT; ctx.beginPath(); ctx.arc(x, y, k ? 1.3 : 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  /* ── interaction ── */
  const toIndex = () => document.getElementById("index-body").scrollIntoView({ behavior: still ? "auto" : "smooth" });
  root.addEventListener("pointermove", e => {
    const r = cv.getBoundingClientRect();
    mouse = [e.clientX - r.left, e.clientY - r.top];
    yawTarget = (mouse[0] / W - 0.5) * 0.8;
  });
  root.addEventListener("pointerleave", () => { mouse = null; yawTarget = 0; });
  cv.addEventListener("click", () => (t < END ? (t0 = performance.now() - END * 1000) : toIndex()));
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
