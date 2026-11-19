const faqItems = [...document.querySelectorAll<HTMLDetailsElement>('.faq details')];

faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.filter((other) => other !== item).forEach((other) => (other.open = false));
  });
});
