// Hero board: kanban where every card is a model card.
// Cards advance AI DRAFT → HUMAN REVIEW → EVAL → SHIPPED; ~15% fail at eval
// (metric flips red, strike, fall off the board). The static cards in the
// HTML are the no-JS / reduced-motion state; this script replaces them with
// a live loop when motion is allowed.
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var board = document.getElementById("board");
  if (!board || reduceMotion) return; // static seeded state stays

  var colEls = {};
  board.querySelectorAll(".col").forEach(function (c) { colEls[c.dataset.col] = c; });
  var ORDER = ["draft", "review", "eval", "shipped"];

  var TASKS = [
    "query reformulation", "grounding eval", "essay score repeatability",
    "retrieval reranker", "retinal model validation", "glaucoma recall review",
    "severity bias analysis", "Grad-CAM inspection", "human review thresholds",
    "cohort consistency check", "JSON schema validation", "acceptance criteria"
  ];

  var runN = 47;
  var shipped = 132, rejected = 23;
  var spawnsSinceAbdiel = 0;
  var boardVisible = false;
  var tickTimer = null;
  var maintainTimer = null;
  var tShipped = document.getElementById("t-shipped");
  var tRejected = document.getElementById("t-rejected");

  function updateCounts() {
    ORDER.forEach(function (k) {
      colEls[k].querySelector(".count").textContent =
        colEls[k].querySelectorAll(".card").length;
    });
    if (tShipped) tShipped.textContent = shipped;
    if (tRejected) tRejected.textContent = rejected;
  }

  function cardEl(data) {
    var el = document.createElement("article");
    el.className = "card" + (data.abdiel ? " abdiel" : "");
    el.innerHTML =
      '<span class="cid"></span><span class="ctask"></span>' +
      '<span class="cmetric"></span><span class="cowner"></span>';
    el.querySelector(".cid").textContent = data.id;
    el.querySelector(".ctask").textContent = data.task;
    el.querySelector(".cmetric").textContent = data.metricText;
    el.querySelector(".cowner").textContent = data.owner;
    el._data = data;
    return el;
  }

  function makeCard(forceAbdiel) {
    if (forceAbdiel) {
      return cardEl({
        abdiel: true, rejected: false,
        id: "abdiel v2.0", task: "role: engineer → pm",
        metricText: "eval pending", passText: "eval: passed",
        owner: "owner: still human"
      });
    }
    runN += 1;
    var failing = Math.random() < 0.15;
    var passVal = (0.88 + Math.random() * 0.11).toFixed(2);
    var failVal = (0.55 + Math.random() * 0.15).toFixed(2);
    return cardEl({
      abdiel: false, rejected: failing,
      id: "run-" + String(runN).padStart(3, "0"),
      task: TASKS[(Math.random() * TASKS.length) | 0],
      metricText: "eval pending",
      passText: "eval " + passVal + " ✓",
      failText: "eval " + failVal + " ✗",
      owner: "owner: human"
    });
  }

  // FLIP move; inline styles are cleared afterwards so class transitions
  // (.fall, .fadeout) are never overridden.
  function moveTo(card, colKey) {
    var first = card.getBoundingClientRect();
    colEls[colKey].querySelector(".cards").appendChild(card);
    var last = card.getBoundingClientRect();
    var dx = first.left - last.left, dy = first.top - last.top;
    if (dx || dy) {
      card.style.transition = "none";
      card.style.transform = "translate(" + dx + "px," + dy + "px)";
      card.getBoundingClientRect();
      card.style.transition = "transform 0.7s cubic-bezier(0.22,1,0.36,1)";
      card.style.transform = "";
      setTimeout(function () {
        card.style.transition = "";
        card.style.transform = "";
      }, 750);
    }
    updateCounts();
  }

  function spawn(colKey) {
    spawnsSinceAbdiel += 1;
    var isAbdiel = spawnsSinceAbdiel >= 8;
    if (isAbdiel) spawnsSinceAbdiel = 0;
    var card = makeCard(isAbdiel);
    card.style.opacity = "0";
    colEls[colKey].querySelector(".cards").appendChild(card);
    card.getBoundingClientRect();
    card.style.transition = "opacity 0.5s ease";
    card.style.opacity = "1";
    setTimeout(function () {
      card.style.transition = "";
      card.style.opacity = "";
    }, 550);
    updateCounts();
    return card;
  }

  function reject(card) {
    card.classList.add("failing");
    card.querySelector(".cmetric").textContent = card._data.failText;
    setTimeout(function () { card.classList.add("struck"); }, 550);
    setTimeout(function () {
      card.style.transition = "";
      card.style.transform = "";
      card.style.opacity = "";
      card.classList.add("fall");
    }, 1250);
    setTimeout(function () {
      card.remove();
      rejected += 1;
      updateCounts();
    }, 2250);
  }

  function ship(card) {
    card.querySelector(".cmetric").textContent = card._data.passText;
    moveTo(card, "shipped");
    shipped += 1;
    updateCounts();
    // keep shipped column shallow: fade out, then slide the column closed
    var done = colEls.shipped.querySelectorAll(".card");
    var shippedLimit = window.matchMedia("(max-width: 620px)").matches ? 2 : 4;
    if (done.length > shippedLimit) {
      var oldest = done[0];
      oldest.classList.add("fadeout");
      setTimeout(function () {
        oldest.style.height = oldest.offsetHeight + "px";
        oldest.getBoundingClientRect();
        oldest.classList.add("collapse");
        oldest.style.height = "0px";
        setTimeout(function () { oldest.remove(); updateCounts(); }, 500);
      }, 430);
    }
  }

  function cardsIn(colKey) {
    return Array.prototype.slice.call(
      colEls[colKey].querySelectorAll(".card:not(.fall):not(.fadeout)")
    );
  }

  function tick() {
    var inEval = cardsIn("eval");
    if (inEval.length) {
      var card = inEval[0];
      if (card._data.rejected) reject(card);
      else ship(card);
      return;
    }
    var inReview = cardsIn("review");
    if (inReview.length && Math.random() < 0.8) {
      moveTo(inReview[0], "eval");
      return;
    }
    var inDraft = cardsIn("draft");
    if (inDraft.length) {
      moveTo(inDraft[0], "review");
      return;
    }
    spawn("draft");
  }

  function maintain() {
    if (cardsIn("draft").length < 2) spawn("draft");
  }

  // Replace the static no-JS seed with live cards.
  ORDER.forEach(function (k) {
    colEls[k].querySelector(".cards").innerHTML = "";
  });
  ["draft", "draft", "review", "review", "eval"].forEach(function (k) {
    colEls[k].querySelector(".cards").appendChild(makeCard(false));
  });
  var seedAbdiel = makeCard(true);
  seedAbdiel.querySelector(".cmetric").textContent = seedAbdiel._data.passText;
  colEls.shipped.querySelector(".cards").appendChild(seedAbdiel);
  var seedRun = makeCard(false);
  seedRun.querySelector(".cmetric").textContent = seedRun._data.passText;
  colEls.shipped.querySelector(".cards").appendChild(seedRun);
  updateCounts();

  function stopLoop() {
    window.clearInterval(tickTimer);
    window.clearInterval(maintainTimer);
    tickTimer = null;
    maintainTimer = null;
    board.dataset.motion = "paused";
  }

  function startLoop() {
    if (!boardVisible || document.hidden || tickTimer || maintainTimer) return;
    tickTimer = window.setInterval(tick, 2400);
    maintainTimer = window.setInterval(maintain, 5100);
    board.dataset.motion = "running";
  }

  function freezeBoardGeometry() {
    if (board.style.height) return;
    board.style.height = board.getBoundingClientRect().height + "px";
    board.style.overflow = "hidden";
  }

  function releaseBoardGeometry() {
    board.style.height = "";
    board.style.overflow = "";
  }

  function boardIsOnScreen() {
    var rect = board.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  function syncLoop() {
    if (boardVisible && !document.hidden) {
      releaseBoardGeometry();
      startLoop();
    } else {
      freezeBoardGeometry();
      stopLoop();
    }
  }

  function checkBoardVisibility() {
    var nextVisible = boardIsOnScreen();
    if (nextVisible === boardVisible) return;
    boardVisible = nextVisible;
    syncLoop();
  }

  var visibilityFrame = null;
  function scheduleVisibilityCheck() {
    if (visibilityFrame !== null) return;
    visibilityFrame = window.requestAnimationFrame(function () {
      visibilityFrame = null;
      checkBoardVisibility();
    });
  }

  boardVisible = boardIsOnScreen();
  syncLoop();

  if ("IntersectionObserver" in window) {
    var boardObserver = new IntersectionObserver(function (entries) {
      boardVisible = entries[0].isIntersecting;
      syncLoop();
    }, { threshold: 0, rootMargin: "0px" });
    boardObserver.observe(board);
  }

  window.addEventListener("scroll", scheduleVisibilityCheck, { passive: true });
  window.addEventListener("resize", function () {
    if (!boardVisible) {
      releaseBoardGeometry();
      freezeBoardGeometry();
    }
    scheduleVisibilityCheck();
  });
  document.addEventListener("visibilitychange", syncLoop);
})();
