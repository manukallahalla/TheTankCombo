/* Tank! testimonials & feedback — the single place to edit.
 *
 * People send a testimonial or private feedback through the form on
 * testimonials/index.html; each one arrives as an email to
 * thetankcombo@gmail.com (subject says which). Feedback is never posted. Nothing goes on the site
 * by itself. To publish one (only if they ticked "OK to post"), copy it into
 * the array below. Newest first.
 *
 * Each entry: quote is required; name, role and date (YYYY-MM-DD) are optional.
 *
 *   { quote: "They made our party.", name: "Jane D.",
 *     role: "Greenmeadow Memorial Day organiser", date: "2026-05-25" },
 */
const TESTIMONIALS = [];

/* ---------- form ---------- */

/* Where submissions go. FormSubmit (formsubmit.co) forwards each one as an
   email: no account, no server. The very first submission sends an
   activation email to this address; click the link in it once, then the form
   works. Afterwards FormSubmit gives you a random alias you can put here
   instead of the address to keep it out of the page source. */
const TESTIMONIAL_INBOX = "thetankcombo@gmail.com";

/* ---------- rendering ---------- */

function testimonialItem(t) {
  const li = document.createElement("li");
  li.className = "testimonial";

  const quote = document.createElement("blockquote");
  const p = document.createElement("p");
  p.textContent = t.quote;
  quote.append(p);
  li.append(quote);

  if (t.name || t.role) {
    const who = document.createElement("p");
    who.className = "testimonial-who";
    if (t.name) {
      const name = document.createElement("span");
      name.className = "testimonial-name";
      name.textContent = t.name;
      who.append(name);
    }
    if (t.role) {
      const role = document.createElement("span");
      role.className = "testimonial-role";
      role.textContent = t.role;
      who.append(role);
    }
    li.append(who);
  }
  return li;
}

function renderTestimonials(mountId, limit) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.innerHTML = "";

  if (!TESTIMONIALS.length) {
    const p = document.createElement("p");
    p.className = "gig-empty";
    p.textContent = "No testimonials up yet. Seen us play? Be the first.";
    mount.replaceWith(p);
    return;
  }

  const shown = limit ? TESTIMONIALS.slice(0, limit) : TESTIMONIALS;
  shown.forEach(t => mount.append(testimonialItem(t)));
}

/* The form works without JavaScript (a plain POST to FormSubmit, which then
   shows its own thank-you page). With JavaScript we send it in the background
   and show the thank-you right here instead. */
function wireTestimonialForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.action = `https://formsubmit.co/${TESTIMONIAL_INBOX}`;
  const status = form.querySelector(".form-status");
  const button = form.querySelector("button[type=submit]");

  /* Testimonial vs private feedback: feedback is never posted, so it hides the
     "OK to post" box, makes the name optional and changes the email subject. */
  const isFeedback = () => form.elements.type.value === "Feedback";
  function syncType() {
    const fb = isFeedback();
    form.querySelectorAll("[data-for=feedback]").forEach(el => el.hidden = !fb);
    form.querySelectorAll("[data-for=testimonial]").forEach(el => el.hidden = fb);
    form.elements.name.required = !fb;
    form.elements._subject.value = fb ? "New feedback for Tank!" : "New testimonial for Tank!";
    document.getElementById("t-message-label").textContent = fb ? "Your feedback" : "Your testimonial";
  }
  form.querySelectorAll("input[name=type]").forEach(r => r.addEventListener("change", syncType));
  syncType();

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    button.disabled = true;
    status.className = "form-status";
    status.textContent = "Sending…";

    const data = Object.fromEntries(new FormData(form));
    if (isFeedback()) delete data.ok_to_post;
    else data.ok_to_post = data.ok_to_post ? "Yes" : "No";

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${TESTIMONIAL_INBOX}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || String(body.success) === "false") throw new Error(body.message);

      form.reset();
      syncType();
      status.className = "form-status is-ok";
      status.textContent = "Thanks! We got it. We read every one.";
    } catch (err) {
      status.className = "form-status is-error";
      status.innerHTML = "";
      status.append(
        "That didn't send. Try again, or email it to ",
        Object.assign(document.createElement("a"), {
          href: "mailto:thetankcombo@gmail.com?subject=Feedback%20for%20Tank!",
          textContent: "thetankcombo@gmail.com"
        }),
        "."
      );
    } finally {
      button.disabled = false;
    }
  });
}
