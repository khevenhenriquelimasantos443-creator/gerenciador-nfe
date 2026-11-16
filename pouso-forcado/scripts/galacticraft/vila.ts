import { BlockVolume, Dimension, Player, system, world } from "@minecraft/server";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { rng, sementeDe, sementeDoMundo } from "../util/aleatorio.js";
import { intervalo } from "../util/perfil.js";
import { alturaTerreno, areaComSuperficie, dimensaoLua, pedirSuperficie } from "./lua.js";
import { LUA } from "./oxigenio.js";
import { VILA_LUA } from "./vila_lua_dados.js";

/*
 * 1.55.0: a Vila Lunar e as Ruínas Lunares do Galacticraft 5 (licença MIT), com as peças do mod montadas fora do jogo
 * (tools/gerar-vila-lunar.py: 4 vilas e 3 ruínas diferentes).
 * Onde, como no mod (random_spread do jogo): uma vila por região de 34×34 chunks e uma ruína por região de 32×32,
 * num chunk sorteado pela semente do mundo, a pelo menos 8 chunks da região do lado. Nenhuma das duas cai em cima da
 * Base de Pesquisa Lunar, e a ruína não cai em cima de uma vila.
 * Quando: a área é preparada (carregada e com a superfície feita) quando alguém chega a PREPARAR blocos, e a vila é
 * posta de uma vez: o chão da área fica plano na altura do meio, entram as peças (estruturas de 64×64) e os Aldeões
 * Lunares (no máximo 10, pelo celular). Se alguém pisar na área antes de ela existir, ela não é mais posta (para não
 * apagar o que o jogador fez lá). Custo: só a construção, uma vez por lugar; depois, uma conta por segundo.
 */
type Tipo = "vila" | "ruina";
/** A Base de Pesquisa Lunar (lida direto da propriedade, para não importar base.ts, que importa este arquivo). */
function baseHistoria(): { x: number; z: number } | undefined {
  const v = world.getDynamicProperty("cl:base_lua");
  if (typeof v !== "string") return undefined;
  try {
    const b = JSON.parse(v) as { x: number; z: number };
    return { x: b.x, z: b.z };
  } catch {
    return undefined;
  }
}
type Sitio = { tipo: Tipo; chave: string; x: number; z: number; v: number; x1: number; z1: number; x2: number; z2: number };
const CFG = {
  vila: { chunks: 34, sal: 0x6d6f6f6e, preparar: 230, aviso: 320, perto: 48 },
  ruina: { chunks: 32, sal: 0x72756e61, preparar: 170, aviso: 220, perto: 20 },
} as const;
const SEPARACAO = 8;
const MAX_ALDEOES = 10;
const AREA = "cl_sitio_lua";

