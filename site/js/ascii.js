(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ramp = '@%#*+=-:. ';
  const tasks = [];
  let timer = 0;
  let previousTime = 0;

  function imageTask(frame, portrait) {
    if (!frame) return;
    const image = frame.querySelector('img');
    const canvas = frame.querySelector('canvas');
    const task = { element: frame, visible: false, ready: false, start: 0, lastDraw: -1, lastOpacity: -1 };
    let context, cells = [], width, height, cellWidth, cellHeight;
    function prepare() {
      if (!image.complete || !image.naturalWidth) return;
      const box = frame.getBoundingClientRect();
      const imageBox = image.getBoundingClientRect();
      if (!box.width || !box.height) { task.ready = false; return; }
      width = box.width; height = box.height;
      const columns = Math.round(Math.min(112, Math.max(52, width / 4.4)));
      const rows = Math.ceil(height / (width / columns * 1.65));
      cellWidth = width / columns; cellHeight = height / rows;
      const sample = document.createElement('canvas');
      sample.width = columns; sample.height = rows;
      const input = sample.getContext('2d', { willReadFrequently: true });
      input.fillStyle = '#f7f7f5'; input.fillRect(0, 0, columns, rows);
      const cover = getComputedStyle(image).objectFit === 'cover';
      const scale = (cover ? Math.max : Math.min)(imageBox.width / image.naturalWidth, imageBox.height / image.naturalHeight);
      const iw = image.naturalWidth * scale, ih = image.naturalHeight * scale;
      const x = imageBox.left - box.left + (imageBox.width - iw) / 2;
      const y = imageBox.top - box.top + (imageBox.height - ih) * (cover ? 0.5 : 1);
      input.drawImage(image, x / width * columns, y / height * rows, iw / width * columns, ih / height * rows);
      const pixels = input.getImageData(0, 0, columns, rows).data;
      cells = [];
      for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
        const i = (row * columns + column) * 4;
        const tone = Math.min(1, Math.max(0, ((pixels[i] * .2126 + pixels[i + 1] * .7152 + pixels[i + 2] * .0722) / 255 - .04) / .89));
        cells.push({ x: column, y: row, glyph: ramp[Math.round(tone * (ramp.length - 1))], seed: ((column * 17 + row * 31) % 97) / 97 });
      }
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context = canvas.getContext('2d'); context.scale(dpr, dpr);
      task.ready = true; task.lastDraw = -1; task.lastOpacity = -1;
      draw(1, 0);
      schedule();
    }
    function draw(progress, time) {
      context.fillStyle = '#f7f7f5'; context.fillRect(0, 0, width, height);
      context.fillStyle = '#243b2b'; context.font = `${cellHeight * .94}px "Courier New", monospace`;
      context.textAlign = 'center'; context.textBaseline = 'middle';
      for (const cell of cells) {
        if (cell.glyph === ' ') continue;
        const glyph = progress >= cell.seed ? cell.glyph : ramp[Math.floor((cell.seed * 31 + time / 80) % 7)];
        context.fillText(glyph, (cell.x + .5) * cellWidth, (cell.y + .5) * cellHeight);
      }
    }
    task.render = time => {
      if (!task.ready) return;
      const phase = ((time - task.start) % 10000) / 1000;
      const active = phase >= 2 && phase < 6;
      const progress = Math.min(1, Math.max(0, phase - 2));
      if (active && (progress < 1 || task.lastDraw !== 1)) { draw(progress, time); task.lastDraw = progress; }
      if (!active) task.lastDraw = -1;
      const opacity = active ? 1 : 0;
      if (opacity !== task.lastOpacity) {
        canvas.style.opacity = String(opacity);
        if (portrait) frame.querySelector('picture').style.opacity = String(1 - opacity);
        task.lastOpacity = opacity;
      }
      if (!portrait) canvas.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
    };
    task.reset = () => { canvas.style.opacity = '0'; if (portrait) frame.querySelector('picture').style.opacity = '1'; task.start = 0; task.lastOpacity = -1; };
    image.addEventListener('load', prepare);
    new ResizeObserver(prepare).observe(frame);
    tasks.push(task); prepare();
  }

  imageTask(document.querySelector('.hero-portrait-frame'), true);
  const visionAsciiEnabled = false;
  if (visionAsciiEnabled) imageTask(document.querySelector('.ascii-vision-frame'), false);

  const ripple = document.querySelector('.ascii-chapter-ripple');
  if (ripple) {
    const canvas = ripple.querySelector('canvas');
    let context, width, height;
    const task = { element: ripple, visible: false, ready: false, start: 0 };
    function prepare() {
      const box = ripple.getBoundingClientRect(); width = box.width; height = box.height;
      if (!width || !height) return;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * dpr; canvas.height = height * dpr;
      context = canvas.getContext('2d'); context.scale(dpr, dpr);
      task.ready = true; schedule();
    }
    task.render = time => {
      const phase = (time - task.start) % 6000;
      context.clearRect(0, 0, width, height);
      context.font = '11px "Courier New", monospace'; context.textAlign = 'center'; context.textBaseline = 'middle';
      const columns = Math.max(1, Math.floor(width / 10)), rows = Math.floor(height / 12), center = phase / 6000 * columns;
      for (let x = 0; x < columns; x++) for (let y = 0; y < rows; y++) {
        let distance = x - center;
        distance -= Math.round(distance / columns) * columns;
        const envelope = Math.exp(-((distance / 10) ** 2));
        const line = rows / 2 + Math.sin(distance * .16) * envelope * rows * .24;
        if (Math.abs(y - line) < 1.2) {
          context.fillStyle = `rgba(36,59,43,${.08 + envelope * .55})`;
          context.fillText(Math.abs(y - line) < .5 ? '*' : '.', (x + .5) * 10, (y + .5) * 12);
        }
      }
    };
    task.reset = () => { context?.clearRect(0, 0, width, height); task.start = 0; };
    tasks.push(task); new ResizeObserver(prepare).observe(ripple); prepare();
  }

  function schedule() {
    if (!timer && !document.hidden && !reduced.matches && tasks.some(task => task.visible && task.ready)) timer = requestAnimationFrame(tick);
  }
  function tick(time) {
    timer = 0;
    if (document.hidden || reduced.matches) return;
    if (time - previousTime >= 55) {
      previousTime = time;
      for (const task of tasks) if (task.visible && task.ready) { task.start ||= time; task.render(time); }
    }
    schedule();
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const task = tasks.find(item => item.element === entry.target);
      task.visible = entry.isIntersecting;
      if (!task.visible) task.reset();
    }
    schedule();
  }, { threshold: .1 });
  tasks.forEach(task => observer.observe(task.element));
  function resetMotion() { cancelAnimationFrame(timer); timer = 0; tasks.forEach(task => task.reset()); schedule(); }
  document.addEventListener('visibilitychange', resetMotion);
  reduced.addEventListener('change', resetMotion);
})();
