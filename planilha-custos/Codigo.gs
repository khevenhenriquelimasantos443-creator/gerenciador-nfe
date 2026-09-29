/**
 * PLANILHA DE CUSTOS — romaneio do VarejoFácil + XML da NF-e -> custo na planilha do marketplace
 *
 * Como instalar e usar: veja a aba LEIA-ME (ou GUIA.md no repositório).
 *
 * Caminho de uma nota:
 *   1. PDF do romaneio e XML na pasta "Romaneios - Entrada" do Drive
 *   2. importarRomaneios: romaneio -> ENTRADAS (código VarejoFácil = SKU interno);
 *      XML da mesma nota -> confere valores e grava o EAN em SKUs
 *   3. sincronizar: EAN liga o SKU interno ao SKU - MKTPLACE (sem EAN: sugestão em VINCULAR),
 *      compara o custo oficial (aba CUSTOS) com a coluna I da planilha de custos e grava
 *   4. HISTÓRICO DE CUSTOS guarda cada alteração; AUMENTOS 7 DIAS mostra o que subiu
 * Custo que não vem em romaneio/XML: aba LANÇAR CUSTO.
 */

// ===========================================================================
// Abas, colunas e parâmetros
// ===========================================================================

var ABA = {
  LEIAME: 'LEIA-ME',
  CUSTOS: 'CUSTOS',
  LANCAR: 'LANÇAR CUSTO',
  SKUS: 'SKUs',
  ENTRADAS: 'ENTRADAS',
  VINCULAR: 'VINCULAR',
  PREVIA: 'PRÉVIA',
  HISTORICO: 'HISTÓRICO DE CUSTOS',
  AUMENTOS: 'AUMENTOS 7 DIAS',
  CONFIG: 'CONFIG',
  LOG: 'LOG'
};

var CAB = {
  CUSTOS: ['SKU', 'Descrição', 'Último custo pago', 'Data da última compra',
           'Fornecedor da última compra', 'Custo pago anterior', 'Variação vs anterior',
           'Custo efetivo da última compra (com bonificação)', 'Custo médio histórico',
           'Qtd total recebida', 'Qtd recebida bonificada', 'Custo oficial'],
  LANCAR: ['Código de barras ou SKU', 'Nome do produto (se não tiver o código)', 'Custo unitário (R$)',
           'Quantidade (opcional)', 'Fornecedor (opcional)', 'Nº da nota (opcional)',
           'Data (opcional, padrão hoje)', 'Situação (preenchida pelo script)', 'Produto encontrado'],
  // colunas A-H: cadastro; I: fórmula; J-M: vínculo com o SKU - MKTPLACE
  SKUS: ['SKU', 'Descrição', 'EANs (separe por vírgula)', 'Unidade', 'Categoria', 'Status',
         'Cadastrado em', 'Origem', 'Custo oficial', 'SKU marketplace', 'EAN marketplace',
         'Aba (marca)', 'Vinculado em'],
  // O e P são fórmulas; o script nunca escreve nelas
  ENTRADAS: ['Data', 'Nº documento', 'Fornecedor', 'CNPJ fornecedor', 'Cód. no fornecedor',
             'EAN', 'Descrição no documento', 'Qtd', 'Unid.', 'Valor unit. no documento',
             'Valor pago da linha', 'Bonificado', 'SKU', 'Fator', 'Qtd em un. estoque',
             'Custo unit. pago', 'Grupo de compra', 'Origem', 'Arquivo', 'Importado em'],
  VINCULAR: ['Código VarejoFácil', 'Descrição no romaneio', 'Fornecedor', 'SKU sugerido',
             'Produto no SKU - MKTPLACE', 'Variação', 'EAN', 'Aba (marca)', 'Similaridade',
             '2ª sugestão', 'CONFIRMAR (SKU, EAN ou NÃO TEM)'],
  PREVIA: ['Ação', 'SKU', 'EAN', 'Nome do Produto', 'Nome da Variação', 'Custo atual', 'Custo novo',
           'Variação', 'Linha na planilha de custos', 'Código VarejoFácil', 'Fornecedor', 'Marca (aba)'],
  HISTORICO: ['Data', 'SKU', 'EAN', 'Nome do Produto', 'Nome da Variação', 'Custo anterior', 'Custo novo',
              'Variação', 'O que foi feito', 'Código VarejoFácil', 'Fornecedor', 'Onde', 'Diferença em R$'],
  LOG: ['Data/hora', 'Arquivo', 'ID do arquivo', 'Status', 'Itens lidos', 'Itens gravados',
        '(não usado)', 'SKUs novos', 'Mensagem']
};

// CONFIG é lida pelo nome do parâmetro (coluna A), não pela posição
var CONFIG_ITENS = [
  ['Pasta de entrada (ID)', '', 'Onde você solta os PDFs e XMLs. Vazio: o script cria a pasta.'],
  ['Pasta de processados (ID)', '', 'Para onde vão os arquivos já importados.'],
  ['Pasta com erro (ID)', '', 'Arquivos que não foram reconhecidos.'],
  ['Custo oficial', 'ÚLTIMO PAGO', 'ÚLTIMO PAGO, EFETIVO (dilui bonificação) ou MÉDIO (histórico ponderado).'],
  ['CFOPs de bonificação', '1910, 2910, 5910, 6910', 'CFOPs que marcam a nota ou o item como bonificado.'],
  ['Somar frete, seguro, IPI e ST no custo (XML)', 'SIM', 'Só vale para nota importada pelo XML sem romaneio.'],
  ['Planilha SKU - MKTPLACE (link ou ID)', '', 'De onde vêm os dados dos produtos (uma aba por marca).'],
  ['Planilha de custos (link ou ID)', '', 'Onde o custo é atualizado e os produtos novos são adicionados.'],
  ['Aba da planilha de custos', 'SKUSHOPPEATUALIZADO', 'Só a coluna I (Custo) é alterada nas linhas que já existem.'],
  ['Abas ignoradas no SKU - MKTPLACE', 'MENU', 'Separe por vírgula.'],
  ['Similaridade para já deixar o vínculo preenchido', 0.85, 'Acima disso a sugestão já vem preenchida em VINCULAR.'],
  ['Aplicar automaticamente na planilha de custos', 'SIM', 'SIM: grava sozinho. NÃO: espera o botão Aplicar na aba PRÉVIA.']
];
var CONFIG_OBSOLETOS = ['Similaridade mínima para sugerir', 'Criar SKU novo automaticamente',
                        'Prefixo do SKU novo', 'CNPJ da sua empresa'];

var SEM_CADASTRO = 'NÃO TEM NO MKTPLACE';

// ===========================================================================
// Menu e automação
// ===========================================================================

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Custos')
    .addItem('Importar romaneios agora', 'importarRomaneios')
    .addItem('Lançar custos da aba LANÇAR CUSTO', 'lancarCustos')
    .addItem('Sincronizar com a planilha de custos', 'sincronizarAgora')
    .addSeparator()
    .addItem('Confirmar vínculos (aba VINCULAR)', 'confirmarVinculos')
    .addItem('Aplicar a PRÉVIA (se o automático estiver em NÃO)', 'aplicarPrevia')
    .addSeparator()
    .addItem('Ligar importação automática (a cada 15 min)', 'ativarAutomatico')
    .addItem('Desligar importação automática', 'desativarAutomatico')
    .addItem('Desfazer importação de uma nota', 'desfazerNota')
    .addItem('Atualizar estrutura (abas, fórmulas e botões)', 'atualizarEstrutura')
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

// ===========================================================================
// Estrutura da planilha (pode rodar quantas vezes quiser: não apaga dados)
// ===========================================================================

function configurarPlanilha() { atualizarEstrutura(); } // nome antigo do menu

