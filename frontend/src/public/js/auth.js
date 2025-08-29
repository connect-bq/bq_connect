document.addEventListener('DOMContentLoaded', () => {
    // Definir los IDs de los elementos de navegación
    const navElements = {
        desktop: {
            login: document.getElementById('login-link-desktop'),
            register: document.getElementById('register-link-desktop'),
            dashboard: document.getElementById('dashboard-link-desktop'),
            logout: document.getElementById('logout-button-desktop')
        },
        mobile: {
            login: document.getElementById('login-link-mobile'),
            register: document.getElementById('register-link-mobile'),
            dashboard: document.getElementById('dashboard-link-mobile'),
            logout: document.getElementById('logout-button-mobile')
        }
    };

    // Función para actualizar la visibilidad de los enlaces
    function updateNavUI() {
        const userToken = localStorage.getItem('userToken');
        const isLoggedIn = !!userToken; // Convierte a booleano: true si existe, false si no

        const applyVisibility = (elements) => {
            if (elements.login) elements.login.classList.toggle('hidden', isLoggedIn);
            if (elements.register) elements.register.classList.toggle('hidden', isLoggedIn);
            if (elements.dashboard) elements.dashboard.classList.toggle('hidden', !isLoggedIn);
            if (elements.logout) elements.logout.classList.toggle('hidden', !isLoggedIn);
        };
        
        applyVisibility(navElements.desktop);
        applyVisibility(navElements.mobile);
    }

    // Función para manejar el cierre de sesión
    function handleLogout() {
        localStorage.removeItem('userToken');
        window.location.href = '/login'; // Redirigir a la página de login
    }

    // Asignar el evento de clic a los botones de logout
    if (navElements.desktop.logout) navElements.desktop.logout.addEventListener('click', handleLogout);
    if (navElements.mobile.logout) navElements.mobile.logout.addEventListener('click', handleLogout);
    
    // Ejecutar la función al cargar la página para establecer el estado inicial
    updateNavUI();
});