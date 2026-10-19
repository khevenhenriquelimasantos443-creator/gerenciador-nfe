# Pesquisa — mods do Crash Landing (1.6.4) → Pouso Forçado (Bedrock)

Este documento resume o que foi pesquisado sobre cada mod e como trazer cada mecânica para o add-on.

- **Status:** documento para aprovação. **Nada daqui foi implementado ainda.**
- **Projeto:** versão **0.16.0**, Fases 0–9 prontas. A Fase 10 (decolagem/final) está adiada.
- **Relatórios completos,** com números detalhados, fontes e trechos de código: [`docs/pesquisa/`](pesquisa/).
  - [A](pesquisa/A-exnihilo-hqm-crashlanding.md): Ex Nihilo, Ex Aliquo, HQM e Crash Landing.
  - [B](pesquisa/B-enviromine-hunger-harvestcraft.md): EnviroMine, Hunger Overhaul e HarvestCraft.
  - [C](pesquisa/C-tinkers-iguana.md): Tinkers e Iguana Tweaks.
  - [D](pesquisa/D-thermal-mfr-bigreactors.md): Thermal Expansion, MFR e Big Reactors.
  - [E](pesquisa/E-pneumatic-ae-jabba-autopackager.md): PneumaticCraft, AE, JABBA e AutoPackager.
  - [F](pesquisa/F-chisel-biblio-sync-chunks-waila-invtweaks.md): Chisel, BiblioCraft, Sync, ChickenChunks, WAILA e Inventory Tweaks.
- **Método:**
  - As wikis (FTB, CurseForge, fóruns) estavam bloqueadas aqui. Os números vêm do **código-fonte no GitHub** da versão do pack ou da mais próxima; quando era outra versão, isso está marcado.
  - O que veio só de trechos de busca está marcado nos relatórios.
  - "Não encontrado" quer dizer que não foi possível confirmar.
- **Pasta `referencias/`:** só para consulta. Está no `.gitignore`, e o build empacota apenas BP/RP.

---

## 0. Correções importantes ao pedido

| Pedido | O que o pack tinha de verdade | Proposta |
|---|---|---|
| AE2 + ExtraCells 2 | **AE1 rv14** + **ExtraCells 1.6.9** (AE2 só existe a partir do 1.7.10) | Seguir o **AE1**: as células têm os **mesmos limites** do AE2, **não há canais** (mais barato no celular) e o processador sai da faca + fornalha (sem Inscriber nem meteoritos) |
| Chisel 2 | **Chisel 1.x** (o Chisel 2 é do 1.7.10) | Cinzel com 500 usos, ~16 variantes por família, mármore e calcário |
| AutoUtils (placer/breaker) | **É uma biblioteca, sem blocos** (dependência do Chisel) | Nada a recriar. Placer/breaker podem vir do **MFR** (Block Breaker/Placer) |
| Vidas pelo HQM | Crash Landing = **Hardcore vanilla + clones do Sync**. O HQM servia **só para quests** | Hardcore real do Bedrock não tem volta, então: **mundo sobrevivência + vidas controladas por script** (clones do Sync; corações do HQM opcionais) |
| "Prensa" do TE | No TE3 do 1.6.4 **não havia** Compactor nem Insolator | A compactação vem do **AutoPackager** |

**Limites do Bedrock que valem para tudo:**
1. **Não há fluido custom.** Lava, metal derretido, vapor e essência viram **números em mB** guardados por script; o visual vem de estados de bloco.
2. **Não há evento de crafting** na Script API estável. Missões "fabricar X" viram "ter X" ou "a máquina produziu X".
3. **Não há API de receitas.** Máquinas que "usam qualquer receita" (AutoPackager, autocraft) usam uma **tabela fixa** do add-on.
4. **Comida e plantas vanilla não podem ser alteradas.** O Hunger Overhaul vale para **comida e plantas custom**.
5. **Mundo plano:** não há worldgen de features. Minérios, mármore e estruturas são colocados **por script**, como já faz o `minerios.ts`.
6. **Blocos custom não emitem redstone** e não entram no cálculo da mesa de encantamento. Também **não existe CTM** (textura conectada).
7. **Sem GUI de contêiner custom.** A entrada e a saída usam baú ou funil adjacentes, item na mão, menus server-ui e actionbar (regra do projeto).
8. **Máximo de 10 ticking areas** por mundo. Isso limita o ChickenChunks e os corpos do Sync.

**Energia — decidido: a unidade passa a ser RF, com os números originais.**
- A energia é guardada e mostrada em **RF**: HUD, menus, Diário e o painel de "o que estou olhando".
- O ciclo das máquinas continua de **100 ticks (5 s)**. Uma máquina de X RF/t gasta **X × 100 RF por ciclo**.
- Exemplos com os números originais:
  - Gerador a carvão (Steam Dynamo): 80 RF/t, ou seja, 8.000 RF por ciclo; o carvão vale 32.000 RF.
  - Pulverizer: 4.000 RF por minério.
- **Conversão dos sistemas que já existem:** 1 E antigo = 4.000 RF.
  - Gerador: 2 E viram 8.000 RF por ciclo.
  - Painel solar: 1 E vira 4.000 RF por ciclo.
  - Máquinas que gastavam 1 E passam a gastar 4.000 RF.
- **Saves antigos:** o estado `cl:carga` (0–15) da bateria continua igual e passa a valer 4.000 RF por ponto (bateria cheia = 60.000 RF), então nada quebra.
  - Os armazenamentos novos (Energy Cells) guardam o valor exato em RF numa dynamic property.
- Nas tabelas abaixo ainda aparecem "E" e "cE", que eram a proposta anterior. Basta ler 1 E = 4.000 RF e 1 cE = 40 RF.

---

## 1. Licenças (código e texturas)

