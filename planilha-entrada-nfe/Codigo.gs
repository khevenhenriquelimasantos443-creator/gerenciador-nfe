/**
 * CONTROLE DE ENTRADA DE NF-e (galpão)
 *
 * Como instalar e usar: veja a aba LEIA-ME (ou GUIA.md no repositório).
 *
 * Caminho de uma nota:
 *   1. XML e PDF (DANFE) da nota na pasta de notas da rede. O script enviar-notas.ps1, agendado num PC da
 *      rede, manda uma cópia de cada arquivo novo para o app da Web desta planilha (doPost), que guarda
 *      a cópia na pasta "NF-e Galpão" do Drive (uma subpasta por mês)
 *   2. atualizarNotas: o XML vira uma linha na aba NOTAS (nº e razão social, emissão, valor, vencimentos
 *      dos boletos); o PDF é ligado à nota pela chave de acesso
 *      (no nome do arquivo ou dentro do PDF) ou pelo número da nota no nome do arquivo
 *   3. Quem recebe a mercadoria muda o Status da entrada; COM PROBLEMA exige um motivo
 * Os arquivos não saem do lugar: a planilha só lê a pasta.
 */

// ===========================================================================
// Abas, colunas e parâmetros
// ===========================================================================

var ABA = {
  LEIAME: 'LEIA-ME',
  NOTAS: 'NOTAS',
  CONFIG: 'CONFIG',
  ARQ: 'ARQUIVOS',
  RECEBIDOS: 'RECEBIDOS',
  LOG: 'LOG'
};

var CAB = {
  NOTAS: ['Nº NFE', 'PDF', 'FORNECEDOR', 'RAZÃO SOCIAL COMPRA', 'EMISSÃO', 'VALOR NFE', '1º VENCIMENTO',
          'ENTRADA GALPÃO', 'STATUS ENTRADA', 'MOTIVO DA NÃO ENTRADA', 'OBSERVAÇÃO', 'CHAVE DE ACESSO', 'XML'],
  ARQ: ['ID do arquivo', 'Nome', 'Tipo', 'Chave de acesso', 'Situação', 'Visto em'],
  LOG: ['Data/hora', 'Arquivo', 'Situação', 'Mensagem'],
  RECEBIDOS: ['Conteúdo (MD5)', 'Nome', 'Caminho na rede', 'ID no Drive', 'Recebido em']
};

// colunas da aba NOTAS (1 = A)
var COL = { NUM: 1, PDF: 2, FORN: 3, COMPRADOR: 4, EMISSAO: 5, VALOR: 6, BOLETOS: 7, LANC: 8,
            STATUS: 9, MOTIVO: 10, OBS: 11, CHAVE: 12, XML: 13 };
// cabeçalhos de versões anteriores, convertidas sozinhas para o formato atual:
// nº e razão social juntos na coluna A; coluna J separada para a data da entrada
var CAB_ANTIGO_A = 'Nota fiscal (nº e razão social)';
var CAB_ANTIGO_ENTRADA = 'Data da entrada no galpão';
var CAB_ANTIGO_CNPJ = 'CNPJ do comprador (nosso)'; // coluna tirada; o CNPJ -> razão social fica guardado no script
// PDF sem XML (pedido de compra, nota de serviço...): entra mesmo assim, com esta observação
// Versões anteriores escreviam na OBSERVAÇÃO se a linha era "só PDF"; agora isso fica na aba ARQUIVOS
// (situação do PDF) e a OBSERVAÇÃO é só de quem usa a planilha. As marcas antigas são apagadas sozinhas.
var OBS_SO_PDF = 'Só PDF, sem XML (ex.: pedido de compra)';
// depois de ler os dados do próprio PDF (pelo Google Drive), a observação diz como foi
var OBS_PDF_LIDO = 'Só PDF, sem XML: dados lidos do PDF (confira)';
var OBS_PDF_ILEGIVEL = 'Só PDF, sem XML: não deu para ler os dados do PDF';
function ehSoPdf(obs) { return String(obs).indexOf('Só PDF, sem XML') === 0; }
// situação do PDF sem XML na aba ARQUIVOS: entrou como linha própria e ainda falta ler os dados / já leu
var SIT_SO_PDF = 'SÓ PDF', SIT_PDF_LIDO = 'SÓ PDF - LIDO', SIT_PDF_ILEGIVEL = 'SÓ PDF - ILEGÍVEL';
// muda quando o formato da aba NOTAS muda (status novo, cores...): a próxima atualização reaplica tudo
var FORMATO_NOTAS = '2026-10-09';

var STATUS = ['AGUARDANDO', 'ENTRADA OK', 'COM PROBLEMA', 'BONIFICAÇÃO'];
var MOTIVO_OUTRO = 'Outro (descreva na Observação)';
var MOTIVOS = ['Quantidade diferente da nota', 'Produto faltando', 'Produto avariado ou vencido',
               'Produto errado ou não pedido', 'Preço diferente do pedido', 'Prazo ou vencimento diferente do combinado',
               'Nota com erro (dados, impostos ou CFOP)', 'Mercadoria não chegou', 'Nota cancelada pelo fornecedor',
               MOTIVO_OUTRO];
var COR = { 'AGUARDANDO': '#fef9c3', 'ENTRADA OK': '#dcfce7', 'COM PROBLEMA': '#fee2e2', 'BONIFICAÇÃO': '#9fc5e8', // azul-claro 2
            FALTA: '#f87171' };
var SEM_PDF = 'aguardando PDF';
var SEM_CHAVE = 'sem chave no PDF';
// tempo de cada atualização (o Google para tudo em 6 min): até aqui lê arquivos novos, até ali abre PDFs;
// o resto é gravar. O que sobrar fica para a próxima atualização.
var LIMITE_LEITURA = 150000, LIMITE_PDF = 240000;
var LIMITE_DADOS_PDF = 270000;  // até aqui ainda começa a ler os dados de um PDF sem XML (cada um leva uns segundos)
var LIMITE_TAMANHO_PDF = 3000000; // DANFE costuma ter menos de 500 KB; maior que isso não vale abrir

var CONFIG_ITENS = [
  ['Pasta das notas (link ou ID)', '', 'Pasta do Drive onde fica a cópia do XML e do PDF de cada nota. Vazio: o script cria "NF-e Galpão".'],
  ['Chave do envio', '', 'Senha que o enviar-notas.ps1 usa para mandar arquivos. Criada sozinha; copie para o script do PC.'],
  ['Horário da atualização automática', '07-20', 'Fora desse horário a atualização automática (a cada 15 min) não roda. Ex.: 07-20 = das 07:00 às 20:00.']
];
var CONFIG_OBSOLETOS = ['Avisar vencimento com quantos dias'];

// ===========================================================================
// Menu e automação
// ===========================================================================

function onOpen() {
  SpreadsheetApp.getUi().createMenu('NF-e')
    .addItem('Atualizar agora (ler a pasta)', 'atualizarNotas')
    .addSeparator()
    .addItem('Ligar atualização automática (a cada 15 min)', 'ativarAutomatico')
    .addItem('Desligar atualização automática', 'desativarAutomatico')
    .addItem('Configurar planilha (abas e pasta)', 'configurarPlanilha')
    .addItem('Refazer os links de PDF e XML (se algum estiver na nota errada)', 'refazerLinksAgora')
    .addItem('Ver a chave e como pegar o link para o script do PC', 'mostrarDadosDoEnvio')
    .addToUi();
}

function ativarAutomatico() {
  desativarAutomatico();
  ScriptApp.newTrigger('atualizarNotasAutomatico').timeBased().everyMinutes(15).create();
  aviso('Atualização automática ligada: a cada 15 minutos, no horário de CONFIG (' + (lerConfig().horario || '07-20') + ').');
}

function desativarAutomatico() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'atualizarNotasAutomatico') ScriptApp.deleteTrigger(t);
  });
}

function atualizarNotasAutomatico() {
  if (!dentroDoHorario()) return;
  atualizarNotas(true);
}

// "07-20" em CONFIG: das 07:00 às 20:00, no fuso da planilha
function dentroDoHorario() {
  var faixa = String(lerConfig().horario || '07-20').match(/(\d{1,2})\D+(\d{1,2})/);
  if (!faixa) return true;
  var hora = Number(Utilities.formatDate(new Date(), planilha().getSpreadsheetTimeZone(), 'H'));
  return hora >= Number(faixa[1]) && hora < Number(faixa[2]);
}

// ===========================================================================
// Estrutura
// ===========================================================================

function configurarPlanilha() {
  var ss = planilha();
  PropertiesService.getScriptProperties().setProperty('PLANILHA_ID', ss.getId()); // para o app da Web
  prepararConfig();
  if (!lerConfig().token) gravarConfig('Chave do envio', Utilities.getUuid());
  var notas = garantirAba(ss, ABA.NOTAS, CAB.NOTAS);
  formatoAtual(notas);
  var col = function (c) { return notas.getRange(2, c, notas.getMaxRows() - 1, 1); };
  col(COL.NUM).setNumberFormat('@'); col(COL.CHAVE).setNumberFormat('@');
  col(COL.EMISSAO).setNumberFormat('dd/mm/yyyy'); col(COL.BOLETOS).setNumberFormat('dd/mm/yyyy');
  col(COL.VALOR).setNumberFormat('R$ #,##0.00'); col(COL.LANC).setNumberFormat('dd/mm/yyyy hh:mm');
  col(COL.BOLETOS).setWrap(false);
  [[COL.NUM, 90], [COL.PDF, 100], [COL.FORN, 300], [COL.COMPRADOR, 300], [COL.EMISSAO, 100],
   [COL.VALOR, 110], [COL.BOLETOS, 120], [COL.LANC, 150], [COL.STATUS, 130], [COL.MOTIVO, 260],
   [COL.OBS, 280], [COL.CHAVE, 330], [COL.XML, 60]].forEach(function (c) { notas.setColumnWidth(c[0], c[1]); });
  notas.getRange(1, 1, 1, CAB.NOTAS.length).setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff').setWrap(true);
  notas.getRange(1, COL.STATUS, 1, 3).setBackground('#b45309');
  validacoesNotas(notas);
  regrasDeCor(notas);
  boletosNoFormatoNovo(notas);
  compradoresPadronizados(notas);
  fornecedoresMaiusculos(notas);
  ordenarNotas(notas);

  var arq = garantirAba(ss, ABA.ARQ, CAB.ARQ);
  arq.getRange(1, 1, 1, CAB.ARQ.length).setValues([CAB.ARQ]);
  arq.getRange('F2:F').setNumberFormat('dd/mm/yyyy hh:mm');
  var rec = garantirAba(ss, ABA.RECEBIDOS, CAB.RECEBIDOS);
  rec.getRange('E2:E').setNumberFormat('dd/mm/yyyy hh:mm');
  rec.setColumnWidth(2, 300); rec.setColumnWidth(3, 420);
  var log = garantirAba(ss, ABA.LOG, CAB.LOG);
  log.getRange(1, 1, 1, CAB.LOG.length).setValues([CAB.LOG]);
  log.getRange('A2:A').setNumberFormat('dd/mm/yyyy hh:mm');
  log.setColumnWidth(2, 300); log.setColumnWidth(4, 600);
  escreverLeiaMe(garantirAba(ss, ABA.LEIAME));

  // versão anterior tinha a aba VENCIMENTOS: não é mais usada
  var velha = ss.getSheetByName('VENCIMENTOS');
  if (velha) ss.deleteSheet(velha);

  var pasta = garantirPasta();
  [ABA.LEIAME, ABA.NOTAS, ABA.CONFIG, ABA.ARQ, ABA.RECEBIDOS, ABA.LOG].forEach(function (nome, i) {
    ss.setActiveSheet(ss.getSheetByName(nome)); ss.moveActiveSheet(i + 1);
  });
  var padrao = ss.getSheetByName('Página1') || ss.getSheetByName('Sheet1');
  if (padrao && padrao.getLastRow() === 0) ss.deleteSheet(padrao);
  ss.setActiveSheet(ss.getSheetByName(ABA.NOTAS));
  aviso('Planilha pronta. Cópias das notas vão para a pasta "' + pasta.getName() + '" do Drive. ' +
    'Falta implantar o app da Web e configurar o script do PC (veja o LEIA-ME).', 15);
}

