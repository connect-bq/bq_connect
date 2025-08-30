// Check if the user is already logged in
if (localStorage.getItem("user")) {
  // Redirect to index.html if the user is logged in
  window.location.href = "../../index.html";
}

// Handle login form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission

      // Get the email and password values
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      // Users for testing
      const users = [
        { name: "Admin User", email: "admin@example.com", password: "123" },
        { name: "Regular User", email: "user@example.com", password: "userpassword" },
      ];

      // Check if the entered credentials match any user
      const validUser = users.find(user => user.email === email && user.password === password);

      if (validUser) {
        // Save all user details in localStorage as a single object
        localStorage.setItem("user", JSON.stringify({
          loggedIn: true,
          name: validUser.name,
          email: validUser.email
        }));

        // Redirect to index.html
        window.location.href = "../../../index.html";
      } else {
        // Show an error message
        alert("Invalid email or password. Please try again.");
      }
    });
  } else {
    console.error("Form element not found. Ensure the form exists in the HTML.");
  }
});