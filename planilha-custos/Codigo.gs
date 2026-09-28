/**
 * PLANILHA DE CUSTOS — importação automática de romaneios de entrada
 *
 * Cole este arquivo em Extensões > Apps Script da planilha (substituindo o
 * conteúdo de Código.gs), salve e rode o menu "Custos > Configurar planilha".
 * O passo a passo completo está na aba LEIA-ME que o próprio script cria.
 *
 * Fluxo:
 *   PDF do romaneio (ou XML da NF-e) na pasta "Romaneios - Entrada" do Drive
 *     -> script lê as linhas de produto
 *     -> tenta achar o SKU (DE_PARA > EAN > descrição exata)
 *     -> achou: grava em ENTRADAS | parecido mas incerto: PENDENTES |
 *        sem nada parecido: cria SKU novo em SKUs e grava em ENTRADAS
 *     -> CUSTOS recalcula sozinho por fórmula
 *     -> arquivo vai para "Romaneios - Processados"
 */

// ---------------------------------------------------------------------------
// Estrutura das abas
// ---------------------------------------------------------------------------

var ABA = {
  LEIAME: 'LEIA-ME',
  CUSTOS: 'CUSTOS',
  SKUS: 'SKUs',
  DEPARA: 'DE_PARA',
  ENTRADAS: 'ENTRADAS',
  PENDENTES: 'PENDENTES',
  CONFIG: 'CONFIG',
  LOG: 'LOG'
};

var CAB = {
  SKUS: ['SKU', 'Descrição', 'EANs (separe por vírgula)', 'Unidade', 'Categoria',
         'Status', 'Cadastrado em', 'Origem', 'Custo oficial'],
  DEPARA: ['CNPJ fornecedor', 'Fornecedor', 'Cód. no fornecedor', 'EAN',
           'Descrição no fornecedor', 'SKU', 'Fator (un. estoque por un. do fornecedor)',
           'Origem do vínculo', 'Conferido', 'Criado em'],
  // O e P são fórmulas (ARRAYFORMULA no cabeçalho); o script nunca escreve nelas
  ENTRADAS: ['Data', 'Nº documento', 'Fornecedor', 'CNPJ fornecedor', 'Cód. no fornecedor',
             'EAN', 'Descrição no documento', 'Qtd', 'Unid.', 'Valor unit. no documento',
             'Valor pago da linha', 'Bonificado', 'SKU', 'Fator', 'Qtd em un. estoque',
             'Custo unit. pago', 'Grupo de compra', 'Como casou', 'Arquivo', 'Importado em'],
  PENDENTES: ['Data', 'Nº documento', 'Fornecedor', 'CNPJ fornecedor', 'Cód. no fornecedor',
              'EAN', 'Descrição no documento', 'Qtd', 'Unid.', 'Valor unit. no documento',
              'Valor pago da linha', 'Bonificado', 'SKU sugerido', 'Descrição sugerida',
              'Similaridade', 'SKU ESCOLHIDO (preencha: SKU ou NOVO)', 'Fator', 'Arquivo'],
  CUSTOS: ['SKU', 'Descrição', 'Último custo pago', 'Data da última compra',
           'Fornecedor da última compra', 'Custo pago anterior', 'Variação vs anterior',
           'Custo efetivo da última compra (com bonificação)', 'Custo médio histórico',
           'Qtd total recebida', 'Qtd recebida bonificada', 'Custo oficial'],
  LOG: ['Data/hora', 'Arquivo', 'ID do arquivo', 'Status', 'Itens lidos',
        'Gravados em ENTRADAS', 'Enviados a PENDENTES', 'SKUs novos', 'Mensagem']
};

// Linha fixa de cada parâmetro na aba CONFIG (coluna B = valor)
var CONFIG_ITENS = [
  ['Pasta de entrada (ID)', '', 'Onde você solta os PDFs/XMLs. Deixe vazio: o script cria a pasta.'],
  ['Pasta de processados (ID)', '', 'Para onde vão os arquivos já importados.'],
  ['Pasta com erro (ID)', '', 'Arquivos em que nenhum item foi reconhecido.'],
  ['Custo oficial', 'ÚLTIMO PAGO', 'ÚLTIMO PAGO, EFETIVO (dilui bonificação) ou MÉDIO (histórico ponderado).'],
  ['Similaridade mínima para sugerir', 0.55, 'De 0 a 1. Acima disso o item vai para PENDENTES com sugestão; abaixo vira SKU novo.'],
  ['Criar SKU novo automaticamente', 'SIM', 'SIM: item sem correspondência vira SKU novo. NÃO: vai para PENDENTES.'],
  ['Prefixo do SKU novo', 'NOVO-', 'SKU criado automaticamente = prefixo + número sequencial. Renomeie depois se quiser.'],
  ['CFOPs de bonificação', '1910, 2910, 5910, 6910', 'CFOPs que marcam a nota ou o item como bonificado (1910/2910 = entrada; 5910/6910 = saída do fornecedor).'],
  ['Somar frete, seguro, IPI e ST no custo (XML)', 'SIM', 'Só vale para XML de NF-e, que traz esses valores por item.'],
  ['CNPJ da sua empresa', '', 'Para o leitor de PDF não confundir o seu CNPJ com o do fornecedor.']
];
var CFG_LINHA = { CUSTO_OFICIAL: 5 }; // linha de "Custo oficial" (cabeçalho na linha 1)

var UNIDADES = ['UN', 'UND', 'UNID', 'UNI', 'CX', 'CXA', 'FD', 'FDO', 'PC', 'PCT', 'PCTE', 'KG', 'G',
                'LT', 'L', 'ML', 'DZ', 'PAR', 'KIT', 'SC', 'SACO', 'BD', 'FR', 'GL', 'M', 'MT', 'RL', 'TB', 'BL'];

// ---------------------------------------------------------------------------
// Menu
// ---------------------------------------------------------------------------

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Custos')
    .addItem('Importar romaneios agora', 'importarRomaneios')
    .addItem('Processar PENDENTES preenchidos', 'processarPendentes')
    .addSeparator()
    .addItem('Ativar importação automática (a cada 15 min)', 'ativarAutomatico')
    .addItem('Desativar importação automática', 'desativarAutomatico')
    .addSeparator()
    .addItem('Configurar planilha (1ª vez)', 'configurarPlanilha')
    .addItem('Recriar botões na aba CUSTOS', 'criarBotoes')
    .addToUi();
}

function ativarAutomatico() {
  desativarAutomatico();
  ScriptApp.newTrigger('importarRomaneios').timeBased().everyMinutes(15).create();
  SpreadsheetApp.getActive().toast('Importação automática ligada: a cada 15 minutos.');
}

function desativarAutomatico() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'importarRomaneios') ScriptApp.deleteTrigger(t);
  });
}

// ---------------------------------------------------------------------------
// Configuração inicial (não apaga dados existentes)
// ---------------------------------------------------------------------------

