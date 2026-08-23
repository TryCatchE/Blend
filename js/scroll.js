const nav = document.querySelector(".nav");
const root = document.documentElement;

function updatePage() {
  const scrollY = window.scrollY;

  nav.classList.toggle("is-scrolled", scrollY > 0);

  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = maxScroll > 0
    ? Math.min(scrollY / maxScroll, 1)
    : 0;

  const angle = 115 + progress * 360;

  root.style.setProperty(
    "--gradient-angle",
    `${angle}deg`
  );
}

window.addEventListener("scroll", updatePage, {
  passive: true
});

updatePage();