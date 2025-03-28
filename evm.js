document.addEventListener("DOMContentLoaded", function() {
    // Constantes
    const STORAGE_KEY = "eleveRecords";
    
    // Éléments d'authentification
    const authSection = document.getElementById("authSection");
    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const loginSubmit = document.querySelector("#loginForm button[type='submit']");
    const signupSubmit = document.querySelector("#studentInfoForm button[type='submit']");
    
    // Éléments du dashboard
    const dashboard = document.getElementById("dashboard");
    const userName = document.getElementById("userName");
    const userDetails = document.getElementById("userDetails");
    const logoutBtn = document.getElementById("logoutBtn");
    const showSheetBtn = document.getElementById("showSheetBtn");
    const calcBtn = document.getElementById("calcBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const gradeSheetContainer = document.getElementById("gradeSheetContainer");
    const calculatedSheetContainer = document.getElementById("calculatedSheetContainer");
    const generalAverage = document.getElementById("generalAverage");
    
    let currentUser = null;
  
    // Gestion des onglets
    loginTab.addEventListener("click", function() {
      loginTab.classList.add("active");
      signupTab.classList.remove("active");
      loginForm.classList.add("active");
      signupForm.classList.remove("active");
    });
  
    signupTab.addEventListener("click", function() {
      signupTab.classList.add("active");
      loginTab.classList.remove("active");
      signupForm.classList.add("active");
      loginForm.classList.remove("active");
    });
  
    // Connexion
    loginSubmit.addEventListener("click", function(e) {
      e.preventDefault();
      
      const loginNom = document.getElementById("loginNom").value;
      const loginPrenom = document.getElementById("loginPrenom").value;
      const loginPassword = document.getElementById("loginPassword").value;
      
      const records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      currentUser = records.find(record => 
        record.nom === loginNom && 
        record.prenom === loginPrenom && 
        record.password === loginPassword
      );
      
      if (currentUser) {
        authSection.style.display = "none";
        dashboard.style.display = "block";
        displayUserInfo(currentUser);
      } else {
        alert("Identifiants incorrects. Veuillez réessayer.");
      }
    });
  
    // Création de compte
    signupSubmit.addEventListener("click", function(e) {
      e.preventDefault();
      
      const newUser = {
        nom: document.getElementById("nom").value,
        prenom: document.getElementById("prenom").value,
        classe: document.getElementById("classe").value,
        ecole: document.getElementById("ecole").value,
        age: document.getElementById("age").value,
        nbMatieres: parseInt(document.getElementById("nbMatieres").value),
        nbInterros: parseInt(document.getElementById("nbInterros").value),
        nbDevoirs: parseInt(document.getElementById("nbDevoirs").value),
        password: document.getElementById("password").value,
        annee: new Date().getFullYear(),
        grades: {}
      };
      
      let records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      records.push(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      
      alert("Compte créé avec succès ! Veuillez vous connecter.");
      loginTab.click();
      document.getElementById("loginNom").value = newUser.nom;
      document.getElementById("loginPrenom").value = newUser.prenom;
    });
  
    // Déconnexion
    logoutBtn.addEventListener("click", function() {
      currentUser = null;
      dashboard.style.display = "none";
      authSection.style.display = "block";
      loginTab.click();
      document.getElementById("loginForm").reset();
    });
  
    // Afficher les informations utilisateur
    function displayUserInfo(user) {
      userName.textContent = `${user.prenom} ${user.nom}`;
      userDetails.textContent = `${user.classe} | ${user.ecole} | ${user.age} ans`;
    }
  
    // Afficher la feuille de notes
    showSheetBtn.addEventListener("click", function() {
      if (!currentUser) return;
      
      gradeSheetContainer.innerHTML = generateGradeTable(currentUser);
      calculatedSheetContainer.innerHTML = "";
      generalAverage.textContent = "";
    });
  
    // Générer le tableau de notes
    function generateGradeTable(user) {
      let html = `<table class="grade-table"><tr><th>Matière</th>`;
      
      // En-têtes des interros
      for (let i = 1; i <= user.nbInterros; i++) {
        html += `<th>Interro ${i}</th>`;
      }
      
      // En-têtes des devoirs
      for (let i = 1; i <= user.nbDevoirs; i++) {
        html += `<th>Devoir ${i}</th>`;
      }
      
      html += `<th>Coeff</th><th>Moy. Interro</th><th>Somme Devoir</th><th>Moy. Matière</th><th>Moy. Coeff</th></tr>`;
      
      // Lignes des matières
      for (let i = 1; i <= user.nbMatieres; i++) {
        html += `<tr><td><input type="text" placeholder="Matière ${i}"></td>`;
        
        // Interros
        for (let j = 1; j <= user.nbInterros; j++) {
          html += `<td><input type="number" min="0" max="20" step="0.25" placeholder="0"></td>`;
        }
        
        // Devoirs
        for (let j = 1; j <= user.nbDevoirs; j++) {
          html += `<td><input type="number" min="0" max="20" step="0.25" placeholder="0"></td>`;
        }
        
        // Coefficient et colonnes de résultats
        html += `<td><input type="number" min="0.5" max="3" step="0.5" value="1"></td>
                 <td class="moy-interro">0.00</td>
                 <td class="somme-devoir">0.00</td>
                 <td class="moy-matiere">0.00</td>
                 <td class="moy-coef">0.00</td></tr>`;
      }
      
      return html + `</table>`;
    }
  
    // Calculer les moyennes
    calcBtn.addEventListener("click", function() {
      if (!currentUser) return;
      
      const table = gradeSheetContainer.querySelector("table");
      if (!table) return;
      
      let totalMoyCoef = 0;
      let totalCoef = 0;
      
      // Parcourir les lignes (sauf l'en-tête)
      const rows = table.querySelectorAll("tr:not(:first-child)");
      rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const inputs = row.querySelectorAll("input");
        
        // Récupérer les valeurs
        const matiere = inputs[0].value || "Matière";
        const coef = parseFloat(inputs[inputs.length - 1].value) || 1;
        
        // Calculer moyenne interro
        let sumInterro = 0;
        let countInterro = 0;
        for (let i = 1; i <= currentUser.nbInterros; i++) {
          const val = parseFloat(inputs[i].value) || 0;
          sumInterro += val;
          countInterro++;
        }
        const moyInterro = countInterro ? sumInterro / countInterro : 0;
        
        // Calculer somme devoirs
        let sumDevoir = 0;
        for (let i = 1 + currentUser.nbInterros; i <= currentUser.nbInterros + currentUser.nbDevoirs; i++) {
          const val = parseFloat(inputs[i].value) || 0;
          sumDevoir += val;
        }
        
        // Calculer moyenne matière
        const moyMatiere = (moyInterro + sumDevoir) / (currentUser.nbDevoirs + 1);
        const moyCoef = moyMatiere * coef;
        
        // Mettre à jour les cellules
        cells[cells.length - 4].textContent = moyInterro.toFixed(2);
        cells[cells.length - 3].textContent = sumDevoir.toFixed(2);
        cells[cells.length - 2].textContent = moyMatiere.toFixed(2);
        cells[cells.length - 1].textContent = moyCoef.toFixed(2);
        
        totalMoyCoef += moyCoef;
        totalCoef += coef;
      });
      
      // Calculer moyenne générale
      const moyenneGenerale = totalCoef ? totalMoyCoef / totalCoef : 0;
      generalAverage.innerHTML = `<p>Moyenne Générale : <strong>${moyenneGenerale.toFixed(2)}/20</strong></p>`;
      
      // Générer le tableau de résultats (lecture seule)
      generateResultTable(rows, moyenneGenerale);
    });
  
    // Générer le tableau de résultats
    function generateResultTable(rows, moyenneGenerale) {
      let html = `<table class="grade-table"><tr><th>Matière</th><th>Moy. Interro</th><th>Somme Devoir</th><th>Moy. Matière</th><th>Coeff</th><th>Moy. Coeff</th></tr>`;
      
      rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        html += `<tr>
          <td>${row.querySelector("input[type='text']").value || "Matière"}</td>
          <td>${cells[cells.length - 4].textContent}</td>
          <td>${cells[cells.length - 3].textContent}</td>
          <td>${cells[cells.length - 2].textContent}</td>
          <td>${row.querySelector("input[type='number']:last-child").value}</td>
          <td>${cells[cells.length - 1].textContent}</td>
        </tr>`;
      });
      
      html += `</table>`;
      calculatedSheetContainer.innerHTML = html;
    }
  
    // Exporter les données
    downloadBtn.addEventListener("click", function() {
      window.print();
    });
  });