function configurarPlanilha() {
  var ss = SpreadsheetApp.getActive();

  var leia = garantirAba(ss, ABA.LEIAME);
  if (leia.getLastRow() === 0) escreverLeiaMe(leia);

  var cfg = garantirAba(ss, ABA.CONFIG);
  if (cfg.getLastRow() === 0) {
    cfg.getRange(1, 1, 1, 3).setValues([['Parâmetro', 'Valor', 'Explicação']]);
    cfg.getRange(2, 1, CONFIG_ITENS.length, 3).setValues(CONFIG_ITENS);
    cfg.getRange(CFG_LINHA.CUSTO_OFICIAL, 2).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['ÚLTIMO PAGO', 'EFETIVO', 'MÉDIO']).build());
    [7, 10].forEach(function (l) { // "Criar SKU novo" e "Somar frete..." 
      cfg.getRange(l, 2).setDataValidation(
        SpreadsheetApp.newDataValidation().requireValueInList(['SIM', 'NÃO']).build());
    });
    estilizar(cfg, 3);
    cfg.setColumnWidth(1, 300); cfg.setColumnWidth(2, 220); cfg.setColumnWidth(3, 620);
  }

  var skus = garantirAba(ss, ABA.SKUS);
  if (skus.getLastRow() === 0) {
    skus.getRange(1, 1, 1, CAB.SKUS.length).setValues([CAB.SKUS]);
    skus.getRange('A:A').setNumberFormat('@');
    skus.getRange('C:C').setNumberFormat('@');
    skus.getRange('I1').setFormula(
      '={"Custo oficial"; MAP(A2:A, LAMBDA(s, IF(s="",, IFERROR(XLOOKUP(s, CUSTOS!A2:A, CUSTOS!L2:L), ))))}');
    skus.getRange('I2:I').setNumberFormat('R$ #,##0.00');
    estilizar(skus, CAB.SKUS.length);
  }

  var dp = garantirAba(ss, ABA.DEPARA);
  if (dp.getLastRow() === 0) {
    dp.getRange(1, 1, 1, CAB.DEPARA.length).setValues([CAB.DEPARA]);
    dp.getRange('A:F').setNumberFormat('@');
    estilizar(dp, CAB.DEPARA.length);
  }

  var ent = garantirAba(ss, ABA.ENTRADAS);
  if (ent.getLastRow() === 0) {
    ent.getRange(1, 1, 1, CAB.ENTRADAS.length).setValues([CAB.ENTRADAS]);
    ent.getRange('B:F').setNumberFormat('@');
    ent.getRange('M:M').setNumberFormat('@');
    ent.getRange('Q:Q').setNumberFormat('@');
    ent.getRange('A2:A').setNumberFormat('dd/mm/yyyy');
    ent.getRange('T2:T').setNumberFormat('dd/mm/yyyy hh:mm');
    ent.getRange('J2:K').setNumberFormat('R$ #,##0.00');
    ent.getRange('P2:P').setNumberFormat('R$ #,##0.0000');
    ent.getRange('O1').setFormula(
      '={"Qtd em un. estoque"; ARRAYFORMULA(IF(LEN(H2:H), H2:H*IF(N2:N="", 1, N2:N), ))}');
    ent.getRange('P1').setFormula(
      '={"Custo unit. pago"; ARRAYFORMULA(IF(LEN(H2:H), IF(L2:L="SIM", 0, IFERROR(K2:K/O2:O, 0)), ))}');
    ent.getRange('L2:L').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['SIM', 'NÃO']).build());
    estilizar(ent, CAB.ENTRADAS.length);
  }

  var pen = garantirAba(ss, ABA.PENDENTES);
  if (pen.getLastRow() === 0) {
    pen.getRange(1, 1, 1, CAB.PENDENTES.length).setValues([CAB.PENDENTES]);
    pen.getRange('B:F').setNumberFormat('@');
    pen.getRange('M:M').setNumberFormat('@');
    pen.getRange('P:P').setNumberFormat('@');
    pen.getRange('A2:A').setNumberFormat('dd/mm/yyyy');
    pen.getRange('J2:K').setNumberFormat('R$ #,##0.00');
    pen.getRange('O2:O').setNumberFormat('0%');
    estilizar(pen, CAB.PENDENTES.length);
    pen.getRange(1, 16).setBackground('#b45309');
  }

  var cus = garantirAba(ss, ABA.CUSTOS);
  if (cus.getLastRow() === 0) {
    cus.getRange(1, 1, 1, CAB.CUSTOS.length).setValues([CAB.CUSTOS]);
    escreverFormulasCustos(cus);
    estilizar(cus, CAB.CUSTOS.length);
  }

  var log = garantirAba(ss, ABA.LOG);
  if (log.getLastRow() === 0) {
    log.getRange(1, 1, 1, CAB.LOG.length).setValues([CAB.LOG]);
    log.getRange('A2:A').setNumberFormat('dd/mm/yyyy hh:mm');
    estilizar(log, CAB.LOG.length);
  }

  // ordem das abas
  [ABA.LEIAME, ABA.CUSTOS, ABA.SKUS, ABA.DEPARA, ABA.ENTRADAS, ABA.PENDENTES, ABA.CONFIG, ABA.LOG]
    .forEach(function (nome, i) { ss.setActiveSheet(ss.getSheetByName(nome)); ss.moveActiveSheet(i + 1); });
  var padrao = ss.getSheetByName('Página1') || ss.getSheetByName('Sheet1');
  if (padrao && padrao.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(padrao);

  garantirPastas();
  criarBotoes();
  ss.setActiveSheet(leia);
  SpreadsheetApp.getUi().alert(
    'Planilha configurada.\n\nPastas criadas no seu Drive:\n' +
    ' - Romaneios - Entrada (solte os PDFs/XMLs aqui)\n - Romaneios - Processados\n - Romaneios - Com erro\n\n' +
    'Próximo passo: menu Custos > Ativar importação automática.');
}

// Botões (imagens com script) à direita da tabela de CUSTOS. Pode rodar de novo: troca os antigos.
function criarBotoes() {
  var cus = SpreadsheetApp.getActive().getSheetByName(ABA.CUSTOS);
  if (!cus) throw new Error('Rode primeiro Custos > Configurar planilha.');
  var botoes = [['importarRomaneios', BOTAO_IMPORTAR, 2], ['processarPendentes', BOTAO_PENDENTES, 5]];
  cus.getImages().forEach(function (img) {
    var s = img.getScript();
    if (botoes.some(function (b) { return b[0] === s; })) img.remove();
  });
  var col = CAB.CUSTOS.length + 2; // deixa uma coluna vazia depois da tabela
  cus.setColumnWidth(col, 260);
  botoes.forEach(function (b) {
    var blob = Utilities.newBlob(Utilities.base64Decode(b[1]), 'image/png', b[0] + '.png');
    var img = cus.insertImage(blob, col, b[2]);
    img.setWidth(240).setHeight(44).assignScript(b[0]);
    img.setAltTextTitle(b[0] === 'importarRomaneios' ? 'Importar romaneios' : 'Processar pendentes');
  });
}

