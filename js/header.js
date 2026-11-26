"use strict";

const headerScriptUrl = document.currentScript?.src
  ? new URL(document.currentScript.src)
  : new URL("js/header.js", window.location.href);
const siteRoot = new URL("../", headerScriptUrl);

/* =========================================================
   LOAD COMMON HEADER
========================================================= */

async function loadHeader() {
  const container = document.getElementById("header");

  if (!container) return;

  try {
    const response = await fetch(new URL("header.html", siteRoot));

    if (!response.ok) {
      throw new Error(`Header request failed: ${response.status}`);
    }

    const headerMarkup = new DOMParser()
      .parseFromString(await response.text(), "text/html")
      .querySelector("#siteHeader");

    if (!headerMarkup) {
      throw new Error("Header markup is missing #siteHeader.");
    }

    container.replaceChildren(headerMarkup);

    headerMarkup.querySelectorAll("[href^='/'], [src^='/']").forEach((element) => {
      const attribute = element.hasAttribute("href") ? "href" : "src";
      element.setAttribute(
        attribute,
        new URL(element.getAttribute(attribute).slice(1), siteRoot).href,
      );
    });

    initializeHeader(container);
  } catch (error) {
    console.error("Header loading error:", error);
  }
}

/* =========================================================
   INITIALIZE HEADER
========================================================= */

