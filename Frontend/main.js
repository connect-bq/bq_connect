import { isAuth } from "./src/guards/auth-guard";

// Menú hamburguesa
const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileSidebar = document.getElementById("mobile-sidebar");
const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const line3 = document.getElementById("line3");
const mapSection = document.getElementById("map-section");
const mobileRouteSelect = document.getElementsByClassName("test");
const selectElement = document.getElementById("desktop-route-select");

let isMenuOpen = false;

hamburgerBtn.addEventListener("click", () => {
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
});

// Close menu when clicking on the overlay
mobileMenu.addEventListener("click", (e) => {
  if (e.target === mobileMenu) {
    hamburgerBtn.click();
  }
});

// Inicializa el mapa
const map = L.map("map").setView([10.9685, -74.7813], 12);

// Agrega el tile de OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let mainMakers = [];
let routesData = [];

function populateSelect(data) {

  selectElement.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select one Route';
  selectElement.appendChild(defaultOption);

  data.forEach(route => {

    const option = document.createElement('option');
    option.value = route._id;
    option.textContent = route.name;
    selectElement.appendChild(option);

  });
}

async function fetchRoutes() {
  const req = await fetch("https://deployment-connectbq.onrender.com/routes");
  const data = await req.json();
  routesData = data;
  populateSelect(routesData);

}

async function fetchStops(name) {
  const req = await fetch("https://deployment-connectbq.onrender.com/routes");
  const data = await req.json();
  const route = data.find((route) => route.name === name);

  if (!route) return;
  const stops = route.path;

  stops.unshift(route.initial_point);
  stops.push(route.end_point);

  stops.forEach((stop) => {
    mainMakers.push(
      L.marker([stop.coordinates.latitude, stop.coordinates.longitude])
        .addTo(map)
        .bindPopup(stop.name)
    );
  });
}

fetchRoutes();
console.error()
// Variables para almacenar elementos del mapa
let currentRoute = null;
let currentStops = [];
let routeInfoPanel = null;

// Función para limpiar ruta actual
function clearCurrentRoute() {
  if (currentRoute && map.hasLayer(currentRoute)) {
    map.removeLayer(currentRoute);
  }
  currentRoute = null;

  currentStops.forEach((stopMarker) => {
    if (map.hasLayer(stopMarker)) map.removeLayer(stopMarker);
  });
  currentStops = [];

  mainMakers.forEach((m) => {
    if (map.hasLayer(m)) map.removeLayer(m);
  });
  mainMakers = [];

  if (routeInfoPanel) {
    routeInfoPanel.remove();
    routeInfoPanel = null;
  }
}