function escreverFormulasCustos(cus) {
  var linhasPagas = 'SORT(FILTER({ENTRADAS!A2:A, ENTRADAS!T2:T, ENTRADAS!P2:P, ENTRADAS!C2:C}, ' +
                    'ENTRADAS!M2:M=s, ENTRADAS!L2:L<>"SIM"), 1, FALSE, 2, FALSE)';
  var mapa = function (titulo, corpo) {
    return '={"' + titulo + '"; MAP(A2:A, LAMBDA(s, IF(s="",, ' + corpo + ')))}';
  };
  var grupo = 'INDEX(SORT(FILTER({ENTRADAS!A2:A, ENTRADAS!T2:T, ENTRADAS!Q2:Q}, ENTRADAS!M2:M=s), 1, FALSE, 2, FALSE), 1, 3)';

  cus.getRange('A1').setFormula('={"SKU"; FILTER(SKUs!A2:A, SKUs!A2:A<>"")}');
  cus.getRange('B1').setFormula(mapa('Descrição', 'XLOOKUP(s, SKUs!A2:A, SKUs!B2:B, "")'));
  cus.getRange('C1').setFormula(mapa('Último custo pago', 'IFERROR(INDEX(' + linhasPagas + ', 1, 3), )'));
  cus.getRange('D1').setFormula(mapa('Data da última compra', 'IFERROR(INDEX(' + linhasPagas + ', 1, 1), )'));
  cus.getRange('E1').setFormula(mapa('Fornecedor da última compra', 'IFERROR(INDEX(' + linhasPagas + ', 1, 4), )'));
  cus.getRange('F1').setFormula(mapa('Custo pago anterior', 'IFERROR(INDEX(' + linhasPagas + ', 2, 3), )'));
  cus.getRange('G1').setFormula(
    '={"Variação vs anterior"; MAP(C2:C, F2:F, LAMBDA(c, f, IF(OR(c="", f="", f=0),, c/f-1)))}');
  cus.getRange('H1').setFormula(mapa('Custo efetivo da última compra (com bonificação)',
    'IFERROR(LET(g, ' + grupo + ', SUMIFS(ENTRADAS!K2:K, ENTRADAS!M2:M, s, ENTRADAS!Q2:Q, g) / ' +
    'SUMIFS(ENTRADAS!O2:O, ENTRADAS!M2:M, s, ENTRADAS!Q2:Q, g)), )'));
  cus.getRange('I1').setFormula(mapa('Custo médio histórico',
    'IFERROR(SUMIFS(ENTRADAS!K2:K, ENTRADAS!M2:M, s) / SUMIFS(ENTRADAS!O2:O, ENTRADAS!M2:M, s), )'));
  cus.getRange('J1').setFormula(mapa('Qtd total recebida', 'SUMIFS(ENTRADAS!O2:O, ENTRADAS!M2:M, s)'));
  cus.getRange('K1').setFormula(mapa('Qtd recebida bonificada',
    'SUMIFS(ENTRADAS!O2:O, ENTRADAS!M2:M, s, ENTRADAS!L2:L, "SIM")'));
  cus.getRange('L1').setFormula(
    '={"Custo oficial"; MAP(C2:C, H2:H, I2:I, A2:A, LAMBDA(c, h, i, s, IF(s="",, ' +
    'SWITCH(CONFIG!$B$' + CFG_LINHA.CUSTO_OFICIAL + ', "EFETIVO", h, "MÉDIO", i, c))))}');

  cus.getRange('C2:C').setNumberFormat('R$ #,##0.00');
  cus.getRange('D2:D').setNumberFormat('dd/mm/yyyy');
  cus.getRange('F2:F').setNumberFormat('R$ #,##0.00');
  cus.getRange('G2:G').setNumberFormat('+0.0%;-0.0%;0.0%');
  cus.getRange('H2:I').setNumberFormat('R$ #,##0.00');
  cus.getRange('J2:K').setNumberFormat('#,##0.##');
  cus.getRange('L2:L').setNumberFormat('R$ #,##0.00');

  var verde = SpreadsheetApp.newConditionalFormatRule().whenNumberLessThan(0)
    .setFontColor('#15803d').setRanges([cus.getRange('G2:G')]).build();
  var vermelho = SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThan(0.05)
    .setFontColor('#b91c1c').setRanges([cus.getRange('G2:G')]).build();
  cus.setConditionalFormatRules([verde, vermelho]);
}

function escreverLeiaMe(sh) {
  var t = [
    ['PLANILHA DE CUSTOS POR ROMANEIO DE ENTRADA'],
    [''],
    ['COMO USAR'],
    ['1. Solte o PDF do romaneio (ou, melhor ainda, o XML da NF-e) na pasta "Romaneios - Entrada" do seu Drive.'],
    ['2. A cada 15 minutos a planilha lê o arquivo, grava os itens em ENTRADAS e move o arquivo para "Romaneios - Processados".'],
    ['3. Abra PENDENTES de vez em quando. Para cada linha, escreva na coluna laranja o SKU certo (ou NOVO) e rode Custos > Processar PENDENTES preenchidos.'],
    ['4. O custo de cada SKU aparece em CUSTOS e na coluna "Custo oficial" de SKUs.'],
    [''],
    ['COMO O PRODUTO É RECONHECIDO (nesta ordem)'],
    ['0. Romaneio do VarejoFácil: o código do produto que vem no romaneio (00000000100463 -> 100463) já é o seu SKU. Se ainda não existir em SKUs, é criado com esse código.'],
    ['1. DE_PARA: fornecedor + código do produto no fornecedor. É o vínculo mais seguro e fica salvo para sempre.'],
    ['2. EAN (código de barras), se for válido e estiver cadastrado em SKUs.'],
    ['3. Descrição idêntica (ignorando acentos, maiúsculas e pontuação).'],
    ['4. Descrição parecida: NÃO é aplicada sozinha. Vai para PENDENTES com a sugestão, para você confirmar.'],
    ['5. Nada parecido: vira SKU novo em SKUs (status NOVO - REVISAR).'],
    ['Nos casos 2, 3, 4 e 5 o vínculo é salvo em DE_PARA, então da próxima vez o mesmo item do mesmo fornecedor cai direto no caso 1.'],
    ['Tamanhos diferentes (350ML x 2L, 1KG x 5KG) derrubam a similaridade pela metade, para não misturar variações do mesmo produto.'],
    [''],
    ['BONIFICAÇÃO'],
    ['Item bonificado (CFOP 5910/6910, texto BONIF ou valor zero) entra com "Valor pago" = 0. Ele nunca vira o "Último custo pago".'],
    ['A quantidade bonificada entra no estoque e dilui o custo: CUSTOS mostra o custo pago, o efetivo da última compra e o médio histórico.'],
    ['Se a bonificação veio em nota separada, escreva em "Grupo de compra" (ENTRADAS) o número do documento da compra. Assim ela dilui aquela compra.'],
    ['Escolha em CONFIG qual custo é o oficial: ÚLTIMO PAGO (padrão), EFETIVO ou MÉDIO.'],
    [''],
    ['CAIXA x UNIDADE'],
    ['Se o fornecedor vende em caixa e você controla em unidade, ponha o fator em DE_PARA (ex.: CX com 12 = 12). O custo passa a ser por unidade.'],
    ['Quando a unidade do documento é diferente da unidade do SKU, o vínculo fica marcado "VERIFICAR FATOR" em DE_PARA.'],
    [''],
    ['NÃO APAGUE nem escreva nas colunas "Qtd em un. estoque" e "Custo unit. pago" de ENTRADAS, nem nas colunas de CUSTOS: são fórmulas.']
  ];
  sh.getRange(1, 1, t.length, 1).setValues(t);
  sh.setColumnWidth(1, 1000);
  sh.getRange('A1').setFontSize(14).setFontWeight('bold');
  [3, 9, 19, 25].forEach(function (l) { sh.getRange(l, 1).setFontWeight('bold').setBackground('#e5e7eb'); });
  sh.getRange('A29').setFontColor('#b91c1c');
}

function garantirAba(ss, nome) {
  return ss.getSheetByName(nome) || ss.insertSheet(nome);
}

function estilizar(sh, ncols) {
  sh.getRange(1, 1, 1, ncols).setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff').setWrap(true);
  sh.setFrozenRows(1);
  sh.getRange(1, 1, sh.getMaxRows(), ncols).setFontFamily('Arial');
  for (var c = 1; c <= ncols; c++) sh.setColumnWidth(c, 140);
}

