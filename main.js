function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Gestion des formulaires dynamiques
function createDynamicInputs(type, count) {
    const container = document.getElementById(`${type}-inputs`);
    container.innerHTML = Array.from({length: count}, (_, i) => `
        <div class="input-group">
            <label>${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}</label>
            <input type="number" step="0.01" required>
        </div>
    `).join('');
}

function toggleMenu() {
    const menuContainer = document.getElementById('menuContainer');

    // Basculer l'affichage du menu
    if (menuContainer.classList.contains('active')) {
        menuContainer.classList.remove('active');
    } else {
        menuContainer.classList.add('active');
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    const dropdowns = document.querySelectorAll(".dropdown");

    // Gestion du menu mobile
    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });

    // Gestion des sous-menus
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", function (e) {
            e.stopPropagation();
            this.classList.toggle("active");
        });
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener("click", function (e) {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove("active");
            dropdowns.forEach(drop => drop.classList.remove("active"));
        }
    });
});
