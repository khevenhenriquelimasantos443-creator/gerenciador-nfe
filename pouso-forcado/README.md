# Pouso Forçado — add-on para Minecraft Bedrock 26.30+

Sua nave caiu num deserto sem água. Recursos são escassos e a progressão vem por missões.
Projeto próprio, inspirado na *ideia* de modpacks de sobrevivência com escassez. Nenhum asset, nome ou código foi copiado.

**Fase atual: 0** (estrutura + Condensador de Água + boas-vindas com kit).

## Versões usadas (conferidas na documentação oficial)

| Item | Valor | Fonte |
|---|---|---|
| `min_engine_version` | `[1, 26, 30]` (o jogo "26.30" é o motor `1.26.30`) | `version.json` do Mojang/bedrock-samples e notas "1.26.30 Update Notes" no Microsoft Learn |
| `@minecraft/server` | `2.8.0` (estável) | Notas 1.26.30: "ships @minecraft/server v2.8.0 and @minecraft/server-ui v2.1.0" |
| `@minecraft/server-ui` | `2.1.0` (estável) | idem (já declarado, mas só será usado na Fase 2) |
| `format_version` do manifest | `2` (a versão 3 ainda está em preview) | Referência do manifest.json no Microsoft Learn |
| `format_version` de blocos | `1.26.30` | |
| `format_version` de receitas | `1.20.10` (o mesmo das receitas vanilla de 1.26.30) | bedrock-samples, tag v1.26.30.5 |

Nada aqui usa Beta APIs nem experimentos. Funciona em 26.30 e em versões mais novas.

## Estrutura

```
pouso-forcado/
├── BP/                     Behavior Pack
│   ├── manifest.json
│   ├── blocks/             definições de blocos (cl:...)
│   ├── recipes/            receitas
│   └── scripts/            (gerado pelo build a partir de scripts/, não editar)
├── RP/                     Resource Pack
│   ├── manifest.json
│   ├── blocks.json         sons dos blocos
│   ├── texts/              pt_BR.lang, en_US.lang
│   └── textures/           texturas (placeholders gerados)
├── scripts/                código TypeScript
│   ├── main.ts             ponto de entrada: cada fase registra seus módulos aqui
│   ├── config.ts           IDs, chaves de dynamic properties, kit, balanceamento
│   ├── blocos/             componentes customizados de blocos (máquinas)
│   ├── jogador/            eventos de jogador (boas-vindas; depois: Diário de Bordo)
│   └── util/               helpers de inventário e estados de bloco
├── tools/                  build, gerador de texturas, zip/png sem dependências
└── dist/                   saída: pouso-forcado.mcaddon
```

Para as próximas fases, a ideia é: máquinas novas em `scripts/blocos/` (uma por arquivo, registradas no `main.ts`), missões em `scripts/missoes/` e menus com `@minecraft/server-ui`, e todo número de balanceamento em `config.ts`.

Escolhi TypeScript com `tsc` puro (sem bundler): o build só compila os `.ts` em `.js`, sem nada a mais para configurar.

## Como gerar o .mcaddon (no PC)

