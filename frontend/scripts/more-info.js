// Get URL parameters
const params=new URLSearchParams(window.location.search)

// Extract car details
const make = params.get('make');
const model = params.get('model');
const year = params.get('year');
const condition = params.get('condition');
const mileage = params.get('mileage');
const price = params.get('price');
const owner = params.get('owner');
const description = params.get('description');
const image = params.get('image');

// Display the car details in the HTML
document.getElementById('car-image').src = image;
document.getElementById('car-make').textContent = make;
document.getElementById('car-model').textContent = model;
document.getElementById('car-year').textContent = year;
document.getElementById('car-condition').textContent = condition;
document.getElementById('car-mileage').textContent = mileage;
document.getElementById('car-price').textContent = price;
document.getElementById('car-owner').textContent = owner;
document.getElementById('car-description').textContent = description;

function buyCar(carId){

}
