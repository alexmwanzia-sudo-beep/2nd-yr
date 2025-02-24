document.getElementById('signupForm').addEventListener('submit' async (e)=>
{
  e.preventDefault();
  const name =document.getElementById('name').value;
  const email=document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
})

if(!password==confirmPassword){
  alert('Please the correct password');
  return;

}

const userData={name,email,password,confirmPassword};
try {
  const response=await fetch ('http://localhost:5000/register',{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
   body: JSON.stringify(userData)
  });
  if(response.ok){
    alert('user registered successfully');
  }

else{
  alert('error'+ response.statusText);
}
}
 catch(error) {
  console.error('error registering user:',error)
  alert('something went wrong')

 }
   

 document.getElementById('loginForm').addEventListener('submit',async(e)=>
{
  e.preventDefault();
  const email=document.getElementById('loginEmail').value;
  const password=document.getElementById('loginPassword').value;
  const loginData={email,password}
  try{
const response= fetch('http://localhost:5000/login',{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify(loginData)
});
if (response.ok){
  const {token}=(await response).json();
  localStorage.setItem('token',token);
  alert('login successful');
}else
{
  alert('invalid credentials');
}
  
  }
  catch(error){
    console.error('error logging in:' ,error);
    alert('something went wrong')
  }
})