// ===============================
// CAMPOS EDITÁVEIS GENÉRICOS
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    const editableFields = document.querySelectorAll('.editable-field');
    
    editableFields.forEach(field => {
        // Salva o valor quando o campo perde o foco
        field.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                localStorage.setItem(this.placeholder || this.id, this.value);
            }
        });
        
        // Carrega valores salvos se existirem
        const savedValue = localStorage.getItem(field.placeholder || field.id);
        if (savedValue) {
            field.value = savedValue;
        }
    });

    // Inicializa sistema de dados
    window.diceSystem = new DiceSystem();

    // Inicializa sistema de pontos de atributos
    window.pointsSystem = new PointsSystem();
});


// ===============================
// SISTEMA DE DADOS
// ===============================
class DiceSystem {
    constructor() {
        this.selectedDice = 20; // d20 padrão
        this.history = [];
        this.maxHistory = 5;
        
        this.initializeDiceSystem();
    }
    
    initializeDiceSystem() {
        // Seleção de dados
        const diceButtons = document.querySelectorAll('.dice-button');
        diceButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectDice(parseInt(button.dataset.dice));
            });
        });
        
        // Botão de rolar
        const rollButton = document.getElementById('rollButton');
        if (rollButton) {
            rollButton.addEventListener('click', () => {
                this.rollDice();
            });
        }
        
        // Seleciona d20 por padrão
        this.selectDice(20);
        
        // Carrega histórico do localStorage
        this.loadHistory();
    }
    
    selectDice(diceValue) {
        this.selectedDice = diceValue;
        
        // Atualiza UI
        const diceButtons = document.querySelectorAll('.dice-button');
        diceButtons.forEach(button => {
            if (parseInt(button.dataset.dice) === diceValue) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    rollDice() {
        const resultElement = document.getElementById('diceResult');
        const rollButton = document.getElementById('rollButton');
        
        if (!resultElement || !rollButton) return;
        
        // Animação
        resultElement.classList.add('rolling');
        rollButton.disabled = true;
        
        // Simula rolagem
        let rolls = 0;
        const maxRolls = 8;
        const rollInterval = setInterval(() => {
            const tempResult = Math.floor(Math.random() * this.selectedDice) + 1;
            resultElement.textContent = tempResult;
            rolls++;
            
            if (rolls >= maxRolls) {
                clearInterval(rollInterval);
                
                // Resultado final
                const finalResult = Math.floor(Math.random() * this.selectedDice) + 1;
                resultElement.textContent = finalResult;
                resultElement.classList.remove('rolling');
                rollButton.disabled = false;
                
                // Atualiza label
                const label = document.querySelector('.result-label');
                if (label) {
                    label.textContent = `Total ${finalResult}`;
                }
                
                // Adiciona ao histórico
                this.addToHistory(finalResult, this.selectedDice);
            }
        }, 100);
    }
    
    addToHistory(result, dice) {
        const timestamp = new Date().toLocaleTimeString();
        const historyItem = {
            result: result,
            dice: dice,
            time: timestamp
        };
        
        this.history.unshift(historyItem);
        
        // Mantém apenas os últimos resultados
        if (this.history.length > this.maxHistory) {
            this.history = this.history.slice(0, this.maxHistory);
        }
        
        this.updateHistoryDisplay();
        this.saveHistory();
    }
    
    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
        
        historyList.innerHTML = '';
        
        this.history.forEach(item => {
            const historyElement = document.createElement('div');
            historyElement.className = 'history-item';
            historyElement.innerHTML = `
                <strong>d${item.dice}:</strong> ${item.result} 
                <span style="opacity: 0.6; float: right;">${item.time}</span>
            `;
            historyList.appendChild(historyElement);
        });
    }
    
    saveHistory() {
        localStorage.setItem('diceHistory', JSON.stringify(this.history));
    }
    
    loadHistory() {
        const savedHistory = localStorage.getItem('diceHistory');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.updateHistoryDisplay();
        }
    }
}


// ===============================
// SISTEMA DE PONTOS DE ATRIBUTOS
// ===============================
class PointsSystem {
    constructor() {
        this.initializePointsSystem();
    }
    
