/* Tank! recordings — the single place to edit.
 *
 * Both the teaser on the home page and the full list on recordings.html read
 * from this array, so adding a track here updates both.
 *
 * Each entry: title is required, everything else is optional. Drop the audio
 * file into the repo and point `src` at it. Until then leave `src` off and the
 * track renders as "audio coming soon" instead of a broken player, so the
 * section looks finished while you are still collecting files.
 *
 *   { title: "Take Five", composer: "Paul Desmond", src: "audio/take-five.m4a",
 *     recorded: "2026-05-25", take: 2, duration: "5:24",
 *     venue: "Greenmeadow Lawn", note: "Second set, with the long drum break" },
 *
 * take, duration, venue and note are all optional — the meta line skips
 * whatever is missing.
 *
 * Wrapped in an IIFE on purpose: the home page loads this alongside gigs.js and
 * both want a month table and a date formatter. At top level the second `const`
 * to load would throw a redeclaration error and take both scripts down.
 */
(function () {
  "use strict";

  const RECORDINGS = [
    {
      title: "Au Privave",
      composer: "Charlie Parker",
      src: "audio/au-privave.m4a",
      recorded: "2026-08-31",
      duration: "4:23",
      note: "A Parker blues in F, cut in 1951. The title is mock-French, usually read as \u201cin private\u201d."
    },
    {
      title: "Isfahan",
      composer: "Duke Ellington & Billy Strayhorn",
      src: "audio/isfahan-take-4.m4a",
      recorded: "2026-08-31",
      take: 4,
      duration: "4:15",
      note: "Written for the Far East Suite in 1966 and named for the Iranian city. Ellington and Strayhorn built it as a feature for Johnny Hodges\u2019 alto."
    },
    {
      title: "Autumn Leaves",
      composer: "Joseph Kosma",
      src: "audio/autumn-leaves-take-5.m4a",
      recorded: "2026-08-31",
      take: 5,
      duration: "5:59",
      note: "Kosma wrote it as \u201cLes feuilles mortes\u201d in 1945. Johnny Mercer\u2019s English lyric, two years later, is what turned it into a standard."
    },
    {
      title: "Yardbird Suite",
      composer: "Charlie Parker",
      src: "audio/yardbird-suite.m4a",
      recorded: "2026-08-31",
      duration: "3:16",
      note: "Parker cut it for Dial in 1946. The title is his own nickname."
    }
  ];

  /* ---------- rendering ---------- */

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* Parsed by hand rather than with new Date(): a bare "YYYY-MM-DD" is read as
     UTC, which can shift the day backwards for viewers in western time zones. */
  function formatDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return iso;
    return `${d} ${MONTHS[m - 1]} ${y}`;
  }

  /* Newest first. Tracks with no date sort to the bottom but keep their
     relative order, so a half-filled array still reads sensibly. */
  function sortedRecordings() {
    return [...RECORDINGS].sort((a, b) => {
      if (!a.recorded && !b.recorded) return 0;
      if (!a.recorded) return 1;
      if (!b.recorded) return -1;
      return b.recorded.localeCompare(a.recorded);
    });
  }

  function recordingItem(rec) {
    const li = document.createElement("li");
    li.className = "recording";

    const title = document.createElement("p");
    title.className = "recording-title";
    title.textContent = rec.title;
    li.append(title);

    /* composer · date · take · venue · length, skipping whatever is missing */
    const meta = [
      rec.composer,
      rec.recorded ? formatDate(rec.recorded) : null,
      rec.take ? `Take ${rec.take}` : null,
      rec.venue,
      rec.duration
    ].filter(Boolean);

    if (meta.length) {
      const p = document.createElement("p");
      p.className = "recording-meta";
      p.textContent = meta.join(" · ");
      li.append(p);
    }

    if (rec.src) {
      const audio = document.createElement("audio");
      audio.className = "recording-audio";
      audio.controls = true;
      /* "none" not "metadata": a full list would otherwise open a request per
         track on load, for audio most visitors never play. */
      audio.preload = "none";
      audio.src = rec.src;
      li.append(audio);
    } else {
      const pending = document.createElement("p");
      pending.className = "recording-pending";
      pending.textContent = "Audio coming soon";
      li.append(pending);
    }

    if (rec.note) {
      const note = document.createElement("p");
      note.className = "recording-note";
      note.textContent = rec.note;
      li.append(note);
    }

    return li;
  }

  function emptyState() {
    const p = document.createElement("p");
    p.className = "recording-empty";
    p.textContent = "Nothing up yet. Check back later.";
    return p;
  }

  /* limit: how many to show (the home page teaser passes a number) */
  function renderRecordings(mountId, limit) {
    const mount = document.getElementById(mountId);
    if (!mount) return;

    const recordings = sortedRecordings();
    mount.innerHTML = "";

    if (!recordings.length) {
      mount.replaceWith(emptyState());
      return;
    }

    const shown = limit ? recordings.slice(0, limit) : recordings;
    shown.forEach(rec => mount.append(recordingItem(rec)));
  }

  window.renderRecordings = renderRecordings;
})();
