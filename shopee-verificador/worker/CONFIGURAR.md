# 🌐 Seu site do Painel Shopee — como colocar no ar (10 minutos)

Depois de configurado, funciona assim:

```
[Extensão no Chrome] --envia cada varredura--> [Worker Cloudflare] <--acessa de qualquer lugar-- [Você, pelo celular/PC]
```

O Worker é **site e banco de dados ao mesmo tempo**: a URL dele É o seu painel.
Sem custo — o plano grátis da Cloudflare aguenta isso com folga.

---

## ✅ PASSO 1 — Criar o banco (KV)

1. Acesse **dash.cloudflare.com** (mesma conta que você já usa)
2. Menu lateral: **Storage & Databases** → **KV**
3. Clique em **"Create namespace"**, nome: `shopee-kv`
4. Pronto — guarde essa aba aberta

## ✅ PASSO 2 — Criar o Worker

1. Menu lateral: **Workers & Pages** → **"Create"** → **"Create Worker"**
2. Nome: `shopee-painel` (a URL vai ficar `https://shopee-painel.SEUUSUARIO.workers.dev`)
3. Clique em **Deploy** (com o código de exemplo mesmo)
4. Clique em **"Edit code"**, apague tudo e **cole o conteúdo inteiro do arquivo `index.js`** desta pasta
5. Clique em **Deploy** de novo

## ✅ PASSO 3 — Ligar o banco e criar a senha

No painel do Worker → **Settings**:

1. **Bindings** → **Add** → **KV Namespace**
   - Variable name: `SHOPEE_KV`
   - KV namespace: `shopee-kv`
2. **Variables and Secrets** → **Add**
   - Type: **Secret**
   - Name: `SYNC_TOKEN`
   - Value: crie uma senha forte (ex.: `shopee_kheven_2026_x9k2`) — **anote ela!**
3. Clique em **Deploy** se pedir

## ✅ PASSO 4 — Conectar a extensão

1. Abra o Seller Center → clique na extensão
2. Abra **"🌐 Enviar para meu site"**
3. Cole a URL do Worker (ex.: `https://shopee-painel.SEUUSUARIO.workers.dev`)
4. Cole o token (a senha do passo 3)
5. Marque **"Enviar automaticamente"**, clique em **Salvar** e depois em **Testar conexão** → deve aparecer "Conectado ✓"
6. Rode uma varredura — no final aparece "🌐 Site atualizado ✓"

## ✅ PASSO 5 — Acessar o site

- Do popup: botão **"🌐 Meu site"** (já entra logado)
- De qualquer aparelho: abra a URL do Worker e cole o token uma vez
- No celular: abra no navegador → menu → **"Adicionar à tela inicial"** — vira um "app"

---

## ❓ Dúvidas rápidas

| Pergunta | Resposta |
|---|---|
| Quem consegue ver meus dados? | Só quem tiver o token. A página em si não mostra nada sem ele. |
| O site atualiza sozinho? | Sim: a cada varredura da extensão, e a página aberta se atualiza a cada 5 min (ou no botão ↻). |
| Quanto custa? | Nada. Plano grátis: 100 mil leituras/dia de KV — você usa um punhado. |
| Mudei o código do painel, e agora? | Rode `python3 build.py` nesta pasta e cole o novo `index.js` no Cloudflare. |
| Esqueci o token | Crie outro em Settings → Variables do Worker e atualize na extensão e no site. |
