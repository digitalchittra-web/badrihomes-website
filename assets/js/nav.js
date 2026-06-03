// ===== NAV SCROLL =====
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    scrollTopBtn.classList.add('show');
  } else {
    navbar.classList.remove('scrolled');
    scrollTopBtn.classList.remove('show');
  }
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');

hamburger.addEventListener('click', () => {
  if (mobileMenu.classList.contains('open')) {
    closeMobile();
  } else {
    openMobile();
  }
});


function openMobile() {
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('open');
  hamburger.classList.add('active');
  navbar.classList.add('menu-open');
  document.body.style.overflow = 'hidden';
}

function closeMobile() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  hamburger.classList.remove('active');
  navbar.classList.remove('menu-open');
  document.body.style.overflow = '';
}
