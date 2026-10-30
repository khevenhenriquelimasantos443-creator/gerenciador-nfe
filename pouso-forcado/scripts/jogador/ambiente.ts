import { BlockVolume, Difficulty, EntityDamageCause, EquipmentSlot, GameMode, ItemStack, Player, system, world } from "@minecraft/server";
import { AR, CAMEL, FOLHAS, IDS, MUNDO_PLANO, PROPS, SEDE, TEMPERATURA, TEMPESTADE } from "../config.js";
import { tempestadeAtiva } from "../mundo/tempestade.js";
import { registrarAcao as registrarAcaoAmbiente } from "../missoes/progresso.js";
import { intervalo } from "../util/perfil.js";
import { desidratacao, lerSede, mudarSede } from "./sede.js";
import { lerTemperatura, mudarTemperatura } from "./temperatura.js";

/*
 * O "tracker" do EnviroMine: a cada 30 ticks (1,5 s), para cada jogador no sobrevivência,
 * 1) temperatura do ar: dia 50 °C, noite ÷ 9 (deserto), sombra −14, água −5, dormindo +5, correndo +2,
 *    calor da terra no subsolo, armadura, e a maior fonte de calor por perto (lava, fogo, tocha...);
 * 2) o corpo anda em direção ao ar (TEMPERATURA.velocidade); suar (≥ 38,02 °C) gasta água e, com a
 *    hidratação ≥ 75, esfria; acima de 37 °C e fora do sol o corpo esfria rápido (TEMPERATURA.velocidade.descidaQuente);
 * 3) hidratação: perde SEDE.porAtualizacao (base + seco + seco de dia + suor + correr + efeito Fome);
 *    a água salgada desidrata (−1 por atualização); o Camel Pack devolve +1 por atualização;
 * 4) qualidade do ar: regenera com céu; no subsolo cai perto de lava, fogo e tochas; cai também ao ar
 *    livre na tempestade de areia; a máscara de gás gasta carga para manter o ar em 100;
 * 5) efeitos: insolação/hipotermia I-II-III, congelamento, sede, falta de ar.
 * Custo: por jogador, 1 getTopmostBlock por atualização e uma busca de blocos de calor/ar num cubo
 * 9×5×9 a cada 2 atualizações (só os tipos da lista, feita pelo jogo).
 */
const TICKS = 30;
const T = TEMPERATURA;
const efeito = (j: Player, id: string, nivel = 0, ticks = 200) => j.addEffect(id, ticks, { amplifier: nivel, showParticles: false });

type Varredura = { fonte: number; perdaAr: number; folhas: number; lavaPerto: boolean };
const ultimaVarredura = new Map<string, Varredura>();
const contagem = new Map<string, number>();
const TIPOS_BUSCA = [...new Set([...Object.keys(T.fontes), ...Object.keys(AR.fontes), ...FOLHAS])];

/** Procura fontes de calor, fumaça e folhas em volta (o jogo filtra os tipos; só lemos os achados). */
function varrer(j: Player): Varredura {
  const { x, y, z } = j.location;
  const r = T.raioFontes;
  const v: Varredura = { fonte: -Infinity, perdaAr: 0, folhas: 0, lavaPerto: false };
  const lista = j.dimension.getBlocks(new BlockVolume({ x: x - r.h, y: y - r.v, z: z - r.h }, { x: x + r.h, y: y + r.v, z: z + r.h }), { includeTypes: TIPOS_BUSCA }, true);
  for (const p of lista.getBlockLocationIterator()) {
    const tipo = j.dimension.getBlock(p)?.typeId ?? "";
    if (FOLHAS.includes(tipo)) {
      v.folhas++;
      continue;
    }
    let calor = T.fontes[tipo];
    if (tipo === "minecraft:campfire" || tipo === "minecraft:soul_campfire") {
      if (j.dimension.getBlock(p)?.permutation.getState("extinguished" as never)) calor = 0;
    }
    if (tipo === IDS.gerador && !(j.dimension.getBlock(p)?.permutation.getState("cl:combustivel" as never) as unknown as number)) calor = 0;
    const d2 = (p.x + 0.5 - x) ** 2 + (p.y + 0.5 - y) ** 2 + (p.z + 0.5 - z) ** 2;
    if (calor) v.fonte = Math.max(v.fonte, calor * (1 - d2 / T.quedaDistancia));
    if ((AR.fontes[tipo] ?? 0) < v.perdaAr && calor !== 0) v.perdaAr = AR.fontes[tipo];
    if (tipo.includes("lava") && d2 <= 25) v.lavaPerto = true;
  }
  return v;
}