function atualizarEstrutura() {
  var ss = SpreadsheetApp.getActive();
  prepararConfig(true);

  var formatos = {
    SKUS: function (sh) {
      sh.getRange('A:A').setNumberFormat('@'); sh.getRange('C:C').setNumberFormat('@');
      sh.getRange('J:K').setNumberFormat('@'); sh.getRange('I2:I').setNumberFormat('R$ #,##0.00');
      sh.getRange(1, 10, 1, 4).setBackground('#1d4ed8');
    },
    ENTRADAS: function (sh) {
      sh.getRange('B:F').setNumberFormat('@'); sh.getRange('M:M').setNumberFormat('@');
      sh.getRange('Q:Q').setNumberFormat('@'); sh.getRange('A2:A').setNumberFormat('dd/mm/yyyy');
      sh.getRange('T2:T').setNumberFormat('dd/mm/yyyy hh:mm'); sh.getRange('J2:K').setNumberFormat('R$ #,##0.00');
      sh.getRange('P2:P').setNumberFormat('R$ #,##0.0000');
    },
    LANCAR: function (sh) {
      sh.getRange('A:A').setNumberFormat('@'); sh.getRange('C2:C').setNumberFormat('R$ #,##0.00');
      sh.getRange('F:F').setNumberFormat('@'); sh.getRange('G2:G').setNumberFormat('dd/mm/yyyy');
      sh.getRange(1, 1, 1, 7).setBackground('#6d28d9');
      sh.setColumnWidth(2, 320); sh.setColumnWidth(8, 320); sh.setColumnWidth(9, 380);
    },
    VINCULAR: function (sh) {
      sh.getRange('A:D').setNumberFormat('@'); sh.getRange('G:G').setNumberFormat('@');
      sh.getRange('K:K').setNumberFormat('@'); sh.getRange('I2:I').setNumberFormat('0%');
      sh.getRange(1, CAB.VINCULAR.length).setBackground('#b45309');
      sh.setColumnWidth(2, 300); sh.setColumnWidth(5, 380); sh.setColumnWidth(10, 300);
    },
    PREVIA: function (sh) {
      sh.getRange('B:C').setNumberFormat('@'); sh.getRange('F2:G').setNumberFormat('R$ #,##0.00');
      sh.getRange('H2:H').setNumberFormat('+0.0%;-0.0%;0.0%'); sh.setColumnWidth(4, 380);
    },
    HISTORICO: function (sh) {
      sh.getRange('B:C').setNumberFormat('@'); sh.getRange('A2:A').setNumberFormat('dd/mm/yyyy hh:mm');
      sh.getRange('F2:G').setNumberFormat('R$ #,##0.00'); sh.getRange('H2:H').setNumberFormat('+0.0%;-0.0%;0.0%');
      sh.getRange('M2:M').setNumberFormat('R$ #,##0.00'); sh.setColumnWidth(4, 380);
    },
    LOG: function (sh) { sh.getRange('A2:A').setNumberFormat('dd/mm/yyyy hh:mm'); sh.setColumnWidth(9, 600); }
  };
  ['SKUS', 'ENTRADAS', 'LANCAR', 'VINCULAR', 'PREVIA', 'HISTORICO', 'LOG'].forEach(function (k) {
    var sh = garantirAba(ss, ABA[k]);
    var nova = sh.getLastRow() === 0;
    // cabeçalho: sempre regravado (texto fixo), a não ser nas colunas de fórmula
    sh.getRange(1, 1, 1, CAB[k].length).setValues([CAB[k]]);
    if (nova) { estilizar(sh, CAB[k].length); formatos[k](sh); }
  });
  var custosNova = !ss.getSheetByName(ABA.CUSTOS);
  garantirAba(ss, ABA.CUSTOS);
  garantirAba(ss, ABA.AUMENTOS);
  corrigirFormulas();
  if (custosNova) estilizar(ss.getSheetByName(ABA.CUSTOS), CAB.CUSTOS.length);
  escreverLeiaMe(garantirAba(ss, ABA.LEIAME));
  garantirPastas();
  criarBotoes();

  var ordem = [ABA.LEIAME, ABA.CUSTOS, ABA.LANCAR, ABA.AUMENTOS, ABA.HISTORICO, ABA.SKUS, ABA.ENTRADAS,
               ABA.VINCULAR, ABA.PREVIA, ABA.CONFIG, ABA.LOG];
  ordem.forEach(function (nome, i) { ss.setActiveSheet(ss.getSheetByName(nome)); ss.moveActiveSheet(i + 1); });
  var padrao = ss.getSheetByName('Página1') || ss.getSheetByName('Sheet1');
  if (padrao && padrao.getLastRow() === 0) ss.deleteSheet(padrao);
  ss.setActiveSheet(ss.getSheetByName(ABA.LEIAME));

  var sobras = ['DE_PARA', 'PENDENTES'].filter(function (n) { return ss.getSheetByName(n); });
  ss.toast('Estrutura atualizada.' + (sobras.length ? ' As abas ' + sobras.join(' e ') +
    ' não são mais usadas: pode apagar.' : ''), 'Custos', 10);
}

// Cabeçalho sempre em texto na linha 1 e fórmula na linha 2, sem {...}:
// array literal com chaves não funciona em planilha em português (vira #ERROR!).
function corrigirFormulas() {
  var ss = SpreadsheetApp.getActive();
  var ent = ss.getSheetByName(ABA.ENTRADAS);
  ent.getRange('O2:P').clearContent();
  definirFormula(ent.getRange('O2'), '=ARRAYFORMULA(IF(LEN(H2:H), H2:H*IF(N2:N="", 1, N2:N), ))');
  definirFormula(ent.getRange('P2'), '=ARRAYFORMULA(IF(LEN(H2:H), IF(L2:L="SIM", 0, IFERROR(K2:K/O2:O, 0)), ))');

  var skus = ss.getSheetByName(ABA.SKUS);
  skus.getRange('I2:I').clearContent();
  definirFormula(skus.getRange('I2'), '=MAP(A2:A, LAMBDA(s, IF(s="",, IFERROR(XLOOKUP(s, CUSTOS!A2:A, CUSTOS!L2:L), ))))');

  escreverFormulasCustos(ss.getSheetByName(ABA.CUSTOS));

  var au = ss.getSheetByName(ABA.AUMENTOS);
  var h = "'" + ABA.HISTORICO + "'!";
  au.getRange(1, 1, au.getMaxRows(), Math.max(au.getMaxColumns(), CAB.HISTORICO.length)).clearContent();
  au.getRange(1, 1, 1, CAB.HISTORICO.length).setValues([CAB.HISTORICO]);
  // aumentos gravados nos últimos 7 dias, maior aumento (%) primeiro
  definirFormula(au.getRange('A2'), '=IFERROR(SORT(FILTER(' + h + 'A2:M, ' + h + 'A2:A>=NOW()-7, ' + h + 'F2:F<>"", ' +
    h + 'G2:G>' + h + 'F2:F), 8, FALSE), "Nenhum aumento nos últimos 7 dias")');
  au.getRange('A2:A').setNumberFormat('dd/mm/yyyy hh:mm');
  au.getRange('F2:G').setNumberFormat('R$ #,##0.00');
  au.getRange('H2:H').setNumberFormat('+0.0%');
  au.getRange('M2:M').setNumberFormat('R$ #,##0.00');
  estilizar(au, CAB.HISTORICO.length);
  au.getRange(1, 1, 1, CAB.HISTORICO.length).setBackground('#b91c1c');
  au.setColumnWidth(4, 380);
  conferirFormulas();
}

var FORMULAS_ESCRITAS = [];
function definirFormula(range, formula) {
  range.setFormula(formula);
  FORMULAS_ESCRITAS.push([range, formula]);
}

function conferirFormulas() {
  SpreadsheetApp.flush();
  var refeitas = 0;
  FORMULAS_ESCRITAS.forEach(function (x) {
    if (/^#(ERROR|ERRO)!?$/i.test(String(x[0].getDisplayValue()))) {
      x[0].setFormula(x[1].replace(/,/g, ';'));
      refeitas++;
    }
  });
  FORMULAS_ESCRITAS = [];
  return refeitas;
}

function escreverFormulasCustos(cus) {
  var linhasPagas = 'SORT(FILTER(CHOOSECOLS(ENTRADAS!A2:T, 1, 20, 16, 3), ' +
                    'ENTRADAS!M2:M=s, ENTRADAS!L2:L<>"SIM"), 2, FALSE, 1, FALSE)';
  var mapa = function (corpo) { return '=MAP(A2:A, LAMBDA(s, IF(s="",, ' + corpo + ')))'; };
  var grupo = 'INDEX(SORT(FILTER(CHOOSECOLS(ENTRADAS!A2:T, 1, 20, 17), ENTRADAS!M2:M=s), 2, FALSE, 1, FALSE), 1, 3)';

  cus.getRange(1, 1, cus.getMaxRows(), CAB.CUSTOS.length).clearContent();
  cus.getRange(1, 1, 1, CAB.CUSTOS.length).setValues([CAB.CUSTOS]);
  definirFormula(cus.getRange('A2'), '=FILTER(SKUs!A2:A, SKUs!A2:A<>"")');
  definirFormula(cus.getRange('B2'), mapa('XLOOKUP(s, SKUs!A2:A, SKUs!B2:B, "")'));
  definirFormula(cus.getRange('C2'), mapa('IFERROR(INDEX(' + linhasPagas + ', 1, 3), )'));
  definirFormula(cus.getRange('D2'), mapa('IFERROR(INDEX(' + linhasPagas + ', 1, 1), )'));
  definirFormula(cus.getRange('E2'), mapa('IFERROR(INDEX(' + linhasPagas + ', 1, 4), )'));
  definirFormula(cus.getRange('F2'), mapa('IFERROR(INDEX(' + linhasPagas + ', 2, 3), )'));
  definirFormula(cus.getRange('G2'), '=MAP(C2:C, F2:F, LAMBDA(c, f, IF(OR(c="", f="", f=0),, c/f-1)))');
  definirFormula(cus.getRange('H2'), mapa(
    'IFERROR(LET(g, ' + grupo + ', SUMIFS(ENTRADAS!K2:K, ENTRADAS!M2:M, s, ENTRADAS!Q2:Q, g) / ' +
    'SUMIFS(ENTRADAS!O2:O, ENTRADAS!M2:M, s, ENTRADAS!Q2:Q, g)), )'));
  definirFormula(cus.getRange('I2'), mapa(
    'IFERROR(SUMIFS(ENTRADAS!K2:K, ENTRADAS!M2:M, s) / SUMIFS(ENTRADAS!O2:O, ENTRADAS!M2:M, s), )'));
  definirFormula(cus.getRange('J2'), mapa('SUMIFS(ENTRADAS!O2:O, ENTRADAS!M2:M, s)'));
  definirFormula(cus.getRange('K2'), mapa('SUMIFS(ENTRADAS!O2:O, ENTRADAS!M2:M, s, ENTRADAS!L2:L, "SIM")'));
  definirFormula(cus.getRange('L2'), '=LET(o, XLOOKUP("Custo oficial", CONFIG!A:A, CONFIG!B:B, "ÚLTIMO PAGO"), ' +
    'MAP(C2:C, H2:H, I2:I, A2:A, LAMBDA(c, h, i, s, IF(s="",, SWITCH(o, "EFETIVO", h, "MÉDIO", i, c)))))');

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
    ['PLANILHA DE CUSTOS - COMO USAR'],
    [''],
    ['NOTA NOVA (o normal do dia a dia)'],
    ['1. Solte o PDF do romaneio do VarejoFácil e o XML da mesma nota na pasta "Romaneios - Entrada" do Drive.'],
    ['2. Clique em Importar romaneios (aba CUSTOS) ou espere: com a importação automática ligada, roda a cada 15 minutos.'],
    ['3. Pronto. O custo novo vai para a coluna I da planilha de custos e os produtos que ainda não estão lá são adicionados.'],
    ['4. Veja em AUMENTOS 7 DIAS o que subiu e reajuste o preço de venda. Tudo que foi gravado fica em HISTÓRICO DE CUSTOS.'],
    [''],
    ['SE APARECER ALGO NA ABA VINCULAR'],
    ['São produtos sem EAN (romaneio sem XML). Confira a coluna laranja: deixe o SKU sugerido, troque pelo certo ou escreva NÃO TEM.'],
    ['Depois clique em Confirmar vínculos. Cada produto só é confirmado uma vez.'],
    [''],
    ['CUSTO QUE NÃO VEM NO ROMANEIO (nota separada, frete, acerto de preço)'],
    ['Se a nota de faturamento é separada da nota de remessa: solte o XML da nota de faturamento na pasta. Ele entra sozinho.'],
    ['Para qualquer outro caso, use a aba LANÇAR CUSTO: código de barras ou SKU (ou só o nome) e o custo unitário.'],
    ['Clique em Lançar custos. Com a importação automática ligada, as linhas também são lançadas a cada 15 minutos.'],
    ['Depois de gravar, o script confere na planilha de custos: se o valor chegou, a linha some daqui e fica registrada no LOG'],
    ['(ex.: "LOREAL-0038 = R$ 49,90 conferido em SKUSHOPPEATUALIZADO, linha 5008"). Se não chegou, a linha fica com o motivo.'],
    ['CONFIRA = o nome bateu com mais de um produto: escreva o SKU na coluna A e apague a Situação. NÃO ACHEI = código não existe.'],
    ['Vale sempre o último valor que entrou (romaneio, XML ou lançamento), na ordem em que entrou, não pela data da nota.'],
    [''],
    ['BONIFICAÇÃO'],
    ['Item bonificado (CFOP 1910/2910/5910/6910 ou valor zero) entra com valor pago 0 e não muda o "último custo pago".'],
    ['Em CONFIG, Custo oficial = EFETIVO faz a bonificação diluir o custo. Bonificação em nota separada: em ENTRADAS,'],
    ['escreva na coluna "Grupo de compra" o número da nota da compra.'],
    [''],
    ['CORRIGIR OU DESFAZER'],
    ['Nota importada errada: Custos > Desfazer importação de uma nota. Depois mova os arquivos de volta para "Romaneios - Entrada".'],
    ['Fórmula com erro ou botão sumido: Custos > Atualizar estrutura.'],
    ['Arquivo em "Romaneios - Com erro": o motivo está no LOG; se for romaneio, o texto lido fica na aba DIAGNOSTICO.'],
    [''],
    ['NÃO ESCREVA nas abas CUSTOS e AUMENTOS 7 DIAS nem nas colunas O e P de ENTRADAS e I de SKUs: são fórmulas.']
  ];
  sh.clear();
  sh.getRange(1, 1, t.length, 1).setValues(t);
  sh.setColumnWidth(1, 1100);
  sh.getRange('A1').setFontSize(14).setFontWeight('bold');
  t.forEach(function (l, i) {
    if (/^[A-ZÇÃÕÉÍÓÚ ()\-,/]+$/.test(l[0]) && l[0].length > 3 && i > 0) sh.getRange(i + 1, 1).setFontWeight('bold').setBackground('#e5e7eb');
  });
  sh.getRange(t.length, 1).setFontColor('#b91c1c');
}

