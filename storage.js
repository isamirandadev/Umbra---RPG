// =============================
// SISTEMA ÚNICO DE SAVE GLOBAL
// =============================

// Objeto central com tudo que o jogo precisa salvar
window.gameData = {
    personagem: {},
    atributos: {},
    pactos: [],
    rituais: [],
    skills: [],
    inventario: [],
    corpo: {},
    detalhes: {},
    progresso: {},
    config: {},
};

// --- SALVAR ---
window.salvarJogo = function () {
    try {
        localStorage.setItem("umbraSave", JSON.stringify(gameData));
        console.log("💾 Jogo salvo!");
    } catch (e) {
        console.error("Erro ao salvar:", e);
    }
};

// --- CARREGAR ---
window.carregarJogo = function () {
    const save = localStorage.getItem("umbraSave");
    if (save) {
        Object.assign(gameData, JSON.parse(save));
        console.log("📂 Save carregado!");
    } else {
        console.log("Nenhum save encontrado, criando novo...");
    }
};

// Carregar automaticamente ao abrir QUALQUER página
window.addEventListener("load", carregarJogo);