    initializePointsSystem() {
        // Cada categoria começa com 10 pontos (pode ser alterado no input depois)
        this.initializeCategory('FÍSICO', 10);
        this.initializeCategory('SOCIAL', 10);
        this.initializeCategory('MENTAL', 10);
        this.initializeCategory('ATRIBUTOS PRINCIPAIS', 10);
            this.initializeCategory('OFÍCIO', 10);
    this.initializeCategory('ARTE', 10);
    this.initializeCategory('OCULTO', 10);
    this.initializeCategory('LUTA', 10);
    this.initializeCategory('PACTO', 10);
        
        // Habilita edição manual dos pontos pelo mestre
        this.enableEditableCategoryPoints();
    }
    
    initializeCategory(categoryName, defaultPoints) {
        console.log(`Procurando categoria: ${categoryName}`);

        const categoryElement = this.findCategoryElement(categoryName);

        if (!categoryElement) {
            console.log(`Categoria ${categoryName} não encontrada!`);
            return;
        }

        console.log(`Categoria ${categoryName} encontrada!`);

        const pointsValue = categoryElement.querySelector('.points-value');
        
        if (!pointsValue) {
            console.log(`Elemento .points-value não encontrado em ${categoryName}`);
            return;
        }

// Permitir edição normal no input de pontos
pointsValue.removeAttribute("readonly");
pointsValue.type = "number";
pointsValue.min = "0";
pointsValue.step = "1";


        this.initializeDotsForCategory(categoryElement, categoryName);
    }
    
    findCategoryElement(categoryName) {
        const categories = document.querySelectorAll('.attribute-category, .status-section');
        console.log(`Total de categorias encontradas: ${categories.length}`);
        
        for (let category of categories) {
            const title = category.querySelector('.category-title, .status-title');
            if (title) {
                console.log(`Título encontrado: "${title.textContent.trim()}"`);
                if (title.textContent.trim() === categoryName) {
                    return category;
                }
            }
        }
        return null;
    }
    
