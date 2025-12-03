// details.js - Sistema de Relacionamentos (sem sistema de riqueza)
class RelationshipsSystem {
    constructor() {
        this.relationships = JSON.parse(localStorage.getItem('relationships')) || [];
        this.container = document.querySelector('.relationships-container');

        // Modal elements (IDs/classes do seu HTML)
        this.addBtn = document.getElementById('addRelationshipBtn');
        this.clearBtn = document.getElementById('clearRelationshipsBtn');
        this.modal = document.getElementById('relationshipModal');
        this.cancelBtn = document.getElementById('cancelRelationship');
        this.saveBtn = document.getElementById('saveRelationship');
        this.relationshipType = document.getElementById('relationshipType');
        this.customTypeGroup = document.getElementById('customTypeGroup');
        this.customTypeInput = document.getElementById('customRelationshipType');
        this.characterNameInput = document.getElementById('characterName');
        this.closeSpan = document.querySelector('#relationshipModal .close');

        this.bindEvents();
        this.renderRelationships();
    }

    bindEvents() {
        if (this.addBtn) this.addBtn.addEventListener('click', () => this.openModal());
        if (this.clearBtn) this.clearBtn.addEventListener('click', () => this.clearAll());
        if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.closeModal());
        if (this.saveBtn) this.saveBtn.addEventListener('click', () => this.saveRelationship());
        if (this.relationshipType) this.relationshipType.addEventListener('change', (e) => this.toggleCustomField(e));
        if (this.closeSpan) this.closeSpan.addEventListener('click', () => this.closeModal());

        // Fechar modal clicando fora
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Delegação para botão "Remover" dentro do container
        this.container.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('remove-relationship')) {
                const id = Number(e.target.datasetId || e.target.getAttribute('data-id'));
                // se data-id não existir, tenta attribute padrão
                const parsed = Number(e.target.getAttribute('data-id'));
                this.removeRelationship(parsed);
            }
        });
    }

    openModal() {
        if (!this.modal) return;
        this.characterNameInput.value = '';
        this.relationshipType.value = '';
        this.customTypeGroup.style.display = 'none';
        this.customTypeInput.value = '';
        this.modal.style.display = 'block';
    }

    closeModal() {
        if (!this.modal) return;
        this.modal.style.display = 'none';
    }

    toggleCustomField(e) {
        if (!this.customTypeGroup) return;
        this.customTypeGroup.style.display = e.target.value === 'personalizado' ? 'block' : 'none';
    }

    saveRelationship() {
        const name = (this.characterNameInput.value || '').trim();
        let type = (this.relationshipType.value || '').trim();

        if (type === 'personalizado') {
            type = (this.customTypeInput.value || '').trim();
        }

        if (!name) {
            alert('Por favor, preencha o nome do personagem.');
            return;
        }

        if (!type) {
            alert('Por favor, selecione ou defina um tipo de relacionamento.');
            return;
        }

        const rel = { id: Date.now(), character: name, type };
        this.relationships.push(rel);
        this.saveToStorage();
        this.renderRelationships();
        this.closeModal();
    }

    removeRelationship(id) {
        if (!confirm('Tem certeza que deseja remover este relacionamento?')) return;
        this.relationships = this.relationships.filter(r => r.id !== id);
        this.saveToStorage();
        this.renderRelationships();
    }

    clearAll() {
        if (this.relationships.length === 0) {
            alert('Não há relacionamentos para limpar.');
            return;
        }
        if (!confirm('Tem certeza que deseja limpar TODOS os relacionamentos? Esta ação não pode ser desfeita.')) return;
        this.relationships = [];
        this.saveToStorage();
        this.renderRelationships();
    }

    renderRelationships() {
        if (!this.container) return;
        if (this.relationships.length === 0) {
            this.container.innerHTML = '<div class="empty-state">Nenhum relacionamento ainda. Clique em "+ Adicionar Relacionamento" para criar um.</div>';
            return;
        }

        // monta a lista
        this.container.innerHTML = this.relationships.map(rel => `
            <div class="relationship-item">
                <div class="relationship-info">
                    <div class="relationship-character">${this.escapeHtml(rel.character)}</div>
                    <div class="relationship-type">${this.escapeHtml(rel.type)}</div>
                </div>
                <button class="remove-relationship" data-id="${rel.id}">Remover</button>
            </div>
        `).join('');
    }

    escapeHtml(str = '') {
        return String(str)
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

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa somente se o HTML existir
    const relContainer = document.querySelector('.relationships-container');
    if (relContainer) window.relationshipsSystem = new RelationshipsSystem();
});
