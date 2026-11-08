# Pouso Forçado — add-on para Minecraft Bedrock 26.30+

Sua nave caiu num deserto sem água. Recursos são escassos e a progressão vem por missões.
Projeto próprio, inspirado no modpack **Crash Landing** (Minecraft 1.6.4) e nos mods dele. As mecânicas e os números
seguem os originais; o código é todo próprio; texturas de terceiros só quando a licença deixa (ver `CREDITOS.md`).
A pesquisa dos mods e o plano das fases estão em `docs/pesquisa-mods.md`.

**Versão 1.13.0: todas as fases prontas** (0 a 23, com a 10, o final, feita por último), mais Mekanism (com os add-ons Generators, Tools e Additions), Ender IO, Create, Farmer's Delight, Quark, Immersive Engineering, Immersive Aircraft, Waystones, Mochila, Robô Minerador (ComputerCraft), Extra Utilities, redemoinhos do Weather2, BuildCraft, OpenBlocks e o Galacticraft até a Lua (com o final novo: o Núcleo de Salto). O plano das próximas versões está em `docs/proposta-galacticraft.md`.

## Fases até o fim

| Fase | O que entra | Situação |
|---|---|---|
| 0 | Estrutura do projeto, Condensador de Água, boas-vindas | pronta |
| 1 | Mundo plano de deserto: dunas, morros, templo soterrado, nave caída, sem água, sem animais, mais monstros à noite, minérios | pronta |
| 2 | Diário de Bordo: item com menu de missões, recompensas e progresso salvo por jogador; 12 missões dos primeiros dias | pronta |
| 3 | Máquinas de sobrevivência: Peneira, Compostor de Terra, Condensador Avançado, Estufa; +8 missões | pronta |
| 4 | Comida e vida: sede, temperatura do corpo, 5 qualidades de água, fruta do cacto, cápsulas de carga com animais; +8 missões | pronta |
| 5 | Energia: painel solar, moinho de vento, gerador a carvão, bateria, cabos, peneira automática; estufa e condensador avançado turbinados; +8 missões | pronta |
| 6 | Exploração: cidades abandonadas (prédios de até 9 andares, torre de rádio), masmorras comuns e fundas, Gerador de Monstros, tempestade de areia, destroços de outras naves; +7 missões | pronta |
| 7 | Perigos do deserto: Múmia, Golem de Areia (só na tempestade) e o chefe Faraó Amaldiçoado, acordado com o Ídolo Amaldiçoado; +6 missões | pronta |
| 8 | Consertar a nave: Painel da Nave com 4 sistemas (casco, computador de bordo, combustível, motor), Montadora (máquina de energia que faz as peças) e Terminal de Armazenamento (rede de baús tipo Applied Energistics); +8 missões | pronta |
| 9 | **Visual futurista e minimalista**: modelos 3D próprios para as 14 máquinas, texturas novas, telas e peças animadas, cabos que se conectam, partículas próprias e ícones novos das peças | pronta |
| 11 | **Diário 2.0** (capítulos e dependências como no Hardcore Questing Mode, entregar itens, recompensa "escolha 1", 5 sacolas de recompensa), **Catálogo** estilo JEI, **o que estou olhando** estilo WAILA, **Organizador** e reabastecimento estilo Inventory Tweaks, energia mostrada em **RF**, `/cl:diagnostico`; +5 missões | pronta |
| 12 | **Ex Nihilo + Ex Aliquo**: peneira por toques com as tabelas do Ex Nihilo (terra, cascalho, areia e poeira), 6 martelos, poeira, pedrinhas, pedaços de minério de ferro/ouro/cobre, barril de madeira e de pedra (compostagem, argila, obsidiana, slime...), cadinho (pedra vira lava, folhas viram água), cajado e bicho-da-seda; +13 missões | pronta |
| 13 | **EnviroMine + Hunger Overhaul**: hidratação de 0 a 100 e temperatura do corpo em °C com os números do EnviroMine (sol 50 °C, noite ÷ 9, suor, insolação/hipotermia I-III, congelamento), água salgada, Camel Pack, qualidade do ar e Máscara de Gás com filtros; comida do jogo com os valores do HO, regeneração só com fome ≥ 7, efeitos de fome/vida baixa, Bem Alimentado, animais mais lentos; +5 missões | pronta |
| 14 | **Pam's HarvestCraft**: 10 plantações (milho, tomate, cebola, alho, feijão, pimenta, pimentão, arroz, amendoim, fruta do cacto) com sementes na peneira no lugar das do jogo, crescimento lento do HO, colheita com a mão; 8 utensílios (Tábua de Corte, Panela, Frigideira, Caçarola, Assadeira, Pilão, Tigela de Mistura, Espremedor) e 35 receitas; Camel Pack na mão secundária e enchido pelo condensador; +10 missões | pronta |
| 15 | **Tinkers' Construct + Iguana Tweaks**: Padrão em Branco, Mesa de Moldes, Construtor de Peças e Estação de Ferramentas; 8 peças × 10 materiais; Picareta, Pá, Machadinha e Espada Larga montadas, com durabilidade, XP e nível da ferramenta, conserto, modificadores e nível de mineração do Iguana; +7 missões | pronta |
| 16 | **Fundição do Tinkers**: argamassa e tijolos refratários, fundição multibloco (até 4 camadas) com tanque de lava, dreno, torneira, mesa e bacia; metal em mB com minério rendendo o dobro; bronze (3 cobre + 1 estanho) e aço (ferro + carvão); moldes de ouro; peças e ferramentas de ferro, cobre, bronze e aço; estanho na peneira; +7 missões | pronta |
| 17 | **Thermal Expansion**: Estrutura de Máquina, Pulverizador (minério → 2 pós), Fornalha de Redstone, Fundidora de Indução (ligas e minério + areia), Serraria, Extrusora Ígnea, Precipitador Glacial, Dínamo de Redstone e 4 Células de Energia (de 400 mil a 50 milhões de RF); +6 missões | pronta |
| 18 | **Armazenamento**: Barril de Armazenamento do JABBA (upgrades estrutural, de armazenamento e núcleo de funil, chave), Carrinho e Carrinho de Diamante; Empacotador Automático; rede ME do Applied Energistics 1 (células 1k a 64k, Drive, Baú ME, Controlador, Ponto de Acesso, Terminal sem Fio, processadores na Montadora, certus na peneira) e Célula de Água do ExtraCells; o Terminal enxerga barris e células; +7 missões | pronta |
| 19 | **MineFactory Reloaded**: resina → borracha → plástico; Bloco de Máquina; Plantadeira, Colheitadeira (plantas, cana, cacto e árvores), Fertilizadora, Rancheiro, Triturador de Monstros, Esgoto + Compostadora (fertilizante), Quebrador e Colocador de Blocos, Esteira e Upgrades de Alcance; +7 missões | pronta |
| 20 | **PneumaticCraft (leve)**: Compressor de Ar, Tubos de Pressão (comum e avançado), pressão em bar igual na rede, tubos que estouram acima do perigo, Câmara de Pressão 3x3x3 a 5x5x5 com válvula e interface, ferro comprimido, diamante de carvão, placa de circuito, transistor e capacitor, manômetro; +5 missões | pronta |
| 21 | **Sync**: Núcleo Sync (leva o Coração do Faraó), Construtor de Corpos (amostra de sangue + 24.000 RF ou esteira com porco/lobo), Armazém de Corpos, troca de corpo com inventário próprio e acordar no corpo reserva ao morrer (casa ou o mais perto); sem sistema de vidas; +4 missões | pronta |
| 22 | **Big Reactors**: yellorium só pela peneira de poeira, grafite, reator multibloco de 3x3x3 a 7x7x7 (carcaça, vidro, barras de combustível e de controle, portas de acesso e de refrigeração, tomadas), fórmula fechada com moderador e inserção, cianita e Reprocessador (blutônio); Controlador e Tomada só no saque das cidades; +5 missões | pronta |
| 23 | **Chisel + BiblioCraft + ChickenChunks**: Cinzel (500 usos) e 48 variantes de arenito, pedra, mármore, calcário, casco da nave e vidro; veios de Mármore e Calcário; Estante, Prateleira, Suporte de Ferramentas, Expositor, Cabide de Armadura, Lanterna e Lâmpada; Carregador de Chunks (3x3) e Pontual; +5 missões | pronta |
| 10 | **Final**: botão Decolar no Painel da Nave com os 4 sistemas consertados, cena com a câmera do jogo (contagem, a nave subindo em fogo e fumaça), créditos, recompensa e modo infinito (capítulo Final com 5 missões); versão 1.0.0 | **esta versão** |

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
├── RP_menu/                pack do menu (panorama do avião, logo e dicas): vai em Recursos Globais
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
- `pouso-forcado.mcaddon` → **é este que você usa**: instala os dois packs e coloca um mundo plano "Pouso Forçado" novo na sua lista de mundos (com os packs dentro dele);
- `pouso-forcado.mcworld` → só o mundo, já com os packs dentro (plano B, se o `.mcaddon` não trouxer o mundo);
- `pouso-forcado_BP.mcpack` e `pouso-forcado_RP.mcpack` → só os packs, para usar num mundo infinito normal;
- `pouso-forcado_menu.mcpack` → só o pack do menu (também vem dentro do `.mcaddon`).

