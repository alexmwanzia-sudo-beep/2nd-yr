document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You are not logged in. Redirecting to login...");
    window.location.href = "/user-registration/registration-form.html";
    return;
  }

  try {
    console.log("Fetching profile data with token:", token.substring(0, 10) + "...");
    
    const response = await fetch("/api/profile/profile", {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    console.log("Response status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("Profile data received:", data);

      // Populate user details
      document.getElementById("user-name").textContent = `${data.profile.firstname} ${data.profile.lastname}`;
      document.getElementById("user-email").textContent = data.profile.email;
      
      // Set profile image
      if (data.profile.profile_picture) {
        document.getElementById("profile-image").src = data.profile.profile_picture;
      }

      // Populate Cars Listed
      const carsListedContainer = document.getElementById("cars-listed-container");
      carsListedContainer.innerHTML = ""; // Clear placeholder
      
      if (data.cars && data.cars.length > 0) {
        data.cars.forEach((car) => {
          const carItem = document.createElement("div");
          carItem.className = "car-item";
          
          // Fix image path
          const imagePath = car.image_url || '/cars2/car3.jpg';
          console.log("Car image path:", imagePath);
          
          carItem.innerHTML = `
            <img src="${imagePath}" alt="${car.make} ${car.model}" onerror="this.src='/cars2/car3.jpg'"/>
            <p><strong>${car.make} ${car.model}</strong> (${car.year})</p>
            <button onclick='showMoreInfo(${JSON.stringify(car).replace(/'/g, "\\'")})'>More Info</button>
          `;
          carsListedContainer.appendChild(carItem);
        });
      } else {
        carsListedContainer.innerHTML = "<p>No cars listed yet.</p>";
      }

      // Populate Cars Hired
      const carsHiredContainer = document.getElementById("cars-hired-container");
      carsHiredContainer.innerHTML = ""; // Clear placeholder
      
      if (data.hireHistory && data.hireHistory.length > 0) {
        data.hireHistory.forEach((hire) => {
          const carItem = document.createElement("div");
          carItem.className = "car-item";
          
          // Get car details from the hire record
          const car = hire.car || {};
          const imagePath = car.image_url || '/cars2/car3.jpg';
          console.log("Hire car details:", car);
          
          carItem.innerHTML = `
            <img src="${imagePath}" alt="${car.make} ${car.model}" onerror="this.src='/cars2/car3.jpg'"/>
            <p><strong>${car.make} ${car.model}</strong> (${car.year})</p>
            <p>Status: ${hire.status}</p>
            <p>Start Date: ${new Date(hire.start_date).toLocaleDateString()}</p>
            <p>Duration: ${hire.duration} days</p>
            <button onclick='showMoreInfo(${JSON.stringify(car).replace(/'/g, "\\'")})'>More Info</button>
          `;
          carsHiredContainer.appendChild(carItem);
        });
      } else {
        carsHiredContainer.innerHTML = "<p>No cars hired yet.</p>";
      }

      // Populate Cars Reserved
      const carsPurchasedContainer = document.getElementById("cars-purchased-container");
      carsPurchasedContainer.innerHTML = ""; // Clear placeholder
      
      if (data.reservationHistory && data.reservationHistory.length > 0) {
        data.reservationHistory.forEach((reservation) => {
          const carItem = document.createElement("div");
          carItem.className = "car-item";
          
          // Get car details from the reservation record
          const car = reservation.car || {};
          const imagePath = car.image_url || '/cars2/car3.jpg';
          console.log("Reservation car details:", car);
          
          carItem.innerHTML = `
            <img src="${imagePath}" alt="${car.make} ${car.model}" onerror="this.src='/cars2/car3.jpg'"/>
            <p><strong>${car.make} ${car.model}</strong> (${car.year})</p>
            <p>Status: ${reservation.status}</p>
            <p>Start Date: ${new Date(reservation.start_date).toLocaleDateString()}</p>
            <p>Duration: ${reservation.duration} days</p>
            <button onclick='showMoreInfo(${JSON.stringify(car).replace(/'/g, "\\'")})'>More Info</button>
          `;
          carsPurchasedContainer.appendChild(carItem);
        });
      } else {
        carsPurchasedContainer.innerHTML = "<p>No cars reserved yet.</p>";
      }

      // Populate Notifications
      updateNotifications(data.notifications);
    } else {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      
      if (response.status === 401) {
        alert("Authentication error: " + (errorData.message || "Please log in again."));
        localStorage.removeItem("authToken");
        window.location.href = "/user-registration/registration-form.html";
      } else {
        alert("Failed to fetch profile data: " + (errorData.message || "Unknown error"));
      }
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
    alert("Network error: " + error.message);
  }
});

// Function to show more info about a car
function showMoreInfo(car) {
    if (!car) {
        alert("Car details are missing");
        return;
    }
    
    // Create query string with car details
    const queryString = new URLSearchParams({
        image: car.image_url || '/uploads/default-image.jpg',
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        condition: car.car_condition,
        owner: car.owner_name,
        description: car.description || "No description available",
        car_id: car.car_id,
        user_id: car.user_id
    }).toString();

    window.location.href = `../more-info.html?${queryString}`;
}

// Function to show hire details
function showHireDetails(hireId) {
  if (!hireId) {
    alert("Hire ID is missing");
    return;
  }
  alert(`Hire ID: ${hireId}\nMore details will be shown here.`);
}

// Function to show reservation details
function showReservationDetails(reservationId) {
  if (!reservationId) {
    alert("Reservation ID is missing");
    return;
  }
  alert(`Reservation ID: ${reservationId}\nMore details will be shown here.`);
}

function updateNotifications(notifications) {
    const notificationsContainer = document.querySelector('.notifications-container');
    const notificationCount = document.querySelector('.notification-count');
    
    // Clear existing notifications
    notificationsContainer.innerHTML = '';
    
    if (notifications && notifications.length > 0) {
        // Update notification count
        notificationCount.textContent = notifications.length;
        notificationCount.style.display = 'block';
        
        // Add each notification
        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = 'notification-item';
            
            const notificationContent = document.createElement('div');
            notificationContent.className = 'notification-content';
            
            const message = document.createElement('div');
            message.className = 'notification-message';
            message.textContent = notification.message;
            
            notificationContent.appendChild(message);
            notificationItem.appendChild(notificationContent);
            notificationsContainer.appendChild(notificationItem);
        });
    } else {
        // Show "No notifications" message
        notificationCount.style.display = 'none';
        const noNotifications = document.createElement('div');
        noNotifications.className = 'notification-item';
        noNotifications.textContent = 'No notifications';
        notificationsContainer.appendChild(noNotifications);
    }
}

// Toggle notifications dropdown
const notificationBtn = document.querySelector('.notification-btn');
const notificationsList = document.querySelector('.notifications-list');

notificationBtn.addEventListener('click', () => {
    notificationsList.classList.toggle('hidden');
});

// Close notifications when clicking outside
document.addEventListener('click', (event) => {
    if (!notificationsList.contains(event.target) && !notificationBtn.contains(event.target)) {
        notificationsList.classList.add('hidden');
    }
});

// Clear notifications
const clearNotificationsBtn = document.getElementById('clear-notifications');
clearNotificationsBtn.addEventListener('click', () => {
    const notificationsContainer = document.querySelector('.notifications-container');
    notificationsContainer.innerHTML = '';
    document.querySelector('.notification-count').style.display = 'none';
});
