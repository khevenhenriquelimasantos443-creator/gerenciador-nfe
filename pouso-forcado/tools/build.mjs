// Build: compila o TypeScript, gera texturas que faltarem e empacota
// dist/pouso-forcado.mcaddon (= BP.mcpack + RP.mcpack dentro de um zip).
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
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

function empacotar(pasta, prefixo = "") {
  return listar(pasta).map((arq) => ({
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

const node = process.execPath;
console.log("> compilando TypeScript");
rmSync(join(RAIZ, "BP/scripts"), { recursive: true, force: true });
execFileSync(node, [join(RAIZ, "node_modules/typescript/bin/tsc"), "-p", join(RAIZ, "tsconfig.json")], { stdio: "inherit" });

console.log("> texturas placeholder");
execFileSync(node, [join(RAIZ, "tools/gerar-texturas.mjs")], { stdio: "inherit" });

console.log("> validando JSON");
validarJson(join(RAIZ, "BP"));
validarJson(join(RAIZ, "RP"));

console.log("> empacotando");
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

const bp = gerarZip(empacotar(join(RAIZ, "BP")));
const rp = gerarZip(empacotar(join(RAIZ, "RP")));
writeFileSync(join(DIST, `${NOME}_BP.mcpack`), bp);
writeFileSync(join(DIST, `${NOME}_RP.mcpack`), rp);

// .mcaddon: zip com as duas pastas dos packs (o jogo importa os dois de uma vez).
const addon = gerarZip([...empacotar(join(RAIZ, "BP"), `${NOME}_BP/`), ...empacotar(join(RAIZ, "RP"), `${NOME}_RP/`)]);
writeFileSync(join(DIST, `${NOME}.mcaddon`), addon);

for (const arq of readdirSync(DIST)) {
  console.log(`  dist/${arq}  (${(statSync(join(DIST, arq)).size / 1024).toFixed(1)} KB)`);
}
console.log("pronto.");
