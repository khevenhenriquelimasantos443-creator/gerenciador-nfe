/**
 * Planilha Finn — sincronização com o app (finn.dev.br)
 *
 * COMO INSTALAR (uma vez só, na sua planilha-mestre):
 *   1. Abra a planilha no Google Sheets
 *   2. Extensões → Apps Script
 *   3. Apague o conteúdo do arquivo Code.gs e cole TUDO deste arquivo
 *   4. Salve (ícone de disquete) e feche a aba do Apps Script
 *   5. Recarregue a planilha — vai aparecer o menu "Finn" na barra de cima
 *
 * NO CELULAR: o app do Google Sheets NÃO mostra menu personalizado — o menu
 * "Finn" só aparece no navegador. Por isso existe a sincronização automática:
 * rode "Ligar sincronização automática" uma vez (do navegador, em modo
 * computador) e a planilha passa a se atualizar sozinha de hora em hora,
 * inclusive fechada. No celular você só abre e olha.
 *
 * Quem comprar uma CÓPIA da planilha recebe este script junto: o Apps Script
 * é vinculado ao arquivo e viaja no "Fazer uma cópia". A pessoa só precisa
 * colar o token dela na aba Config e ligar o automático uma vez.
 *
 * A planilha funciona sem nada disso. Sem token na Config, o menu avisa e
 * não faz nada — nunca trava o uso normal.
 */

var FINN_URL   = 'https://finn.dev.br';
var ABA_LANC   = 'Lançamentos';
var ABA_CONFIG = 'Config';
var ABA_LIMITES = 'Limites';
var ABA_FIXAS   = 'Contas fixas';
var ABA_DIVIDAS = 'Dívidas';
var ABA_RACHA   = 'Racha';
var LINHA_INI  = 6;   // primeira linha de dados em Lançamentos
var CEL_TOKEN  = 'C35';
var CEL_ULTIMA = 'C36';
// Quantas linhas o modelo pré-formata em cada aba de configuração (ver
// gera_planilha.py). Escrever além disso não tem onde cair — as fórmulas
// de Restante/Situação/Falta só existem até essa linha.
var CAP_LIMITES = 20, CAP_FIXAS = 30, CAP_DIVIDAS = 20, CAP_RACHA = 30;
// Ponte entre finnPuxar e finnSincronizar só pro aviso de truncamento — ver
// comentário em finnPuxar.
var _ultimaNotaConfig = '';

// Mesma regra do app (finn/index.html) e do bot do WhatsApp (finn-worker):
// varredura automática de saldo e compra/resgate de investimento (BB Rende
// Fácil, BB Ações/MM/RF, Tesouro, previdência) não é receita nem despesa —
// é dinheiro circulando dentro do próprio banco. O app e o bot já excluem
// isso dos totais de Entradas/Saídas; a planilha nunca tinha essa regra, e
// é exatamente por isso que os totais da planilha vinham maiores que os do
// app — cada aplicação/resgate automático entrava como Receita/Despesa de
// verdade nas somas. Precisa ficar EXATAMENTE igual às outras duas cópias,
// senão a planilha volta a divergir do app assim que a regra mudar lá.
var INVEST_RE = /rende f[aá]cil|\bbb\s+a[cç][õo]es\b|\bbb\s+mm\b|\bbb\s+rf\b|tesouro direto|previd[eê]ncia privada|aplica[cç][aã]o autom|resgate autom|poupan[cç]a autom|rendimento autom/i;
function _ehInvestimento(descricao) {
  return INVEST_RE.test(descricao || '');
}
// Fixo em vez de SpreadsheetApp.getActive().getSpreadsheetTimeZone(): o
// gerador da planilha nunca define o fuso do arquivo, então cada cópia nova
// fica com o que o Google decidir por padrão (na prática, America/Los_Angeles
// — o clássico fuso padrão do Apps Script). Resultado visto de verdade:
// "Última sincronização" mostrando 09:27 com o relógio real em 13:31, quatro
// horas de diferença. Fixar aqui evita depender de configuração que ninguém
// vai lembrar de ajustar — a Planilha Finn é pro fuso do Brasil, sempre.
var FUSO_BR = 'America/Sao_Paulo';

// Aparece em toda mensagem de sincronização e em "Testar conexão".
//
// Existe porque diagnosticar isto às cegas custou caro: houve um caso em que
// o horário aparecia CORRIGIDO (prova de que o script novo estava rodando) e
// a coluna Mês continuava quebrada (prova de que não estava) — as duas
// correções vieram no mesmo commit, então uma das duas conclusões tinha que
// estar errada, e não havia como saber qual sem um número na tela. Com a
// versão à vista, "colei o script novo?" deixa de ser suposição.
var VERSAO = '2026-08-16.3';

