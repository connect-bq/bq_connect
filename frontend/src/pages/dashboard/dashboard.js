// Menú hamburguesa
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileSidebar = document.getElementById('mobile-sidebar');
const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
const line3 = document.getElementById('line3');
const mapSection = document.getElementById('map-section');

let isMenuOpen = false;

hamburgerBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
        // Abrir menú
        mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
        mobileMenu.classList.add('opacity-100');
        mobileSidebar.classList.remove('-translate-x-full');
        mobileSidebar.classList.add('translate-x-0');
        mapSection.classList.add('hidden'); // Oculta el mapa
        // Animación botón hamburguesa a X
        line1.style.transform = 'rotate(45deg) translate(5px, 5px)';
        line2.style.opacity = '0';
        line3.style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        // Cerrar menú
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        mobileMenu.classList.remove('opacity-100');
        mobileSidebar.classList.add('-translate-x-full');
        mobileSidebar.classList.remove('translate-x-0');
        mapSection.classList.remove('hidden'); // Muestra el mapa
        // Animación X a hamburguesa
        line1.style.transform = 'rotate(0) translate(0, 0)';
        line2.style.opacity = '1';
        line3.style.transform = 'rotate(0) translate(0, 0)';
    }
});

// Close menu when clicking on the overlay
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        hamburgerBtn.click();
    }
});

// Initialize map
var map = L.map('map').setView([10.9685, -74.7813], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Marcadores
L.marker([10.9685, -74.7813]).addTo(map).bindPopup("Centro de Barranquilla");
L.marker([10.945, -74.8]).addTo(map).bindPopup("Suroriente");
L.marker([10.99, -74.77]).addTo(map).bindPopup("Norte");

// Redimensionar mapa cuando se redimensiona la ventana
window.addEventListener('resize', () => {
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
});