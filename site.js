const header = document.querySelector('[data-header]');
const year = document.querySelector('[data-year]');
const reveals = document.querySelectorAll('.reveal');

const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 20);
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

if (year) year.textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -7% 0px', threshold: .1 });
  reveals.forEach((element) => observer.observe(element));
}

