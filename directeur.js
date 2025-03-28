document.addEventListener('DOMContentLoaded', () => {
    let classChart, trendChart;
    let currentData = {
        classes: [],
        matieres: [],
        tauxReussite: 0,
        moyenneGenerale: 0
    };

    // Initialisation des graphiques
    function initCharts() {
        classChart = new Chart(document.getElementById('classChart'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Moyenne',
                    data: [],
                    backgroundColor: '#27ae60'
                }]
            }
        });

        trendChart = new Chart(document.getElementById('trendChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Taux de Réussite',
                    data: [],
                    borderColor: '#3498db',
                    tension: 0.3
                }]
            }
        });
    }

    // Génération du tableau de saisie
    window.generateInputTable = function() {
        const nbClasses = parseInt(document.getElementById('nbClasses').value) || 0;
        const nbMatieres = parseInt(document.getElementById('nbMatieres').value) || 0;
        
        let html = `<table class="excel-table"><thead><tr><th>Classe</th>`;
        
        for(let i = 1; i <= nbMatieres; i++) {
            html += `<th>Matière ${i}</th>`;
        }
        html += `</tr></thead><tbody>`;
        
        for(let i = 1; i <= nbClasses; i++) {
            html += `<tr><td>Classe ${i}</td>`;
            for(let j = 0; j < nbMatieres; j++) {
                html += `<td><input type="number" step="0.01" min="0" max="20" 
                                  class="styled-input small-input" value="0"></td>`;
            }
            html += `</tr>`;
        }
        html += `</tbody></table>`;
        
        document.getElementById('dataInputTable').innerHTML = html;
        document.querySelector('.btn-calculate').classList.remove('hidden');
    }

    // Calcul des résultats
    window.calculateResults = function() {
        const rows = document.querySelectorAll('#dataInputTable tbody tr');
        const seuilReussite = 10;
        const results = {
            classes: [],
            matieres: [],
            tauxReussite: 0,
            moyenneGenerale: 0
        };

        // Initialisation des matières
        const nbMatieres = document.querySelectorAll('#dataInputTable thead th').length - 1;
        for(let i = 0; i < nbMatieres; i++) {
            results.matieres.push({
                matiere: `Matière ${i + 1}`,
                moyenne: 0,
                reussite: 0,
                evolution: 0
            });
        }

        // Traitement des classes
        rows.forEach(row => {
            const inputs = row.querySelectorAll('input');
            let totalClasse = 0;
            let reussisClasse = 0;

            inputs.forEach((input, index) => {
                const note = parseFloat(input.value) || 0;
                totalClasse += note;
                if(note >= seuilReussite) reussisClasse++;
                
                // Mise à jour des stats par matière
                results.matieres[index].moyenne += note;
                if(note >= seuilReussite) results.matieres[index].reussite++;
            });

            const moyenneClasse = totalClasse / inputs.length;
            results.classes.push({
                nom: row.cells[0].textContent,
                moyenne: moyenneClasse,
                reussite: (reussisClasse / inputs.length) * 100
            });

            results.moyenneGenerale += moyenneClasse;
        });

        // Calcul des moyennes finales
        results.moyenneGenerale /= results.classes.length;
        results.tauxReussite = results.classes.reduce((sum, c) => sum + c.reussite, 0) / results.classes.length;

        // Mise à jour des matières
        results.matieres.forEach(m => {
            m.moyenne /= results.classes.length;
            m.reussite = (m.reussite / results.classes.length) * 100;
        });

        // Mise à jour de l'interface
        updateInterface(results);
    }

    // Mise à jour de l'interface
    function updateInterface(data) {
        // Cartes statistiques
        document.getElementById('tauxReussite').textContent = `${data.tauxReussite.toFixed(1)}%`;
        document.getElementById('moyenneGenerale').textContent = `${data.moyenneGenerale.toFixed(2)}/20`;

        // Tableau des matières
        const tbody = document.getElementById('subjectData');
        tbody.innerHTML = data.matieres.map(m => `
            <tr>
                <td>${m.matiere}</td>
                <td>${m.moyenne.toFixed(2)}/20</td>
                <td>${m.reussite.toFixed(1)}%</td>
                <td class="${m.evolution >= 0 ? 'positive' : 'negative'}">
                    ${m.evolution >= 0 ? '+' : ''}${m.evolution.toFixed(1)}%
                </td>
            </tr>
        `).join('');

        // Graphiques
        updateCharts(data);
    }

    // Initialisation
    initCharts();
});