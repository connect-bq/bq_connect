// Verificar si el usuario ya está logueado
if (localStorage.getItem("user")) {
  // Si el usuario está logueado, redirigir al dashboard
  if (window.location.pathname.includes("login.html")) {
    window.location.href = "../dashboard/dashboard.html";
  }
} else {
  // Si el usuario no está logueado
  if (window.location.pathname.includes("dashboard.html")) {
    // Redirigir al login si intenta acceder al dashboard
    window.location.href = "../login/login.html";
  }
  // Permitir permanecer en index.html
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

        // Redirect to dashboard.html
        window.location.href = "../dashboard/dashboard.html";
      } else {
        // Show an error message
        alert("Invalid email or password. Please try again.");
      }
    });
  } else {
    console.error("Form element not found. Ensure the form exists in the HTML.");
  }
});