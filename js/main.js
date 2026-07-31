// Gate lines, rail counter, progress, and work-row behavior.
// IntersectionObserver is the fast path; a position-check sweep on
// scroll/resize/interval guarantees state even where IO delivery stalls
// (throttled or embedded tabs).
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Scroll progress bar ---
  const fill = document.getElementById("progress-fill");
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    fill.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  }

  // --- Rail counter ---
  const railCount = document.getElementById("rail-count");
  const gates = document.querySelectorAll(".gate");
  const footer = document.getElementById("contact");
  const totalStops = gates.length + (footer ? 1 : 0);
  let footerCounted = false;
  function updateRail() {
    const passed = document.querySelectorAll(".gate.passed").length + (footerCounted ? 1 : 0);
    if (railCount) railCount.textContent = Math.min(passed, totalStops) + "/" + totalStops;
  }

  function inView(el, margin) {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight * (margin || 0.95) && r.bottom > 0;
  }

  // --- Sweep: gates and progress by viewport position ---
  function sweep() {
    gates.forEach((g) => {
      if (!g.classList.contains("passed") && inView(g, 0.9)) g.classList.add("passed");
    });
    if (footer && !footerCounted && inView(footer, 0.85)) footerCounted = true;
    updateRail();
    updateProgress();
  }

  if (reduceMotion) {
    gates.forEach((g) => g.classList.add("passed"));
    footerCounted = true;
    updateRail();
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
  } else {
    window.addEventListener("scroll", sweep, { passive: true });
    window.addEventListener("resize", sweep);
    setInterval(sweep, 700);
    sweep();
  }

  // --- Smooth review records; one open row per ledger, with reading-position anchoring ---
  const rows = document.querySelectorAll("details.row");
  let rowNavigationFrame = null;

  function rowsInSameLedger(d) {
    const ledger = d.closest(".work-ledger");
    return Array.from(rows).filter((row) => row.closest(".work-ledger") === ledger);
  }

  function stopRowNavigation() {
    if (rowNavigationFrame !== null) {
      window.cancelAnimationFrame(rowNavigationFrame);
      rowNavigationFrame = null;
    }
    document.documentElement.classList.remove("row-navigation-active");
  }

  function navigateToOpenedRow(d) {
    const summary = d.querySelector("summary");
    if (!summary) return;

    stopRowNavigation();
    document.documentElement.classList.add("row-navigation-active");
    const startedAt = performance.now();
    const duration = 560;

    function positionRow(now) {
      const readingTop = window.matchMedia("(max-width: 900px)").matches ? 60 : 24;
      const distance = summary.getBoundingClientRect().top - readingTop;
      const elapsed = now - startedAt;
      const progress = Math.min(elapsed / duration, 1);
      const correction = 0.08 + (progress * 0.16);

      if (Math.abs(distance) > 0.5) {
        window.scrollBy(0, distance * correction);
      }

      if (elapsed < duration) {
        rowNavigationFrame = window.requestAnimationFrame(positionRow);
        return;
      }

      window.scrollBy(0, distance);
      stopRowNavigation();
    }

    rowNavigationFrame = window.requestAnimationFrame(positionRow);
  }

  window.addEventListener("wheel", stopRowNavigation, { passive: true });
  window.addEventListener("touchstart", stopRowNavigation, { passive: true });

  function reviewPass(d) {
    window.clearTimeout(d._reviewTimer);
    d.classList.remove("review-pass");
    void d.offsetWidth;
    d.classList.add("review-pass");
    d._reviewTimer = window.setTimeout(() => d.classList.remove("review-pass"), 900);
  }

  function animateRow(d, shouldOpen) {
    const summary = d.querySelector("summary");
    if (!summary) return;

    let startHeight = d.getBoundingClientRect().height;
    if (d._rowAnimation) {
      d._rowAnimation.cancel();
      d._rowAnimation = null;
      d.style.height = startHeight + "px";
    }

    if (shouldOpen) d.open = true;
    const endHeight = shouldOpen ? d.scrollHeight : summary.offsetHeight;
    d.classList.add("is-animating");
    d.style.height = startHeight + "px";
    d.style.overflow = "hidden";

    const animation = d.animate(
      [{ height: startHeight + "px" }, { height: endHeight + "px" }],
      { duration: 440, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
    d._rowAnimation = animation;
    if (shouldOpen) reviewPass(d);

    animation.finished.then(() => {
      if (d._rowAnimation !== animation) return;
      if (!shouldOpen) d.open = false;
      d.style.height = "";
      d.style.overflow = "";
      d.classList.remove("is-animating");
      d._rowAnimation = null;
    }).catch(() => {});
  }

  rows.forEach((d) => {
    if (reduceMotion) {
      d.addEventListener("toggle", () => {
        if (!d.open) return;
        rowsInSameLedger(d).forEach((other) => {
          if (other !== d) other.open = false;
        });
        d.querySelector("summary")?.scrollIntoView({ block: "start" });
      });
      return;
    }

    const summary = d.querySelector("summary");
    summary.addEventListener("click", (event) => {
      event.preventDefault();
      const shouldOpen = !d.open;
      if (shouldOpen) {
        rowsInSameLedger(d).forEach((other) => {
          if (other !== d && other.open) animateRow(other, false);
        });
      }
      animateRow(d, shouldOpen);
      if (shouldOpen) navigateToOpenedRow(d);
    });
  });

  // --- Documentary carousels: auto-run only while visible, with touch controls ---
  const carousels = document.querySelectorAll("[data-carousel]");
  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".speaker-track");
    const slides = Array.from(carousel.querySelectorAll(".speaker-slide"));
    const previous = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    const status = carousel.querySelector("[data-carousel-status]");
    if (!track || slides.length < 2 || !previous || !next || !status) return;

    let index = 0;
    let timer = null;
    let visible = false;
    let paused = false;
    let touchStartX = null;
    let movementTimer = null;
    const statusLines = slides.map((slide, slideIndex) => {
      const line = document.createElement("span");
      line.className = "speaker-status-line";
      line.textContent = `${String(slideIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")} · ${slide.dataset.caption}`;
      line.setAttribute("aria-hidden", "true");
      return line;
    });
    status.replaceChildren(...statusLines);

    function render(nextIndex, announce) {
      index = (nextIndex + slides.length) % slides.length;
      window.clearTimeout(movementTimer);
      track.classList.add("is-moving");
      track.style.transform = `translate3d(${-index * 100}%, 0, 0)`;
      movementTimer = window.setTimeout(() => {
        track.classList.remove("is-moving");
      }, 760);
      slides.forEach((slide, slideIndex) => {
        slide.setAttribute("aria-hidden", slideIndex === index ? "false" : "true");
      });
      status.setAttribute("aria-live", announce ? "polite" : "off");
      statusLines.forEach((line, lineIndex) => {
        const active = lineIndex === index;
        line.classList.toggle("is-active", active);
        line.setAttribute("aria-hidden", active ? "false" : "true");
      });
    }

    function stop() {
      window.clearTimeout(timer);
      timer = null;
    }

    function schedule(delay) {
      stop();
      if (reduceMotion || !visible || paused || document.hidden) return;
      timer = window.setTimeout(() => {
        render(index + 1, false);
        schedule(5200);
      }, delay || 5200);
    }

    function move(direction) {
      render(index + direction, true);
      schedule(7200);
    }

    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));

    carousel.addEventListener("mouseenter", () => {
      paused = true;
      stop();
    });
    carousel.addEventListener("mouseleave", () => {
      paused = false;
      schedule(2200);
    });
    carousel.addEventListener("focusin", () => {
      paused = true;
      stop();
    });
    carousel.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (!carousel.contains(document.activeElement)) {
          paused = false;
          schedule(2200);
        }
      }, 0);
    });

    carousel.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].clientX;
      paused = true;
      stop();
    }, { passive: true });
    carousel.addEventListener("touchend", (event) => {
      if (touchStartX === null) return;
      const distance = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(distance) > 45) render(index + (distance < 0 ? 1 : -1), true);
      paused = false;
      schedule(3200);
    }, { passive: true });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible) schedule(2200);
        else stop();
      }, { threshold: 0.35 });
      observer.observe(carousel);
    } else {
      visible = true;
      schedule(2200);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else schedule(2200);
    });

    render(0, false);
  });
})();
