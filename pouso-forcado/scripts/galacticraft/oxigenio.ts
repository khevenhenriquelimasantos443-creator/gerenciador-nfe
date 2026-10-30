import { EntityDamageCause, EquipmentSlot, GameMode, ItemStack, Player, RawMessage, system, world } from "@minecraft/server";
import { DADOS_F26 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { intervalo } from "../util/perfil.js";

/*
 * Oxigênio e gravidade na Lua (Galacticraft). Os números são os do Galacticraft:
 * - tanques de 900, 1.800 e 2.700 de oxigênio; o jogador gasta 1 a cada 9 ticks (um tanque leve dura 6 min 45 s);
 * - para respirar precisa da Máscara (cabeça), do Equipamento (peito) e de um tanque com oxigênio no inventário
 *   (o primeiro que tiver; com dois, dura o dobro);
 * - sem oxigênio: 2 de dano a cada 100 ticks (5 s);
 * - gravidade da Lua: 0,062 a menos que os 0,08 do jogo (pulo bem mais alto, queda lenta). O Bedrock não deixa
 *   mudar a gravidade, então vem por efeitos: Super Pulo III e Queda Lenta (que também evita o dano de queda).
 * A névoa preta (RP/fogs/lua.json) faz o horizonte escuro de espaço.
 * Custo: a cada 18 ticks, para cada jogador na Lua, lê o equipamento e o inventário.
 */
export const LUA = "cl:lua";
const TANQUES: Readonly<Record<string, number>> = DADOS_F26.tanques;
const MASCARA = "cl:mascara_oxigenio";
const EQUIPAMENTO = "cl:equipamento_oxigenio";
const PASSO = 18; // ticks entre as checagens (gasta 2 de oxigênio: 1 a cada 9 ticks)
const DANO = { valor: 2, intervalo: 100 };
const NEVOA = "cl_lua";

export const capacidadeTanque = (id: string): number | undefined => TANQUES[id];
export const oxigenioDe = (i: ItemStack): number => (i.getDynamicProperty("cl:o2") as number | undefined) ?? 0;
export function gravarOxigenio(i: ItemStack, n: number): void {
  const cap = TANQUES[i.typeId] ?? 0;
  i.setDynamicProperty("cl:o2", n);
  i.setLore([`§7Oxigênio: ${Math.round(n)}/${cap}`]);
}

/** Tem máscara, equipamento e algum tanque com oxigênio? (para o aviso antes de lançar) */
export function prontoParaLua(j: Player): boolean {
  const eq = j.getComponent("minecraft:equippable");
  if (eq?.getEquipment(EquipmentSlot.Head)?.typeId !== MASCARA || eq.getEquipment(EquipmentSlot.Chest)?.typeId !== EQUIPAMENTO) return false;
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv) return false;
  for (let s = 0; s < inv.size; s++) {
    const i = inv.getItem(s);
    if (i && TANQUES[i.typeId] && oxigenioDe(i) > 0) return true;
  }
  return false;
}

/** Bolhas dos Distribuidores (atualizadas pelo tick deles; somem se o distribuidor parar de responder). */
export const bolhas = new Map<string, { dim: string; x: number; y: number; z: number; r: number; t: number }>();
function naBolha(j: Player): boolean {
  const { x, y, z } = j.location;
  for (const [k, b] of bolhas) {
    if (system.currentTick - b.t > 60) {
      bolhas.delete(k);
      continue;
    }
    if (b.dim === j.dimension.id && (x - b.x) ** 2 + (y + 1 - b.y) ** 2 + (z - b.z) ** 2 <= b.r * b.r) return true;
  }
  return false;
}
const dentroDaBolha = new Set<string>();

/** Jogadores dentro do foguete (na viagem não gastam oxigênio, como no Galacticraft). */
export const semRespirar = new Set<string>();
const restante = new Map<string, number>(); // oxigênio somado dos tanques, para o painel
const ultimoDano = new Map<string, number>();

