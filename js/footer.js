/* =========================================================
   THE DETAILING HANGER
   FOOTER
   LOAD COMMON FOOTER
========================================================= */

async function loadFooter() {
  const footerContainer = document.getElementById("footer");

  if (!footerContainer) {
    return;
  }

  try {
    const response = await fetch("/footer.html");

    if (!response.ok) {
      throw new Error(`Footer load failed: ${response.status}`);
    }

    const footerHTML = await response.text();

    footerContainer.innerHTML = footerHTML;
  } catch (error) {
    console.error("The Detailing Hanger Footer Error:", error);
  }
}

/* =========================================================
   START FOOTER
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  loadFooter();
});

// <!-- =========================================================
//      CURRENT TIME JAVASCRIPT footer
// ========================================================= -->

function updateCurrentTime() {
  const element = document.getElementById("currentTime");

  if (!element) {
    return;
  }

  const now = new Date();

  /* ================================
       DAY
    ================================= */

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayName = dayNames[now.getDay()];

  /* ================================
       DATE
       Example: 17 Aug 2026
    ================================= */

  const date = now.getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = monthNames[now.getMonth()];

  const year = now.getFullYear();

  const dateText = String(date).padStart(2, "0") + " " + month + " " + year;

  /* ================================
       TIME
    ================================= */

  let hours = now.getHours();

  let minutes = now.getMinutes();

  let seconds = now.getSeconds();

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;

  if (hours === 0) {
    hours = 12;
  }

  hours = String(hours).padStart(2, "0");

  minutes = String(minutes).padStart(2, "0");

  seconds = String(seconds).padStart(2, "0");

  /* ================================
       FINAL OUTPUT
    ================================= */

  element.textContent =
    dayName +
    " | " +
    dateText +
    " | " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    " " +
    ampm;
}

/* ================================
   INITIAL LOAD
================================= */
updateCurrentTime();
/* ================================
   UPDATE EVERY SECOND
================================= */

setInterval(updateCurrentTime, 1000);