const ehDia = (): boolean => {
  const t = world.getTimeOfDay();
  return t < 12500 || t > 23500;
};

/** Profundidade "do EnviroMine": o mundo plano tem a superfície em y 45; lá ela fica em 64. */
const yDoEnviromine = (y: number) => y - MUNDO_PLANO.superficieY + 64;

function temperaturaDoAr(j: Player, ceu: boolean, v: Varredura): { ar: number; rapido: boolean } {
  const dia = ehDia();
  let ar = dia ? T.ar.dia : T.ar.dia / T.ar.noiteDivisor;
  const yE = yDoEnviromine(j.location.y);
  if (yE <= 48) ar += T.geotermico * (1 - Math.max(0, yE) / 48);
  if (dia && !ceu) ar += T.ar.sombra;
  if (j.isInWater) ar += T.ar.agua;
  if (j.isSleeping) ar += T.ar.dormindo;
  if (j.isSprinting) ar += T.ar.correndo;
  // Armadura: [noite, sombra, sol]
  const k = !dia ? 0 : ceu ? 2 : 1;
  const roupa = j.getComponent("minecraft:equippable");
  let mult = 1, soma = 0;
  for (const slot of [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet]) {
    const id = roupa?.getEquipment(slot)?.typeId ?? "";
    const mat = Object.keys(T.armadura).find((m) => id.startsWith(`minecraft:${m}_`));
    if (!mat) continue;
    mult += T.armadura[mat].mult[k] - 1;
    soma += T.armadura[mat].soma[k];
  }
  ar = ar * mult + soma;
  let rapido = false;
  if (v.fonte > ar) {
    rapido = v.fonte > ar + T.velocidade.fonteForte;
    ar = (ar + v.fonte) / 2;
  }
  if (j.getComponent("minecraft:onfire")) ar = Math.max(ar, T.ar.chamasMin);
  return { ar, rapido };
}

function passoDoCorpo(j: Player, ar: number, rapido: boolean): void {
  const corpo = lerTemperatura(j);
  const delta = ar - corpo;
  if (Math.abs(delta) < 0.0001) return;
  let vel: number;
  if (delta > 0) {
    vel = T.velocidade.subidaSeco * (rapido ? T.velocidade.fonteForte : 1); // o deserto todo é "bioma seco"
    if (j.isSprinting) vel = Math.max(vel, T.velocidade.correndoMin);
    if (j.getComponent("minecraft:onfire")) vel = T.velocidade.chamas;
  } else vel = j.isInWater ? T.velocidade.descidaAgua : corpo > T.normal ? T.velocidade.descidaQuente : T.velocidade.descida;
  const amp = Math.abs(delta) > 10 ? Math.abs(delta) / 10 : 1;
  mudarTemperatura(j, Math.sign(delta) * Math.min(Math.abs(delta), vel * amp));
}

// ---------- Camel Pack e máscara ----------
const numeroDe = (item: ItemStack, chave: string, padrao: number): number => {
  const v = item.getDynamicProperty(chave);
  return typeof v === "number" ? v : padrao;
};
export const aguaDoCamel = (item: ItemStack): number => numeroDe(item, "cl:agua", 0);
export const cargaDaMascara = (item: ItemStack): number => numeroDe(item, "cl:carga", AR.mascaraCarga);

export function gravarCamel(item: ItemStack, agua: number): void {
  item.setDynamicProperty("cl:agua", agua);
  item.setLore([`§bÁgua: ${Math.round(agua)}/${CAMEL.capacidade}`]);
}
export function gravarMascara(item: ItemStack, carga: number): void {
  item.setDynamicProperty("cl:carga", carga);
  item.setLore([`§7Filtro: ${Math.round(carga)}/${AR.mascaraCarga}`]);
}

