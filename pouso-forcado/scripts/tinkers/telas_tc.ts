import { Entity, system, world } from "@minecraft/server";
import { intervalo } from "../util/perfil.js";

/*
 * 1.56.0 deu às mesas do Tinkers uma tela de espaços (entidade invisível em cima da mesa); a 1.58.0 voltou aos menus.
 * Aqui some com essas entidades nos mundos que passaram pela 1.56/1.57: o que o jogador tinha posto nos espaços de
 * entrada cai no chão; as prévias (as peças e ferramentas que só apareciam para pegar, guardadas em cl:tc_prev) e os
 * enfeites (cl:gui_*) não. Os itens de enfeite jogados no chão também somem.
 * Custo: uma busca por jogador a cada 5 s.
 */
const ENTS = ["cl:mesa_tc_pecas", "cl:mesa_tc_estacao", "cl:mesa_tc_bigorna"];

function desmontar(m: Entity): void {
  const c = m.getComponent("minecraft:inventory")?.container;
  let prev: Record<string, unknown> = {};
  try {
    const v = m.getDynamicProperty("cl:tc_prev");
    if (typeof v === "string") prev = JSON.parse(v) as Record<string, unknown>;
  } catch {
    prev = {};
  }
  if (c)
    for (let s = 0; s < c.size; s++) {
      const i = c.getItem(s);
      if (!i || i.typeId.startsWith("cl:gui_") || prev[String(s)]) continue;
      m.dimension.spawnItem(i, m.location);
    }
  c?.clearAll();
  m.remove();
}

export function registrarLimpezaTelasTinkers(): void {
  intervalo("limpeza das telas do tinkers", () => {
    for (const j of world.getPlayers())
      for (const m of j.dimension.getEntities({ families: ["mesa_tc"], location: j.location, maxDistance: 48 }))
        if (ENTS.includes(m.typeId)) desmontar(m);
  }, 100);
  world.afterEvents.entitySpawn.subscribe(({ entity }) => {
    if (entity.typeId !== "minecraft:item") return;
    try {
      if (entity.getComponent("minecraft:item")?.itemStack.typeId.startsWith("cl:gui_")) system.run(() => entity.isValid && entity.remove());
    } catch {
      // já sumiu
    }
  });
}
