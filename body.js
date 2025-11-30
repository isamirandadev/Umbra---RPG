class MarksSystem {
    constructor() {
        this.marks = JSON.parse(localStorage.getItem('characterMarks')) || [];
        this.damage = JSON.parse(localStorage.getItem('characterDamage')) || {
            mental: 0,
            physical: 0,
            blood: 0
        };
        this.initializeMarks();
        this.initializeDamageTracker();
        this.initializeStates();
    }
    
    initializeMarks() {
        // Event listeners para marcas
        const addMarkBtn = document.getElementById('addMarkBtn');
        const clearMarksBtn = document.getElementById('clearMarksBtn');
        const cancelMark = document.getElementById('cancelMark');
        const saveMark = document.getElementById('saveMark');
        const markType = document.getElementById('markType');
        const closeModal = document.querySelector('#markModal .close');

        if (addMarkBtn) addMarkBtn.addEventListener('click', () => this.openMarkModal());
        if (clearMarksBtn) clearMarksBtn.addEventListener('click', () => this.clearAllMarks());
        if (cancelMark) cancelMark.addEventListener('click', () => this.closeMarkModal());
        if (saveMark) saveMark.addEventListener('click', () => this.saveMark());
        if (markType) markType.addEventListener('change', (e) => this.handleMarkTypeChange(e));
        if (closeModal) closeModal.addEventListener('click', () => this.closeMarkModal());
        
        // Fechar modal clicando fora
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('markModal')) {
                this.closeMarkModal();
            }
        });
        
        this.renderMarks();
    }
    
    initializeDamageTracker() {
        console.log('Inicializando damage tracker...');
        
        // Carrega danos salvos
        this.renderDamage();
        
        // Event listeners para dots de dano
        document.querySelectorAll('.damage-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const dotsContainer = e.target.closest('.damage-dots');
                if (!dotsContainer) return;
                
                const type = dotsContainer.dataset.type;
                const level = parseInt(e.target.dataset.level);
                console.log('Dot clicado:', type, level);
                this.toggleDamage(type, level);
            });
        });
    }
    
    toggleDamage(type, level) {
        console.log('Toggle damage:', type, level, 'Current:', this.damage[type]);
        
        if (this.damage[type] === level) {
            // Se clicar no nível atual, reduz para nível anterior
            this.damage[type] = level - 1;
        } else {
            // Define o novo nível
            this.damage[type] = level;
        }
        
        // Garante que o dano fique entre 0 e 3
        this.damage[type] = Math.max(0, Math.min(3, this.damage[type]));
        
        console.log('Novo valor:', this.damage[type]);
        
        this.saveDamage();
        this.renderDamage();
    }
    
    renderDamage() {
        console.log('Renderizando damage:', this.damage);
        
        const damageTypes = ['mental', 'physical', 'blood'];
        
        damageTypes.forEach(type => {
            const dots = document.querySelectorAll(`.damage-dots[data-type="${type}"] .damage-dot`);
            const currentLevel = this.damage[type];
            
            console.log(`Tipo: ${type}, Nível: ${currentLevel}, Dots: ${dots.length}`);
            
            dots.forEach((dot, index) => {
                const dotLevel = parseInt(dot.dataset.level);
                console.log(`Dot ${index}: level ${dotLevel}, currentLevel ${currentLevel}`);
                
                if (dotLevel <= currentLevel) {
                    dot.classList.add('filled');
                    console.log(`Preenchendo dot ${index} do tipo ${type}`);
                } else {
                    dot.classList.remove('filled');
                }
            });
        });
    }
    
    saveDamage() {
        localStorage.setItem('characterDamage', JSON.stringify(this.damage));
        console.log('Damage salvo:', this.damage);
    }
    
    openMarkModal() {
        const modal = document.getElementById('markModal');
        if (modal) modal.style.display = 'block';
    }
    
    closeMarkModal() {
        const modal = document.getElementById('markModal');
        if (modal) modal.style.display = 'none';
    }
    
    handleMarkTypeChange(e) {
        const scarGroup = document.getElementById('scarSourceGroup');
        const customGroup = document.getElementById('customMarkGroup');
        
        if (scarGroup) scarGroup.style.display = e.target.value === 'scar' ? 'block' : 'none';
        if (customGroup) customGroup.style.display = e.target.value === 'custom' ? 'block' : 'none';
    }
    
    saveMark() {
        const description = document.getElementById('markDescription')?.value.trim();
        const scarSource = document.getElementById('scarSource')?.value.trim();
        const customType = document.getElementById('customMarkType')?.value.trim();
        const markType = document.getElementById('markType')?.value;
        
        if (!description) {
            alert('Por favor, insira uma descrição para a marca.');
            return;
        }
        
        if (markType === 'scar' && !scarSource) {
            alert('Por favor, especifique a origem da cicatriz.');
            return;
        }
        
        if (markType === 'custom' && !customType) {
            alert('Por favor, insira um tipo personalizado.');
            return;
        }
        
        const mark = {
            id: Date.now(),
            type: markType,
            displayType: this.getDisplayType(markType, customType),
            description: description,
            source: scarSource
        };
        
        this.marks.push(mark);
        this.saveToStorage();
        this.renderMarks();
        this.closeMarkModal();
    }
    
    getDisplayType(type, customType) {
        const typeMap = {
            'tale': 'História',
            'scar': 'Cicatriz',
            'tattoo': 'Tatuagem',
            'birthmark': 'Marca de Nascença',
            'custom': customType
        };
        return typeMap[type] || type;
    }
    
    removeMark(id) {
        if (confirm('Tem certeza que deseja remover esta marca?')) {
            this.marks = this.marks.filter(mark => mark.id !== id);
            this.saveToStorage();
            this.renderMarks();
        }
    }
    
    clearAllMarks() {
        if (this.marks.length === 0) {
            alert('Não há marcas para limpar.');
            return;
        }
        
        if (confirm('Tem certeza que deseja limpar TODAS as marcas? Esta ação não pode ser desfeita.')) {
            this.marks = [];
            this.saveToStorage();
            this.renderMarks();
        }
    }
    
    renderMarks() {
        const container = document.getElementById('marksList');
        if (!container) return;
        
        if (this.marks.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhuma marca ainda. Adicione marcas para rastrear a história do seu personagem.</div>';
            return;
        }
        
        container.innerHTML = this.marks.map(mark => `
            <div class="mark-item" data-type="${mark.type}">
                <div class="mark-header">
                    <div class="mark-type">${this.escapeHtml(mark.displayType)}</div>
                    <button class="remove-mark" onclick="marksSystem.removeMark(${mark.id})">
                        Remover
                    </button>
                </div>
                <div class="mark-description">${this.escapeHtml(mark.description)}</div>
                ${mark.source ? `<div class="mark-source">Origem: ${this.escapeHtml(mark.source)}</div>` : ''}
            </div>
        `).join('');
    }
    
    initializeStates() {
        const stateInputs = document.querySelectorAll('.state-input');
        
        stateInputs.forEach(input => {
            const stateRow = input.closest('.state-row');
            const stateCategory = input.closest('.state-category');
            
            if (!stateRow || !stateCategory) return;
            
            const stateName = stateRow.querySelector('.state-name')?.textContent;
            const category = stateCategory.querySelector('.state-title')?.textContent;
            
            if (!stateName || !category) return;
            
            const savedValue = localStorage.getItem(`state_${category}_${stateName}`);
            
            if (savedValue !== null) {
                input.value = savedValue;
            }
            
            input.addEventListener('input', (e) => {
                localStorage.setItem(`state_${category}_${stateName}`, e.target.value);
            });
            
            input.addEventListener('blur', (e) => {
                localStorage.setItem(`state_${category}_${stateName}`, e.target.value);
            });
        });
    }
    
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    saveToStorage() {
        localStorage.setItem('characterMarks', JSON.stringify(this.marks));
    }
}

// Inicializar o sistema
let marksSystem;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Carregado - Inicializando MarksSystem...');
    marksSystem = new MarksSystem();
    console.log('Sistema inicializado. Testando dots...');
});