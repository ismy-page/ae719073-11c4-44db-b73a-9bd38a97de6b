/* ToyWizLand interactions: smooth scroll + RSVP validation */
(function () {
  'use strict';

  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Smooth scroll for anchor links and CTA buttons
  function handleSmoothScroll(e) {
    const a = e.currentTarget;
    const isData = a.hasAttribute('data-scroll-target');
    const href = isData ? a.getAttribute('data-scroll-target') : a.getAttribute('href');
    if (!href || !href.startsWith('#')) return; // ignore non-anchor
    const target = qs(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  qsa('a[href^="#"], [data-scroll-target]').forEach((el) => {
    el.addEventListener('click', handleSmoothScroll);
  });

  // RSVP form validation and submission stub
  const form = qs('#rsvp-form');
  const status = qs('#form-status');

  function setStatus(msg, kind = 'success') {
    status.textContent = msg;
    status.classList.remove('success', 'error');
    status.classList.add(kind);
    status.hidden = false;
    status.focus && status.focus();
  }

  function validate(formEl) {
    const name = qs('#name', formEl);
    const email = qs('#email', formEl);
    const attendance = qs('#attendance', formEl);

    let ok = true;

    // reset aria flags
    [name, email, attendance].forEach((fld) => fld && fld.removeAttribute('aria-invalid'));

    if (!name.value.trim()) {
      name.setAttribute('aria-invalid', 'true');
      ok = false;
    }

    if (!email.validity.valid || !email.value.trim()) {
      email.setAttribute('aria-invalid', 'true');
      ok = false;
    }

    if (!attendance.value) {
      attendance.setAttribute('aria-invalid', 'true');
      ok = false;
    }

    return ok;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validate(form)) {
      setStatus('Please fill in your name, a valid email, and attendance choice.', 'error');
      return;
    }

    const wishes = qsa('input[name="wishes"]:checked', form).map((cb) => cb.value);
    const payload = {
      name: qs('#name', form).value.trim(),
      email: qs('#email', form).value.trim(),
      attendance: qs('#attendance', form).value,
      message: qs('#message', form).value.trim(),
      wishes,
      bringOwnGift: qs('#ownGift', form)?.checked || false,
      submittedAt: new Date().toISOString(),
    };

    // Stub: simulate network call, store in memory/console
    console.log('RSVP submitted:', payload);

    const coming = payload.attendance.toLowerCase().includes("yes");
    setStatus(coming ? "Thanks for RSVP'ing — see you in ToyWizLand!" : 'Thank you for your sweet wishes!');

    form.reset();
  });

  // Year in footer
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Section observer to highlight active nav link (progressive enhancement)
  const sections = qsa('main .section[id]');
  const navLinks = new Map(
    qsa('.site-nav a[href^="#"]').map((a) => [a.getAttribute('href'), a])
  );

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = '#' + entry.target.id;
        const link = navLinks.get(id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0.1 }
  );

  sections.forEach((sec) => io.observe(sec));
})();

