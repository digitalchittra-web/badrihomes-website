// Currency conversion based on user's country
(function() {
  const exchangeRates = {
    'NP': { code: 'NPR', rate: 1, symbol: '₨' },
    'US': { code: 'USD', rate: 0.0076, symbol: '$' },
    'GB': { code: 'GBP', rate: 0.0060, symbol: '£' },
    'IN': { code: 'INR', rate: 0.63, symbol: '₹' },
    'AU': { code: 'AUD', rate: 0.011, symbol: 'A$' },
    'CA': { code: 'CAD', rate: 0.010, symbol: 'C$' },
    'EU': { code: 'EUR', rate: 0.0071, symbol: '€' },
    'DE': { code: 'EUR', rate: 0.0071, symbol: '€' },
    'FR': { code: 'EUR', rate: 0.0071, symbol: '€' },
    'IT': { code: 'EUR', rate: 0.0071, symbol: '€' },
    'ES': { code: 'EUR', rate: 0.0071, symbol: '€' },
    'JP': { code: 'JPY', rate: 1.15, symbol: '¥' },
    'TH': { code: 'THB', rate: 0.27, symbol: '฿' },
    'SG': { code: 'SGD', rate: 0.010, symbol: 'S$' },
    'HK': { code: 'HKD', rate: 0.059, symbol: 'HK$' },
    'NZ': { code: 'NZD', rate: 0.012, symbol: 'NZ$' },
    'CH': { code: 'CHF', rate: 0.0068, symbol: 'CHF' },
    'AE': { code: 'AED', rate: 0.028, symbol: 'د.إ' },
    'SE': { code: 'SEK', rate: 0.080, symbol: 'kr' },
    'NO': { code: 'NOK', rate: 0.080, symbol: 'kr' }
  };

  function getCountryCode() {
    return fetch('https://geojs.io/apis/geolocation/v1/countries')
      .then(res => res.json())
      .then(data => data.country || 'NP')
      .catch(() => 'NP');
  }

  function formatPrice(nprAmount, countryCode) {
    const rateData = exchangeRates[countryCode] || exchangeRates['NP'];
    const convertedAmount = nprAmount * rateData.rate;

    if (rateData.code === 'NPR') {
      return `${rateData.symbol} ${Math.round(convertedAmount).toLocaleString()}`;
    } else if (['JPY', 'INR', 'THB', 'SEK', 'NOK'].includes(rateData.code)) {
      return `${rateData.symbol} ${Math.round(convertedAmount).toLocaleString()}`;
    } else {
      return `${rateData.symbol} ${convertedAmount.toFixed(0)}`;
    }
  }

  async function initCurrency() {
    const countryCode = await getCountryCode();

    // Update all price elements
    document.querySelectorAll('[data-npr-price]').forEach(el => {
      const nprPrice = parseFloat(el.dataset.nprPrice);
      el.textContent = formatPrice(nprPrice, countryCode);
    });

    // Store country for later use
    window.userCountry = countryCode;
    window.userCurrency = (exchangeRates[countryCode] || exchangeRates['NP']).code;
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCurrency);
  } else {
    initCurrency();
  }
})();
