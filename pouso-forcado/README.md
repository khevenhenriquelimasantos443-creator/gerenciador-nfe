# Pouso Forçado — add-on para Minecraft Bedrock 26.30+

Sua nave caiu num deserto sem água. Recursos são escassos e a progressão vem por missões.
Projeto próprio, inspirado na *ideia* de modpacks de sobrevivência com escassez. Nenhum asset, nome ou código foi copiado.

**Fase atual: 1** (mundo desértico seco + nave caída no spawn). Fase 0: estrutura, Condensador de Água e boas-vindas.

## Versões usadas (conferidas na documentação oficial)

| Item | Valor | Fonte |
|---|---|---|
| `min_engine_version` | `[1, 26, 30]` (o jogo "26.30" é o motor `1.26.30`) | `version.json` do Mojang/bedrock-samples e notas "1.26.30 Update Notes" no Microsoft Learn |
| `@minecraft/server` | `2.8.0` (estável) | Notas 1.26.30: "ships @minecraft/server v2.8.0 and @minecraft/server-ui v2.1.0" |
| `@minecraft/server-ui` | `2.1.0` (estável) | idem (já declarado, mas só será usado na Fase 2) |
| `format_version` do manifest | `2` (a versão 3 ainda está em preview) | Referência do manifest.json no Microsoft Learn |
| `format_version` de blocos | `1.26.30` | |
| `format_version` de receitas | `1.20.10` (o mesmo das receitas vanilla de 1.26.30) | bedrock-samples, tag v1.26.30.5 |
| `format_version` de bioma | `1.26.30` (validado contra o JSON Schema oficial de 1.26.30) | bedrock-samples `metadata/json_schemas` |
| Biomas customizados / `minecraft:replace_biomes` | estável desde 1.21.110 | Notas "1.21.110 Update Notes" no Microsoft Learn |

Nada aqui usa Beta APIs nem experimentos. Funciona em 26.30 e em versões mais novas.

## Estrutura

