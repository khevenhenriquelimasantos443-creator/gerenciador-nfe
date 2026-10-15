/**
 * Recibos de Vale Transporte — automação pelo Google Planilhas
 *
 * Lê a aba "Funcionários" (nome + valor), monta um Google Docs com um recibo
 * por pessoa — valor por extenso gerado automaticamente — e salva também o
 * PDF na mesma pasta da planilha. Passo a passo em COMO-USAR.md.
 */

const ABA_FUNCIONARIOS = 'Funcionários';
const ABA_CONFIG = 'Config';
const ABA_HISTORICO = 'Histórico';

const CABECALHO_FUNCIONARIOS = ['Nome', 'Valor VT (R$)', 'Setor', 'Pular'];
const CABECALHO_HISTORICO = ['Gerado em', 'Mês de referência', 'Setor', 'Recibos', 'Total (R$)', 'Docs', 'PDF'];

// Valores iniciais da aba Config (só usados pelo "Preparar planilha").
const CONFIG_PADRAO = [
  ['Empresa', 'BEM BARATO COMERCIO DE VARIEDADES', ''],
  ['CNPJ', '39.830.505/0001-19', ''],
  ['Cidade', 'Santos', 'Cidade que aparece na data do recibo'],
  ['Data do recibo', '', 'Vazio = data de hoje'],
  ['Mês de referência', '', 'Vazio = mês da data do recibo (ex: OUTUBRO/2026)'],
  ['Forma de pagamento', 'em dinheiro', 'Ex: em dinheiro, via PIX'],
  ['Recibos por página', 3, 'De 1 a 3'],
  ['Setor', '', 'Vazio = todos. Preenchido = só quem tem esse setor na aba Funcionários'],
];

const MESES = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];

const FORMATO_REAIS = '"R$" #,##0.00';

// ─────────────────────────────────────────────
//  Menu
// ─────────────────────────────────────────────

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🧾 Recibos VT')
    .addItem('Gerar recibos', 'gerarRecibos')
    .addSeparator()
    .addItem('Preparar planilha', 'prepararPlanilha')
    .addToUi();
}

// Cria as abas Funcionários / Config / Histórico que ainda não existirem.
// Não apaga nada que já esteja preenchido.
function prepararPlanilha() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetLocale('pt_BR');
  ss.setSpreadsheetTimeZone('America/Sao_Paulo');

  const func = obterOuCriarAba(ss, ABA_FUNCIONARIOS);
  if (func.getLastRow() === 0) {
    func.getRange(1, 1, 1, CABECALHO_FUNCIONARIOS.length).setValues([CABECALHO_FUNCIONARIOS]);
  }
  func.getRange(1, 1, 1, CABECALHO_FUNCIONARIOS.length).setFontWeight('bold').setBackground('#FDE68A');
  func.setFrozenRows(1);
  func.getRange('B2:B').setNumberFormat(FORMATO_REAIS);
  func.getRange('D2:D500').insertCheckboxes();
  func.getRange('D1').setNote('Marque para NÃO gerar o recibo desta pessoa (férias, afastamento...).');
  func.setColumnWidth(1, 380);
  func.setColumnWidth(2, 120);
  func.setColumnWidth(3, 160);
  func.setColumnWidth(4, 70);

  const cfg = obterOuCriarAba(ss, ABA_CONFIG);
  if (cfg.getLastRow() === 0) {
    cfg.getRange(1, 1, 1, 3).setValues([['Campo', 'Valor', 'Observação']]);
    cfg.getRange(2, 1, CONFIG_PADRAO.length, 3).setValues(CONFIG_PADRAO);
  }
  cfg.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#FDE68A');
  cfg.setFrozenRows(1);
  cfg.getRange('A2:A').setFontWeight('bold');
  cfg.getRange('C2:C').setFontColor('#6B7280');
  cfg.setColumnWidth(1, 170);
  cfg.setColumnWidth(2, 320);
  cfg.setColumnWidth(3, 460);
  const linhaData = linhaDoCampo(cfg, 'Data do recibo');
  if (linhaData) cfg.getRange(linhaData, 2).setNumberFormat('dd/mm/yyyy');
  // Texto puro: senão "10/2026" vira data sozinho.
  const linhaMes = linhaDoCampo(cfg, 'Mês de referência');
  if (linhaMes) cfg.getRange(linhaMes, 2).setNumberFormat('@');

  const hist = obterOuCriarAba(ss, ABA_HISTORICO);
  if (hist.getLastRow() === 0) {
    hist.getRange(1, 1, 1, CABECALHO_HISTORICO.length).setValues([CABECALHO_HISTORICO]);
  }
  hist.getRange(1, 1, 1, CABECALHO_HISTORICO.length).setFontWeight('bold').setBackground('#FDE68A');
  hist.setFrozenRows(1);

  ss.setActiveSheet(func);
  ss.toast('Planilha pronta. Preencha a aba "Funcionários" e use 🧾 Recibos VT → Gerar recibos.', '🧾 Recibos VT', 8);
}

