const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

// Hide navbar on scroll down, show on scroll up
let lastScrollTop = 0;
window.addEventListener("scroll", () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop && scrollTop > 80) {
    navbar.classList.add("hidden");
  } else {
    navbar.classList.remove("hidden");
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Mobile menu toggle
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  mobileMenu.classList.toggle("open");
});

// Close mobile menu when link is clicked
document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    mobileMenu.classList.remove("open");
  });
});

// ===== HERO CAROUSEL LOGIC =====
(function () {
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  let heroIndex = 0;
  let heroTimer;

  function showHeroSlide(i) {
    heroSlides.forEach((s) => s.classList.remove('active'));
    heroDots.forEach((d) => d.classList.remove('active'));
    heroSlides[i].classList.add('active');
    heroDots[i].classList.add('active');
    heroIndex = i;
  }

  function nextHeroSlide() {
    heroIndex = (heroIndex + 1) % heroSlides.length;
    showHeroSlide(heroIndex);
  }

  // Auto slide every 7s
  heroTimer = setInterval(nextHeroSlide, 10000);

  // Manual dot control
  heroDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(heroTimer);
      showHeroSlide(i);
      heroTimer = setInterval(nextHeroSlide, 10000);
    });
  });

  // Pause on hover
  const heroSection = document.querySelector('.hero-carousel');
  heroSection.addEventListener('mouseenter', () => clearInterval(heroTimer));
  heroSection.addEventListener('mouseleave', () => (heroTimer = setInterval(nextHeroSlide, 7000)));
})();




document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".services-row");
  const track = document.querySelector(".services-track");
  const originalCards = Array.from(track.children);
  let animationId;
  let isMobile = window.innerWidth < 768;
  let speed = 1.0; // Slightly faster for mobile
  let isHovered = false;
  let initialized = false;

  function initCarousel() {
    if (initialized) return;

    // Clone elements for infinite scroll
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.classList.add('clone-card');
      track.appendChild(clone);
    });

    initialized = true;
    animate();
  }

  function destroyCarousel() {
    if (!initialized) return;

    // Stop animation
    cancelAnimationFrame(animationId);

    // Remove clones
    const clones = track.querySelectorAll('.clone-card');
    clones.forEach(clone => clone.remove());

    // Reset scroll and transform
    container.scrollLeft = 0;

    initialized = false;
  }

  function animate() {
    if (!isMobile) return;

    if (!isHovered) {
      // Use scrollLeft for movement (compatible with overflow-x-auto)
      container.scrollLeft += speed;

      // Infinite scroll reset
      // Note: scrollWidth grows as we scroll? No, scrollWidth is total.
      // We assume clones double the width. Reset when we reach half.
      if (container.scrollLeft >= track.scrollWidth / 2) {
        container.scrollLeft = 0; // Check if this causes a jump. 
        // If exact half is 0, it wraps.
      }
    }
    animationId = requestAnimationFrame(animate);
  }

  // Event listeners
  container.addEventListener("mouseenter", () => (isHovered = true));
  container.addEventListener("mouseleave", () => (isHovered = false));
  container.addEventListener("touchstart", () => (isHovered = true));
  container.addEventListener("touchend", () => {
    setTimeout(() => isHovered = false, 1000);
  });

  // Handle resize
  window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth < 768;
    if (newIsMobile !== isMobile) {
      isMobile = newIsMobile;
      if (isMobile) {
        initCarousel();
      } else {
        destroyCarousel();
      }
    }
  });

  // Start if mobile
  if (isMobile) {
    initCarousel();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".product-tabs .tab");
  const slides = document.querySelectorAll(".product-slide");
  let current = 0;
  let autoSlide;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
      tabs[i].classList.toggle("active", i === index);
    });
    current = index;
  }

  function startAutoSlide() {
    autoSlide = setInterval(() => {
      current = (current + 1) % slides.length;
      showSlide(current);
    }, 6000);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      showSlide(index);
      clearInterval(autoSlide);
      startAutoSlide();
    });
  });

  const slider = document.querySelector(".product-slider");
  slider.addEventListener("mouseenter", () => clearInterval(autoSlide));
  slider.addEventListener("mouseleave", startAutoSlide);

  showSlide(0);
  startAutoSlide();
});

const reviews = document.querySelector('.reviews-container');
let scrollDir = 1;
setInterval(() => {
  reviews.scrollBy({ left: 320 * scrollDir, behavior: 'smooth' });
  if (reviews.scrollLeft + reviews.clientWidth >= reviews.scrollWidth || reviews.scrollLeft <= 0) {
    scrollDir *= -1;
  }
}, 3500);
