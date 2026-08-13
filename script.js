/* ============================================================
   Harsh Salunke — Portfolio
   Interactions: navbar, mobile menu, reveal, form, back-to-top
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Navbar: scrolled state ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (navbar) navbar.classList.toggle('scrolled', y > 24);
    if (backToTop) backToTop.classList.toggle('show', y > 560);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  function closeMenu() {
    if (!navLinks || !hamburger) return;
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    // Close menu when a link is clicked (desktop + mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });

    // Fail-safe: never let content stay hidden. If an element hasn't
    // been revealed shortly after load (e.g. off-screen capture, observer
    // hiccup, reduced-motion edge case), force it visible.
    setTimeout(function () {
      revealEls.forEach(function (el) {
        if (!el.classList.contains('visible')) el.classList.add('visible');
      });
    }, 1800);
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && sections.length && navAnchors.length) {
    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navAnchors.forEach(function (a) {
              const href = a.getAttribute('href');
              a.classList.toggle('active', href === '#' + id);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = (document.getElementById('name').value || '').trim();
      const email = (document.getElementById('email').value || '').trim();
      const subject = (document.getElementById('subject').value || '').trim();
      const message = (document.getElementById('message').value || '').trim();

      // Validation
      if (!name || !email || !message) {
        if (note) {
          note.textContent = 'Please fill in your name, email, and message.';
          note.className = 'form-note error';
        }
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (note) {
          note.textContent = 'Please enter a valid email address.';
          note.className = 'form-note error';
        }
        return;
      }

      // Compose mailto link (no backend required)
      const subjectLine = subject ? subject : 'Portfolio inquiry from ' + name;
      const body = encodeURIComponent('Hi Harsh,\n\n' + message + '\n\n— ' + name + '\n' + email);
      const mailto = 'mailto:salunkeharsh966@gmail.com?subject=' + encodeURIComponent(subjectLine) + '&body=' + body;

      if (note) {
        note.textContent = 'Opening your email app…';
        note.className = 'form-note';
      }

      window.location.href = mailto;

      // Reset after a moment
      setTimeout(function () {
        form.reset();
        if (note) {
          note.textContent = 'Thanks for reaching out — I\'ll get back to you soon!';
          note.className = 'form-note';
        }
      }, 2500);
    });
  }

  /* ---------- Back to top ---------- */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
