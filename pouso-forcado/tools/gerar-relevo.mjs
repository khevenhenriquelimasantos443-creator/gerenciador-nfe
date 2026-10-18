// Gera as estruturas de relevo do mundo plano (morros pequenos, mesas, rochas)
// e o templo soterrado. O script scripts/mundo/relevo.ts espalha estas peças
// pelos chunks conforme o jogador explora. Use --force para regerar.
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Estrutura, sorte } from "./mcstructure.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const FORCAR = process.argv.includes("--force");
const salvar = (est, nome) => est.salvar(join(RAIZ, `BP/structures/cl/${nome}.mcstructure`), `BP/structures/cl/${nome}.mcstructure`, FORCAR);

const AR = "minecraft:air";
const AREIA = "minecraft:sand";
const ARENITO = "minecraft:sandstone";
const ARENITO_LISO = "minecraft:smooth_sandstone";
const ARENITO_CORTADO = "minecraft:cut_sandstone";
const ARENITO_ENTALHADO = "minecraft:chiseled_sandstone";
const PEDRA = "minecraft:stone";
const TERRACOTA = "minecraft:orange_terracotta";

/**
 * Monte elíptico apoiado no chão (y = 0 é a primeira camada acima do chão plano).
 * assimetria > 1 deixa um lado mais íngreme (como duna de vento).
 */
function monte({ rx, rz, altura, assimetria = 1, nucleo = null, semente = 0 }) {
  const est = new Estrutura(rx * 2 + 1, altura, rz * 2 + 1);
  for (let x = 0; x < est.X; x++) {
    for (let z = 0; z < est.Z; z++) {
      let dx = (x - rx) / rx;
      if (dx > 0) dx *= assimetria;
      const dz = (z - rz) / rz;
      const d2 = dx * dx + dz * dz;
      if (d2 >= 1) continue;
      const ruido = (sorte(x + semente, 0, z) - 50) / 100; // -0,5 .. +0,5
      const h = Math.min(altura, Math.max(0, Math.round(altura * (1 - d2) + ruido)));
      for (let y = 0; y < h; y++) {
        const profundidade = h - 1 - y; // 0 = bloco do topo
        let bloco = AREIA;
        if (nucleo && profundidade >= 2) bloco = sorte(x, y + semente, z) < 20 ? PEDRA : nucleo;
        est.por(x, y, z, bloco);
      }
    }
  }
  return est;
}

// As dunas não são mais estruturas: saem de ruído contínuo em scripts/mundo/dunas.ts.
salvar(monte({ rx: 8, rz: 8, altura: 7, nucleo: ARENITO, semente: 3 }), "morro");

// Mesa: platô de topo plano com faixas de terracota.
{
  const r = 6, altura = 6;
  const est = new Estrutura(r * 2 + 1, altura, r * 2 + 1);
  for (let x = 0; x <= r * 2; x++) {
    for (let z = 0; z <= r * 2; z++) {
      const d = Math.hypot(x - r, z - r) + (sorte(x, 9, z) - 50) / 60;
      if (d > r) continue;
      const h = d > r - 1.5 ? altura - 2 : altura;
      for (let y = 0; y < h; y++) est.por(x, y, z, y === h - 1 ? AREIA : (y === 2 ? TERRACOTA : ARENITO));
    }
  }
  salvar(est, "mesa");
}

// Rochas: três pedregulhos de arenito.
{
  const est = new Estrutura(9, 3, 9);
  for (const [cx, cz, r, h] of [[2, 2, 1.6, 2], [6, 5, 2.2, 3], [2, 7, 1.2, 1]]) {
    for (let x = 0; x < 9; x++) for (let z = 0; z < 9; z++) {
      const d = Math.hypot(x - cx, z - cz);
      if (d > r) continue;
      const altura = d > r - 0.8 ? Math.max(1, h - 1) : h;
      for (let y = 0; y < altura; y++) est.por(x, y, z, sorte(x, y, z) < 35 ? ARENITO_LISO : ARENITO);
    }
  }
  salvar(est, "rochas");
}

// Templo soterrado: pirâmide em degraus, 3 camadas abaixo do chão, com câmara e baú (colocado pelo script).
export const TEMPLO_BAU = { x: 7, y: 1, z: 7 };
{
  const L = 15, A = 11, CHAO = 3; // y = 3 é o nível do chão do mundo
  const est = new Estrutura(L, A, L);
  for (let y = 0; y < A; y++) {
    const m = Math.floor(y / 2);
    for (let x = m; x < L - m; x++) {
      for (let z = m; z < L - m; z++) {
        const borda = x === m || z === m || x === L - 1 - m || z === L - 1 - m;
        let bloco = borda ? (y % 4 === 0 ? TERRACOTA : ARENITO) : ARENITO_CORTADO;
        if (y === A - 1) bloco = ARENITO_ENTALHADO;
        est.por(x, y, z, bloco);
      }
    }
  }
  // Câmara 7x5x7 e piso decorado.
  for (let x = 4; x <= 10; x++) for (let z = 4; z <= 10; z++) {
    est.por(x, 0, z, (x === 7 || z === 7) ? TERRACOTA : ARENITO_LISO);
    for (let y = 1; y <= 5; y++) est.por(x, y, z, AR);
  }
  est.por(7, 0, 7, ARENITO_ENTALHADO);
  for (const [x, z] of [[4, 4], [4, 10], [10, 4], [10, 10]]) for (let y = 1; y <= 5; y++) est.por(x, y, z, ARENITO_ENTALHADO);
  // Entrada pelo lado sul (z alto), no nível do chão, descendo para a câmara.
  for (let z = 11; z < L; z++) for (let x = 6; x <= 8; x++) for (let y = CHAO; y <= CHAO + 2; y++) est.por(x, y, z, AR);
  for (const [z, y] of [[11, 2], [11, 1]]) for (let x = 6; x <= 8; x++) est.por(x, y, z, AR); // degraus
  // Areia acumulada nos degraus de fora (parece meio enterrado).
  for (let y = CHAO; y < A - 2; y++) {
    const m = Math.floor(y / 2);
    for (let x = m; x < L - m; x++) for (let z = m; z < L - m; z++) {
      const borda = x === m || z === m || x === L - 1 - m || z === L - 1 - m;
      if (borda && est.obter(x, y, z) !== AR && sorte(x, y, z) < 22) est.por(x, y, z, AREIA);
    }
  }
  if (est.obter(TEMPLO_BAU.x, TEMPLO_BAU.y, TEMPLO_BAU.z) !== AR) throw new Error("posição do baú do templo não está livre");
  salvar(est, "templo_soterrado");
}
