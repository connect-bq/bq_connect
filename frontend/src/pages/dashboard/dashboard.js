document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.loggedIn) {
    window.location.href = "../login/login.html";
    return;
  }

  document.getElementById("nameUser").textContent = user.name || "No Name";
  document.getElementById("emailUser").textContent = user.email || "No Email";

  const letterContainer = document.getElementById("letter");
  if (letterContainer && user.name.trim().length > 0) {
    letterContainer.textContent = user.name.trim()[0].toUpperCase();
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "../login/login.html";
    });
  }

  const alertsContainer = document.getElementById("alerts-container");

  try {
    // Fetch all routes
    const response = await fetch(`/routes`);
    console.log(response)
    const routes = await response.json();
     console.log(routes)

    // Clear container
    alertsContainer.innerHTML = "";

    // Iterate through all routes and their alerts
    routes.forEach(route => {
      if (route.alerts && route.alerts.length > 0) {
        route.alerts.forEach(alert => {
          const article = document.createElement("article");
          article.className = "bg-gray-100 p-6 rounded-lg shadow-md";

          // Only show type, severity, and username
          article.innerHTML = `
            <h4 class="font-semibold text-lg text-gray-800">${alert.type}</h4>
            <p class="text-sm text-gray-500">Route: ${route.name}</p>
            <p class="text-md font-bold text-orange-600">Severity: ${alert.severity}</p>
            <p class="text-sm text-gray-500">User: ${alert.username}</p>
          `;

          alertsContainer.appendChild(article);
        });
      }
    });

  } catch (error) {
    console.error("Error fetching alerts:", error);
    alertsContainer.textContent = "Could not load alerts.";
  }
});