// ─────────────────────────────────────────────
//  Geração dos recibos
// ─────────────────────────────────────────────

function gerarRecibos() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  try {
    const cfg = lerConfig(ss);
    const { recibos, erros, duplicados } = lerFuncionarios(ss, cfg.setor);

    if (erros.length) {
      ui.alert('Corrija antes de gerar', erros.join('\n'), ui.ButtonSet.OK);
      return;
    }
    if (!recibos.length) {
      const motivo = cfg.setor ? `ninguém tem o setor "${cfg.setor}"` : 'a aba "Funcionários" está vazia';
      ui.alert('Nenhum recibo para gerar', `Nada para gerar: ${motivo}.`, ui.ButtonSet.OK);
      return;
    }
    if (duplicados.length) {
      const resp = ui.alert('Nomes repetidos',
        'Essas pessoas aparecem mais de uma vez e vão receber mais de um recibo:\n\n' +
        duplicados.join('\n') + '\n\nGerar mesmo assim?', ui.ButtonSet.YES_NO);
      if (resp !== ui.Button.YES) return;
    }

    ss.toast(`Montando ${recibos.length} recibos…`, '🧾 Recibos VT', -1);
    const titulo = `Recibos VT — ${cfg.mesReferencia}` + (cfg.setor ? ` — ${cfg.setor}` : '');
    const doc = montarDocumento(titulo, recibos, cfg);

    const pasta = pastaDaPlanilha(ss);
    const arquivoDoc = DriveApp.getFileById(doc.getId());
    arquivoDoc.moveTo(pasta);
    const pdf = pasta.createFile(arquivoDoc.getAs(MimeType.PDF)).setName(titulo + '.pdf');

    const total = recibos.reduce((soma, r) => soma + Math.round(r.valor * 100), 0) / 100;
    registrarHistorico(ss, cfg, recibos.length, total, doc.getUrl(), pdf.getUrl());

    ss.toast('Pronto!', '🧾 Recibos VT', 3);
    mostrarResultado(recibos.length, total, doc.getUrl(), pdf.getUrl());
  } catch (e) {
    ss.toast('', '🧾 Recibos VT', 1);
    ui.alert('Erro ao gerar os recibos', e.message, ui.ButtonSet.OK);
  }
}

