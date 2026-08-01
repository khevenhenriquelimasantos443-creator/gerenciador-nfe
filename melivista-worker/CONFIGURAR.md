# 🔐 MeliVista — Como ligar (Mercado Livre + Mercado Pago)

O app é **somente leitura**. Ele consolida em um lugar só: métricas de Flex,
dados do Full e a reconciliação de vendas com desconto de afiliados.

Antes de qualquer código, o princípio: **a aplicação só pode fazer o que for
explicitamente autorizado**. Nenhum escopo de escrita, nenhuma ação em nome da
conta, nenhum acesso a e-mail ou anúncios.

---

## Como as peças se encaixam

```
navegador (melivista/index.html)
   │  cookie de sessão HttpOnly — nenhum token aqui
   ▼
Cloudflare Worker (melivista-worker)
   │  client_secret + tokens (AES-GCM no KV)
   ▼
api.mercadolibre.com  /  api.mercadopago.com
```

O navegador **nunca** recebe `access_token` nem `refresh_token`. Se alguém abrir
o DevTools no seu app, não há credencial para copiar.

---

## ✅ PASSO 1 — Criar a aplicação com escopo de leitura

**Mercado Livre** → https://developers.mercadolivre.com.br → *Suas aplicações* →
*Criar aplicação*.

1. **URI de redirect**: `https://melivista-worker.SEU-USUARIO.workers.dev/auth/callback`
   (você ajusta depois do PASSO 4, quando souber a URL real)
2. Em **Escopos**, marque **apenas leitura** (`read`) e **offline_access**.
   Deixe `write` desmarcado. Isso é o que torna a escrita impossível — não é
   uma regra do nosso código, é o token que sai limitado da origem.
3. Guarde **App ID** (client_id) e **Chave secreta** (client_secret).

**Mercado Pago** → https://www.mercadopago.com.br/developers → *Suas integrações*.
Mesma coisa: redirect apontando para `/auth/callback`, escopo de leitura +
`offline_access`, e guarde as credenciais.

> `offline_access` é o que permite renovar o token pelo `refresh_token` sem
> pedir nova interação. O access_token do Mercado Pago dura 180 dias.

---

## ✅ PASSO 2 — Criar o KV no Cloudflare

1. **dash.cloudflare.com** → **Workers & Pages** → **KV**
2. **Create namespace**, nome: `melivista-kv`
3. Copie o **Namespace ID** e cole no `wrangler.toml`, no lugar de
   `COLE_AQUI_O_ID_DO_KV_NAMESPACE`

O KV guarda três coisas: sessões, tokens criptografados e o log de auditoria.

---

## ✅ PASSO 3 — Gerar as chaves do cofre

No terminal:

```bash
# Assina o cookie de sessão e o state do OAuth
openssl rand -base64 48

# Criptografa os tokens em repouso (precisa ter 32 bytes, em base64url)
openssl rand -base64 32 | tr '+/' '-_' | tr -d '='
```

Guarde as duas saídas — vão virar `SESSION_SECRET` e `TOKEN_KEY` no próximo passo.
**Não coloque nenhuma das duas em arquivo do repositório.**

---

## ✅ PASSO 4 — Deploy do Worker

Na pasta `melivista-worker/`:

```bash
npm install -g wrangler      # se ainda não tiver
wrangler login

# Segredos — o terminal pede o valor de cada um
wrangler secret put ML_CLIENT_ID
wrangler secret put ML_CLIENT_SECRET
wrangler secret put MP_CLIENT_ID
wrangler secret put MP_CLIENT_SECRET
wrangler secret put SESSION_SECRET     # a saída do primeiro openssl
wrangler secret put TOKEN_KEY          # a saída do segundo openssl

wrangler deploy
```

O deploy imprime a URL:
`https://melivista-worker.SEU-USUARIO.workers.dev`

**Volte no PASSO 1** e coloque essa URL + `/auth/callback` como redirect nas duas
aplicações (ML e MP). O redirect precisa bater exatamente, incluindo `https://`.

---

## ✅ PASSO 5 — Apontar o app para o Worker

