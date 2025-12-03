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

// ------- PACTOS PRONTOS-------
const pactosExistentes = 
  [
{ nome: "Corte Carmesim", elemento: "Sangue", execucao: "Padrão", alcance: "Toque",
  alvo: "Criatura", duracao: "Instantâneo", descricao: "Um corte ritual que drena vigor.",
  pe: 2, dt: "1d20+Vontade", dano: "1d8", danoExtra: "Sangramento (1d4 por 2 turnos)" },

{ nome: "Lâmina Hemorrágica", elemento: "Sangue", execucao: "Padrão", alcance: "Curto",
  alvo: "Inimigo", duracao: "Instantâneo", descricao: "Forma uma lâmina feita do próprio sangue.",
  pe: 2, dt: "1d20+Reflexo", dano: "1d10", danoExtra: "Hemorragia (1d4 por 3 turnos)" },

{ nome: "Selo Vital", elemento: "Sangue", execucao: "Padrão", alcance: "Toque",
  alvo: "Aliado", duracao: "2 turnos", descricao: "Marca o aliado com um selo que absorve dano.",
  pe: 3, dt: "Automático", dano: "-", danoExtra: "Reduz dano recebido em 2d4" },

{ nome: "Corrupção Rubra", elemento: "Sangue", execucao: "Padrão", alcance: "Médio",
  alvo: "Criatura", duracao: "2 turnos", descricao: "Injeta sangue pútrido no corpo do alvo.",
  pe: 3, dt: "1d20+Vontade", dano: "1d6", danoExtra: "Envenenamento sanguíneo (1d6 por 2 turnos)" },

{ nome: "Vínculo Hemático", elemento: "Sangue", execucao: "Padrão", alcance: "Médio",
  alvo: "Criatura", duracao: "3 turnos", descricao: "Liga o sangue do alvo ao seu.",
  pe: 3, dt: "1d20+Vontade", dano: "-", danoExtra: "50% do dano recebido é refletido" },

{ nome: "Lacrima Rubra", elemento: "Sangue", execucao: "Movimento", alcance: "Pessoal",
  alvo: "Usuário", duracao: "Instantâneo", descricao: "Seu sangue cicatriza rapidamente.",
  pe: 1, dt: "Automático", dano: "-", danoExtra: "Cura 1d8" },

{ nome: "Chicote Vivo", elemento: "Sangue", execucao: "Padrão", alcance: "Curto",
  alvo: "Inimigo", duracao: "Instantâneo", descricao: "Um chicote de sangue endurecido atinge o alvo.",
  pe: 2, dt: "1d20+Reflexo", dano: "1d6", danoExtra: "Puxão — alvo perde 1m de deslocamento" },

{ nome: "Pulso da Carnificina", elemento: "Sangue", execucao: "Padrão", alcance: "Área (3m)",
  alvo: "Inimigos", duracao: "Instantâneo", descricao: "Explosão de energia sanguínea ao redor.",
  pe: 3, dt: "1d20+Reflexo", dano: "1d8", danoExtra: "Atordoamento por 1 turno (Vontade nega)" },

{ nome: "Pacto da Vida Tomada", elemento: "Sangue", execucao: "Padrão", alcance: "Toque",
  alvo: "Criatura", duracao: "Instantâneo", descricao: "Rouba vitalidade de um inimigo.",
  pe: 3, dt: "1d20+Vontade", dano: "1d10", danoExtra: "Usuário recupera metade do dano" },

{ nome: "Sangue Forjado", elemento: "Sangue", execucao: "Movimento", alcance: "Pessoal",
  alvo: "Usuário", duracao: "2 turnos", descricao: "O sangue se solidifica cobrindo o corpo.",
  pe: 2, dt: "Automático", dano: "-", danoExtra: "+2 Defesa" },

{ nome: "Chuva Rubra", elemento: "Sangue", execucao: "Padrão", alcance: "Longo",
  alvo: "Área (5m)", duracao: "Instantâneo", descricao: "Gotas de sangue afiado caem como flechas.",
  pe: 3, dt: "1d20+Reflexo", dano: "2d4", danoExtra: "Sangramento leve" },

{ nome: "Marca Hemorrágica", elemento: "Sangue", execucao: "Padrão", alcance: "Curto",
  alvo: "Criatura", duracao: "3 turnos", descricao: "Cria uma marca que amplifica ferimentos.",
  pe: 2, dt: "1d20+Vontade", dano: "-", danoExtra: "+2 dano físico recebido" },

{ nome: "Ferida Crescente", elemento: "Sangue", execucao: "Padrão", alcance: "Toque",
  alvo: "Criatura", duracao: "2 turnos", descricao: "A ferida do alvo continua se rasgando.",
  pe: 2, dt: "1d20+Vontade", dano: "1d4", danoExtra: "1d4 adicional por 2 turnos" },

{ nome: "Fluxo Vital", elemento: "Sangue", execucao: "Movimento", alcance: "Pessoal",
  alvo: "Usuário", duracao: "Instantâneo", descricao: "Canaliza sangue para aumentar precisão.",
  pe: 1, dt: "Automático", dano: "-", danoExtra: "+1 em testes de ataque" },

{ nome: "Rasgo Profano", elemento: "Sangue", execucao: "Padrão", alcance: "Curto",
  alvo: "Inimigo", duracao: "Instantâneo", descricao: "Um rasgo profundo feito de energia vermelha.",
  pe: 2, dt: "1d20+Reflexo", dano: "1d12", danoExtra: "-" },

{ nome: "Sangue como Arma", elemento: "Sangue", execucao: "Movimento", alcance: "Curto",
  alvo: "Área (cone 3m)", duracao: "Instantâneo", descricao: "Projeta sangue endurecido à frente.",
  pe: 2, dt: "1d20+Reflexo", dano: "1d6", danoExtra: "-" },

{ nome: "Coração em Fúria", elemento: "Sangue", execucao: "Movimento", alcance: "Pessoal",
  alvo: "Usuário", duracao: "1 turno", descricao: "Acelera o pulso até o limite.",
  pe: 1, dt: "Automático", dano: "-", danoExtra: "+2 Iniciativa" },

{ nome: "Chamado Rubro", elemento: "Sangue", execucao: "Padrão", alcance: "Médio",
  alvo: "Criatura", duracao: "2 turnos", descricao: "Atrai o sangue do alvo para sua mão.",
  pe: 2, dt: "1d20+Vontade", dano: "1d6", danoExtra: "Alvo perde 1m de deslocamento" },

{ nome: "Oferenda Profunda", elemento: "Sangue", execucao: "Padrão", alcance: "Pessoal",
  alvo: "Usuário", duracao: "Instantâneo", descricao: "Sacrifica parte da vida em troca de poder.",
  pe: 0, dt: "Automático", dano: "-", danoExtra: "Perde 1d6 HP e ganha +3 dano por 1 turno" },

{ nome: "Sangue Errante", elemento: "Sangue", execucao: "Movimento", alcance: "Pessoal",
  alvo: "Usuário", duracao: "1 turno", descricao: "Seu sangue se move de forma instável.",
  pe: 1, dt: "Automático", dano: "-", danoExtra: "1 ataque que te acerte falha (uma vez)" },
{ nome: "Manto da Penumbra", elemento: "Sombra", execucao: "Movimento", alcance: "Pessoal",
  alvo: "Usuário", duracao: "2 turnos", descricao: "Um véu de sombras envolve o corpo.",
  pe: 1, dt: "Automático", dano: "-", danoExtra: "+2 Furtividade" },

{ nome: "Presas da Escuridão", elemento: "Sombra", execucao: "Padrão", alcance: "Curto",
  alvo: "Inimigo", duracao: "Instantâneo", descricao: "Sombras afiadas rasgam a pele do alvo.",
  pe: 2, dt: "1d20+Reflexo", dano: "1d8", danoExtra: "-" },

{ nome: "Olhos Insondáveis", elemento: "Sombra", execucao: "Movimento", alcance: "Pessoal",
  alvo: "Usuário", duracao: "1 turno", descricao: "A visão enxerga através de áreas escuras.",
  pe: 1, dt: "Automático", dano: "-", danoExtra: "Ignora penalidades por escuridão" },

{ nome: "Passo Silente", elemento: "Sombra", execucao: "Movimento", alcance: "Pessoal",
  alvo: "Usuário", duracao: "Instantâneo", descricao: "A sombra impulsiona o movimento silencioso.",
  pe: 1, dt: "Automático", dano: "-", danoExtra: "Move 2m extras sem provocar reação" },

{ nome: "Mãos da Noite", elemento: "Sombra", execucao: "Padrão", alcance: "Curto",
  alvo: "Criatura", duracao: "1 turno", descricao: "Sombras seguram o alvo pelos tornozelos.",
  pe: 2, dt: "1d20+Vontade", dano: "-", danoExtra: "Reduz deslocamento do alvo pela metade" },

{ nome: "Rasgo Obscuro", elemento: "Sombra", execucao: "Padrão", alcance: "Curto",
  alvo: "Inimigo", duracao: "Instantâneo", descricao: "Um rasgo de pura escuridão corta o ar.",
  pe: 2, dt: "1d20+Reflexo", dano: "1d10", danoExtra: "-" },

{ nome: "Sombra Errante", elemento: "Sombra", execucao: "Movimento", alcance: "Pessoal",
  alvo: "Usuário", duracao: "1 turno", descricao: "Sua sombra se desloca e desorienta inimigos.",
  pe: 1, dt: "Automático", dano: "-", danoExtra: "Primeiro ataque contra você sofre -2" },

{ nome: "Voz do Breu", elemento: "Sombra", execucao: "Padrão", alcance: "Médio",
  alvo: "Criatura", duracao: "2 turnos", descricao: "Um murmúrio sombrio invade a mente.",
  pe: 2, dt: "1d20+Vontade", dano: "1d4", danoExtra: "Alvo sofre -1 em testes mentais" },

{ nome: "Grilhões Nebulosos", elemento: "Sombra", execucao: "Padrão", alcance: "Curto",
  alvo: "Criatura", duracao: "1 turno", descricao: "Correntes escuras prendem temporariamente.",
  pe: 2, dt: "1d20+Vontade", dano: "-", danoExtra: "Imobiliza se falhar" },

{ nome: "Cicatriz Sombria", elemento: "Sombra", execucao: "Padrão", alcance: "Curto",
  alvo: "Criatura", duracao: "2 turnos", descricao: "Uma marca de sombra permanece sobre o alvo.",
  pe: 2, dt: "1d20+Reflexo", dano: "1d6", danoExtra: "+1 dano de sombra recebido" },

{ nome: "Veludo Noturno", elemento: "Sombra", execucao: "Movimento", alcance: "Pessoal",
  alvo: "Usuário", duracao: "2 turnos", descricao: "As sombras suavizam o impacto de ataques.",
  pe: 1, dt: "Automático", dano: "-", danoExtra: "+1 Defesa" },

{ nome: "Garras de Luar", elemento: "Sombra", execucao: "Padrão", alcance: "Curto",
  alvo: "Inimigo", duracao: "Instantâneo", descricao: "Garras longas feitas de noite sólida atacam.",
  pe: 2, dt: "1d20+Reflexo", dano: "1d8", danoExtra: "-" },

{ nome: "Sombras que Observam", elemento: "Sombra", execucao: "Padrão", alcance: "Pessoal",
  alvo: "Usuário", duracao: "2 turnos", descricao: "Sombras alertam sobre movimentos próximos.",
  pe: 1, dt: "Automático", dano: "-", danoExtra: "+2 Percepção" },

{ nome: "Escuridão Condensada", elemento: "Sombra", execucao: "Padrão", alcance: "Médio",
  alvo: "Área (3m)", duracao: "1 turno", descricao: "Cria uma nuvem densa de sombra.",
  pe: 2, dt: "1d20+Vontade", dano: "-", danoExtra: "Reduz visão e ataque em -2" },

{ nome: "Lâmina Crepuscular", elemento: "Sombra", execucao: "Padrão", alcance: "Curto",
  alvo: "Inimigo", duracao: "Instantâneo", descricao: "Uma lâmina temporária feita de pura penumbra.",
  pe: 2, dt: "1d20+Reflexo", dano: "1d12", danoExtra: "-" },

{ nome: "Abraço Tenebroso", elemento: "Sombra", execucao: "Padrão", alcance: "Toque",
  alvo: "Criatura", duracao: "Instantâneo", descricao: "A sombra envolve o alvo drenando calor.",
  pe: 2, dt: "1d20+Vontade", dano: "1d8", danoExtra: "-1 deslocamento" },

{ nome: "Eco do Breu", elemento: "Sombra", execucao: "Padrão", alcance: "Curto",
  alvo: "Criatura", duracao: "1 turno", descricao: "Uma sombra espectral imita o alvo.",
  pe: 2, dt: "1d20+Vontade", dano: "-", danoExtra: "Alvo sofre -1 em testes físicos" },

{ nome: "Véu de Névoa Negra", elemento: "Sombra", execucao: "Movimento", alcance: "Pessoal",
  alvo: "Usuário", duracao: "1 turno", descricao: "Coberto por névoa sombria.",
  pe: 1, dt: "Automático", dano: "-", danoExtra: "Desvantagem para te detectar" },

{ nome: "Sombra Cortante", elemento: "Sombra", execucao: "Padrão", alcance: "Curto",
  alvo: "Inimigo", duracao: "Instantâneo", descricao: "A sombra toma forma e corta o alvo.",
  pe: 2, dt: "1d20+Reflexo", dano: "1d10", danoExtra: "-" },

{ nome: "Noite Interior", elemento: "Sombra", execucao: "Padrão", alcance: "Pessoal",
  alvo: "Usuário", duracao: "2 turnos", descricao: "A escuridão fortalece sua mente.",
  pe: 2, dt: "Automático", dano: "-", danoExtra: "+1 em testes de Vontade" },
{ nome: "Brasa Interior", elemento: "Chama", execucao: "Movimento", alcance: "Pessoal",
  alvo: "Usuário", duracao: "2 turnos", descricao: "O corpo é aquecido por energia ardente.",
  pe: 1, dt: "Automático", dano: "-", danoExtra: "+1 Vigor" },

{ nome: "Lança Ígnea", elemento: "Chama", execucao: "Padrão", alcance: "Médio",
  alvo: "Inimigo", duracao: "Instantâneo", descricao: "Um jato de chamas perfura o ar.",
  pe: 2, dt: "1d20+Reflexo", dano: "1d10", danoExtra: "-" },

{ nome: "Tecido de Cinzas", elemento: "Chama", execucao: "Movimento", alcance: "Pessoal",
  alvo: "Usuário", duracao: "1 turno", descricao: "Cinzas giram ao redor reduzindo impacto.",
  pe: 1, dt: "Automático", dano: "-", danoExtra: "+1 Defesa" },

{ nome: "Explosão Breve", elemento: "Chama", execucao: "Padrão", alcance: "Curto",
  alvo: "Área (2m)", duracao: "Instantâneo", descricao: "Uma pequena explosão de fogo.",
  pe: 2, dt: "1d20+Reflexo", dano: "1d8", danoExtra: "-" },

{ nome: "Toque Escaldante", elemento: "Chama", execucao: "Padrão", alcance: "Toque",
  alvo: "Criatura", duracao: "Instantâneo", descricao: "A mão emite calor intenso.",
  pe: 1, dt: "1d20+Reflexo", dano: "1d6", danoExtra: "-" },

{ nome: "Chama Vigia", elemento: "Chama", execucao: "Padrão", alcance: "Pessoal",
  alvo: "Usuário", duracao: "2 turnos", descricao: "Uma pequena chama alerta perigos.",
  pe: 1, dt: "Automático", dano: "-", danoExtra: "+2 Percepção" },

{ nome: "Círculo Ardiloso", elemento: "Chama", execucao: "Padrão", alcance: "Curto",
  alvo: "Área (3m)", duracao: "1 turno", descricao: "Um anel de fogo retarda inimigos.",
  pe: 2, dt: "1d20+Vontade", dano: "-", danoExtra: "Reduz deslocamento pela metade" },

{ nome: "Martelo Flamejante", elemento: "Chama", execucao: "Padrão", alcance: "Curto",
  alvo: "Inimigo", duracao: "Instantâneo", descricao: "Golpe envolto em fogo denso.",
  pe: 2, dt: "1d20+Reflexo", dano: "1d12", danoExtra: "-" },

{ nome: "Chama Enraivecida", elemento: "Chama", execucao: "Padrão", alcance: "Pessoal",
  alvo: "Usuário", duracao: "2 turnos", descricao: "A chama alimenta a fúria do pactuante.",
  pe: 2, dt: "Automático", dano: "-", danoExtra: "+1 dano físico" },

{ nome: "Luz Cortante", elemento: "Chama", execucao: "Padrão", alcance: "Médio",
  alvo: "Inimigo", duracao: "Instantâneo", descricao: "Um feixe quente corta o ar.",
  pe: 2, dt: "1d20+Reflexo", dano: "1d10", danoExtra: "-" },

{ nome: "Caminho Fumegante", elemento: "Chama", execucao: "Movimento", alcance: "Pessoal",
  alvo: "Usuário", duracao: "1 turno", descricao: "Avanço rápido com rastro quente.",
  pe: 1, dt: "Automático", dano: "-", danoExtra: "+2m de deslocamento" },

{ nome: "Fagulha Errante", elemento: "Chama", execucao: "Padrão", alcance: "Médio",
  alvo: "Criatura", duracao: "Instantâneo", descricao: "Uma fagulha busca o alvo.",
  pe: 1, dt: "1d20+Reflexo", dano: "1d4", danoExtra: "-" },

{ nome: "Barreira Fervente", elemento: "Chama", execucao: "Padrão", alcance: "Curto",
  alvo: "Área (linha)", duracao: "1 turno", descricao: "Parede curta de calor intenso.",
  pe: 2, dt: "1d20+Vontade", dano: "-", danoExtra: "Impedimento de passagem" },

{ nome: "Rajada Cauterizante", elemento: "Chama", execucao: "Padrão", alcance: "Curto",
  alvo: "Inimigo", duracao: "Instantâneo", descricao: "Um golpe flamejante cauteriza feridas.",
  pe: 2, dt: "1d20+Reflexo", dano: "1d8", danoExtra: "-1 cura recebida por 1 turno" },
{ nome: "Corrente Abissal", elemento: "Âncora", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "1 turno", descricao: "Laços de ferro espectral prendem o alvo.",
    pe: 2, dt: "1d20+Força", dano: "1d8", danoExtra: "Imobilizado por 1 turno" },

  { nome: "Grilhão da Maré Morta", elemento: "Âncora", execucao: "Padrão", alcance: "Toque",
    alvo: "Criatura", duracao: "2 turnos", descricao: "Correntes frias drenam vigor.",
    pe: 2, dt: "1d20+Vontade", dano: "1d6", danoExtra: "Desvantagem em movimento" },

  { nome: "Peso das Profundezas", elemento: "Âncora", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "3 turnos", descricao: "Seu corpo fica denso como o fundo do mar.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "+2 Defesa física" },

  { nome: "Garras Náuticas", elemento: "Âncora", execucao: "Padrão", alcance: "Médio",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Garras de água pesada atacam à distância.",
    pe: 2, dt: "1d20+Reflexo", dano: "1d10", danoExtra: "Empurrão 2m" },

  { nome: "Afundamento Espiritual", elemento: "Âncora", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "2 turnos", descricao: "Coloca sobre o alvo o peso das almas afogadas.",
    pe: 3, dt: "1d20+Vontade", dano: "1d8", danoExtra: "-2 em testes de ataque" },

  { nome: "Tridente Espectral", elemento: "Âncora", execucao: "Padrão", alcance: "Longo",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Um tridente da maré sombria perfura o alvo.",
    pe: 3, dt: "1d20+Reflexo", dano: "1d12", danoExtra: "-" },

  { nome: "Abraço da Maré", elemento: "Âncora", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "1 turno", descricao: "Água densa cobre o alvo, retardando seus movimentos.",
    pe: 2, dt: "1d20+Força", dano: "1d6", danoExtra: "Reduz movimento pela metade" },

  { nome: "Lamento Náufrago", elemento: "Âncora", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "2 turnos", descricao: "Seu corpo emite a aura fria de quem afundou.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "Inimigos no curto sofrem -1 em ataque" },

  { nome: "Cadeado da Tempestade", elemento: "Âncora", execucao: "Padrão", alcance: "Médio",
    alvo: "Criatura", duracao: "1 turno", descricao: "Selo aquático tranca os movimentos do alvo.",
    pe: 3, dt: "1d20+Vontade", dano: "-", danoExtra: "Paralisado por 1 turno" },

  { nome: "Esfera de Pressão", elemento: "Âncora", execucao: "Padrão", alcance: "Pessoal",
    alvo: "Usuário", duracao: "2 turnos", descricao: "Pressão das profundezas cria escudo ao redor.",
    pe: 2, dt: "Automático", dano: "-", danoExtra: "Reduz 3 de dano recebido" },

  { nome: "Julgamento do Farol", elemento: "Âncora", execucao: "Padrão", alcance: "Longo",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Um feixe de luz pesada incinera o alvo.",
    pe: 2, dt: "1d20+Reflexo", dano: "1d10", danoExtra: "Cegueira leve (1 turno)" },

  { nome: "Eco dos Afogados", elemento: "Âncora", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Ecos espirituais atacam a mente.",
    pe: 1, dt: "1d20+Vontade", dano: "1d6", danoExtra: "-" },

  { nome: "Círculo de Maré Perversa", elemento: "Âncora", execucao: "Completa", alcance: "Curto",
    alvo: "Área 3m", duracao: "2 turnos", descricao: "Terreno se torna pesado e pegajoso.",
    pe: 3, dt: "1d20+Força", dano: "1d6", danoExtra: "Reduz movimento dos inimigos" },

  { nome: "Olho do Temporal", elemento: "Âncora", execucao: "Padrão", alcance: "Médio",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Estilhaços de pressão atingem o alvo.",
    pe: 2, dt: "1d20+Reflexo", dano: "2d6", danoExtra: "-" },

  { nome: "Maré Ascendente", elemento: "Âncora", execucao: "Movimento", alcance: "Toque",
    alvo: "Aliado", duracao: "2 turnos", descricao: "Fortalece o aliado com energia oceânica.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "+2 em ataque" },

  { nome: "Torrente Quebramar", elemento: "Âncora", execucao: "Padrão", alcance: "Longo",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Um jato de água comprimida perfura como lança.",
    pe: 2, dt: "1d20+Reflexo", dano: "1d12", danoExtra: "-" },

  { nome: "Fenda Submersa", elemento: "Âncora", execucao: "Padrão", alcance: "Curto",
    alvo: "Área 2m", duracao: "1 turno", descricao: "O chão se abre revelando águas turbulentas.",
    pe: 3, dt: "1d20+Força", dano: "2d6", danoExtra: "Derruba no chão" },

  { nome: "Casco Espectral", elemento: "Âncora", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "3 turnos", descricao: "Forma um casco protetor de navio fantasma.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "+3 Defesa" },

  { nome: "Marca do Náufrago", elemento: "Âncora", execucao: "Padrão", alcance: "Toque",
    alvo: "Criatura", duracao: "2 turnos", descricao: "Amaldiçoa com o destino dos afogados.",
    pe: 3, dt: "1d20+Vontade", dano: "1d8", danoExtra: "Alvo recebe +1d4 de dano de água" },

  { nome: "Tromba Abissal", elemento: "Âncora", execucao: "Padrão", alcance: "Médio",
    alvo: "Área 2m", duracao: "Instantâneo", descricao: "Uma explosão de água negra atinge vários.",
    pe: 3, dt: "1d20+Reflexo", dano: "2d6", danoExtra: "-" },
{ nome: "Espinhos da Caçada", elemento: "Mata", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Espinhos velozes atravessam o alvo.",
    pe: 1, dt: "1d20+Reflexo", dano: "1d8", danoExtra: "Sangramento leve" },

  { nome: "Raiz Predatória", elemento: "Mata", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "1 turno", descricao: "Raízes emergem e puxam o alvo.",
    pe: 2, dt: "1d20+Força", dano: "1d6", danoExtra: "Imobilizado 1 turno" },

  { nome: "Sopro de Esporos", elemento: "Mata", execucao: "Padrão", alcance: "Médio",
    alvo: "Área 2m", duracao: "2 turnos", descricao: "Nuvem tóxica de esporos sufocantes.",
    pe: 3, dt: "1d20+Vontade", dano: "1d6", danoExtra: "Veneno (1d4 por 2 turnos)" },

  { nome: "Flecha Verdejante", elemento: "Mata", execucao: "Padrão", alcance: "Longo",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Projeção de energia natural afiada.",
    pe: 2, dt: "1d20+Reflexo", dano: "1d10", danoExtra: "-" },

  { nome: "Armadilha de Galhos", elemento: "Mata", execucao: "Completa", alcance: "Curto",
    alvo: "Área 3m", duracao: "1 turno", descricao: "Galhos amarram e derrubam inimigos.",
    pe: 3, dt: "1d20+Força", dano: "1d6", danoExtra: "Derruba no chão" },

  { nome: "Mordida Selvagem", elemento: "Mata", execucao: "Padrão", alcance: "Toque",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Dentes espirituais rasgam carne.",
    pe: 1, dt: "1d20+Força", dano: "1d10", danoExtra: "-" },

  { nome: "Bênção do Predador", elemento: "Mata", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "2 turnos", descricao: "Aumenta instintos de caça.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "+2 ataque físico" },

  { nome: "Esporos da Putrefação", elemento: "Mata", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "2 turnos", descricao: "Infecta o alvo com decomposição viva.",
    pe: 3, dt: "1d20+Vontade", dano: "1d8", danoExtra: "Dano contínuo (1d4)" },

  { nome: "Crescimento Selvagem", elemento: "Mata", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "3 turnos", descricao: "Corpo cresce com energia verde.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "+2 Defesa" },

  { nome: "Garras de Liana", elemento: "Mata", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Lianas cortantes chicoteiam o inimigo.",
    pe: 2, dt: "1d20+Reflexo", dano: "1d12", danoExtra: "-" },

  { nome: "Raiz de Consumo", elemento: "Mata", execucao: "Padrão", alcance: "Toque",
    alvo: "Criatura", duracao: "1 turno", descricao: "Raiz absorve vitalidade do alvo.",
    pe: 2, dt: "1d20+Vontade", dano: "1d6", danoExtra: "+1d4 cura para o usuário" },

  { nome: "Urro da Besta Ancestral", elemento: "Mata", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Área 5m", duracao: "Instantâneo", descricao: "Um grito primal abala inimigos.",
    pe: 2, dt: "1d20+Vontade", dano: "-", danoExtra: "Medo leve (1 turno)" },

  { nome: "Caçador de Sombras Verdes", elemento: "Mata", execucao: "Padrão", alcance: "Longo",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Um disparo verde que busca o alvo.",
    pe: 3, dt: "1d20+Reflexo", dano: "2d6", danoExtra: "-" },

  { nome: "Pele de Carvalho", elemento: "Mata", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "3 turnos", descricao: "Sua pele torna-se rígida como madeira.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "+3 Defesa" },

  { nome: "Enxame de Aranhas Verdes", elemento: "Mata", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "2 turnos", descricao: "Aranhas venenosas atacam em enxame.",
    pe: 3, dt: "1d20+Reflexo", dano: "1d8", danoExtra: "Veneno (1d4 por 2 turnos)" },

  { nome: "Flecha de Espinho Negro", elemento: "Mata", execucao: "Padrão", alcance: "Longo",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Espinho escuro perfura com força.",
    pe: 2, dt: "1d20+Reflexo", dano: "1d12", danoExtra: "-" },

  { nome: "Ritual da Semente Voraz", elemento: "Mata", execucao: "Completa", alcance: "Curto",
    alvo: "Criatura", duracao: "2 turnos", descricao: "Semente se agarra ao alvo e devora.",
    pe: 4, dt: "1d20+Vontade", dano: "1d8", danoExtra: "Dano contínuo 1d6" },

  { nome: "Prisão de Cipós", elemento: "Mata", execucao: "Padrão", alcance: "Médio",
    alvo: "Criatura", duracao: "2 turnos", descricao: "Cipós fortes se enrolam no alvo.",
    pe: 2, dt: "1d20+Força", dano: "1d6", danoExtra: "Imobilizado" },

  { nome: "Chicote Floral", elemento: "Mata", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Golpe largo feito de pétalas afiadas.",
    pe: 1, dt: "1d20+Reflexo", dano: "1d10", danoExtra: "-" },

  { nome: "Guardião Verde", elemento: "Mata", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "2 turnos", descricao: "Espírito animal verde protege seu corpo.",
    pe: 2, dt: "Automático", dano: "-", danoExtra: "Reduz 2 de dano recebido" },
{ nome: "Voz Trêmula", elemento: "Sussurro", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "1 turno", descricao: "Um murmúrio desconcentra o alvo.",
    pe: 1, dt: "1d20+Presença", dano: "1d4", danoExtra: "Desvantagem em Percepção" },

  { nome: "Segredo Cortante", elemento: "Sussurro", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Um sussurro agudo corta a mente.",
    pe: 2, dt: "1d20+Intuição", dano: "1d6", danoExtra: "Confusão leve por 1 turno" },

  { nome: "Som Ausente", elemento: "Sussurro", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "2 turnos", descricao: "O som ao redor desaparece.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "Passos inaudíveis" },

  { nome: "Eco Rachado", elemento: "Sussurro", execucao: "Padrão", alcance: "Médio",
    alvo: "Criatura", duracao: "1 turno", descricao: "Um eco distorcido causa dor mental.",
    pe: 2, dt: "1d20+Intelecto", dano: "1d8", danoExtra: "Perda de 1 ação menor" },

  { nome: "Chamado Suave", elemento: "Sussurro", execucao: "Movimento", alcance: "Curto",
    alvo: "Criatura", duracao: "1 turno", descricao: "Atenção do alvo é desviada por uma voz baixa.",
    pe: 1, dt: "1d20+Presença", dano: "-", danoExtra: "Alvo perde foco (–2 em testes)" },

  { nome: "Nome Esquecido", elemento: "Sussurro", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "2 turnos", descricao: "O alvo esquece algo momentâneo.",
    pe: 2, dt: "1d20+Vontade", dano: "-", danoExtra: "Perde habilidade por 1 turno" },

  { nome: "Rastro de Voz", elemento: "Sussurro", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "2 turnos", descricao: "Ecos falsos confundem perseguidores.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "Dificulta rastreamento" },

  { nome: "Sussurro Gelado", elemento: "Sussurro", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Um sussurro frio atinge a mente.",
    pe: 1, dt: "1d20+Intuição", dano: "1d4", danoExtra: "Reduz velocidade por 1 turno" },

  { nome: "Sombra da Voz", elemento: "Sussurro", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "2 turnos", descricao: "Sua voz projeta ecos para distrair.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "Vantagem em Furtividade sonora" },

  { nome: "Julgamento Silencioso", elemento: "Sussurro", execucao: "Padrão", alcance: "Médio",
    alvo: "Criatura", duracao: "1 turno", descricao: "Silêncio opressivo perturba espírito.",
    pe: 2, dt: "1d20+Vontade", dano: "1d6", danoExtra: "Alvo não pode comunicar-se" },

  { nome: "Som do Além", elemento: "Sussurro", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "2 turnos", descricao: "Vozes distantes atormentam o alvo.",
    pe: 2, dt: "1d20+Presença", dano: "1d6", danoExtra: "Medo leve" },

  { nome: "Mentira Baixa", elemento: "Sussurro", execucao: "Movimento", alcance: "Curto",
    alvo: "Criatura", duracao: "1 turno", descricao: "Um sussurro induz dúvida momentânea.",
    pe: 1, dt: "1d20+Manipulação", dano: "-", danoExtra: "Desvantagem em ataque" },

  { nome: "Ordem Sutil", elemento: "Sussurro", execucao: "Movimento", alcance: "Curto",
    alvo: "Criatura", duracao: "1 turno", descricao: "A mente do alvo recebe uma sugestão mínima.",
    pe: 1, dt: "1d20+Presença", dano: "-", danoExtra: "Força alvo a recuar 1 metro" },

  { nome: "Voz Deserta", elemento: "Sussurro", execucao: "Padrão", alcance: "Médio",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "A voz interna do alvo é distorcida.",
    pe: 2, dt: "1d20+Vontade", dano: "1d8", danoExtra: "Atordoamento leve" },

  { nome: "Ruído de Alma", elemento: "Sussurro", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "1 turno", descricao: "Ruído interno abala o foco.",
    pe: 1, dt: "1d20+Intelecto", dano: "1d4", danoExtra: "-1 ação menor" },

  { nome: "Eco Provisório", elemento: "Sussurro", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "3 turnos", descricao: "Sons duplicados confundem inimigos.",
    pe: 2, dt: "Automático", dano: "-", danoExtra: "Aumenta dificuldade de sofrer acerto crítico" },

  { nome: "Advertência Oculta", elemento: "Sussurro", execucao: "Reação", alcance: "Curto",
    alvo: "Aliado", duracao: "Instantâneo", descricao: "Um aviso inaudível previne perigo.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "Aliado ganha +2 em Reflexo" },

  { nome: "Sopro Invisível", elemento: "Sussurro", execucao: "Movimento", alcance: "Curto",
    alvo: "Criatura", duracao: "1 turno", descricao: "Um sopro leve desloca o alvo.",
    pe: 1, dt: "1d20+Força", dano: "-", danoExtra: "Empurra 1 metro" },

  { nome: "Verso Murmurante", elemento: "Sussurro", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Palavras desconexas desestabilizam.",
    pe: 1, dt: "1d20+Presença", dano: "1d6", danoExtra: "Alvo perde 1 ponto de moral" },

  { nome: "Chamado Interno", elemento: "Sussurro", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "2 turnos", descricao: "Voz interna guia seus passos.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "+2 em Percepção" },
 { nome: "Selo Perdido", elemento: "Antigo", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "1 turno", descricao: "Poder antigo limita o movimento.",
    pe: 2, dt: "1d20+Vontade", dano: "-", danoExtra: "Reduz deslocamento pela metade" },

  { nome: "Marca de Era Antiga", elemento: "Antigo", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "2 turnos", descricao: "Símbolo arcaico pesa sobre o alvo.",
    pe: 2, dt: "1d20+Intelecto", dano: "1d6", danoExtra: "-2 em testes de força" },

  { nome: "Olhar das Ruínas", elemento: "Antigo", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "2 turnos", descricao: "Visão revela fraquezas do inimigo.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "+2 em Investigação" },

  { nome: "Vento das Eras", elemento: "Antigo", execucao: "Padrão", alcance: "Médio",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Sopro seco das eras atinge o alvo.",
    pe: 2, dt: "1d20+Agilidade", dano: "1d8", danoExtra: "Empurra 2 metros" },

  { nome: "Colapso Antigo", elemento: "Antigo", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Fragmentos espirituais esmagam o alvo.",
    pe: 3, dt: "1d20+Força", dano: "1d10", danoExtra: "Dano extra 1d4" },

  { nome: "Nome das Pedras", elemento: "Antigo", execucao: "Movimento", alcance: "Curto",
    alvo: "Aliado", duracao: "2 turnos", descricao: "A força das ruínas fortalece.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "+2 em Defesa" },

  { nome: "Tédio Milenar", elemento: "Antigo", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "1 turno", descricao: "Peso das eras enfraquece.",
    pe: 2, dt: "1d20+Vontade", dano: "-", danoExtra: "Desvantagem em ataque" },

  { nome: "Braços das Colunas", elemento: "Antigo", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Força pétrea prende brevemente.",
    pe: 2, dt: "1d20+Força", dano: "1d6", danoExtra: "Imobiliza por 1 turno" },

  { nome: "Proteção de Estátua", elemento: "Antigo", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "2 turnos", descricao: "Pele se torna mais rígida.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "+1 armadura" },

  { nome: "Chamado das Ruínas", elemento: "Antigo", execucao: "Padrão", alcance: "Médio",
    alvo: "Criatura", duracao: "2 turnos", descricao: "Energia ancestral atrai espíritos velhos.",
    pe: 3, dt: "1d20+Presença", dano: "1d8", danoExtra: "Assombração segue o alvo" },

  { nome: "Ponto Esquecido", elemento: "Antigo", execucao: "Reação", alcance: "Pessoal",
    alvo: "Usuário", duracao: "Instantâneo", descricao: "Lembra de técnica esquecida.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "Refaz 1 teste falho" },

  { nome: "Areia Sagrada", elemento: "Antigo", execucao: "Movimento", alcance: "Curto",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Areia ressecada cega por um instante.",
    pe: 1, dt: "1d20+Agilidade", dano: "-", danoExtra: "Cegueira leve" },

  { nome: "Piso da Antiga Torre", elemento: "Antigo", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "2 turnos", descricao: "O chão responde ao seu passo.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "+1 deslocamento" },

  { nome: "Pedra Marcada", elemento: "Antigo", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "1 turno", descricao: "Runas antigas queimam o alvo.",
    pe: 2, dt: "1d20+Técnica", dano: "1d6", danoExtra: "Diminui defesa em 1" },

  { nome: "Vulto de Outra Era", elemento: "Antigo", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "1 turno", descricao: "Corpo parece deslocado no tempo.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "Vantagem em esquiva" },

  { nome: "Peso de Mil Anos", elemento: "Antigo", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "O alvo sente décadas sobre o corpo.",
    pe: 2, dt: "1d20+Força", dano: "1d6", danoExtra: "Reduce força em 2" },

  { nome: "Julgamento das Ruínas", elemento: "Antigo", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "2 turnos", descricao: "Ruínas espirituais condenam o alvo.",
    pe: 3, dt: "1d20+Vontade", dano: "1d8", danoExtra: "Perde 1 ação maior" },

  { nome: "Guia Ancestral", elemento: "Antigo", execucao: "Movimento", alcance: "Pessoal",
    alvo: "Usuário", duracao: "2 turnos", descricao: "Recordações antigas orientam passo.",
    pe: 1, dt: "Automático", dano: "-", danoExtra: "+1 em todos testes mentais" },

  { nome: "Cicatriz do Passado", elemento: "Antigo", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Memórias antigas ferem espírito.",
    pe: 2, dt: "1d20+Intuição", dano: "1d8", danoExtra: "-1 moral" },

  { nome: "Estalo da Pedra Velha", elemento: "Antigo", execucao: "Padrão", alcance: "Curto",
    alvo: "Criatura", duracao: "Instantâneo", descricao: "Som seco assusta e fere.",
    pe: 1, dt: "1d20+Presença", dano: "1d4", danoExtra: "Assustado por 1 turno" }
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
