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

A static site — plain HTML, CSS and a little JavaScript. No build step, no dependencies.

```
.
├── index.html                 home page
├── gavin.html … manu.html     player bios
├── gigs.html                  previous gigs
├── greenmeadow.html           gig gallery (template for future gig pages)
└── assets/
    ├── styles.css             all styling
    ├── js/                     gigs.js (gig list), gallery.js (lightbox)
    ├── images/                 band, player and gig photos
    └── video/                  gig video
```

### Run it locally

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

### Publish it

In the repo on GitHub: **Settings → Pages → Build and deployment**, set the source to
**Deploy from a branch**, branch `main`, folder `/ (root)`. The site goes live at
`https://manukallahalla.github.io/TheTankCombo/`.
