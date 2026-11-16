// Lista os blocos que usam ou guardam energia (para os cabos ligarem o braço neles).
// Segue cada componente registrado em scripts/main.ts até o código dele e procura gasto, geração ou armazenamento de
// energia (gastarCE, gastarMk, consumir, gerar, registrarArmazem), também nas funções que o componente chama.
// Saída: scripts/conteudo/energia.ts (BLOCOS_ENERGIA). Roda no build, antes do tsc.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENERGIA = /\b(gastarCE|gastarMk|consumir|gerar|registrarArmazem)\s*\(/;
// Ajustes por bloco, onde o componente cuida de vários blocos e só alguns têm porta de energia (como no mod):
// - turbina e reator (Extreme Reactors): só as tomadas dão energia; carcaça, rotor, vidro e controlador não ligam;
// - Mekanism: o alarme, o classificador logístico, o aquecedor a lenha, o barril de resíduos e o ativador solar
//   não usam energia no mod;
// - Powah!: as células e os portões Ender guardam a energia do canal (registrarArmazem fora do componente).
const NAO_LIGA = new Set([
  "cl:controlador_turbina", "cl:carcaca_turbina", "cl:eixo_rotor", "cl:mancal_rotor", "cl:pa_rotor", "cl:porta_fluido_turbina", "cl:vidro_turbina",
  "cl:controlador_reator", "cl:alarme_industrial", "cl:classificador_logistico", "cl:aquecedor_lenha", "cl:barril_residuos_radioativos",
  "cl:ativador_neutrons_solar",
]);
const LIGA_TAMBEM_COMP = new Set(["cl:pw_ender", "cl:tomada_energia"]);
// Portas de energia dos multiblocos (o laço do multibloco é que gera ou gasta, sem componente no bloco).
const LIGA_TAMBEM = ["cl:tomada_turbina", "cl:porta_inducao", "cl:valvula_turbina_mk", "cl:porta_fusao", "cl:bobina_supercarregada"];

const fontes = new Map();
function fonte(arq) {
  if (!fontes.has(arq)) fontes.set(arq, existsSync(arq) ? readFileSync(arq, "utf8") : "");
  return fontes.get(arq);
}
const tsDe = (base, rel) => resolve(dirname(base), rel.replace(/\.js$/, ".ts"));

/** nome local -> { arq, nome original } para os imports de um arquivo */
function imports(arq) {
  const m = new Map();
  for (const [, lista, de] of fonte(arq).matchAll(/import\s*\{([^}]*)\}\s*from\s*"(\.[^"]+)"/g))
    for (const parte of lista.split(",")) {
      const [orig, local] = parte.trim().split(/\s+as\s+/);
      if (orig) m.set((local ?? orig).trim(), { arq: tsDe(arq, de), nome: orig.trim() });
    }
  return m;
}

/** O trecho que define `nome` no arquivo (até a próxima definição do nível de fora). */
function trecho(arq, nome) {
  const s = fonte(arq);
  const re = new RegExp(`^(?:export\\s+)?(?:const|let|function\\*?|async function)\\s+${nome}\\b`, "m");
  const m = re.exec(s);
  if (!m) return undefined;
  const resto = s.slice(m.index + m[0].length);
  const fim = /^(?:export\s+)?(?:const|let|function|async function|class|type|interface|enum)\s/m.exec(resto);
  return s.slice(m.index, m.index + m[0].length + (fim ? fim.index : resto.length));
}

// Tira comentários e textos entre aspas: um "magmator" dentro de um texto não é o componente magmator.
const semTexto = (t) => t?.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ").replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, '""');
const memo = new Map();
function usaEnergia(arq, nome, fundo = 0) {
  const k = `${arq}#${nome}`;
  if (memo.has(k)) return memo.get(k);
  memo.set(k, false); // corta ciclos
  let r = false;
  const t = semTexto(trecho(arq, nome));
  if (t === undefined) {
    // reexportado de outro arquivo?
    const imp = imports(arq).get(nome);
    r = imp ? usaEnergia(imp.arq, imp.nome, fundo + 1) : false;
  } else if (ENERGIA.test(t)) r = true;
  else if (fundo < 4) {
    // Segue os nomes usados no trecho (funções e tabelas que guardam funções), menos chaves de objeto, campos de tipo
    // e propriedades (x.nome), que só coincidem no nome.
    const imp = imports(arq);
    const vistos = new Set();
    for (const [, id] of t.matchAll(/(?<![.\w$])([A-Za-z_]\w*)(?![\w$])(?!\s*\??:(?!:))/g)) {
      if (id === nome || vistos.has(id)) continue;
      vistos.add(id);
      const i = imp.get(id);
      const [arq2, nome2] = i ? [i.arq, i.nome] : [arq, id];
      if (i && i.arq.includes("/util/")) continue;
      if (trecho(arq2, nome2) === undefined) continue;
      if (usaEnergia(arq2, nome2, fundo + 1)) { r = true; break; }
    }
  }
  memo.set(k, r);
  return r;
}

