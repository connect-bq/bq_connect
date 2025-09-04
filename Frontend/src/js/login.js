import Toast from "../shared/alerts.js";
import '../css/styles.css';

document.addEventListener("DOMContentLoaded", () => {
  // Check if the user is already logged in
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser?.loggedIn) {
      // Redirect to dashboard if already logged in and on login.html
      if (window.location.pathname.includes("login")) {
        window.location.href = "/dashboard";
        return;
      }
    } else {
      // If not logged in and trying to access dashboard, redirect to login
      if (window.location.pathname.includes("dashboardl")) {
        window.location.href = "/login";
        return;
      }
    }
  } catch (e) {
    console.warn("Error reading user from localStorage:", e);
    localStorage.removeItem("user");
  }

  // Handle login form submission
  const form = document.querySelector("form");

  if (!form) {
    console.error(
      "Form element not found. Make sure the form exists in the HTML."
    );
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      Toast.error("Please fill in both fields.");
      return;
    }

    try {
      // Get all users from the API
      const response = await fetch(
        "https://deployment-connectbq.onrender.com/users"
      );

      if (!response.ok) {
        return Toast.error(`In this moment we can't connect, try again later`);
      }

      const users = await response.json();

      // Find the user that matches the email and password
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        Toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error during login request:", error);
      Toast.error("Could not connect to the server. Please try again later.");
    }
  });
});