// Colunas da aba Lançamentos (1 = A)
var COL_DATA = 1, COL_TIPO = 2, COL_CAT = 3, COL_DESC = 4, COL_VALOR = 5,
    COL_MES = 6, COL_ID = 7, COL_ORIGEM = 8;

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Finn')
    .addItem('Sincronizar agora', 'finnSincronizar')
    .addSeparator()
    .addItem('Só enviar para o Finn', 'finnEnviar')
    .addItem('Só puxar do Finn', 'finnPuxar')
    .addSeparator()
    .addItem('Ligar sincronização automática', 'finnAtivarAutomatico')
    .addItem('Desligar sincronização automática', 'finnDesativarAutomatico')
    .addSeparator()
    .addItem('Corrigir dados da planilha', 'finnCorrigirDados')
    .addItem('Testar conexão', 'finnTestar')
    .addToUi();
}

/**
 * Só existe interface quando um humano abriu a planilha no navegador. Num
 * gatilho por horário não existe UI nenhuma, e chamar getUi() ali lança
 * exceção — que é como a sincronização automática morreria em silêncio.
 */
function _temUI() {
  try { SpreadsheetApp.getUi(); return true; } catch (e) { return false; }
}

function _token() {
  var cfg = SpreadsheetApp.getActive().getSheetByName(ABA_CONFIG);
  if (!cfg) return '';
  return String(cfg.getRange(CEL_TOKEN).getValue() || '').trim();
}

function _aviso(msg) {
  try { SpreadsheetApp.getActive().toast(msg, 'Finn', 8); } catch (e) {}
  console.log(msg);
}

function _alerta(titulo, msg) {
  if (_temUI()) {
    SpreadsheetApp.getUi().alert(titulo, msg, SpreadsheetApp.getUi().ButtonSet.OK);
  } else {
    console.log(titulo + ' — ' + msg);
  }
}

function _semToken() {
  _alerta('Planilha ainda não conectada',
    'Cole o token da planilha na aba Config (célula ' + CEL_TOKEN + ').\n\n' +
    'Para pegar o token: abra o Finn → Configurações → Conectar planilha.\n\n' +
    'Você não precisa disso para usar a planilha — a sincronização é opcional.');
}

/**
 * Liga o sync de hora em hora. É o que faz a planilha funcionar no CELULAR:
 * o app do Google Sheets não mostra menu personalizado, então clicar em
 * "Sincronizar" pelo telefone não é opção. Com o gatilho, a planilha se
 * atualiza sozinha e o celular só precisa abrir e olhar.
 */
function finnAtivarAutomatico() {
  finnDesativarAutomatico();  // nunca deixa dois gatilhos empilhados
  ScriptApp.newTrigger('finnSincronizarSilencioso')
    .timeBased().everyHours(1).create();
  var quando = _celulaUltima();
  _alerta('Sincronização automática ligada',
    'A partir de agora a planilha troca lançamentos com o Finn a cada 1 hora, ' +
    'sozinha — inclusive com a planilha fechada.\n\n' +
    'Confira a hora da última sincronização na aba Config' +
    (quando ? ' (célula ' + CEL_ULTIMA + ')' : '') + '.\n\n' +
    'Para desligar: menu Finn → Desligar sincronização automática.');
}

function finnDesativarAutomatico() {
  var gatilhos = ScriptApp.getProjectTriggers();
  var removidos = 0;
  for (var i = 0; i < gatilhos.length; i++) {
    if (gatilhos[i].getHandlerFunction() === 'finnSincronizarSilencioso') {
      ScriptApp.deleteTrigger(gatilhos[i]);
      removidos++;
    }
  }
  return removidos;
}

/** Versão do sync usada pelo gatilho: nunca abre caixa de diálogo. */
function finnSincronizarSilencioso() {
  if (!_token()) { console.log('Sem token na aba Config — nada a fazer.'); return; }
  try {
    var enviados = finnEnviar() || 0;
    var trazidos = finnPuxar() || 0;
    _marcarUltima();
    console.log('sync automático: ' + enviados + ' enviado(s), ' + trazidos + ' trazido(s)');
  } catch (e) {
    console.log('sync automático falhou: ' + e);
  }
}

function _celulaUltima() {
  var cfg = SpreadsheetApp.getActive().getSheetByName(ABA_CONFIG);
  return cfg ? cfg.getRange(CEL_ULTIMA) : null;
}