// ---------- Onde ----------
/** O lugar com a área (em blocos) da variante v, centrado em (x, z). */
function montar(tipo: Tipo, chave: string, x: number, z: number, v: number): Sitio {
  if (tipo === "vila") {
    const d = VILA_LUA.vilas[v];
    const x1 = x - d.centro[0], z1 = z - d.centro[2];
    return { tipo, chave, x, z, v, x1, z1, x2: x1 + d.tam[0] - 1, z2: z1 + d.tam[2] - 1 };
  }
  const ps = VILA_LUA.ruinas[v];
  return {
    tipo, chave, x, z, v,
    x1: x + Math.min(...ps.map((p) => p.x)), z1: z + Math.min(...ps.map((p) => p.z)),
    x2: x + Math.max(...ps.map((p) => p.x + p.tam[0] - 1)), z2: z + Math.max(...ps.map((p) => p.z + p.tam[2] - 1)),
  };
}
// Os lugares já calculados nesta sessão (null = nenhum na região); refeitos quando a Base de Pesquisa aparece.
const cacheSitios = new Map<string, Sitio | null>();
let cacheComBase = false;
function sitio(tipo: Tipo, rx: number, rz: number): Sitio | undefined {
  const comBase = !!baseHistoria();
  if (comBase !== cacheComBase) {
    cacheSitios.clear();
    cacheComBase = comBase;
  }
  const k = `${tipo}:${rx},${rz}`;
  const c = cacheSitios.get(k);
  if (c !== undefined) return c ?? undefined;
  const s = calcularSitio(tipo, rx, rz);
  cacheSitios.set(k, s ?? null);
  return s;
}
function calcularSitio(tipo: Tipo, rx: number, rz: number): Sitio | undefined {
  const c = CFG[tipo];
  const r = rng(sementeDe(sementeDoMundo(), rx, rz, c.sal));
  const cx = rx * c.chunks + Math.floor(r() * (c.chunks - SEPARACAO));
  const cz = rz * c.chunks + Math.floor(r() * (c.chunks - SEPARACAO));
  const v = Math.floor(r() * (tipo === "vila" ? VILA_LUA.vilas.length : VILA_LUA.ruinas.length));
  const s = montar(tipo, `${tipo}:${rx},${rz}`, cx * 16 + 8, cz * 16 + 8, v);
  const { x, z, x1, z1, x2, z2 } = s;
  const base = baseHistoria();
  if (base && base.x >= x1 - 24 && base.x <= x2 + 24 && base.z >= z1 - 24 && base.z <= z2 + 24) return undefined;
  if (tipo === "ruina") {
    // longe das vilas das regiões em volta
    const R = CFG.vila.chunks * 16;
    for (let dx = -1; dx <= 1; dx++)
      for (let dz = -1; dz <= 1; dz++) {
        const vl = sitio("vila", Math.floor(x / R) + dx, Math.floor(z / R) + dz);
        if (vl && x2 >= vl.x1 - 16 && x1 <= vl.x2 + 16 && z2 >= vl.z1 - 16 && z1 <= vl.z2 + 16) return undefined;
      }
  }
  return s;
}
/** Os lugares das regiões em volta de (x, z). */
function sitiosPerto(tipo: Tipo, x: number, z: number): Sitio[] {
  const R = CFG[tipo].chunks * 16;
  const rx = Math.floor(x / R), rz = Math.floor(z / R);
  const l: Sitio[] = [];
  for (let dx = -1; dx <= 1; dx++)
    for (let dz = -1; dz <= 1; dz++) {
      const s = sitio(tipo, rx + dx, rz + dz);
      if (s) l.push(s);
    }
  return l;
}
/** A vila mais perto de (x, z) (para as ruínas e masmorras não caírem em cima). */
export function vilaPerto(x: number, z: number, folga: number): boolean {
  return sitiosPerto("vila", x, z).some((v) => x >= v.x1 - folga && x <= v.x2 + folga && z >= v.z1 - folga && z <= v.z2 + folga);
}

// ---------- Estado (uma propriedade por lugar) ----------
type Estado = { e: 0 | 1 | 2; a?: boolean }; // e: 0 nada, 1 feito, 2 cancelado; a: já avisado
const prop = (s: Sitio) => `cl:sitio_lua:${s.chave}`;
function ler(s: Sitio): Estado {
  const v = world.getDynamicProperty(prop(s));
  if (typeof v !== "string") return { e: 0 };
  try {
    return JSON.parse(v) as Estado;
  } catch {
    return { e: 0 };
  }
}
const gravar = (s: Sitio, e: Estado) => world.setDynamicProperty(prop(s), JSON.stringify(e));
const dentro = (s: Sitio, x: number, z: number, folga = 0) => x >= s.x1 - folga && x <= s.x2 + folga && z >= s.z1 - folga && z <= s.z2 + folga;

// ---------- Construção ----------
let construindo: string | undefined;
let teste: Sitio | undefined; // /scriptevent cl:teste_vila
let preparando: Sitio | undefined;
let areaAberta = false;

function abrirArea(dim: Dimension, s: Sitio): void {
  pedirSuperficie({ x1: s.x1, z1: s.z1, x2: s.x2, z2: s.z2 });
  if (areaAberta) return;
  const opcoes = { dimension: dim, from: { x: s.x1, y: 0, z: s.z1 }, to: { x: s.x2, y: 120, z: s.z2 } };
  try {
    if (!world.tickingAreaManager.hasCapacity(opcoes)) {
      // Sem vaga para a área inteira: os chunks carregam só quando alguém passa perto (como antes).
      return;
    }
    areaAberta = true;
    world.tickingAreaManager.createTickingArea(AREA, opcoes).catch((e) => {
      areaAberta = false;
      console.warn(`[Pouso Forçado] ${s.chave}: área de carregamento: ${e}`);
    });
  } catch (e) {
    areaAberta = false;
    console.warn(`[Pouso Forçado] ${s.chave}: área de carregamento: ${e}`);
  }
}
function fecharArea(): void {
  pedirSuperficie(undefined);
  preparando = undefined;
  if (!areaAberta) return;
  areaAberta = false;
  try {
    world.tickingAreaManager.removeTickingArea(AREA);
  } catch {
    // já tinha saído
  }
}

