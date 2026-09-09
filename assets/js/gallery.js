/* Tank! — gig gallery lightbox.
 *
 * Shared by every gig gallery page. Expects the markup pattern in
 * greenmeadow.html: .gallery-item img thumbnails, and one #lightbox overlay
 * with a .lightbox-content img and a .lightbox-close button. Styling lives in
 * styles.css. Self-contained; just add <script src="gallery.js"> before </body>.
 */
(function () {
  "use strict";

  function start() {
    const lightbox = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".lightbox-close");
    const thumbs = document.querySelectorAll(".gallery-item img");
    if (!lightbox || !img || !thumbs.length) return;

    let lastFocused = null;

    function open(thumb) {
      lastFocused = document.activeElement;
      img.src = thumb.currentSrc || thumb.src;
      img.alt = thumb.alt;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      img.removeAttribute("src");
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => open(thumb));
    });

    if (closeBtn) closeBtn.addEventListener("click", close);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("active")) close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
