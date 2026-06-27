const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -48px 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const parallaxItems = document.querySelectorAll("[data-parallax]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && parallaxItems.length) {
  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.scrollY;

    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallax || 0);
      const offset = scrollY * speed;
      item.style.transform = `translate3d(0, ${offset}px, 0)`;
    });

    ticking = false;
  };

  updateParallax();

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}

const track = document.querySelector("[data-carousel-track]");
const viewport = document.querySelector("[data-carousel-viewport]");
const nextButton = document.querySelector("[data-carousel-next]");
const prevButton = document.querySelector("[data-carousel-prev]");
const dotsWrap = document.querySelector("[data-carousel-dots]");

if (track && viewport && dotsWrap) {
  const slides = Array.from(track.children);
  let currentIndex = 0;
  let autoplayId;

  dotsWrap.innerHTML = slides
    .map(
      (_, index) =>
        `<button type="button" aria-label="Go to slide ${index + 1}" data-dot="${index}"></button>`
    )
    .join("");

  const dots = Array.from(dotsWrap.querySelectorAll("[data-dot]"));

  const renderCarousel = () => {
    const slideWidth = viewport.clientWidth;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
    });
  };

  const goTo = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    renderCarousel();
  };

  const restartAutoplay = () => {
    if (prefersReducedMotion) {
      return;
    }

    window.clearInterval(autoplayId);
    autoplayId = window.setInterval(() => {
      goTo(currentIndex + 1);
    }, 4200);
  };

  nextButton?.addEventListener("click", () => {
    goTo(currentIndex + 1);
    restartAutoplay();
  });

  prevButton?.addEventListener("click", () => {
    goTo(currentIndex - 1);
    restartAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goTo(index);
      restartAutoplay();
    });
  });

  window.addEventListener("resize", renderCarousel);
  renderCarousel();
  restartAutoplay();
}
