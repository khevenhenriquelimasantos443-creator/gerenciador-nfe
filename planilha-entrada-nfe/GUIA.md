# Controle de entrada de NF-e (galpão): guia de uso

Uma planilha para acompanhar a entrada de cada nota fiscal no galpão: de quem é, o PDF, quanto vale,
quando vencem os boletos e se a mercadoria entrou certa. As notas continuam na pasta da rede; uma cópia
de cada XML e PDF vai para o Drive, para a planilha ler o XML e o link do PDF abrir com um clique.

## Como as notas chegam na planilha

```
pasta da rede (\\SERVIDOR\NOTAS)  ──  enviar-notas.ps1, num PC da rede, a cada 15 min
        │  manda só os XML e PDF novos (cópia; o original fica na rede)
        ▼
app da Web da planilha  ──  guarda a cópia em "NF-e Galpão" no Drive (uma subpasta por mês)
        ▼
aba NOTAS: linha nova com o link "Abrir PDF"
```

- Vocês continuam salvando as notas na pasta da rede, do jeito de sempre.
- O **enviar-notas.ps1** roda num PC que fica ligado no horário de trabalho e enxerga a pasta da rede.
  Ele usa só o que já vem no Windows (PowerShell e Agendador de Tarefas).
- Só vão para o Drive os **XML e PDF**. Arquivo repetido é recusado pela planilha, mesmo que o PC envie
  de novo.
- **Espaço:** cada nota (XML e PDF) ocupa cerca de 250 KB. Com 100 notas por mês, são uns 300 MB por
  ano, perto de 2% dos 15 GB gratuitos.

## Dia a dia

1. Salve o **XML** e o **PDF** da nota na pasta de notas da rede, como sempre.
2. Em até 15 minutos a nota aparece na aba **NOTAS**, com o status **em branco**. As últimas notas lançadas
   ficam em cima (pelo dia da ENTRADA GALPÃO; no mesmo dia, pela emissão mais nova).
3. Quando a mercadoria chegar, mude o **Status da entrada**:
   - **ENTRADA OK**: a mercadoria entrou. A data de entrada é a mesma do lançamento na planilha.
   - **COM PROBLEMA**: escolha o **Motivo** na lista. Enquanto não tiver motivo, a célula fica vermelha
     e aparece um aviso.
   - **BONIFICAÇÃO**: mercadoria de bonificação.
   - **AGUARDANDO** continua na lista, se quiser marcar.
   - Motivo **"Outro (descreva na Observação)"**: a Observação fica vermelha até ser preenchida.

A **OBSERVAÇÃO** é só de vocês: o script nunca escreve nela.

## Aba NOTAS

| Coluna | O que é | Quem preenche |
|---|---|---|
| A. Nº NFE | Número da nota fiscal | script |
| B. PDF | Link **Abrir PDF**; "aguardando PDF" enquanto não acha | script |
| C. FORNECEDOR | Razão social de quem emitiu a nota, em MAIÚSCULAS | script |
| D. RAZÃO SOCIAL COMPRA | Nossa razão social (destinatário da nota), padronizada | script |
| E. EMISSÃO | Data de emissão da nota | script |
| F. VALOR NFE | Total da nota | script |
| G. 1º VENCIMENTO | Só a data do 1º boleto. Nota sem boleto (bonificação, pagamento antecipado): em branco | script |
| H. ENTRADA GALPÃO | Quando a nota entrou na planilha; vale como data de entrada no galpão | script |
| I. STATUS ENTRADA | Em branco ao entrar; AGUARDANDO, ENTRADA OK, COM PROBLEMA ou BONIFICAÇÃO | você |
| J. MOTIVO DA NÃO ENTRADA | Obrigatório no COM PROBLEMA (lista fixa) | você |
| K. OBSERVAÇÃO | Livre; obrigatória no motivo "Outro" | você |
| L. CHAVE DE ACESSO, M. XML | Chave da nota e link do XML | script |

O CNPJ do comprador não aparece mais na planilha. O script guarda sozinho qual CNPJ é de qual razão social (das
notas com XML), para achar o comprador nos PDFs sem XML.

O **Comprador** sai padronizado: sem os códigos que alguns fornecedores colocam antes ou depois do nome e,
para cada CNPJ, a forma do nome que mais aparece.

