document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('userToken');

    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch('/api/users/me', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            localStorage.removeItem('userToken');
            window.location.href = '/login';
            return;
        }

        const user = await response.json();
        
        document.getElementById('user-name-main').textContent = user.username;
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-initial').textContent = user.username.charAt(0).toUpperCase();

        const favoritesList = document.getElementById('favorite-routes-list');
        favoritesList.innerHTML = '';
        if (user.favorites_routes && user.favorites_routes.length > 0) {
            user.favorites_routes.forEach(routeId => {
                const routeHTML = `
                    <div class="bg-white p-4 rounded-lg shadow">
                        <h4 class="font-bold">ID de Ruta Favorita:</h4>
                        <p class="text-sm text-gray-600">${routeId}</p>
                    </div>`;
                favoritesList.innerHTML += routeHTML;
            });
        } else {
            favoritesList.innerHTML = '<p class="text-gray-500 col-span-full">No tienes rutas favoritas guardadas.</p>';
        }

    } catch (error) {
        console.error('Error al cargar los datos del dashboard:', error);
    }
});