function _marcarUltima() {
  var cel = _celulaUltima();
  if (!cel) return;
  cel.setValue(Utilities.formatDate(new Date(), FUSO_BR, 'dd/MM/yyyy HH:mm'));
}

function _chamar(caminho, opcoes) {
  var token = _token();
  if (!token) { _semToken(); return null; }
  var params = {
    method: (opcoes && opcoes.method) || 'get',
    muteHttpExceptions: true,
    headers: { 'X-Sheet-Token': token }
  };
  if (opcoes && opcoes.payload) {
    params.contentType = 'application/json';
    params.payload = JSON.stringify(opcoes.payload);
  }
  var resp = UrlFetchApp.fetch(FINN_URL + caminho, params);
  var codigo = resp.getResponseCode();
  var corpo = {};
  try { corpo = JSON.parse(resp.getContentText()); } catch (e) { corpo = {}; }

  if (codigo === 401) {
    _alerta('Token não aceito',
      'O Finn recusou o token desta planilha.\n\n' +
      'Isso acontece quando o token foi trocado ou desconectado no app. ' +
      'Gere um novo em Finn → Configurações → Conectar planilha e cole na aba Config.');
    return null;
  }
  if (codigo === 429) {
    _aviso('Muitas sincronizações seguidas. Espere alguns minutos e tente de novo.');
    return null;
  }
  if (codigo >= 400) {
    _aviso('Erro do Finn: ' + (corpo.error || ('HTTP ' + codigo)));
    return null;
  }
  return corpo;
}

/** Lê as linhas preenchidas da aba Lançamentos. */
function _lerLinhas() {
  var ws = SpreadsheetApp.getActive().getSheetByName(ABA_LANC);
  var ultima = ws.getLastRow();
  if (ultima < LINHA_INI) return { ws: ws, linhas: [] };
  var faixa = ws.getRange(LINHA_INI, 1, ultima - LINHA_INI + 1, COL_ORIGEM);
  var valores = faixa.getValues();
  var linhas = [];
  for (var i = 0; i < valores.length; i++) {
    var v = valores[i];
    if (!v[COL_DATA - 1]) continue;
    linhas.push({ linha: LINHA_INI + i, v: v });
  }
  return { ws: ws, linhas: linhas };
}

function _paraISO(d) {
  if (Object.prototype.toString.call(d) === '[object Date]') {
    return Utilities.formatDate(d, FUSO_BR, 'yyyy-MM-dd');
  }
  var s = String(d).trim();
  // dd/mm/aaaa digitado como texto
  var m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return m[3] + '-' + m[2] + '-' + m[1];
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  return '';
}

/**
 * Envia pro Finn só as linhas SEM "ID Finn". A coluna de id é o que impede
 * de duplicar: assim que o Finn devolve o id, ele é gravado na linha, e a
 * linha nunca mais é enviada.
 */
function finnEnviar() {
  var r = _lerLinhas();
  var pendentes = [];
  for (var i = 0; i < r.linhas.length; i++) {
    var it = r.linhas[i];
    if (String(it.v[COL_ID - 1] || '').trim()) continue;      // já sincronizada
    if (String(it.v[COL_ORIGEM - 1] || '').trim() === 'Exemplo') continue;  // demo
    var tipo = String(it.v[COL_TIPO - 1] || '').trim().toLowerCase();
    if (tipo !== 'despesa' && tipo !== 'receita') continue;
    var data = _paraISO(it.v[COL_DATA - 1]);
    if (!data) continue;
    var valor = Number(it.v[COL_VALOR - 1]);
    if (!isFinite(valor) || valor <= 0) continue;
    pendentes.push({
      linha: it.linha,
      dados: {
        date: data, type: tipo,
        category: String(it.v[COL_CAT - 1] || 'Outros'),
        description: String(it.v[COL_DESC - 1] || ''),
        value: valor
      }
    });
  }
  if (!pendentes.length) { _aviso('Nada novo para enviar.'); return 0; }

  var enviados = 0;
  // Em lotes de 200: o servidor aceita até 500, mas lote menor deixa o
  // relatório de erro mais útil e o retrabalho menor se algo falhar.
  for (var ini = 0; ini < pendentes.length; ini += 200) {
    var lote = pendentes.slice(ini, ini + 200);
    var resp = _chamar('/sheets/push', {
      method: 'post',
      payload: { lancamentos: lote.map(function (p) { return p.dados; }) }
    });
    if (!resp || !resp.ok) return enviados;
    var ids = resp.ids || [];
    for (var k = 0; k < lote.length; k++) {
      if (!ids[k]) continue;
      r.ws.getRange(lote[k].linha, COL_ID).setValue(ids[k]);
      r.ws.getRange(lote[k].linha, COL_ORIGEM).setValue('Planilha');
    }
    enviados += ids.length;
  }
  _aviso(enviados + ' lançamento(s) enviado(s) para o Finn.');
  return enviados;
}