// Botões: imagens com script, à direita de cada tabela. Troca os antigos.
function criarBotoes() {
  var ss = SpreadsheetApp.getActive();
  var botoes = [
    [ABA.CUSTOS, CAB.CUSTOS.length + 2, 2, 'importarRomaneios', BOTAO_IMPORTAR, 'Importar romaneios'],
    [ABA.CUSTOS, CAB.CUSTOS.length + 2, 5, 'sincronizarAgora', BOTAO_SINCRONIZAR, 'Sincronizar'],
    [ABA.LANCAR, CAB.LANCAR.length + 2, 2, 'lancarCustos', BOTAO_LANCAR, 'Lançar custos'],
    [ABA.VINCULAR, CAB.VINCULAR.length + 2, 2, 'confirmarVinculos', BOTAO_VINCULOS, 'Confirmar vínculos'],
    [ABA.PREVIA, CAB.PREVIA.length + 2, 2, 'aplicarPrevia', BOTAO_APLICAR, 'Aplicar na planilha']
  ];
  var scripts = ['processarPendentes'].concat(botoes.map(function (b) { return b[3]; }));
  ss.getSheets().forEach(function (sh) {
    sh.getImages().forEach(function (img) { if (scripts.indexOf(img.getScript()) >= 0) img.remove(); });
  });
  botoes.forEach(function (b) {
    var sh = ss.getSheetByName(b[0]);
    if (!sh) return;
    sh.setColumnWidth(b[1], 260);
    var img = sh.insertImage(Utilities.newBlob(Utilities.base64Decode(b[4]), 'image/png', b[3] + '.png'), b[1], b[2]);
    img.setWidth(240).setHeight(44).assignScript(b[3]);
    img.setAltTextTitle(b[5]);
  });
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
  var cfg = lerConfig();
  [['pastaEntrada', 'Pasta de entrada (ID)', 'Romaneios - Entrada'],
   ['pastaProcessados', 'Pasta de processados (ID)', 'Romaneios - Processados'],
   ['pastaErro', 'Pasta com erro (ID)', 'Romaneios - Com erro']].forEach(function (p) {
    if (cfg[p[0]]) { try { DriveApp.getFolderById(cfg[p[0]]); return; } catch (e) {} }
    var it = DriveApp.getFoldersByName(p[2]);
    gravarConfig(p[1], (it.hasNext() ? it.next() : DriveApp.createFolder(p[2])).getId());
  });
}

// Garante que todo parâmetro existe em CONFIG. limpar = true também tira os obsoletos.
function prepararConfig(limpar) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(ABA.CONFIG);
  if (!sh) {
    sh = ss.insertSheet(ABA.CONFIG);
    sh.getRange(1, 1, 1, 3).setValues([['Parâmetro', 'Valor', 'Explicação']]);
    estilizar(sh, 3);
    sh.setColumnWidth(1, 320); sh.setColumnWidth(2, 260); sh.setColumnWidth(3, 620);
  }
  var rotulos = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues().map(function (r) { return String(r[0]).trim(); }) : [];
  if (limpar) {
    for (var i = rotulos.length - 1; i >= 0; i--) if (CONFIG_OBSOLETOS.indexOf(rotulos[i]) >= 0) sh.deleteRow(i + 2);
    rotulos = rotulos.filter(function (r) { return CONFIG_OBSOLETOS.indexOf(r) < 0; });
  }
  var faltando = CONFIG_ITENS.filter(function (c) { return rotulos.indexOf(c[0]) < 0; });
  if (faltando.length) sh.getRange(sh.getLastRow() + 1, 1, faltando.length, 3).setValues(faltando);
  if (limpar) {
    var listas = { 'Custo oficial': ['ÚLTIMO PAGO', 'EFETIVO', 'MÉDIO'],
                   'Aplicar automaticamente na planilha de custos': ['SIM', 'NÃO'],
                   'Somar frete, seguro, IPI e ST no custo (XML)': ['SIM', 'NÃO'] };
    var v = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();
    v.forEach(function (r, i) {
      var l = listas[String(r[0]).trim()];
      if (l) sh.getRange(i + 2, 2).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(l).build());
    });
  }
  return sh;
}

function gravarConfig(rotulo, valor) {
  var sh = prepararConfig(false);
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < v.length; i++) if (String(v[i][0]).trim() === rotulo) { sh.getRange(i + 2, 2).setValue(valor); return; }
}

function lerConfig() {
  var sh = prepararConfig(false);
  var p = {};
  sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues().forEach(function (r) { p[String(r[0]).trim()] = r[1]; });
  var txt = function (k, padrao) { var x = String(p[k] == null ? '' : p[k]).trim(); return x || padrao || ''; };
  return {
    pastaEntrada: txt('Pasta de entrada (ID)'),
    pastaProcessados: txt('Pasta de processados (ID)'),
    pastaErro: txt('Pasta com erro (ID)'),
    cfopsBonif: txt('CFOPs de bonificação').split(/[^\d]+/).filter(String),
    somarImpostos: txt('Somar frete, seguro, IPI e ST no custo (XML)', 'SIM').toUpperCase() !== 'NÃO',
    planilhaMkt: idDePlanilha(txt('Planilha SKU - MKTPLACE (link ou ID)')),
    planilhaCustos: idDePlanilha(txt('Planilha de custos (link ou ID)')),
    abaCustos: txt('Aba da planilha de custos', 'SKUSHOPPEATUALIZADO'),
    abasIgnoradas: txt('Abas ignoradas no SKU - MKTPLACE').split(',').map(function (x) { return x.trim().toUpperCase(); }).filter(String),
    limiarVinculo: Number(p['Similaridade para já deixar o vínculo preenchido']) || 0.85,
    aplicarAuto: txt('Aplicar automaticamente na planilha de custos', 'SIM').toUpperCase() !== 'NÃO',
    custoOficial: txt('Custo oficial', 'ÚLTIMO PAGO').toUpperCase()
  };
}

// ===========================================================================
// Importação de romaneios (PDF) e XMLs
// ===========================================================================

function importarRomaneios() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) {
    SpreadsheetApp.getActive().toast('Já tem uma importação em andamento. Tente de novo em 1 minuto.');
    return;
  }
  try {
    garantirPastas();
    var cfg = lerConfig();
    var ctx = carregarContexto();
    // PDFs primeiro: o XML da mesma nota só confere e completa o EAN
    var it = DriveApp.getFolderById(cfg.pastaEntrada).getFiles(), fila = [];
    while (it.hasNext()) {
      var arq = it.next();
      var ehXml = /xml/i.test(arq.getMimeType()) || /\.xml$/i.test(arq.getName());
      var ehPdf = arq.getMimeType() === MimeType.PDF || /\.pdf$/i.test(arq.getName());
      if (ehXml || ehPdf) fila.push({ arq: arq, ehXml: ehXml });
    }
    fila.sort(function (a, b) { return a.ehXml - b.ehXml; });
    fila.forEach(function (f) { importarArquivo(f.arq, f.ehXml, cfg, ctx); });

    var lancados = temLancamentoPendente() ? lancarCustos(true, true) : 0;
    var msg = fila.length ? fila.length + ' arquivo(s) importado(s). ' : '';
    if (lancados) msg += lancados + ' custo(s) lançado(s) da aba LANÇAR CUSTO. ';
    if (fila.length || lancados) msg += sincronizar(cfg);
    if (lancados) msg += ' ' + conferirLancamentos(cfg).resumo;
    SpreadsheetApp.getActive().toast(msg || 'Nenhum PDF ou XML novo na pasta Romaneios - Entrada.', 'Custos', 10);
  } finally {
    lock.releaseLock();
  }
}