// ini e n: só essas linhas (padrão: a aba toda)
function validacoesNotas(sh, ini, n) {
  ini = ini || 2;
  n = n || sh.getMaxRows() - 1;
  sh.getRange(ini, COL.STATUS, n, 1).setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUS, true).setAllowInvalid(false).build());
  sh.getRange(ini, COL.MOTIVO, n, 1).setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(MOTIVOS, true).setAllowInvalid(false)
    .setHelpText('Escolha o motivo. Se não estiver na lista, use "' + MOTIVO_OUTRO + '" e explique na Observação.').build());
}

// Cores pela formatação condicional: mudam na hora em que o status é trocado, sem esperar o script
function regrasDeCor(sh) {
  var n = sh.getMaxRows() - 1, linha = sh.getRange(2, 1, n, CAB.NOTAS.length);
  var st = '$' + letraColuna(COL.STATUS) + '2', mo = '$' + letraColuna(COL.MOTIVO) + '2', ob = '$' + letraColuna(COL.OBS) + '2';
  var regra = function (faixa, formula, cor) {
    return SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(formula).setBackground(cor).setRanges([faixa]).build();
  };
  // a primeira regra que bate vale: as de "falta informação" vêm antes da cor da linha
  sh.setConditionalFormatRules([
    regra(sh.getRange(2, COL.MOTIVO, n, 1), '=(' + st + '="COM PROBLEMA")*(' + mo + '="")', COR.FALTA),
    regra(sh.getRange(2, COL.OBS, n, 1), '=(' + mo + '="' + MOTIVO_OUTRO + '")*(' + ob + '="")', COR.FALTA),
    regra(linha, '=' + st + '="ENTRADA OK"', COR['ENTRADA OK']),
    regra(linha, '=' + st + '="COM PROBLEMA"', COR['COM PROBLEMA']),
    regra(linha, '=' + st + '="AGUARDANDO"', COR['AGUARDANDO']),
    regra(linha, '=' + st + '="BONIFICAÇÃO"', COR['BONIFICAÇÃO'])
  ]);
}

// Deixa a aba NOTAS no formato atual (converte as versões anteriores) e garante as cores automáticas
function formatoAtual(sh) {
  var lerCab = function () { return sh.getRange(1, 1, 1, sh.getMaxColumns()).getValues()[0].map(String); };
  var cab = lerCab();
  var mudou = false;
  if (cab[0] === CAB_ANTIGO_A) { migrarNotasAntigas(sh); mudou = true; }
  else if (cab.indexOf(CAB_ANTIGO_ENTRADA) >= 0) { sh.deleteColumn(cab.indexOf(CAB_ANTIGO_ENTRADA) + 1); mudou = true; }
  cab = lerCab();
  var k = cab.indexOf(CAB_ANTIGO_CNPJ);
  if (k >= 0) {
    // antes de apagar a coluna do CNPJ, guarda CNPJ -> razão social (para ler o comprador dos PDFs sem XML)
    var n = sh.getLastRow() - 1;
    if (n > 0) sh.getRange(2, k, n, 2).getValues().forEach(function (r) { lembrarComprador(r[1], r[0]); });
    gravarCompradores();
    sh.deleteColumn(k + 1);
    mudou = true;
    cab = lerCab();
  }
  if (mudou || cab.slice(0, CAB.NOTAS.length).join('|') !== CAB.NOTAS.join('|')) {
    sh.getRange(1, 1, 1, CAB.NOTAS.length).setValues([CAB.NOTAS]);
    sh.getRange(2, COL.BOLETOS, sh.getMaxRows() - 1, 1).setNumberFormat('dd/mm/yyyy');
    sh.getRange(2, COL.LANC, sh.getMaxRows() - 1, 1).setNumberFormat('dd/mm/yyyy');
    sh.getRange(2, 1, sh.getMaxRows() - 1, CAB.NOTAS.length).setBackground(null); // cor agora vem das regras
    regrasDeCor(sh);
  } else if (!sh.getConditionalFormatRules().length) {
    regrasDeCor(sh);
  }
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty('FORMATO_NOTAS') !== FORMATO_NOTAS) {
    validacoesNotas(sh);   // lista do status com BONIFICAÇÃO em todas as linhas
    regrasDeCor(sh);
    tirarMarcasDaObservacao(sh);
    refazerLinks(sh); // a ordenação de 08/10 deixou links de PDF/XML em linhas trocadas
    props.setProperty('FORMATO_NOTAS', FORMATO_NOTAS);
  }
}

