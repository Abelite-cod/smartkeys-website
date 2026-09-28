/* ============================================================
   SMARTKEYS PROPTECH — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ── Navigation scroll state ─────────────────────────── */
  const nav = document.querySelector('.nav');

  function handleNavScroll() {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ── Mobile navigation ───────────────────────────────── */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Smooth scroll for anchor links ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 72;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ── Scroll reveal ───────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback — just show everything
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Contact form ────────────────────────────────────── */
  const form = document.querySelector('.js-contact-form');

  if (form) {
    const statusEl = form.querySelector('.form__status');
    const submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic client-side validation
      let valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) {
        showStatus('error', 'Please fill in all required fields before submitting.');
        return;
      }

      // Email validation
      const emailField = form.querySelector('[type="email"]');
      if (emailField) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
          emailField.style.borderColor = '#c0392b';
          showStatus('error', 'Please enter a valid email address.');
          return;
        }
      }

      // Simulate submission (replace with real endpoint integration)
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(function () {
        showStatus(
          'success',
          'Thank you for your message. A member of the SmartKeys team will be in touch shortly.'
        );
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }, 1200);
    });

    function showStatus(type, message) {
      if (!statusEl) return;
      statusEl.className = 'form__status ' + type;
      statusEl.textContent = message;
      statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Clear error border on input
    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.style.borderColor = '';
      });
    });
  }

  /* ── Active nav link highlight on scroll ─────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[data-section]');

  if (sections.length && navLinks.length) {
    function setActiveLink() {
      const scrollPos = window.scrollY + 100;
      let current = '';

      sections.forEach(function (section) {
        if (section.offsetTop <= scrollPos) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.dataset.section === current);
      });
    }

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();
  }

})();
