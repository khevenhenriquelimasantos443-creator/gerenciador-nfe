// Aba Aprender. O ponto mais importante do teste: ela NAO pode ter trava de
// plano — o recurso existe justamente pra quem nao paga.
import { chromium } from 'playwright';
import fs from 'fs'; import http from 'http';
const html = fs.readFileSync(new URL('../finn/index.html', import.meta.url), 'utf8');
const srv = http.createServer((q,r)=>{r.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});r.end(html);}).listen(8992);
let falhas=0;
const ok=(c,n,e)=>{console.log((c?'  ok   ':'  FALHA')+' '+n+(e!==undefined?'  — '+e:''));if(!c)falhas++;};
const hoje=new Date();
const d=n=>{const x=new Date(hoje);x.setDate(x.getDate()-n);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');};
const ym=hoje.getFullYear()+'-'+String(hoje.getMonth()+1).padStart(2,'0');
const TXS=[];
for(let i=0;i<5;i++) TXS.push({id:'t'+i,user_id:'u1',type:'despesa',category:'Alimentação',description:'G'+i,value:50,date:d(i),created_at:d(i)+'T12:00:00Z'});
TXS.push({id:'r1',user_id:'u1',type:'receita',category:'Salário',description:'Salário',value:3000,date:ym+'-05',created_at:ym+'-05T12:00:00Z'});
const DADOS={transactions:TXS,goals:[{id:'g1',user_id:'u1',name:'Reserva',target:6000,saved:1000}],
  spending_limits:[{id:'l1',user_id:'u1',category:'Alimentação',monthly_limit:700}],splits:[]};
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
async function abrir(){
  const p=await b.newPage({viewport:{width:412,height:915}});
  const erros=[]; p.on('pageerror',e=>erros.push(e.message));
  await p.addInitScript(()=>{localStorage.setItem('finn_supa_session',JSON.stringify({access_token:'t',refresh_token:'r',expires_at:Math.floor(Date.now()/1000)+7200,user:{id:'u1',email:'a@x.com',user_metadata:{}}}));});
  await p.route('**/*',async route=>{
    const u=route.request().url(), m=route.request().method();
    const J=o=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(o)});
    if(u.includes('supabase.co/rest/v1/')&&m!=='GET') return route.fulfill({status:200,contentType:'application/json',body:'[]'});
    if(u.includes('supabase.co/rest/v1/')){const t=u.split('/rest/v1/')[1].split('?')[0];return J(DADOS[t]||[]);}
    if(u.includes('supabase.co/auth/v1/user')) return J({id:'u1',email:'a@x.com',user_metadata:{}});
    if(u.includes('workers.dev')||u.includes('/admin')||u.includes('/sheets')||u.includes('/beta')) return J({ok:true,txs:[]});
    return route.continue();
  });
  await p.goto('http://localhost:8992/'); await p.waitForTimeout(2000);
  return {p,erros};
}
console.log('=== aba Aprender ===');
{
  const {p,erros}=await abrir();
  const tem=await p.evaluate(()=>!!document.querySelector('.tab-btn[data-tab="aprender"]'));
  ok(tem,'a aba aparece na navegação');
  await p.evaluate(async()=>{document.querySelector('.tab-btn[data-tab="aprender"]').click();await new Promise(r=>setTimeout(r,400));});
  const idx=await p.evaluate(()=>({txt:document.getElementById('content').innerText,itens:document.querySelectorAll('.apr-item').length}));
  ok(idx.itens===15,'15 lições listadas',idx.itens);
  ok(/grátis pra sempre/i.test(idx.txt),'diz que é grátis');
  ok(/não é recomendação de investimento/i.test(idx.txt),'traz o aviso de que é educativo, não consultoria');

  // Abre uma lição que usa dado real
  await p.evaluate(async()=>{document.querySelector('[data-apr="sobra"]').click();await new Promise(r=>setTimeout(r,400));});
  const lic=await p.evaluate(()=>document.getElementById('content').innerText);
  ok(/O que entra não é o que sobra/.test(lic),'abre a lição');
  ok(/No seu Finn/i.test(lic),'mostra a caixa com os dados da pessoa');
  ok(/R\$ 3\.000,00/.test(lic)&&/R\$ 250,00/.test(lic),'calcula receita e despesa reais',(lic.match(/entraram[^\n]*/)||[])[0]);
  ok(/2\.750,00/.test(lic),'e a sobra',(lic.match(/sobra é[^\n]*/)||[])[0]);

  // Marcar como lida persiste
  await p.evaluate(async()=>{document.getElementById('btnAprLida').click();await new Promise(r=>setTimeout(r,300));});
  const dep=await p.evaluate(()=>document.getElementById('content').innerText);
  ok(/concluída/i.test(dep),'marca como concluída');
  await p.evaluate(async()=>{document.getElementById('btnAprVoltar').click();await new Promise(r=>setTimeout(r,400));});
  const prog=await p.evaluate(()=>({txt:document.getElementById('content').innerText,ok:document.querySelectorAll('.apr-check-ok').length}));
  ok(prog.ok===1,'volta ao índice com 1 lição marcada',prog.ok);
  ok(/1 de 15/.test(prog.txt),'e mostra o progresso',(prog.txt.match(/\d+ de \d+/)||[])[0]);

  // O botão "No seu Finn" leva pra aba certa
  await p.evaluate(async()=>{document.querySelector('[data-apr="metas"]').click();await new Promise(r=>setTimeout(r,400));});
  const temIr=await p.evaluate(()=>!!document.querySelector('[data-aprir]'));
  ok(temIr,'a lição tem botão pra ir na aba relacionada');
  await p.evaluate(async()=>{document.querySelector('[data-aprir]').click();await new Promise(r=>setTimeout(r,400));});
  const abaAtual=await p.evaluate(()=>document.getElementById('content').innerText);
  ok(/meta/i.test(abaAtual),'e leva pra aba certa');
  ok(erros.length===0,'sem erro de JS',erros.join(' | '));
  await p.close();
}
console.log('\n'+(falhas?`❌ ${falhas} falha(s)`:'✅ tudo passou'));
await b.close(); srv.close();
process.exit(falhas?1:0);
