# 🎵 Finn. — Como ligar a publicação automática no TikTok

O código já está pronto (mesma fila de conteúdo do Instagram, `finn/index.html`
→ aba **Conteúdo**, tipo "TikTok"). Falta só a parte que só você consegue
fazer: criar o app no TikTok e autorizar a conta.

---

## ✅ PASSO 1 — Criar o app no TikTok for Developers

1. Acesse **developers.tiktok.com** e faça login com a conta do TikTok do Finn
2. **Manage apps → Create an app**
3. Preencha:
   - Nome: `Finn.`
   - Categoria: Finance
   - **Privacy Policy URL**: `https://finn.dev.br/privacidade`
   - **Terms of Service URL**: `https://finn.dev.br/termos`
4. Em **Products**, adicione **"Login Kit"** e **"Content Posting API"**
5. Em **Redirect URI**, coloque exatamente: `https://finn.dev.br/tiktok/callback`
6. Em **Scopes**, marque `user.info.basic` e `video.publish`

## ✅ PASSO 2 — Testar antes da revisão sair

Em **Target users / Testers**, adicione a própria conta do TikTok do Finn
como testador. Apps recém-criados só publicam como **SELF_ONLY** (só o
próprio criador vê o vídeo) até o TikTok aprovar a revisão — isso é
esperado, não é bug. Depois que aprovar, é só trocar `TT_PRIVACY_LEVEL` (em
`finn-serve/wrangler.toml`, seção `[vars]`) de `"SELF_ONLY"` para
`"PUBLIC_TO_EVERYONE"` e fazer o deploy — não precisa mudar nenhum código.

## ✅ PASSO 3 — Configurar as secrets

O TikTok vai te dar um **Client Key** e um **Client Secret**. Não cole isso
em lugar nenhum além do terminal:

```bash
cd finn-serve
wrangler login          # se ainda não tiver feito
wrangler secret put TT_CLIENT_KEY
# cole o Client Key

wrangler secret put TT_CLIENT_SECRET
# cole o Client Secret
```

Essas duas secrets são só a **identidade do app** — ainda não autorizam
publicar em nenhuma conta.

## ✅ PASSO 4 — Autorizar a conta do TikTok

1. Depois do próximo deploy, entra no admin do Finn → aba **TikTok**
2. Clica em **"Conectar conta do TikTok"** — abre uma aba nova do TikTok
   pedindo autorização
3. Autoriza com a conta do Finn
4. Você cai numa página simples dizendo "Conectado!" — pode fechar e voltar
   pro admin

A partir daqui o `access_token`/`refresh_token` ficam guardados no Cloudflare
KV e se renovam sozinhos — não precisa repetir esse passo, a não ser que
revogue o acesso do lado do TikTok.

## 🧪 Teste Final

Ainda na aba TikTok do admin, com um vídeo já na fila (aba **Conteúdo** →
tipo "TikTok"), clica em **"Testar publicação agora"**. A resposta aparece
na tela — se der erro, o texto cru da API do TikTok vem junto, o que
normalmente já diz o que falta (escopo, conta não é Business/Creator, etc.).

## 🆘 Problemas comuns

| Erro | Solução |
|------|---------|
| "TT_CLIENT_KEY / TT_CLIENT_SECRET ainda não configurados" | Faltou o Passo 3 |
| "TikTok não conectado" ao testar publicação | Faltou o Passo 4 (autorizar) |
| Publica mas só você vê o vídeo | Normal antes da auditoria — ver Passo 2 |
| Vídeo não publica, erro da API no resultado | Confere se a conta é Business/Creator e se os escopos `user.info.basic` + `video.publish` estão marcados no app |

## 📞 Dúvidas?

Se travar em algum passo, me manda uma mensagem dizendo **em qual passo**
você está e **o que apareceu na tela** — consigo te ajudar a resolver.
