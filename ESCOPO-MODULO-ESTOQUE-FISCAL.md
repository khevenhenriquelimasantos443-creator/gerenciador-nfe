# Escopo Detalhado — Módulo de Estoque, Fiscal e Cadastros

> ⚠️ **Aviso da Reforma Tributária (importante para este escopo):** desde 01/01/2026 o Brasil está em transição do modelo ICMS/PIS/COFINS para o IVA Dual (IBS + CBS), conforme EC 132/2023 e LC 214/2025. A partir de 03/08/2026 (regime Normal) os campos de IBS/CBS já são **obrigatórios na NF-e/NFC-e** (Nota Técnica 2025.002), e o CFOP está perdendo função estrutural, sendo progressivamente substituído por classificações do Comitê Gestor do IBS. Simples Nacional/MEI entram na obrigatoriedade em 2027. **Isso significa que o módulo fiscal não pode ser construído só para o modelo antigo** — precisa nascer com um "motor de tributação" abstrato que suporte ICMS/PIS/COFINS E IBS/CBS em paralelo durante toda a transição (até ~2033).

---

## 1. Cadastro de Produtos

### 1.1 Dados cadastrais
- Código interno (SKU) — gerado automaticamente ou manual
- Código de barras (EAN-13, GTIN, ou código interno para produtos sem EAN)
- Descrição completa e descrição resumida (para cupom fiscal, que tem limite de caracteres)
- Unidade de medida (UN, KG, CX, PCT, LT...) e unidade de compra x unidade de venda (ex: compra em CX, vende em UN)
- Fator de conversão entre unidades
- Imagem do produto
- Status (ativo/inativo/descontinuado)

### 1.2 Classificação hierárquica (Seção → Grupo → Subgrupo)
- **Seção**: nível macro (ex: Alimentos, Bazar, Limpeza)
- **Grupo**: dentro da seção (ex: Alimentos → Bebidas)
- **Subgrupo**: dentro do grupo (ex: Bebidas → Refrigerantes)
- Cada nível deve ter: código, descrição, status ativo/inativo
- Um produto pertence a exatamente 1 seção/grupo/subgrupo (relação obrigatória, não opcional — isso é o que permite curva ABC e relatórios gerenciais consistentes)
- Deve permitir também **marca** e **categoria fiscal** como atributos independentes da hierarquia comercial

### 1.3 Cálculo de valores unitários
- **Custo de compra** (valor da NF de entrada)
- **Custo médio ponderado**: recalculado a cada entrada — fórmula padrão:
  ```
  Novo Custo Médio = (Estoque Atual × Custo Médio Atual + Qtd Entrada × Custo Unitário Entrada)
                      ÷ (Estoque Atual + Qtd Entrada)
  ```
- **Custo de reposição** (último custo de compra, sem ponderação — usado por alguns negócios em vez do custo médio)
- **Markup / margem**: percentual configurável por produto, grupo ou global
- **Preço de venda**: calculado automaticamente (custo médio × markup) ou definido manualmente, com trava de alçada (ex: vendedor não pode dar desconto abaixo do custo sem autorização)
- Histórico de variação de custo e preço (auditável — quem alterou, quando, valor anterior x novo)

### 1.4 Ajuste manual de custo
- Tela específica para correção de custo (ex: erro de digitação na entrada, rateio de frete)
- **Obrigatório**: registro de motivo/justificativa em campo de texto
- **Obrigatório**: log de auditoria (usuário, data/hora, valor anterior, valor novo, IP/terminal)
- Recalcula automaticamente o custo médio e, se configurado, o preço de venda
- Alçada por perfil: usuário comum não altera custo — só supervisor/gerente com permissão específica

---

## 2. Entrada e Saída de Notas Fiscais

### 2.1 Entrada de NF-e (compra/transferência)
- Importação via XML (leitura automática do arquivo da NF-e emitida pelo fornecedor) — **essencial**, evita digitação manual
- Conferência física x XML (bipagem dos itens recebidos, com tolerância configurável para divergência)
- Vínculo automático do produto do fornecedor com o produto interno (de-para de código de fornecedor → SKU interno)
- Se o produto não existe no cadastro, gatilho para cadastro rápido a partir dos dados do XML (NCM, descrição, CFOP já vêm prontos)
- Rateio de custos adicionais (frete, seguro, IPI, ICMS-ST) sobre o custo unitário dos itens
- Status do recebimento: pendente → conferido → lançado no estoque → integrado ao financeiro (contas a pagar)

