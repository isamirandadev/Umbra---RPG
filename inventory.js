// =========================================================
// ===== CORREÇÃO BASE: LOCAL STORAGE SEMPRE COMO ARRAY =====
// =========================================================

function loadInventory() {
    let data = localStorage.getItem("inventory");

    try {
        data = JSON.parse(data);
    } catch (e) {
        data = [];
    }

    if (!Array.isArray(data)) {
        data = [];
    }
    return data;
}

function saveInventory(inv) {
    if (!Array.isArray(inv)) return;
    localStorage.setItem("inventory", JSON.stringify(inv));
}

let inventory = loadInventory();


// =========================================================
// ================== RIQUEZAS (MOEDAS) =====================
// =========================================================

function loadWealth() {
    let w = localStorage.getItem("wealth");
    try { w = JSON.parse(w); } catch(e){ w = null; }

    if (!w) {
        w = { bronze: 0, prata: 0, ouro: 0, platina: 0 };
    }
    return w;
}

function saveWealth(w) {
    localStorage.setItem("wealth", JSON.stringify(w));
}

let wealth = loadWealth();


// Atualiza riqueza no HTML
function renderWealth() {
    document.getElementById("bronze").value = wealth.bronze;
    document.getElementById("prata").value = wealth.prata;
    document.getElementById("ouro").value = wealth.ouro;
    document.getElementById("platina").value = wealth.platina;
}

// Salva ao editar
document.addEventListener("input", (e) => {
    if (["bronze","prata","ouro","platina"].includes(e.target.id)) {
        wealth[e.target.id] = Number(e.target.value);
        saveWealth(wealth);
    }
});


// =========================================================
// ======================= SLOTS ============================
// =========================================================

function loadSlots() {
    let s = localStorage.getItem("slotsInfo");
    try { s = JSON.parse(s); } catch(e){ s = null; }

    if (!s) {
        s = { used: 0, limit: 20 };
    }
    return s;
}

function saveSlots(s) {
    localStorage.setItem("slotsInfo", JSON.stringify(s));
}

let slotsInfo = loadSlots();

function renderSlots() {
    document.getElementById("slots-used").innerText = slotsInfo.used;
    document.getElementById("slots-limit").value = slotsInfo.limit;
}

document.addEventListener("input", (e) => {
    if (e.target.id === "slots-limit") {
        slotsInfo.limit = Number(e.target.value);
        saveSlots(slotsInfo);
    }
});


// =========================================================
// =============== ABERTURA DOS MODAIS ======================
// =========================================================

const modal = document.getElementById("itemModal");
const modalContent = document.getElementById("modalContent");

function openModal(type) {
    modal.style.display = "flex";
    modalContent.innerHTML = generateForm(type);
}

document.getElementById("closeModal").addEventListener("click", () => {
    modal.style.display = "none";
});


// =========================================================
// =============== FORMULÁRIOS DE ITENS =====================
// =========================================================

