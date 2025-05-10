// When the page loads, set default option to 1 month and update price accordingly
document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('duration-select');
    updatePrice(selectElement.value); // Update price based on default value
});

// When the user changes the option, update the displayed prices
document.getElementById('duration-select').addEventListener('change', function(e) {
    updatePrice(e.target.value);
});

// Function to initiate Spotify account connection
function connectSpotify() {
  const clientId = '387bba2790e44e6b8f0277c94fa11a9e'; // Replace with real ID
  const redirectUri = 'https://ramoirealt.github.io/SpotifyFamilyStore/';
  const scope = 'user-read-email user-read-private';

  const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
  window.location.href = url;
}

window.addEventListener('load', () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const token = params.get('access_token');

  if (token) {
    sessionStorage.setItem('spotify_token', token);
    history.replaceState(null, null, window.location.pathname);

    fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(user => {
      document.getElementById('spotify-connect-btn').textContent = '✅ Propojeno';
      document.getElementById('spotify-connect-btn').disabled = true;

      const name = user.display_name || "Neznámý uživatel";
      const premium = user.product === "premium";
      const image = user.images?.[0]?.url || "";

      document.getElementById('spotify-profile').style.display = 'block';
      document.getElementById('spotify-avatar').src = image;
      document.getElementById('spotify-name').textContent = name;

      const badge = document.getElementById('spotify-status');
      badge.textContent = premium ? "Spotify Premium" : "Spotify Free";
      badge.classList.add(premium ? "premium" : "free");
    })
    .catch(() => {
      alert('Chyba při načítání profilu Spotify.');
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