export function blocosEnergia() {
  const main = join(RAIZ, "scripts/main.ts");
  const s = fonte(main);
  const imp = imports(main);
  const ids = new Map([...fonte(join(RAIZ, "scripts/config.ts")).matchAll(/(\w+):\s*`\$\{NS\}:([a-z0-9_]+)`/g)].map(([, k, v]) => [`IDS.${k}`, `cl:${v}`]));
  const pares = []; // [componente, arquivo, nome]
  const por = (comp, local, arq = main, im = imp) => {
    const i = im.get(local);
    if (i) pares.push([comp, i.arq, i.nome]);
    else if (trecho(arq, local) !== undefined) pares.push([comp, arq, local]);
  };
  for (const [, c, l] of s.matchAll(/registerCustomComponent\(\s*("cl:[a-z0-9_]+"|IDS\.\w+)\s*,\s*(?:comPerfil\([^,]+,\s*)?(\w+)/g))
    por(c.startsWith("IDS.") ? ids.get(c) : c.slice(1, -1), l);
  for (const [, c, l] of s.matchAll(/\[\s*"(cl:[a-z0-9_]+)"\s*,\s*(\w+)\s*\]/g)) por(c, l);
  for (const [, c, l] of s.matchAll(/"(cl:[a-z0-9_]+)"\s*:\s*(\w+)/g)) por(c, l);
  // mapas de componentes de outros arquivos (COMPONENTES_EIO9, COMPONENTES_MK10)
  for (const [, mapa] of s.matchAll(/(?:\.\.\.|Object\.entries\()\s*(COMPONENTES_\w+)/g)) {
    const i = imp.get(mapa);
    if (!i) continue;
    const t = trecho(i.arq, i.nome) ?? "";
    const im2 = imports(i.arq);
    for (const [, c, l] of t.matchAll(/"(cl:[a-z0-9_]+)"\s*:\s*(\w+)/g)) por(c, l, i.arq, im2);
  }
  // Um ciclo cortado no meio pode deixar um "não" errado na memória: repete até não mudar (os "sim" ficam).
  let comEnergia = new Set();
  for (let volta = 0; volta < 4; volta++) {
    for (const [k, v] of memo) if (!v) memo.delete(k);
    const nova = new Set(pares.filter(([, arq, nome]) => usaEnergia(arq, nome)).map(([comp]) => comp));
    const igual = nova.size === comEnergia.size;
    comEnergia = nova;
    if (igual && volta > 0) break;
  }

  const blocos = new Set();
  const dir = join(RAIZ, "BP/blocks");
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const b = JSON.parse(readFileSync(join(dir, f), "utf8"))["minecraft:block"];
    const nomes = new Set();
    const ver = (c = {}) => {
      for (const k of Object.keys(c)) if (k.startsWith("cl:")) nomes.add(k);
      for (const k of c["minecraft:custom_components"] ?? []) nomes.add(k);
    };
    ver(b.components);
    for (const p of b.permutations ?? []) ver(p.components);
    const id = b.description.identifier;
    if ([...nomes].some((n) => comEnergia.has(n) || LIGA_TAMBEM_COMP.has(n)) && !NAO_LIGA.has(id)) blocos.add(id);
  }
  for (const id of LIGA_TAMBEM) if (existsSync(join(dir, `${id.slice(3)}.json`))) blocos.add(id);
  return { componentes: [...comEnergia].sort(), todos: [...new Set(pares.map((p) => p[0]))].sort(), blocos: [...blocos].sort() };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const r = blocosEnergia();
  const saida = join(RAIZ, "scripts/conteudo/energia.ts");
  writeFileSync(
    saida,
    `// Gerado por tools/gerar-energia.mjs: os blocos com componente que gasta, gera ou guarda energia.\n` +
      `export const BLOCOS_ENERGIA: ReadonlyArray<string> = ${JSON.stringify(r.blocos)};\n`,
  );
  console.log(`energia: ${r.componentes.length} de ${r.todos.length} componentes, ${r.blocos.length} blocos`);
  if (process.argv.includes("-v")) {
    console.log("COM:", r.componentes.join(" "));
    console.log("SEM:", r.todos.filter((c) => !r.componentes.includes(c)).join(" "));
  }
}