function garantirPastas() {
  var nomes = [[2, 'Romaneios - Entrada'], [3, 'Romaneios - Processados'], [4, 'Romaneios - Com erro']];
  var cfg = SpreadsheetApp.getActive().getSheetByName(ABA.CONFIG);
  nomes.forEach(function (n) {
    var id = String(cfg.getRange(n[0], 2).getValue()).trim();
    if (id) { try { DriveApp.getFolderById(id); return; } catch (e) {} }
    var it = DriveApp.getFoldersByName(n[1]);
    var pasta = it.hasNext() ? it.next() : DriveApp.createFolder(n[1]);
    cfg.getRange(n[0], 2).setValue(pasta.getId());
  });
}

function lerConfig() {
  var v = SpreadsheetApp.getActive().getSheetByName(ABA.CONFIG).getRange(2, 2, CONFIG_ITENS.length, 1).getValues();
  return {
    pastaEntrada: String(v[0][0]).trim(),
    pastaProcessados: String(v[1][0]).trim(),
    pastaErro: String(v[2][0]).trim(),
    limiar: Number(v[4][0]) || 0.55,
    criarNovo: String(v[5][0]).toUpperCase() !== 'NÃO',
    prefixo: String(v[6][0] || 'NOVO-'),
    cfopsBonif: String(v[7][0]).split(/[^\d]+/).filter(String),
    somarImpostos: String(v[8][0]).toUpperCase() !== 'NÃO',
    cnpjProprio: soDigitos(v[9][0])
  };
}

// ---------------------------------------------------------------------------
// Importação
// ---------------------------------------------------------------------------

function importarRomaneios() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) { // já tem uma importação rodando
    SpreadsheetApp.getActive().toast('Já tem uma importação em andamento. Tente de novo em 1 minuto.');
    return;
  }
  try {
    garantirPastas();
    var cfg = lerConfig();
    var entrada = DriveApp.getFolderById(cfg.pastaEntrada);
    var ctx = carregarContexto(cfg);
    var arquivos = entrada.getFiles();
    var n = 0;
    while (arquivos.hasNext()) {
      var arq = arquivos.next();
      var tipo = arq.getMimeType();
      var ehXml = /xml/i.test(tipo) || /\.xml$/i.test(arq.getName());
      var ehPdf = tipo === MimeType.PDF || /\.pdf$/i.test(arq.getName());
      if (!ehXml && !ehPdf) continue;
      importarArquivo(arq, ehXml, cfg, ctx);
      n++;
    }
    SpreadsheetApp.getActive().toast(n ? n + ' arquivo(s) processado(s). Veja a aba LOG.'
                                       : 'Nenhum PDF ou XML novo na pasta Romaneios - Entrada.');
  } finally {
    lock.releaseLock();
  }
}

function importarArquivo(arq, ehXml, cfg, ctx) {
  var nome = arq.getName();
  try {
    var doc = ehXml ? lerXmlNfe(arq.getBlob().getDataAsString('UTF-8'), cfg)
                    : lerPdf(arq, cfg);
    if (!doc.numero) doc.numero = nome.replace(/\.[^.]+$/, '');
    if (!doc.data) doc.data = new Date();

    if (!doc.itens.length) {
      registrarLog(nome, arq.getId(), 'ERRO', 0, 0, 0, 0,
        'Nenhum item reconhecido. Se for PDF escaneado ou layout diferente, envie o XML da NF-e.');
      moverPara(arq, cfg.pastaErro);
      return;
    }
    if (ctx.docsImportados[chaveDoc(doc)]) {
      registrarLog(nome, arq.getId(), 'DUPLICADO', doc.itens.length, 0, 0, 0,
        'Documento ' + doc.numero + ' deste fornecedor já foi importado.');
      moverPara(arq, cfg.pastaProcessados);
      return;
    }

    var agora = new Date();
    var linhasEnt = [], linhasEntExtra = [], linhasPen = [], novos = 0;
    doc.itens.forEach(function (it) {
      var r = casarItem(it, doc, ctx, cfg);
      if (r.tipo === 'PENDENTE') {
        linhasPen.push([doc.data, doc.numero, doc.fornecedor, doc.cnpj, it.cod, it.ean, it.desc,
          it.qtd, it.unid, it.vUnit, it.bonif ? 0 : it.vTotal, it.bonif ? 'SIM' : 'NÃO',
          r.sugestao || '', r.sugestaoDesc || '', r.score || '', '', '', nome]);
        return;
      }
      if (r.novo) novos++;
      linhasEnt.push([doc.data, doc.numero, doc.fornecedor, doc.cnpj, it.cod, it.ean, it.desc,
        it.qtd, it.unid, it.vUnit, it.bonif ? 0 : it.vTotal, it.bonif ? 'SIM' : 'NÃO', r.sku, r.fator]);
      linhasEntExtra.push([doc.numero, r.como, nome, agora]);
    });

    gravarEntradas(linhasEnt, linhasEntExtra);
    anexar(ABA.PENDENTES, linhasPen);
    gravarNovosVinculos(ctx);
    ctx.docsImportados[chaveDoc(doc)] = true;

    registrarLog(nome, arq.getId(), 'OK', doc.itens.length, linhasEnt.length, linhasPen.length, novos,
      'Doc ' + doc.numero + ' | ' + (doc.fornecedor || 'fornecedor não identificado') + (ehXml ? ' | XML' : ' | PDF'));
    moverPara(arq, cfg.pastaProcessados);
  } catch (e) {
    registrarLog(nome, arq.getId(), 'ERRO', 0, 0, 0, 0, String(e && e.message || e));
    moverPara(arq, cfg.pastaErro);
  }
}

function chaveDoc(doc) {
  return (soDigitos(doc.cnpj) || normalizar(doc.fornecedor)) + '|' + String(doc.numero).replace(/^0+/, '');
}

function moverPara(arq, pastaId) {
  if (pastaId) arq.moveTo(DriveApp.getFolderById(pastaId));
}

function registrarLog(nome, id, status, lidos, ent, pen, novos, msg) {
  anexar(ABA.LOG, [[new Date(), nome, id, status, lidos, ent, pen, novos, msg]]);
}

function ultimaLinhaColA(sh) {
  var n = sh.getLastRow();
  if (n < 2) return 1;
  var v = sh.getRange(1, 1, n, 1).getValues();
  for (var i = v.length - 1; i >= 0; i--) if (v[i][0] !== '') return i + 1;
  return 1;
}

function anexar(nomeAba, linhas) {
  if (!linhas.length) return;
  var sh = SpreadsheetApp.getActive().getSheetByName(nomeAba);
  var ini = ultimaLinhaColA(sh) + 1;
  sh.getRange(ini, 1, linhas.length, linhas[0].length).setValues(linhas);
}

// ENTRADAS: escreve A:N e Q:T, pulando O:P (fórmulas)
function gravarEntradas(linhas, extras) {
  if (!linhas.length) return;
  var sh = SpreadsheetApp.getActive().getSheetByName(ABA.ENTRADAS);
  var ini = ultimaLinhaColA(sh) + 1;
  sh.getRange(ini, 1, linhas.length, 14).setValues(linhas);
  sh.getRange(ini, 17, extras.length, 4).setValues(extras);
}

// ---------------------------------------------------------------------------
// Correspondência (matching)
// ---------------------------------------------------------------------------

