import { Entity, ItemStack, system, world } from "@minecraft/server";
import { registrarNoCatalogo, Receita } from "../catalogo/catalogo.js";
import { DADOS_F42 } from "../conteudo/gerado.js";
import { registrarAcao } from "../missoes/progresso.js";
import { cabe, contar, entrada, entregar, gastarCE, tirar } from "../util/maquina.js";
import { intervalo } from "../util/perfil.js";
import { feito, maquina } from "../maquinas/thermal.js";

/*
 * Applied Energistics 2 de hoje (1.22.0): o Inscritor, o Carregador e o Fluix feito na água, com as receitas do mod
 * (DADOS_F42, de tools/importar-ae2.py). Como as outras máquinas: baú de cima = entrada, de baixo = saída, energia da
 * rede. As prensas caem nos meteoros (scripts/mundo/extras.ts põe um baú com uma no meio da cratera).
 */
type Inscricao = { cima: string | null; meio: string; baixo: string | null; prensa: boolean; sai: [string, number] };
const D = DADOS_F42 as unknown as { inscritor: Inscricao[]; carregar: { entra: string; sai: string }[]; agua: { entra: string[]; sai: [string, number] }[]; prensas: string[] };
// As receitas com mais itens primeiro (o processador antes do circuito, o circuito antes do pó).
const INSCRITOR = [...D.inscritor].sort((a, b) => Number(!!b.cima) + Number(!!b.baixo) - (Number(!!a.cima) + Number(!!a.baixo)));
const PRENSAS = new Set(D.prensas);

export const inscritor = maquina((b) => {
  const ent = entrada(b);
  if (!ent || !cabe(b)) return "parada";
  for (const r of INSCRITOR) {
    const precisa = new Map<string, number>();
    for (const id of [r.cima, r.meio, r.baixo]) if (id) precisa.set(id, (precisa.get(id) ?? 0) + 1);
    if ([...precisa].some(([id, n]) => contar(ent, id) < n)) continue;
    if (!gastarCE(b, 100)) return "sem_energia";
    // No modo "prensa" o de cima e o de baixo se gastam; no de "inscrever" a prensa de cima fica.
    tirar(ent, r.meio);
    if (r.baixo) tirar(ent, r.baixo);
    if (r.cima && (r.prensa || !PRENSAS.has(r.cima))) tirar(ent, r.cima);
    entregar(b, [new ItemStack(r.sai[0], r.sai[1])]);
    feito(b, "random.anvil_land");
    const j = b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];
    if (j && r.sai[0] === "cl:processador_basico") registrarAcao(j, "ae2_logico");
    return "ok";
  }
  return "parada";
}, "cl.ae2.inscritor");

export const carregador = maquina((b) => {
  const ent = entrada(b);
  if (!ent || !cabe(b)) return "parada";
  const r = D.carregar.find((x) => contar(ent, x.entra) > 0);
  if (!r) return "parada";
  if (!gastarCE(b, 80)) return "sem_energia";
  tirar(ent, r.entra);
  entregar(b, [new ItemStack(r.sai, 1)]);
  feito(b, "random.orb");
  return "ok";
}, "cl.ae2.carregador");

// ---------- Fluix na água ----------
const PRINCIPAL = new Set(D.agua.map((r) => r.entra[0]));
const vigiados = new Map<string, number>(); // item no chão → até quando olhar
const pilha = (e: Entity) => e.getComponent("minecraft:item")?.itemStack;
function naAgua(e: Entity): boolean {
  const b = e.dimension.getBlock(e.location);
  return !!b && (b.typeId === "minecraft:water" || b.typeId === "minecraft:flowing_water");
}
function transformar(): void {
  for (const [id, ate] of vigiados) {
    const e = world.getEntity(id);
    if (!e?.isValid || system.currentTick > ate) {
      vigiados.delete(id);
      continue;
    }
    if (!naAgua(e)) continue;
    const perto = e.dimension.getEntities({ type: "minecraft:item", location: e.location, maxDistance: 1.5 });
    for (const r of D.agua) {
      const usados: Entity[] = [];
      for (const ing of r.entra) {
        const x = perto.find((p) => !usados.includes(p) && pilha(p)?.typeId === ing);
        if (x) usados.push(x);
      }
      if (usados.length < r.entra.length) continue;
      const dim = e.dimension, onde = e.location; // o próprio item principal também some
      for (const u of usados) {
        const p = pilha(u)!;
        if (p.amount > 1) {
          const resto = p.clone();
          resto.amount -= 1;
          u.dimension.spawnItem(resto, u.location);
        }
        u.remove();
      }
      dim.spawnItem(new ItemStack(r.sai[0], r.sai[1]), onde);
      dim.spawnParticle("minecraft:totem_particle", onde);
      const j = dim.getPlayers({ location: onde, maxDistance: 16, closest: 1 })[0];
      if (j && r.sai[0] === "cl:cristal_fluix") registrarAcao(j, "ae2_fluix");
      vigiados.delete(id);
      break;
    }
  }
}

export function registrarAE2(): void {
  // Só os itens principais (Certus Carregado) são vigiados, por 60 s depois de cair no chão.
  world.afterEvents.entitySpawn.subscribe(({ entity }) => {
    if (entity.typeId !== "minecraft:item") return;
    system.run(() => {
      const p = entity.isValid ? pilha(entity) : undefined;
      if (p && PRINCIPAL.has(p.typeId)) vigiados.set(entity.id, system.currentTick + 1200);
    });
  });
  intervalo("ae2_agua", () => vigiados.size && transformar(), 20);
  registrarNoCatalogo(() => {
    const r: Receita[] = [];
    const m = (id: string) => ({ maquina: { translate: `tile.${id}.name` }, maquinaId: id });
    for (const x of D.inscritor)
      r.push({ ...m("cl:inscritor"), entradas: [x.cima, x.meio, x.baixo].filter((i): i is string => !!i).map((item) => ({ item, qtd: 1 })), saidas: [{ item: x.sai[0], qtd: x.sai[1] }] });
    for (const x of D.carregar) r.push({ ...m("cl:carregador_ae"), entradas: [{ item: x.entra, qtd: 1 }], saidas: [{ item: x.sai, qtd: 1 }] });
    for (const x of D.agua) r.push({ maquina: { translate: "cl.ae2.fluix" }, entradas: x.entra.map((item) => ({ item, qtd: 1 })), saidas: [{ item: x.sai[0], qtd: x.sai[1] }], nota: { text: "água" } });
    return r;
  });
}
