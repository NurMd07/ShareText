const menuToggle = document.querySelector(".auth-menu-toggle");
const menu = document.querySelector("#auth-page-menu");
const aboutOverlay = document.querySelector("[data-auth-about-overlay]");
const aboutButton = document.querySelector("[data-auth-about]");
const aboutClose = aboutOverlay.querySelector(".auth-about-close");

function setMenuOpen(isOpen) {
  menu.hidden = !isOpen;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function closeAbout() {
  aboutOverlay.hidden = true;
  menuToggle.focus();
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menu.hidden);
});

aboutButton.addEventListener("click", () => {
  setMenuOpen(false);
  aboutOverlay.hidden = false;
  aboutClose.focus();
});

aboutClose.addEventListener("click", closeAbout);

aboutOverlay.addEventListener("click", (event) => {
  if (event.target === aboutOverlay) {
    closeAbout();
  }
});

document.addEventListener("click", (event) => {
  if (!menu.hidden && !event.target.closest(".auth-page-menu")) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!aboutOverlay.hidden) {
      closeAbout();
    } else if (!menu.hidden) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  }
});
