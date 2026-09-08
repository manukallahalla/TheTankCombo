/* Tank! — UI sound.
 *
 * One short, soft tick, synthesised with the Web Audio API (no files) and
 * played only on a real click. It's confirmation of a press, nothing more:
 * no melody, no hover chimes, no per-card notes, nothing bright.
 *
 * Off unless the visitor turns it on — a website shouldn't make noise you
 * didn't ask for. The choice is remembered in localStorage ("tank-sfx"). A
 * speaker button leads the header nav. Design notes live in DESIGN.md -> "Sound".
 *
 * Fully self-contained: the only thing outside this file is the <script> tag on
 * each page. The .sfx-toggle styling is injected below and only ever reads the
 * design-system tokens on :root, so it stays in step with the theme.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "tank-sfx";
  const MASTER_GAIN = 0.09;

  let stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* private mode */ }
  let enabled = stored === "on";

  /* ---------- synth ---------- */

  let ctx = null;
  let master = null;

  function engine() {
    if (ctx) return ctx;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = MASTER_GAIN;
    master.connect(ctx.destination);
    return ctx;
  }

  /* A single low sine tick through a closing lowpass — a soft "tock", ~70ms,
     the same for every control. `level` only trims it for secondary actions. */
  function tick(level = 1) {
    if (!enabled) return;
    const c = engine();
    if (!c) return;
    if (c.state === "suspended") c.resume();

    const t = c.currentTime;
    const dur = 0.07;

    const amp = c.createGain();
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, 0.55 * level), t + 0.004);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1100;
    amp.connect(lp).connect(master);

    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(190, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + dur);
    osc.connect(amp);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  const sfx = {
    press: () => tick(1),
    nav: () => tick(0.55),
  };

  /* ---------- toggle button ---------- */

  const STYLE = `
    .sfx-toggle {
      flex: none;
      align-self: center;
      display: inline-grid;
      place-items: center;
      width: 1.75rem;
      height: 1.75rem;
      margin: 0 -0.3rem 0 0;   /* tuck it against the nav links so it reads as part of the cluster */
      padding: 0;
      border: 1px solid transparent;
      border-radius: var(--radius-pill, 999px);
      background: transparent;
      color: var(--ink-soft, currentColor);
      line-height: 0;
      cursor: pointer;
      -webkit-appearance: none;
      appearance: none;
      transition: color var(--dur, 200ms) ease,
                  border-color var(--dur, 200ms) ease,
                  transform var(--dur-fast, 130ms) var(--ease-out, ease);
    }
    .sfx-toggle svg { width: 1rem; height: 1rem; display: block; }
    .sfx-toggle:hover { color: var(--ink, currentColor); border-color: var(--border-strong, currentColor); }
    .sfx-toggle:active { transform: scale(0.88); }
    .sfx-toggle[aria-pressed="true"] { color: var(--accent, currentColor); }
    .sfx-toggle--float {
      position: fixed;
      right: 1rem;
      bottom: 1rem;
      z-index: 50;
      background: var(--surface, #161a23);
      border-color: var(--border-strong, currentColor);
      box-shadow: var(--shadow-md, 0 4px 14px rgba(0,0,0,0.4));
    }
    @media (prefers-reduced-motion: reduce) { .sfx-toggle { transition: none; } }
  `;

  const ICON = {
    on:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9a3 3 0 0 1 0 6"/>' +
      '<path d="M19.5 6a7 7 0 0 1 0 12"/></svg>',
    off:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 9v6h4l5 4V5L8 9H4z"/><line x1="23" y1="9" x2="17" y2="15"/>' +
      '<line x1="17" y1="9" x2="23" y2="15"/></svg>',
  };

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "sfx-toggle";

  function paint() {
    btn.innerHTML = enabled ? ICON.on : ICON.off;
    btn.setAttribute("aria-pressed", String(enabled));
    btn.setAttribute("aria-label", enabled ? "Sound effects: on" : "Sound effects: off");
    btn.title = enabled ? "Sound on" : "Sound off";
  }

  btn.addEventListener("click", () => {
    enabled = !enabled;
    try { localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off"); } catch (e) { /* private mode */ }
    paint();
    if (enabled) { engine(); sfx.press(); }
  });

  function mount() {
    const style = document.createElement("style");
    style.textContent = STYLE;
    document.head.appendChild(style);

    paint();

    const nav = document.querySelector(".site-header nav");
    const header = document.querySelector(".site-header");
    if (nav) {
      nav.insertBefore(btn, nav.firstChild);
    } else if (header) {
      header.appendChild(btn);
    } else {
      btn.classList.add("sfx-toggle--float");
      document.body.appendChild(btn);
    }
  }

  /* ---------- wiring ----------
     Click only, and the same tick everywhere. No hover sound. */

  function onDown(e) {
    if (!enabled) return;
    const t = e.target;
    if (!t.closest) return;

    if (t.closest(".btn, .member")) { sfx.press(); return; }
    if (t.closest(".site-header nav a")) sfx.nav();
  }

  function start() {
    mount();
    document.addEventListener("pointerdown", onDown, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
