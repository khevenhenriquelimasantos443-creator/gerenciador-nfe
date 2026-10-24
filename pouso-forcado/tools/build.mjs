// Build: compila o TypeScript, gera texturas/estruturas que faltarem e empacota:
// - dist/pouso-forcado.mcaddon: os dois packs + o mundo plano de deserto pronto (é este que se usa:
//   cada importação cria um mundo novo, com os packs da versão dentro dele);
// - dist/pouso-forcado.mcworld: só o mundo, já com os packs dentro (plano B);
// - dist/pouso-forcado_BP.mcpack / _RP.mcpack: só os packs, para outros mundos.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gerarLevelDat } from "./gerar-mundo.mjs";
import { dbVazio } from "./leveldb-vazio.mjs";
import { gerarZip } from "./zip.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(RAIZ, "dist");
const NOME = "pouso-forcado";

function listar(pasta) {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    return statSync(caminho).isDirectory() ? listar(caminho) : [caminho];
  });
}

// Ícones de item que ninguém usa (os gerados que perderam para os desenhados à mão) ficam fora
// do pack: só entra o PNG de textures/items/cl/ citado no RP (item_texture.json) ou nos scripts (Catálogo).
let citados;
function iconeUsado(arq) {
  const rel = relative(join(RAIZ, "RP"), arq).split(sep).join("/");
  if (!rel.startsWith("textures/items/cl/") || !rel.endsWith(".png")) return true;
  citados ??= [...listar(join(RAIZ, "RP")), ...listar(join(RAIZ, "BP/scripts"))]
    .filter((a) => a.endsWith(".json") || a.endsWith(".js"))
    .map((a) => readFileSync(a, "utf8"))
    .join("\n");
  return citados.includes(`"${rel.slice(0, -4)}"`);
}

function empacotar(pasta, prefixo = "") {
  return listar(pasta).filter(iconeUsado).map((arq) => ({
    nome: prefixo + relative(pasta, arq).split(sep).join("/"),
    dados: readFileSync(arq),
  }));
}

function validarJson(pasta) {
  for (const arq of listar(pasta).filter((a) => a.endsWith(".json"))) {
    try {
      JSON.parse(readFileSync(arq, "utf8"));
    } catch (e) {
      throw new Error(`JSON inválido em ${relative(RAIZ, arq)}: ${e.message}`);
    }
  }
}

// O jogo descarta (sem avisar no celular) um bloco com estado de mais de 16 valores.
function validarEstadosDeBlocos(pasta) {
  for (const arq of listar(pasta).filter((a) => a.endsWith(".json"))) {
    const estados = JSON.parse(readFileSync(arq, "utf8"))["minecraft:block"]?.description?.states ?? {};
    for (const [nome, v] of Object.entries(estados)) {
      const n = Array.isArray(v) ? v.length : Array.isArray(v.values) ? v.values.length : v.values.max - v.values.min + 1;
      if (n > 16) throw new Error(`${relative(RAIZ, arq)}: o estado ${nome} tem ${n} valores (máximo 16)`);
    }
  }
}

const node = process.execPath;
console.log("> dados do Catálogo");
execFileSync(node, [join(RAIZ, "tools/gerar-harvestcraft.mjs")], { stdio: "inherit" });
execFileSync(node, [join(RAIZ, "tools/gerar-conteudo.mjs")], { stdio: "inherit" });
execFileSync(node, [join(RAIZ, "tools/aplicar-icones.mjs")], { stdio: "inherit" });
execFileSync(node, [join(RAIZ, "tools/gerar-catalogo.mjs")], { stdio: "inherit" });

console.log("> compilando TypeScript");
rmSync(join(RAIZ, "BP/scripts"), { recursive: true, force: true });
execFileSync(node, [join(RAIZ, "node_modules/typescript/bin/tsc"), "-p", join(RAIZ, "tsconfig.json")], { stdio: "inherit" });
console.log("> grupos do inventário criativo");
execFileSync(node, [join(RAIZ, "tools/gerar-grupos.mjs")], { stdio: "inherit" });