function generateForm(type) {

    // 🔥 ARMA
    if (type === "arma") {
        return `
        <h2>Novo Item — Arma</h2>

        <label>Nome:</label>
        <input id="nome">

        <label>Complexidade:</label>
        <select id="complexidade">
            <option>Simples</option>
            <option>Tática</option>
            <option>Pesada</option>
        </select>

        <label>Empunhadura:</label>
        <select id="empunhadura">
            <option>Uma mão</option>
            <option>Duas mãos</option>
        </select>

        <label>Tipo de dano:</label>
        <select id="tipoDano">
            <option>Contundente</option>
            <option>Cortante</option>
            <option>Perfurante</option>
            <option>Lacerante</option>
            <option>Fogo</option>
            <option>Ácido</option>
            <option>Elétrico</option>
            <option>Gélido</option>
            <option>Sagrado</option>
            <option>Profano</option>
            <option>Necrótico</option>
            <option>Psíquico</option>
            <option>Entrópico</option>
        </select>

        <label>Dano:</label>
        <input id="dano" placeholder="ex.: 1d4">

        <label>Dano Secundário:</label>
        <input id="dano2" placeholder="ex.: 2d8">

        <label>Crítico:</label>
        <input id="critico" placeholder="ex.: 3d8 x 1d4">

        <label>Alcance:</label>
        <select id="alcance">
            <option>Curto</option>
            <option>Médio</option>
            <option>Longo</option>
            <option>Distante</option>
        </select>

        <label>Espaço:</label>
        <input id="espaco" placeholder="ex.: 1">

        <label>Melhorias / Corrompido:</label>
        <textarea id="melhoria" placeholder="Descreva detalhes do corrompido, efeitos, dados etc."></textarea>

        <label>Imagem (URL):</label>
        <input id="img">

        <label>Descrição:</label>
        <textarea id="descricao"></textarea>

        <button class="btn" onclick="addItem('arma')">Adicionar</button>
        `;
    }

    // 🧨 MUNIÇÃO
    if (type === "municao") {
        return `
        <h2>Novo Item — Munição</h2>

        <label>Nome:</label>
        <input id="nome">

        <label>Espaço:</label>
        <input id="espaco">

        <label>Quantidade:</label>
        <input id="quantidade">

        <label>Imagem (URL):</label>
        <input id="img">

        <label>Descrição:</label>
        <textarea id="descricao"></textarea>

        <button class="btn" onclick="addItem('municao')">Adicionar</button>
        `;
    }

    // 🛡 PROTEÇÃO
    if (type === "protecao") {
        return `
        <h2>Novo Item — Proteção</h2>

        <label>Nome:</label>
        <input id="nome">

        <label>Defesa (ex. 1d4):</label>
        <input id="defesa">

        <label>Espaço:</label>
        <input id="espaco">

        <label>Melhorias / Corrompido:</label>
        <textarea id="melhoria"></textarea>

        <label>Imagem (URL):</label>
        <input id="img">

        <label>Descrição:</label>
        <textarea id="descricao"></textarea>

        <button class="btn" onclick="addItem('protecao')">Adicionar</button>
        `;
    }

    // 📦 GERAL
    if (type === "geral") {
        return `
        <h2>Novo Item — Geral</h2>

        <label>Nome:</label>
        <input id="nome">

        <label>Espaço:</label>
        <input id="espaco">

        <label>Tag:</label>
        <select id="tag">
            <option>Documentos</option>
            <option>Ingredientes</option>
            <option>Alquimia</option>
            <option>Poção</option>
            <option>Artefatos</option>
            <option>Bestas</option>
            <option>Natureza</option>
            <option>Itens Corrompidos</option>
            <option>Acessórios</option>
        </select>

        <label>Imagem (URL):</label>
        <input id="img">

        <label>Descrição:</label>
        <textarea id="descricao"></textarea>

        <button class="btn" onclick="addItem('geral')">Adicionar</button>
        `;
    }

    // 👁‍🗨 CORROMPIDOS
    if (type === "corrompido") {
        return `
        <h2>Novo Item — Corrompido</h2>

        <label>Nome:</label>
        <input id="nome">

        <label>Espaço:</label>
        <input id="espaco">

        <label>Fundamento do Sombrio:</label>
        <select id="fund">
            <option>Mata</option>
            <option>Sussurro</option>
            <option>Chama</option>
            <option>Sombra</option>
            <option>Âncora</option>
        </select>

        <label>Descrição:</label>
        <textarea id="descricao"></textarea>

        <button class="btn" onclick="addItem('corrompido')">Adicionar</button>
        `;
    }

}


// =========================================================
// ================ ADICIONAR ITEM ==========================
// =========================================================

function addItem(type) {

    const item = { type };

    // Coleta tudo automaticamente
    document.querySelectorAll("#modalContent input, #modalContent textarea, #modalContent select")
    .forEach(el => {
        item[el.id] = el.value;
    });

    item.espaco = Number(item.espaco) || 1;

    inventory.push(item);
    saveInventory(inventory);

    slotsInfo.used += item.espaco;
    saveSlots(slotsInfo);

    renderInventory();
    renderSlots();

    modal.style.display = "none";
}


// =========================================================
// =============== RENDERIZAR INVENTÁRIO ====================
// =========================================================

function removeItem(index) {
    const item = inventory[index];
    slotsInfo.used -= item.espaco;
    if (slotsInfo.used < 0) slotsInfo.used = 0;

    inventory.splice(index, 1);

    saveInventory(inventory);
    saveSlots(slotsInfo);

    renderInventory();
    renderSlots();
}

function renderInventory() {
    const cont = document.getElementById("inventory-list");
    cont.innerHTML = "";

    inventory.forEach((item, i) => {
        const div = document.createElement("div");
        div.classList.add("item-box");

        div.innerHTML = `
            <h3>${item.nome}</h3>
            ${item.img ? `<img src="${item.img}" class="item-img">` : ""}
            <p><b>Tipo:</b> ${item.type}</p>
            ${item.dano ? `<p><b>Dano:</b> ${item.dano}</p>` : ""}
            ${item.critico ? `<p><b>Crítico:</b> ${item.critico}</p>` : ""}
            ${item.defesa ? `<p><b>Defesa:</b> ${item.defesa}</p>` : ""}
            <p><b>Espaço:</b> ${item.espaco}</p>
            ${item.descricao ? `<p>${item.descricao}</p>` : ""}

            <button class="btn-remove" onclick="removeItem(${i})">Remover</button>
        `;

        cont.appendChild(div);
    });
}


// =========================================================
// ================= INICIALIZAÇÃO ==========================
// =========================================================

window.onload = () => {
    renderWealth();
    renderSlots();
    renderInventory();
};
