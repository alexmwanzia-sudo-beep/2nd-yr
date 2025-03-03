// Function to display user profile details
task function displayUserProfile(userData) {
  document.getElementById('profile-name').textContent = userData.name;
  document.getElementById('profile-email').textContent = userData.email;
  document.getElementById('profile-phone').textContent = userData.phone;
  document.getElementById('profile-image').src = userData.profileImage || 'default-profile.png';
}

// Function to fetch user profile data from the server
function getUserProfile() {
  fetch('/api/users/profile')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        displayUserProfile(data.user);
      } else {
        console.error("Error fetching user profile:", data.message);
      }
    })
    .catch(error => console.error("Error fetching user profile:", error));
}

// Function to handle profile picture update
function updateProfilePicture(event) {
  const formData = new FormData();
  const file = event.target.files[0];
  formData.append('profilePic', file);

  fetch('/api/users/update-profile-picture', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById('profile-image').src = data.newImageUrl;
        alert('Profile picture updated successfully!');
      } else {
        alert('Error updating profile picture!');
      }
    })
    .catch(error => {
      console.error('Error updating profile picture:', error);
      alert('Error updating profile picture!');
    });
}

// Function to handle profile information update
function updateProfileInfo(event) {
  event.preventDefault();
  const name = document.getElementById('edit-name').value;
  const email = document.getElementById('edit-email').value;
  const phone = document.getElementById('edit-phone').value;

  const updatedData = { name, email, phone };

  fetch('/api/users/update-profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Profile updated successfully');
        document.getElementById('profile-name').textContent = name;
        document.getElementById('profile-email').textContent = email;
        document.getElementById('profile-phone').textContent = phone;
      } else {
        alert('Error updating profile information');
      }
    })
    .catch(error => {
      console.error('Error updating profile:', error);
      alert('Error updating profile!');
    });
}

// Function to handle password change
function changePassword(event) {
  event.preventDefault();

  const oldPassword = document.getElementById('old-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (newPassword !== confirmPassword) {
    alert("Passwords don't match!");
    return;
  }

  const passwordData = { oldPassword, newPassword };

  fetch('/api/users/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(passwordData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Password changed successfully!');
      } else {
        alert('Error changing password!');
      }
    })
    .catch(error => {
      console.error('Error changing password:', error);
      alert('Error changing password!');
    });
}

// Event listeners
document.getElementById('profile-picture-input').addEventListener('change', updateProfilePicture);
document.getElementById('profile-info-form').addEventListener('submit', updateProfileInfo);
document.getElementById('password-change-form').addEventListener('submit', changePassword);

// Fetch user profile on page load
window.onload = function () {
  getUserProfile();
};