Outros comandos:
- `npm run texturas`: cria só as texturas que estiverem faltando (não apaga as suas). Para regerar todas: `node tools/gerar-texturas.mjs --force`.
- `npm run compilar`: só compila o TypeScript.
- `node tools/gerar-nave.mjs --force` / `node tools/gerar-relevo.mjs --force`: regeram a nave / as dunas, morros e o templo a partir do modelo em código.
- `python3 tools/gerar-wiki.py`: monta a wiki a partir de `docs/wiki/wiki.fonte.html`, com os ícones e as imagens embutidos: `docs/wiki/wiki.html` (página do Claude) e `docs/wiki/site/index.html` (o site).
- **Site da wiki:** https://pouso-forcado.vercel.app (projeto `pouso-forcado` na Vercel). Na Vercel ficam só `docs/wiki/vercel/index.html`, que busca a wiki mais nova no GitHub (`docs/wiki/site/index.html`), e o `vercel.json` com os atalhos de download `/baixar` (.mcaddon) e `/mundo` (.mcworld), que apontam para `dist/` deste repositório. Por isso, depois de um build novo, basta rodar `python3 tools/gerar-wiki.py`, fazer o commit e o push: o site e os downloads se atualizam sozinhos (em até ~5 min, o cache do GitHub).
- `node tools/gerar-panorama.mjs <bedrock-samples>/resource_pack`: redesenha o panorama do menu e o fundo da troca de dimensão (o avião caído com as texturas do jogo; uns 2 minutos). Precisa da pasta `resource_pack` do [bedrock-samples](https://github.com/Mojang/bedrock-samples). As imagens já vêm no repositório.

> Os arquivos `dist/pouso-forcado.mcaddon` e `dist/pouso-forcado.mcworld` já vêm no repositório, então dá para baixar direto no celular sem fazer o build.

## Como instalar no celular

### Android
1. Baixe o `pouso-forcado.mcaddon` (pelo navegador ou pelo app do GitHub).
2. Abra a pasta **Downloads** no gerenciador de arquivos e toque no arquivo.
3. Escolha **Minecraft** em "Abrir com". O jogo importa os dois packs e o mundo.
4. Se aparecer **"nenhum app pode abrir"**: mande o arquivo pelo **Telegram** (pode ser para você mesmo, em "Mensagens salvas") e toque nele dentro do Telegram → **Minecraft**. Funcionou num Android em que o gerenciador de arquivos, o ZArchiver e o botão Importar não funcionaram.

### iOS (iPhone/iPad)
1. Baixe o `pouso-forcado.mcaddon` pelo Safari. Ele vai para o app **Arquivos** (pasta Downloads).
2. No app Arquivos, toque e segure o arquivo → **Compartilhar** → **Minecraft**.
3. O jogo importa os dois packs e o mundo.

## Como jogar

1. **Jogar** → aba **Mundos**: aparece o mundo **Pouso Forçado**, já com os packs ativados. Não precisa ligar experimentos nem ativar nada.
2. Antes de entrar, você pode mudar dificuldade, trapaças etc. em **Editar**.
3. Cada vez que você importa o `pouso-forcado.mcaddon` de novo, entra mais uma cópia nova do mundo, útil para recomeçar do zero.

### Menu e tela de carregamento

O `.mcaddon` traz um terceiro pack, **Pouso Forçado (Menu)**: o deserto do jogo no fundo do menu e da tela de "Carregando..." (o fundo gira devagar e mostra, um depois do outro, o avião caído, os destroços de outra nave embaixo do sol, o templo soterrado e a cidade abandonada com a torre de rádio), o logo **Pouso Forçado** no lugar do logo do Minecraft e dicas do modpack embaixo da barra. Essas telas aparecem **antes** de o mundo carregar os packs dele, então este pack precisa ficar ligado no jogo todo:

1. **Configurações** → **Recursos Globais** (Global Resources).
2. Em **Meus Pacotes**, toque em **Pouso Forçado (Menu)** → **Ativar**.
3. Volte para o menu: o fundo e o logo já mudam. Para voltar ao normal, desative ali mesmo.

O fundo passa mais rápido ou mais devagar em **Configurações** → **Geral** → **Velocidade de Rolagem do Panorama**.

Ele não mexe em nada dentro dos mundos (vale para todos, até os normais). Dentro do mundo Pouso Forçado, a tela de troca de dimensão (ir e voltar do Nether) também mostra o avião caído, mesmo sem o pack do menu.

### Versões novas

- Cada versão nova vem como um **mundo novo**: importe o `pouso-forcado.mcaddon` de novo e aparece mais um mundo "Pouso Forçado" na lista.
- O mundo leva **dentro dele** uma cópia dos packs da versão em que foi criado. Os mundos antigos continuam como estavam, na versão deles.
- **Atualizar um mundo no celular (Android, sem exportar)**: importe a versão nova; duplique o mundo; na cópia, Editar → Pacotes de Comportamento: desative o Pouso Forçado e ative o que começa com a versão nova ("Versão x.y.z · Minecraft 26.30+"); o mesmo em Pacotes de Recursos. Ao entrar, `/cl:diagnostico` mostra a versão; se aparecer o aviso vermelho de duas versões, apague a cópia (o mundo original não muda). Testado pelo jogador na 1.16.3.
- **Atualizar um mundo exportado (PC/iPhone)**: no jogo, Editar o mundo → Exportar Mundo; no PC, `python3 tools/atualizar-mundo.py <mundo>.mcworld` troca só os packs do Pouso Forçado dentro dele pelos do build atual (o mapa, os baús e o progresso ficam). Importe o arquivo gerado: entra uma cópia chamada "Pouso Forçado (versão)" e o mundo antigo continua lá.
- Confira a versão na linha cinza do chat ao entrar: `[Pouso Forçado 0.16.0] mundo: plano | ...`.

## Novidades da 1.53.0 (Mekanism completo, parte 5: equipamentos, QIO e Robit)

- **Meka-Tool** (16 MJ) e **MekaSuit** (capacete, armadura, calça e botas, 16 MJ cada), com os **módulos** instalados na
  **Estação de Modificação** (segure a peça e toque a estação):
  - Meka-Tool: Energia (×2 a capacidade por unidade), Escavação (pressa), Ataque, Cultivo (ara em área), Toque Suave,
    Fortuna, Explosão (área), Veio (minérios e toras ligados), Teletransporte (usar: vai até onde olha, 100 blocos).
  - MekaSuit: Visão noturna, Respiração na água, Purificação (tira efeitos ruins), Nutrição (alimenta), Blindagem contra
    radiação, Dosímetro/Geiger, Recarga Solar, Jetpack, Modulação Gravitacional (jetpack que paira), Distribuição de Carga,
    Élitro (queda lenta), Locomoção (velocidade), Giroscópio (rapidez embaixo d'água), Geotérmico (carrega na lava),
    Propulsão (pulo), Atração Magnética (puxa itens), Passos Gelados, Repulsão Hidrostática (nadar rápido), Surfista da Alma.
  - A MekaSuit absorve dano gastando energia (100 kJ por ponto, dividido entre as peças) e segura a queda.
- **Desintegrador Atômico** (modos normal, veio e veio estendido), **Arco Elétrico** (flechas de energia; modo fogo),
  **Lança-Chamas** (hidrogênio; modos combate, calor e inferno), **Corredores Livres** (sem dano de queda), **Jetpack
  Blindado**, **Máscara e Tanque de Mergulho**, **Configurador** (gira máquinas), **Leitor de Rede**, **Dicionário**
  (etiquetas do bloco), **Conta-Gotas** (mostra/esvazia tanques), **Cantil** (pasta nutritiva), **Caixa de Papelão** (leva
  um bloco com o que tem dentro), **Baú Pessoal**.
- **QIO**: Matriz de Discos (4 discos do mod, até 12 por matriz), Painel (e o Painel Portátil), Importador, Exportador e
  Adaptador de Redstone, por frequência.
- **Robit**: nasce no Carregador de Chão; segue você, pega itens do chão, funde, volta para casa e recarrega no carregador.
- Diário: missões de Meka-Tool, módulos, MekaSuit, QIO e Robit.
- O que o Bedrock não deixa: voo livre (vira jetpack que paira), élitros no peito (vira queda lenta), passo alto do Servo,
  emitir redstone (o Adaptador só mostra a contagem). Ficaram de fora as máquinas de pigmento e pintura, a Montadora de
  Fórmulas, o Oredictionificador e a Mesa de Segurança.

## Novidades da 1.52.0 (Mekanism completo, parte 4: urânio, multiblocos e reatores)

- **Minérios de urânio, ósmio e estanho** com os números de geração do mod, mais pepitas, pós e blocos que faltavam.
- **Química nuclear**: bolo amarelo → óxido de urânio + ácido fluorídrico → hexafluoreto de urânio → **Centrífuga
  Isotópica** → combustível físsil; resíduo nuclear → plutônio (Centrífuga) ou polônio (**Ativador de Nêutrons Solar**);
  pastilhas; **Nucleossintetizador Antiprotônico** (antimatéria transforma itens). **Água pesada** pela Bomba Elétrica
  com Melhoria de Filtro → deutério no Separador; lítio → trítio no Ativador; deutério + trítio → combustível D-T.
- **Multiblocos** (montados como no mod; tocar mostra o painel):
  - **Tanque Dinâmico** (350.000 mB de fluido ou 16 milhões de mB de químico por bloco de dentro).
  - **Planta de Evaporação Térmica** (4×4, até 18 de altura: água → salmoura → lítio, com sol e aquecedores).
  - **Matriz de Indução** (células de 8 GJ a 4 TJ, provedores de 256 kJ/t a 131 MJ/t).
  - **Caldeira Térmica** (calor → vapor; Elementos de Superaquecimento e Dispersores de Pressão).
  - **SPS** (polônio + energia → antimatéria).
  - **Reator de Fissão** (combustível físsil + água → vapor + resíduo; dano e derretimento se faltar água).
  - **Turbina Industrial** (vapor → energia, com pás, bobinas, dispersores, ventilações e condensadores).
  - **Reator de Fusão** (D-T; acende com Hohlraum e 400 MJ de laser).
- **Aquecedor Resistivo**, **Aquecedor a Lenha**, **Condutores Termodinâmicos**, **Laser**, **Amplificador de Laser**,
  **Feixe Trator**, **Estabilizador Dimensional**, **Barril de Resíduos Radioativos**, **Liquidificador Nutricional**.
- **Radiação**: resíduo, plutônio e polônio soltos no mundo (máquina quebrada, derretimento) deixam o lugar radioativo;
  a dose dá fome, fraqueza, náusea e dano. **Roupa Hazmat** protege; **Contador Geiger** e **Dosímetro** medem.
- Diário: 9 missões novas (urânio, multibloco, indução, combustível físsil, Hazmat, fissão, turbina, antimatéria, fusão).

## Novidades da 1.51.0 (Mekanism completo, parte 3: armazenamento, logística e utilidades)

- **Chumbo**: minério normal e profundo (8 veios de até 9 por chunk, abaixo da altura 64, mais comum perto de -12),
  bruto, lingote, pepita, pó e blocos; o processamento ×2 a ×5 do Mekanism vale para ele. Com o chumbo entram as receitas
  que faltavam (Triturador, Combinador, Instaladores de Nível, Silenciador, Gerador de Pedra, Alarme Industrial).
- **Caixas** (Bins) Básica, Avançada, Elite e Definitiva: 4.096, 8.192, 32.768 e 262.144 de um item só. Funcionam como
  as gavetas (tocar guarda, bater tira; quebrada, leva tudo dentro).
- **Transmissores** nos 4 níveis, com o modelo e a arte do mod e a vazão de cada nível:
  - **Cabo Universal**: energia (entra na rede do pack, liga em tudo que os outros cabos ligam).
  - **Cano Mecânico** (água, lava, salmoura) e **Tubo Pressurizado** (químicos): ligam máquinas e tanques do Mekanism.
  - **Transportador Logístico**: itens entre baús e máquinas (1, 16, 32 ou 64 itens a cada meio segundo).
  - Tocar troca o modo: **TIRA** (miolo laranja: puxa do que está encostado) ou **RECEBE** (entrega).
- **Bomba Elétrica** (tira fluido de baixo; a água não acaba, a lava sim; baldes vazios no baú de cima voltam cheios) e
  **Plenificador Fluídico** (espalha o fluido em volta e embaixo).
- **Minerador Digital**: raio até 32, altura mínima e máxima, filtros de bloco (`#minerios` pega todos os minérios),
  modo Inverso e Toque Suave; guarda no baú de cima. Energia e tempo do mod (80 tiques por bloco).
- **Teletransportador**: moldura de 3 × 4 com o Teletransportador no meio de baixo; quem entra no vão vai para o mais
  perto da mesma frequência (pública ou privada). **Teletransportador Portátil** (carrega em qualquer carregador).
- **Entrelaçador Quântico**: tudo na mesma frequência é um lugar só (1 espaço de item, energia, fluido e químico).
- **Carregador de Chão** (carrega os itens com energia de quem fica em cima), **Classificador Logístico** (filtra itens
  de um baú para a frente), **Vibrador e Leitor Sísmico** (mostra o que tem embaixo, camada por camada) e **Alarme
  Industrial** (toca com o som do mod quando recebe redstone).
- **Robit** e **Núcleo de Teletransportação** (itens; o Robit de verdade vem na parte 5).
- Ícones 3D das máquinas do Mekanism agora mostram o modelo do mod (também os das partes 1 e 2).
- Diário: 9 missões novas (chumbo, caixa, cabo, canos, transportador, minerador, teletransporte, entrelaçador, sísmico).

## Novidades da 1.50.0 (Mekanism completo, parte 2: fábricas, melhorias e instaladores de nível)

- **Fábricas** (as 9 do mod: Fundição, Enriquecimento, Trituração, Compressão, Combinação, Purificação, Injeção, Infusão e
  Serragem), nos níveis **Básica, Avançada, Elite e Definitiva**: fazem 3, 5, 7 ou 9 operações por ciclo, com as receitas
  e o gasto da máquina de origem. Modelos 3D e arte do mod.
- **Instaladores de Nível**: tocar a máquina com o Básico a troca pela Fábrica Básica; o Avançado sobe a Básica, e assim
  por diante. Nada se perde (energia, químicos e melhorias ficam).
- **Melhorias** (tocar a máquina com a melhoria instala; quebrar a máquina devolve):
  - **Velocidade** (até 8): 8 deixam a máquina 10× mais rápida, como no mod, mas cada operação gasta mais energia.
  - **Energia** (até 8): corta esse gasto (8 de velocidade com 8 de energia gastam o mesmo por operação).
  - **Química** (até 8): a Purificação e a Injeção gastam menos gás.
  - **Silenciador**: sem som.
  - **Âncora**: mantém o chunk da máquina carregado (o Bedrock deixa só 10 áreas no mundo).
  - **Gerador de Pedra**: o Combinador não precisa de pedregulho.
  - **Filtro**: fica para a Bomba Elétrica (parte 3).
- Valem para todas as máquinas do Mekanism (as de antes e as da química). O WAILA mostra as melhorias instaladas.
- Diário: missões novas de melhoria e de fábrica.

## Novidades da 1.49.0 (Mekanism completo, parte 1: minério ×5 e a química)

Começo do Mekanism completo (10.7.19, o mais novo), com as receitas, os números, a arte e os modelos 3D do mod:
- **Minério ×5**: a **Câmara de Dissolução Química** (minério + ácido sulfúrico = 1.000 mB de pasta suja), o **Lavador
  Químico** (pasta suja + 5 vezes mais água = pasta limpa) e o **Cristalizador Químico** (200 mB de pasta limpa = 1 cristal).
  O cristal vai à Câmara de Injeção (estilhaço) e segue o caminho do ×4. Ferro, ouro, cobre e estanho.
- **Ácido sulfúrico**: o **Oxidador Químico** (pó de enxofre = dióxido de enxofre), o **Infusor Químico** (agora com as 3
  receitas do mod: cloreto de hidrogênio, trióxido de enxofre e ácido sulfúrico) e o **Condensentrador Rotativo** (água ⇄
  vapor d'água; agachado e tocando, inverte). Enxofre: pólvora na Câmara de Injeção, ou carvão na Câmara de Reação.
- **Câmara de Reação Pressurizada**: biocombustível + água + hidrogênio = substrato e eteno; substrato + eteno + oxigênio =
  **PEAD** (o plástico do Mekanism: pellet, barra, folha e vareta); carvão e madeira viram hidrogênio.
- **Tanques de Químico e de Fluido** (Básico, Avançado, Elite e Definitivo, com as capacidades do mod: 64 a 8.192 baldes e
  32 a 256 baldes). Cilindro ou balde cheio no baú de cima esvazia no tanque; vazio no baú de cima sai cheio embaixo.
  Quebrado, o tanque leva o que tem dentro.
- **Barril Pessoal** (54 espaços; só quem pôs abre e recolhe), o **Tanque Dinâmico** (por enquanto o bloco, para as receitas)
  e o **minério de fluorita** (embaixo da terra, como no mod).
- As máquinas guardam os cilindros vazios e enchem um quando juntam 1.000 mB; o gasto de energia é o do Mekanism.
- Diário: quatro missões novas no capítulo do Mekanism.

## Novidades da 1.48.0 (inventário do criativo por mod)

- O Bedrock não deixa criar aba nova no criativo. Então **tudo do modpack fica numa aba só, a última (Natureza)**, depois
  das coisas do jogo: um grupo recolhível por mod, na ordem do pack, com os add-ons logo depois do mod deles (Mekanism,
  Generators, Additions, Tools). Os mods enormes têm alguns subgrupos seguidos (Tinkers: ferramentas, peças, moldes e
  padrões; Chisel por família; HarvestCraft: comidas, sementes e mudas). O livro de receitas segue a mesma arrumação.
- Ícones planos para todos os blocos de planos cruzados (cristais, plantas silvestres, mudas, hortas).

## Novidades da 1.47.0 (Pam's HarvestCraft 2, o mais novo)

- **86 plantações novas** (todas do HarvestCraft 2 Crops), de agave a abobrinha, cada uma com semente, os 3 estágios e o
  valor de fome do mod (pela regra do Hunger Overhaul). As do deserto (hortas áridas) crescem melhor no deserto.
- **Hortas silvestres** (6, como no mod): árida (deserto e mesa), gelada (taiga), sombria (floresta), úmida (pântano),
  tropical (selva) e ventosa (planície e savana), 1 a cada 20 chunks, em moitas. Quebrar dá uma colheita da região;
  farinha de osso espalha a horta (até 10 juntas).
- **Árvores frutíferas** (49 do HarvestCraft 2 Trees): nascem nas florestas (temperadas, quentes e de coníferas, cada
  uma 1 em 90 chunks) com os frutos pendurados embaixo das folhas. O fruto vai de flor a verde a maduro (cerca de
  48 min); toque no maduro para colher. Muda = 8 frutos + 1 muda de carvalho. A maçã dá a maçã do jogo; a teia, linha;
  a casca-de-papel, papel.
- **Comidas do Food Core** (182) e as do forno (31: legumes assados, castanhas torradas, chá e café quentes), com
  fome, hidratação e temperatura como as outras do HarvestCraft. Utensílio novo: **Rolo de Massa** (macarrão, óleo de
  cozinha). Receitas das plantações: linha das fibras, papel, açúcar de agave, gravetos e tocha de taboa, balde d'água
  do cacto-barril, garrafas de cabaça, pão de grãos.
- Diário: cinco missões novas (horta silvestre, Rolo de Massa, macarrão, pomar e fruta do pé).
- Arte toda própria (a do HarvestCraft 2 é de todos os direitos reservados).

## Novidades da 1.46.0 (Ex Nihilo: Sequentia, o mais novo)

- **Malhas da peneira**: barbante, sílex, ferro, diamante, esmeralda e netherita (arte do mod). Toque na peneira com a
  malha para pôr; agachado de mão vazia tira. Com malha, a peneira usa a tabela do Sequentia: cada achado sai com a
  chance da melhor malha até a sua (ex.: no cascalho, pedaços de ferro 25% com malha de diamante; diamante e
  esmeralda 0,8% com malha de ferro e 1,6% com malha de diamante). Sem malha, continua a tabela de antes.
- **Peneiras em grupo**: tocar uma peneira também peneira as carregadas até 2 blocos dela, como no mod.
- Diário: duas missões novas (malha de ferro e diamante da peneira).

## Novidades da 1.45.0 (Chisel 1.18, o mais novo)

- **Cinzel de Diamante** (5.056 usos) e **Cinzel Hi-Tech** (10.048) com os modos do mod: um bloco, **painel 3×3**,
  coluna 3×1 e linha 1×3; o Hi-Tech também troca os blocos iguais ligados (até 10 de distância). Agachado e usando no
  ar, escolhe o modo. O Cinzel de ferro passa a 512 usos, como no mod.
- **Cinzel Automático**: toque nele com a variante que quer; os blocos da mesma família no baú de cima saem trocados no
  de baixo.
- **40 variantes novas** com a arte do Chisel: arenito e arenito vermelho (trançado, caótico, circular, ornamentado,
  prisma, ladrilhos...), **templo** (tijolos, coluna, placa, ornamentado...), **fábrica** (chapeado, circuito, perigo,
  ferrugem, armação...) e **laboratório** (xadrez, piso, medalhão, painéis...).
- Diário: três missões novas no capítulo de decoração.

## Novidades da 1.44.0 (PneumaticCraft: Repressurized 8.2, o mais novo)

- **Compressor de Ar Avançado**: 50 mL/t (5× o comum) com o mesmo combustível; aguenta a rede de tubos avançados.
- **Compressor Líquido**: baldes de combustível líquido viram ar (biodiesel e combustível do BuildCraft 1.000.000 mL,
  etanol 400.000, petróleo 200.000) e o balde volta vazio.
- **Câmara de Pressão** com as receitas novas do mod: 4 neves → gelo (1,5 bar), 4 gelos → gelo compacto (2 bar),
  4 gelos compactos → **gelo azul** (2,5 bar), pedra → **Pedra Comprimida** (1 bar), trigo → 3 farinhas (1,5 bar) e
  ouro + 2 redstones → Pá de Turbina.
- Diário: três missões novas no capítulo do PneumaticCraft.

## Novidades da 1.43.0 (BuildCraft 8, o mais novo)

- **Motor de Redstone** (com sinal de redstone, 0,05 MJ/t) e **Motor Stirling** (com redstone, queima o combustível do
  forno a 1 MJ/t; 1 MJ = 10 RF).
- **Poço de Mineração**: cava em linha reta para baixo, um bloco por segundo (16 × (dureza + 1) × 2 MJ cada), e põe
  os itens no baú de cima.
- **Comporta**: baldes de água ou lava no baú de cima enchem o buraco mais fundo embaixo dela.
- **Enchedor** com **Marcos**: dois Marcos nos cantos opostos (até 64 blocos) marcam a área; toque no Enchedor e
  escolha Limpar, Encher, Caixa ou Pirâmide (blocos do baú de cima; quebrar custa como minerar, pôr custa distância × 10
  MJ).
- Arte do BuildCraft (MMPL). Diário: capítulo BC 8.

## Novidades da 1.42.0 (Thermal Expansion 11, o mais novo)

- **Dínamos novos** (40 RF/t, combustível no baú de cima): **Stirling** (carvão 24.000 RF, bloco de carvão 240.000,
  coque 40.000, pó de blaze 12.000), **Magmático** (balde de lava 100.000, devolve o balde), **Lapidário** (diamante
  500.000, esmeralda e safira lunar 125.000, lápis, quartzo, ametista e prismarinho 40.000), **Gourmand** (qualquer
  comida: fome × 1.600 RF) e **Desencantamento** (tira os encantamentos do item e vira energia; o livro encantado volta
  como livro).
- **Insolador Fitogênico**: com água encostada, multiplica sementes, mudas e flores (as chances do mod; 20.000 RF por
  colheita, mudas 60.000).
- **Pirolisador**: toras → carvão vegetal + 125 mB de creosoto; carvão → coque + 250 mB (baldes vazios saem cheios).
- As máquinas do Thermal trabalham a 20 RF/t, como no mod. Arte própria. Diário: capítulo Thermal 11.

## Novidades da 1.41.0 (Galacticraft 5, o mais novo)

- O Galacticraft 5 (a versão nova, reescrita) é MIT, inclusive a arte: as máquinas (coletor, compressores, fabricador
  de circuitos, distribuidor e carregador), a bancada e a plataforma do foguete, a rocha, a terra, o solo e os minérios
  da Lua, as peças do foguete, os tanques, a máscara e o equipamento de oxigênio agora têm a **arte original** (50 trocas).
- **Blocos novos da Lua**: basalto lunar (e tijolos), ardósia lunar, pedregulho, rocha polida, tijolos, rachados,
  entalhados e pilar de rocha lunar, vidro lunar e a **safira lunar** (minério, gema e bloco). O basalto, a ardósia e a
  safira aparecem no fundo da Lua.
- Diário: missões da safira e do basalto no capítulo do Galacticraft.

## Novidades da 1.40.0 (Extra Utilities 2, o mais novo)

- **Espinhos** de madeira, ferro, ouro e diamante: a cada 0,5 s ferem quem está em cima (1, 4, 2 e 8). Os de madeira
  não matam; quem morre nos de ouro solta XP; os de diamante contam como golpe do jogador (sai o saque de jogador).
- **Lírio Ender**: semente das masmorras (e o lírio nasce no End). Cresce num relógio, 8 estágios, ~2,3 h no end stone
  e 4× mais devagar em outro chão; farinha de osso faz ele voltar. Maduro: toque e colha uma **pérola do Ender**.
- **Orquídea Vermelha**: nasce nas cavernas abaixo de y 16 em cima do minério de redstone e só cresce nele; aceita
  farinha de osso; madura dá **redstone**.
- **Laço Dourado** (bichos pacíficos) e **Laço Amaldiçoado** (monstros): toque no bicho para guardar, num bloco para
  soltar.
- **Tocha Magnum** (nenhum monstro nasce num raio de 64, 32 de altura) e **Candelabro** (raio de 16).
- Arte própria (o Extra Utilities é fechado); números das páginas do mod no wiki do FTB. Diário: capítulo XU 2.

## Novidades da 1.39.0 (CC: Tweaked 1.121, o mais novo)

- **Robô com ferramentas trocáveis** (os upgrades das turtles): toque o robô parado com uma ferramenta de diamante ou
  netherita e ele troca (a antiga volta para você). **Picareta**: túnel e escavar, como antes. **Machado**: anda numa
  linha de 16 ou 32 cortando as árvores inteiras e replantando as mudas que tiver. **Enxada**: colhe e replanta a
  plantação 5×5 ou 9×9 à frente (ele anda por cima). **Espada**: guarda a área, 8 de dano nos monstros a 3 blocos.
- **Combustível com limite**, como no mod: 20.000 no robô comum e 100.000 no **Robô Minerador Avançado** (de ouro).
- **Monitor**: toque e escreva; o texto aparece grande na frente da tela (`|` quebra a linha).
- **Impressora**: com papel e tinta (corante preto ou bolsa de tinta), imprime uma **Página Impressa** com título e
  texto; agachado com couro, junta as páginas num **Livro Impresso**.
- **Alto-falante**: toque toca a nota (sobe meio tom); agachado troca o instrumento (16); com redstone, toca sozinho.
- Arte do CC: Tweaked (CCPL e MPL-2.0). Diário: capítulo CC: Tweaked.

## Novidades da 1.38.0 (Immersive Engineering 12.4, o mais novo)

- Máquinas novas do IE (aqui em bloco único: baú de entrada em cima, de saída embaixo, energia da rede), com os RF por
  operação das receitas do mod:
  - **Prensa de Metal** com moldes (chapa, engrenagem, haste e desembalar): chapas e engrenagens dos metais do pack e
    haste de blaze com 5 pós de blaze.
  - **Triturador**: minério → 2 pós, minério bruto → 1 pó + 33%, e o **arenito vira areia com 50% de Pó de Salitre**.
  - **Serraria**: tora → 6 tábuas + serragem.
  - Linha do **biodiesel**: **Espremedor** (sementes → óleo vegetal), **Fermentador** (cana, batata, maçã, mel... →
    etanol), **Refinaria** (1 balde de óleo + 1 de etanol, com salitre → 2 baldes de biodiesel) e **Gerador a Diesel**
    (4.096 RF/t; o balde de biodiesel dura 250 ticks, o de creosoto 20). Baldes vazios no baú de cima saem cheios.
  - **Gerador Termelétrico**: quente de um lado e frio do outro (lava 1.300 K, gelo compacto 240 K...) dá
    √(diferença)/2 RF/t por eixo.
  - **Campânula de Jardim**: semente e solo no baú de cima; colhe sozinha (8 RF/t, 40 plantas do mod).
- Arte própria (a do IE pede permissão). Diário: capítulo Immersive Engineering 12.

## Novidades da 1.37.0 (Quark 4.1, o mais novo)

- **Corindo** em 9 cores: cristais que brilham nas paredes das cavernas e crescem aglomerados; **Lâmpadas de Cristal**
  (corindo + redstone) acendem com redstone (luz 15).
- **Caixa de Monstros** nas cavernas fundas: chegou perto (2,5 blocos), ela rosna e solta 5 a 8 monstros; quem cai para
  você deixa um saque extra (minério bruto, diamante, discos, maçã dourada...).
- **Cocho**: ponha comida (trigo, cenoura, sementes, feno, cacto...) e os bichos em volta procriam sozinhos.
- **Calha** (deixa cair o que vem do funil/baú de cima) e **Barra de Ferro** (o pistão que a empurra quebra o bloco da
  frente).
- **Colher de Pedreiro** (põe um bloco ao acaso da barra de itens), **Bolsa de Sementes** (640 sementes; use no ar para
  guardar, na terra arada para plantar, agachado planta 3×3), **Ábaco** (mede distâncias), **Nuvem Engarrafada**
  (garrafa vazia na altura das nuvens; põe um bloco no ar por 10 s), **Slime no Balde** e **Cacos de Vidro**.
- Construção: **banquinhos** de 16 cores (dá para sentar), tijolos de arenito (normal, vermelho e de almas), arenito de
  almas, tijolos de ferro, ouro e cobre brutos, barras de ouro, toras ocas, postes e a **Batatinha**.
- Ajustes do mod: enxada colhe capim e flores em 3×3 (5×5 de diamante), ferramenta quebrada é trocada por outra igual do
  inventário, porcos têm 2 a 3 filhotes, élitro sobre fogueira com feno embaixo sobe, escada na escada estende para
  baixo, vexes somem com o evocador. Jaspe agora nasce no deserto e xisto no frio.
- Arte e modelos 3D do próprio Quark (CC BY-NC-SA 3.0). Diário: capítulo Quark 4.1.

## Novidades da 1.36.0 (Extreme Reactors 2.4, o mais novo)

- **Turbina** (multibloco de 3 a 9 de lado): Carcaça nas arestas; nas faces Vidro, Controlador, **Mancal do Rotor**,
  Tomadas e Portas de Fluido; dentro o **Eixo** saindo do mancal, **Pás** encostadas no eixo (25 mB/t de vapor cada) e
  **bobinas** (blocos de metal encostados no eixo) com a eficiência do mod: ferro 1,0, cobre 1,2, bronze 1,4, aço 1,5,
  ouro 2,0, netherita 2,2, manyullyn 3,5, ludicrita 5,23, ridiculita 7,47 e inanita 9,76.
- **Refrigeração ativa**: a Porta de Refrigeração do reator encostada numa Porta de Fluido da turbina manda **vapor**
  (com água em baldes no baú da porta) em vez de energia; a turbina rende bem mais que o reator sozinho.
- **Moderadores novos** no reator (moderação do mod): blocos de ferro e cobre 1,40, ouro 1,45, diamante e esmeralda
  1,50, netherita 1,65, vidro 1,10, bronze, aço e estanho.
- **Ligas raras** no Reprocessador (2 lingotes + 1 cianita): blutônio → **ludicrita** → **ridiculita** → **inanita**,
  e os blocos delas (com cristal do End, estrela do Nether e bloco de netherita), as melhores bobinas.
- Ideias e números do código do mod (arte própria). Diário: capítulo Turbina.

## Novidades da 1.35.0 (Waystones 26.3, o mais novo)

- **Viajar custa experiência** como no mod novo: 0,01 ponto por bloco (até 27; outra dimensão 27), saindo de uma
  Pedra do Caminho ou da Pedra de Viagem. A **Pedra de Viagem** não tem mais espera: tem 10.000 de durabilidade e gasta
  80 por viagem.
- **9 variantes** da Pedra do Caminho (musgosa, de arenito, negra, de ardósia, do Ender, do Nether, púrpura, de
  prismarinho e de lama).
- **Pedras de Partilha** de 8 cores (cobre, prismarinho, ouro, diamante, ametista, lápis, esmeralda, redstone): toda
  pedra da mesma cor leva a qualquer outra, sem precisar ativar e sem custo.
- **Pedras-Porto** (abrem a lista, mas ninguém viaja para elas) e as **Pedras de Viagem coloridas** (a rede da cor).
- **Placa de Dobra**: toque com um **Fragmento Dormente** (vira Sintonizado) e leve-o a outra placa para ligar as duas;
  fique 2,5 s em cima de uma para ir à outra.
- **Pergaminho em Branco**: toque numa Pedra do Caminho e ele vira **Pergaminho Vinculado** àquela pedra (uma viagem).
- O Waystones novo é "todos os direitos reservados": ideias e números do mod, arte própria. Diário: capítulo Viagens+.

## Novidades da 1.34.0 (Farmer's Delight 1.3.0, o mais novo)

- **Tortas em bloco** (Maçã, Cheesecake de Frutas Vermelhas, Chocolate): põe na mesa e toque para servir 4 fatias
  (cada fatia dá velocidade, como no mod). A torta de abóbora e o bolo do jogo cortam na tábua.
- **Banquetes**: Frango Assado, Abóbora Recheada (feita na panela, servida na abóbora), Presunto com Mel, Torta do
  Pastor, Salada Brilhante (4 pratos cada, com tigela) e a Travessa de Rolinhos (8 rolinhos).
- Bebidas: Garrafa de Leite, Chocolate Quente (tira um efeito ruim), Sidra de Maçã (absorção), Suco de Melancia (cura),
  Picolé de Melancia (apaga o fogo), Creme de Baga Brilhante; biscoitos de frutas e de mel, rolinhos de salmão e de
  bacalhau, rolo de alga, Salada do Nether, presunto (porco abatido com faca) e presunto defumado, Massa de Torta.
- **Composto Orgânico** vira **Solo Rico** com o tempo; o Solo Rico faz crescer mais rápido o que está em cima e as
  plantações encostadas, e cogumelo em cima vira **colônia** (dá vários cogumelos).
- **Rede de Segurança** (sem dano de queda, quica), Tapete de Lona, Tatame, Fardo de Arroz, **armários** de 11 madeiras
  (a tela de baú do jogo), **cestos** que juntam o que cai em cima, Faca de Netherita, Ração de Cachorro e de Cavalo
  (vida e força por 5 min) e a casca de árvore (tora na tábua com machado).
- **Plantas selvagens** pelo mundo: repolho e beterraba marinha na praia, tomate na savana, cebola na floresta, cenoura
  na planície, batata na taiga, arroz no pântano e o arbusto arenoso no deserto.
- Arte original do mod (MIT). Diário: capítulo Banquetes.

## Novidades da 1.33.0 (Iron Jetpacks e TorchMaster)

- **Jetpacks** (Iron Jetpacks, o mais novo, com a arte do mod): Madeira, Pedra, Cobre, Ferro, Bronze, Ouro, Aço,
  Diamante, Esmeralda e Criativo, com a capacidade, o gasto de RF e as velocidades do mod. Vestido no peito: **segure o
  pulo para subir**; no ar, sem pular, ele **paira** (agachado desce mais rápido; agache duas vezes no ar para
  ligar/desligar o pairar). Correndo vai mais rápido e gasta mais. Pousar depois de voar não machuca.
- Peças do mod para fazer: Célula, Propulsor e Capacitor de cada material, as 4 Bobinas e a Alça (receitas do mod);
  cada jetpack é feito com o do tier de baixo.
- Carregam nos **Carregadores do Ender IO** (o com fio e o sem fio; o sem fio carrega até o jetpack vestido).
- **Mega Tocha** (TorchMaster, com a arte do mod): nenhum monstro nasce sozinho a 64 blocos dela.
- **Lanterna Sinalizadora**: acende o escuro num raio de 24 blocos com luzes invisíveis (quebrar apaga).
- O **Túmulo** já existia (OpenBlocks, 1.3.0): agora espera as ferramentas Vinculadas à Alma voltarem e leva os
  artefatos junto; com "manter inventário" ligado, não faz túmulo.
- Diário: capítulo Jetpacks e Tochas.

## Novidades da 1.32.0 (Iron Chests e Storage Drawers 13.2)

- **Baús maiores** (Iron Chests, com a arte do mod): Cobre 45, Ferro 54, Ouro 81, Diamante, Cristal e Obsidiana 108
  (o de Obsidiana aguenta explosão) e o Baú de Terra 9000! (1 espaço). Abrem com a tela de baú do jogo, em páginas de 27
  (agachado + tocar troca de página). **Bater no baú guarda o baú com tudo dentro** (como uma caixa de shulker); pôr de
  novo devolve tudo.
- **Melhorias de baú**: tocar um baú (inclusive o baú normal do jogo) com a melhoria troca o baú sem tirar nada.
- **Gavetas** (Storage Drawers, com a arte do mod): 1×1 (32 pilhas), 1×2 (2 × 16) e 2×2 (4 × 8) de um item só. Toque
  com o item para guardar (dois toques, ou de mão vazia: tudo daquele item da mochila); bata para tirar uma pilha
  (agachado: um). Agachado e de mão vazia: o menu com o que tem e as melhorias.
- **Gaveta Compactadora**: guarda bloco, lingote e pepita do mesmo material juntos (põe pepita, tira bloco).
- **Controlador de Gavetas**: guarda em todas as gavetas encostadas (a rede do mod, com o Acabamento de Gaveta).
- **Melhorias de armazenamento** I a VII (×2, ×4, ×8, ×16, ×64, ×256, ×2048, somadas como no mod), de **Vazio** (o que
  sobra some) e a **Chave** (trava o item da gaveta). Quebrada, a gaveta guarda tudo no item.
- Receitas que batiam com as do jogo ou de outros blocos foram trocadas: Bigorna do Tinker (3 blocos de ferro e 4
  tijolos refratários), Aquecedor (tijolos refratários em volta de uma fornalha) e Baú de Cobre (com um vidro em cima).
- Diário: capítulo Baús e Gavetas.

## Novidades da 1.31.0 (Artifacts 15.1 e a mochila que abre na mão)

- **Mochila na mão**: usar a mochila abre um menu sem pôr no chão: guardar tudo da mochila do jogador (a barra rápida
  fica), guardar um item, tirar um item ou tudo. Agachado, usar põe no chão (a tela completa de antes).
- **Artifacts** (o mais novo, com a arte do mod): os 46 artefatos com os números do mod — Nuvem na Garrafa (pulo
  duplo), Pantufas de Coelho (sem dano de queda), Tênis de Corrida, Nadadeiras, Tênis Aquático (corre sobre a água),
  Flamingo de Hélio (voa 8 s), Óculos de Visão Noturna, Snorkel, Luva de Força, Luva Vampírica, Manopla de Fogo,
  Pistão de Bolso, Pulseira Murcha, Garras, Anzol Dourado (+50% de XP), Cachecol da Sorte (Fortuna +1), Aquecedor de
  Picareta (funde minério), Chapéu Supersticioso (Saque +1), Chapéu de Aldeão (preços menores), pingentes de Choque,
  Chama e Espinhos, Colar do Pânico, Colar de Cruz, Caveira de Obsidiana, Frasco de Antídoto, Atrator Universal,
  Coração de Cristal, Totem de Coro (salva de um golpe fatal), Motor de Dobra (pérola sem gasto), Pantufas de Gatinho
  (creepers fogem), Botas de Raízes, Sapatos de Lavagante e mais; Guarda-Chuva, Almofada de Pum, Carne Infinita e Bife
  Eterno (não acabam).
- **Tela de Artefatos**: 7 espaços (cabeça, rosto, pescoço, cinto, 2 de mãos e pés). Usar o artefato equipa; usar
  agachado ou o **Estojo de Artefatos** (couro e ouro) abre a tela. Achados nos baús das masmorras, da pirâmide, do
  templo e dos destroços.
- Conserto: as ferramentas antigas do Tinkers (1.30.0) não estavam saindo na pirâmide; agora saem.
- Diário: capítulo Artefatos e a missão Mochila na mão.

## Novidades da 1.30.0 (Tinkers' Construct 3 completo, parte 5 de 5: modificadores, Bigorna e o resto do mod)

- **Modificadores do TC3** com os números do mod: Pressa (até 5), Diamante (nível 3), Esmeralda, Netherita (+20% de
  durabilidade e nível 4), Fortuna (3 níveis, cada um com a receita do TC3), Repulsão, Artrópodes, Reforçado, Afiado,
  Fogo, Golpeada, Antiaquático, Magnético, Decapitação, Vinculada à Alma (a ferramenta volta com você ao renascer),
  Slime extra (+25 por bola, sem espaço) e as **habilidades** (espaço próprio): Autofundir, Toque Sedoso, Expandido
  (área maior), Derreter, Inquebrável e Brilho (toque para pôr luz). Cada ferramenta tem os espaços de melhoria e de
  habilidade do TC3.
- **Bigorna do Tinker** (e a Chamuscada): monta as ferramentas de 4 peças e aplica os modificadores de mais de 3 itens.
  A Estação de Ferramentas agora monta só as de até 3 peças, como no TC3.
- **Mesa de Modificadores**: tira um modificador com 1 esponja molhada (o espaço volta). **Estação de Criação**: bancada.
- **Baús de Peças, de Moldes e do Tinker** (54 pilhas): toque com o item para guardar, de mão vazia para tirar; quebrado,
  solta tudo.
- **Livros** (Materiais e Você com os números de cada material, Fundição Pequena, Poderosa e Fantástica, Geringonças) e a
  **Enciclopédia** (os 5 juntos, com a lista dos modificadores).
- **Ferramentas antigas** nos baús da pirâmide do deserto: Picareta de Guerra e Lavador (atiram flecha), Machado do
  Minotauro (investida), Placa de Batalha e Panela de Fusão (escudo na mão secundária; a Panela funde o que quebra).
- **Cajados de slime**: Céu (salto), Terra (onda de choque), Icor (bola de fogo), Ender (teleporte de até 32 blocos).
- **Geringonças**: EFLN (explode onde cai), Bola Brilhante (luz onde cai), Estilingue de Slime, Estacas Punji e a
  **Mochila de Porco** (leva um animal guardado e solta onde você olha).
- Diário: Bigorna, Habilidade, Enciclopédia e Ferramenta antiga. Toda a arte é a do TC3.

## Novidades da 1.29.0 (Tinkers' Construct 3 completo, parte 4 de 5: a Fundição inteira)

- **Fusor + Aquecedor**: a fundição de um bloco do TC3. Combustível no Aquecedor (carvão, bloco de carvão, vara de
  blaze, balde de lava), itens no baú em cima do Fusor (ou toque com eles), torneira do lado. Minério não dobra no Fusor.
- **Ligador**: puxa os líquidos dos Fusores encostados e faz as ligas.
- **Fundição Fantástica** (chamuscada): como a Fundição, mas não faz liga e dá **subproduto** dos minérios (ferro dá
  aço, ouro dá cobalto, cobre dá ouro, ósmio dá ferro). Tijolo chamuscado: Argamassa do Nether (areia das almas, creme
  de magma e cascalho) na fornalha.
- **Calha**: o baú encostado nela alimenta a fundição. **Canal**: a torneira enche várias mesas em fila.
- **Moldes de areia**: areia na Mesa de Fundição + toque com uma peça = molde que serve uma vez (a peça fica com você).
- Blocos de construção refratários e chamuscados (pedra, pedregulho, pavimento, tijolos rachados, finos, pequenos,
  triangulares, de creeper, ladrilho, estrada, lanternas, vidros de alma, fumê e chamuscado), mesa, bacia, tanque e dreno
  chamuscados — tudo com a arte do TC3 (os blocos de antes da Fundição também ganharam a arte nova).

## Novidades da 1.28.0 (Tinkers' Construct 3 completo, parte 3 de 5: armaduras e armas)

- **Armadura de Placa** de 20 materiais (cobre, ferro, ouro, alumínio, pedra carbonizada, pedra chamuscada,
  obsidiana, ósmio, ferro-porco, ouro rosa, bronze de ametista, bronze, aço, cobalto, aço de slime, hepatizão,
  manyullyn, slime da rainha, slime de brasa, slime-cavaleiro), com a proteção e a durabilidade do mod e a aparência do
  mod no corpo. Sai na bancada com o material e a **Malha** (4 correntes).
- **Equipamento de Viajante** (couro e cobre) e **Traje de Slime** (slime do céu congelado): as **Botas de Slime**
  não deixam se machucar na queda e fazem quicar; as **Slimélitros** planam.
- **Escudos** (de Viajante e de Placa): na mão secundária, agache para segurar os golpes.
- **Arco Longo** e **Besta** de 26 materiais: o material do braço muda a força, a durabilidade e a velocidade de puxar.
- **Shuriken**, **Machado de Arremesso** e **Dardo** (sílex, ferro, cobalto, manyullyn): o machado e o dardo caem para
  pegar de volta.

## Novidades da 1.27.0 (Tinkers' Construct 3 completo, parte 2 de 5: o mundo dos slimes)

- **Ilhas de slime** com as 20 ilhas originais do mod (5 formatos de cada tipo): de Slime-do-Céu e de Slime-da-Terra
  flutuando no céu do deserto, de Sangue no mar de lava do Nether e de Slime-do-Ender no End, com árvores, capim,
  trepadeiras, lagos de slime e slime congelado. Raras, como no mod.
- **Blocos novos**: terra, grama, folhas, capim, mudas e trepadeiras de slime nas cinco cores do mod (terra, céu, icor,
  ender, sangue); troncos e tábuas de Coração-Verde, Raízes-do-Céu, Cogumelo Sangrento e Casca-Ender; slime
  congelado e blocos de slime (amortecem a queda e fazem quicar).
- **Mudas de slime** viram árvore sozinhas (ou com farinha de osso). **Geodos de slime** no subsolo, no Nether e no
  End: as drusas fazem brotar cristais.
- **Slimes novos**: Slime-do-Céu (nas ilhas do céu, solta bolas de slime do céu), Slime-do-Ender (teleporta) e
  Terracubo. As bolas e os cristais derretem na Fundição: com eles saem o Aço de Slime (ferro + slime do céu + pedra
  carbonizada), o Slime de Brasa e o Slime-Cavaleiro, e a madeira de slime vira material de ferramenta.

## Novidades da 1.26.0 (Tinkers' Construct 3 completo, parte 1 de 5)

O Tinkers' Construct 3.12.1 (o mais novo) entrando inteiro, em partes. Nesta: materiais, peças e ferramentas de mão.
- **40 materiais do TC3** com os números e o **traço** de cada um: Coro, Pedra Carbonizada, Pedra Chamuscada,
  Madeira de Slime, Osso Venenoso, Osso Necrótico, Ósmio, Ferro-Porco, Cobalto, Aço de Slime, Nahuatl, Pedra Branca,
  Hepatizão, Manyullyn, Slime da Rainha, Osso de Blaze, Slime de Brasa, Slime-Cavaleiro, Madeira Tratada e as cordas e
  trepadeiras de ligação. Os traços funcionam: Magnético puxa itens, Lacerante faz sangrar, Saboroso dá para morder,
  Anão minera mais rápido no fundo, Slimebilidade cria um escudo de slime... (veja "Traços desta ferramenta" na Estação).
- **Ferramentas novas**: Martelo de Mineração (quebra o veio inteiro), Chibanca (machado + pá + enxada, ara a terra),
  Picarenxó (picareta + pá, faz caminho), Kama (colhe e replanta), Foice (corta e colhe em 3×3×3), Adaga, Espadão
  (arranca cabeças). Peças novas: Cabeça de Enxó e Lâmina Grande. As ferramentas usam as peças do TC3 (a Espada é
  lâmina pequena + 2 cabos, por exemplo).
- **Cobalto** no Nether (precisa de ferramenta de ferro) e as **ligas do TC3** na Fundição: Ferro-Porco (ferro + sopa de
  carne de animais derretidos + mel), Hepatizão, Manyullyn, Slime da Rainha e obsidiana (água + lava).
- **Materiais compostos**: peça na Mesa de Fundição + líquido = outro material (pedra + argila = pedra carbonizada,
  madeira + obsidiana = nahuatl, pedra + estanho = pedra branca...). Bacia com tábua + obsidiana = bloco de Nahuatl.
- Osso Necrótico dos Esqueletos Wither. Arte do TC3 em tudo (pintada com as paletas do mod).
- Próximas partes: 2) mundo dos slimes (ilhas, geodos, árvores, slimes); 3) armaduras, escudos, arcos e arremessáveis;
  4) a fundição inteira (Fusor, Fundição Fantástica, Ligador, dutos, canais, blocos); 5) modificadores, bigornas,
  livros, ferramentas antigas e cajados.

