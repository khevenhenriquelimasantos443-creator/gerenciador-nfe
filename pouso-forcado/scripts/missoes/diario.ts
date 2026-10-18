import { Player, RawMessage, system, world } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { IDS, PROPS } from "../config.js";
import { cidadeMaisProxima } from "../mundo/cidade.js";
import { MISSOES } from "./lista.js";
import { avancar, conferir, contar, darItens, feitoAtual, lerEstado, missaoAtual, textoPilhas } from "./progresso.js";

/*
 * Diário de Bordo: item que abre o menu de missões. Cada jogador recebe um ao entrar
 * pela primeira vez; se perder, faz outro (graveto + areia, receita sem formato).
 * Custo: eventos de colocar/quebrar/matar só leem uma dynamic property; a cada 2 s,
 * um olhar no inventário de cada jogador quando a missão atual é do tipo "ter".
 */

const abertos = new Set<string>(); // evita abrir dois menus se o jogador tocar várias vezes

// Monstros comuns, para o caso de a entidade já não responder a matches() depois de morrer.
const MONSTROS = new Set([
  "minecraft:zombie", "minecraft:husk", "minecraft:zombie_villager_v2", "minecraft:drowned", "minecraft:skeleton",
  "minecraft:stray", "minecraft:bogged", "minecraft:spider", "minecraft:cave_spider", "minecraft:creeper",
  "minecraft:slime", "minecraft:witch", "minecraft:enderman", "minecraft:phantom", "minecraft:silverfish",
]);

export function entregarDiario(jogador: Player): void {
  if (jogador.getDynamicProperty(PROPS.diarioRecebido)) return;
  jogador.setDynamicProperty(PROPS.diarioRecebido, true);
  darItens(jogador, [{ item: IDS.diarioBordo, quantidade: 1 }]);
  jogador.sendMessage({ rawtext: [{ text: "§6[Diário de Bordo]§r " }, { translate: "cl.diario.recebido" }] });
}

function corpoMissao(jogador: Player): RawMessage | undefined {
  const e = lerEstado(jogador);
  const m = missaoAtual(e);
  if (!m) return undefined;
  const feito = feitoAtual(jogador, e, m.objetivo);
  return {
    rawtext: [
      { translate: "cl.diario.numero", with: [String(e.i + 1), String(MISSOES.length)] },
      { text: "\n\n§l§e" },
      { translate: `cl.missao.${m.id}.titulo` },
      { text: "§r\n" },
      { translate: `cl.missao.${m.id}.desc` },
      { text: "\n\n" },
      { translate: "cl.diario.progresso", with: [String(feito), String(m.objetivo.qtd)] },
      { text: "\n" },
      { translate: "cl.diario.recompensa" },
      { text: " " },
      textoPilhas(m.recompensa),
      ...dicaDaMissao(jogador, m.id),
    ],
  };
}

/** Missões de achar cidade: mostra onde está o sinal mais próximo. */
function dicaDaMissao(jogador: Player, id: string): RawMessage[] {
  if (id !== "cidade") return [];
  const c = cidadeMaisProxima(jogador.location.x, jogador.location.z);
  if (!c) return [];
  return [{ text: "\n\n" }, { translate: "cl.diario.sinal_cidade", with: [String(Math.round(c.x)), String(Math.round(c.z)), String(Math.round(c.distancia))] }];
}

async function mostrarConcluidas(jogador: Player): Promise<void> {
  const e = lerEstado(jogador);
  const linhas: RawMessage[] = [];
  for (let k = 0; k < e.i && k < MISSOES.length; k++) {
    const pulada = e.p.includes(k);
    linhas.push({ text: pulada ? "§7- " : "§a+ §r" }, { translate: `cl.missao.${MISSOES[k].id}.titulo` });
    if (pulada) linhas.push({ text: " " }, { translate: "cl.diario.pulada" });
    linhas.push({ text: "§r\n" });
  }
  if (linhas.length === 0) linhas.push({ translate: "cl.diario.nenhuma" });
  await new ActionFormData()
    .title({ translate: "cl.diario.concluidas" })
    .body({ rawtext: linhas })
    .button({ translate: "cl.diario.voltar" })
    .show(jogador);
}

async function confirmarPulo(jogador: Player): Promise<void> {
  const r = await new MessageFormData()
    .title({ translate: "cl.diario.pular" })
    .body({ translate: "cl.diario.pular_aviso" })
    .button1({ translate: "cl.diario.pular_sim" })
    .button2({ translate: "cl.diario.voltar" })
    .show(jogador);
  if (r.selection === 0 && missaoAtual(lerEstado(jogador))) avancar(jogador, true);
}

async function abrirDiario(jogador: Player): Promise<void> {
  conferir(jogador); // se já cumpriu uma missão "ter", conclui antes de mostrar
  const corpo = corpoMissao(jogador);
  const form = new ActionFormData()
    .title({ translate: "cl.diario.titulo" })
    .body(corpo ?? { translate: "cl.diario.todas" })
    .button({ translate: "cl.diario.concluidas" });
  if (corpo) form.button({ translate: "cl.diario.pular" });
  form.button({ translate: "cl.diario.fechar" });

  const r = await form.show(jogador);
  if (r.canceled || r.selection === undefined) return;
  if (r.selection === 0) {
    await mostrarConcluidas(jogador);
    return abrirDiario(jogador);
  }
  if (corpo && r.selection === 1) await confirmarPulo(jogador);
}

export function registrarMissoes(): void {
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack.typeId !== IDS.diarioBordo || abertos.has(source.id)) return;
    abertos.add(source.id);
    abrirDiario(source)
      .catch((erro) => console.warn(`[Pouso Forçado] diário: ${erro}`))
      .finally(() => abertos.delete(source.id));
  });

  world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    const id = block.typeId;
    contar(player, "colocar", (o) => o.tipo === "colocar" && o.bloco === id);
  });

  world.afterEvents.playerBreakBlock.subscribe(({ player, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    contar(player, "quebrar", (o) => o.tipo === "quebrar" && o.bloco === id);
  });

  world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {
    const matador = damageSource.damagingEntity;
    if (!(matador instanceof Player)) return;
    const tipo = deadEntity.typeId;
    let ehDaFamilia = (familia: string): boolean => familia === "monster" && MONSTROS.has(tipo);
    try {
      const familiaOk = (familia: string) => deadEntity.matches({ families: [familia] });
      familiaOk("monster"); // testa se a entidade ainda responde
      ehDaFamilia = familiaOk;
    } catch {
      // usa a lista fixa
    }
    contar(matador, "matar", (o) => o.tipo === "matar" && ehDaFamilia(o.familia));
  });

  system.runInterval(() => {
    for (const jogador of world.getPlayers()) conferir(jogador);
  }, 40);
}
