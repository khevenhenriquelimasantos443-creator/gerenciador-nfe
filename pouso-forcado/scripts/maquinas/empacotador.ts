import { BlockCustomComponent, ItemStack } from "@minecraft/server";
import { EMPACOTADOR } from "../config.js";
import { registrarNoCatalogo } from "../catalogo/catalogo.js";
import { creditar } from "../blocos/energia.js";
import { aviso } from "../jogador/hud.js";
import { cabe, contar, entrada, entregar, gastarCE, tirar } from "../util/maquina.js";

/*
 * Empacotador Automático (AutoPackager, Fase 18): a cada 5 s compacta até EMPACOTADOR.porCiclo vezes
 * o que estiver no baú de cima (9 lingotes = 1 bloco, 4 areias = 1 arenito...) e põe no baú de baixo.
 * 1.000 RF por compactação.
 */
export const empacotador: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const ent = entrada(b);
    if (!ent) return;
    let feitas = 0;
    for (let k = 0; k < EMPACOTADOR.porCiclo && cabe(b); k++) {
      const r = EMPACOTADOR.receitas.find(([id, n]) => contar(ent, id) >= n);
      if (!r || !gastarCE(b, EMPACOTADOR.ce)) break;
      tirar(ent, r[0], r[1]);
      entregar(b, [new ItemStack(r[2], 1)]);
      feitas++;
      creditar(b, "empacotar");
    }
    if (feitas) b.dimension.playSound("random.click", b.center(), { volume: 0.3, pitch: 0.7 });
  },
  onPlayerInteract(e) {
    if (e.player) aviso(e.player, "cl.ap.parado", 6);
  },
};

export function registrarEmpacotador(): void {
  registrarNoCatalogo(() =>
    EMPACOTADOR.receitas.map(([de, n, para]) => ({
      maquina: { translate: "tile.cl:empacotador.name" },
      maquinaId: "cl:empacotador",
      entradas: [{ item: de, qtd: n }],
      saidas: [{ item: para, qtd: 1 }],
    })),
  );
}
