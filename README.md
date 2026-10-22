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

## Opening — line → plan → space

The first screen is a live canvas drawing (not a video file — sharp at any
size, no media to load). One continuous line does three things in place:

1. **Line** — a free pen line wanders across the page (uncertainty).
2. **Plan** — point by point, the same line snaps into a floor plan: a loop
   traced around a random spanning tree of unequal bays, so it reads as
   rooms and walls with thickness (analysis).
3. **Space** — the camera tilts from plan to axonometric and the walls rise;
   a red point walks the loop (space as experienced).

The cursor pushes the free line aside, turns the model, and raises walls
near it. Click to skip, click again (or `Index ↓`) to reach the index.
`Replay` generates a new plan each time. Respects `prefers-reduced-motion`.

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
