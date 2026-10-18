# Pouso Forçado — add-on para Minecraft Bedrock 26.30+

Sua nave caiu num deserto sem água. Recursos são escassos e a progressão vem por missões.
Projeto próprio, inspirado na *ideia* de modpacks de sobrevivência com escassez. Nenhum asset, nome ou código foi copiado.

**Fase atual: 6** (exploração: cidades abandonadas, masmorras, geradores de monstros, tempestade de areia, destroços de naves). Fases prontas: 0 (estrutura, Condensador de Água, boas-vindas), 1 (mundo plano de deserto, dunas, nave caída, horda), 2 (Diário de Bordo e missões), 3 (máquinas), 4 (sede, temperatura, águas, cápsulas de carga) e 5 (energia).

## Fases até o fim

| Fase | O que entra | Situação |
|---|---|---|
| 0 | Estrutura do projeto, Condensador de Água, boas-vindas | pronta |
| 1 | Mundo plano de deserto: dunas, morros, templo soterrado, nave caída, sem água, sem animais, mais monstros à noite, minérios | pronta |
| 2 | Diário de Bordo: item com menu de missões, recompensas e progresso salvo por jogador; 12 missões dos primeiros dias | pronta |
| 3 | Máquinas de sobrevivência: Peneira, Compostor de Terra, Condensador Avançado, Estufa; +8 missões | pronta |
| 4 | Comida e vida: sede, temperatura do corpo, 5 qualidades de água, fruta do cacto, cápsulas de carga com animais; +8 missões | pronta |
| 5 | Energia: painel solar, moinho de vento, gerador a carvão, bateria, cabos, peneira automática; estufa e condensador avançado turbinados; +8 missões | pronta |
| 6 | **Exploração**: cidades abandonadas (prédios de até 9 andares, torre de rádio), masmorras comuns e fundas, Gerador de Monstros, tempestade de areia, destroços de outras naves; +7 missões | **esta versão** |
| 7 | (próxima) Perigos: monstros novos do deserto e um chefe | |
| 8 | Consertar a nave: peças (casco, motor, computador de bordo, combustível) feitas com as máquinas, cada uma uma missão grande | |
| 9 | Visual das máquinas: modelos 3D próprios (no lugar dos cubos), texturas finais, animações (peneira balançando, compostor borbulhando, condensador pingando, estufa com plantas), partículas e sons próprios | |
| 10 | Final: decolagem, cena de saída do planeta, créditos e "modo infinito" depois do fim; balanceamento e versão 1.0 | |

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
- `pouso-forcado.mcaddon` → **1ª instalação**: instala os dois packs e coloca o mundo plano "Pouso Forçado" direto na sua lista de mundos;
- `pouso-forcado-atualizar.mcaddon` → **atualização**: só os dois packs. Atualiza o mundo que você já tem, sem perder nada;
- `pouso-forcado.mcworld` → só o mundo, sem os packs (plano B: importe antes o `-atualizar.mcaddon`);
- `pouso-forcado_BP.mcpack` e `pouso-forcado_RP.mcpack` → só os packs, para usar num mundo infinito normal.

Outros comandos:
- `npm run texturas`: cria só as texturas que estiverem faltando (não apaga as suas). Para regerar todas: `node tools/gerar-texturas.mjs --force`.
- `npm run compilar`: só compila o TypeScript.
- `node tools/gerar-nave.mjs --force` / `node tools/gerar-relevo.mjs --force`: regeram a nave / as dunas, morros e o templo a partir do modelo em código.

> Os arquivos `dist/pouso-forcado.mcaddon`, `dist/pouso-forcado-atualizar.mcaddon` e `dist/pouso-forcado.mcworld` já vêm no repositório, então dá para baixar direto no celular sem fazer o build.

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
3. Cada vez que você importa o `pouso-forcado.mcaddon` de novo, entra mais uma cópia nova do mundo, útil para recomeçar do zero.

### Atualizar sem perder o mundo

