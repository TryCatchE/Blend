/* =========================
   PHONE MODAL
========================= */

const phoneForm = document.querySelector("#phone-form");
const phoneModal = document.querySelector(".phone-modal");
const phoneInput = document.querySelector("#visitor-phone");
const contactLinks = document.querySelectorAll(".contact-link");

if (phoneForm) {
  phoneForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const phoneDigits = phoneInput.value.replace(/\D/g, "");

    const digitsWithoutPrefix = phoneInput.value.trim().startsWith("00")
      ? phoneDigits.slice(2)
      : phoneDigits;

    const internationalDigits = digitsWithoutPrefix.startsWith("30")
      ? digitsWithoutPrefix
      : `30${digitsWithoutPrefix}`;

    contactLinks[0].href = `tel:+${internationalDigits}`;
    contactLinks[1].href = `viber://chat?number=%2B${internationalDigits}`;
    contactLinks[2].href = `https://wa.me/${internationalDigits}`;

    phoneModal.hidden = true;
  });
}


/* =========================
   PORTFOLIO
========================= */

const portfolioTrack = document.querySelector("#portfolio-track");

let track = portfolioTrack;
let items = portfolioTrack ? [...portfolioTrack.children] : [];

const carousel = document.querySelector(".carousel");
const portfolioArrows = [...document.querySelectorAll(".arrow")];

let page = 0;
let perPage;
let pages;


async function loadPortfolio() {
  if (!portfolioTrack) return;

  try {
    const response = await fetch("portfolio.json");

    if (!response.ok) {
      throw new Error("Could not load portfolio.json");
    }

    const portfolio = await response.json();

    portfolioTrack.innerHTML = portfolio
      .map((item) => `
        <a
          class="portfolio-item glightbox"
          href="${item.image}"
          data-gallery="portfolio"
        >
          <img
            src="${item.image}"
            alt="${item.alt || "Portfolio project"}"
          />
        </a>
      `)
      .join("");

    track = portfolioTrack;
    items = [...track.children];

    renderPortfolio();

    GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
      closeButton: true
    });

  } catch (error) {
    console.error("Portfolio loading error:", error);
  }
}


function renderPortfolio() {
  if (!track || !items.length || !carousel) return;

  const carouselGap =
    parseFloat(getComputedStyle(carousel).columnGap) || 0;

  const arrowSpace =
    portfolioArrows[0].getBoundingClientRect().width + carouselGap;

  carousel.style.setProperty(
    "--arrow-space",
    `${arrowSpace}px`
  );

  const columns =
    getComputedStyle(track)
      .gridTemplateColumns
      .split(" ")
      .length;

  perPage = columns * 2;

  pages = Math.ceil(items.length / perPage);

  page = page % pages;

  const firstItem = items[0];

  const gap =
    parseFloat(getComputedStyle(track).rowGap) || 0;

  track.style.minHeight =
    `${firstItem.getBoundingClientRect().height * 2 + gap}px`;

  items.forEach((el, i) => {
    el.style.display =
      i >= page * perPage &&
      i < page * perPage + perPage
        ? ""
        : "none";
  });
}


/* Portfolio arrows */

document.querySelectorAll(".arrow").forEach((button) => {
  button.addEventListener("click", () => {
    if (!pages) return;

    page =
      (page + Number(button.dataset.dir) + pages) %
      pages;

    renderPortfolio();
  });
});


window.addEventListener("resize", renderPortfolio);


/* =========================
   SERVICES ACCORDION
========================= */

const accordion =
  document.querySelector("#services .accordion");

if (accordion) {

  const details =
    [...accordion.querySelectorAll("details")];


  function closeDetail(detail) {
    const listWrap =
      detail.querySelector(".service-list-wrap");

    if (!detail.open) {
      return Promise.resolve();
    }

    detail.dataset.animating = "true";

    listWrap.style.height =
      `${listWrap.scrollHeight}px`;

    return new Promise((resolve) => {

      listWrap.addEventListener(
        "transitionend",
        () => {

          detail.open = false;

          listWrap.style.height = "0px";

          delete detail.dataset.animating;

          resolve();

        },
        { once: true }
      );

      requestAnimationFrame(() => {
        listWrap.style.height = "0px";
      });

    });
  }


  function openDetail(detail) {
    const listWrap =
      detail.querySelector(".service-list-wrap");

    detail.dataset.animating = "true";

    detail.open = true;

    listWrap.style.height = "0px";

    const targetHeight =
      listWrap.scrollHeight;

    return new Promise((resolve) => {

      listWrap.addEventListener(
        "transitionend",
        () => {

          listWrap.style.height = "auto";

          delete detail.dataset.animating;

          resolve();

        },
        { once: true }
      );

      requestAnimationFrame(() => {
        listWrap.style.height =
          `${targetHeight}px`;
      });

    });
  }


  details.forEach((detail) => {

    const summary =
      detail.querySelector("summary");

    summary.addEventListener(
      "click",
      async (event) => {

        event.preventDefault();

        if (detail.dataset.animating) {
          return;
        }

        if (detail.open) {
          await closeDetail(detail);
          return;
        }

        const openDetails =
          details.filter(
            (other) =>
              other !== detail &&
              other.open
          );

        await Promise.all(
          openDetails.map(closeDetail)
        );

        await openDetail(detail);

      }
    );

  });

}


/* =========================
   START
========================= */

loadPortfolio();
