(() => {
  for (const trigger of document.querySelectorAll('[data-project-dialog]')) {
    const dialog = document.getElementById(trigger.dataset.projectDialog);
    if (!dialog) continue;
    trigger.addEventListener('click', () => dialog.showModal());
    dialog.querySelector('.project-modal-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => trigger.focus({ preventScroll: true }));
  }
})();