function semAr(j: Player, msg: RawMessage): void {
  restante.set(j.id, 0);
  const t = ultimoDano.get(j.id) ?? -Infinity;
  if (system.currentTick - t < DANO.intervalo) return;
  ultimoDano.set(j.id, system.currentTick);
  j.applyDamage(DANO.valor, { cause: EntityDamageCause.drowning }); // "suffocation" o jogo ignora fora de um bloco
  aviso(j, msg, 4);
}

function respirar(j: Player): void {
  if (naBolha(j)) {
    dentroDaBolha.add(j.id);
    ultimoDano.delete(j.id);
    return;
  }
  dentroDaBolha.delete(j.id);
  const eq = j.getComponent("minecraft:equippable");
  const cabeca = eq?.getEquipment(EquipmentSlot.Head)?.typeId, peito = eq?.getEquipment(EquipmentSlot.Chest)?.typeId;
  if (cabeca !== MASCARA) return semAr(j, { translate: "cl.gc.sem_equipamento", with: { rawtext: [{ translate: `item.${MASCARA}.name` }] } });
  if (peito !== EQUIPAMENTO) return semAr(j, { translate: "cl.gc.sem_equipamento", with: { rawtext: [{ translate: `item.${EQUIPAMENTO}.name` }] } });
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv) return;
  let gastar = PASSO / 9;
  let total = 0;
  for (let s = 0; s < inv.size; s++) {
    const i = inv.getItem(s);
    if (!i || !TANQUES[i.typeId]) continue;
    let o2 = oxigenioDe(i);
    if (gastar > 0 && o2 > 0) {
      const tira = Math.min(o2, gastar);
      o2 -= tira;
      gastar -= tira;
      gravarOxigenio(i, o2);
      inv.setItem(s, i);
    }
    total += o2;
  }
  if (gastar > 0) return semAr(j, { translate: "cl.gc.sem_ar" });
  ultimoDano.delete(j.id);
  restante.set(j.id, total);
  const segundos = Math.floor((total * 9) / 20);
  if (segundos <= 30) aviso(j, { translate: "cl.gc.pouco_ar", with: [String(segundos)] }, 1);
}

/** Linha do painel (hud.ts) para quem está na Lua: oxigênio e quanto tempo dura. */
export function painelLua(j: Player): RawMessage {
  if (dentroDaBolha.has(j.id)) return { rawtext: [{ translate: "cl.gc.ox_rotulo" }, { text: " §a" }, { translate: "cl.gc.na_bolha" }] };
  const o2 = restante.get(j.id) ?? 0;
  const s = Math.floor((o2 * 9) / 20);
  const cor = s <= 30 ? "§c" : s <= 120 ? "§e" : "§b";
  return { rawtext: [{ translate: "cl.gc.ox_rotulo" }, { text: ` ${cor}${Math.round(o2)} §7(${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")})` }] };
}

function nevoa(j: Player, naLua: boolean): void {
  try {
    j.runCommand(`fog @s remove ${NEVOA}`);
    if (naLua) j.runCommand(`fog @s push cl:lua ${NEVOA}`);
  } catch {
    // sem o comando
  }
}

export function registrarOxigenio(): void {
  intervalo("oxigênio", () => {
    for (const j of world.getPlayers()) {
      if (j.dimension.id !== LUA) continue;
      j.addEffect("jump_boost", PASSO + 22, { amplifier: 2, showParticles: false });
      j.addEffect("slow_falling", PASSO + 22, { amplifier: 0, showParticles: false });
      const modo = j.getGameMode();
      if (modo === GameMode.Creative || modo === GameMode.Spectator || semRespirar.has(j.id)) continue;
      respirar(j);
    }
  }, PASSO);
  world.afterEvents.playerDimensionChange.subscribe(({ player, toDimension }) => {
    system.run(() => player.isValid && nevoa(player, toDimension.id === LUA));
  });
  world.afterEvents.playerSpawn.subscribe(({ player }) => {
    system.runTimeout(() => player.isValid && nevoa(player, player.dimension.id === LUA), 20);
  });
  world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    restante.delete(playerId);
    ultimoDano.delete(playerId);
  });
}
