// Carrega BP/scripts/main.js num @minecraft/server falso que dá erro se o mundo for lido
// enquanto o script carrega ("early execution"). No jogo, um erro desses interrompe o main.js
// no meio e tudo o que é registrado depois dele some sem aviso no celular.
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPTS = join(RAIZ, "BP/scripts");

function listar(pasta) {
  return readdirSync(pasta).flatMap((n) => (statSync(join(pasta, n)).isDirectory() ? listar(join(pasta, n)) : [join(pasta, n)]));
}

// Todos os nomes importados de @minecraft/server pelos scripts.
const nomes = new Set();
for (const arq of listar(SCRIPTS).filter((a) => a.endsWith(".js"))) {
  for (const m of readFileSync(arq, "utf8").matchAll(/import \{([^}]+)\} from "@minecraft\/server"/g)) {
    for (const n of m[1].split(",")) if (n.trim()) nomes.add(n.trim());
  }
}

const tmp = mkdtempSync(join(tmpdir(), "pf-carga-"));
try {
  const mod = (p, codigo) => {
    mkdirSync(join(tmp, "node_modules/@minecraft", p), { recursive: true });
    writeFileSync(join(tmp, "node_modules/@minecraft", p, "package.json"), '{"type":"module","main":"index.js"}');
    writeFileSync(join(tmp, "node_modules/@minecraft", p, "index.js"), codigo);
  };
  const falsos = [...nomes]
    .filter((n) => n !== "world" && n !== "system")
    .map((n) => `export const ${n} = new Proxy(function () {}, { get: (t, p) => (p === "prototype" ? {} : String(p)) });`);
  mod(
    "server",
    [
      "const sinal = () => ({ subscribe: () => {} });",
      "const eventos = new Proxy({}, { get: () => sinal() });",
      'export const world = new Proxy({ afterEvents: eventos, beforeEvents: eventos }, { get: (t, p) => (p in t ? t[p] : () => { throw new Error("o mundo foi lido enquanto o script carregava: world." + String(p) + "()"); }) });',
      "export const system = { runInterval: () => 0, runTimeout: () => 0, run: () => 0, currentTick: 0, afterEvents: eventos, beforeEvents: { startup: { subscribe() {} } } };",
      ...falsos,
    ].join("\n"),
  );
  mod("server-ui", "export class ActionFormData {}\nexport class MessageFormData {}\nexport class ModalFormData {}");
  writeFileSync(join(tmp, "package.json"), '{"type":"module"}');
  cpSync(SCRIPTS, join(tmp, "scripts"), { recursive: true });
  await import(pathToFileURL(join(tmp, "scripts/main.js")).href);
  console.log("  main.js carrega sem ler o mundo antes da hora");
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
