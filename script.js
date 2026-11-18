const header = document.querySelector('[data-header]');
const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

const darkZones = [...document.querySelectorAll('.hero, .transition-quote, .agent-loop, .guarantees, .open-cloud, .why-ibnk, .closing, body > footer')];
const updateHeader = () => {
  const probe = 36;
  const overDarkZone = darkZones.some(zone => {
    const rect = zone.getBoundingClientRect();
    return rect.top <= probe && rect.bottom >= probe;
  });
  header.classList.toggle('is-light', !overDarkZone);
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('is-open', !open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const countTarget = document.querySelector('[data-count]');
const animateCount = element => {
  if (!element || element.dataset.counted === 'true') return;
  element.dataset.counted = 'true';
  const target = Number(element.dataset.count);
  if (reduceMotion) {
    element.textContent = `${target.toLocaleString()}+`;
    return;
  }
  const started = performance.now();
  const duration = 900;
  const tick = now => {
    const progress = Math.min((now - started) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased).toLocaleString()}+`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    entry.target.classList.toggle('is-inview', entry.isIntersecting);
    if (entry.isIntersecting && entry.target.classList.contains('why-ibnk')) animateCount(countTarget);
  });
}, { threshold: 0.16 });
document.querySelectorAll('main > section, footer').forEach(section => sectionObserver.observe(section));

if (!reduceMotion) {
  const heroMotion = document.querySelector('.hero-motion-layer');
  const heroCopy = document.querySelector('.hero-copy');
  let parallaxFrame;
  const updateParallax = () => {
    cancelAnimationFrame(parallaxFrame);
    parallaxFrame = requestAnimationFrame(() => {
      const distance = Math.min(window.scrollY, 900);
      heroMotion.style.transform = `translate3d(0, ${distance * .1}px, 0)`;
      heroCopy.style.transform = `translate3d(0, ${distance * .04}px, 0)`;
    });
  };
  window.addEventListener('scroll', updateParallax, { passive: true });
}

const tabs = document.querySelectorAll('[data-product]');
const panels = document.querySelectorAll('[data-panel]');
tabs.forEach(tab => tab.addEventListener('click', () => {
  const selected = tab.dataset.product;
  tabs.forEach(item => {
    const active = item === tab;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
  });
  panels.forEach(panel => {
    const active = panel.dataset.panel === selected;
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
  });
}));

const review = document.querySelector('[data-approve]');
const approval = document.querySelector('[data-approval]');
const confirm = document.querySelector('[data-confirm]');
review.addEventListener('click', () => {
  approval.classList.add('is-open');
  confirm.focus();
});
confirm.addEventListener('click', () => {
  confirm.textContent = 'Approved ✓';
  confirm.disabled = true;
  review.textContent = 'Approved';
});
