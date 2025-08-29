document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los elementos que queremos animar
    const elementsToAnimate = document.querySelectorAll('.fade-in-element');
    const progressFills = document.querySelectorAll('.progress-fill');

    // Configuración del Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si el elemento está en la pantalla (intersecting)
            if (entry.isIntersecting) {
                // Añade la clase 'is-visible' para activar la animación CSS de fade-in
                entry.target.classList.add('is-visible');

                // Si el elemento es una barra de progreso, la animamos
                const progressFill = entry.target.querySelector('.progress-fill') || entry.target;
                if (progressFill && progressFill.classList.contains('progress-fill')) {
                    // Obtenemos el ancho final del atributo data-width
                    const finalWidth = progressFill.getAttribute('data-width');
                    if (finalWidth) {
                        // Asignamos el ancho para que la transición CSS se active
                        progressFill.style.width = finalWidth;
                    }
                }
                
                // Una vez que el elemento ha sido animado, dejamos de observarlo
                observer.unobserve(entry.target);
            }
        });
    }, {
        // La animación se dispara cuando al menos el 15% del elemento es visible
        threshold: 0.15 
    });

    // Le decimos al observer que vigile cada uno de nuestros elementos
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // También observamos directamente las barras de progreso si están dentro de un elemento ya observado
    progressFills.forEach(bar => {
        // En este caso, el contenedor de la barra es el observado, así que esto es un seguro
        const parentAnimator = bar.closest('.fade-in-element');
        if (!parentAnimator) {
             observer.observe(bar);
        }
    });
});