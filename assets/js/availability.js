// ===== AVAILABILITY FORM =====
(function () {
  // Badri Homes property ID on Booking.com
  const HOTEL_ID = 'badri-homes';
  const DEST_ID  = '10962518';

  const form     = document.getElementById('availForm');
  const checkin  = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');

  // Set minimum date to today
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  checkin.min  = todayStr;
  checkout.min = todayStr;

  // Auto-set checkout to next day when checkin changes
  checkin.addEventListener('change', function () {
    const next = new Date(this.value);
    next.setDate(next.getDate() + 1);
    const nextStr = next.toISOString().split('T')[0];
    checkout.min   = nextStr;
    if (!checkout.value || checkout.value <= this.value) {
      checkout.value = nextStr;
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const ci     = checkin.value;
    const co     = checkout.value;
    const guests = document.getElementById('guests').value;

    if (!ci || !co) return;

    // Parse dates for Booking.com URL format (YYYY-MM-DD)
    const ciParts = ci.split('-');
    const coParts = co.split('-');

    // Build Booking.com URL for the specific property
    const url =
      'https://www.booking.com/hotel/np/' + HOTEL_ID + '.html' +
      '?checkin='  + ciParts[0] + '-' + ciParts[1] + '-' + ciParts[2] +
      '&checkout=' + coParts[0] + '-' + coParts[1] + '-' + coParts[2] +
      '&group_adults=' + guests +
      '&group_children=0' +
      '&no_rooms=1' +
      '&dest_id=' + DEST_ID +
      '&dest_type=hotel';

    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();
