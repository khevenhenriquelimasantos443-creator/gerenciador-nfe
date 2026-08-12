// Procura elementos que vazam pra fora do pai em tela estreita. Grep no CSS
// não resolve: `.btn-ghost{width:100%}` só quebra quando o botão está num
// flex-row, e isso é geometria, não texto — tem que medir no navegador.
import { chromium } from 'playwright';
import fs from 'fs'; import http from 'http';

const html = fs.readFileSync('/home/user/gerenciador-nfe/finn/index.html', 'utf8');
const srv = http.createServer((q, r) => { r.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); r.end(html); }).listen(8993);

const hoje = new Date();
const d = (n) => { const x = new Date(hoje); x.setDate(x.getDate() - n); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
const ym = hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0');
const TXS = [];
for (let i = 0; i < 12; i++) TXS.push({ id: 't' + i, user_id: 'u1', type: 'despesa', category: 'Alimentação', description: 'Gasto ' + i, value: 30 + i, date: d(i), created_at: d(i) + 'T12:00:00Z' });
TXS.push({ id: 'r1', user_id: 'u1', type: 'receita', category: 'Salário', description: 'Salário', value: 4200, date: ym + '-05', created_at: ym + '-05T12:00:00Z' });
const DADOS = {
  transactions: TXS,
  goals: [{ id: 'g1', user_id: 'u1', name: 'Reserva', target: 6000, saved: 3900 }],
  spending_limits: [{ id: 'l1', user_id: 'u1', category: 'Alimentação', monthly_limit: 700 }],
  splits: [{ id: 'sp1', user_id: 'u1', title: 'Churrasco', total_value: 100 }],
};

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
// 360px é o Galaxy A-series / iPhone SE — o piso realista de largura no Brasil.
const p = await b.newPage({ viewport: { width: 360, height: 800 } });
await p.addInitScript(() => {
  localStorage.setItem('finn_supa_session', JSON.stringify({
    access_token: 't', refresh_token: 'r', expires_at: Math.floor(Date.now() / 1000) + 7200,
    user: { id: 'u1', email: 'ana@exemplo.com', user_metadata: { full_name: 'Ana', whatsapp_verified: true } }
  }));
});
await p.route('**/*', async route => {
  const u = route.request().url();
  const J = (o) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
  if (u.includes('supabase.co/rest/v1/') && route.request().method() !== 'GET') return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  if (u.includes('supabase.co/rest/v1/')) { const t = u.split('/rest/v1/')[1].split('?')[0]; return J(DADOS[t] || []); }
  if (u.includes('supabase.co/auth/v1/user')) return J({ id: 'u1', email: 'ana@exemplo.com', user_metadata: {} });
  if (u.includes('workers.dev') || u.includes('/admin') || u.includes('/beta')) return J({ ok: true, txs: [] });
  return route.continue();
});
await p.goto('http://localhost:8993/');
await p.waitForTimeout(2200);

const abas = ['dashboard', 'adicionar', 'analises', 'lancamentos', 'limites', 'metas', 'fixas', 'cartoes', 'dividas', 'racha', 'ia'];
let total = 0;
for (const aba of abas) {
  const r = await p.evaluate(async (a) => {
    const btn = [...document.querySelectorAll('.tab-btn')].find(x => x.dataset.tab === a);
    if (btn) btn.click();
    await new Promise(r => setTimeout(r, 400));
    const saida = [];
    // Container com overflow-x auto/scroll foi FEITO pra rolar — conteúdo
    // passando da borda ali é o comportamento correto, não defeito. Sem esta
    // exceção o teste acusa a barra de dias, que é um carrossel de propósito.
    const dentroDeRolavel = (el) => {
      for (let p = el.parentElement; p; p = p.parentElement) {
        const ox = getComputedStyle(p).overflowX;
        if (ox === 'auto' || ox === 'scroll') return true;
      }
      return false;
    };
    // Transbordo horizontal: filho cuja borda direita passa da do pai por
    // mais de 1px (folga pra arredondamento de subpixel).
    document.querySelectorAll('#content *').forEach(el => {
      const pai = el.parentElement;
      if (!pai) return;
      if (dentroDeRolavel(el)) return;
      const a1 = el.getBoundingClientRect(), a2 = pai.getBoundingClientRect();
      if (a1.width === 0 || a2.width === 0) return;
      const vaza = (a1.right - a2.right);
      if (vaza > 1) {
        saida.push({
          tag: el.tagName.toLowerCase(), id: el.id || '', cls: (el.className || '').toString().slice(0, 40),
          vaza: Math.round(vaza), txt: (el.innerText || '').trim().slice(0, 28)
        });
      }
    });
    // Página inteira não pode rolar pro lado.
    const rolaPagina = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    return { saida, rolaPagina };
  }, aba);
  if (r.saida.length || r.rolaPagina) {
    console.log('\n### aba ' + aba + (r.rolaPagina ? '  [PÁGINA ROLA PRO LADO]' : ''));
    r.saida.forEach(x => { console.log('   vaza ' + x.vaza + 'px  <' + x.tag + '> #' + x.id + ' .' + x.cls + '  "' + x.txt + '"'); total++; });
  }
}
console.log('\n' + (total ? '\u274c ' + total + ' elemento(s) vazando' : '\u2705 nada vazando em nenhuma aba'));
await b.close(); srv.close();
process.exit(total === 0 ? 0 : 1);
