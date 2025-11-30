// Adiciona funcionalidade aos campos editáveis
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
});

// Sistema de Dados
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
        rollButton.addEventListener('click', () => {
            this.rollDice();
        });
        
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
                document.querySelector('.result-label').textContent = `Total ${finalResult}`;
                
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

// Inicializa o sistema de dados quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    // Sistema de campos editáveis (código anterior)
    const editableFields = document.querySelectorAll('.editable-field');
    
    editableFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                localStorage.setItem(this.placeholder || this.id, this.value);
            }
        });
        
        const savedValue = localStorage.getItem(field.placeholder || field.id);
        if (savedValue) {
            field.value = savedValue;
        }
    });
    
    // Inicializa sistema de dados
    new DiceSystem();
});

class PointsSystem {
    constructor() {
        this.initializePointsSystem();
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
    
    // SEMPRE usa 10 pontos, ignora localStorage
    pointsValue.textContent = "10";
    pointsValue.dataset.max = "10";

    this.initializeDotsForCategory(categoryElement, categoryName);
}

initializePointsSystem() {
    // data as categorias começam com 10 pontos
    this.initializeCategory('FÍSICO', 10);
    this.initializeCategory('SOCIAL', 10);
    this.initializeCategory('MENTAL', 10);
    this.initializeCategory('ATRIBUTOS PRINCIPAIS', 10);
    
    // Não carrega estado salvo - sempre começa fresco
    // this.loadSavedState();
}
    
findCategoryElement(categoryName) {
    const categories = document.querySelectorAll('.attribute-category, .status-section');
    console.log(`Total de categorias encontradas: ${categories.length}`); // DEBUG
    
    for (let category of categories) {
        const title = category.querySelector('.category-title, .status-title');
        if (title) {
            console.log(`Título encontrado: "${title.textContent.trim()}"`); // DEBUG
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
        
        this.updateDotContainerState(dotContainer, parseInt(pointsValue.textContent));
    });
}
    
    handleDotClick(dotContainer, clickedIndex, categoryName, pointsValue) {
        const currentLevel = parseInt(dotContainer.dataset.level);
        const costPerDot = parseInt(dotContainer.dataset.cost) || 1;
        const currentPoints = parseInt(pointsValue.textContent);
        const maxLevel = 5;
        
        let newLevel;
        if (clickedIndex + 1 === currentLevel) {
            // Diminuir nível (devolver pontos)
            newLevel = clickedIndex;
        } else {
            // Aumentar nível (gastar pontos)
            newLevel = clickedIndex + 1;
        }
        
        const pointsDifference = (newLevel - currentLevel) * costPerDot;
        const newPoints = currentPoints - pointsDifference;
        
        // Verifica se há pontos suficientes
        if (newPoints < 0) {
            this.showPointsWarning(pointsValue);
            return;
        }
        
        // Atualiza pontos e nível
        pointsValue.textContent = newPoints;
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
        const availablePoints = parseInt(pointsValue.textContent);
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
            const skillName = dotContainer.closest('.attribute-item').querySelector('.attribute-name').textContent;
            localStorage.setItem(`skill_${categoryName}_${skillName}`, dotContainer.dataset.level);
        }
    }
    
    loadSavedState() {
        // Os estados são carregados durante a inicialização de cada categoria
    }
    
    // Método para resetar pontos (opcional)
    resetCategory(categoryName, defaultPoints) {
        const categoryElement = this.findCategoryElement(categoryName);
        if (!categoryElement) return;
        
        const pointsValue = categoryElement.querySelector('.points-value');
        pointsValue.textContent = defaultPoints;
        pointsValue.dataset.max = defaultPoints;
        
        // Reseta todos os dots da categoria
        const dotsContainers = categoryElement.querySelectorAll('.attribute-dots');
        dotsContainers.forEach(dotContainer => {
            dotContainer.dataset.level = '0';
            this.updateDotsVisual(dotContainer);
        });
        
        this.updateAllDotsStateInCategory(categoryName);
        localStorage.removeItem(`points_${categoryName}`);
        
        // Remove skills salvas desta categoria
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(`skill_${categoryName}_`)) {
                localStorage.removeItem(key);
            }
        });
    }
}

// Inicializa o sistema quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    new PointsSystem();
});