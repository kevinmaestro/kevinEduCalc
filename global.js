// Gestion du menu global pour toutes les pages
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger');
    sidebar.classList.toggle('active');
    hamburger.classList.toggle('active');
}

document.querySelectorAll('.has-submenu > a').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        this.parentElement.classList.toggle('active');
        this.nextElementSibling.classList.toggle('active');
    });
});