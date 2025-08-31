document.addEventListener("DOMContentLoaded", async () => {
  // Leer usuario del localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.loggedIn) {
    console.warn("⚠️ No hay usuario logueado en localStorage.");
    // Opcional: redirigir al login si no está logueado
     window.location.href = "../../login/login.html";
    return;
  }

  // 👉 Mostrar info directamente desde localStorage
  console.log(`Bienvenido, ${user.name || "Usuario"} (${user.email || "sin email"})`);

  document.getElementById("nameUser").textContent = user.name || "Sin nombre";
  document.getElementById("emailUser").textContent = user.email || "Sin email";

  // 🔥 Si luego quieres traer datos reales desde tu API, descomenta esto:
  /*
  try {
    const response = await fetch(`http://localhost:3000/users/${user._id}`);
    if (!response.ok) throw new Error("No se pudo obtener la información del usuario");

    const userData = await response.json();

    document.getElementById("nameUser").textContent = userData.username || "Sin nombre";
    document.getElementById("emailUser").textContent = userData.email || "Sin email";

  } catch (error) {
    console.error("❌ Error cargando el usuario:", error.message);
  }
  */

  // Función para cerrar sesión
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "../../login/login.html";
    });
  } else {
    console.error("El botón de logout no se encontró en el DOM.");
  }
});