// Marcas "Só PDF, sem XML..." que versões anteriores escreviam na OBSERVAÇÃO: passam para a situação do PDF na
// aba ARQUIVOS e somem da OBSERVAÇÃO
function tirarMarcasDaObservacao(sh) {
  var n = sh.getLastRow() - 1;
  if (n < 1) return;
  var obs = sh.getRange(2, COL.OBS, n, 1).getValues();
  if (!obs.some(function (r) { return ehSoPdf(r[0]); })) return;
  var links = sh.getRange(2, COL.PDF, n, 1).getRichTextValues(), situacao = {};
  obs.forEach(function (r, i) {
    if (!ehSoPdf(r[0])) return;
    var url = links[i][0] && links[i][0].getLinkUrl ? links[i][0].getLinkUrl() : '';
    var id = (String(url || '').match(/\/d\/([^\/?#]+)/) || [])[1];
    if (id) situacao[id] = r[0] === OBS_PDF_LIDO ? SIT_PDF_LIDO : r[0] === OBS_PDF_ILEGIVEL ? SIT_PDF_ILEGIVEL : SIT_SO_PDF;
    r[0] = '';
  });
  sh.getRange(2, COL.OBS, n, 1).setValues(obs);
  var arq = planilha().getSheetByName(ABA.ARQ), nA = arq.getLastRow() - 1;
  if (nA < 1) return;
  var v = arq.getRange(2, 1, nA, 5).getValues(), mudou = false;
  v.forEach(function (r) { if (situacao[r[0]] && r[4] !== situacao[r[0]]) { r[4] = situacao[r[0]]; mudou = true; } });
  if (mudou) arq.getRange(2, 5, nA, 1).setValues(v.map(function (r) { return [r[4]]; }));
}

function garantirAba(ss, nome, cab) {
  var sh = ss.getSheetByName(nome);
  if (sh) return sh;
  sh = ss.insertSheet(nome);
  if (cab) {
    sh.getRange(1, 1, 1, cab.length).setValues([cab])
      .setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff').setWrap(true);
    sh.setFrozenRows(1);
  }
  return sh;
}

function prepararConfig() {
  var ss = planilha();
  var sh = ss.getSheetByName(ABA.CONFIG);
  if (!sh) {
    sh = garantirAba(ss, ABA.CONFIG, ['Parâmetro', 'Valor', 'Explicação']);
    sh.setColumnWidth(1, 280); sh.setColumnWidth(2, 320); sh.setColumnWidth(3, 620);
  }
  var tem = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues().map(function (r) { return String(r[0]).trim(); }) : [];
  for (var i = tem.length - 1; i >= 0; i--) if (CONFIG_OBSOLETOS.indexOf(tem[i]) >= 0) { sh.deleteRow(i + 2); tem.splice(i, 1); }
  var faltam = CONFIG_ITENS.filter(function (c) { return tem.indexOf(c[0]) < 0; });
  if (faltam.length) sh.getRange(sh.getLastRow() + 1, 1, faltam.length, 3).setValues(faltam);
  return sh;
}

function lerConfig() {
  var sh = prepararConfig();
  var p = {};
  sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues().forEach(function (r) { p[String(r[0]).trim()] = r[1]; });
  return {
    pasta: idDoDrive(p['Pasta das notas (link ou ID)']),
    token: String(p['Chave do envio'] == null ? '' : p['Chave do envio']).trim(),
    horario: String(p['Horário da atualização automática'] == null ? '' : p['Horário da atualização automática']).trim()
  };
}

function gravarConfig(rotulo, valor) {
  var sh = prepararConfig();
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < v.length; i++) if (String(v[i][0]).trim() === rotulo) { sh.getRange(i + 2, 2).setValue(valor); return; }
}

// Link de pasta/arquivo do Drive ou ID -> ID
function idDoDrive(s) {
  s = String(s == null ? '' : s).trim();
  var m = s.match(/\/folders\/([\w-]{10,})/) || s.match(/[?&]id=([\w-]{10,})/) || s.match(/\/d\/([\w-]{10,})/);
  return m ? m[1] : s;
}

function garantirPasta() {
  var cfg = lerConfig();
  if (cfg.pasta) { try { return DriveApp.getFolderById(cfg.pasta); } catch (e) {} }
  var it = DriveApp.getFoldersByName('NF-e Galpão');
  var pasta = it.hasNext() ? it.next() : DriveApp.createFolder('NF-e Galpão');
  gravarConfig('Pasta das notas (link ou ID)', pasta.getId());
  return pasta;
}

function escreverLeiaMe(sh) {
  var t = [
    ['CONTROLE DE ENTRADA DE NF-e - COMO USAR'],
    [''],
    ['TODO DIA'],
    ['1. Salve o XML e o PDF (DANFE) de cada nota na pasta de notas da rede, como sempre.'],
    ['   O enviar-notas.ps1 (agendado num PC da rede) manda uma cópia para a pasta "NF-e Galpão" do Drive a cada 15 minutos.'],
    ['2. Em até 15 minutos (ou NF-e > Atualizar agora) a nota aparece na aba NOTAS, com o status em branco.'],
    ['   As notas mais recentes (pela emissão) ficam em cima.'],
    ['3. Quando a mercadoria chegar, mude o Status da entrada:'],
    ['   ENTRADA OK: a mercadoria entrou (a data de entrada é a data do lançamento na planilha).'],
    ['   COM PROBLEMA: escolha o Motivo (obrigatório; a célula fica vermelha até ter motivo).'],
    ['   BONIFICAÇÃO: mercadoria de bonificação (a linha fica azul).'],
    ['   Motivo "Outro": explique na Observação (fica vermelha até ter explicação).'],
    [''],
    ['O QUE A PLANILHA PREENCHE SOZINHA'],
    ['Nº da NF-e, link do PDF, fornecedor, razão social da compra (nossa), emissão, valor, 1º vencimento'],
    ['(nota sem boleto: em branco), data do lançamento, chave e link do XML.'],
    [''],
    ['PDF DA NOTA'],
    ['O PDF é ligado à nota pela chave de acesso (no nome do arquivo ou escrita dentro do PDF) ou pelo número da nota'],
    ['no nome do arquivo (ex.: "NF 289804.pdf"). Enquanto não acha, a coluna PDF mostra "aguardando PDF".'],
    ['PDF sem XML (pedido de compra, por exemplo) também entra, com o nome do arquivo no lugar do fornecedor.'],
    ['Se o XML chegar depois, ele completa essa mesma linha (pela chave ou pelo número da nota).'],
    [''],
    ['ABAS DO SCRIPT'],
    ['ARQUIVOS: cada arquivo da pasta do Drive já lido. RECEBIDOS: cada arquivo que veio do PC (evita cópia repetida).'],
    ['LOG: o que aconteceu em cada atualização. Não apague ARQUIVOS nem RECEBIDOS.'],
    ['Os arquivos da rede nunca são movidos nem apagados: vai só uma cópia.']
  ];
  sh.clear();
  sh.getRange(1, 1, t.length, 1).setValues(t);
  sh.setColumnWidth(1, 1000);
  sh.getRange('A1').setFontSize(14).setFontWeight('bold');
  t.forEach(function (l, i) {
    if (i > 0 && /^[A-ZÇÃÕÉÍÓÚ ()\-]+$/.test(l[0]) && l[0].length > 3) sh.getRange(i + 1, 1).setFontWeight('bold').setBackground('#e5e7eb');
  });
}

// ===========================================================================
// Envio pelo PC da rede (app da Web): recebe a cópia de cada arquivo e guarda no Drive
// ===========================================================================

// O enviar-notas.ps1 manda {token, acao: 'arquivo', nome, caminho, conteudo (base64)} para cada arquivo
// novo e, no fim, {token, acao: 'processar'} para criar as notas e ligar os PDFs.
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var cfg = lerConfig();
    if (!cfg.token || d.token !== cfg.token) return resposta({ ok: false, erro: 'chave do envio errada (veja CONFIG > Chave do envio)' });
    if (d.acao === 'processar') return resposta({ ok: true, resumo: atualizarNotas(true) || '' });
    if (d.acao === 'arquivo') return resposta(receberArquivo(d, cfg));
    if (d.acao === 'arquivos') return resposta(receberLote(d.arquivos || [], cfg));
    return resposta({ ok: false, erro: 'ação desconhecida: ' + d.acao });
  } catch (err) {
    return resposta({ ok: false, erro: String(err && err.message || err) });
  }
}

// Abrir o link do app da Web no navegador só mostra que ele está no ar
function doGet() {
  return ContentService.createTextOutput('Controle de entrada de NF-e: envio no ar.');
}

function resposta(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Vários arquivos num pedido só: guarda todos e já cria as notas (sem esperar um pedido "processar")
function receberLote(lista, cfg) {
  var resultados = lista.map(function (d) {
    try { return receberArquivo(d, cfg); } catch (e) { return { ok: false, erro: String(e && e.message || e) }; }
  });
  var resumo = '';
  if (resultados.some(function (r) { return r.situacao === 'salvo'; })) {
    try { resumo = atualizarNotas(true) || ''; } catch (e) { resumo = 'erro ao criar as notas: ' + (e && e.message || e); }
  }
  return { ok: true, resultados: resultados, resumo: resumo };
}

// Conteúdo dos XMLs recebidos nesta execução: a atualização usa direto, sem baixar de novo do Drive
var XML_RECEBIDO = {};
var PASTA_DO_MES = null;
var HASHES_RECEBIDOS = null;

function receberArquivo(d, cfg) {
  var tipo = tipoArquivo(d.nome, '');
  if (!tipo) return { ok: true, situacao: 'ignorado (não é XML nem PDF)' };
  var bytes = Utilities.base64Decode(d.conteudo);
  var md5 = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, bytes).map(function (b) {
    return ((b + 256) % 256).toString(16).replace(/^(.)$/, '0$1');
  }).join('');
  // trava própria do recebimento (da planilha), separada da trava da atualização: receber arquivo não espera
  // a planilha terminar de criar as notas
  var lock = (LockService.getDocumentLock && LockService.getDocumentLock()) || LockService.getScriptLock();
  lock.waitLock(60000);
  try {
    var sh = planilha().getSheetByName(ABA.RECEBIDOS);
    if (!HASHES_RECEBIDOS) {
      HASHES_RECEBIDOS = {};
      var n = sh.getLastRow();
      if (n > 1) sh.getRange(2, 1, n - 1, 1).getValues().forEach(function (r) { HASHES_RECEBIDOS[r[0]] = 1; });
    }
    if (HASHES_RECEBIDOS[md5]) return { ok: true, situacao: 'já recebido' };
    var destino = PASTA_DO_MES;
    if (!destino) {
      var pasta = cfg.pasta ? DriveApp.getFolderById(cfg.pasta) : garantirPasta();
      var mes = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM');
      var it = pasta.getFoldersByName(mes);
      destino = PASTA_DO_MES = it.hasNext() ? it.next() : pasta.createFolder(mes);
    }
    var arq = destino.createFile(Utilities.newBlob(bytes, tipo === 'XML' ? 'text/xml' : 'application/pdf', d.nome));
    anexar(ABA.RECEBIDOS, [[md5, d.nome, d.caminho || '', arq.getId(), new Date()]]);
    HASHES_RECEBIDOS[md5] = 1;
    if (tipo === 'XML') XML_RECEBIDO[arq.getId()] = Utilities.newBlob(bytes).getDataAsString('UTF-8');
    return { ok: true, situacao: 'salvo' };
  } finally {
    lock.releaseLock();
  }
}

function mostrarDadosDoEnvio() {
  SpreadsheetApp.getUi().alert('Dados para o enviar-notas.ps1',
    'Chave do envio ($Token):\n' + lerConfig().token +
    '\n\nLink do app da Web ($Url): no Apps Script, Implantar > Gerenciar implantações > clique na implantação ' +
    'do tipo App da Web > copie a URL inteira (começa com https://script.google.com/macros/s/ e termina em /exec).' +
    '\n\nPara conferir: abra a URL numa janela anônima do navegador. Deve aparecer ' +
    '"Controle de entrada de NF-e: envio no ar."', SpreadsheetApp.getUi().ButtonSet.OK);
}

// Planilha desta conta: a ativa ou, no app da Web, a guardada no Configurar planilha
function planilha() {
  var ss = SpreadsheetApp.getActive();
  if (ss) return ss;
  return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('PLANILHA_ID'));
}

function aviso(msg, seg) {
  try { planilha().toast(msg, 'NF-e', seg || 10); } catch (e) {}
}

// ===========================================================================
// Atualização: lê a pasta, cria as notas novas e liga os PDFs
// ===========================================================================

