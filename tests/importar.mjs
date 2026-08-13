// Importação de extrato. O bug que originou este teste: uma tentativa que
// falhava deixava a tag <script> da biblioteca no DOM, e a tentativa seguinte
// via a tag, resolvia na hora, e estourava "XLSX is not defined" — mensagem
// que não diz nada pra quem só quer subir o extrato do banco.
import { chromium } from 'playwright';
import fs from 'fs'; import http from 'http';

// Sem a entrada de SRI do xlsx: o stub nunca bateria com o hash da lib real,
// e o alvo aqui é o fluxo de carga e o parser, não a verificação de integridade.
let html = fs.readFileSync(new URL('../finn/index.html', import.meta.url), 'utf8');
html = html.replace(/"https:\/\/cdn\.jsdelivr\.net\/npm\/xlsx@0\.18\.5[^"]*":\s*\n?\s*"sha384-[^"]*",?/, '');
const csvReal = fs.readFileSync(new URL('./fixtures-extrato-bb.csv', import.meta.url), 'utf8');
const srv = http.createServer((q, r) => { r.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); r.end(html); }).listen(8989);

let falhas = 0;
const ok = (c, n, e) => { console.log((c ? '  ok   ' : '  FALHA') + ' ' + n + (e !== undefined ? '  — ' + e : '')); if (!c) falhas++; };

// Um .xlsx mínimo de verdade (zip) só pra o input aceitar o arquivo; o
// conteúdo que importa vem do stub da biblioteca.
const XLSX_FALSO = Buffer.from('504b0304140000000800', 'hex');
const tmp = '/tmp/extrato-teste.xlsx';
fs.writeFileSync(tmp, XLSX_FALSO);

let cdnFalha = true;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 412, height: 915 } });
const erros = [];
p.on('pageerror', e => erros.push(e.message));
await p.addInitScript(() => {
  localStorage.setItem('finn_supa_session', JSON.stringify({
    access_token: 't', refresh_token: 'r', expires_at: Math.floor(Date.now() / 1000) + 7200,
    user: { id: 'u1', email: 'a@x.com', user_metadata: {} }
  }));
});
await p.route('**/*', async route => {
  const u = route.request().url();
  const J = o => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
  if (u.includes('cdn.jsdelivr.net') && u.includes('xlsx')) {
    if (cdnFalha) return route.abort('failed');
    return route.fulfill({ status: 200, contentType: 'application/javascript',
      body: 'window.XLSX={read:function(){return{SheetNames:["S"],Sheets:{S:{}}};},utils:{sheet_to_csv:function(){return ' + JSON.stringify(csvReal) + ';}}};' });
  }
  if (u.includes('supabase.co/rest/v1/')) return J([]);
  if (u.includes('supabase.co/auth/v1/user')) return J({ id: 'u1', email: 'a@x.com', user_metadata: {} });
  if (u.includes('workers.dev') || u.includes('/admin') || u.includes('/sheets') || u.includes('/billing') || u.includes('/beta')) return J({ ok: true, txs: [] });
  return route.continue();
});
await p.goto('http://localhost:8989/');
await p.waitForTimeout(2200);

async function importar() {
  await p.evaluate(async () => {
    const btn = [...document.querySelectorAll('.tab-btn')].find(x => x.dataset.tab === 'adicionar');
    if (btn) btn.click();
    await new Promise(r => setTimeout(r, 400));
  });
  const input = await p.$('input[type="file"]');
  await input.setInputFiles(tmp);
  await p.waitForTimeout(2200);
  return p.evaluate(() => ({
    texto: document.getElementById('content').innerText,
    tags: document.querySelectorAll('script[src*="jsdelivr"]').length,
    linhas: document.querySelectorAll('.import-row').length
  }));
}

console.log('=== biblioteca indisponível ===');
{
  const r = await importar();
  ok(/N[ãa]o consegui carregar a biblioteca/.test(r.texto), 'explica que a biblioteca não carregou');
  // Sem esta saída, a pessoa fica sem alternativa nenhuma na tela.
  ok(/CSV ou OFX/.test(r.texto), 'e oferece CSV/OFX, que o Finn lê sem biblioteca');
  ok(r.tags === 0, 'a tag da tentativa falha NÃO fica no DOM', r.tags);
}

console.log('\n=== biblioteca volta: a retentativa tem que funcionar ===');
{
  cdnFalha = false;
  const r = await importar();
  ok(!/XLSX is not defined/.test(r.texto), 'não estoura "XLSX is not defined"');
  ok(r.linhas > 0, 'a prévia de importação aparece', r.linhas + ' linhas');
  ok(r.linhas === 117, 'as 117 linhas do extrato foram lidas', r.linhas);
}

console.log('\n=== o extrato do banco é lido direito ===');
{
  const d = await p.evaluate(() => {
    const l = [...document.querySelectorAll('.import-row')];
    const val = el => Number(el.querySelector('.impVal').value || 0);
    return {
      saldos: l.filter(el => /^saldo (anterior|do dia)/i.test(el.querySelector('.impDesc').value)).length,
      datasRuins: l.filter(el => !el.querySelector('.impDate').value).length,
      despesa: l.filter(el => el.querySelector('.impType').value === 'despesa').reduce((a, el) => a + val(el), 0),
      receita: l.filter(el => el.querySelector('.impType').value === 'receita').reduce((a, el) => a + val(el), 0),
      uber: l.filter(el => /UBER/i.test(el.querySelector('.impDesc').value))
             .map(el => el.querySelector('.impDesc').value + ' -> ' + el.querySelector('.impCat').value),
      negativos: l.filter(el => val(el) < 0).length
    };
  });
  // "Saldo Anterior" e "Saldo do dia" são marcadores, não transações —
  // importá-los somaria duas vezes e estragaria o saldo do mês.
  ok(d.saldos === 0, 'linhas de saldo NÃO viram lançamento', d.saldos);
  ok(d.datasRuins === 0, 'nenhuma data em branco', d.datasRuins);
  ok(d.negativos === 0, 'valores entram positivos (o sinal vira o tipo)', d.negativos);
  ok(d.despesa > 8000 && d.receita > 8000, 'somas batem com o extrato', 'D ' + d.despesa.toFixed(2) + ' / R ' + d.receita.toFixed(2));
  const uberTrip = d.uber.filter(x => /TRIP|UberRides/i.test(x));
  const foraTransporte = uberTrip.filter(x => !/Transporte$/.test(x));
  ok(foraTransporte.length === 0, 'toda corrida de Uber cai em Transporte',
     foraTransporte.length ? foraTransporte.join(' | ') : uberTrip.length + ' corridas');
  ok(erros.length === 0, 'sem erro de JS', erros.join(' | '));
}

console.log('\n' + (falhas ? `❌ ${falhas} falha(s)` : '✅ tudo passou'));
await b.close(); srv.close();
process.exit(falhas ? 1 : 0);
