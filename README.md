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

## Pages

The header reads as one sentence — **Hello, I research and design** — and only
the three words are links (Instrument Serif italic). Hovering *research* or
*design* opens its sub-pages; on phones each sub-page shows its siblings at the
top instead. On the right, **Search** (with a magnifier) opens the search page.

| Route | Page |
|---|---|
| `#/` | **Home** — only the opening drawing (click the name in the header to return) |
| `#/hello` | bio and CV, contact |
| `#/research/publications` · `#/research/conferences` | research sub-pages (awards are noted on the presentation they were given for) |
| `#/design/exhibition` · `#/design/interior-architecture` · `#/design/architecture` | design sub-pages |
| `#/search` | typed query + Field / List of every work |
| `#/p/<id>` | a work's sheet, opened over the current page |

Every sub-page is just its intro text and a full-width, numbered card grid;
which page shows which work is set in `SITE.pages` (one `type` per page).
Older addresses (`#/material`, `#/conferences`, `#/publications`, `#/about`, …)
still land on the matching page.

All on-page text is English; Korean appears only in code comments.

Fonts (all Google Fonts, SIL Open Font License): **Urbanist** for text with
**Inter** as its fallback, **Instrument Serif** for the header sentence and
card titles, **IBM Plex Mono** for labels.
| `#/p/<id>` | a work's sheet, opened over the current page |

## Home — the research sequence (three stages, three doors)

The home page is a live canvas drawing that shows the research path in
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
`prefers-reduced-motion`. The build-up plays at full
speed; once every stage has appeared the motion eases down to `PACE` in
`js/intro.js` (lower = slower; the cursor still responds in real time).

## Search — "Field"

The Search page is a drawing, not a grid of thumbnails. Its columns are the
five sub-pages — the tabs on top (○ Publications · □ Conferences · ■ Exhibition
· ◆ Interior Architecture · ● Architecture) filter them — and its rows are the
years, newest on top. A typed query (borrowed from the
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
