import { GameMode, Player, system, Vector3, world } from "@minecraft/server";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { particula } from "../util/efeitos.js";
import { intervalo } from "../util/perfil.js";
import { tempestadeAtiva } from "./tempestade.js";

/*
 * Redemoinhos de poeira (1.10.0), os "dust devils" do Weather2: de dia, fora da tempestade de areia, de vez em quando
 * nasce um redemoinho a 24-40 blocos de um jogador na superfície. Ele vaga 45 a 90 s, levanta poeira em espiral e
 * joga para o alto e em volta quem (e o que) chegar a 3 blocos: jogadores, monstros e itens no chão.
 * Um por vez no mundo; tudo por script (partícula cl:poeira), sem entidade.
 * Custo: 6 partículas a cada 2 ticks e uma busca de entidades a cada 10 ticks enquanto houver redemoinho.
 */
const CHANCE = 0.06; // por jogador sorteado, a cada 30 s
const RAIO = 3;
type Redemoinho = { x: number; z: number; y: number; vx: number; vz: number; fim: number; n: number; pegos: Set<string> };
let atual: Redemoinho | undefined;

const dia = () => {
  const t = world.getTimeOfDay();
  return t > 1000 && t < 11500;
};

function nascer(): void {
  if (atual || tempestadeAtiva() || !dia()) return;
  const jogadores = world.getPlayers({ excludeGameModes: [GameMode.Spectator] }).filter((j) => j.dimension.id === "minecraft:overworld");
  if (!jogadores.length || Math.random() >= CHANCE) return;
  const j = jogadores[Math.floor(Math.random() * jogadores.length)];
  const topoJ = j.dimension.getTopmostBlock({ x: j.location.x, z: j.location.z });
  if (!topoJ || j.location.y < topoJ.y - 2) return; // no subsolo não
  const a = Math.random() * Math.PI * 2, d = 24 + Math.random() * 16;
  const x = j.location.x + Math.cos(a) * d, z = j.location.z + Math.sin(a) * d;
  const topo = j.dimension.getTopmostBlock({ x, z });
  if (!topo) return;
  const v = Math.random() * Math.PI * 2;
  atual = { x, z, y: topo.y + 1, vx: Math.cos(v) * 0.08, vz: Math.sin(v) * 0.08, fim: system.currentTick + 900 + Math.floor(Math.random() * 900), n: 0, pegos: new Set() };
}

function andar(r: Redemoinho): void {
  const t = (r.n += 2);
  const dim = world.getDimension("minecraft:overworld");
  if (t % 40 === 0) {
    // Muda um pouco de rumo e segue o chão.
    const v = Math.atan2(r.vz, r.vx) + (Math.random() - 0.5) * 1.2;
    r.vx = Math.cos(v) * 0.08;
    r.vz = Math.sin(v) * 0.08;
  }
  r.x += r.vx * 2;
  r.z += r.vz * 2;
  if (t % 10 === 0) {
    try {
      const topo = dim.getTopmostBlock({ x: r.x, z: r.z });
      if (topo) r.y = topo.y + 1;
    } catch {
      atual = undefined; // saiu da área carregada
      return;
    }
  }
  for (let k = 0; k < 6; k++) {
    const ang = t * 0.5 + (k * Math.PI) / 3;
    const h = (k / 6) * 6 + Math.random();
    const raio = 0.3 + h * 0.3;
    particula(dim, "cl:poeira", { x: r.x + Math.cos(ang) * raio, y: r.y + h, z: r.z + Math.sin(ang) * raio });
  }
  if (t % 10 !== 0) return;
  const centro: Vector3 = { x: r.x, y: r.y + 1, z: r.z };
  for (const e of dim.getEntities({ location: centro, maxDistance: RAIO, excludeFamilies: ["inanimate"] })) {
    const dx = e.location.x - r.x, dz = e.location.z - r.z;
    const n = Math.hypot(dx, dz) || 1;
    // Empurra em volta (tangente) e para cima.
    const tx = -dz / n, tz = dx / n;
    try {
      if (e.typeId === "minecraft:item") e.applyImpulse({ x: tx * 0.25, y: 0.35, z: tz * 0.25 });
      else e.applyKnockback({ x: tx * 0.6, z: tz * 0.6 }, 0.45);
    } catch {
      continue;
    }
    if (e instanceof Player && !r.pegos.has(e.id)) {
      r.pegos.add(e.id);
      aviso(e, "cl.redemoinho.pego", 3);
      registrarAcao(e, "redemoinho");
    }
  }
}

export function registrarRedemoinho(): void {
  intervalo("redemoinho", nascer, 600);
  intervalo("redemoinho", () => {
    const r = atual;
    if (!r) return;
    if (system.currentTick > r.fim || tempestadeAtiva()) {
      atual = undefined;
      return;
    }
    andar(r);
  }, 2);
  // Para os testes no servidor (só com cheats): /scriptevent cl:teste_redemoinho põe um em cima de quem chamou.
  system.afterEvents.scriptEventReceive.subscribe(({ id, sourceEntity: j }) => {
    if (id === "cl:teste_redemoinho" && j instanceof Player) redemoinhoEm(j.location);
  });
}

/** Para os testes: faz nascer um redemoinho em cima de um lugar. */
export function redemoinhoEm(p: Vector3, duracao = 400): void {
  atual = { x: p.x, z: p.z, y: p.y, vx: 0, vz: 0, fim: system.currentTick + duracao, n: 0, pegos: new Set() };
}