/**
 * O Camel Pack em uso: na mão secundária (o "espaço só dele", deixando o peitoral livre) ou vestido
 * no peito. Devolve o item e uma função que grava a mudança de volta no mesmo lugar.
 */
export function acharCamel(j: Player): { pack: ItemStack; gravar: (agua: number) => void } | undefined {
  const roupa = j.getComponent("minecraft:equippable");
  if (!roupa) return undefined;
  for (const slot of [EquipmentSlot.Offhand, EquipmentSlot.Chest]) {
    const pack = roupa.getEquipment(slot);
    if (pack?.typeId !== IDS.camelPack) continue;
    return {
      pack,
      gravar: (agua) => {
        gravarCamel(pack, Math.max(0, Math.min(CAMEL.capacidade, agua)));
        roupa.setEquipment(slot, pack);
      },
    };
  }
  return undefined;
}

function beberDoCamel(j: Player): void {
  const camel = acharCamel(j);
  if (!camel) return;
  const agua = aguaDoCamel(camel.pack);
  if (agua <= 0 || lerSede(j) > SEDE.max - 1 - CAMEL.porAtualizacao) return;
  mudarSede(j, CAMEL.porAtualizacao);
  if (lerTemperatura(j) >= 37.1) mudarTemperatura(j, -CAMEL.esfria);
  camel.gravar(agua - CAMEL.porAtualizacao);
}

// ---------- ar ----------
export function lerAr(j: Player): number {
  const v = j.getDynamicProperty(PROPS.ar);
  return typeof v === "number" ? v : 100;
}

function passoDoAr(j: Player, ceu: boolean, v: Varredura): number {
  let ar = lerAr(j);
  const perto = ceu || yDoEnviromine(j.location.y) > 48;
  if (ceu && tempestadeAtiva()) ar += AR.tempestade;
  else if (perto) ar += AR.regen;
  else ar += v.perdaAr * AR.fracaoSolida + v.folhas * AR.folha;
  ar = Math.max(0, Math.min(100, ar));
  // Máscara de gás: mantém o ar em 100 gastando a carga.
  const roupa = j.getComponent("minecraft:equippable");
  const mascara = roupa?.getEquipment(EquipmentSlot.Head);
  if (roupa && mascara?.typeId === IDS.mascara && ar < 100) {
    const carga = cargaDaMascara(mascara);
    if (carga > 0) {
      const gasto = Math.min(carga, 100 - ar);
      ar += gasto;
      gravarMascara(mascara, carga - gasto);
      roupa.setEquipment(EquipmentSlot.Head, mascara);
    }
  }
  j.setDynamicProperty(PROPS.ar, Math.round(ar * 100) / 100);
  return ar;
}

// ---------- congelamento ----------
function lerCongelamento(j: Player): { nivel: number; tempo: number } {
  const v = j.getDynamicProperty(PROPS.congelamento);
  if (typeof v !== "string") return { nivel: 0, tempo: 0 };
  const [n, t] = v.split(":").map(Number);
  return { nivel: n || 0, tempo: t || 0 };
}
export const nivelCongelamento = (j: Player): number => lerCongelamento(j).nivel;

function soltarDaMao(j: Player): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const p = inv?.getItem(j.selectedSlotIndex);
  if (!inv || !p) return;
  inv.setItem(j.selectedSlotIndex, undefined);
  j.dimension.spawnItem(p, j.location);
  j.sendMessage({ translate: "cl.temp.dedos" });
}

