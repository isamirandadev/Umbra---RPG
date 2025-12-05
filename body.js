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


// Sistema de Combate
class CombatSystem {
    constructor() {
        // Dados INICIALMENTE VAZIOS - o jogador começa sem golpes
        this.golpes = JSON.parse(localStorage.getItem('characterMoves')) || [];
        this.currentMoveId = null;
        this.isEditing = false;
        this.diceHistory = [];
        
        this.initialize();
    }
    
    initialize() {
        console.log('Inicializando sistema de combate...');
        this.renderMoves();
        this.setupEventListeners();
        this.setupCombatActions();
        this.setupDiceRoller();
        this.logMessage("Sistema de combate inicializado. Pronto para a batalha!", 'info');
    }
    
    // Golpes pré-definidos existentes (apenas para referência no modal "Golpes Existentes")
    get golpesExistentes() {
        return {
            basic: [
{
        nome: "Corte Horizontal",
        descricao: "Golpe básico de espada que varre horizontalmente.",
        dano: "1d8 + FOR",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Estocada Básica",
        descricao: "Ataque direto para a frente com ponta da arma.",
        dano: "1d6 + AGI",
        custo: 0,
        bonus: 1,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Golpe de Cima",
        descricao: "Ataque vertical descendente com força.",
        dano: "1d10 + FOR",
        custo: 0,
        bonus: 3,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Corte Lateral",
        descricao: "Golpe diagonal do ombro ao quadril.",
        dano: "1d8 + FOR",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Empurrão de Escudo",
        descricao: "Usa escudo para desequilibrar inimigo.",
        dano: "1d4 + FOR",
        custo: 0,
        bonus: 1,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Ataque Duplo",
        descricao: "Dois golpes rápidos consecutivos.",
        dano: "1d6 + AGI (cada)",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Golpe Circular",
        descricao: "Giro básico que acerta ao redor.",
        dano: "1d8 + FOR",
        custo: 1,
        bonus: 3,
        alcance: "close",
        atributo: "FOR"
    },
    {
        nome: "Estocada Baixa",
        descricao: "Ataque direcionado às pernas do inimigo.",
        dano: "1d6 + AGI",
        custo: 0,
        bonus: 1,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Golpe de Talho",
        descricao: "Corte superficial para desarmar.",
        dano: "1d4 + AGI",
        custo: 0,
        bonus: 0,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Defesa Ativa",
        descricao: "Bloqueia enquanto prepara contra-ataque.",
        dano: "-",
        custo: 1,
        bonus: 2,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Golpe Pesado",
        descricao: "Ataque lento mas poderoso.",
        dano: "1d12 + FOR",
        custo: 0,
        bonus: 4,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Ataque Rápido",
        descricao: "Golpe veloz mas com menos força.",
        dano: "1d4 + AGI",
        custo: 0,
        bonus: 3,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Corte Cruzado",
        descricao: "Dois golpes que se cruzam em X.",
        dano: "1d8 + FOR",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Estocada Alta",
        descricao: "Ataque direcionado à cabeça ou ombros.",
        dano: "1d6 + AGI",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Golpe de Reverso",
        descricao: "Usa parte traseira da arma para bater.",
        dano: "1d6 + FOR",
        custo: 0,
        bonus: 1,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Ataque de Oportunidade",
        descricao: "Golpe quando inimigo se descuida.",
        dano: "1d8 + AGI",
        custo: 0,
        bonus: 3,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Golpe Giratório Básico",
        descricao: "Giro de 180 graus com a arma.",
        dano: "1d10 + FOR",
        custo: 1,
        bonus: 3,
        alcance: "close",
        atributo: "FOR"
    },
    {
        nome: "Estocada em Ziguezague",
        descricao: "Ataque que muda de direção no final.",
        dano: "1d6 + AGI",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Corte Ascendente",
        descricao: "Golpe que vem de baixo para cima.",
        dano: "1d8 + FOR",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Ataque de Distração",
        descricao: "Finta seguida de golpe real.",
        dano: "1d6 + AGI",
        custo: 0,
        bonus: 1,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Golpe de Pomo",
        descricao: "Usa o cabo da espada para bater.",
        dano: "1d4 + FOR",
        custo: 0,
        bonus: 1,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Estocada Curta",
        descricao: "Ataque rápido de curta distância.",
        dano: "1d4 + AGI",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Corte em Arco",
        descricao: "Movimento curvo com a lâmina.",
        dano: "1d8 + FOR",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Golpe de Alavanca",
        descricao: "Usa força do inimigo contra ele.",
        dano: "1d6 + FOR",
        custo: 0,
        bonus: 1,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Ataque Duplo Cruzado",
        descricao: "Dois golpes que se interceptam.",
        dano: "1d6 + AGI (cada)",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Estocada em Espiral",
        descricao: "Ataque com movimento rotativo.",
        dano: "1d6 + AGI",
        custo: 0,
        bonus: 1,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Golpe de Impacto",
        descricao: "Foca em quebrar defesas.",
        dano: "1d10 + FOR",
        custo: 0,
        bonus: 3,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Corte em Semicírculo",
        descricao: "Movimento de 180 graus horizontal.",
        dano: "1d8 + FOR",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Ataque de Desarme",
        descricao: "Tenta tirar arma das mãos do inimigo.",
        dano: "1d4 + AGI",
        custo: 0,
        bonus: 0,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Golpe de Cotovelo",
        descricao: "Usa parte do corpo além da arma.",
        dano: "1d4 + FOR",
        custo: 0,
        bonus: 1,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Estocada em Ângulo",
        descricao: "Ataque por cima da guarda inimiga.",
        dano: "1d6 + AGI",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Corte em Ziguezague",
        descricao: "Movimento em Z com a lâmina.",
        dano: "1d8 + FOR",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Golpe de Rompimento",
        descricao: "Foca em destruir escudos.",
        dano: "1d12 + FOR",
        custo: 0,
        bonus: 4,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Ataque em Leque",
        descricao: "Acerta múltiplos alvos à frente.",
        dano: "1d6 + FOR",
        custo: 1,
        bonus: 2,
        alcance: "close",
        atributo: "FOR"
    },
    {
        nome: "Estocada em Profundidade",
        descricao: "Penetração máxima com a lâmina.",
        dano: "1d8 + AGI",
        custo: 0,
        bonus: 3,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Golpe de Rebatida",
        descricao: "Desvia ataque inimigo e contra-ataca.",
        dano: "1d6 + AGI",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Corte em Cruz",
        descricao: "Golpe vertical seguido de horizontal.",
        dano: "1d8 + FOR",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Ataque de Fadiga",
        descricao: "Golpes constantes para cansar inimigo.",
        dano: "1d4 + AGI",
        custo: 0,
        bonus: 1,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Golpe de Desequilíbrio",
        descricao: "Foca em derrubar o oponente.",
        dano: "1d6 + FOR",
        custo: 0,
        bonus: 1,
        alcance: "melee",
        atributo: "FOR"
    },
    {
        nome: "Estocada Dupla",
        descricao: "Duas estocadas rápidas seguidas.",
        dano: "1d6 + AGI (cada)",
        custo: 0,
        bonus: 2,
        alcance: "melee",
        atributo: "AGI"
    },
    {
        nome: "Corte Final Básico",
        descricao: "Golpe simples para finalizar combate.",
        dano: "1d10 + FOR",
        custo: 0,
        bonus: 3,
        alcance: "melee",
        atributo: "FOR"
    }
            ],
                    advanced: [
            {
                nome: "Perfuração Precisão",
                descricao: "Estocada que busca pontos vitais com precisão cirúrgica.",
                dano: "2d6 + AGI",
                custo: 3,
                bonus: 5,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Corte Profundo",
                descricao: "Golpe que causa ferimentos profundos e sangramento.",
                dano: "2d8 + FOR",
                custo: 3,
                bonus: 4,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Ataque Giratório Avançado",
                descricao: "Giro completo que acerta múltiplos oponentes.",
                dano: "1d10 + FOR",
                custo: 4,
                bonus: 3,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Estocada Veloz",
                descricao: "Ataque tão rápido que é quase imperceptível.",
                dano: "1d8 + AGI",
                custo: 3,
                bonus: 6,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Corte em X Cruzado",
                descricao: "Dois golpes em X que se cruzam no alvo.",
                dano: "1d10 + AGI",
                custo: 4,
                bonus: 4,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Quebra-escudo",
                descricao: "Especializado em destruir defesas de escudo.",
                dano: "2d8 + FOR",
                custo: 4,
                bonus: 5,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Contra-ataque Perfeito",
                descricao: "Espera o ataque inimigo para retaliar no momento exato.",
                dano: "2d6 + AGI",
                custo: 5,
                bonus: 7,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Corte Duplo Vertical",
                descricao: "Dois golpes verticais rápidos em sequência.",
                dano: "1d8 + FOR (cada)",
                custo: 4,
                bonus: 3,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Estocada em Espiral",
                descricao: "Movimento rotativo que aumenta a penetração.",
                dano: "1d10 + AGI",
                custo: 3,
                bonus: 4,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Golpe de Impacto",
                descricao: "Foca em causar atordoamento e desequilíbrio.",
                dano: "2d6 + FOR",
                custo: 3,
                bonus: 4,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Ataque em Leque Avançado",
                descricao: "Acerta até 3 alvos à sua frente.",
                dano: "1d8 + FOR",
                custo: 4,
                bonus: 3,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Corte Ascendente Potente",
                descricao: "Golpe de baixo para cima com força extra.",
                dano: "2d6 + FOR",
                custo: 3,
                bonus: 5,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Estocada em Profundidade",
                descricao: "Penetra profundamente na armadura inimiga.",
                dano: "1d12 + AGI",
                custo: 4,
                bonus: 6,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Golpe de Desarme",
                descricao: "Especializado em tirar armas das mãos do inimigo.",
                dano: "1d4 + AGI",
                custo: 3,
                bonus: 8,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Corte Circular Potente",
                descricao: "Giro de 360 graus com força máxima.",
                dano: "2d8 + FOR",
                custo: 5,
                bonus: 4,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Ataque de Fúria Controlada",
                descricao: "Sequência de golpes rápidos com precisão.",
                dano: "3d4 + AGI",
                custo: 5,
                bonus: 3,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Estocada Dupla Precisão",
                descricao: "Duas estocadas no mesmo ponto vital.",
                dano: "1d10 + AGI (cada)",
                custo: 5,
                bonus: 6,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Corte em Ziguezague Avançado",
                descricao: "Movimento em Z que confunde a defesa.",
                dano: "2d6 + AGI",
                custo: 4,
                bonus: 5,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Golpe de Rompimento",
                descricao: "Focado em quebrar armaduras pesadas.",
                dano: "3d6 + FOR",
                custo: 6,
                bonus: 7,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Ataque de Distração Avançado",
                descricao: "Finta complexa seguida de golpe mortal.",
                dano: "2d8 + AGI",
                custo: 4,
                bonus: 6,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Corte Cruzado Profundo",
                descricao: "Dois cortes que se cruzam criando ferida profunda.",
                dano: "2d8 + FOR",
                custo: 5,
                bonus: 5,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Estocada em Ângulo Impossível",
                descricao: "Ataque por ângulo inesperado da defesa.",
                dano: "1d12 + AGI",
                custo: 4,
                bonus: 7,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Golpe Giratório de Impacto",
                descricao: "Giro que acumula força pelo movimento.",
                dano: "2d10 + FOR",
                custo: 5,
                bonus: 4,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Ataque de Pressão Constante",
                descricao: "Sequência ininterrupta de golpes leves.",
                dano: "4d4 + AGI",
                custo: 6,
                bonus: 3,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Corte do Vento Cortante",
                descricao: "Golpe tão rápido que corta o ar.",
                dano: "2d6 + AGI",
                custo: 4,
                bonus: 8,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Estocada Tripla",
                descricao: "Três estocadas rápidas no mesmo alvo.",
                dano: "1d8 + AGI (cada)",
                custo: 6,
                bonus: 5,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Golpe de Alavanca Avançado",
                descricao: "Usa força e peso do inimigo contra ele mesmo.",
                dano: "2d8 + FOR",
                custo: 4,
                bonus: 6,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Ataque em Semicírculo Potente",
                descricao: "Vara horizontal que acerta múltiplos alvos.",
                dano: "2d6 + FOR",
                custo: 5,
                bonus: 4,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Corte de Penetração",
                descricao: "Foca em penetrar defesas densas.",
                dano: "3d4 + FOR",
                custo: 4,
                bonus: 7,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Estocada Fantasma",
                descricao: "Ataque tão rápido que parece uma ilusão.",
                dano: "2d8 + AGI",
                custo: 5,
                bonus: 9,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Golpe de Impacto Duplo",
                descricao: "Dois golpes que empurram e atordoam.",
                dano: "2d6 + FOR",
                custo: 5,
                bonus: 5,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Ataque em Arco Amplo",
                descricao: "Movimento curvo que cobre grande área.",
                dano: "2d8 + FOR",
                custo: 6,
                bonus: 4,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Corte em Círculo Completo",
                descricao: "Giro completo atingindo todos ao redor.",
                dano: "2d10 + FOR",
                custo: 7,
                bonus: 5,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Estocada de Penetração Máxima",
                descricao: "Foca em profundidade máxima de penetração.",
                dano: "3d6 + AGI",
                custo: 6,
                bonus: 8,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Golpe de Quebra-guarda",
                descricao: "Especializado em abrir guardas fechadas.",
                dano: "2d8 + FOR",
                custo: 5,
                bonus: 7,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Ataque Sequencial",
                descricao: "Sequência de 4 golpes rápidos.",
                dano: "1d6 + AGI (cada)",
                custo: 7,
                bonus: 4,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Corte do Relâmpago",
                descricao: "Golpe extremamente rápido como um raio.",
                dano: "3d4 + AGI",
                custo: 5,
                bonus: 10,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Estocada do Furacão",
                descricao: "Movimento rotativo com estocada final.",
                dano: "2d10 + AGI",
                custo: 6,
                bonus: 6,
                alcance: "close",
                atributo: "AGI"
            },
            {
                nome: "Golpe de Impacto Sísmico",
                descricao: "Golpe no chão que causa tremor.",
                dano: "2d12 + FOR",
                custo: 7,
                bonus: 8,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Ataque Final Avançado",
                descricao: "Preparação para golpe final devastador.",
                dano: "3d8 + ATK",
                custo: 8,
                bonus: 9,
                alcance: "melee",
                atributo: "FOR"
            }
        ],
        
        special: [
            {
                nome: "Fúria Berserker",
                descricao: "Entra em estado de fúria incontrolável.",
                dano: "+2d6 por 3 rodadas",
                custo: 8,
                bonus: 10,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Dança das Lâminas Mortais",
                descricao: "Movimento acrobático com múltiplos alvos.",
                dano: "4d4 + AGI",
                custo: 10,
                bonus: 8,
                alcance: "close",
                atributo: "AGI"
            },
            {
                nome: "Golpe da Terra Tremendo",
                descricao: "Impacto que faz o chão tremer.",
                dano: "3d8 + FOR",
                custo: 9,
                bonus: 12,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Estocada Fantasma",
                descricao: "Ataque que parece atravessar matéria.",
                dano: "3d6 + AGI",
                custo: 11,
                bonus: 15,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Corte do Vento Cortante",
                descricao: "Lâmina de ar que atinge à distância.",
                dano: "2d10 + AGI",
                custo: 9,
                bonus: 10,
                alcance: "medium",
                atributo: "AGI"
            },
            {
                nome: "Impacto Sísmico",
                descricao: "Golpe que cria onda de choque.",
                dano: "3d10 + FOR",
                custo: 12,
                bonus: 14,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Ataque do Dragão",
                descricao: "Golpe que emite rugido ensurdecedor.",
                dano: "4d6 + FOR",
                custo: 13,
                bonus: 16,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Dança da Morte",
                descricao: "Sequência mortal de movimentos acrobáticos.",
                dano: "5d4 + AGI",
                custo: 14,
                bonus: 12,
                alcance: "close",
                atributo: "AGI"
            },
            {
                nome: "Golpe do Trovão",
                descricao: "Impacto que emite som de trovão.",
                dano: "3d12 + FOR",
                custo: 15,
                bonus: 18,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Estocada do Vácuo",
                descricao: "Ataque que parece sugar o ar ao redor.",
                dano: "4d8 + AGI",
                custo: 16,
                bonus: 20,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Corte da Aurora",
                descricao: "Golpe que deixa rastro luminoso.",
                dano: "3d10 + AGI",
                custo: 12,
                bonus: 14,
                alcance: "medium",
                atributo: "AGI"
            },
            {
                nome: "Golpe do Abismo",
                descricao: "Ataque que emana energia sombria.",
                dano: "4d10 + VIG",
                custo: 17,
                bonus: 22,
                alcance: "close",
                atributo: "VIG"
            },
            {
                nome: "Ataque do Fênix",
                descricao: "Golpe envolto em chamas etéreas.",
                dano: "5d6 + FOR",
                custo: 18,
                bonus: 24,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Dança do Vendaval",
                descricao: "Movimento que cria redemoinho de vento.",
                dano: "4d8 + AGI",
                custo: 16,
                bonus: 18,
                alcance: "close",
                atributo: "AGI"
            },
            {
                nome: "Golpe do Eclipse",
                descricao: "Ataque que escurece área ao redor.",
                dano: "5d8 + VIG",
                custo: 20,
                bonus: 25,
                alcance: "close",
                atributo: "VIG"
            },
            {
                nome: "Estocada do Crepúsculo",
                descricao: "Ataque no limiar entre luz e escuridão.",
                dano: "4d12 + AGI",
                custo: 19,
                bonus: 26,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Corte da Tempestade",
                descricao: "Golpe que convoca ventos tempestuosos.",
                dano: "6d6 + AGI",
                custo: 21,
                bonus: 28,
                alcance: "medium",
                atributo: "AGI"
            },
            {
                nome: "Golpe do Cataclismo",
                descricao: "Impacto que parece quebrar a realidade.",
                dano: "7d8 + FOR",
                custo: 25,
                bonus: 30,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Ataque do Colosso",
                descricao: "Golpe com força titânica.",
                dano: "8d6 + FOR",
                custo: 26,
                bonus: 32,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Dança das Sombras",
                descricao: "Movimento através das sombras.",
                dano: "6d8 + AGI",
                custo: 24,
                bonus: 30,
                alcance: "close",
                atributo: "AGI"
            },
            {
                nome: "Golpe do Véu",
                descricao: "Ataque que atravessa defesas mágicas.",
                dano: "5d10 + VON",
                custo: 22,
                bonus: 24,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Estocada da Realidade",
                descricao: "Golpe que distorce espaço ao redor.",
                dano: "7d6 + AGI",
                custo: 27,
                bonus: 34,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Corte do Infinito",
                descricao: "Golpe que parece não ter fim.",
                dano: "8d8 + FOR",
                custo: 30,
                bonus: 36,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Golpe do Vácuo Absoluto",
                descricao: "Cria zona de vácuo ao redor.",
                dano: "9d6 + VIG",
                custo: 32,
                bonus: 38,
                alcance: "close",
                atributo: "VIG"
            },
            {
                nome: "Ataque da Queda",
                descricao: "Golpe descendente com força gravitacional.",
                dano: "10d6 + FOR",
                custo: 35,
                bonus: 40,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Dança dos Espelhos",
                descricao: "Cria ilusões que também atacam.",
                dano: "8d10 + AGI",
                custo: 33,
                bonus: 35,
                alcance: "close",
                atributo: "AGI"
            },
            {
                nome: "Golpe do Nada",
                descricao: "Ataque que nega a existência do alvo.",
                dano: "12d6 + VON",
                custo: 40,
                bonus: 45,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Estocada do Fim",
                descricao: "Ataque que prediz o fim do combate.",
                dano: "15d6 + ATK",
                custo: 45,
                bonus: 50,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Corte da Eternidade",
                descricao: "Golpe que parece congelar o tempo.",
                dano: "20d4 + VON",
                custo: 50,
                bonus: 60,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Golpe da Singularidade",
                descricao: "Cria ponto de singularidade no impacto.",
                dano: "25d6 + VIG",
                custo: 60,
                bonus: 70,
                alcance: "close",
                atributo: "VIG"
            },
            {
                nome: "Ataque do Apocalipse",
                descricao: "Golpe que anuncia o fim dos tempos.",
                dano: "30d6 + FOR",
                custo: 70,
                bonus: 80,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Dança dos Deuses",
                descricao: "Movimento que transcende a humanidade.",
                dano: "40d4 + AGI",
                custo: 80,
                bonus: 90,
                alcance: "close",
                atributo: "AGI"
            },
            {
                nome: "Golpe do Cosmos",
                descricao: "Ataque que canaliza energia estelar.",
                dano: "50d6 + VON",
                custo: 90,
                bonus: 100,
                alcance: "long",
                atributo: "VON"
            },
            {
                nome: "Estocada do Vazio",
                descricao: "Ataque que nega matéria e energia.",
                dano: "∞",
                custo: 100,
                bonus: 999,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Corte da Realidade",
                descricao: "Golpe que corta o tecido da realidade.",
                dano: "Auto-destrutivo",
                custo: 999,
                bonus: 999,
                alcance: "long",
                atributo: "VON"
            },
            {
                nome: "Golpe da Transcendência",
                descricao: "Ataque que transcende compreensão mortal.",
                dano: "Ilimitado",
                custo: 9999,
                bonus: 9999,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Ataque do Juízo Final",
                descricao: "Último golpe antes do fim de tudo.",
                dano: "Destruição Total",
                custo: 99999,
                bonus: 99999,
                alcance: "long",
                atributo: "FOR"
            }
        ],
        
        finisher: [
            {
                nome: "Execução Implacável",
                descricao: "Golpe final sem piedade ou hesitação.",
                dano: "10d6 + ATK",
                custo: 20,
                bonus: 25,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Fúria do Dragão Ancestral",
                descricao: "Canaliza poder de dragões ancestrais.",
                dano: "15d8 + FOR",
                custo: 30,
                bonus: 35,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Corte da Alma Eterna",
                descricao: "Atinge a essência vital do alvo.",
                dano: "12d10 + VON",
                custo: 35,
                bonus: 40,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Estocada do Juízo Final",
                descricao: "Ataque que decide destino do combate.",
                dano: "20d6 + ATK",
                custo: 40,
                bonus: 45,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Golpe do Crepúsculo",
                descricao: "Último ataque antes da escuridão total.",
                dano: "25d6 + FOR",
                custo: 45,
                bonus: 50,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Sacrifício Final",
                descricao: "Entrega toda energia vital em um golpe.",
                dano: "30d8 + VIG",
                custo: 50,
                bonus: 60,
                alcance: "close",
                atributo: "VIG"
            },
            {
                nome: "Corte do Destino",
                descricao: "Golpe que corta os fios do destino.",
                dano: "35d6 + VON",
                custo: 55,
                bonus: 65,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Estocada da Perdição",
                descricao: "Condena o alvo à destruição eterna.",
                dano: "40d6 + AGI",
                custo: 60,
                bonus: 70,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Golpe do Esquecimento",
                descricao: "Apaga o alvo da memória do mundo.",
                dano: "45d8 + VON",
                custo: 65,
                bonus: 75,
                alcance: "close",
                atributo: "VON"
            },
            {
                nome: "Ataque da Extinção",
                descricao: "Aniquila completamente o alvo.",
                dano: "50d10 + FOR",
                custo: 70,
                bonus: 80,
                alcance: "melee",
                atributo: "FOR"
            },
            {
                nome: "Corte do Nada",
                descricao: "Devolve o alvo ao estado de não-existência.",
                dano: "60d6 + VON",
                custo: 75,
                bonus: 85,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Estocada da Eternidade",
                descricao: "Condena a sofrimento eterno.",
                dano: "70d8 + AGI",
                custo: 80,
                bonus: 90,
                alcance: "melee",
                atributo: "AGI"
            },
            {
                nome: "Golpe do Apagamento",
                descricao: "Apaga o alvo da realidade.",
                dano: "80d10 + VON",
                custo: 85,
                bonus: 95,
                alcance: "close",
                atributo: "VON"
            },
            {
                nome: "Ataque do Fim dos Tempos",
                descricao: "Traz o fim para o alvo e seu entorno.",
                dano: "100d8 + FOR",
                custo: 90,
                bonus: 100,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Corte da Inexistência",
                descricao: "Torna o alvo nunca existente.",
                dano: "120d10 + VON",
                custo: 95,
                bonus: 110,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Estocada do Vazio Absoluto",
                descricao: "Consome o alvo no vácuo eterno.",
                dano: "150d12 + VIG",
                custo: 100,
                bonus: 120,
                alcance: "melee",
                atributo: "VIG"
            },
            {
                nome: "Golpe da Aniquilação Total",
                descricao: "Destrói completamente sem deixar rastro.",
                dano: "200d10 + FOR",
                custo: 110,
                bonus: 130,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Ataque do Juízo Divino",
                descricao: "Julgamento final dos deuses.",
                dano: "250d12 + VON",
                custo: 120,
                bonus: 140,
                alcance: "long",
                atributo: "VON"
            },
            {
                nome: "Corte do Apocalipse",
                descricao: "Inicia o fim do mundo para o alvo.",
                dano: "300d10 + FOR",
                custo: 130,
                bonus: 150,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Estocada da Destruição Cósmica",
                descricao: "Destrói em escala cósmica.",
                dano: "400d10 + VIG",
                custo: 140,
                bonus: 160,
                alcance: "long",
                atributo: "VIG"
            },
            {
                nome: "Golpe do Fim da Existência",
                descricao: "Termina a existência do alvo.",
                dano: "500d12 + VON",
                custo: 150,
                bonus: 170,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Ataque da Singularidade Negra",
                descricao: "Cria buraco negro no ponto de impacto.",
                dano: "600d10 + FOR",
                custo: 160,
                bonus: 180,
                alcance: "close",
                atributo: "FOR"
            },
            {
                nome: "Corte do Big Crunch",
                descricao: "Comprime o alvo até singularidade.",
                dano: "700d12 + VIG",
                custo: 170,
                bonus: 190,
                alcance: "melee",
                atributo: "VIG"
            },
            {
                nome: "Estocada do Big Rip",
                descricao: "Rasga o alvo em nível quântico.",
                dano: "800d10 + VON",
                custo: 180,
                bonus: 200,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Golpe do Fim do Universo",
                descricao: "Encerra o universo pessoal do alvo.",
                dano: "900d12 + FOR",
                custo: 190,
                bonus: 210,
                alcance: "long",
                atributo: "FOR"
            },
            {
                nome: "Ataque da Desintegração Multiversal",
                descricao: "Destrói todas as versões do alvo.",
                dano: "1000d10 + VON",
                custo: 200,
                bonus: 220,
                alcance: "long",
                atributo: "VON"
            },
            {
                nome: "Corte da Não-existência Eterna",
                descricao: "Condena a nunca ter existido.",
                dano: "∞",
                custo: 250,
                bonus: 999,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Estocada do Anti-tempo",
                descricao: "Remove o alvo do fluxo temporal.",
                dano: "Dano Temporal",
                custo: 300,
                bonus: 999,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Golpe da Realidade Alternativa",
                descricao: "Envia o alvo para realidade alternativa.",
                dano: "Dano Dimensional",
                custo: 350,
                bonus: 999,
                alcance: "close",
                atributo: "VON"
            },
            {
                nome: "Ataque do Vazio Primordial",
                descricao: "Devolve ao estado pré-criação.",
                dano: "Aniquilação Completa",
                custo: 400,
                bonus: 999,
                alcance: "long",
                atributo: "VON"
            },
            {
                nome: "Corte da Consciência Cósmica",
                descricao: "Destrói a mente cósmica do alvo.",
                dano: "Destruição Psíquica",
                custo: 450,
                bonus: 999,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Estocada do Esquecimento Eterno",
                descricao: "Faz o mundo esquecer do alvo.",
                dano: "Apagamento Existencial",
                custo: 500,
                bonus: 999,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Golpe da Transcendência Máxima",
                descricao: "Eleva o alvo além da compreensão.",
                dano: "Transcendência Forçada",
                custo: 550,
                bonus: 999,
                alcance: "close",
                atributo: "VON"
            },
            {
                nome: "Ataque da Paradoxalidade",
                descricao: "Cria paradoxo que destrói o alvo.",
                dano: "Paradoxo Existencial",
                custo: 600,
                bonus: 999,
                alcance: "long",
                atributo: "VON"
            },
            {
                nome: "Corte do Infinito Negativo",
                descricao: "Aplica conceito de infinito negativo.",
                dano: "Infinito Negativo",
                custo: 650,
                bonus: 999,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Estocada do Zero Absoluto",
                descricao: "Reduz tudo a zero absoluto.",
                dano: "Zero Existencial",
                custo: 700,
                bonus: 999,
                alcance: "melee",
                atributo: "VON"
            },
            {
                nome: "Golpe do Fim dos Fins",
                descricao: "O fim de todos os fins possíveis.",
                dano: "Fim Absoluto",
                custo: 800,
                bonus: 999,
                alcance: "long",
                atributo: "VON"
            },
            {
                nome: "Ataque da Nada Absoluto",
                descricao: "Transforma tudo em absoluto nada.",
                dano: "Nada Total",
                custo: 900,
                bonus: 999,
                alcance: "long",
                atributo: "VON"
            },
            {
                nome: "Corte da Impossibilidade",
                descricao: "Ataque que não deveria ser possível.",
                dano: "Impossibilidade Realizada",
                custo: 999,
                bonus: 999,
                alcance: "melee",
                atributo: "VON"
            }
        ]
    };
}

    
    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const addMoveBtn = document.getElementById('addMoveBtn');
        const showMovesBtn = document.getElementById('showMovesBtn');
        const moveModal = document.getElementById('moveModal');
        const existingMovesModal = document.getElementById('existingMovesModal');
        const moveForm = document.getElementById('moveForm');
        const closeModalBtn = document.getElementById('closeModal');
        const closeMovesModalBtn = document.getElementById('closeMovesModal');
        const closeMovesListBtn = document.getElementById('closeMovesListBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const clearLogBtn = document.getElementById('clearLogBtn');
        const addWeaponBtn = document.getElementById('addWeaponBtn');

        // Busca
        if (searchInput) searchInput.addEventListener('input', () => this.renderMoves());

        // Botão novo golpe
        if (addMoveBtn) addMoveBtn.addEventListener('click', () => {
            this.isEditing = false;
            this.currentMoveId = null;
            document.getElementById('modalTitle').textContent = 'Novo Golpe de Combate';
            moveForm.reset();
            document.getElementById('moveCost').value = 0;
            document.getElementById('moveBonus').value = 0;
            moveModal.classList.add('active');
        });

        // Botão golpes existentes
        if (showMovesBtn) showMovesBtn.addEventListener('click', () => this.showExistingMoves());

        // Fechar modais
        if (closeModalBtn) closeModalBtn.addEventListener('click', () => moveModal.classList.remove('active'));
        if (closeMovesModalBtn) closeMovesModalBtn.addEventListener('click', () => existingMovesModal.classList.remove('active'));
        if (closeMovesListBtn) closeMovesListBtn.addEventListener('click', () => existingMovesModal.classList.remove('active'));
        if (cancelBtn) cancelBtn.addEventListener('click', () => moveModal.classList.remove('active'));

        // Salvar golpe
        if (moveForm) moveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMove();
        });

        // Limpar registro de combate
        if (clearLogBtn) clearLogBtn.addEventListener('click', () => {
            document.getElementById('combatLog').innerHTML = '<div class="log-entry">Registro de combate limpo</div>';
        });

        // Adicionar arma
        if (addWeaponBtn) addWeaponBtn.addEventListener('click', () => {
            const weaponList = document.querySelector('.weapon-list');
            if (!weaponList) return;
            
            const newWeapon = document.createElement('div');
            newWeapon.className = 'weapon-item';
            newWeapon.innerHTML = `
                <input type="text" class="weapon-name" placeholder="Nome da arma">
                <input type="text" class="weapon-damage" placeholder="Dano">
                <button class="small-btn remove-weapon">×</button>
            `;
            weaponList.insertBefore(newWeapon, addWeaponBtn);
            
            newWeapon.querySelector('.remove-weapon').addEventListener('click', function() {
                this.parentElement.remove();
            });
        });

        // Fechar modal ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target === moveModal) {
                moveModal.classList.remove('active');
            }
            if (e.target === existingMovesModal) {
                existingMovesModal.classList.remove('active');
            }
            if (e.target === diceModal) {
                diceModal.classList.remove('active');
            }
        });

        // Categorias de golpes existentes
        document.querySelectorAll('.moves-categories .category-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.moves-categories .category-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const category = this.dataset.category;
                this.renderExistingMoves(category);
            }.bind(this));
        });
    }
    
    setupCombatActions() {
        const quickAttackBtn = document.getElementById('quickAttackBtn');
        const defendBtn = document.getElementById('defendBtn');
        const diceRollerBtn = document.getElementById('diceRollerBtn');

        // Ataque rápido
        if (quickAttackBtn) quickAttackBtn.addEventListener('click', () => {
            const attackBonus = parseInt(document.getElementById('attackBonus')?.value) || 0;
            const roll = this.rollDice(20);
            const total = roll + attackBonus;
            
            this.logMessage(`⚔️ Ataque Rápido: Rolou ${roll} + ${attackBonus} = <strong>${total}</strong>`, 'attack');
            
            if (roll === 20) {
                this.logMessage('🎯 CRÍTICO! Dano máximo!', 'critical');
            } else if (roll === 1) {
                this.logMessage('💥 FALHA CRÍTICA! Algo deu errado...', 'failure');
            }
        });

        // Defender
        if (defendBtn) defendBtn.addEventListener('click', () => {
            const defenseBonus = parseInt(document.getElementById('defenseBonus')?.value) || 0;
            const roll = this.rollDice(10);
            const total = roll + defenseBonus + 5;
            
            this.logMessage(`🛡️ Defender: Rolou ${roll} + ${defenseBonus} + 5 = <strong>${total}</strong> de defesa`, 'defense');
        });
        
        // Rolagem de dados
        if (diceRollerBtn) diceRollerBtn.addEventListener('click', () => {
            diceModal.classList.add('active');
        });
    }
    
    setupDiceRoller() {
        const diceCountInput = document.getElementById('diceCount');
        const decreaseBtn = document.getElementById('decreaseDice');
        const increaseBtn = document.getElementById('increaseDice');
        const rollDiceBtn = document.getElementById('rollDiceBtn');
        
        if (!diceCountInput || !decreaseBtn || !increaseBtn || !rollDiceBtn) return;
        
        decreaseBtn.addEventListener('click', () => {
            const current = parseInt(diceCountInput.value);
            if (current > 1) {
                diceCountInput.value = current - 1;
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            const current = parseInt(diceCountInput.value);
            if (current < 10) {
                diceCountInput.value = current + 1;
            }
        });
        
        // Botões de dados específicos
        document.querySelectorAll('.dice-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const diceType = this.dataset.dice;
                const diceSize = parseInt(diceType.substring(1));
                const count = parseInt(diceCountInput.value);
                
                let total = 0;
                let rolls = [];
                
                for (let i = 0; i < count; i++) {
                    const roll = combatSystem.rollDice(diceSize);
                    rolls.push(roll);
                    total += roll;
                }
                
                const resultDisplay = document.getElementById('diceResult');
                const historyDisplay = document.getElementById('diceHistory');
                
                if (count === 1) {
                    resultDisplay.textContent = rolls[0];
                    historyDisplay.textContent = `Rolou 1${diceType}: ${rolls[0]}`;
                    combatSystem.logMessage(`🎲 Rolou 1${diceType}: <strong>${rolls[0]}</strong>`, 'dice');
                } else {
                    resultDisplay.textContent = `${total} (${rolls.join(' + ')})`;
                    historyDisplay.textContent = `Rolou ${count}${diceType}: ${rolls.join(', ')} = ${total}`;
                    combatSystem.logMessage(`🎲 Rolou ${count}${diceType}: ${rolls.join(' + ')} = <strong>${total}</strong>`, 'dice');
                }
                
                combatSystem.diceHistory.push({
                    dice: diceType,
                    count: count,
                    rolls: rolls,
                    total: total,
                    time: new Date().toLocaleTimeString()
                });
            });
        });
        
        // Rolagem genérica
        rollDiceBtn.addEventListener('click', () => {
            const diceType = 'd20';
            const diceSize = 20;
            const count = parseInt(diceCountInput.value);
            
            let total = 0;
            let rolls = [];
            
            for (let i = 0; i < count; i++) {
                const roll = combatSystem.rollDice(diceSize);
                rolls.push(roll);
                total += roll;
            }
            
            const resultDisplay = document.getElementById('diceResult');
            const historyDisplay = document.getElementById('diceHistory');
            
            if (count === 1) {
                resultDisplay.textContent = rolls[0];
                historyDisplay.textContent = `Rolou 1${diceType}: ${rolls[0]}`;
                combatSystem.logMessage(`🎲 Rolou 1${diceType}: <strong>${rolls[0]}</strong>`, 'dice');
            } else {
                resultDisplay.textContent = `${total} (${rolls.join(' + ')})`;
                historyDisplay.textContent = `Rolou ${count}${diceType}: ${rolls.join(', ')} = ${total}`;
                combatSystem.logMessage(`🎲 Rolou ${count}${diceType}: ${rolls.join(' + ')} = <strong>${total}</strong>`, 'dice');
            }
            
            combatSystem.diceHistory.push({
                dice: diceType,
                count: count,
                rolls: rolls,
                total: total,
                time: new Date().toLocaleTimeString()
            });
        });
    }
    
    rollDice(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }
    
    showExistingMoves() {
        this.renderExistingMoves('all');
        document.getElementById('existingMovesModal').classList.add('active');
    }
    
    renderExistingMoves(category) {
        const existingMovesList = document.getElementById('existingMovesList');
        if (!existingMovesList) return;
        
        existingMovesList.innerHTML = '';
        
        const categoryNames = {
            'basic': 'Básico',
            'advanced': 'Avançado',
            'special': 'Especial',
            'finisher': 'Finalizador'
        };
        
        const movesToShow = category === 'all' 
            ? Object.entries(this.golpesExistentes).flatMap(([cat, moves]) => 
                moves.map(move => ({ ...move, category: cat }))
              )
            : this.golpesExistentes[category].map(move => ({ ...move, category }));
        
        movesToShow.forEach(move => {
            const item = document.createElement('div');
            item.className = 'existing-move-item';
            
            item.innerHTML = `
                <div class="existing-move-name">${move.nome} <small>(${categoryNames[move.category]})</small></div>
                <div class="existing-move-desc">${move.descricao}</div>
                <div style="margin-top: 5px; font-size: 0.8em; color: var(--blood-red);">
                    ${move.custo > 0 ? `Custo: ${move.custo} PE | ` : ''}Dano: ${move.dano}
                </div>
            `;
            
            item.addEventListener('click', () => {
                document.getElementById('moveName').value = move.nome;
                document.getElementById('moveDescription').value = move.descricao;
                document.getElementById('moveCost').value = move.custo || 0;
                document.getElementById('moveDamage').value = move.dano || '';
                document.getElementById('moveBonus').value = move.bonus || 0;
                document.getElementById('moveType').value = move.category;
                document.getElementById('moveRange').value = move.alcance || 'melee';
                document.getElementById('moveAttribute').value = move.atributo || '';
                
                document.getElementById('existingMovesModal').classList.remove('active');
                document.getElementById('moveModal').classList.add('active');
            });
            
            existingMovesList.appendChild(item);
        });
    }
    
    renderMoves() {
        const movesContainer = document.getElementById('movesContainer');
        const searchInput = document.getElementById('searchInput');
        
        if (!movesContainer) return;
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        // Filtrar golpes
        let filteredMoves = this.golpes;
        
        if (searchTerm) {
            filteredMoves = filteredMoves.filter(move => 
                move.nome.toLowerCase().includes(searchTerm) || 
                move.descricao.toLowerCase().includes(searchTerm) ||
                move.tipo.toLowerCase().includes(searchTerm)
            );
        }
        
        // Limpar container
        movesContainer.innerHTML = '';
        
        if (filteredMoves.length === 0) {
            movesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-fist-raised"></i>
                    <h3>Nenhum golpe encontrado</h3>
                    <p>${searchTerm ? 'Tente buscar por outro termo' : 'Clique em "Novo Golpe" para criar seu primeiro golpe de combate'}</p>
                </div>
            `;
            return;
        }
        
        // Renderizar cada golpe
        filteredMoves.forEach(move => {
            const moveCard = this.createMoveCard(move);
            movesContainer.appendChild(moveCard);
        });
        
        // Adicionar eventos aos botões
        this.attachMoveEvents();
    }
    
    createMoveCard(move) {
        const moveCard = document.createElement('div');
        moveCard.className = 'move-card';
        moveCard.dataset.id = move.id;
        
        // Nomes dos tipos
        const typeNames = {
            'basic': 'BÁSICO',
            'advanced': 'AVANÇADO',
            'special': 'ESPECIAL',
            'finisher': 'FINALIZADOR'
        };
        
        // Nomes dos alcances
        const rangeNames = {
            'melee': 'Corpo-a-Corpo',
            'close': 'Curto (1.5m)',
            'medium': 'Médio (3m)',
            'long': 'Longo (6m+)'
        };
        
        // Cor baseada no tipo
        const typeColors = {
            'basic': '#525252',
            'advanced': '#9a0707',
            'special': '#d4af37',
            'finisher': '#8b0000'
        };
        
        moveCard.style.borderLeftColor = typeColors[move.tipo] || typeColors.basic;
        
        moveCard.innerHTML = `
            <div class="move-header">
                <div>
                    <h3 class="move-name">${move.nome}</h3>
                    <span class="move-type" style="background-color: ${typeColors[move.tipo] || typeColors.basic}">${typeNames[move.tipo]}</span>
                </div>
            </div>
            
            <div class="move-meta">
                ${move.custo > 0 ? `<div class="move-cost"><i class="fas fa-bolt"></i> <span>${move.custo} PE</span></div>` : ''}
                ${move.dano ? `<div class="move-damage"><i class="fas fa-tint"></i> <span>${move.dano}</span></div>` : ''}
                ${move.bonus > 0 ? `<div class="move-bonus"><i class="fas fa-plus-circle"></i> <span>+${move.bonus}</span></div>` : ''}
                ${move.alcance ? `<div class="move-range"><i class="fas fa-ruler"></i> <span>${rangeNames[move.alcance]}</span></div>` : ''}
            </div>
            
            <div class="move-description">${move.descricao}</div>
            
            ${move.efeito ? `<div class="move-effect"><strong>Efeito:</strong> ${move.efeito}</div>` : ''}
            
                <div class="move-edit-btns">
                    <button class="edit-btn" data-id="${move.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="delete-btn" data-id="${move.id}">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </div>
            </div>
        `;
        
        return moveCard;
    }
    
    attachMoveEvents() {
        document.querySelectorAll('.move-use-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const moveId = parseInt(e.currentTarget.dataset.id);
                this.useMove(moveId);
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const moveId = parseInt(e.currentTarget.dataset.id);
                this.editMove(moveId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const moveId = parseInt(e.currentTarget.dataset.id);
                this.deleteMove(moveId);
            });
        });
    }
    
    useMove(id) {
        const move = this.golpes.find(m => m.id === id);
        if (!move) return;
        
        const attackBonus = parseInt(document.getElementById('attackBonus')?.value) || 0;
        const totalBonus = attackBonus + (move.bonus || 0);
        const roll = this.rollDice(20);
        const total = roll + totalBonus;
        
        // Verificar PE disponível
        const currentPE = parseInt(document.getElementById('currentPE')?.value) || 0;
        if (currentPE < move.custo) {
            this.logMessage(`⚠️ PE insuficiente para usar ${move.nome}! Necessário: ${move.custo} PE`, 'warning');
            return;
        }
        
        // Consumir PE
        if (move.custo > 0) {
            document.getElementById('currentPE').value = currentPE - move.custo;
        }
        
        // Log do ataque
        let message = `⚔️ <strong>${move.nome}</strong>: Rolou ${roll} + ${totalBonus} = <strong>${total}</strong>`;
        
        if (move.dano && move.dano !== '-') {
            message += ` | Dano: ${move.dano}`;
        }
        
        if (move.custo > 0) {
            message += ` | Custo: ${move.custo} PE`;
        }
        
        this.logMessage(message, 'attack');
        
        // Efeitos especiais
        if (move.efeito) {
            this.logMessage(`✨ Efeito: ${move.efeito}`, 'effect');
        }
        
        // Crítico
        if (move.critico) {
            const critRange = move.critico.split('-').map(n => parseInt(n));
            if (roll >= critRange[0] && roll <= critRange[1]) {
                this.logMessage('🎯 GOLPE CRÍTICO!', 'critical');
            }
        }
        
        // Falha crítica
        if (roll === 1) {
            this.logMessage('💥 FALHA CRÍTICA! O golpe falhou miseravelmente!', 'failure');
        }
    }
    
    editMove(id) {
        const move = this.golpes.find(m => m.id === id);
        if (!move) return;
        
        this.isEditing = true;
        this.currentMoveId = id;
        document.getElementById('modalTitle').textContent = 'Editar Golpe de Combate';
        
        // Preencher formulário
        document.getElementById('moveName').value = move.nome;
        document.getElementById('moveType').value = move.tipo;
        document.getElementById('moveDescription').value = move.descricao;
        document.getElementById('moveCost').value = move.custo || 0;
        document.getElementById('moveDamage').value = move.dano || '';
        document.getElementById('moveBonus').value = move.bonus || 0;
        document.getElementById('moveCritical').value = move.critico || '';
        document.getElementById('moveEffect').value = move.efeito || '';
        document.getElementById('moveAttribute').value = move.atributo || '';
        document.getElementById('moveRange').value = move.alcance || 'melee';
        
        document.getElementById('moveModal').classList.add('active');
    }
    
    deleteMove(id) {
        if (confirm('Tem certeza que deseja excluir este golpe?')) {
            this.golpes = this.golpes.filter(move => move.id !== id);
            this.saveMoves();
            this.renderMoves();
            this.logMessage(`🗑️ Golpe excluído do repertório`, 'info');
        }
    }
    
    saveMove() {
        const nome = document.getElementById('moveName')?.value.trim();
        const tipo = document.getElementById('moveType')?.value;
        const descricao = document.getElementById('moveDescription')?.value.trim();
        const custo = parseInt(document.getElementById('moveCost')?.value) || 0;
        const dano = document.getElementById('moveDamage')?.value.trim();
        const bonus = parseInt(document.getElementById('moveBonus')?.value) || 0;
        const critico = document.getElementById('moveCritical')?.value.trim();
        const efeito = document.getElementById('moveEffect')?.value.trim();
        const atributo = document.getElementById('moveAttribute')?.value || null;
        const alcance = document.getElementById('moveRange')?.value;
        
        if (!nome || !tipo || !descricao) {
            alert('Preencha os campos obrigatórios!');
            return;
        }
        
        if (this.isEditing && this.currentMoveId) {
            // Editar golpe existente
            const index = this.golpes.findIndex(m => m.id === this.currentMoveId);
            if (index !== -1) {
                this.golpes[index] = {
                    ...this.golpes[index],
                    nome,
                    tipo,
                    descricao,
                    custo,
                    dano,
                    bonus,
                    critico,
                    efeito,
                    atributo,
                    alcance
                };
                this.logMessage(`✏️ Golpe "${nome}" atualizado`, 'info');
            }
        } else {
            // Adicionar novo golpe
            const newId = this.golpes.length > 0 ? Math.max(...this.golpes.map(m => m.id)) + 1 : 1;
            const novoGolpe = {
                id: newId,
                nome,
                tipo,
                descricao,
                custo,
                dano,
                bonus,
                critico,
                efeito,
                atributo,
                alcance
            };
            
            this.golpes.push(novoGolpe);
            this.logMessage(`✨ Novo golpe "${nome}" criado!`, 'success');
        }
        
        this.saveMoves();
        document.getElementById('moveModal').classList.remove('active');
        this.renderMoves();
    }
    
    saveMoves() {
        localStorage.setItem('characterMoves', JSON.stringify(this.golpes));
    }
    
    logMessage(message, type = 'normal') {
        const combatLog = document.getElementById('combatLog');
        if (!combatLog) return;
        
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        
        // Cores baseadas no tipo
        const typeStyles = {
            'critical': 'color: #ff4444; font-weight: bold;',
            'success': 'color: #44ff44;',
            'failure': 'color: #ff8844; font-style: italic;',
            'warning': 'color: #ffaa44;',
            'effect': 'color: #aa44ff;',
            'info': 'color: #44aaff;',
            'attack': 'color: #ff9900;',
            'defense': 'color: #44aaff;',
            'dice': 'color: #d4af37;'
        };
        
        logEntry.innerHTML = `<span style="${typeStyles[type] || ''}">${message}</span>`;
        
        combatLog.appendChild(logEntry);
        combatLog.scrollTop = combatLog.scrollHeight;
    }
}

// Inicializar os sistemas
let combatSystem;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Carregado - Inicializando sistemas...');
    marksSystem = new MarksSystem();
    combatSystem = new CombatSystem();
    console.log('Sistemas inicializados com sucesso!');
});