| Mod | Código | Texturas | Pode reaproveitar? |
|---|---|---|---|
| Ex Nihilo 1.29e | não encontrada | não encontrada | **Não**: só mecânica e números |
| Ex Aliquo | MIT | MIT (parte pode derivar do Ex Nihilo) | Sim, com aviso MIT. Preferível redesenhar |
| HQM | LGPL-3.0 | arte atual LGPL/MIT; arte do 1.6.4 não encontrada | Só a mecânica (o Diário já existe) |
| EnviroMine | CC BY-NC-SA 4.0 | idem (inferido) | Só a mecânica (NC/SA contaminam) |
| Hunger Overhaul | sem licença = todos os direitos | — | **Não**: só números |
| HarvestCraft | proibido redistribuir e usar texturas | proibido | **Não**: nomes genéricos e arte própria |
| Tinkers' Construct 1.6.4 | **CC0** | **CC BY 3.0** (exceto Thaumium) | **Sim**, com crédito no CREDITOS.md |
| Iguana Tweaks | sem licença | — | **Não** |
| Thermal Expansion | fechado / "Don't Be a Jerk" | todos os direitos | **Não** |
| MineFactory Reloaded | sem licença | sem licença | **Não** |
| Big Reactors | **MIT** | **MIT** (mesmo repo) | **Sim**, com aviso MIT |
| PneumaticCraft | GPLv3 | GPLv3 | Só a mecânica (para não ficar preso ao GPL) |
| AE1 | fechado | fechado | **Não** |
| ExtraCells 1 | MIT | MIT (autores de arte creditados) | Sim, com crédito |
| JABBA | CC BY-NC-SA 4.0 (incerto no 1.6.4) | idem | Só a mecânica |
| AutoPackager | **Apache 2.0** | Apache 2.0 | Sim, com aviso |
| Chisel 1.x | GPLv2 (port) | Painterly (terceiros) | **Não** |
| BiblioCraft | 1.6.4 fechado; 1.12+ MIT | MIT (1.12+) | Possível com crédito. Preferível estilo próprio |
| Sync | LGPL-3.0 | idem | Só a mecânica |
| ChickenChunks | MIT | — | Sim (não há arte relevante) |
| WAILA | Apache 2.0 | — | Sim (não há arte relevante) |
| Inventory Tweaks | MIT | — | Sim (não há arte relevante) |
| Crash Landing (quests/config) | não encontrada | — | **Não copiar textos**; crédito "inspirado em Crash Landing, de Iskandar" |

**Decisão sugerida:** todo o código é TypeScript próprio. As texturas seguem **novas, no estilo do projeto** (16×16/32×32 gerados em `tools/`). Mesmo os mods com licença permissiva (Tinkers CC BY, Big Reactors MIT, AutoPackager Apache) **não precisam** ter as texturas reusadas. Se alguma for reusada, ela entra no **CREDITOS.md**, que também lista "inspirado em" para todos os mods.

---

## 2. Tabelas por mod

> Colunas: Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável.
> Cada tabela traz as linhas principais; os relatórios do apêndice têm a versão completa.

