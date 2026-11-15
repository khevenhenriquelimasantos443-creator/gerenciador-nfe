// Normaliza os .lang: o Bedrock lê o arquivo linha a linha ("chave=valor"), então um valor com quebra de linha
// real é cortado na primeira linha. Aqui as linhas de continuação (sem "chave=") voltam para a chave anterior
// com "\n" escapado, que o jogo converte em quebra de linha. Idempotente: rodar de novo não muda nada.
// Também confere o resto: sem BOM, sem chave duplicada com valor diferente (avisa) e sem linha solta.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ARQUIVOS = ["RP/texts/pt_BR.lang", "RP/texts/en_US.lang", "RP_menu/texts/pt_BR.lang", "RP_menu/texts/en_US.lang"];
const CHAVE = /^[A-Za-z0-9_.:%\-/§]+=/;

export function normalizar(texto) {
  const entrada = texto.replace(/^﻿/, "").replace(/\r\n/g, "\n").split("\n");
  const saida = [];
  let juntadas = 0;
  let brancas = 0; // linhas em branco logo depois de uma chave: podem ser parágrafo do valor
  for (const linha of entrada) {
    const ehChave = CHAVE.test(linha);
    const ehComentario = linha.startsWith("#");
    if (linha === "") {
      brancas++;
      continue;
    }
    if (ehChave || ehComentario) {
      for (let i = 0; i < brancas; i++) saida.push("");
      brancas = 0;
      saida.push(linha);
      continue;
    }
    // continuação do valor anterior
    const k = saida.length - 1;
    if (k < 0 || saida[k].startsWith("#")) {
      saida.push(linha); // sem chave anterior: deixa como está (a conferência abaixo avisa)
      brancas = 0;
      continue;
    }
    saida[k] += "\\n".repeat(brancas + 1) + linha;
    brancas = 0;
    juntadas++;
  }
  for (let i = 0; i < brancas; i++) saida.push("");
  return { texto: saida.join("\n"), juntadas };
}

export function conferir(texto, nome) {
  const avisos = [];
  const valores = new Map();
  texto.split("\n").forEach((l, i) => {
    if (!l || l.startsWith("#")) return;
    if (!CHAVE.test(l)) return avisos.push(`${nome}:${i + 1}: linha sem chave: ${l.slice(0, 50)}`);
    const [k, ...v] = l.split("=");
    const valor = v.join("=");
    if (valores.has(k) && valores.get(k) !== valor) avisos.push(`${nome}:${i + 1}: chave repetida com valor diferente: ${k}`);
    valores.set(k, valor);
  });
  return avisos;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let total = 0;
  const avisos = [];
  for (const rel of ARQUIVOS) {
    const caminho = join(RAIZ, rel);
    if (!existsSync(caminho)) continue;
    const original = readFileSync(caminho, "utf8");
    const { texto, juntadas } = normalizar(original);
    if (texto !== original) writeFileSync(caminho, texto);
    total += juntadas;
    avisos.push(...conferir(texto, rel));
  }
  console.log(`lang: ${total} linhas de continuação juntadas`);
  for (const a of avisos) console.warn(`  AVISO ${a}`);
  if (avisos.some((a) => a.includes("linha sem chave"))) process.exit(1);
}