- Importe o **`pouso-forcado-atualizar.mcaddon`** (só os packs). O mundo que você já tem passa a usar a versão nova na próxima vez que abrir.
- Confira a versão na linha cinza do chat ao entrar: `[Pouso Forçado 0.13.0] ...`.
- Isso vale para mundos criados a partir da **0.7.0**. Mundos de antes levam uma cópia dos packs dentro deles e ficam presos na versão em que foram criados.

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

| 13 | Garimpeiro | colocar uma Peneira | 4 farinhas de osso |
| 14 | Ouro na areia | peneirar 20 vezes | 2 barras de ferro |
| 15 | Barro | ter 8 bolas de argila | 6 farinhas de osso |
| 16 | Nada se perde | colocar um Compostor de Terra | 8 carnes podres |
| 17 | Terra nova | tirar 3 terras do compostor | 2 mudas de carvalho |
| 18 | Mais água | colocar um Condensador Avançado | 2 barras de ferro |
| 19 | Estufa | colocar uma Estufa | 2 cenouras, 2 batatas |
| 20 | Fazenda no deserto | ter 32 trigos | 4 barras de ferro |

| 21 | Carga perdida | achar uma cápsula de carga | 4 garrafas de vidro |
| 22 | Cantil | ter 3 Águas Boas (tigelas no condensador) | 4 pães |
| 23 | Fruta do deserto | ter 3 frutas do cacto | 2 sementes de melancia |
| 24 | Rebanho | fazer nascer 1 filhote | 2 laços |
| 25 | Couro | ter 3 couros | 2 barras de ferro |
| 26 | Despensa cheia | ter 10 pães | 4 frutas vermelhas |
| 27 | Criador | fazer nascer mais 5 filhotes | 1 etiqueta |
| 28 | Sinais da nave | achar mais 3 cápsulas | 1 diamante |

| 29 | Luz do sol | colocar um Painel Solar | 4 redstones |
| 30 | Guardar energia | colocar uma Bateria | 4 barras de cobre |
| 31 | Fiação | colocar 8 Cabos de Cobre | 2 barras de ferro |
| 32 | Energia à noite | colocar um Gerador a Carvão | 8 carvões |
| 33 | Vento do deserto | colocar um Moinho de Vento | 6 redstones |
| 34 | Garimpo automático | colocar uma Peneira Automática | 4 barras de ferro |
| 35 | Linha de produção | 64 blocos peneirados pela peneira automática perto de você | 2 barras de ouro |
| 36 | Turbo | 10 ciclos da Estufa ou do Condensador Avançado com energia | 1 diamante |

| 37 | Sinal de rádio | chegar numa cidade abandonada (o Diário mostra as coordenadas) | 16 tochas |
| 38 | Desligar a fonte | quebrar um Gerador de Monstros | 4 barras de ferro |
| 39 | Debaixo da terra | achar uma masmorra | 2 barras de ouro |
| 40 | Não estamos sozinhos | achar destroços de outra nave | 4 redstones |
| 41 | Aguentar o vento | sobreviver a uma tempestade de areia | 4 Águas Boas |
| 42 | Exterminador | quebrar mais 5 Geradores de Monstros | 1 diamante |
| 43 | Profundezas | achar uma masmorra funda | 1 maçã dourada |

Missões de "ter" não gastam os itens. Tudo fica em `scripts/missoes/lista.ts`; textos em `RP/texts/*.lang` (`cl.missao.<id>.titulo` / `.desc`).

## Máquinas (Fase 3)

