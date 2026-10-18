# Pouso Forçado — add-on para Minecraft Bedrock 26.30+

Sua nave caiu num deserto sem água. Recursos são escassos e a progressão vem por missões.
Projeto próprio, inspirado na *ideia* de modpacks de sobrevivência com escassez. Nenhum asset, nome ou código foi copiado.

**Fase atual: 2** (Diário de Bordo e missões). Fases prontas: 0 (estrutura, Condensador de Água, boas-vindas) e 1 (mundo plano de deserto, nave caída, sem água, sem animais, mais monstros).

## Fases até o fim

| Fase | O que entra | Situação |
|---|---|---|
| 0 | Estrutura do projeto, Condensador de Água, boas-vindas | pronta |
| 1 | Mundo plano de deserto: dunas, morros, templo soterrado, nave caída, sem água, sem animais, mais monstros à noite, minérios | pronta |
| 2 | **Diário de Bordo**: item com menu de missões, recompensas e progresso salvo por jogador; 12 missões dos primeiros dias | **esta versão** |
| 3 | Máquinas de sobrevivência: Purificador/Coletor de orvalho melhor, Peneira (areia → sementes, argila, pepitas), Compostor de terra (gera terra a partir de restos), Estufa | próxima |
| 4 | Comida e vida: sementes raras na peneira, ovos/animais vindos de "cápsulas de carga" da nave, sede (barra de hidratação simples) | |
| 5 | Energia: painel solar, baterias e cabos simples; máquinas mais rápidas com energia | |
| 6 | Exploração e perigos: tempestade de areia, destroços de outras naves com saque, monstros novos do deserto, um chefe | |
| 7 | Consertar a nave: peças (casco, motor, computador de bordo, combustível) feitas com as máquinas, cada uma uma missão grande | |
| 8 | Final: decolagem, cena de saída do planeta, créditos e "modo infinito" depois do fim; texturas finais, sons, balanceamento e versão 1.0 | |


## Versões usadas (conferidas na documentação oficial)

| Item | Valor | Fonte |
|---|---|---|
| `min_engine_version` | `[1, 26, 30]` (o jogo "26.30" é o motor `1.26.30`) | `version.json` do Mojang/bedrock-samples e notas "1.26.30 Update Notes" no Microsoft Learn |
| `@minecraft/server` | `2.8.0` (estável) | Notas 1.26.30: "ships @minecraft/server v2.8.0 and @minecraft/server-ui v2.1.0" |
| `@minecraft/server-ui` | `2.1.0` (estável) | idem (menus do Diário de Bordo) |
| `format_version` do manifest | `2` (a versão 3 ainda está em preview) | Referência do manifest.json no Microsoft Learn |
| `format_version` de blocos | `1.26.30` | |
| `format_version` de receitas | `1.20.10` (o mesmo das receitas vanilla de 1.26.30) | bedrock-samples, tag v1.26.30.5 |
| `format_version` de bioma | `1.26.30` (validado contra o JSON Schema oficial de 1.26.30) | bedrock-samples `metadata/json_schemas` |
| Biomas customizados / `minecraft:replace_biomes` | estável desde 1.21.110 | Notas "1.21.110 Update Notes" no Microsoft Learn |
| Regras de spawn | `1.8.0`, a partir das regras vanilla de 1.26.30 | bedrock-samples `behavior_pack/spawn_rules` |
| Mundo dentro do `.mcaddon` | "`.mcaddon`: um zip que contém arquivos .mcpack ou .mcworld" | "Minecraft File Extensions" no Microsoft Learn |

Nada aqui usa Beta APIs nem experimentos. Funciona em 26.30 e em versões mais novas.

## Estrutura

