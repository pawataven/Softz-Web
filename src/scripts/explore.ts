import { addScrollEffect, clamp01, getViewportHeight } from './scroll-engine';

const explore = document.querySelector<HTMLElement>('[data-explore]');
const section = document.querySelector<HTMLElement>('[data-explore-section]');

if (explore && section) {
  const tabs = [...explore.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const scenes = [...explore.querySelectorAll<HTMLElement>('.scene')];
  const title = explore.querySelector<HTMLElement>('[data-ex-title]')!;
  const description = explore.querySelector<HTMLElement>('[data-ex-desc]')!;
  const link = explore.querySelector<HTMLAnchorElement>('[data-ex-link]')!;
  const progressBar = explore.querySelector<HTMLElement>('.explore-progress i');
  const tabList = explore.querySelector<HTMLElement>('.explore-list')!;
  const tabCount = tabs.length;
  let activeIndex = -1;

  const show = (requestedIndex: number) => {
    const index = Math.max(0, Math.min(tabCount - 1, requestedIndex));
    if (index === activeIndex) return;
    activeIndex = index;

    tabs.forEach((tab, tabIndex) => {
      tab.setAttribute('aria-selected', String(tabIndex === index));
      tab.tabIndex = tabIndex === index ? 0 : -1;
    });
    scenes.forEach((scene, sceneIndex) => scene.classList.toggle('active', sceneIndex === index));

    if (tabList.scrollWidth > tabList.clientWidth) {
      tabList.scrollTo({ left: tabs[index].parentElement!.offsetLeft - 20, behavior: 'smooth' });
    }

    const { title: tabTitle = '', desc = '', href = '' } = tabs[index].dataset;
    title.textContent = tabTitle;
    description.textContent = desc;
    link.href = href;
  };

  const scrollRange = () => ({
    top: section.getBoundingClientRect().top + window.scrollY,
    length: section.offsetHeight - getViewportHeight(),
  });

  addScrollEffect(() => {
    const range = scrollRange();
    const progress = clamp01((window.scrollY - range.top) / range.length);
    if (progressBar) progressBar.style.width = `${progress * 100}%`;
    show(Math.min(tabCount - 1, Math.floor(progress * tabCount)));
  });

  const scrollToTab = (index: number) => {
    const range = scrollRange();
    window.scrollTo({
      top: range.top + range.length * ((index + 0.5) / tabCount),
      behavior: 'smooth',
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => scrollToTab(index));
    tab.addEventListener('keydown', (event) => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const nextIndex = Math.max(0, Math.min(tabCount - 1, activeIndex + step));
      scrollToTab(nextIndex);
      tabs[nextIndex].focus();
    });
  });
}
