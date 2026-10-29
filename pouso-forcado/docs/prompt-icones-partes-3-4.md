# Prompt para o ChatGPT: ícones que faltam (Pouso Forçado 1.3.5)

> ✅ **Tudo recebido (1.3.6).** Este prompt fica de modelo para uma próxima parte.

Cole tudo a partir de "PROMPT" e anexe uma **prancha.png** das fases 15 a 23 (por exemplo a da Fase 17) como referência de estilo.
Peça um zip por vez: primeiro a parte 3 (`novidades_1_2.zip`), depois a parte 4 (`novidades_1_3.zip`).
Os nomes de arquivo já são os IDs do jogo e não podem mudar. As partes 1 e 2 e as lâmpadas coloridas já estão no jogo.

---

## PROMPT

Você vai desenhar os ícones e as texturas de um add-on de Minecraft Bedrock chamado **Pouso Forçado**.

**A história:** uma nave cai num planeta de deserto. O jogo mistura sobrevivência (água, comida, peneira, plantações) e tecnologia (máquinas, energia, nave futurista).

**Estilo:** use **exatamente o estilo da prancha em anexo** (as mesmas das Fases 15 a 23 que você já fez):

- pixel art detalhado de Minecraft, com pixels quadrados e nítidos, sem anti-aliasing e sem desfoque;
- contorno de 1 pixel numa cor mais escura do próprio objeto (nunca preto puro);
- luz vindo de cima à esquerda; sombreado em 3 a 4 tons por cor;
- objetos tecnológicos em **branco-gelo e grafite com uma faixa de luz colorida**:
  - ciano = energia;
  - laranja = calor e motor;
  - azul = água;
  - verde = vida e plantas;
  - roxo = armazenamento;
- comida e coisas naturais com cores vivas e quentes;
- todos os itens precisam ter o **mesmo nível de detalhe** dos melhores da prancha (Camel Pack, Catálogo, Circuito, Coração do Faraó). Nada de "bolinhas simples".

### O que entregar (3 tipos)

**A. Ícone de ITEM**

- Desenhe numa grade de **32×32 pixels** e entregue ampliado 4× com vizinho mais próximo: **PNG de 128×128**.
- **Fundo 100% transparente** (canal alfa). Sem quadriculado desenhado.
- Um objeto por arquivo, centralizado, ocupando uns **80%** do quadro, com margem. **Nada cortado na borda.**
- Vista de lado/3-4, como os itens do Minecraft. Ferramentas na diagonal, com o cabo embaixo à esquerda.
- Pasta: `itens/`. Nome do arquivo: o da coluna "Arquivo".

**B. Ícone de MENU de bloco** (só para os blocos do tipo "máquina")

- Cubo ou objeto em **vista isométrica**, como os blocos da prancha (frente-esquerda e frente-direita visíveis, topo por cima).
- **PNG de 128×128, fundo 100% transparente.** Sem o retângulo azul-escuro atrás, sem sombra no chão.
- Pasta: `blocos_menu/`, arquivo `<id>.png`.

**C. TEXTURAS DE FACE de bloco** (para o jogo pintar o bloco no mundo)

- **32×32 pixels exatos**, opaco (sem transparência, exceto em vidro e plantas), e **emendável**: a borda da esquerda continua na da direita e a de cima na de baixo.
- Bloco **"cubo"**: um arquivo só, `<id>.png` (todas as faces iguais). Se o topo for diferente, mande `<id>_topo.png` e `<id>_lado.png`.
- Bloco **"máquina"**: `<id>_frente.png`, `<id>_lado.png`, `<id>_topo.png`, `<id>_baixo.png`.
  - São as faces de uma caixa que lembre o ícone de menu dele: mesma paleta e mesmos detalhes, só que planas, de frente.
- Pasta: `blocos_faces/`.
- **Plantas:** 3 estágios, `planta_<id>_0.png`, `_1.png` e `_2.png`. São 32×32 com fundo transparente: a planta vista de lado, nascendo da borda de baixo.

### Proibido em TODOS os arquivos

