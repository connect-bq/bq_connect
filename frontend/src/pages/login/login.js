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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Por favor, completa ambos campos.");
      return;
    }

    try {
      // Obtener todos los usuarios desde la API
      const response = await fetch('/users');
      console.log("Respuesta cruda del servidor:", response);

      if (!response.ok) {
        throw new Error(`Error en la respuesta HTTP: ${response.status}`);
      }

      const users = await response.json();
      console.log("Usuarios obtenidos:", users);

      // Buscar el usuario que coincida con el email y contraseña
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Guardar al usuario en localStorage
        localStorage.setItem("user", JSON.stringify({
          loggedIn: true,
          name: user.username,
          email: user.email,
          _id: user._id
        }));

        // Redirigir al dashboard
        window.location.href = "../dashboard/dashboard.html";
      } else {
        alert("Correo o contraseña inválidos. Intenta de nuevo.");
      }

    } catch (error) {
      console.error('Error en la petición de login:', error);
      alert("No se pudo conectar con el servidor. Por favor, intenta de nuevo más tarde.");
    }
  });
});






// document.addEventListener("DOMContentLoaded", () => {
//   // Usuarios de prueba (simulación en memoria, no API)
//   const mockUsers = [
//     {
//       _id: "64f4c1d2a4b1c2d3e4f5a6b7",
//       username: "Juan Pérez",
//       email: "juan@example.com",
//       password: "123456" 
//     },
//     {
//       _id: "65a7b9d3e8f1c2d4b6a7e8f9",
//       username: "María Gómez",
//       email: "maria@example.com",
//       password: "abcdef"
//     }
//   ];

//   // Manejo del formulario
//   const form = document.querySelector("form");

//   if (!form) {
//     console.error("⚠️ Form no encontrado en el HTML.");
//     return;
//   }

//   form.addEventListener("submit", (event) => {
//     event.preventDefault();

//     const email = document.getElementById("email").value.trim();
//     const password = document.getElementById("password").value.trim();

//     // Buscar en usuarios de prueba
//     const user = mockUsers.find(
//       (u) => u.email === email && u.password === password
//     );

//     if (user) {
//       // Guardar en localStorage como si fuera login real
//       localStorage.setItem(
//         "user",
//         JSON.stringify({
//           loggedIn: true,
//           name: user.username,
//           email: user.email,
//           _id: user._id
//         })
//       );

//       // Redirigir al dashboard
//       window.location.href = "../dashboard/dashboard.html";
//     } else {
//       alert("❌ Usuario o contraseña incorrectos.");
//     }
//   });
// });
