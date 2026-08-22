const nav = document.querySelector(".nav");

function updateStickyNav() {
  const isScrolled = window.scrollY > 0;
  nav.classList.toggle("is-scrolled", isScrolled);
}

window.addEventListener("scroll", updateStickyNav, { passive: true });
updateStickyNav();