/** A altura do chão da vila: a mediana do terreno numa grade 9×9 sobre a área. */
function chao(s: Sitio): number {
  const hs: number[] = [];
  for (let i = 0; i <= 8; i++) for (let k = 0; k <= 8; k++) hs.push(alturaTerreno(s.x1 + ((s.x2 - s.x1) * i) / 8, s.z1 + ((s.z2 - s.z1) * k) / 8));
  hs.sort((a, b) => a - b);
  return hs[Math.floor(hs.length / 2)];
}

// O que o terreno da Lua tem sozinho: o resto (no topo de uma coluna) foi posto por alguém.
const NATURAL = new Set<string>([
  "minecraft:air", "cl:solo_lunar", "cl:terra_lunar", "cl:rocha_lunar", "cl:basalto_lunar", "cl:ardosia_lunar", "minecraft:bedrock",
  "minecraft:barrier", "cl:meteorito", "cl:minerio_cobre_lunar", "cl:minerio_estanho_lunar", "cl:minerio_queijo", "cl:minerio_safira_lunar",
]);
/** A área só tem terreno natural no topo (num mundo de antes da 1.55.0 o jogador pode ter construído ali). */
function* soNatural(dim: Dimension, s: Sitio): Generator<void, boolean, void> {
  for (let cx = Math.floor(s.x1 / 16); cx <= Math.floor(s.x2 / 16); cx++)
    for (let cz = Math.floor(s.z1 / 16); cz <= Math.floor(s.z2 / 16); cz++) {
      for (let x = Math.max(s.x1, cx * 16); x <= Math.min(s.x2, cx * 16 + 15); x += 2)
        for (let z = Math.max(s.z1, cz * 16); z <= Math.min(s.z2, cz * 16 + 15); z += 2) {
          const t = dim.getTopmostBlock({ x, z });
          if (t && !NATURAL.has(t.typeId)) return false;
        }
      yield;
    }
  return true;
}

function* fazerVila(dim: Dimension, s: Sitio): Generator<void, void, void> {
  const d = VILA_LUA.vilas[s.v];
  const H = chao(s);
  // Chão plano: tira o terreno de cima e preenche embaixo, um chunk de cada vez.
  for (let cx = Math.floor(s.x1 / 16); cx <= Math.floor(s.x2 / 16); cx++)
    for (let cz = Math.floor(s.z1 / 16); cz <= Math.floor(s.z2 / 16); cz++) {
      const a = { x: Math.max(s.x1, cx * 16), z: Math.max(s.z1, cz * 16) };
      const b = { x: Math.min(s.x2, cx * 16 + 15), z: Math.min(s.z2, cz * 16 + 15) };
      dim.fillBlocks(new BlockVolume({ x: a.x, y: H + 1, z: a.z }, { x: b.x, y: H + 28, z: b.z }), "minecraft:air");
      dim.fillBlocks(new BlockVolume({ x: a.x, y: H - 12, z: a.z }, { x: b.x, y: H - 1, z: b.z }), "cl:terra_lunar", { blockFilter: { includeTypes: ["minecraft:air"] } });
      dim.fillBlocks(new BlockVolume({ x: a.x, y: H, z: a.z }, { x: b.x, y: H, z: b.z }), "cl:solo_lunar");
      yield;
    }
  for (const [i, k] of d.tiles) {
    world.structureManager.place(`cl:vila_lua_${s.v}_${i}_${k}`, dim, { x: s.x1 + i * 64, y: H - d.centro[1], z: s.z1 + k * 64 });
    yield;
  }
  let n = 0;
  for (const [tipo, ex, ey, ez] of d.ents) {
    if (tipo !== "aldeao" || n >= MAX_ALDEOES) continue;
    try {
      dim.spawnEntity("cl:aldeao_lunar", { x: s.x1 + ex + 0.5, y: H - d.centro[1] + ey, z: s.z1 + ez + 0.5 });
      n++;
    } catch {
      // fora do mundo carregado
    }
  }
}

function* fazerRuina(dim: Dimension, s: Sitio): Generator<void, void, void> {
  VILA_LUA.ruinas[s.v].forEach((p, n) => {
    const x = s.x + p.x, z = s.z + p.z;
    const H = Math.min(alturaTerreno(x, z), alturaTerreno(x + p.tam[0] - 1, z), alturaTerreno(x, z + p.tam[2] - 1), alturaTerreno(x + p.tam[0] - 1, z + p.tam[2] - 1));
    // As peças altas (16 de altura) ficam meio enterradas; as baixas, um pouco.
    const y = H - (p.tam[1] >= 10 ? 8 : 2);
    world.structureManager.place(`cl:ruina_lua_${s.v}_${n}`, dim, { x, y, z });
  });
  yield;
}

