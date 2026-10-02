# Controle de entrada de NF-e (galpão): guia de uso

Uma planilha para acompanhar cada nota fiscal que chega: de quem é, o PDF, quanto vale, quando vencem
os boletos e se a mercadoria entrou certa no galpão. O script lê os XMLs e PDFs de uma pasta do Drive e
preenche quase tudo sozinho.

## Onde salvar as notas: direto no Drive

Hoje as notas ficam só no seu computador, e a planilha não consegue ler o PC. A forma mais simples é
instalar o **Google Drive para computador** (gratuito, do próprio Google):

1. Baixe em <https://www.google.com/drive/download/> e entre com a sua conta Google.
2. Ele cria uma unidade no Windows (normalmente **G:**). Dentro de **G:\Meu Drive** fica a pasta
   **NF-e Galpão**, que a planilha cria na instalação.
3. Passe a salvar o **XML** e o **PDF** de cada nota nessa pasta, do mesmo jeito que você salva hoje no
   PC. O arquivo continua acessível no computador e sobe sozinho para o Drive.

Você pode criar subpastas (ex.: uma por mês): a planilha lê todas. As notas antigas também podem ser
copiadas para lá, e entram todas na primeira leitura.

## Dia a dia

1. Salve o **XML** e o **PDF** da nota na pasta **NF-e Galpão**.
2. Em até 15 minutos (ou em **NF-e > Atualizar agora**) a nota aparece na aba **NOTAS**, com status
   **AGUARDANDO**.
3. Quando a mercadoria chegar, mude o **Status da entrada**:
   - **ENTRADA OK**: a **Data da entrada** é preenchida com o dia de hoje (dá para corrigir).
   - **COM PROBLEMA**: escolha o **Motivo** na lista. Enquanto não tiver motivo, a célula fica vermelha
     e aparece um aviso.
   - Motivo **"Outro (descreva na Observação)"**: a Observação fica vermelha até ser preenchida.

## Aba NOTAS

| Coluna | O que é | Quem preenche |
|---|---|---|
| A. Nota fiscal | Número e razão social do fornecedor (ex.: `289804 - CONSIGLIO & NATHAN LTDA`) | script |
| B. PDF da nota | Link **Abrir PDF**; "aguardando PDF" enquanto não acha | script |
| C. Data de emissão | Da nota | script |
| D. Valor da nota | Total da nota | script |
| E. Vencimentos dos boletos | Cada parcela com data e valor (ex.: `12/10/2026 R$ 18.788,82  \|  19/10/2026 ...`) | script |
| F. Data do lançamento | Quando a nota entrou na planilha | script |
| G. Data da entrada | Quando a mercadoria chegou no galpão | automática no ENTRADA OK, editável |
| H. Status da entrada | AGUARDANDO, ENTRADA OK ou COM PROBLEMA | você |
| I. Motivo | Obrigatório no COM PROBLEMA (lista fixa) | você |
| J. Observação | Livre; obrigatória no motivo "Outro" | você |
| K. CNPJ, L. Chave de acesso, M. XML | Dados da nota e link do XML | script |

A linha inteira fica com a cor do status: amarelo (aguardando), verde (entrada ok), vermelho (problema).

**Motivos da lista:** quantidade diferente da nota, produto faltando, produto avariado ou vencido,
produto errado ou não pedido, preço diferente do pedido, prazo ou vencimento diferente do combinado,
nota com erro (dados, impostos ou CFOP), mercadoria não chegou, nota cancelada pelo fornecedor e
outro (descreva na Observação).

## Aba VENCIMENTOS

Um boleto por linha, do mais próximo para o mais distante: vencimento, valor, parcela (ex.: `2/3`), a
nota e o status da entrada dela. Marque **Pago** quando pagar.

- **Vermelho**: vencido e não pago.
- **Amarelo**: vence nos próximos dias (em **CONFIG**, padrão 3).
- **Cinza**: pago.

Assim dá para ver, antes de pagar, se a mercadoria daquele boleto chegou ou se teve problema.

## Como o PDF é ligado à nota

Em ordem:

1. pela **chave de acesso** no nome do arquivo (os portais costumam salvar assim);
2. pela **chave de acesso escrita dentro do PDF** (o DANFE sempre traz a chave);
3. pelo **número da nota** no nome do arquivo (ex.: `NF 289804.pdf`), se só uma nota sem PDF tiver esse
   número.

PDF que chega antes do XML espera e é ligado quando o XML aparecer. PDF repetido fica como DUPLICADO
na aba **ARQUIVOS**. Nota sem XML não entra sozinha, porque é o XML que traz fornecedor, valor e boletos.

## Abas do script

- **ARQUIVOS**: cada arquivo da pasta que já foi lido. Não apague, senão os arquivos são lidos de novo.
- **LOG**: o que aconteceu em cada atualização.

Os arquivos **nunca são movidos nem apagados**: a planilha só lê a pasta.

## Instalação (uma vez)

1. Crie uma planilha Google nova (ex.: **Controle de entrada NF-e**).
2. **Extensões > Apps Script**: apague o conteúdo de `Código.gs`, cole o [`Codigo.gs`](Codigo.gs) e salve.
3. Recarregue a planilha. No menu **NF-e**, rode **Configurar planilha**. Autorize quando o Google pedir:
   o script lê a pasta do Drive e usa a API do Drive com a sua conta.
4. A pasta **NF-e Galpão** é criada no seu Drive. Para usar outra pasta, cole o link dela em **CONFIG**.
5. **NF-e > Ligar atualização automática**.
