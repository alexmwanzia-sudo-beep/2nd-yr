document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You are not logged in. Redirecting to login...");
    window.location.href = "/user-registration/registration-form.html";
    return;
  }

  try {
    const response = await fetch("/api/profile/profile", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();

      // Populate user details
      document.getElementById("profile-name").textContent = `${data.user.firstname} ${data.user.lastname}`;
      document.getElementById("profile-email").textContent = data.user.email;
     /* if (data.user.profileImage) {
        document.getElementById("profile-img").src = `/uploads/${data.user.profileImage}`;
      }*/

      // Populate Cars Listed
      const carsListedContainer = document.getElementById("cars-listed-container");
      carsListedContainer.innerHTML = ""; // Clear placeholder
      data.cars.listed.forEach((car) => {
        const carItem = document.createElement("div");
        carItem.className = "car-item";
        carItem.innerHTML = `
          <img src="/uploads/${car.image}" alt="${car.make} ${car.model}" />
          <p><strong>${car.make} ${car.model}</strong> (${car.year})</p>
          <button onclick="showMoreInfo('${car.id}')">More Info</button>
        `;
        carsListedContainer.appendChild(carItem);
      });

      // Populate Cars Hired
      const carsHiredContainer = document.getElementById("cars-hired-container");
      carsHiredContainer.innerHTML = ""; // Clear placeholder
      data.cars.hired.forEach((car) => {
        const carItem = document.createElement("div");
        carItem.className = "car-item";
        carItem.innerHTML = `
          <img src="/uploads/${car.image}" alt="${car.make} ${car.model}" />
          <p><strong>${car.make} ${car.model}</strong> (${car.year})</p>
          <button onclick="showMoreInfo('${car.id}')">More Info</button>
        `;
        carsHiredContainer.appendChild(carItem);
      });

      // Populate Cars Purchased
      const carsPurchasedContainer = document.getElementById("cars-purchased-container");
      carsPurchasedContainer.innerHTML = ""; // Clear placeholder
      data.cars.purchased.forEach((car) => {
        const carItem = document.createElement("div");
        carItem.className = "car-item";
        carItem.innerHTML = `
          <img src="/uploads/${car.image}" alt="${car.make} ${car.model}" />
          <p><strong>${car.make} ${car.model}</strong> (${car.year})</p>
          <button onclick="showMoreInfo('${car.id}')">More Info</button>
        `;
        carsPurchasedContainer.appendChild(carItem);
      });

      // Populate Notifications
      const notificationsList = document.getElementById("notifications-list");
      notificationsList.innerHTML = "";
      data.notifications.forEach((notification) => {
        const listItem = document.createElement("li");
        listItem.textContent = notification.message;
        notificationsList.appendChild(listItem);
      });
    } else {
      alert("Failed to fetch profile data. Please log in again.");
      localStorage.removeItem("authToken");
      window.location.href = "/user-registration/registration-form.html";
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
    alert("Something went wrong. Please try again later.");
  }
});

// Show More Info Function
function showMoreInfo(carId) {
  alert(`Show more info for car with ID: ${carId}`); // Placeholder for real functionality
}