```
pouso-forcado/
├── BP/                     Behavior Pack
│   ├── manifest.json
│   ├── biomes/             deserto seco (para quem usar o add-on num mundo infinito normal)
│   ├── blocks/             definições de blocos (cl:...)
│   ├── items/              itens (Diário de Bordo)
│   ├── recipes/            receitas
│   ├── spawn_rules/        sem animais; monstros reforçados
│   ├── structures/cl/      nave, dunas, morro, mesa, rochas e templo (geradas por tools/)
│   └── scripts/            (gerado pelo build a partir de scripts/, não editar)
├── RP/                     Resource Pack
│   ├── manifest.json
│   ├── biomes/             aparência do bioma (névoa, céu, música do deserto)
│   ├── blocks.json         sons dos blocos
│   ├── texts/              pt_BR.lang, en_US.lang
│   └── textures/           texturas (placeholders gerados)
├── scripts/                código TypeScript
│   ├── main.ts             ponto de entrada: cada fase registra seus módulos aqui
│   ├── config.ts           IDs, chaves de dynamic properties, balanceamento (relevo, saque, horda...)
│   ├── blocos/             componentes customizados de blocos (máquinas)
│   ├── jogador/            eventos de jogador (boas-vindas)
│   ├── missoes/            lista de missões, progresso e menu do Diário de Bordo
│   ├── mundo/              nave caída, relevo, minérios, horda noturna, diagnóstico
│   └── util/               helpers de inventário e estados de bloco
├── tools/                  build e geradores (texturas, nave, relevo, level.dat, db vazio), zip/png/nbt sem dependências
└── dist/                   saída: pouso-forcado.mcaddon (packs + mundo) e pouso-forcado.mcworld
```

Para as próximas fases, a ideia é: máquinas novas em `scripts/blocos/` (uma por arquivo, registradas no `main.ts`), missões novas no fim de `scripts/missoes/lista.ts`, e todo número de balanceamento em `config.ts`.

Escolhi TypeScript com `tsc` puro (sem bundler): o build só compila os `.ts` em `.js`, sem nada a mais para configurar.

## Como gerar (no PC)