/**
 * Limpa o CONTEÚDO do bloco de linhas de demonstração (Origem = "Exemplo")
 * assim que existe dado de verdade pra mostrar no lugar. Ficar com "Mercado
 * R$ 312,40" misturado no extrato real é confuso, e a instrução de apagar na
 * mão (linhas 6 a 14) é fácil de esquecer quando o que importa é ver os
 * dados que acabaram de chegar.
 *
 * De propósito NÃO usa deleteRows(): Início, Análises e Limites têm fórmulas
 * (SUMIFS/COUNTIFS) que apontam pra um intervalo FIXO da Lançamentos —
 * '$B$6:$B$905', não a coluna inteira (ver LT/LC/LV/LM em gera_planilha.py).
 * deleteRows() desloca tudo pra cima e faz o Sheets tentar reajustar essas
 * referências sozinho — e quando a exclusão começa bem na borda do
 * intervalo, esse reajuste é conhecido por bagunçar a referência em vez de
 * só encolher. Foi reproduzido ao vivo: apagou as linhas, os paineis
 * zeraram. clearContent() muda o conteúdo, nunca a estrutura de linhas —
 * nenhuma fórmula em nenhuma outra aba é afetada.
 *
 * Só mexe num bloco CONTÍGUO começando exatamente em LINHA_INI — na primeira
 * linha que não for "Exemplo" (ou que tiver um buraco), para. Isso garante
 * que nunca apaga algo que a pessoa já digitou por conta própria misturado
 * com os exemplos.
 */
function _removeExemplos(r) {
  var fim = LINHA_INI - 1;
  for (var i = 0; i < r.linhas.length; i++) {
    var linha = r.linhas[i];
    if (linha.linha !== LINHA_INI + i) break;
    if (String(linha.v[COL_ORIGEM - 1] || '').trim() !== 'Exemplo') break;
    fim = linha.linha;
  }
  if (fim < LINHA_INI) return false;
  r.ws.getRange(LINHA_INI, COL_DATA, fim - LINHA_INI + 1, COL_ORIGEM).clearContent();
  return true;
}

/**
 * Recalcula a coluna Mês a partir da coluna Data, em TODAS as linhas que têm
 * data — não só nas recém-chegadas.
 *
 * Esta e' a peça que faltava em todas as tentativas anteriores de corrigir o
 * #ERRO! da coluna Mês. Todas elas mudavam apenas o que era ESCRITO dali em
 * diante; nenhuma consertava o que ja' estava gravado. E finnPuxar pula
 * lancamento cujo ID ja' esta' na planilha (mapa jaTem), entao re-sincronizar
 * nunca reescrevia aquelas linhas: o defeito ficava congelado pra sempre e o
 * usuario via "nao mudou nada" depois de cada correcao.
 *
 * Por que isso derruba TODAS as telas, e nao so' uma coluna: Inicio, Analises
 * e Limites filtram por essa coluna. SUMIFS trata celula com erro como "nao
 * casa" e devolve 0 (dai' os paineis zerados); SUMPRODUCT propaga o erro (dai'
 * o #ERRO! em "POR CATEGORIA"). Um erro numa coluna auxiliar apaga o valor de
 * toda a planilha, sem nenhuma mensagem dizendo isso.
 *
 * Escreve VALOR, nunca formula: formula gravada por Apps Script vai em sintaxe
 * EUA (TEXT, virgula) e a planilha esta' em PT-BR (TEXTO, ponto-e-virgula) —
 * foi exatamente o que gerou o #ERRO! original. Texto "aaaa-mm" e' o que as
 * outras abas comparam, e nao depende de idioma nem de fuso.
 *
 * Idempotente: rodar de novo em planilha sa' nao muda nada. Escreve em blocos
 * contiguos pra nao tocar em linha vazia (a formula do template naquelas
 * linhas continua servindo pra quem digitar a mao depois).
 */
