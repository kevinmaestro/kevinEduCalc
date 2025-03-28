// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.calculator-section').forEach(s => s.classList.add('hidden'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.section).classList.remove('hidden');
    });
});

// ==================== MOYENNE CLASSE ====================
function generateClassTable() {
    const nbEleves = parseInt(document.getElementById('nbEleves').value) || 0;
    const nbMatieres = parseInt(document.getElementById('nbMatieresClasse').value) || 0;
    
    let html = `<table class="excel-table"><thead><tr><th>Élève</th>`;
    
    // Générer les en-têtes des matières
    for(let i = 1; i <= nbMatieres; i++) {
        html += `<th>Matière ${i}</th>`;
    }
    html += `</tr></thead><tbody>`;
    
    // Générer les lignes des élèves
    for(let i = 1; i <= nbEleves; i++) {
        html += `<tr><td>Élève ${i}</td>`;
        for(let j = 0; j < nbMatieres; j++) {
            html += `<td><input type="number" step="0.01" min="0" max="20" 
                              class="styled-input small-input" value="0"></td>`;
        }
        html += `</tr>`;
    }
    html += `</tbody></table>`;
    
    document.getElementById('classTableContainer').innerHTML = html;
    document.getElementById('calcClassBtn').classList.remove('hidden');
}

function calculateClassAverages() {
    const rows = document.querySelectorAll('#classTableContainer tbody tr');
    const matieresNotes = [];
    const elevesMoyennes = [];
    
    // Initialiser les matières
    const nbMatieres = document.querySelectorAll('#classTableContainer thead th').length - 1;
    for(let i = 0; i < nbMatieres; i++) {
        matieresNotes.push([]);
    }
    
    // Parcourir les élèves
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        let total = 0;
        
        inputs.forEach((input, index) => {
            const note = parseFloat(input.value) || 0;
            total += note;
            matieresNotes[index].push(note);
        });
        
        elevesMoyennes.push(total / inputs.length || 0);
    });
    
    // Calcul des résultats
    const moyennesMatieres = matieresNotes.map(notes => {
        const total = notes.reduce((a, b) => a + b, 0);
        return total / notes.length || 0;
    });
    
    const moyenneClasse = elevesMoyennes.reduce((a, b) => a + b, 0) / elevesMoyennes.length || 0;
    
    // Mise à jour de l'interface
    document.getElementById('studentAveragesBody').innerHTML = elevesMoyennes
        .map((moy, i) => `
            <tr>
                <td>Élève ${i + 1}</td>
                <td>${moy.toFixed(2)}</td>
                <td class="${moy >= 10 ? 'success' : 'danger'}">${moy >= 10 ? 'Admis' : 'Échoué'}</td>
            </tr>
        `).join('');
        
    document.getElementById('subjectAveragesBody').innerHTML = moyennesMatieres
        .map((moy, i) => `
            <tr>
                <td>Matière ${i + 1}</td>
                <td>${moy.toFixed(2)}</td>
            </tr>
        `).join('');
        
    document.getElementById('classAverage').textContent = moyenneClasse.toFixed(2);
    document.getElementById('classResults').classList.remove('hidden');
}

// ==================== MOYENNE APPRENANT ====================
function generateStudentInputs() {
    const nbMatieres = parseInt(document.getElementById('nbMatieresEleve').value) || 0;
    const nbNotes = parseInt(document.getElementById('nbNotesMatiere').value) || 0;
    
    let html = `<table class="excel-table"><thead><tr><th>Matière</th>`;
    
    for(let i = 1; i <= nbNotes; i++) {
        html += `<th>Note ${i}</th>`;
    }
    html += `</tr></thead><tbody>`;
    
    for(let i = 1; i <= nbMatieres; i++) {
        html += `<tr>`;
        html += `<td><input type="text" class="styled-input" placeholder="Matière ${i}"></td>`;
        for(let j = 0; j < nbNotes; j++) {
            html += `<td><input type="number" step="0.01" min="0" max="20" 
                              class="styled-input small-input" value="0"></td>`;
        }
        html += `</tr>`;
    }
    html += `</tbody></table>`;
    
    document.getElementById('studentInputs').innerHTML = html;
    document.getElementById('calcStudentBtn').classList.remove('hidden');
}

