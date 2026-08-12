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
 * Quem comprar uma CÓPIA da planilha recebe este script junto: o Apps Script
 * é vinculado ao arquivo e viaja no "Fazer uma cópia". A pessoa só precisa
 * colar o token dela na aba Config.
 *
 * A planilha funciona sem nada disso. Sem token na Config, o menu avisa e
 * não faz nada — nunca trava o uso normal.
 */

var FINN_URL   = 'https://finn.dev.br';
var ABA_LANC   = 'Lançamentos';
var ABA_CONFIG = 'Config';
var LINHA_INI  = 6;   // primeira linha de dados em Lançamentos
var CEL_TOKEN  = 'C35';
var CEL_ULTIMA = 'C36';

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
    .addItem('Testar conexão', 'finnTestar')
    .addToUi();
}

function _token() {
  var cfg = SpreadsheetApp.getActive().getSheetByName(ABA_CONFIG);
  if (!cfg) return '';
  return String(cfg.getRange(CEL_TOKEN).getValue() || '').trim();
}

function _aviso(msg) {
  SpreadsheetApp.getActive().toast(msg, 'Finn', 8);
}

function _semToken() {
  SpreadsheetApp.getUi().alert(
    'Planilha ainda não conectada',
    'Cole o token da planilha na aba Config (célula ' + CEL_TOKEN + ').\n\n' +
    'Para pegar o token: abra o Finn → Configurações → Conectar planilha.\n\n' +
    'Você não precisa disso para usar a planilha — a sincronização é opcional.',
    SpreadsheetApp.getUi().ButtonSet.OK);
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
    SpreadsheetApp.getUi().alert('Token não aceito',
      'O Finn recusou o token desta planilha.\n\n' +
      'Isso acontece quando o token foi trocado ou desconectado no app. ' +
      'Gere um novo em Finn → Configurações → Conectar planilha e cole na aba Config.',
      SpreadsheetApp.getUi().ButtonSet.OK);
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
    return Utilities.formatDate(d, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'yyyy-MM-dd');
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

/** Traz do Finn o que ainda não está na planilha (compara pelo ID Finn). */
function finnPuxar() {
  var resp = _chamar('/sheets/pull');
  if (!resp || !resp.ok) return 0;
  var vindos = resp.lancamentos || [];
  if (!vindos.length) { _aviso('Nada novo no Finn.'); return 0; }

  var r = _lerLinhas();
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
      t.type === 'receita' ? 'Receita' : 'Despesa',
      t.category || 'Outros',
      t.description || '',
      Number(t.value) || 0,
      '',            // coluna Mês tem fórmula própria; escrever aqui a apagaria
      String(t.id),
      'Finn'
    ]);
  }
  if (!novas.length) { _aviso('A planilha já está em dia com o Finn.'); return 0; }

  var ws = r.ws;
  var proxima = Math.max(ws.getLastRow() + 1, LINHA_INI);
  // Escreve coluna a coluna pra não pisar na fórmula da coluna Mês.
  var faixaEsq = ws.getRange(proxima, COL_DATA, novas.length, 5);
  faixaEsq.setValues(novas.map(function (n) { return n.slice(0, 5); }));
  var faixaDir = ws.getRange(proxima, COL_ID, novas.length, 2);
  faixaDir.setValues(novas.map(function (n) { return [n[6], n[7]]; }));
  // Repõe a fórmula do mês nas linhas novas.
  for (var m = 0; m < novas.length; m++) {
    var lin = proxima + m;
    ws.getRange(lin, COL_MES).setFormula('=IF($A' + lin + '="","",TEXT($A' + lin + ',"yyyy-mm"))');
  }
  _aviso(novas.length + ' lançamento(s) trazido(s) do Finn.');
  return novas.length;
}

/** Envia primeiro, depois puxa — nessa ordem, pra não duplicar o que acabou de subir. */
function finnSincronizar() {
  if (!_token()) { _semToken(); return; }
  var enviados = finnEnviar() || 0;
  var trazidos = finnPuxar() || 0;
  var cfg = SpreadsheetApp.getActive().getSheetByName(ABA_CONFIG);
  if (cfg) {
    cfg.getRange(CEL_ULTIMA).setValue(
      Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(),
                           'dd/MM/yyyy HH:mm'));
  }
  _aviso('Pronto. ' + enviados + ' enviado(s), ' + trazidos + ' trazido(s).');
}

function finnTestar() {
  if (!_token()) { _semToken(); return; }
  var resp = _chamar('/sheets/pull?desde=' +
    Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd'));
  if (!resp) return;
  SpreadsheetApp.getUi().alert('Conexão OK',
    'A planilha está conectada ao Finn.\n\n' +
    'O Finn respondeu normalmente. Use "Sincronizar agora" para trocar os lançamentos.',
    SpreadsheetApp.getUi().ButtonSet.OK);
}