function carregarContexto(cfg) {
  var ss = SpreadsheetApp.getActive();
  var ctx = {
    skus: {}, porEan: {}, porDesc: {}, listaSkus: [],
    depara: {}, deparaDesc: {}, deparaEan: {},
    novosSkus: [], novosVinculos: [], docsImportados: {}, maiorSeqNovo: 0
  };

  var s = ss.getSheetByName(ABA.SKUS);
  var vs = s.getLastRow() > 1 ? s.getRange(2, 1, s.getLastRow() - 1, 4).getValues() : [];
  vs.forEach(function (r) { if (r[0] !== '') indexarSku(ctx, String(r[0]).trim(), String(r[1]), String(r[2]), String(r[3]), cfg); });

  var d = ss.getSheetByName(ABA.DEPARA);
  var vd = d.getLastRow() > 1 ? d.getRange(2, 1, d.getLastRow() - 1, 7).getValues() : [];
  vd.forEach(function (r) {
    if (r[5] === '') return;
    indexarVinculo(ctx, String(r[0]), String(r[1]), String(r[2]), String(r[3]), String(r[4]),
      String(r[5]).trim(), Number(r[6]) || 1);
  });

  [ABA.ENTRADAS, ABA.PENDENTES].forEach(function (nome) {
    var sh = ss.getSheetByName(nome);
    if (sh.getLastRow() < 2) return;
    sh.getRange(2, 2, sh.getLastRow() - 1, 3).getValues().forEach(function (r) {
      if (r[0] !== '') ctx.docsImportados[chaveDoc({ numero: r[0], fornecedor: r[1], cnpj: r[2] })] = true;
    });
  });
  return ctx;
}

function chaveFornecedor(cnpj, nome) {
  return soDigitos(cnpj) || normalizar(nome);
}

function indexarSku(ctx, sku, desc, eans, unid, cfg) {
  ctx.skus[sku] = { desc: desc, unid: String(unid || '').toUpperCase() };
  ctx.listaSkus.push({ sku: sku, desc: desc, norm: normalizar(desc) });
  String(eans).split(/[,;\s]+/).forEach(function (e) { if (gtinValido(e)) ctx.porEan[soDigitos(e)] = sku; });
  if (normalizar(desc)) ctx.porDesc[normalizar(desc)] = sku;
  if (cfg && sku.indexOf(cfg.prefixo) === 0) {
    var n = parseInt(sku.slice(cfg.prefixo.length), 10);
    if (n > ctx.maiorSeqNovo) ctx.maiorSeqNovo = n;
  }
}

function indexarVinculo(ctx, cnpj, forn, cod, ean, desc, sku, fator) {
  var f = chaveFornecedor(cnpj, forn);
  var v = { sku: sku, fator: fator || 1 };
  if (String(cod).trim()) ctx.depara[f + '|' + String(cod).trim().toUpperCase()] = v;
  if (normalizar(desc)) ctx.deparaDesc[f + '|' + normalizar(desc)] = v;
  if (gtinValido(ean)) ctx.deparaEan[soDigitos(ean)] = v;
}

/**
 * Retorna {tipo:'OK', sku, fator, como, novo} ou {tipo:'PENDENTE', sugestao, sugestaoDesc, score}
 */
function casarItem(it, doc, ctx, cfg) {
  var f = chaveFornecedor(doc.cnpj, doc.fornecedor);
  var norm = normalizar(it.desc);
  var v;

  // 0. romaneio do ERP já traz o código interno do produto: é o próprio SKU
  if (it.codInterno) {
    var existente = acharSkuPorCodigo(ctx, it.codInterno);
    if (existente) return ok(existente, it.fator, 'CÓDIGO INTERNO');
    var criado = criarSku(ctx, cfg, it.desc, it.ean, it.unid, 'Romaneio ' + doc.numero, it.codInterno);
    return { tipo: 'OK', sku: criado, fator: it.fator || 1, como: 'CÓDIGO INTERNO (SKU NOVO)', novo: true };
  }

  // 1. vínculo salvo: fornecedor + código
  if (it.cod && (v = ctx.depara[f + '|' + String(it.cod).toUpperCase()])) return ok(v.sku, v.fator, 'DE_PARA (código)');
  // 1b. vínculo salvo: fornecedor + descrição (romaneios sem código)
  if (norm && (v = ctx.deparaDesc[f + '|' + norm])) return ok(v.sku, v.fator, 'DE_PARA (descrição)');

  // 2. EAN
  var ean = gtinValido(it.ean) ? soDigitos(it.ean) : '';
  if (ean && ctx.porEan[ean]) return vincular(ctx.porEan[ean], 'EAN');
  if (ean && (v = ctx.deparaEan[ean])) return vincular(v.sku, 'EAN (outro fornecedor)');

  // 3. descrição idêntica
  if (norm && ctx.porDesc[norm]) return vincular(ctx.porDesc[norm], 'DESCRIÇÃO IDÊNTICA');

  // 4. descrição parecida -> PENDENTES
  var melhor = { sku: '', desc: '', score: 0 };
  ctx.listaSkus.forEach(function (s) {
    var sc = similaridade(norm, s.norm);
    if (sc > melhor.score) melhor = { sku: s.sku, desc: s.desc, score: sc };
  });
  if (melhor.score >= cfg.limiar || !cfg.criarNovo) {
    return { tipo: 'PENDENTE', sugestao: melhor.sku, sugestaoDesc: melhor.desc,
             score: melhor.score ? Math.round(melhor.score * 100) / 100 : '' };
  }

  // 5. SKU novo
  var sku = criarSku(ctx, cfg, it.desc, ean, it.unid, 'Romaneio ' + doc.numero);
  var r = vincular(sku, 'NOVO SKU');
  r.novo = true;
  return r;

  function ok(sku, fator, como) { return { tipo: 'OK', sku: sku, fator: fator || 1, como: como }; }
  function vincular(sku, como) {
    var unidSku = (ctx.skus[sku] || {}).unid;
    var unidDoc = String(it.unid || '').toUpperCase();
    var conferido = (como === 'NOVO SKU' || como === 'MANUAL') ? 'SIM' : 'AUTO';
    if (unidSku && unidDoc && mesmaUnidade(unidSku, unidDoc) === false) conferido = 'VERIFICAR FATOR';
    ctx.novosVinculos.push([doc.cnpj, doc.fornecedor, it.cod, ean, it.desc, sku, 1, como, conferido, new Date()]);
    indexarVinculo(ctx, doc.cnpj, doc.fornecedor, it.cod, ean, it.desc, sku, 1);
    return ok(sku, 1, como);
  }
}

// Aceita o código com ou sem zeros à esquerda (00000000100463 = 100463)
function acharSkuPorCodigo(ctx, cod) {
  var c = String(cod).trim(), semZeros = c.replace(/^0+(?=\d)/, '');
  if (ctx.skus[c]) return c;
  if (ctx.skus[semZeros]) return semZeros;
  for (var k in ctx.skus) if (/^\d+$/.test(k) && k.replace(/^0+(?=\d)/, '') === semZeros) return k;
  return '';
}

function criarSku(ctx, cfg, desc, ean, unid, origem, codigo) {
  var sku = codigo;
  if (!sku) {
    ctx.maiorSeqNovo++;
    sku = cfg.prefixo + ('00000' + ctx.maiorSeqNovo).slice(-5);
  }
  var linha = [sku, desc, ean || '', String(unid || '').toUpperCase(), '', 'NOVO - REVISAR', new Date(), origem];
  anexar(ABA.SKUS, [linha]);
  indexarSku(ctx, sku, desc, ean || '', unid, null);
  return sku;
}