| Máquina | Receita (mesa de trabalho) | Como usar |
|---|---|---|
| **Peneira** | `G . G` / `G L G` / `T . T` (G = graveto, L = linha, T = tábua) | Toque nela com **areia** ou **cascalho** na mão. Gasta 1 bloco e às vezes sai: argila, sementes (trigo, beterraba, abóbora, melancia), farinha de osso, pepitas de ferro/ouro, sílex, cacto, cana, mudas (carvalho, bétula, acácia). Do cascalho sai mais minério: sílex, ferro, ouro, cobre, carvão, redstone, lápis e, raramente, diamante. |
| **Compostor de Terra** | `T . T` / `T D T` / `T T T` (D = terra) | Toque com restos na mão: carne podre (2 pontos), trigo, maçã, pão, sementes, folhas, mudas, cacto, cana, arbusto seco, graveto... Com 8 pontos ele decompõe por ~20 s (topo marrom) e aí, tocando, sai **1 terra**. A carne podre da horda vira terra! |
| **Condensador Avançado** | `C V C` / `V X V` / `C V C` (C = barra de cobre, V = vidro, X = Condensador de Água) | Como o condensador, mas 1 balde a cada **10 s** e guarda até **4**. Também enche baldes vazios de baú/barril/funil encostado. |
| **Estufa** | `V V V` / `V X V` / `C C C` | A cada 10 s, numa área de 9×9 em volta (da camada de baixo até 2 acima): a **terra arada fica sempre molhada** (planta longe da água), as plantações crescem mais rápido e as mudas viram árvore mais cedo. |

Tabelas de sorteio, pontos do compostor e números da estufa ficam no fim do `scripts/config.ts`.

## Exploração (Fase 6)

- **Cidades abandonadas.** O mapa é dividido em quadrados de 640×640 blocos; cada um tem uma cidade (menos o da nave), então a mais perto fica a algumas centenas de blocos. Na missão "Sinal de rádio" o **Diário de Bordo mostra as coordenadas** da cidade mais próxima. Cada cidade tem 112×112 blocos, numa planície sem dunas:
  - **prédios ocos** de 2 a 9 andares (mais altos no centro), de concreto, tijolo de pedra, arenito ou terracota, com janelas quebradas, topo desmoronado, areia acumulada e um **andaime** para subir até o telhado;
  - por dentro: **escuro** (monstros nascem sozinhos), **baús** em vários andares e **Geradores de Monstros**;
  - alguns quarteirões são só escombros; ruas de andesito cobertas de areia;
  - no **centro**, uma praça com a **torre de rádio** (34 blocos, andaime por dentro). Lá em cima: um baú com diamantes, ferro, redstone, Água Excelente e às vezes maçã dourada… guardado por um gerador.
- **Masmorras.** Salas escondidas no subsolo (~1 a cada 25 chunks), escuras, com um Gerador de Monstros no meio e 1 ou 2 baús:
  - **comuns** na pedra (y 12 a 26), de pedregulho com musgo. Metade tem um **poço** até a superfície, marcado por um **anel de arenito entalhado** na areia (com feno no fundo para amortecer a queda; para sair, cave ou faça uma escada);
  - **fundas** na ardósia (y -45 a -25), com 2 geradores e saque muito melhor (diamantes, ouro, esmeraldas, maçã dourada).
- **Gerador de Monstros.** Com um jogador a até 20 blocos, põe 1 ou 2 monstros em volta a cada 10 s (até 5 por perto). Abaixo de y = 0 vêm esqueletos, errantes, aranhas das cavernas e creepers. Leva uns 5 s para quebrar, não cai como item e dá ferro, ouro, redstone e experiência. Não explode com creeper.
- **Destroços de outras naves.** Nas planícies, às vezes, uma nave igual à sua, meio enterrada, com um baú de ferro, cobre, redstone, vidro e água.
- **Tempestade de areia.** No máximo uma por dia (35% de chance), de dia, por 2 minutos: aviso na tela, **névoa amarela** que fecha a visão, e quem estiver ao ar livre fica lento. A sede cai 1,5× mais rápido. Com trapaças, `/scriptevent cl:tempestade` começa uma na hora.
- Números em `CIDADE`, `MASMORRA`, `GERADOR_MONSTROS` e `TEMPESTADE` no `scripts/config.ts`.

## Energia (Fase 5)

A energia fica guardada nas **baterias** (15 cada). Geradores mandam energia para a bateria mais próxima com espaço; máquinas puxam da mais próxima com carga. "Próxima" = encostada ou ligada por **cabos** (até 64 cabos). Painéis, moinhos, geradores e baterias também passam energia, como os cabos. Toque em qualquer bloco de energia com a mão vazia para ver o estado.