### 2.1 Ex Nihilo (1.29e)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Peneira por cliques | 14 cliques (0,075 cada; 1 a cada 4 ticks); cada linha da tabela é sorteada com chance 1/raridade | **Evoluir a `cl:peneira` mantendo o ID.** Novo estado `cl:progresso` 0–14 e o bloco "carregado" fica na peneira; 14 toques dão o sorteio. Cooldown de 4 ticks (já existe) | Alta | Baixo (só no toque) | Manter 1 toque = 1 bloco (como hoje) com chances ÷ |
| Tabelas por bloco | Terra: 6 pedrinhas (100/100/50/50/33/33%), sementes 1/15… Cascalho: pederneira 1/4, carvão 1/8, lápis 1/20, diamante 1/128, esmeralda 1/150. Areia: cacau, cacto 1/32… Poeira: farinha de osso 1/5, redstone 1/8, pólvora 1/15, glowstone 1/16 | Tabelas em `config.ts` no formato `Achado` que já existe. Terra/cascalho/areia/**poeira** (bloco novo `cl:poeira`) | Alta | Baixo | — |
| Malha de seda | malha = 9 linhas; peneira = 4 tábuas + 2 malhas + 2 gravetos | A peneira atual continua igual. Receita nova só para a malha (usada na peneira automática como "upgrade", opcional) | Alta | Baixo | Só malha de seda (fiel ao 1.6.4) |
| Martelo | pedra → cascalho → areia → poeira (100%); durab. 59/131/250/32/1561 | Itens `cl:martelo_*` com `minecraft:durability`. Em `beforeEvents.playerBreakBlock`: cancelar, trocar o bloco por ar via `system.run` e soltar o próximo estágio | Alta | Baixo | Bancada que martela com E |
| Pedrinhas | 4 em 2×2 = 1 pedregulho | Item `cl:pedrinha` + receita | Alta | Baixo | — |
| Pedaços de minério | quebrado (cascalho), triturado (areia), em pó (poeira); 4 → 1 "cascalho de minério" → fornalha = 1 lingote. Ferro 1/5, ouro 1/32… | Itens por metal × estágio (ferro, ouro, cobre + 1–2 metais do planeta). Receita 2×2 → bloco de minério custom → receita de fornalha | Alta | Baixo | 4 pedaços → 1 "minério bruto" vanilla |
| Cadinho | 250 mB por pedregulho; 1000 netherrack; cap. 10.000; calor: tocha 0,1, lava 0,2, fornalha acesa 0,15, fogo 0,3 mB/tick; folhas/gelo → água | Bloco `cl:cadinho` com `minecraft:tick` 20; mB em dynamic property do mundo; estado `cl:nivel` 0–10. Saída: balde vazio → balde de lava/água. **Folhas → água** fecha o laço da sede | Alta | Baixo | 4 pedregulhos + tempo → balde de lava |
| Barril: compostagem | itens 0,04–0,2; cheio + 1000 ticks → terra | **Compostor atual** recebe os valores do EN (escala proporcional: cheio = 1,0) | Alta | Baixo | — |
| Barril: receitas | lava + água em cima = obsidiana; água + leite = slime; água + poeira = argila; bonecas → blaze/enderman | Barril `cl:barril_madeira`/`cl:barril_pedra` com estados de conteúdo; `onPlayerInteract` + tick 20 | Alta | Baixo | Dar o drop direto |
| Barril enche com chuva | `rainfall` mB/tick | **Inviável:** no deserto não chove | Inviável | — | Condensador enche barril adjacente |
| Bicho-da-seda / cajado | cajado: 1/100 em folha; infesta em 2000 ticks; linha = progresso×0,4 | Item `cl:cajado`, bloco `cl:folha_infestada` (tick 20, estado 0–10) | Média (folhas só da Estufa) | Baixo | Casulo raro na peneira de terra |

### 2.2 Ex Aliquo (0.11.2)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Pedaços de minérios de outros mods | 27 metais × 3 estágios | Só 1–2 metais "do planeta" (ex.: titânio) raros (1/64–1/128) na peneira de poeira | Média | Baixo | Só ferro/ouro/cobre |
| Martelos de metal | mesmo formato | Variantes `cl:martelo_ferro/diamante` | Alta | Baixo | — |
| Cajados de cana/ouro | chance maior | Variantes do cajado | Alta | Baixo | — |
| Cactos → garrafa de água | 3×3 de cacto em volta da garrafa | Receita → item "seiva de cacto" (água "boa" para a sede) | Alta | Baixo | — |
| Calor de outros blocos | — | Gerador e aquecedor do add-on contam como calor no cadinho | Alta | Baixo | — |

### 2.3 Hardcore Questing Mode (4.0.5)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Livro com capítulos | N capítulos | **Diário de Bordo 2.0**: `ActionFormData` capítulos → quests (✔/🔒/!) → detalhe | Alta | Baixo | — |
| Dependências | quest exige outras | Campo `requer: [...]`. Várias quests ficam abertas ao mesmo tempo (hoje é uma por vez) | Alta | Baixo | Linear por capítulo |
| Tipos de tarefa | ter item, entregar, local, matar, morrer, consumir, reputação | "Ter" (já existe), **entregar** (botão que consome), local (intervalo de 40 ticks), matar (já existe), consumir (`itemCompleteUse`), ação de máquina (já existe). **Fabricar → "ter"** | Alta | Baixo | — |
| Recompensas fixas + "escolha 1" | — | Form com um botão por item → `addItem`/`spawnItem` | Alta | Baixo | — |
| Sacolas por raridade | Basic…Legendary com pesos | Itens `cl:sacola_*`; sorteio ponderado em JS | Alta | Baixo | — |
| Vidas e corações | 3 iniciais, máx. 20; ¼ ½ ¾ coração, inteiro +1, podre −1 | **Integra com o Sync (2.18):** vidas = clones prontos. Corações como recompensa rara que dá +1 clone pronto | Alta | Baixo | Sem corações |
| Entrega por bloco (QDS) | bloco recebe itens | Bloco "Terminal de Entrega" puxando de baú adjacente (tick 20) | Alta | Baixo–Médio | Só entrega manual |
| Times | vidas compartilhadas | Fora do foco (jogo no celular, 1 jogador) | Média | Baixo | Omitir |

**Migração do Diário:**
- O estado atual `{i,n,d,p}` usa um índice sequencial. A versão 2.0 passa a guardar `{v:2, feitas:[ids], prog:{id:n}}`.
- Na primeira leitura, as missões `0..i-1` da lista antiga viram "feitas" pelos IDs, e `n` vira o progresso da missão `i`.
- O ID da propriedade e os IDs das missões não mudam.

### 2.4 EnviroMine (1.1.63)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Laço do tracker | 1 atualização a cada 30 ticks | Juntar sede e temperatura num laço de 30 ticks (hoje já é periódico) | Alta | Baixo | — |
| Hidratação | 0,05/upd base; +0,05 bioma seco; +0,05 de dia no seco; +0,1 suando; +0,05 correndo (escala 0–100) | **Trocar as taxas da sede atual** (escala ÷5). O mundo é todo "seco" | Alta | Baixo | — |
| Tipos de água | limpa +25; suja +25 com Fome/Veneno 25%; salgada +10 e depois −20; fria +25 e −0,1 °C | Mapear as **5 qualidades atuais**: excelente = limpa, boa = fria, suja/muito suja = suja, imprópria = **salgada** | Alta | Baixo | — |
| Purificação | fornalha; caldeirão com fogo/lava embaixo | Receitas de fornalha/fogueira + caldeirão aquecido | Alta | Baixo | Só fornalha |
| Camel Pack | 100 unidades; +1/upd; 8 couros + garrafa | Peitoral `wearable` com durabilidade = água | Alta | Baixo | Cantil na mão |
| Temperatura do ar | deserto 65 °C de dia / 7 °C à noite; sombra −2,5; água −5; fogo 100/tocha 75/lava 200 com queda `t×(1−d²/75)` | **Âncoras na temperatura atual.** Fontes de calor por **registro de blocos colocados** (não varrer 11³) | Alta | Baixo | Raio 2 só no pé do jogador |
| Corpo segue o ar | passo 0,001 (0,005 no seco) × \|Δ\|/10; suor ≥ 38 °C | Fórmula em JS, passos ×3–5 para ficar legível | Alta | Baixo | — |
| Armadura e temperatura | couro +1; ferro ×1,1 ao sol… | Tabela por `typeId` + **turbante/manto** custom ×0,8 | Alta | Baixo | — |
| Insolação/hipotermia | 39/41/43 e 35/32/30 °C; dano 4 | Efeitos + `applyDamage` | Alta | Baixo | — |
| Qualidade do ar | só no subsolo escuro; fogo/tocha drenam; 0 → dano | Sem céu e > 4 blocos abaixo da superfície → dreno. **Extensão:** a tempestade de areia drena o ar → máscara | Média | Baixo | Dreno fixo sem céu |
| Máscara e filtros | carga 1000; filtro +500 | Capacete `wearable` + filtro (pano + carvão vegetal) | Alta | Baixo | — |
| Sanidade | −0,005/upd; escuro −0,1; dormir +100; 50/25/10 | Barra opcional; efeitos de náusea e sons falsos | Média | Baixo | Omitir |
| Alucinações | mob falso no cliente | Não existe entidade "só no cliente" | Baixa | Médio | Sons e partícula |
| Desmoronamento | forte 3 / médio 2 / solto 1 | Ao quebrar: checar só cima + 4 lados; mover o bloco para baixo (fila de 8/s) | Média | Médio | Só "teto cai" em túnel de areia |

### 2.5 Hunger Overhaul (2l)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Plantas 4× mais lentas | `nextInt(4)` por random tick; ×2 fora do bioma | **Plantas custom** com `onRandomTick` + chance 1/4; dentro da Estufa 1/4, fora 1/8 | Alta | Baixo | — |
| Plantas vanilla mais lentas | trigo, cenoura… ×4 | **Inviável** (vanilla) | Inviável | — | **Parar de dar sementes vanilla** (o Crash Landing fez igual): só sementes custom |
| Colheita com clique | 2–4 produtos, 0 sementes, volta ao estágio 0 | `onPlayerInteract` na planta madura | Alta | Baixo | — |
| Sementes pela enxada | 20% | Equivalente: **peneira** de terra/areia | Alta | Baixo | — |
| Comida crua/cozida/pão | crua 1 / 0,05; cozida 2 / 0,15; pão 3 / 0,2 | Valores nas **comidas custom** (`minecraft:food`) | Alta | Baixo | — |
| Comida vanilla | — | **Não dá para mudar.** Opcional: Fome curta ao comer vanilla | Média | Baixo | Não dar comida vanilla no loot |
| Regen com fome ≥ 7 | 80 ticks × fórmula | `naturalRegeneration false` + regen própria a cada 1,5 s | Média | Baixo | Regen vanilla |
| Efeitos de status baixo | limiares de fome e de vida 5/10/15/20/25% | No mesmo laço de 30 ticks | Alta | Baixo | Só pela vida |
| Animais ×4 | filhote 20 → 80 min; ovo 5–10 → 20–40 min; ordenha a cada 20 min | Sobrescrever `ageable`/`spawn_entity` das vacas e galinhas no BP; ordenha por dynamic property | Alta | Baixo | — |
| Stack e tempo de comer | stack 16/8/4/2/1 por valor; h×8+8 ticks | `max_stack_size` e `use_duration` por item | Alta | Baixo | — |

### 2.6 Pam's HarvestCraft (1.1.4)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Utensílios que voltam | 8 utensílios | **Blocos-estação** com `minecraft:crafting_table` + `crafting_tags` (Panela, Frigideira, Tábua de Corte, Pilão, Espremedor…). Receitas com `tags` da estação | Alta | Baixo | — |
| Plantações | 3 estágios | Blocos custom `cl:planta_*` com o HO (2.5); ~10 culturas do deserto (tâmara, figo-da-índia, pimenta, algodão, feijão, milho, tomate, cebola, alho, gergelim) | Alta | Baixo | — |
| Jardins | Jardim do Deserto | Sementes vêm da **peneira**, das cápsulas e do loot da cidade | Alta | Baixo | — |
| Árvores de fruta | fruta pendurada | Tamareira/coqueiro com fruta-bloco (random tick) | Média | Baixo–Médio | Arbusto de 1 bloco |
| ~40 receitas | intermediários + pratos | Comidas custom com valores ÷2 da "fome 1.12" | Alta | Baixo | — |
| Sucos hidratam | (integração) | Suco +4 de sede; sopa +1 | Alta | Baixo | — |
| Sal | panela + água | **Sal de água salgada** (dá uso à água imprópria) | Alta | Baixo | — |
| Spice of Life (do Crash Landing) | últimas 20 refeições | Lista circular em dynamic property; repetida 3× rende menos | Média | Baixo | Omitir |

### 2.7 Tinkers' Construct (1.5.5.x)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Padrão em branco + Stencil Table | 2 tábuas + 2 gravetos | Item `cl:padrao_branco`; mesa custom com menu de padrões | Alta | Baixo | — |
| Part Builder | padrão + material; custos por peça (cabeça de picareta 2, cabo 1…) | Mesa custom: padrão na mão + material num **barril adjacente** → peça `cl:peca_<tipo>_<material>` | Alta | Baixo | Receitas diretas |
| Tool Station | cabeça + cabo (+ ligação) | **Item = ferramenta × material da cabeça** (`minecraft:digger` fixo); cabo, ligação e modificadores em dynamic properties do ItemStack + lore | Alta | Baixo | Combinações fixas |
| Durabilidade | cabeça × mod. cabo × mult. | **Durabilidade virtual** (barra nativa só como mostrador) | Alta | Baixo | — |
| Ferramenta quebrada não some | — | Estado `broken`: cancela quebra; conserta na Tool Station | Alta | Baixo | — |
| Materiais | madeira, pedra, ferro, sílex, cacto, osso, obsidiana, netherrack, slime, papel, cobalto, ardite, manyullyn, bronze, aço… | No deserto: madeira, pedra, sílex, **cacto**, osso, ferro, cobre, bronze, aço, obsidiana (cobalto/ardite fora: não há Nether) | Alta | Baixo (só assets) | — |
| Modificadores | redstone, lápis, quartzo, diamante, esmeralda, musgo, fogo… 3 slots | Eventos de hit/quebra + Haste por intervalo (≥ 20 ticks) | Média–Alta | Baixo | Subconjunto |
| Smeltery | anel 12/camada, piso 3×3, tanque; +5 °/s; lava 150 mB | Multibloco **validado só em eventos**; metal em mB no estado do controlador; itens jogados dentro ou barril | Alta | Baixo | — |
| Ligas | bronze 3:1→4, etc. | Mistura por proporção no tick 20 | Alta | Baixo | — |
| Torneira + Mesa/Bacia | 144/1296 mB; 50 ticks | Torneira por toque; mesa com estado "pronto" | Média | Baixo | Menu "fundir lingote/bloco" |
| Moldes | 144 mB latão / 288 ouro | Mesmo fluxo da mesa | Alta | Baixo | — |
| Minério dobra | 288 mB = 2 lingotes | Tabela de fusão | Alta | Baixo | — |

### 2.8 Iguana Tweaks for Tinkers

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Níveis de mineração 0–8 | tabela de blocos | `beforeEvents.playerBreakBlock` cancela se o nível for menor; tabela `typeId → nível` | Alta | Baixo | — |
| XP da ferramenta (6 níveis) | +1/bloco; `base × 1,35^(L−1)` | Props `lvl`/`xp`; som e mensagem ao subir | Alta | Baixo | — |
| Bônus por nível / +slot nos níveis 2, 4, 6 | distribuição aleatória | Sorteio no script | Alta | Baixo | — |
| Pick boost | 350…2915 blocos ou cabeça de mob | Prop `boostXp`; cabeças vanilla + custom | Alta | Baixo | — |
| Durabilidade 50% | ×0,5 | Embutido nos valores | Alta | Baixo | — |
| Sem ferramentas vanilla de pedra/madeira | receitas removidas | Sobrescrever receitas vanilla por identifier + tratar a ferramenta vanilla como "mão vazia" | Média | Baixo | Converter em sucata |
| Sílex: 4 cascalhos | sem drop de sílex no cascalho | Loot do cascalho + receita | Alta | Baixo | — |
| Ferramenta não some no chão | — | Respawn do item a cada ~4 min | Média | Baixo | Baú de recuperação |

### 2.9 Thermal Expansion 3 (3.0.0.7)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Machine Frame | 4 ferro + 4 vidro + 1 ouro | Item/bloco + receita | Alta | Baixo | — |
| Pulverizer | 40 RF/t; minério = 4.000 RF → 2 pós + ~10% secundário | Tick 100 (5 s): baú em cima → **1 E** → 2 pós embaixo. Crash Landing: cascalho/areia de minério "um pouco pior que o martelo" | Alta | Baixo | — |
| Redstone Furnace | 1.600 RF/item | 40 cE/item | Alta | Baixo | Fornalha vanilla + funil |
| Induction Smelter | pó+pó 800 RF; minério+areia 3.200; ligas | 20/80 cE; bronze/aço/invar | Alta | Baixo | — |
| Sawmill | tora → tábuas + serragem | 50 cE (inferido) | Alta | Baixo | — |
| Magma Crucible / Magmatic Dynamo | lava 320k / 180k RF | **Desativados** (como no Crash Landing: sem Nether) | — | — | — |
| Igneous Extruder / Glacial Precipitator | lava+água → pedregulho; água → neve | Checar vizinhos; 1 item por ciclo | Alta | Baixo | — |
| Steam Dynamo | 80 RF/t; carvão 32k RF | **= gerador atual** (2 E/ciclo, carvão 8 E); água opcional | Alta | — | — |
| Enervation Dynamo | redstone 64k RF | redstone = 16 E | Alta | Baixo | — |
| Energy Cells | 400k/2M/10M/50M RF; 80/400/1.000/10.000 RF/t | **100/500/2.500/12.500 E**; entrada/saída 2/10/25/250 E por ciclo; energia preservada no item | Alta | Baixo | Perde ao quebrar |
| Conduítes por tier | 80/400/10.000 RF/t | Taxa = menor tier do caminho; **cache recalculado só ao colocar/quebrar** | Média | Médio | 1 tier só |
| Tesseract | frequência | Mapa global de frequências; chunks carregados | Média | Baixo | Só energia |

### 2.10 MineFactory Reloaded (2.7.9)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Planter | 160 RF/bloco; 3×3 | Tick 100; baú → 9 blocos; 4 cE/planta | Alta | Baixo | — |
| Harvester | 240 RF/bloco; 3×3; árvores | Plantas maduras → drops; árvore por BFS limitada a 64 | Alta / Média | Baixo / Médio | Só tronco vertical |
| Fertilizer | 960 RF | 24 cE; avança 1 planta | Alta | Baixo | — |
| Rancher | 320 RF; leite e lã | `getEntities` raio 2; leite com balde do baú | Média | Baixo | Só leite |
| Grinder | 3.200 RF/golpe; essência 100 mB/morte | `applyDamage` em raio pequeno; 80 cE/morte; máx. 1–3 por ciclo; exclui filhotes e nomeados | Alta | Médio | — |
| Essência / Sewer / Composter | 1 XP = 66,67 mB; esgoto 25 mB × massa | Contadores em dynamic property; garrafa de XP / fertilizante no baú | Alta | Baixo | Orbes direto |
| Upgrades de alcance | +1…+11 | Estado 0–11; **limite raio 5** | Alta | Médio–Alto | Varrer em fatias |
| Esteira | move itens e entidades | **Esteira "lógica"**: baú → baú a cada ciclo (polling de entidades é caro) | Baixa (fiel) | Alto | Lógica |
| Block Breaker / Placer | — | Tick 100: quebra o bloco à frente e põe o drop no baú / coloca o bloco do baú | Alta | Baixo | — |
| Plástico | borracha | "Resina" de cacto/árvore → fornalha | Alta | Baixo | — |

### 2.11 Big Reactors (0.3.4A2)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Multibloco | 3×3×3 a 32×32×48; ≥1 controller, ≥1 control rod | **Validar só ao tocar no Controller**; **limite 7×7×7**; invalidar ao quebrar peça | Alta | Médio só na montagem | 5×5×5 |
| Simulação calor/radiação | rad = 0,01 × mB^react × (1−inserção) | **Fórmula fechada** a cada 100 ticks: `E = rods × base × moderador × (1−inserção)`; 3×3×3 ≈ 6,75 E/ciclo | Alta (simplificado) | Baixo | — |
| Barras de controle | 0–100% | Estado 0–10; toque +10%, agachado −10% | Alta | Baixo | — |
| Yellorium → cianita | 1 lingote = 1.000 mB; 4 por rod | Access Port com baús; cianita na saída | Alta | Baixo | — |
| Yellorium no mundo | — | **Só pela peneira de poeira** (como no Crash Landing) | Alta | Baixo | — |
| Peças "salvage-only" (Crash Landing) | controller só em ruínas | **Controller e Power Tap como loot da cidade** (sem receita) | Alta | Baixo | Receita cara |
| Moderadores | grafite 2,0; água 1,33; ar 1,1 | Média do interior na validação | Alta | Baixo | — |
| Modo ativo + turbina | vapor 10 RF/mB | Sem fluidos: porta de "refrigeração" com baldes dá ×2–3 | Baixa | Baixo | Omitir turbina |
| Cyanite Reprocessor | 2 cianitas + 1 balde + 2.000 RF → blutonium | 0,5 E; 2 ciclos | Alta | Baixo | — |

### 2.12 PneumaticCraft (1.1.4f)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Pressão por rede | bar = mL/volume; perigo 5, explode entre 5 e 7 (avançado 20/25) | Rede de tubos com **cache recalculado só em evento**; mesma pressão em toda a rede | Alta | Médio (só em evento) | — |
| Explosão por sobrepressão | força 1,0 | `createExplosion` + aviso antes (partícula/som) | Alta | Baixo | Só aviso |
| Vazamento | `bar×40+20` mL/t por lado aberto | Contado no cache | Alta | Baixo | Bloquear com ponta aberta |
| Air Compressor | 10 mL/t queimando; 5.000 mL | Combustível do baú adjacente; tick 20 | Alta | Baixo | — |
| Tubos | 1.000 / 4.000 mL | Blocos com conexões (igual ao cabo) | Alta | Baixo | — |
| Pressure Chamber | 3×3×3 a 5×5×5; válvula; +16.000 mL por bloco interno | Validar ao tocar na válvula; itens jogados dentro (busca a cada 20 ticks) | Média | Médio | Câmara de 1 bloco com baús |
| Receitas da câmara | ferro comprimido 2 bar; carvão → diamante 4 bar; PCB 1,5 bar | Tabela JS | Alta | Baixo | Na Montadora com "≥ X bar" |
| Ferro comprimido por explosão | perda ~20% | `afterEvents.explosion` + troca de itens | Média | Baixo | Só câmara |

### 2.13 Applied Energistics 1 (rv14) + ExtraCells 1

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Rede ME / Controller | 1 controller, sem canais | **Usar o Terminal atual** (`cl:terminal`, mesmo ID) + cabos; o Controlador é opcional e aumenta o limite de nós (48 → 96) | Alta | Baixo | — |
| Células 1k–64k | 1.024/4.096/16.384/65.536 bytes; 63 tipos; 8/32/128/512 bytes por tipo; 8 itens/byte | Item não-empilhável com JSON em dynamic property; contagem exata de bytes; lore "x/1024 bytes · y/63 tipos" | Alta | Baixo | — |
| ME Drive / ME Chest | 10 / 1 células | Bloco sem inventário; colocar e tirar células pelo toque/menu; o Terminal soma os drives | Alta | Baixo–Médio | Só ME Chest |
| Terminal | ordenar, filtros | Já existe; adicionar ordenar por quantidade | Alta | Baixo | — |
| Energia | 1 por item movido; 3 por crafting | 1 E por operação + 1 E a cada 64 itens | Alta | Baixo | Como hoje |
| Certus / Fluix / Silício / Processador | certus 1–4; fluix = quartzo + redstone + certus; processador = faca + fornalha | Certus pela peneira de cascalho (raro) ou nos destroços; processadores na **Montadora** | Alta | Baixo | — |
| Autocraft (MAC) | cuboide ≥ 3×3×3; 1 craft/3 ticks + 1 por CPU | Padrões = itens com receita da **tabela do add-on**; pedido "Fabricar N" no Terminal | Média | Médio | Montadora automática de 1 padrão |
| Células de fluido (ExtraCells) | 1k = 256 baldes; 5 fluidos | Célula de **água** (combina com a sede) | Média | Baixo | Tanque de água simples |
| Terminal sem fio | 32 blocos | Item + Ponto de Acesso | Alta | Baixo | — |

### 2.14 JABBA (1.1.4)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Barril de 1 item | 64 pilhas | Bloco + JSON em dynamic property; toque guarda, toque duplo guarda tudo, soco tira 1 pilha | Alta | Baixo | — |
| Mostrar conteúdo | ícone + número | **Actionbar** ao olhar (junto com a WAILA) + estado de preenchimento 0–15 | Média | Baixo | Só actionbar |
| Upgrades de armazenamento / estrutura | +64 pilhas; MK I–VII = 1…127 slots | Itens; estado `cl:tier` 0–7 | Alta | Baixo | Até MK IV |
| Saída / entrada automática | hopper core | Script empurra/puxa de baú ou funil adjacente (funil vanilla não enxerga bloco custom) | Alta | Baixo | — |
| Redstone core | emite sinal | **Inviável** | Inviável | — | Omitir |
| Integração com o Terminal | Storage Bus | O Terminal lê barris | Alta | Baixo | — |
| Dolly | move baú com conteúdo | `structureManager.createFromWorld` + `place` (preserva NBT) | Alta | Baixo | Copiar só itens |
| Dolly de diamante | spawners, 6 usos | Idem, com durabilidade 6 | Alta | Baixo | — |

### 2.15 AutoPackager (1.4) / AutoUtils (1.0.1)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Compactar 4→1 e 9→1 | 2×2 primeiro, depois 3×3; 1 por ciclo | Bloco orientado; baú de entrada → baú de saída; **tabela fixa** (lingotes, pepitas, blocos, neve, arenito…) | Alta | Baixo | Receitas na Montadora |
| Velocidade | 10 ticks ativo / 200 ticks parado | Tick 20 com até 2 compactações; espera 200 ticks quando ocioso | Alta | Baixo | — |
| Energia | 1.000 RF por compactação | **25 cE** por compactação (1 E a cada 4) | Alta | Baixo | — |
| Receita | F P F / P B P / F C F | C = `cl:circuito` (já existe) | Alta | Baixo | — |
| AutoUtils | biblioteca | **Nada a recriar** | — | — | — |

### 2.16 Chisel (1.x)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Cinzel | 500 usos; ferro + graveto | `cl:cinzel` com durabilidade | Alta | Baixo | — |
| Cinzelar no mundo | 1 uso por bloco | Toque troca para a próxima variante (estado `cl:variante` 0–15) | Alta | Baixo | — |
| Converter pilha | sem gastar durabilidade | Agachar + usar → menu de variantes → converte a pilha | Alta | Baixo | Mesa de entalhe + baú |
| Famílias | até 16 variantes | 1 bloco por família (arenito, pedra, mármore, calcário, casco da nave, vidro…) | Alta | Baixo | 8 famílias × 8 |
| CTM | — | **Inviável** | Inviável | — | Variantes sem borda |
| Mármore e calcário | veio 32; 8 e 4 por chunk; Y 40–128 | **Por script** em `minerios.ts` (mundo plano), em camadas subterrâneas | Alta | Baixo | Peneira/loot |

### 2.17 BiblioCraft (1.5.5)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Estante de 16 livros | 6 tábuas + 3 lajes | Bloco com geometria; estado `cl:livros` 0–8 | Alta | Baixo | — |
| Estante conta para encantamento | — | **Inviável** | Inviável | — | Decorativa |
| Prateleira, expositor e suporte de ferramentas | 4/16/2 slots | Estados genéricos "tem item"; conteúdo numa entidade-contêiner invisível | Média | Baixo | Moldura vanilla |
| Cabide de armadura | troca o conjunto | Bloco + entidade-contêiner; troca com o `equippable` do jogador | Média | Baixo | Suporte vanilla |
| Luminárias coloridas | 16 cores | Estado de cor + aceso/apagado | Alta | Baixo | 8 cores |
| Copiar livros / placas | — | Vanilla já faz | Alta | — | — |

### 2.18 Sync (2.2.3)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Sync Core / Constructor / Storage / Esteira | receitas com obsidiana, pérola (sinalizador no Hardcore), esmeralda, redstone | Blocos de 2 de altura; sugestão: o Core leva **coração do faraó** (liga com a Fase 7) | Alta | Baixo | — |
| Energia do corpo | 48.000 PW = 24.000 RF ≈ 6 E | **6 E da rede** ou esteira com porco/lobo (2/4 PW/t → tick 20) | Alta | Baixo | Só E |
| Amostra de sangue | 1 coração de dano | `applyDamage(2)` | Alta | Baixo | — |
| Corpo com inventário próprio | inventário + XP | Entidade invisível `cl:corpo` com inventário de 40 slots ancorada no Storage | Alta | Baixo (só na troca) | Só itens simples |
| Trocar de corpo | menu radial | `ActionFormData` "Nome — XYZ — (casa)" | Alta | Baixo | — |
| **Ressincronizar ao morrer** | corpo mais próximo; "casa" tem prioridade | `entityDie` → `setSpawnPoint` no Storage → no `playerSpawn`, troca para o corpo. **Sem corpo = fim de jogo** (espectador) — o "hardcore do add-on" | Alta | Baixo | — |
| Hardcore real | — | **Inviável** no Bedrock | Inviável | — | Mundo sobrevivência + vidas por script |
| Corpo descarregado | chunkloading próprio | Ticking area temporária só na troca | Média | Baixo | Mesmo chunk carregado/≤128 blocos |

### 2.19 ChickenChunks

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Chunk Loader | padrão 3×3; até 400 chunks; pérola + ouro + mesa de encantamento | Bloco que cria uma ticking area `cl_cl_<id>`; raio 1–2 por menu | Alta | **Médio–Alto** | **Limite 3×3** |
| Limite por jogador | 5.000 chunks | Bedrock: **10 áreas por mundo** → 4 loaders no total (sobra para Sync) | Alta | Baixo | — |
| Spot Loader | 1 chunk; 8 pérolas + loader → 10 | Idem, 1 chunk | Alta | Baixo–Médio | — |
| Desliga com redstone | — | Liga/desliga por toque | Média | Baixo | — |

### 2.20 WAILA (1.5.0)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Nome do bloco olhado | alcance 4 | `getBlockFromViewDirection` a cada **20 ticks** (regra do projeto); só reenvia à actionbar quando o alvo muda | Alta | Baixo–Médio | Só segurando a "Lupa" |
| Entidade + vida | corações | "Múmia ❤ 7/10" | Alta | Médio | Só vida |
| Nome do mod | cauda azul | "Pouso Forçado" / "Minecraft" pelo namespace | Alta | Baixo | — |
| Crescimento de plantas | % | Estado `growth` | Alta | Baixo | — |
| Energia/progresso de máquinas | "x / y RF" | **E da bateria, progresso da Montadora, peneira, compostor, cadinho, barril JABBA** | Alta | Baixo | — |
| HUD | caixa | **Actionbar** dividida com sede/temperatura (2 linhas) | Média | Baixo | Alternar |
| Mostrar/ocultar | teclas | Opção no menu do Diário | Alta | Baixo | — |

### 2.21 Inventory Tweaks (1.56)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Ordenar inventário | tecla R | Item "Organizador" ou opção no Diário: junta pilhas e ordena os slots 9–35 | Alta | Baixo | — |
| Ordenar baú | 3 botões | Organizador no baú; modo no menu | Alta | Baixo | — |
| Auto-reabastecer bloco/comida | quando a pilha acaba | `playerPlaceBlock` / `itemCompleteUse` → `moveItem` para a mão | Alta | Baixo | — |
| Reabastecer ferramenta quebrada | — | `playerBreakBlock` com antes/depois | Alta | Baixo | — |
| Trocar antes de quebrar | limiar 5 | Opção (desligada por padrão) | Alta | Baixo | — |
| Hotbar travada / regras | arquivo de regras | Formulário: slots travados | Média | Baixo | Só "não ordenar a hotbar" |
| Atalhos Ctrl/Shift | — | **Inviável** (a UI não é interceptável) | Inviável | — | "Despejar tudo no baú" |


### 2.22 Catálogo (estilo JEI)

O JEI do Java (lista lateral dentro do inventário, teclas R/U, botão "+") **não pode ser copiado como é**:
- o Bedrock não deixa um add-on colocar painéis na tela do inventário (só com JSON UI frágil, como o minimapa que foi removido);
- a Script API não tem lista de receitas.

**Como fica no Pouso Forçado:**

| Função do JEI | Como fazer no Bedrock | Viabilidade | Custo no celular |
|---|---|---|---|
| Lista de itens | Item **Catálogo** (ou aba no Diário) abre um `ActionFormData` com **ícone** e nome de cada item, 30 por página | Alta | Baixo (só ao abrir) |
| Busca por nome | Campo de texto (`ModalFormData`) que busca no nome em português e no ID | Alta | Baixo |
| Filtro `@mod` | Digitar `@tinkers`, `@ex nihilo`, `@thermal`… filtra pelo "mod de origem" de cada item | Alta | Baixo |
| Ver receitas (R) | Tela do item: bancada (grade 3×3 em texto + ingredientes como botões com ícone), fornalha, **máquinas do add-on** (peneira com as chances, montadora, pulverizador, smeltery, câmara…) | Alta | Baixo |
| Ver usos (U) | Lista invertida: "onde este item entra" | Alta | Baixo |
| Navegar | Tocar num ingrediente abre a receita dele; botão Voltar | Alta | Baixo |
| Atalho para o que está na mão | Usar o Catálogo agachado abre direto o item da mão secundária ou o último item segurado | Alta | Baixo |
| Atalho pelo bloco olhado | Agachar + usar olhando para uma máquina abre as receitas daquela máquina | Alta | Baixo |
| Preencher a bancada ("+") | O **livro de receitas nativo** do Bedrock já preenche a bancada sozinho para receitas de crafting (vanilla e do add-on) | Já existe | — |

- **De onde vêm as receitas:** o build lê `BP/recipes/*.json` e as tabelas das máquinas (`config.ts`) e gera um índice. Nada é calculado durante o jogo.
- **Vanilla:** entram os itens vanilla usados nas receitas do add-on. A lista completa de receitas vanilla já está no livro de receitas do jogo.
- **Limite:** o desenho da receita é em texto e botões, não uma grade gráfica igual à do JEI.

---

## 3. Integração com o que já existe

| Sistema atual | Vira / integra com | Cuidado com saves |
|---|---|---|
| `cl:peneira` (1 toque/bloco) | Peneira do Ex Nihilo (14 toques, tabelas do EN, poeira, pedaços de minério) | Mesmo ID; estado `cl:progresso` novo com valor padrão 0 |
| `cl:peneira_automatica` | Continua (o pack não tinha automação, mas mantém o que já existe); usa as tabelas novas | Mesmo ID |
| `cl:compostor` | Valores do barril do EN (0,04–0,2); barril de madeira/pedra é bloco novo | Pontos atuais convertidos (cheio 8 → 1,0) |
| Sede (5 qualidades) | Taxas do EnviroMine; salgada = imprópria; Camel Pack; sucos | Mesma propriedade |
| Temperatura | Âncoras 65/7 °C, armaduras, registro de fontes de calor | Mesma propriedade |
| Energia "E" + baterias 15 E | Escala 1 E = 4.000 RF; cE interno; Energy Cells | `cl:carga` mantido |
| `cl:terminal` + cabos | Rede ME do AE1 (drives, células, controlador opcional) | Mesmo ID |
| `cl:montadora` | Processadores AE, circuitos, receitas da câmara pneumática | Mesmo ID |
| Diário de Bordo | HQM 2.0 (capítulos, dependências, sacolas) | Migração `{i,n,d,p}` → `{v:2,…}` |
| Cidade / destroços | Loot: controller do reator, certus, sementes, peças | — |
| `/cl:diagnostico` | + blocos ativos por tipo, tempo de script por sistema (`Date.now()` em volta dos laços) | — |

---

## 4. Roadmap (ordem da progressão do Crash Landing)

> As Fases 7, 8 e 9 já foram entregues (monstros/faraó, montadora/terminal, visual). A **Fase 10 continua reservada para o final** (decolagem). As novas fases começam na **11**. Cada fase segue o fluxo combinado: resumo → implementar → compilar/validar → versão → .mcaddon/.mcworld → entrega → **parar**.

| Fase | Versão | Conteúdo | Por quê nessa ordem |
|---|---|---|---|
| **11** | 0.17.0 | **Diário 2.0 (HQM)**: capítulos, dependências, tipos de tarefa, "escolha 1", sacolas + migração. **Catálogo (estilo JEI)**, ver 2.22. **WAILA** na actionbar. **Inventory Tweaks** (organizador e auto-reabastecer). **Energia em RF**. `/cl:diagnostico` expandido | É a base: toda fase seguinte pendura missões aqui; WAILA ajuda a testar o resto |
| **12** | 0.18.0 | **Ex Nihilo + Ex Aliquo**: peneira por toques, poeira, martelos, pedrinhas, pedaços de minério, cadinho (lava/água), barril (obsidiana, argila, slime), cajado e bicho-da-seda, seiva de cacto | Primeiro dia do Crash Landing: peneirar poeira |
| **13** | 0.19.0 | **EnviroMine + Hunger Overhaul**: taxas da sede, água salgada/suja, Camel Pack, temperatura com âncoras e armaduras, ar no subsolo e na tempestade + máscara, regen própria, efeitos de status baixo, animais ×4 | Sobrevivência: o desafio central do pack |
| **14** | 0.20.0 | **HarvestCraft**: ~10 culturas do deserto (com o crescimento do HO), estações-utensílio, ~40 receitas, sucos que hidratam, sal, Spice of Life | Fecha o ciclo comida + água |
| **15** | 0.21.0 | **Tinkers + Iguana, parte 1**: padrões, mesas, peças, ferramentas, durabilidade virtual, níveis de mineração, XP da ferramenta, bloqueio das ferramentas vanilla | Ferramentas antes das máquinas |
| **16** | 0.22.0 | **Tinkers, parte 2**: smeltery, ligas (bronze/aço), torneira, mesa, bacia, moldes, modificadores, conserto | Metais em escala |
| **17** | 0.23.0 | **Thermal Expansion**: frame, pulverizador, fornalha de redstone, fundidora de indução, serraria, extrusora, dínamo de redstone, Energy Cells, cabos por tier, cE | Energia "de verdade" |
| **18** | 0.24.0 | **Armazenamento**: JABBA (barril + dolly), AutoPackager, AE1 (drive, células 1k–64k, controlador, certus, processadores, célula de água, terminal sem fio) | Organização depois da produção |
| **19** | 0.25.0 | **MFR**: planter, harvester, fertilizer, rancher, grinder + essência, sewer/composter, upgrades de alcance, esteira lógica, breaker/placer, plástico | Automação de fazenda |
| **20** | 0.26.0 | **PneumaticCraft leve**: compressor, tubos, pressão, câmara de pressão, ferro comprimido, explosões, manômetro | Etapa intermediária de tecnologia |
| **21** | 0.27.0 | **Sync**: core, constructor, storage, esteira, corpos com inventário próprio, troca de corpo, acordar no clone ao morrer. **Sem sistema de vidas** (decidido) | Corpos reserva e "viagem" entre bases |
| **22** | 0.28.0 | **Big Reactors**: multibloco até 7×7×7, fórmula fechada, yellorium pela peneira, controller como loot da cidade, reprocessador | Fim de jogo energético |
| **23** | 0.29.0 | **Chisel + BiblioCraft + ChickenChunks**: cinzel e famílias, mármore/calcário, estantes, prateleiras, luminárias, chunk loaders (limite 3×3) | Decoração e qualidade de vida no fim |
| **10** | 1.0.0 | **Final** (decolagem) — quando você quiser | — |

**Estimativa de tamanho:**
- Fases maiores: 12, 13, 15+16 e 18.
- Fases menores: 20, 22 e 23.
- Se alguma ficar grande demais, eu divido em "a/b" e aviso antes.

---

## 5. Decisões

| # | Assunto | Decisão |
|---|---|---|
| 1 | AE1 ou AE2 | **AE1** (sem canais, mesmos limites de célula) |
| 2 | Vidas | **Sem sistema de vidas.** O Sync fica só com os corpos reserva |
| 3 | Sementes vanilla | **Saem da peneira** quando chegarem as culturas custom (Fase 14) |
| 4 | Texturas | **Usar as dos mods** sempre que a licença deixar; ver 5.1 |
| 5 | Energia | **RF**, com os números originais |
| 6 | Ordem das fases | **Aprovada.** A 11 ganhou o Catálogo (JEI) |

### 5.1 Texturas originais: o que a licença deixa

| Grupo | Mods | Como fica |
|---|---|---|
| **Livres, com crédito** | Tinkers' Construct (CC BY 3.0), Big Reactors (MIT), AutoPackager (Apache 2.0), ExtraCells 1 (MIT), Ex Aliquo (MIT), BiblioCraft (MIT, arte da 1.12) | **Texturas originais**, com crédito no CREDITOS.md |
| **Livres se o pack for gratuito e sob a mesma licença** (CC BY-NC-SA) | EnviroMine, JABBA, AE2 (as texturas do AE1 são fechadas, mas as do AE2 são parecidas e liberadas) | Originais, **se** você aceitar que o resource pack seja publicado como **CC BY-NC-SA 4.0** (grátis, com crédito, sem venda) |
| **Proibidas ou sem licença** | Ex Nihilo, HQM (arte do 1.6.4), Hunger Overhaul, HarvestCraft, Iguana, Thermal Expansion, MFR, AE1, Chisel (Painterly), PneumaticCraft (GPL), Sync (LGPL) | **Redesenhadas** em 16×16, imitando forma e paleta das originais, sem copiar pixel a pixel |

- As texturas liberadas entram no RP (no git), com crédito no CREDITOS.md. A pasta `referencias/` continua só para consulta e fora do git.
- Os blocos que já existem (Fase 9) mantêm o visual atual.