Precisa do [Node.js](https://nodejs.org) 18 ou mais novo.

```bash
cd pouso-forcado
npm install
npm run build
```

Sai em `dist/`:
- `pouso-forcado.mcaddon` → **é este que você usa**: instala os dois packs e coloca o mundo plano "Pouso Forçado" direto na sua lista de mundos;
- `pouso-forcado.mcworld` → só o mundo (plano B, se o `.mcaddon` não trouxer o mundo);
- `pouso-forcado_BP.mcpack` e `pouso-forcado_RP.mcpack` → só os packs, para usar num mundo infinito normal.

Outros comandos:
- `npm run texturas`: cria só as texturas que estiverem faltando (não apaga as suas). Para regerar todas: `node tools/gerar-texturas.mjs --force`.
- `npm run compilar`: só compila o TypeScript.
- `node tools/gerar-nave.mjs --force` / `node tools/gerar-relevo.mjs --force`: regeram a nave / as dunas, morros e o templo a partir do modelo em código.

> Os arquivos `dist/pouso-forcado.mcaddon` e `dist/pouso-forcado.mcworld` já vêm no repositório, então dá para baixar direto no celular sem fazer o build.

## Como instalar no celular

### Android
1. Baixe o `pouso-forcado.mcaddon` (pelo navegador ou pelo app do GitHub).
2. Abra a pasta **Downloads** no gerenciador de arquivos e toque no arquivo.
3. Escolha **Minecraft** em "Abrir com". O jogo importa os dois packs e o mundo.

### iOS (iPhone/iPad)
1. Baixe o `pouso-forcado.mcaddon` pelo Safari. Ele vai para o app **Arquivos** (pasta Downloads).
2. No app Arquivos, toque e segure o arquivo → **Compartilhar** → **Minecraft**.
3. O jogo importa os dois packs e o mundo.

## Como jogar

1. **Jogar** → aba **Mundos**: aparece o mundo **Pouso Forçado**, já com os packs ativados. Não precisa ligar experimentos nem ativar nada.
2. Antes de entrar, você pode mudar dificuldade, trapaças etc. em **Editar**.
3. Cada vez que você importa o `.mcaddon` de novo, entra mais uma cópia nova do mundo, útil para recomeçar do zero.

## Diário de Bordo (Fase 2)

- Ao entrar, cada jogador recebe o **Diário de Bordo**. Segure-o e use (no celular: toque e segure na tela) para abrir o menu.
- O menu mostra a missão atual, o progresso e a recompensa. Ao concluir, a recompensa vai para o inventário (ou cai no chão, se estiver cheio), toca um som e a próxima missão aparece no chat.
- **Missões concluídas** lista o que você já fez. **Pular esta missão** passa para a próxima sem recompensa (só para o caso de alguma missão travar).
- Perdeu o diário? Faça outro: **graveto + areia** (sem formato, dá até no inventário).
- O progresso é salvo por jogador. Num mundo com amigos, cada um tem suas missões.

| # | Missão | Objetivo | Recompensa |
|---|---|---|---|
| 1 | Água no deserto | colocar o Condensador de Água | 2 terras |
| 2 | Primeira gota | ter 1 balde de água | 3 farinhas de osso |
| 3 | Raízes | plantar 1 muda de carvalho | 1 muda, 2 farinhas de osso |
| 4 | Lenha | quebrar 4 troncos de carvalho | 4 sementes de trigo |
| 5 | Oficina improvisada | colocar uma mesa de trabalho | 2 terras |
| 6 | Debaixo da areia | ter uma picareta de pedra | 4 tochas |
| 7 | Fogo | colocar uma fornalha | 4 carvões |
| 8 | Metal | ter 3 barras de ferro | 1 balde |
| 9 | Sobreviva à noite | chegar ao próximo amanhecer | 4 pães |
| 10 | Caçador | derrotar 5 monstros | 2 canas-de-açúcar |
| 11 | Primeira colheita | ter 3 trigos | 2 terras, 4 farinhas de osso |
| 12 | Papel para o diário | ter 3 papéis | 2 sementes de abóbora |

Missões de "ter" não gastam os itens. Tudo fica em `scripts/missoes/lista.ts`; textos em `RP/texts/*.lang` (`cl.missao.<id>.titulo` / `.desc`).

## O mundo (Fase 1)

- **Plano, de areia.** O mundo que vem no `.mcaddon` é plano, com bioma de deserto. Camadas de baixo para cima: 1 bedrock, 64 ardósia (y -63 a 0), 32 pedra (1 a 32), 7 arenito, 5 areia. Você pisa em **y = 45**.
- **Dunas e morros pequenos.** O mundo plano não tem relevo. O script `scripts/mundo/relevo.ts` decora cada chunk **uma única vez**, quando ele carrega perto de você:
  - dunas pequenas e médias, morros de até 7 blocos, mesas (platôs com faixa de terracota), grupos de rochas, arbustos secos (dão gravetos) e **cactos** de 1 a 3 blocos (em ~1 a cada 3 chunks; `RELEVO.cacto`);
  - raramente, um **templo soterrado**: uma pirâmide de arenito própria do add-on, com um baú de saque (ossos, gravetos, linha, carne podre, às vezes pepitas de ferro, pão, terra, muda e, bem raramente, balde).
  - Chances, tamanhos e o saque ficam em `RELEVO` e `TEMPLO_SAQUE` no `scripts/config.ts`.
  - **Minérios:** cada chunk recebe veios de carvão, cobre, ferro, ouro, redstone, lápis-lazúli e diamante, em alturas parecidas com as do mundo normal (abaixo de y = 0 saem as versões de ardósia). Quantidades em `MINERIOS` no `scripts/config.ts`.
  - Cada chunk decorado ganha um bloco de **deepslate reforçado** na primeira camada de ardósia (y = -63), no canto do chunk. É a marca de "já feito", para nada ser refeito ao reabrir o mundo. Ele não quebra no modo sobrevivência.
- **Sem cavernas e sem água.** Mundo plano não tem cavernas, aquíferos, rios nem mares. Também não chove (bioma de deserto).
- **Sem animais:** em `BP/spawn_rules/` as regras de spawn de todos os animais do Overworld estão vazias: vaca, porco, ovelha, galinha, coelho, cavalo, burro, lhama, camelo, lobo, raposa, abelha, sapo, cabra, panda, papagaio, jaguatirica, urso-polar, tatu, tartaruga, morcego, peixes, lula, golfinho, axolote e náutilo.
- **Mais monstros à noite:** zumbi, husk, esqueleto, aranha e creeper nascem em grupos maiores e com mais frequência (regras de spawn reforçadas). Além disso, a cada 10 s nascem 3 monstros extras a 18–32 blocos de cada jogador, se houver menos de 30 por perto.
- **A horda:** uma vez por noite, à meia-noite, aparece "A horda chegou!", toca uma corneta e uma onda de monstros nasce a 12–22 blocos de cada jogador: 8 na primeira noite, +2 a cada dia (até 24). Nada disso acontece no Pacífico, no criativo nem fora do Overworld. Ajuste em `HORDA` no `scripts/config.ts`.
- **O sol queima tudo:** de dia, todo monstro exposto ao céu pega fogo, inclusive husks, aranhas e creepers, que no jogo normal não queimam. Quem estiver na sombra (dentro de um templo, embaixo de um teto) ou no subsolo escapa.
- **Nada nasce de dia ao ar livre:** se o jogo fizer um monstro nascer de dia sob o céu aberto, o script remove na hora. No subsolo e na sombra o spawn continua normal. (Ovos de spawn usados de dia ao ar livre também são removidos.)
- **Slimes:** no Bedrock eles nascem em qualquer luz em "slime chunks" abaixo de y = 40. Com o chão em y = 45 eles não nascem na superfície (as regras do slime também ganharam filtro de escuridão).
- **Nave caída.** Ao entrar no mundo pela primeira vez, uma nave quebrada aparece ao lado do jogador, meio enterrada na areia. Dentro há um baú com o que sobrou da carga: Condensador de Água, 1 balde, 6 pães, 8 tochas, 4 terras e 2 mudas de carvalho. Se a nave não puder ser colocada, os itens vão direto para o inventário. Nenhum relevo é gerado a menos de 3 chunks da nave.
- **Trocar a nave ou as estruturas.** Construa no jogo, salve com o **Bloco de Estrutura** e substitua o arquivo em `BP/structures/cl/` (mesmo nome). Para a nave, ajuste `NAVE.bau` no `scripts/config.ts` para a posição do baú.
- **Diagnóstico no chat:** ao entrar, aparece uma linha cinza `[Pouso Forçado 0.6.1] biomas: ... | bioma aqui: ... | luz: céu N, total N | hora: N`. No mundo plano, "bioma aqui" deve ser `minecraft:desert`; ao ar livre, "céu" deve ser 15.

### Usando só o `.mcaddon` num mundo infinito normal

Também funciona, mas com o relevo normal do Minecraft:
- O bioma `cl:deserto_seco` substitui todos os biomas da superfície e as cavernas exuberantes, sem mar e sem rios.
- Os desertos vanilla também ficam sem mar (arquivos `BP/biomes/vanilla_*.biome.json`); templos e poços continuam.
- O relevo por script **não** roda nesse caso, porque ele só age onde reconhece as camadas do mundo plano.

Por que há dois arquivos de bioma: a doc oficial manda escrever os biomas-alvo **sem** prefixo (`plains`), e o exemplo oficial da Microsoft usa **com** prefixo (`minecraft:plains`). Vão as duas variantes; se as duas valerem, elas são idênticas.

## Como testar

Dica: ative o log de erros em **Configurações → Criador → Ativar GUI do log de conteúdo**. Erros de script ou JSON aparecem na tela.

1. **Mundo:** abra o mundo **Pouso Forçado** da lista. Deve ser plano, de areia, com coordenadas visíveis, em y = 45.
2. **Diário:** ao entrar, o Diário de Bordo vai para o inventário. Use-o: o menu mostra a missão 1. Coloque o condensador: a missão conclui e chegam 2 terras.
3. **Minérios:** cave um poço até y = 0 ou menos. Deve haver carvão e ferro na pedra, e ouro, redstone, lápis e (raro) diamante na ardósia.
4. **Boas-vindas e nave:** aparece o título "Pouso Forçado", a mensagem no chat e, em ~2 s, a nave ao seu lado. Entre pela abertura lateral e abra o baú.
5. **Relevo:** ande para longe da nave. Dunas, morros pequenos, mesas e rochas vão aparecendo a cada poucos chunks. Elas surgem quando o chunk carrega, a ~4 chunks de você.
6. **Templo:** é raro (~1 a cada 80 chunks). No criativo, voe uns 1000–2000 blocos procurando uma pirâmide de arenito com faixas laranja. Entre pela abertura no nível do chão e abra o baú.
7. **Só uma vez:** saia e entre de novo. Nada deve ser recolocado (nem nave, nem dunas em cima das antigas).
8. **Sem animais e sem água:** de dia, nenhum animal; nenhuma água em lugar nenhum.
9. **Noite:** no sobrevivência, deve vir bem mais monstro que o normal. À meia-noite (pode usar `/time set 17900` com trapaças ligadas) aparece "A horda chegou!" e chega a onda.
   De manhã (`/time set 1000`), os monstros no descampado pegam fogo. Pelo caminho devem aparecer cactos.
10. **Condensador, à mão:** coloque o condensador e toque nele logo em seguida. Deve aparecer "ainda está juntando umidade". Espere ~30 s: o centro do topo fica **azul claro**. Toque com um balde vazio no inventário: você recebe um balde de água e ouve o som, e o topo volta a escuro.
11. **Sem balde:** com o condensador cheio e sem balde vazio, aparece "Traga um balde vazio".
12. **Baú adjacente:** coloque um baú (ou barril/funil) encostado no condensador com baldes vazios dentro. A cada ~30 s um balde do baú vira balde de água.
13. **Receita** (mesa de trabalho):
    ```
    Ferro   Vidro  Ferro
    Ferro   Balde  Ferro
    Pedra   Pedra  Pedra     (pedregulho, pedra-negra ou pedregulho de ardósia)
    ```
14. **Idioma:** com o jogo em inglês, o bloco se chama "Water Condenser".

## Como o Condensador funciona (e por que assim)

- O bloco tem `minecraft:tick` de 600 ticks (30 s). O jogo só faz esse tick em chunks carregados, então não há loop global nem varredura de blocos.
- A cada ciclo ele produz 1 balde de água:
  1. se houver baú, barril ou funil encostado com balde vazio, entrega lá;
  2. senão, guarda (no máximo 1) no estado do bloco `cl:cheio`, e o topo fica azul.
- Tocar no bloco com um balde vazio no inventário retira o que estiver guardado. Ele usa primeiro o balde da mão, se tiver.
- Para mudar o tempo, altere `interval_range` em `BP/blocks/condensador_agua.json` e `CONDENSADOR_SEGUNDOS` em `scripts/config.ts`.

## Texturas

Os PNGs 16×16 em `RP/textures/blocks/cl/` são placeholders (cor sólida + borda). Substitua pelos seus com o **mesmo nome**. O build não sobrescreve arquivos existentes.

## O mundo plano (detalhes técnicos)

- O `level.dat` é gerado por `tools/gerar-mundo.mjs`: NBT little-endian com cabeçalho de 8 bytes, `Generator = 2` (plano) e `FlatWorldLayers` no formato `{"biome_id":2,"block_layers":[...],"encoding_version":6,"structure_options":null,"world_version":"version.post_1_18"}`.
- Os campos seguem o `level.dat` do Bedrock usado por servidores open-source (Dragonfly e PocketMine-MP).
- A pasta `db/` vai vazia (um LevelDB vazio, gerado por `tools/leveldb-vazio.mjs` e testado abrindo-o com um LevelDB de verdade). O jogo gera o terreno na primeira vez que o mundo abre.
- Se mudar as camadas, mude também `MUNDO_PLANO.superficieY` no `scripts/config.ts`.

## Limitações do Bedrock (e o que fiz no lugar)

- **Relevo do mundo plano:** o jogo não gera relevo em mundo plano, então as dunas e os morros são colocados por script quando o chunk carrega. Por isso eles "aparecem" a uns 4 chunks de distância (o raio que o jogo mantém carregado no celular), não no horizonte. O custo é baixo: no máximo 3 chunks decorados por segundo.
- **Templos e vilas vanilla:** não existem no mundo plano, e `/place structure` só aceita estruturas "jigsaw". O templo soterrado é próprio do add-on.
- **Água infinita (2 baldes formando fonte):** o Bedrock não tem regra para desligar. Bloquear isso exigiria vigiar a água em volta do jogador o tempo todo, e esse é o tipo de gambiarra pesada que evitei. Ficou como marco de progressão: no começo só há 1 balde e quase não há ferro.
- **Mundo montado à mão:** o `level.dat` foi montado sem passar pelo jogo. Se o mundo não abrir ou não sair plano, use os `.mcpack` num mundo infinito enquanto eu ajusto o arquivo.
