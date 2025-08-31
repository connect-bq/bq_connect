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

  form.addEventListener("submit", async (event) => { // Agrega 'async' aquí
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      // 1. Reemplazar la validación local con una llamada a la API
      const response = await fetch('/api/login', { // Asegúrate de que esta es la ruta de tu API de login
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      // 2. Manejar la respuesta del servidor
      const data = await response.json();

      if (response.ok) {
        // Si la respuesta es exitosa (código 200-299)
        // Guardar la información completa del usuario en localStorage
        localStorage.setItem("user", JSON.stringify({
          loggedIn: true,
          name: data.username, // Usa el campo 'username' de la respuesta del backend
          email: data.email,   // Usa el campo 'email' de la respuesta
          _id: data._id        // Guarda el ID del usuario para futuras peticiones
        }));

        // Redirigir al dashboard
        window.location.href = "../dashboard/dashboard.html";
      } else {
        // Si la respuesta no es OK, significa que hubo un error
        // Muestra el mensaje de error que viene del backend
        alert(data.message || "Correo o contraseña inválidos. Intenta de nuevo.");
      }

    } catch (error) {
      console.error('Error en la petición de login:', error);
      alert("No se pudo conectar con el servidor. Por favor, intenta de nuevo más tarde.");
    }
  });
});