function importarArquivo(arq, ehXml, cfg, ctx) {
  var nome = arq.getName();
  try {
    var doc = ehXml ? lerXmlNfe(arq.getBlob().getDataAsString('UTF-8'), cfg) : lerPdf(arq, cfg);
    if (!doc.numero) doc.numero = nome.replace(/\.[^.]+$/, '');
    if (!doc.data) doc.data = new Date();
    if (!doc.itens.length) {
      registrarLog(nome, arq.getId(), 'ERRO', 0, 0, 0, ehXml ? 'XML sem itens.' :
        'Não reconheci os itens deste PDF. O texto lido está na aba DIAGNOSTICO; se não for romaneio do VarejoFácil, use o XML.');
      moverPara(arq, cfg.pastaErro);
      return;
    }
    var chave = chaveDoc(doc);
    if (ehXml && ctx.docs[chave]) {
      var r = completarComXml(doc, ctx);
      registrarLog(nome, arq.getId(), r.diferencas.length ? 'CONFERIR' : 'OK', doc.itens.length, 0, 0,
        'XML da nota ' + doc.numero + ' conferido com o romaneio: ' + r.batem + ' de ' + doc.itens.length +
        ' itens iguais (quantidade, valor unitário e total). ' + r.eans + ' EAN(s) gravado(s) em SKUs.' +
        (r.diferencas.length ? ' DIFERENÇAS: ' + r.diferencas.join(' | ') : ''));
      moverPara(arq, cfg.pastaProcessados);
      return;
    }
    if (ctx.docs[chave]) {
      registrarLog(nome, arq.getId(), 'DUPLICADO', doc.itens.length, 0, 0, 'Nota ' + doc.numero + ' já tinha sido importada.');
      moverPara(arq, cfg.pastaProcessados);
      return;
    }

    var agora = new Date(), linhas = [], extras = [], novos = 0;
    doc.itens.forEach(function (it) {
      var ean = gtinValido(it.ean) ? eanTexto(it.ean) : '';
      // romaneio: código do VarejoFácil; XML sem romaneio: SKU já conhecido pelo EAN, senão o próprio EAN
      var sku = it.codInterno || ctx.porEan[ean] || ean || ('F' + soDigitos(doc.cnpj).slice(0, 8) + '-' + it.cod);
      if (!ctx.skus[sku]) {
        novoSku(ctx, sku, it.desc, ean, it.unid, (ehXml ? 'XML ' : 'Romaneio ') + doc.numero);
        novos++;
      }
      linhas.push([doc.data, doc.numero, doc.fornecedor, doc.cnpj, it.cod, ean, it.desc, it.qtd, it.unid,
                   it.vUnit, it.bonif ? 0 : it.vTotal, it.bonif ? 'SIM' : 'NÃO', sku, it.fator || 1]);
      extras.push([doc.numero, ehXml ? 'XML' : 'ROMANEIO', nome, agora]);
    });
    gravarEntradas(linhas, extras);
    ctx.docs[chave] = true;
    registrarLog(nome, arq.getId(), 'OK', doc.itens.length, linhas.length, novos,
      'Nota ' + doc.numero + ' | ' + (doc.fornecedor || 'fornecedor não identificado') + (ehXml ? ' | XML' : ' | romaneio'));
    moverPara(arq, cfg.pastaProcessados);
  } catch (e) {
    registrarLog(nome, arq.getId(), 'ERRO', 0, 0, 0, String(e && e.message || e));
    moverPara(arq, cfg.pastaErro);
  }
}

// SKUs e notas já importadas, lidos uma vez por execução
function carregarContexto() {
  var ss = SpreadsheetApp.getActive();
  var ctx = { skus: {}, porEan: {}, porSkuMkt: {}, docs: {} };
  var s = ss.getSheetByName(ABA.SKUS);
  var n = ultimaLinhaColA(s);
  if (n > 1) {
    s.getRange(2, 1, n - 1, 13).getValues().forEach(function (r, i) {
      var sku = String(r[0]).trim();
      if (!sku) return;
      ctx.skus[sku] = { linha: i + 2, mkt: String(r[9]).trim() };
      String(r[2]).split(/[,;\s]+/).concat([r[10]]).map(eanTexto).filter(Boolean)
        .forEach(function (e) { if (!ctx.porEan[e]) ctx.porEan[e] = sku; });
      if (r[9] !== '' && r[9] !== SEM_CADASTRO) ctx.porSkuMkt[String(r[9]).trim().toUpperCase()] = sku;
    });
  }
  var ent = ss.getSheetByName(ABA.ENTRADAS);
  if (ultimaLinhaColA(ent) > 1) {
    ent.getRange(2, 2, ultimaLinhaColA(ent) - 1, 3).getValues().forEach(function (r) {
      if (r[0] !== '') ctx.docs[chaveDoc({ numero: r[0], fornecedor: r[1], cnpj: r[2] })] = true;
    });
  }
  return ctx;
}

function novoSku(ctx, sku, desc, ean, unid, origem) {
  anexar(ABA.SKUS, [[sku, desc, ean || '', String(unid || '').toUpperCase(), '', 'ATIVO', new Date(), origem]]);
  ctx.skus[sku] = { linha: ultimaLinhaColA(SpreadsheetApp.getActive().getSheetByName(ABA.SKUS)), mkt: '' };
  if (ean && !ctx.porEan[ean]) ctx.porEan[ean] = sku;
  return ctx.skus[sku].linha;
}

function completarComXml(doc) {
  var ss = SpreadsheetApp.getActive();
  var ent = ss.getSheetByName(ABA.ENTRADAS);
  var n = ultimaLinhaColA(ent);
  var v = n > 1 ? ent.getRange(2, 1, n - 1, 13).getValues() : [];
  var chave = chaveDoc(doc), linhas = [];
  v.forEach(function (r) {
    if (chaveDoc({ numero: r[1], fornecedor: r[2], cnpj: r[3] }) === chave) linhas.push({ q: Number(r[7]), vu: Number(r[9]), tot: Number(r[10]), bon: r[11] === 'SIM', sku: String(r[12]), desc: r[6], usado: false });
  });
  var perto = function (a, b, tol) { return Math.abs(a - b) <= tol; };
  var eanPorSku = {}, batem = 0, diferencas = [];
  doc.itens.forEach(function (it, i) {
    var cand = linhas[i] && !linhas[i].usado && perto(linhas[i].q, it.qtd, 1e-6) && perto(linhas[i].vu, it.vUnit, 0.005) ? linhas[i] : null;
    for (var k = 0; !cand && k < linhas.length; k++) {
      if (!linhas[k].usado && perto(linhas[k].q, it.qtd, 1e-6) && perto(linhas[k].vu, it.vUnit, 0.005)) cand = linhas[k];
    }
    if (!cand) { diferencas.push('item ' + (i + 1) + ' do XML (' + it.desc + ') sem linha igual no romaneio'); return; }
    cand.usado = true;
    var totXml = it.bonif ? 0 : it.vTotal;
    if (perto(cand.tot, totXml, 0.01)) batem++;
    else diferencas.push(cand.desc + ': romaneio ' + cand.tot.toFixed(2) + ' x XML ' + totXml.toFixed(2));
    if (it.ean) eanPorSku[cand.sku] = it.ean;
  });
  linhas.forEach(function (l) { if (!l.usado) diferencas.push(l.desc + ': está no romaneio e não no XML'); });

  var skus = ss.getSheetByName(ABA.SKUS);
  var nS = ultimaLinhaColA(skus), eans = 0;
  if (nS > 1) {
    var col = skus.getRange(2, 1, nS - 1, 3).getValues();
    col.forEach(function (r, i) {
      var e = eanPorSku[String(r[0]).trim()];
      if (!e) return;
      var atuais = String(r[2]).split(/[,;\s]+/).map(eanTexto).filter(Boolean);
      if (atuais.indexOf(eanTexto(e)) >= 0) return;
      skus.getRange(i + 2, 3).setValue(atuais.concat([eanTexto(e)]).join(', '));
      eans++;
    });
  }
  return { batem: batem, eans: eans, diferencas: diferencas };
}

function chaveDoc(doc) {
  var chave = soDigitos(doc.chave);
  var cnpj = chave.length === 44 ? chave.substr(6, 14) : soDigitos(doc.cnpj);
  return (cnpj || normalizarCat(doc.fornecedor)) + '|' + String(doc.numero).replace(/^0+/, '');
}

function moverPara(arq, pastaId) {
  if (pastaId) arq.moveTo(DriveApp.getFolderById(pastaId));
}

function registrarLog(nome, id, status, lidos, gravados, novos, msg) {
  anexar(ABA.LOG, [[new Date(), nome, id, status, lidos, gravados, '', novos, msg]]);
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

function gravarEntradas(linhas, extras) {
  if (!linhas.length) return;
  var sh = SpreadsheetApp.getActive().getSheetByName(ABA.ENTRADAS);
  var ini = ultimaLinhaColA(sh) + 1;
  sh.getRange(ini, 1, linhas.length, 14).setValues(linhas);
  sh.getRange(ini, 17, extras.length, 4).setValues(extras);
}

// Apaga de ENTRADAS as linhas de uma nota, e os SKUs criados só por ela.
// Não mexe na planilha de custos: o que já foi gravado lá está no HISTÓRICO DE CUSTOS.
function desfazerNota() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.prompt('Desfazer importação', 'Número da nota (ex.: 86725):', ui.ButtonSet.OK_CANCEL);
  if (resp.getSelectedButton() !== ui.Button.OK) return;
  var num = String(resp.getResponseText()).trim().replace(/^0+/, '');
  if (!num) return;
  var ss = SpreadsheetApp.getActive();
  var mesmoNum = function (x) { return String(x).trim().replace(/^0+/, '') === num; };
  var apagar = function (sh, teste) {
    var n = ultimaLinhaColA(sh), apagadas = 0;
    if (n < 2) return 0;
    var v = sh.getRange(2, 1, n - 1, sh.getLastColumn()).getValues();
    for (var i = v.length - 1; i >= 0; i--) if (teste(v[i])) { sh.deleteRow(i + 2); apagadas++; }
    return apagadas;
  };
  var ent = ss.getSheetByName(ABA.ENTRADAS);
  var nEnt = apagar(ent, function (r) { return mesmoNum(r[1]); });
  var usados = {};
  if (ultimaLinhaColA(ent) > 1) ent.getRange(2, 13, ultimaLinhaColA(ent) - 1, 1).getValues().forEach(function (r) { usados[String(r[0])] = 1; });
  var removidos = {};
  var nSku = apagar(ss.getSheetByName(ABA.SKUS), function (r) {
    var origem = String(r[7]).match(/^(Romaneio|XML)\s+(\S+)$/i);
    if (origem && mesmoNum(origem[2]) && !usados[String(r[0])]) { removidos[String(r[0])] = 1; return true; }
    return false;
  });
  apagar(ss.getSheetByName(ABA.VINCULAR), function (r) { return removidos[String(r[0])]; });
  registrarLog('DESFAZER', '', 'OK', 0, nEnt, 0, 'Nota ' + num + ': ' + nEnt + ' linha(s) de ENTRADAS e ' + nSku + ' SKU(s) apagados.');
  ui.alert('Nota ' + num + ' desfeita: ' + nEnt + ' linha(s) de ENTRADAS e ' + nSku + ' SKU(s) criado(s) por ela.\n\n' +
    'Para importar de novo, mova os arquivos de "Romaneios - Processados" para "Romaneios - Entrada".');
}

