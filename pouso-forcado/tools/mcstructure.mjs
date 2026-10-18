// Monta arquivos .mcstructure a partir de uma grade de blocos (sem estados).
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { comp, int, list, nbt, str } from "./nbt.mjs";

// Versão do formato de blocos: 1.26.0.0 codificado como (maior<<24 | menor<<16 | patch<<8 | rev).
const VERSAO_BLOCOS = (1 << 24) | (26 << 16) | (0 << 8) | 0;

export class Estrutura {
  constructor(x, y, z) {
    this.X = x; this.Y = y; this.Z = z;
    this.grade = new Array(x * y * z).fill(null); // null = vazio de estrutura (não mexe no terreno)
  }
  indice(x, y, z) { return (x * this.Y + y) * this.Z + z; }
  dentro(x, y, z) { return x >= 0 && y >= 0 && z >= 0 && x < this.X && y < this.Y && z < this.Z; }
  por(x, y, z, bloco) { if (this.dentro(x, y, z)) this.grade[this.indice(x, y, z)] = bloco; }
  obter(x, y, z) { return this.dentro(x, y, z) ? this.grade[this.indice(x, y, z)] : null; }

  serializar() {
    const paleta = [];
    const indices = new Map();
    const camada = this.grade.map((bloco) => {
      if (bloco === null) return -1;
      if (!indices.has(bloco)) { indices.set(bloco, paleta.length); paleta.push(bloco); }
      return indices.get(bloco);
    });
    return nbt(comp({
      format_version: int(1),
      size: list("int", [int(this.X), int(this.Y), int(this.Z)]),
      structure: comp({
        block_indices: list("list", [list("int", camada.map(int)), list("int", camada.map(() => int(-1)))]),
        entities: list("compound", []),
        palette: comp({
          default: comp({
            block_palette: list("compound", paleta.map((nome) => comp({ name: str(nome), states: comp({}), version: int(VERSAO_BLOCOS) }))),
            block_position_data: comp({}),
          }),
        }),
      }),
      structure_world_origin: list("int", [int(0), int(0), int(0)]),
    }));
  }

  /** Grava o arquivo. Não sobrescreve um existente (pode ser uma versão feita à mão) sem forcar. */
  salvar(caminho, rotulo, forcar) {
    if (existsSync(caminho) && !forcar) { console.log(`mantido  ${rotulo}`); return; }
    mkdirSync(dirname(caminho), { recursive: true });
    writeFileSync(caminho, this.serializar());
    const usados = this.grade.filter((b) => b !== null).length;
    console.log(`gerado   ${rotulo} (${this.X}x${this.Y}x${this.Z}, ${usados} blocos)`);
  }
}

// "Aleatório" determinístico, para as estruturas saírem sempre iguais.
export const sorte = (x, y, z) => (((x * 73856093) ^ (y * 19349663) ^ (z * 83492791)) >>> 0) % 100;
