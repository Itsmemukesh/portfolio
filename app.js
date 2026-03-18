// ============================================================
// Portfolio — Mukesh Biswas
// ============================================================

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ============================================================
// Navbar — sticky background + mobile toggle
// ============================================================
const navbar   = $('#navbar');
const navToggle = $('#nav-toggle');
const navMenu   = $('#nav-menu');
const navLinks  = $$('.nav-link');

function updateNavbar() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.focus();
    }
  });
}

// ============================================================
// Active nav link on scroll via IntersectionObserver
// ============================================================
const sections = $$('section[id]');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

sections.forEach(sec => navObserver.observe(sec));

// ============================================================
// Smooth scroll for all internal anchor links
// ============================================================
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const hash = link.getAttribute('href');
  if (hash === '#') return;
  const target = $(hash);
  if (!target) return;
  e.preventDefault();
  const offset = navbar.offsetHeight + 16;
  window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  history.pushState(null, null, hash);
});

// ============================================================
// Scroll-reveal animation
// ============================================================
function addRevealClasses() {
  const revealTargets = $$(
    '.service-card, .skill-card, .portfolio-card, .about-stat, .hero-text, .hero-visual'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function initReveal() {
  addRevealClasses();
  $$('.reveal').forEach(el => revealObserver.observe(el));
}

// ============================================================
// Stagger children inside grids for a cascade effect
// ============================================================
function initStagger() {
  const grids = $$(
    '.services-grid, .skills-grid, .portfolio-grid, .about-stats-grid'
  );
  grids.forEach(grid => {
    $$('.service-card, .skill-card, .portfolio-card, .about-stat', grid).forEach((child, i) => {
      child.style.transitionDelay = `${i * 60}ms`;
    });
  });
}

// ============================================================
// Email copy-to-clipboard
// ============================================================
function initEmailCopy() {
  const emailLinks = $$('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', () => {
      const email = link.href.replace('mailto:', '');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('Email address copied!');
        }).catch(() => {});
      }
    });
  });
}

// ============================================================
// Toast notification
// ============================================================
function showToast(message) {
  const existing = $('.__toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = '__toast';
  toast.textContent = message;
  Object.assign(toast.style, {
    position:   'fixed',
    bottom:     '28px',
    right:      '28px',
    background: '#ff6b2b',
    color:      '#fff',
    padding:    '12px 22px',
    borderRadius: '10px',
    fontFamily: 'Inter, sans-serif',
    fontSize:   '0.9rem',
    fontWeight: '600',
    boxShadow:  '0 8px 24px rgba(255,107,43,0.35)',
    zIndex:     '9999',
    transform:  'translateY(12px)',
    opacity:    '0',
    transition: 'all 0.3s ease',
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity   = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateY(12px)';
    toast.style.opacity   = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ============================================================
// External links — open in new tab safely
// ============================================================
function initExternalLinks() {
  $$('a[href^="http"]').forEach(link => {
    if (!link.getAttribute('target')) link.setAttribute('target', '_blank');
    if (!link.getAttribute('rel'))    link.setAttribute('rel', 'noopener noreferrer');
  });
}

// ============================================================
// Throttle helper
// ============================================================
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) { last = now; fn(...args); }
  };
}

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  initReveal();
  initStagger();
  initEmailCopy();
  initExternalLinks();
});

window.addEventListener('scroll', throttle(updateNavbar, 16));

window.addEventListener('load', updateNavbar);