function atualizarNotas(silencioso) {
  silencioso = silencioso === true;
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(silencioso ? 60000 : 1000)) {
    if (!silencioso) aviso('Já tem uma atualização em andamento.');
    return;
  }
  var inicio = Date.now();
  try {
    var ss = planilha();
    if (!ss.getSheetByName(ABA.NOTAS)) configurarPlanilha();
    // planilha ainda no formato antigo (nº e razão social juntos): converte antes, senão as notas duplicariam
    var abaNotas = ss.getSheetByName(ABA.NOTAS);
    formatoAtual(abaNotas);
    boletosNoFormatoNovo(abaNotas);
    var cfg = lerConfig();
    var pasta = cfg.pasta ? cfg.pasta : garantirPasta().getId();
    var arquivos = listarArquivos(pasta);
    var reg = lerRegistro();
    var notas = lerNotas();
    var log = [], novasNotas = [], novosReg = [], completadas = [], agora = new Date(), faltou = 0, faltouXml = false;

    // XMLs novos: baixa vários de uma vez (em paralelo), em vez de um por um
    var conteudos = baixarVarios(arquivos.filter(function (a) {
      return a.tipo === 'XML' && !reg.porId[a.id] && !XML_RECEBIDO[a.id];
    }).map(function (a) { return a.id; }), inicio + LIMITE_LEITURA);

    arquivos.forEach(function (a) {
      if (reg.porId[a.id]) return;
      if (a.tipo === 'XML' && !XML_RECEBIDO[a.id] && conteudos[a.id] === undefined) { faltou++; faltouXml = true; return; } // fica para a próxima
      if (a.tipo === 'XML') {
        var x = null, erro = '';
        try { x = lerXmlControle(XML_RECEBIDO[a.id] || conteudos[a.id] || DriveApp.getFileById(a.id).getBlob().getDataAsString('UTF-8')); }
        catch (e) { erro = String(e && e.message || e); }
        if (!x || !x.chave) {
          novosReg.push([a.id, a.nome, 'XML', '', 'IGNORADO', agora]);
          log.push([agora, a.nome, 'IGNORADO', erro || 'XML não é de NF-e (pode ser evento, CT-e ou nota cancelada).']);
          return;
        }
        var ja = notas.porChave[x.chave] || soPdfPeloNumero(x.numero, notas.lista);
        if (ja && ja.soPdf) {
          ja.soPdf = false; ja.xml = true; ja.linkXml = a.id; ja.chave = x.chave; notas.porChave[x.chave] = ja;
          completadas.push({ ref: ja, x: x });
          novosReg.push([a.id, a.nome, 'XML', x.chave, 'OK', agora]);
          log.push([agora, a.nome, 'OK', 'Nota ' + x.numero + ': XML completou a linha que só tinha o PDF.']);
          return;
        }
        if (ja) {
          if (!ja.xml) { ja.linkXml = a.id; ja.xml = true; }
          novosReg.push([a.id, a.nome, 'XML', x.chave, 'DUPLICADO', agora]);
          log.push([agora, a.nome, 'DUPLICADO', 'Nota ' + x.numero + ' já estava na planilha.']);
          return;
        }
        var nova = { chave: x.chave, numero: x.numero, xml: true, linkXml: a.id, pdf: false, nova: true };
        notas.porChave[x.chave] = nova;
        notas.lista.push(nova);
        novasNotas.push({ ref: nova, valores: linhaDaNota(x, agora) });
        novosReg.push([a.id, a.nome, 'XML', x.chave, 'OK', agora]);
        log.push([agora, a.nome, 'OK', 'Nota ' + x.numero + ' | ' + x.fornecedor + ' | ' + real(x.valor) +
          (x.dups.length ? ' | ' + x.dups.length + ' boleto(s)' : x.bonificacao ? ' | bonificação' : ' | sem boleto no XML')]);
      } else {
        // abrir o PDF é lento: aqui só a chave no nome; número da nota e texto do PDF ficam para a ligação abaixo
        novosReg.push([a.id, a.nome, 'PDF', chaveNoNome(a.nome), 'PENDENTE', agora]);
      }
    });

    // PDFs ainda sem nota (os novos e os que estavam esperando o XML)
    var pdfs = reg.pendentes.concat(novosReg.filter(function (r) { return r[2] === 'PDF'; }).map(function (r) {
      return { linha: 0, r: r };
    }));
    var ligados = 0, paraAbrir = [];
    var ligar = function (p, nota) {
      var r = p.r;
      if (nota.pdf) { r[4] = 'DUPLICADO'; log.push([agora, r[1], 'DUPLICADO', 'A nota ' + nota.numero + ' já tinha PDF.']); return; }
      nota.pdf = true; nota.linkPdf = r[0]; r[3] = nota.chave; r[4] = 'OK'; ligados++;
      log.push([agora, r[1], 'OK', 'PDF ligado à nota ' + nota.numero + '.']);
    };
    pdfs.forEach(function (p) {
      var r = p.r, chave = /^\d{44}$/.test(r[3]) ? r[3] : '';
      var nota = chave ? notas.porChave[chave] : notaPeloNumero(r[1], notas.lista);
      if (nota) return ligar(p, nota);
      var mesma = !chave && notaPeloNumero(r[1], notas.lista, true);
      if (mesma) { r[4] = 'DUPLICADO'; log.push([agora, r[1], 'DUPLICADO', 'A nota ' + mesma.numero + ' já tinha PDF.']); return; }
      if (!chave && r[3] !== SEM_CHAVE) paraAbrir.push(p);
    });

    // grava já o que foi feito: se o Google cortar a execução abrindo um PDF, isto não se perde
    gravarNotas(notas, novasNotas, completadas);
    gravarRegistro(reg, novosReg, pdfs);
    if (log.length) anexar(ABA.LOG, log);

    // sem chave no nome nem número que bata: procura a chave escrita dentro do PDF (uma vez só por arquivo)
    var abertos = 0;
    paraAbrir.forEach(function (p) {
      if (Date.now() - inicio > LIMITE_PDF || !p.linha) return;
      var r = p.r, shArq = ss.getSheetByName(ABA.ARQ);
      r[3] = SEM_CHAVE;
      shArq.getRange(p.linha, 4).setValue(SEM_CHAVE); // marca antes: um PDF problemático não trava as próximas
      SpreadsheetApp.flush();
      abertos++;
      try {
        var bytes = DriveApp.getFileById(r[0]).getBlob().getBytes();
        if (bytes.length <= LIMITE_TAMANHO_PDF) r[3] = chaveDentroDoPdf(bytes, notas.porChave) || SEM_CHAVE;
      } catch (e) {}
      var nota = r[3] !== SEM_CHAVE && notas.porChave[r[3]];
      if (!nota) return;
      var antes = log.length;
      ligar(p, nota);
      shArq.getRange(p.linha, 4, 1, 2).setValues([[r[3], r[4]]]);
      if (r[4] === 'OK') ss.getSheetByName(ABA.NOTAS).getRange(nota.linha, COL.PDF).setRichTextValue(link('Abrir PDF', r[0]));
      anexar(ABA.LOG, log.slice(antes));
    });
    var naoAbertos = paraAbrir.length - abertos;
    if (naoAbertos) faltou += naoAbertos;

    // PDF que já foi lido e não achou nota (pedido de compra, nota sem XML...): entra como linha própria
    // (se ficaram XMLs para a próxima, espera: o XML deste PDF pode estar entre eles)
    var soPdf = faltouXml ? [] : pdfs.filter(function (p) { return p.r[4] === 'PENDENTE' && p.linha && p.r[3] !== ''; });
    if (soPdf.length) {
      var linhasPdf = soPdf.map(function (p) {
        var nota = linhaSoPdf(p.r, agora);
        nota.ref = { chave: /^\d{44}$/.test(p.r[3]) ? p.r[3] : '', numero: String(nota.valores[COL.NUM - 1]),
                     pdf: true, xml: false, soPdf: true, linkPdf: p.r[0], nova: true };
        notas.lista.push(nota.ref);
        if (nota.ref.chave) notas.porChave[nota.ref.chave] = nota.ref;
        return nota;
      });
      gravarNotas(notas, linhasPdf);
      var shArq2 = ss.getSheetByName(ABA.ARQ);
      soPdf.forEach(function (p) { p.r[4] = SIT_SO_PDF; shArq2.getRange(p.linha, 5).setValue(SIT_SO_PDF); });
      anexar(ABA.LOG, soPdf.map(function (p) { return [agora, p.r[1], 'SÓ PDF', 'PDF sem XML: entrou como linha própria na aba NOTAS.']; }));
    }
    gravarCompradores();
    var lidosDoPdf = dadosDosPdfsSemXml(abaNotas, inicio + LIMITE_DADOS_PDF);
    compradoresPadronizados(abaNotas);
    fornecedoresMaiusculos(abaNotas);
    ordenarNotas(abaNotas);

    var msg = novasNotas.length + ' nota(s) nova(s), ' + ligados + ' PDF(s) ligado(s).' +
      (completadas.length ? ' ' + completadas.length + ' linha(s) só com PDF completada(s) pelo XML.' : '') +
      (soPdf.length ? ' ' + soPdf.length + ' PDF(s) sem XML entraram como linha própria.' : '') +
      (lidosDoPdf ? ' Dados de ' + lidosDoPdf + ' PDF(s) sem XML lidos do próprio PDF.' : '') +
      (faltou ? ' Faltaram ' + faltou + ' arquivo(s): continuam na próxima atualização.' : '');
    var semPdf = notas.lista.filter(function (n) { return !n.pdf; }).length;
    if (semPdf) msg += ' ' + semPdf + ' nota(s) ainda sem PDF.';
    var pdfSemNota = pdfs.filter(function (p) { return p.r[4] === 'PENDENTE'; }).length;
    if (pdfSemNota) msg += ' ' + pdfSemNota + ' PDF(s) ainda não lidos (aba ARQUIVOS, situação PENDENTE).';
    if (!silencioso || novasNotas.length || ligados || soPdf.length || completadas.length || lidosDoPdf) aviso(msg);
    return msg;
  } finally {
    lock.releaseLock();
  }
}

// Arquivos XML e PDF da pasta e das subpastas: [{id, nome, tipo}]
function listarArquivos(pastaId) {
  try { return listarPelaApi(pastaId); } catch (e) { console.log('Drive API indisponível, listando pelo DriveApp. ' + (e && e.message || e)); }
  var out = [];
  var visitar = function (pasta) {
    var it = pasta.getFiles();
    while (it.hasNext()) {
      var f = it.next(), t = tipoArquivo(f.getName(), f.getMimeType());
      if (t) out.push({ id: f.getId(), nome: f.getName(), tipo: t });
    }
    var sub = pasta.getFolders();
    while (sub.hasNext()) visitar(sub.next());
  };
  visitar(DriveApp.getFolderById(pastaId));
  return out;
}

// Um pedido por pasta (até 1000 arquivos por página), bem mais rápido que o DriveApp
function listarPelaApi(pastaId) {
  var out = [], fila = [pastaId];
  while (fila.length) {
    var id = fila.shift(), token = '';
    do {
      var url = 'https://www.googleapis.com/drive/v3/files?pageSize=1000&supportsAllDrives=true&includeItemsFromAllDrives=true' +
        '&fields=' + encodeURIComponent('nextPageToken,files(id,name,mimeType)') +
        '&q=' + encodeURIComponent("'" + id + "' in parents and trashed = false") + (token ? '&pageToken=' + token : '');
      var r = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true });
      if (r.getResponseCode() !== 200) throw new Error('Drive API ' + r.getResponseCode() + ': ' + r.getContentText().slice(0, 200));
      var j = JSON.parse(r.getContentText());
      (j.files || []).forEach(function (f) {
        if (f.mimeType === 'application/vnd.google-apps.folder') { fila.push(f.id); return; }
        var t = tipoArquivo(f.name, f.mimeType);
        if (t) out.push({ id: f.id, nome: f.name, tipo: t });
      });
      token = j.nextPageToken || '';
    } while (token);
  }
  return out;
}

// Baixa o conteúdo de vários arquivos do Drive em paralelo (lotes de 25). Devolve {id: texto}.
// Para de começar lotes novos depois de "ate" (ms); os que faltarem ficam de fora.
function baixarVarios(ids, ate) {
  var out = {}, token = ScriptApp.getOAuthToken();
  for (var i = 0; i < ids.length && Date.now() < ate; i += 25) {
    var lote = ids.slice(i, i + 25), resps;
    try {
      resps = UrlFetchApp.fetchAll(lote.map(function (id) {
        return { url: 'https://www.googleapis.com/drive/v3/files/' + id + '?alt=media&supportsAllDrives=true',
                 headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true };
      }));
    } catch (e) { resps = []; }
    lote.forEach(function (id, k) {
      var r = resps[k];
      if (r && r.getResponseCode() === 200) { out[id] = r.getContentText('UTF-8'); return; }
      try { out[id] = DriveApp.getFileById(id).getBlob().getDataAsString('UTF-8'); } catch (e) { out[id] = ''; }
    });
  }
  return out;
}

function tipoArquivo(nome, mime) {
  if (/\.xml$/i.test(nome) || /xml/i.test(mime)) return 'XML';
  if (/\.pdf$/i.test(nome) || mime === 'application/pdf') return 'PDF';
  return '';
}

// Aba ARQUIVOS: cada arquivo lido uma vez só. pendentes = PDFs que ainda não acharam a nota.
function lerRegistro() {
  var sh = planilha().getSheetByName(ABA.ARQ);
  var porId = {}, pendentes = [];
  var n = sh.getLastRow();
  if (n > 1) {
    sh.getRange(2, 1, n - 1, CAB.ARQ.length).getValues().forEach(function (r, i) {
      if (!r[0]) return;
      porId[r[0]] = true;
      if (r[2] === 'PDF' && r[4] === 'PENDENTE') pendentes.push({ linha: i + 2, r: r, antes: r[3] });
    });
  }
  return { porId: porId, pendentes: pendentes };
}

// Atualiza os PDFs que estavam pendentes e acrescenta os novos (que passam a saber a própria linha)
function gravarRegistro(reg, novos, pdfs) {
  var sh = planilha().getSheetByName(ABA.ARQ);
  var mudou = pdfs.filter(function (p) { return p.linha && (p.r[4] !== 'PENDENTE' || p.antes !== p.r[3]); });
  mudou.forEach(function (p) { sh.getRange(p.linha, 4, 1, 2).setValues([[p.r[3], p.r[4]]]); });
  if (!novos.length) return;
  var ini = anexar(ABA.ARQ, novos);
  pdfs.forEach(function (p) { if (!p.linha) p.linha = ini + novos.indexOf(p.r); });
}

// Notas já na planilha: chave -> {linha, numero, pdf (tem?), xml (tem?)}
function lerNotas() {
  var sh = planilha().getSheetByName(ABA.NOTAS);
  var porChave = {}, lista = [];
  var n = sh.getLastRow();
  if (n > 1) {
    var v = sh.getRange(2, 1, n - 1, CAB.NOTAS.length).getValues();
    v.forEach(function (r, i) {
      var chave = String(r[COL.CHAVE - 1]).replace(/\D/g, '');
      var nota = { linha: i + 2, chave: chave, numero: String(r[COL.NUM - 1]).replace(/\D/g, '').replace(/^0+(?=\d)/, ''),
                   pdf: r[COL.PDF - 1] !== '' && r[COL.PDF - 1] !== SEM_PDF, xml: r[COL.XML - 1] !== '',
                   soPdf: r[COL.XML - 1] === '' && r[COL.PDF - 1] !== '' && r[COL.PDF - 1] !== SEM_PDF };
      lista.push(nota);
      if (chave) porChave[chave] = nota;
    });
  }
  return { porChave: porChave, lista: lista };
}

