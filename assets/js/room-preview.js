// ===== MINI ROOM PREVIEW PANEL =====
(function () {
  const slides   = Array.from(document.querySelectorAll('.hrp-slide'));
  const dotsWrap = document.getElementById('hrpDots');
  const label    = document.getElementById('hrpLabel');
  const labels   = [
    'Queen Bed · Newari Brick Walls',
    'Private Kitchen · All Yours',
    'TV Lounge · Modern Comfort',
    'En-suite Bathroom · Spotless',
    'Full Studio · Complete Home',
    'Cozy Beds · Rest Easy',
    'Room Detail · Warm & Welcoming'
  ];
  let current = 0;
  const total = slides.length;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'hrp-dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goTo(i);
    dotsWrap.appendChild(d);
  });

  function goTo(n) {
    slides[current].classList.remove('active');
    dotsWrap.children[current].classList.remove('active');
    current = (n + total) % total;
    slides[current].classList.add('active');
    dotsWrap.children[current].classList.add('active');
    label.textContent = labels[current];
  }

  setInterval(() => goTo((current + 1) % total), 3000);
})();
