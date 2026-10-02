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
2. Em até 15 minutos a nota aparece na aba **NOTAS**, com status **AGUARDANDO**.
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
5. Na planilha, **NF-e > Ver link e chave para o script do PC** mostra o link e a chave.

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
