# Finn — Escopo de Design e Segurança

Documento de referência do que o Finn é, como está construído e quais defesas
existem. Escrito para ser lido daqui a seis meses, quando ninguém lembrar por
que uma decisão foi tomada.

**Última revisão:** julho de 2026, ao fim da rodada de segurança.

---

## 1. O que o Finn é

Controle financeiro pessoal para o público brasileiro. A tese: a maioria das
pessoas abandona planilha e app de finanças pelo mesmo motivo — dá trabalho
lançar. O Finn ataca isso deixando lançar por **conversa no WhatsApp**, sem
abrir o app.

**Estado atual:** beta fechado, poucos testers, cobrança ainda não iniciada.

### Superfícies

| Superfície | O que faz | Onde mora |
|---|---|---|
| App web (PWA) | Interface principal — lançamentos, análises, metas, limites, dívidas, cartões, racha de contas, IA | `finn/index.html` |
| Bot WhatsApp | Lançar por texto, áudio ou foto de comprovante | `finn-worker/` |
| Bot Telegram | Mesmo papel, canal alternativo (beta fechado, 2 contas) | `finn-worker/` |
| Landing + funil | Divulgação e captação de testers | `finn/landing.html`, rota `/beta` |
| Painel admin | Uso ao vivo, assinaturas, segurança, Instagram | dentro do app, só a conta master |

---

## 2. Arquitetura

```
    navegador / WhatsApp / Telegram
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
   finn-app             finn-worker
   (Cloudflare)         (Cloudflare)
   serve o app          bots + IA de mensagem
   /ai, /billing,       /webhook, /sync,
   /admin/*, /beta      /telegram/*
        │                   │
        └─────────┬─────────┘
                  ▼
       Supabase (Postgres + Auth)
       dados financeiros, RLS por usuário
```

**Duas peças que valem entender:**

**O app é um arquivo só.** `finn/index.html` carrega HTML, CSS e todo o
JavaScript num único documento — sem framework, sem build de front-end. A
interface é montada concatenando strings e atribuindo a `innerHTML`. É simples
e rápido, mas tem uma consequência de segurança direta: **todo dado de usuário
precisa passar por `escapeHtml()`** antes de virar HTML. Um esquecimento aí é
XSS.

**O worker é gerado, não escrito.** `finn-serve/build.js` embute o HTML do app
dentro do worker e produz `finn-serve/index.js`. **Nunca edite `index.js` na
mão** — o próximo build sobrescreve. Toda mudança vai no `build.js` ou no
`finn/index.html`.

**Onde os dados ficam.** Supabase guarda o que é permanente (lançamentos,
metas, limites, dívidas, cartões, assinaturas). O Cloudflare KV guarda o que é
efêmero ou de bot: dados de conversa, códigos de vínculo, contadores de limite,
registros de segurança.

---

## 3. Design

### Identidade

| Elemento | Valor |
|---|---|
| Tipografia | Plus Jakarta Sans (400–800) |
| Laranja (marca) | `#F97316` |
| Escuro (texto/fundo) | `#0F172A` / `#1E293B` |
| Fundo claro | `#F8F7F4` |
| Texto secundário | `#64748B` (claro) / `#94A3B8` (escuro) |
| Positivo / negativo | `#059669` / `#DC2626` |

Tema claro e escuro, alternado em Configurações e guardado no navegador.

### Princípios que a interface segue

**Números antes de enfeite.** O Dashboard abre com receita, despesa e saldo do
mês. Nada de ilustração ocupando a primeira dobra.

**Uma ação óbvia por tela.** "Novo lançamento" no topo do Dashboard; cada aba
tem um formulário principal e o histórico embaixo.

**Escrever como gente fala.** "Lance um gasto, peça um resumo" em vez de
"Gerenciar transações". Erros dizem o que fazer, não o que falhou.

**Movimento discreto.** Transição de aba com fade curto, feedback de toque nos
botões. Respeita `prefers-reduced-motion`.

**Mobile primeiro.** Menu vira barra lateral acima de 900px. A maioria dos
testers usa celular.

---

## 4. Segurança

Modelo de ameaça em uma frase: **o dado financeiro de uma pessoa não pode ser
acessível a outra, e ninguém pode agir em nome de terceiro.**

### 4.1 Autorização — a camada que realmente protege

Todo o resto é secundário a isto.