function _recalcularMes(r) {
  if (!r.linhas.length) return 0;
  var corrigidas = 0;
  var bloco = [];        // valores do bloco contiguo atual
  var blocoIni = 0;      // primeira linha do bloco atual

  function descarrega() {
    if (!bloco.length) return;
    var faixa = r.ws.getRange(blocoIni, COL_MES, bloco.length, 1);
    // Texto puro ("@"), nunca o formato de data herdado do template: sem
    // isso o Sheets pode interpretar "2026-08" como data de verdade em vez
    // de guardar o texto, e aí a comparação String(atual) === esperado logo
    // acima nunca mais bate — a planilha ficaria "reparando" pra sempre.
    faixa.setNumberFormat('@');
    faixa.setValues(bloco);
    bloco = [];
  }

  for (var i = 0; i < r.linhas.length; i++) {
    var it = r.linhas[i];
    var esperado = _paraISO(it.v[COL_DATA - 1]).slice(0, 7);  // "" se a data for invalida
    var atual = it.v[COL_MES - 1];
    // Célula com erro chega aqui como string "#ERROR!"/"#ERRO!" ou como o
    // proprio objeto de erro; qualquer coisa diferente do esperado e' trocada.
    if (String(atual) === esperado) {                 // ja' esta' certa
      descarrega();
      continue;
    }
    if (!esperado) {                                  // data ilegivel: nao inventa
      descarrega();
      continue;
    }
    if (!bloco.length) blocoIni = it.linha;
    else if (it.linha !== blocoIni + bloco.length) {  // buraco: fecha e recomeca
      descarrega();
      blocoIni = it.linha;
    }
    bloco.push([esperado]);
    corrigidas++;
  }
  descarrega();
  return corrigidas;
}

/**
 * Retag de Tipo pra "Investimento" em toda linha cuja Descrição bate com
 * INVEST_RE e ainda estiver marcada como Despesa/Receita — o mesmo problema
 * de fundo do _recalcularMes: linhas sincronizadas ANTES desta regra existir
 * ficam com o Tipo errado pra sempre, porque o jaTem de finnPuxar nunca mais
 * revisita um ID que já está na planilha. Sem essa varredura, só lançamento
 * NOVO de investimento sairia certo — os que já infestam os totais atuais
 * continuariam infestando.
 *
 * Só troca o Tipo, nunca mexe em Data/Valor/Categoria: todas as somas de
 * Início/Análises/Limites filtram por Tipo="Despesa" ou "Receita" num
 * SUMIFS/SUMPRODUCT — trocar pra "Investimento" tira a linha de TODAS elas
 * de uma vez, sem editar uma fórmula sequer do modelo. A linha continua
 * visível em Lançamentos (como o app também mostra o Rende Fácil na lista,
 * só não conta ele no resumo de Entradas/Saídas).
 *
 * Idempotente: linha já marcada "Investimento" não é tocada de novo.
 */
function _recalcularFluxo(r) {
  if (!r.linhas.length) return 0;
  var corrigidas = 0;
  var bloco = [], blocoIni = 0;

  function descarrega() {
    if (!bloco.length) return;
    r.ws.getRange(blocoIni, COL_TIPO, bloco.length, 1).setValues(bloco);
    bloco = [];
  }

  for (var i = 0; i < r.linhas.length; i++) {
    var it = r.linhas[i];
    var tipoAtual = String(it.v[COL_TIPO - 1] || '');
    var ehInvest = _ehInvestimento(it.v[COL_DESC - 1]);
    var precisaTrocar = ehInvest && (tipoAtual === 'Despesa' || tipoAtual === 'Receita');
    if (!precisaTrocar) { descarrega(); continue; }
    if (!bloco.length) blocoIni = it.linha;
    else if (it.linha !== blocoIni + bloco.length) { descarrega(); blocoIni = it.linha; }
    bloco.push(['Investimento']);
    corrigidas++;
  }
  descarrega();
  return corrigidas;
}

/**
 * As quatro funções abaixo escrevem o retrato ATUAL de Limites, Contas
 * fixas, Dívidas e Racha — chamadas em toda sincronização, com ou sem
 * lançamento novo. Diferente de Lançamentos (que só cresce), essas abas são
 * configuração que a pessoa edita no app a qualquer momento — marcar parcela
 * como paga, mudar teto de categoria — então cada sync SOBRESCREVE o bloco
 * inteiro com o que o app tem agora, em vez de só acrescentar. É assim que
 * "Alimentação, Transporte, Saúde" (exemplo do modelo) vira as categorias de
 * verdade que a pessoa configurou, e uma dívida já quitada some da lista.
 *
 * Cada uma escreve só nas colunas de ENTRADA (as que a pessoa preenche na
 * mão) — nunca nas colunas de fórmula (Restante, Situação, Falta, Meses p/
 * quitar, Cada um paga), que continuam calculando sozinhas a partir do que
 * foi escrito. Linhas além do que veio do Finn ficam em branco, o que limpa
 * sozinho qualquer exemplo ou dado antigo que sobrou ali.
 */
