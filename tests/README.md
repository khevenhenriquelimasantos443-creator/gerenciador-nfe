# Testes

Rode da raiz do repositório:

    npm install --no-save playwright
    node tests/smoke.mjs      # app: todas as telas + features de engajamento + modo admin
    node tests/backend.mjs    # worker + bot: sync, IDOR, fluxo de categoria, analytics, erros

`smoke.mjs` precisa de um Chromium. Em ambiente sem ele instalado, ajuste
`executablePath` ou remova a opção pra usar o que o Playwright baixar.

## Por que estes arquivos existem aqui e não num diretório temporário

A suíte já foi perdida três vezes por viver num scratchpad efêmero que some
quando o container reinicia. Teste que não está versionado não protege nada.
