document.querySelector('#registrationForm').addEventListener('submit',(e)=>
{
  e.preventDefault();
  const name=document.querySelector('#name').value;
  const email=document.querySelector('#email').value;
  const password=document.querySelector('#password').value;
  const confirmpassword=document.querySelector('#confirmpassword').value;

  const passreg=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{6,}$/;
  if(!passreg.test(password))
  {
    alert("password must be longer than 6  it must have a special character and atleast some digits");
  }
  if (!name || !email || !password || !confirmpassword) {
    alert("All fields are required!");
    return;
  }
  if(password!==confirmpassword)
  {
    alert("password does not match");
    return
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters long!");
    return;
  }
  const emailsample= /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailsample.test(email))
  {
    alert("please enter a valid email")
    return;
  }
  const userdata={name:name, email:email, password:password, confirmpassword:confirmpassword};
  fetch('/register',
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
      body: JSON.stringify(userdata)
    }
  )


  .then((response) => response.json())
  .then((data) => {
      data.success 
          ? (alert('Registration successful!'), window.location.href = 'login.html') 
          : alert('Registration failed: ' + data.message);
  })
  .catch((error) => {
      console.error('Error:', error);
      alert('There was an error, please try again later.');
  });
});