// Función para mostrar ruta en el mapa
function showRoute(routeKey) {
  // Limpiar ruta anterior
  clearCurrentRoute();

  const route = routesData.find((route) => route.name == routeKey);
  if (!route) return;

  const routes = route.path;
  const isStart = [
    route.initial_point.coordinates.latitude,
    route.initial_point.coordinates.longitude,
  ];
  const isEnd = [
    route.end_point.coordinates.latitude,
    route.end_point.coordinates.longitude,
  ];
  const coordinatesPath = routes.map((point) => [
    point.coordinates.latitude,
    point.coordinates.longitude,
  ]);

  coordinatesPath.unshift(isStart);
  coordinatesPath.push(isEnd);

  // Crear la línea de la ruta
  currentRoute = L.polyline(coordinatesPath, {
    weight: 4,
    opacity: 0.8,
  }).addTo(map);

  let icon;

  icon = L.divIcon({
    html: `<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 10px; font-weight: bold;">S</span></div>`,
    className: "custom-div-icon",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const initialMarker = L.marker(isStart, { icon: icon }).addTo(map);
  initialMarker.bindPopup(`<strong>${stop.name}</strong><br>${"Inicio"}`);
  currentStops.push(initialMarker);

  icon = L.divIcon({
    html: `<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 10px; font-weight: bold;">E</span></div>`,
    className: "custom-div-icon",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const marker = L.marker(isEnd, { icon: icon }).addTo(map);
  marker.bindPopup(`<strong>${stop.name}</strong><br>${"Destino"}`);
  currentStops.push(marker);

  // Agregar marcadores de paradas
  coordinatesPath.forEach((stop) => {
    icon = L.divIcon({
      html: `<div style="background-color: blue; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
      className: "custom-div-icon",
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });

    const marker = L.marker(stop, { icon: icon }).addTo(map);
    marker.bindPopup(`<strong>${stop.name}</strong><br>${"Parada"}`);
    currentStops.push(marker);
  });

  // Ajustar vista del mapa a la ruta
  map.fitBounds(currentRoute.getBounds(), { padding: [20, 20] });

  // Mostrar información de la ruta
  showRouteInfo(route);
  fetchStops(routeKey);
}

// Función para mostrar información de la ruta
function showRouteInfo(route) {
  routeInfoPanel = document.createElement("div");
  routeInfoPanel.className =
    "fixed bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 bg-white rounded-lg shadow-lg p-4 z-100000";
  routeInfoPanel.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <h3 class="font-semibold text-lg text-gray-800">${route.name}</h3>
            <button id="close-route-info" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <div class="flex justify-between items-center mb-3">
            <span class="text-sm text-gray-600">Duración: ${route.estimated_time}Min</span>
            <span class="font-semibold text-lg">${route.estimated_cost} Pesos</span>
        </div>
        </div>
    `;

  document.body.appendChild(routeInfoPanel);

  // Agregar evento para cerrar el panel
  document.getElementById("close-route-info").addEventListener("click", () => {
    clearCurrentRoute();
  });
}

// Función para manejar la búsqueda de rutas
function searchRoute() {
  const selectElements = document.querySelectorAll("select");

  selectElements.forEach((select) => {
    const selectedValue = select.value;

    const routeMap = {
      op1: "Transmetro R1",
      op2: "Transmetro U30",
      op3: "Transmetro A7-1",
    };

    const routeKey = routeMap[selectedValue];
    if (routeKey) {
      showRoute(routeKey);

      // Si está en mobile, cerrar el menú después de buscar
      if (isMenuOpen) {
        hamburgerBtn.click();
      }
    }
  });
}

// Función para manejar el reporte de alertas
function handleAlerts() {
  const selectElements = document.querySelectorAll("select");

  selectElements.forEach((select) => {
    const selectedValue = select.value;

    const alertMap = {
      ot1: "Block",
      ot2: "Traffic",
      ot3: "Event",
    };

    const routeKey = routeMap[selectedValue];
    if (routeKey) {
      showRoute(routeKey);

      // Si está en mobile, cerrar el menú después de buscar
      if (isMenuOpen) {
        hamburgerBtn.click();
      }
    }
  });
}

// Agregar event listeners a los botones de búsqueda
document.addEventListener("DOMContentLoaded", () => {
  const searchButtons = document.querySelectorAll("button");
  const profileBtn = document.getElementById("profile-btn");
  const profileBtnCel = document.getElementById("profile-btn-cel");
  const loguoutBtnCel = document.getElementById("logout-btn-cel");
  const signinbtn = document.getElementById("signin-btn")
  const signinBtnCel = document.getElementById("signin-btn-cel");
  const addAlertSection = document.getElementById("add-alert-section");
  const alertTypeInput = document.getElementById("alert-type-select");
  const alertSeverityInput = document.getElementById("alert-severity-select");
  const addAlertBtn = document.getElementById('add-alert-btn');
  const aboutBtn = document.getElementById('about-page')

  loguoutBtnCel.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "./index.html";
  });

  if (isAuth()) {
    profileBtn.classList.toggle("hidden");
    profileBtnCel.classList.toggle("hidden");
    loguoutBtnCel.classList.toggle("hidden");
    signinbtn.classList.toggle("hidden");
    signinBtnCel.classList.toggle("hidden");
    addAlertSection.classList.toggle("hidden");
    aboutBtn.classList.toggle("hidden");
  }

  var select2 = document.getElementsByClassName("test");

  searchButtons.forEach((button) => {
    if (button.textContent.includes("Search Routes")) {
      button.addEventListener("click", searchRoute);
    }
  });
});

// Redimensionar mapa cuando se redimensiona la ventana
window.addEventListener("resize", () => {
  setTimeout(() => {
    map.invalidateSize();
  }, 100);
});