    initializeDotsForCategory(categoryElement, categoryName) {
        const dotsContainers = categoryElement.querySelectorAll('.attribute-dots');
        const pointsValue = categoryElement.querySelector('.points-value');
        const currentPoints = parseInt(pointsValue.value) || 0;
        
        dotsContainers.forEach(dotContainer => {
            // SEMPRE começa no nível 0
            dotContainer.dataset.level = '0';
            this.updateDotsVisual(dotContainer);
            
            // Adiciona eventos de clique
            const dots = dotContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.handleDotClick(dotContainer, index, categoryName, pointsValue);
                });
            });
            
            this.updateDotContainerState(dotContainer, currentPoints);
        });

        this.updatePointsVisual(pointsValue, currentPoints);
    }
    
    handleDotClick(dotContainer, clickedIndex, categoryName, pointsValue) {
        const currentLevel = parseInt(dotContainer.dataset.level);
        const costPerDot = parseInt(dotContainer.dataset.cost) || 1;
        const currentPoints = parseInt(pointsValue.value) || 0;
        const maxLevel = 5;
        
        let newLevel;
        if (clickedIndex + 1 === currentLevel) {
            // Diminuir nível (devolver pontos)
            newLevel = clickedIndex;
        } else {
            // Aumentar nível (gastar pontos)
            newLevel = clickedIndex + 1;
        }

        if (newLevel < 0) newLevel = 0;
        if (newLevel > maxLevel) newLevel = maxLevel;
        
        const pointsDifference = (newLevel - currentLevel) * costPerDot;
        const newPoints = currentPoints - pointsDifference;
        
        // Verifica se há pontos suficientes
        if (newPoints < 0) {
            this.showPointsWarning(pointsValue);
            return;
        }
        
        // Atualiza pontos e nível
        pointsValue.value = newPoints;
        dotContainer.dataset.level = newLevel;
        
        // Atualiza visual
        this.updateDotsVisual(dotContainer);
        this.updatePointsVisual(pointsValue, newPoints);
        this.updateAllDotsStateInCategory(categoryName);
        
        // Salva estado
        this.saveState(categoryName, newPoints, dotContainer);
    }
    
    updateDotsVisual(dotContainer) {
        const level = parseInt(dotContainer.dataset.level);
        const dots = dotContainer.querySelectorAll('.dot');
        
        dots.forEach((dot, index) => {
            if (index < level) {
                dot.style.background = 'var(--accent-color)';
                dot.style.boxShadow = '0 0 8px rgba(154, 7, 7, 0.5)';
            } else {
                dot.style.background = 'transparent';
                dot.style.boxShadow = 'none';
            }
        });
    }
    
    updatePointsVisual(pointsValue, currentPoints) {
        pointsValue.classList.remove('low', 'zero');
        
        if (currentPoints === 0) {
            pointsValue.classList.add('zero');
        } else if (currentPoints <= 3) {
            pointsValue.classList.add('low');
        }
    }
    
    updateDotContainerState(dotContainer, availablePoints) {
        const currentLevel = parseInt(dotContainer.dataset.level);
        const costPerDot = parseInt(dotContainer.dataset.cost) || 1;
        
        if (availablePoints < costPerDot && currentLevel < 5) {
            dotContainer.classList.add('disabled');
        } else {
            dotContainer.classList.remove('disabled');
        }
    }
    
    updateAllDotsStateInCategory(categoryName) {
        const categoryElement = this.findCategoryElement(categoryName);
        if (!categoryElement) return;
        
        const pointsValue = categoryElement.querySelector('.points-value');
        if (!pointsValue) return;

        const availablePoints = parseInt(pointsValue.value) || 0;
        const dotsContainers = categoryElement.querySelectorAll('.attribute-dots');
        
        dotsContainers.forEach(dotContainer => {
            this.updateDotContainerState(dotContainer, availablePoints);
        });
    }
    
    showPointsWarning(pointsValue) {
        pointsValue.style.animation = 'none';
        void pointsValue.offsetWidth; // Trigger reflow
        pointsValue.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            pointsValue.style.animation = '';
        }, 500);
    }
    
    saveState(categoryName, points, dotContainer) {
        // Salva pontos
        localStorage.setItem(`points_${categoryName}`, points);
        
        // Salva nível da skill
        if (dotContainer) {
            const attributeItem = dotContainer.closest('.attribute-item');
            if (!attributeItem) return;

            const nameElement = attributeItem.querySelector('.attribute-name');
            if (!nameElement) return;

            const skillName = nameElement.textContent.trim();
            localStorage.setItem(`skill_${categoryName}_${skillName}`, dotContainer.dataset.level);
        }
    }
    
    // Método para resetar pontos (opcional, continua funcionando)
    resetCategory(categoryName, defaultPoints) {
        const categoryElement = this.findCategoryElement(categoryName);
        if (!categoryElement) return;
        
        const pointsValue = categoryElement.querySelector('.points-value');
        pointsValue.value = defaultPoints;
        pointsValue.dataset.max = defaultPoints;
        
        // Reseta todos os dots da categoria
        const dotsContainers = categoryElement.querySelectorAll('.attribute-dots');
        dotsContainers.forEach(dotContainer => {
            dotContainer.dataset.level = '0';
            this.updateDotsVisual(dotContainer);
        });
        
        this.updatePointsVisual(pointsValue, defaultPoints);
        this.updateAllDotsStateInCategory(categoryName);
        localStorage.removeItem(`points_${categoryName}`);
        
        // Remove skills salvas desta categoria
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(`skill_${categoryName}_`)) {
                localStorage.removeItem(key);
            }
        });
    }

    // Habilita edição manual dos pontos (Físico, Social, Mental, Atributos Principais)
    enableEditableCategoryPoints() {
        const inputs = document.querySelectorAll('.points-value');

        inputs.forEach(input => {
            input.addEventListener('change', () => {
                let newValue = parseInt(input.value) || 0;
                if (newValue < 0) newValue = 0;
                input.value = newValue;

                const categoryElement = input.closest('.attribute-category, .status-section');
                if (!categoryElement) return;

                const titleEl = categoryElement.querySelector('.category-title, .status-title');
                if (!titleEl) return;

                const categoryName = titleEl.textContent.trim();

                console.log(`Novo valor em ${categoryName}: ${newValue}`);

                this.updatePointsVisual(input, newValue);
                this.updateAllDotsStateInCategory(categoryName);
                this.saveState(categoryName, newValue, null);
            });
        });
    }
}