Planilhas de versões anteriores (nº e razão social juntos na coluna A, ou com a coluna "Data da entrada no
galpão") são convertidas sozinhas na próxima atualização, mantendo status, motivo, observação e links.

A linha inteira fica com a cor do status: amarelo (aguardando), verde (entrada ok), vermelho (problema),
azul-claro (bonificação); status em branco, sem cor. A cor
vem da formatação condicional da planilha, então muda na hora em que o status é trocado.

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

**Todo PDF entra na planilha.** PDF que não acha nota (pedido de compra, nota sem XML) vira uma linha própria,
com o nome do arquivo no lugar do fornecedor e a coluna XML vazia. Se o XML chegar depois, ele
completa essa mesma linha (pela chave ou pelo número da nota).

Enquanto o XML não chega, a planilha **lê os dados do próprio PDF**: o Google Drive converte o PDF em texto
(lê até PDF escaneado) e daí saem chave, nº, comprador, emissão, valor e 1º vencimento. Confira essas
linhas, porque o PDF não é tão exato quanto o XML. Na aba **ARQUIVOS**, a situação do PDF diz como ficou:
**SÓ PDF** (ainda vai ler), **SÓ PDF - LIDO** ou **SÓ PDF - ILEGÍVEL**. O fornecedor sai do nome de um fornecedor já conhecido (pelo CNPJ) ou
do nome do arquivo (`VILLE 03-09 NFE 79570.pdf` → `VILLE`). PDF repetido fica como DUPLICADO na aba
**ARQUIVOS**; **PENDENTE** lá é só o PDF que ainda não foi lido (fica para a próxima atualização).

**Nota repetida em duas linhas?** A cada atualização a planilha junta sozinha: fica a linha com o XML, e da outra
vêm o link do PDF, o status, o motivo e a observação (onde a que fica estava em branco). Duas linhas só com PDF
também se juntam quando abrem o mesmo arquivo de PDF ou têm a mesma chave de acesso (fica a de cima). Fica
registrado no LOG como DUPLICADO; se as duas tinham status diferentes, o LOG diz qual era o da linha apagada. Um PDF
que já está numa linha nunca cria outra, mesmo que uma atualização tenha sido cortada no meio.

**Link do PDF ou do XML na nota errada?** **NF-e > Refazer os links de PDF e XML** refaz os links das duas
colunas a partir da aba ARQUIVOS (que guarda qual arquivo é de qual nota): pela chave de acesso e, no PDF sem
XML, pelo número no nome do arquivo. O que não der para identificar fica como está.

## Abas do script

- **ARQUIVOS**: cada arquivo da pasta do Drive que já foi lido.
- **RECEBIDOS**: cada arquivo que veio do PC, com o caminho na rede. É o que impede cópia repetida.
- **LOG**: o que aconteceu em cada atualização.

Não apague ARQUIVOS nem RECEBIDOS. Os arquivos da rede **nunca são movidos nem apagados**.

No PC, ao lado do enviar-notas.ps1, ficam o **envio-log.txt** (o que foi enviado e os erros) e o
**enviados.txt** (o que já foi enviado; se apagar, ele reenvia e a planilha recusa os repetidos).

## Instalação (uma vez)

### 1. Planilha

1. Crie uma planilha Google nova (ex.: **Controle de entrada NF-e**).
2. **Extensões > Apps Script**: apague o conteúdo de `Código.gs`, cole o [`Codigo.gs`](Codigo.gs) e salve.
3. Recarregue a planilha e rode **NF-e > Configurar planilha**. Autorize quando o Google pedir. Isso cria
   as abas, a pasta **NF-e Galpão** no Drive e a **Chave do envio** em CONFIG.

### 2. App da Web (o "endereço" que recebe os arquivos)

1. No Apps Script, clique em **Implantar > Nova implantação**.
2. Na engrenagem de **Selecionar tipo**, escolha **App da Web**.
3. **Executar como: Eu** e **Quem pode acessar: Qualquer pessoa**. Só quem tem a Chave do envio
   consegue mandar arquivos.
4. **Implantar** e autorize.
5. Copie a **URL do app da Web** que aparece no fim (também fica em **Implantar > Gerenciar
   implantações**). Ela começa com `https://script.google.com/macros/s/` e termina em `/exec`. Copie
   inteira: o código do meio tem uns 70 caracteres.
6. Para conferir, abra a URL numa **janela anônima** do navegador. Deve aparecer "Controle de entrada
   de NF-e: envio no ar.". Se aparecer "Página não encontrada", a URL está errada ou incompleta.
7. A chave fica em **CONFIG > Chave do envio** (ou em **NF-e > Ver a chave e como pegar o link**).

**Quando trocar o código no futuro:** **Implantar > Gerenciar implantações > lápis (Editar) > Versão:
Nova versão > Implantar**. Sem isso, o envio continua usando o código antigo.

### 3. PC da rede

1. Crie uma pasta no PC, por exemplo `C:\EnvioNFe`, e coloque nela o
   [`enviar-notas.ps1`](enviar-notas.ps1) e o [`instalar-agendamento.bat`](instalar-agendamento.bat).
2. Abra o `enviar-notas.ps1` no Bloco de Notas e preencha as 3 linhas do começo:
   - `$Pasta`: o caminho da pasta das notas na rede, de preferência no formato `\\SERVIDOR\PASTA`
     (letra de unidade, como `Z:\`, pode não existir quando o agendamento roda);
   - `$Url` e `$Token`: o link e a chave da etapa anterior.
3. Dê dois cliques no `instalar-agendamento.bat`. Ele agenda o envio a cada 15 minutos e já roda a
   primeira vez. Na primeira vez são enviadas só as notas dos últimos 30 dias (dá para mudar no
   `$ApenasDesde`).
4. Confira o `envio-log.txt` e a aba NOTAS.

O agendamento roda enquanto o usuário do Windows estiver logado nesse PC, que é quando ele enxerga a
pasta da rede.

**Horário:** o envio agendado e a atualização automática da planilha só rodam das **07h às 20h**. Para
mudar: no PC, `$HoraInicio` e `$HoraFim` no começo do `enviar-notas.ps1`; na planilha, **CONFIG >
Horário da atualização automática**. Rodando o `.bat` na mão, o envio acontece em qualquer horário.
