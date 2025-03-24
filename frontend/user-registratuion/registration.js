// Function to toggle between signup and login forms
function toggleForms() {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    if (signupForm.style.display === "none") {
        signupForm.style.display = "block";
        loginForm.style.display = "none";
    } else {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
    }
}

// Function to validate email format
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Function to validate signup form
function validateSignup() {
    const firstname = document.getElementById("signup-firstname").value.trim();
    const lastname = document.getElementById("signup-lastname").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm-password").value;

    if (!firstname || !lastname || !email || !password || !confirmPassword) {
        alert("All fields are required.");
        return false;
    }

    if (!isValidEmail(email)) {
        alert("Invalid email format.");
        return false;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }

    return true;
}

// Function to validate login form
function validateLogin() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        alert("Email and password are required.");
        return false;
    }

    if (!isValidEmail(email)) {
        alert("Invalid email format.");
        return false;
    }

    return true;
}

// Function to send signup data to backend
async function registerUser() {
    if (!validateSignup()) return;

    const userData = {
        firstname: document.getElementById("signup-firstname").value.trim(),
        lastname: document.getElementById("signup-lastname").value.trim(),
        email: document.getElementById("signup-email").value.trim(),
        password: document.getElementById("signup-password").value
    };

    try {
        const response = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Registration successful! You can now log in.");
            toggleForms(); // Switch to login form
        } else {
            alert(result.message || "Registration failed.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server error. Please try again later.");
    }
}

// Function to send login data to backend
async function loginUser() {
    if (!validateLogin()) return;

    const loginData = {
        email: document.getElementById("login-email").value.trim(),
        password: document.getElementById("login-password").value
    };

    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Login successful!");
            window.location.href = "/home"; // Redirect to the home page
        } else {
            alert(result.message || "Login failed.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server error. Please try again later.");
    }
}

// Attach event listeners
document.getElementById("signup-btn").addEventListener("click", registerUser);
document.getElementById("login-btn").addEventListener("click", loginUser);