function gravarNovosVinculos(ctx) {
  anexar(ABA.DEPARA, ctx.novosVinculos);
  ctx.novosVinculos = [];
}

function mesmaUnidade(a, b) {
  var grupo = function (u) {
    u = String(u).toUpperCase();
    if (/^(UN|UND|UNID|UNI|PC)$/.test(u)) return 'UN';
    if (/^(CX|CXA)$/.test(u)) return 'CX';
    if (/^(FD|FDO)$/.test(u)) return 'FD';
    if (/^(PCT|PCTE)$/.test(u)) return 'PCT';
    if (/^(L|LT)$/.test(u)) return 'L';
    return u;
  };
  return grupo(a) === grupo(b);
}

// ---------------------------------------------------------------------------
// PENDENTES
// ---------------------------------------------------------------------------

function processarPendentes() {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var ss = SpreadsheetApp.getActive();
    var sh = ss.getSheetByName(ABA.PENDENTES);
    var n = ultimaLinhaColA(sh);
    if (n < 2) { ss.toast('PENDENTES está vazia.'); return; }
    var cfg = lerConfig();
    var ctx = carregarContexto(cfg);
    var v = sh.getRange(2, 1, n - 1, CAB.PENDENTES.length).getValues();
    var agora = new Date(), ent = [], extra = [], apagar = [], erros = [];

    v.forEach(function (r, i) {
      var escolha = String(r[15]).trim();
      if (!escolha) return;
      var doc = { numero: r[1], fornecedor: r[2], cnpj: r[3] };
      var fator = Number(r[16]) || 1;
      var sku;
      if (escolha.toUpperCase() === 'NOVO') {
        sku = criarSku(ctx, cfg, r[6], gtinValido(r[5]) ? soDigitos(r[5]) : '', r[8], 'PENDENTES');
      } else if (acharSkuPorCodigo(ctx, escolha)) {
        sku = acharSkuPorCodigo(ctx, escolha);
      } else {
        erros.push('Linha ' + (i + 2) + ': SKU "' + escolha + '" não existe em SKUs.');
        return;
      }
      ctx.novosVinculos.push([r[3], r[2], r[4], gtinValido(r[5]) ? soDigitos(r[5]) : '', r[6], sku, fator,
        escolha.toUpperCase() === 'NOVO' ? 'NOVO SKU' : 'MANUAL', 'SIM', agora]);
      ent.push([r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], sku, fator]);
      extra.push([r[1], 'MANUAL', r[17], agora]);
      apagar.push(i + 2);
    });

    gravarEntradas(ent, extra);
    gravarNovosVinculos(ctx);
    apagar.reverse().forEach(function (l) { sh.deleteRow(l); });
    SpreadsheetApp.getUi().alert(ent.length + ' linha(s) movida(s) para ENTRADAS.' +
      (erros.length ? '\n\nNão processadas:\n' + erros.join('\n') : ''));
  } finally {
    lock.releaseLock();
  }
}

// ---------------------------------------------------------------------------
// Leitura de XML de NF-e (mais confiável que PDF)
// ---------------------------------------------------------------------------

function lerXmlNfe(xml, cfg) {
  var root = XmlService.parse(xml).getRootElement();
  var infNFe = achar(root, 'infNFe');
  if (!infNFe) throw new Error('XML não é uma NF-e.');
  var ide = achar(infNFe, 'ide'), emit = achar(infNFe, 'emit');
  var doc = {
    numero: txt(ide, 'nNF'),
    data: dataIso(txt(ide, 'dhEmi') || txt(ide, 'dEmi')),
    fornecedor: txt(emit, 'xNome'),
    cnpj: txt(emit, 'CNPJ') || txt(emit, 'CPF'),
    itens: []
  };
  var natBonif = /BONIFICA/i.test(txt(ide, 'natOp'));
  infNFe.getChildren().forEach(function (det) {
    if (det.getName() !== 'det') return;
    var p = achar(det, 'prod'), imp = achar(det, 'imposto');
    var n = function (el, nome) { return Number(txt(el, nome)) || 0; };
    var total = n(p, 'vProd') - n(p, 'vDesc');
    if (cfg.somarImpostos) {
      total += n(p, 'vFrete') + n(p, 'vSeg') + n(p, 'vOutro');
      if (imp) total += somaTag(imp, 'vIPI') + somaTag(imp, 'vICMSST') + somaTag(imp, 'vFCPST');
    }
    var cfop = txt(p, 'CFOP');
    var ean = txt(p, 'cEAN');
    doc.itens.push({
      cod: txt(p, 'cProd'),
      ean: gtinValido(ean) ? ean : (gtinValido(txt(p, 'cEANTrib')) ? txt(p, 'cEANTrib') : ''),
      desc: txt(p, 'xProd'),
      qtd: n(p, 'qCom'),
      unid: txt(p, 'uCom').toUpperCase(),
      vUnit: n(p, 'vUnCom'),
      vTotal: Math.round(total * 100) / 100,
      bonif: natBonif || cfg.cfopsBonif.indexOf(cfop) >= 0
    });
  });
  return doc;
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
function somaTag(el, nome) {
  var s = el.getName() === nome ? Number(el.getText()) || 0 : 0;
  el.getChildren().forEach(function (c) { s += somaTag(c, nome); });
  return s;
}
function dataIso(s) {
  var m = String(s).match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}

// ---------------------------------------------------------------------------
// Leitura de PDF
// ---------------------------------------------------------------------------

// 1º tenta ler o texto direto do PDF (exato, com a posição de cada pedaço de texto).
// 2º se não achar itens, usa a conversão do Google (serve para PDF escaneado).
// Se nenhum der certo, grava o texto lido na aba DIAGNOSTICO para ajuste do leitor.
function lerPdf(arq, cfg) {
  var textos = [];
  try {
    var t1 = textoPdfDireto(arq.getBlob().getBytes());
    textos.push(['LEITURA DIRETA'].concat(t1.split('\n')));
    var d1 = lerPdfRomaneio(t1, cfg);
    if (d1.itens.length) return d1;
  } catch (e) {
    textos.push(['LEITURA DIRETA: erro ' + (e && e.message || e)]);
  }
  var t2 = extrairTextoPdf(arq);
  textos.push(['CONVERSÃO DO GOOGLE'].concat(t2.split('\n')));
  var d2 = lerPdfRomaneio(t2, cfg);
  if (!d2.itens.length) gravarDiagnostico(arq.getName(), textos);
  return d2;
}

function gravarDiagnostico(nome, blocos) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName('DIAGNOSTICO') || ss.insertSheet('DIAGNOSTICO');
  sh.clear();
  var linhas = [['Texto lido de ' + nome + ' em ' + new Date().toLocaleString('pt-BR')]];
  blocos.forEach(function (b) { linhas.push(['']); b.forEach(function (l) { linhas.push([String(l).slice(0, 5000)]); }); });
  sh.getRange(1, 1, linhas.length, 1).setNumberFormat('@').setValues(linhas);
  sh.setColumnWidth(1, 1400);
}

// ---------------------------------------------------------------------------
// Leitor de PDF próprio: descompacta as páginas, pega cada texto com sua
// posição (x, y) e remonta as linhas da esquerda para a direita, de cima para baixo.
// Funciona para PDFs gerados por sistema (como o VarejoFácil), não para escaneados.
// ---------------------------------------------------------------------------

