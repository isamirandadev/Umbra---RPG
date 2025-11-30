// pacto.js (corrigido: X, clique fora, Escape, abertura robusta)

// --- Helpers de DOM ---
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// IDs / elementos esperados no HTML
const btnAddPacto = $('#btn-add-pacto');      // abre lista de pactos
const btnNovoRitual = $('#btn-novo-ritual'); // abre modal novo ritual
const modalPactos = $('#modal-pactos');      // modal lista pactos
const modalNovo = $('#modal-novo');          // modal novo ritual
const listaExistentes = $('#lista-pactos-existentes'); // container pactos prontos
const listaAdicionados = $('#pactos-lista'); // onde os pactos que o jogador adiciona aparecem
const formNovo = $('#form-novo');            // formulário novo ritual

// Small safe checks
if (!listaExistentes) console.warn('pacto.js: #lista-pactos-existentes não encontrado no HTML.');
if (!listaAdicionados) console.warn('pacto.js: #pactos-lista não encontrado no HTML.');

// ------- PACTOS PRONTOS (exemplo reduzido; adicione seus 50) -------
const pactosExistentes = [
  { nome: "Pacto do Sangue Velado", elemento: "Sangue", execucao: "Padrão", alcance: "Toque",
    alvo: "Criatura", duracao: "1 turno", descricao: "Drena vitalidade e causa fraqueza.",
    pe: 2, dt: "1d20+Vontade", dano: "1d6", danoExtra: "Hemorragia (1d4 por 2 turnos)" },

  { nome: "Véu da Noite Antiga", elemento: "Sombra", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "2 turnos", descricao: "Corpo encoberto em escuridão ancestral.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "-" },

  { nome: "Fogo Ancestral", elemento: "Chama", execucao: "Padrão", alcance: "Curto",
    alvo: "Inimigo", duracao: "Instantâneo", descricao: "Chamas rituais queimam o espírito.",
    pe: 2, dt: "1d20+Reflexo", dano: "1d10", danoExtra: "Queimadura (1d4)" },

  // ... complete até 50 conforme quiser ...
];

// --- Render dos pactos existentes (lista modal) ---
function renderPactosExistentes() {
  if (!listaExistentes) return;
  listaExistentes.innerHTML = '';

  pactosExistentes.forEach((p, idx) => {
    const el = document.createElement('div');
    el.className = 'pacto-item';
    el.innerHTML = `
      <div class="pacto-main">
        <div class="pacto-header">
          <h3 class="pacto-nome">${escapeHtml(p.nome)}</h3>
          <span class="pacto-elemento">${escapeHtml(p.elemento)}</span>
        </div>
        <div class="pacto-meta">
          <span><b>Exec:</b> ${escapeHtml(p.execucao)}</span>
          <span><b>Alc:</b> ${escapeHtml(p.alcance)}</span>
          <span><b>Alvo:</b> ${escapeHtml(p.alvo)}</span>
          <span><b>Dur:</b> ${escapeHtml(p.duracao)}</span>
        </div>
        <p class="pacto-desc">${escapeHtml(p.descricao)}</p>
        <div class="pacto-foot">
          <small>PE: ${p.pe} • DT: ${escapeHtml(p.dt)}</small>
          <small>Dano: ${escapeHtml(p.dano)} ${p.danoExtra ? '+ ' + escapeHtml(p.danoExtra) : ''}</small>
        </div>
      </div>
      <button class="pacto-add" data-idx="${idx}" title="Adicionar pacto">+</button>
    `;
    listaExistentes.appendChild(el);
  });

  // ligar botões +
  $$('.pacto-add').forEach(b => b.addEventListener('click', e => {
    const idx = parseInt(b.getAttribute('data-idx'), 10);
    if (!Number.isFinite(idx)) return;
    adicionarPactoAoPersonagem(pactosExistentes[idx]);
  }));
}

// --- Adiciona pacto ao painel do jogador ---
function adicionarPactoAoPersonagem(pacto) {
  if (!listaAdicionados) return;

  const card = document.createElement('div');
  card.className = 'pacto-card';
  card.innerHTML = `
    <div class="card-head">
      <h3>${escapeHtml(pacto.nome)}</h3>
      <button class="pacto-remove" title="Remover">✕</button>
    </div>
    <div class="card-body">
      <p><b>Elemento:</b> ${escapeHtml(pacto.elemento)}</p>
      <p><b>Execução:</b> ${escapeHtml(pacto.execucao)}</p>
      <p><b>Alcance:</b> ${escapeHtml(pacto.alcance)}</p>
      <p><b>Alvo:</b> ${escapeHtml(pacto.alvo)}</p>
      <p><b>Duração:</b> ${escapeHtml(pacto.duracao)}</p>
      <p><b>PE:</b> ${pacto.pe} • <b>DT:</b> ${escapeHtml(pacto.dt)}</p>
      <p><b>Dano:</b> ${escapeHtml(pacto.dano)} ${pacto.danoExtra ? '+ ' + escapeHtml(pacto.danoExtra) : ''}</p>
      <p class="desc">${escapeHtml(pacto.descricao)}</p>
    </div>
  `;

  // remover handler
  const remBtn = card.querySelector('.pacto-remove');
  remBtn.addEventListener('click', () => card.remove());

  listaAdicionados.appendChild(card);
}

// --- Modal helpers (abre/fecha, clique fora, Escape) ---
function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.style.display = 'flex';
  modalEl.setAttribute('aria-hidden', 'false');
  // foco no primeiro input, se houver
  const firstInput = modalEl.querySelector('input, textarea, button, select');
  if (firstInput) firstInput.focus();
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.style.display = 'none';
  modalEl.setAttribute('aria-hidden', 'true');
}

