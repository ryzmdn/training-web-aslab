"use strict";

const sidebar = document.getElementById("sidebar");
const backdrop = document.querySelector('[role="dialog-backdrop"]');

function openSidebar(targetId) {
  if (targetId === "sidebar") {
    sidebar.removeAttribute("data-closed");
    document.body.style.overflow = "hidden";
  }
}

function closeSidebar(targetId) {
  if (targetId === "sidebar") {
    sidebar.setAttribute("data-closed", "");
    document.body.style.overflow = "auto";
  }
}

document.querySelectorAll("[command]").forEach((button) => {
  button.addEventListener("click", () => {
    const command = button.getAttribute("command");
    const commandFor = button.getAttribute("commandfor");

    if (command === "show-modal") {
      openSidebar(commandFor);
    } else if (command === "close") {
      closeSidebar(commandFor);
    }
  });
});

if (backdrop) {
  backdrop.addEventListener("click", () => {
    closeSidebar("sidebar");
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !sidebar.hasAttribute("data-closed")) {
    closeSidebar("sidebar");
  }
});

sidebar.setAttribute("data-closed", "");

function setActiveMenu() {
  const currentPage = window.location.pathname.split("/").pop().split(".")[0] || "index";

  const allLinks = document.querySelectorAll(
    ".dialog__panel-link, .desktop__sidebar-nav-item"
  );

  allLinks.forEach((link) => link.classList.remove("active"));

  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const pageInHref = href.split("/").pop().split(".")[0] || "index";

    if (
      pageInHref === currentPage ||
      (currentPage === "index" && (href === "#" || href === "index.html"))
    ) {
      link.classList.add("active");
    }
  });
}

setActiveMenu();

window.addEventListener("hashchange", setActiveMenu);