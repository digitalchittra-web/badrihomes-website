// ===== REVIEWS CAROUSEL =====
(function () {
  const track    = document.getElementById('rvTrack');
  const dotsWrap = document.getElementById('rvDots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  const TOTAL = cards.length;
  let pos = 0, autoTimer;

  function perView() {
    if (window.innerWidth < 640)  return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function maxPos() {
    return Math.max(0, TOTAL - perView());
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i <= maxPos(); i++) {
      const d = document.createElement('button');
      d.className = 'rv-dot' + (i === pos ? ' active' : '');
      d.onclick = () => { clearInterval(autoTimer); setPos(i); startAuto(); };
      dotsWrap.appendChild(d);
    }
  }

  function setPos(n) {
    pos = Math.max(0, Math.min(n, maxPos()));
    const cardWidth = cards[0].getBoundingClientRect().width;
    track.style.transform = 'translateX(-' + pos * (cardWidth + 24) + 'px)';
    buildDots();
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => setPos(pos >= maxPos() ? 0 : pos + 1), 4500);
  }

  document.getElementById('rvPrev').onclick = () => { clearInterval(autoTimer); setPos(pos - 1); startAuto(); };
  document.getElementById('rvNext').onclick = () => { clearInterval(autoTimer); setPos(pos + 1); startAuto(); };
  window.addEventListener('resize', () => setPos(0));

  buildDots();
  startAuto();
})();