```
pouso-forcado/
├── BP/                     Behavior Pack
│   ├── manifest.json
│   ├── biomes/             bioma cl:deserto_seco (substitui os biomas da superfície)
│   ├── blocks/             definições de blocos (cl:...)
│   ├── recipes/            receitas
│   ├── structures/cl/      nave_caida.mcstructure (gerada por tools/gerar-nave.mjs)
│   └── scripts/            (gerado pelo build a partir de scripts/, não editar)
├── RP/                     Resource Pack
│   ├── manifest.json
│   ├── biomes/             aparência do bioma (névoa, céu, música do deserto)
│   ├── blocks.json         sons dos blocos
│   ├── texts/              pt_BR.lang, en_US.lang
│   └── textures/           texturas (placeholders gerados)
├── scripts/                código TypeScript
│   ├── main.ts             ponto de entrada: cada fase registra seus módulos aqui
│   ├── config.ts           IDs, chaves de dynamic properties, kit, balanceamento
│   ├── blocos/             componentes customizados de blocos (máquinas)
│   ├── jogador/            eventos de jogador (boas-vindas; depois: Diário de Bordo)
│   ├── mundo/              coisas do mundo (nave caída)
│   └── util/               helpers de inventário e estados de bloco
├── tools/                  build, geradores de texturas e da nave, zip/png/nbt sem dependências
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
- `node tools/gerar-nave.mjs --force`: regera a nave a partir do modelo em código.

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

> **Use sempre um mundo NOVO.** O deserto só vale para terreno gerado com o add-on ativo. Num mundo antigo, o que já foi explorado continua como era.

1. **Criar novo** → **Criar novo mundo** (tipo **Infinito**, não plano).
2. Em **Pacotes de comportamento** → **Disponível** → ative **Pouso Forçado (Comportamento)**.
3. O jogo pergunta se quer ativar o pacote de recursos dependente → **Ativar**. (Ou ative manualmente **Pouso Forçado (Recursos)** em **Pacotes de recursos**.)
4. **Não** precisa ligar nenhum experimento.
5. Crie o mundo.

Ao atualizar o add-on, o `version` dos manifests sobe (Fase 1 = `0.2.1`). Se o jogo continuar mostrando a versão antiga, apague os packs antigos em **Configurações → Armazenamento** e importe de novo.

## O mundo (Fase 1)

- **Só deserto.** O bioma próprio `cl:deserto_seco` substitui todos os biomas da superfície (florestas, planícies, neve, oceanos, rios, etc.). O deserto vanilla continua existindo; os dois têm a mesma cara.
- **Por que dois arquivos de bioma:** a doc oficial manda escrever os biomas-alvo **sem** prefixo (`plains`), mas o exemplo oficial da Microsoft usa **com** prefixo (`minecraft:plains`). Na 0.2.0 o jogo ignorou a versão sem prefixo. Por isso vão as duas: `cl:deserto_seco` (sem) e `cl:deserto_seco_ns` (com). Se o jogo aceitar as duas, elas são idênticas e dividem o mundo sem diferença visível. Depois do teste fica só a que funcionou.
- **Diagnóstico no chat:** ao entrar, aparece uma linha cinza `[Pouso Forçado 0.2.1] biomas: ... | bioma aqui: ...`. Ela diz se o jogo carregou cada bioma e em qual bioma você está.
- **Sem mares e sem rios.** No `cl:deserto_seco` o "material do mar" é ar: onde haveria oceano ou rio fica um vale/cânion seco com fundo de areia.
- **Não chove.** O bioma tem clima de deserto.
- **Relevo normal do jogo.** O formato do terreno (morros, serras, vales) continua sendo o do Minecraft, só que coberto de areia e arenito.
- **Estruturas.** Templos do deserto e poços do deserto continuam aparecendo nas áreas de deserto vanilla. Nas áreas de `cl:deserto_seco`, depende do jogo aceitar a tag `desert`; está no roteiro de teste.
- **Nave caída.** Ao entrar no mundo pela primeira vez, uma nave quebrada aparece ao lado do jogador, meio enterrada na areia. Dentro dela há um baú com o que sobrou da carga: Condensador de Água, 1 balde, 6 pães, 8 tochas, 4 terras e 2 mudas de carvalho. Se a nave não puder ser colocada, os itens vão direto para o inventário.
- **Trocar a nave.** Construa a sua no jogo, salve com o **Bloco de Estrutura** e substitua `BP/structures/cl/nave_caida.mcstructure`. Ajuste `NAVE.bau` em `scripts/config.ts` para a posição do baú.

## Como testar

Dica: ative o log de erros em **Configurações → Criador → Ativar GUI do log de conteúdo**. Erros de script ou JSON aparecem na tela.

1. **Boas-vindas:** ao entrar no mundo novo aparece o título "Pouso Forçado" e uma mensagem no chat.
2. **Nave:** em ~2 s a nave aparece do seu lado (cauda com magma, cabine de vidro enterrada). Entre pela abertura lateral e abra o baú.
3. **Só uma vez:** saia e entre de novo, ou morra. Não pode aparecer outra nave nem a mensagem de novo.
4. **Deserto:** ative "Mostrar coordenadas" e ande/voe (no criativo) uns 1000 blocos. Deve ser só areia, sem árvores, sem neve e sem água nos vales onde seriam oceanos/rios.
5. **Templos:** no criativo, com trapaças ligadas num mundo de teste, use `/locate structure temple` e vá até lá. Se aparecer templo da selva ou vila, me avise.
6. **Condensador, à mão:** coloque o condensador e toque nele logo em seguida. Deve aparecer "ainda está juntando umidade". Espere ~30 s: o centro do topo fica **azul claro**. Toque com um balde vazio no inventário: você recebe um balde de água e ouve o som, e o topo volta a escuro.
7. **Sem balde:** com o condensador cheio e sem balde vazio, aparece "Traga um balde vazio".
8. **Baú adjacente:** coloque um baú (ou barril/funil) encostado no condensador com baldes vazios dentro. A cada ~30 s um balde do baú vira balde de água.
9. **Receita** (mesa de trabalho):
   ```
   Ferro   Vidro  Ferro
   Ferro   Balde  Ferro
   Pedra   Pedra  Pedra     (pedregulho, pedra-negra ou pedregulho de ardósia)
   ```
10. **Idioma:** com o jogo em inglês, o bloco se chama "Water Condenser".

## Como o Condensador funciona (e por que assim)

- O bloco tem `minecraft:tick` de 600 ticks (30 s). O jogo só faz esse tick em chunks carregados, então não há loop global nem varredura de blocos.
- A cada ciclo ele produz 1 balde de água:
  1. se houver baú, barril ou funil encostado com balde vazio, entrega lá;
  2. senão, guarda (no máximo 1) no estado do bloco `cl:cheio`, e o topo fica azul.
- Tocar no bloco com um balde vazio no inventário retira o que estiver guardado. Ele usa primeiro o balde da mão, se tiver.
- Para mudar o tempo, altere `interval_range` em `BP/blocks/condensador_agua.json` e `CONDENSADOR_SEGUNDOS` em `scripts/config.ts`.

## Texturas

Os PNGs 16×16 em `RP/textures/blocks/cl/` são placeholders (cor sólida + borda). Substitua pelos seus com o **mesmo nome**. O build não sobrescreve arquivos existentes.

## Limitações do Bedrock (e o que fiz no lugar)

- **Altura das montanhas:** um add-on estável não consegue mudar o formato do terreno. Ele só troca o bioma *depois* que o jogo já decidiu o relevo. Então há morros pequenos, mas também podem aparecer serras altas onde o jogo geraria montanhas. A alternativa mais simples, se incomodar, é escolher uma semente com relevo mais baixo.
- **Minérios:** os minérios do subsolo são gerados pelo jogo e não dá para reduzi-los por JSON. Por enquanto, a escassez vem da superfície (sem água, sem árvores, sem animais de fazenda). Na Fase 3 dá para equilibrar pelas máquinas.
- **Água infinita (2 baldes formando fonte):** o Bedrock não tem regra para desligar. Bloquear isso exigiria vigiar a água em volta do jogador o tempo todo, e esse é o tipo de gambiarra pesada que evitei. Ficou como marco de progressão: no começo só há 1 balde e não há ferro na superfície.
- **Água escondida:** cavernas subterrâneas (aquíferos e cavernas exuberantes) e os poços do deserto ainda têm água. É pouca e fica longe, então funciona como um "oásis raro".
- **Vilas:** nas áreas de deserto vanilla ainda podem aparecer vilas do deserto. As cidades próprias vêm numa fase futura.
