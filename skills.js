// =======================
// SISTEMA DE ATRIBUTOS
// =======================

document.addEventListener("DOMContentLoaded", () => {

    // ---- Carrega ou cria valores padrão ----
    let attributes = JSON.parse(localStorage.getItem("attributes")) || {};
    let masterPoints = Number(localStorage.getItem("masterPoints")) || 0;

    const masterInput = document.getElementById("master-control-value");
    masterInput.value = masterPoints;

    // ---- Seleciona todos os grupos de atributo ----
    const groups = document.querySelectorAll(".attribute-group");

    // Gerar estrutura se não existir
    groups.forEach(group => {
        const name = group.dataset.attr;

        if (!attributes[name]) {
            attributes[name] = {
                value: 0,
                dots: 0
            };
        }

        renderGroup(group, attributes[name]);
    });

    // ===========================
    //         FUNÇÕES
    // ===========================

    function renderGroup(group, data) {
        const valueEl = group.querySelector(".attr-value");
        const dots = group.querySelectorAll(".dot");

        // Exibe valor
        valueEl.textContent = data.dots;

        // Preenche dots
        dots.forEach((dot, index) => {
            if (index < data.dots) {
                dot.classList.add("filled");
            } else {
                dot.classList.remove("filled");
            }

            dot.addEventListener("click", () => handleDotClick(group, index));
        });

        // Botões +1 e -1
        group.querySelector(".add").onclick = () => changeValue(group, +1);
        group.querySelector(".sub").onclick = () => changeValue(group, -1);
    }

    function handleDotClick(group, index) {
        const name = group.dataset.attr;
        const current = attributes[name].dots;
        const target = index + 1;

        if (target > current) {
            // aumentar
            const cost = target - current;

            if (masterPoints >= cost) {
                masterPoints -= cost;
                attributes[name].dots = target;
            }
        } else {
            // diminuir
            const refund = current - target;
            masterPoints += refund;
            attributes[name].dots = target;
        }

        save();
        renderAll();
    }

    function changeValue(group, amount) {
        const name = group.dataset.attr;
        const before = attributes[name].dots;
        let after = before + amount;

        if (after < 0 || after > 5) return;

        if (amount > 0 && masterPoints < amount) return;

        if (amount > 0) masterPoints -= amount;
        else masterPoints += Math.abs(amount);

        attributes[name].dots = after;
        save();
        renderAll();
    }

    function renderAll() {
        masterInput.value = masterPoints;
        groups.forEach(g => renderGroup(g, attributes[g.dataset.attr]));
    }

    function save() {
        localStorage.setItem("masterPoints", masterPoints);
        localStorage.setItem("attributes", JSON.stringify(attributes));
    }

    // ===========================
    //     BOTÃO RESET
    // ===========================
    document.getElementById("resetAll").addEventListener("click", () => {
        if (!confirm("Resetar tudo?")) return;

        masterPoints = Number(masterInput.value);
        groups.forEach(group => {
            const name = group.dataset.attr;
            attributes[name].dots = 0;
        });

        save();
        renderAll();
    });

    // ===========================
    //     BOTÃO SALVAR MANUAL
    // ===========================
    document.getElementById("saveAll").addEventListener("click", () => {
        masterPoints = Number(masterInput.value);
        save();
        alert("Valores salvos!");
    });

});
