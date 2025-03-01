// Loop through products and create HTML
let carsHTML = "";

products.forEach((item) => {
  // Create URL parameters for car details
  const carParams = new URLSearchParams({
    make: item.make,
    model: item.Model,
    year: item.year,
    condition: item.moreinfo.condition,
    mileage: item.moreinfo.mileage,
    price: item.moreinfo.priceCents,
    owner: item.moreinfo.currentOwner,
    description: item.moreinfo.description,
    image: item.image,
  });

  carsHTML += `
    <div class="car-container">
      <!-- Car Image -->
      <div class="car-image">
        <img src="${item.image}" alt="${item.make}">
      </div>

      <!-- Car Details -->
      <div class="car-info">
        <p><strong>Make:</strong> ${item.make}</p>
        <p><strong>Model:</strong> ${item.Model}</p>
        <p><strong>Year:</strong> ${item.year}</p>
      </div>

      <!-- More Info Button -->
      <button onclick="location.href='more-info.html?${carParams}'">
        More Info
      </button>
    </div>
  `;
});

document.querySelector(".js-cars-grid").innerHTML = carsHTML;
