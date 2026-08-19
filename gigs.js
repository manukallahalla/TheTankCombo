/* Tank! gig history — the single place to edit.
 *
 * Both the short teaser on the home page and the full list on gigs.html
 * read from this array, so adding a show here updates both.
 *
 * Each entry: date is YYYY-MM-DD; note is optional and may be left out.
 *
 *   { date: "2026-05-12", venue: "The Blue Room", city: "Oakland, CA",
 *     note: "Opening for the Ellis Quartet" },
 */
const GIGS = [
  // Add gigs here, newest or oldest — order does not matter, they get sorted.
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

function gigItem(gig) {
  const li = document.createElement("li");
  li.className = "gig";

  const time = document.createElement("time");
  time.className = "gig-date";
  time.dateTime = gig.date;
  time.textContent = formatDate(gig.date);

  const venue = document.createElement("p");
  venue.className = "gig-venue";
  venue.textContent = gig.venue;

  li.append(time, venue);

  if (gig.city) {
    const city = document.createElement("p");
    city.className = "gig-city";
    city.textContent = gig.city;
    li.append(city);
  }
  if (gig.note) {
    const note = document.createElement("p");
    note.className = "gig-note";
    note.textContent = gig.note;
    li.append(note);
  }
  return li;
}

function emptyState() {
  const p = document.createElement("p");
  p.className = "gig-empty";
  p.textContent = "Nothing on the list yet. Check back later.";
  return p;
}

/* limit: how many to show (the home page teaser passes a number) */
function renderGigs(mountId, limit) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  const gigs = sortedGigs();
  mount.innerHTML = "";

  if (!gigs.length) {
    mount.replaceWith(emptyState());
    return;
  }

  const shown = limit ? gigs.slice(0, limit) : gigs;
  shown.forEach(gig => mount.append(gigItem(gig)));
}