- texto, letras, números ou nome do item;
- moldura, borda de cartão, linhas de grade ou de recorte;
- fundo colorido (só a textura de face de bloco é opaca);
- sombra no chão, cenário, marca d'água;
- objeto cortado na borda;
- dois objetos no mesmo arquivo;
- reaproveitar placeholder simples.

### Como salvar e mandar

- **Um .zip por parte**: `novidades_1_2.zip` (parte 3) e depois `novidades_1_3.zip` (parte 4).
- Dentro de cada zip, só estas pastas, com os arquivos soltos nelas (sem subpastas):
  - `itens/` com os ícones de item (A), PNG 128×128;
  - `blocos_menu/` com os ícones de menu (B), PNG 128×128;
  - `blocos_faces/` com as texturas de face (C) e as plantações, PNG 32×32.
- Mais dois arquivos na raiz do zip:
  - `manifesto.csv`, com as colunas `arquivo,pasta,tipo,fase` (uma linha por arquivo);
  - `prancha.png`: uma prancha com todos os desenhos do zip e o nome embaixo de cada um, **só para revisão**. O nome aparece só na prancha, nunca nos arquivos.
- O nome de cada arquivo é **idêntico** ao da lista: minúsculo, sem acento, com `_`, terminando em `.png`.
- Antes de mandar, confira se **todos os arquivos da lista** daquela parte estão no zip. Se faltar algum, diga qual.

---

## LISTA, parte 3: novidades das versões 1.1 e 1.2 (zip `novidades_1_2`)

> ✅ Já recebida (1.3.6). Não precisa gerar de novo.

**Itens (A):**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| padrao_me_vazio.png | Padrão ME em Branco | placa fina azul-escura com circuito ciano apagado |
| cajado_osso.png | Cajado de Osso | cajado de pastor feito de ossos, ponta curva, na diagonal |
| cajado_ouro.png | Cajado de Ouro | cajado de pastor de ouro, ponta curva, na diagonal |
| tamara.png | Tâmara | três tâmaras marrom-escuras brilhantes |
| bussola_aviao.png | Bússola do Avião | bússola de casco branco-gelo com ponteiro laranja em forma de avião |
| saco_dormir.png | Saco de Dormir | saco de dormir de couro enrolado, com tira de linha |
| fragmento_meteorito.png | Fragmento de Meteorito | pedaço de rocha escura com veios roxos brilhantes |

**Blocos "máquina" (B + C, 4 faces):**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| tesseract | Tesseract | moldura de metal com um cubo roxo flutuando no meio |
| torre_defesa | Torre de Defesa | base de aço com cano de disparo e luz vermelha |
| montador_molecular | Montador Molecular | caixa de vidro com braços mecânicos e luz violeta |
| caixa_entrega | Caixa de Entrega | caixa de metal com fenda de entrega e luz amarela |

**Blocos "cubo" (só C):**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| meteorito | Rocha de Meteorito | rocha quase preta, rachada, com veios roxos que brilham |

**Texturas de modelo (só C, 32×32; são pintadas em modelos 3D próprios):**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| varal | Varal (madeira) | madeira clara lisa |
| varal_carne | Varal (o que fica pendurado) | carne seca marrom-avermelhada |
| muda_tamareira | Muda de Tamareira (folhas) | folhas de palmeira verde-vivo |
| muda_tamareira_tronco | Muda de Tamareira (caule) | caule fino marrom com anéis |
| cacho_tamaras | Cacho de Tâmaras (verde) | cacho de tâmaras verde-amareladas |
| cacho_tamaras_madura | Cacho de Tâmaras (maduro) | cacho de tâmaras marrom-escuras |

## LISTA, parte 4: novidades da versão 1.3.0 (zip `novidades_1_3`)

> ✅ Já recebida (1.3.6). Não precisa gerar de novo.

Mekanism (gás em cilindros, ligas, cubos de energia, jetpack), BuildCraft (petróleo, engrenagens, máquinas) e
OpenBlocks (asa-delta, túmulo, elevador), mais o cascalho do Nether da peneira.

