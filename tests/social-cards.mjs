// Os 43 cartões da campanha são gerados por finn-social/gera-cards.mjs a
// partir de um texto que muda. Texto que cresce estoura a caixa: um título de
// mais uma linha encosta no corpo, um chip a mais sai pela direita, e nada
// disso aparece num teste de string — só quando o post já está publicado.
//
// Aqui a conferência é na imagem mesmo: onde há tinta, e se ela respeita a
// margem. Não compara com um gabarito (o texto mudou de propósito); confere o
// que tem que valer pra qualquer texto futuro.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let falhas = 0;
const ok = (c, nome, extra) => { console.log((c ? '  ok   ' : '  FALHA') + ' ' + nome + (extra !== undefined ? '  — ' + extra : '')); if (!c) falhas++; };

// Lê a caixa de tinta de cada arquivo em Python: a suíte já depende de Pillow
// pra otimizar os PNG, e ler pixel em JS puro exigiria um decodificador.
const SCRIPT = `
import json, sys
from PIL import Image
saida = []
for caminho in sys.argv[1:]:
    im = Image.open(caminho).convert('RGB')
    W, H = im.size
    px = im.load()
    fundo = px[4, H // 2]           # margem esquerda, longe de texto e brilho
    # 200 separa conteúdo de decoração. O brilho laranja radial encosta nas
    # bordas de propósito e chega a ~104 de diferença no ponto mais forte;
    # texto é sempre muito acima disso (cinza do corpo ~275, branco ~686).
    # Com limiar baixo, todo cartão com brilho "vazava" e o teste virava ruído.
    def difere(p):
        return abs(p[0]-fundo[0]) + abs(p[1]-fundo[1]) + abs(p[2]-fundo[2]) > 200
    x0, y0, x1, y1 = W, H, -1, -1
    for y in range(0, H, 2):
        for x in range(0, W, 2):
            if difere(px[x, y]):
                if x < x0: x0 = x
                if x > x1: x1 = x
                if y < y0: y0 = y
                if y > y1: y1 = y
    saida.append({'arq': caminho, 'w': W, 'h': H, 'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1})
print(json.dumps(saida))
`;

function caixas(arquivos) {
  const out = execFileSync('python3', ['-c', SCRIPT, ...arquivos], { maxBuffer: 1 << 24 });
  return JSON.parse(out.toString());
}

// O brilho laranja de fundo encosta nas bordas de propósito — é degradê, não
// conteúdo, e o limiar lá em cima é calibrado pra ignorá-lo.
function confere(grupo, arquivos, { margem, alturaMin }) {
  if (!arquivos.length) { ok(false, grupo + ': nenhum arquivo encontrado'); return; }
  const vazando = [];
  const vazios = [];
  for (const c of caixas(arquivos)) {
    const nome = path.basename(c.arq);
    if (c.x1 < 0) { vazios.push(nome); continue; }
    if (c.x0 < margem || c.x1 > c.w - margem || c.y0 < margem || c.y1 > c.h - margem) {
      vazando.push(`${nome} x[${c.x0},${c.x1}] limite ${margem}..${c.w - margem}; y[${c.y0},${c.y1}] limite ${margem}..${c.h - margem}`);
    }
    if (c.y1 - c.y0 < alturaMin) vazando.push(`${nome} tem pouco conteúdo (${c.y1 - c.y0}px de altura)`);
  }
  ok(vazios.length === 0, grupo + ': todo cartão tem conteúdo', vazios.join(', ') || undefined);
  ok(vazando.length === 0, grupo + ': nada encosta na margem', vazando.length ? '\n      ' + vazando.join('\n      ') : undefined);
}

const posts = Array.from({ length: 20 }, (_, i) => path.join(RAIZ, `finn-serve/social/ig_post_${i + 1}.png`)).filter(fs.existsSync);
const stories = Array.from({ length: 20 }, (_, i) => path.join(RAIZ, `finn-worker/social/ig_story_${i + 1}.jpg`)).filter(fs.existsSync);
const reels = [1, 2, 3].map((n) => path.join(RAIZ, `finn-serve/social/reel${n}_cover.jpg`)).filter(fs.existsSync);

console.log('=== cartões do feed (1080x1080) ===');
ok(posts.length === 20, 'os 20 posts existem', posts.length);
confere('feed', posts, { margem: 40, alturaMin: 700 });

console.log('\n=== stories (1080x1920) ===');
ok(stories.length === 20, 'os 20 stories existem', stories.length);
confere('story', stories, { margem: 40, alturaMin: 1000 });

console.log('\n=== capas de reel ===');
ok(reels.length === 3, 'as 3 capas existem', reels.length);
confere('reel', reels, { margem: 40, alturaMin: 900 });

// O worker do bot serve os stories a partir deste arquivo; se ele ficar pra
// trás, o Instagram publica a arte antiga com o texto errado e a única pista
// seria olhar o story publicado.
console.log('\n=== stories embutidos estão em dia ===');
{
  const js = fs.readFileSync(path.join(RAIZ, 'finn-worker/social-stories.js'), 'utf8');
  const lista = js.split('export const IG_STORIES')[1] || '';
  const embutidos = (lista.match(/"[A-Za-z0-9+/=]{100,}"/g) || []).map((s) => s.slice(1, -1));
  ok(embutidos.length === 20, 'tem 20 stories embutidos', embutidos.length);
  const divergentes = embutidos
    .map((b64, i) => ({ i: i + 1, igual: b64 === fs.readFileSync(stories[i]).toString('base64') }))
    .filter((x) => !x.igual)
    .map((x) => x.i);
  ok(divergentes.length === 0, 'cada um bate com o .jpg do repositório',
     divergentes.length ? 'desatualizados: ' + divergentes.join(', ') + ' — rode node finn-social/gera-cards.mjs' : undefined);
}

console.log('\n' + (falhas === 0 ? '✅ tudo passou' : `❌ ${falhas} falha(s)`));
process.exit(falhas === 0 ? 0 : 1);
