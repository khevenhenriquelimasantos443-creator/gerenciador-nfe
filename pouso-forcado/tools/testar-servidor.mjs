// Monta um mundo de testes para o servidor Bedrock (Bedrock Dedicated Server) com o add-on e o pacote de
// testes (tools/teste/BP, com jogador simulado do GameTest). Uso, depois do build:
//   node tools/testar-servidor.mjs <pasta do servidor>
// O servidor não vem no repositório (baixe em minecraft.net). Depois rode o servidor e, no console:
//   execute positioned 0 46 0 run gametest runset pouso
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gerarLevelDat } from "./gerar-mundo.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRV = process.argv[2];
if (!SRV) throw new Error("uso: node tools/testar-servidor.mjs <pasta do servidor>");
const MUNDO = join(SRV, "worlds", "teste");
rmSync(MUNDO, { recursive: true, force: true });
mkdirSync(MUNDO, { recursive: true });
writeFileSync(join(MUNDO, "level.dat"), gerarLevelDat("Teste", true));
writeFileSync(join(MUNDO, "levelname.txt"), "Teste");
const pacote = (pasta) => JSON.parse(readFileSync(join(pasta, "manifest.json"), "utf8")).header;
const bps = [join(RAIZ, "BP"), join(RAIZ, "tools/teste/BP")];
for (const [i, p] of bps.entries()) cpSync(p, join(MUNDO, "behavior_packs", `bp${i}`), { recursive: true });
// O jogador simulado vem da API beta: com a API estável o add-on o enxerga como "undefined". No mundo de
// testes o add-on passa a usar as mesmas versões beta do pacote de testes.
const manifesto = join(MUNDO, "behavior_packs", "bp0", "manifest.json");
const m = JSON.parse(readFileSync(manifesto, "utf8"));
for (const d of m.dependencies) {
  if (d.module_name === "@minecraft/server") d.version = "2.11.0-beta";
  if (d.module_name === "@minecraft/server-ui") d.version = "2.3.0-beta";
}
// E precisa depender do módulo do GameTest, senão o tipo do jogador simulado não existe para ele.
m.dependencies.push({ module_name: "@minecraft/server-gametest", version: "1.0.0-beta" });
writeFileSync(manifesto, JSON.stringify(m, null, 2));
const main = join(MUNDO, "behavior_packs", "bp0", "scripts", "main.js");
writeFileSync(main, `import "@minecraft/server-gametest";\n${readFileSync(main, "utf8")}`);
cpSync(join(RAIZ, "RP"), join(MUNDO, "resource_packs", "rp0"), { recursive: true });
writeFileSync(join(MUNDO, "world_behavior_packs.json"), JSON.stringify(bps.map((p) => ({ pack_id: pacote(p).uuid, version: pacote(p).version }))));
writeFileSync(join(MUNDO, "world_resource_packs.json"), JSON.stringify([{ pack_id: pacote(join(RAIZ, "RP")).uuid, version: pacote(join(RAIZ, "RP")).version }]));
const props = join(SRV, "server.properties");
writeFileSync(props, readFileSync(props, "utf8").replace(/^level-name=.*$/m, "level-name=teste"));
console.log(`mundo de testes em ${MUNDO}`);