| Bloco | Receita (mesa de trabalho) | O que faz |
|---|---|---|
| **Painel Solar** | `V V V` / `L R L` / `C C C` (V = vidro, L = lápis, R = redstone, C = cobre) | 1 de energia a cada 5 s, **de dia** e com **céu aberto** em cima dele. |
| **Moinho de Vento** | `G T G` / `T F T` / `G R G` (G = graveto, T = tábua, F = ferro) | Dia e noite, se os **4 lados estiverem livres**. A partir de y = 50: 1 a cada 5 s; y = 60: 2; y = 75: 3. Ponha em cima de uma duna ou de uma torre (de cabos, para a energia descer). |
| **Gerador a Carvão** | `F F F` / `F N F` / `C R C` (N = fornalha) | Toque com **carvão, carvão vegetal, bloco de carvão, toras, tábuas ou gravetos** para abastecer (guarda 15). Gasta 1 a cada 5 s e gera 2, só quando há bateria com espaço. Funciona à noite. |
| **Bateria** | `C R C` / `C F C` / `C R C` | Guarda 15. O topo muda de cor: vermelho (vazia), amarelo, verde (cheia). |
| **Cabo de Cobre** | `C` / `R` / `C` → 4 cabos | Liga tudo. |
| **Peneira Automática** | `F H F` / `R P R` / `F C F` (H = funil, P = Peneira) | A cada 5 s gasta 1 de energia e peneira **2 blocos** de areia/cascalho de um **baú ou funil em cima**; o resultado vai para um **baú ou funil embaixo** (ou cai do lado). |

Máquinas da Fase 3 com bateria ligada:
- **Condensador Avançado**: gasta 1 por ciclo e produz **em dobro** (só gasta se tiver espaço para guardar água);
- **Estufa**: gasta 1 por ciclo e tudo em volta **cresce sempre** (chance de 100%).

Números em `ENERGIA` no `scripts/config.ts`.

## Comida e vida (Fase 4)

- **Painel fixo.** Embaixo da tela fica sempre: `Água |||||||||| 20   Corpo 36.5°C`. Avisos das máquinas e das missões aparecem numa linha acima dele por alguns segundos, sem apagar o painel.
- **Sede.** Além da fome, você tem **20 pontos de água**. Cai 1 ponto a cada 30 s de dia e 50 s à noite (2× mais rápido com calor). Com menos de 5: lentidão. Com zero: 1 de dano a cada 4 s. Ao renascer, volta cheia. Não roda no criativo nem no Pacífico.
- **Temperatura do corpo** (de ~30,5 °C a ~42,5 °C; normal 36,5 °C). O corpo vai aos poucos para a temperatura do lugar:
  - **sol aberto** esquenta muito (pico ao meio-dia); **noite ao relento** esfria muito;
  - **sombra/abrigo** (qualquer bloco acima da cabeça) amortece os dois; **subsolo** é fresco;
  - **fogueira, fogo, lava, magma ou fornalha acesa** a até 3 blocos esquenta; **água** esfria; **correr** esquenta;
  - **qualquer capacete** protege do sol; **roupas de couro** protegem do frio (15% por peça);
  - beber água esfria na hora.
  - Efeitos: com **calor** (amarelo/vermelho), a sede cai 2× mais rápido; com **frio** (azul), lentidão; nos **extremos** (abaixo de ~31,7 °C ou acima de ~41,3 °C), 1 de dano a cada 3 s.
  - Na prática: meio-dia ao sol sem capacete ou a noite inteira fora sem fogueira machucam. Números em `TEMPERATURA` no `scripts/config.ts`.
- **Águas.** Cinco qualidades:

  | Água | Água no corpo | Efeito |
  |---|---|---|
  | Excelente | +10 | regeneração curta, esfria bem |
  | Boa (e a garrafa de água do jogo) | +7 | esfria |
  | Suja | +5 | às vezes enjoo e fome |
  | Muito suja | +3 | quase sempre enjoo; às vezes veneno e fome |
  | Imprópria | não dá para beber | precisa ferver |

