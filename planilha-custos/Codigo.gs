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
  KITS: 'KITS',
  REVISAR_KITS: 'REVISAR KITS',
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
  KITS: ['SKU do kit', 'SKU atual', 'EAN do kit', 'Nome do kit', 'Componente (do nome)', 'Qtd', 'SKU sugerido',
         'Produto sugerido', 'Similaridade', '2ª sugestão', 'CONFIRMAR (SKU do componente ou NÃO TEM)', 'Situação do kit',
         'Aprovado em'],
  REVISAR_KITS: ['SKU do kit', 'Aprovar', 'Nome do kit', 'Componentes escolhidos (produto e custo)', 'Custo calculado',
                 'Custo atual na planilha', 'Diferença', 'Alerta', 'Linha na planilha de custos',
                 'CORRIGIR (ex.: HON-0001 + 2x HON-0002)'],
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
  ['Aplicar automaticamente na planilha de custos', 'SIM', 'SIM: grava sozinho. NÃO: espera o botão Aplicar na aba PRÉVIA.'],
  ['Adicionar produtos novos do SKU - MKTPLACE', 'SIM', 'SIM: a sincronização adiciona na planilha de custos os produtos do SKU - MKTPLACE que ainda não estão lá (custo da coluna CUSTO, se tiver). Para deixar uma aba de fora, ponha em "Abas ignoradas".'],
  ['Planilha de kits (link ou ID)', '', 'Lista de kits (SKU novo, SKU atual, nome, marca, EAN) usada para sugerir os componentes.'],
  ['Aba da planilha de kits', '', 'Vazio: a primeira aba.']
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
    .addItem('Adicionar agora os produtos novos do SKU - MKTPLACE', 'adicionarNovosAgora')
    .addSeparator()
    .addItem('Confirmar vínculos (aba VINCULAR)', 'confirmarVinculos')
    .addItem('Sugerir componentes dos kits (aba KITS)', 'sugerirKits')
    .addItem('Revisar kits (aba REVISAR KITS)', 'revisarKits')
    .addItem('Aprovar todos os kits verdes', 'aprovarKitsVerdes')
    .addItem('Gravar kits aprovados', 'calcularKits')
    .addItem('Reabrir um kit aprovado para revisão', 'reabrirKit')
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
    KITS: function (sh) {
      sh.getRange('A:C').setNumberFormat('@'); sh.getRange('G:G').setNumberFormat('@'); sh.getRange('K:K').setNumberFormat('@');
      sh.getRange('I2:I').setNumberFormat('0%'); sh.getRange(1, 11).setBackground('#b45309');
      sh.setColumnWidth(4, 380); sh.setColumnWidth(5, 260); sh.setColumnWidth(8, 380); sh.setColumnWidth(10, 300);
      sh.setColumnWidth(12, 420);
    },
    REVISAR_KITS: function (sh) {
      sh.getRange('A:A').setNumberFormat('@'); sh.getRange('E2:F').setNumberFormat('R$ #,##0.00');
      sh.getRange('G2:G').setNumberFormat('+0%;-0%;0%'); sh.setColumnWidth(2, 70); sh.setColumnWidth(3, 380);
      sh.setColumnWidth(4, 700); sh.setColumnWidth(8, 300); sh.getRange(1, 2).setBackground('#15803d');
      sh.getRange('J:J').setNumberFormat('@'); sh.setColumnWidth(10, 320); sh.getRange(1, 10).setBackground('#b45309');
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
  ['SKUS', 'ENTRADAS', 'LANCAR', 'KITS', 'REVISAR_KITS', 'VINCULAR', 'PREVIA', 'HISTORICO', 'LOG'].forEach(function (k) {
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

  var ordem = [ABA.LEIAME, ABA.CUSTOS, ABA.LANCAR, ABA.REVISAR_KITS, ABA.KITS, ABA.AUMENTOS, ABA.HISTORICO, ABA.SKUS, ABA.ENTRADAS,
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
    ['PRODUTOS NOVOS DO SKU - MKTPLACE'],
    ['A cada sincronização, produto cadastrado no SKU - MKTPLACE que ainda não está na planilha de custos é adicionado lá'],
    ['(custo da coluna CUSTO do SKU - MKTPLACE, se tiver). Para deixar uma aba de fora, ponha em CONFIG > Abas ignoradas.'],
    [''],
    ['KITS'],
    ['O custo de cada kit é a soma de quantidade × custo de cada componente, e se atualiza sozinho quando um componente muda.'],
    ['Primeira vez: Custos > Sugerir componentes dos kits (lê a planilha de kits de CONFIG e separa os componentes pelo nome).'],
    ['Revise na aba REVISAR KITS: um kit por linha, com os produtos escolhidos e o custo calculado x o custo atual.'],
    ['Verde = diferença até 10%; amarelo = até 25%; vermelho = diferença grande (componente ou quantidade errada?).'],
    ['Kit errado: escreva na coluna CORRIGIR os componentes certos (ex.: LOREAL-0024 + 2x LOREAL-0038) e clique em Atualizar revisão.'],
    ['Marque Aprovar (ou Custos > Aprovar todos os kits verdes) e clique em Gravar aprovados. Só kit aprovado é gravado.'],
    ['Aprovados saem da lista e se atualizam sozinhos. Para mexer num aprovado: Custos > Reabrir um kit aprovado para revisão.'],
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
    [ABA.KITS, CAB.KITS.length + 2, 2, 'revisarKits', BOTAO_REVISAR, 'Atualizar revisão'],
    [ABA.REVISAR_KITS, CAB.REVISAR_KITS.length + 2, 2, 'revisarKits', BOTAO_REVISAR, 'Atualizar revisão'],
    [ABA.REVISAR_KITS, CAB.REVISAR_KITS.length + 2, 5, 'calcularKits', BOTAO_KITS, 'Gravar aprovados'],
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
                   'Adicionar produtos novos do SKU - MKTPLACE': ['SIM', 'NÃO'],
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
    custoOficial: txt('Custo oficial', 'ÚLTIMO PAGO').toUpperCase(),
    planilhaKits: idDePlanilha(txt('Planilha de kits (link ou ID)')),
    adicionarNovos: txt('Adicionar produtos novos do SKU - MKTPLACE', 'SIM').toUpperCase() !== 'NÃO',
    abaKits: txt('Aba da planilha de kits')
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

// A aba nasce com 1000 linhas: cria as que faltarem antes de escrever
function garantirLinhas(sh, ultima) {
  var faltam = ultima - sh.getMaxRows();
  if (faltam > 0) sh.insertRowsAfter(sh.getMaxRows(), faltam + 100);
}

function anexar(nomeAba, linhas) {
  if (!linhas.length) return;
  var sh = SpreadsheetApp.getActive().getSheetByName(nomeAba);
  var ini = ultimaLinhaColA(sh) + 1;
  garantirLinhas(sh, ini + linhas.length - 1);
  sh.getRange(ini, 1, linhas.length, linhas[0].length).setValues(linhas);
}

function gravarEntradas(linhas, extras) {
  if (!linhas.length) return;
  var sh = SpreadsheetApp.getActive().getSheetByName(ABA.ENTRADAS);
  var ini = ultimaLinhaColA(sh) + 1;
  garantirLinhas(sh, ini + linhas.length - 1);
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
    // produtos do SKU - MKTPLACE que ainda não estão na planilha de custos
    var nv = cfg.adicionarNovos ? previaNovosDoMktplace(cfg, !cfg.aplicarAuto) : 0;
    var apn = nv && cfg.aplicarAuto ? aplicarPrevia(true) : 0;
    // kits por último: usam o custo dos componentes que acabou de ser gravado
    var k = previaKits(cfg, !cfg.aplicarAuto);
    var apk = k.n && cfg.aplicarAuto ? aplicarPrevia(true) : 0;
    return (sv ? sv + ' produto(s) para confirmar em VINCULAR. ' : '') +
      (cfg.aplicarAuto ? ap + ' alteração(ões) gravada(s) em ' + cfg.abaCustos + '.' : pv + ' alteração(ões) na aba PRÉVIA.') +
      (nv ? ' Produtos novos do SKU - MKTPLACE: ' + (cfg.aplicarAuto ? apn + ' adicionado(s).' : nv + ' na PRÉVIA.') : '') +
      (k.n ? ' Kits: ' + (cfg.aplicarAuto ? apk + ' custo(s) de kit atualizado(s).' : k.n + ' na PRÉVIA.') : '');
  } catch (e) {
    registrarLog('SINCRONIZAR', '', 'ERRO', 0, 0, 0, String(e && e.message || e));
    return 'Erro ao sincronizar: ' + (e && e.message || e);
  }
}

// Produtos do SKU - MKTPLACE (fora das abas ignoradas) que não estão na planilha de custos nem pelo SKU
// (da variação ou principal) nem pelo EAN -> "ADICIONAR LINHA" na PRÉVIA, com o custo da coluna CUSTO.
function previaNovosDoMktplace(cfg, acrescentar) {
  var alvo = SpreadsheetApp.openById(cfg.planilhaCustos).getSheetByName(cfg.abaCustos);
  var tem = {}, temEan = {};
  if (alvo.getLastRow() > 1) {
    alvo.getRange(2, 1, alvo.getLastRow() - 1, 3).getValues().forEach(function (r) {
      [r[1], r[2]].forEach(function (x) { x = String(x).trim().toUpperCase(); if (x) tem[x] = 1; });
      var e = eanTexto(r[0]); if (e) temEan[e] = 1;
    });
  }
  var pv = SpreadsheetApp.getActive().getSheetByName(ABA.PREVIA);
  if (acrescentar && ultimaLinhaColA(pv) > 1) {
    pv.getRange(2, 2, ultimaLinhaColA(pv) - 1, 1).getValues().forEach(function (r) { tem[String(r[0]).trim().toUpperCase()] = 1; });
  } else if (!acrescentar && pv.getLastRow() > 1) {
    pv.getRange(2, 1, pv.getLastRow() - 1, CAB.PREVIA.length).clearContent();
  }
  var previa = [];
  carregarCatalogo(cfg).forEach(function (it) {
    var sku = it.sku.toUpperCase();
    if (tem[sku] || (!it.skuVar && tem[String(it.principal).toUpperCase()]) || (it.ean && temEan[it.ean])) return;
    tem[sku] = 1;
    if (it.ean) temEan[it.ean] = 1;
    previa.push(['ADICIONAR LINHA', it.sku, it.ean, it.desc, it.variacao, '', it.custo, '', '', '', '', it.aba]);
  });
  if (previa.length) anexar(ABA.PREVIA, previa);
  return previa.length;
}

function adicionarNovosAgora() {
  var cfg = lerConfig();
  var n = previaNovosDoMktplace(cfg, false);
  var ap = n && cfg.aplicarAuto ? aplicarPrevia(true) : 0;
  SpreadsheetApp.getUi().alert(n ? (cfg.aplicarAuto ? ap + ' produto(s) do SKU - MKTPLACE adicionado(s) em ' + cfg.abaCustos +
    '. A lista está no HISTÓRICO DE CUSTOS (LINHA ADICIONADA).' : n + ' produto(s) na aba PRÉVIA esperando o Aplicar.')
    : 'Nenhum produto novo: tudo do SKU - MKTPLACE já está em ' + cfg.abaCustos + '.');
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
  if (previa.length) { garantirLinhas(sh, previa.length + 1); sh.getRange(2, 1, previa.length, CAB.PREVIA.length).setValues(previa); }
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
  var nAt = v.filter(function (r) { return /^ATUALIZAR/.test(r[0]); }).length;
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
    if (/^ATUALIZAR/.test(r[0])) {
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
                 r[0] === 'ATUALIZAR KIT' ? 'KIT ATUALIZADO' : 'CUSTO ATUALIZADO', r[9], r[10],
                 cfg.abaCustos + ' linha ' + linha, anterior ? r[6] - anterior : '']);
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
    anexar(ABA.HISTORICO, linhasNovasOk ? hist : hist.filter(function (h) { return h[8] !== 'LINHA ADICIONADA'; }));
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
// Kits: componentes (aba KITS) e custo do kit = soma de qtd × custo de cada componente
// ===========================================================================

var TIPOS_PRODUTO = ['SHAMPOO', 'CONDICIONADOR', 'MASCARA', 'LEAVE', 'OLEO', 'OIL', 'SERUM', 'AMPOLA', 'AMPOLAS',
  'SPRAY', 'FINALIZADOR', 'FINALIZADORA', 'ATIVADOR', 'GELEIA', 'CREME', 'PROTETOR', 'BALSAMO', 'FLUIDO', 'ACIDIFICANTE',
  'TONICO', 'BASE', 'BATOM', 'PERFUME', 'SPLASH', 'HIDRATANTE', 'SABONETE', 'SABONETES', 'ESMALTE', 'ESMALTES', 'GLOSS',
  'PALETA', 'ESCOVA', 'PENTE', 'PROTEINA', 'ESFOLIANTE', 'REPARADOR', 'POMADA', 'MOUSSE', 'GEL', 'LOCAO', 'DESODORANTE',
  'COLONIA', 'ELIXIR', 'TRATAMENTO', 'MASCARAS', 'LOCION', 'PRIMER', 'CORRETIVO', 'ILUMINADOR', 'BLUSH', 'PO',
  'DEMAQUILANTE', 'MICELAR', 'TONER', 'CERA', 'TINTURA', 'COLORACAO', 'OXIDANTE', 'DESCOLORANTE', 'PROGRESSIVA',
  'ALISANTE', 'RELAXANTE', 'SELANTE', 'BOTOX', 'BTX', 'KERATINA', 'QUERATINA', 'LENCO', 'TOALHA', 'CONDICIONANTE',
  'MASK', 'CONDITIONER', 'LOTION', 'CREAM', 'PINCEL', 'ESPONJA', 'LIXA', 'ALICATE', 'TESOURA', 'SECADOR', 'PRANCHA',
  'MODELADOR', 'TOUCA', 'FIBRA', 'LAPIS', 'DELINEADOR', 'SOMBRA', 'RIMEL', 'CILIOS', 'COLA', 'VITAMINA', 'SUPLEMENTO',
  'GELATINA', 'AGUA', 'OXIGENADA', 'EMULSAO'];
function ehTipo(t) { return TIPOS_PRODUTO.indexOf(t) >= 0; }
function ehMedida(t) { return !!medida(t); }

// "Kit Truss 2 Shampoo e 1 Condicionador 300ml" -> [{texto: 'Truss Shampoo 300ml', qtd: 2}, {texto: 'Condicionador 300ml', qtd: 1}]
function partesDoKit(nome) {
  var s = String(nome).replace(/^\s*kit\s+/i, '').replace(/\((\d+)\s*produtos?\)/ig, '').replace(/\.\.\.$/, '').trim();
  var partes = [];
  s.split(/\s\+\s|\s\+|\+\s/).forEach(function (p) {
    var lados = p.split(/\s+e\s+/i);
    if (lados.length > 1 && lados.every(function (l) { return tokensCat(l, true).some(ehTipo); })) {
      var med = tokensCat(p, true).filter(ehMedida); // "Shampoo e Condicionador 300ml": a medida vale para os dois
      lados.forEach(function (l) { partes.push(tokensCat(l, true).some(ehMedida) ? l : l + ' ' + med.join(' ')); });
    } else partes.push(p);
  });
  return partes.map(function (p) {
    var qtd = 1, t = ' ' + p + ' ', m;
    if ((m = t.match(/\s(\d{1,2})\s*x\s*(?=\d+(?:[.,]\d+)?\s*(?:ml|g|gr|l|kg)\b)/i))) { qtd = +m[1]; t = t.replace(m[0], ' '); }
    else if ((m = t.match(/\s(\d{1,3})\s*(un|unid|unidades)\b/i))) { qtd = +m[1]; t = t.replace(m[0], ' '); }
    else if ((m = t.match(/\s(\d{1,2})\s+(?!(?:em|in|de|ml|g|gr|l|kg|mg|x|vol|fps|spf|anos|meses)\b)(?=[A-Za-zÀ-ú])/i)) &&
             +m[1] >= 2 && +m[1] <= 24) { qtd = +m[1]; t = t.replace(m[0], ' '); }
    else if (/\strio\s/i.test(t)) qtd = 3;
    else if (/\sduo\s/i.test(t)) qtd = 2;
    t = t.replace(/^\s*1\s+(?=[A-Za-zÀ-ú])/, ' ');
    return { texto: t.trim(), qtd: qtd };
  }).filter(function (p) { return p.texto; });
}

// Cada componente: palavras obrigatórias (o próprio componente, com tipo e medida herdados do anterior)
// e contexto (marca e linha: as outras palavras do nome do kit)
function consultasDoKit(nome, marca) {
  var partes = partesDoKit(nome);
  if (!partes.length) return [];
  var tok0 = tokensCat(partes[0].texto, true);
  var iTipo = -1;
  for (var k = 0; k < tok0.length; k++) if (ehTipo(tok0[k])) { iTipo = k; break; }
  var medCtx = (iTipo > 0 ? tok0.slice(0, iTipo) : []).filter(ehMedida);
  var vistos = {}, ctx = [];
  tokensCat(nome, true).concat(tokensCat(marca, true)).forEach(function (t) {
    if (vistos[t] || ehTipo(t) || ehMedida(t) || /^\d+$/.test(t) || t === 'KIT') return;
    vistos[t] = 1; ctx.push(t);
  });
  var tipoAnt = null;
  return partes.map(function (p, i) {
    var tok = tokensCat(p.texto, true);
    if (i === 0 && iTipo > 0) tok = tok.slice(iTipo);
    if (!tok.some(ehTipo) && tipoAnt) tok = [tipoAnt].concat(tok);
    if (!tok.some(ehMedida) && medCtx.length) tok = tok.concat(medCtx);
    var tipos = tok.filter(ehTipo);
    if (tipos.length) tipoAnt = tipos[0];
    return { texto: p.texto, qtd: p.qtd, req: tok,
             ctx: ctx.filter(function (c) { return !tok.some(function (t) { return tokenBate(t, c); }); }) };
  });
}

function pontuarComponente(q, item) {
  var cat = item.tok, usados = {};
  var bate = function (lista) {
    var n = 0;
    lista.forEach(function (t) {
      for (var j = 0; j < cat.length; j++) if (!usados[j] && tokenBate(t, cat[j])) { usados[j] = 1; n++; return; }
    });
    return n;
  };
  var nReq = bate(q.req);
  usados = {};
  var nCtx = bate(q.ctx);
  var cob = nReq / Math.max(1, q.req.length), cobCtx = q.ctx.length ? nCtx / q.ctx.length : 1;
  var s = 0.6 * cob + 0.35 * cobCtx + 0.05 * Math.min(1, 2 * (nReq + nCtx) / cat.length);
  var medReq = q.req.filter(ehMedida), medCat = cat.filter(ehMedida);
  if (medReq.length && !medReq.every(function (m) { return medCat.some(function (c) { return tokenBate(m, c); }); }))
    s *= medCat.length ? 0.5 : 0.9;
  var tipoReq = q.req.filter(ehTipo);
  if (tipoReq.length && !tipoReq.some(function (t) { return cat.some(function (c) { return tokenBate(t, c); }); })) s *= 0.6;
  var todos = q.req.concat(q.ctx);
  if (item.tokVar.length && !item.tokVar.every(function (v) { return todos.some(function (t) { return tokenBate(t, v); }); })) s *= 0.4;
  if (/\bkit\b/i.test(item.desc)) s *= 0.7;
  return { s: Math.round(s * 1000) / 1000, cob: cob, ctx: cobCtx };
}

// Lê a planilha com a lista de kits (colunas pelo cabeçalho: SKU novo, SKU atual, nome, marca, EAN)
function lerListaDeKits(cfg) {
  if (!cfg.planilhaKits) throw new Error('Preencha em CONFIG o link da planilha de kits.');
  var ss = SpreadsheetApp.openById(cfg.planilhaKits);
  var sh = cfg.abaKits ? ss.getSheetByName(cfg.abaKits) : ss.getSheets()[0];
  if (!sh) throw new Error('Aba "' + cfg.abaKits + '" não encontrada na planilha de kits.');
  var v = sh.getDataRange().getValues();
  var cab = v[0].map(function (h) { return normalizarCat(h); });
  var col = function (re, padrao) { for (var i = 0; i < cab.length; i++) if (re.test(cab[i])) return i; return padrao; };
  var cNovo = col(/SKU NOVO|KT/, 0), cAtual = col(/SKU ATUAL/, 1), cNome = col(/^NAME|NOME/, 3),
      cMarca = col(/BRAND|MARCA/, 4), cEan = col(/^EAN|GTIN/, 5);
  var kits = [];
  for (var i = 1; i < v.length; i++) {
    var nome = String(v[i][cNome] || '').trim();
    var sku = String(v[i][cNovo] || '').trim() || String(v[i][cAtual] || '').trim();
    if (!nome || !sku) continue;
    kits.push({ sku: sku, atual: String(v[i][cAtual] || '').trim(), nome: nome, marca: String(v[i][cMarca] || '').trim(),
                ean: eanTexto(v[i][cEan]) });
  }
  return kits;
}

// Monta a aba KITS: uma linha por componente, com sugestão. Certeza -> já vem em CONFIRMAR.
function sugerirKits(silencioso) {
  silencioso = silencioso === true;
  var inicio = Date.now();
  var ss = SpreadsheetApp.getActive();
  var cfg = lerConfig();
  var sh = ss.getSheetByName(ABA.KITS);
  var jaTem = {};
  if (ultimaLinhaColA(sh) > 1) sh.getRange(2, 1, ultimaLinhaColA(sh) - 1, 1).getValues().forEach(function (r) { jaTem[String(r[0]).trim().toUpperCase()] = 1; });
  var kits = lerListaDeKits(cfg);
  var ehKit = {};
  kits.forEach(function (k) { ehKit[k.sku.toUpperCase()] = 1; if (k.atual) ehKit[k.atual.toUpperCase()] = 1; });
  var avulsos = carregarCatalogo(cfg).filter(function (it) {
    return !it.kit && !ehKit[it.sku.toUpperCase()] && !ehKit[String(it.principal).toUpperCase()];
  });
  var porMarca = {};
  var daMarca = function (marca) {
    var m = tokensCat(marca, false);
    var chave = m[0] || '';
    if (porMarca[chave]) return porMarca[chave];
    var lista = avulsos.filter(function (it) {
      var a = tokensCat(it.aba, false);
      return a.length && m.length && (a[0] === m[0] || m.indexOf(a[0]) >= 0);
    });
    return (porMarca[chave] = lista.length ? lista : avulsos);
  };
  var nomeCat = function (it) { return it.desc + (it.variacao ? ' [' + it.variacao + ']' : ''); };
  var linhas = [], feitos = 0, faltam = 0;
  kits.forEach(function (k) {
    if (jaTem[k.sku.toUpperCase()]) return;
    if (Date.now() - inicio > 240000) { faltam++; return; } // limite de tempo do Google: continua na próxima
    var base = daMarca(k.marca || k.nome.split(' ')[1] || '');
    consultasDoKit(k.nome, k.marca).forEach(function (q) {
      var top = base.map(function (it) { var p = pontuarComponente(q, it); return { it: it, s: p.s, cob: p.cob, ctx: p.ctx }; })
        .sort(function (a, b) { return b.s - a.s; }).slice(0, 2);
      var a = top[0], b = top[1];
      var certo = a && a.cob === 1 && a.ctx >= 0.5 && (!b || a.s - b.s >= 0.05);
      linhas.push([k.sku, k.atual, k.ean, k.nome, q.texto, q.qtd, a ? a.it.sku : '', a ? nomeCat(a.it) : '', a ? a.s : '',
        b ? b.it.sku + ' - ' + nomeCat(b.it) : '', certo ? a.it.sku : '', '', '']);
    });
    feitos++;
  });
  anexar(ABA.KITS, linhas);
  var r = atualizarRevisaoKits(cfg);
  var msg = feitos + ' kit(s) com componentes sugeridos na aba KITS' +
    (faltam ? '; faltam ' + faltam + ' (rode de novo para continuar)' : '') + '.';
  if (!silencioso) SpreadsheetApp.getUi().alert(msg + '\n\nNa aba REVISAR KITS: ' + r.verdes + ' verdes, ' + r.amarelos +
    ' amarelos, ' + r.vermelhos + ' vermelhos e ' + r.incompletos + ' incompletos. Aprove os conferidos e clique em Gravar aprovados.');
  return msg;
}

// Faz a conta de cada kit da aba KITS (sem gravar nada).
// Devolve [{sku, atual, nome, comps: [{qtd, sku, desc, custo}], total, iKit, atual$, situacao, pronto}]
function contasDosKits(cfg) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(ABA.KITS);
  var n = sh ? ultimaLinhaColA(sh) : 0;
  if (n < 2) return { contas: [], linhasAlvo: [] };
  var v = sh.getRange(2, 1, n - 1, CAB.KITS.length).getValues();
  var alvo = SpreadsheetApp.openById(cfg.planilhaCustos).getSheetByName(cfg.abaCustos);
  var linhasAlvo = alvo.getLastRow() > 1 ? alvo.getRange(2, 1, alvo.getLastRow() - 1, 9).getValues() : [];
  var porSku = {}, porEan = {};
  linhasAlvo.forEach(function (r, i) {
    [r[1], r[2]].forEach(function (s) { s = String(s).trim().toUpperCase(); if (s && porSku[s] === undefined) porSku[s] = i; });
    var e = eanTexto(r[0]); if (e && porEan[e] === undefined) porEan[e] = i;
  });
  var eanDoSku = {}, descDoSku = {};
  try {
    carregarCatalogo(cfg).forEach(function (it) {
      var k = it.sku.toUpperCase();
      if (it.ean) eanDoSku[k] = it.ean;
      descDoSku[k] = it.desc + (it.variacao ? ' [' + it.variacao + ']' : '');
    });
  } catch (e) {}
  var acharLinha = function (sku, ean) {
    var i = porSku[String(sku).trim().toUpperCase()];
    if (i === undefined && ean) i = porEan[eanTexto(ean)];
    if (i === undefined) i = porEan[eanDoSku[String(sku).trim().toUpperCase()] || '-'];
    return i;
  };
  var grupos = {}, ordem = [];
  v.forEach(function (r, i) {
    var k = String(r[0]).trim();
    if (!k) return;
    if (!grupos[k]) { grupos[k] = []; ordem.push(k); }
    grupos[k].push({ r: r, linha: i + 2 });
  });
  var contas = ordem.map(function (k) {
    var g = grupos[k], r0 = g[0].r, c = { sku: k, atual: String(r0[1]), nome: String(r0[3]), linhas: g, comps: [],
      total: 0, iKit: undefined, custoAtual: '', situacao: '', pronto: false,
      aprovado: g.some(function (x) { return String(x.r[12]).trim() !== ''; }) };
    var falta = g.filter(function (x) { return String(x.r[10]).trim() === ''; });
    var semCadastro = g.filter(function (x) { return /^N[AÃ]O\s*TEM$/i.test(String(x.r[10]).trim()); });
    var semCusto = [];
    g.forEach(function (x) {
      var sku = String(x.r[10]).trim(), qtd = Number(x.r[5]) || 1;
      var usado = sku && !/^N[AÃ]O\s*TEM$/i.test(sku);
      var i = usado ? acharLinha(sku, '') : undefined;
      var custo = i === undefined ? 0 : Number(linhasAlvo[i][8]) || 0;
      var desc = !usado ? '(' + (sku ? 'não tem' : 'falta confirmar') + ': ' + x.r[4] + ')' :
        descDoSku[sku.toUpperCase()] || (i !== undefined ? String(linhasAlvo[i][6]) + (linhasAlvo[i][7] ? ' [' + linhasAlvo[i][7] + ']' : '') : sku);
      c.comps.push({ qtd: qtd, sku: sku, desc: desc, custo: custo });
      if (usado && !(custo > 0)) semCusto.push(sku);
      if (usado) c.total += qtd * custo;
    });
    c.total = Math.round(c.total * 100) / 100;
    c.iKit = acharLinha(k, r0[2]);
    if (c.iKit === undefined && r0[1]) c.iKit = acharLinha(r0[1], '');
    if (c.iKit !== undefined) c.custoAtual = Number(linhasAlvo[c.iKit][8]) || 0;
    var real = function (x) { return 'R$ ' + x.toFixed(2).replace('.', ','); };
    if (falta.length) c.situacao = 'FALTA CONFIRMAR ' + falta.length + ' componente(s)';
    else if (semCadastro.length) c.situacao = 'componente sem cadastro: ' + semCadastro.map(function (x) { return x.r[4]; }).join(', ');
    else if (semCusto.length) c.situacao = 'sem custo na planilha de custos: ' + semCusto.join(', ');
    else if (c.iKit === undefined) c.situacao = 'kit não está na planilha de custos (' + real(c.total) + ')';
    else {
      c.pronto = true;
      c.situacao = 'OK: ' + real(c.total) + ' = ' + c.comps.map(function (x) {
        return (x.qtd > 1 ? x.qtd + '×' : '') + x.custo.toFixed(2).replace('.', ',');
      }).join(' + ');
    }
    return c;
  });
  return { contas: contas, linhasAlvo: linhasAlvo, nLinhas: v.length };
}

// Kits com a caixa Aprovar marcada na aba REVISAR KITS (a aprovação é gravada em KITS no Gravar aprovados)
function kitsAprovados() {
  var sh = SpreadsheetApp.getActive().getSheetByName(ABA.REVISAR_KITS);
  var ap = {};
  if (!sh || ultimaLinhaColA(sh) < 2) return ap;
  sh.getRange(2, 1, ultimaLinhaColA(sh) - 1, 2).getValues().forEach(function (r) {
    if (r[1] === true || String(r[1]).toUpperCase() === 'TRUE') ap[String(r[0]).trim()] = 1;
  });
  return ap;
}

// Coluna CORRIGIR da REVISAR KITS ("HON-0001 + 2x HON-0002"): troca os componentes do kit na aba KITS.
// Devolve as correções que não deram certo ({sku do kit: {texto, erro}}) para continuarem na revisão.
function aplicarCorrecoesKits(cfg) {
  var ss = SpreadsheetApp.getActive();
  var rev = ss.getSheetByName(ABA.REVISAR_KITS), kits = ss.getSheetByName(ABA.KITS);
  var falhas = {};
  if (!rev || ultimaLinhaColA(rev) < 2) return falhas;
  var pedidos = rev.getRange(2, 1, ultimaLinhaColA(rev) - 1, CAB.REVISAR_KITS.length).getValues()
    .filter(function (r) { return String(r[9]).trim() !== ''; });
  if (!pedidos.length) return falhas;
  var porSku = {};
  carregarCatalogo(cfg).forEach(function (it) {
    porSku[it.sku.toUpperCase()] = it;
    if (it.principal && !porSku[it.principal.toUpperCase()]) porSku[it.principal.toUpperCase()] = it;
  });
  var nK = ultimaLinhaColA(kits);
  var v = nK > 1 ? kits.getRange(2, 1, nK - 1, CAB.KITS.length).getValues() : [];
  var apagar = [], novas = [];
  pedidos.forEach(function (p) {
    var kit = String(p[0]).trim(), texto = String(p[9]).trim(), comps = [], erro = '';
    texto.split('+').forEach(function (parte) {
      parte = parte.trim();
      if (!parte) return;
      var m = parte.match(/^(\d+)\s*[x×*]\s*(.+)$/i), qtd = m ? Number(m[1]) : 1, sku = (m ? m[2] : parte).trim();
      var it = porSku[sku.toUpperCase()];
      if (!it) erro += (erro ? ', ' : '') + sku;
      else comps.push({ qtd: qtd, it: it });
    });
    if (erro || !comps.length) { falhas[kit] = { texto: texto, erro: 'CORRIGIR: não achei no SKU - MKTPLACE: ' + (erro || '(vazio)') }; return; }
    var base = null;
    v.forEach(function (r, i) { if (String(r[0]).trim() === kit) { apagar.push(i + 2); base = base || r; } });
    if (!base) { falhas[kit] = { texto: texto, erro: 'CORRIGIR: kit não está na aba KITS' }; return; }
    comps.forEach(function (c) {
      var desc = c.it.desc + (c.it.variacao ? ' [' + c.it.variacao + ']' : '');
      novas.push([kit, base[1], base[2], base[3], 'corrigido: ' + c.it.sku, c.qtd, c.it.sku, desc, 1, '', c.it.sku, '', base[12]]);
    });
  });
  apagar.sort(function (a, b) { return b - a; }).forEach(function (l) { kits.deleteRow(l); });
  anexar(ABA.KITS, novas);
  return falhas;
}

// Aba REVISAR KITS: um kit por linha, com os produtos escolhidos, o custo calculado, o custo atual e a
// diferença. Mais seguro em cima. Mantém as aprovações já marcadas. Também pinta a aba KITS.
function atualizarRevisaoKits(cfg, dados, falhas) {
  var ss = SpreadsheetApp.getActive();
  dados = dados || contasDosKits(cfg);
  falhas = falhas || {};
  var aprov = kitsAprovados();
  var real = function (x) { return 'R$ ' + x.toFixed(2).replace('.', ','); };
  var jaAprovados = 0;
  var linhas = dados.contas.filter(function (c) {
    if (c.aprovado && !falhas[c.sku]) { jaAprovados++; return false; } // aprovado sai da lista
    return true;
  }).map(function (c) {
    var dif = c.pronto && c.custoAtual ? c.total / c.custoAtual - 1 : '';
    var alerta = !c.pronto ? c.situacao :
      c.custoAtual === 0 ? 'sem custo atual na planilha para comparar' :
      Math.abs(dif) > 0.25 ? 'DIFERENÇA GRANDE: confira componentes e quantidades' :
      Math.abs(dif) > 0.10 ? 'diferença média: vale conferir' : 'ok';
    var nivel = !c.pronto ? 3 : alerta === 'ok' ? 0 : /^diferença média|sem custo atual/.test(alerta) ? 1 : 2;
    if (falhas[c.sku]) { alerta = falhas[c.sku].erro; nivel = 2; }
    return { nivel: nivel, dif: dif === '' ? 9 : Math.abs(dif), linha: [
      c.sku, !!aprov[c.sku], c.nome,
      c.comps.map(function (x) { return (x.qtd > 1 ? x.qtd + '× ' : '') + x.desc + (x.custo ? ' (' + real(x.custo) + ')' : ''); }).join('  +  '),
      c.pronto ? c.total : '', c.custoAtual === '' ? '' : c.custoAtual, dif, alerta,
      c.iKit === undefined ? '' : c.iKit + 2, falhas[c.sku] ? falhas[c.sku].texto : ''] };
  });
  linhas.sort(function (a, b) { return (a.nivel - b.nivel) || (a.dif - b.dif); });

  var sh = ss.getSheetByName(ABA.REVISAR_KITS);
  if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, CAB.REVISAR_KITS.length).clearContent().setBackground(null);
  if (linhas.length) {
    garantirLinhas(sh, linhas.length + 1);
    var faixa = sh.getRange(2, 1, linhas.length, CAB.REVISAR_KITS.length);
    faixa.setValues(linhas.map(function (l) { return l.linha; }));
    var cores = ['#dcfce7', '#fef9c3', '#fee2e2', '#f3f4f6'];
    faixa.setBackgrounds(linhas.map(function (l) {
      return CAB.REVISAR_KITS.map(function () { return cores[l.nivel]; });
    }));
    sh.getRange(2, 2, linhas.length, 1).insertCheckboxes();
  }

  // aba KITS: faixas alternadas por kit; componente sem confirmação em amarelo
  var kits = ss.getSheetByName(ABA.KITS);
  var fundo = [], sit = [], alterna = false;
  for (var i = 0; i < dados.nLinhas; i++) { fundo.push(CAB.KITS.map(function () { return '#ffffff'; })); sit.push(['']); }
  dados.contas.forEach(function (c) {
    alterna = !alterna;
    c.linhas.forEach(function (x) {
      var cor = c.aprovado ? '#dcfce7' : String(x.r[10]).trim() === '' ? '#fef9c3' : (alterna ? '#ffffff' : '#eef2ff');
      fundo[x.linha - 2] = CAB.KITS.map(function () { return cor; });
      sit[x.linha - 2] = [c.situacao];
    });
  });
  if (fundo.length) {
    kits.getRange(2, 1, fundo.length, CAB.KITS.length).setBackgrounds(fundo);
    kits.getRange(2, 12, sit.length, 1).setValues(sit);
  }

  var cont = [0, 0, 0, 0];
  linhas.forEach(function (l) { cont[l.nivel]++; });
  return { verdes: cont[0], amarelos: cont[1], vermelhos: cont[2], incompletos: cont[3], total: linhas.length,
           aprovados: jaAprovados, falhas: Object.keys(falhas).length };
}

// Custo dos kits APROVADOS na PRÉVIA ("ATUALIZAR KIT"). Kit não aprovado não vai para a planilha.
function previaKits(cfg, acrescentar) {
  var dados = contasDosKits(cfg);
  var previa = [];
  dados.contas.forEach(function (c) {
    if (!c.pronto || !c.aprovado) return;
    if (Math.abs((Number(c.custoAtual) || 0) - c.total) < 0.005) return;
    var r = dados.linhasAlvo[c.iKit];
    previa.push(['ATUALIZAR KIT', String(r[1] || c.sku), eanTexto(r[0]), r[6], r[7], c.custoAtual || '', c.total,
      c.custoAtual ? c.total / c.custoAtual - 1 : '', c.iKit + 2, '', '', 'KIT']);
  });
  var pv = SpreadsheetApp.getActive().getSheetByName(ABA.PREVIA);
  if (!acrescentar && pv.getLastRow() > 1) pv.getRange(2, 1, pv.getLastRow() - 1, CAB.PREVIA.length).clearContent();
  if (previa.length) anexar(ABA.PREVIA, previa);
  return { n: previa.length, dados: dados };
}

// Botão "Atualizar revisão" (aba KITS e REVISAR KITS): refaz a conta e a aba de revisão, sem gravar nada
function revisarKits() {
  var cfg = lerConfig();
  var falhas = aplicarCorrecoesKits(cfg);
  var r = atualizarRevisaoKits(cfg, null, falhas);
  SpreadsheetApp.getActive().setActiveSheet(SpreadsheetApp.getActive().getSheetByName(ABA.REVISAR_KITS));
  SpreadsheetApp.getUi().alert('Revisão dos kits (' + r.total + '):\n\n' +
    '🟢 ' + r.verdes + ' com diferença até 10% do custo atual\n' +
    '🟡 ' + r.amarelos + ' com diferença entre 10% e 25% (ou sem custo atual para comparar)\n' +
    '🔴 ' + r.vermelhos + ' com diferença acima de 25%: confira componentes e quantidades\n' +
    '⚪ ' + r.incompletos + ' incompletos (falta confirmar componente, sem custo ou fora da planilha)\n' +
    '✓ ' + r.aprovados + ' já aprovados (fora da lista, atualizados sozinhos)\n' +
    (r.falhas ? '\n' + r.falhas + ' correção(ões) com SKU não encontrado: veja a coluna Alerta.\n' : '') +
    '\nMarque Aprovar nos kits conferidos e clique em Gravar aprovados. Para corrigir um kit, escreva os\n' +
    'componentes certos na coluna CORRIGIR (ex.: HON-0001 + 2x HON-0002) e clique em Atualizar revisão.');
}

// Volta um kit aprovado para a lista de revisão (apaga a data de aprovação)
function reabrirKit() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.prompt('Reabrir kit', 'SKU do kit (ex.: KT-HON-0003):', ui.ButtonSet.OK_CANCEL);
  if (resp.getSelectedButton() !== ui.Button.OK) return;
  var sku = String(resp.getResponseText()).trim().toUpperCase();
  var kits = SpreadsheetApp.getActive().getSheetByName(ABA.KITS);
  var n = ultimaLinhaColA(kits), achou = 0;
  if (n > 1) kits.getRange(2, 1, n - 1, 1).getValues().forEach(function (r, i) {
    if (String(r[0]).trim().toUpperCase() === sku) { kits.getRange(i + 2, 13).setValue(''); achou++; }
  });
  if (!achou) { ui.alert('Kit ' + sku + ' não está na aba KITS.'); return; }
  atualizarRevisaoKits(lerConfig());
  ui.alert('Kit ' + sku + ' voltou para a aba REVISAR KITS. Enquanto não for aprovado de novo, o custo dele não é atualizado.');
}

