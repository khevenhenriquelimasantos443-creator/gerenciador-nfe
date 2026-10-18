import { Difficulty, EntityDamageCause, GameMode, ItemStack, Player, system, world } from "@minecraft/server";
import { FRUTA_CACTO_CHANCE, IDS, PROPS, SEDE } from "../config.js";

/*
 * Sede: cada jogador tem SEDE.max pontos de água (dynamic property PROPS.sede).
 * - Cai 1 ponto a cada SEDE.segundosDia (de dia) ou SEDE.segundosNoite (à noite).
 * - Beber/comer o que está em SEDE.bebidas devolve pontos (garrafa de água, leite, fruta do cacto...).
 * - Com menos de SEDE.lentidaoAbaixoDe: lentidão. Com zero: 1 de dano a cada SEDE.danoACadaSegundos.
 * - A barra aparece na barra de ação quando o valor muda e, com pouca água, a cada poucos segundos.
 * - Não roda no criativo, no espectador nem no Pacífico. Ao renascer, volta cheia.
 * Aqui também fica a fruta do cacto (FRUTA_CACTO_CHANCE ao quebrar um cacto), que mata a sede.
 * Custo: 1 leitura de propriedade por jogador por segundo.
 */
const contador = new Map<string, number>(); // segundos desde o último ponto perdido

export function lerSede(jogador: Player): number {
  const v = jogador.getDynamicProperty(PROPS.sede);
  return typeof v === "number" ? v : SEDE.max;
}

function mostrar(jogador: Player, valor: number): void {
  const cheios = Math.ceil(valor / 2);
  const cor = valor <= SEDE.lentidaoAbaixoDe ? "§c" : "§b";
  jogador.onScreenDisplay.setActionBar({
    rawtext: [{ translate: "cl.sede.rotulo" }, { text: ` ${cor}${"|".repeat(cheios)}§8${"|".repeat(10 - cheios)} §f${valor}/${SEDE.max}` }],
  });
}

export function mudarSede(jogador: Player, delta: number): void {
  const antes = lerSede(jogador);
  const depois = Math.max(0, Math.min(SEDE.max, antes + delta));
  if (depois === antes) return;
  jogador.setDynamicProperty(PROPS.sede, depois);
  mostrar(jogador, depois);
}

function ehDia(): boolean {
  const t = world.getTimeOfDay();
  return t < 12500 || t > 23500;
}

export function registrarSede(): void {
  system.runInterval(() => {
    if (world.getDifficulty() === Difficulty.Peaceful) return;
    const intervalo = ehDia() ? SEDE.segundosDia : SEDE.segundosNoite;
    for (const jogador of world.getPlayers({ excludeGameModes: [GameMode.Creative, GameMode.Spectator] })) {
      const s = (contador.get(jogador.id) ?? 0) + 1;
      contador.set(jogador.id, s);
      let valor = lerSede(jogador);
      if (s >= intervalo) {
        contador.set(jogador.id, 0);
        mudarSede(jogador, -1);
        valor = lerSede(jogador);
      }
      if (valor < SEDE.lentidaoAbaixoDe) {
        jogador.addEffect("slowness", 40, { amplifier: 0, showParticles: false });
        if (s % 4 === 0) mostrar(jogador, valor);
      }
      if (valor === 0 && s % SEDE.danoACadaSegundos === 0) {
        jogador.applyDamage(1, { cause: EntityDamageCause.starve });
        jogador.sendMessage({ translate: "cl.sede.morrendo" });
      }
    }
  }, 20);

  world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source }) => {
    const pontos = SEDE.bebidas[itemStack.typeId];
    if (pontos) mudarSede(source, pontos);
  });

  world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) player.setDynamicProperty(PROPS.sede, SEDE.max);
  });

  // Fruta do cacto: às vezes cai ao quebrar um cacto.
  world.afterEvents.playerBreakBlock.subscribe(({ brokenBlockPermutation, block, dimension }) => {
    if (brokenBlockPermutation.type.id !== "minecraft:cactus") return;
    if (Math.random() >= FRUTA_CACTO_CHANCE) return;
    system.run(() => dimension.spawnItem(new ItemStack(IDS.frutaCacto, 1), block.center()));
  });
}
