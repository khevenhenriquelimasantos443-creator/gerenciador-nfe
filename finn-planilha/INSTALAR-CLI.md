# Instalar pela linha de comando

Duas etapas, e só uma delas vale automatizar. Sendo direto sobre qual é qual.

## Etapa 1 — subir o .xlsx: **não vale CLI**

É um arraste único pro Google Drive. Qualquer CLI de Drive (`rclone`, `gdrive`)
exige criar projeto no Google Cloud, baixar credencial e autorizar — mais
trabalho do que a coisa que você quer evitar, pra uma ação que você faz uma vez.

    Abra drive.google.com → arraste Planilha-Finn-v1.xlsx → clique com o
    botão direito → Abrir com → Google Planilhas

Isso cria a versão Google Sheets. Guarde o ID que aparece na URL:

    https://docs.google.com/spreadsheets/d/ESTE_PEDAÇO_É_O_ID/edit

## Etapa 2 — instalar o script: **vale CLI, sim**

Aqui compensa, porque você vai repetir toda vez que mexer no script. O `clasp`
é a ferramenta oficial do Google pra isso.

### Uma vez só

```bash
npm install -g @google/clasp
clasp login          # abre o navegador pra autorizar
```

Depois, ligue a API do Apps Script na sua conta (uma vez, por conta):
https://script.google.com/home/usersettings → "API do Google Apps Script" → Ativar

### Criar o script vinculado à planilha

Da pasta `finn-planilha/clasp`:

```bash
cd finn-planilha/clasp
clasp create --type sheets --title "Planilha Finn — sync" --parentId COLE_O_ID_DA_PLANILHA
clasp push
```

`--parentId` é o ID da planilha da etapa 1. É ele que faz o script ficar
**vinculado** ao arquivo — que é o que faz o script viajar junto no
"Fazer uma cópia" quando você vender.

Se o `clasp create` reclamar que já existe `.clasp.json`, apague o arquivo e
rode de novo.

### Nas próximas vezes

```bash
clasp push          # envia suas alterações do Code.gs
clasp open          # abre o editor no navegador
```

## Conferindo se deu certo

Recarregue a planilha no navegador. Deve aparecer o menu **Finn** na barra de
cima. Se não aparecer, abra `clasp open` e veja se o `Code.gs` está lá.

## O que o script pede de permissão, e por quê

Os escopos estão declarados em `appsscript.json`, no mínimo necessário:

| Escopo | Para quê |
|---|---|
| `spreadsheets.currentonly` | ler e escrever **só nesta planilha** — não alcança outros arquivos do seu Drive |
| `script.external_request` | falar com `finn.dev.br` (é a sincronização em si) |
| `script.container.ui` | mostrar o menu Finn e as caixas de aviso |

O `currentonly` é proposital: a alternativa (`spreadsheets`) daria acesso a
todas as suas planilhas, e este script não precisa disso.

## Por que eu não fiz isso por você

Tentei. O conector do Google Drive nesta sessão responde
`MCP tool call requires approval` — está sem autorização, então não consigo nem
enviar o arquivo nem criar o projeto de script. Para liberar, autorize o
conector do Google Drive nas configurações de conectores da sua conta claude.ai.

Mesmo autorizado, o `clasp create` precisa da API do Apps Script ligada na sua
conta Google, que é uma tela que só você acessa.
