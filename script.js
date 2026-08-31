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
