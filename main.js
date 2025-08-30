document.addEventListener("DOMContentLoaded", () => {
  // Intentar obtener al usuario desde localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    console.warn("Error al parsear 'user' desde localStorage:", e);
  }

  // Verificar si el usuario está logueado
  if (!user || !user.loggedIn) {
    // Si el usuario no está logueado e intenta acceder al dashboard
    if (window.location.pathname.includes("dashboard.html")) {
      // Ruta corregida: asegúrate de que esta sea accesible desde donde se carga el HTML
      window.location.href = "/frontend/src/pages/login/login.html";
      return;
    }
  }

  // Redirigir al dashboard desde el botón "Profile"
  const profileBtn = document.getElementById("profile-btn");

  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      window.location.href = "/frontend/src/pages/dashboard/dashboard.html";
    });
  } else {
    console.warn("El botón Profile no se encontró en el DOM.");
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
      if (mapSection) mapSection.classList.add("hidden");

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
      if (mapSection) mapSection.classList.remove("hidden");

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
      if (isMenuOpen) {
        toggleMenu(); // Cerrar menú si está abierto
      }

      window.location.href = "/frontend/src/pages/dashboard/dashboard.html";
    });
  }

  // Inicializar mapa con Leaflet
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

  // Redimensionar mapa al cambiar el tamaño de la ventana
  window.addEventListener("resize", () => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  });
});
