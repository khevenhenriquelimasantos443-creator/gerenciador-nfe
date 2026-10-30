# Proposta: a saída do planeta (Galacticraft) e mods novos

Rascunho para decidir antes de começar. Nada disto está no jogo ainda.

## O que o Bedrock deixa fazer agora

- **Dimensões próprias (testado):** desde a 26.30, um add-on registra dimensões novas por script, sem experimentos (`system.beforeEvents.startup` → `dimensionRegistry.registerCustomDimension("cl:lua")`, já no `@minecraft/server` 2.8.0 que o projeto usa). No servidor de testes (BDS 1.26.52):
  - a dimensão nasceu vazia, com altura de −64 a 320;
  - aceitou blocos, e eles continuaram lá depois de reiniciar;
  - recebeu um objeto teleportado do mundo normal;
  - fez nascer um zumbi.

  O terreno sai todo por script, como as nossas dunas.
- **Não testado ainda (só dá para ver no celular):** a cor do céu. A dimensão tem luz do céu 15 e passa o dia e a noite junto com o mundo. Céu preto de espaço talvez precise de névoa por câmera (`/fog`); se não der, fica um céu escuro "de entardecer" fixo.
- **Gravidade:** não há API. Imita-se com efeitos (pulo mais alto + queda lenta), como já fazemos no petróleo e na asa-delta.
- **Oxigênio:** reaproveita a qualidade do ar do EnviroMine: no vácuo, o ar cai rápido; com máscara e tanque, segura.

## O Galacticraft como ato final

Hoje o jogo termina quando a nave decola (cena e créditos). A ideia: a nave consertada só chega à órbita, e a volta para casa passa pela Lua.

**História:** com os 4 sistemas consertados, o Painel da Nave detecta que a **bobina de salto** queimou na queda: a nave sobe, mas não salta para casa. O rádio capta um sinal na Lua do planeta: uma base de pesquisa abandonada, com um **Núcleo de Salto** guardado na masmorra. É preciso um foguete para chegar lá, voltar e instalar o núcleo. Aí sim vem a decolagem final e os créditos.

### O que entra (com o que já temos)

| Galacticraft | Aqui | Já existe no jogo |
|---|---|---|
| Alumínio, estanho, cobre, silício | veios de alumínio + bauxita na peneira de cascalho; silício já sai do certus | estanho, cobre, silício (AE) |
| Compressor (placas comprimidas) e Compressor Elétrico | placas de ferro, aço, bronze, alumínio; **Placa Reforçada** | aço e bronze (Tinkers/Thermal) |
| Fabricador de Circuitos | wafers de silício (básico e avançado) | circuito da Montadora |
| Petróleo → Refinaria → combustível | o mesmo combustível do BuildCraft | bomba, refinaria |
| Coletor de Oxigênio, Compressor de Oxigênio | enche tanques; o oxigênio dos cilindros do Mekanism também serve | Separador Eletrolítico |
| Máscara, Equipamento de Oxigênio, tanques leve/médio/pesado (900/1.800/2.700) | equipamento EVA; com dois tanques, mais tempo | qualidade do ar |
| Bancada da NASA + Foguete Tier 1 (1 bico, 8 placas reforçadas, 4 aletas, 1 motor; baús para carga) | o foguete é uma entidade com modelo próprio, montável | cena da decolagem |
| Plataforma de lançamento 3×3 + Carregador de Combustível | 1 balde (1.000 mB) por lançamento | — |
| Lua: pouca gravidade, sem ar, crateras, minério de queijo, meteoros | dimensão `cl:lua`, terreno por script | meteoritos |
| Masmorra lunar com chefe (o Esqueleto Evoluído) e esquemas | chefe com o Núcleo de Salto; esquema do Tier 2 | Faraó (chefe) |
| Estação espacial | dimensão `cl:orbita`: plataforma inicial e volta por foguete | — |

### Em etapas (uma versão cada)

1. **1.6.0, a base:**
   - alumínio, compressor, placas, wafers;
   - oxigênio (coletor, compressor, máscara, equipamento, tanques);
   - Bancada da NASA, plataforma, carregador e o Foguete Tier 1;
   - a dimensão `cl:lua` com terreno simples (pó lunar, rocha, crateras);
   - ida e volta: o foguete sobe numa cena, aterrissa na Lua numa cápsula com paraquedas, e volta pelo mesmo foguete.
2. **1.6.1, a Lua de verdade:**
   - minérios lunares, meteoros caindo;
   - monstros lunares (zumbi, esqueleto e aranha "evoluídos", com tanque de oxigênio);
   - a base de pesquisa, a masmorra e o chefe com o Núcleo de Salto.
3. **1.6.2, o final novo:**
   - instalar o núcleo no Painel da Nave;
   - "Saltar para casa" com cena nova e créditos;
   - capítulo "Rumo às estrelas" no Diário.
4. **Depois (opcional):** estação espacial em órbita, Tier 2 e Marte.

### Para não quebrar mundos

Mundos que já decolaram continuam no modo infinito e ganham o capítulo novo; o botão Decolar passa a ser "Subir à órbita" só nos mundos que ainda não decolaram.

## Outros mods que combinam

Do mais útil para o menos, pensando no deserto e no celular:

| Mod | O que traria | Por que combina | Trabalho |
|---|---|---|---|
| **Waystones / Âncoras de Viagem (Ender IO)** | pedras de viagem: liga a base às cidades e viaja pelo menu | o mapa é enorme e as cidades ficam longe | pequeno |
| **Mochilas (Forestry / Iron Backpacks)** | mochila com inventário próprio, com melhorias | o celular sofre com inventário cheio | médio |
| **Lycanites Mobs (deserto)** | o **Crusk**, verme gigante que nada na areia; o **Joust**, lagarto que dá para domar e montar | o deserto ganha bichos próprios e uma montaria | médio |
| **ComputerCraft (versão leve)** | **Robô Minerador**: programas no menu (cavar túnel, limpar área, colher) | automação sem redstone | médio |
| **Extra Utilities (pedaços)** | Lixeira, Regador e o Gerador de Calor solar | coisas pequenas que fazem falta | pequeno |
| **Weather2** | redemoinhos de areia que andam pelo deserto e jogam o jogador longe | combina com a tempestade de areia | médio |

Fora: Thaumcraft (magia, foge do tema), Railcraft/Steve's Carts (pesado para o celular), Archimedes' Ships (o Bedrock não move construções).

## Para decidir

1. O Galacticraft vira o **final de verdade** (a decolagem atual passa a ir para a órbita) ou fica como **conteúdo depois do final**?
2. Quais mods da lista entram, e em que ordem?
3. Arte nova (foguete, blocos lunares, equipamento EVA, monstros): fazemos a lista para o ChatGPT como nas outras fases?
