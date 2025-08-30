document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario está logueado
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.loggedIn) {
    // Redirigir al login si no está logueado
    window.location.href = "./src/pages/login/login.html";
    return; // Detener la ejecución del resto del script
  }

  // Redirigir al dashboard desde el botón Profile
  const profileBtn = document.getElementById("profile-btn");

  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      // Redirigir a dashboard.html
      window.location.href = "./src/pages/dashboard/dashboard.html";
    });
  } else {
    console.error("El botón Profile no se encontró en el DOM.");
  }

  // Elementos del menú hamburguesa
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileSidebar = document.getElementById("mobile-sidebar");
  const line1 = document.getElementById("line1");
  const line2 = document.getElementById("line2");
  const line3 = document.getElementById("line3");
  const mapSection = document.getElementById("map-section");

  let isMenuOpen = false;

  // Función para abrir/cerrar el menú hamburguesa
  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
      // Abrir menú
      mobileMenu.classList.remove("opacity-0", "pointer-events-none");
      mobileMenu.classList.add("opacity-100");
      mobileSidebar.classList.remove("-translate-x-full");
      mobileSidebar.classList.add("translate-x-0");
      mapSection.classList.add("hidden"); // Oculta el mapa
      // Animación botón hamburguesa a X
      line1.style.transform = "rotate(45deg) translate(5px, 5px)";
      line2.style.opacity = "0";
      line3.style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      // Cerrar menú
      mobileMenu.classList.add("opacity-0", "pointer-events-none");
      mobileMenu.classList.remove("opacity-100");
      mobileSidebar.classList.add("-translate-x-full");
      mobileSidebar.classList.remove("translate-x-0");
      mapSection.classList.remove("hidden"); // Muestra el mapa
      // Animación X a hamburguesa
      line1.style.transform = "rotate(0) translate(0, 0)";
      line2.style.opacity = "1";
      line3.style.transform = "rotate(0) translate(0, 0)";
    }
  };

  // Evento para el botón hamburguesa
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", toggleMenu);
  }

  // Cerrar menú al hacer clic en el overlay
  if (mobileMenu) {
    mobileMenu.addEventListener("click", (e) => {
      if (e.target === mobileMenu) {
        toggleMenu();
      }
    });
  }

  // Permitir redirección desde el botón Profile dentro del menú hamburguesa
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      // Cerrar el menú hamburguesa si está abierto
      if (isMenuOpen) {
        toggleMenu();
      }

      // Redirigir a dashboard.html
      window.location.href = "./src/pages/dashboard/dashboard.html";
    });
  }

  // Inicializar mapa
  const map = L.map("map").setView([10.9685, -74.7813], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Marcadores
  const markers = [
    { coords: [10.9685, -74.7813], popup: "Centro de Barranquilla" },
    { coords: [10.945, -74.8], popup: "Suroriente" },
    { coords: [10.99, -74.77], popup: "Norte" },
  ];

  markers.forEach((marker) => {
    L.marker(marker.coords).addTo(map).bindPopup(marker.popup);
  });

  // Redimensionar mapa cuando se redimensiona la ventana
  window.addEventListener("resize", () => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  });
});