## Novidades da 1.25.0 (Sophisticated Backpacks 3.26, o mais novo)

A mochila ganhou os níveis e as melhorias novas do Sophisticated Backpacks 3.26.19 (com os números do mod; código e
ícones próprios):
- **Níveis**: Couro 27 espaços e 1 melhoria, **Cobre** 45 e 1, **Ferro** 54 e 2, **Ouro** 81 e 3, **Diamante** 108 e 5,
  **Netherita** 120 e 7. Para subir, ponha a mochila no chão e toque nela com o material na mão (8 lingotes de cobre,
  4 de ferro, 8 de ouro, 8 diamantes ou 1 lingote de netherita): **nada do que está dentro se perde**. No celular o
  botão vira "Melhorar".
- **Páginas**: o Bedrock mostra 27 espaços por vez; agachado e tocando na mochila aberta, troca de página (botão
  "Página"). O que for posto além do espaço da última página cai no chão.
- **Várias melhorias de uma vez**: valem as primeiras melhorias diferentes até o número do nível.
- **Melhorias novas**: Ímã Avançado (raio 5), Alimentação Avançada (escolhe a comida que mais rende e, com pouca
  vida, come mesmo que sobre), Fornalha (funde minério, minério bruto, pó e carne crua com o carvão de dentro, 10 s por
  item), Fornalha Automática (também puxa o que dá para fundir do inventário) e Reposição (completa as pilhas da barra).
- 5 missões novas no capítulo Melhorias da Mochila. Os níveis estão no Catálogo.

## Novidades da 1.24.0 (Tinkers' Construct 3, o mais novo)

O Tinkers foi atualizado para o Tinkers' Construct 3.12.1 (o mais novo), com os números e a arte do mod (MIT):
- **Números do TC3** em todos os materiais (durabilidade, velocidade, dano e nível de cada cabeça e o bônus do cabo).
- **Ligas novas na Fundição**: **Ouro Rosa** (1 cobre + 1 ouro = 2; rápido, nível do ouro) e **Bronze de Ametista**
  (1 cobre + 1 fragmento de ametista = 1; nível do diamante). Viram peças e ferramentas como os outros metais.