**Supabase RLS.** Cada tabela tem Row Level Security exigindo
`auth.uid() = user_id` para ler, inserir, atualizar e apagar. Mesmo que alguém
capture a chave pública (ela é pública por design), só alcança os próprios
dados.

**A tabela `subscriptions` não tem política de escrita.** Proposital: ninguém
se promove para plano pago pelo cliente. Só o webhook do Mercado Pago, no
servidor, altera plano.

**Posse verificada do número de WhatsApp.** Um número só pertence a uma conta,
e o vínculo nasce de a pessoa mandar um código pelo próprio WhatsApp. Antes o
número era auto-declarado — bastava digitar o de outra pessoa em Configurações
para ler os lançamentos dela.

**Identificador nunca vem cru do cliente.** Telefone passa por
`normalizePhone()` (`^\d{10,15}$`) e a chave usada depois sai sempre do valor
normalizado. Sem isso, `phone="tg:<chatid>"` alcançava dados de contas do
Telegram.

**Admin exige dois fatores independentes:** sessão Supabase com o e-mail master
**e** a senha de administrador, conferidas a cada chamada. O app esconder o
botão não é proteção — é conveniência.

### 4.2 Autenticidade das mensagens

Webhooks do WhatsApp (Meta) e do Telegram verificam assinatura, e **falham
fechado**: sem o segredo configurado, recusam. Antes só registravam no log e
processavam — uma janela aberta em toda rotação de secret.

O webhook do Mercado Pago verifica HMAC e, além disso, **rebusca o pagamento na
API** em vez de confiar no corpo do POST.

### 4.3 Segredos

Ficam no cofre criptografado da Cloudflare, injetados como variável em memória.
Não existe arquivo `.env` no servidor — Workers não têm sistema de arquivos, o
que elimina a classe de vazamento mais comum da web.

A chave pública do Supabase está no código do app **de propósito** — é feita
para isso, e quem protege é a RLS. A chave de serviço (`SUPABASE_SERVICE_KEY`)
ignora RLS e **nunca** chega ao cliente.

Comparação de segredo é em tempo constante, para não vazar o prefixo pelo tempo
de resposta.

### 4.4 Contenção no navegador

CSP restringindo origem de script e, principalmente, **`connect-src`** — que
limita para onde dados podem ser enviados, bloqueando exfiltração de token.
Mais HSTS, `nosniff`, `X-Frame-Options`, `Referrer-Policy`.

SRI (hash de integridade) nas bibliotecas de CDN: se o jsDelivr for
comprometido, o navegador recusa o script alterado.

`isEvalSupported: false` no pdf.js fecha a CVE-2024-4367, em que um PDF forjado
executava JavaScript na origem do app.

### 4.5 Limites de uso

| Onde | Limite |
|---|---|
| Senha de admin | 5 tentativas/IP e 10/conta a cada 15 min |
| Inscrição no beta | 5/h por IP, 3/dia por e-mail de destino |
| Código de vínculo | 10 tentativas por remetente a cada 15 min |
| Bot (texto / mídia) | 120 e 30 por número, por dia |
| IA | 20/min por IP e 60/dia por conta |

O limite de e-mail por destino existe porque o `/beta/signup` dispara e-mail
real: sem ele, o Finn vira ferramenta de bombardeio de caixa de entrada.

### 4.6 Detecção — alarme, não tranca

**Iscas.** Caminhos que nenhum cliente legítimo pede (`/.env`,
`/wp-login.php`, extensões `.php`/`.sql`) e um endpoint falso plantado no HTML
do app. Quem bate no falso necessariamente leu o código-fonte — não existe
falso positivo.

Respondem **404 comum**, idêntico ao de um caminho inexistente, e o registro
roda em segundo plano. Se o atacante percebe que foi detectado, muda de técnica
e a isca perde o valor.

**Painel.** Dentro do Painel de uso: volume de 24h e 7 dias, tipos, caminhos
mais tentados e origens. A coluna que mais informa é **quantos caminhos
distintos** cada origem tentou — um é acidente, quinze é mapeamento. Alerta
quando o dia passa de 3× a média dos 7 anteriores.

**LGPD.** IP é dado pessoal. Guardamos os dois primeiros octetos
(`189.45.x.x`) mais um hash com sal (`SEC_LOG_SALT`), que permite contar
tentativas da mesma origem sem armazenar o endereço. Retenção de 30 dias
automática. Descrito na política de privacidade.