// ===========================================================================
// Lançamento manual de custo (aba LANÇAR CUSTO)
// ===========================================================================

// Confere na planilha de custos cada linha LANÇADO da aba LANÇAR CUSTO.
// Chegou com o mesmo valor: registra no LOG e apaga a linha. Não chegou: a linha fica com o motivo.
function conferirLancamentos(cfg) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(ABA.LANCAR);
  var res = { resumo: '', detalhes: [] };
  if (!sh || sh.getLastRow() < 2) return res;
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, CAB.LANCAR.length).getValues();
  var pendentes = [];
  v.forEach(function (r, i) { if (/^LANÇADO/.test(String(r[7]))) pendentes.push(i); });
  if (!pendentes.length) return res;

  // SKU interno -> SKU do marketplace
  var mktDoInterno = {}, eanDoMkt = {};
  var skus = ss.getSheetByName(ABA.SKUS);
  if (ultimaLinhaColA(skus) > 1) {
    skus.getRange(2, 1, ultimaLinhaColA(skus) - 1, 11).getValues().forEach(function (r) {
      mktDoInterno[String(r[0]).trim()] = String(r[9]).trim();
      if (r[10] !== '') eanDoMkt[String(r[9]).trim().toUpperCase()] = eanTexto(r[10]);
    });
  }
  var alvo = cfg.planilhaCustos ? SpreadsheetApp.openById(cfg.planilhaCustos).getSheetByName(cfg.abaCustos) : null;
  var linhasAlvo = alvo && alvo.getLastRow() > 1 ? alvo.getRange(2, 1, alvo.getLastRow() - 1, 9).getValues() : [];
  var achar = function (sku) {
    sku = sku.toUpperCase();
    var ean = eanDoMkt[sku] || '', porEan = null;
    for (var k = 0; k < linhasAlvo.length; k++) {
      var x = linhasAlvo[k], achado = { linha: k + 2, valor: Number(x[8]) || 0 };
      if (String(x[1]).trim().toUpperCase() === sku || String(x[2]).trim().toUpperCase() === sku) return achado;
      if (!porEan && ean && eanTexto(x[0]) === ean) porEan = achado;
    }
    return porEan;
  };
  var apagar = [], log = [], agora = new Date(), ok = 0;
  pendentes.forEach(function (i) {
    var r = v[i], custo = Number(r[2]);
    var produto = String(r[8]);
    var sku = produto.indexOf(' - ') > 0 ? produto.split(' - ')[0].trim() : (mktDoInterno[produto.trim()] || '');
    var motivo = '', a = null;
    if (!sku || sku === SEM_CADASTRO) motivo = 'produto sem vínculo com o SKU - MKTPLACE: confirme na aba VINCULAR';
    else if (!alvo) motivo = 'preencha em CONFIG o link da planilha de custos';
    else if (!(a = achar(sku))) motivo = cfg.aplicarAuto ? sku + ' não está na planilha de custos' : 'esperando Aplicar na aba PRÉVIA';
    else if (Math.abs(a.valor - custo) >= 0.005) {
      motivo = cfg.aplicarAuto ? 'na planilha de custos continua R$ ' + a.valor.toFixed(2).replace('.', ',') +
        ' (veja o LOG; clique em Sincronizar para tentar de novo)' : 'esperando Aplicar na aba PRÉVIA';
    }
    if (motivo) {
      sh.getRange(i + 2, 8).setValue('LANÇADO, mas NÃO chegou na planilha de custos: ' + motivo);
      res.detalhes.push('✗ ' + (sku || produto) + ': ' + motivo);
      return;
    }
    ok++;
    apagar.push(i + 2);
    var txt = sku + ' = R$ ' + custo.toFixed(2).replace('.', ',') + ' conferido em ' + cfg.abaCustos + ', linha ' + a.linha;
    res.detalhes.push('✓ ' + txt);
    log.push([agora, 'LANÇAR CUSTO', '', 'OK', 1, 1, '', 0, txt + (r[5] ? ' | nota ' + r[5] : '') + (r[4] ? ' | ' + r[4] : '')]);
  });
  anexar(ABA.LOG, log);
  apagar.reverse().forEach(function (l) { sh.deleteRow(l); });
  res.resumo = ok + ' lançamento(s) conferido(s) na planilha de custos e tirado(s) da aba LANÇAR CUSTO (registro no LOG)' +
    (pendentes.length > ok ? '; ' + (pendentes.length - ok) + ' ficaram na aba com o motivo na coluna Situação.' : '.');
  return res;
}

function temLancamentoPendente() {
  var sh = SpreadsheetApp.getActive().getSheetByName(ABA.LANCAR);
  if (!sh || sh.getLastRow() < 2) return false;
  return sh.getRange(2, 1, sh.getLastRow() - 1, 8).getValues().some(function (r) {
    return (r[0] !== '' || r[1] !== '') && Number(r[2]) > 0 && r[7] === '';
  });
}