function _escreverLimites(limites) {
  var ws = SpreadsheetApp.getActive().getSheetByName(ABA_LIMITES);
  if (!ws) return;
  var linhas = [];
  for (var i = 0; i < CAP_LIMITES; i++) {
    var l = limites[i];
    linhas.push(l ? [l.category || '', Number(l.monthly_limit) || 0] : ['', '']);
  }
  ws.getRange(LINHA_INI, 1, CAP_LIMITES, 2).setValues(linhas);
}

function _escreverContasFixas(fixas) {
  var ws = SpreadsheetApp.getActive().getSheetByName(ABA_FIXAS);
  if (!ws) return;
  var linhas = [];
  for (var i = 0; i < CAP_FIXAS; i++) {
    var f = fixas[i];
    linhas.push(f ? [
      f.description || '',
      f.type === 'receita' ? 'Receita' : 'Despesa',
      f.category || 'Outros',
      Number(f.value) || 0,
      Number(f.day_of_month) || ''
    ] : ['', '', '', '', '']);
  }
  ws.getRange(LINHA_INI, 1, CAP_FIXAS, 5).setValues(linhas);
}

function _escreverDividas(dividas) {
  var ws = SpreadsheetApp.getActive().getSheetByName(ABA_DIVIDAS);
  if (!ws) return;
  var esq = [], dir = [];
  for (var i = 0; i < CAP_DIVIDAS; i++) {
    var d = dividas[i];
    if (d) {
      var total = Number(d.total_value) || 0;
      var restante = Number(d.remaining_value) || 0;
      esq.push([d.name || '', total, Math.max(0, total - restante)]);
      dir.push([Number(d.interest_rate) || 0, Number(d.monthly_payment) || 0]);
    } else {
      esq.push(['', '', '']);
      dir.push(['', '']);
    }
  }
  ws.getRange(LINHA_INI, 1, CAP_DIVIDAS, 3).setValues(esq);   // A Dívida, B Valor total, C Já pago
  ws.getRange(LINHA_INI, 5, CAP_DIVIDAS, 2).setValues(dir);   // E Juros % a.m., F Parcela mensal (pula D=Falta, fórmula)
}

function _escreverRacha(racha) {
  var ws = SpreadsheetApp.getActive().getSheetByName(ABA_RACHA);
  if (!ws) return;
  var esq = [], dir = [];
  for (var i = 0; i < CAP_RACHA; i++) {
    var s = racha[i];
    if (s) {
      var participantes = s.participantes || [];
      esq.push([new Date(s.date + 'T12:00:00'), s.description || '', Number(s.total_value) || 0, participantes.length || '']);
      dir.push([participantes.map(function (p) { return p.name + (p.paid ? ' ✓' : ''); }).join(', ')]);
    } else {
      esq.push(['', '', '', '']);
      dir.push(['']);
    }
  }
  ws.getRange(LINHA_INI, 1, CAP_RACHA, 4).setValues(esq);   // A Data, B Descrição, C Valor total, D Nº de pessoas
  ws.getRange(LINHA_INI, 6, CAP_RACHA, 1).setValues(dir);   // F Quem já pagou (pula E=Cada um paga, fórmula)
}

// Se o Finn tem mais linhas do que o modelo cabe numa aba, avisa em vez de
// simplesmente cortar sem dizer nada — silêncio aqui pareceria "sincronizou
// tudo" quando na verdade faltou gente na lista.
function _notaTruncamento(nome, total, cap) {
  return total > cap ? (' ' + nome + ': mostrando ' + cap + ' de ' + total + ' — aumente o modelo pra ver o resto.') : '';
}