### 4.7 Repositório

`SECURITY.md` com canal privado de reporte. Dependabot nas GitHub Actions.
Workflow com `permissions: contents: read`. `.gitignore` bloqueando `.env`,
`*.pem`, `*.key`.

---

## 5. O que continua aberto

Honestidade vale mais que a sensação de completude.

| Item | Situação |
|---|---|
| `xlsx` 0.18.5 tem CVE de prototype pollution | Contido por um guarda em tempo de execução; a versão corrigida saiu do npm e exige migrar para o CDN do SheetJS |
| Actions presas a tag, não a SHA | Quem controlar a action roda com o token de deploy. Passo a passo documentado no `deploy.yml` |
| Deploy direto da branch de trabalho | Sem revisão entre o push e a produção |
| Importação de extrato só cobre 2 layouts | BB e Nubank/PicPay verificados com arquivo real. Os demais caem no leitor genérico — o detector avisa quando a leitura parece errada, mas não conserta |
| `PREMIUM_ENFORCEMENT_ENABLED = false` | Todos usam como Pro. Decisão de negócio, não falha |
| Fluxo conversacional do bot sem teste automatizado | Exige WhatsApp real |
| Nenhum teste de invasão contra a produção | Tudo que foi feito é leitura de código e teste local |

**Nada disso torna o Finn "100% seguro" — isso não existe para nenhum sistema.**
O que existe é: as falhas conhecidas foram fechadas, e há alarme para o que
ainda não se conhece.

### 5.1 Os dois primeiros da fila

Ambos precisam de **acesso de rede à internet** — foi o que impediu de fazer na
rodada anterior. Quem pegar isso numa sessão com rede liberada resolve os dois
em pouco tempo.

#### Migrar o `xlsx` para versão sem CVE

O `xlsx@0.18.5` tem CVE-2023-30533 (prototype pollution via planilha forjada).
Hoje está contido por `withPrototypeGuard()` em `finn/index.html`, que limpa o
`Object.prototype` depois do parse — mas conter não é corrigir.

**A pegadinha:** o pacote `xlsx` no npm **parou na 0.18.5**. A SheetJS tirou as
versões novas do npm e publica só no CDN próprio. Então não adianta pedir uma
versão maior no jsDelivr — ela não existe lá.

Passos:

1. Baixar `https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js`
   (ou versão mais recente).
2. Calcular o hash SRI:
   `openssl dgst -sha384 -binary arquivo.js | openssl base64 -A`
3. Trocar a URL e o hash no objeto `SRI` de `finn/index.html`.
4. **Liberar `cdn.sheetjs.com` no `script-src` da CSP**, em
   `finn-serve/build.js` — sem isso o navegador bloqueia e a importação de
   planilha quebra inteira.
5. Manter o `withPrototypeGuard()` mesmo assim: custa nada e protege de CVE
   futura.
6. Testar com planilha real (há vários extratos `.xlsx` de teste) — não com
   arquivo inventado.

#### Fixar as GitHub Actions por SHA

`.github/workflows/deploy.yml` usa `actions/checkout@v4`,
`actions/setup-node@v4` e `cloudflare/wrangler-action@v3`. Tag é ponteiro
móvel: quem controlar o repositório da action pode reapontá-la, e o novo commit
roda aqui **com o `CLOUDFLARE_API_TOKEN` na mão**.

O passo a passo está comentado dentro do próprio `deploy.yml`. Resumo: pegar o
SHA completo do commit de cada release e trocar `@v4` por `@<sha>  # v4`.
Com o Dependabot ativo, ele passa a propor a atualização desses SHAs sozinho.

---

## 6. Manutenção

**Ao mexer no app:** todo dado de usuário que vira HTML passa por
`escapeHtml()`. Sem exceção.

**Ao mexer no worker:** edite `build.js`, nunca `index.js`.

**Ao adicionar rota autorizada:** a verificação vai no servidor. Esconder o
botão no app não protege nada.

**Antes de subir:** rode o app no navegador e clique nas telas afetadas. A
análise estática não pega tudo — um botão travado para sempre por chamar uma
função inexistente passou por revisão de código e só apareceu no clique.

**Ao tocar em importação de arquivo:** teste com extrato real, não com exemplo
inventado. O formato de banco só se revela no arquivo de verdade.
