# Recibos de Vale Transporte pela planilha

Você preenche os nomes e valores numa planilha do Google e clica num botão. O
script monta o Google Docs com todos os recibos (3 por página, com linha de
corte) e salva um PDF pronto para imprimir.

O que ele faz sozinho:

- **Valor por extenso**: escreve, por exemplo, "R$ 302,00 (trezentos e dois reais)"
  sem erro de digitação.
- **Data e mês**: se você deixar em branco, ele usa a data de hoje e o mês atual.
- **Conferência antes de gerar**: avisa quando um nome está repetido, um valor
  está faltando ou uma linha está sem nome.
- **Histórico**: cada geração fica registrada com a quantidade de recibos, o
  total em R$ e os links do Docs e do PDF.

---

## 1. Montar a planilha (uma vez só)

1. Crie uma planilha nova: <https://sheets.new>. Dê um nome a ela, por exemplo
   **Recibos VT**.
2. No menu, vá em **Extensões → Apps Script**.
3. Apague o conteúdo do arquivo `Código.gs`, cole todo o conteúdo de
   [`Code.gs`](./Code.gs) e clique em **Salvar** (💾). Se quiser, troque o
   nome do projeto (lá em cima, "Projeto sem título") para **Recibos VT**.
4. Volte para a planilha e recarregue a página (F5). Vai aparecer o menu
   **🧾 Recibos VT**.
5. Clique em **🧾 Recibos VT → Preparar planilha**.
   - Na primeira vez, o Google pede autorização: **Continuar → escolha sua
     conta → Avançado → Acessar Recibos VT (não seguro) → Permitir** (aparece
     o nome que você deu ao projeto).
     O aviso de "não seguro" aparece porque o script é seu e não foi publicado
     na loja do Google. Ele só mexe na sua planilha e cria os arquivos dos
     recibos no seu Drive.
   - São criadas três abas: **Funcionários**, **Config** e **Histórico**.

## 2. Preencher

### Aba Funcionários

| Nome | Valor VT (R$) | Setor | Pular |
|---|---|---|---|
| BRYAN NASCIMENTO ANDRADE DA SILVA | 150 | Aprendiz | ☐ |
| RAFAELA DOS SANTOS FORTES | 162 | Perfumaria | ☐ |

- **Nome**: pode digitar em minúsculas, que no recibo sai em MAIÚSCULAS.
- **Valor VT**: só o número (150, 162, 84,50...).
- **Setor** (opcional): serve para gerar os recibos de um setor só (veja a
  aba Config).
- **Pular**: marque quem **não** deve receber recibo neste mês (férias,
  afastamento...) sem precisar apagar a linha.

Para trazer uma lista pronta (CSV): na aba Funcionários, vá em **Arquivo →
Importar → Fazer upload**, escolha o arquivo e selecione **Substituir a página
atual**.

### Aba Config

| Campo | O que é |
|---|---|
| Empresa / CNPJ / Cidade | Já vêm preenchidos com os dados da Bem Barato / Santos |
| Data do recibo | Ex: 15/10/2026. Em branco = hoje |
| Mês de referência | Ex: OUTUBRO/2026. Em branco = mês da data do recibo |
| Forma de pagamento | "em dinheiro" (pode trocar por "via PIX", por exemplo) |
| Recibos por página | 1, 2 ou 3 |
| Setor | Em branco = todos. Escreva um setor (ex: Aprendiz) para gerar só os recibos dele |

## 3. Gerar os recibos (todo mês)

1. Ajuste os valores na aba Funcionários, se algum mudou.
2. Ajuste a **Data do recibo** na Config, ou deixe em branco para usar hoje.
3. Clique em **🧾 Recibos VT → Gerar recibos**.
4. Aparece uma janela com o total e os links **Abrir no Google Docs** e **Abrir
   PDF para imprimir**. Os dois arquivos ficam na mesma pasta do Drive em que
   está a planilha.

## Extra: conferir o valor por extenso na planilha

O script também cria a fórmula `=EXTENSO()`. Por exemplo, em uma coluna livre,
`=EXTENSO(B2)` mostra "cento e cinquenta reais".

## Se algo der errado

- **O menu 🧾 Recibos VT não aparece**: recarregue a planilha. Se mesmo assim
  não aparecer, confira se o código foi salvo no Apps Script.
- **"Corrija antes de gerar"**: a mensagem mostra o número da linha com
  problema (sem nome, sem valor ou com valor inválido).
- **"Nomes repetidos"**: alguém aparece duas vezes. Clique em **Não** para
  corrigir antes, ou em **Sim** para gerar mesmo assim.
