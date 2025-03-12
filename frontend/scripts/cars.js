const products= [{
  Id:'1',
  make:"Volkswagen",
  Model:"Golf GTI ",
  year: 2011,
  image: "cars2/images (12).jpeg",
  numberplate:'kfc',
  moreinfo:{
    condition:"used",
    mileage: '25,000 miles',
    previousOwners:"1",
    description:"cormfotable sytliish and family fitting",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents: "18,000 USD",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },

    availableforhire:true
  }

},
{
  Id:'2',
  make:"Volkswagen",
  Model:"Golf GTI",
  year: 2017,
  image: "cars2/images (12).jpeg",
  moreinfo:{
    condition:"like new",
    mileage: "20,000 miles",
    previousOwners:"1",
    description:"the car has been sitting idle for a while. the brakes need repair and the engine has minor issues which be fixed ,upon agreement to buy",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents: "2000000",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire:false
  }

},
{
  Id:'3',
  make:"Volkswagen",
  Model:"polo",
  year: 2009,
  image: "cars2/images (9).jpeg",
  moreinfo:{
    condition:"like new",
    mileage: "12,000 miles",
    previousOwners:"2",
    description:"the motor appears as though it has never been used. the brakes and the engines are i great condtion. its an amazing piece of art",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents: "32000 USD",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire: true
  }

},
{
  Id:'4',
  make:"toyota",
  Model:"corolla",
  year: 2014,
  image: "cars2/images (7).jpeg",
  moreinfo:{
    condition:"used",
    mileage: "30000 miles",
    previousOwners:"3",
    description:"the vehicle has a minor set back. the tyres need replacement and it needs a general car service. but other than that every thing else is perfect.",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"2000 USD",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire: false
  }

},
{
  Id:'5',
  make:" Maruti Suzuk",
  Model:"Swift",
  year: 2011,
  image: "cars2/images (6).jpeg",
  moreinfo:{
    condition:"like new",
    mileage: "1500 miles",
    previousOwners:"1",
    description:"the vehicle is living its youth age it has the best of everything. the brakes  the tyres engine everything is in excellent condition anyone who gets it is sure very lucky",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"4000000 USD",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire:true

  }

},
{
  Id:'6',
  make:"honda",
  Model:"vamos",
  year: 2012,
  image: "cars2/images (4).jpg",
  moreinfo:{
    condition:"used",
    mileage: "40,000 miles",
    previousOwners:"2",
    description:"the vehicle has some minor setback. its springs need replacement and engine needs inspection. the exhauster pipelining need replacement and some mirrors including the back seats ",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },

    priceCents:"5O0 USD",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire:false
  }

},
{
  Id:'7',
  make:"tata",
  Model:"tiger",
  year: 2016,
  image: "cars2/images (3).jpe",
  moreinfo:{
    condition:"excellent ",
    mileage: "2000 miles",
    previousOwners:"1",
    description:" the motor is a dream come true for a middle class guy wanting to drive with a all of its system working as well as a brand new would. ",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"5000 USD",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire: true
  }

},
{
  Id:'8',
  make:"Mercedes-Benz",
  Model:"ML-Class ",
  year: 2014,
  image: "cars2/images (2).jpeg",
  moreinfo:{
    condition:"like new",
    mileage: "1300 miles",
    previousOwners:"1",
    description:"well the machine needs no introduction. it is at the peek of its life having the best of everything clean fuel system controls everything just fits the name",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"40000  USD",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire: true
  }

},
{
  Id:'9',
  make:"tata",
  Model:"tiago",
  year: 2011,
  image: "cars2/images (19).jpeg",
  moreinfo:{
    condition:"used",
    mileage: "13000",
    previousOwners:"3",
    description:"the car has been around for a while but still looks good. it still looks like new. the client is guranteed a long service and any minor set backs are on the house",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"700 USD",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire: true
  }

},
{
  Id:'10',
  make:"suzuki",
  Model:"alto",
  year: 2016,
  image: "cars2/images (18).jpeg",
  moreinfo:{
    condition:"used",
    mileage: "19000 miles",
    previousOwners:"2",
    description:"the vehicle has been on the road for a while but nevertheless it is in good condition. it has been inspected by qualified mechanic and report submitted shows all of its parts are properly fixed and in best condition",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"12000 USD",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire: true
  }

},
{
  Id:'11',
  make:"skoda",
  Model:"Octavia",
  year: 2012,
  image: "cars2/images (17).jpeg",
  moreinfo:{
    condition:"excellent",
    mileage: "1300 miles",
    previousOwners:"1",
    description: "one of my favorites. ask me for the perfect galfriend and i will let ur eyes might perfection for the very first time its is just amazing such creatures can exist",
    
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"12000 USD",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire:true
  }

},
{
  Id:'12',
  make:"suzuki",
  Model:"wagon R",
  year: 2017,
  image: "cars2/images (16).jpeg",
  moreinfo:{
    condition:"used",
    mileage: "7000 miles",
    previousOwners:"3",
    description:" the car functionality is as good as of any other car. all its parts are in a good condition. it has been inspected  and it will be inspected again once a client shows interest in",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"5000 USD",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire: true
  }

},
{
  Id:'13',
  make:"suzuki",
  Model:"swift",
  year: 2015,
  image: "cars2/images (15).jpeg",
  moreinfo:{
    condition:"like new",
    mileage:"12000 miles" ,
    previousOwners:"1",
    description:"the blue baby is as young as the nickname and only starting her life hence her functionality is top-notch anyone who gets her has to be very lucky",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"14000 USD",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire:true
  }

},
{
  Id:'14',
  make:"suzuki",
  Model:"wagon R",
  year: 2013,
  image: "cars2/images (13).jpeg",
  moreinfo:{
    condition:"used",
    mileage: "140000 miles",
    previousOwners:"1",
    description:"the car is as manly as it looks . the engine is a strong one well serviced and no history of repair or damage",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"14000 USD",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire: true
  }

},
{
  Id:'15',
  make:"toyota",
  Model:"innova",
  year: 2012,
  image: "cars2/images (14).jpeg",
  moreinfo:{
    condition:"excellent",
    mileage: "8000 miles",
    previousOwners:"1",
    description:"no words for it it is as amazing as the picture it hard to believe its a resell if u are not buying it i know the next person will",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"15000 USD",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire:true
  }

},
{
  Id:'16',
  make:"toyota",
  Model:"bus",
  year: 2017,
  image: "cars2/bus1.jpeg",
  moreinfo:{
    condition:"used",
    mileage:"12000 miles",
    previousOwners:"1",
    description:"the bus is a 64 seater, the seats are as good as new and the mechanical parts of the bus are all in good condition",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"5000000 shillings",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire: true
  }

},
{
  Id:'17',
  make:"suzuki",
  Model:"metro-bus",
  year: 2018,
  image: "cars2/bus3.jpeg",
  moreinfo:{
    condition:"like new",
    mileage:"1200" ,
    previousOwners:"1",
    description:"the 32 seater is well mantained public bus. all the seats are in good condition and the mechanical part. u allowed to request for review of each part if interest in it",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"9000000 shillings",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire: true
  }

},
{
  Id:'18',
  make:"mazda",
  Model:"modern-coast",
  year: 2017,
  image: "cars2/bus4.jpeg",
  moreinfo:{
    condition:"used",
    mileage: "120000 miles",
    previousOwners:"1",
    description:"the bus has had a good number of trips around mombasa road but still in good condition. all the seats and seat sockets are working",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"7000000 shillings",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire: true
  }

},
{
  Id:'1',
  make:"toyota",
  Model:"corolla",
  year: 2017,
  image: "cars2/bus2.jpeg",
  moreinfo:{
    condition:"like new",
    mileage:"12000 miles",
    previousOwners:"1",
    description:"it is an electronic bus . it is still very young and the power consumption is to very minimal",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"2000000",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire:true
  }

},
{
  Id:'1',
  make:"toyota",
  Model:"bus",
  year: 2019,
  image: "cars2/5.jpeg",
  moreinfo:{
    condition:'used',
    mileage: "12000 miles",
    previousOwners:"1",
    description:"it is a  64 seater school bus . everything is in good condition and the engine and all mechanical parts are in good condition",
    currentOwner: {
      name: "Alex Mutua",
      contactNumber: "0740492875",
      email: "blancaale@gmail.com",
      location: "Nairobi, Kenya",
      ownershipDuration: "3 years",
      reasonForSelling: "Upgrading to a newer model",
      previousCarSales: 2,
      serviceRecords: [
        { date: "2024-01-15", service: "Oil change, brake check" },
        { date: "2023-08-10", service: "Tire replacement, alignment" }
      ],
      accidentHistory: "No major accidents, minor scratch on rear bumper",
      parkingType: "Garage-kept",
      usageHistory: "Personal use only",
      priceNegotiable: true,
      paymentMethods: ["Cash", "Bank Transfer", "MPesa"],
      ownershipTransferSupport: true,
      extras: ["Spare key", "Owner's manual", "Recent servicing"]
    },
    priceCents:"5000000",
    seller: {
      Name:'alex mwanzia',
      contactnumber: "0740492875",
      email:"blancaale@gmail.com",
      location :"nairobi-kenya"
    },
    availableforhire:true
  }

},

]





             