// Marca Aprovar em todos os verdes (diferença até 10%)
function aprovarKitsVerdes() {
  var sh = SpreadsheetApp.getActive().getSheetByName(ABA.REVISAR_KITS);
  var n = ultimaLinhaColA(sh);
  if (n < 2) return;
  var v = sh.getRange(2, 1, n - 1, CAB.REVISAR_KITS.length).getValues();
  var marcados = 0;
  var col = v.map(function (r) {
    var ok = r[7] === 'ok' || r[1] === true;
    if (r[7] === 'ok' && r[1] !== true) marcados++;
    return [ok];
  });
  sh.getRange(2, 2, col.length, 1).setValues(col);
  SpreadsheetApp.getUi().alert(marcados + ' kit(s) verde(s) aprovado(s). Confira e clique em Gravar aprovados.');
}

// Botão "Gravar aprovados": grava na planilha de custos o custo dos kits com Aprovar marcado
function calcularKits() {
  var cfg = lerConfig();
  var falhas = aplicarCorrecoesKits(cfg);
  // grava a aprovação na aba KITS (coluna Aprovado em) para os kits marcados e prontos
  var marcados = kitsAprovados(), dados = contasDosKits(cfg), kits = SpreadsheetApp.getActive().getSheetByName(ABA.KITS);
  var agora = new Date(), novos = 0, naoProntos = [];
  dados.contas.forEach(function (c) {
    if (!marcados[c.sku] || c.aprovado || falhas[c.sku]) return;
    if (!c.pronto) { naoProntos.push(c.sku); return; }
    c.linhas.forEach(function (x) { kits.getRange(x.linha, 13).setValue(agora); });
    novos++;
  });
  var r = previaKits(cfg, false);
  var ap = r.n && cfg.aplicarAuto ? aplicarPrevia(true) : 0;
  var rev = atualizarRevisaoKits(cfg, null, falhas);
  SpreadsheetApp.getUi().alert(novos + ' kit(s) aprovado(s) agora (' + rev.aprovados + ' no total, fora da lista de revisão). ' +
    (naoProntos.length ? '\nNão aprovados porque estão incompletos: ' + naoProntos.join(', ') + '. ' : '') +
    (cfg.aplicarAuto ? ap + ' custo(s) de kit gravado(s) em ' + cfg.abaCustos + ' (os outros já estavam com o valor certo).'
                     : r.n + ' alteração(ões) na aba PRÉVIA.') +
    '\n\nDaqui em diante esses kits se atualizam sozinhos quando um componente mudar de custo.');
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
    var v = sh.getRange(1, 1, sh.getLastRow(), Math.min(6, sh.getLastColumn())).getValues(); // até F (CUSTO)
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
      if (!/[A-Za-z0-9]/.test(sku)) continue; // "-" e afins não são produto
      // linha de variação costuma deixar a descrição em branco: vale a da linha de cima
      var desc = String(r[2] || descAnterior || ''), variacao = r[3] === '' || r[3] == null ? '' : String(r[3]);
      itens.push({
        aba: aba, principal: principal, skuVar: skuVar, sku: sku, ean: eanTexto(r[1]),
        desc: desc, variacao: variacao, custo: typeof r[5] === 'number' && r[5] > 0 ? r[5] : '',
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
var BOTAO_KITS = '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';
var BOTAO_REVISAR = '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';
var BOTAO_APLICAR = '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';

if (typeof module !== 'undefined') {
  module.exports = {
    textoPdfDireto: textoPdfDireto, lerRomaneioVarejoFacil: lerRomaneioVarejoFacil, lerXmlNfe: lerXmlNfe,
    tokensCat: tokensCat, pontuarCatalogo: pontuarCatalogo, melhoresDoCatalogo: melhoresDoCatalogo
  };
}
