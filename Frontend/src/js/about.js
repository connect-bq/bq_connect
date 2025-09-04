import '../css/about.css';
import '../css/styles.css';

document.addEventListener('DOMContentLoaded', () => {
    // This is the ideal place to add any interactivity
    // needed for the "About" page.
    
    const cards = document.querySelectorAll('.grid > article, .bg-gray-100');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target); // Ensure the animation only runs once
            }
        });
    }, {
        threshold: 0.1 
    });

    cards.forEach(card => {
        observer.observe(card);
    });
});