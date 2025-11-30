// =========================
// RITUAIS.JS – Criação de RitUAIS
// =========================

// Modal novo ritual
const modalNovo = document.getElementById("modal-novo");
const btnNovoRitual = document.getElementById("btn-novo-ritual");
const listaPactos = document.getElementById("pactos-lista");

// Abrir modal
btnNovoRitual.onclick = () => {
    modalNovo.style.display = "flex";
};

// Fechar modal
document.querySelectorAll(".close-modal").forEach(btn => {
    btn.onclick = () => modalNovo.style.display = "none";
});

// Formulário de novo ritual
const form = document.getElementById("form-novo");

form.onsubmit = function (e) {
    e.preventDefault();

    const nome = document.getElementById("novo-nome").value;
    const elemento = document.getElementById("novo-elemento").value;
    const execucao = document.getElementById("novo-execucao").value;
    const alcance = document.getElementById("novo-alcance").value;
    const alvo = document.getElementById("novo-alvo").value;
    const duracao = document.getElementById("novo-duracao").value;
    const descricao = document.getElementById("novo-descricao").value;
    const pe = document.getElementById("novo-pe").value;
    const dt = document.getElementById("novo-dt").value;
    const dano = document.getElementById("novo-dano").value;
    const danoExtra = document.getElementById("novo-dano-extra").value;

    const card = document.createElement("div");
    card.className = "pacto-card";

    card.innerHTML = `
        <h3>${nome}</h3>
        <p><b>Elemento:</b> ${elemento}</p>
        <p><b>Execução:</b> ${execucao}</p>
        <p><b>Alcance:</b> ${alcance}</p>
        <p><b>Alvo:</b> ${alvo}</p>
        <p><b>Duração:</b> ${duracao}</p>
        <p><b>PE:</b> ${pe}</p>
        <p><b>DT:</b> ${dt}</p>
        <p><b>Dano:</b> ${dano} + ${danoExtra}</p>
        <p>${descricao}</p>
    `;

    listaPactos.appendChild(card);

    modalNovo.style.display = "none";
    form.reset();
};