**Itens (A):**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| cilindro_vazio.png | Cilindro de Gás Vazio | cilindro de metal cinza em pé, com válvula no topo |
| cilindro_hidrogenio.png | Cilindro de Hidrogênio | o mesmo cilindro, faixa branca-azulada |
| cilindro_oxigenio.png | Cilindro de Oxigênio | o mesmo cilindro, faixa azul-clara |
| cilindro_cloro.png | Cilindro de Cloro | o mesmo cilindro, faixa verde-amarelada |
| cilindro_acido.png | Cilindro de Ácido Clorídrico | o mesmo cilindro, faixa verde-clara com símbolo de perigo |
| balde_salmoura.png | Balde de Salmoura | balde de ferro com água esbranquiçada e cristais de sal |
| po_litio.png | Pó de Lítio | montinho de pó branco-prateado |
| liga_enriquecida.png | Liga Enriquecida | placa de metal vermelha brilhante |
| liga_reforcada.png | Liga Reforçada | placa de metal azul-ciano brilhante |
| liga_atomica.png | Liga Atômica | placa de metal roxa brilhante |
| jetpack.png | Jetpack | mochila de metal cinza com dois propulsores embaixo |
| engrenagem_madeira.png | Engrenagem de Madeira | engrenagem de madeira clara |
| engrenagem_pedra.png | Engrenagem de Pedra | engrenagem de pedra cinza |
| engrenagem_ferro.png | Engrenagem de Ferro | engrenagem de ferro branco-acinzentado |
| engrenagem_ouro.png | Engrenagem de Ouro | engrenagem de ouro |
| engrenagem_diamante.png | Engrenagem de Diamante | engrenagem azul-diamante |
| balde_petroleo.png | Balde de Petróleo | balde de ferro com líquido preto brilhante |
| balde_combustivel.png | Balde de Combustível | balde de ferro com líquido amarelo |
| asa_delta.png | Asa-Delta | asa triangular de couro marrom com varetas de madeira |

**Blocos "máquina" (B + C, 4 faces):**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| separador_eletrolitico | Separador Eletrolítico | caixa de metal com dois tanques de vidro (branco e azul) |
| evaporador | Evaporador Térmico | caixa de cobre com tampa de vidro e água por dentro |
| infusor_quimico | Infusor Químico | caixa de metal com tubos verdes |
| camara_purificacao | Câmara de Purificação | caixa de metal com janela azul e bolhas |
| camara_injecao | Câmara de Injeção Química | caixa de metal com janela verde e seringa |
| infusor_metalurgico | Infusor Metalúrgico | caixa de metal com fenda vermelha brilhando |
| cubo_energia_basico | Cubo de Energia Básico | cubo de metal com moldura cinza e faixa de carga |
| cubo_energia_avancado | Cubo de Energia Avançado | o mesmo cubo com moldura vermelha |
| cubo_energia_elite | Cubo de Energia de Elite | o mesmo cubo com moldura azul |
| cubo_energia_definitivo | Cubo de Energia Definitivo | o mesmo cubo com moldura roxa |
| bomba | Bomba | caixa de metal com cano descendo e gota preta |
| refinaria | Refinaria | caixa de vidro com tanques e chama amarela |
| motor_combustao | Motor a Combustão | motor de aço com pistão e engrenagem |
| pedreira | Pedreira | caixa de metal amarela e preta com broca |
| gerador_blaze | Gerador de Blazes (no alto das torres das cidades) | gaiola de ferro escuro com chamas laranja e uma vara de blaze dourada no meio |

**Blocos "cubo" (só C):**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| cascalho_nether | Cascalho do Nether | cascalho vermelho-escuro, pedrinhas de netherrack |
| elevador | Elevador (lados) | arenito liso branco-gelo com uma faixa fina cinza nas bordas |
| elevador_topo | Elevador (topo e base) | o mesmo arenito branco com duas setas cinza-escuro, uma para cima e uma para baixo |
| tumulo | Túmulo (textura do modelo 32×32) | pedra cinza rachada com musgo |
