const sidebar = document.querySelector('.docs-sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const searchInput = document.querySelector('[data-docs-search]');
const searchItems = [...document.querySelectorAll('[data-search-item]')];
const searchEmpty = document.querySelector('.search-empty');
const tocLinks = [...document.querySelectorAll('.page-toc a')];

const closeSidebar = () => {
  sidebar?.classList.remove('is-open');
  document.body.classList.remove('sidebar-open');
  sidebarToggle?.setAttribute('aria-expanded', 'false');
};

sidebarToggle?.addEventListener('click', () => {
  const willOpen = !sidebar.classList.contains('is-open');
  sidebar.classList.toggle('is-open', willOpen);
  document.body.classList.toggle('sidebar-open', willOpen);
  sidebarToggle.setAttribute('aria-expanded', String(willOpen));
});

document.addEventListener('click', event => {
  if (!document.body.classList.contains('sidebar-open')) return;
  if (sidebar.contains(event.target) || sidebarToggle.contains(event.target)) return;
  closeSidebar();
});

searchInput?.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;
  searchItems.forEach(item => {
    const matches = !query || item.textContent.toLowerCase().includes(query);
    item.hidden = !matches;
    if (matches) visibleCount += 1;
  });
  document.querySelectorAll('.sidebar-nav section').forEach(section => {
    section.classList.toggle('is-empty', !section.querySelector('[data-search-item]:not([hidden])'));
  });
  searchEmpty.hidden = visibleCount > 0;
});

document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (window.innerWidth <= 860 && !sidebar.classList.contains('is-open')) sidebarToggle.click();
    searchInput?.focus();
  }
  if (event.key === 'Escape') closeSidebar();
});

searchItems.forEach(item => item.addEventListener('click', closeSidebar));

document.querySelectorAll('[data-copy-code]').forEach(button => {
  button.addEventListener('click', async () => {
    const code = button.closest('.code-window')?.querySelector('code')?.innerText || '';
    try {
      await navigator.clipboard.writeText(code);
      const original = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = original; }, 1400);
    } catch {
      button.textContent = 'Select text';
    }
  });
});

const observedSections = tocLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
  if (!visible) return;
  tocLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`));
}, { rootMargin:'-15% 0px -72% 0px', threshold:0 });

observedSections.forEach(section => sectionObserver.observe(section));
