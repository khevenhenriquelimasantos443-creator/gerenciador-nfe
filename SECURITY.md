# Política de Segurança — Finn

O Finn lida com dados financeiros pessoais. Levamos relatos de segurança a sério
e agradecemos quem reporta falhas de forma responsável.

## Como reportar uma vulnerabilidade

**Não abra uma issue pública** para falhas de segurança. Uma issue pública expõe
o problema para qualquer pessoa antes que exista correção.

Use um destes canais privados:

1. **GitHub Security Advisories** (preferido) — aba **Security** deste repositório →
   *Report a vulnerability*. O relato fica visível apenas para quem mantém o projeto.
2. **E-mail** — finn.controle01@gmail.com, com o assunto começando por `[SEGURANÇA]`.

### O que incluir no relato

- Descrição da falha e qual o impacto (o que um atacante consegue fazer).
- Passos para reproduzir, ou uma prova de conceito.
- Endpoint / tela / arquivo afetado, se souber.
- Seu nome ou apelido, caso queira ser creditado na correção.

### O que esperar

- **Confirmação de recebimento:** até 72 horas.
- **Avaliação inicial de severidade:** até 7 dias.
- **Correção:** falhas críticas (acesso a dados de outra pessoa, roubo de sessão,
  acesso administrativo) são priorizadas e corrigidas o mais rápido possível.
- Você recebe aviso quando a correção subir para produção, e é creditado se quiser.

## Escopo

Está no escopo deste projeto:

- A aplicação web em `finn.dev.br` (código em `finn/` e `finn-serve/`).
- O bot de WhatsApp/Telegram (código em `finn-worker/`).
- As políticas de acesso ao banco de dados (`supabase/*.sql`).

Está **fora** do escopo:

- Vulnerabilidades em serviços de terceiros (Supabase, Cloudflare, Meta/WhatsApp,
  Telegram, Mercado Pago) — reporte diretamente a eles.
- Ataques que exigem acesso físico ao dispositivo da vítima ou engenharia social.
- Relatórios automatizados de scanner sem impacto demonstrável.

## Por favor, não

- Não acesse, modifique nem exfiltre dados de outras pessoas. Se uma falha der esse
  acesso, pare, e descreva a falha em vez de explorá-la.
- Não faça testes de negação de serviço (DoS) nem envie carga automatizada em volume
  contra a produção.
- Não divulgue publicamente antes da correção estar no ar.

Agindo dentro dessas regras, consideramos sua pesquisa autorizada e de boa-fé, e não
tomaremos medidas contra você.
