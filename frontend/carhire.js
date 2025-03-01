document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get form values
    const fullName = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const idNumber = document.getElementById('id-number').value.trim();
    const license = document.getElementById('license').value.trim();
    const startDate = document.getElementById('hire-start-date').value.trim();
    const endDate = document.getElementById('hire-end-date').value.trim();
    const duration = document.getElementById('duration').value.trim();
    const carId = localStorage.getItem('selectedCar'); // Store car ID

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email');
      return;
    }

    // Phone number validation
    const phonePattern = /^[0-9]{10,15}$/;
    if (!phonePattern.test(phone)) {
      alert('Please enter a valid phone number');
      return;
    }

    // National ID validation
    if (idNumber.length < 6) {
      alert('Please enter a valid National ID');
      return;
    }

    // License validation
    if (license.length < 6) {
      alert('Please enter a valid license number');
      return;
    }

    // Date validation
    const start = new Date(startDate);
    const end = new Date(endDate);
    const minDays = 10;
    const actualDuration = Math.floor((end - start) / (1000 * 60 * 60 * 24));

    if (actualDuration < minDays) {
      alert(`You must hire the car for at least ${minDays} days.`);
      return;
    }

    // Prepare data for submission
    const formData = {
      fullName,
      email,
      phone,
      idNumber,
      license,
      startDate,
      endDate,
      duration: actualDuration,
      carId
    };

    try {
      const response = await fetch('http://localhost:5000/hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Car hire request submitted successfully!');
        form.reset();
      } else {
        alert('Failed to submit hire request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting the form. Please check your network and try again.');
    }
  });

  // 🔹 Check if user can buy the car
  document.querySelectorAll(".buy-now").forEach(button => {
    button.addEventListener("click", async (event) => {
      const carId = event.target.getAttribute("data-id");
      const userId = localStorage.getItem("userId");

      const response = await fetch(`http://localhost:5000/checkHire?user_id=${userId}&car_id=${carId}`);
      const data = await response.json();

      if (data.eligible) {
        localStorage.setItem("selectedCar", carId);
        window.location.href = "purchase.html";
      } else {
        alert("You must hire this car for at least 10 days before purchasing.");
      }
    });
  });
});