// ---------- efeitos ----------
function efeitos(j: Player, corpo: number, ar: number, sede: number, arAmbiente: number, v: Varredura, n: number): void {
  const [i1, i2, i3] = T.insolacao, [h1, h2, h3] = T.hipotermia;
  if (corpo >= i1) efeito(j, "slowness");
  if (corpo >= i2) {
    efeito(j, "weakness");
    efeito(j, "mining_fatigue");
    efeito(j, "hunger");
    if (Math.random() < 0.1) efeito(j, "nausea");
  }
  if (corpo >= i3 && Math.random() < 0.5) j.applyDamage(T.danoExtremo, { cause: EntityDamageCause.temperature });
  if (corpo >= 45 && v.lavaPerto) j.setOnFire(10, true);
  if (corpo <= h1) efeito(j, "slowness");
  if (corpo <= h2) {
    efeito(j, "weakness");
    efeito(j, "mining_fatigue");
  }
  if (corpo <= h3 && Math.random() < 0.5) j.applyDamage(T.danoExtremo, { cause: EntityDamageCause.freezing });

  // Congelamento: tempo no frio (ar ≤ 10 e corpo ≤ 35, ou corpo ≤ 30); o nível só sai com maçã dourada.
  const c = lerCongelamento(j);
  const frio = (arAmbiente <= T.congelamento.arMax && corpo <= T.congelamento.corpoMax) || corpo <= T.congelamento.corpoSempre;
  const tempo = frio ? c.tempo + 1 : Math.max(0, c.tempo - 1);
  const nivel = Math.max(c.nivel, tempo >= T.congelamento.nivel2 ? 2 : tempo >= T.congelamento.nivel1 ? 1 : 0);
  if (nivel !== c.nivel) j.sendMessage({ translate: nivel === 2 ? "cl.temp.pernas" : "cl.temp.dormentes" });
  if (nivel !== c.nivel || tempo !== c.tempo) j.setDynamicProperty(PROPS.congelamento, nivel || tempo ? `${nivel}:${tempo}` : undefined);
  if (nivel === 1) {
    efeito(j, "slowness", 2);
    if (Math.random() < T.congelamento.chanceSoltar) soltarDaMao(j);
  }
  if (nivel === 2) efeito(j, "slowness", 6);

  if (sede < SEDE.fracaAbaixoDe) {
    efeito(j, "weakness");
    efeito(j, "mining_fatigue");
    efeito(j, "slowness");
  }
  if (sede <= 0) j.applyDamage(SEDE.danoEmZero, { cause: EntityDamageCause.starve });

  if (ar <= AR.lento) {
    const nivelAr = ar <= AR.muitoLento ? 1 : 0;
    efeito(j, "slowness", nivelAr);
    efeito(j, "mining_fatigue", nivelAr);
  }
  if (ar <= 0) j.applyDamage(AR.danoEmZero, { cause: EntityDamageCause.drowning }); // "suffocation" o jogo ignora fora de um bloco
  if (n % 20 === 0 && (corpo >= i2 || corpo <= h2 || sede < SEDE.fracaAbaixoDe || ar <= AR.muitoLento)) j.playSound("note.bass", { volume: 0.4 });
}

/** A última temperatura do ar calculada de cada jogador (para o painel). */
export const arDoJogador = new Map<string, number>();

function atualizar(j: Player): void {
  const n = (contagem.get(j.id) ?? 0) + 1;
  contagem.set(j.id, n);
  const { x, y, z } = j.location;
  const topo = j.dimension.getTopmostBlock({ x, z });
  const ceu = !topo || topo.y < Math.floor(y + 1);
  let v = ultimaVarredura.get(j.id);
  if (!v || n % 2 === 0) {
    v = varrer(j);
    ultimaVarredura.set(j.id, v);
  }
  const { ar: arAmbiente, rapido } = temperaturaDoAr(j, ceu, v);
  arDoJogador.set(j.id, arAmbiente);
  passoDoCorpo(j, arAmbiente, rapido);

  // Hidratação
  let corpo = lerTemperatura(j);
  const p = SEDE.porAtualizacao;
  let perda = p.base + p.seco + (ehDia() ? p.secoDia : 0);
  const suando = corpo >= T.suor.aPartirDe;
  if (suando) perda += p.suor;
  if (j.isSprinting) perda += p.correndo;
  if (j.getEffect("hunger")) perda += p.efeitoFome;
  if (tempestadeAtiva()) perda *= TEMPESTADE.sedeMultiplicador;
  const desid = desidratacao(j);
  if (desid > 0) {
    perda += 1;
    j.setDynamicProperty(PROPS.desidrata, desid > 1 ? desid - 1 : undefined);
  }
  mudarSede(j, -perda);
  if (suando && lerSede(j) >= T.suor.hidratacaoMin) mudarTemperatura(j, -T.suor.esfria);
  beberDoCamel(j);

  const ar = passoDoAr(j, ceu, v);
  corpo = lerTemperatura(j);
  efeitos(j, corpo, ar, lerSede(j), arAmbiente, v, n);
}

