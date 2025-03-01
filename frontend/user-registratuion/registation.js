function  showSignup(){
  document.getElementById('signup-form').style.display='block';
  document.getElementById('login-form').style.display='none';
  document.querySelector('tab-button.active').classList.remove('active');
  document.querySelector('tab-button.nth-child(1)').classList.add('active');
}

function showLogin(){
  document.getElementById('login-form').style.display='block';
  document.getElementById("signup-form").style.display='none';
  document.querySelector('tab-button.active').classList.remove('active');
  document.querySelector('tab-button.nth-child(2)').classList.add('active');
} 
window.onload=showSignup() /*set the default form to be sign up*/;
