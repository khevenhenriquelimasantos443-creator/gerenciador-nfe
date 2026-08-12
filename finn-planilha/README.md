# Planilha Finn

Planilha de controle financeiro para Google Sheets, vendida à parte do app.

## Arquivos

- `Planilha-Finn-v1.xlsx` — a planilha pronta. Suba no Google Drive e abra com
  Google Sheets (a conversão é automática).
- `gera_planilha.py` — gera o .xlsx do zero (`pip install openpyxl && python3 gera_planilha.py`).
  Editar aqui e regerar é mais confiável do que mexer no .xlsx na mão.
- `AppsScript.gs` — o script de sincronização. Instruções de instalação no topo do arquivo.
- `clasp/` + `INSTALAR-CLI.md` — mesmo script, pronto pra `clasp push` (CLI oficial do
  Google Apps Script). Vale a pena porque você vai repetir a cada alteração;
  o upload do .xlsx continua sendo arraste único, onde CLI só atrapalha.

## Duas regras de projeto

1. **A planilha funciona sozinha.** Quem compra e não usa o app Finn precisa
   conseguir usar do zero. A sincronização é camada opcional: sem token na aba
   Config, nada quebra.
2. **Só função que o Google Sheets tem.** Nada exclusivo do Excel — a conversão
   do Drive descarta em silêncio, e fórmula quebrada é pior que fórmula ausente.

## Como vender

O Apps Script é vinculado ao arquivo e viaja no "Fazer uma cópia". Então:

1. Suba `Planilha-Finn-v1.xlsx` no seu Drive e abra como Google Sheets
2. Instale o `AppsScript.gs` uma vez (Extensões → Apps Script)
3. Essa vira sua planilha-mestre — venda cópias dela

Quem comprar recebe o script junto e só precisa colar o próprio token na aba Config.

## Sincronização

Rotas no worker (`finn-serve/build.js`):

| Rota | Auth | O que faz |
|---|---|---|
| `POST /sheets/token` | sessão Supabase | cria/troca o token da planilha |
| `DELETE /sheets/token` | sessão Supabase | desconecta |
| `GET /sheets/pull` | `X-Sheet-Token` | devolve os lançamentos do dono do token |
| `POST /sheets/push` | `X-Sheet-Token` | grava lançamentos vindos da planilha |

O token **não é uma sessão**: só abre estas rotas, nunca o admin, e some ao
desconectar. O `user_id` sai sempre do token, nunca do corpo da requisição.

Duplicação é evitada pela coluna **ID Finn** da aba Lançamentos: linha sem id
é enviada, linha com id é ignorada. O que vem do Finn chega já com o id.

Testes: `node tests/sheets-sync.mjs`.
