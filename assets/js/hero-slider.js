// ===== HERO SLIDER =====
(function () {
  // Ensure DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    return;
  }
  init();

  function init() {
    const slides    = Array.from(document.querySelectorAll('.hero-slide'));
    const dotsWrap  = document.getElementById('heroDots');
    const thumbWrap = document.getElementById('heroThumbs');
    const caption   = document.getElementById('heroCaption');
    const bar       = document.getElementById('heroProgressBar');
    const hero      = document.getElementById('hero');
    const TOTAL     = slides.length;
    const INTERVAL  = 8000;
    const FADE_MS   = 2000; // must match CSS transition duration
    let cur = 0, timer, busy = false;

    if (!slides.length || !dotsWrap || !thumbWrap || !caption || !bar || !hero) {
      console.warn('Hero slider: Missing required elements');
      return;
    }

    // Build dots & thumbnails
    slides.forEach((s, i) => {
      const d = document.createElement('button');
      d.className = 'hero-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.onclick = () => goTo(i);
      dotsWrap.appendChild(d);

      const t = document.createElement('div');
      t.className = 'hero-thumb' + (i === 0 ? ' active' : '');
      t.innerHTML = '<img src="' + s.querySelector('img').src + '" alt="" />';
      t.onclick = () => goTo(i);
      thumbWrap.appendChild(t);
    });

    function startBar() {
      bar.style.transition = 'none';
      bar.style.width = '0%';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        bar.style.transition = 'width ' + (INTERVAL - 500) + 'ms linear';
        bar.style.width = '100%';
      }));
    }

    function goTo(n) {
      if (busy || n === cur) return;
      busy = true;
      clearInterval(timer);

      const prev = cur;
      cur = (n + TOTAL) % TOTAL;

      slides[prev].style.zIndex = 3;
      slides[cur].style.zIndex  = 2;
      slides[prev].classList.remove('active');
      slides[prev].classList.add('leaving');
      slides[cur].classList.add('active');

      dotsWrap.children[prev].classList.remove('active');
      dotsWrap.children[cur].classList.add('active');
      thumbWrap.children[prev].classList.remove('active');
      thumbWrap.children[cur].classList.add('active');

      caption.textContent = slides[cur].dataset.caption || '';

      // Reset after fade transition ends (matches CSS 2s duration)
      setTimeout(() => {
        slides[prev].classList.remove('leaving');
        slides[prev].style.zIndex = '';
        slides[cur].style.zIndex  = '';
        busy = false;
      }, FADE_MS);

      startBar();
      timer = setInterval(() => goTo((cur + 1) % TOTAL), INTERVAL);
    }

    document.getElementById('heroPrev').onclick = () => goTo((cur - 1 + TOTAL) % TOTAL);
    document.getElementById('heroNext').onclick = () => goTo((cur + 1) % TOTAL);

    // Touch swipe
    let touchStartX = 0;
    hero.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) goTo(dx < 0 ? (cur + 1) % TOTAL : (cur - 1 + TOTAL) % TOTAL);
    }, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  goTo((cur - 1 + TOTAL) % TOTAL);
      if (e.key === 'ArrowRight') goTo((cur + 1) % TOTAL);
    });

    // Pause on hover
    hero.addEventListener('mouseenter', () => clearInterval(timer));
    hero.addEventListener('mouseleave', () => {
      timer = setInterval(() => goTo((cur + 1) % TOTAL), INTERVAL);
    });


    // Init
    caption.textContent = slides[0].dataset.caption || '';
    startBar();
    timer = setInterval(() => goTo((cur + 1) % TOTAL), INTERVAL);
  }
})();