// Grava as notas novas (em bloco) e os links de PDF/XML que apareceram
function gravarNotas(notas, novas, completadas) {
  var sh = planilha().getSheetByName(ABA.NOTAS);
  if (novas.length) {
    var ini = sh.getLastRow() + 1;
    garantirLinhas(sh, ini + novas.length - 1);
    sh.getRange(ini, 1, novas.length, CAB.NOTAS.length).setValues(novas.map(function (x) { return x.valores; }));
    novas.forEach(function (x, i) { x.ref.linha = ini + i; });
    validacoesNotas(sh, ini, novas.length);   // só as linhas novas: refazer a aba toda a cada nota deixava lento
    sh.getRange(ini, COL.BOLETOS, novas.length, 1).setNumberFormat('dd/mm/yyyy');
  }
  // linha que só tinha o PDF e ganhou o XML: troca os dados, mantém PDF, lançamento, status, motivo e observação
  (completadas || []).forEach(function (c) {
    var l = linhaDaNota(c.x, null);
    sh.getRange(c.ref.linha, COL.NUM).setValue(l[COL.NUM - 1]);
    sh.getRange(c.ref.linha, COL.FORN, 1, COL.BOLETOS - COL.FORN + 1).setValues([l.slice(COL.FORN - 1, COL.BOLETOS)]);
    sh.getRange(c.ref.linha, COL.CHAVE).setValue(l[COL.CHAVE - 1]);
  });
  // links: lê as colunas B e M inteiras, troca o que mudou e grava de uma vez (uma chamada por coluna)
  var mudaram = notas.lista.filter(function (n) { return n.linkPdf || n.linkXml; });
  if (!mudaram.length) return;
  var n = sh.getLastRow() - 1;
  [[COL.PDF, 'linkPdf', 'Abrir PDF'], [COL.XML, 'linkXml', 'XML']].forEach(function (c) {
    if (!mudaram.some(function (x) { return x[c[1]]; })) return;
    var faixa = sh.getRange(2, c[0], n, 1);
    var rt = faixa.getRichTextValues().map(function (l) { return [l[0] || SpreadsheetApp.newRichTextValue().setText('').build()]; });
    mudaram.forEach(function (x) { if (x[c[1]]) rt[x.linha - 2][0] = link(c[2], x[c[1]]); });
    faixa.setRichTextValues(rt);
  });
}

function link(texto, idArquivo) {
  return SpreadsheetApp.newRichTextValue().setText(texto).setLinkUrl('https://drive.google.com/file/d/' + idArquivo + '/view').build();
}

function garantirLinhas(sh, ultima) {
  var faltam = ultima - sh.getMaxRows();
  if (faltam <= 0) return;
  sh.insertRowsAfter(sh.getMaxRows(), faltam + 100);
  if (sh.getName() === ABA.NOTAS) regrasDeCor(sh); // as regras de cor vão até a última linha da aba
}

function anexar(nomeAba, linhas) {
  if (!linhas.length) return;
  var sh = planilha().getSheetByName(nomeAba);
  var ini = sh.getLastRow() + 1;
  garantirLinhas(sh, ini + linhas.length - 1);
  sh.getRange(ini, 1, linhas.length, linhas[0].length).setValues(linhas);
  return ini;
}

// ===========================================================================
// XML e PDF
// ===========================================================================

function lerXmlControle(xml) {
  var root = XmlService.parse(xml).getRootElement();
  var infNFe = achar(root, 'infNFe');
  if (!infNFe) return null;
  var ide = achar(infNFe, 'ide'), emit = achar(infNFe, 'emit'), dest = achar(infNFe, 'dest');
  var tot = achar(infNFe, 'ICMSTot'), cobr = achar(infNFe, 'cobr');
  var m = String(xml).match(/Id\s*=\s*"NFe(\d{44})"/);
  var dups = [];
  if (cobr) cobr.getChildren().forEach(function (d) {
    if (d.getName() !== 'dup') return;
    dups.push({ n: txt(d, 'nDup'), venc: dataIso(txt(d, 'dVenc')), valor: Number(txt(d, 'vDup')) || 0 });
  });
  var cfops = (String(xml).match(/<CFOP>\s*\d{4}\s*<\/CFOP>/g) || []).map(function (c) { return c.replace(/\D/g, ''); });
  var tPags = (String(xml).match(/<tPag>\s*\d+\s*<\/tPag>/g) || []).map(function (c) { return c.replace(/\D/g, ''); });
  var natOp = txt(ide, 'natOp');
  return {
    chave: txt(root, 'chNFe') || (m ? m[1] : ''),
    numero: String(txt(ide, 'nNF')).replace(/^0+(?=\d)/, ''),
    emissao: dataIso(txt(ide, 'dhEmi') || txt(ide, 'dEmi')),
    fornecedor: txt(emit, 'xNome'),
    comprador: dest ? txt(dest, 'xNome') : '',
    cnpjComprador: dest ? (txt(dest, 'CNPJ') || txt(dest, 'CPF')) : '',
    valor: Number(txt(tot, 'vNF')) || 0,
    dups: dups,
    natOp: natOp,
    // bonificação: natureza da operação ou CFOP de bonificação/brinde (x910)
    bonificacao: /BONIFICA|BRINDE/i.test(natOp) || cfops.some(function (c) { return /^[1256]910$/.test(c); }),
    tPags: tPags
  };
}

var FORMAS_PAGAMENTO = { '01': 'dinheiro', '02': 'cheque', '03': 'cartão de crédito', '04': 'cartão de débito',
  '05': 'crédito loja', '15': 'boleto', '16': 'depósito', '17': 'PIX', '18': 'transferência', '90': 'sem pagamento',
  '99': 'outros' };

// Só a data do 1º vencimento. Nota sem boleto (bonificação, pagamento antecipado...): fica em branco.
function textoBoletos(x) {
  if (x.dups.length) return x.dups[0].venc || '';
  return '';
}

function letraColuna(c) {
  var t = '';
  for (; c > 0; c = Math.floor((c - 1) / 26)) t = String.fromCharCode(65 + (c - 1) % 26) + t;
  return t;
}

function cnpjFormatado(c) {
  c = String(c || '').replace(/\D/g, '');
  if (c.length === 14) return c.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  if (c.length === 11) return c.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  return c;
}

// Linha da aba NOTAS para uma nota nova (links de PDF e XML entram depois, como texto com link)
function linhaDaNota(x, agora) {
  var l = [];
  l[COL.NUM - 1] = x.numero; l[COL.PDF - 1] = SEM_PDF; l[COL.FORN - 1] = String(x.fornecedor || '').toUpperCase();
  l[COL.COMPRADOR - 1] = x.comprador;
  lembrarComprador(x.cnpjComprador, x.comprador);
  l[COL.EMISSAO - 1] = x.emissao || ''; l[COL.VALOR - 1] = x.valor; l[COL.BOLETOS - 1] = textoBoletos(x);
  l[COL.LANC - 1] = agora; l[COL.STATUS - 1] = ''; l[COL.MOTIVO - 1] = '';
  l[COL.OBS - 1] = ''; l[COL.CHAVE - 1] = x.chave; l[COL.XML - 1] = '';
  return l;
}

// Coluna H das notas lançadas em versões anteriores ("1/3   12/10/2026   R$ 18.788,82", "12/10/2026  R$ ...  (1 de 3)",
// "BONIFICAÇÃO (sem boleto)", "Sem boleto (pagamento: PIX)"): vira só a data ou fica em branco. Só mexe no que ainda é antigo.
function boletosNoFormatoNovo(sh) {
  var n = sh.getLastRow() - 1;
  if (n < 1) return;
  var faixa = sh.getRange(2, COL.BOLETOS, n, 1), v = faixa.getValues(), mudou = false;
  v.forEach(function (l) {
    if (l[0] instanceof Date || l[0] === '') return;
    var t = String(l[0]), d = t.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    l[0] = d ? new Date(Number(d[3]), Number(d[2]) - 1, Number(d[1])) : ''; // sem data (sem boleto): em branco
    mudou = true;
  });
  if (!mudou) return;
  faixa.setValues(v);
  faixa.setWrap(false);
}

