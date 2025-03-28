document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const fileInput = document.getElementById('attachment');
    const fileLabel = fileInput.nextElementSibling;

    // Gestion du fichier joint
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileLabel.innerHTML = `<i class="fas fa-paperclip"></i> ${this.files[0].name}`;
        }
    });

    // Validation du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = new FormData(form);
            
            // Simulation d'envoi
            fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert('Message envoyé avec succès !');
                form.reset();
                fileLabel.innerHTML = `<i class="fas fa-paperclip"></i> Joindre un fichier`;
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Une erreur est survenue, veuillez réessayer.');
            });
        }
    });

    function validateForm() {
        let isValid = true;
        
        // Validation des champs
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        // Validation email
        const emailField = document.getElementById('email');
        if (!validateEmail(emailField.value)) {
            isValid = false;
            emailField.classList.add('error');
        }

        return isValid;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});