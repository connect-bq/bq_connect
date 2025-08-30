document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario está logueado
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.loggedIn) {
    // Redirigir al login si no está logueado
    window.location.href = "../login/login.html";
    return; // Detener la ejecución del resto del script
  }

  // Mostrar información del usuario (opcional)
  console.log(`Bienvenido, ${user.name} (${user.email})`);

  // Función para cerrar sesión
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Eliminar la información del usuario de localStorage
      localStorage.removeItem("user");

      // Redirigir al login
      window.location.href = "../login/login.html";
    });
  } else {
    console.error("El botón de logout no se encontró en el DOM.");
  }
});