// Versão anterior: A = "nº - razão social", 13 colunas, sem comprador. Converte as linhas mantendo status,
// datas, motivo, observação e links; comprador e boletos são relidos do XML de cada nota.
function migrarNotasAntigas(sh) {
  var n = sh.getLastRow() - 1;
  if (sh.getMaxColumns() < CAB.NOTAS.length) sh.insertColumnsAfter(sh.getMaxColumns(), CAB.NOTAS.length - sh.getMaxColumns());
  if (n < 1) return;
  var v = sh.getRange(2, 1, n, 13).getValues();
  var rtPdf = sh.getRange(2, 2, n, 1).getRichTextValues(), rtXml = sh.getRange(2, 13, n, 1).getRichTextValues();
  var novas = [];
  var idsXml = rtXml.map(function (l) {
    var url = l[0] && l[0].getLinkUrl ? l[0].getLinkUrl() : '';
    return (String(url || '').match(/\/d\/([^\/?#]+)/) || [])[1] || '';
  });
  var xmls = baixarVarios(idsXml.filter(String), Date.now() + 200000); // todos de uma vez, em paralelo
  v.forEach(function (r, i) {
    var a = String(r[0]), num = (a.match(/^\s*(\d+)/) || [])[1] || a, forn = a.replace(/^\s*\d+\s*-\s*/, '');
    var x = null;
    if (xmls[idsXml[i]]) { try { x = lerXmlControle(xmls[idsXml[i]]); } catch (e) {} }
    var l = [];
    l[COL.NUM - 1] = num; l[COL.PDF - 1] = r[1]; l[COL.FORN - 1] = forn;
    l[COL.COMPRADOR - 1] = x ? x.comprador : '';
    l[COL.EMISSAO - 1] = r[2]; l[COL.VALOR - 1] = r[3]; l[COL.BOLETOS - 1] = x ? textoBoletos(x) : r[4];
    l[COL.LANC - 1] = r[5]; l[COL.STATUS - 1] = r[7]; l[COL.MOTIVO - 1] = r[8];
    l[COL.OBS - 1] = r[9]; l[COL.CHAVE - 1] = r[11]; l[COL.XML - 1] = r[12];
    novas.push(l);
  });
  sh.getRange(2, 1, sh.getMaxRows() - 1, CAB.NOTAS.length).clearDataValidations();
  sh.getRange(2, 1, n, CAB.NOTAS.length).setValues(novas);
  var vazio = function (rt) { return rt || SpreadsheetApp.newRichTextValue().setText('').build(); };
  sh.getRange(2, COL.PDF, n, 1).setRichTextValues(rtPdf.map(function (l) { return [vazio(l[0])]; }));
  sh.getRange(2, COL.XML, n, 1).setRichTextValues(rtXml.map(function (l) { return [vazio(l[0])]; }));
  if (sh.getMaxColumns() > CAB.NOTAS.length) sh.getRange(1, CAB.NOTAS.length + 1, sh.getMaxRows(), 1).clear();
}

// 44 dígitos começando pelo código de uma UF (11 a 53), com ou sem espaços/pontos entre os blocos
function chaveNoNome(nome) {
  var m = String(nome).replace(/[\s.\-_]/g, '').match(/(?:^|\D)((?:1[1-7]|2[1-9]|3[1-5]|4[1-3]|5[0-3])\d{42})(?!\d)/);
  return m ? m[1] : '';
}

function chaveNoTexto(texto, conhecidas) {
  var t = String(texto).replace(/[ . ]/g, '');
  var re = /(?:1[1-7]|2[1-9]|3[1-5]|4[1-3]|5[0-3])\d{42}/g, m, primeira = '';
  while ((m = re.exec(t))) {
    if (conhecidas[m[0]]) return m[0];
    primeira = primeira || m[0];
  }
  return primeira;
}

// Linha para um PDF sem XML. Nº: o da chave achada no PDF ou, se o nome do arquivo tiver um número só, esse.
function linhaSoPdf(r, agora) {
  var chave = /^\d{44}$/.test(r[3]) ? r[3] : '';
  var nums = String(r[1]).replace(/\.pdf$/i, '').match(/\d{3,9}/g) || [];
  var num = chave ? chave.substr(25, 9).replace(/^0+(?=\d)/, '') : nums.length === 1 ? nums[0].replace(/^0+(?=\d)/, '') : '';
  var l = CAB.NOTAS.map(function () { return ''; });
  l[COL.NUM - 1] = num; l[COL.PDF - 1] = 'Abrir PDF'; l[COL.FORN - 1] = fornecedorDoNome(r[1]);
  l[COL.LANC - 1] = agora; l[COL.CHAVE - 1] = chave; // status e observação em branco
  return { valores: l };
}

// "VILLE 03-09 NFE 79570.pdf" -> "VILLE" (o resto do nome é data e número)
function fornecedorDoNome(nome) {
  var n = String(nome).replace(/\.pdf$/i, '').trim();
  return n.replace(/\s+\d{1,2}[-.\/]\d{1,2}([-.\/]\d{2,4})?\s+(NF-?E?|NOTA)?\s*\d+.*$/i, '').trim() || n;
}

// Linhas "só PDF" ainda não lidas: o Google Drive converte o PDF em texto (lê até PDF escaneado) e daí saem
// chave, nº, fornecedor, comprador, CNPJ, emissão, valor e 1º vencimento. Devolve quantas linhas leu.
function dadosDosPdfsSemXml(sh, ate) {
  var n = sh.getLastRow() - 1;
  if (n < 1 || Date.now() > ate) return 0;
  // PDFs que entraram como linha própria e ainda não foram lidos: situação SÓ PDF na aba ARQUIVOS
  var arq = planilha().getSheetByName(ABA.ARQ), nA = arq.getLastRow() - 1, linhaArq = {};
  if (nA > 0) arq.getRange(2, 1, nA, 5).getValues().forEach(function (r, i) { if (r[4] === SIT_SO_PDF) linhaArq[r[0]] = i + 2; });
  if (!Object.keys(linhaArq).length) return 0;
  var v = sh.getRange(2, 1, n, CAB.NOTAS.length).getValues();
  var links = sh.getRange(2, COL.PDF, n, 1).getRichTextValues();
  var idDaLinha = function (i) {
    var url = links[i][0] && links[i][0].getLinkUrl ? links[i][0].getLinkUrl() : '';
    return (String(url || '').match(/\/d\/([^\/?#]+)/) || [])[1] || '';
  };
  var faltam = [];
  v.forEach(function (r, i) { if (r[COL.XML - 1] === '' && linhaArq[idDaLinha(i)]) faltam.push(i); });
  if (!faltam.length) return 0;
  // quem já conhecemos pelas notas com XML: CNPJ do comprador -> nome; CNPJ do emitente (da chave) -> fornecedor
  var conhecidos = { compradores: lerCompradores(), fornecedores: {} };
  v.forEach(function (r) {
    var chave = String(r[COL.CHAVE - 1]);
    if (/^\d{44}$/.test(chave) && r[COL.XML - 1] !== '') conhecidos.fornecedores[chave.substr(6, 14)] = r[COL.FORN - 1];
  });
  var lidos = 0;
  faltam.forEach(function (i) {
    if (Date.now() > ate) return;
    var linha = i + 2, r = v[i], id = idDaLinha(i);
    var d = null;
    if (id) { try { d = dadosDoTextoDoPdf(textoDoPdfPeloDrive(id), conhecidos); } catch (e) { console.log('PDF ' + id + ': ' + (e && e.message || e)); } }
    lidos++;
    arq.getRange(linhaArq[id], 5).setValue(d ? SIT_PDF_LIDO : SIT_PDF_ILEGIVEL);
    if (!d) return;
    var l = r.slice();
    if (d.numero) l[COL.NUM - 1] = d.numero;
    l[COL.FORN - 1] = d.fornecedor || fornecedorDoNome(r[COL.FORN - 1]);
    if (d.cnpjComprador) l[COL.COMPRADOR - 1] = d.comprador || cnpjFormatado(d.cnpjComprador); // nome desconhecido: fica o CNPJ
    if (d.emissao) l[COL.EMISSAO - 1] = d.emissao;
    if (d.valor) l[COL.VALOR - 1] = d.valor;
    if (d.vencimento) l[COL.BOLETOS - 1] = d.vencimento;
    if (d.chave) l[COL.CHAVE - 1] = d.chave;
    sh.getRange(linha, 1).setValue(l[0]);
    sh.getRange(linha, COL.FORN, 1, COL.BOLETOS - COL.FORN + 1).setValues([l.slice(COL.FORN - 1, COL.BOLETOS)]);
    sh.getRange(linha, COL.CHAVE).setValue(l[COL.CHAVE - 1]);
  });
  return lidos;
}

// Texto do PDF pelo Google Drive: copia como Documento Google (com OCR), exporta o texto e apaga a cópia
function textoDoPdfPeloDrive(id) {
  var api = 'https://www.googleapis.com/drive/v3/files/', h = { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() };
  var c = UrlFetchApp.fetch(api + id + '/copy?ocrLanguage=pt&supportsAllDrives=true&fields=id', {
    method: 'post', contentType: 'application/json', headers: h, muteHttpExceptions: true,
    payload: JSON.stringify({ name: 'leitura temporaria ' + id, mimeType: 'application/vnd.google-apps.document' })
  });
  if (c.getResponseCode() !== 200) throw new Error('Drive ' + c.getResponseCode() + ': ' + c.getContentText().slice(0, 200));
  var doc = JSON.parse(c.getContentText()).id;
  try {
    var t = UrlFetchApp.fetch(api + doc + '/export?mimeType=text%2Fplain', { headers: h, muteHttpExceptions: true });
    if (t.getResponseCode() !== 200) throw new Error('Drive ' + t.getResponseCode() + ' ao exportar o texto');
    return t.getContentText('UTF-8');
  } finally {
    UrlFetchApp.fetch(api + doc + '?supportsAllDrives=true', { method: 'delete', headers: h, muteHttpExceptions: true });
  }
}

// Dígito verificador da chave de acesso (módulo 11): evita aceitar 44 dígitos lidos errado
function chaveValida(c) {
  if (!/^\d{44}$/.test(c)) return false;
  var soma = 0, peso = 2;
  for (var i = 42; i >= 0; i--) { soma += Number(c[i]) * peso; peso = peso === 9 ? 2 : peso + 1; }
  var dv = 11 - soma % 11;
  return (dv >= 10 ? 0 : dv) === Number(c[43]);
}

// Dados da nota a partir do texto do DANFE (ou de um pedido de compra, com o que der para achar)
function dadosDoTextoDoPdf(texto, conhecidos) {
  var t = String(texto || '').replace(/\r/g, '');
  if (t.replace(/\s/g, '').length < 30) return null;
  var d = {};
  var data = function (s) {
    var m = String(s).match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (!m || Number(m[3]) < 2000 || Number(m[2]) > 12 || Number(m[1]) > 31) return null;
    return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  };
  var datas = function (s) { return (String(s).match(/\d{2}\/\d{2}\/\d{4}/g) || []).map(data).filter(Boolean); };
  var dinheiro = function (s) {
    return (String(s).match(/\d{1,3}(?:\.\d{3})+,\d{2}(?!\d)|\d+,\d{2}(?!\d)/g) || [])
      .map(function (x) { return Number(x.replace(/\./g, '').replace(',', '.')); });
  };
  var trecho = function (re, tam) { var m = t.search(re); return m < 0 ? '' : t.substr(m, tam || 400); };

  // chave: 44 dígitos (com ou sem espaços) com o dígito verificador certo
  var semEsp = t.replace(/[ . ]/g, ''), re = /\d{44}/g, m;
  while ((m = re.exec(semEsp))) if (chaveValida(m[0])) { d.chave = m[0]; break; }
  if (d.chave) {
    d.numero = d.chave.substr(25, 9).replace(/^0+(?=\d)/, '');
    d.fornecedor = conhecidos.fornecedores[d.chave.substr(6, 14)] || '';
  }
  // CNPJs do texto: o nosso (já conhecido) é o comprador; outro conhecido como fornecedor dá o nome dele
  var cnpjs = (t.match(/\d{2}\.?\d{3}\.?\d{3}\s*\/?\s*\d{4}\s*-?\s*\d{2}/g) || []).map(function (x) { return x.replace(/\D/g, ''); });
  var emitente = d.chave ? d.chave.substr(6, 14) : '';
  cnpjs.forEach(function (c) {
    if (c === emitente) return;
    if (!d.cnpjComprador && conhecidos.compradores[c]) { d.cnpjComprador = c; d.comprador = conhecidos.compradores[c]; }
    if (!d.fornecedor && conhecidos.fornecedores[c]) d.fornecedor = conhecidos.fornecedores[c];
  });
  if (!d.cnpjComprador) {
    // comprador ainda não conhecido: o CNPJ que vem depois de "DESTINATÁRIO"
    var dest = trecho(/DESTINAT[ÁA]RIO/i, 600).match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/);
    if (dest) d.cnpjComprador = dest[0].replace(/\D/g, '');
  }
  // emissão: a primeira data depois de "EMISSÃO" (ou a primeira data do documento)
  d.emissao = datas(trecho(/EMISS[ÃA]O/i, 200))[0] || datas(t)[0] || null;
  // valor: no DANFE é o maior valor do quadro de impostos (o total da nota); no pedido, o maior valor do documento
  var quadro = (trecho(/C[ÁA]LCULO DO IMPOSTO/i, 900) || trecho(/VALOR TOTAL/i, 300)).split(/TRANSPORTADOR/i)[0];
  var valores = dinheiro(quadro || t);
  if (valores.length) d.valor = Math.max.apply(null, valores);
  // 1º vencimento: a primeira data do quadro FATURA/DUPLICATA que não seja antes da emissão
  var fatura = trecho(/FATURA|DUPLICATA/i, 700).split(/C[ÁA]LCULO DO IMPOSTO/i)[0];
  var vencs = datas(fatura).filter(function (x) { return !d.emissao || x >= d.emissao; });
  if (vencs.length) d.vencimento = vencs[0];
  return d;
}

// Linha "só PDF" sem chave com o mesmo nº da nota (só se for uma)
function soPdfPeloNumero(numero, lista) {
  var achadas = lista.filter(function (n) { return n.soPdf && !n.chave && n.numero && n.numero === numero; });
  return achadas.length === 1 ? achadas[0] : null;
}

// Nossa razão social vem escrita de jeitos diferentes em cada nota ("15286 - BEM BARATO...", "... LTDA - 174288",
// cortada no fim). Tira os códigos; nome cortado vira o nome inteiro mais comum que começa igual.
// Notas mais recentes em cima: pela EMISSÃO, da mais nova para a mais velha (sem emissão, vale a data de
// ENTRADA GALPÃO). Usa a ordenação do próprio Google (a linha inteira muda de lugar, com os links de PDF e XML,
// o status e tudo o que foi digitado). Só ordena quando a ordem mudou.
// O link no Google fica como formatação da célula: regravar o texto em outra ordem deixava o link para trás.
function ordenarNotas(sh) {
  var n = sh.getLastRow() - 1;
  if (n < 2) return false;
  var v = sh.getRange(2, 1, n, CAB.NOTAS.length).getValues();
  var tempo = function (x) {
    if (x instanceof Date) return x.getTime();
    var m = String(x).match(/(\d{2})\/(\d{2})\/(\d{4})/);
    return m ? new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1])).getTime() : 0;
  };
  var ordem = v.map(function (r, i) {
    var lanc = tempo(r[COL.LANC - 1]);
    return { i: i, emissao: tempo(r[COL.EMISSAO - 1]) || lanc, lanc: lanc, num: Number(String(r[COL.NUM - 1]).replace(/\D/g, '')) || 0 };
  });
  ordem.sort(function (a, b) { return b.emissao - a.emissao || b.lanc - a.lanc || b.num - a.num || a.i - b.i; });
  if (ordem.every(function (o, j) { return o.i === j; })) return false;
  // coluna auxiliar (a 1ª vazia depois de tudo) com a posição nova de cada linha; ordena por ela e apaga
  var col = Math.max(CAB.NOTAS.length, sh.getLastColumn()) + 1;
  if (sh.getMaxColumns() < col) sh.insertColumnsAfter(sh.getMaxColumns(), col - sh.getMaxColumns());
  var pos = [];
  ordem.forEach(function (o, j) { pos[o.i] = [j + 1]; });
  var aux = sh.getRange(2, col, n, 1);
  aux.setValues(pos);
  sh.getRange(2, 1, n, col).sort({ column: col, ascending: true });
  aux.clearContent();
  return true;
}

function refazerLinksAgora() {
  var r = refazerLinks(planilha().getSheetByName(ABA.NOTAS));
  aviso(r.pdf + ' link(s) de PDF e ' + r.xml + ' de XML corrigido(s).' +
    (r.semAchar ? ' ' + r.semAchar + ' PDF(s) sem XML não deu para identificar (ficaram como estavam).' : ''), 15);
}

// Refaz os links das colunas PDF e XML a partir da aba ARQUIVOS (que guarda qual arquivo é de qual nota):
// PDF e XML ligados pela chave de acesso; PDF sem XML pela chave ou pelo nº no nome do arquivo.
function refazerLinks(sh) {
  var res = { pdf: 0, xml: 0, semAchar: 0 };
  var n = sh.getLastRow() - 1;
  if (n < 1) return res;
  var arq = planilha().getSheetByName(ABA.ARQ), nA = arq.getLastRow() - 1;
  var pdfPorChave = {}, xmlPorChave = {}, soPdf = [];
  (nA > 0 ? arq.getRange(2, 1, nA, 5).getValues() : []).forEach(function (r) {
    var id = String(r[0]), chave = String(r[3]).replace(/\D/g, ''), sit = String(r[4]);
    if (!id) return;
    if (chave.length !== 44) chave = '';
    if (r[2] === 'XML' && sit === 'OK' && chave && !xmlPorChave[chave]) xmlPorChave[chave] = id;
    if (r[2] === 'PDF' && sit === 'OK' && chave && !pdfPorChave[chave]) pdfPorChave[chave] = id;
    if (r[2] === 'PDF' && sit.indexOf(SIT_SO_PDF) === 0) soPdf.push({ id: id, nome: String(r[1]), chave: chave });
  });
  var numDoNome = function (nome) {
    var nums = String(nome).replace(/\.pdf$/i, '').match(/\d{3,9}/g) || [];
    return nums.length === 1 ? nums[0].replace(/^0+(?=\d)/, '') : '';
  };
  var v = sh.getRange(2, 1, n, CAB.NOTAS.length).getValues();
  var faixaPdf = sh.getRange(2, COL.PDF, n, 1), faixaXml = sh.getRange(2, COL.XML, n, 1);
  var rtPdf = faixaPdf.getRichTextValues(), rtXml = faixaXml.getRichTextValues();
  var urlDe = function (rt) { return rt && rt.getLinkUrl ? rt.getLinkUrl() || '' : ''; };
  var texto = function (t) { return SpreadsheetApp.newRichTextValue().setText(t).build(); };
  var novoPdf = [], novoXml = [];
  v.forEach(function (r, i) {
    var chave = String(r[COL.CHAVE - 1]).replace(/\D/g, ''), num = String(r[COL.NUM - 1]).replace(/\D/g, '').replace(/^0+(?=\d)/, '');
    if (chave.length !== 44) chave = '';
    var temXml = String(r[COL.XML - 1]) !== '';
    // XML
    var idXml = chave && xmlPorChave[chave];
    var xml = idXml ? link('XML', idXml) : temXml ? rtXml[i][0] || texto('XML') : texto('');
    if (urlDe(xml) !== urlDe(rtXml[i][0])) res.xml++;
    novoXml.push([xml]);
    // PDF
    var idPdf = chave && pdfPorChave[chave];
    if (!idPdf) {
      var c = soPdf.filter(function (p) { return chave && p.chave === chave; });
      if (c.length !== 1 && num) c = soPdf.filter(function (p) { return numDoNome(p.nome) === num; });
      if (c.length !== 1 && !temXml) {
        var forn = String(r[COL.FORN - 1]).toUpperCase();
        c = soPdf.filter(function (p) { return fornecedorDoNome(p.nome).toUpperCase() === forn && (!num || numDoNome(p.nome) === num); });
      }
      if (c.length === 1) idPdf = c[0].id;
    }
    var pdf;
    if (idPdf) pdf = link('Abrir PDF', idPdf);
    else if (String(r[COL.PDF - 1]) === SEM_PDF || String(r[COL.PDF - 1]) === '') pdf = texto(String(r[COL.PDF - 1]) || SEM_PDF);
    else { pdf = rtPdf[i][0] || texto(String(r[COL.PDF - 1])); res.semAchar++; } // não deu para saber: fica como está
    if (urlDe(pdf) !== urlDe(rtPdf[i][0]) || String(r[COL.PDF - 1]) === SEM_PDF && urlDe(rtPdf[i][0])) res.pdf++;
    novoPdf.push([pdf]);
  });
  // tira os links antigos (ficam na formatação da célula) e grava os certos
  faixaPdf.clear({ formatOnly: true }); faixaPdf.setRichTextValues(novoPdf);
  faixaXml.clear({ formatOnly: true }); faixaXml.setRichTextValues(novoXml);
  return res;
}

// Razão social dos fornecedores sempre em MAIÚSCULAS (também nas linhas que já estavam na planilha)
function fornecedoresMaiusculos(sh) {
  var n = sh.getLastRow() - 1;
  if (n < 1) return;
  var faixa = sh.getRange(2, COL.FORN, n, 1), v = faixa.getValues(), mudou = false;
  v.forEach(function (r) {
    if (typeof r[0] !== 'string') return;
    var m = r[0].toUpperCase();
    if (m !== r[0]) { r[0] = m; mudou = true; }
  });
  if (mudou) faixa.setValues(v);
}

function compradoresPadronizados(sh) {
  var n = sh.getLastRow() - 1;
  if (n < 1) return;
  var v = sh.getRange(2, COL.COMPRADOR, n, 1).getValues();
  var limpo = function (s) { return String(s).replace(/^\s*\d+\s*-\s*/, '').replace(/\s*-\s*\d+\s*$/, '').replace(/\s+/g, ' ').trim(); };
  var conta = {};
  v.forEach(function (r) { var nome = limpo(r[0]); if (nome && !/^\d/.test(nome)) conta[nome] = (conta[nome] || 0) + 1; });
  var nomes = Object.keys(conta), padrao = {};
  nomes.forEach(function (nome) {
    padrao[nome] = nomes.filter(function (o) { return o.indexOf(nome) === 0; })
      .sort(function (a, b) { return conta[b] - conta[a] || b.length - a.length; })[0];
  });
  var mudou = false;
  v.forEach(function (r) {
    var l = limpo(r[0]), novo = padrao[l] || l;
    if (novo !== r[0]) { r[0] = novo; mudou = true; }
  });
  if (mudou) sh.getRange(2, COL.COMPRADOR, n, 1).setValues(v);
}

// CNPJ -> nossa razão social, das notas com XML (guardado no script, já que a coluna do CNPJ saiu da planilha).
// Serve para achar o comprador nos PDFs sem XML.
var COMPRADORES = null, COMPRADORES_MUDOU = false;
function lerCompradores() {
  if (COMPRADORES) return COMPRADORES;
  try { COMPRADORES = JSON.parse(PropertiesService.getScriptProperties().getProperty('COMPRADORES') || '{}'); } catch (e) { COMPRADORES = {}; }
  return COMPRADORES;
}
function lembrarComprador(cnpj, nome) {
  var c = String(cnpj || '').replace(/\D/g, ''), m = lerCompradores();
  nome = String(nome || '').replace(/^\s*\d+\s*-\s*/, '').replace(/\s*-\s*\d+\s*$/, '').trim();
  if (c.length < 11 || !nome || /^\d/.test(nome)) return;
  if (!m[c] || nome.length > m[c].length && nome.indexOf(m[c]) === 0) { m[c] = nome; COMPRADORES_MUDOU = true; }
}
function gravarCompradores() {
  if (!COMPRADORES_MUDOU) return;
  try { PropertiesService.getScriptProperties().setProperty('COMPRADORES', JSON.stringify(COMPRADORES)); COMPRADORES_MUDOU = false; } catch (e) {}
}

// "NF 289804.pdf", "danfe_289804.pdf": número de uma nota que ainda não tem PDF (só se for uma só)
// comPdf = true: procura entre as que já têm PDF (para avisar que o arquivo é repetido)
function notaPeloNumero(nome, lista, comPdf) {
  var nums = (String(nome).replace(/\.pdf$/i, '').match(/\d{3,9}/g) || []).map(function (x) { return x.replace(/^0+/, ''); });
  var achadas = lista.filter(function (n) { return !n.pdf === !comPdf && n.numero && nums.indexOf(n.numero) >= 0; });
  return achadas.length === 1 ? achadas[0] : null;
}

function achar(el, nome) {
  if (!el) return null;
  if (el.getName() === nome) return el;
  var filhos = el.getChildren();
  for (var i = 0; i < filhos.length; i++) {
    var r = achar(filhos[i], nome);
    if (r) return r;
  }
  return null;
}

function txt(el, nome) { var e = achar(el, nome); return e ? e.getText().trim() : ''; }

function dataIso(s) {
  var m = String(s).match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}

function dataBR(d) {
  var z = function (n) { return (n < 10 ? '0' : '') + n; };
  return z(d.getDate()) + '/' + z(d.getMonth() + 1) + '/' + d.getFullYear();
}

function real(v) {
  var s = (Math.round(Number(v) * 100) / 100).toFixed(2).split('.');
  return 'R$ ' + s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + s[1];
}

// ===========================================================================
// Status, motivo e cores
// ===========================================================================

// Ao editar NOTAS: só avisa o que falta (a cor muda sozinha pela formatação condicional)
function onEdit(e) {
  if (!e || !e.range) return;
  var sh = e.range.getSheet();
  if (sh.getName() !== ABA.NOTAS) return;
  var r1 = Math.max(2, e.range.getRow()), r2 = e.range.getLastRow();
  if (r2 < r1) return;
  var c1 = e.range.getColumn(), c2 = e.range.getLastColumn();
  if (c2 < COL.STATUS || c1 > COL.OBS) return;
  var avisos = [];
  sh.getRange(r1, 1, r2 - r1 + 1, CAB.NOTAS.length).getValues().forEach(function (r) {
    var p = problemaDaLinha(r);
    if (p) avisos.push('Nota ' + r[COL.NUM - 1] + ': ' + p);
  });
  if (avisos.length) e.source.toast(avisos.join('\n'), 'Falta informação', 8);
}

function problemaDaLinha(r) {
  if (r[COL.STATUS - 1] === 'COM PROBLEMA' && !String(r[COL.MOTIVO - 1]).trim()) return 'escolha o Motivo (coluna ' + letraColuna(COL.MOTIVO) + ').';
  if (r[COL.MOTIVO - 1] === MOTIVO_OUTRO && !String(r[COL.OBS - 1]).trim()) return 'explique o motivo na Observação (coluna ' + letraColuna(COL.OBS) + ').';
  return '';
}

// ===========================================================================
// Leitura do texto do PDF (DANFE), para achar a chave de acesso
// ===========================================================================


// Leitor de PDF próprio: descompacta as páginas, pega cada texto com sua posição (x, y)
// e remonta as linhas da esquerda para a direita, de cima para baixo.
// Chave de acesso escrita no DANFE. Só descompacta o texto das páginas e para quando acha.
function chaveDentroDoPdf(bytes, conhecidas) {
  var achada = '';
  textoPdfDireto(bytes, function (texto) { achada = chaveNoTexto(texto, conhecidas); return !!achada; });
  return achada;
}

// parar(textoDaPagina): opcional; se devolver true, para de ler o resto do PDF
function textoPdfDireto(bytes, parar) {
  var dados = [];
  for (var i = 0; i < bytes.length; i++) dados.push(bytes[i] & 255);
  var bruto = bytesParaTexto(dados);
  var paginas = [];
  var re = /stream\r?\n/g, m;
  while ((m = re.exec(bruto))) {
    var ini = m.index + m[0].length;
    var fim = bruto.indexOf('endstream', ini);
    if (fim < 0) break;
    var dict = bruto.slice(Math.max(0, bruto.lastIndexOf('<<', m.index)), m.index);
    re.lastIndex = fim + 9; // depois do "endstream" (senão o "stream" dele conta como outro)
    // imagens, fontes embutidas e metadados não têm o texto da página e são o que mais demora para descompactar
    if (/\/Subtype\s*\/Image|\/Length[123]\b|\/Type\s*\/(XRef|ObjStm|Metadata|EmbeddedFile)|\/FontFile/.test(dict)) continue;
    if (parar && fim - ini > 400000) continue;
    var conteudo = dados.slice(ini, fim);
    try {
      if (/FlateDecode/.test(dict)) conteudo = inflar(conteudo.slice(2)); // pula o cabeçalho zlib
      else if (/\/Filter/.test(dict)) continue;                         // outro filtro: imagem etc.
    } catch (e) { continue; }
    var txt = bytesParaTexto(conteudo);
    if (/\bBT\b/.test(txt) && /T[jJ]/.test(txt)) {
      paginas.push(linhasDoConteudo(txt));
      if (parar && parar(paginas[paginas.length - 1])) break;
    }
  }
  return paginas.join('\n');
}

function bytesParaTexto(arr) {
  var s = '';
  for (var i = 0; i < arr.length; i += 8192) s += String.fromCharCode.apply(null, arr.slice(i, i + 8192));
  return s;
}

function linhasDoConteudo(c) {
  var pedacos = [], x = 0, y = 0, lx = 0, ly = 0, ordem = 0, m;
  var re = /(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+Tm|(-?[\d.]+)\s+(-?[\d.]+)\s+T[dD]|T\*|\bBT\b|(\((?:\\[\s\S]|[^\\)])*\))\s*(?:Tj|'|")|\[((?:\((?:\\[\s\S]|[^\\)])*\)|[^\]])*)\]\s*TJ/g;
  while ((m = re.exec(c))) {
    if (m[1] !== undefined) { x = lx = Number(m[5]); y = ly = Number(m[6]); }
    else if (m[7] !== undefined) { x = lx = lx + Number(m[7]); y = ly = ly + Number(m[8]); }
    else if (m[0] === 'BT') { x = lx = 0; y = ly = 0; }
    else if (m[0] === 'T*') { y = ly = ly - 12; x = lx; }
    else {
      var texto = '';
      if (m[9] !== undefined) texto = stringPdf(m[9]);
      else (m[10].match(/\((?:\\[\s\S]|[^\\)])*\)/g) || []).forEach(function (p) { texto += stringPdf(p); });
      if (texto.trim()) pedacos.push({ x: x, y: y, t: texto, o: ordem++ });
    }
  }
  pedacos.sort(function (a, b) { return b.y - a.y || a.x - b.x || a.o - b.o; });
  var linhas = [], atual = null;
  pedacos.forEach(function (p) {
    if (!atual || Math.abs(atual.y - p.y) > 2.5) { atual = { y: p.y, itens: [] }; linhas.push(atual); }
    atual.itens.push(p);
  });
  return linhas.map(function (l) {
    return l.itens.sort(function (a, b) { return a.x - b.x || a.o - b.o; })
      .map(function (p) { return p.t.trim(); }).join(' ');
  }).join('\n');
}

function stringPdf(s) {
  s = s.slice(1, -1);
  var win = { 128: '€', 130: '‚', 132: '„', 133: '…', 145: '‘', 146: '’', 147: '“', 148: '”', 150: '–', 151: '—' };
  var out = '';
  for (var i = 0; i < s.length; i++) {
    var ch = s[i];
    if (ch === '\\') {
      var n = s[++i];
      if (/[0-7]/.test(n)) {
        var oct = n;
        while (oct.length < 3 && /[0-7]/.test(s[i + 1])) oct += s[++i];
        ch = String.fromCharCode(parseInt(oct, 8));
      } else {
        ch = { n: '\n', r: '', t: ' ', b: '', f: '' }[n];
        if (ch === undefined) ch = n === '\n' || n === '\r' ? '' : n;
      }
    }
    var code = ch.charCodeAt(0);
    out += win[code] || ch;
  }
  return out;
}

// Descompactador DEFLATE (RFC 1951), baseado no puff.c de Mark Adler
function inflar(src) {
  var out = [], pos = 0, buf = 0, cnt = 0;
  var LBASE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
  var LEXT = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
  var DBASE = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073,
               4097, 6145, 8193, 12289, 16385, 24577];
  var DEXT = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
  var ORDEM = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

  function bits(n) {
    while (cnt < n) {
      if (pos >= src.length) throw new Error('PDF truncado');
      buf |= src[pos++] << cnt; cnt += 8;
    }
    var v = buf & ((1 << n) - 1);
    buf >>>= n; cnt -= n;
    return v;
  }
  function tabela(tams, ini, n) {
    var count = [], offs = [], sym = [], i;
    for (i = 0; i < 16; i++) count[i] = 0;
    for (i = 0; i < n; i++) count[tams[ini + i]]++;
    count[0] = 0; offs[1] = 0;
    for (i = 1; i < 15; i++) offs[i + 1] = offs[i] + count[i];
    for (i = 0; i < n; i++) if (tams[ini + i]) sym[offs[tams[ini + i]]++] = i;
    return { count: count, sym: sym };
  }
  function decodificar(h) {
    var code = 0, first = 0, index = 0;
    for (var len = 1; len <= 15; len++) {
      code |= bits(1);
      var c = h.count[len];
      if (code - c < first) return h.sym[index + (code - first)];
      index += c; first += c; first <<= 1; code <<= 1;
    }
    throw new Error('código inválido');
  }
  function blocos(lc, dc) {
    for (;;) {
      var s = decodificar(lc);
      if (s < 256) out.push(s);
      else if (s === 256) return;
      else {
        s -= 257;
        var len = LBASE[s] + bits(LEXT[s]);
        var d = decodificar(dc);
        var dist = DBASE[d] + bits(DEXT[d]);
        for (var k = 0; k < len; k++) out.push(out[out.length - dist]);
      }
    }
  }
  var fixoL, fixoD, ultimo;
  do {
    ultimo = bits(1);
    var tipo = bits(2), i;
    if (tipo === 0) {
      buf = 0; cnt = 0;
      var n = src[pos] | (src[pos + 1] << 8);
      pos += 4;
      for (i = 0; i < n; i++) out.push(src[pos++]);
    } else if (tipo === 1) {
      if (!fixoL) {
        var t = [];
        for (i = 0; i < 144; i++) t[i] = 8;
        for (; i < 256; i++) t[i] = 9;
        for (; i < 280; i++) t[i] = 7;
        for (; i < 288; i++) t[i] = 8;
        fixoL = tabela(t, 0, 288);
        var td = [];
        for (i = 0; i < 30; i++) td[i] = 5;
        fixoD = tabela(td, 0, 30);
      }
      blocos(fixoL, fixoD);
    } else if (tipo === 2) {
      var nlen = bits(5) + 257, ndist = bits(5) + 1, ncode = bits(4) + 4, tams = [];
      for (i = 0; i < 19; i++) tams[i] = 0;
      for (i = 0; i < ncode; i++) tams[ORDEM[i]] = bits(3);
      var cc = tabela(tams, 0, 19), todos = [], idx = 0;
      while (idx < nlen + ndist) {
        var sym = decodificar(cc), rep, val = 0;
        if (sym < 16) { todos[idx++] = sym; continue; }
        if (sym === 16) { val = todos[idx - 1]; rep = 3 + bits(2); }
        else if (sym === 17) rep = 3 + bits(3);
        else rep = 11 + bits(7);
        while (rep--) todos[idx++] = val;
      }
      blocos(tabela(todos, 0, nlen), tabela(todos, nlen, ndist));
    } else {
      throw new Error('bloco inválido');
    }
  } while (!ultimo);
  return out;
}

