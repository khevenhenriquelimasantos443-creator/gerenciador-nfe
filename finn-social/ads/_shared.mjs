// Pedaços compartilhados entre os geradores de anúncio pago (finn-social/ads/*):
// paleta, fonte e a marca (logo real do Finn + "Finn."), pra feed e stories
// nunca terem uma logo diferente uma da outra por engano.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DIR = path.dirname(fileURLToPath(import.meta.url));

// Logo oficial: finn-icon/icon.svg (o mesmo usado no ícone do app/PWA).
// É SVG inline — nunca rasterizar pra PNG aqui, senão desfoca em qualquer
// tamanho que não seja o exato em que foi exportado.
// O SVG original tem width/height="1024" fixos (bons pro ícone do app, que
// é sempre exportado nesse tamanho exato) — aqui ele entra num contêiner de
// tamanho variável, então os dois primeiros atributos viram 100% pra
// preencher o pai em vez de vazar por cima do resto do cartão.
export const ICON_SVG = fs.readFileSync(path.join(DIR, '../../finn-icon/icon.svg'), 'utf8')
  .replace('width="1024" height="1024"', 'width="100%" height="100%"');

export const CREME = '#F8F7F4';
export const NAVY = '#0F172A';
export const LARANJA = '#F97316';
export const CINZA_CLARO = '#64748B';
export const CINZA_ESCURO = '#94A3B8';
export const FONTE = "Arial, 'Liberation Sans', Helvetica, sans-serif";

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const titulo = (h) => esc(h).replace(/\|([^|]+)\|/g, '<i>$1</i>');

// tam = lado do quadrado da logo em px; fonte = tamanho do texto "Finn." ao lado.
export function marca({ x = 96, y = 64, tam = 72, fonte = 30 } = {}) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;display:flex;align-items:center;gap:16px">
    <div style="width:${tam}px;height:${tam}px;flex:none">${ICON_SVG}</div>
    <div style="font-size:${fonte}px;font-weight:700;color:#fff">Finn<span style="color:${LARANJA}">.</span></div>
  </div>`;
}

export function chipsHtml(itens, { fonte = 29, altura = 78 } = {}) {
  return itens.map(([e, rot]) => `<div style="height:${altura}px;display:inline-flex;align-items:center;gap:12px;
    padding:0 28px;border-radius:15px;background:#1D2436;border:1px solid rgba(255,255,255,.12);
    font-size:${fonte}px;font-weight:700;color:#fff;box-shadow:0 6px 16px rgba(0,0,0,.18)">${esc(e)} ${esc(rot)}</div>`).join('');
}

export async function colisoes(p) {
  return p.evaluate(() => {
    const alvos = [...document.querySelectorAll('h1, p, div')]
      .filter((el) => el.children.length === 0 && (el.textContent || '').trim())
      .map((el) => ({ nome: el.tagName.toLowerCase() + ':' + (el.textContent || '').slice(0, 18), r: el.getBoundingClientRect() }))
      .filter((x) => x.r.height > 0);
    const out = [];
    for (let i = 0; i < alvos.length; i++) for (let j = i + 1; j < alvos.length; j++) {
      const a = alvos[i].r, c = alvos[j].r;
      const dx = Math.min(a.right, c.right) - Math.max(a.left, c.left);
      const dy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
      if (dx > 2 && dy > 2) out.push(`${alvos[i].nome} x ${alvos[j].nome} (${Math.round(dy)}px)`);
    }
    return out;
  });
}
