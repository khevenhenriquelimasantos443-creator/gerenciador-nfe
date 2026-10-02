# Controle de entrada de NF-e (galpão): guia de uso

Uma planilha para acompanhar a entrada de cada nota fiscal no galpão: de quem é, o PDF, quanto vale,
quando vencem os boletos e se a mercadoria entrou certa. O script lê os XMLs e PDFs da pasta de notas e
preenche quase tudo sozinho.

## Onde salvar as notas: continua no seu PC

A planilha roda no Google e não enxerga o computador. Por isso a pasta onde você já salva as notas
precisa ter uma **cópia** no Drive. Você continua salvando no PC, no mesmo lugar de sempre; o **Google
Drive para computador** (gratuito, do próprio Google) copia só essa pasta, sozinho:

1. Baixe em <https://www.google.com/drive/download/> e entre com a sua conta Google.
2. Clique no ícone do Drive perto do relógio > engrenagem > **Preferências**.
3. Em **Meu computador**, clique em **Adicionar pasta**, escolha a pasta onde você salva as notas (XML e
   PDF) e marque **Sincronizar com o Google Drive**. Salve.
4. No navegador, abra <https://drive.google.com> > **Computadores** > **Meu computador** e entre na
   pasta. Copie o link da barra de endereço e cole em **CONFIG > Pasta das notas**.

Só essa pasta é copiada, nada mais do PC. Subpastas (ex.: uma por mês) também são lidas.

**Espaço:** cada nota (XML e PDF) ocupa cerca de 250 KB. Com 100 notas por mês, são uns 300 MB por ano,
perto de 2% dos 15 GB gratuitos. A planilha não fica pesada, porque guarda só os links e não os arquivos,
e cada atualização lê só os arquivos novos.

**Cuidado:** apagar uma nota no PC também apaga a cópia (ela vai para a lixeira do Drive), e o link da
planilha para de abrir. Renomear ou mover para outra subpasta não tem problema.

## Dia a dia

1. Salve o **XML** e o **PDF** da nota na pasta de notas do seu PC, como sempre.
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
4. Em **CONFIG > Pasta das notas**, cole o link da pasta das notas (veja "Onde salvar as notas"). Se
   ficar vazio, o script usa a pasta **NF-e Galpão** do Drive, criada no passo 3 (se você usar a pasta do
   PC, essa pode ser apagada).
5. **NF-e > Ligar atualização automática**.
