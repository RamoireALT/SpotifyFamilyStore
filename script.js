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
  const clientId = 'YOUR_SPOTIFY_CLIENT_ID'; // Replace with your real Client ID
  const redirectUri = 'https://ramoirealt.github.io/SpotifyFamilyStore/'; // Or your deployed URI
  const scope = 'user-read-email';

  const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
  window.location.href = url;
}

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