1. Abra o `melivista/` no navegador
2. Aba **Contas** → campo **URL do Worker** → cole a URL do PASSO 4 → **Salvar e testar**
3. Clique em **Conectar Mercado Livre**. Na tela de autorização, **confira o
   escopo exibido antes de aceitar** — deve falar em leitura, não em escrita
4. Repita em **Conectar Mercado Pago**

Se quiser só conhecer as telas antes de conectar qualquer coisa, use o
**modo demonstração** — os números são fictícios e nenhuma chamada real é feita.

Ajuste também `ALLOWED_ORIGINS` no `wrangler.toml` para o domínio onde o app está
publicado. Origem fora da lista recebe `403`; curinga `*` não é aceito.

---

## ✅ PASSO 6 — Testar a revogação (não pule)

Este é o teste que prova que você mantém o controle:

1. Conecte a conta e confirme que o app carrega dados
2. Vá em https://www.mercadolivre.com.br/permissoes → **Administrar Permissões**
3. Revogue o acesso da aplicação
4. Volte no app e atualize — as chamadas devem falhar

Revogar **não mexe na senha** da conta. E o Mercado Livre revoga sozinho depois
de **4 meses sem chamadas à API**.

---

## O que está travado no código

| Controle | Onde | O que faz |
|---|---|---|
| Escopo mínimo | `SCOPES` | Só pede `offline_access read` |
| Allowlist de rota | `ML_ALLOWED` / `MP_ALLOWED` | Só GET, só nos caminhos listados. Qualquer outro → `403` |
| Método travado | `handleProxy` | O fetch upstream é sempre `GET`, não repassa o método do cliente |
| Cofre | `sealTokens` / `openTokens` | Tokens em AES-GCM no KV; chave em secret |
| Sessão | `mv_sid` | Cookie opaco `HttpOnly · Secure · SameSite=Lax`, assinado por HMAC |
| Anti-CSRF | `state` + `X-MV-Request` | State de uso único no OAuth, header obrigatório na API |
| PKCE | `handleAuthStart` | `code_challenge` S256 no fluxo de autorização |
| CORS | `ALLOWED_ORIGINS` | Allowlist de origem, sem curinga |
| Rate limit | `rateLimit` | 120 chamadas/min por sessão, 10 autorizações/5min por IP |
| Auditoria | `audit` | Data, endpoint, conta e status — inclusive das bloqueadas |

**Para liberar um endpoint novo**, adicione a regex na allowlist. É proposital que
isso exija um commit: cada endpoint novo aparece no diff e passa por revisão.

---

## 🆘 Problemas comuns

| Erro | Solução |
|---|---|
| `origin_not_allowed` | Domínio do app não está em `ALLOWED_ORIGINS` (sem barra no fim) |
| `state_invalido` / `state_expirado` | Autorização demorou mais de 10 min, ou o cookie foi bloqueado. Comece de novo |
| `endpoint_nao_permitido` | O caminho não está na allowlist — é o comportamento esperado |
| `missing_secret:TOKEN_KEY` | Faltou um `wrangler secret put` |
| `TOKEN_KEY deve ter 32 bytes` | Gere de novo com o comando do PASSO 3 |
| `conta_nao_conectada` | A conta foi revogada ou a sessão expirou (7 dias). Reconecte |
| `rate_limited` | Passou do limite. Espere a janela virar |

---

## Limites conhecidos (declarados, não escondidos)

- **Motorista na coleta ao Full** — sem endpoint público confirmado. O endpoint de
  motorista que existe (`/flex/sites/{site_id}/shipments/{id}/assignment/v1`) é da
  modalidade Flex, entrega ao comprador, não da coleta de estoque ao Full. O app
  oferece registro manual até isso ser validado com o suporte de developers.
- **Código de autorização diário** — gerado pelo vendedor no painel
  (Configurações → Preferências de venda → Códigos de autorização), sem leitura
  programática documentada. Também é registro manual.
- **Afiliados** — não existe endpoint que isole "esta venda veio de afiliado". A
  reconciliação compara líquido esperado com líquido repassado; a diferença é
  indício para conferência, não número oficial.

---

## Reportar falha de segurança

Não abra issue pública. Veja [SECURITY.md](../SECURITY.md) na raiz do repositório.
