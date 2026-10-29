# Prompt para o ChatGPT: segunda ideia da tela do Diário de Bordo

Cole tudo a partir de "PROMPT". Anexe junto:
- um print da tela atual do Diário (para ele ver de onde partimos);
- uma prancha de ícones das fases 15 a 23 (por exemplo a da Fase 17), para manter o estilo.

---

## PROMPT

Você vai criar a **segunda proposta de visual** da tela de missões ("Diário de Bordo") de um add-on de Minecraft Bedrock chamado **Pouso Forçado**, jogado no celular, na horizontal. O print anexo mostra a versão atual. Quero uma alternativa mais bonita e mais caprichada, que eu consiga montar no jogo.

**A história:** uma nave caiu num planeta de deserto. O jogador sobrevive no avião caído (casco branco-gelo e cinza, com faixas laranja), conserta os 4 sistemas da nave e decola no fim. O Diário é o computador de bordo/caderno do piloto. Tema: nave espacial avariada + deserto (Crash Landing).

### O que entregar

1. **Três mockups** da mesma tela, em pixel art, na escala 1:1 de pixels da interface (cada pixel do desenho = 1 pixel da interface; depois amplie 4× por vizinho mais próximo para eu ver):
   - **Início do Diário**: título "Diário de Bordo", um resumo ("3 de 176 missões feitas. 2 abertas agora."), uma barra de progresso geral e a lista de capítulos (ex.: "A Queda", "Sobrevivência", "Ex Nihilo"), cada um com ícone, nome e progresso (ex.: 2/12). Capítulo bloqueado com cadeado.
   - **Capítulo aberto**: lista das missões, cada uma com ícone e uma de três situações: **feita** (✓ verde), **aberta** (progresso, ex.: 3/10, com barrinha) e **bloqueada** (cadeado, mais apagada).
   - **Detalhe da missão**: nome da missão em destaque, descrição de 2 a 3 linhas, "Progresso: 0/1", "Recompensa: Terra x2" e os botões "Entregar os itens", "Pular esta missão" e "« Voltar".
2. **As peças separadas** (PNG transparentes, na escala 1:1, sem ampliar), cada uma desenhada para ser **esticada em 9 partes** (nine-slice): cantos fixos, bordas e meio repetíveis/esticáveis. Para cada peça, diga o tamanho e quantos pixels de borda são fixos:
   - `diario_fundo`: a janela inteira (moldura + fundo);
   - `diario_titulo`: a barra de título;
   - `diario_visor`: a área do texto (descrição/resumo);
   - `diario_botao`, `diario_botao_toque`, `diario_botao_apertado`: o botão normal, com o dedo em cima e apertado;
   - opcional: `diario_listra` (faixa decorativa repetida na horizontal), `diario_claro` (placa clara para telas com caixa de texto);
   - opcional: ícones de situação 16×16: `feita`, `bloqueada`, `aberta`.
3. **Uma lista de cores** em hexadecimal (fundo, moldura, título, texto, destaque, texto apagado).

### Limites do jogo (para eu conseguir montar)

- A janela tem no máximo **330 × 214 pixels de interface** (cabe na tela do celular). O título fica numa barra de uns **18 px** de altura.
- Os botões ficam **um embaixo do outro** (uma coluna), cada um com **34 px de altura** e a largura da janela. Dentro: ícone de **26 × 26** à esquerda e o texto (até 2 linhas) ao lado. A lista rola para baixo.
- O texto é **sempre a fonte padrão do Minecraft**, branca com sombra. A cor do texto só pode ser uma das 16 cores do Minecraft (verde, amarelo, laranja-ouro, ciano, vermelho, cinza…). Não desenhe texto nas peças: o jogo escreve por cima.
- Tudo é **imagem esticada em 9 partes**: nada de cantos arredondados suaves, gradiente longo na diagonal, sombra desfocada ou brilho que dependa do tamanho final. Pixel art nítido, sem anti-aliasing.
- Não dá para animar, girar nem fazer transparência parcial complicada. Transparência só onde for 100% vazio (fora da moldura).
- O fundo atrás da janela é o próprio jogo (deserto/céu), então a janela precisa ter contraste sozinha.

### Ideias de direção (escolha uma ou misture)

- **Prancheta do piloto**: placa de metal riscada da nave, com papel amarelado do caderno de bordo, clipe e parafusos; missões como linhas de checklist.
- **Tela do computador de bordo**: monitor com moldura branca do casco, faixa laranja, vidro verde/âmbar de terminal antigo, linhas de varredura discretas.
- **Painel avariado**: metal com amassados, fita de alerta, LEDs de status (verde = feita, âmbar = aberta, vermelho/apagado = bloqueada).

Mantenha o mesmo nível de detalhe dos ícones da prancha anexa. Nada de marca d'água nem de texto dentro das peças separadas.
