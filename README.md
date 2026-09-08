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

A static single-page site — no build step, no dependencies.

- `index.html` — all page content
- `styles.css` — all styling

### Run it locally

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

### Publish it

In the repo on GitHub: **Settings → Pages → Build and deployment**, set the source to
**Deploy from a branch**, branch `main`, folder `/ (root)`. The site goes live at
`https://manukallahalla.github.io/TheTankCombo/`.