export function registrarAmbiente(): void {
  intervalo("enviromine", () => {
    if (world.getDifficulty() === Difficulty.Peaceful) return;
    for (const j of world.getPlayers({ excludeGameModes: [GameMode.Creative, GameMode.Spectator] })) {
      if (j.dimension.id !== "minecraft:overworld") continue;
      try {
        atualizar(j);
      } catch {
        // chunk em volta ainda carregando
      }
    }
  }, TICKS);

  world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) player.setDynamicProperty(PROPS.ar, undefined);
  });
  // Encher o Camel Pack: agachado, vestindo o pack, use uma Água Boa (só água limpa, como no EnviroMine).
  world.beforeEvents.itemUse.subscribe((ev) => {
    const { source: j, itemStack } = ev;
    if (itemStack.typeId !== IDS.aguaBoa || !j.isSneaking) return;
    const antes = acharCamel(j);
    if (!antes || aguaDoCamel(antes.pack) > CAMEL.capacidade - CAMEL.porGarrafa) return; // bebe normalmente
    ev.cancel = true;
    system.run(() => {
      const camel = acharCamel(j);
      if (!camel) return;
      const agua = aguaDoCamel(camel.pack);
      const inv = j.getComponent("minecraft:inventory")?.container;
      const mao = inv?.getItem(j.selectedSlotIndex);
      if (!inv || mao?.typeId !== IDS.aguaBoa) return;
      if (mao.amount === 1) inv.setItem(j.selectedSlotIndex, new ItemStack("minecraft:bowl", 1));
      else {
        mao.amount--;
        inv.setItem(j.selectedSlotIndex, mao);
        inv.addItem(new ItemStack("minecraft:bowl", 1));
      }
      camel.gravar(agua + CAMEL.porGarrafa);
      j.playSound("bucket.fill_water");
      j.sendMessage({ translate: "cl.camel.encheu", with: [String(agua + CAMEL.porGarrafa), String(CAMEL.capacidade)] });
      registrarAcaoAmbiente(j, "camel_encher");
    });
  });
  // Filtro: usar com a máscara vestida recarrega 500.
  world.afterEvents.itemUse.subscribe(({ itemStack, source: j }) => {
    if (itemStack.typeId !== IDS.filtro) return;
    const roupa = j.getComponent("minecraft:equippable");
    const mascara = roupa?.getEquipment(EquipmentSlot.Head);
    if (!roupa || mascara?.typeId !== IDS.mascara) return j.sendMessage({ translate: "cl.mascara.sem_mascara" });
    const carga = cargaDaMascara(mascara);
    if (carga >= AR.mascaraCarga) return j.sendMessage({ translate: "cl.mascara.cheia" });
    const inv = j.getComponent("minecraft:inventory")?.container;
    const mao = inv?.getItem(j.selectedSlotIndex);
    if (!inv || mao?.typeId !== IDS.filtro) return;
    if (mao.amount === 1) inv.setItem(j.selectedSlotIndex, undefined);
    else {
      mao.amount--;
      inv.setItem(j.selectedSlotIndex, mao);
    }
    gravarMascara(mascara, Math.min(AR.mascaraCarga, carga + AR.filtroCarga));
    roupa.setEquipment(EquipmentSlot.Head, mascara);
    j.playSound("armor.equip_iron");
    j.sendMessage({ translate: "cl.mascara.recarregou", with: [String(Math.min(AR.mascaraCarga, carga + AR.filtroCarga)), String(AR.mascaraCarga)] });
  });
  world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source }) => {
    // Maçã dourada cura o congelamento (como no EnviroMine).
    if (itemStack.typeId === "minecraft:golden_apple" || itemStack.typeId === "minecraft:enchanted_golden_apple") {
      source.setDynamicProperty(PROPS.congelamento, undefined);
    }
  });
}