- **Jeitos de beber** (do mais fácil ao melhor):
  - **direto do condensador**: toque nele cheio com a **mão vazia** (água boa; o avançado dá excelente). Não precisa de nada;
  - **poça**: fique **agachado dentro da água** (de um balde despejado): 1 gole a cada 2 s, às vezes enjoa;
  - **tigela de cacto**: tigela + cacto na mesa = água suja;
  - **tigela** (3 tábuas) ou **garrafa de vidro** na mão, tocando no condensador: leva até 3 doses (tigela = água boa/excelente; garrafa = garrafa de água). A tigela volta vazia depois de beber;
  - husks e zumbis às vezes soltam água muito suja ou imprópria; as cápsulas trazem água boa e, às vezes, excelente.
- **Melhorar a água:** **ferva** na fornalha ou fogueira (imprópria → muito suja → suja → boa) e **filtre** na mesa (água boa + carvão vegetal = excelente).
- Leite (+6), mel (+4), fruta do cacto (+4), melancia (+2) e frutas vermelhas (+1) também matam a sede.
- **Fruta do Cacto.** 30% de chance ao quebrar um cacto. Mata a fome (3) e a sede (4) e pode ser comida mesmo sem fome.
- **Cápsulas de carga.** A partir do dia 1, toda manhã cai uma cápsula a 20–48 blocos de um jogador: aviso na tela com as coordenadas, rastro de fogo e impacto (que não quebra nada). É uma gaiola de ardósia e barras de ferro, aberta para o sul, com:
  - um **barril** de saque: garrafas, pão, cenoura, batata, frutas vermelhas, sementes de melancia/abóbora/beterraba, ovos, maçã, muda de bétula, linha, laços, ferro, cobre e, raramente, etiqueta ou diamante;
  - um **casal de animais** (vaca, ovelha, galinha ou porco). Os animais não nascem sozinhos neste planeta: cuide deles e faça filhotes (trigo para vaca e ovelha, sementes para galinha, cenoura para porco). Ovos jogados também dão pintinhos.
  - Para testar: com trapaças ligadas, `/scriptevent cl:capsula` derruba uma perto de você.
- Números em `SEDE`, `TEMPERATURA`, `AGUAS`, `POCA`, `FRUTA_CACTO_CHANCE` e `CAPSULA` no fim do `scripts/config.ts`.

## O mundo (Fase 1)

- **Plano, de areia.** O mundo que vem no `.mcaddon` é plano, com bioma de deserto. Camadas de baixo para cima: 1 bedrock, 64 ardósia (y -63 a 0), 32 pedra (1 a 32), 7 arenito, 5 areia. Você pisa em **y = 45**.
- **Dunas de verdade.** O mundo plano não tem relevo, então o script `scripts/mundo/relevo.ts` decora cada chunk **uma única vez**:
  - **dunas por ruído contínuo** (`scripts/mundo/dunas.ts`): campos de dunas em cristas compridas, de 3 a ~10 blocos, que atravessam os chunks sem emenda, separados por planícies lisas. A direção do vento muda de mundo para mundo. Em volta da nave fica plano (raio de ~40 blocos). Ajuste em `DUNAS` no `scripts/config.ts`;
  - **prontas antes de você chegar:** o script prepara os chunks até 12 chunks de distância. Os que o jogo ainda não carregou ele carrega por conta própria (uma *ticking area* de 4×4 chunks por vez), decora e solta. Assim as dunas já estão lá quando aparecem no horizonte. No começo do mundo leva cerca de 1 a 2 minutos para preparar tudo em volta;
  - nas **planícies**: morros de até 7 blocos, mesas (platôs com faixa de terracota), grupos de rochas e, raramente, um **templo soterrado** (pirâmide de arenito própria do add-on, com baú de saque: ossos, gravetos, linha, carne podre, às vezes pepitas de ferro, pão, terra, muda e, bem raramente, balde);
  - em todo lugar: arbustos secos (dão gravetos) e **cactos** de 1 a 3 blocos (`RELEVO.cacto`);
  - **minérios:** cada chunk recebe veios de carvão, cobre, ferro, ouro, redstone, lápis-lazúli e diamante, em alturas parecidas com as do mundo normal (abaixo de y = 0 saem as versões de ardósia). Quantidades em `MINERIOS` no `scripts/config.ts`;
  - chances, tamanhos e o saque ficam em `RELEVO` e `TEMPLO_SAQUE` no `scripts/config.ts`;
  - cada chunk decorado ganha um bloco de **deepslate reforçado** na primeira camada de ardósia (y = -63), no canto do chunk. É a marca de "já feito", para nada ser refeito ao reabrir o mundo. Ele não quebra no modo sobrevivência.
