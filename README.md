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

## Opening — uncertainty → analysis → space

The first screen is a live canvas drawing (not a video file — sharp at any
size, ~0 KB of media). Tangled lines resolve into rays that meet at one
point; from there a 3D Hilbert curve fills a cube, order n=1 → 5, until it
reads as a solid. The cursor pushes the lines aside and turns the cubes.
Click to skip, click again (or `Index ↓`) to go to the index. Labels live in
`SITE.intro.labels`. Respects `prefers-reduced-motion` (shows the final frame).

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
