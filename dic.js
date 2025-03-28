document.addEventListener("DOMContentLoaded", function () {
    console.log("La page d'accueil est chargée.");
  });
  
  function rediriger(profil) {
    const url = `pages/${profil}.html`;
    window.location.href = url;
  }
  