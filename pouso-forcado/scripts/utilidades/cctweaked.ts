import { Block, BlockCustomComponent, Dimension, ItemStack, Player, system, Vector3 } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { DADOS_F58 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler } from "../util/dados.js";
import { abrirUmMenu } from "../util/menus.js";

/*
 * 1.39.0: CC: Tweaked 1.121, sem Lua:
 * - Monitor: tocar abre um campo de texto; o texto aparece grande na frente da tela (um nome flutuante; "|" quebra a
 *   linha). Quebrar o monitor apaga o texto.
 * - Impressora: com papel e tinta (corante preto ou bolsa de tinta) no inventário, imprime uma Página Impressa com
 *   título e texto (gasta 1 papel e 1 tinta). Agachado com couro na mão, junta até 16 páginas num Livro Impresso.
 * - Alto-falante: tocar toca a nota e sobe meio tom (25 notas, como o bloco musical); agachado troca o instrumento (os 16
 *   do jogo). Com redstone ligando, toca sozinho.
 */
const INST = DADOS_F58.instrumentos as readonly string[];
const FRENTE: Record<string, Vector3> = { north: { x: 0, y: 0, z: -1 }, south: { x: 0, y: 0, z: 1 }, east: { x: 1, y: 0, z: 0 }, west: { x: -1, y: 0, z: 0 } };

// ---------- Monitor ----------
function lugarDoTexto(b: Block): Vector3 {
  const f = FRENTE[(b.permutation.getState("minecraft:cardinal_direction") as string | undefined) ?? "north"] ?? FRENTE.north;
  return { x: b.x + 0.5 + f.x * 0.6, y: b.y + 0.05, z: b.z + 0.5 + f.z * 0.6 };
}
function apagarTexto(dim: Dimension, onde: Vector3): void {
  for (const e of dim.getEntities({ type: "cl:texto_monitor", location: onde, maxDistance: 1.2 })) e.remove();
}
export function escreverMonitor(b: Block, texto: string): void {
  const onde = lugarDoTexto(b);
  apagarTexto(b.dimension, onde);
  gravar("monitor", b, texto || undefined);
  if (!texto) return;
  const e = b.dimension.spawnEntity("cl:texto_monitor", onde);
  e.nameTag = texto.split("|").map((l) => l.trim()).join("\n");
}
export const monitorComp: BlockCustomComponent = {
  onPlayerInteract({ block, player }) {
    if (!player) return;
    abrirUmMenu(player, async () => {
      const r = await new ModalFormData()
        .title({ translate: "cl.cc.monitor_titulo" })
        .textField({ translate: "cl.cc.monitor_texto" }, "", { defaultValue: ler<string>("monitor", block, "") })
        .show(player);
      if (r.canceled || !r.formValues || !block.isValid) return;
      escreverMonitor(block, String(r.formValues[0] ?? "").slice(0, 200));
      registrarAcao(player, "cct_monitor");
    });
  },
  onPlayerBreak({ block, dimension }) {
    gravar("monitor", block, undefined);
    for (const f of Object.values(FRENTE)) apagarTexto(dimension, { x: block.x + 0.5 + f.x * 0.6, y: block.y + 0.05, z: block.z + 0.5 + f.z * 0.6 });
  },
};