function construir(dim: Dimension, s: Sitio): void {
  construindo = s.chave;
  system.runJob(
    (function* () {
      try {
        if (!s.chave.startsWith("teste") && !(yield* soNatural(dim, s))) {
          gravar(s, { ...ler(s), e: 2 }); // tem construção de alguém ali: fica sem
          return;
        }
        yield* s.tipo === "vila" ? fazerVila(dim, s) : fazerRuina(dim, s);
        gravar(s, { ...ler(s), e: 1 });
        console.warn(`[Pouso Forçado] ${s.tipo === "vila" ? "Vila Lunar" : "Ruínas Lunares"} em ${s.x}, ${s.z}`);
      } catch (erro) {
        console.warn(`[Pouso Forçado] ${s.chave}: ${erro}`);
      } finally {
        construindo = undefined;
        fecharArea();
      }
    })(),
  );
}

// ---------- Laço ----------
function avisar(j: Player, s: Sitio): void {
  const dist = Math.round(Math.hypot(s.x - j.location.x, s.z - j.location.z));
  j.sendMessage({ translate: s.tipo === "vila" ? "cl.gc.vila_sinal" : "cl.gc.ruina_sinal", with: [String(s.x), String(s.z), String(dist)] });
}

export function registrarVilaLunar(): void {
  intervalo("lua (vilas e ruínas)", () => {
    const naLua = world.getPlayers().filter((j) => j.dimension.id === LUA);
    if (!naLua.length) {
      if (preparando && !construindo) fecharArea();
      return;
    }
    const dim = dimensaoLua();
    let alvo: Sitio | undefined, dAlvo = Infinity;
    for (const j of naLua) {
      const { x, z } = j.location;
      for (const tipo of ["vila", "ruina"] as const) {
        for (const s of sitiosPerto(tipo, x, z)) {
          const c = CFG[tipo];
          const d = Math.hypot(s.x - x, s.z - z);
          if (d > c.aviso) continue;
          const est = ler(s);
          if (est.e === 0 && construindo !== s.chave && dentro(s, x, z, 6)) {
            // pisou na área antes de ela existir: fica sem (não apaga o que o jogador fez)
            gravar(s, { ...est, e: 2 });
            if (preparando?.chave === s.chave) fecharArea();
            continue;
          }
          if (est.e === 2) continue;
          if (!est.a) {
            avisar(j, s);
            gravar(s, { ...est, a: true });
          }
          if (est.e === 0 && d <= c.preparar && d < dAlvo) {
            alvo = s;
            dAlvo = d;
          }
          if (est.e === 1 && d <= c.perto) {
            const marca = `cl:viu_${s.chave}`;
            if (j.getDynamicProperty(marca) !== true) {
              j.setDynamicProperty(marca, true);
              registrarAcao(j, s.tipo === "vila" ? "vila_lua" : "ruinas_lua");
              if (s.tipo === "vila") aviso(j, "cl.gc.vila_chegou", 6);
            }
          }
        }
      }
    }
    if (construindo) return;
    if (teste) alvo = teste;
    if (preparando && (!alvo || alvo.chave !== preparando.chave)) fecharArea();
    if (!alvo) return;
    preparando = alvo;
    abrirArea(dim, alvo);
    if (!areaComSuperficie(dim, alvo)) return;
    if (alvo === teste) teste = undefined;
    construir(dim, alvo);
  }, 20);
  // Falar com o Aldeão Lunar conta para a missão.
  world.afterEvents.playerInteractWithEntity.subscribe(({ player, target }) => {
    if (target.typeId === "cl:aldeao_lunar") registrarAcao(player, "aldeao_lua");
  });
  // Para os testes no servidor (só com cheats): /scriptevent cl:teste_vila <vila|ruina> <variante> põe ao lado.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_vila" || !(j instanceof Player)) return;
    const [tipo, v, dist] = message.split(" ");
    const t: Tipo = tipo === "ruina" ? "ruina" : "vila";
    // Passa pelo mesmo caminho do jogo: espera a superfície da área e então constrói.
    teste = montar(t, `teste_${t}`, Math.floor(j.location.x) + (Number(dist) || 90), Math.floor(j.location.z), Number(v) || 0);
  });
}
