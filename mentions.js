document.addEventListener('DOMContentLoaded', () => {
    // Animation au défilement
    const observerOptions = {
        threshold: ,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.legal-section').forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(0px)';
        section.style.transition = 'all 0.5s ease-out';
        observer.observe(section);
    });

    // Mise à jour automatique de l'année
    const yearSpan = document.createElement('span');
    yearSpan.textContent = new Date().getFullYear();
    document.querySelectorAll('.copyright-year').forEach(el => {
        el.appendChild(yearSpan.cloneNode(true));
    });
});