/* ═══════════════════════════════════════════════════════════
   script.js — Johnson Mugarra Portfolio
   ═══════════════════════════════════════════════════════════ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Scroll progress bar ─────────────────────────────── */
  const bar = document.getElementById('sprogress');
  window.addEventListener('scroll', () => {
    const pct = scrollY / (document.body.scrollHeight - innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });


  /* ── 2. Mobile menu ─────────────────────────────────────── */
  const ham    = document.getElementById('ham');
  const mmenu  = document.getElementById('mob-menu');
  const mclose = document.getElementById('mob-close');

  ham.addEventListener('click',   () => mmenu.classList.add('open'));
  mclose.addEventListener('click',() => mmenu.classList.remove('open'));
  mmenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mmenu.classList.remove('open'))
  );


  /* ── 3. Reveal on scroll ────────────────────────────────── */
  const revEls = document.querySelectorAll('.reveal');
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // stagger siblings slightly
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 0.07) + 's';
      entry.target.classList.add('vis');
      revObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  revEls.forEach(el => revObs.observe(el));


  /* ── 4. Skill bars animate in ───────────────────────────── */
  const skillSection = document.getElementById('skill-bars');
  if (skillSection) {
    const skObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        skillSection.querySelectorAll('.sk-fill').forEach(fill => {
          setTimeout(() => {
            fill.style.width = fill.dataset.w + '%';
          }, 200);
        });
        skObs.unobserve(skillSection);
      }
    }, { threshold: 0.2 });
    skObs.observe(skillSection);
  }


  /* ── 5. Counter animation ───────────────────────────────── */
  function animateCount(el, target, duration) {
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(step);
  }

  const metricsEl = document.getElementById('metrics');
  if (metricsEl) {
    const mObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCount(document.getElementById('m1'), 18, 1600);
        animateCount(document.getElementById('m2'), 80, 1800);
        animateCount(document.getElementById('m3'), 95, 1700);
        animateCount(document.getElementById('m4'),  6, 1400);
        mObs.disconnect();
      }
    }, { threshold: 0.4 });
    mObs.observe(metricsEl);
  }


  /* ── 6. Project filter ──────────────────────────────────── */
  const filterRow = document.getElementById('filter-row');
  if (filterRow) {
    filterRow.addEventListener('click', e => {
      if (!e.target.classList.contains('filt')) return;

      document.querySelectorAll('.filt').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const filter = e.target.dataset.f;
      document.querySelectorAll('.proj-card').forEach(card => {
        const cats = (card.dataset.cat || '').split(' ');
        if (filter === 'all' || cats.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }


  /* ── 7. Contact form ────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const msg = document.getElementById('f-msg');
      msg.classList.add('show');
      form.reset();
      setTimeout(() => msg.classList.remove('show'), 5000);
    });
  }

}); // end DOMContentLoaded
