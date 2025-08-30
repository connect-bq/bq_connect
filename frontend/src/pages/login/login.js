document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario ya está logueado
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser?.loggedIn) {
      // Redirigir al dashboard si ya está logueado y está en login.html
      if (window.location.pathname.includes("login.html")) {
        window.location.href = "../dashboard/dashboard.html";
        return;
      }
    } else {
      // Si no está logueado y accede a dashboard, redirigir a login
      if (window.location.pathname.includes("dashboard.html")) {
        window.location.href = "../login/login.html";
        return;
      }
    }
  } catch (e) {
    console.warn("Error leyendo usuario desde localStorage:", e);
    localStorage.removeItem("user");
  }

  // Manejar el envío del formulario de login
  const form = document.querySelector("form");

  if (!form) {
    console.error("Form element not found. Ensure the form exists in the HTML.");
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Usuarios de prueba
    const users = [
      { name: "Admin User", email: "admin@example.com", password: "123" },
      { name: "Regular User", email: "user@example.com", password: "userpassword" },
    ];

    const validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify({
        loggedIn: true,
        name: validUser.name,
        email: validUser.email
      }));

      // Redirigir al dashboard
      window.location.href = "../dashboard/dashboard.html";
    } else {
      alert("Correo o contraseña inválidos. Intenta de nuevo.");
    }
  });
});
