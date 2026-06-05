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

  // Get form data
  const formData = new FormData(form);
  const fname = formData.get('fname');
  const lname = formData.get('lname');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const message = formData.get('message') || 'N/A';

  const name = fname + ' ' + lname;

  // Email subject & body
  const emailSubject = encodeURIComponent('Enquiry – Badri Homes');
  const emailBody = encodeURIComponent(
    'Hi,\n\nI have an enquiry about Badri Homes.\n\n' +
    '---\n' +
    'Name: ' + name + '\n' +
    'Email: ' + email + '\n' +
    'Phone: ' + phone + '\n' +
    'Message: ' + message + '\n' +
    '---\n\nThank you!'
  );

  // WhatsApp message
  const whatsappPhone = '9779851047861';
  const whatsappMsg = encodeURIComponent(
    'Hi,\n\nI have an enquiry about Badri Homes.\n\n' +
    '---\n' +
    'Name: ' + name + '\n' +
    'Email: ' + email + '\n' +
    'Phone: ' + phone + '\n' +
    'Message: ' + message + '\n' +
    '---\n\nThank you!'
  );

  // Show popup with options
  const choice = confirm('Send via:\n✓ OK = WhatsApp\n✗ Cancel = Email\n\nOr send to both?');

  if (choice === null) {
    // Email only
    window.location.href = 'mailto:homesbadri@gmail.com?subject=' + emailSubject + '&body=' + emailBody;
  } else {
    // Send to both
    // WhatsApp
    window.open('https://wa.me/' + whatsappPhone + '?text=' + whatsappMsg, '_blank');

    // Email
    setTimeout(() => {
      window.location.href = 'mailto:homesbadri@gmail.com?subject=' + emailSubject + '&body=' + emailBody;
    }, 500);
  }

  form.style.display    = 'none';
  success.style.display = 'block';
}

// ===== DATE INPUTS =====
const today = new Date().toISOString().split('T')[0];
const checkinEl = document.getElementById('checkin');
const checkoutEl = document.getElementById('checkout');

if (checkinEl) checkinEl.min = today;
if (checkoutEl) checkoutEl.min = today;

if (checkinEl) {
  checkinEl.addEventListener('change', function () {
    if (checkoutEl) checkoutEl.min = this.value;
  });
}

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
    const panel = document.getElementById('fcPanel');
    const btn   = document.getElementById('fcBtn');
    const icon  = document.getElementById('fcIcon');
    if (panel) panel.classList.remove('open');
    if (btn) btn.classList.remove('open');
    if (icon) icon.className = 'fa-solid fa-phone';
  }
});
