/*
 * Intro drawing — uncertainty → analysis → space.
 * Tangled lines resolve into rays that meet at one point, and from that point
 * a 3D Hilbert curve fills a cube order by order until it reads as a solid.
 * Drawn live on canvas (no video): sharp at any size, reacts to the cursor.
 */
(() => {
  const root = document.getElementById("intro");
  if (!root) return;
  const cv = root.querySelector("canvas"), ctx = cv.getContext("2d");
  const LABELS = (window.SITE.intro && window.SITE.intro.labels) || ["Uncertainty", "Analysis", "Space"];
  const INK = "#111", MID = "#9a9a9a", ACCENT = "#ff4a1c";
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // timeline (seconds)
  const T_TANGLE = 0, T_RAYS = 3.2, T_AXIS = 4.4, T_CUBES = 4.9, CUBE_GAP = 0.8, CUBE_DUR = 1.5;
  const ORDERS = [1, 2, 3, 4, 5];
  const END = T_CUBES + ORDERS.length * CUBE_GAP + CUBE_DUR + 0.6;

  /* ── seeded randomness so the drawing is the same on every visit ── */
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  /* ── tangled lines, in flow coordinates: u runs toward the nodes (0 → 1),
        v runs across (−0.5 … 0.5). Layout maps them to the screen. ── */
  const N = 13;
  const tangles = Array.from({ length: N }, () => {
    const pts = [], k = 4 + Math.floor(rnd() * 3);
    const edge = rnd();
    pts.push(edge < 0.45 ? [-0.15, rnd() - 0.5] : [rnd() * 0.6, edge < 0.72 ? -0.8 : 0.8]);
    for (let i = 1; i <= k; i++) {
      const u = Math.min(0.82, (i / (k + 1)) * 0.95 + (rnd() - 0.5) * 0.45);   // sometimes doubles back → loops
      pts.push([u, (rnd() - 0.5) * 0.95]);
    }
    return { pts, phase: rnd() * Math.PI * 2, delay: rnd() * 0.9 };
  });

  /* ── 3D Hilbert curve (Skilling's transpose → axes) ── */
  function hilbert(bits) {
    const n = 3, total = 1 << (bits * n), side = 1 << bits, out = new Float32Array(total * 3);
    for (let h = 0; h < total; h++) {
      const X = [0, 0, 0];
      for (let k = 0; k < bits * n; k++) {
        const bit = (h >> (bits * n - 1 - k)) & 1;
        X[k % n] |= bit << (bits - 1 - Math.floor(k / n));
      }
      let t = X[n - 1] >> 1;
      for (let i = n - 1; i > 0; i--) X[i] ^= X[i - 1];
      X[0] ^= t;
      for (let Q = 2; Q < side; Q <<= 1) {
        const P = Q - 1;
        for (let i = n - 1; i >= 0; i--) {
          if (X[i] & Q) X[0] ^= P;
          else { t = (X[0] ^ X[i]) & P; X[0] ^= t; X[i] ^= t; }
        }
      }
      for (let d = 0; d < 3; d++) out[h * 3 + d] = (2 * X[d] + 1) / side - 1;
    }
    return out;
  }
  const curves = ORDERS.map(hilbert);
  const CORNERS = [];
  for (let i = 0; i < 8; i++) CORNERS.push([i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1]);

  /* ── layout ── */
  let W, H, L;
  function layout() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = root.clientWidth; H = root.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (W / H >= 0.9) {
      const F = [W * 0.5, H * 0.5], gap = Math.min(H * 0.03, 22);
      const a = [W * 0.575, H * 0.57], b = [W * 0.93, H * 0.36];
      const cubes = ORDERS.concat(0).map((_, i, arr) => [a[0] + (b[0] - a[0]) * i / (arr.length - 1), a[1] + (b[1] - a[1]) * i / (arr.length - 1)]);
      const spacing = Math.hypot(b[0] - a[0], b[1] - a[1]) / 5;
      L = {
        map: (u, v) => [-0.03 * W + u * 0.25 * W, H * (0.48 + v * 0.66)],
        back: [-1, 0],
        nodes: tangles.map((_, i) => [W * 0.27, F[1] + (i - (N - 1) / 2) * gap]),
        F, cubes, s: Math.min(spacing * 0.29, H * 0.075),
        labels: [[W * 0.115, H * 0.5], [(W * 0.27 + F[0]) / 2 + 10, F[1]], null]
      };
    } else {
      // portrait: lines fall from the top, cubes sit in a 3 × 2 grid below
      const F = [W * 0.5, H * 0.5], gap = Math.min(W * 0.045, 18);
      const cubes = [], rows = [H * 0.64, H * 0.8], cols = [W * 0.2, W * 0.5, W * 0.8];
      rows.forEach(y => cols.forEach(x => cubes.push([x, y])));
      L = {
        map: (u, v) => [W * (0.5 + v * 1.1), 0.01 * H + u * 0.29 * H],
        back: [0, -1],
        nodes: tangles.map((_, i) => [F[0] + (i - (N - 1) / 2) * gap, H * 0.34]),
        F, cubes, s: Math.min(W * 0.075, H * 0.04), axisTo: 1, spaceBelow: true,
        labels: [[W * 0.5, H * 0.15], [F[0], (H * 0.34 + F[1]) / 2 + 2], null]
      };
    }
  }

  /* ── helpers ── */
  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = v => (v = clamp(v), v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
  const prog = (t, start, dur) => ease((t - start) / dur);

  function catmull(pts, steps) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      for (let s = 0; s < steps; s++) {
        const t = s / steps, t2 = t * t, t3 = t2 * t;
        out.push([
          0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
        ]);
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  function label(text, x, y, alpha, color = INK) {
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = '500 11px "IBM Plex Mono", ui-monospace, monospace';
    const s = text.toUpperCase().split("").join(" "), w = ctx.measureText(s).width;
    ctx.fillStyle = "#fff"; ctx.fillRect(x - w / 2 - 8, y - 10, w + 16, 20);
    ctx.fillStyle = color; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(s, x, y + 0.5);
    ctx.restore();
  }

  /* ── state ── */
  let t0 = performance.now(), t = 0, running = true, visible = true;
  let mouse = null, yaw = 0, yawTarget = 0;

  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    if (!visible) return;
    t = still ? END + 1 : (now - t0) / 1000;
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const idle = Math.max(0, t - END);

    // 1 — tangles
    ctx.lineWidth = 1; ctx.strokeStyle = INK; ctx.lineCap = "round"; ctx.lineJoin = "round";
    tangles.forEach((c, i) => {
      const p = prog(t, T_TANGLE + c.delay, 2.6);
      if (p <= 0) return;
      const drift = still ? 0 : 0.012 * Math.min(1, idle / 3);
      const pts = c.pts.map(([u, v], j) => L.map(
        u + Math.sin(t * 0.35 + c.phase + j) * drift,
        v + Math.cos(t * 0.3 + c.phase * 1.7 + j) * drift
      ));
      const nd = L.nodes[i];
      pts.push([nd[0] + L.back[0] * 56, nd[1] + L.back[1] * 56], nd); // arrive straight
      let path = catmull(pts, 22);
      if (mouse) path = path.map(([x, y]) => {
        const dx = x - mouse[0], dy = y - mouse[1], d = Math.hypot(dx, dy), R = 90;
        if (d > R || d === 0) return [x, y];
        const f = Math.pow(1 - d / R, 2) * 26;
        return [x + (dx / d) * f, y + (dy / d) * f];
      });
      const n = Math.max(2, Math.floor(path.length * p));
      ctx.beginPath();
      ctx.moveTo(path[0][0], path[0][1]);
      for (let k = 1; k < n; k++) ctx.lineTo(path[k][0], path[k][1]);
      ctx.stroke();
    });

    // 2 — nodes and rays converging on one point
    const pr = prog(t, T_RAYS, 1.2);
    if (pr > 0) {
      ctx.fillStyle = INK;
      L.nodes.forEach(([x, y], i) => {
        const pi = prog(t, T_RAYS + i * 0.03, 1.1);
        ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.lineTo(x + (L.F[0] - x) * pi, y + (L.F[1] - y) * pi); ctx.stroke();
      });
      if (pr >= 1) { ctx.beginPath(); ctx.arc(L.F[0], L.F[1], 2.4, 0, Math.PI * 2); ctx.fill(); }
    }

    // 3 — a dashed axis threads the cubes in order
    const pa = prog(t, T_AXIS, 1.2);
    if (pa > 0) {
      const path = [L.F, ...L.cubes.slice(0, L.axisTo || L.cubes.length)];
      let len = 0; const segs = [];
      for (let i = 1; i < path.length; i++) { const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); segs.push(d); len += d; }
      let left = len * pa;
      ctx.save(); ctx.strokeStyle = ACCENT; ctx.globalAlpha = 0.45; ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(path[0][0], path[0][1]);
      for (let i = 1; i < path.length && left > 0; i++) {
        const f = Math.min(1, left / segs[i - 1]);
        ctx.lineTo(path[i - 1][0] + (path[i][0] - path[i - 1][0]) * f, path[i - 1][1] + (path[i][1] - path[i - 1][1]) * f);
        left -= segs[i - 1];
      }
      ctx.stroke(); ctx.restore();
    }

    // 4 — Hilbert cubes, order 1 → 5, then the solid
    yaw += (yawTarget - yaw) * 0.06;
    const a = Math.PI / 4 + yaw + (still ? 0 : Math.sin(t * 0.22) * 0.1 * Math.min(1, idle / 2));
    const b = Math.atan(1 / Math.SQRT2), ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
    const proj = (x, y, z, cx, cy, s) => {
      const x1 = x * ca - z * sa, z1 = x * sa + z * ca;
      return [cx + x1 * s, cy - (y * cb - z1 * sb) * s];
    };
    L.cubes.forEach(([cx, cy], i) => {
      const p = prog(t, T_CUBES + i * CUBE_GAP, CUBE_DUR);
      if (p <= 0) return;
      const s = L.s;
      if (i < curves.length) {
        const pts = curves[i], count = pts.length / 3, n = Math.max(2, Math.floor(count * p));
        ctx.lineWidth = [1, 1, 0.9, 0.75, 0.6][i];
        ctx.beginPath();
        for (let k = 0; k < n; k++) {
          const [x, y] = proj(pts[k * 3], pts[k * 3 + 1], pts[k * 3 + 2], cx, cy, s);
          k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      } else {
        // the filled volume: convex hull of the projected cube
        const P = CORNERS.map(([x, y, z]) => proj(x * 0.97, y * 0.97, z * 0.97, cx, cy, s));
        const hull = hullOf(P);
        ctx.save(); ctx.globalAlpha = p; ctx.fillStyle = INK;
        ctx.beginPath(); hull.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
      ctx.save(); ctx.globalAlpha = p; ctx.fillStyle = MID;
      ctx.font = '10px "IBM Plex Mono", ui-monospace, monospace'; ctx.textAlign = "center";
      ctx.fillText(i < curves.length ? `n=${ORDERS[i]}` : "n→∞", cx, cy + s * 1.75 + 14);
      ctx.restore();
    });
    ctx.lineWidth = 1;

    // labels sit on top of the drawing, knocked out in white
    label(LABELS[0], L.labels[0][0], L.labels[0][1], prog(t, 1.6, 0.8));
    label(LABELS[1], L.labels[1][0], L.labels[1][1], prog(t, T_RAYS + 0.8, 0.6));
    const last = L.cubes[L.cubes.length - 1];
    label(LABELS[2], last[0], L.spaceBelow ? last[1] + L.s * 1.75 + 34 : last[1] - L.s * 1.75 - 18, prog(t, END - 0.8, 0.8));
  }

  function hullOf(P) {
    // monotone chain over the 8 projected corners
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const pts = P.slice().sort((p, q) => p[0] - q[0] || p[1] - q[1]), lo = [], hi = [];
    for (const p of pts) { while (lo.length > 1 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (const p of pts.reverse()) { while (hi.length > 1 && cross(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
    return lo.slice(0, -1).concat(hi.slice(0, -1));
  }

  /* ── interaction ── */
  root.addEventListener("pointermove", e => {
    const r = cv.getBoundingClientRect();
    mouse = [e.clientX - r.left, e.clientY - r.top];
    yawTarget = (mouse[0] / W - 0.5) * 0.7;
  });
  root.addEventListener("pointerleave", () => { mouse = null; yawTarget = 0; });
  cv.addEventListener("click", () => {
    if (t < END) t0 = performance.now() - END * 1000; // skip to the finished drawing
    else document.getElementById("index-body").scrollIntoView({ behavior: still ? "auto" : "smooth" });
  });
  root.querySelector("[data-replay]").addEventListener("click", () => (t0 = performance.now()));
  root.querySelector("[data-down]").addEventListener("click", () =>
    document.getElementById("index-body").scrollIntoView({ behavior: still ? "auto" : "smooth" }));

  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(root);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) visible = root.getBoundingClientRect().bottom > 0; });
  let rz;
  window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { layout(); draw(); }, 120); });

  layout();
  requestAnimationFrame(frame);
})();
