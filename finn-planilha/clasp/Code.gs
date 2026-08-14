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
var LINHA_INI  = 6;   // primeira linha de dados em Lançamentos
var CEL_TOKEN  = 'C35';
var CEL_ULTIMA = 'C36';
// Fixo em vez de SpreadsheetApp.getActive().getSpreadsheetTimeZone(): o
// gerador da planilha nunca define o fuso do arquivo, então cada cópia nova
// fica com o que o Google decidir por padrão (na prática, America/Los_Angeles
// — o clássico fuso padrão do Apps Script). Resultado visto de verdade:
// "Última sincronização" mostrando 09:27 com o relógio real em 13:31, quatro
// horas de diferença. Fixar aqui evita depender de configuração que ninguém
// vai lembrar de ajustar — a Planilha Finn é pro fuso do Brasil, sempre.
var FUSO_BR = 'America/Sao_Paulo';

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
 * Apaga o bloco de linhas de demonstração (Origem = "Exemplo") assim que
 * existe dado de verdade pra mostrar no lugar. Ficar com "Mercado R$ 312,40"
 * misturado no extrato real é confuso, e a instrução de apagar na mão (linhas
 * 6 a 14) é fácil de esquecer quando o que importa é ver os dados que
 * acabaram de chegar.
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
  r.ws.deleteRows(LINHA_INI, fim - LINHA_INI + 1);
  return true;
}

/** Traz do Finn o que ainda não está na planilha (compara pelo ID Finn). */
function finnPuxar() {
  var resp = _chamar('/sheets/pull');
  if (!resp || !resp.ok) return 0;
  var vindos = resp.lancamentos || [];
  if (!vindos.length) { _aviso('Nada novo no Finn.'); return 0; }

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
      t.type === 'receita' ? 'Receita' : 'Despesa',
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
  if (!novas.length) { _aviso('A planilha já está em dia com o Finn.'); return 0; }

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
  faixaEsq.setValues(novas.map(function (n) { return n.slice(0, 6); }));
  var faixaDir = ws.getRange(proxima, COL_ID, novas.length, 2);
  faixaDir.setValues(novas.map(function (n) { return [n[6], n[7]]; }));
  _aviso(novas.length + ' lançamento(s) trazido(s) do Finn.');
  return novas.length;
}

/** Envia primeiro, depois puxa — nessa ordem, pra não duplicar o que acabou de subir. */
function finnSincronizar() {
  if (!_token()) { _semToken(); return; }
  var enviados = finnEnviar() || 0;
  var trazidos = finnPuxar() || 0;
  _marcarUltima();
  _aviso('Pronto. ' + enviados + ' enviado(s), ' + trazidos + ' trazido(s).');
}

function finnTestar() {
  if (!_token()) { _semToken(); return; }
  var resp = _chamar('/sheets/pull?desde=' +
    Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd'));
  if (!resp) return;
  _alerta('Conexão OK',
    'A planilha está conectada ao Finn.\n\n' +
    'O Finn respondeu normalmente. Use "Sincronizar agora" para trocar os lançamentos.');
}
