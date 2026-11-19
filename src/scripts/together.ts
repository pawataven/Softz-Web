document.querySelectorAll<HTMLElement>('[data-together]').forEach((container) => {
  const items = [...container.querySelectorAll<HTMLElement>('.together-item')];
  const scenes = [...container.querySelectorAll<HTMLElement>('.together-stage .combo')];

  items.forEach((item, index) => {
    item.querySelector('button')?.addEventListener('click', () => {
      items.forEach((other, otherIndex) => {
        const isOpen = otherIndex === index;
        other.classList.toggle('open', isOpen);
        other.querySelector('button')?.setAttribute('aria-expanded', String(isOpen));
      });
      scenes.forEach((scene, sceneIndex) => scene.classList.toggle('active', sceneIndex === index));
    });
  });
});
