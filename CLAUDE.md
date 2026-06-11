# ClockIn — Regras do Projeto

## OBRIGATÓRIO: Bump de versão antes de todo commit no app ClockIn

Sempre que fizer alterações em qualquer arquivo dentro de `ponto/` (index.html, sw.js, etc.)
**DEVE** rodar o script de bump antes do commit:

```bash
bash ponto/bump.sh "Descrição curta do que mudou"
```

Depois inclui `ponto/sw.js` e `ponto/version.json` no mesmo commit.

### Exemplos de notas de versão
- "Correção no cálculo de horas extras aos sábados"
- "Novo campo de observação no lançamento manual"
- "Correção de layout no iOS Safari"

## Branch de desenvolvimento
Sempre desenvolver em: `claude/smart-timesheet-salary-n52mgm`

## Stack
- HTML/CSS/JS puro (sem build tools)
- Supabase (auth + postgres + storage)
- GitHub Pages: clock-inapp.github.io/ponto-inteligente/