function textoPdfDireto(bytes) {
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
    var conteudo = dados.slice(ini, fim);
    try {
      if (/FlateDecode/.test(dict)) conteudo = inflar(conteudo.slice(2)); // pula o cabeçalho zlib
      else if (/\/Filter/.test(dict)) continue;                         // outro filtro: imagem etc.
    } catch (e) { continue; }
    var txt = bytesParaTexto(conteudo);
    if (/\bBT\b/.test(txt) && /T[jJ]/.test(txt)) paginas.push(linhasDoConteudo(txt));
    re.lastIndex = fim;
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

// Converte o PDF em Google Doc (com OCR, serve até para PDF escaneado),
// pega o texto e apaga o Doc temporário. Requer o serviço avançado "Drive API".
function extrairTextoPdf(arq) {
  var tmp = Drive.Files.create(
    { name: 'tmp-romaneio-' + arq.getId(), mimeType: MimeType.GOOGLE_DOCS },
    arq.getBlob(), { ocrLanguage: 'pt' });
  try {
    var body = DocumentApp.openById(tmp.id).getBody();
    var linhas = [];
    for (var i = 0; i < body.getNumChildren(); i++) {
      var el = body.getChild(i);
      if (el.getType() === DocumentApp.ElementType.TABLE) {
        // cada linha de tabela vira uma linha de texto, células separadas por " | "
        var tab = el.asTable();
        for (var r = 0; r < tab.getNumRows(); r++) {
          var row = tab.getRow(r), cels = [];
          for (var c = 0; c < row.getNumCells(); c++) cels.push(row.getCell(c).getText().replace(/\n/g, ' '));
          linhas.push(cels.join(' | '));
        }
      } else if (el.getText) {
        linhas.push(el.getText());
      }
    }
    return linhas.join('\n');
  } finally {
    DriveApp.getFileById(tmp.id).setTrashed(true);
  }
}

function lerPdfRomaneio(texto, cfg) {
  var doc = lerRomaneioVarejoFacil(texto, cfg);
  return doc.itens.length ? doc : lerTextoRomaneio(texto, cfg);
}

/**
 * "ROMANEIO NOTA DE ENTRADA" do VarejoFácil. Cada item:
 *   1 * 00000000100463 - BT SHIMMER BLUSH BAKED 150,0000 UN/1,0000 35,31 0,00 0,00 5.296,50 0,00 35,31 ...
 *   QUARTZO 8G                      <- resto da descrição, na linha de baixo
 * Colunas depois da embalagem: Valor Unit., Desc %, IPI, Valor Total, Custo Anterior,
 * Custo Reposição, Variação %, Preço Venda, Margem Pratic. %, Margem Cad. %, Sugestão.
 * O texto é achatado numa linha só, então tanto faz como o PDF quebrou as linhas.
 */
function lerRomaneioVarejoFacil(texto, cfg) {
  var doc = { numero: '', data: null, fornecedor: '', cnpj: '', chave: '', itens: [] };
  var t = String(texto);
  var m;
  if ((m = t.match(/N[º°o]\s*(\d+)\s*S[ée]rie/i))) doc.numero = m[1];
  if ((m = t.match(/Data\s+Entrada:?\s*(\d{2})\/(\d{2})\/(\d{4})/i)) ||
      (m = t.match(/Data\s+Emiss[ãa]o:?\s*(\d{2})\/(\d{2})\/(\d{4})/i))) {
    doc.data = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  }
  if ((m = t.match(/Fornecedor:?\s*\d+\s*-\s*([^\n]+)/i))) {
    doc.fornecedor = m[1].replace(/\s+(S\s*N\s*e\s*F|Local:|Loja:|Comprador:|Chave|Cadastrado|Alterado)[\s\S]*$/i, '').trim();
  }
  if ((m = t.replace(/\s/g, '').match(/Chave(?:NF-?e)?:?(\d{44})/i))) {
    doc.chave = m[1];
    doc.cnpj = m[1].substr(6, 14); // posições 7 a 20 da chave = CNPJ do emitente
  }
  var bonifDoc = /Opera[çc][ãa]o:?[^\n]{0,40}BONIFICA/i.test(t);
  if ((m = t.match(/CFOP:?\s*(\d{4})/i)) && cfg.cfopsBonif.indexOf(m[1]) >= 0) bonifDoc = true;

  var plano = t
    .replace(/\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}\s+varejofacil\s*-?\s*[\d.]*/gi, ' ') // rodapé de página
    .replace(/S\s*N\s*e\s*F\s*q\.[\s\S]*?Sugest[ãa]o/g, ' ')                        // cabeçalho da tabela
    .replace(/Seq\.[\s\S]{0,300}?Custo \(%\)/g, ' ')                                   // cabeçalho (leitura direta)
    .replace(/\s*\|\s*/g, ' ')
    .replace(/\s+/g, ' ');
  var NUM = '-?\\d[\\d.]*,\\d+';
  var re = new RegExp('(?:^|\\s)(\\d{1,4}) (\\* )?(\\d{5,14}) - (.+?) (' + NUM + ') ([A-Za-z]{1,5})\\/(' + NUM + ')' +
    '((?: ' + NUM + ')+)(.*?)(?=\\s\\d{1,4} (?:\\* )?\\d{5,14} - |\\sQtd\\. de itens|$)', 'g');
  while ((m = re.exec(plano))) {
    var nums = m[8].trim().split(' ').map(numeroBR);
    var qtd = numeroBR(m[5]);
    if (nums.length < 4 || !qtd) continue;
    var vUnit = nums[0], total = nums[3];
    var resto = m[9].replace(/(Valores|Base ICMS|Observa[çc][ãa]o|Loja:|ROMANEIO).*$/i, '').trim();
    doc.itens.push({
      cod: '',
      codInterno: m[3].replace(/^0+(?=\d)/, ''),
      ean: '',
      desc: (m[4] + ' ' + resto).replace(/\s+/g, ' ').trim(),
      qtd: qtd,
      unid: m[6].toUpperCase(),
      fator: numeroBR(m[7]) || 1,
      vUnit: vUnit,
      vTotal: total,
      bonif: bonifDoc || total === 0 || vUnit === 0
    });
  }
  return doc;
}

/**
 * Lê o texto de um romaneio de layout desconhecido.
 * Uma linha é item quando tem três números em que Qtd x Valor unit. = Total.
 */
function lerTextoRomaneio(texto, cfg) {
  var linhas = String(texto).split(/\n/);
  var doc = { numero: '', data: null, fornecedor: '', cnpj: '', itens: [] };

  var cnpjs = (texto.match(/\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/g) || [])
    .map(soDigitos).filter(function (c) { return c.length === 14 && c !== cfg.cnpjProprio; });
  doc.cnpj = cnpjs[0] || '';

  for (var i = 0; i < linhas.length && i < 60; i++) {
    var l = linhas[i];
    var m;
    if (!doc.fornecedor && (m = l.match(/(fornecedor|emitente|raz[aã]o social|remetente)\s*[:\-]?\s*(.+)/i))) {
      doc.fornecedor = m[2].replace(/\|.*$/, '').replace(/CNPJ.*$/i, '').replace(/[\d.\/-]{14,}.*$/, '').trim();
    }
    if (!doc.numero && (m = l.match(/(romaneio|pedido|nota fiscal|nf-?e?|n[ºo°]\.?)\s*(n[ºo°]\.?)?\s*[:\-]?\s*(\d[\d.]{2,})/i))) {
      doc.numero = m[3].replace(/\./g, '');
    }
    if (!doc.data && (m = l.match(/(\d{2})\/(\d{2})\/(\d{4})/))) {
      doc.data = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    }
  }

  var docBonif = /natureza[^\n]{0,60}bonifica/i.test(texto);
  linhas.forEach(function (l) {
    var it = lerLinhaItem(l, cfg);
    if (!it) return;
    if (docBonif) it.bonif = true;
    doc.itens.push(it);
  });
  return doc;
}

