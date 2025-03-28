class GradeManager {
    static #currentTab = 'matiere';
    static #semesterData = {};

    static init() {
        this.setupEventListeners();
    }

    static setupEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', e => this.switchTab(e.target.dataset.target));
        });
    }

    static switchTab(tabId) {
        this.#currentTab = tabId;
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        document.querySelector(`[data-target="${tabId}"]`).classList.add('active');
    }

    // Calcul par Matière
    static generateSubjectInputs() {
        const nbInterros = parseInt(document.getElementById('nbInterros').value);
        const nbDevoirs = parseInt(document.getElementById('nbDevoirs').value);
        
        this.#generateGradeInputs('interrosInputs', nbInterros);
        this.#generateGradeInputs('devoirsInputs', nbDevoirs);
    }

    static #generateGradeInputs(containerId, count) {
        const container = document.getElementById(containerId);
        container.innerHTML = Array.from({length: count}, (_, i) => `
            <input type="number" class="grade-input" placeholder="Note ${i + 1}" step="0.1">
        `).join('');
    }

    static calculateMatiere() {
        const interros = this.#getValidGrades('interrosInputs');
        const devoirs = this.#getValidGrades('devoirsInputs');
        
        const moyenneInterros = this.#calculateAverage(interros);
        const moyenneDevoirs = this.#calculateAverage(devoirs);
        const moyenneTotale = (moyenneInterros * 0.4) + (moyenneDevoirs * 0.6);
        
        document.getElementById('matiereResult').innerHTML = `
            <h3>${document.getElementById('nomMatiere').value}</h3>
            <p>Moyenne Interros : ${moyenneInterros.toFixed(2)}</p>
            <p>Moyenne Devoirs : ${moyenneDevoirs.toFixed(2)}</p>
            <p class="highlight">Moyenne Générale : ${moyenneTotale.toFixed(2)}</p>
        `;
    }

    // Calcul par Semestre
    static generateSemesterTable() {
        const nbMatieres = parseInt(document.getElementById('nbMatieres').value);
        const nbInterros = parseInt(document.getElementById('nbInterrosSemestre').value);
        const nbDevoirs = parseInt(document.getElementById('nbDevoirsSemestre').value);
        
        this.#semesterData = {
            nbMatieres,
            nbInterros,
            nbDevoirs,
            seuil: parseFloat(document.getElementById('seuil').value)
        };

        this.#generateTableHeader();
        this.#generateTableBody();
    }

    static #generateTableHeader() {
        const header = document.getElementById('semesterHeader');
        let html = `
            <tr>
                <th>Matière</th>
                <th>Coeff.</th>
                <th colspan="${this.#semesterData.nbInterros}">Interros</th>
                <th colspan="${this.#semesterData.nbDevoirs}">Devoirs</th>
                <th>Moyenne</th>
                <th>Statut</th>
            </tr>
        `;
        header.innerHTML = html;
    }

    static #generateTableBody() {
        const tbody = document.getElementById('semesterBody');
        let html = '';

        for(let i = 0; i < this.#semesterData.nbMatieres; i++) {
            html += `
                <tr data-matiere="${i}">
                    <td><input type="text" placeholder="Matière ${i + 1}"></td>
                    <td><input type="number" class="coeff" value="1" min="1"></td>
            `;

            // Ajout des interros
            for(let q = 0; q < this.#semesterData.nbInterros; q++) {
                html += `<td><input type="number" class="grade interro" step="0.1" min="0" max="20"></td>`;
            }

            // Ajout des devoirs
            for(let d = 0; d < this.#semesterData.nbDevoirs; d++) {
                html += `<td><input type="number" class="grade devoir" step="0.1" min="0" max="20"></td>`;
            }

            html += `
                    <td class="moyenne">-</td>
                    <td class="statut">-</td>
                </tr>
            `;
        }

        tbody.innerHTML = html;
        this.#setupSemesterListeners();
    }

    static #setupSemesterListeners() {
        document.querySelectorAll('#semesterTable input').forEach(input => {
            input.addEventListener('input', () => this.#calculateSemester());
        });
    }

    static #calculateSemester() {
        let totalCoeff = 0;
        let totalMoyenne = 0;
        let validees = 0;

        document.querySelectorAll('#semesterBody tr').forEach(row => {
            const coeff = parseFloat(row.querySelector('.coeff').value) || 1;
            const interros = this.#getGrades(row, '.interro');
            const devoirs = this.#getGrades(row, '.devoir');
            
            const moyInterro = this.#calculateAverage(interros);
            const moyDevoir = this.#calculateAverage(devoirs);
            const moyenne = (moyInterro * 0.4) + (moyDevoir * 0.6);

            row.querySelector('.moyenne').textContent = moyenne.toFixed(2);
            row.querySelector('.statut').innerHTML = moyenne >= this.#semesterData.seuil 
                ? '<span class="valid">✔ Validé</span>' 
                : '<span class="invalid">✖ Échec</span>';

            totalCoeff += coeff;
            totalMoyenne += moyenne * coeff;
            if(moyenne >= this.#semesterData.seuil) validees++;
        });

        document.getElementById('moyenneSemestre').textContent = (totalMoyenne / totalCoeff).toFixed(2);
        document.getElementById('coeffTotal').textContent = totalCoeff;
        document.getElementById('matieresValidees').textContent = `${validees}/${this.#semesterData.nbMatieres}`;
    }

    // Calcul Annuel
    static generateAnnualInputs() {
        const nbSemestres = parseInt(document.getElementById('nbSemestres').value);
        document.getElementById('semestresInputs').innerHTML = Array.from({length: nbSemestres}, (_, i) => `
            <div class="input-group">
                <label>Semestre ${i + 1} :</label>
                <input type="number" class="semestre-input" step="0.1">
            </div>
        `).join('');
    }

    static calculateAnnual() {
        const inputs = document.querySelectorAll('.semestre-input');
        const moyennes = Array.from(inputs).map(input => parseFloat(input.value) || 0);
        const moyenneAnnuelle = moyennes.reduce((a, b) => a + b, 0) / moyennes.length;
        
        document.getElementById('annuelResult').innerHTML = `
            <h3>Moyenne Annuelle</h3>
            <p class="highlight">${moyenneAnnuelle.toFixed(2)}</p>
        `;
    }

    // Helpers
    static #getValidGrades(containerId) {
        return Array.from(document.querySelectorAll(`#${containerId} input`))
            .map(input => parseFloat(input.value))
            .filter(grade => !isNaN(grade));
    }

    static #getGrades(row, selector) {
        return Array.from(row.querySelectorAll(selector))
            .map(input => parseFloat(input.value))
            .filter(grade => !isNaN(grade));
    }

    static #calculateAverage(grades) {
        return grades.length > 0 
            ? grades.reduce((a, b) => a + b, 0) / grades.length 
            : 0;
    }
}

// Initialisation
GradeManager.init();