class RelationshipsSystem {
constructor() {
    this.relationships = JSON.parse(localStorage.getItem('relationships')) || [];
    this.initializeRelationships();
    this.initializeWealth(); // ← Com this.
}
    
    initializeRelationships() {
        // Event listeners
        document.getElementById('addRelationshipBtn').addEventListener('click', () => this.openModal());
        document.getElementById('clearRelationshipsBtn').addEventListener('click', () => this.clearAll());
        document.getElementById('cancelRelationship').addEventListener('click', () => this.closeModal());
        document.getElementById('saveRelationship').addEventListener('click', () => this.saveRelationship());
        document.getElementById('relationshipType').addEventListener('change', (e) => this.toggleCustomField(e));
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        
        // Fechar modal clicando fora
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('relationshipModal')) {
                this.closeModal();
            }
        });
        
        this.renderRelationships();
    }
    
    openModal() {
        document.getElementById('relationshipModal').style.display = 'block';
        document.getElementById('characterName').value = '';
        document.getElementById('relationshipType').value = '';
        document.getElementById('customTypeGroup').style.display = 'none';
        document.getElementById('customRelationshipType').value = '';
    }
    
    closeModal() {
        document.getElementById('relationshipModal').style.display = 'none';
    }
    
    toggleCustomField(e) {
        const customGroup = document.getElementById('customTypeGroup');
        customGroup.style.display = e.target.value === 'personalizado' ? 'block' : 'none';
    }
    
    saveRelationship() {
        const characterName = document.getElementById('characterName').value.trim();
        let relationshipType = document.getElementById('relationshipType').value;
        
        if (relationshipType === 'personalizado') {
            relationshipType = document.getElementById('customRelationshipType').value.trim();
        }
        
        if (!characterName || !relationshipType) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        const relationship = {
            id: Date.now(),
            character: characterName,
            type: relationshipType
        };
        
        this.relationships.push(relationship);
        this.saveToStorage();
        this.renderRelationships();
        this.closeModal();
    }
    
    removeRelationship(id) {
        if (confirm('Tem certeza que deseja remover este relacionamento?')) {
            this.relationships = this.relationships.filter(rel => rel.id !== id);
            this.saveToStorage();
            this.renderRelationships();
        }
    }
    
    clearAll() {
        if (this.relationships.length === 0) {
            alert('Não há relacionamentos para limpar.');
            return;
        }
        
        if (confirm('Tem certeza que deseja limpar TODOS os relacionamentos? Esta ação não pode ser desfeita.')) {
            this.relationships = [];
            this.saveToStorage();
            this.renderRelationships();
        }
    }
    
    renderRelationships() {
        const container = document.querySelector('.relationships-container');
        
        if (this.relationships.length === 0) {
            container.innerHTML = '<div class="empty-state">Nenhum relacionamento ainda. Clique em "+ Adicionar Relacionamento" para criar um.</div>';
            return;
        }
        
        container.innerHTML = this.relationships.map(rel => `
            <div class="relationship-item">
                <div class="relationship-info">
                    <div class="relationship-character">${this.escapeHtml(rel.character)}</div>
                    <div class="relationship-type">${this.escapeHtml(rel.type)}</div>
                </div>
                <button class="remove-relationship" onclick="relationshipsSystem.removeRelationship(${rel.id})">
                    Remover
                </button>
            </div>
        `).join('');
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
        localStorage.setItem('relationships', JSON.stringify(this.relationships));
    }
}

// Inicializar o sistema
let relationshipsSystem;
document.addEventListener('DOMContentLoaded', function() {
    relationshipsSystem = new RelationshipsSystem();
});

// No construtor da classe RelationshipsSystem, adicione:
this.initializeWealth();

// Adicione este método à classe:
initializeWealth() 
{
    const wealthInputs = document.querySelectorAll('.wealth-input');
    
    // Carrega valores salvos
    wealthInputs.forEach(input => {
        const currencyName = input.closest('.wealth-row').querySelector('.wealth-name').textContent;
        const savedValue = localStorage.getItem(`wealth_${currencyName}`);
        
        if (savedValue) {
            input.value = savedValue;
        }
        
        // Salva quando o usuário digitar
        input.addEventListener('input', (e) => {
            localStorage.setItem(`wealth_${currencyName}`, e.target.value);
        });
    });
}

clearWealth() 
{
    const wealthInputs = document.querySelectorAll('.wealth-input');
    wealthInputs.forEach(input => {
        input.value = '';
        const currencyName = input.closest('.wealth-row').querySelector('.wealth-name').textContent;
        localStorage.removeItem(`wealth_${currencyName}`);
    });
}