### 2.2 Saída de NF-e (venda, devolução, transferência, bonificação)
- Emissão vinculada à venda do PDV (NFC-e) ou separada (NF-e para B2B/atacado)
- Tipos de saída: venda, devolução ao fornecedor, transferência entre lojas, bonificação, amostra grátis, remessa para conserto, perda/quebra
- Cada tipo de saída tem **CFOP correspondente** (ver seção 4) e tratamento fiscal próprio

### 2.3 Cancelamento e carta de correção
- Cancelamento de NF-e dentro do prazo legal (SEFAZ)
- Carta de Correção Eletrônica (CC-e) para erros que não alteram valor/tributo/destaque

---

## 3. Contagem de Estoque (Inventário)

### 3.1 Tipos de contagem
- **Inventário geral**: conta todo o estoque, geralmente com bloqueio de vendas/movimentação durante a contagem
- **Inventário rotativo/cíclico**: conta por seção/grupo em datas alternadas, sem parar a operação
- **Contagem cega**: operador não vê o saldo do sistema durante a contagem (evita viés)

### 3.2 Fluxo
1. Geração de lista/planilha de contagem (por seção, por localização física)
2. Contagem em campo (idealmente via coletor/app mobile com leitor de código de barras)
3. Segunda contagem para itens com divergência (dupla checagem)
4. Relatório de divergência (sistema x físico), com valor financeiro do ajuste
5. Aprovação do ajuste por usuário com alçada (não deve ser automático — gera lançamento contábil)
6. Ajuste efetivado no estoque, com log de auditoria

---

## 4. Cadastros de Usuários e Permissões

### 4.1 Dados do usuário
- Nome, CPF, login, senha (hash — nunca texto plano), e-mail
- Loja(s) de acesso (para operação multiloja)
- Perfil de acesso (RBAC — role-based access control)

### 4.2 Perfis sugeridos (granulares, não fixos)
- Operador de caixa (só PDV)
- Estoquista (entrada/saída, contagem, sem acesso a custo/preço)
- Supervisor de loja (aprova ajustes, autoriza descontos)
- Gerente (todos os módulos da loja, sem acesso multiloja)
- Administrador/matriz (acesso total, todas as lojas, configurações fiscais)
- Contador (acesso somente leitura a relatórios fiscais e exportações)

### 4.3 Controle de acesso
- Permissão por **tela** (ver, criar, editar, excluir) — não binário de "tem acesso ou não"
- Permissão por **valor/alçada** (ex: pode dar desconto até 10% sem aprovação)
- Log de todas as ações sensíveis (alteração de preço, custo, cancelamento de venda, exclusão de produto)
- Autenticação de segundo fator para ações críticas (recomendado, não obrigatório por lei ainda)

---

## 5. Cadastro de Fornecedores (Completo)

- Razão social, nome fantasia, CNPJ (com validação de dígito verificador e consulta à Receita/SINTEGRA)
- Inscrição Estadual (IE) e indicador de contribuinte de ICMS (contribuinte / isento / não contribuinte)
- Endereço completo com CEP validado
- Contatos (comercial, financeiro, representante)
- Dados bancários (para pagamento)
- Condições comerciais padrão: prazo de pagamento, forma de pagamento, desconto padrão
- Regime tributário do fornecedor (Simples Nacional, Lucro Presumido, Lucro Real) — **impacta diretamente o cálculo de crédito de ICMS/PIS/COFINS na entrada**
- Histórico de compras e ranking de fornecedores (por volume, prazo de entrega, divergências)
- Vínculo produto-fornecedor com código do fornecedor e último custo praticado (permite comparar preços entre fornecedores do mesmo produto)

---

## 6. Parte Jurídica/Fiscal — NCM, CEST, CFOP, Origem

Este é o núcleo mais crítico e mais caro do sistema. Recomendação forte: **não tente manter essas tabelas manualmente — integre com uma API fiscal especializada** (Focus NFe, eNotas, NFe.io, Tecnospeed) que já mantém tudo atualizado. Manter isso "na mão" é inviável para uma empresa que não seja especializada em tributação, porque as tabelas mudam com frequência e um erro gera rejeição de nota ou autuação fiscal.

### 6.1 NCM (Nomenclatura Comum do Mercosul)
- Código de 8 dígitos que classifica a mercadoria (base para tributação federal e para saber se o produto tem substituição tributária)
- Cadastro deve validar contra a tabela oficial vigente (Receita Federal/Siscomex atualiza periodicamente)
- Um produto tem exatamente 1 NCM

