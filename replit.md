# SMP Negeri 15 Banjarbaru Website

A static website for SMP Negeri 15 Banjarbaru, refactored from the imported bundled HTML design while preserving its visual system and page structure.

## Pages

- `index.html` — Main bundled public entry point
- `Beranda.dc.html` — Beranda page
- `Berita.dc.html` — Berita (News) page
- `Informasi.dc.html` — Informasi (Information) page
- `Homepage SMP Labschool Jakarta.dc.html` — Full homepage
- `data/` — JSON content for news, gallery, and announcements
- `cms/` — Static content editor with local browser storage and JSON export

## How to Run

The site is served with Python's built-in HTTP server on port 5000:

```
python3 -m http.server 5000
```

The public website is available at `/`. The static CMS is available at `/cms/`.

Because GitHub Pages cannot write files on the server, CMS edits are stored in
the browser and can be exported as JSON. Replace the corresponding file in
`data/` with the exported file before publishing the update to GitHub Pages.

## User Preferences

_None recorded yet._