Precisa do [Node.js](https://nodejs.org) 18 ou mais novo.

```bash
cd pouso-forcado
npm install
npm run build
```

Sai em `dist/`:
- `pouso-forcado.mcaddon` → instala os dois packs de uma vez (é este que você usa);
- `pouso-forcado_BP.mcpack` e `pouso-forcado_RP.mcpack` → plano B, se o `.mcaddon` não abrir.

Outros comandos:
- `npm run texturas`: cria só as texturas que estiverem faltando (não apaga as suas). Para regerar todas: `node tools/gerar-texturas.mjs --force`.
- `npm run compilar`: só compila o TypeScript.

> O `dist/pouso-forcado.mcaddon` já vem no repositório, então dá para baixar direto no celular sem fazer o build.

## Como instalar no celular

### Android
1. Baixe o `pouso-forcado.mcaddon` (pelo navegador ou pelo app do GitHub).
2. Abra a pasta **Downloads** no gerenciador de arquivos e toque no arquivo.
3. Escolha **Minecraft** em "Abrir com". O jogo abre e mostra "Importação iniciada… Importado com sucesso" para os dois packs.
4. Se o Minecraft não aparecer na lista, toque nos dois `.mcpack`, um de cada vez.

### iOS (iPhone/iPad)
1. Baixe o `pouso-forcado.mcaddon` pelo Safari. Ele vai para o app **Arquivos** (pasta Downloads).
2. No app Arquivos, toque e segure o arquivo → **Compartilhar** → **Minecraft**.
3. O jogo abre e importa os dois packs.
4. Se o iOS abrir o arquivo como zip ou não mostrar o Minecraft, use os dois `.mcpack` (mesmo processo, um por vez).

## Como ativar num mundo

1. **Criar novo** → **Criar novo mundo**.
2. Em **Pacotes de comportamento** → **Disponível** → ative **Pouso Forçado (Comportamento)**.
3. O jogo pergunta se quer ativar o pacote de recursos dependente → **Ativar**. (Ou ative manualmente **Pouso Forçado (Recursos)** em **Pacotes de recursos**.)
4. **Não** precisa ligar nenhum experimento.
5. Crie o mundo.

Para atualizar o add-on num mundo já existente, aumente o `version` dos dois manifests antes do build. Senão o jogo pode manter a versão antiga em cache.

## Como testar (Fase 0)

Dica: ative o log de erros em **Configurações → Criador → Ativar GUI do log de conteúdo**. Erros de script ou JSON aparecem na tela.

1. **Boas-vindas:** ao entrar no mundo novo aparece o título "Pouso Forçado", uma mensagem no chat e o kit: 1 Condensador de Água, 1 balde, 6 pães e 8 tochas.
2. **Só uma vez:** saia e entre de novo, ou morra. O kit **não** deve vir de novo.
3. **Condensador, à mão:** coloque o condensador e toque nele logo em seguida. Deve aparecer "ainda está juntando umidade". Espere ~30 s: o centro do topo fica **azul claro**. Toque com um balde vazio no inventário: você recebe um balde de água e ouve o som, e o topo volta a escuro.
4. **Sem balde:** com o condensador cheio e sem balde vazio, aparece "Traga um balde vazio".
5. **Baú adjacente:** coloque um baú (ou barril/funil) encostado no condensador com baldes vazios dentro. A cada ~30 s um balde do baú vira balde de água.
6. **Receita** (mesa de trabalho):
   ```
   Ferro   Vidro  Ferro
   Ferro   Balde  Ferro
   Pedra   Pedra  Pedra     (pedregulho, pedra-negra ou pedregulho de ardósia)
   ```
7. **Idioma:** com o jogo em inglês, o bloco se chama "Water Condenser".

## Como o Condensador funciona (e por que assim)

- O bloco tem `minecraft:tick` de 600 ticks (30 s). O jogo só faz esse tick em chunks carregados, então não há loop global nem varredura de blocos.
- A cada ciclo ele produz 1 balde de água:
  1. se houver baú, barril ou funil encostado com balde vazio, entrega lá;
  2. senão, guarda (no máximo 1) no estado do bloco `cl:cheio`, e o topo fica azul.
- Tocar no bloco com um balde vazio no inventário retira o que estiver guardado. Ele usa primeiro o balde da mão, se tiver.
- Para mudar o tempo, altere `interval_range` em `BP/blocks/condensador_agua.json` e `CONDENSADOR_SEGUNDOS` em `scripts/config.ts`.

## Texturas

Os PNGs 16×16 em `RP/textures/blocks/cl/` são placeholders (cor sólida + borda). Substitua pelos seus com o **mesmo nome**. O build não sobrescreve arquivos existentes.
