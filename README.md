# juyounglee

Juyoung Lee (이주영) — research & design portfolio. Static site, no build step.

```
index.html      structure
css/style.css   design (white, minimal, mono labels + one accent)
js/data.js      ← all content: projects, papers, bio, CV
js/main.js      field / list / sheet / routing
js/intro.js     opening drawing (canvas animation)
```

Preview locally: `python3 -m http.server` → http://localhost:8000

## Opening — line → plan → space, in particles

The first screen is a live canvas drawing (not a video file). One loop of
particles does three things in place:

1. **Line** — a dotted pen line wanders across the page; a running length
   (mm) follows the pen tip.
2. **Plan** — particle by particle, the line flows into a floor plan (a loop
   around a random spanning tree of unequal bays) and dimensions appear.
3. **Space** — the view tilts to axonometric and rows of particles rise off
   the floor to form walls. The model then keeps twisting (higher rows turn
   further) and springing back; drops travel along the walls; a red point
   walks the plan.

Particles are drawn on a canvas with an SVG "goo" filter (blur + alpha
threshold), so dots that crowd together merge like liquid and part again.
The cursor scatters the free line, takes over the twist, and raises walls
near it. Click to skip, click again (or `Index ↓`) for the index; `Replay`
generates a new plan. Respects `prefers-reduced-motion`.

## Concept — "Field"

The home screen is a drawing, not a grid of thumbnails. Every work is plotted
by **year (x)** and **scale (y)** — Material 10⁻³ m → Object → Interior →
Public 10² m → Virtual ∞ (hatched band). A typed query (borrowed from the
HED LAB search bar) filters the drawing live; type anything to search.
Hover shows a crosshair + coordinate readout and a preview; click opens the
project sheet. `List` gives a quiet index with hover previews.

Marker = type: ■ material · ● public · ◆ virtual space · ▭ UX/UI · ○ paper.

## Editing content

Edit `js/data.js`. Each project's `year` (e.g. `2024.6`) and `scale`
(`0`–`5`, one unit per tier) set its position on the field. Image areas are
drawn placeholders for now.