function calculateStudentAverage() {
    const rows = document.querySelectorAll('#studentInputs tbody tr');
    const results = [];
    let totalGeneral = 0;

    rows.forEach((row, index) => {
        const inputs = row.querySelectorAll('input');
        const nomMatiere = inputs[0].value || `Matière ${index + 1}`;
        const notes = [];
        
        // Récupérer les notes (en ignorant le premier input qui est le nom)
        for(let i = 1; i < inputs.length; i++) {
            const note = parseFloat(inputs[i].value) || 0;
            notes.push(note);
        }
        
        // Calculer la moyenne de la matière
        const moyenneMatiere = notes.length > 0 
            ? notes.reduce((a, b) => a + b, 0) / notes.length 
            : 0;
            
        results.push({
            matiere: nomMatiere,
            notes: notes,
            moyenne: moyenneMatiere
        });
        
        totalGeneral += moyenneMatiere;
    });

    // Calculer la moyenne générale
    const moyenneGenerale = results.length > 0 
        ? totalGeneral / results.length 
        : 0;

    // Mettre à jour l'affichage
    const tbody = document.getElementById('studentResultsBody');
    tbody.innerHTML = results.map(result => `
        <tr>
            <td>${result.matiere}</td>
            <td>${result.notes.join(', ')}</td>
            <td>${result.moyenne.toFixed(2)}</td>
            <td class="${result.moyenne >= 10 ? 'success' : 'danger'}">
                ${result.moyenne >= 10 ? 'Validé' : 'Échec'}
            </td>
        </tr>
    `).join('');

    document.getElementById('studentAverage').textContent = moyenneGenerale.toFixed(2);
    document.getElementById('studentResults').classList.remove('hidden');
}

// ==================== TAUX DE RÉUSSITE ====================
function generateSuccessInputs() {
    const nbEleves = parseInt(document.getElementById('nbElevesReussite').value) || 0;
    
    let html = `<table class="excel-table"><thead><tr><th>Élève</th><th>Moyenne</th></tr></thead><tbody>`;
    
    for(let i = 1; i <= nbEleves; i++) {
        html += `
            <tr>
                <td>Élève ${i}</td>
                <td><input type="number" step="0.01" min="0" max="20" 
                           class="styled-input" value="0"></td>
            </tr>
        `;
    }
    html += `</tbody></table>`;
    
    document.getElementById('successInputs').innerHTML = html;
    document.getElementById('calcSuccessBtn').classList.remove('hidden');
}

function calculateSuccessRate() {
    const inputs = document.querySelectorAll('#successInputs input');
    const seuil = parseFloat(document.getElementById('noteMinReussite').value) || 10;
    const notes = Array.from(inputs).map(input => parseFloat(input.value) || 0);
    
    const reussis = notes.filter(note => note >= seuil).length;
    const taux = ((reussis / notes.length) * 100).toFixed(1);
    const moyenne = (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(2);
    
    document.getElementById('successRate').textContent = `${taux}%`;
    document.getElementById('avgSuccess').textContent = moyenne;
    
    document.getElementById('successDetails').innerHTML = notes
        .map((note, i) => `
            <tr>
                <td>Élève ${i + 1}</td>
                <td>${note.toFixed(2)}</td>
                <td class="${note >= seuil ? 'success' : 'danger'}">
                    ${note >= seuil ? 'Réussi' : 'Échoué'}
                </td>
            </tr>
        `).join('');
        
    document.getElementById('successResults').classList.remove('hidden');
}

