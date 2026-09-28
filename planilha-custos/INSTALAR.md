# Planilha de custos por romaneio de entrada

Google Sheets + Apps Script. Lê o PDF do romaneio (ou o XML da NF-e), grava os itens,
cria SKUs novos sozinha e mantém o custo de cada SKU atualizado.

## Instalação (uma vez, ~3 minutos)

1. Abra a planilha no Google Sheets.
2. **Extensões > Apps Script**.
3. Apague o conteúdo de `Código.gs` e cole o conteúdo de [`Codigo.gs`](Codigo.gs).
4. Na barra da esquerda, clique no **+** ao lado de **Serviços**, escolha **Drive API**, versão **v3**,
   identificador **Drive**, e clique em **Adicionar**. Isso liga a conversão do PDF em texto.
   (Não crie um arquivo `.gs` novo para isso; o único arquivo de código é o `Código.gs`.)
5. Salve, volte para a planilha e recarregue a página. Aparece o menu **Custos**.
6. **Custos > Configurar planilha (1ª vez)**. Autorize o acesso quando o Google pedir.
   O script cria as abas e as pastas `Romaneios - Entrada`, `Romaneios - Processados` e `Romaneios - Com erro` no seu Drive.
7. **Custos > Ativar importação automática**.

Romaneios do VarejoFácil ("ROMANEIO NOTA DE ENTRADA") são lidos por um leitor próprio:
o código do produto do romaneio vira o SKU (sem os zeros à esquerda), a nota é identificada pela chave NF-e
e o valor pago de cada item é a coluna "Valor Total". Outros layouts caem no leitor genérico.

Se você já tem uma lista de SKUs, cole na aba **SKUs** (SKU, Descrição, EANs, Unidade) antes da primeira importação.

## Abas

| Aba | Para que serve |
|---|---|
| CUSTOS | Custo de cada SKU (só fórmulas): último pago, anterior, variação, efetivo com bonificação, médio, oficial |
| SKUs | Cadastro. SKUs criados sozinhos entram com status `NOVO - REVISAR` |
| DE_PARA | Vínculo fornecedor + código do fornecedor → seu SKU, com fator caixa/unidade |
| ENTRADAS | Uma linha por item de cada romaneio importado |
| PENDENTES | Itens com descrição parecida com um SKU existente, esperando sua confirmação |
| CONFIG | Pastas, custo oficial, limite de similaridade, CFOPs de bonificação |
| LOG | O que aconteceu com cada arquivo |

As regras de correspondência e de bonificação estão explicadas na aba LEIA-ME.

## Ligação com as planilhas de marketplace

Na aba **CONFIG** (linhas do final) ficam o link da **SKU - MKTPLACE**, o link da planilha de custos
e a aba **SKUSHOPPEATUALIZADO**.

Fluxo de cada nota: coloque o **PDF do romaneio e o XML** na pasta `Romaneios - Entrada`. O script:

1. importa o romaneio (código do VarejoFácil, quantidade, valor);
2. confere o XML item por item com o romaneio (resultado no LOG) e grava o EAN em SKUs;
3. liga cada produto ao SKU - MKTPLACE pelo EAN (sem XML: sugestão pela descrição na aba VINCULAR);
4. monta a PRÉVIA e, com "Aplicar automaticamente" = SIM, grava na SKUSHOPPEATUALIZADO:
   só a coluna I (Custo) nas linhas existentes e linhas novas com os dados do SKU - MKTPLACE;
5. registra tudo em **HISTÓRICO DE CUSTOS**; a aba **AUMENTOS 7 DIAS** lista os custos que subiram
   nos últimos 7 dias, do maior aumento para o menor, para reajustar os preços de venda.
