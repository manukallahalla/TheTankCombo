# Tank! — design system

The shared reference for anyone (human or AI) touching the look of this site.
Read this before changing colour, type, spacing, or motion. If you change a
decision here, update this file in the same commit.

Last substantive update: 2026-08-30 — **moved to a light "sophisticated jazz"
palette**: album-cream page, deep-ink text, deep-teal accent, burnt-rust `!`.
This followed a dark black+orange direction that the band asked to move off
("towards white", then "too brown", then "jazz colours, beige"). Same day:
replaced the section dividers with **frosted-glass section panels**; display
face is Bricolage Grotesque (member-card names on body font); added `sfx.js`
(see Sound). The palette has changed direction several times — treat the token
table as current and check the decision log for why.

---

## Design read

A booking-and-personality site for a five-piece high-school jazz combo in Palo
Alto. Audience: event organisers (parents, PTA and market managers, small
venues) plus the band's own peers. Voice is already set in the copy — brash,
plain, a little funny ("Five high schoolers, three horns, one rhythm section.
We play loud."). The design should match that: **dark, warm and confident,
crisp, not corporate, not precious.**

Primary visitor goal (every page serves it): *decide to email the band.*

Mode: **Persuade.** Composition can carry some voice; the booking path stays
obvious from any scroll position.

Going forward this is **refinement** — keep the identity, the copy, the
information architecture, the page set. Change surface, not substance.

---

## Palette

Cream, burnt orange and teal — **a single light identity, no dark mode.** An
album-sleeve cream page, deep ink-blue text, a **burnt-orange** primary accent,
**deep teal** as the secondary (the `!` and the background glow). Sophisticated
jazz, warm paper (not brown), at the band's request — Blue Note more than ECM.
Everything is driven by the semantic tokens in `styles.css :root` — **never
hard-code a hex in a component rule.**

| Token | Hex | Role | Contrast on canvas |
| --- | --- | --- | --- |
| `--canvas` | `#f0ead9` | **the whole page** — warm album-sleeve cream | — |
| `--surface` | `#faf5ea` | the tint inside cards, panels, raised UI | — |
| `--ink` | `#23262f` | primary text — deep ink blue-black | 12.3:1 |
| `--ink-soft` | `#5b5d63` | secondary text | 5.4:1 canvas · 5.0:1 panel |
| `--accent` | `#a8431f` | burnt orange — links, labels, heading rule, primary action, focus | 5.0:1 |
| `--accent-bright` | `#e0996a` | light burnt-orange — **only** legible on the dark footer | — |
| `--accent-wash` | `#f4e6dc` | pale peach — `::selection`, ghost-button hover bed | — |
| `--flame` | `#2a5f59` | deep teal — the `!` and the hero glow **only**, never small text | 5.9:1 (large text) |
| `--line` | `#ded3bd` | faint hairlines | — |
| `--border-strong` | `#c3b393` | visible edges, control borders | — |
| `--link` / `--link-hover` | `#a8431f` / `#843215` | links | 5.0:1 |
| `--action-bg` / `--action-fg` | `#a8431f` / `#f7f3e8` | primary button fill / label | 5.3:1 (label on fill) |
| `--focus` | `#a8431f` | focus ring | 5.0:1 |
| `--footer-bg` / `--footer-fg` / `--footer-fg-strong` | `#23262f` / `#cbc6b8` / `#f7f3e8` | footer — a deep-ink slab, the one dark surface | — |

The footer is dark; on it, `--accent` (burnt orange) fails contrast, so the
footer's contact links and `!` use `--accent-bright` (light burnt-orange, 6.4:1
on `--footer-bg`). Semantic tokens (`--ok #2f6a4f`, `--warn #8a5a16`,
`--danger #a23b32`, `--info` = `--accent`) exist for consistency; pair colour
with text or an icon if you use one.

### Colour rules

- **One background.** The whole page is `--canvas`, dressed by a single fixed
  texture layer (see Page texture) — one ground for every section, never
  per-section tints. Sections are grouped as frosted-glass panels (see Frosted
  section panels) that let the texture through. The hero keeps its own stronger
  warm radial wash on top of the glass.
- **Burnt orange leads, teal supports.** `--accent` (burnt orange) does
  everything with a letter in it — links, small labels, the heading accent bar,
  the primary button. `--flame` (deep teal) is the `!` in the wordmark / hero
  and the hero background glow, nothing else. On the dark footer the `!` and the
  contact links use `--accent-bright`.
