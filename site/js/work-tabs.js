(() => {
  const tabs = [...document.querySelectorAll('.work-tab')];
  if (!tabs.length) return;
  const list = tabs[0].parentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const aliases = { 'client-delivery': 'tab-client', 'independent-work': 'tab-independent', work: 'tab-client' };

  const indicator = document.createElement('span');
  indicator.className = 'work-tab-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  list.appendChild(indicator);

  function moveIndicator(tab) {
    indicator.style.width = tab.offsetWidth + 'px';
    indicator.style.transform = `translateX(${tab.offsetLeft}px) translateY(${tab.offsetTop + tab.offsetHeight - 1.5}px)`;
  }

  function select(tab, { focus = false, scroll = false, animate = true } = {}) {
    let shown = null;
    tabs.forEach(t => {
      const on = t === tab;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      const wasHidden = panel.hidden;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panel.hidden = !on;
      if (on && wasHidden) shown = panel;
    });
    moveIndicator(tab);
    if (shown && animate && !reduced.matches) {
      shown.classList.remove('is-entering');
      void shown.offsetWidth;
      shown.classList.add('is-entering');
      shown.addEventListener('animationend', () => shown.classList.remove('is-entering'), { once: true });
    }
    if (focus) tab.focus();
    // let canvases and sticky visuals measure the newly shown panel
    window.dispatchEvent(new Event('resize'));
    if (scroll) document.getElementById('work').scrollIntoView({ block: 'start', behavior: reduced.matches ? 'auto' : 'smooth' });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      if (tab.getAttribute('aria-selected') === 'true') return;
      select(tab);
      try { history.replaceState(null, '', '#' + tab.getAttribute('aria-controls')); } catch (e) {}
    });
    tab.addEventListener('keydown', e => {
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      select(tabs[(i + step + tabs.length) % tabs.length], { focus: true });
    });
  });

  const current = () => tabs.find(t => t.getAttribute('aria-selected') === 'true');
  function fromHash(scroll) {
    const id = aliases[location.hash.slice(1)];
    if (id) select(document.getElementById(id), { scroll, animate: false });
  }
  moveIndicator(current());
  requestAnimationFrame(() => list.classList.add('is-ready'));
  fromHash(true);
  window.addEventListener('hashchange', () => fromHash(true));
  window.addEventListener('resize', () => moveIndicator(current()));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveIndicator(current()));
})();
