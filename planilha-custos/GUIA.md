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
a cada 15 minutos.

**Como saber se chegou:** depois de gravar, o script abre a planilha de custos e confere o valor
de cada lançamento.

- **Chegou:** a linha **sai da aba LANÇAR CUSTO**. A janela e o **LOG** mostram onde foi gravado,
  por exemplo "LOREAL-0038 = R$ 49,90 conferido em SKUSHOPPEATUALIZADO, linha 5012". O valor
  anterior fica no **HISTÓRICO DE CUSTOS**.
- **Não chegou:** a linha fica, com o motivo na coluna Situação. Por exemplo: "na planilha de custos
  continua R$ 12,38" ou "produto sem vínculo". A conferência se
  repete a cada importação; apague a linha se não precisar mais dela.
- **CONFIRA:** o nome bateu com mais de um produto, e as opções aparecem na coluna I. Escreva o
  SKU certo na coluna A e apague a Situação para lançar de novo.
- **NÃO ACHEI:** o código não existe no SKU - MKTPLACE.

Vale sempre o **último valor que entrou**, seja por romaneio, XML ou lançamento, na ordem em que foi
importado ou lançado, e não pela data da nota. Um lançamento feito hoje substitui o custo que estava
lá, e um romaneio importado depois substitui o lançamento.

## Kits

O custo de cada kit é **a soma de quantidade × custo de cada componente**, lido da planilha de
custos. Quando o custo de um componente muda, os kits que usam esse componente se atualizam sozinhos
e aparecem em AUMENTOS 7 DIAS, marcados como "KIT ATUALIZADO" no histórico.

**Primeira vez:**

1. Em **CONFIG**, cole o link da **planilha de kits** (a lista com SKU novo, SKU atual, nome, marca e EAN).
2. Rode **Custos > Sugerir componentes dos kits**. A aba **KITS** ganha uma linha por componente,
   separado a partir do nome do kit. A quantidade também vem do nome: "3 Ampolas", "3x30ml", "12un",
   "2 Shampoo e 1 Condicionador". A sugestão é o produto mais parecido **da mesma marca** no SKU - MKTPLACE.
3. Confira a coluna laranja **CONFIRMAR**. Ela já vem preenchida quando a sugestão é segura, ou seja,
   quando todas as palavras do componente e a linha batem, com folga para a 2ª opção. Nas outras,
   escreva o SKU do componente ou **NÃO TEM**. A quantidade (coluna F) também pode ser corrigida.
4. Clique em **Calcular kits**. A coluna **Situação** mostra, para cada kit, o custo e a conta
   (ex.: "OK: R$ 215,00 = 105,00 + 110,00") ou o que falta: componente para confirmar, componente sem
   custo na planilha de custos, ou kit que não está na planilha de custos.

Kit recém-sugerido só entra na sincronização automática depois do primeiro **Calcular kits**, para
nada ser gravado antes da sua revisão. Para kits novos na planilha de kits, rode **Sugerir componentes**
de novo: só os kits que ainda não estão na aba KITS são adicionados.

O kit que tinha fórmula na coluna I da planilha de custos (ex.: `=I329+I330` ou IMPORTRANGE) passa a
ter o valor calculado. As fórmulas por número de linha estavam apontando para produtos errados
depois que a aba foi reordenada.

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
| KITS | Componentes de cada kit e a conta do custo do kit |
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