// fecha todos modais
function closeAllModals() {
  $$('.modal').forEach(m => closeModal(m));
}

// configura listeners de fechamento (X) e clique fora
function setupModalCloseBehavior() {
  // close via elementos com classe .close-modal
  $$('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) closeModal(modal);
    });
  });

  // clique fora (se clicar no overlay .modal que envolve .modal-content)
  $$('.modal').forEach(modal => {
    modal.addEventListener('click', (ev) => {
      // se target for o próprio modal (overlay), fecha
      if (ev.target === modal) closeModal(modal);
    });
  });

  // tecla Escape fecha o modal aberto
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeAllModals();
  });
}

// --- Form: novo ritual (submit) ---
if (formNovo) {
  formNovo.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const data = {
      nome: (formNovo.querySelector('#novo-nome') || {}).value || 'Ritual sem nome',
      elemento: (formNovo.querySelector('#novo-elemento') || {}).value || '',
      execucao: (formNovo.querySelector('#novo-execucao') || {}).value || '',
      alcance: (formNovo.querySelector('#novo-alcance') || {}).value || '',
      area: (formNovo.querySelector('#novo-area') || {}).value || '',
      alvo: (formNovo.querySelector('#novo-alvo') || {}).value || '',
      duracao: (formNovo.querySelector('#novo-duracao') || {}).value || '',
      efeito: (formNovo.querySelector('#novo-efeito') || {}).value || '',
      resistencia: (formNovo.querySelector('#novo-resistencia') || {}).value || '',
      dados: (formNovo.querySelector('#novo-dados') || {}).value || '',
      discente: (formNovo.querySelector('#novo-discente') || {}).value || '',
      verdadeiro: (formNovo.querySelector('#novo-verdadeiro') || {}).value || '',
      descricao: (formNovo.querySelector('#novo-descricao') || {}).value || '',
      pe: parseInt((formNovo.querySelector('#novo-pe') || {}).value || '1', 10)
    };

    // transformar em 'pacto' simples e adicionar ao painel do jogador
    adicionarPactoAoPersonagem({
      nome: data.nome,
      elemento: data.elemento,
      execucao: data.execucao,
      alcance: data.alcance,
      alvo: data.alvo,
      duracao: data.duracao,
      descricao: data.descricao,
      pe: data.pe,
      dt: data.resistencia || '—',
      dano: data.dados || '—',
      danoExtra: data.efeito || ''
    });

    // fechar modal e resetar form
    closeModal(modalNovo);
    formNovo.reset();
  });
}

// --- Open buttons (robustos: checam existência) ---
if (btnAddPacto) {
  btnAddPacto.addEventListener('click', () => {
    renderPactosExistentes();
    openModal(modalPactos);
  });
} else {
  console.warn('pacto.js: botão #btn-add-pacto não encontrado.');
}

if (btnNovoRitual) {
  btnNovoRitual.addEventListener('click', () => openModal(modalNovo));
} else {
  console.warn('pacto.js: botão #btn-novo-ritual não encontrado.');
}

// inicialização final
document.addEventListener('DOMContentLoaded', () => {
  setupModalCloseBehavior();
  renderPactosExistentes();
});

// --- util ---
function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}