// Linha com custo e sem Situação: acha o produto (código de barras, SKU ou nome),
// grava em ENTRADAS como compra "MANUAL" e sincroniza. Nome sem certeza: CONFIRA.
function lancarCustos(silencioso, semSincronizar) {
  silencioso = silencioso === true;
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(ABA.LANCAR);
  if (!sh || sh.getLastRow() < 2) { if (!silencioso) ss.toast('A aba LANÇAR CUSTO está vazia.'); return 0; }
  var cfg = lerConfig();
  var ctx = carregarContexto();
  var catalogo = null, porSku = {}, porEanCat = {};
  var abrirCatalogo = function () {
    if (catalogo) return;
    catalogo = cfg.planilhaMkt ? carregarCatalogo(cfg) : [];
    catalogo.forEach(function (it) {
      if (!porSku[it.sku.toUpperCase()]) porSku[it.sku.toUpperCase()] = it;
      if (it.principal && !porSku[it.principal.toUpperCase()]) porSku[it.principal.toUpperCase()] = it;
      if (it.ean && !porEanCat[it.ean]) porEanCat[it.ean] = it;
    });
  };
  var nomeCat = function (it) { return it.sku + ' - ' + it.desc + (it.variacao ? ' [' + it.variacao + ']' : ''); };

  var v = sh.getRange(2, 1, sh.getLastRow() - 1, CAB.LANCAR.length).getValues();
  var agora = new Date(), linhas = [], extras = [], lancados = 0, conferir = 0;
  var hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  v.forEach(function (r, i) {
    var cod = String(r[0]).trim(), nome = String(r[1]).trim(), custo = Number(r[2]);
    if ((!cod && !nome) || !(custo > 0) || r[7] !== '') return;
    var situacao, achado = '', sku = '', item = null;
    abrirCatalogo();
    if (cod) {
      var ean = /^\d{8,14}$/.test(cod.replace(/\D/g, '')) && !/[A-Z]/i.test(cod) ? eanTexto(cod) : '';
      if (ean) { sku = ctx.porEan[ean] || ''; item = porEanCat[ean] || null; }
      else {
        sku = ctx.skus[cod] ? cod : (ctx.porSkuMkt[cod.toUpperCase()] || '');
        item = porSku[cod.toUpperCase()] || null;
      }
      if (!sku && !item) situacao = 'NÃO ACHEI "' + cod + '" no SKU - MKTPLACE nem em SKUs';
    } else {
      var top = melhoresDoCatalogo(nome, catalogo, 2);
      if (top[0] && top[0].s >= 0.9 && (!top[1] || top[0].s - top[1].s >= 0.1)) item = top[0].it;
      else {
        situacao = 'CONFIRA: escreva o SKU certo na coluna A e apague esta mensagem';
        achado = top.filter(function (t) { return t.s >= 0.5; }).map(function (t) { return nomeCat(t.it); }).join('  OU  ') ||
          'nada parecido no SKU - MKTPLACE';
      }
    }
    if (!situacao) {
      if (!sku && item) sku = ctx.porSkuMkt[item.sku.toUpperCase()] || ctx.porEan[item.ean] || '';
      if (!sku) {
        sku = item.sku;
        novoSku(ctx, sku, item.desc + (item.variacao ? ' ' + item.variacao : ''), item.ean, 'UN', 'Lançamento manual');
      }
      if (item && !ctx.skus[sku].mkt) {
        gravarVinculo(ss.getSheetByName(ABA.SKUS), ctx.skus[sku].linha, item, agora);
        ctx.skus[sku].mkt = item.sku;
      }
      var qtd = Number(r[3]) > 0 ? Number(r[3]) : 1;
      var data = r[6] instanceof Date ? r[6] : hoje;
      var nota = String(r[5]).trim() || 'MANUAL';
      linhas.push([data, nota, r[4], '', '', item ? item.ean : '', item ? item.desc : nome || cod, qtd, 'UN',
                   custo, Math.round(custo * qtd * 100) / 100, 'NÃO', sku, 1]);
      extras.push([nota, 'MANUAL', 'LANÇAR CUSTO', agora]);
      situacao = 'LANÇADO em ' + Utilities.formatDate(agora, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
      achado = item ? nomeCat(item) : sku;
      lancados++;
    } else {
      conferir++;
    }
    sh.getRange(i + 2, 8, 1, 2).setValues([[situacao, achado]]);
  });
  gravarEntradas(linhas, extras);
  var msg = lancados + ' custo(s) novo(s) lançado(s)' + (conferir ? ', ' + conferir + ' para conferir (veja a coluna Situação)' : '') + '. ';
  // linhas LANÇADO que ainda não tinham chegado na planilha de custos também são reenviadas
  var travadas = v.some(function (r) { return /^LANÇADO,/.test(String(r[7])); });
  if ((lancados || travadas) && !semSincronizar) {
    msg += sincronizar(cfg);
    var c = conferirLancamentos(cfg);
    msg += '\n\n' + c.resumo + (c.detalhes.length ? '\n\n' + c.detalhes.join('\n') : '');
  }
  if (!silencioso) SpreadsheetApp.getUi().alert(msg);
  return lancados;
}

// ===========================================================================
// Vínculo com o SKU - MKTPLACE e envio para a planilha de custos
// ===========================================================================

// Custo de cada SKU interno calculado direto de ENTRADAS (mesma regra da aba CUSTOS, sem depender
// do recálculo das fórmulas). Vale o que entrou por último (coluna Importado em), não a data da nota.
//   ÚLTIMO PAGO: valor pago / qtd da última linha não bonificada
//   EFETIVO: total pago / qtd total do último grupo de compra (bonificação dilui)
//   MÉDIO: total pago / qtd total de todas as entradas
function calcularCustos(oficial) {
  var ent = SpreadsheetApp.getActive().getSheetByName(ABA.ENTRADAS);
  var n = ultimaLinhaColA(ent), por = {};
  if (n < 2) return {};
  ent.getRange(2, 1, n - 1, 20).getValues().forEach(function (r) {
    var sku = String(r[12]).trim();
    if (!sku || r[0] === '') return;
    var qtd = (Number(r[7]) || 0) * (Number(r[13]) || 1);
    var quando = r[19] instanceof Date ? r[19].getTime() : 0;
    var doc = r[0] instanceof Date ? r[0].getTime() : 0;
    (por[sku] = por[sku] || []).push({ qtd: qtd, pago: Number(r[10]) || 0, bonif: r[11] === 'SIM',
      grupo: String(r[16] || r[1]), forn: r[2], quando: quando, doc: doc });
  });
  var res = {};
  Object.keys(por).forEach(function (sku) {
    var l = por[sku].sort(function (a, b) { return (b.quando - a.quando) || (b.doc - a.doc); });
    var pagas = l.filter(function (x) { return !x.bonif && x.qtd > 0; });
    if (!pagas.length) return;
    var soma = function (lista, campo) { return lista.reduce(function (t, x) { return t + x[campo]; }, 0); };
    var custo = pagas[0].pago / pagas[0].qtd;
    if (oficial === 'EFETIVO') {
      var g = l.filter(function (x) { return x.grupo === l[0].grupo; });
      if (soma(g, 'qtd')) custo = soma(g, 'pago') / soma(g, 'qtd');
    } else if (oficial === 'MÉDIO' && soma(l, 'qtd')) {
      custo = soma(l, 'pago') / soma(l, 'qtd');
    }
    res[sku] = { custo: custo, fornecedor: pagas[0].forn, data: l[0].quando };
  });
  return res;
}

// Vincula, monta a prévia e (Aplicar automaticamente = SIM) grava. Devolve um resumo.
function sincronizar(cfg) {
  if (!cfg.planilhaMkt || !cfg.planilhaCustos) {
    registrarLog('SINCRONIZAR', '', 'CONFERIR', 0, 0, 0, 'Preencha em CONFIG os links da planilha SKU - MKTPLACE e da planilha de custos.');
    return 'Não sincronizou: faltam os links das planilhas em CONFIG.';
  }
  try {
    SpreadsheetApp.flush();
    var sv = sugerirVinculos(true);
    var pv = gerarPrevia(true);
    var ap = pv && cfg.aplicarAuto ? aplicarPrevia(true) : 0;
    return (sv ? sv + ' produto(s) para confirmar em VINCULAR. ' : '') +
      (cfg.aplicarAuto ? ap + ' alteração(ões) gravada(s) em ' + cfg.abaCustos + '.' : pv + ' alteração(ões) na aba PRÉVIA.');
  } catch (e) {
    registrarLog('SINCRONIZAR', '', 'ERRO', 0, 0, 0, String(e && e.message || e));
    return 'Erro ao sincronizar: ' + (e && e.message || e);
  }
}

function sincronizarAgora() {
  var cfg = lerConfig();
  var msg = sincronizar(cfg);
  var c = conferirLancamentos(cfg); // linhas LANÇADO que ainda não tinham chegado
  if (c.detalhes.length) msg += '\n\n' + c.resumo + '\n\n' + c.detalhes.join('\n');
  SpreadsheetApp.getUi().alert('Sincronização', msg, SpreadsheetApp.getUi().ButtonSet.OK);
}

function idDePlanilha(s) {
  var m = String(s || '').match(/\/d\/([a-zA-Z0-9_-]{20,})/);
  return m ? m[1] : String(s || '').trim();
}

function sugerirVinculos(silencioso) {
  var ss = SpreadsheetApp.getActive();
  var cfg = lerConfig();
  var catalogo = carregarCatalogo(cfg);
  var porEan = {};
  catalogo.forEach(function (it) { if (it.ean) porEan[it.ean] = porEan[it.ean] || it; });

  var skus = ss.getSheetByName(ABA.SKUS);
  var n = ultimaLinhaColA(skus);
  if (n < 2) return 0;
  var v = skus.getRange(2, 1, n - 1, 13).getValues();

  var vin = ss.getSheetByName(ABA.VINCULAR);
  var jaListados = {};
  if (ultimaLinhaColA(vin) > 1) {
    vin.getRange(2, 1, ultimaLinhaColA(vin) - 1, 1).getValues().forEach(function (r) { jaListados[String(r[0])] = 1; });
  }
  var fornecedores = fornecedorPorSku();
  var novas = [], agora = new Date(), porEanFeitos = {};
  v.forEach(function (r, i) {
    var sku = String(r[0]).trim();
    if (!sku || r[9] !== '') return;
    var eans = String(r[2]).split(/[,;\s]+/).map(eanTexto).filter(Boolean);
    for (var k = 0; k < eans.length; k++) {
      var achado = porEan[eans[k]];
      if (achado) { gravarVinculo(skus, i + 2, achado, agora); porEanFeitos[sku] = 1; return; }
    }
    if (jaListados[sku]) return;
    var top = melhoresDoCatalogo(String(r[1]), catalogo, 2);
    var a = top[0], b = top[1];
    var bom = a && a.s >= 0.5;
    novas.push([sku, r[1], fornecedores[sku] || '',
      bom ? a.it.sku : '', bom ? a.it.desc : '(nada parecido no SKU - MKTPLACE)', bom ? a.it.variacao : '',
      bom ? a.it.ean : '', bom ? a.it.aba : '', a ? a.s : 0,
      b && b.s >= 0.5 ? b.it.sku + ' - ' + b.it.desc + (b.it.variacao ? ' [' + b.it.variacao + ']' : '') : '',
      bom && a.s >= cfg.limiarVinculo && (!b || a.s - b.s >= 0.05) ? a.it.sku : '']);
  });
  if (Object.keys(porEanFeitos).length && ultimaLinhaColA(vin) > 1) {
    var cods = vin.getRange(2, 1, ultimaLinhaColA(vin) - 1, 1).getValues();
    for (var j = cods.length - 1; j >= 0; j--) if (porEanFeitos[String(cods[j][0])]) vin.deleteRow(j + 2);
  }
  anexar(ABA.VINCULAR, novas);
  if (!silencioso) ss.toast(novas.length + ' produto(s) para conferir na aba VINCULAR.', 'Custos', 8);
  return novas.length;
}

function gravarVinculo(skus, linha, item, quando) {
  skus.getRange(linha, 10, 1, 4).setValues([[item.sku, item.ean, item.aba, quando]]);
}

function fornecedorPorSku() {
  var cus = SpreadsheetApp.getActive().getSheetByName(ABA.CUSTOS);
  var r = {};
  if (cus.getLastRow() < 2) return r;
  cus.getRange(2, 1, cus.getLastRow() - 1, 5).getValues().forEach(function (x) { if (x[0] !== '') r[String(x[0])] = x[4]; });
  return r;
}

function confirmarVinculos() {
  var ss = SpreadsheetApp.getActive();
  var cfg = lerConfig();
  var vin = ss.getSheetByName(ABA.VINCULAR);
  var n = ultimaLinhaColA(vin);
  if (n < 2) { ss.toast('Nada para confirmar em VINCULAR.'); return; }
  var catalogo = carregarCatalogo(cfg);
  var porSku = {}, porEan = {};
  catalogo.forEach(function (it) {
    porSku[it.sku.toUpperCase()] = it;
    if (it.principal && !porSku[it.principal.toUpperCase()]) porSku[it.principal.toUpperCase()] = it;
    if (it.ean && !porEan[it.ean]) porEan[it.ean] = it;
  });
  var skus = ss.getSheetByName(ABA.SKUS);
  var linhaSku = {};
  skus.getRange(2, 1, Math.max(1, ultimaLinhaColA(skus) - 1), 1).getValues()
    .forEach(function (r, i) { linhaSku[String(r[0]).trim()] = i + 2; });

  var v = vin.getRange(2, 1, n - 1, CAB.VINCULAR.length).getValues();
  var feitos = [], erros = [], agora = new Date();
  v.forEach(function (r, i) {
    var escolha = String(r[10]).trim();
    if (!escolha) return;
    var linha = linhaSku[String(r[0]).trim()];
    if (!linha) { erros.push('Linha ' + (i + 2) + ': código ' + r[0] + ' não está em SKUs.'); return; }
    if (/^N[AÃ]O\s*TEM$/i.test(escolha)) {
      skus.getRange(linha, 10, 1, 4).setValues([[SEM_CADASTRO, '', '', agora]]);
      feitos.push(i + 2);
      return;
    }
    var it = porSku[escolha.toUpperCase()] || porEan[eanTexto(escolha)];
    if (!it) { erros.push('Linha ' + (i + 2) + ': "' + escolha + '" não existe no SKU - MKTPLACE.'); return; }
    gravarVinculo(skus, linha, it, agora);
    feitos.push(i + 2);
  });
  feitos.reverse().forEach(function (l) { vin.deleteRow(l); });
  SpreadsheetApp.flush();
  var pv = feitos.length ? gerarPrevia(true) : 0;
  var ap = pv && cfg.aplicarAuto ? aplicarPrevia(true) : 0;
  SpreadsheetApp.getUi().alert(feitos.length + ' vínculo(s) confirmado(s).' +
    (ap ? '\n' + ap + ' alteração(ões) gravada(s) na planilha de custos.'
        : feitos.length ? '\n' + pv + ' alteração(ões) de custo/produto na aba PRÉVIA.' : '') +
    (erros.length ? '\n\nNão confirmados:\n' + erros.join('\n') : ''));
}

function gerarPrevia(silencioso) {
  var ss = SpreadsheetApp.getActive();
  var cfg = lerConfig();
  if (!cfg.planilhaCustos) throw new Error('Preencha em CONFIG o link da planilha de custos.');
  var alvo = SpreadsheetApp.openById(cfg.planilhaCustos).getSheetByName(cfg.abaCustos);
  if (!alvo) throw new Error('Aba "' + cfg.abaCustos + '" não encontrada na planilha de custos.');
  var linhasAlvo = alvo.getLastRow() > 1 ? alvo.getRange(2, 1, alvo.getLastRow() - 1, 9).getValues() : [];
  var idxSku = {}, idxEan = {};
  linhasAlvo.forEach(function (r, i) {
    [r[1], r[2]].forEach(function (s) {
      s = String(s).trim().toUpperCase();
      if (s) (idxSku[s] = idxSku[s] || []).indexOf(i) < 0 && idxSku[s].push(i);
    });
    var e = eanTexto(r[0]);
    if (e) (idxEan[e] = idxEan[e] || []).push(i);
  });

  var custos = calcularCustos(cfg.custoOficial);
  var catalogo = null; // só carrega se tiver produto novo para adicionar
  var skus = ss.getSheetByName(ABA.SKUS);
  var nS = ultimaLinhaColA(skus);
  var v = nS > 1 ? skus.getRange(2, 1, nS - 1, 13).getValues() : [];
  // o mesmo produto do marketplace pode ter mais de um SKU interno (romaneio, XML, lançamento manual):
  // vale o que tem a compra mais recente
  var escolhido = {};
  v.forEach(function (r) {
    var cod = String(r[0]).trim(), skuMkt = String(r[9]).trim();
    var c = custos[cod];
    if (!skuMkt || skuMkt === SEM_CADASTRO || !c || !(c.custo > 0)) return;
    if (!escolhido[skuMkt] || c.data >= escolhido[skuMkt].c.data) escolhido[skuMkt] = { r: r, c: c };
  });
  var previa = [];
  Object.keys(escolhido).forEach(function (skuMkt) {
    var r = escolhido[skuMkt].r, c = escolhido[skuMkt].c, cod = String(r[0]).trim();
    var novo = Math.round(c.custo * 100) / 100;
    var linhas = idxSku[skuMkt.toUpperCase()] || idxEan[eanTexto(r[10])] || [];
    if (linhas.length) {
      linhas.forEach(function (i) {
        var atual = Number(linhasAlvo[i][8]) || 0;
        if (Math.abs(atual - novo) < 0.005) return;
        previa.push(['ATUALIZAR CUSTO', skuMkt, eanTexto(linhasAlvo[i][0]), linhasAlvo[i][6], linhasAlvo[i][7],
          atual || '', novo, atual ? novo / atual - 1 : '', i + 2, cod, c.fornecedor, r[11]]);
      });
    } else {
      catalogo = catalogo || carregarCatalogo(cfg);
      var it = null;
      for (var k = 0; k < catalogo.length; k++) if (catalogo[k].sku === skuMkt) { it = catalogo[k]; break; }
      if (!it) return;
      previa.push(['ADICIONAR LINHA', skuMkt, it.ean, it.desc, it.variacao, '', novo, '', '', cod, c.fornecedor, it.aba]);
    }
  });

  var sh = ss.getSheetByName(ABA.PREVIA);
  if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, CAB.PREVIA.length).clearContent();
  if (previa.length) sh.getRange(2, 1, previa.length, CAB.PREVIA.length).setValues(previa);
  if (!silencioso) ss.toast(previa.length + ' alteração(ões) na aba PRÉVIA. Confira e clique em Aplicar na planilha.', 'Custos', 8);
  return previa.length;
}

