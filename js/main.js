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

  // --- Smooth review records; only one row open at a time ---
  const rows = document.querySelectorAll("details.row");
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
        if (d.open) rows.forEach((other) => { if (other !== d) other.open = false; });
      });
      return;
    }

    const summary = d.querySelector("summary");
    summary.addEventListener("click", (event) => {
      event.preventDefault();
      const shouldOpen = !d.open;
      if (shouldOpen) {
        rows.forEach((other) => {
          if (other !== d && other.open) animateRow(other, false);
        });
      }
      animateRow(d, shouldOpen);
    });
  });
})();
