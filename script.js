// ---------------------------------------------
// Respect reduced-motion preference
// ---------------------------------------------
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// ---------------------------------------------
// Scroll progress bar + sticky nav background
// ---------------------------------------------
const scrollProgress = document.getElementById("scrollProgress");
const nav = document.getElementById("siteNav");

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + "%";

  if (nav) {
    if (scrollTop > 10) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------------------------------------------
// Terminal typewriter — cycles through what
// Amogh is actually building, per the resume
// ---------------------------------------------
const phrases = [
  "a self-hosted multilingual voice agent",
  "an RL agent that decides when models retrain",
  "a container runtime from scratch",
];

const typedEl = document.getElementById("typedText");

if (typedEl && !prefersReducedMotion) {
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 38);
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 20);
    }
  }

  setTimeout(tick, 600);
} else if (typedEl) {
  // Reduced motion: just show the first phrase, no animation loop
  typedEl.textContent = phrases[0];
}

// ---------------------------------------------
// Experience timeline: draw the connecting line
// once it scrolls into view
// ---------------------------------------------
const timeline = document.getElementById("timeline");

if (timeline) {
  if (prefersReducedMotion) {
    timeline.classList.add("in-view");
    const fill = timeline.querySelector(".timeline-fill");
    if (fill) fill.style.height = "100%";
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timeline.classList.add("in-view");
            const fill = timeline.querySelector(".timeline-fill");
            if (fill) fill.style.height = "100%";
            observer.unobserve(timeline);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(timeline);
  }
}

// ---------------------------------------------
// Resume Modal Logic
// ---------------------------------------------
const resumeModal = document.getElementById("resumeModal");
const navResumeBtn = document.getElementById("navResumeBtn");
const heroResumeBtn = document.getElementById("heroResumeBtn");
const closeResumeModal = document.getElementById("closeResumeModal");

if (resumeModal) {
  const openModal = (e) => {
    if (e) e.preventDefault();
    resumeModal.classList.add("show");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    resumeModal.classList.remove("show");
    document.body.style.overflow = "";
  };

  if (navResumeBtn) navResumeBtn.addEventListener("click", openModal);
  if (heroResumeBtn) heroResumeBtn.addEventListener("click", openModal);
  if (closeResumeModal) closeResumeModal.addEventListener("click", closeModal);

  // Close when clicking outside modal content
  window.addEventListener("click", (e) => {
    if (e.target === resumeModal) {
      closeModal();
    }
  });

  // Close when pressing Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && resumeModal.classList.contains("show")) {
      closeModal();
    }
  });
}