- **Sem cavernas e sem água.** Mundo plano não tem cavernas, aquíferos, rios nem mares. Também não chove (bioma de deserto).
- **Sem animais:** em `BP/spawn_rules/` as regras de spawn de todos os animais do Overworld estão vazias: vaca, porco, ovelha, galinha, coelho, cavalo, burro, lhama, camelo, lobo, raposa, abelha, sapo, cabra, panda, papagaio, jaguatirica, urso-polar, tatu, tartaruga, morcego, peixes, lula, golfinho, axolote e náutilo.
- **Mais monstros à noite:** zumbi, husk, esqueleto, aranha e creeper nascem em grupos maiores e com mais frequência (regras de spawn reforçadas). Além disso, a cada 5 s nascem 4 monstros extras a 12–28 blocos de cada jogador, até ter 60 por perto.
- **A horda:** três ondas por noite (horas 14000, 17000 e 20000 do jogo). Em cada uma aparece "A horda chegou! Onda N de 3", toca uma corneta e nascem monstros a 8–20 blocos de cada jogador: 12 por onda na primeira noite, +3 a cada dia (até 40). Nada disso acontece no Pacífico, no criativo nem fora do Overworld. Se algo der erro, aparece uma linha vermelha no chat. Ajuste em `HORDA` no `scripts/config.ts`.
- **O sol queima tudo:** de dia, todo monstro exposto ao céu pega fogo, inclusive husks, aranhas e creepers, que no jogo normal não queimam. Quem estiver na sombra (dentro de um templo, embaixo de um teto) ou no subsolo escapa.
- **Nada nasce de dia ao ar livre:** se o jogo fizer um monstro nascer de dia sob o céu aberto, o script remove na hora. No subsolo e na sombra o spawn continua normal. (Ovos de spawn usados de dia ao ar livre também são removidos.)
- **Slimes:** no Bedrock eles nascem em qualquer luz em "slime chunks" abaixo de y = 40. Com o chão em y = 45 eles não nascem na superfície (as regras do slime também ganharam filtro de escuridão).
- **Nave caída.** Ao entrar no mundo pela primeira vez, uma nave quebrada aparece ao lado do jogador, meio enterrada na areia. Dentro há um baú com o que sobrou da carga: Condensador de Água, 1 balde, 6 pães, 8 tochas, 4 terras e 2 mudas de carvalho. Se a nave não puder ser colocada, os itens vão direto para o inventário. Em volta da nave o chão fica plano.
- **Trocar a nave ou as estruturas.** Construa no jogo, salve com o **Bloco de Estrutura** e substitua o arquivo em `BP/structures/cl/` (mesmo nome). Para a nave, ajuste `NAVE.bau` no `scripts/config.ts` para a posição do baú.
- **Diagnóstico no chat:** se algum bloco ou item do add-on não carregar, aparece uma linha vermelha `o jogo não carregou: ...`. Ao entrar, aparece também uma linha cinza `[Pouso Forçado 0.13.0] mundo: plano | biomas: ... | bioma aqui: ... | luz: céu N, total N | hora: N`. No mundo plano do add-on, "mundo" é `plano` e "bioma aqui" é `minecraft:desert` (num mundo infinito: `normal` e `cl:deserto_seco`); ao ar livre, "céu" deve ser 15.

