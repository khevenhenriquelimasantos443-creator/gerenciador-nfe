# Planilha de custos: guia de uso

A planilha lê o **romaneio do VarejoFácil (PDF)** e o **XML da NF-e**, descobre o produto
de cada item no **SKU - MKTPLACE** e atualiza o custo na **SKUSHOPPEATUALIZADO**. Produto que
ainda não está lá é adicionado com os dados do SKU - MKTPLACE.

## Dia a dia

1. Coloque o **PDF do romaneio** e o **XML da mesma nota** na pasta **Romaneios - Entrada** do Drive.
2. Clique em **Importar romaneios** (aba CUSTOS) ou espere. Com a importação automática
   ligada, ela roda sozinha a cada 15 minutos.
3. A planilha faz o resto:
   - grava os itens em **ENTRADAS** e confere o XML com o romaneio. O resultado vai para o **LOG**,
     por exemplo "14 de 14 itens iguais";
   - liga cada produto ao SKU - MKTPLACE pelo EAN do XML;
   - atualiza a **coluna I (Custo)** da SKUSHOPPEATUALIZADO e adiciona as linhas que faltam;
   - registra cada alteração em **HISTÓRICO DE CUSTOS**.
4. Abra **AUMENTOS 7 DIAS** para ver o que subiu, do maior aumento para o menor, e reajustar
   os preços de venda.

### Se aparecer produto na aba VINCULAR

Isso acontece quando o romaneio veio **sem o XML**, então não há EAN. A planilha sugere o produto
do SKU - MKTPLACE pela descrição. Na coluna laranja **CONFIRMAR**:

- se estiver certo, deixe o SKU sugerido;
- se estiver errado, troque pelo SKU certo ou pelo EAN;
- se o produto não existir no SKU - MKTPLACE, escreva **NÃO TEM**.

Depois clique em **Confirmar vínculos**. Cada produto só precisa ser confirmado uma vez.

## Custo que não vem no romaneio

### Nota de faturamento separada da nota de remessa

Coloque o **XML da nota de faturamento** na pasta de entrada. Ele entra como uma compra
normal, com o valor e o EAN de cada item, e atualiza o custo sozinho.

### Qualquer outro caso: aba LANÇAR CUSTO

Use para frete ou acerto de preço, ou quando você só tem o valor.

| Coluna | O que escrever |
|---|---|
| A | Código de barras (EAN) **ou** SKU (ex.: `LOREAL-0038`) |
| B | Só se não tiver o código: o nome do produto |
| C | **Custo unitário** final |
| D a G | Opcionais: quantidade, fornecedor, nº da nota, data (padrão: hoje) |

Clique em **Lançar custos**. Com a importação automática ligada, as linhas também são lançadas
a cada 15 minutos. A coluna **Situação** mostra:

- **LANÇADO**: o custo já foi para a planilha de custos;
- **CONFIRA**: o nome bateu com mais de um produto, e as opções aparecem na coluna I. Escreva o
  SKU certo na coluna A e apague a Situação para lançar de novo;
- **NÃO ACHEI**: o código não existe no SKU - MKTPLACE.

Vale sempre a compra **mais recente**. Um romaneio novo do mesmo produto substitui o custo
lançado à mão.

## Bonificação

- Item bonificado (CFOP 1910/2910/5910/6910 ou valor zero) entra com valor pago 0 e **não muda
  o último custo pago**.
- Em **CONFIG**, se **Custo oficial** for `EFETIVO`, a bonificação dilui o custo: total pago
  dividido por todas as unidades recebidas.
- Se a bonificação veio em nota separada, escreva na coluna **Grupo de compra** de ENTRADAS o
  número da nota da compra.

## Corrigir e desfazer

| Situação | O que fazer |
|---|---|
| Nota importada errada | **Custos > Desfazer importação de uma nota**; depois mova os arquivos de *Processados* para *Entrada* |
| Arquivo em *Romaneios - Com erro* | O motivo está no **LOG**. Se for romaneio, o texto lido fica na aba **DIAGNOSTICO** |
| `#ERROR!`, botão sumido ou aba faltando | **Custos > Atualizar estrutura** (não apaga dados) |
| Quer conferir antes de gravar | Em CONFIG, **Aplicar automaticamente** = `NÃO`; as alterações ficam na **PRÉVIA** até o botão *Aplicar na planilha* |

Não escreva nas abas **CUSTOS** e **AUMENTOS 7 DIAS**, nem nas colunas **O e P de ENTRADAS** e
**I de SKUs**: são fórmulas.

## Abas

| Aba | Para que serve |
|---|---|
| LEIA-ME | Este guia, resumido |
| CUSTOS | Custo de cada produto: último pago, anterior, efetivo, médio e oficial (só fórmulas) |
| LANÇAR CUSTO | Custo que não vem em romaneio ou XML |
| AUMENTOS 7 DIAS | Custos que subiram na última semana |
| HISTÓRICO DE CUSTOS | Tudo que foi gravado na planilha de custos |
| SKUs | Produtos (código VarejoFácil) e o vínculo com o SKU - MKTPLACE (colunas J a M) |
| ENTRADAS | Uma linha por item de cada nota ou lançamento |
| VINCULAR | Produtos esperando confirmação do vínculo |
| PRÉVIA | Alterações esperando aplicação (quando o automático está em NÃO) |
| CONFIG | Pastas, links das planilhas e opções |
| LOG | O que aconteceu com cada arquivo e cada sincronização |

## Instalação (uma vez)

1. Numa planilha Google nova, abra **Extensões > Apps Script**, apague o conteúdo de `Código.gs`,
   cole o [`Codigo.gs`](Codigo.gs) e salve.
2. Recarregue a planilha e rode **Custos > Atualizar estrutura**. Autorize o acesso quando o Google
   pedir. As abas e as pastas `Romaneios - Entrada / Processados / Com erro` são criadas no Drive.
3. Em **CONFIG**, cole os links da **SKU - MKTPLACE** e da **planilha de custos**.
4. **Custos > Ligar importação automática**.

### Atualizando de uma versão anterior

1. Cole o `Codigo.gs` novo e salve.
2. Recarregue a planilha e rode **Custos > Atualizar estrutura**. O botão *Processar pendentes*
   sai e entram a aba **LANÇAR CUSTO** e o botão **Sincronizar**.
3. Opcional: apague as abas **DE_PARA** e **PENDENTES**, que não são mais usadas, e tire a
   **Drive API** de *Serviços* no Apps Script, que não é mais necessária.
