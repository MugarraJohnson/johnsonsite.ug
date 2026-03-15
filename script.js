/* ═══════════════════════════════════════
   script.js — Johnson Mugarra Portfolio
   ═══════════════════════════════════════ */
'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* 1. Scroll progress bar */
  var bar = document.getElementById('progress-bar');
  window.addEventListener('scroll', function () {
    var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    if (bar) bar.style.width = pct + '%';
  }, { passive: true });


  /* 2. Mobile menu */
  var ham    = document.getElementById('ham');
  var mmenu  = document.getElementById('mob-menu');
  var mclose = document.getElementById('mob-close');
  if (ham)    ham.addEventListener('click',    function () { mmenu.classList.add('open'); });
  if (mclose) mclose.addEventListener('click', function () { mmenu.classList.remove('open'); });
  if (mmenu) {
    mmenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mmenu.classList.remove('open'); });
    });
  }


  /* 3. Scroll-reveal for non-project elements only */
  var fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    var fadeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-in'));
        var idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (idx * 0.06) + 's';
        entry.target.classList.add('visible');
        fadeObs.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    fadeEls.forEach(function (el) { fadeObs.observe(el); });
  } else {
    /* Fallback: show everything if no IntersectionObserver */
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }


  /* 4. Skill bars animate in */
  var skillSection = document.getElementById('skill-bars');
  if (skillSection) {
    function animateBars() {
      skillSection.querySelectorAll('.sk-fill').forEach(function (fill) {
        fill.style.width = (fill.dataset.w || '0') + '%';
      });
    }
    if ('IntersectionObserver' in window) {
      var skObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          setTimeout(animateBars, 150);
          skObs.unobserve(skillSection);
        }
      }, { threshold: 0.15 });
      skObs.observe(skillSection);
    } else {
      animateBars();
    }
  }


  /* 5. Metrics counter */
  function countUp(el, target, duration) {
    if (!el) return;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p    = Math.min((ts - start) / duration, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  var metricsEl = document.getElementById('metrics');
  if (metricsEl) {
    var counted = false;
    if ('IntersectionObserver' in window) {
      var mObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !counted) {
          counted = true;
          countUp(document.getElementById('m1'), 18, 1500);
          countUp(document.getElementById('m2'), 80, 1700);
          countUp(document.getElementById('m3'), 95, 1600);
          countUp(document.getElementById('m4'),  6, 1300);
          mObs.disconnect();
        }
      }, { threshold: 0.35 });
      mObs.observe(metricsEl);
    } else {
      document.getElementById('m1').textContent = '18';
      document.getElementById('m2').textContent = '80';
      document.getElementById('m3').textContent = '95';
      document.getElementById('m4').textContent = '6';
    }
  }


  /* 6. Project filter */
  var filterRow = document.getElementById('filter-row');
  if (filterRow) {
    filterRow.addEventListener('click', function (e) {
      if (!e.target.classList.contains('filt')) return;
      document.querySelectorAll('.filt').forEach(function (b) { b.classList.remove('active'); });
      e.target.classList.add('active');
      var f = e.target.getAttribute('data-f');
      document.querySelectorAll('.proj-card').forEach(function (card) {
        var cats = (card.getAttribute('data-cat') || '').split(' ');
        if (f === 'all' || cats.indexOf(f) !== -1) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }


  /* 7. Contact form — sends via Formspree
     ─────────────────────────────────────────────────────────────
     SETUP (one-time, free):
       1. Go to https://formspree.io and create a free account.
       2. Click "New Form", name it, enter johnsonmugarra@yahoo.com
          as the email that receives submissions.
       3. Copy your Form ID  (looks like:  xpwzabcd )
       4. Replace  YOUR_FORM_ID  below with that ID.
     ─────────────────────────────────────────────────────────────
  */
  var FORMSPREE_ID = 'xpqyjjbq';   // <-- paste your ID here

  var form    = document.getElementById('contact-form');
  var sendBtn = document.getElementById('send-btn');
  var fMsg    = document.getElementById('f-msg');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (FORMSPREE_ID === 'YOUR_FORM_ID') {
        showMsg('error', '&#x26A0; Please set up Formspree first — see the instructions in script.js');
        return;
      }

      /* Disable button while sending */
      if (sendBtn) { sendBtn.disabled = true; sendBtn.textContent = 'Sending…'; }

      var data = new FormData(form);

      fetch('https://formspree.io/f/' + FORMSPREE_ID, {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          showMsg('success', '&#x2713; Message sent! I\'ll get back to you soon.');
          form.reset();
        } else {
          res.json().then(function (json) {
            var err = (json.errors || []).map(function (e) { return e.message; }).join(', ');
            showMsg('error', '&#x26A0; Could not send: ' + (err || 'unknown error'));
          });
        }
      })
      .catch(function () {
        showMsg('error', '&#x26A0; Network error — please email me directly at johnsonmugarra@yahoo.com');
      })
      .finally(function () {
        if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = 'Send message \u2192'; }
      });
    });
  }

  function showMsg(type, html) {
    if (!fMsg) return;
    fMsg.innerHTML = html;
    fMsg.className = 'f-msg show ' + type;
    setTimeout(function () { fMsg.classList.remove('show'); }, 7000);
  }

}); /* end DOMContentLoaded */
