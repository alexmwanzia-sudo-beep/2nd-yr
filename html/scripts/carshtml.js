const products =[{
  image: "cars2/images (12).jpeg",
  carlogo: "cars2/images.png" ,
  make:'TOYOTA',
  model:'COROLLA',
  year: 2004,
  numberplate: 'KDF',
  price:200000
}, 

{
  image: "cars2/images (9).jpeg",
  carlogo: "cars2/images.png" ,
  make:'VOLKSWAGEN',
  model:'POLO',
  year: 2004,
  numberplate:'KCE',
  price:700000
},
{
  image: "cars2/images (6).jpeg",
  carlogo: "cars2/images.png" ,
  make:'MARUTISUZUKI',
  model:'SWIFT',
  year: 2011,
  numberplate:'KDH',
  price:600000
}]  
let carsHTML="";
products.forEach((item)=> {
  carsHTML+=` <div class="car-container">
        <!-- Car Image on Top -->
        <div class="car-image">
          <img src="${item.image}">
        </div>
  
        <!-- Car Logo + Details Below -->
        <div class="car-info">
          <!-- Car Logo -->
          <div class="car-logo">
            <img src="${item.carlogo}">
          </div>
  
          <!-- Car Details -->
          <div>
            <p><strong>Make</strong>: ${item.make}</p>
            <p><strong>Model</strong>: ${item.model}</p>
            <p><strong>Year</strong>: ${item.year}</p>
            <p><strong>Number Plate</strong>:${item.numberplate}</p>
            <P><strong>price</strong>:KE ${item.price} shillings</p>
          </div>
        </div>
  
        <!-- More Info Button -->
        <button class="more-info" onclick="window.location.href='more-info.html'">
          MORE INFO
        </button>
      </div>`
     
});

console.log(carsHTML);
document.querySelector(".js-cars-grid").innerHTML=carsHTML