function montarDocumento(titulo, recibos, cfg) {
  const doc = DocumentApp.create(titulo);
  const body = doc.getBody();
  body.setMarginTop(42).setMarginBottom(42).setMarginLeft(56).setMarginRight(56);

  const H = DocumentApp.HorizontalAlignment;
  const linhaData = `${cfg.cidade}, ${cfg.dia} de ${MESES[cfg.mes - 1]} de ${cfg.ano}.`;

  recibos.forEach((r, i) => {
    if (i > 0) {
      if (i % cfg.porPagina === 0) {
        body.appendPageBreak();
      } else {
        paragrafo(body, '- '.repeat(48).trim(), { alinhamento: H.CENTER, tamanho: 8, cor: '#9CA3AF', antes: 14, depois: 14 });
      }
    }
    paragrafo(body, 'RECIBO DE VALE TRANSPORTE', { alinhamento: H.CENTER, negrito: true, tamanho: 13, depois: 10 });
    paragrafo(body, textoDoRecibo(r.valor, cfg), { alinhamento: H.JUSTIFY, entrelinhas: 1.5, depois: 8 });
    paragrafo(body, linhaData, { depois: 26 });
    paragrafo(body, '_'.repeat(47), { alinhamento: H.CENTER, depois: 2 });
    paragrafo(body, r.nome, { alinhamento: H.CENTER, negrito: true });
  });

  // Todo Docs novo já nasce com um parágrafo vazio no topo.
  body.getChild(0).removeFromParent();
  doc.saveAndClose();
  return doc;
}

function textoDoRecibo(valor, cfg) {
  const forma = cfg.forma ? ` ${cfg.forma}` : '';
  return `Declaro ter recebido da empresa ${cfg.empresa} inscrita no CNPJ ${cfg.cnpj}, ` +
    `o valor de R$ ${formatarReais(valor)} (${valorPorExtenso(valor)})${forma}, ` +
    `referente ao vale transporte do mês de ${cfg.mesReferencia}, para minha utilização.`;
}

function paragrafo(body, texto, opcoes) {
  const p = body.appendParagraph(texto);
  p.setAlignment(opcoes.alinhamento || DocumentApp.HorizontalAlignment.LEFT)
    .setSpacingBefore(opcoes.antes || 0)
    .setSpacingAfter(opcoes.depois || 0)
    .setLineSpacing(opcoes.entrelinhas || 1.15);
  p.editAsText()
    .setFontFamily('Arial')
    .setFontSize(opcoes.tamanho || 11)
    .setBold(!!opcoes.negrito)
    .setForegroundColor(opcoes.cor || '#000000');
  return p;
}

function mostrarResultado(qtd, total, urlDoc, urlPdf) {
  const html = HtmlService.createHtmlOutput(
    '<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7">' +
    `<p><b>${qtd} recibos</b> — total <b>R$ ${formatarReais(total)}</b></p>` +
    `<p><a href="${urlDoc}" target="_blank">Abrir no Google Docs</a><br>` +
    `<a href="${urlPdf}" target="_blank">Abrir PDF para imprimir</a></p>` +
    '<p style="color:#6B7280;font-size:12px">Os arquivos ficam na mesma pasta da planilha. ' +
    'Cada geração fica registrada na aba "Histórico".</p></div>'
  ).setWidth(380).setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'Recibos gerados');
}

function registrarHistorico(ss, cfg, qtd, total, urlDoc, urlPdf) {
  const aba = obterOuCriarAba(ss, ABA_HISTORICO);
  if (aba.getLastRow() === 0) aba.appendRow(CABECALHO_HISTORICO);
  aba.appendRow([new Date(), cfg.mesReferencia, cfg.setor || 'Todos', qtd, total, urlDoc, urlPdf]);
  const linha = aba.getLastRow();
  aba.getRange(linha, 1).setNumberFormat('dd/mm/yyyy hh:mm');
  aba.getRange(linha, 5).setNumberFormat(FORMATO_REAIS);
}

// ─────────────────────────────────────────────
//  Leitura da planilha
// ─────────────────────────────────────────────

