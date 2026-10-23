// Gera o level.dat do mundo plano de deserto que vai no .mcworld/.mcaddon.
// Campos e tipos baseados no level.dat do Bedrock (ver README, seção "Modelo de mundo").
import { byte, comp, float, int, list, long, nbt, str } from "./nbt.mjs";

// Camadas de baixo para cima, a partir de y = -64. Total 109: o topo (areia) fica em y = 44
// e o primeiro bloco de ar em y = 45 (igual a MUNDO_PLANO.superficieY em scripts/config.ts).
// Ardósia de -63 a 0 e pedra de 1 a 32, como no mundo normal; os minérios entram por script.
// Chão acima de y = 40 também evita slimes nascendo de dia (no Bedrock eles nascem em
// "slime chunks" abaixo de y = 40 em qualquer luz).
export const CAMADAS = [
  { block_name: "minecraft:bedrock", count: 1 },
  { block_name: "minecraft:deepslate", count: 64 },
  { block_name: "minecraft:stone", count: 32 },
  { block_name: "minecraft:sandstone", count: 7 },
  { block_name: "minecraft:sand", count: 5 },
];
const BIOMA_DESERTO = 2;

const versao = (v) => list("int", v.map(int));
const b = (v) => byte(v ? 1 : 0);

// `testes`: liga o experimento "Beta APIs" (GameTest), só para o mundo de testes do servidor (tools/testar-servidor).
export function gerarLevelDat(nome, testes = false) {
  const camadas = JSON.stringify({
    biome_id: BIOMA_DESERTO,
    block_layers: CAMADAS,
    encoding_version: 6,
    structure_options: null,
    world_version: "version.post_1_18",
  });

  const dados = comp({
    // Mundo
    LevelName: str(nome),
    Generator: int(2), // 0 = limitado, 1 = infinito, 2 = plano
    FlatWorldLayers: str(camadas),
    BiomeOverride: str(""),
    RandomSeed: long(Math.floor(Math.random() * 2 ** 31)),
    SpawnX: int(0), SpawnY: int(32767), SpawnZ: int(0), // 32767 = o jogo procura o chão
    Time: long(0), currentTick: long(0), LastPlayed: long(0), worldStartCount: long(0),
    StorageVersion: int(10),
    NetworkVersion: int(924),
    WorldVersion: int(1),
    lastOpenedWithVersion: versao([1, 26, 0, 2, 0]),
    MinimumCompatibleClientVersion: versao([1, 26, 0, 0, 0]),
    InventoryVersion: str("1.26.0"),
    baseGameVersion: str("*"),
    Platform: int(2),
    NetherScale: int(8),
    LimitedWorldOriginX: int(0), LimitedWorldOriginY: int(32767), LimitedWorldOriginZ: int(0),
    limitedWorldDepth: int(16), limitedWorldWidth: int(16),
    // Jogo
    GameType: int(0), // sobrevivência
    Difficulty: int(2), // normal
    ForceGameType: b(false),
    commandsEnabled: b(testes), cheatsEnabled: b(testes), hasBeenLoadedInCreative: b(false),
    spawnMobs: b(true),
    bonusChestEnabled: b(false), bonusChestSpawned: b(false), startWithMapEnabled: b(false),
    eduOffer: int(0), eduLevel: b(false), educationFeaturesEnabled: b(false),
    IsHardcore: b(false),
    experiments: testes
      ? comp({ gametest: b(true), experiments_ever_used: b(true), saved_with_toggled_experiments: b(true) })
      : comp({ experiments_ever_used: b(false), saved_with_toggled_experiments: b(false) }),
    world_policies: comp({}),
    // Multijogador
    MultiplayerGame: b(true), MultiplayerGameIntent: b(true),
    LANBroadcast: b(true), LANBroadcastIntent: b(true),
    XBLBroadcastIntent: int(3), PlatformBroadcastIntent: int(3),
    // Regras do jogo
    commandblockoutput: b(true), commandblocksenabled: b(true),
    dodaylightcycle: b(true), doentitydrops: b(true), dofiretick: b(true),
    doimmediaterespawn: b(false), doinsomnia: b(true), domobloot: b(true),
    domobspawning: b(true), dotiledrops: b(true), doweathercycle: b(true),
    drowningdamage: b(true), falldamage: b(true), firedamage: b(true), freezedamage: b(true),
    keepinventory: b(false), mobgriefing: b(true), naturalregeneration: b(true), pvp: b(true),
    randomtickspeed: int(1), sendcommandfeedback: b(true), showcoordinates: b(true),
    showdeathmessages: b(true), spawnradius: int(0), tntexplodes: b(true),
    functioncommandlimit: int(10000), maxcommandchainlength: int(65535),
    respawnblocksexplode: b(true), showtags: b(true), recipesunlock: b(true),
    rainLevel: float(0), rainTime: int(0), lightningLevel: float(0), lightningTime: int(0),
    abilities: comp({
      attackmobs: b(true), attackplayers: b(true), build: b(true), mine: b(true),
      doorsandswitches: b(true), opencontainers: b(true), flySpeed: float(0.05),
      walkSpeed: float(0.1), verticalFlySpeed: float(1), flying: b(false), instabuild: b(false),
      invulnerable: b(false), lightning: b(false), mayfly: b(false), op: b(false),
      teleport: b(false), permissionsLevel: int(0), playerPermissionsLevel: int(1),
    }),
  });

  // Cabeçalho de 8 bytes: versão de armazenamento + tamanho do NBT.
  const corpo = nbt(dados);
  const cabecalho = Buffer.alloc(8);
  cabecalho.writeInt32LE(10, 0);
  cabecalho.writeInt32LE(corpo.length, 4);
  return Buffer.concat([cabecalho, corpo]);
}
