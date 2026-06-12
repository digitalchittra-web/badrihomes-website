// ============================================================
// ENHANCEMENTS — interactive layer
// ============================================================
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Scroll progress bar ----------
  var bar = document.createElement('div');
  bar.id = 'scrollProgress';
  document.body.appendChild(bar);
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      ticking = false;
    });
  }, { passive: true });

  // ---------- Hero headline reveal (kicks in when the loader hides) ----------
  function armHero() {
    document.body.classList.add('hero-ready');
  }
  var loader = document.getElementById('pageLoader');
  if (!loader || loader.classList.contains('hidden') || reduceMotion) {
    armHero();
  } else {
    new MutationObserver(function (m, obs) {
      if (loader.classList.contains('hidden')) { armHero(); obs.disconnect(); }
    }).observe(loader, { attributes: true, attributeFilter: ['class'] });
    setTimeout(armHero, 4500); // safety net
  }

  // ---------- Count-up hero stats ----------
  function countUp(el, target, decimals, suffix) {
    var dur = 1300, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function initCounters() {
    document.querySelectorAll('.stat-value').forEach(function (el) {
      var m = el.textContent.trim().match(/^(\d+(?:\.\d+)?)(.*)$/);
      if (!m) return;
      var target = parseFloat(m[1]);
      var decimals = (m[1].split('.')[1] || '').length;
      var suffix = m[2];
      el.textContent = (0).toFixed(decimals) + suffix;
      countUp(el, target, decimals, suffix);
    });
  }
  if (!reduceMotion) {
    if (document.body.classList.contains('hero-ready')) initCounters();
    else {
      new MutationObserver(function (m, obs) {
        if (document.body.classList.contains('hero-ready')) { initCounters(); obs.disconnect(); }
      }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
  }

  // ---------- Gallery captions from alt text ----------
  document.querySelectorAll('.gallery-item').forEach(function (item) {
    var img = item.querySelector('img');
    if (img && img.alt) item.setAttribute('data-caption', img.alt);
  });

  // ---------- 3D tilt on room & attraction cards (fine pointers only) ----------
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.room-card, .attraction-card').forEach(function (card) {
      var raf = null;
      card.addEventListener('mousemove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          card.classList.add('tilting');
          card.style.transform =
            'perspective(900px) rotateX(' + (-y * 4).toFixed(2) + 'deg)' +
            ' rotateY(' + (x * 4).toFixed(2) + 'deg) translateY(-8px)';
          raf = null;
        });
      });
      card.addEventListener('mouseleave', function () {
        card.classList.remove('tilting');
        card.style.transform = '';
      });
    });
  }

  // ---------- Testimonials: drag / swipe + pause on hover ----------
  var viewport = document.querySelector('.rv-viewport');
  var track = document.getElementById('rvTrack');
  if (viewport && track) {
    var startX = 0, dragging = false;
    function endDrag(dx) {
      dragging = false;
      viewport.classList.remove('dragging');
      var prev = document.getElementById('rvPrev');
      var next = document.getElementById('rvNext');
      if (Math.abs(dx) > 50) (dx < 0 ? next : prev) && (dx < 0 ? next : prev).click();
    }
    viewport.addEventListener('pointerdown', function (e) {
      dragging = true;
      startX = e.clientX;
      viewport.classList.add('dragging');
      viewport.setPointerCapture(e.pointerId);
    });
    viewport.addEventListener('pointerup', function (e) {
      if (dragging) endDrag(e.clientX - startX);
    });
    viewport.addEventListener('pointercancel', function () {
      dragging = false;
      viewport.classList.remove('dragging');
    });
  }
})();