console.log("> texturas placeholder e estrutura da nave");
execFileSync(node, [join(RAIZ, "tools/gerar-texturas.mjs")], { stdio: "inherit" });
execFileSync(node, [join(RAIZ, "tools/gerar-visual.mjs")], { stdio: "inherit" });
execFileSync(node, [join(RAIZ, "tools/gerar-nave.mjs")], { stdio: "inherit" });
execFileSync(node, [join(RAIZ, "tools/gerar-aviao.mjs")], { stdio: "inherit" });
execFileSync(node, [join(RAIZ, "tools/gerar-relevo.mjs")], { stdio: "inherit" });
// Os geradores reescrevem item_texture.json: os ícones desenhados voltam a valer.
execFileSync(node, [join(RAIZ, "tools/aplicar-icones.mjs")], { stdio: "inherit" });

// O jogo descarta parte de um item (até o ícone) se a velocidade do "minecraft:digger" não for inteira.
function validarItens(pasta) {
  for (const arq of listar(pasta).filter((a) => a.endsWith(".json"))) {
    const velocidades = JSON.parse(readFileSync(arq, "utf8"))["minecraft:item"]?.components?.["minecraft:digger"]?.destroy_speeds ?? [];
    for (const { speed } of velocidades) if (!Number.isInteger(speed)) throw new Error(`${relative(RAIZ, arq)}: velocidade do digger ${speed} não é inteira`);
  }
}

console.log("> validando JSON");
validarJson(join(RAIZ, "BP"));
validarItens(join(RAIZ, "BP/items"));
validarJson(join(RAIZ, "RP"));
validarEstadosDeBlocos(join(RAIZ, "BP/blocks"));

console.log("> testando o carregamento dos scripts");
execFileSync(node, [join(RAIZ, "tools/testar-carga.mjs")], { stdio: "inherit" });

console.log("> empacotando");
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

// Os créditos e licenças vão dentro de cada pack.
const creditos = { nome: "CREDITOS.md", dados: readFileSync(join(RAIZ, "CREDITOS.md")) };
const comCreditos = (arquivos, prefixo = "") => [...arquivos, { ...creditos, nome: prefixo + creditos.nome }];
const bp = gerarZip(comCreditos(empacotar(join(RAIZ, "BP"))));
const rp = gerarZip(comCreditos(empacotar(join(RAIZ, "RP"))));
writeFileSync(join(DIST, `${NOME}_BP.mcpack`), bp);
writeFileSync(join(DIST, `${NOME}_RP.mcpack`), rp);

// .mcworld: mundo plano de deserto com os dois packs embutidos e já ativados. Cada mundo fica
// com a versão dos packs de quando foi criado; uma versão nova vem como um mundo novo.
const cabecalho = (pasta) => JSON.parse(readFileSync(join(RAIZ, pasta, "manifest.json"), "utf8")).header;
const bpHeader = cabecalho("BP"), rpHeader = cabecalho("RP");
const texto = (s) => Buffer.from(s, "utf8");
const mundo = gerarZip([
  { nome: "level.dat", dados: gerarLevelDat("Pouso Forçado") },
  { nome: "levelname.txt", dados: texto("Pouso Forçado") },
  { nome: "world_behavior_packs.json", dados: texto(JSON.stringify([{ pack_id: bpHeader.uuid, version: bpHeader.version }], null, 2)) },
  { nome: "world_resource_packs.json", dados: texto(JSON.stringify([{ pack_id: rpHeader.uuid, version: rpHeader.version }], null, 2)) },
  ...dbVazio(),
  ...comCreditos(empacotar(join(RAIZ, "BP"), `behavior_packs/${NOME}_BP/`), `behavior_packs/${NOME}_BP/`),
  ...comCreditos(empacotar(join(RAIZ, "RP"), `resource_packs/${NOME}_RP/`), `resource_packs/${NOME}_RP/`),
]);
writeFileSync(join(DIST, `${NOME}.mcworld`), mundo);

// .mcaddon: segundo a doc oficial, um zip com arquivos .mcpack e .mcworld. O jogo importa os
// dois packs e coloca o mundo "Pouso Forçado" direto na lista de mundos.
const addon = gerarZip([
  { nome: `${NOME}_BP.mcpack`, dados: bp },
  { nome: `${NOME}_RP.mcpack`, dados: rp },
  { nome: `${NOME}.mcworld`, dados: mundo },
]);
writeFileSync(join(DIST, `${NOME}.mcaddon`), addon);

for (const arq of readdirSync(DIST)) {
  console.log(`  dist/${arq}  (${(statSync(join(DIST, arq)).size / 1024).toFixed(1)} KB)`);
}
console.log("pronto.");