/** Traz do Finn o que ainda não está na planilha (compara pelo ID Finn). */
function finnPuxar() {
  var resp = _chamar('/sheets/pull');
  if (!resp || !resp.ok) return 0;

  // Limites, Contas fixas, Dívidas e Racha são sincronizadas SEMPRE, mesmo
  // sem lançamento novo — é exatamente o caso em que a pessoa só mudou um
  // teto ou marcou uma parcela como paga no app, sem lançar nada.
  var limites = resp.limites || [], contasFixas = resp.contasFixas || [],
      dividas = resp.dividas || [], racha = resp.racha || [];
  _escreverLimites(limites);
  _escreverContasFixas(contasFixas);
  _escreverDividas(dividas);
  _escreverRacha(racha);
  var notaConfig = _notaTruncamento('Limites', limites.length, CAP_LIMITES) +
    _notaTruncamento('Contas fixas', contasFixas.length, CAP_FIXAS) +
    _notaTruncamento('Dívidas', dividas.length, CAP_DIVIDAS) +
    _notaTruncamento('Racha', racha.length, CAP_RACHA);
  // finnSincronizar mostra o PRÓPRIO toast final depois de chamar finnPuxar,
  // e um toast novo apaga o anterior — sem isso, um aviso de truncamento
  // (que é acionável, não só informativo) sumiria sem ninguém ver.
  _ultimaNotaConfig = notaConfig;

  var vindos = resp.lancamentos || [];
  if (!vindos.length) {
    var r0 = _lerLinhas();
    var reparadasSemNovas = _recalcularMes(r0);
    var fluxoSemNovas = _recalcularFluxo(_lerLinhas());
    _aviso('Limites, Contas fixas, Dívidas e Racha atualizados.' +
      (reparadasSemNovas ? ' Corrigi a coluna Mês de ' + reparadasSemNovas + ' linha(s).' : ' Nada novo em Lançamentos.') +
      (fluxoSemNovas ? ' Tirei ' + fluxoSemNovas + ' lançamento(s) de investimento dos totais.' : '') +
      notaConfig);
    return 0;
  }

  var r = _lerLinhas();
  // Existe dado de verdade pra escrever — os exemplos podem sair do caminho.
  // Reler depois: apagar linhas muda os números de linha de tudo que vem
  // depois, e r.linhas ficaria com posições erradas se eu não atualizasse.
  if (_removeExemplos(r)) r = _lerLinhas();
  var jaTem = {};
  for (var i = 0; i < r.linhas.length; i++) {
    var id = String(r.linhas[i].v[COL_ID - 1] || '').trim();
    if (id) jaTem[id] = true;
  }
  var novas = [];
  for (var j = 0; j < vindos.length; j++) {
    var t = vindos[j];
    if (jaTem[String(t.id)]) continue;
    novas.push([
      new Date(t.date + 'T12:00:00'),
      // Varredura/compra automática de investimento não é fluxo de verdade
      // (ver comentário em INVEST_RE) — marcado assim já na entrada, pra não
      // depender só do _recalcularFluxo pra pegar lançamento novo.
      _ehInvestimento(t.description) ? 'Investimento' : (t.type === 'receita' ? 'Receita' : 'Despesa'),
      t.category || 'Outros',
      t.description || '',
      Number(t.value) || 0,
      // Calculado aqui, em vez de fórmula na planilha: o Apps Script escreve
      // fórmula sempre em sintaxe EUA (TEXT, vírgula), e numa planilha em
      // outro idioma (a nossa é PT-BR) o Sheets não reconhece a função e
      // mostra #ERRO! — "Erro de análise de fórmula". Reproduzido: digitado
      // à mão vira TEXTO(...;...) sozinho (o editor traduz), mas gravado via
      // API chega cru e quebra. Como o script já sabe o mês de cada
      // lançamento (t.date vem "yyyy-mm-dd" do Finn), é só cortar a string —
      // funciona em qualquer idioma de planilha, sem depender de tradução.
      t.date.slice(0, 7),
      String(t.id),
      'Finn'
    ]);
  }
  // Mesmo sem lançamento novo, repara a coluna Mês antes de sair. Este retorno
  // adiantado era o motivo de toda correção parecer não surtir efeito: com os
  // 500 lançamentos já na planilha, jaTem barrava todos, o código saía por
  // aqui e as linhas quebradas nunca eram tocadas de novo.
  if (!novas.length) {
    var reparadasSemNovas = _recalcularMes(r);
    var fluxoSemNovas = _recalcularFluxo(_lerLinhas());
    _aviso((reparadasSemNovas || fluxoSemNovas
      ? 'A planilha já estava em dia.' +
        (reparadasSemNovas ? ' Corrigi a coluna Mês de ' + reparadasSemNovas + ' linha(s).' : '') +
        (fluxoSemNovas ? ' Tirei ' + fluxoSemNovas + ' lançamento(s) de investimento dos totais.' : '')
      : 'A planilha já está em dia com o Finn.') +
      notaConfig);
    return 0;
  }

  var ws = r.ws;
  // NÃO usar ws.getLastRow() aqui: a planilha pré-preenche a fórmula da
  // coluna Mês em TODAS as linhas do template (pra calcular sozinha assim
  // que alguém digita uma data), e uma célula com fórmula conta como "linha
  // com conteúdo" mesmo quando a Data está vazia. getLastRow() nessas
  // planilhas sempre bate no fim do template (linha ~905), não no fim dos
  // dados de verdade — e o pull acabava escrevendo lá embaixo, invisível
  // pra quem olhasse a planilha sem saber que precisava rolar 900 linhas.
  // r.linhas já veio filtrado só com linhas que TÊM data real (ver
  // _lerLinhas), então a última dela é o fim de verdade dos dados.
  var proxima = r.linhas.length ? (r.linhas[r.linhas.length - 1].linha + 1) : LINHA_INI;
  // Data até Mês (A–F) num bloco só: Mês já vem como valor pronto, não tem
  // mais fórmula pra pisar.
  var faixaEsq = ws.getRange(proxima, COL_DATA, novas.length, 6);
  // Mês em texto puro, pelo mesmo motivo do _recalcularMes: sem isso
  // "2026-08" pode virar data de verdade sozinho ao ser escrito.
  ws.getRange(proxima, COL_MES, novas.length, 1).setNumberFormat('@');
  faixaEsq.setValues(novas.map(function (n) { return n.slice(0, 6); }));
  var faixaDir = ws.getRange(proxima, COL_ID, novas.length, 2);
  faixaDir.setValues(novas.map(function (n) { return [n[6], n[7]]; }));

  // Passa a régua na coluna Mês da planilha inteira depois de escrever. Cobre
  // dois casos de uma vez: linhas quebradas por versões antigas do script, e
  // qualquer linha nova em que a escrita acima não tenha pegado como esperado.
  // É barato (uma chamada por bloco contíguo) e idempotente.
  var reparadas = _recalcularMes(_lerLinhas());
  var fluxoCorrigido = _recalcularFluxo(_lerLinhas());
  _aviso(novas.length + ' lançamento(s) trazido(s) do Finn.' +
    (reparadas ? ' Coluna Mês corrigida em ' + reparadas + ' linha(s).' : '') +
    (fluxoCorrigido ? ' Tirei ' + fluxoCorrigido + ' lançamento(s) de investimento dos totais.' : '') +
    notaConfig);
  return novas.length;
}

