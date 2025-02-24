const form = document.getElementById('buy-form');
if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const fullName = document.getElementById('full-name').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const address = document.getElementById('address').value;
        const kraPin = document.getElementById('kra-pin').value;
        const reservationAmount = document.getElementById('reservation-amount').value;

        console.log(fullName, phoneNumber, address, kraPin, reservationAmount);

        // Reset the form
        form.reset();
    });
}