function aplicarPrevia(silencioso) {
  silencioso = silencioso === true;
  var ss = SpreadsheetApp.getActive();
  var cfg = lerConfig();
  var sh = ss.getSheetByName(ABA.PREVIA);
  var n = ultimaLinhaColA(sh);
  if (n < 2) { if (!silencioso) ss.toast('A PRÉVIA está vazia.'); return 0; }
  var v = sh.getRange(2, 1, n - 1, CAB.PREVIA.length).getValues();
  var nAt = v.filter(function (r) { return r[0] === 'ATUALIZAR CUSTO'; }).length;
  var nAd = v.length - nAt;
  if (!silencioso) {
    var ui = SpreadsheetApp.getUi();
    if (ui.alert('Aplicar na planilha de custos?', nAt + ' custo(s) atualizado(s) na coluna I e ' + nAd +
        ' linha(s) nova(s) em ' + cfg.abaCustos + '.', ui.ButtonSet.OK_CANCEL) !== ui.Button.OK) return 0;
  }

  var alvo = SpreadsheetApp.openById(cfg.planilhaCustos).getSheetByName(cfg.abaCustos);
  var ult = alvo.getLastRow();
  var skusAlvo = alvo.getRange(1, 1, ult, 9).getValues(); // A (EAN) .. I (Custo)
  var feitos = 0, avisos = [], novas = [], hist = [], agora = new Date();
  v.forEach(function (r) {
    if (r[0] === 'ATUALIZAR CUSTO') {
      var linha = Number(r[8]);
      // a linha é do produto se o SKU (B ou C) ou o EAN (A) bate: o SKU - MKTPLACE às vezes usa o SKU
      // da variação e a planilha de custos o principal
      var confere = function (l) {
        var x = skusAlvo[l - 1];
        if (!x) return false;
        if ([x[1], x[2]].some(function (s) { return String(s).trim().toUpperCase() === String(r[1]).toUpperCase(); })) return true;
        return !!r[2] && eanTexto(x[0]) === eanTexto(r[2]);
      };
      if (!confere(linha)) { // a planilha mudou desde a prévia: procura o SKU de novo
        linha = 0;
        for (var i = 2; i <= ult; i++) if (confere(i)) { linha = i; break; }
      }
      if (!linha) { avisos.push(r[1] + ': não achei mais na planilha de custos.'); return; }
      var anterior = Number(skusAlvo[linha - 1][8]) || 0;
      // já estava com o valor novo (prévia aplicada antes, pela metade): o anterior é o da prévia
      if (Math.abs(anterior - r[6]) < 0.005 && Number(r[5])) anterior = Number(r[5]);
      alvo.getRange(linha, 9).setValue(r[6]);
      hist.push([agora, r[1], r[2], r[3], r[4], anterior || '', r[6], anterior ? r[6] / anterior - 1 : '',
                 'CUSTO ATUALIZADO', r[9], r[10], cfg.abaCustos + ' linha ' + linha, anterior ? r[6] - anterior : '']);
      feitos++;
    } else {
      // EAN | SKU Principal | SKU Variação | Marca | Categoria | Fornecedor | Nome | Nome da Variação | Custo
      novas.push([r[2] ? Number(r[2]) : '', r[1], r[1], r[11], '', r[10], r[3], r[4], r[6]]);
      hist.push([agora, r[1], r[2], r[3], r[4], '', r[6], '', 'LINHA ADICIONADA', r[9], r[10], cfg.abaCustos, '']);
    }
  });
  var linhasNovasOk = !novas.length;
  try {
    if (novas.length) {
      var ini = ult + 1;
      var faltam = ini + novas.length - 1 - alvo.getMaxRows();
      if (faltam > 0) alvo.insertRowsAfter(alvo.getMaxRows(), faltam); // a aba acaba na última linha usada
      alvo.getRange(ult, 1, 1, 9).copyTo(alvo.getRange(ini, 1, novas.length, 9), SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
      alvo.getRange(ini, 1, novas.length, 9).setValues(novas);
      feitos += novas.length;
      linhasNovasOk = true;
    }
  } finally {
    // o que já foi gravado vai para o histórico mesmo se as linhas novas falharem
    anexar(ABA.HISTORICO, linhasNovasOk ? hist : hist.filter(function (h) { return h[8] === 'CUSTO ATUALIZADO'; }));
  }
  sh.getRange(2, 1, n - 1, CAB.PREVIA.length).clearContent();
  registrarLog('PLANILHA DE CUSTOS', '', avisos.length ? 'CONFERIR' : 'OK', v.length, feitos, 0,
    (nAt - avisos.length) + ' custo(s) atualizado(s), ' + novas.length + ' linha(s) adicionada(s) em ' + cfg.abaCustos +
    (silencioso ? ' (automático)' : '') + (avisos.length ? ' | ' + avisos.join(' | ') : ''));
  if (!silencioso) {
    SpreadsheetApp.getUi().alert('Pronto: ' + feitos + ' alteração(ões) gravada(s) em ' + cfg.abaCustos + '.' +
      (avisos.length ? '\n\nAvisos:\n' + avisos.join('\n') : ''));
  }
  return feitos;
}

// ===========================================================================
// Catálogo do SKU - MKTPLACE e comparação de descrições
// ===========================================================================

var ABREV = {
  SH: 'SHAMPOO', SHAMP: 'SHAMPOO', COND: 'CONDICIONADOR', CD: 'CONDICIONADOR', MASC: 'MASCARA',
  TRAT: 'TRATAMENTO', HIDRAT: 'HIDRATANTE', HID: 'HIDRATANTE', PROT: 'PROTETOR', CR: 'CREME',
  SAB: 'SABONETE', DESOD: 'DESODORANTE', PERF: 'PERFUME', ESM: 'ESMALTE', ILUM: 'ILUMINADOR',
  CORR: 'CORRETIVO', DEMAQ: 'DEMAQUILANTE', FINALIZ: 'FINALIZADOR', LOC: 'LOCAO', PROF: 'PROFESSIONNEL',
  FEM: 'FEMININO', REF: 'REFIL', UN: '', UNID: ''
};
var PALAVRAS_VAZIAS = { DE: 1, DA: 1, DO: 1, COM: 1, E: 1, PARA: 1, EM: 1, A: 1, O: 1 };

var CATALOGO_CACHE = null;
function carregarCatalogo(cfg) {
  if (!cfg.planilhaMkt) throw new Error('Preencha em CONFIG o link da planilha SKU - MKTPLACE.');
  if (CATALOGO_CACHE) return CATALOGO_CACHE;
  var itens = [];
  SpreadsheetApp.openById(cfg.planilhaMkt).getSheets().forEach(function (sh) {
    var aba = sh.getName();
    if (cfg.abasIgnoradas.indexOf(aba.toUpperCase()) >= 0 || sh.getLastRow() < 2) return;
    var v = sh.getRange(1, 1, sh.getLastRow(), Math.min(5, sh.getLastColumn())).getValues();
    if (!/SKU/i.test(String(v[0][0]))) return; // aba que não é de marca
    var principal = '', descAnterior = '';
    for (var i = 1; i < v.length; i++) {
      var r = v[i].concat(['', '', '', '', '']);
      if (!r[0] && !r[1] && !r[2] && !r[4]) continue;
      if (r[0]) principal = String(r[0]).trim();
      else if (r[2] && r[2] !== descAnterior && !r[4]) principal = '';
      if (r[2]) descAnterior = r[2];
      var skuVar = String(r[4] || '').trim();
      var sku = skuVar || principal;
      if (!sku) continue;
      // linha de variação costuma deixar a descrição em branco: vale a da linha de cima
      var desc = String(r[2] || descAnterior || ''), variacao = r[3] === '' || r[3] == null ? '' : String(r[3]);
      itens.push({
        aba: aba, principal: principal, skuVar: skuVar, sku: sku, ean: eanTexto(r[1]),
        desc: desc, variacao: variacao,
        tok: tokensCat(aba + ' ' + desc + ' ' + variacao, false),
        tokVar: tokensCat(variacao, false),
        kit: /^KT-/i.test(sku) || / \+ /.test(desc) || /\(\d+ PRODUTOS\)/i.test(desc)
      });
    }
  });
  CATALOGO_CACHE = itens;
  return itens;
}

function normalizarCat(s) {
  return String(s == null ? '' : s).toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/['’`]/g, '')
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/(\d)\s+(ML|L|LT|G|GR|KG|MG|UN|M|CM|MM)\b/g, '$1$2')
    .replace(/[^A-Z0-9.]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function tokensCat(s, expandir) {
  return normalizarCat(s).split(' ').filter(Boolean).map(function (t) {
    return expandir && ABREV.hasOwnProperty(t) ? ABREV[t] : t;
  }).filter(function (t) { return t && !PALAVRAS_VAZIAS[t]; });
}

// 250G e 250ML contam como a mesma medida (o romaneio e o marketplace misturam)
function medida(t) { var m = t.match(/^(\d+(?:\.\d+)?)(ML|L|LT|G|GR|KG|MG)$/); return m ? m[1] : null; }

function tokenBate(a, b) {
  if (a === b) return true;
  var ma = medida(a), mb = medida(b);
  if (ma && mb) return ma === mb;
  if (/^\d/.test(a) || /^\d/.test(b)) return false;
  return a.length >= 3 && b.length >= 3 && (a.indexOf(b) === 0 || b.indexOf(a) === 0);
}

function pontuarCatalogo(tokRom, item) {
  var tokCat = item.tok;
  if (!tokRom.length || !tokCat.length) return 0;
  var usados = {}, achou = 0, medRom = 0, medOk = 0;
  tokRom.forEach(function (t) {
    var ehMed = !!medida(t);
    if (ehMed) medRom++;
    for (var j = 0; j < tokCat.length; j++) {
      if (!usados[j] && tokenBate(t, tokCat[j])) { usados[j] = 1; achou++; if (ehMed) medOk++; return; }
    }
  });
  var s = 0.8 * (achou / tokRom.length) + 0.2 * Math.min(1, 2 * achou / tokCat.length);
  // tamanho: diferente derruba pela metade; o catálogo sem tamanho no nome só pesa um pouco
  var medCat = tokCat.filter(function (x) { return medida(x); }).length;
  if (medRom && medOk < medRom) s *= medCat ? 0.5 : 0.9;
  if (item.kit && tokRom.indexOf('KIT') < 0) s *= 0.6;                            // kit x avulso
  if (item.tokVar.length && !item.tokVar.every(function (v) {                     // cor/variação ausente
    return tokRom.some(function (t) { return tokenBate(t, v); });
  })) s *= 0.4;
  return Math.round(s * 1000) / 1000;
}

function melhoresDoCatalogo(desc, catalogo, n) {
  var tok = tokensCat(desc, true);
  return catalogo.map(function (it) { return { it: it, s: pontuarCatalogo(tok, it) }; })
    .sort(function (a, b) { return b.s - a.s; }).slice(0, n);
}

// ===========================================================================
// Leitura do PDF do romaneio (VarejoFácil)
// ===========================================================================

function lerPdf(arq, cfg) {
  var texto = '';
  try { texto = textoPdfDireto(arq.getBlob().getBytes()); } catch (e) { texto = 'Erro ao ler o PDF: ' + (e && e.message || e); }
  var doc = lerRomaneioVarejoFacil(texto, cfg);
  if (!doc.itens.length) gravarDiagnostico(arq.getName(), texto);
  return doc;
}

function gravarDiagnostico(nome, texto) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName('DIAGNOSTICO') || ss.insertSheet('DIAGNOSTICO');
  sh.clear();
  var linhas = [['Texto lido de ' + nome + ' em ' + new Date().toLocaleString('pt-BR')], ['']]
    .concat(String(texto).split('\n').map(function (l) { return [l.slice(0, 5000)]; }));
  sh.getRange(1, 1, linhas.length, 1).setNumberFormat('@').setValues(linhas);
  sh.setColumnWidth(1, 1400);
}

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
  // Quantidade grande espreme a coluna e o item quebra em 3 linhas: a embalagem fica "UN/1," em cima,
  // o "0000" vai para baixo e o nº do item desce para o meio, antes dos valores. Por isso o nº do item
  // pode vir antes do código ou depois da embalagem.
  var re = new RegExp('(?:^|\\s)(?:(\\d{1,4}) )?(\\* )?(\\d{5,14}) - (.+?) (' + NUM + ') ([A-Za-z]{1,5})\\/(\\d[\\d.]*,?\\d*)' +
    '(?: (\\d{1,4}))?((?: ' + NUM + ')+)(.*?)(?=\\s(?:\\d{1,4} )?(?:\\* )?\\d{5,14} - |\\sQtd\\. de itens|$)', 'g');
  while ((m = re.exec(plano))) {
    var nums = m[9].trim().split(' ').map(numeroBR);
    var qtd = numeroBR(m[5]);
    if (nums.length < 4 || !qtd) continue;
    var vUnit = nums[0], total = nums[3];
    var resto = m[10].replace(/(Valores|Base ICMS|Observa[çc][ãa]o|Loja:|ROMANEIO).*$/i, '').trim();
    var fatorTxt = m[7];
    if (/,$/.test(fatorTxt)) { // decimais da embalagem foram para a linha de baixo
      var dec = resto.match(/(^|\s)(\d{1,4})(?=\s|$)/);
      if (dec) { fatorTxt += dec[2]; resto = (resto.slice(0, dec.index) + ' ' + resto.slice(dec.index + dec[0].length)).trim(); }
      else fatorTxt += '0';
    }
    doc.itens.push({
      cod: '',
      codInterno: m[3].replace(/^0+(?=\d)/, ''),
      ean: '',
      desc: (m[4] + ' ' + resto).replace(/\s+/g, ' ').trim(),
      qtd: qtd,
      unid: m[6].toUpperCase(),
      fator: numeroBR(fatorTxt) || 1,
      vUnit: vUnit,
      vTotal: total,
      bonif: bonifDoc || total === 0 || vUnit === 0
    });
  }
  return doc;
}

// Leitor de PDF próprio: descompacta as páginas, pega cada texto com sua posição (x, y)
// e remonta as linhas da esquerda para a direita, de cima para baixo.
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

// ===========================================================================
// Leitura do XML da NF-e
// ===========================================================================

function lerXmlNfe(xml, cfg) {
  var root = XmlService.parse(xml).getRootElement();
  var infNFe = achar(root, 'infNFe');
  if (!infNFe) throw new Error('XML não é uma NF-e.');
  var ide = achar(infNFe, 'ide'), emit = achar(infNFe, 'emit');
  var doc = {
    chave: txt(root, 'chNFe'),
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

// ===========================================================================
// Utilitários
// ===========================================================================

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

function eanTexto(v) {
  if (v === '' || v == null) return '';
  var d = typeof v === 'number' ? String(Math.round(v)) : soDigitos(v);
  return d.replace(/^0+/, '');
}

// Imagens dos botões (PNG em base64)
var BOTAO_IMPORTAR = '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';
var BOTAO_SINCRONIZAR = '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';
var BOTAO_LANCAR = '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';
var BOTAO_VINCULOS = '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';
var BOTAO_APLICAR = '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';

if (typeof module !== 'undefined') {
  module.exports = {
    textoPdfDireto: textoPdfDireto, lerRomaneioVarejoFacil: lerRomaneioVarejoFacil, lerXmlNfe: lerXmlNfe,
    tokensCat: tokensCat, pontuarCatalogo: pontuarCatalogo, melhoresDoCatalogo: melhoresDoCatalogo
  };
}