/**
 * Roda as duas correções de dados existentes (coluna Mês e Tipo de
 * investimento) sem precisar sincronizar. Existe como item de menu porque
 * quem já tem a planilha com dado quebrado ou com investimento inflando os
 * totais precisa de um caminho de conserto que não dependa de haver
 * lançamento novo pra puxar — que era justamente o caso em que os dois
 * problemas ficavam presos pra sempre (ver comentário em _recalcularMes e
 * _recalcularFluxo).
 */
function finnCorrigirDados() {
  var r = _lerLinhas();
  var nMes = _recalcularMes(r);
  var nFluxo = _recalcularFluxo(_lerLinhas());
  var partes = [];
  if (nMes) partes.push('Recalculei a coluna Mês em ' + nMes + ' linha(s) a partir da coluna Data.');
  if (nFluxo) partes.push('Tirei ' + nFluxo + ' lançamento(s) de investimento (Rende Fácil e afins) dos totais de Receita/Despesa — eles continuam na lista, só não contam mais como fluxo.');
  _alerta(partes.length ? 'Planilha corrigida' : 'Nada a corrigir',
    (partes.length
      ? partes.join('\n\n') + '\n\nOs totais de Início, Análises e Limites devem voltar ao normal agora.'
      : 'Coluna Mês e Tipo de investimento já estão corretos em todas as linhas.') +
    '\n\nVersão do script: ' + VERSAO);
  return nMes + nFluxo;
}

/** Envia primeiro, depois puxa — nessa ordem, pra não duplicar o que acabou de subir. */
function finnSincronizar() {
  if (!_token()) { _semToken(); return; }
  var enviados = finnEnviar() || 0;
  _ultimaNotaConfig = '';
  var trazidos = finnPuxar() || 0;
  _marcarUltima();
  // A versão vai junto de propósito: sem ela, "colei o script novo?" só se
  // responde por dedução, e foi por isso que este bug demorou tanto.
  _aviso('Pronto. ' + enviados + ' enviado(s), ' + trazidos + ' trazido(s). [v' + VERSAO + ']' + _ultimaNotaConfig);
}

function finnTestar() {
  if (!_token()) { _semToken(); return; }
  var resp = _chamar('/sheets/pull?desde=' +
    Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd'));
  if (!resp) return;
  _alerta('Conexão OK',
    'A planilha está conectada ao Finn.\n\n' +
    'O Finn respondeu normalmente. Use "Sincronizar agora" para trocar os lançamentos.\n\n' +
    'Versão do script: ' + VERSAO);
}
