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
