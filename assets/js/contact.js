// ===== CONTACT FORM =====
function handleSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
    if (!field.value.trim()) { field.style.borderColor = '#e74c3c'; valid = false; }
    else field.style.borderColor = '';
  });
  if (!valid) return;

  form.style.display    = 'none';
  success.style.display = 'block';
}

// ===== DATE INPUTS =====
const today = new Date().toISOString().split('T')[0];
document.getElementById('checkin').min  = today;
document.getElementById('checkout').min = today;
document.getElementById('checkin').addEventListener('change', function () {
  document.getElementById('checkout').min = this.value;
});

// ===== FLOATING CONTACT WIDGET =====
function toggleFC() {
  const panel = document.getElementById('fcPanel');
  const btn   = document.getElementById('fcBtn');
  const icon  = document.getElementById('fcIcon');
  const open  = panel.classList.toggle('open');
  btn.classList.toggle('open', open);
  icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-phone';
}

document.addEventListener('click', function (e) {
  const wrap = document.querySelector('.fc-wrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('fcPanel').classList.remove('open');
    document.getElementById('fcBtn').classList.remove('open');
    document.getElementById('fcIcon').className = 'fa-solid fa-phone';
  }
});
