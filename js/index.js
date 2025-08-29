document.addEventListener('DOMContentLoaded', () => {
    // Inicialización del Mapa
    const map = L.map('map').setView([10.9878, -74.7889], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const alertsContainer = document.getElementById('traffic-alerts-container');

    async function loadTrafficAlerts() {
        if (!alertsContainer) return;
        try {
            const response = await fetch('/api/routes');
            if (!response.ok) throw new Error('Failed to fetch routes');
            const routes = await response.json();
            
            alertsContainer.innerHTML = '';
            let hasAlerts = false;

            routes.forEach(route => {
                if (route.alerts && route.alerts.length > 0) {
                    hasAlerts = true;
                    route.alerts.forEach(alert => {
                        const lat = alert.latitude || route.initial_point.coordinates.latitude;
                        const lng = alert.longitude || route.initial_point.coordinates.longitude;
                        
                        const alertHTML = `
                            <div class="alert-item border rounded-lg p-3 bg-white cursor-pointer hover:bg-gray-50" data-lat="${lat}" data-lng="${lng}">
                                <p class="font-semibold text-sm">${alert.description || 'Alerta en ruta ' + route.name}</p>
                                <p class="text-xs text-gray-500">Severidad: ${alert.severity}</p>
                            </div>`;
                        alertsContainer.innerHTML += alertHTML;
                    });
                }
            });

            if (!hasAlerts) {
                alertsContainer.innerHTML = '<p class="text-gray-500 p-3">No hay alertas activas en este momento.</p>';
            }
            addEventListenersToAlerts();
        } catch (error) {
            alertsContainer.innerHTML = '<p class="text-red-500 p-3">No se pudieron cargar las alertas.</p>';
        }
    }

    function addEventListenersToAlerts() {
        document.querySelectorAll('.alert-item').forEach(item => {
            item.addEventListener('click', () => {
                const lat = item.dataset.lat;
                const lng = item.dataset.lng;
                if (lat && lng) map.flyTo([lat, lng], 16);
            });
        });
    }

    loadTrafficAlerts();
});