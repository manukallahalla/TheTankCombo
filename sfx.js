/* Tank! — UI sound effects.
 *
 * Every sound is synthesised on the fly with the Web Audio API (no audio
 * files): short, warm electric-piano notes drawn from one C major pentatonic
 * scale, so nothing ever clashes. Sound is confirmation, never a channel for
 * information that isn't already on screen.
 *
 * On by default, except for visitors who ask for reduced motion. The choice is
 * remembered in localStorage ("tank-sfx"). A speaker button leads the header
 * nav. Design notes live in DESIGN.md -> "Sound".
 *
 * Fully self-contained: the only thing outside this file is the <script> tag on
 * each page. The .sfx-toggle styling is injected below and only ever reads the
 * design-system tokens on :root, so it stays in step with the theme.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "tank-sfx";
  const MASTER_GAIN = 0.16;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* private mode */ }
  let enabled = stored ? stored === "on" : !reduceMotion.matches;

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

  /* One plucked note: a detuned sine + triangle pair through a closing
     lowpass, with a fast attack and an exponential tail. */
  function note(freq, { delay = 0, dur = 0.5, level = 1 } = {}) {
    if (!enabled) return;
    const c = engine();
    if (!c) return;
    if (c.state === "suspended") c.resume();

    const t = c.currentTime + delay;

    const amp = c.createGain();
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, 0.9 * level), t + 0.006);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(5200, t);
    lp.frequency.exponentialRampToValueAtTime(1400, t + dur);
    amp.connect(lp).connect(master);

    [
      { type: "sine", detune: -4, gain: 0.8 },
      { type: "triangle", detune: 7, gain: 0.22 },
    ].forEach((v) => {
      const osc = c.createOscillator();
      osc.type = v.type;
      osc.frequency.value = freq;
      osc.detune.value = v.detune;
      const vg = c.createGain();
      vg.gain.value = v.gain;
      osc.connect(vg).connect(amp);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    });
  }

  function roll(freqs, { spread = 0.045, dur = 0.65, level = 0.7 } = {}) {
    freqs.forEach((f, i) => note(f, { delay: spread * i, dur, level }));
  }

  /* C major pentatonic, two octaves */
  const N = {
    C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0, A4: 440.0,
    C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0,
  };
  const RIFF = [N.C4, N.D4, N.E4, N.G4, N.A4]; // one note per member card, low to high

  const sfx = {
    tapPrimary: () => roll([N.C4, N.E4, N.G4, N.C5], { spread: 0.05, dur: 0.7, level: 0.7 }),
    tapGhost: () => note(N.G4, { dur: 0.42, level: 0.6 }),
    nav: () => note(N.E5, { dur: 0.26, level: 0.42 }),
    hover: () => note(N.C5, { dur: 0.16, level: 0.13 }),
    member: (i) => note(RIFF[((i % RIFF.length) + RIFF.length) % RIFF.length], { dur: 0.5, level: 0.5 }),
    toggleOn: () => roll([N.C4, N.E4, N.A4], { spread: 0.055, dur: 0.6, level: 0.6 }),
  };

  /* ---------- toggle button ---------- */

  const STYLE = `
    .sfx-toggle {
      display: inline-grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      padding: 0;
      border: 1px solid transparent;
      border-radius: var(--radius-pill, 999px);
      background: transparent;
      color: var(--ink-soft, currentColor);
      cursor: pointer;
      -webkit-appearance: none;
      appearance: none;
      transition: color var(--dur, 200ms) ease,
                  border-color var(--dur, 200ms) ease,
                  transform var(--dur-fast, 130ms) var(--ease-out, ease);
    }
    .sfx-toggle svg { width: 1.1rem; height: 1.1rem; display: block; }
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
    if (enabled) { engine(); sfx.toggleOn(); }
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

  /* ---------- wiring ---------- */

  let lastHover = 0;

  function onHover(e) {
    if (!enabled || !ctx || ctx.state !== "running") return; // only once the engine is live
    const el = e.target.closest && e.target.closest(".btn, .site-header nav a");
    if (!el || el === onHover.last) return;
    onHover.last = el;
    const now = (window.performance && performance.now()) || Date.now();
    if (now - lastHover < 70) return;
    lastHover = now;
    sfx.hover();
  }

  function onDown(e) {
    if (!enabled) return;
    const t = e.target;
    if (!t.closest) return;

    const button = t.closest(".btn");
    if (button) {
      if (button.classList.contains("btn-primary")) sfx.tapPrimary();
      else sfx.tapGhost();
      return;
    }
    const card = t.closest(".member");
    if (card) {
      const cards = Array.prototype.slice.call(document.querySelectorAll(".member"));
      sfx.member(cards.indexOf(card));
      return;
    }
    if (t.closest(".site-header nav a")) sfx.nav();
  }

  function start() {
    mount();
    document.addEventListener("pointerover", onHover, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
