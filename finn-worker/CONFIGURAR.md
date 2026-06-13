# 🦊 Finn. — Como conectar seu número ao WhatsApp Bot

O bot já está pronto. Você só precisa fazer 4 passos para ligar.

---

## ⚠️ Sobre o número de telefone

A API oficial do WhatsApp (Meta) exige que o número **não esteja** em uso no WhatsApp normal.

Você tem duas opções:

### Opção A — Número de teste (mais rápido, grátis, começa agora)
A Meta te dá um número de teste na hora. Você adiciona seu celular pessoal como destinatário de teste e conversa com o bot pelo seu WhatsApp normal. **Essa é a opção recomendada para começar.**

### Opção B — Seu próprio número como remetente
Você pode usar um número que ainda não esteja no WhatsApp (ex: um chip novo). Precisa passar pela verificação de negócio da Meta (demora alguns dias).

---

## ✅ PASSO 1 — Criar app no Meta Developer

1. Acesse **developers.facebook.com** e faça login com sua conta Facebook
2. Clique em **"Meus Apps"** → **"Criar app"**
3. Escolha **"Business"** como tipo
4. Dê um nome (ex: "Finn Finance Bot") e clique em **Criar**
5. No painel do app, role até **"WhatsApp"** e clique em **"Configurar"**
6. Você vai cair na tela do WhatsApp Business Platform

---

## ✅ PASSO 2 — Pegar as credenciais

Na tela do WhatsApp → **Início da API**:

- **Phone Number ID**: número longo que aparece em "From" (ex: `123456789012345`)  
  → Guarde esse número

- **Token de Acesso Temporário**: clique em "Gerar token" ou copie o que aparece  
  → Guarde esse token (começa com `EAA...`)

> O token temporário dura 24h. Para produção, você vai precisar de um token permanente  
> (Menu → Tokens de Acesso → Criar token permanente)

**Para adicionar seu celular como destinatário de teste:**  
→ Na mesma tela, em "Para", clique em **"Adicionar número"** e coloque o seu celular (com +55)

---

## ✅ PASSO 3 — Criar KV no Cloudflare

1. Acesse **dash.cloudflare.com**
2. Menu lateral: **Workers & Pages** → **KV**
3. Clique em **"Create namespace"**
4. Nome: `finn-kv`
5. Copie o **Namespace ID** que aparece
6. Cole no `wrangler.toml` no lugar de `COLE_AQUI_O_ID_DO_KV_NAMESPACE`

---

## ✅ PASSO 4 — Deploy do Worker

Abra o terminal na pasta `finn-worker/` e execute:

```bash
# Instale o Wrangler (se não tiver)
npm install -g wrangler

# Faça login na Cloudflare
wrangler login

# Adicione os segredos (um por vez, o terminal vai pedir para digitar o valor)
wrangler secret put WHATSAPP_PHONE_NUMBER_ID
# cole o Phone Number ID do passo 2

wrangler secret put WHATSAPP_ACCESS_TOKEN
# cole o token que começa com EAA...

wrangler secret put WHATSAPP_VERIFY_TOKEN
# digite qualquer senha, ex: finn_bot_2024

# Faça o deploy
wrangler deploy
```

Após o deploy, o terminal vai mostrar a URL do Worker:  
`https://finn-whatsapp-worker.SEU-USUARIO.workers.dev`

**Guarde essa URL — você vai precisar no próximo passo!**

---

## ✅ PASSO 5 — Configurar o Webhook no Meta

1. Volte ao Meta Developer → seu app → **WhatsApp → Configuração**
2. Na seção **"Webhook"**, clique em **"Configurar"**
3. Preencha:
   - **URL do callback**: `https://finn-whatsapp-worker.SEU-USUARIO.workers.dev/webhook`
   - **Token de verificação**: o mesmo que você definiu em `WHATSAPP_VERIFY_TOKEN` (ex: `finn_bot_2024`)
4. Clique em **"Verificar e salvar"**
5. Na lista de campos, **assine** (marque) **"messages"**

---

## 🧪 Teste Final

Abra o WhatsApp no seu celular e mande uma mensagem para o número de teste da Meta (aparece na tela do Developer):

```
oi
```

O bot deve responder com o menu principal em alguns segundos. Se não responder, veja os logs:

```bash
wrangler tail
```

---

## 🆘 Problemas comuns

| Erro | Solução |
|------|---------|
| Webhook não verificou | Confirme que o `WHATSAPP_VERIFY_TOKEN` é idêntico ao campo do Meta |
| Bot não responde | Verifique se "messages" está subscrito no Webhook |
| Token expirou | Gere um novo token permanente no Meta |
| KV não funciona | Confirme que o ID do KV está correto no wrangler.toml |

---

## 📞 Dúvidas?

Se travar em algum passo, me manda uma mensagem dizendo **em qual passo** você está e **o que apareceu na tela** — consigo te ajudar a resolver.
