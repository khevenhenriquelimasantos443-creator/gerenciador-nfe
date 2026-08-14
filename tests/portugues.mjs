// Erros de português que chegam ao usuário final.
//
// Existe por causa de "Junta dinheiro pra o que importa", que foi publicado no
// Instagram: "para + o" contrai em "pro", então "pra o" é contração dobrada e
// não existe. Ninguém revisa 20 legendas linha a linha toda vez, mas um teste
// revisa de graça — e este tipo de erro sai caro porque vira imagem, e imagem
// publicada não dá pra editar.
//
// A regra é conservadora de propósito: só pega o que é erro em qualquer
// registro, formal ou falado. "pra um", "pra se inscrever", "pra você" estão
// certos e não podem acusar.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let falhas = 0;
const ok = (c, nome, extra) => { console.log((c ? '  ok   ' : '  FALHA') + ' ' + nome + (extra !== undefined ? '  — ' + extra : '')); if (!c) falhas++; };

const REGRAS = [
  {
    nome: 'contração dobrada "pra o/a/os/as"',
    // para+o=pro, para+a=pra, para+os=pros, para+as=pras. Escrever "pra o" é
    // juntar a contração com o artigo que ela já contém.
    re: /\bpra\s+(os|as|o|a)\b(?!\s*[.,;:!?)])/gi,
    conserto: 'use "pro/pra/pros/pras" (ou escreva "para o/a/os/as" por extenso)',
  },
  {
    nome: 'crase em "à partir"',
    re: /\bà\s+partir\b/gi,
    conserto: 'é "a partir" — nunca leva crase antes de verbo',
  },
  {
    nome: '"mais" no lugar de "mas"',
    re: /\bmais\s+(?:o\s+)?(?:porém|contudo)\b/gi,
    conserto: 'confira se não era "mas"',
  },
  {
    nome: '"a nível de"',
    re: /\ba\s+n[íi]vel\s+de\b/gi,
    conserto: 'use "em nível de" ou reescreva',
  },
  {
    nome: '"onde" para coisa que não é lugar',
    re: /\bonde\s+(?:o\s+)?(?:valor|pre[çc]o|plano|imposto)\b/gi,
    conserto: 'use "em que" / "no qual"',
  },
];

// Só o que o usuário lê: legendas do Instagram, textos das telas e os guias.
// Comentário de código não conta — ali "pra o" nem aparece, e varrer comentário
// só geraria ruído que faria o teste ser ignorado.
const ALVOS = [
  { arq: 'finn-social/copy.cjs', nome: 'roteiro dos posts e legendas do Instagram' },
  { arq: 'finn-serve/build.js', nome: 'páginas servidas pelo worker' },
  { arq: 'finn/index.html', nome: 'app' },
  { arq: 'finn/landing.html', nome: 'landing' },
  { arq: 'finn/guia.html', nome: 'guia de uso' },
  { arq: 'finn/beta.html', nome: 'página do beta' },
  { arq: 'finn-worker/index.js', nome: 'bot do WhatsApp/Telegram' },
];

// Tira comentários de linha e de bloco antes de procurar: o alvo é o texto que
// vai pro usuário, não a explicação escrita pra quem lê o código.
function semComentarios(txt) {
  return txt
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .map((l) => {
      const m = l.match(/^\s*(\/\/|<!--|#)\s/);
      return m ? '' : l;
    })
    .join('\n');
}

console.log('=== português nos textos que o usuário lê ===');
for (const alvo of ALVOS) {
  const caminho = path.join(RAIZ, alvo.arq);
  if (!fs.existsSync(caminho)) { ok(false, alvo.arq + ' existe'); continue; }
  const bruto = fs.readFileSync(caminho, 'utf8');
  const texto = semComentarios(bruto);
  const achados = [];
  for (const regra of REGRAS) {
    for (const m of texto.matchAll(regra.re)) {
      const linha = texto.slice(0, m.index).split('\n').length;
      achados.push(`${alvo.arq}:${linha} "${m[0]}" — ${regra.conserto}`);
    }
  }
  ok(achados.length === 0, alvo.nome + ' (' + alvo.arq + ')', achados.length ? '\n      ' + achados.join('\n      ') : undefined);
}

// Promessa que o produto não cumpre é pior que erro de gramática: some da
// arte só refazendo a imagem, e num app de dinheiro ainda vira problema de
// consumidor. Estas três já foram publicadas — ficam barradas por escrito.
console.log('\n=== nada de promessa que o Finn não cumpre ===');
{
  const PROIBIDO = [
    { re: /100%\s*gr[áa]tis/i, porque: 'Plus e Pro são pagos; use "plano grátis" ou "começa de graça"' },
    { re: /sem\s+plano\s+pago/i, porque: 'existem planos pagos desde o lançamento do Plus/Pro' },
    { re: /(nunca|n[ãa]o)\s+v[êe]\s+(o\s+)?seu\s+extrato/i, porque: 'o worker busca os lançamentos e o banco os guarda' },
    { re: /sem\s+acesso\s+de\s+terceiros/i, porque: 'a Pluggy é um terceiro, e é ela quem conecta o banco' },
    { re: /nada\s+vai\s+pro\s+servidor/i, porque: 'os lançamentos vão, sim — só a leitura do arquivo é local' },
  ];
  for (const alvo of ALVOS) {
    const caminho = path.join(RAIZ, alvo.arq);
    if (!fs.existsSync(caminho)) continue;
    const texto = semComentarios(fs.readFileSync(caminho, 'utf8'));
    const achados = [];
    for (const p of PROIBIDO) {
      const m = texto.match(p.re);
      if (m) achados.push(`"${m[0]}" — ${p.porque}`);
    }
    ok(achados.length === 0, alvo.arq, achados.length ? '\n      ' + achados.join('\n      ') : undefined);
  }
}

// A regra tem que pegar o erro real e deixar o certo em paz. Sem isto, um
// ajuste na regex poderia zerar o teste sem ninguém perceber.
console.log('\n=== a própria regra está calibrada ===');
{
  const pra = REGRAS[0].re;
  const pega = (s) => { pra.lastIndex = 0; return pra.test(s); };
  ok(pega('Junta dinheiro pra o que importa'), 'pega o erro que foi ao ar');
  ok(pega('bom pra a saúde'), 'pega "pra a"');
  ok(pega('serve pra os dois'), 'pega "pra os"');
  ok(!pega('junte dinheiro pra um objetivo'), 'não acusa "pra um"');
  ok(!pega('Link na bio pra se inscrever'), 'não acusa "pra se"');
  ok(!pega('feito pro jeito que o brasileiro vive'), 'não acusa "pro"');
  ok(!pega('sem cartão pra começar'), 'não acusa "pra" + verbo');
}

console.log('\n' + (falhas === 0 ? '✅ tudo passou' : `❌ ${falhas} falha(s)`));
process.exit(falhas === 0 ? 0 : 1);
