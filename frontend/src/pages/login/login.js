document.addEventListener("DOMContentLoaded", () => {
  // Check if the user is already logged in
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser?.loggedIn) {
      // Redirect to dashboard if already logged in and on login.html
      if (window.location.pathname.includes("login.html")) {
        window.location.href = "../dashboard/dashboard.html";
        return;
      }
    } else {
      // If not logged in and trying to access dashboard, redirect to login
      if (window.location.pathname.includes("dashboard.html")) {
        window.location.href = "../login/login.html";
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
    console.error("Form element not found. Make sure the form exists in the HTML.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      // Get all users from the API
      const response = await fetch('/users'); 
      console.log("Raw server response:", response);

      if (!response.ok) {
        throw new Error(`HTTP response error: ${response.status}`);
      }

      const users = await response.json();
      console.log("Users retrieved:", users);

      // Find the user that matches the email and password
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify({
          loggedIn: true,
          name: user.username,
          email: user.email,
          _id: user._id
        }));

        // Redirect to dashboard
        window.location.href = "../dashboard/dashboard.html";
      } else {
        alert("Invalid email or password. Please try again.");
      }

    } catch (error) {
      console.error('Error during login request:', error);
      alert("Could not connect to the server. Please try again later.");
    }
  });
});
