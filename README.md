# juyounglee

Juyoung Lee (이주영) — research & design portfolio. Static site, no build step.

```
index.html      structure
css/style.css   design (white, minimal, mono labels + one accent)
js/data.js      ← all content: projects, papers, talks, ideas, bio, CV
js/main.js      field / list / sheet / routing
js/intro.js     opening drawing (canvas animation)
```

Preview locally: `python3 -m http.server` → http://localhost:8000

## Opening — the research sequence (three stages, three doors)

The first screen is a live canvas drawing that shows the research path in
three stages, left → right (top → bottom on phones). Each stage is also the
way into its page:

| Stage | Drawing | Hover | Click |
|---|---|---|---|
| **01 Material & Ideation** | soft particles (non-digital): material samples that pool, scatter into grains or pull into fibres; ringed dots are loose ideas | particles stir around the cursor; a sample/idea shows its title | `#/material` (or the work itself) |
| **02 Conferences & Awards** | crossing into the digital, drops become crisp pixels (with a short signal trail) and travel a neuron-like network: the conference talks and awards are cell bodies scattered in a narrowing funnel, joined by organic swaying fibres, and its dendrites reach back into the material clusters (cell mark: solid = award · □ presentation · ◇ conference) | node shows title, venue, year | `#/conferences` |
| **03 Publications** | pixels drift into a field of depth: soft, edgeless clouds of points (one per paper) at different heights, seen in perspective with fog and slowly turning — a sense of space, not a model | the cursor shifts the viewpoint; a layer turns red and shows its paper | the paper |

No dividing lines between stages — only two faint words mark the thresholds. Soft particles use an SVG "goo" filter (blur + alpha threshold) so they
merge like liquid; everything digital is drawn crisp. Stage counts and nodes
come from `js/data.js` (`PROJECTS` material/paper, `IDEAS`, `TALKS`). Respects
`prefers-reduced-motion`.

## Concept — "Field"

The home screen is a drawing, not a grid of thumbnails. Every work is plotted
by **year (x)** and **scale (y)** — Material 10⁻³ m → Object → Interior →
Public 10² m → Virtual ∞ (hatched band). A typed query (borrowed from the
HED LAB search bar) filters the drawing live; type anything to search.
Hover shows a crosshair + coordinate readout and a preview; click opens the
project sheet. `List` gives a quiet index with hover previews.

Marker = type: ■ material · ● public · ◆ virtual space · ▭ UX/UI · ○ paper.

## Content sources

Papers, conference talks, awards, exhibitions and research interests come from
the HED LAB site (member, publications, activities, achievements pages).
Still drafts: the public design / virtual space / UX-UI projects, the ideation
notes, and exhibition descriptions and materials (`TODO` in `js/data.js`).
The opening shows at most six material samples (newest first); the Material
page lists every work.

## Editing content

Edit `js/data.js`. Each project's `year` (e.g. `2024.6`) and `scale`
(`0`–`5`, one unit per tier) set its position on the field. Image areas are
drawn placeholders for now.
