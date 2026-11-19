const revealTargets = document.querySelectorAll('.reveal, .stagger');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  revealTargets.forEach((element) => observer.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add('in'));
}

// Keeps this file a module so its top-level names do not clash with other scripts.
export {};