function lerLinhaItem(linha, cfg) {
  var bruto = String(linha).replace(/R\$\s*/g, '').trim();
  if (!bruto) return null;
  var toks = bruto.split(/\s*\|\s*|\s+/).filter(String);

  var nums = [];
  toks.forEach(function (t, i) {
    if (!/^-?[\d.,]+$/.test(t) || !/\d/.test(t)) return;
    var so = soDigitos(t);
    if (t.indexOf(',') < 0 && so.length >= 7) return; // EAN, NCM, CNPJ
    var v = numeroBR(t);
    if (v === null) return;
    nums.push({ i: i, v: v, dec: t.indexOf(',') >= 0 || v === 0 });
  });
  if (nums.length < 3) return null;

  // procura qtd x unit = total; prefere colunas mais próximas
  var melhor = null;
  for (var a = 0; a < nums.length; a++) for (var b = a + 1; b < nums.length; b++) for (var c = b + 1; c < nums.length; c++) {
    var q = nums[a], u = nums[b], t = nums[c];
    if (!u.dec || !t.dec || q.v <= 0) continue;
    var ok = (u.v === 0 && t.v === 0) || (t.v > 0 && Math.abs(q.v * u.v - t.v) <= Math.max(0.02, t.v * 0.005));
    if (!ok) continue;
    var span = t.i - q.i;
    if (!melhor || span < melhor.span || (span === melhor.span && t.i > melhor.t.i)) melhor = { q: q, u: u, t: t, span: span };
  }
  if (!melhor) return null;

  var antes = toks.slice(0, melhor.q.i);
  var ean = '', cod = '', unid = '', desc = [], bonif = /BONIF/i.test(bruto);
  toks.forEach(function (t) {
    if (!ean && gtinValido(t)) ean = soDigitos(t);
    if (cfg && cfg.cfopsBonif.indexOf(t) >= 0) bonif = true;
  });
  toks.slice(melhor.q.i + 1, melhor.u.i).concat(antes).forEach(function (t) {
    if (!unid && UNIDADES.indexOf(t.toUpperCase()) >= 0) unid = t.toUpperCase();
  });

  var inicio = 0;
  if (/^\d{1,3}$/.test(antes[0] || '') && antes.length > 2) inicio = 1; // nº do item
  if (antes[inicio] && /\d/.test(antes[inicio]) && /^[A-Z0-9.\-\/]{2,20}$/i.test(antes[inicio]) && !gtinValido(antes[inicio])) {
    cod = antes[inicio];
    inicio++;
  }
  antes.slice(inicio).forEach(function (t, k) {
    var so = soDigitos(t);
    if (gtinValido(t)) return;
    if (/^\d+$/.test(t) && so.length >= 5) return;          // NCM etc.
    if (/^[56]\d{3}$/.test(t)) return;                      // CFOP
    if (k === antes.length - inicio - 1 && UNIDADES.indexOf(t.toUpperCase()) >= 0) return; // unidade logo antes da qtd
    desc.push(t);
  });
  var descStr = desc.join(' ').trim();
  if ((descStr.match(/[A-Za-zÀ-ú]/g) || []).length < 3) return null;
  if (/^(sub)?total|^valor|^frete|^desconto|^base de c/i.test(normalizar(descStr))) return null;

  return {
    cod: cod, ean: ean, desc: descStr, qtd: melhor.q.v, unid: unid,
    vUnit: melhor.u.v, vTotal: melhor.t.v, bonif: bonif || (melhor.u.v === 0 && melhor.t.v === 0)
  };
}

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

function soDigitos(s) { return String(s == null ? '' : s).replace(/\D/g, ''); }

function numeroBR(t) {
  t = String(t).trim();
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) return Number(t.replace(/\./g, '').replace(',', '.'));
  if (/^-?\d+(,\d+)?$/.test(t)) return Number(t.replace(',', '.'));
  if (/^-?\d+\.\d{1,2}$/.test(t)) return Number(t);
  return null;
}

function gtinValido(s) {
  var d = soDigitos(s);
  if (String(s).trim() !== d) return false;
  if ([8, 12, 13, 14].indexOf(d.length) < 0 || /^0+$/.test(d)) return false;
  var soma = 0;
  for (var i = d.length - 2, peso = 3; i >= 0; i--, peso = peso === 3 ? 1 : 3) soma += Number(d[i]) * peso;
  return (10 - (soma % 10)) % 10 === Number(d[d.length - 1]);
}

function normalizar(s) {
  return String(s == null ? '' : s).toUpperCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/(\d)\s+(ML|L|LT|G|GR|KG|MG|UN|UND|M|CM|MM)\b/g, '$1$2')
    .replace(/[^A-Z0-9.]+/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

/**
 * 0 a 1. Mistura sobreposição de palavras (aceita abreviação por prefixo,
 * ex.: REFRIG ~ REFRIGERANTE) com bigramas de letras. Se os tamanhos/medidas
 * forem diferentes (350ML x 2L), a nota cai pela metade.
 */
function similaridade(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  var ta = a.split(' '), tb = b.split(' ');
  var casa = function (x, y) {
    return x === y || (x.length >= 3 && y.length >= 3 && /^[A-Z]/.test(x) && (x.indexOf(y) === 0 || y.indexOf(x) === 0));
  };
  var usados = {}, comuns = 0;
  ta.forEach(function (x) {
    for (var j = 0; j < tb.length; j++) if (!usados[j] && casa(x, tb[j])) { usados[j] = true; comuns++; break; }
  });
  var tok = (2 * comuns) / (ta.length + tb.length);

  var bg = function (s) { var r = {}; s = s.replace(/ /g, ''); for (var i = 0; i < s.length - 1; i++) { var k = s.substr(i, 2); r[k] = (r[k] || 0) + 1; } return r; };
  var ba = bg(a), bb = bg(b), inter = 0, na = 0, nb = 0, k;
  for (k in ba) { na += ba[k]; if (bb[k]) inter += Math.min(ba[k], bb[k]); }
  for (k in bb) nb += bb[k];
  var dice = na + nb ? (2 * inter) / (na + nb) : 0;

  var score = 0.6 * tok + 0.4 * dice;
  var medidas = function (t) { return t.filter(function (x) { return /\d/.test(x); }).sort().join(' '); };
  var ma = medidas(ta), mb = medidas(tb);
  if (ma && mb && ma !== mb) score *= 0.5;
  return Math.round(score * 1000) / 1000;
}

// Imagens dos botões (PNG em base64)
var BOTAO_IMPORTAR = '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';
var BOTAO_PENDENTES = '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';

if (typeof module !== 'undefined') {
  module.exports = { textoPdfDireto: textoPdfDireto, lerRomaneioVarejoFacil: lerRomaneioVarejoFacil, lerLinhaItem: lerLinhaItem, lerTextoRomaneio: lerTextoRomaneio, similaridade: similaridade,
    normalizar: normalizar, gtinValido: gtinValido, numeroBR: numeroBR, casarItem: casarItem, mesmaUnidade: mesmaUnidade };
}