function initializeHeader(container) {
  const header = container.querySelector("#siteHeader");
  const desktopServices = container.querySelector("#desktopServices");
  const desktopServicesButton = container.querySelector(
    "#desktopServicesButton",
  );
  const desktopServicesMenu = container.querySelector("#desktopServicesMenu");
  const menuButton = container.querySelector("#mobileMenuButton");
  const mobileMenu = container.querySelector("#mobileMenu");
  const servicesButton = container.querySelector("#mobileServicesButton");
  const servicesMenu = container.querySelector("#mobileServicesMenu");

  if (!header) return;

  /* =========================================================
   ACTIVE NAVIGATION LINK
========================================================= */

  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";

  const activeClasses = ["bg-blue-600/10", "text-blue-400"];

  header.querySelectorAll("nav a[href]").forEach((link) => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, "") || "/";

    if (linkPath === currentPath) {
      link.classList.add(...activeClasses);

      link.setAttribute("aria-current", "page");
    }
  });

  /* Reserve space for fixed header. */
  function updateHeaderSpace() {
    container.style.height = `${header.offsetHeight}px`;
  }

  updateHeaderSpace();

  window.addEventListener("resize", updateHeaderSpace, {
    passive: true,
  });

  if ("ResizeObserver" in window) {
    const headerObserver = new ResizeObserver(updateHeaderSpace);
    headerObserver.observe(header);
  }

  let desktopServicesPinned = false;

  function setDesktopServicesMenu(open) {
    if (!desktopServicesButton || !desktopServicesMenu) return;

    desktopServicesButton.setAttribute("aria-expanded", String(open));
    desktopServicesMenu.setAttribute("aria-hidden", String(!open));
    desktopServicesMenu.inert = !open;
    desktopServicesMenu.classList.toggle("invisible", !open);
    desktopServicesMenu.classList.toggle("visible", open);
    desktopServicesMenu.classList.toggle("translate-y-2", !open);
    desktopServicesMenu.classList.toggle("translate-y-0", open);
    desktopServicesMenu.classList.toggle("opacity-0", !open);
    desktopServicesMenu.classList.toggle("opacity-100", open);
    desktopServicesButton
      .querySelector(".services-chevron")
      ?.classList.toggle("rotate-[225deg]", open);
  }

  desktopServices?.addEventListener("pointerenter", () => {
    setDesktopServicesMenu(true);
  });

  desktopServices?.addEventListener("pointerleave", () => {
    if (!desktopServicesPinned) {
      setDesktopServicesMenu(false);
    }
  });

  desktopServices?.addEventListener("focusin", () => {
    setDesktopServicesMenu(true);
  });

  desktopServices?.addEventListener("focusout", (event) => {
    if (
      !desktopServicesPinned &&
      !desktopServices.contains(event.relatedTarget)
    ) {
      setDesktopServicesMenu(false);
    }
  });

  desktopServicesButton?.addEventListener("click", () => {
    desktopServicesPinned = !desktopServicesPinned;
    setDesktopServicesMenu(desktopServicesPinned);
  });

  desktopServicesMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      desktopServicesPinned = false;
      setDesktopServicesMenu(false);
    });
  });

  /* MOBILE SERVICES SUBMENU */
  function setServicesMenu(open) {
    if (!servicesButton || !servicesMenu) return;

    servicesButton.setAttribute("aria-expanded", String(open));
    servicesMenu.setAttribute("aria-hidden", String(!open));
    servicesMenu.inert = !open;

    servicesMenu.classList.toggle("grid-rows-[0fr]", !open);
    servicesMenu.classList.toggle("grid-rows-[1fr]", open);
    servicesMenu.classList.toggle("opacity-0", !open);
    servicesMenu.classList.toggle("opacity-100", open);
    servicesButton
      .querySelector(".services-chevron")
      ?.classList.toggle("rotate-[225deg]", open);

    updateHeaderSpace();
  }

  /* MOBILE NAVIGATION */
  function setMobileMenu(open) {
    if (!menuButton || !mobileMenu) return;

    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );

    mobileMenu.setAttribute("aria-hidden", String(!open));
    mobileMenu.inert = !open;

    mobileMenu.classList.toggle("max-h-0", !open);
    mobileMenu.classList.toggle("max-h-[calc(100dvh-68px)]", open);
    mobileMenu.classList.toggle("opacity-0", !open);
    mobileMenu.classList.toggle("opacity-100", open);
    menuButton.querySelectorAll(".menu-bar").forEach((bar, index) => {
      bar.classList.toggle("translate-y-[7px]", open && index === 0);
      bar.classList.toggle("rotate-45", open && index === 0);
      bar.classList.toggle("opacity-0", open && index === 1);
      bar.classList.toggle("-translate-y-[7px]", open && index === 2);
      bar.classList.toggle("-rotate-45", open && index === 2);
    });

    if (!open) {
      setServicesMenu(false);
    }

    updateHeaderSpace();
  }

  /* Hamburger button */
  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMobileMenu(!isOpen);
  });

  /* Services arrow button */
  servicesButton?.addEventListener("click", () => {
    const isOpen = servicesButton.getAttribute("aria-expanded") === "true";

    setServicesMenu(!isOpen);
  });

  /* Close menu after clicking any mobile navigation link. */
  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMobileMenu(false);
    });
  });

  /* Close mobile menu when clicking outside the header. */
  document.addEventListener("click", (event) => {
    if (
      menuButton &&
      mobileMenu &&
      !container.contains(event.target) &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      setMobileMenu(false);
    }

    if (desktopServices && !desktopServices.contains(event.target)) {
      desktopServicesPinned = false;
      setDesktopServicesMenu(false);
    }
  });

  /* Close with Escape key. */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileMenu(false);
      desktopServicesPinned = false;
      setDesktopServicesMenu(false);
    }
  });

  /* Reset mobile navigation on desktop breakpoint. */
  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth >= 1024) {
        setMobileMenu(false);
      } else {
        desktopServicesPinned = false;
        setDesktopServicesMenu(false);
      }
    },
    { passive: true },
  );

  /* HEADER HIDE / SHOW ON SCROLL */
  let lastScrollPosition = window.scrollY;
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;

      ticking = true;

      window.requestAnimationFrame(() => {
        const currentScrollPosition = window.scrollY;
        const mobileMenuOpen =
          menuButton?.getAttribute("aria-expanded") === "true";

        if (mobileMenuOpen || currentScrollPosition <= 10) {
          header.classList.remove("-translate-y-full");
        } else if (currentScrollPosition > lastScrollPosition + 5) {
          header.classList.add("-translate-y-full");
        } else if (currentScrollPosition < lastScrollPosition - 5) {
          header.classList.remove("-translate-y-full");
        }

        lastScrollPosition = currentScrollPosition;
        ticking = false;
      });
    },
    { passive: true },
  );
}

/* =========================================================
   START
========================================================= */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadHeader, {
    once: true,
  });
} else {
  loadHeader();
}
