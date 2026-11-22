/* Taye Christ Emmanuel — Portfolio interactions (Vanilla JS) */
(function () {
  'use strict';

  /* Social profile URLs: update these values when profile links change. */
  const SOCIAL_LINKS = {
    github: 'https://github.com/pibrochrist04',
    linkedin: 'https://www.linkedin.com/in/christ-emmanuel-tay%C3%A9-169100419?utm_source=share_via&utm_content=profile&utm_medium=member_ios'
  };
  document.querySelectorAll('[data-social]').forEach((link) => {
    const url = SOCIAL_LINKS[link.dataset.social];
    if (url) link.href = url;
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const toTop = document.getElementById('toTop');

  /* ---- Sticky nav state + back-to-top visibility ---- */
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 12);
    if (toTop) toTop.classList.toggle('is-visible', y > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---- Mobile menu ---- */
  const setMenu = (open) => {
    if (!nav || !burger) return;
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };
  burger?.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  document.querySelectorAll('.mobile-menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 761px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---- Reveal on scroll ---- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // light stagger for siblings revealed together
        const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
        const idx = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = `${Math.min(idx, 4) * 70}ms`;
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---- Active nav link ---- */
  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('[data-page]').forEach((link) => {
    if (link.dataset.page === currentPage) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  /* ---- Project filters ---- */
  const grid = document.getElementById('workGrid');
  const filters = document.querySelectorAll('.filter');
  const cards = grid ? [...grid.querySelectorAll('.work')] : [];

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filters.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      if (grid) grid.classList.toggle('is-filtered', f !== 'all');

      cards.forEach((card) => {
        const match = f === 'all' || card.dataset.cats.split(' ').includes(f);
        const wasHidden = card.classList.contains('is-hidden');
        card.classList.toggle('is-hidden', !match);
        card.classList.add('is-visible');
        if (match && !reduceMotion && card.animate) {
          card.animate(
            [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
            { duration: wasHidden ? 450 : 320, easing: 'cubic-bezier(.22,.61,.36,1)' }
          );
        }
      });
    });
  });

  /* ---- Year ---- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