function lerConfig(ss) {
  const aba = ss.getSheetByName(ABA_CONFIG);
  if (!aba) throw new Error('Aba "Config" não encontrada. Use o menu 🧾 Recibos VT → Preparar planilha.');

  const mapa = {};
  aba.getDataRange().getValues().forEach(([campo, valor]) => {
    if (campo) mapa[normalizar(campo)] = valor;
  });
  const campo = (nome) => mapa[normalizar(nome)];
  const texto = (nome) => String(campo(nome) == null ? '' : campo(nome)).trim();

  const tz = ss.getSpreadsheetTimeZone();
  const data = lerData(campo('Data do recibo')) || new Date();
  const [dia, mes, ano] = Utilities.formatDate(data, tz, 'd/M/yyyy').split('/').map(Number);

  const mesCampo = campo('Mês de referência');
  let mesReferencia;
  if (mesCampo instanceof Date) {
    const [m, a] = Utilities.formatDate(mesCampo, tz, 'M/yyyy').split('/').map(Number);
    mesReferencia = `${MESES[m - 1]}/${a}`;
  } else {
    mesReferencia = texto('Mês de referência').toUpperCase() || `${MESES[mes - 1]}/${ano}`;
  }

  const cfg = {
    empresa: texto('Empresa'),
    cnpj: texto('CNPJ'),
    cidade: texto('Cidade'),
    forma: texto('Forma de pagamento'),
    setor: texto('Setor'),
    porPagina: Math.min(3, Math.max(1, parseInt(campo('Recibos por página'), 10) || 3)),
    dia, mes, ano, mesReferencia,
  };
  const faltando = ['empresa', 'cnpj', 'cidade'].filter((k) => !cfg[k]);
  if (faltando.length) throw new Error(`Preencha na aba "Config": ${faltando.join(', ')}.`);
  return cfg;
}

function lerFuncionarios(ss, setorFiltro) {
  const aba = ss.getSheetByName(ABA_FUNCIONARIOS);
  if (!aba) throw new Error('Aba "Funcionários" não encontrada. Use o menu 🧾 Recibos VT → Preparar planilha.');

  const recibos = [];
  const erros = [];
  aba.getDataRange().getValues().slice(1).forEach((linha, i) => {
    const numLinha = i + 2;
    const nome = String(linha[0] == null ? '' : linha[0]).replace(/\s+/g, ' ').trim().toUpperCase();
    const valorBruto = linha[1];
    const setor = String(linha[2] == null ? '' : linha[2]).trim();
    const pular = linha[3] === true;

    if (!nome && (valorBruto === '' || valorBruto == null)) return; // linha vazia
    if (pular) return;
    if (setorFiltro && normalizar(setor) !== normalizar(setorFiltro)) return;

    const valor = lerValor(valorBruto);
    if (!nome) {
      erros.push(`Linha ${numLinha}: falta o nome.`);
    } else if (valorBruto === '' || valorBruto == null) {
      erros.push(`Linha ${numLinha} (${nome}): falta o valor.`);
    } else if (valor === null || valor <= 0) {
      erros.push(`Linha ${numLinha} (${nome}): valor inválido "${valorBruto}".`);
    } else {
      recibos.push({ nome, valor, linha: numLinha });
    }
  });

  const linhasPorNome = {};
  recibos.forEach((r) => {
    const chave = normalizar(r.nome);
    (linhasPorNome[chave] = linhasPorNome[chave] || []).push(r.linha);
  });
  const duplicados = Object.keys(linhasPorNome)
    .filter((k) => linhasPorNome[k].length > 1)
    .map((k) => `${k} (linhas ${linhasPorNome[k].join(', ')})`);

  return { recibos, erros, duplicados };
}

function obterOuCriarAba(ss, nome) {
  return ss.getSheetByName(nome) || ss.insertSheet(nome);
}

function linhaDoCampo(aba, campo) {
  const valores = aba.getRange('A:A').getValues();
  const alvo = normalizar(campo);
  for (let i = 0; i < valores.length; i++) {
    if (normalizar(valores[i][0]) === alvo) return i + 1;
  }
  return 0;
}

