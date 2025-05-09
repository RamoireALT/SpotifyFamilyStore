// When the page loads, set default option to 1 month and update price accordingly
document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('duration-select');
    updatePrice(selectElement.value); // Update price based on default value
});

// When the user changes the option, update the displayed prices
document.getElementById('duration-select').addEventListener('change', function(e) {
    updatePrice(e.target.value);
});

function connectSpotify() {
  const clientId = '387bba2790e44e6b8f0277c94fa11a9e'; // Replace with your Client ID
  const redirectUri = window.location.origin + '/'; // Redirect back to your main site
  const scope = 'user-read-email user-read-private';

  const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
  window.location.href = url;
}

// Handle redirect after Spotify login
window.addEventListener('load', () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const token = params.get('access_token');

  if (token) {
    sessionStorage.setItem('spotify_token', token);
    history.replaceState(null, null, window.location.pathname); // Clean up URL

    fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(user => {
      const name = user.display_name || "Neznámý uživatel";
      const premium = user.product === "premium";
      const image = user.images?.[0]?.url;

      let html = `<strong style="font-size:1.3rem">${name}</strong><br/>`;
      if (image) {
        html = `<img src="${image}" alt="Profilový obrázek" style="width:100px;border-radius:50%;margin-bottom:1rem;"><br/>` + html;
      }
      html += premium ? "🔰 Má Spotify Premium" : "❌ Nemá Spotify Premium";

      document.getElementById('spotify-status').innerHTML = html;

      // Update button to "Propojeno"
      const btn = document.getElementById('spotify-connect-btn');
      btn.textContent = '✅ Propojeno';
      btn.disabled = true;
      btn.style.backgroundColor = '#333';
      btn.style.cursor = 'default';
    })
    .catch(() => {
      document.getElementById('spotify-status').textContent = 'Nepodařilo se načíst profil.';
    });
  }
});

// Update the prices based on selected duration
function updatePrice(duration) {
    const originalPriceElement = document.querySelector('.original-price');
    const salePriceElement = document.querySelector('.price');
    const originalPrice = {
        "1": 65, // 1 month original price
        "3": 180, // 3 months original price
        "6": 360, // 6 months original price
        "9": 540, // 9 months original price
        "12": 650, // 12 months original price
    };
    
    const salePrice = {
        "1": 65, // 1 month sale price (no discount)
        "3": 180, // 3 months sale price
        "6": 360, // 6 months sale price
        "9": 540, // 9 months sale price
        "12": 650, // 12 months sale price
    };

    // Set the original price text
    originalPriceElement.textContent = `${originalPrice[duration]} CZK`;
    salePriceElement.textContent = `${salePrice[duration]} CZK`;

    // Adjust price visibility for 1 month option
    if (duration === "1") {
        salePriceElement.style.display = 'none'; // Hide sale price for 1 month
    } else {
        salePriceElement.style.display = 'block'; // Show sale price for other durations
    }
}
