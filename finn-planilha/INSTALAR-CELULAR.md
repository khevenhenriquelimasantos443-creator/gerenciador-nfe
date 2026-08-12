# Instalar usando só o celular

Dá pra fazer tudo pelo telefone, mas tem uma limitação do Google que muda o
plano — e é melhor você saber antes de começar.

## A limitação

**O app do Google Sheets não mostra menus personalizados.** O menu "Finn" só
existe quando a planilha é aberta no navegador. Não é coisa que dê pra
contornar com código: o app simplesmente não carrega Apps Script.

Por isso o caminho no celular não é "clicar em sincronizar". É **ligar a
sincronização automática uma vez** e nunca mais mexer. Depois disso a planilha
se atualiza sozinha de hora em hora, mesmo fechada, e o app do Sheets no
telefone só precisa abrir e mostrar o resultado.

## Passo a passo (Android ou iPhone)

Você vai precisar do **navegador** (Chrome, Safari), não do app do Sheets.
São ~5 minutos, uma vez só.

### 1. Abrir a planilha no navegador, em modo computador

- Abra o Chrome (Android) ou Safari (iPhone)
- Vá em `drive.google.com` e abra a planilha
- **Android/Chrome:** toque nos ⋮ (canto superior direito) → marque **"Site
  para computador"**
- **iPhone/Safari:** toque em `aA` (na barra de endereço) → **"Solicitar site
  para computador"**

Sem esse passo, os menus não aparecem.

### 2. Colar o script

- Menu **Extensões → Apps Script**
- Apague o que estiver escrito no `Code.gs`
- Cole todo o conteúdo do arquivo `AppsScript.gs`
- Toque no ícone de **disquete** para salvar

Dica: dá para colar melhor se você abrir o `AppsScript.gs` em outra aba,
selecionar tudo e copiar.

### 3. Autorizar

- Ainda no editor do Apps Script, selecione a função **`finnAtivarAutomatico`**
  na caixinha do topo e toque em **Executar**
- O Google vai pedir autorização — aceite. Vai aparecer um aviso de "app não
  verificado": toque em **Avançado → Acessar (não seguro)**. É o seu próprio
  script, num projeto seu; o aviso aparece porque ele não passou pela revisão
  pública do Google, que só faz sentido para app distribuído em loja.

Ao final aparece a confirmação de que a sincronização automática foi ligada.

### 4. Colar o token

- Volte para a planilha
- Aba **Config**, célula **C35**
- Cole o token que você pegou no Finn (Configurações → Planilha Finn →
  Conectar planilha)

Pronto. A partir daqui é automático.

## Como saber se está funcionando

Na aba **Config**, a célula **C36** ("Última sincronização") passa a mostrar
data e hora. Se ela atualizar sozinha dentro de uma hora, está tudo certo.

Para conferir na hora, sem esperar: no editor do Apps Script, execute a função
`finnSincronizarSilencioso` e depois olhe a C36.

## Uso no dia a dia

- **Lançar pelo celular:** abra a planilha no app do Sheets normalmente e digite
  na aba Lançamentos. Na próxima hora, sobe pro Finn sozinho.
- **Lançar pelo Finn (ou pelo WhatsApp/Telegram):** aparece na planilha na
  próxima sincronização.

Você não precisa abrir o navegador nunca mais.

## Se precisar desligar

Navegador em modo computador → menu **Finn → Desligar sincronização automática**.
Ou, no editor do Apps Script, execute `finnDesativarAutomatico`.

## O que o script pede de permissão

| Permissão | Para quê |
|---|---|
| ver e gerenciar **esta** planilha | ler e escrever os lançamentos — não alcança seus outros arquivos |
| conectar a serviço externo | falar com `finn.dev.br`, que é a sincronização |
| exibir interface | o menu Finn e as caixas de aviso |
| gerenciar gatilhos | ligar/desligar a sincronização automática |
