(() => {
  const frames = {
    judges: ['judges-read.jpg', 'judges-debate.jpg', 'judges.jpg'],
    vision: ['vision-scan.jpg', 'vision-features.jpg', 'vision.jpg'],
    awam: ['awam-pages.jpg', 'awam-focus.jpg', 'awam.jpg'],
    creator: ['creator-input.jpg', 'creator-organize.jpg', 'creator.jpg'],
    assessment: ['assessment-input.jpg', 'assessment-guidance.jpg', 'assessment.jpg'],
    investigation: ['investigation-input.jpg', 'investigation-draft.jpg', 'investigation.jpg']
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ramp = '@#W%*+=:. ';
  const scenes = [];
  let request = 0, lastTick = 0;

  for (const element of document.querySelectorAll('.scene-visual')) {
    const canvas = element.querySelector('canvas');
    const scene = { element, visible: false, ready: false, start: 0, signature: '' };
    const pictures = frames[element.dataset.scene].map(file => {
      const image = new Image();
      return image;
    });
    let loaded = false;
    scene.load = () => {
      if (loaded) return;
      loaded = true;
      pictures.forEach((image, index) => { image.src = `assets/project-scenes/${frames[element.dataset.scene][index]}`; });
    };
    let caches = [], context, width, height;
    function prepare() {
      if (pictures.some(image => !image.complete || !image.naturalWidth)) return;
      const box = element.getBoundingClientRect();
      width = box.width; height = box.height;
      if (!width || !height) return;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context = canvas.getContext('2d'); context.scale(dpr, dpr);
      const columns = Math.round(Math.min(148, Math.max(66, width / 4.5)));
      const rows = Math.round(columns * height / width / 1.5);
      const cw = width / columns, ch = height / rows;
      caches = pictures.map(image => {
        const art = document.createElement('canvas');
        art.width = canvas.width; art.height = canvas.height;
        art.getContext('2d').drawImage(image, 0, 0, art.width, art.height);
        const sample = document.createElement('canvas');
        sample.width = columns; sample.height = rows;
        const input = sample.getContext('2d', { willReadFrequently: true });
        input.drawImage(image, 0, 0, columns, rows);
        const pixels = input.getImageData(0, 0, columns, rows).data;
        const ascii = document.createElement('canvas');
        ascii.width = canvas.width; ascii.height = canvas.height;
        const output = ascii.getContext('2d'); output.scale(dpr, dpr);
        output.fillStyle = '#f7f7f5'; output.fillRect(0, 0, width, height);
        output.fillStyle = '#202520'; output.font = `700 ${ch * 1.05}px "Courier New",monospace`;
        output.textAlign = 'center'; output.textBaseline = 'middle';
        for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
          const i = (y * columns + x) * 4;
          const lum = (pixels[i] * .2126 + pixels[i + 1] * .7152 + pixels[i + 2] * .0722) / 255;
          const tone = Math.max(0, Math.min(1, (lum - .03) / .92));
          const glyph = ramp[Math.round(tone * (ramp.length - 1))];
          if (glyph !== ' ') output.fillText(glyph, (x + .5) * cw, (y + .5) * ch);
        }
        return { art, ascii };
      });
      scene.ready = true; scene.signature = '';
      element.dataset.ready = 'true';
      scene.render(performance.now()); schedule();
    }
    scene.render = time => {
      if (!scene.ready) return;
      const cycle = 6600, slot = 2200, blendDuration = 420;
      const phase = reduced.matches ? 4400 : Math.max(0, time - scene.start) % cycle;
      const index = Math.floor(phase / slot);
      const local = phase % slot;
      const blend = reduced.matches ? 0 : Math.max(0, (local - (slot - blendDuration)) / blendDuration);
      const mode = document.body.dataset.treatment === 'art' ? 'art' : 'ascii';
      const signature = `${mode}:${index}:${blend > 0 ? time : 0}`;
      if (signature === scene.signature) return;
      scene.signature = signature;
      context.globalAlpha = 1;
      context.drawImage(caches[index][mode], 0, 0, width, height);
      if (blend > 0) {
        context.globalAlpha = blend;
        context.drawImage(caches[(index + 1) % 3][mode], 0, 0, width, height);
        context.globalAlpha = 1;
      }
      element.dataset.frame = String(index);
    };
    scenes.push(scene);
    pictures.forEach(image => image.addEventListener('load', prepare));
    new ResizeObserver(prepare).observe(element);
    prepare();
  }
  function schedule() {
    if (!request && !document.hidden && scenes.some(scene => scene.visible && scene.ready)) request = requestAnimationFrame(tick);
  }
  function tick(time) {
    request = 0;
    if (document.hidden) return;
    if (time - lastTick > 50) {
      lastTick = time;
      for (const scene of scenes) if (scene.visible && scene.ready) scene.render(time);
    }
    schedule();
  }
  new MutationObserver(() => { scenes.forEach(scene => scene.signature = ''); schedule(); }).observe(document.body, { attributes: true, attributeFilter: ['data-treatment'] });
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const scene = scenes.find(item => item.element === entry.target);
      scene.visible = entry.isIntersecting;
      if (scene.visible) { scene.start = performance.now(); scene.load(); }
    }
    schedule();
  }, { threshold: .1 });
  scenes.forEach(scene => observer.observe(scene.element));
  document.addEventListener('visibilitychange', () => { cancelAnimationFrame(request); request = 0; schedule(); });
  reduced.addEventListener('change', () => { scenes.forEach(scene => scene.signature = ''); schedule(); });
})();