// ---------- Impressora ----------
const TINTAS = ["minecraft:black_dye", "minecraft:ink_sac"];
function gastar(j: Player, ids: string[]): boolean {
  const c = j.getComponent("minecraft:inventory")?.container;
  if (!c) return false;
  for (let s = 0; s < c.size; s++) {
    const it = c.getItem(s);
    if (!it || !ids.includes(it.typeId)) continue;
    if (it.amount > 1) {
      it.amount--;
      c.setItem(s, it);
    } else c.setItem(s, undefined);
    return true;
  }
  return false;
}
function tem(j: Player, ids: string[]): boolean {
  const c = j.getComponent("minecraft:inventory")?.container;
  if (!c) return false;
  for (let s = 0; s < c.size; s++) if (ids.includes(c.getItem(s)?.typeId ?? "")) return true;
  return false;
}
export function imprimir(j: Player, titulo: string, texto: string): boolean {
  if (!tem(j, ["minecraft:paper"]) || !tem(j, TINTAS)) {
    aviso(j, "cl.cc.sem_papel", 3);
    return false;
  }
  gastar(j, ["minecraft:paper"]);
  gastar(j, TINTAS);
  const p = new ItemStack("cl:pagina_impressa", 1);
  if (titulo) p.nameTag = titulo.slice(0, 40);
  p.setLore(texto.split("|").map((l) => `§7${l.trim().slice(0, 50)}`).slice(0, 12));
  const sobra = j.getComponent("minecraft:inventory")?.container?.addItem(p);
  if (sobra) j.dimension.spawnItem(sobra, j.location);
  j.playSound("block.click");
  registrarAcao(j, "cct_impressora");
  return true;
}
/** Agachado com couro: junta as páginas do inventário (até 16) num livro com o título de cada uma. */
export function encadernar(j: Player): boolean {
  const c = j.getComponent("minecraft:inventory")?.container;
  if (!c || !tem(j, ["minecraft:leather"])) return false;
  const titulos: string[] = [];
  for (let s = 0; s < c.size && titulos.length < 16; s++) {
    const it = c.getItem(s);
    if (it?.typeId !== "cl:pagina_impressa") continue;
    titulos.push(it.nameTag ?? `${titulos.length + 1}`);
    c.setItem(s, undefined);
  }
  if (titulos.length < 2) return false;
  gastar(j, ["minecraft:leather"]);
  const livro = new ItemStack("cl:livro_impresso", 1);
  livro.setLore(titulos.map((t, i) => `§7${i + 1}. ${t}`));
  const sobra = c.addItem(livro);
  if (sobra) j.dimension.spawnItem(sobra, j.location);
  return true;
}
export const impressoraComp: BlockCustomComponent = {
  onPlayerInteract({ player }) {
    if (!player) return;
    if (player.isSneaking && encadernar(player)) return;
    abrirUmMenu(player, async () => {
      const r = await new ModalFormData()
        .title({ translate: "cl.cc.impressora_titulo" })
        .textField({ translate: "cl.cc.impressora_nome" }, "")
        .textField({ translate: "cl.cc.impressora_texto" }, "")
        .show(player);
      if (r.canceled || !r.formValues) return;
      imprimir(player, String(r.formValues[0] ?? ""), String(r.formValues[1] ?? ""));
    });
  },
};

// ---------- Alto-falante ----------
type Som = { i: number; n: number; ligado?: boolean };
function tocar(b: Block, s: Som): void {
  b.dimension.playSound(`note.${INST[s.i]}`, { x: b.x + 0.5, y: b.y + 0.5, z: b.z + 0.5 }, { pitch: Math.pow(2, (s.n - 12) / 12), volume: 1 });
  b.dimension.spawnParticle("minecraft:note_particle", { x: b.x + 0.5, y: b.y + 1.2, z: b.z + 0.5 });
}
export const altoFalanteComp: BlockCustomComponent = {
  onPlayerInteract({ block, player }) {
    const s = ler<Som>("som", block, { i: 0, n: 12 });
    if (player?.isSneaking) s.i = (s.i + 1) % INST.length;
    else s.n = (s.n + 1) % 25;
    gravar("som", block, s);
    tocar(block, s);
    if (player) player.onScreenDisplay.setActionBar({ translate: "cl.cc.nota", with: { rawtext: [{ translate: `cl.cc.inst.${INST[s.i]}` }, { text: String(s.n) }] } });
  },
  onTick({ block }) {
    let ligado = (block.getRedstonePower() ?? 0) > 0;
    for (const v of ligado ? [] : [block.above(), block.below(), block.north(), block.south(), block.east(), block.west()])
      if ((v?.getRedstonePower() ?? 0) > 0) {
        ligado = true;
        break;
      }
    const s = ler<Som>("som", block, { i: 0, n: 12 });
    if (ligado === !!s.ligado) return;
    s.ligado = ligado;
    gravar("som", block, s);
    if (ligado) tocar(block, s);
  },
};

export function registrarCcTweaked(): void {
  // Teste no servidor: scriptevent cl:teste_cct <monitor x y z texto|imprimir titulo|texto|livro>.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_cct" || !(j instanceof Player)) return;
    const [acao, ...resto] = message.split(" ");
    let r: unknown = "?";
    if (acao === "monitor") {
      const [x, y, z, ...txt] = resto;
      const b = j.dimension.getBlock({ x: Number(x), y: Number(y), z: Number(z) });
      if (b) escreverMonitor(b, txt.join(" "));
      r = b && j.dimension.getEntities({ type: "cl:texto_monitor", location: lugarDoTexto(b), maxDistance: 1.2 }).map((e) => e.nameTag);
    }
    if (acao === "imprimir") {
      const [t, x] = resto.join(" ").split("#");
      r = imprimir(j, t, x ?? "");
    }
    if (acao === "livro") r = encadernar(j);
    console.warn(`[teste_cct] ${acao} ${JSON.stringify(r)}`);
  });
}
