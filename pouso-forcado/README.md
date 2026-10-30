# Pouso Forçado — add-on para Minecraft Bedrock 26.30+

Sua nave caiu num deserto sem água. Recursos são escassos e a progressão vem por missões.
Projeto próprio, inspirado no modpack **Crash Landing** (Minecraft 1.6.4) e nos mods dele. As mecânicas e os números
seguem os originais; o código é todo próprio; texturas de terceiros só quando a licença deixa (ver `CREDITOS.md`).
A pesquisa dos mods e o plano das fases estão em `docs/pesquisa-mods.md`.

**Versão 1.10.2: todas as fases prontas** (0 a 23, com a 10, o final, feita por último), mais Mekanism (com os add-ons Generators e Tools), Ender IO, Create, Waystones, Mochila, Robô Minerador (ComputerCraft), Extra Utilities, redemoinhos do Weather2, BuildCraft, OpenBlocks e o Galacticraft até a Lua (com o final novo: o Núcleo de Salto). O plano das próximas versões está em `docs/proposta-galacticraft.md`.

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
- Confira a versão na linha cinza do chat ao entrar: `[Pouso Forçado 0.16.0] mundo: plano | ...`.

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
