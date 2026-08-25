// Roteiro único da campanha do Instagram: o texto de cada cartão E da legenda
// que vai junto com ele.
//
// Fica num arquivo só porque antes não ficava: o texto do post morava dentro
// do PNG (sem fonte nenhuma) e o da legenda dentro do build.js. Os dois
// diziam quase a mesma coisa e podiam divergir sem ninguém notar — foi assim
// que "pra o que importa" foi ao ar. Agora finn-serve/build.js e
// finn-social/gera-cards.mjs leem daqui, então corrigir uma frase corrige a
// arte e a legenda de uma vez.
//
// Convenções:
//   |laranja|  no título marca o trecho que sai em laranja.
//   layout     'hero'   fundo escuro + brilho, com botão de ação
//              'cream'  fundo creme, chips brancos
//              'laranja' fundo laranja, bullets
//              'tiles'  fundo escuro, 3 tiles com emoji grande
//              'centro' fundo creme, tudo centralizado
//
// REGRAS DE REDAÇÃO (foi por não existirem que saiu erro):
//  1. "para + o" = "pro". Nunca escreva "pra o" / "pra a" / "pra os".
//  2. Voz uniforme: imperativo informal ("Testa", "Importa", "Define").
//     Não misture com o formal ("Defina", "Escolha").
//  3. Nada de afirmação que o produto não cumpre. O Finn tem plano grátis
//     de verdade, mas NÃO é "100% grátis" — Plus e Pro existem e são pagos.
//  4. Privacidade se descreve como é: a senha do banco não passa pelo Finn
//     (quem conecta é a Pluggy), mas os lançamentos ficam sim no servidor,
//     numa conta protegida por login. Não prometa o contrário.

const RODAPE = 'finn.dev.br';