### 6.2 CEST (Código Especificador da Substituição Tributária)
- Obrigatório quando o produto está sujeito a Substituição Tributária (ST) ou Antecipação Tributária
- Relaciona-se ao NCM, mas **não é 1:1** — um mesmo NCM pode ter mais de um CEST possível dependendo do segmento
- Vincula a alíquota de MVA (Margem de Valor Agregado) usada no cálculo do ICMS-ST, que varia **por estado**

### 6.3 CFOP (Código Fiscal de Operações e Prestações)
- Define a natureza da operação (venda dentro do estado, venda interestadual, devolução, transferência, bonificação etc.)
- Muda conforme: origem/destino da operação (dentro do estado, interestadual, exterior), finalidade (venda, devolução, transferência, industrialização)
- **Atenção 2026**: com a Reforma Tributária, o CFOP está perdendo protagonismo — o Comitê Gestor do IBS está criando classificações próprias que vão progressivamente assumir o papel que o CFOP tem hoje. O sistema deve ser desenhado para trocar essa "tabela de regras de operação" sem reescrever a lógica de negócio.

### 6.4 Origem da Mercadoria (Código de Origem — Tabela A do ICMS)
- 0 = Nacional
- 1 = Estrangeira (importação direta)
- 2 = Estrangeira (adquirida no mercado interno)
- 3 a 8 = variações com/sem similar nacional, conteúdo de importação (para produtos com Lei da Informática/ZFM etc.)
- Impacta diretamente a alíquota de ICMS interestadual (4% para produtos importados sem industrialização relevante, regra geral)

### 6.5 Motor de tributação (arquitetura recomendada)
Ao invés de "hardcodar" regras de ICMS/CFOP no código, construa uma **tabela de regras configurável**:

```
Regra de Tributação = f(
  UF Origem, UF Destino,
  Regime Tributário do Emitente (Simples/Presumido/Real),
  Regime Tributário do Destinatário,
  NCM/CEST do produto,
  Finalidade da operação,
  Vigência (data início/fim da regra) ← crítico para a transição da reforma
)
→ retorna: CFOP, CST/CSOSN, alíquota ICMS, MVA-ST, alíquota IBS, alíquota CBS, alíquota PIS/COFINS
```

- Isso permite que, quando o governo mudar uma alíquota ou o Comitê Gestor publicar nova tabela, você **atualize dados, não código**.
- Campo de vigência é essencial porque durante a transição (2026-2033) vão coexistir regras antigas e novas, e as notas precisam usar a regra vigente na data da operação.

### 6.6 Validações obrigatórias antes de emitir a nota
- CNPJ/CPF do destinatário válido
- Regime tributário do CFOP compatível com o regime do emitente (ex: CFOP de Simples Nacional não pode ser usado por empresa do Lucro Real)
- NCM existe na tabela vigente
- Se produto tem CEST, verificar se está na lista de ST para aquele estado (nem todo estado aplica ST ao mesmo NCM)
- A partir de ago/2026: campos de IBS/CBS preenchidos para regime Normal (LC 214/2025)
- Cálculo de crédito/débito de ICMS coerente entre emitente e destinatário (evitar nota rejeitada por incompatibilidade de CST)

---

## 7. Priorização Sugerida (ordem de construção)

| Ordem | Módulo | Por quê primeiro |
|---|---|---|
| 1 | Cadastro de produtos + seção/grupo/subgrupo | Base de tudo — sem isso nada funciona |
| 2 | Cadastro de fornecedores | Necessário para entrada de NF |
| 3 | Entrada de NF (com leitura de XML) | Movimenta estoque e alimenta custo médio |
| 4 | Cálculo de custo médio + ajuste manual | Depende da entrada funcionando |
| 5 | Cadastro de usuários e permissões | Deve vir cedo para já auditar tudo daqui pra frente |
| 6 | Saída de NF (venda) | Depende de entrada + tributação já mapeada |
| 7 | Motor de tributação (NCM/CEST/CFOP/Origem) | É transversal — mas comece integrando API terceira, não construindo do zero |
| 8 | Contagem de estoque/inventário | Só faz sentido com estoque já populado e estável |

---

**Recomendação final:** a parte de "conforme leis federais e estaduais" (seção 6) é onde a maioria dos ERPs pequenos quebra — não pela complexidade do código, mas porque a legislação muda e ninguém no time acompanha. Se o objetivo é ter algo confiável desde o dia 1, terceirizar a emissão/validação fiscal para uma API especializada (Focus NFe, eNotas, Tecnospeed) e manter seu esforço interno focado em estoque, custo e cadastros é o caminho mais realista — mesmo os grandes ERPs fazem isso.
