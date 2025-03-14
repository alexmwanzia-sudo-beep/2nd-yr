document.getElementById('carForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission

  const requiredFields = [
      "make", "model", "year", "image", "numberplate", "condition", "mileage", 
      "previousOwners", "description", "ownerName", "ownerContact", "ownerEmail", 
      "ownerLocation", "ownershipDuration", "reasonForSelling", "serviceDate", 
      "serviceDetails", "accidentHistory", "parkingType", "usageHistory", "price"
  ];

  for (const field of requiredFields) {
      const inputField = document.getElementById(field);
      if (!inputField || inputField.value.trim() === "") {
          alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
          return;
      }
  }

  // Prepare FormData to handle image upload
  const formData = new FormData();
  formData.append("userId", "12345"); // Hardcoded userId (consider dynamic)
  formData.append("make", document.getElementById("make").value);
  formData.append("model", document.getElementById("model").value);
  
  const year = parseInt(document.getElementById("year").value);
  if (isNaN(year)) {
      alert("Please enter a valid year");
      return;
  }
  formData.append("year", year);

  // Append the image file correctly
  const imageFile = document.getElementById("image").files[0];
  if (!imageFile) {
      alert("Please upload an image.");
      return;
  }
  formData.append("image", imageFile);

  formData.append("numberplate", document.getElementById("numberplate").value);
  formData.append("condition", document.getElementById("condition").value);

  const mileage = parseInt(document.getElementById("mileage").value);
  if (isNaN(mileage)) {
      alert("Please enter a valid mileage");
      return;
  }
  formData.append("mileage", mileage);

  const previousOwners = parseInt(document.getElementById("previousOwners").value);
  if (isNaN(previousOwners)) {
      alert("Please enter a valid number of previous owners");
      return;
  }
  formData.append("previousOwners", previousOwners);

  formData.append("description", document.getElementById("description").value);
  formData.append("ownerName", document.getElementById("ownerName").value);
  formData.append("ownerContact", document.getElementById("ownerContact").value);
  formData.append("ownerEmail", document.getElementById("ownerEmail").value);
  formData.append("ownerLocation", document.getElementById("ownerLocation").value);
  formData.append("ownershipDuration", document.getElementById("ownershipDuration").value);
  formData.append("reasonForSelling", document.getElementById("reasonForSelling").value);
  formData.append("serviceDate", document.getElementById("serviceDate").value);
  formData.append("serviceDetails", document.getElementById("serviceDetails").value);
  formData.append("accidentHistory", document.getElementById("accidentHistory").value);
  formData.append("parkingType", document.getElementById("parkingType").value);
  formData.append("usageHistory", document.getElementById("usageHistory").value);
  formData.append("price", document.getElementById("price").value);

  // Handle checkbox values correctly
  formData.append("priceNegotiable", document.getElementById("priceNegotiable").checked ? "true" : "false");
  formData.append("availableForHire", document.getElementById("availableForHire").checked ? "true" : "false");

  try {
      const response = await fetch("http://localhost:3000/api/cars/add", {
          method: "POST",
          body: formData // No need to add Content-Type, as FormData handles it
      });

      const result = await response.json();
      if (response.ok) {
          alert("Car added successfully!");
          window.location.reload();
      } else {
          alert("Error: " + result.message);
      }
  } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
  }
});
