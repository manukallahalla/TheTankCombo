/* Tank! gig history — the single place to edit.
 *
 * Both the short teaser on the home page and the full list on gigs/index.html
 * read from this array, so adding a show here updates both. To add a gig:
 * drop its page in gigs/ and add an entry below; `link` is the filename,
 * relative to the gigs/ folder.
 *
 * Each entry: date is YYYY-MM-DD; note is optional and may be left out.
 *
 *   { date: "2026-05-12", venue: "The Blue Room", city: "Oakland, CA",
 *     note: "Opening for the Ellis Quartet", link: "blue-room.html" },
 */
const GIGS = [
  {
    date: "2026-05-25",
    venue: "Greenmeadow Lawn",
    city: "Palo Alto, CA",
    note: "Memorial Day Celebration",
    link: "greenmeadow.html"
  }
];

/* Upcoming shows, listed on gigs/upcoming.html (soonest first). Once a show
 * has happened it drops off that page by itself; move it into GIGS above
 * when its photos page is ready.
 *
 * Same fields as GIGS, plus optional `time` and `address`. `link` here is a
 * full URL (event / ticket page) and `linkText` labels it. Optional `page` is
 * a details page in gigs/; when set, clicking anywhere on the card opens it.
 */
const UPCOMING_GIGS = [
  {
    date: "2026-10-25",
    time: "12pm – 1pm",
    venue: "Magical Bridge Gig",
    address: "Magical Bridge Playground, 3700 Middlefield Rd",
    city: "Palo Alto, CA",
    note: "A full hour of Tank! horns and Halloween tunes. Bring your costume and come dance with us.",
    link: "https://www.magicalbridge.org/event-details/halloween-costume-party",
    linkText: "Event info →",
    page: "magical-bridge.html"
  },
  {
    date: "2026-11-07",
    time: "1:45pm – 2:30pm",
    venue: "YCS Gig",
    address: "First Presbyterian Church, 1140 Cowper St",
    city: "Palo Alto, CA",
    note: "We're bringing a jazzy afternoon set to YCS's United We Rise celebration. Come hear us play.",
    link: "https://www.youthcommunityservice.org/unitedwerise2026?blm_aid=581900341",
    linkText: "Tickets & info →",
    page: "ycs.html"
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

function sortedGigs() {
  return [...GIGS].sort((a, b) => b.date.localeCompare(a.date));
}

function gigItem(gig, basePath) {
  const li = document.createElement("li");
  li.className = "gig";

  const time = document.createElement("time");
  time.className = "gig-date";
  time.dateTime = gig.date;
  time.textContent = formatDate(gig.date);

  const venue = document.createElement("p");
  venue.className = "gig-venue";
  venue.textContent = gig.venue;

  if (gig.time) time.textContent += ` · ${gig.time}`;

  li.append(time, venue);

  const place = [gig.address, gig.city].filter(Boolean).join(", ");
  if (place) {
    const city = document.createElement("p");
    city.className = "gig-city";
    city.textContent = place;
    li.append(city);
  }
  if (gig.note) {
    const note = document.createElement("p");
    note.className = "gig-note";
    note.textContent = gig.note;
    li.append(note);
  }
  if (gig.link) {
    const link = document.createElement("a");
    link.className = "gig-link";
    link.href = (basePath || "") + gig.link;
    link.textContent = gig.linkText || "View photos & media →";
    li.append(link);
  }
  return li;
}

function emptyState(text) {
  const p = document.createElement("p");
  p.className = "gig-empty";
  p.textContent = text || "Nothing on the list yet. Check back later.";
  return p;
}

/* limit: how many to show (the home page teaser passes a number).
   basePath: prefix for each gig's `link`, since the page rendering the list
   may sit at the site root (pass "gigs/") or inside gigs/ (pass "" / omit). */
function renderGigs(mountId, limit, basePath) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  const gigs = sortedGigs();
  mount.innerHTML = "";

  if (!gigs.length) {
    mount.replaceWith(emptyState());
    return;
  }

  const shown = limit ? gigs.slice(0, limit) : gigs;
  shown.forEach(gig => mount.append(gigItem(gig, basePath)));
}

/* Today as YYYY-MM-DD in the viewer's local time, to compare against `date`. */
function todayIso() {
  const now = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/* Upcoming shows, soonest first, skipping any whose date has passed. Links
   are full URLs, so no basePath. */
function renderUpcomingGigs(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  const today = todayIso();
  const gigs = UPCOMING_GIGS
    .filter(gig => gig.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  mount.innerHTML = "";

  if (!gigs.length) {
    mount.replaceWith(emptyState("Nothing booked right now. Check back soon, or book us yourself."));
    return;
  }

  gigs.forEach(gig => {
    const li = gigItem(gig);
    const link = li.querySelector(".gig-link");
    if (link) { link.target = "_blank"; link.rel = "noopener"; }
    if (gig.page) {
      const card = document.createElement("a");
      card.className = "gig-card-link";
      card.href = gig.page;
      card.setAttribute("aria-label", `${gig.venue} details`);
      li.classList.add("gig-clickable");
      li.prepend(card);
    }
    mount.append(li);
  });
}