- **`--accent` owns the money path** — primary button and nav "Booking" pill.
- `--flame` (teal) is large-text-only here by role, not contrast — it's the `!`
  and the glow, nothing else. Never wire small text to it.
- `--accent` is close to its floor (5.0:1 on cream). Re-check it, `--ink-soft`
  and `--accent-wash` if you nudge `--canvas`.
- Secondary text is `--ink-soft` (a warm grey); it clears AA on every surface.

The old `--panel` / `--text` / `--text-dim` / `--brass` / `--brass-hot` /
`--ember` aliases are gone — every rule, gigs included, is on the semantic
tokens now.

---

## Type

| Use | Family | Notes |
| --- | --- | --- |
| Display — wordmark, headings, titles, gig venues | **Bricolage Grotesque** 700 / 800 (`--display`) | a modern grotesque with character; needs its Google Fonts `<link>` in every page's `<head>` |
| Body | **Inter** (`--body`) | resolves to SF Pro on Apple devices, which is the intent; 17px / 1.65; prose held to `--measure` (66ch) |
| Member-card names (`.member h3`) | `--body` | dropped to the body font on purpose (component rule), so the roster reads quieter than the section titles |

- Bricolage is **not condensed** (unlike the old Bebas Neue). Large display
  sizes take **negative** tracking (`-0.02em` to `-0.025em` on `h1`, `-0.015em`
  on `h2`); the wordmark and headings render in **natural case**, not all-caps.
- Weights: `800` for the wordmark, hero `h1`, bio `h1`, footer mark; `700` for
  section `h2`, member names, bio nav.
- Bricolage carries an **optical-size axis**. Left on `auto` a small element
  gets the flat text cut, so `.wordmark` and `.footer-mark` pin
  `font-variation-settings: "wght" 800, "opsz" 44` to hold the expressive
  display cut at their small size. Large headings can stay on `auto`.
- Hero `h1` runs to `clamp(3.75rem, 14vw, 8.5rem)` — poster scale for the
  one-word name. Don't apply that scale to multi-word headings.
- Headings use `text-wrap: balance`; body uses `text-wrap: pretty`.
- No gradient text. Emphasis is weight and size.

---

## Frosted section panels

