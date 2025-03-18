document.getElementById('carForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Validate required fields
    if (!validateForm()) {
        return;
    }

    // Prepare FormData to handle image upload and other fields
    const formData = prepareFormData();
    console.log([...formData.entries()]); 

    try {
        // Send data to the backend
        const response = await fetch('http://localhost:3000/api/cars/add', {
            method: 'POST',
            body: formData, // Send the complete form data to the backend
        });

        const result = await response.json();
        if (response.ok) {
            alert('Car added successfully!');
            window.location.reload(); // Reload the page to reset the form
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('nice wait for admin approval');
    }
});

// Function to validate required fields
function validateForm() {
    const requiredFields = [
        'userId', 'make', 'model', 'year', 'image', 'number_plate', 'car_condition', 'mileage',
        'previous_owners', 'description', 'owner_name', 'owner_contact', 'owner_email',
        'owner_location', 'ownership_duration', 'reason_for_selling', 'price',
    ];

    for (const field of requiredFields) {
        const inputField = document.getElementById(field);
        if (!inputField || inputField.value.trim() === '') {
            alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return false;
        }
    }

    // Validate year, mileage, and previousOwners
    const year = parseInt(document.getElementById('year').value);
    const mileage = parseInt(document.getElementById('mileage').value);
    const previous_owners = parseInt(document.getElementById('previous_owners').value);

    if (isNaN(year) || isNaN(mileage) || isNaN(previous_owners)) {
        alert('Please enter valid numbers for year, mileage, and previous owners.');
        return false;
    }

    // Validate image upload
    const image_url = document.getElementById('image').files[0];
    if (!image_url) {
        alert('Please upload an image.');
        return false;
    }

    return true;
}

// Function to prepare FormData
// Function to prepare FormData
function prepareFormData() {
    const formData = new FormData();

    // Append basic car details
    formData.append('userId', document.getElementById('userId').value);
    formData.append('make', document.getElementById('make').value);
    formData.append('model', document.getElementById('model').value);
    formData.append('year', parseInt(document.getElementById('year').value));
    formData.append('number_plate', document.getElementById('number_plate').value);
    formData.append('car_condition', document.getElementById('car_condition').value);
    formData.append('mileage', parseInt(document.getElementById('mileage').value));
    formData.append('previous_owners', parseInt(document.getElementById('previous_owners').value));
    formData.append('description', document.getElementById('description').value);

    // Append owner details
    formData.append('owner_name', document.getElementById('owner_name').value);
    formData.append('owner_contact', document.getElementById('owner_contact').value);
    formData.append('owner_email', document.getElementById('owner_email').value);
    formData.append('owner_location', document.getElementById('owner_location').value);
    formData.append('ownership_duration', document.getElementById('ownership_duration').value);
    formData.append('reason_for_selling', document.getElementById('reason_for_selling').value);

    // Append service details (single record)
    const service_date = document.getElementById('service_date').value; // Assuming you have an input with id="service_date"
    const service_details = document.getElementById('service_details').value; // Assuming you have an input with id="service_details"
    if (service_date && service_details) {
        formData.append('service_date', service_date);
        formData.append('service_details', service_details);
    }

    // Append additional details
    formData.append('accident_history', document.getElementById('accident_history').value);
    formData.append('parking_type', document.getElementById('parking_type').value);
    formData.append('usage_history', document.getElementById('usage_history').value);
    formData.append('price', document.getElementById('price').value);

    // Append checkbox values
    formData.append('price_negotiable', document.getElementById('price_negotiable').checked ? 1 : 0);
    formData.append('available_for_hire', document.getElementById('available_for_hire').checked ? 1 : 0);

    // Append image file
    const image_url = document.getElementById('image').files[0];
    formData.append('image', image_url);

    return formData;
}