const POSTS = [
  {
    n: 1, layout: 'hero', glow: true, pill: '✦ VAGAS LIMITADAS',
    h: 'Testa o Finn |antes| de todo mundo',
    body: 'Grupo de testers aberto — eu dou as boas-vindas pessoalmente e fico à disposição para qualquer dúvida.',
    btn: 'Link na bio → finn.dev.br/beta',
    rodape: 'App financeiro brasileiro, com plano grátis',
    emoji: '🚀',
    legenda: 'Abri um grupo de testers com vagas limitadas — você me ajuda a melhorar o app e eu dou as boas-vindas pessoalmente, com suporte direto por WhatsApp, Instagram ou e-mail.\n\nLink na bio para se inscrever 👆',
    tags: '#financaspessoais #appfinanceiro #controlefinanceiro #educacaofinanceira',
  },
  {
    n: 2, layout: 'cream', pill: null,
    h: 'Chega de |planilha|.',
    body: 'Importa o extrato do seu banco e o Finn organiza tudo sozinho — receitas, despesas e categorias.',
    itens: ['Nubank', 'Itaú', 'Bradesco', 'Banco do Brasil', 'Inter', 'C6 Bank', '+ vários outros'],
    // O arquivo é lido no navegador mesmo (é o que a lib XLSX/OFX faz), mas os
    // lançamentos vão pro banco de dados. A versão antiga dizia "nada vai pro
    // servidor", o que era falso.
    rodape: 'O arquivo é lido no seu aparelho; só os lançamentos são salvos',
    emoji: '📊',
    legenda: 'Importa o extrato do seu banco (Nubank, Itaú, Bradesco, Banco do Brasil, Inter, C6 Bank e mais) e o Finn organiza tudo sozinho — receitas, despesas e categorias, sem digitar nada na mão.',
    tags: '#educacaofinanceira #financaspessoais #organizacaofinanceira',
  },
  {
    n: 3, layout: 'laranja', pill: '🤖 IA FINANCEIRA',
    h: 'Uma IA que lê os seus gastos.',
    // A versão antiga dizia "sem plano pago" — falso: a análise com IA é do
    // Plus (10 por mês) e do Pro (sem limite).
    body: 'Ela olha o seu mês e devolve o que dá para cortar, em português claro e sem jargão.',
    itens: ['Análise dos seus gastos', 'Sugestões de economia', 'Previsão de saldo do mês'],
    rodape: RODAPE,
    emoji: '🤖',
    legenda: 'Análise dos seus gastos, sugestões de economia e previsão de saldo do mês, em português claro.\n\nSão 10 análises por mês no Plus e sem limite no Pro.',
    tags: '#inteligenciaartificial #financaspessoais #appfinanceiro',
  },
  {
    n: 4, layout: 'tiles', pill: null,
    h: 'Metas, limites e |dívidas| — tudo num só lugar.',
    // Era "Defina" (formal) no meio de uma campanha toda no informal.
    body: 'Define quanto quer gastar por categoria, junta dinheiro para um objetivo e simula a quitação de uma dívida.',
    itens: [['🎯', 'Metas de poupança'], ['🚦', 'Limite por categoria'], ['📉', 'Plano de quitação']],
    rodape: RODAPE,
    emoji: '🎯',
    legenda: 'Define quanto quer gastar por categoria, junta dinheiro para um objetivo e simula a quitação de uma dívida com juros de verdade.',
    tags: '#planejamentofinanceiro #financaspessoais #metas',
  },
  {
    n: 5, layout: 'centro', pill: null,
    h: 'Começa de graça. Sem |pegadinha|.',
    body: 'Sem cartão de crédito para testar e sem letra miúda. O plano grátis já organiza o seu mês inteiro.',
    itens: [['🔒', 'Dados protegidos'], ['🇧🇷', 'Feito no Brasil'], ['💳', 'Sem cartão']],
    rodape: RODAPE,
    emoji: '🇧🇷',
    legenda: 'Sem cartão de crédito para testar e sem letra miúda — feito pro jeito que o brasileiro realmente vive.\n\nO plano grátis já organiza o seu mês inteiro. Link na bio.',
    tags: '#appbrasileiro #financaspessoais #controlefinanceiro',
  },
  {
    n: 6, layout: 'cream', pill: '🤝 RACHAR CONTAS',
    h: 'Divide a conta |sem treta|.',
    body: 'Aluguel, mercado, jantar com os amigos — registra uma vez e o Finn calcula quanto cada um deve.',
    itens: ['Aluguel', 'Internet', 'Rodízio', 'Viagem', '+ o que quiser'],
    rodape: RODAPE,
    emoji: '🤝',
    legenda: 'Aluguel, mercado, jantar com os amigos — registra uma vez e o Finn calcula quanto cada um deve, sem planilha e sem constrangimento.',
    tags: '#financaspessoais #dividirdespesas #appfinanceiro #educacaofinanceira',
  },
  {
    n: 7, layout: 'tiles', pill: null,
    h: 'Fatura do cartão |sob controle|.',
    body: 'Acompanha os gastos em tempo real e o valor que vai fechar na fatura — sem surpresa no fim do mês.',
    itens: [['💳', 'Gasto do mês'], ['📅', 'Parcelas futuras'], ['🧾', 'Fatura estimada']],
    rodape: RODAPE,
    emoji: '💳',
    legenda: 'Acompanha os gastos do cartão em tempo real, as parcelas futuras e o valor que vai fechar na fatura — sem surpresa no fim do mês.',
    tags: '#cartaodecredito #financaspessoais #controlefinanceiro #appfinanceiro',
  },
  {
    n: 8, layout: 'laranja', pill: '🔔 NUNCA MAIS ESQUECE',
    h: 'Um aviso antes de vencer.',
    body: 'Cadastra as suas contas fixas e o Finn te avisa antes do vencimento.',
    itens: ['Contas fixas cadastradas', 'Aviso antes de vencer', 'Sem precisar lembrar sozinho'],
    rodape: RODAPE,
    emoji: '🔔',
    legenda: 'Cadastra as suas contas fixas — aluguel, internet, streaming — e recebe um aviso antes do vencimento, sem precisar lembrar sozinho.',
    tags: '#financaspessoais #appfinanceiro #controlefinanceiro #lembretes',
  },
  {
    n: 9, layout: 'hero', glow: true, pill: '🔒 PRIVACIDADE',
    h: 'Seus dados são |só seus|.',
    // A versão antiga prometia "nunca vê seu extrato" e "sem acesso de
    // terceiros". As duas eram falsas: o worker busca os lançamentos na
    // Pluggy (que é um terceiro) e guarda no banco. O que é verdade é que a
    // senha do banco nunca passa pelo Finn.
    body: 'A sua senha do banco nunca passa pelo Finn — quem conecta é a Pluggy, provedora de Open Finance.',
    itens: [['🔐', 'Senha nunca salva'], ['🚪', 'Conta só sua, com login'], ['🗑️', 'Apaga quando quiser']],
    rodape: RODAPE,
    emoji: '🔒',
    legenda: 'A sua senha do banco nunca passa pelo Finn: quem cuida da conexão é a Pluggy, provedora de Open Finance.\n\nOs seus lançamentos ficam numa conta protegida por login, e você apaga tudo quando quiser. Está escrito na política de privacidade, sem letra miúda.',
    tags: '#privacidade #seguranca #financaspessoais #appfinanceiro',
  },
  {
    n: 10, layout: 'centro', pill: null,
    h: 'Você no controle da |sua grana|.',
    // Era "Gráficos claros de pra onde o dinheiro vai" — duas preposições
    // empilhadas.
    body: 'Gráficos que mostram para onde o seu dinheiro vai, sem termo complicado — só o que ajuda a decidir.',
    itens: [['📊', 'Gráficos simples'], ['🎯', 'Metas visuais'], ['🧠', 'Análise com IA']],
    rodape: RODAPE,
    emoji: '📊',
    legenda: 'Gráficos que mostram para onde o seu dinheiro vai, mês a mês, sem termo complicado — só o que ajuda a decidir melhor.\n\nLink na bio para começar de graça.',
    tags: '#financaspessoais #controlefinanceiro #educacaofinanceira #appfinanceiro',
  },
  {
    n: 11, layout: 'tiles', glow: true, pill: '📊 RESUMO DO MÊS',
    h: 'Visão geral do mês, num só lugar.',
    body: 'Saldo, receitas e despesas — tudo num painel simples, sem precisar somar nada na mão.',
    itens: [['💰', 'Saldo atual'], ['📈', 'Receitas'], ['📉', 'Despesas']],
    rodape: RODAPE,
    emoji: '📊',
    legenda: 'Saldo, receitas e despesas — tudo num painel simples, sem precisar somar nada na mão.',
    tags: '#financaspessoais #appfinanceiro #controlefinanceiro #educacaofinanceira',
  },
  {
    n: 12, layout: 'cream', pill: '🤖 AUTOMÁTICO',
    h: 'O Finn categoriza |sozinho|.',
    body: 'Importou o extrato? Cada gasto já cai na categoria certa, sem você mexer em nada.',
    itens: ['Mercado', 'Transporte', 'Lazer', 'Saúde', '+ as suas categorias'],
    rodape: RODAPE,
    emoji: '🤖',
    legenda: 'Importou o extrato? Cada gasto já cai na categoria certa, sem você mexer em nada.',
    tags: '#financaspessoais #appfinanceiro #organizacaofinanceira #educacaofinanceira',
  },
  {
    n: 13, layout: 'laranja', pill: '🌙 DO SEU JEITO',
    h: 'Modo claro ou modo escuro.',
    body: 'Escolhe o visual que combina com você e muda quando quiser, direto nas configurações.',
    itens: ['Modo claro', 'Modo escuro', 'Muda na hora'],
    rodape: RODAPE,
    emoji: '🌙',
    legenda: 'Escolhe o visual que combina com você e muda quando quiser, direto nas configurações.',
    tags: '#appfinanceiro #financaspessoais',
  },
  {
    n: 14, layout: 'tiles', pill: null,
    h: 'Instala como |app|. Sem loja.',
    // Era "sem ocupar espaço de app de loja".
    body: 'Adiciona o Finn à tela inicial do celular em segundos — abre rápido e quase não ocupa espaço.',
    itens: [['📲', 'Ícone na tela'], ['⚡', 'Abre rápido'], ['🚫', 'Sem loja de apps']],
    rodape: RODAPE,
    emoji: '📲',
    legenda: 'Adiciona o Finn à tela inicial do celular em segundos — abre rápido e quase não ocupa espaço.',
    tags: '#appfinanceiro #financaspessoais #tecnologia',
  },
  {
    n: 15, layout: 'cream', pill: '🎯 METAS',
    // O erro que começou tudo: era "pra o que importa".
    h: 'Junta dinheiro |pro que importa|.',
    body: 'Cria uma meta, define o valor e acompanha o progresso — viagem, reserva de emergência, o que for.',
    itens: [['🏖️', 'Viagem'], ['🛟', 'Reserva de emergência'], ['🎁', 'O que você quiser']],
    rodape: RODAPE,
    emoji: '🎯',
    legenda: 'Cria uma meta, define o valor e acompanha o progresso — viagem, reserva de emergência, o que for.',
    tags: '#metasfinanceiras #financaspessoais #appfinanceiro #educacaofinanceira',
  },
  {
    n: 16, layout: 'hero', glow: true, pill: '🏦 VÁRIOS BANCOS',
    h: 'Todas as contas. Um só lugar.',
    body: 'Conecta quantos bancos usar e vê o saldo geral, sem abrir um aplicativo por vez.',
    itens: [['🏦', 'Vários bancos'], ['👁️', 'Visão única'], ['🔄', 'Sempre atualizado']],
    rodape: RODAPE,
    emoji: '🏦',
    legenda: 'Conecta quantos bancos usar e vê o saldo geral, sem abrir um aplicativo por vez.',
    tags: '#financaspessoais #appfinanceiro #controlefinanceiro',
  },
  {
    n: 17, layout: 'laranja', pill: '📈 EVOLUÇÃO',
    h: 'Veja se está gastando menos.',
    body: 'Compara mês a mês e entende se os seus hábitos estão melhorando de verdade.',
    // Era "Decisão com dado".
    itens: ['Comparação mensal', 'Gráfico de evolução', 'Decisão com dados'],
    rodape: RODAPE,
    emoji: '📈',
    legenda: 'Compara mês a mês e entende se os seus hábitos estão melhorando de verdade — com dados, não com achismo.',
    tags: '#financaspessoais #appfinanceiro #educacaofinanceira',
  },
  {
    n: 18, layout: 'tiles', pill: null,
    h: 'Começa a usar |em minutos|.',
    body: 'Sem burocracia e sem cartão de crédito para testar — cria a conta e já importa o seu extrato.',
    itens: [['⏱️', 'Minutos para começar'], ['💳', 'Sem cartão'], ['🏦', 'Extrato importado']],
    rodape: RODAPE,
    emoji: '⏱️',
    legenda: 'Sem burocracia e sem cartão de crédito para testar — cria a conta e já importa o seu extrato.',
    tags: '#financaspessoais #appfinanceiro #controlefinanceiro',
  },
  {
    n: 19, layout: 'cream', pill: '🚫 SEM ENROLAÇÃO',
    // Era "Sem anúncio chato atrapalhando." — gerúndio solto no fim.
    h: 'Sem anúncio no meio do caminho.',
    body: 'Interface limpa, focada no que interessa: entender e controlar o seu dinheiro.',
    itens: [['🧘', 'Interface limpa'], ['🎯', 'Só o essencial'], ['🚫', 'Sem pop-ups']],
    rodape: RODAPE,
    emoji: '🚫',
    legenda: 'Interface limpa, focada no que interessa: entender e controlar o seu dinheiro.',
    tags: '#financaspessoais #appfinanceiro',
  },
  {
    n: 20, layout: 'centro', pill: null,
    h: 'Bora organizar sua grana |hoje|?',
    body: 'Grupo de testers com vagas limitadas. Boas-vindas pessoais e suporte direto comigo.',
    itens: [['🔗', 'Link na bio'], ['🆓', 'Plano grátis'], ['🚀', 'Começa agora']],
    rodape: RODAPE,
    emoji: '🚀',
    legenda: 'Grupo de testers com vagas limitadas — boas-vindas pessoais e suporte direto por WhatsApp, Instagram ou e-mail.\n\nLink na bio para se inscrever.',
    tags: '#financaspessoais #appfinanceiro #controlefinanceiro #educacaofinanceira',
  },
  // ── Reposição: entram no lugar dos que saíram do feed por texto errado. ──
  // Assuntos que a campanha original não cobria, todos conferidos no código
  // antes de virar frase: as contagens do Aprender saem de APRENDER_TRILHAS
  // (10 trilhas, 40 lições, 3 áreas x 3 níveis), a ordem de quitação existe
  // mesmo (avalanche e snowball, ver simularDivida) e a previsão de data da
  // meta está no guia. Nada aqui promete o que o app não faz.
  {
    n: 21, layout: 'hero', glow: true, pill: '📚 GRÁTIS EM QUALQUER PLANO',
    h: 'Ninguém ensinou. |O Finn ensina.|',
    body: 'Trilhas de finanças, investimentos e reservas — do básico ao avançado, dentro do app, sem pagar nada.',
    btn: 'Link na bio → finn.dev.br',
    rodape: '40 lições em 10 trilhas, liberadas pra todo mundo',
    emoji: '📚',
    legenda: 'A maior parte dos brasileiros nunca teve uma aula sobre dinheiro. Eu sou um deles — e isso me incomoda.\n\nPor isso a aba Aprender é de graça pra todo mundo, em qualquer plano: 3 áreas (finanças, investimentos e reservas), 3 níveis e 40 lições em português claro.\n\nNão é indicação de investimento. É explicação, pra você decidir sozinho.',
    tags: '#educacaofinanceira #financaspessoais #investimentos #appfinanceiro',
  },
  {
    n: 22, layout: 'cream', pill: '💬 PELO WHATSAPP',
    h: 'Lança o gasto |mandando mensagem|.',
    body: 'Escreve "mercado 85" na conversa e pronto: o Finn entende o valor, a descrição e sugere a categoria.',
    itens: ['Texto', 'Áudio', 'Foto do comprovante', 'Telegram também'],
    // O bot completo é do Pro (ver a tabela de planos). Dizer que é de graça
    // seria o mesmo erro do post que teve que ser apagado.
    rodape: 'O bot completo faz parte do Pro',
    emoji: '💬',
    legenda: 'Escreve "mercado 85" na conversa e pronto: o Finn entende o valor, a descrição e sugere a categoria.\n\nFunciona com texto, áudio e foto do comprovante, no WhatsApp e no Telegram. O bot completo faz parte do Pro.',
    tags: '#whatsapp #financaspessoais #appfinanceiro #automacao',
  },
  {
    n: 23, layout: 'laranja', pill: '📗 PLANILHA FINN',
    h: 'Prefere planilha? Fiz uma que presta.',
    body: 'Nove abas prontas, com as fórmulas já montadas. Compra única de R$ 36,90, sem mensalidade.',
    itens: ['Lançamentos, metas, limites, dívidas', 'Compra única, sem mensalidade', 'Sincroniza com o app no Pro'],
    rodape: RODAPE,
    emoji: '📗',
    legenda: 'Tem gente que não larga a planilha — então fiz uma que presta.\n\nNove abas prontas e com as fórmulas montadas: lançamentos, análises, limites, metas, contas fixas, dívidas e racha.\n\nR$ 36,90, compra única, sem mensalidade. Ela funciona sozinha; a sincronização automática com o app é que faz parte do Pro.',
    tags: '#planilhafinanceira #financaspessoais #organizacaofinanceira #googlesheets',
  },
  {
    n: 24, layout: 'tiles', pill: null,
    h: 'Manda a foto. O Finn |lê o comprovante|.',
    body: 'Valor, data e estabelecimento saem da imagem e viram lançamento, sem você digitar nada.',
    itens: [['📸', 'Foto do cupom'], ['🔎', 'Lê valor e data'], ['✅', 'Vira lançamento']],
    rodape: RODAPE,
    emoji: '📸',
    legenda: 'Tirou a foto do cupom e mandou pro bot? O Finn lê valor, data e estabelecimento e cria o lançamento sozinho.\n\nServe pra quando você não quer parar pra digitar — e funciona com áudio também.',
    tags: '#financaspessoais #appfinanceiro #automacao #controlefinanceiro',
  },
  {
    n: 25, layout: 'centro', pill: null,
    h: 'O segredo é |não quebrar a sequência|.',
    body: 'Cada dia que você registra alguma coisa conta. O Finn mostra a sua sequência e as conquistas que ela destrava.',
    itens: [['🔥', 'Sequência de dias'], ['🏅', 'Conquistas'], ['📈', 'Hábito que dura']],
    rodape: RODAPE,
    emoji: '🔥',
    legenda: 'Controle financeiro não morre por falta de app. Morre quando a empolgação passa.\n\nPor isso o Finn conta a sua sequência de dias registrando e vai destravando conquistas no caminho. É bobo? É. Funciona? Também.',
    tags: '#habitos #financaspessoais #appfinanceiro #educacaofinanceira',
  },
  {
    n: 26, layout: 'cream', pill: '🛟 RESERVA DE EMERGÊNCIA',
    h: 'Imprevisto sem reserva |vira dívida|.',
    body: 'Quanto guardar, onde deixar e quando usar — tem uma trilha inteira sobre isso na aba Aprender, de graça.',
    itens: ['Quanto guardar', 'Onde deixar', 'Quando usar', '+ na aba Aprender'],
    rodape: RODAPE,
    emoji: '🛟',
    legenda: 'Pneu furado, dente quebrado, celular no chão. Sem reserva, tudo isso vira cartão de crédito — e cartão no Brasil é caro de um jeito que assusta.\n\nQuanto guardar, onde deixar e quando usar tem uma trilha inteira na aba Aprender, de graça, em qualquer plano.',
    tags: '#reservadeemergencia #educacaofinanceira #financaspessoais',
  },
  {
    n: 27, layout: 'tiles', pill: null,
    h: 'Quando você |chega na meta|?',
    body: 'Coloca um prazo e o Finn calcula a previsão de quando você chega lá, no ritmo em que está guardando hoje.',
    itens: [['🎯', 'Meta com prazo'], ['📅', 'Previsão de data'], ['📈', 'Ritmo de hoje']],
    rodape: RODAPE,
    emoji: '📅',
    legenda: 'Guardar sem saber quando chega é o jeito mais rápido de desistir.\n\nColoca um prazo na meta e o Finn calcula a previsão de quando você chega lá, considerando o ritmo em que você está guardando hoje.',
    tags: '#metasfinanceiras #planejamentofinanceiro #financaspessoais',
  },
  {
    n: 28, layout: 'laranja', pill: '📉 SAIR DO VERMELHO',
    h: 'Dívida no Brasil é cara de um jeito que assusta.',
    body: 'Simula a quitação com os juros de verdade e vê quanto muda pagando um pouco a mais por mês.',
    itens: ['Juros reais no cálculo', 'Ordem de quitação sugerida', 'Quanto adiantar muda o total'],
    rodape: RODAPE,
    emoji: '📉',
    legenda: 'O Finn simula a quitação com os juros de verdade, sugere a ordem em que sair de cada dívida e mostra quanto muda se você conseguir pagar um pouco a mais por mês.\n\nSem julgamento e sem promessa mágica — só a conta na sua frente.',
    tags: '#dividas #educacaofinanceira #financaspessoais #controlefinanceiro',
  },
  {
    n: 29, layout: 'hero', glow: true, pill: '🔔 AUTOMÁTICO',
    h: 'Resumo da semana, |sem abrir o app|.',
    body: 'Toda semana o Finn manda uma notificação avisando quanto você gastou — e se foi mais ou menos que a semana anterior.',
    itens: [['🔔', 'Toda semana'], ['📊', 'Compara com a anterior'], ['📱', 'Automático']],
    rodape: RODAPE,
    emoji: '🔔',
    legenda: 'Toda semana o Finn manda uma notificação avisando quanto você gastou — e se foi mais ou menos que a semana anterior.\n\nÉ só ativar as notificações uma vez; o resto é automático.',
    tags: '#financaspessoais #appfinanceiro #controlefinanceiro #educacaofinanceira',
  },
];

// Selo fixo de todos os stories. Era "APP FINANCEIRO 100% GRÁTIS" — a mesma
// afirmação falsa repetida vinte vezes.
const STORY_PILL = '✦ APP BRASILEIRO, COM PLANO GRÁTIS';

// Capas de reel (1080x1920, tudo centralizado).
const REELS = [
  { n: 1, h: 'Ainda organiza os gastos numa |planilha|?', btn: 'tem um jeito melhor' },
  { n: 2, h: 'Lança o gasto. A IA |categoriza| sozinha.', btn: 'o app de verdade, ao vivo' },
  { n: 3, h: 'Como eu faço uma |boa gestão| do meu dinheiro...', btn: 'Ops. Eu tenho o Finn.' },
];

// Título sem as barras de destaque — é o que entra na legenda.
function tituloLimpo(h) {
  return h.replace(/\|/g, '');
}

// Legenda completa do post: título, corpo e hashtags, no formato que o
// Instagram recebe.
function legendaDe(p) {
  return tituloLimpo(p.h).replace(/\.$/, '') + ' ' + p.emoji + '\n\n' + p.legenda + '\n\n' + p.tags;
}

module.exports = { POSTS, REELS, STORY_PILL, legendaDe, tituloLimpo };
