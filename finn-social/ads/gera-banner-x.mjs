// Foto de capa (header) do perfil do X — 1500x500 (proporção 3:1, tamanho
// recomendado pelo X). O avatar redondo do perfil fica sobreposto no canto
// inferior esquerdo da capa, então essa área fica livre de texto/logo aqui.
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { NAVY, LARANJA, CINZA_ESCURO, FONTE, esc, colisoes } from './_shared.mjs';

const W = 1500, H = 500;

const html = `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:${NAVY};font-family:${FONTE};
       -webkit-font-smoothing:antialiased;position:relative;overflow:hidden}
  .glow{position:absolute;right:-200px;top:-260px;width:820px;height:820px;border-radius:50%;
    background:radial-gradient(circle,rgba(249,115,22,.30) 0%,rgba(249,115,22,0) 68%)}
  .glow2{position:absolute;left:-160px;bottom:-260px;width:560px;height:560px;border-radius:50%;
    background:radial-gradient(circle,rgba(249,115,22,.14) 0%,rgba(249,115,22,0) 70%)}
  .dots{position:absolute;left:0;top:0;width:100%;height:100%;opacity:.4;
    background-image:radial-gradient(rgba(255,255,255,.06) 1.6px, transparent 1.6px);
    background-size:26px 26px}
  h1{font-weight:800;letter-spacing:-.01em;color:#fff}
  h1 i{font-style:normal;color:${LARANJA}}
</style>
<div class="glow"></div>
<div class="glow2"></div>
<div class="dots"></div>

<!-- Fica livre o canto inferior esquerdo (~340x340px): é onde o avatar
     redondo do perfil se sobrepõe na capa, no layout do X. -->
<h1 style="position:absolute;right:80px;top:150px;width:760px;text-align:right;font-size:52px;line-height:1.15">Seu dinheiro, <i>no controle</i>.</h1>
<p style="position:absolute;right:80px;top:260px;width:760px;text-align:right;font-size:24px;color:${CINZA_ESCURO}">App financeiro brasileiro, com plano grátis</p>
`;

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await p.setContent(html, { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);
const ruins = await colisoes(p);
console.log(ruins.length ? 'COLISÕES: ' + ruins.join(' | ') : 'sem colisões');
const saida = path.join(path.dirname(fileURLToPath(import.meta.url)), 'banner-x-perfil.png');
await p.screenshot({ path: saida });
await b.close();
console.log('gerado:', saida);
