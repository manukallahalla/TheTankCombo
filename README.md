# Tank!

The website for the jazz combo **Tank!** — a five-piece playing a wide range of styles, from swing and bossa nova to hard bop, spooky music and video game classics.

## The band

| Player | Instrument |
| ------ | ---------- |
| Manu   | Drums |
| Gavin  | Piano |
| Jason  | Saxophone |
| Neil   | Bass Trombone |
| Glenn  | Trumpet |

Booking: [thetankcombo@gmail.com](mailto:thetankcombo@gmail.com)

## The site

A static site — plain HTML, CSS and a little JavaScript. **No build step.** The
files you see are the files that get served.

```
.
├── index.html                 home page
├── gavin.html … manu.html     player bios
├── gigs.html                  previous gigs
├── greenmeadow.html           gig gallery (template for future gig pages)
├── vercel.json                tells Vercel not to build (see Hosting)
└── assets/
    ├── styles.css             all styling
    ├── js/                     gigs.js (gig list), gallery.js (lightbox)
    ├── images/                 band, player and gig photos
    └── video/                  gig video
```

`package.json` exists only for the optional local dev server (`npm run dev`).
Nothing on the site depends on it.

### Run it locally

Any static file server works. With Python (no install needed):

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>. (Or `npm install && npm run dev` if you have Node.)

### Hosting

**Do not let the host run a build.** Vercel auto-detects `vite` from
`package.json` and runs `vite build`, which only emits `index.html` — every other
page then 404s. `vercel.json` in the repo root disables that; keep it.

**GitHub Pages** — currently live at <https://manukallahalla.github.io/TheTankCombo/>:

1. Repo → **Settings** → **Pages**
2. **Build and deployment → Source: Deploy from a branch**
3. Branch **`main`**, folder **`/ (root)`** → **Save**

The first build takes a minute or two. After that, every push to `main`
redeploys automatically. Pages serves the files as-is — no other settings.

**Vercel** — `thetankcombo.vercel.app`: `vercel.json` sets it to serve the repo
root with no build. If you connect the repo fresh, also pick **Framework
Preset → Other** in the project's Build & Development settings.

Either host: changes only go live **after `git push`**.
