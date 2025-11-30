class SkillsSystem {
    constructor() {
        this.totalPoints = 25;
        this.usedPoints = 0;
        this.skills = {};
        this.initializeSkills();
    }
    
    initializeSkills() {
        console.log('Inicializando sistema de habilidades...');
        
        // Definir todas as habilidades em português
        this.skills = {
            // Acadêmicas
            contabilidade: 0,
            biblioteconomia: 0,
            medicina: 0,
            astronomia: 0,
            
            // Sociais
            persuasao: 0,
            etiqueta: 0,
            labia: 0,
            negociacao: 0,
            
            // Físicas
            esgrima: 0,
            equitacao: 0,
            natacao: 0,
            atletismo: 0,
            
            // Ofícios
            carpintaria: 0,
            ferraria: 0,
            alquimia: 0,
            cartografia: 0,
            
            // Artes
            pintura: 0,
            escultura: 0,
            musica: 0,
            caligrafia: 0,
            
            // Ocultos
            herbologia: 0,
            astrologia: 0,
            ocultismo: 0,
            mitosantigos: 0
        };
        
        // Carregar dados salvos
        this.loadFromStorage();
        
        // Inicializar eventos
        this.initializeEvents();
        
        // Atualizar interface
        this.updateAllDisplays();
    }
    
    initializeEvents() {
        console.log('Inicializando eventos...');
        
        // Event listeners para botões de incremento/decremento
        document.querySelectorAll('.skill-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const skillId = e.target.dataset.skill;
                console.log('Botão + clicado:', skillId);
                this.incrementSkill(skillId);
            });
        });
        
        document.querySelectorAll('.skill-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const skillId = e.target.dataset.skill;
                console.log('Botão - clicado:', skillId);
                this.decrementSkill(skillId);
            });
        });
        
        // Event listeners para inputs diretos
        document.querySelectorAll('.skill-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const skillId = e.target.id;
                let value = parseInt(e.target.value) || 0;
                console.log('Input alterado:', skillId, value);
                
                // Garantir que o valor está dentro dos limites
                if (value < 0) value = 0;
                if (value > 100) value = 100;
                
                this.setSkillValue(skillId, value);
            });
            
            input.addEventListener('input', (e) => {
                const skillId = e.target.id;
                let value = parseInt(e.target.value) || 0;
                
                // Garantir que o valor está dentro dos limites
                if (value < 0) value = 0;
                if (value > 100) value = 100;
                
                this.setSkillValue(skillId, value);
            });
        });
        
        // Event listener para botão de reset
        const resetBtn = document.getElementById('resetSkillsBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja reiniciar todas as habilidades? Todos os pontos serão devolvidos.')) {
                    this.resetAllSkills();
                }
            });
        } else {
            console.error('Botão resetSkillsBtn não encontrado!');
        }
    }
    
    incrementSkill(skillId) {
        console.log('Incrementando:', skillId);
        if (this.totalPoints - this.usedPoints <= 0) {
            alert('Pontos insuficientes!');
            return;
        }
        
        const currentValue = this.skills[skillId];
        if (currentValue < 100) {
            this.setSkillValue(skillId, currentValue + 1);
        }
    }
    
    decrementSkill(skillId) {
        console.log('Decrementando:', skillId);
        const currentValue = this.skills[skillId];
        if (currentValue > 0) {
            this.setSkillValue(skillId, currentValue - 1);
        }
    }
    
    setSkillValue(skillId, newValue) {
        const oldValue = this.skills[skillId];
        console.log(`Alterando ${skillId} de ${oldValue} para ${newValue}`);
        
        // Verificar se há pontos suficientes para aumentar
        if (newValue > oldValue) {
            const pointsNeeded = newValue - oldValue;
            const availablePoints = this.totalPoints - this.usedPoints;
            
            if (pointsNeeded > availablePoints) {
                alert(`Pontos insuficientes! Você precisa de ${pointsNeeded} pontos, mas só tem ${availablePoints} disponíveis.`);
                this.updateInputValue(skillId, oldValue);
                return;
            }
        }
        
        // Atualizar valor da habilidade
        this.skills[skillId] = newValue;
        this.updateInputValue(skillId, newValue);
        
        // Recalcular pontos usados
        this.calculateUsedPoints();
        
        // Atualizar displays
        this.updateAllDisplays();
        
        // Salvar no localStorage
        this.saveToStorage();
    }
    
    calculateUsedPoints() {
        this.usedPoints = Object.values(this.skills).reduce((total, value) => total + value, 0);
        console.log('Pontos usados:', this.usedPoints);
    }
    
    updateInputValue(skillId, value) {
        const input = document.getElementById(skillId);
        if (input) {
            input.value = value;
        } else {
            console.error('Input não encontrado:', skillId);
        }
    }
    
    updateAllDisplays() {
        console.log('Atualizando displays...');
        
        // Atualizar pontos totais
        const totalPointsElement = document.getElementById('totalPointsValue');
        if (totalPointsElement) {
            const availablePoints = this.totalPoints - this.usedPoints;
            totalPointsElement.textContent = availablePoints;
            console.log('Pontos disponíveis:', availablePoints);
        } else {
            console.error('Elemento totalPointsValue não encontrado!');
        }
        
        // Atualizar estado dos botões
        this.updateButtonsState();
    }
    
    updateButtonsState() {
        const availablePoints = this.totalPoints - this.usedPoints;
        const plusButtons = document.querySelectorAll('.skill-btn.plus');
        
        if (availablePoints <= 0) {
            document.body.classList.add('no-points');
            plusButtons.forEach(btn => {
                btn.disabled = true;
            });
        } else {
            document.body.classList.remove('no-points');
            plusButtons.forEach(btn => {
                btn.disabled = false;
            });
        }
        
        // Desabilitar botões de menos quando o valor é 0
        document.querySelectorAll('.skill-btn.minus').forEach(btn => {
            const skillId = btn.dataset.skill;
            btn.disabled = this.skills[skillId] <= 0;
        });
    }
    
    resetAllSkills() {
        console.log('Reiniciando todas as habilidades...');
        
        // Resetar todos os valores para 0
        Object.keys(this.skills).forEach(skillId => {
            this.skills[skillId] = 0;
            this.updateInputValue(skillId, 0);
        });
        
        // Recalcular pontos
        this.calculateUsedPoints();
        this.updateAllDisplays();
        this.saveToStorage();
        
        alert('Todas as habilidades foram reiniciadas!');
    }
    
    saveToStorage() {
        const data = {
            skills: this.skills,
            usedPoints: this.usedPoints
        };
        localStorage.setItem('skillsData', JSON.stringify(data));
        console.log('Dados salvos:', data);
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('skillsData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.skills = data.skills;
                this.usedPoints = data.usedPoints;
                
                console.log('Dados carregados:', data);
                
                // Atualizar inputs com valores salvos
                Object.keys(this.skills).forEach(skillId => {
                    this.updateInputValue(skillId, this.skills[skillId]);
                });
            } catch (e) {
                console.error('Erro ao carregar dados salvos:', e);
            }
        } else {
            console.log('Nenhum dado salvo encontrado.');
        }
    }
}

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando SkillsSystem...');
    window.skillsSystem = new SkillsSystem();
});