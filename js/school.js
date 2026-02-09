// ----------------- HAMBURGER TOGGLE -----------------
const toggle = document.getElementById("menuToggle");
const menu = document.getElementById("mobileMenu");
const navbar = document.getElementById("navbar");

toggle.addEventListener("click", () => {
  toggle.classList.toggle("active");
  menu.classList.toggle("open");
});

// Close mobile menu when link is clicked
document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    toggle.classList.remove("active");
    menu.classList.remove("open");
  });
});

// ----------------- NAVBAR HIDE ON SCROLL -----------------
let lastScroll = 0;

window.addEventListener("scroll", () => {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScroll && currentScroll > 80) {
    navbar.classList.add("hidden");
  } else {
    navbar.classList.remove("hidden");
  }

  lastScroll = currentScroll <= 0 ? 0 : currentScroll;
});

// ----------------- REVEAL ON SCROLL -----------------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ----------------- LEFT-SIDE EXPANDING CARDS -----------------
const expandButtons = document.querySelectorAll(".toggle-info");

expandButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".course-card");
    const back = card.querySelector(".course-back");
    const icon = btn.querySelector("i");

    // Close all other open cards
    document.querySelectorAll(".course-back.active").forEach((other) => {
      if (other !== back) {
        other.classList.remove("active");
      }
    });

    // Remove rotation on all icons
    document.querySelectorAll(".toggle-info i").forEach((ic) => {
      if (ic !== icon) ic.classList.remove("rotate");
    });

    // Toggle this card
    back.classList.toggle("active");
    icon.classList.toggle("rotate");
  });
});
