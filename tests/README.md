# Testes

Rode da raiz do repositório:

    npm install --no-save playwright
    node tests/smoke.mjs      # app: todas as telas + features de engajamento + modo admin
    node tests/backend.mjs    # worker + bot: sync, IDOR, fluxo de categoria, analytics, erros
    node tests/instagram.mjs  # cron dos posts e stories: prioridade da fila, idempotência
    node tests/whatsapp-template.mjs  # GET /whatsapp/templates: gate de admin, veredito, CORS
    node tests/layout-mobile.mjs      # nada pode vazar do card num celular de 360px
    node tests/sheets-sync.mjs        # planilha: token, pull/push, compra única, link de cópia
    node tests/aprender.mjs           # trilhas e progresso das lições no Supabase
    node tests/importar.mjs           # extrato de banco: CSV/OFX/XLSX, sinais e categorias
    node tests/portugues.mjs          # erros de português nos textos que o usuário lê

`smoke.mjs` precisa de um Chromium. Em ambiente sem ele instalado, ajuste
`executablePath` ou remova a opção pra usar o que o Playwright baixar.

## Por que estes arquivos existem aqui e não num diretório temporário

A suíte já foi perdida três vezes por viver num scratchpad efêmero que some
quando o container reinicia. Teste que não está versionado não protege nada.