- **Ferramentas grandes do TC3**: **Marreta** (quebra 3×3 na face mirada), **Escavadeira** (cava 3×3 de terra e
  areia) e **Machado Largo** (derruba a árvore inteira). Agachado, quebram um bloco só. Peças novas: Cabeça de Martelo,
  Placa Grande, Cabo Resistente, Ligação Resistente e Cabeça de Machado Largo.
- **Arte do TC3**: peças e ferramentas com o desenho do mod, pintadas na cor de cada material.

## Novidades da 1.23.0 (Create 6, o mais novo)

O Create foi atualizado para a versão mais nova (6.0.11, Minecraft 1.21.1), com as receitas do mod (a arte do Create é
"todos os direitos reservados", então continua a do pack):
- **Mó**: 44 receitas (flores viram corante, ossos, cana, trigo, pedras...); **Rodas Trituradoras**: 39 (minérios dão
  triturado extra e **Pepita de Experiência**, que dá XP quando usada); **Prensa** e **Misturador** com as do Create 6.
- **Ventilador**: lava (água), cozinha (lava ou fogo) e agora **assombra** soprando por fogo das almas ou fogueira das
  almas (16 receitas do Create 6).
- Receitas de bancada das peças iguais às do Create 6 (eixo, engrenagens, manivela, roda d'água, furadeira...).

## Novidades da 1.22.0 (Applied Energistics 2, o mais novo)

O Applied Energistics virou o AE2 de hoje (Minecraft 26.3), com as receitas e a arte do mod:
- **Prensas Inscritoras** (Silício, Lógica, de Cálculo e de Engenharia) vêm dos **meteoros**: cada um que cai deixa um
  baú no meio da cratera com uma prensa e Pedra do Céu.
- **Inscritor**: prensa + bloco de ferro = cópia da prensa; prensa + item = circuito impresso; circuito + redstone +
  silício impresso = **Processador Lógico, de Cálculo ou de Engenharia** (os processadores agora só saem dele).
- **Carregador**: Quartzo Certus vira Certus Carregado. **Fluix**: jogue Certus Carregado, redstone e quartzo juntos na
  água (dá 2).
- Receitas do AE2 para controlador (Pedra do Céu Lisa), drive, baú, células (Cápsula + Componente), montador, ponto de
  acesso e terminal sem fio; itens novos: Vidro de Quartzo, Cabo ME Fluix, Fibra de Quartzo, Receptor Sem Fio, núcleos
  de Aniquilação e Formação, Pérola de Fluix, Células de Energia do AE2 e a **Célula de Armazenamento 256k**.
  4 missões novas no capítulo de armazenamento.

## Novidades da 1.21.0 (Mekanism 10.7, o mais novo)

O Mekanism foi atualizado para a versão mais nova (10.7, Minecraft 1.21.1), com as receitas, os números e a arte
original do mod (MIT):
- **Processamento de minério do Mekanism de hoje**: Câmara de Enriquecimento (minério ×2; pó sujo → pó), Câmara de
  Purificação com oxigênio (minério ×3 em **Aglomerados**), Câmara de Injeção Química com cloreto de hidrogênio
  (minério ×4 em **Estilhaços**), e o Triturador (aglomerado → **pó sujo**). Ferro, ouro, cobre, estanho e ósmio.
- Máquinas novas: **Câmara de Enriquecimento**, **Combinador** (pó + pedregulho = minério), **Serraria de Precisão**
  (tora = 6 tábuas + serragem), **Fundição Energizada** e **Compressor de Ósmio** (lingotes refinados).
- **Infusor Metalúrgico** com os tipos de infusão do mod (carvão, redstone, pó de diamante, ouro, estanho, obsidiana
  refinada, biocombustível e cogumelo) e os circuitos **Elite** e **Ultimate**; ferro enriquecido e pó de aço.
- O gás continua em cilindros (1 cilindro = 1.000 mB); o sílex também dá oxigênio na Purificação.
- Gasto de energia do Mekanism 10 (Purificação 16.000 RF, Injeção 32.000 RF por operação) e os Cubos de Energia com
  4, 16, 64 e 256 milhões de J. 140 receitas de enriquecimento, 170 do triturador, 117 da serraria e mais.
  5 missões novas no capítulo do Mekanism.

## Novidades da 1.20.0 (Ender IO 9, o mais novo)

O Ender IO foi atualizado para a versão mais nova (Ender IO 9, ramo 26.3, do Team Ender IO), com as receitas, os
números e a arte original do mod (CC0). Os add-ons de antes (Endergy, Zoo, Machines) já vêm dentro dele:
- **Receitas novas** em tudo: Liga Condutiva = ferro + cobre; Aço Sombrio = ferro + pó de carvão + obsidiana (sai 2);
  Almário = areia das almas + ouro; Aço do End; quartzo fundido e vidro transparente; corantes. 42 receitas na
  Fundição de Ligas e 72 no Triturador SAG (com as **Esferas de Trituração**, que aumentam a saída e gastam menos).
- **Grãos do Infinito**: ponha fogo (isqueiro) em rocha matriz ou pedra do abismo e espere ~13 s. Entram nos
  capacitores, na engrenagem e no chassi.
- **Máquinas de almas**: Frasco de Alma (bata na criatura com ele para guardar a alma), Fatiar e Emendar (Controlador
  Lógico Z, Eletrodo Zumbi...), Vinculador de Almas (Cristal do Ender, Cristal Sedutor, Frank'N'Zumbi), **Motor de
  Almas** (gera energia queimando o fluido da alma: zumbi, creeper, enderman ou blaze) e **Gerador de Monstros
  Energizado** (toque os dois com o frasco cheio).
- **Crisol de Fermentação** e os fluidos em baldes (Hootch, Combustível de Foguete, Água de Fogo, Destilado de
  Nutrientes, Luz Solar Líquida, Semente de Nuvem...), **Tanques**, **Dreno**, **Estação Agrícola** (planta, aduba e
  colhe 11×11), **Funil de Impulso**, **Carregadores** com e sem fio, **Obeliscos** (XP, Aversão, Relocação,
  Inibição, Atração e Climático), **Vácuo de XP** e **Baú de Vácuo**.
- Itens: **Cajado de Viagem** (pula 24 blocos ou vai até uma Âncora a 192), **Cajado de Levitação**, **Planador**,
  **Eletroímã**, **Chave Yeta**, Enderios e a espada **O Ender** (7% de cortar a cabeça do monstro).
- Números do Ender IO 9: Gerador Stirling 40 RF/t, módulos 4/16/64 RF/t, bancos de 0,5/2/4 milhões de RF.
  Nomes do português do próprio mod (Aço Sombrio, Liga Condutiva, Fundição de Ligas, Triturador SAG...). Nada sumiu
  do mundo: o Aço Elétrico (que o Ender IO 9 não tem) continua com a receita antiga. 12 missões novas.

## Novidades da 1.19.0 (Powah! completo)

O resto do Powah!, com a arte e os números do mod (agora 160 receitas e 9 do Orbe):
- **Reator** (7 níveis): toque no bloco (ou ponha) com mais 35 Reatores do mesmo nível no inventário e ele se monta em 3×3×4. Queima Uraninita (que sai da peneira, no cascalho), esquenta, e rende mais com carvão (+20%) e redstone (+40%); água e gelo/neve/Gelo Seco seguram a temperatura. Quebrar qualquer parte devolve os 36 blocos e a uraninita.
- **Célula Ender e Portão Ender**: energia sem fio por canal (do mesmo dono, em qualquer lugar). A Célula ganha capacidade com Células de Energia do Powah postas dentro; toque de mão vazia troca o canal.
- **Baterias** (7 níveis), **Funil de Energia** (carrega as baterias do baú embaixo), **Descarregador** (passa a energia das baterias do baú em cima para a rede) e **Transmissor de Jogador** (carrega as baterias de quem está no Cartão de Vínculo).
- **Cartão de Vínculo** (use no ar para vincular; num enderman vira o Dimensional), **Pérola Aérea** (num zumbi vira a do Jogador), **Lente do Ender** (Painel Fotoelétrico num enderman), **Bola de Neve Carregada** (raio onde cair), **Gelo Seco**, **Chave** (gira as máquinas) e o **Livro do Powah**.
- Os cabos usam a arte original do mod. 5 missões novas no capítulo do Powah!.

## Novidades da 1.18.0 (Powah!)

Mod novo de energia: **Powah!** (owmii, LGPL-3.0), com a arte e os números do código do mod. Tudo em 7 níveis (Inicial, Básico, Endurecido, Ardente, Niótico, Espiritual e Nitro); cada nível pede o anterior, um capacitor do nível e o material dele.
- **Furnator**: queima combustível de fornalha (o baú em cima, ou toque com ele): 30 RF por tick de queima (carvão = 48.000 RF), gerando de 15 a 4.800 RF/t.
- **Magmator**: lava (balde = 100.000 RF), no mesmo ritmo.
- **Termogerador**: calor embaixo (lava, magma ou Bloco de Cristal Ardente) e água (balde, ou uma fonte de água encostada, que não acaba).
- **Painel Solar**: de dia, com céu aberto (5 a 1.200 RF/t).
- **Células de Energia** (100 mil a 140 milhões de RF) e **Cabos de Energia**, que ligam com geradores, células, máquinas e os outros cabos e condutos do pack.
- **Orbe Energizador**: até 6 itens dentro; as **Hastes Energizadoras** a até 4 blocos, ligadas à energia, mandam RF até a receita ficar pronta: Aço Energizado (ferro + ouro) e os Cristais Ardente, Niótico, Espiritual e Nitro dos níveis altos.
- Capítulo novo no Diário (8 missões) e o grupo "Powah!" no menu criativo e no Catálogo.

## Novidades da 1.17.0 (Lua)

- **Lua sem travar**: a dimensão da Lua só pode ser vazia (testado: a geração natural não roda nela), então o chão é posto pelo script, ~14 mil blocos por chunk. Antes saía tudo de uma vez, dois chunks a cada meio segundo; agora cada chunk é feito em pedaços pequenos (`system.runJob`), do chão para baixo, um chunk de cada vez.
- **Masmorra pronta na chegada**: a Base de Pesquisa Lunar começa a ser preparada quando alguém chega a 160 blocos (uma área de carregamento segura os chunks dela, o terreno dela vem primeiro e ela é construída logo). Antes só começava a 28 blocos e esperava o jogador passar perto de todos os chunks.
- **Planetas no céu da Lua**: Terra, Marte, Júpiter e Saturno a 48 blocos, acompanhando o jogador (arte própria, `tools/gerar-ceu-lua.mjs`).
- **Monstros de traje espacial**: todos os evoluídos (e o chefe) usam capacete de vidro e tanques de oxigênio nas costas, como no Galacticraft (desenho próprio, `tools/gerar-evoluidos.mjs`).
- **Monstros novos na Lua**: Enderman Evoluído (40 de vida) e Bruxa Evoluída (26, joga poções), também de traje; antes o enderman e a bruxa sumiam na Lua. Missões novas no capítulo do Galacticraft. A bruxa também aparece nas salas da masmorra.
- **Textos de baixo**: o "o que estou olhando" vai em duas linhas (nome e mod; detalhe embaixo) e o painel de água e temperatura põe ar, tempestade e estados numa segunda linha.

## Novidades da 1.16.4 (desempenho)

Nada muda no jogo; os scripts fazem menos trabalho à toa (medido no servidor de testes, com 3 jogadores):
- **Elevador**: o laço de todo tick só olha quem está em cima de um (o bloco avisa quando alguém pisa). 5,7 → 0,3 ms/s.
- **Asa-delta, jetpack, ferramentas do Tinkers e do Minecraft, bússola do avião**: o item da mão e do peito fica guardado (atualiza na troca de item); antes cada laço lia o equipamento do jogo. Asa-delta 1,85 → 0,2 ms/s.
- **Corda**: parado no chão não lê blocos. 1,45 → 0,25 ms/s. **Petróleo**: não relê o bloco de quem está parado no mesmo lugar; **estrada de plástico**: menos leituras por jogador.
- **Robô**: só os robôs trabalhando são olhados (antes procurava todos no mundo a cada 0,4 s).
- **Aeronaves**: quem montou é visto ao tocar na aeronave (e a cada 0,5 s), não a cada tick.
- **Diário**: lê o inventário uma vez para todas as missões "ter" abertas (antes, uma vez por missão).
- **Relevo**: com tudo em volta já pronto, não revisita os 625 chunks a cada 0,5 s enquanto o jogador fica no mesmo chunk.
- **Mochila**: só lê o inventário de quem leva mochila.
- **Painel (barra de status)**: se o texto não mudou, só é reenviado a cada 2 s (no celular, montar a barra é o que mais pesa). O `/cl:diagnostico` mostra o painel em partes (olhar, dados, barra).

## Novidades da 1.16.3

- A descrição dos packs mostra também a versão do Minecraft que eles pedem: "Versão 1.16.3 · Minecraft 26.30+ · ...".

## Novidades da 1.16.2

- A descrição de cada pack começa com a versão ("Versão 1.16.2 · ..."), para achar o certo em Editar mundo → Pacotes no celular.
- Se duas versões do Pouso Forçado estiverem ligadas no mesmo mundo, aparece um aviso vermelho no chat ao entrar (em vez de tudo rodar em dobro).

## Novidades da 1.16.1

- Tempestade de areia dura **15 minutos** (eram 25).
- O Diário explica de onde vem a terra (Barril de Madeira com folhas, mudas, arbustos secos, cactos ou carne podre) e que o ferro sai da areia peneirada.

## Novidades da 1.16.0 (progressão só pelos mods)

- **Sem pedra e sem minério no subsolo** (mundo novo): debaixo da areia só há arenito até a rocha-mãe. Pedra sai da peneira (terra → pedrinhas, 4 = 1 pedregulho) e minério também (cascalho, areia e poeira do martelo). Ficam o mármore, o calcário e os bolsões de petróleo. Mundos antigos guardam as camadas antigas, mas não ganham mais minério do Minecraft.
- **Ferramentas do Minecraft péssimas**: na mão dão Cansaço (mineram devagar), espada e machado dão Fraqueza, e cada uso gasta 8× mais (uma picareta de ferro dura uns 30 blocos). As de verdade são as do Tinkers, do Mekanism Tools e do Ender IO.
- **Baú do avião sem balde e sem Condensador**: 6 potes de Água Boa, pão, tochas, terra, mudas, linha, gravetos, tigelas e farinha de osso (tudo o que a primeira peneira pede). O Condensador agora é feito (4 ferros, vidro, balde e 3 pedregulhos); a missão Metal dá o balde.
- **Destroços**: os baús das naves caídas sempre têm 2 a 4 potes de Água Boa e às vezes pão, linha, tochas, garrafas e farinha de osso (balde não sai mais).
- **Diário**: o capítulo da chegada segue a ordem nova (muda, lenha, mesa, pedra da peneira, fornalha, ferro, condensador, água).
- **Aviso da cápsula**: só "Caindo por perto!", sem as coordenadas.

## Novidades da 1.13.0 (Immersive Engineering e Immersive Aircraft)

- **Immersive Engineering** (números do código do IE 1.20.1, arte própria): **Martelo de Engenheiro**; **Forno de Coque** (cubo 3×3×3 de Tijolos de Coque: bata com o Martelo no tijolo do meio de um lado; toque com carvão, bloco de carvão ou toras para pôr, de mão vazia para pegar o coque, com balde para tirar **creosoto**: carvão → coque em 1.800 ticks e 500 mB); **Tábuas Tratadas** (8 tábuas + balde de creosoto; o balde volta) e gravetos tratados; **Alto-Forno** (cubo de Tijolos de Alto-Forno: ferro → aço + escória em 1.200 ticks, queimando coque ou carvão vegetal); **cânhamo** (semente na peneira; fibra → tecido → velas); **Dínamo Cinético** com **Moinho de Vento** (disco de 9 blocos livre; ~12 RF/t de céu limpo, até ~36 com 8 velas, mais com chuva e tempestade) ou **Roda d'Água** (água corrente em cima ou caindo de um lado; até 3 rodas em fila). As pás giram de verdade.
- **Immersive Aircraft** (modelos, texturas e ícones originais; física de voo do código do mod): **Biplano** (pule para acelerar; o joystick inclina e vira; no chão, para trás freia), **Dirigível** e **Quadricóptero** (pule para subir, olhe bem para baixo para descer), **Girocóptero** (sem combustível: ande para frente para dar corda até 100%). Toque a aeronave com carvão, coque ou outro combustível para encher a caldeira; bata 3 vezes para recolher.
- Capítulos **Immersive Engineering** e **Immersive Aircraft** no Diário.

## Novidades da 1.12.0 (Farmer's Delight e Quark)

- **Farmer's Delight** (números de FoodValues.java e receitas do código público, arte original): **facas** (sílex, ferro, ouro e diamante), **Tábua de Cortar** (ponha o ingrediente e toque com a faca: repolho em folhas, carne em carne moída, frango em pedaços, porco em bacon, peixe em fatias, abóbora em fatias, massa em macarrão, trigo em palha), **Panela de Cozinha** (em cima de fogo, fogueira, lava, magma ou Fogão; toque com até 6 ingredientes; pratos de tigela se servem com uma tigela; agache de mão vazia para esvaziar), **Fogão** (aquece a panela e assa 6 comidas em cima), **repolho** (plantação nova), caixotes, palha, lona e corda, e ~45 comidas. Os pratos dão **Nutrição** (a fome não baixa) e as sopas e ensopados também **Conforto** (sem lentidão, fraqueza nem fome), com as durações do mod.
- **Quark** (arte original): caixotes e sacos de armazenamento, blocos de carvão vegetal, cana, cacto e gravetos, **jaspe** e **xisto** (com polido, tijolos, entalhado e pilar), vidro emoldurado, placa de ferro, grade, palha trançada, lanterna de papel, lâmpada de pedra; o **Picarango** (arremessa, quebra o bloco que acerta e volta); **colheita com toque** (planta madura colhe e replanta), **portas duplas** e a **corda** (pule dentro para subir; toque uma corda com outra para estender para baixo).
- Correção: o toque com Regador ou Varinha marcava o toque para os outros scripts.
- Capítulos **Farmer's Delight** e **Quark** no Diário.

## Novidades da 1.11.0 (Mekanism Additions e condutos)

- **Mekanism Additions** (receitas do código público, arte original): **Plástico** nas 16 cores (bloco, **liso** que escorrega como gelo, **brilhante** que ilumina, **reforçado** que aguenta explosão e **estrada**, que dá Velocidade II), **Painéis Brilhantes** (encostam em qualquer face), **Balões** (no ar, prendem em você e você cai devagar por 60 s; num bicho, levantam o bicho por 10 s; bata para estourar), **TNT de Obsidiana** (acende com isqueiro: 5 s de pavio e raio 12) e os **filhotes** de creeper, esqueleto, esqueleto errante e enderman (1 em 3 nasce bebê). A Folha HDPE é a Folha de Plástico que o pack já tinha.
- **Condutos do Ender IO**: **Conduto de Energia** (passa energia como os cabos) e **Conduto de Itens** (toque para pôr no modo que tira, de miolo laranja: leva 4 itens por segundo dos baús encostados nele para os baús encostados nos outros condutos).
- Correção: o Creeper Evoluído da Lua agora explode.
- Capítulo **Mekanism Additions** no Diário (6 missões).

## Novidades da 1.10.2

- Ícones redesenhados parecidos com os originais (desenho próprio, `tools/desenhar-similares.py`) para os mods cuja arte não pode ser copiada: Foguete Tier 1, Máscara e Equipamento de Oxigênio, os três tanques, bico, aleta e motor do foguete (Galacticraft), Hélice e Batedor (Create), Regador (Extra Utilities) e Robô Minerador.

## Novidades da 1.10.1 (texturas originais)

- Os itens, blocos e armaduras dos mods que permitem agora usam as **texturas e ícones originais**: Mekanism (e os add-ons), Ender IO, Waystones, ComputerCraft, Tinkers' Construct, Applied Energistics 2, PneumaticCraft, Big Reactors, BuildCraft, OpenBlocks, Chisel, ChickenChunks e EnviroMine (407 trocas). Lista e licenças em `CREDITOS.md`.
- Create, Galacticraft, Extra Utilities, Thermal, MineFactory Reloaded, HarvestCraft e os outros sem licença continuam com a arte própria.

## Novidades da 1.10.0 (utilidades)

- **Waystones**: a **Pedra do Caminho** (quem põe dá o nome; o primeiro toque ativa, os seguintes mostram as pedras que você já ativou e levam até lá, sem custo, na mesma dimensão). **Pedra de Viagem** (abre a lista de qualquer lugar, 300 s de espera), **Pergaminho de Viagem** (uma viagem) e **Pergaminho de Retorno** (volta à última pedra ativada).
- **Mochila** (Backpacks): 27 espaços. Use para pô-la no chão, abra com o botão **Abrir** e **bata** nela para guardar de volta: tudo fica dentro do item (encantamentos, desgaste e nomes também). Mochila dentro de mochila vale.
- **Robô Minerador** (a Mining Turtle do ComputerCraft): ponha num bloco, toque com combustível (carvão = 80, bloco de carvão 800, balde de lava 1.000) e escolha o programa: **túnel** de 16, 32 ou 64 (3 de largura por 2 de altura, com pedregulho no chão onde faltar) ou **escavar** 3×3, 5×5 ou 9×9 até a rocha-mãe. Ele guarda 16 espaços e despeja no baú atrás do ponto de partida.
- **Extra Utilities**: **Lixeira** (apaga o que cai nela ou o que você tocar nela com a mão), **Regador** (molha a terra arada e acelera as plantações em 5×5), **Bloco Angelical** (põe no ar, sem apoio), **Varinha do Construtor** (copia a camada de até 9 blocos iguais) e **Super Varinha** (49), e o **Pedregulho Comprimido** de 1x a 8x.
- **Redemoinhos de poeira** (Weather2): de dia, fora da tempestade, às vezes aparece um redemoinho perto de você que levanta poeira e joga para o alto quem chegar perto.
- Capítulo **Utilidades** no Diário (9 missões).

## Novidades da 1.9.0 (Create)

Rotação e estresse com os números do Create: as fontes dão capacidade em SU (stress units) por RPM e as máquinas gastam SU por RPM.
- **Fontes**: **Manivela** (toque: 32 RPM por 2 s, 256 SU), **Roda d'Água** (com água encostada: 8 RPM, 256 SU) e **Rolamento de Moinho** (1 RPM a cada 8 **Velas de Moinho** a até 4 blocos, 512 SU por RPM).
- **Transmissão**: **Eixo**, **Engrenagem**, **Engrenagem Grande** e **Caixa de Engrenagens** ligam as peças (giram de verdade quando a rede tem rotação). O **Controlador de Velocidade** troca o RPM da rede (16 a 256, toque para trocar).
- **Máquinas** (baú em cima = entrada, baú embaixo = saída): **Mó** (trigo → farinha, osso → farinha de osso, cana → açúcar), **Rodas Trituradoras** (minério → bruto triturado com extra, lã → linha), **Prensa Mecânica** (lingote → chapa), **Misturador Mecânico** (cobre + zinco = 2 latão; andesita + pepita de ferro = liga de andesita), **Ventilador Revestido** (soprando por água lava os itens no chão; por lava ou fogo, cozinha) e **Furadeira Mecânica** (quebra o bloco da frente).
- **Sobrecarga**: se o estresse das máquinas passar da capacidade das fontes, a rede inteira para. Toque numa peça para ver RPM e SU.
- **Zinco**: os pedaços saem da peneira (como o ósmio); 4 pedaços = 1 lingote. Liga de Andesita, Latão e as chapas de ferro, cobre, ouro e latão.
- Capítulo **Create** no Diário (7 missões).

## Novidades da 1.8.0 (Ender IO)

Números do Ender IO 5.2 (o código público é o de 1.12); onde a receita de 1.12 pede algo que não existe aqui (Pó do Infinito, corante de máquina), vale a do Ender IO de 1.7.10.
- **Fundidora de Ligas**: Aço Elétrico (ferro + carvão pulverizado + silício), Liga Energética (redstone + ouro + glowstone), Liga Vibrante (energética + pérola do ender), Liga de Redstone (redstone + silício), Ferro Condutor (redstone + ferro), Ferro Pulsante (ferro + pérola), **Aço Negro** (ferro + carvão pulverizado + obsidiana, ou aço + obsidiana) e a Placa Fotovoltaica; 10.000 a 20.000 RF cada.
- **Moinho SAG**: minério em 2 pós, carvão em carvão pulverizado (+10%), pedregulho em cascalho, cascalho em areia (+10% de sílex).
- **Gerador Stirling** (20 RF/t com combustível de fornalha), **Painéis Fotovoltaicos** (10, 40 e 160 RF/t) e **Bancos de Capacitores** (1, 5 e 25 milhões de RF).
- **Âncora de Viagem**: toque para escolher outra âncora a até 96 blocos e ir até ela.
- **Aço Negro**: picareta, machado e espada (2.000 usos, velocidade 8) e a armadura, que aparece no corpo.
- Peças: capacitores básico, de camada dupla e octádico, chassi de máquina, engrenagem de aço negro, aglutinante de conduíte e cristal pulsante.
- Capítulo **Ender IO** no Diário (8 missões).

## Novidades da 1.7.0 (os add-ons do Mekanism)

Na época do Crash Landing (1.6.4) o Mekanism tinha dois add-ons, o **Generators** e o **Tools**; os dois entraram, com os números do código do Mekanism (100 J/t do Mekanism = 1 E a cada 5 s).
- **Ósmio**: pedaços na peneira (cascalho, areia e poeira, como no Ex Aliquo); 4 pedaços = 1 lingote.
- **Peças**: Circuito de Controle Básico (ósmio + redstone no Infusor Metalúrgico) e Avançado, Tablet de Energia, Núcleo Eletrolítico, Revestimento de Aço, Painel Solar, Lingote de Obsidiana Refinada (obsidiana + diamante + ósmio) e de Glowstone Refinada (glowstone + ósmio), no Infusor.
- **Triturador**: plantas viram **Biocombustível** (sementes e cana 2; trigo, maçã, batata, cenoura e pão 4), lingotes viram pó, pedregulho vira cascalho e cascalho vira areia.
- **Mekanism Generators**:
  - Gerador a Calor: 150 J/t com combustível de fornalha (1 carvão = 12 E), mais 5 J/t por lava encostada;
  - Gerador Solar (50 J/t) e Solar Avançado (300 J/t);
  - Biogerador: 350 J/t; 1 biocombustível = 7 E;
  - Gerador a Gás: hidrogênio; devolve o que a eletrólise gastou;
  - Turbina Eólica: de 60 J/t em y 24 a 480 J/t em y 255; na Lua não venta.
- **Mekanism Tools**: picareta, machado, pá, enxada, espada, **paxel** (picareta + machado + pá) e as 4 peças de armadura de **obsidiana refinada, lápis-lazúli, ósmio, bronze, glowstone refinada e aço**, com a durabilidade, a velocidade, o dano, a proteção e a encantabilidade do mod; paxels de madeira, pedra, ferro, ouro e diamante. As armaduras aparecem no corpo.
- Capítulo **Mekanism: Geradores e Ferramentas** no Diário (9 missões).

## Novidades da 1.6.1 (a Lua de verdade e o final novo)

- **Final novo**: com os 4 sistemas consertados, o Painel da Nave mostra a **Bobina de Salto** queimada. O Núcleo de Salto está na **Base de Pesquisa Lunar**; instalado, aparece o botão Decolar. Mundos que já decolaram seguem no modo infinito, sem pedir o núcleo.
- **Base de Pesquisa Lunar**: sorteada a 160–240 blocos de onde se pousa na Lua; o rádio avisa as coordenadas e, na Lua, a Bússola do Avião aponta para ela. Cabine na superfície, poço com escada e a masmorra de tijolo lunar: salão, corredores, duas salas de monstros, uma de baús (com chance de Balde de Combustível para a volta) e a sala do chefe.
- **Esqueleto Evoluído Gigante** (150 de vida, flechas a cada 25 ticks, agarra e arremessa quem chega perto, barra de chefe). Deixa a **Chave da Masmorra Tier 1**, que abre o **Baú do Tesouro** com o Núcleo de Salto.
- **Monstros evoluídos** (vida do Galacticraft: zumbi 30, esqueleto 25, aranha 22, creeper 25; não queimam no sol): o que nasce no escuro da Lua vira a versão evoluída.
- **Meteoros na Lua**: como no Galacticraft, um pequeno a cada ~6 min e um grande a cada ~17 min em média, caindo a até 10 blocos do jogador.
- **Distribuidor de Bolha de Oxigênio**: bolha de até 10 blocos onde se respira sem gastar tanque; gasta 8 de oxigênio por tick (de um Coletor encostado, tanques ou cilindros).
- **Coletor de Oxigênio** corrigido: soma a cada ~10 ticks, como no original (930 a cada 5 s no planeta; 7,5 por planta a cada 5 s na Lua).
- 7 missões novas no capítulo Galacticraft.
- O avião caído só é posto no planeta (antes, se o primeiro jogador estivesse em outra dimensão, ia para lá).

## Novidades da 1.6.0 (Galacticraft: a Lua)

- **Alumínio**: pedaços de alumínio na peneira (cascalho, areia e poeira, como o estanho do Ex Aliquo); 4 pedaços = 1 lingote.
- **Compressor** (a carvão: 1 carvão = 8 placas) e **Compressor Elétrico**: 2 lingotes = 1 placa comprimida (cobre, estanho, alumínio, ferro, bronze, aço); placa de cobre + de estanho = de bronze; 3 de aço + 3 de alumínio + 3 de bronze = 2 **Placas Reforçadas**.
- **Fabricador de Circuitos**: diamante + 2 silício + redstone + tocha = 3 Wafers Básicos (com repetidor = 1 Wafer Avançado).
- **Oxigênio**: Coletor (6.000; no planeta tira do ar, na Lua só de folhas e plantações a até 5 blocos), Compressor de Oxigênio (enche tanques; aceita os cilindros de oxigênio do Mekanism), Máscara (cabeça), Equipamento (peito) e tanques Leve/Médio/Pesado (900/1.800/2.700, 1 a cada 9 ticks: o leve dura 6 min 45 s). Sem oxigênio na Lua: 2 de dano a cada 5 s.
- **Bancada da NASA** e **Foguete Tier 1** (1 bico, 8 placas reforçadas, 4 aletas e 1 motor), **Plataforma de Lançamento** 3×3 e **Carregador de Combustível** (12.000 mB; o foguete leva 1.000 mB do combustível da refinaria do BuildCraft).
- **A Lua**: dimensão própria (a 26.30 deixa o add-on criar dimensões), com o terreno do Galacticraft (crateras de 8 a 30 blocos de raio, solo, terra e rocha lunar, minérios de cobre, estanho e queijo), gravidade baixa (pulo alto e queda lenta) e névoa preta no horizonte.
- **Viagem**: toque no foguete abastecido e lance: contagem de 10 s, subida em fogo, e o foguete pousa de ré na Lua, na mesma coordenada. Para voltar (70% do tanque) é preciso recolher o foguete e pôr numa plataforma de novo: leve 9 plataformas, um carregador, energia e combustível.
- Capítulo **Galacticraft** no Diário (10 missões) e duas dicas novas na tela de carregamento.
- A falta de ar do EnviroMine voltou a machucar: o jogo ignorava o dano de "sufocamento" fora de um bloco (agora é dano de afogamento).

## Novidades da 1.5.2

- **Wiki do modpack**: `docs/wiki/wiki.html`, uma página só para abrir no celular (abertura com o logo e o avião caído, índice, busca, ícones do pack): começar, sobreviver, Ex Nihilo, energia, máquinas, ferramentas, armazenamento, explorar, perigos, a nave e utilidades. O texto fica em `docs/wiki/wiki.fonte.html`; `python3 tools/gerar-wiki.py` embute as imagens.
- Dica da tela de carregamento corrigida: falava em ir ao Nether, mas o portal não acende neste modpack.

## Novidades da 1.5.1

- Diário: o texto da história, da missão e do capítulo volta a aparecer embaixo do título (faltava ligar o texto da tela dentro da lista).
- A linha entre as colunas e os separadores do cabeçalho e do rodapé aparecem inteiros (antes viravam um pontinho); "Sistemas da nave" e "Pouso Forçado" ficam no meio da faixa.

## Novidades da 1.5.0

- **Diário de Bordo novo, no desenho do ChatGPT** (moldura de metal, botões grafite e laranja, ícones dos sistemas): uma tela só com tudo à vista.
  - **Cabeçalho:** "Diário de Bordo | Pouso Forçado", o **estado da nave** (EMERGÊNCIA, EM REPARO ou PRONTA, com LED) e o X para fechar.
  - **Coluna da esquerda:** os 24 capítulos com ícone (o aberto fica laranja; os que ainda não abriram têm cadeado). Um toque troca de capítulo de qualquer tela.
  - **Coluna da direita:** a visão geral (progresso total, recompensas para escolher e as missões abertas agora), as missões do capítulo ou o detalhe da missão: nome grande, descrição, ícone do item, o **objetivo com caixinha** e a contagem, a **barra de progresso** em 4 segmentos, o que falta fazer antes e a **recompensa** com ícone.
  - **Botões embaixo:** "Verificar progresso" (ou "Entregar os itens" / "Escolher recompensa"), "Pular" e "Voltar"; na visão geral, "Leia primeiro", Catálogo e Opções; no capítulo, "Próxima missão".
  - **Rodapé:** "Sistemas da nave" com os 4 sistemas (casco, computador, combustível e motor) acesos quando consertados e "n/4 reparados".
- A história ("Leia primeiro") também abre nessa tela. As outras telas do add-on continuam no visual de painel da 1.4.0.

## Novidades da 1.4.2

- **Fundo do menu com quatro lugares**: o panorama agora é o deserto inteiro em volta. Enquanto gira, passam um depois do outro, como slides, o **avião caído**, os **destroços de outra nave** embaixo do sol, o **templo soterrado** (a estrutura do jogo) e a **cidade abandonada** com a torre de rádio e os prédios quebrados (montada como no jogo). Vale também para a tela de "Carregando...". Dentro dos prédios e embaixo da asa fica escuro, como no jogo.
- A imagem da troca de dimensão foi vista de outro ponto, com o avião inteiro.

## Novidades da 1.4.1

- **Menu e tela de carregamento no tema** (pack novo **Pouso Forçado (Menu)**, ligado em Recursos Globais: ver "Menu e tela de carregamento" acima): o fundo que gira atrás do logo é o avião caído no deserto, no fim da tarde, desenhado bloco a bloco com as texturas do jogo (com sombras, sol quadrado e nuvens); o logo vira **POUSO FORÇADO** em letras de bloco no branco do casco com a faixa laranja; as dicas embaixo da barra de "Carregando..." são 36 dicas do modpack (água, calor, peneira, horda, máquinas, decolagem), em português e inglês.
- A tela de troca de dimensão (Nether ↔ superfície) mostra o avião caído no lugar da terra.

## Novidades da 1.4.0

- **Todas as telas do add-on com o visual de painel da nave** (Diário, Catálogo, Opções, Terminal, mesas do Tinkers, reator, Sync, Painel da Nave...): janela grafite com moldura de metal, barra de título laranja com faixa de alerta, visor escuro para o texto e botões de metal com ícone. As telas com campos (busca, frequência do Tesseract, quantidade) usam a mesma moldura com uma placa clara por dentro. Os textos dos botões voltaram (a largura deles ficava zerada na 1.3.9).
- **História no Diário:** "Leia primeiro: o que aconteceu", 6 páginas curtas (a queda, primeiros dias, água e calor, dia e noite, tecnologia, a volta para casa). Abre sozinha na primeira vez que o Diário é aberto.

## Novidades da 1.3.9

- Tela do Diário: os botões voltam a aparecer, numa lista de uma coluna montada do mesmo jeito que a tela normal do jogo (a grade de 2 colunas da 1.3.7 não recebia o número de botões e ficava vazia).

## Novidades da 1.3.8

- Tela do Diário: a janela agora tem tamanho fixo (330×214, centralizada). Na 1.3.7 ela saía encolhida (só a moldura, sem título nem botões), porque o espaço do formulário no jogo tem tamanho zero e a janela era medida em porcentagem dele.

## Novidades da 1.3.7

- **Sem Camelo-Zumbi** (o camelo morto-vivo do Minecraft com husk de lança e esqueleto montados): não nasce mais e os que existirem somem, com os cavaleiros. O mercador ambulante e as lhamas dele também saem.
- **De dia (manhã e tarde) nenhum monstro na superfície:** os que sobram da noite se enterram na areia (somem numa nuvem de areia, sem fogo) e nenhum nasce, nem na sombra. Animais só das cápsulas e das crias. Nas cavernas segue como no jogo. Ficam os postos pelo add-on: Geradores de Monstros e de Blazes das cidades, Faraó e múmias, Golem de Areia da tempestade, slime do barril.
- **Diário de Bordo com cara de painel da nave:** janela de console grafite com moldura de metal, barra de título laranja do avião com faixa de alerta, texto num visor escuro e botões de metal com ícone grande, um embaixo do outro, (borda ciano ao tocar). Capítulos com barra de progresso; missões com ✓ quando feitas, cadeado quando bloqueadas e o item do objetivo quando abertas. Feito em `RP/ui/server_form.json` (texturas de `tools/gerar-ui.mjs`); se o jogo não carregar essa tela, aparece a normal.

## Novidades da 1.3.6

- **Arte completa:** chegaram as partes 3 e 4 do ChatGPT (132 imagens): Mekanism, BuildCraft, OpenBlocks, cascalho do Nether, Gerador de Blazes, Tesseract, Torre de Defesa, Montador Molecular, Caixa de Entrega, meteorito, varal, tamareira, topo do elevador e os itens das versões 1.1 a 1.3. Agora todos os itens têm ícone desenhado e todas as faces de bloco usam arte.
- O importador fecha o fundo das texturas de modelo que vierem recortadas (folha da tamareira, cachos de tâmara) com um tom escuro da própria cor, para não aparecer preto no jogo.

## Novidades da 1.3.5

- **Lâmpadas coloridas** com a arte da Lâmpada: o mesmo abajur, com o vidro tingido em cada cor (`tools/tingir-lampadas.py`), 4 faces e virando para quem coloca.
- **Gerador de ícones pela API da OpenAI** (`tools/gerar-icones-ia.py`): lê a parte da lista em `docs/prompt-icones-faltando.md`, pede as imagens e monta o mesmo pacote que o ChatGPT entregava (itens, ícones de menu e faces), pronto para `tools/importar-icones.py`. Precisa da chave em `OPENAI_API_KEY` nas configurações do ambiente.

## Novidades da 1.3.4

- **Arte nova das Fases 15 a 23** (578 imagens): ícones de todos os itens do Tinkers, Fundição, Thermal, JABBA/AE, MineFactory, PneumaticCraft, Sync, Big Reactors, Chisel e BiblioCraft, ícones de menu das máquinas e as texturas dos blocos.
- Os cubos que vieram com frente, lados, topo e base desenhados (estante, prateleira, suporte de ferramentas, expositor, cabide, lâmpada, lanterna, mesas e bacia de fundição, tanque, dreno, torneira, tubos de pressão, câmara, barras do reator, barril do JABBA, construtor de peças, estação de ferramentas, mesa de moldes) usam cada face e **viram de frente para quem coloca**. Os que já estavam colocados continuam no lugar (testado no servidor).
- Falta de arte só o que entrou na 1.1, 1.2 e 1.3 (partes 3 e 4 de `docs/prompt-icones-faltando.md`).

## Novidades da 1.3.3

- **Petróleo líquido:** o Bedrock não deixa add-on criar fluido de verdade, então o petróleo imita um: dá para atravessar, é meio transparente e com brilho oleoso animado, não quebra com picareta e aceita bloco posto em cima (como a água). Dentro dele você anda devagar, afunda devagar (sem dano de queda) e pula para nadar para cima; com a cabeça dentro, a vista escurece. Balde vazio pega, **Balde de Petróleo despeja**. Ele não escorre (fica parado onde está).
- **Bolsões só lá embaixo:** raio 4, centro entre y −24 e 8. Sem coluna nem mancha na superfície. A Bomba alcança até 96 blocos para baixo. Mundos já criados mantêm o que já foi gerado.

## Novidades da 1.3.2

- **Livro de receitas como o JEI:** todas as receitas de bancada do add-on aparecem no livro de receitas do inventário desde o começo (antes só apareciam depois de pegar o primeiro ingrediente), separadas por mod, com a busca da lupa. Tocar numa receita monta a grade sozinho, como o "+" do JEI. Receitas de máquinas e "onde usar" continuam no Catálogo.
- **Avião afundado** 3 blocos na areia: asas rente ao chão, portas no nível do chão e areia no vão que sobrava embaixo da cauda. Sem vão escuro embaixo, não nasce bicho ali. Vale para mundos novos (o avião é montado uma vez, na criação do mundo).

## Novidades da 1.3.1 (visual mais limpo)

- **Inventário criativo e livro de receitas** organizados em **grupos recolhíveis por mod** (como os grupos do próprio jogo: toque no grupo para abrir). Os mods grandes têm subgrupos: Tinkers (ferramentas, peças, padrões, moldes), Chisel (uma família por grupo) e HarvestCraft (comidas, sementes). Blocos técnicos (petróleo, túmulo, plantas no chão) não aparecem. Gerado no build por `tools/gerar-grupos.mjs` em `BP/item_catalog/crafting_item_catalog.json`.
- **Catálogo** começa pelos mods, como as abas do JEI: cada botão mostra o ícone do mod e quantos itens ele tem; Procurar e "O que está na barra" continuam no topo.

## Novidades da 1.3.0

- **Nether sem portal:** o martelo transforma netherrack em **Cascalho do Nether**; peneirado dá **quartzo** (1/4 e 1/8), pó de pedra luminosa, pólvora, fungo do Nether e, muito raro (1/500), **sucata de netherite**.
- **Cidades:** no alto da torre de rádio fica um **Gerador de Blazes**. Os baús de saque agora vêm bagunçados, como no jogo: espaços aleatórios e pilhas divididas.
- **Tinkers:** voltam os modificadores **Afiado** (16 quartzos: +1 de dano por nível, até 3) e **Fogo** (8 pós de blaze: 3 s de fogo por nível, até 2).
- **Mekanism (leve, sem reatores e sem rede de gás):** o gás anda em **Cilindros**. Máquinas com baú em cima (entrada), baú embaixo (saída) e energia da rede:
  - **Separador Eletrolítico**: água (balde ou garrafa) + 2 cilindros vazios = hidrogênio + oxigênio; salmoura = hidrogênio + cloro. 1 E.
  - **Evaporador Térmico**: sem energia, só de dia e com céu aberto. Água vira **Salmoura**; salmoura vira **Pó de Lítio**.
  - **Infusor Químico**: hidrogênio + cloro = ácido clorídrico. 0,5 E.
  - **Câmara de Purificação**: minério + oxigênio = **3 pós** (1 E). **Câmara de Injeção**: minério + ácido = **4 pós** (2 E). Cada cilindro rende 4 minérios.
  - **Infusor Metalúrgico**: ligas **Enriquecida** (ferro + redstone), **Reforçada** (+ diamante) e **Atômica** (+ obsidiana); ferro + 2 carvões = aço. 0,5 E.
  - **Cubos de Energia**: Básico 200 E, Avançado 800, Elite 3.200 e Definitivo 12.800. Guardam a carga quando quebrados, como as células.
  - **Jetpack** (no peito): segure pular para subir, gastando hidrogênio (200 no tanque, 50 por cilindro; com ele vestido, use o cilindro para abastecer). No ar sem pular, cai devagar.
- **BuildCraft:** **bolsões de petróleo** bem fundo (1.3.3: entre y −24 e 8, na ardósia; nada aparece na superfície; uns 1 a cada 30 chunks), pegos com balde.
  - **Bomba**: em cima do poço, esvazia o petróleo para os baldes vazios de um baú encostado. 1 E por balde.
  - **Refinaria**: petróleo = **combustível**. 1 E.
  - **Motor a Combustão**: queima combustível (60 E por balde) ou petróleo (20 E) do baú de cima, 2 E a cada 5 s na rede.
  - **Pedreira**: cava 9x9 atrás dela, camada por camada até o fundo, 1 bloco a cada 2 s (0,25 E cada). O que sai vai para o baú de cima.
  - **Engrenagens** de madeira, pedra, ferro, ouro e diamante para as receitas.
- **OpenBlocks:** **Asa-Delta** (na mão, caindo: plana para a frente; agachar fecha), **Elevador** (dois, um acima do outro, até 20 blocos: pule para subir, agache para descer) e **Túmulo** (ao morrer, o que caiu vai para um túmulo no lugar, com as coordenadas no chat; toque para pegar tudo).
- Capítulos novos no Diário: **Mekanism** e **BuildCraft**; missões novas em Ex Nihilo e Sobrevivente.

## Novidades da 1.2.0

- **Sem Nether** (como no Crash Landing): o portal não acende; se acender de outro jeito, quem atravessa volta e o portal some.
- **Tinkers:** o **Varal** também seca carne crua e vira **Charque**. Modificadores novos na Estação de Ferramentas: **Sorte** (32 lápis: minérios soltam mais), **Repulsão** (pistão), **Ruína dos Artrópodes** (2 olhos fermentados: mais dano e lentidão em aranhas) e **Obsidiana** (4 obsidianas: 10% por nível de não gastar). Afiado (quartzo) e Fogo (pó de blaze) ficam de fora porque pedem Nether. Ferramenta montada caída no chão **não some**.
- **Thermal:** **Células de Energia** quebradas soltam o item com a carga escrita ("Carga: N E") e voltam com ela ao colocar. **Tesseract** (ouro, pérolas do fim, Estrutura de Máquina, diamante): toque e escolha uma frequência; Tesseracts na mesma frequência ligam as redes de energia sem cabo.
- **Torre de Defesa** (ideia do projeto): atira no monstro mais perto até 12 blocos, gastando 0,25 E da rede por tiro.
- **PneumaticCraft:** lingotes e blocos de ferro jogados no chão perto de uma explosão (TNT, creeper) viram **ferro comprimido**, com 20% de perda.
- **Applied Energistics:** **Montador Molecular** ligado à rede do Terminal. Grave até 9 padrões nele (gasta um **Padrão ME em Branco**; só receitas de bancada do add-on). O Terminal ganha **Fabricar**: tira os ingredientes da rede, faz antes os que faltarem e têm padrão (até 4 níveis), gasta 1 E por fabricação e guarda o resultado na rede.
- **BiblioCraft:** **Lâmpadas coloridas** em 8 cores (lâmpada + corante). A luz do jogo é sempre branca; a cor fica no vidro.
- **EnviroMine:** **caldeirão** com água e calor embaixo (fogo, fogueira acesa, lava, magma): a garrafa tira **Água Boa** fervida no lugar da água salgada.
- **Variedade na comida** (Spice of Life, que o Crash Landing usava): o jogo lembra as últimas 12 comidas; repetir rende 75%, 50% e depois 25%.
- **Tamareira** (HarvestCraft): a muda vem da peneira de areia (1/64) e vira uma palmeira com 2 **cachos de tâmara** que amadurecem e dão 2–4 tâmaras.
- **Cajados** (Ex Nihilo/Ex Aliquo): de **Osso** (dura 256) e de **Ouro** (acha o dobro de bichos-da-seda, dura 32).
- **Caixa de Entrega** (o Quest Delivery System do HQM): os baús encostados nela entregam as missões "entregar" e contam para as "ter".
- **Bússola do Avião:** na mão, mostra para que lado e a quantos metros está o Painel da Nave.
- **Saco de Dormir** (3 couros + 3 linhas): à noite, sem monstro perto e fora da noite de horda, pula para o amanhecer.
- **Meteoritos:** uns 2 por dia de jogo caem a 40–90 blocos de alguém, com aviso no chat e as coordenadas. As **Rochas de Meteorito** (picareta nível 2) soltam fragmentos, minérios, certus, yellorium e às vezes diamante; 9 fragmentos = 1 diamante.
- Missões novas em vários capítulos e o capítulo **Sobrevivente**.

## Final (Fase 10: a decolagem)

- Com os 4 sistemas consertados, o **Painel da Nave** mostra o botão **DECOLAR** (pede confirmação).
- Todos os jogadores na mesma dimensão veem a cena (cerca de 1 minuto, com a câmera livre do próprio jogo, sem nada no pacote de recursos): contagem de 5 s com a tela tremendo, a nave subindo num rastro de fogo e fumaça, tela preta e 12 telas de créditos. Durante a cena ninguém se mexe nem toma dano.
- No fim a câmera volta, cada um ganha uma **Sacola Lendária** e o mundo segue no **modo infinito**: capítulo novo **Final: a decolagem** no Diário (decolar, mais 30 noites, 10.000 E de reator, célula ME de 64k, 3 corpos reserva).
- Tocar no painel depois deixa ver a cena de novo (sem recompensa). Se o jogo fechar no meio da cena, a câmera e os controles voltam ao entrar.

## Decoração (Fase 23: Chisel, BiblioCraft e ChickenChunks)

- **Cinzel** (ferro + graveto, 500 usos): toque num bloco de uma família para trocar pela próxima variante (gasta 1 uso). Agachado e usando no ar: escolhe uma pilha da mochila e a variante, e a pilha inteira muda sem gastar o cinzel.
- **Famílias** (liso, polido, tijolos, tijolinhos, ladrilho, pilar, entalhado, mosaico): arenito, pedra, **Mármore**, **Calcário**, casco da nave (a partir da Placa do Casco) e vidro. A bancada faz só a variante "liso" (4 blocos base = 4); as outras saem do cinzel.
- **Mármore** e **Calcário**: veios novos dentro da pedra (mármore entre y 4 e 40).
- **Estante** (16 livros), **Prateleira** (4 pilhas), **Suporte de Ferramentas** (4 ferramentas ou armas), **Expositor** (1 pilha): toque com o item para pôr, com a mão vazia para tirar o último. Quebrar solta tudo. Olhando para eles, a linha de cima mostra o que guardam.
- **Cabide de Armadura**: toque para trocar a sua armadura inteira pela que está nele.
- **Lanterna** e **Lâmpada**: toque liga e desliga a luz (nível 15).
- **Carregador de Chunks** (3x3 chunks) e **Carregador Pontual** (1 chunk): toque liga/desliga. Usa as áreas carregadas do próprio jogo ("tickingarea"), que são no máximo 10 por mundo; quebrar o bloco desliga.
- Capítulo novo no Diário: **Decoração (Chisel e BiblioCraft)**, 5 missões.

## Reator (Fase 22: Big Reactors)

- **Yellorium**: só pela peneira de poeira (1/40, Pó de Yellorium, assado vira lingote), como no Crash Landing. **Grafite**: carvão vegetal na fornalha, ou carvão + 2 cascalhos.
- **Controlador do Reator** e **Tomada de Energia** não têm receita: ficam nos baús das cidades abandonadas (e com mais chance na torre de rádio).
- **Montagem**: caixa de 3x3x3 a 7x7x7. Arestas e cantos de **Carcaça**; nas faces, carcaça, **Vidro**, o Controlador, **Portas de Acesso**, **Tomadas**, **Portas de Refrigeração** e, no teto, **Barras de Controle**. Dentro: colunas de **Barras de Combustível** do chão ao teto (cada uma com uma Barra de Controle em cima) e o resto ar, água ou blocos de grafite. Toque no controlador para conferir: ele diz o que está errado.
- **Energia** a cada 5 s = barras × 6,75 E × moderador × (1 − inserção). Moderador: ar 1, água 1,2, grafite 1,8 (média do que não é barra). 3x3x3 com 1 barra ≈ 270 RF/t. **Refrigeração**: baldes de água num baú encostado na porta dobram a energia (1 balde a cada 10 ciclos).
- **Barras de Controle**: toque = mais 10% de inserção; agachado = menos 10%. Mais inserção gasta menos combustível e gera menos.
- **Combustível**: Lingotes de Yellorium ou Blutônio (cabem 4 por barra) por um baú encostado na Porta de Acesso, ou tocando nela com o lingote. Cada barra gasta 10 mB a cada 5 s (1 lingote dura uns 8 minutos por barra) e o gasto vira **Cianita**, que sai em lingotes no baú da porta.
- **Reprocessador de Cianita**: 2 cianitas + 1 balde de água (baú em cima) = 1 Lingote de Blutônio, outro combustível.
- O reator guarda o combustível e a cianita no controlador; quebrar uma peça desmonta o reator até tocar no controlador de novo.
- Capítulo novo no Diário: **Reator (Big Reactors)**, 5 missões.

## Corpos reserva (Fase 21: Sync)

- **Núcleo Sync**: coração do faraó + 4 diamantes + 4 ouros. Vai no **Construtor** e no **Armazém de Corpos** (que também levam transistor, capacitor, ferro comprimido e Bloco de Máquina: precisa das Fases 19 e 20).
- **Construtor de Corpos**: toque com a mão vazia para dar uma amostra de sangue (2 corações) e começar um corpo. Leva 24.000 RF (6 E) da rede, ou energia de uma **Esteira de Animal** encostada com um porco (0,25 E por ciclo) ou lobo (0,5 E) em cima. O corpo pronto fica no construtor.
- **Armazém de Corpos**: toque num armazém **vazio** para escolher para qual corpo ir. O corpo de agora fica guardado nele com tudo o que você carrega (mochila e armadura); no corpo novo você pega o que ele tinha (um clone novo vem vazio).
- **Ao morrer**, você acorda no corpo marcado como **casa** (no menu) ou no mais perto da mesma dimensão, com o inventário dele (os itens do corpo que morreu caem onde ele morreu). Sem corpo reserva, renasce normalmente. **Não há sistema de vidas** (como combinado).
- Quebrar um construtor ou armazém com um corpo dentro: o corpo se perde, mas o que ele carregava cai no chão.
- Os corpos ficam guardados no mundo (não são bichos): não somem se o lugar estiver longe.
- Capítulo novo no Diário: **Corpos reserva (Sync)**, 4 missões.

## Ar comprimido (Fase 20: PneumaticCraft)

- **Compressor de Ar**: queima combustível (toque com ele na mão ou baú em cima; carvão = 80 s) e põe 200 mL/s de ar na rede. Toque com a mão vazia para ligar/desligar.
- **Rede**: o compressor (5.000 mL), os **Tubos de Pressão** (1.000 mL; avançados 4.000 mL) e as câmaras ligadas por uma válvula. A pressão é igual na rede toda: bar = ar ÷ volume.
  - Tubos comuns: perigo acima de 5 bar e o compressor não passa de 7. Só tubos avançados: perigo acima de 20, máximo 25. **No perigo, a cada segundo há 5% de chance de um tubo estourar** (explosão).
- **Câmara de Pressão**: cubo oco de 3x3x3 a 5x5x5 feito de Paredes, Vidros, Válvulas e Interfaces, vazio por dentro (16.000 mL por bloco interno). Toque na **Válvula** para conferir; ligue um tubo nela.
  - Jogue os itens dentro (ou use a **Interface**, que puxa de um baú encostado e devolve os produtos para ele).

| Receita | Pressão |
|---|---|
| Lingote de ferro → Lingote de Ferro Comprimido (bloco → bloco) | 2 bar |
| 8 blocos de carvão → diamante | 4 bar |
| Folha de plástico + lingote de cobre → Placa de Circuito Vazia | 1,5 bar |
| Redstone + ferro comprimido → Transistor | 1 bar |
| Redstone + argila + ferro comprimido → Capacitor | 1 bar |

- **Manômetro**: toque num compressor, tubo, válvula ou interface para ver a pressão.
- Explodir ferro (o outro jeito do PneumaticCraft) ficou de fora: o jogo não diz ao script onde foi a explosão.
- Capítulo novo no Diário: **Ar comprimido (PneumaticCraft)**, 5 missões.

## Fazenda automática (Fase 19: MineFactory Reloaded)

- **Plástico**: Resina (quebrando toras ou cactos: 10% à mão, 25% na Colheitadeira) → fornalha → **Barra de Borracha**; 2 barras + carvão = 2 **Plástico Cru** → fornalha → **Folha de Plástico**. Com folhas: **Bloco de Máquina**, base de todas as máquinas.
- As máquinas trabalham a cada 5 s com energia da rede: entrada no baú **em cima**, saída no baú **embaixo**. A área de trabalho é um quadrado **na frente** da máquina (o lado da tela), 3x3; com **Upgrades de Alcance** +1 a +5 (lápis, ferro, estanho, cobre, bronze) vai até 11x11 (toque na máquina com o upgrade).

| Máquina | Faz | Custo |
|---|---|---|
| Plantadeira | planta sementes (do jogo e do HarvestCraft) em terra arada e mudas em terra/grama | 160 RF por planta |
| Colheitadeira | colhe plantas maduras (as do HarvestCraft voltam ao broto), melancia, abóbora, cana, cacto e árvores inteiras (até 64 toras) | 240 RF por bloco |
| Fertilizadora | gasta fertilizante ou farinha de osso para fazer 1 planta crescer | 960 RF |
| Rancheiro | tira leite das vacas da área (respeita os 20 min do Hunger Overhaul) | 320 RF |
| Triturador de Monstros | 8 de dano em até 3 monstros (não mexe com filhotes nem com bichos com nome); drops e 1 garrafa de experiência a cada 3 mortes | 3.200 RF por golpe |
| Esgoto | junta 25 mB de esgoto por animal na área (no meio dele) a cada 5 s | — |
| Compostadora | encostada no Esgoto: 100 mB = 1 Fertilizante | 800 RF |
| Quebrador de Blocos | quebra o bloco da frente | 400 RF |
| Colocador de Blocos | põe na frente o primeiro bloco do baú de cima | 400 RF |
| Esteira | passa 1 pilha por segundo do inventário de trás para o da frente (16 por receita) | — |

- **Fertilizante** na mão funciona como farinha de osso (também nas plantações do HarvestCraft).
- Capítulo novo no Diário: **Fazenda automática (MineFactory)**, 7 missões.

## Armazenamento (Fase 18: JABBA, AutoPackager, Applied Energistics)

- **Barril de Armazenamento** (JABBA): 1 tipo de item, 64 pilhas. Toque com o item na mão para guardar; dois toques rápidos guardam todos iguais da mochila; bata para tirar 1 pilha (agachado: 1 item). Quebrar solta tudo.
  - **Upgrade Estrutural MK I a VII** (tábuas, ferro, ouro, diamante, obsidiana, aço, esmeralda) abre 1, 3, 7, 15, 31, 63 ou 127 espaços. Cada **Upgrade de Armazenamento** usa 1 espaço e soma +64 pilhas. O **Núcleo de Funil** usa 1 espaço: puxa do baú em cima e manda para o de baixo. A **Chave de Barril** tira o último upgrade.
- **Carrinho**: toque num baú, baú com armadilha, barril ou barril de armazenamento para levar com tudo dentro; toque num bloco para pôr. O **de Diamante** também leva gerador de monstros (6 usos).
- **Empacotador Automático** (AutoPackager): compacta o que está no baú de cima (9 lingotes = bloco, 9 pepitas = lingote, 4 areias = arenito, 4 pedrinhas = pedregulho...) até 8 vezes a cada 5 s, 1.000 RF cada.
- **Rede ME** (Applied Energistics 1): o Terminal (Fase 8) agora vê também os Barris de Armazenamento e as células ME dos **Drives** (10 células) e **Baús ME** (1 célula) ligados por cabo. Com um **Controlador ME** na rede, o limite de inventários dobra (48 → 96).
  - **Células ME** 1k, 4k, 16k e 64k: 1.024 a 65.536 bytes, até 63 tipos; cada tipo ocupa 8/32/128/512 bytes e cada 8 itens, 1 byte (números do AE1). Guardam só itens simples (sem nome, texto ou dados). O conteúdo vai junto com a célula.
  - **Certus**: peneira de cascalho (1/40) e destroços; pulverizado vira Pó de Certus, que assado vira **Silício**. **Cristal Fluix** = certus + redstone + lápis (no AE1 levava quartzo do Nether, que não existe aqui). **Processadores** na Montadora.
  - **Ponto de Acesso** + **Terminal sem Fio**: abre o Terminal de qualquer lugar a até 32 blocos de um ponto ligado à rede.
- **Célula de Água** (ExtraCells): guarda até 768 garrafas; toque num condensador ou em água para encher; use com garrafas vazias na mochila para tirar Água Boa.
- Capítulo novo no Diário: **Armazenamento (JABBA e AE)**, 7 missões.

## Máquinas (Fase 17: Thermal Expansion)

Todas trabalham a cada 5 s: puxam do baú (ou funil) **em cima**, põem no baú **embaixo** (sem baú, soltam ao lado) e gastam energia da rede (cabos + baterias/células). Toque com a mão vazia para ver o estado.

| Máquina | Faz | Custo |
|---|---|---|
| Pulverizador | minério → 2 pós de metal (+10% de outro pó); pedregulho → cascalho → areia → poeira; osso → 6 farinhas de osso | 4.000 RF |
| Fornalha de Redstone | funde 2 itens por vez (minério, pó, areia, comida, águas...); 4 pedaços do Ex Nihilo = 1 lingote | 1.600 RF por item |
| Fundidora de Indução | 3 cobre + 1 estanho = 4 bronze; ferro + carvão = aço; minério bruto + areia = 2 lingotes | 1.600 a 3.200 RF |
| Serraria | tora → 6 tábuas (+25% serragem) | 800 RF |
| Extrusora Ígnea | pedregulho com lava e água encostadas | grátis |
| Precipitador Glacial | 4 bolas de neve com água encostada | 2.000 RF |
| Dínamo de Redstone | gera 80 RF/t; redstone = 64.000 RF, bloco = 576.000 RF (toque ou baú em cima) | — |

- **Células de Energia** (entram na rede como as baterias): Básica 400 mil RF, Reforçada 2 milhões, Redstone 10 milhões, Ressonante 50 milhões. A carga se perde se a célula for quebrada.
- **Pós de metal** também vão na fornalha comum e na fundição (1 pó = 1 lingote).
- Capítulo novo no Diário: **Máquinas (Thermal Expansion)**, 6 missões.

## Fundição (Fase 16: Tinkers' Construct)

- **Argamassa** (argila + areia + cascalho = 2) assada vira **Tijolo Refratário**; 4 tijolos = **Tijolos Refratários**. Com tijolos: Controlador (anel de 8), Tanque (anel com vidro no meio), Dreno, Vidro Refratário, Torneira, Mesa e Bacia de Fundição.
- **Montagem**: piso 3x3 de Tijolos Refratários; em cima, o interior 3x3 vazio; em volta do interior, uma parede de 12 blocos refratários (tijolos, vidro, tanque, dreno, o controlador no meio de um lado, virado para fora). Até 4 camadas (cada uma guarda 2.592 mB = 18 lingotes). Toque no controlador para conferir: ele diz o que falta.
- **Lava**: toque no Tanque com balde de lava (+1.000 mB, até 4.000). Cada item derretido gasta 10 mB.
- **Derreter**: jogue os itens dentro (até 4 por segundo). 144 mB = 1 lingote; pepita 16; bloco 1.296; **minério e pedaços rendem o dobro** (288 por minério). Peças de metal voltam ao que custaram.
- **Ligas**: cobre + estanho viram bronze sozinhos (3 + 1 = 4); jogue carvão com ferro derretido para fazer aço (144 mB por carvão).
- **Saída**: Torneira encostada no Dreno, em cima de uma Mesa (molde de lingote, pepita ou peça) ou de uma Bacia (bloco). Sai primeiro o metal que está embaixo; no menu do controlador dá para escolher qual sai primeiro.
- **Moldes**: ponha uma peça (de qualquer material), um lingote ou uma pepita na mesa e derrame 288 mB de ouro. O molde não gasta.
- **Ferramentas de metal**: ferro, cobre, bronze e aço só saem em peças da fundição. Estanho: pedaços na peneira (cascalho, areia e poeira, como o cobre); 4 pedaços = 1 lingote na bancada (ou o dobro na fundição).
- Capítulo novo no Diário: **Fundição (Tinkers' Construct)**, 7 missões.

## Ferramentas (Fase 15: Tinkers' Construct + Iguana Tweaks)

- **Padrão em Branco** (2 tábuas + 2 gravetos = 4). **Mesa de Moldes** (padrão sobre tábua), **Construtor de Peças** (padrão sobre tora) e **Estação de Ferramentas** (padrão sobre bancada).
- **Mesa de Moldes**: toque com um Padrão em Branco na mão e escolha a peça (cabo, ligação, cabeças de picareta/pá/machado, lâmina, guarda larga, travessa).
- **Construtor de Peças**: toque com o padrão na mão e escolha o material da mochila. Cabeças e lâmina custam 2, o resto 1. Materiais: madeira (tábuas), pedra (pedregulho), sílex, cacto, osso, obsidiana. Metal só pela fundição (Fase 16).
- **Estação de Ferramentas**: mão vazia = montar (Picareta = cabeça + ligação + cabo; Pá e Machadinha = cabeça + cabo; Espada Larga = lâmina + guarda larga + cabo). Com a ferramenta na mão = consertar (cada item do material da cabeça devolve 25%) ou modificar.
- **Varal** (o Drying Rack do TC; 3 lajes de carvalho em linha): toque com **Carne Podre** para pendurar (até 4, aparecem no varal). Em 5 minutos cada uma vira **Couro**; toque de novo para pegar. Olhando para ele, a linha de cima mostra quantas secam e quanto falta. Missão: tirar 8 couros.
- **Números do TC 1.6.4 com o Iguana**: a cabeça dá velocidade, dano e nível de mineração; durabilidade = cabeça × multiplicador do cabo × 0,5 (na picareta, média de cabeça e ligação). Ex.: sílex 171 e nível 1; obsidiana 89 e nível 3; ferro 250 e nível 2; aço 750 e nível 3.
- **Nível de mineração (Iguana)**: ferro, cobre e lápis pedem nível 1; ouro, redstone, diamante e esmeralda pedem 2; obsidiana pede 3. Com ferramenta fraca o bloco não quebra.
- **Ferramenta não some**: em 0 de durabilidade fica "quebrada" até ser consertada.
- **XP da ferramenta**: 1 por bloco ou golpe; nível 2 com 100 XP e cada nível seguinte ×1,35; 6 níveis (Desajeitada → Mestra). 1 espaço de modificador no começo, +1 nos níveis 2, 4 e 6.
- **Modificadores**: Pressa (16 redstones, até II: efeito Pressa com a ferramenta na mão), Reforço (diamante: +500), Esmeralda (+50%), Musgo (3 bolas de musgo: conserta 1 a cada 15 s).
- **Sílex**: 4 cascalhos = 1 sílex.
- Capítulo novo no Diário: **Ferramentas (Tinkers' Construct)**, 7 missões.

## Cozinha (Fase 14: Pam's HarvestCraft)

- **Sementes**: na peneira, a terra dá sementes do HarvestCraft no lugar das do jogo: milho e tomate 1/15; cebola, alho e feijão 1/32; pimenta, pimentão, arroz e amendoim 1/64. A areia dá semente de fruta do cacto 1/32. Qualquer colheita na bancada vira 1 semente.
- **Plantações** (só em terra arada): 3 estágios. A cada 30–60 s sobem 1 estágio com chance 50% × ¼ (HO) × ½ fora do bioma certo (deserto para a fruta do cacto; fora do deserto para as outras) × ½ com a terra seca; precisa de luz ≥ 9. Média: ~12 min no bioma certo com terra molhada, ~24 min no deserto, ~48 min no deserto com terra seca. A **Estufa** também faz elas crescerem.
  - Toque na planta madura para colher 1–3 (ela volta ao broto). Quebrar dá 1 semente (e a colheita, se madura). Farinha de osso: 1/3 de chance de subir 1 estágio; no Difícil não funciona (HO).
- **Utensílios** (blocos; toque para abrir a grade de receitas daquele utensílio): Tábua de Corte, Panela, Frigideira, Caçarola, Assadeira, Pilão, Tigela de Mistura, Espremedor. No HarvestCraft eles ficam dentro da grade; no Bedrock cada um vira uma "bancada" própria (o livro de receitas preenche a grade).
- **35 receitas**: sal (Água Salgada na Panela), farinha, fubá, massa, massa líquida, manteiga, queijo, maionese, caldo, ovos, torrada, pão, hambúrguer, tortilha, taco, burrito, feijão assado, arroz frito, sopas (legumes, cacto, tomate, arroz), suco de fruta do cacto, charque, pipoca, milho na espiga, pimentão recheado, pimentas empanadas, omelete, bolinho de arroz, pemmican, panquecas, broa de milho.
- **Valores (HO)**: comida de mod rende max(fome da 1.12 ÷ 4, 1) e saturação 0,1; pilha de 16 (até 2 de fome); tempo de comer = fome × 8 + 8 ticks. Sopas e caldo dão +5 de água e esquentam 0,05 °C; o suco dá +10 de água e refresca.
- Catálogo mostra cada receita no seu utensílio. Capítulo novo no Diário: **Cozinha do Deserto (HarvestCraft)**, 10 missões.

## Clima e fome (Fase 13: EnviroMine + Hunger Overhaul)

Os números são os do EnviroMine 1.1.63 e do Hunger Overhaul (ver `docs/pesquisa-mods.md`). Atualiza a cada 1,5 s.

- **Hidratação 0–100** (o progresso antigo de 0 a 20 vira 0 a 100). Mais leve desde a 1.1.0: perde 0,03 + 0,02 (deserto) + 0,03 (deserto de dia) por atualização; suando (corpo ≥ 38 °C) +0,05; correndo +0,03; com o efeito Fome +0,1. Abaixo de 10: fraqueza, fadiga e lentidão. Em 0: 4 de dano a cada 1,5 s.
- **Águas**: Boa (limpa) +25 e esfria 0,5 °C; Excelente (fria) +25 e esfria 1 °C; Suja +25, esfria 0,2 °C, com Fome/Veneno 25%; **Água Salgada** (antes "Imprópria") +10 e depois **desidrata** (−1 por 1,5 s por 30 s). A **garrafa de água do jogo** e a **poça** são salgadas (no Crash Landing toda fonte é salgada). Direto do condensador: +10.
  - Fornalha/fogueira: toda água ruim (e a garrafa de água) vira **Água Boa**. Água Boa + terra = suja; + areia = salgada; + bola de neve = fria. Garrafa + terra = suja. 8 folhas = 1 terra.
- **Temperatura do corpo em °C** (normal 37). Ar: **50 °C de dia**, **÷ 9 à noite** (≈ 6 °C), sombra −14 (a sombra refresca: 36 °C), um corpo acima de 37 °C esfria rápido fora do sol, água −5, dormindo +5, correndo +2, calor da terra no subsolo; a fonte de calor mais forte por perto (lava 200, fogo/fogueira 100, tocha/fornalha 75, gerador aceso 75) puxa o ar para cima. Armadura: couro +1 por peça; ferro esquenta ao sol; diamante refresca.
  - O corpo anda devagar até o ar (sobe 0,005 por atualização no deserto, cai 0,001; dentro da água cai 10× mais rápido). **Suar** (≥ 38 °C) gasta água e, com hidratação ≥ 75, segura o corpo.
  - **Insolação** I (≥ 39 °C, lentidão), II (≥ 41, fraqueza/fadiga/fome/náusea), III (≥ 43, 4 de dano). **Hipotermia** I (≤ 35), II (≤ 32), III (≤ 30). **Congelamento** depois de 3 e 6 min no frio (deixa cair o item da mão, quase não anda): só sai com **maçã dourada**.
- **Camel Pack** (8 couros em volta de uma garrafa): vista no peito **ou ponha na mão secundária** (deixa o peito livre para a armadura); agachado, use uma Água Boa para encher (4 garrafas = 100), ou agache e toque num **Condensador de Água** com a mão vazia (+75). Ele dá +1 de água por 1,5 s quando você precisa.
- **Qualidade do ar 0–100**: com céu, volta +2; no subsolo, cai perto de lava (−1), fogo (−0,5) e tochas (−0,25); folhas ajudam. **Na tempestade de areia, ao ar livre, o ar também cai.** ≤ 25 lentidão, ≤ 10 pior, 0 = 4 de dano.
- **Máscara de Gás** (5 ferros, vidro e 2 filtros) e **Filtro de Ar** (ferro + papel ou lã + carvão vegetal → 4): com a máscara o ar fica em 100 gastando a carga (1.000). Use um filtro com a máscara vestida: +500.
- **Hunger Overhaul**:
  - comida do jogo rende como no HO: crua 1 de fome, cozida 2, pão 3, torta 3 (saturação bem menor);
  - não dá para comer com o efeito Fome; **Bem Alimentado** ao comer (a vida volta 25% mais rápido);
  - a **regeneração do jogo é desligada**: a vida só volta com fome ≥ 7, sem gastar fome, mais devagar quanto mais ferido (e 1,5× mais lento no Difícil); levar dano zera o contador;
  - fome cai um pouco o tempo todo; renascer com fome 16 (Normal) ou 12 (Difícil);
  - fome ≤ 5 ou vida ≤ 25%: lentidão, fadiga, fraqueza e náusea, mais fortes quanto pior;
  - animais: cruzar a cada 20 min, ovos 4× mais raros, vaca dá leite a cada 20 min.
- O painel mostra água, corpo em °C (e o ar entre parênteses), ar quando < 100% e o estado (Insolação II, Faminto...).
- Capítulo novo no Diário: **Clima e Fome (EnviroMine)**, 5 missões.

## Ex Nihilo (Fase 12)

Como no Crash Landing, tudo começa na areia. Números do Ex Nihilo (ver `docs/pesquisa-mods.md`).

- **Martelo** (madeira, pedra, cobre, ferro, ouro, diamante; receita `_M_ / _GM / G__`): quebrar com ele dá o próximo da cadeia: **pedregulho → cascalho → areia → poeira**; pedra dá pedrinhas. Durabilidade igual à das ferramentas do mesmo material.
- **Peneira**: toque com **terra, cascalho, areia ou poeira** para carregar e depois **14 toques** (ou segure o dedo) para peneirar. Cada linha é sorteada à parte:
  - terra: pedrinhas (2 certas + 4 com 50/50/33/33%), sementes, mudas;
  - cascalho: sílex 25%, carvão 12,5%, lápis 5%, diamante 0,8%, esmeralda 0,7% e **pedaços quebrados** de minério;
  - areia: cacau, cacto, muda da selva, cogumelo e **pedaços triturados**;
  - poeira: farinha de osso 20%, redstone 12,5%, pólvora, pó de glowstone, pó de blaze e **pó de minério**.
  - Pedaços de minério: ferro 1/5, ouro 1/32, cobre 1/18. **4 pedaços (quadrado) = 1 minério bruto** → fornalha = 1 barra.
  - A Peneira Automática usa as mesmas tabelas.
- **Pedrinhas**: 4 em quadrado = 1 pedregulho.
- **Barril** de madeira (`T_T / T_T / TLT`, L = laje de madeira) ou de pedra (pedra e laje de pedra lisa):
  - compostagem com os valores do Ex Nihilo (muda/folha 12,5%, carne podre 10%, carne 20%...); cheio, vira **terra** em 50 s;
  - balde de água ou de lava (lava só no de pedra); balde vazio tira de volta;
  - água + poeira = **argila**; água + leite = **slime** (bolas; depois nasce um Slime); lava + redstone = netherrack; lava + pó de glowstone = pedra do End;
  - lava com **água em cima** = **obsidiana**; água com **lava em cima** = pedregulho.
- **Cadinho**: porcelana (argila + farinha de osso) → 7 porcelanas = Cadinho Cru → fornalha. Coloque em cima de uma fonte de calor (tocha 0,1 mB/t, fornalha acesa 0,15, lava 0,2, fogueira 0,2, fogo 0,3, Gerador a Carvão aceso 0,15). Pedregulho/pedra/cascalho = 250 mB de lava (4 = 1 balde), netherrack 1.000; neve 500 e gelo 1.000 de água; **folhas 125 mB de água** (como o pack fazia). Balde vazio tira 1.000 mB.
- **Cajado** (gravetos em forma de bengala): folhas soltam **bicho-da-seda** (1/100). Use o bicho numa folha: ela fica **infestada**, chega a 100% em ~100 s e passa para as vizinhas. Quebrada, dá **linha**.
- **Garrafa cercada de 8 cactos** = Água Boa (Ex Aliquo).
- Capítulo novo no Diário: **Do Nada (Ex Nihilo)**, com 13 missões.

## Diário 2.0, Catálogo, o que estou olhando, Organizador (Fase 11)

**Diário 2.0** (no estilo do Hardcore Questing Mode):
- O Diário abre numa lista de **8 capítulos** (A Queda, Máquinas, Comida e Vida, Energia, Exploração, Perigos do Deserto, Consertar a Nave, Equipamento). Cada capítulo lista as missões: `!` aberta, `+` feita, `*` falta escolher a recompensa, `-` bloqueada, `~` pulada.
- Agora **várias missões ficam abertas ao mesmo tempo**. Uma missão bloqueada mostra o que falta fazer antes.
- Tipos novos: **entregar** (botão "Entregar os itens" tira da mochila) e **consumir** (comer/beber).
- Algumas missões dão uma recompensa **"escolha 1"**: o Diário mostra "Escolher recompensas" até você escolher.
- **Sacolas de recompensa** (comum, boa, ótima, épica, lendária): usar a sacola sorteia um grupo de itens com os pesos do HQM. As chances aparecem no Catálogo.
- **Seu progresso antigo é mantido**: na primeira vez que o Diário 0.17 lê o progresso da 0.16, as missões feitas continuam feitas.

**Catálogo** (no estilo do JEI). Receita: graveto + areia + papel (sem formato). Também abre pelo botão "Catálogo" no Diário.
- Lista com ícone de todos os itens do add-on e dos itens do jogo que ele usa, em páginas. **Procurar** busca pelo nome (com ou sem acento), em português ou inglês; `@pouso` ou `@minecraft` filtra pelo "mod".
- Em cada item: **Como fazer** e **Onde usar**, com bancada (grade 3×3), fornalha, peneira (com as chances), compostor, montadora, gerador (quanto RF rende), condensadores, Painel da Nave, drops de monstros, saques (cidade, torre, masmorras, destroços, templo, cápsula) e sacolas. Tocar num ingrediente abre o dele.
- **Agachado**, usar o Catálogo abre o bloco que você está olhando (ou o último item que você segurou). "Sua barra rápida" mostra os itens da barra.
- O botão "+" do JEI não é preciso: o livro de receitas da bancada do Bedrock já preenche a grade.

**O que estou olhando** (no estilo do WAILA): na barra de ação, acima do painel de água e temperatura, aparece o nome do bloco ou do bicho na mira, o "mod" dele e um detalhe: energia da bateria, combustível do gerador, pontos do compostor, baldes do condensador, crescimento de plantas, vida dos bichos.

**Organizador** (no estilo do Inventory Tweaks). Receita: baú + 2 gravetos (sem formato).
- Usar no ar arruma a mochila (junta pilhas e ordena; a barra rápida fica como está). Usar num baú/barril arruma o baú.
- **Reabastecer**: quando a pilha da mão acaba (colocando blocos, comendo ou bebendo) ou a ferramenta quebra, outra igual vem da mochila para a mão.
- **Opções** (no Diário): ligar/desligar o "o que estou olhando" e o reabastecer.

**Energia em RF**: a energia agora aparece em RF, com a escala do Thermal Expansion: painel solar 40 RF/t, gerador 80 RF/t (igual ao Steam Dynamo), carvão = 32.000 RF, bateria = 60.000 RF. Por dentro nada mudou (mundos antigos continuam iguais).

**`/cl:diagnostico`**: versão, conteúdo que o jogo não carregou, e o **tempo de script por sistema** e os **blocos ativos** de cada máquina no último minuto.

Missões novas: Bem hidratado (beber 5 Águas Boas), O Catálogo, Tudo no lugar, Surpresa! (abrir 3 sacolas) e Sucata útil (entregar 18 pepitas de ferro).

## Diário de Bordo (Fase 2)

- Ao entrar, cada jogador recebe o **Diário de Bordo**. Segure-o e use (no celular: toque e segure na tela) para abrir o menu.
- O menu mostra a missão atual, o progresso e a recompensa. Ao concluir, a recompensa vai para o inventário (ou cai no chão, se estiver cheio), toca um som e a próxima missão aparece no chat.
- **Missões concluídas** lista o que você já fez. **Pular esta missão** passa para a próxima sem recompensa (só para o caso de alguma missão travar).
- Perdeu o diário? Faça outro: **graveto + areia** (sem formato, dá até no inventário).
- O progresso é salvo por jogador. Num mundo com amigos, cada um tem suas missões.

| # | Missão | Objetivo | Recompensa |
|---|---|---|---|
| 1 | Raízes | plantar 1 muda de carvalho | 1 muda, 2 farinhas de osso |
| 2 | Lenha | quebrar 4 troncos de carvalho | 4 sementes de trigo |
| 3 | Oficina improvisada | colocar uma mesa de trabalho | 2 terras |
| 4 | Pedra da peneira | ter 8 pedregulhos (depois da missão da Peneira) | 4 tochas |
| 5 | Fogo | colocar uma fornalha | 4 carvões |
| 6 | Metal | ter 3 barras de ferro | 1 balde |
| 7 | Água no deserto | colocar um Condensador de Água (feito) | 2 terras |
| 8 | Primeira gota | ter 1 balde de água | 3 farinhas de osso |
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
  - **prédios** de 2 a 9 andares (mais altos no centro) de **tijolos de pedra rachados** (com remendos de tijolo inteiro, musgo e pedregulho), **bem quebrados**: buracos nas paredes e nos pisos, cantos desabados, janelas sem vidro ou com grade e **barras de ferro tortas** saindo das partes quebradas e do telhado;
  - **escadas de tijolo de pedra** entre os andares, até o telhado;
  - por dentro: **escuro** (monstros nascem sozinhos), **móveis largados** (carpete gasto, mesas com cadeiras, estantes, vasos, teias de aranha), **baús** em vários andares e **Geradores de Monstros**;
  - alguns quarteirões são só escombros; o **chão é quase todo areia e arenito**, com pedaços de calçada aparecendo e entulho encostado nos prédios;
  - no **centro**, uma praça com a **torre de rádio** (34 blocos, andaime por dentro). Lá em cima: um baú com diamantes, ferro, redstone, Água Excelente e às vezes maçã dourada… guardado por um gerador.
- **Masmorras.** Salas escondidas no subsolo (~1 a cada 25 chunks), escuras, com um Gerador de Monstros no meio e 1 ou 2 baús:
  - **comuns** na pedra (y 12 a 26), de pedregulho com musgo. Metade tem um **poço** até a superfície, marcado por um **anel de arenito entalhado** na areia (com feno no fundo para amortecer a queda; para sair, cave ou faça uma escada);
  - **fundas** na ardósia (y -45 a -25), com 2 geradores e saque muito melhor (diamantes, ouro, esmeraldas, maçã dourada).
- **Gerador de Monstros.** Com um jogador a até 20 blocos, põe 1 ou 2 monstros em volta a cada 10 s (até 5 por perto). Abaixo de y = 0 vêm esqueletos, errantes, aranhas das cavernas e creepers. Leva uns 5 s para quebrar, não cai como item e dá ferro, ouro, redstone e experiência. Não explode com creeper.
- **Destroços de outras naves.** Raros e espalhados pelo mapa (um a cada ~3.900×3.900 blocos; `/cl:destrocos` mostra o mais perto): uma nave igual à sua, meio enterrada, com um baú de ferro, cobre, redstone, vidro e água.
- **Tempestade de areia.** Começa **ao acaso, a qualquer hora** (em média uma a cada ~45 min de jogo, com pelo menos 15 min de pausa depois de cada uma) e dura **25 minutos**: aviso na tela, **névoa amarela** que fecha a visão, e quem estiver ao ar livre fica lento. A sede cai 1,5× mais rápido. O painel mostra o tempo que falta (`Tempestade 24:10`). Com trapaças: `/scriptevent cl:tempestade` começa uma na hora e `/scriptevent cl:tempestade_fim` acaba.
- **Comandos para achar lugares** (funcionam **sem trapaças**; mostram coordenadas, distância e direção no chat):
  - `/cl:cidade`: cidade abandonada mais perto;
  - `/cl:templo`: templo soterrado mais perto;
  - `/cl:destrocos`: destroços de nave mais perto;
  - (Se nenhum outro add-on tiver um comando com o mesmo nome, dá para digitar sem o `cl:`, por exemplo `/cidade`.)
- Números em `CIDADE`, `RARAS`, `MASMORRA`, `GERADOR_MONSTROS` e `TEMPESTADE` no `scripts/config.ts`.

## Visual das máquinas (Fase 9)

Estilo futurista e minimalista: corpo branco-gelo, base grafite e uma faixa de luz da cor da função (**ciano** = energia, **laranja** = calor/montagem, **azul** = água, **verde** = vida, **violeta** = armazenamento). Tudo é gerado por `tools/gerar-visual.mjs` (texturas 32x32, modelos e ícones), rodado pelo build.
- **Modelos 3D próprios** (`RP/models/blocks/cl_*.geo.json`) para condensadores, peneiras, compostor, estufa (vidro com uma muda dentro), painel solar (placa inclinada num pé), gerador (com chaminé), bateria (janela de carga), cabo, moinho (torre com rotor), Montadora (com braço), Terminal e Painel da Nave (telas inclinadas).
- **Virados para você**: gerador, moinho, Montadora, Terminal e Painel da Nave ficam de frente para quem coloca.
- **Animações** (texturas animadas): água do condensador ondulando, tela do Terminal rolando a lista, radar girando no Painel da Nave, brilho passando no painel solar, rotor do moinho girando, brasa do gerador aceso tremulando, mesa da Montadora pulsando.
- **Luzes que não escurecem**: faixas, telas e janelas de carga usam material sem sombra, então "acendem" mesmo no escuro.
- **Cabos que se conectam**: o cabo é fino e liga um braço para cada vizinho da rede (outro cabo, bateria, gerador, máquina, Terminal, baú da rede), ao pôr ou quebrar blocos do lado.
- **Partículas próprias** (`RP/particles/`): faíscas ciano ao instalar peças na nave, faíscas laranja quando a Montadora termina uma peça, pontinhos de energia quando ela trabalha, quando o painel solar carrega e ao abrir o Terminal, e fumaça no gerador.
- **Ícones novos** das peças da nave, do Coração do Faraó e do Diário de Bordo.
- Sons: usam sons do próprio jogo (bigorna, farol); sons gravados próprios ficam para depois.

## Consertar a nave (Fase 8)

- **Painel da Nave** (`cl:painel_nave`): já vem no painel de controle da cabine do avião caído (se sumir, tem receita: ferro, vidro e redstone). Toque nele: mostra os 4 sistemas e o que falta. Com as peças na mochila, **Instalar** conserta o sistema (vale para o mundo todo).
  | Sistema | Peças |
  |---|---|
  | Casco | 12 Placas de Casco + 8 vidros |
  | Computador de Bordo | 1 Computador de Bordo |
  | Combustível | 8 Células de Combustível |
  | Motor | 1 Motor da Nave (leva o **Coração do Faraó**) |
  Com os 4 prontos, o painel ganha o botão Decolar (Fase 10).
- **Montadora** (`cl:montadora`; bancada: ferro, pistão, redstone e bancada de trabalho): máquina de energia que faz as peças. Ingredientes num baú/funil **em cima**, peça no baú/funil **embaixo** (ou cai do lado). Gasta 1 E a cada 5 s de uma bateria ligada por cabos; a primeira receita completa no baú é a que ela faz. Toque nela para ver as receitas e o andamento:
  | Peça | Ingredientes | Energia |
  |---|---|---|
  | Placa de Casco | 3 ferro + 2 cobre | 2 E |
  | Circuito | 2 redstone + 1 ouro + 1 cobre | 2 E |
  | Célula de Combustível | 4 carvão + 1 Água Boa + 1 ferro | 3 E |
  | Computador de Bordo | 6 circuitos + 1 diamante + 4 vidros + 4 ouro | 12 E |
  | Motor da Nave | Coração do Faraó + 4 blocos de ferro + 4 circuitos + 1 Bateria | 15 E |
  Os destroços de outras naves agora também têm circuitos e placas; as cidades, às vezes, um circuito.
- **Terminal de Armazenamento** (`cl:terminal`; bancada: ferro, vidro, redstone e baú), uma rede de baús no estilo **Applied Energistics**:
  - todo baú, baú com armadilha ou barril **encostado num cabo** ligado ao terminal (ou no próprio terminal) entra na rede, até 48 (baú duplo conta como um);
  - tocar no terminal gasta 1 E de uma bateria da rede e abre um menu com **tudo o que está guardado, somado**;
  - **tirar** 1, 16, 64 ou tudo de um item; **procurar** pelo nome em inglês (ex.: `iron`, `sand`); **guardar a mochila** inteira de uma vez (a barra rápida e o Diário ficam com você);
  - ajuste em `ARMAZENAMENTO` no `scripts/config.ts`.
- Missões novas: Montadora, Terminal, 4 placas, casco, 4 circuitos, computador, combustível e motor.

## Perigos do deserto (Fase 7)

- **Múmia** (`cl:mumia`): um pouco maior que um zumbi, 30 de vida; o golpe dá **fome**. Deixa carne podre, às vezes **Faixa de Múmia**, osso e pepitas de ouro.
- A múmia nasce sozinha à noite no deserto (e no subsolo escuro), entra nas **ondas da horda** e sai dos **Geradores de Monstros**. De dia, como os zumbis, queima no sol.
- O **Escorpião do Deserto** saiu do jogo na 1.1.0: não nasce mais e os que existiam num mundo antigo somem (a missão dele virou "derrote 5 husks").
- **Golem de Areia** (`cl:golem_areia`): só aparece **durante a tempestade de areia**, perto de quem está ao ar livre (no máximo 2 por perto). Grande, lento, 60 de vida, bate forte e quase não é empurrado. O sol não o queima. Quando a tempestade acaba, ele **desmorona** e vira areia. Morto, deixa areia, arenito e às vezes vidro.
- **Faraó Amaldiçoado** (`cl:farao`), o chefe: faça o **Ídolo Amaldiçoado** (bancada: 4 barras de ouro nos cantos, 4 Faixas de Múmia nos lados, arenito talhado no meio), coloque e **toque nele à noite**. Ele sobe da areia com barra de chefe e 300 de vida:
  - chama múmias a cada 12 s;
  - solta uma **rajada de areia** a cada 7 s: fere, empurra e cega quem está a até 7 blocos (fique longe e use arco);
  - com metade da vida, **chama uma tempestade de areia** (e com ela os golens);
  - não queima no sol nem é empurrado. Só um por vez.
  - Derrotado, deixa o **Coração do Faraó** (vai ser usado para consertar a nave, na Fase 8), 8 a 16 barras de ouro, diamantes, maçãs douradas e faixas.
- Missões novas: 5 múmias, 5 husks, um golem, 4 faixas, colocar o ídolo e derrotar o Faraó.
- Para testar no criativo: ovos de cada monstro no inventário, ou `/summon cl:farao`. Ajuste vida e dano em `BP/entities/*.json`; habilidades do Faraó e do golem em `FARAO` e `GOLEM_AREIA` no `scripts/config.ts`.

## Energia (Fase 5)

A energia fica guardada nas **baterias** (60.000 RF cada; na tela tudo aparece em RF desde a Fase 11). Geradores mandam energia para a bateria mais próxima com espaço; máquinas puxam da mais próxima com carga. "Próxima" = encostada ou ligada por **cabos** (até 64 cabos). Painéis, moinhos, geradores e baterias também passam energia, como os cabos. Toque em qualquer bloco de energia com a mão vazia para ver o estado.

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
  - nas **planícies**: morros de até 7 blocos, mesas (platôs com faixa de terracota) e grupos de rochas;
  - **raros e espalhados ao acaso** pelo mapa (15 templos e 15 destroços a cada 15.000×15.000 blocos: um de cada por quadrado de ~3.900×3.900 blocos, num lugar sorteado; use `/cl:templo` e `/cl:destrocos` para achar), com chão plano em volta: o **templo soterrado** (pirâmide de arenito própria do add-on, com baú de saque: ossos, gravetos, linha, carne podre, às vezes pepitas de ferro, pão, terra, muda e, bem raramente, balde) e os **destroços de outra nave** (Fase 6). Ajuste em `RARAS` no `scripts/config.ts`;
  - em todo lugar: arbustos secos (dão gravetos) e **cactos** de 1 a 3 blocos (`RELEVO.cacto`);
  - **minérios:** cada chunk recebe veios de carvão, cobre, ferro, ouro, redstone, lápis-lazúli e diamante, em alturas parecidas com as do mundo normal (abaixo de y = 0 saem as versões de ardósia). Quantidades em `MINERIOS` no `scripts/config.ts`;
  - chances, tamanhos e o saque ficam em `RELEVO` e `TEMPLO_SAQUE` no `scripts/config.ts`;
  - cada chunk decorado ganha um bloco de **deepslate reforçado** na primeira camada de ardósia (y = -63), no canto do chunk. É a marca de "já feito", para nada ser refeito ao reabrir o mundo. Ele não quebra no modo sobrevivência.
- **Sem cavernas e sem água.** Mundo plano não tem cavernas, aquíferos, rios nem mares. Também não chove (bioma de deserto).
- **Sem animais:** em `BP/spawn_rules/` as regras de spawn de todos os animais do Overworld estão vazias: vaca, porco, ovelha, galinha, coelho, cavalo, burro, lhama, camelo, lobo, raposa, abelha, sapo, cabra, panda, papagaio, jaguatirica, urso-polar, tatu, tartaruga, morcego, peixes, lula, golfinho, axolote e náutilo.
- **Mais monstros à noite:** zumbi, husk, esqueleto, aranha e creeper nascem em grupos maiores e com mais frequência (regras de spawn reforçadas). Além disso, a cada 5 s nascem 4 monstros extras a 12–28 blocos de cada jogador, até ter 60 por perto.
- **A noite** (mais leve desde a 1.1.0): a cada 10 s nascem até 2 monstros extras perto de cada jogador, se houver menos de 25 por perto.
- **A horda:** só a cada 10 noites (a 10ª, a 20ª...). No fim da tarde aparece "Noite de horda"; à noite vêm três ondas (horas 14000, 17000 e 20000 do jogo). Em cada uma aparece "A horda chegou! Onda N de 3", toca uma corneta e nascem monstros a 8–20 blocos de cada jogador: 8 + 1 por dia do mundo (até 30). Nada disso acontece no Pacífico, no criativo nem fora do Overworld. Se algo der erro, aparece uma linha vermelha no chat. Ajuste em `HORDA` no `scripts/config.ts`.
- **O sol:** de dia, monstros expostos ao céu pegam fogo, menos husks, aranhas e creepers (como no jogo normal). Quem estiver na sombra ou no subsolo escapa.
- **Nada nasce de dia ao ar livre:** se o jogo fizer um monstro nascer de dia sob o céu aberto, o script remove na hora. No subsolo e na sombra o spawn continua normal. (Ovos de spawn usados de dia ao ar livre também são removidos.)
- **Slimes:** no Bedrock eles nascem em qualquer luz em "slime chunks" abaixo de y = 40. Com o chão em y = 45 eles não nascem na superfície (as regras do slime também ganharam filtro de escuridão).
- **Avião caído.** Ao entrar no mundo pela primeira vez, o avião da queda aparece ao lado do jogador (uns 44 x 35 blocos, mais o rastro da queda): inteiro (é o seu abrigo para a noite), sem as turbinas das asas. Ele está **afundado 3 blocos na areia** (1.3.2): as asas ficam rente ao chão e não sobra vão embaixo onde nasçam monstros. Tem **portas** dos dois lados, no nível do chão, luz dentro e o Painel da Nave na cabine. A área é carregada antes de montar (pode levar alguns segundos). No porão de carga há um baú com o que sobrou: Condensador de Água, 1 balde, 6 pães, 8 tochas, 4 terras e 2 mudas de carvalho. Se a nave não puder ser colocada, os itens vão direto para o inventário. Em volta da nave o chão fica plano.
- **Trocar a nave ou as estruturas.** Construa no jogo, salve com o **Bloco de Estrutura** e substitua o arquivo em `BP/structures/cl/` (mesmo nome). Para a nave, ajuste `NAVE.bau` no `scripts/config.ts` para a posição do baú.
- **Diagnóstico no chat:** se algum bloco ou item do add-on não carregar, aparece uma linha vermelha `o jogo não carregou: ...`. Ao entrar, aparece também uma linha cinza `[Pouso Forçado 0.16.0] mundo: plano | biomas: ... | bioma aqui: ... | luz: céu N, total N | hora: N`. No mundo plano do add-on, "mundo" é `plano` e "bioma aqui" é `minecraft:desert` (num mundo infinito: `normal` e `cl:deserto_seco`); ao ar livre, "céu" deve ser 15.

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
6. **Templo:** é raro (um a cada ~3.900×3.900 blocos). Digite `/cl:templo` para ver onde fica o mais perto e vá até lá: uma pirâmide de arenito com faixas laranja, num pedaço plano. Entre pela abertura no nível do chão e abra o baú.
7. **Só uma vez:** saia e entre de novo. Nada deve ser recolocado (nem nave, nem dunas em cima das antigas).
8. **Sem animais e sem água:** de dia, nenhum animal; nenhuma água em lugar nenhum.
9. **Noite:** no sobrevivência, vem um pouco mais de monstro que o normal. Na noite de horda, nas horas 14000, 17000 e 20000 (pode usar `/time set 13900` com trapaças ligadas) aparece "A horda chegou!" e chega uma onda.
   A horda só vem na 10ª noite (`/time set 9` dias à frente, ou `/time add`). De manhã (`/time set 1000`), zumbis, esqueletos e múmias no descampado pegam fogo; husks, aranhas e creepers não. Pelo caminho devem aparecer cactos.
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

## Testes no servidor Bedrock (com jogador simulado)

- `tools/testar-servidor.mjs <pasta do servidor>` monta um mundo de testes no Bedrock Dedicated Server (baixado de minecraft.net, não vem no repositório) com o add-on e o pacote `tools/teste/BP`, que usa o jogador simulado do GameTest. No mundo de testes o add-on passa a usar as APIs beta (só lá).
- No console do servidor: `tickingarea add 400 0 60 560 0 100 testes true`, depois `execute positioned 500 46 0 run gametest run pouso:aviao` (tem que ser o primeiro) e `execute positioned <x> 46 75 run gametest run pouso:<teste>` para `varal`, `cinzel`, `caldeirao`, `nether`, `estante`, `lampada`, `celula`, `torre`, `saco` e `ferro_comprimido`.
- O que não dá para testar assim: menus (o jogador simulado não responde formulários), o visual e o tempo real de crescer plantas.

## Limitações do Bedrock (e o que fiz no lugar)

- **Relevo do mundo plano:** o jogo não gera relevo em mundo plano, então as dunas e os morros são colocados por script. Para não aparecerem "brotando" perto de você, o script carrega e decora os chunks até 12 chunks de distância com ticking areas. Se a sua distância de renderização for maior que 12 chunks, o que estiver mais longe ainda aparece plano até você se aproximar (dá para aumentar `RELEVO.raioChunks`, mas pesa mais). Custo: no máximo 6 chunks decorados por segundo e uma ticking area aberta por vez.
- **Templos e vilas vanilla:** não existem no mundo plano, e `/place structure` só aceita estruturas "jigsaw". O templo soterrado é próprio do add-on.
- **Água infinita (2 baldes formando fonte):** o Bedrock não tem regra para desligar. Bloquear isso exigiria vigiar a água em volta do jogador o tempo todo, e esse é o tipo de gambiarra pesada que evitei. Ficou como marco de progressão: no começo só há 1 balde e quase não há ferro.
- **Mundo montado à mão:** o `level.dat` foi montado sem passar pelo jogo. Se o mundo não abrir ou não sair plano, use os `.mcpack` num mundo infinito enquanto eu ajusto o arquivo.
