import { isAuth } from "./src/guards/auth-guard";
import "./src/css/styles.css";
import Toast from "./src/shared/alerts";

// Hamburger menu
const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileSidebar = document.getElementById("mobile-sidebar");
const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const line3 = document.getElementById("line3");
const mapSection = document.getElementById("map-section");

let isMenuOpen = false;

hamburgerBtn.addEventListener("click", () => {
  isMenuOpen = !isMenuOpen;

  if (isMenuOpen) {
    // Open menu
    mobileMenu.classList.remove("opacity-0", "pointer-events-none");
    mobileMenu.classList.add("opacity-100");
    mobileSidebar.classList.remove("-translate-x-full");
    mobileSidebar.classList.add("translate-x-0");
    mapSection.classList.add("hidden"); // Hide map
    // Hamburger button animation to X
    line1.style.transform = "rotate(45deg) translate(5px, 5px)";
    line2.style.opacity = "0";
    line3.style.transform = "rotate(-45deg) translate(7px, -6px)";
  } else {
    // Close menu
    mobileMenu.classList.add("opacity-0", "pointer-events-none");
    mobileMenu.classList.remove("opacity-100");
    mobileSidebar.classList.add("-translate-x-full");
    mobileSidebar.classList.remove("translate-x-0");
    mapSection.classList.remove("hidden"); // Show map
    // X to hamburger animation
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

// Initialize map
const map = L.map("map").setView([10.9685, -74.7813], 12);

// Add OpenStreetMap tile
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Global variables
let routesData = [];
let currentRoute = null;
let currentMarkers = [];
let currentPolyline = null;

// Function to populate route selectors
function populateRouteSelects() {
  const desktopSelect = document.getElementById("desktop-route-select");
  const mobileSelect = document.getElementById("mobile-route-select");

  // Clear existing options
  desktopSelect.innerHTML = "";
  mobileSelect.innerHTML = "";

  // Add default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a route";
  desktopSelect.appendChild(defaultOption.cloneNode(true));
  mobileSelect.appendChild(defaultOption);

  // Add route options
  routesData.forEach((route) => {
    const option = document.createElement("option");
    option.value = route._id;
    option.textContent = route.name;

    desktopSelect.appendChild(option.cloneNode(true));
    mobileSelect.appendChild(option);
  });
}

// Function to get routes from API
async function fetchRoutes(clear = false) {
  try {
    const response = await fetch(
      "https://deployment-connectbq.onrender.com/routes"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    routesData = data;
    if (!clear) {
      populateRouteSelects();
    }

    console.log("Routes loaded from API:", routesData);
  } catch (error) {
    console.error("Error loading routes from API:", error);
    // Show error message instead of using example data
    Toast.error(
      "Error loading routes. Please check your connection and try again."
    );
  }
}

// Function to clear current route from map
function clearCurrentRoute() {
  // Clear markers
  currentMarkers.forEach((marker) => {
    if (map.hasLayer(marker)) {
      map.removeLayer(marker);
    }
  });
  currentMarkers = [];

  // Clear route line
  if (currentPolyline && map.hasLayer(currentPolyline)) {
    map.removeLayer(currentPolyline);
    currentPolyline = null;
  }
}

// Function to show route information in the white box
function showRouteInfo(route) {
  const routeInfoContent = document.getElementById("route-info-content");
  const routeInfoSection = document.getElementById("route-info-section");
  routeInfoSection.classList.remove("h-48");
  routeInfoSection.classList.add("h-64");
  routeInfoSection.classList.add("overflow-y-auto");

  routeInfoContent.innerHTML = "";

  routeInfoContent.innerHTML = `
    <div class="space-y-4">
      <div class="text-center pb-4 border-b border-white-300">
        <h3 class="text-xl font-bold mb-2">${route.name}</h3>
        <p class="text-white text-sm">Route Details</p>
      </div>
      
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-white">Distance:</span>
          <span class="font-semibold">${route.distance} km</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-white">Estimated time:</span>
          <span class="font-semibold">${route.estimated_time} min</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-white">Cost:</span>
          <span class="font-semibold text-yellow-300">$${route.estimated_cost.toLocaleString()}</span>
        </div>
      </div>
      
      <div class="pt-3 border-t border-white-300 space-y-2">
        <div class="text-sm">
          <span class="font-medium text-white-200">Start:</span> 
          <span class="text-white">${route.initial_point.name}</span>
        </div>
        <div class="text-sm">
          <span class="font-medium text-white-200">Destination:</span> 
          <span class="text-white">${route.end_point.name}</span>
        </div>
      </div>
      
      ${
        route.alerts && route.alerts.length > 0
          ? `
        <div class="pt-3 border-t border-white-300">
          <h4 class="font-semibold text-white-200 mb-2 flex items-center gap-2">
            <span class="text-red-300">⚠️</span>
            Active Alerts
          </h4>
          <div class="space-y-2">
            ${route.alerts
              .map((alert) => {
                const severityColor = {
                  low: "bg-yellow-500/20 text-yellow-200 border-yellow-400/30",
                  medium:
                    "bg-orange-500/20 text-orange-200 border-orange-400/30",
                  high: "bg-red-500/20 text-red-200 border-red-400/30",
                };

                const severityText = {
                  low: "Low",
                  medium: "Medium",
                  high: "High",
                };

                const typeText = {
                  traffic: "Traffic",
                  block: "Block",
                  event: "Event",
                };

                return `
                <div class="p-2 rounded-lg border ${
                  severityColor[alert.severity] ||
                  "bg-gray-500/20 text-gray-200 border-gray-400/30"
                }">
                  <div class="flex justify-between items-start mb-1">
                    <span class="font-medium text-xs">${
                      typeText[alert.type] || alert.type
                    }</span>
                    <span class="text-xs px-2 py-1 rounded-full ${
                      severityColor[alert.severity] ||
                      "bg-gray-500/30 text-gray-200"
                    }">
                      ${severityText[alert.severity] || alert.severity}
                    </span>
                  </div>
                  <div class="text-xs text-white-200">
                    Reported by: ${alert.username || "User"}
                  </div>
                  <div class="text-xs text-white-300 mt-1">
                    ${new Date(alert.createdAt).toLocaleString("en-US")}
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>
        </div>
      `
          : ""
      }
    </div>
  `;
}

// Function to show a route on the map
function showRoute(routeId) {
  clearCurrentRoute();

  addAlertSection?.classList.remove("hidden");

  const route = routesData.find((r) => r._id === routeId);
  if (!route) {
    console.error("Route not found:", routeId);
    return;
  }

  currentRoute = route.name;
  console.log("Showing route:", route.name);

  // Create coordinates array for the route
  const coordinates = [];

  // Add initial point
  coordinates.push([
    route.initial_point.coordinates.latitude,
    route.initial_point.coordinates.longitude,
  ]);

  // Add path points
  route.path.forEach((point) => {
    coordinates.push([point.coordinates.latitude, point.coordinates.longitude]);
  });

  // Add final point
  coordinates.push([
    route.end_point.coordinates.latitude,
    route.end_point.coordinates.longitude,
  ]);

  // Create route line
  currentPolyline = L.polyline(coordinates, {
    color: "#FF6B35",
    weight: 6,
    opacity: 0.8,
    smoothFactor: 1,
  }).addTo(map);

  // Create markers for each point
  coordinates.forEach((coord, index) => {
    let marker;
    let popupContent;

    if (index === 0) {
      // Initial point
      const icon = L.divIcon({
        html: `<div style="background-color: #28a745; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 12px; font-weight: bold;">S</span></div>`,
        className: "custom-div-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      marker = L.marker(coord, { icon: icon });
      popupContent = `<strong>${route.initial_point.name}</strong><br><span style="color: #28a745;">Starting Point</span>`;
    } else if (index === coordinates.length - 1) {
      // Final point
      const icon = L.divIcon({
        html: `<div style="background-color: #dc3545; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 12px; font-weight: bold;">E</span></div>`,
        className: "custom-div-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      marker = L.marker(coord, { icon: icon });
      popupContent = `<strong>${route.end_point.name}</strong><br><span style="color: #dc3545;">End Point</span>`;
    } else {
      // Intermediate stops
      const icon = L.divIcon({
        html: `<div style="background-color: #007bff; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
        className: "custom-div-icon",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      marker = L.marker(coord, { icon: icon });
      popupContent = `<strong>${
        route.path[index - 1].name
      }</strong><br><span style="color: #007bff;">Intermediate Stop</span>`;
    }

    marker.bindPopup(popupContent);
    marker.addTo(map);
    currentMarkers.push(marker);
  });

  // Adjust map view to the route
  map.fitBounds(currentPolyline.getBounds(), { padding: [20, 20] });

  // Show route information in the white box
  showRouteInfo(route);
}

// Function to handle route search
function handleRouteSearch() {
  const desktopSelect = document.getElementById("desktop-route-select");
  const mobileSelect = document.getElementById("mobile-route-select");

  const selectedRouteId = desktopSelect.value || mobileSelect.value;

  if (selectedRouteId) {
    showRoute(selectedRouteId);

    // If on mobile, close menu after search
    if (isMenuOpen) {
      hamburgerBtn.click();
    }
  } else {
    Toast.warning("Please select a route");
  }
}

// Function to handle alert reporting
async function handleAlertReport() {
  const alertType =
    document.getElementById("alert-type-select").value ||
    document.getElementById("alert-type-select-mobile").value;
  const alertSeverity =
    document.getElementById("alert-severity-select").value ||
    document.getElementById("alert-severity-select-mobile").value;

  if (!alertType || !alertSeverity) {
    Toast.warning("Please select alert type and severity");
    return;
  }

  const username = JSON.parse(localStorage.getItem("user")).username;
  const route = routesData.find((route) => route.name === currentRoute);

  if (!username || !route) return;

  const newRoute = {
    type: alertType,
    severity: alertSeverity,
    username: username,
  };

  const req = await fetch(
    `https://deployment-connectbq.onrender.com/routes/${route._id}/alerts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRoute),
    }
  );

  if (req.ok) {
    await fetchRoutes(true);
    const route = routesData.find((r) => r.name === currentRoute);
    showRoute(route._id);
    Toast.success("Alert reported successfully");
  } else {
    Toast.error("We cannot add your alert, please try again later");
  }

  if (isMenuOpen) {
    hamburgerBtn.click();
  }

  // Clear selections
  document.getElementById("alert-type-select").value = "";
  document.getElementById("alert-severity-select").value = "";
  document.getElementById("alert-type-select-mobile").value = "";
  document.getElementById("alert-severity-select-mobile").value = "";
}

// Function to clear route information
function clearRouteInfo() {
  const routeInfoContent = document.getElementById("route-info-content");
  routeInfoContent.innerHTML = `
    <div class="text-center py-8">
      <p class="text-lg opacity-80">Select a route to see information</p>
    </div>
  `;
}

// Initialization when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  // Load routes
  await fetchRoutes();

  // Configure search buttons
  const searchButtons = document.querySelectorAll(
    "#desktop-search-btn, #mobile-search-btn"
  );
  searchButtons.forEach((button) => {
    button.addEventListener("click", handleRouteSearch);
  });

  // Configure alert button
  const addAlertBtn = document.getElementById("add-alert-btn");
  if (addAlertBtn) {
    addAlertBtn.addEventListener("click", handleAlertReport);
  }

  const addAlertBtnMobil = document.getElementById("add-alert-btn-mobile");
  if (addAlertBtnMobil) {
    addAlertBtnMobil.addEventListener("click", handleAlertReport);
  }
});

// Configure authentication
const profileBtn = document.getElementById("profile-btn");
const profileBtnCel = document.getElementById("profile-btn-cel");
const logoutBtnCel = document.getElementById("logout-btn-cel");
const signinBtn = document.getElementById("signin-btn");
const signinBtnCel = document.getElementById("signin-btn-cel");
const addAlertSection = document.getElementById("add-alert-section");
const aboutBtn = document.getElementById("about-page");
const loginAdvise = document.getElementById("add-route-advise");
const loginAdviseMobil = document.getElementById("add-route-advise-mobil");

if (isAuth()) {
  profileBtn?.classList.toggle("hidden");
  profileBtnCel?.classList.toggle("hidden");
  logoutBtnCel?.classList.toggle("hidden");
  signinBtn?.classList.toggle("hidden");
  signinBtnCel?.classList.toggle("hidden");
  aboutBtn?.classList.toggle("hidden");
  loginAdvise.classList.toggle("hidden");
  loginAdviseMobil.classList.toggle("hidden");
}

// Configure logout
logoutBtnCel?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "/";
});

// Resize map when window is resized
window.addEventListener("resize", () => {
  setTimeout(() => {
    map.invalidateSize();
  }, 100);
});