function pastaDaPlanilha(ss) {
  const pais = DriveApp.getFileById(ss.getId()).getParents();
  return pais.hasNext() ? pais.next() : DriveApp.getRootFolder();
}

function normalizar(s) {
  return String(s == null ? '' : s)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ').trim().toUpperCase();
}

function lerData(v) {
  if (v instanceof Date && !isNaN(v)) return v;
  const m = String(v == null ? '' : v).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  // Meio-dia: evita cair no dia anterior por diferença de fuso.
  return m ? new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), 12) : null;
}

// Aceita número da célula ou texto tipo "R$ 150,00", "1.500" ou "162.5".
function lerValor(v) {
  if (typeof v === 'number') return isFinite(v) ? Math.round(v * 100) / 100 : null;
  let s = String(v == null ? '' : v).replace(/R\$|\s/g, '');
  if (!s) return null;
  if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  const n = Number(s);
  return isFinite(n) ? Math.round(n * 100) / 100 : null;
}

// ─────────────────────────────────────────────
//  Valor por extenso
// ─────────────────────────────────────────────

/**
 * Escreve um valor em reais por extenso. Ex: =EXTENSO(B2) → "cento e cinquenta reais".
 *
 * @param {number} valor Valor (ou intervalo de valores) em reais.
 * @return {string} O valor por extenso.
 * @customfunction
 */
function EXTENSO(valor) {
  if (Array.isArray(valor)) return valor.map((linha) => linha.map(EXTENSO));
  const v = lerValor(valor);
  return v === null ? '' : valorPorExtenso(v);
}

const UNIDADES = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
  'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
const DEZENAS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
const CENTENAS = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos',
  'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

function valorPorExtenso(valor) {
  const totalCentavos = Math.round(Math.abs(valor) * 100);
  const reais = Math.floor(totalCentavos / 100);
  const centavos = totalCentavos % 100;

  let texto = '';
  if (reais) {
    // "um milhão de reais", mas "um milhão e quinhentos mil reais"
    const de = reais % 1000000 === 0 ? ' de' : '';
    texto = inteiroPorExtenso(reais) + de + (reais === 1 ? ' real' : ' reais');
  }
  if (centavos) {
    const c = inteiroPorExtenso(centavos) + (centavos === 1 ? ' centavo' : ' centavos');
    texto = texto ? `${texto} e ${c}` : c;
  }
  return texto || 'zero reais';
}

function inteiroPorExtenso(n) {
  if (n === 0) return 'zero';
  const grupos = [
    { valor: Math.floor(n / 1000000000) % 1000, um: 'um bilhão', varios: ' bilhões' },
    { valor: Math.floor(n / 1000000) % 1000, um: 'um milhão', varios: ' milhões' },
    { valor: Math.floor(n / 1000) % 1000, um: 'mil', varios: ' mil' },
    { valor: n % 1000, um: 'um', varios: '' },
  ].filter((g) => g.valor);

  return grupos.reduce((texto, g, i) => {
    const parte = g.valor === 1 ? g.um : ate999(g.valor) + g.varios;
    if (i === 0) return parte;
    // "mil e cem", "mil e vinte", mas "mil cento e cinquenta"
    const liga = g.valor < 100 || g.valor % 100 === 0 ? ' e ' : ' ';
    return texto + liga + parte;
  }, '');
}

function ate999(n) {
  if (n === 100) return 'cem';
  const partes = [];
  const c = Math.floor(n / 100);
  const resto = n % 100;
  if (c) partes.push(CENTENAS[c]);
  if (resto >= 20) {
    const u = resto % 10;
    partes.push(DEZENAS[Math.floor(resto / 10)] + (u ? ` e ${UNIDADES[u]}` : ''));
  } else if (resto) {
    partes.push(UNIDADES[resto]);
  }
  return partes.join(' e ');
}

function formatarReais(valor) {
  const [inteiro, decimal] = (Math.round(valor * 100) / 100).toFixed(2).split('.');
  return inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + decimal;
}
