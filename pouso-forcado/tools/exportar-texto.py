# Exporta o add-on em texto (para ler em ferramentas que não abrem .mcaddon, como o Google AI Studio): dist/texto/*.md com
# o código TypeScript, os JSON do pacote de comportamento e os do de recursos (JSON compactado, sem as imagens e sons).
# Uso: python3 tools/exportar-texto.py
import json, os, re
from pathlib import Path

R = Path(__file__).resolve().parent.parent
SAIDA = R / "dist/texto"
SAIDA.mkdir(parents=True, exist_ok=True)
for f in SAIDA.glob("*.md"):
    f.unlink()
LIMITE = 3_500_000  # bytes por arquivo (cabe na janela de um modelo grande)
versao = re.search(r'VERSAO = "([\d.]+)"', (R / "scripts/config.ts").read_text(encoding="utf-8")).group(1)


def compactar(p: Path) -> str:
    txt = p.read_text(encoding="utf-8-sig", errors="replace")
    if p.suffix == ".json":
        try:
            return json.dumps(json.loads(re.sub(r"//[^\n]*", "", txt) if p.name.endswith(".json") and "//" in txt and not txt.lstrip().startswith("{") else txt),
                              ensure_ascii=False, separators=(",", ":"))
        except Exception:
            return txt.strip()
    return txt.strip()


def exportar(nome, titulo, arquivos):
    partes, atual, tam, n = [], [], 0, 1
    for p in arquivos:
        rel = p.relative_to(R).as_posix()
        lingua = {".ts": "ts", ".json": "json", ".lang": "properties"}.get(p.suffix, "")
        bloco = f"\n### {rel}\n```{lingua}\n{compactar(p)}\n```\n"
        if tam + len(bloco.encode()) > LIMITE and atual:
            partes.append(atual)
            atual, tam = [], 0
        atual.append(bloco)
        tam += len(bloco.encode())
    if atual:
        partes.append(atual)
    for k, blocos in enumerate(partes, 1):
        sufixo = f"_parte{k}" if len(partes) > 1 else ""
        cab = f"# Pouso Forçado {versao}: {titulo}{f' (parte {k} de {len(partes)})' if len(partes) > 1 else ''}\n\nAdd-on de Minecraft Bedrock (recriação do modpack Crash Landing). Cada seção é um arquivo, com o caminho dele.\n"
        (SAIDA / f"pouso-forcado_{nome}{sufixo}.md").write_text(cab + "".join(blocos), encoding="utf-8")
        n += 1
    return len(partes)


ts_todos = sorted(p for p in (R / "scripts").rglob("*.ts"))
ts = [p for p in ts_todos if "gerado" not in p.name]
ts_gerado = [p for p in ts_todos if "gerado" in p.name]
bp = sorted(p for p in (R / "BP").rglob("*") if p.suffix in (".json", ".lang", ".mcfunction") and "scripts" not in p.parts)
rp = sorted(p for p in [*(R / "RP").rglob("*"), *(R / "RP_menu").rglob("*")] if p.suffix in (".json", ".lang", ".material") and p.is_file())
info = [("1_codigo", "código dos scripts (TypeScript, escrito à mão)", ts), ("1b_dados_gerados", "dados gerados que os scripts usam (catálogo de receitas, conteúdo)", ts_gerado), ("2_comportamento", "pacote de comportamento (itens, blocos, receitas, entidades...)", bp),
        ("3_recursos", "pacote de recursos (texturas em lista, modelos, textos)", rp)]
for nome, titulo, arqs in info:
    print(nome, len(arqs), "arquivos ->", exportar(nome, titulo, arqs), "parte(s)")
for f in sorted(SAIDA.glob("*.md")):
    print(f"  {f.name}: {f.stat().st_size / 1e6:.1f} MB")