The page is one textured cream field (see Page texture). **Each section
is a pane of smoked glass floating on it** — that is the section grouping. There
are no divider strips (an earlier "keyboard comb + orange downbeat" divider
system was tried and cut; don't bring it back).

The panel, applied to `.hero, .about, .band, .booking, #gigs`, `.bio-page` and
`.gigs-page` (the standalone gig / gallery pages):

- `max-width: var(--wrap)` (bio pages narrower; booking matches at `--wrap` so
  its pane lines up with Previous Gigs, and focuses the ask through the narrower
  `.booking-inner` column instead), centred, with
  `margin: clamp(1.25rem, 3.5vw, 2.5rem) auto` — the gap between panes is where
  the raw texture shows.
- `background: color-mix(in srgb, var(--surface) 70%, transparent)` — a
  translucent tint, **not** an opaque fill.
- `backdrop-filter: blur(28px) saturate(150%)` — the real effect: it refracts
  the grain, the warm top-light and the faint comb scrolling behind. `saturate`
  pulls the warm glow through, so panes near the top read warmer.
- `border: 1px solid color-mix(var(--ink) 11%, transparent)` +
  `box-shadow: var(--shadow-md), inset 0 1px 0 color-mix(var(--ink) 16%, transparent)`
  — the bright inner top edge is light catching the glass.
- `border-radius: var(--radius-lg)` (18px).

Why glass here at all (it's usually a cliché): there is a real textured
backdrop for it to refract, and the panes never stack on each other — an opaque
child (member card, button) always sits on exactly one pane. Both conditions
from the Apple-materials rules are met.

Rules:

- **Never stack a translucent surface on another.** Panes don't overlap; cards
  inside a pane stay opaque (`--surface`).
- Opaque children read as figure on the glass — keep member cards, the footer
  and the header opaque.
- The hero folds its warm radial glow into the pane's tint (see `.hero` in
  `styles.css`); nothing else adds its own background.
- Solid `--surface` fallback under `prefers-reduced-transparency` **and**
  `prefers-contrast: more` — both lists include `.gigs-page`; keep them working.
- `.bio-page` and `.gigs-page` repeat the recipe (same padding, border,
  tint, shadow — keep those in sync). Widths differ by content: `.bio-page`
  47.5rem for prose, `.gigs-page` 54rem for the gig cards, the gallery page
  87.5rem.

If you add a section, add its selector to the panel block. Don't reach for a
`border-top` and don't reintroduce per-section background tints.

---

## Page texture

One flat fill on its own reads as an empty void — worst in the type-only hero
and the wide desktop gutters. A single fixed layer (`body::before`,
`z-index: 0`, `pointer-events: none`) sits under all content and gives the page
a material for the frosted panes to refract. Four ingredients, **all static**:

- **Grain** — a tiled SVG `fractalNoise` in deep ink at low alpha (`slope 0.1`),
  so the cream has the tooth of a printed sleeve.
- **Cool top-light** — a wide `--accent` (teal) radial at `~8%`, anchored to the
  top of the page. `saturate()` in the panes pulls it through.
- **Stage glows** — three soft blobs (teal `--accent` and rust `--flame`,
  `6–8%`), off-centre. Fixed, so as a pane scrolls over one the blur drags the
  colour around behind the glass. This is most of what makes the glass read as
  glass on a page with no photography.
- **Comb** — `--ink` verticals, 2px every 24px, at `~7%`. The "straight lines
  down" the band liked; faint on the cream in the gutters, a soft vertical
  shimmer through a pane's blur.

Rules:

- It is **texture, not motion** — nothing here animates, and it does not spend
  the page's one motion moment.
- It is the backdrop the frosted panels refract; it must stay behind them
  (`z-index: 1` on `main` and the footer, `0` on `body::before`).
- Opaque surfaces (member cards, footer, header) cover it and read as figure
  against it — keep those fills opaque.
- Off under `prefers-contrast: more` (it costs a sliver of contrast).

---

## Spacing, shape, depth

- **Section panels:** `padding: clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 5vw, 3.5rem)`
  (the hero a little more); `margin: clamp(1.25rem, 3.5vw, 2.5rem) auto` sets the
  gap between panes. More space above a heading than below it.
- **Inner width:** `--wrap` 1120px is the panel max-width and the width for
  headings and grids inside it; `--measure` 66ch for prose. The bio pages use a
  narrower pane (760px); booking stays at `--wrap` and focuses the ask through
  its narrower `.booking-inner` column. In About, the heading and the copy share
  the pane's left edge (copy just holds the shorter measure).
- **Radius:** `--radius` 6px for cards, buttons, small UI; `--radius-lg` 18px for
  the section panes; `--radius-pill` for the nav Booking pill and the heading
  accent bar.
- **Depth:** `--shadow-sm/md/lg`, all with a real offset and soft blur, tinted
  warm brown-grey and kept light (`0.05–0.14` alpha) so they sit on the cream
  without greying it. The panes and cards carry an `inset 0 1px 0` white top
  edge — light catching the glass. No zero-blur block shadows.

---

## Motion

One authored moment: **the hero settles in on load** — eyebrow, wordmark,
tagline, CTAs rise 10px and fade, staggered 60/80ms. ~460–560ms, strong
ease-out (`--ease-out`).

Everything else is feedback only: `scale(0.97–0.98)` on `:active`; hover lifts
on buttons and member cards **gated** behind
`@media (hover: hover) and (pointer: fine)`, 130–200ms; link/nav colour
transitions.

Rules: transition specific properties, never `all`; never animate from
`scale(0)`; never `ease-in`; no scroll-reveal, no second "moment". The section
panels and the page texture are static.

`prefers-reduced-motion`, `prefers-reduced-transparency`, and
`prefers-contrast: more` are all handled. Keep them working.

---

## Sound

Opt-in UI sound, synthesised with the Web Audio API (no audio files). **Off by
default** — a site shouldn't make noise you didn't ask for. The choice is
remembered (`localStorage` key `tank-sfx`). A speaker toggle leads the header
nav.

- One sound only: a single soft low sine "tock", ~70ms, through a closing
  lowpass. Master gain `0.09`. No melody, no arpeggios, no per-card notes.
- Plays on a real click only — buttons, member cards and nav links (nav a touch
  quieter). No hover sound.
- Sound is confirmation of a press, never information that isn't already visible.
- Lives entirely in `sfx.js` (loaded on every page). It injects its own
  `.sfx-toggle` style from `:root` tokens with fallbacks. Wire any new
  interactive component into the delegated `pointerdown` handler there.

---

## Components

- **Header:** sticky, translucent (`backdrop-filter` + 82% canvas), one hairline
  under it. Nav on one line, ≤ 72px tall. The **Booking** link is promoted to a
  filled teal pill on every page via `nav a[href$="#booking"]` — keep the href
  ending in `#booking` and no markup change is needed.
- **Buttons:** `.btn-primary` = teal fill + cream label (the book action).
  `.btn-ghost` = ink text, strong border, pale-teal fill on hover.
- **Section panels:** see Frosted section panels. The section grouping and the
  page's main structural device.
- **Member cards:** opaque `--surface` fill (they sit on a glass pane, so they
  must stay opaque), 1px hairline, small shadow + the same `inset 0 1px 0` top
  edge as the panes; hover = lift + stronger border + medium shadow. "Read bio"
  is always link-coloured so the card reads as clickable. The 5 cards are
  equivalent nav choices, so a repeated card grid is correct here.
- **Footer:** the darkest surface on the page, and deliberately spare — just the
  `Tank!` wordmark and `.footer-contact` (email + phone `650-334-7667`) as
  `--accent-bright` links at `1.15rem`. The footer's whole job is being
  reachable, so the contact details outsize everything else; there is no
  tagline or disclaimer line.
- **Anchor targets** (`#about`, `#band`, `#booking`) carry `scroll-margin-top`
  so the sticky header never covers a heading you jumped to.
- **Browser surfaces are themed:** `::selection`, caret, `accent-color`, focus
  rings, scrollbar, underline offset. Keep them themed.

---

## Gigs pages

`gigs.html`, `greenmeadow.html`, `gigs.js`, `gallery.js`, the `#gigs` teaser in
`index.html`, and the `.gig*` / `.gigs-*` / `.gallery*` / `.lightbox*` rules are
part of the same system as everything else — same tokens, same panel, same
display type. There is no separate owner.

- `.gigs-page` is a frosted pane (same recipe as `.bio-page`); `.gallery-page`
  widens it to 87.5rem.
- **Greenmeadow is the gig-page template.** Its shape — `.section-head` (rule +
  `h1`), then `.page-intro` (`.eyebrow` date line + `.lead`), then
  `.gallery-grid`, then `.gigs-cta` — is what a new gig page copies. Everything
  in it shares one left edge: `.gigs-page.gallery-page .section-head` drops the
  `max-width: --wrap` / `margin: auto` so the heading doesn't float in from the
  left of the wide pane.
- `.gig-venue` and `.gigs-page h1` are on the shared display tracking
  (`-0.015em`, weight 700), like `.section-head h2`.
- Gig list cards (`.gig`): opaque `--surface`, hairline,
  `border-left: 3px solid var(--accent)`, hover lift. (The member grid cards are
  a separate, borderless style.)
- The lightbox lives in `gallery.js` + `.lightbox*` in `styles.css`; it fades
  via `visibility` + `opacity` (no `display` swap), toggles `aria-hidden`, and
  restores focus on close.

---

## Accessibility baseline (don't regress)

- Body text ≥ 4.5:1, large text and UI ≥ 3:1. Contrast holds on the glass panes
  too: `--surface` at 78% over the cream texture lands close to `--canvas`, so
  `--ink` (~12:1) and `--ink-soft` (~5:1) both clear AA on a pane. The light
  palette has tighter margins than the old near-black one — `--ink-soft`,
  `--accent`, and `--flame` are all close to their floors, so re-check any of
  them if you nudge a neutral.
- The dark footer is the exception: `--accent` fails on it, so footer contact
  links and the `!` use `--accent-bright`.
- Visible focus ring on every interactive element (`:focus-visible`, teal).
- Colour is never the only signal.
- Motion, transparency, and contrast preferences all have media-query branches —
  the panes drop to solid `--surface` under `prefers-reduced-transparency` and
  `prefers-contrast: more`.
- Keep `alt` text on photos; keep heading order intact.

---

## Known gaps / next steps (highest impact first)

1. **A real band photo.** The hero and the site are type-only. One good photo
   of the five of them — in the hero, or as its own shot above "The Band" — is
   the single biggest lift available.
2. **Member photos.** Gavin, Neil and Manu have one; Jason and Glenn fall back
   to the emoji mark. The bio layout already supports `.bio-photo`.
3. **Bios.** Manu's and Gavin's bio text is real but still tagged
   `class="bio-todo"` (renders grey) with a stale "replace this" comment — drop
   the class and comment once the copy is signed off.

---

## Decision log

- **Gigs folded into the system (2026-09-08).** The "Previous Gigs is a separate
  owner, keep it byte-for-byte" boundary was lifted. `.gigs-page` became a
  frosted pane like `.bio-page`; `.gigs-page h1` moved to the shared display
  tracking; the dead `--panel`/`--brass`/… aliases were deleted; the Greenmeadow
  lightbox moved to `gallery.js` (fade via `visibility`, focus restore); the
  Bebas webfont `<link>` on `greenmeadow.html` was swapped to Bricolage.
  Greenmeadow is now the explicit template for future gig pages, everything on
  it flush to one left edge.
- **Sticky footer + opt-in sound (2026-09-08).** `body` is a flex column with
  `main { flex: 1 0 auto }`, so the footer sits on the viewport bottom instead
  of floating up a short page. UI sound (`sfx.js`) cut to one soft tick on
  click, off by default.
- **Light "sophisticated jazz" palette (2026-08-30, current).** Album-cream page,
  deep-ink text, deep-ink footer slab, and a burnt-orange / deep-teal accent
  pair. The two accent roles were still being tuned after this entry — the token
  table above is authoritative: `--accent` is burnt orange (anything with a
  letter), `--flame` is deep teal (`!` and glow only). This is where the palette
  landed after the band worked through several directions in one sitting:
  beige/navy/sky → black + orange (a hard revert to the original dark identity)
  → "towards white" → "too brown" (a warm-charcoal midpoint) → "jazz colours,
  sophisticated, beige". Only `:root` tokens, the `body::before` texture colours,
  and the glass panels' inner highlight changed; structure, type, motion and
  a11y branches were all kept. Every pair re-verified for AA.
  Two Claude sessions were editing the repo in parallel during this; palette
  ownership was handed to this session, typography to the other.
- **One identity, no theme remap.** The site commits to the light cream palette
  with no `@media (prefers-color-scheme: dark)`. Every colour is a semantic
  token, so a dark variant is a token-remap block if ever wanted, not a rewrite.
  The footer is the one dark surface and carries its own `--footer-*` tokens
  plus `--accent-bright` for anything on it that needs to be legible.
- **Frosted section panels (2026-08-30).** The redesign went: alternating
  section tints → one background with drawn "keyboard comb" dividers at every
  seam → (band's call: "the dividers are absolutely terrible") → each section is
  now a frosted-glass pane on the textured void. The divider system and
  `.hero-keys` were removed entirely. Glass is normally a cliché, but the two
  conditions that make it legitimate are met here: a real textured backdrop
  (Page texture) for it to refract, and panes that never stack on each other.
  See Frosted section panels.
- **Bricolage Grotesque replaces Bebas Neue.** Bebas is condensed all-caps and
  fought the clean humanist body font; Bricolage has real case, a weight range,
  and character, and pairs naturally with Inter/SF Pro. Chosen by the client
  from a shortlist.
- **~~Beige + navy + sky~~ (superseded).** Briefly the committed palette; see
  the revert entry at the top of this log. Kept here as a record of the
  direction and why it was undone.
- **CSS-only, plus the shared font `<link>`.** The palette passes were a token
  or rule in `styles.css` plus the identical webfont `<link>` in each `<head>`,
  and nothing else — the parallel Previous Gigs and bio work stayed clear of
  them. (That boundary is since lifted — see Gigs pages.)
- **One motion moment.** Hero entrance only.
- **Hero stays type-only for now.** A one-word band name at poster scale is a
  legitimate "manifesto" hero. Revisit when there's a real photo (gaps #1).
- **Page texture (2026-08-30).** The one-background page was reading as an empty
  void — the type-only hero and the wide desktop gutters most of all. Added one
  fixed sub-content layer: the keyboard-comb motif at `~4%`, a `~5%` warm
  top-light continuing the hero wash, and a low-alpha grain. No new token, font,
  or motion — only the divider motif and the hero wash are amplified. See Page
  texture.