### Usando só o `.mcaddon` num mundo infinito normal

Também funciona, mas com o relevo normal do Minecraft:
- O bioma `cl:deserto_seco` substitui todos os biomas da superfície e as cavernas exuberantes, sem mar e sem rios.
- Os desertos vanilla também ficam sem mar (arquivos `BP/biomes/vanilla_*.biome.json`); templos e poços continuam.
- O relevo por script **não** roda nesse caso: na primeira vez, o script confere as camadas do chão (ardósia, pedra, arenito nas alturas exatas do mundo plano) e, se não baterem, desliga o relevo de vez nesse mundo (aparece `mundo: normal` no diagnóstico).

Por que há dois arquivos de bioma: a doc oficial manda escrever os biomas-alvo **sem** prefixo (`plains`), e o exemplo oficial da Microsoft usa **com** prefixo (`minecraft:plains`). Vão as duas variantes; se as duas valerem, elas são idênticas.

## Como testar

Dica: ative o log de erros em **Configurações → Criador → Ativar GUI do log de conteúdo**. Erros de script ou JSON aparecem na tela.

1. **Mundo:** abra o mundo **Pouso Forçado** da lista. Deve ser plano, de areia, com coordenadas visíveis, em y = 45.
2. **Diário:** ao entrar, o Diário de Bordo vai para o inventário. Use-o: o menu mostra a missão 1. Coloque o condensador: a missão conclui e chegam 2 terras.
3. **Minérios:** cave um poço até y = 0 ou menos. Deve haver carvão e ferro na pedra, e ouro, redstone, lápis e (raro) diamante na ardósia.
4. **Boas-vindas e nave:** aparece o título "Pouso Forçado", a mensagem no chat e, em ~2 s, a nave ao seu lado. Entre pela abertura lateral e abra o baú.
5. **Relevo:** espere 1 a 2 minutos perto da nave e olhe o horizonte: devem aparecer campos de dunas compridas, separados por planícies com morros, mesas e rochas. Ande: as dunas já devem estar prontas antes de você chegar.
6. **Templo:** é raro (~1 a cada 80 chunks). No criativo, voe uns 1000–2000 blocos procurando uma pirâmide de arenito com faixas laranja. Entre pela abertura no nível do chão e abra o baú.
7. **Só uma vez:** saia e entre de novo. Nada deve ser recolocado (nem nave, nem dunas em cima das antigas).
8. **Sem animais e sem água:** de dia, nenhum animal; nenhuma água em lugar nenhum.
9. **Noite:** no sobrevivência, deve vir bem mais monstro que o normal. Nas horas 14000, 17000 e 20000 (pode usar `/time set 13900` com trapaças ligadas) aparece "A horda chegou!" e chega uma onda.
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

- **Relevo do mundo plano:** o jogo não gera relevo em mundo plano, então as dunas e os morros são colocados por script. Para não aparecerem "brotando" perto de você, o script carrega e decora os chunks até 12 chunks de distância com ticking areas. Se a sua distância de renderização for maior que 12 chunks, o que estiver mais longe ainda aparece plano até você se aproximar (dá para aumentar `RELEVO.raioChunks`, mas pesa mais). Custo: no máximo 6 chunks decorados por segundo e uma ticking area aberta por vez.
- **Templos e vilas vanilla:** não existem no mundo plano, e `/place structure` só aceita estruturas "jigsaw". O templo soterrado é próprio do add-on.
- **Água infinita (2 baldes formando fonte):** o Bedrock não tem regra para desligar. Bloquear isso exigiria vigiar a água em volta do jogador o tempo todo, e esse é o tipo de gambiarra pesada que evitei. Ficou como marco de progressão: no começo só há 1 balde e quase não há ferro.
- **Mundo montado à mão:** o `level.dat` foi montado sem passar pelo jogo. Se o mundo não abrir ou não sair plano, use os `.mcpack` num mundo infinito enquanto eu ajusto o arquivo.
