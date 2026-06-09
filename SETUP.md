# 🚀 Setup do ERP Faturador

## Pré-requisitos

- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- npm ou yarn

## 1. Instalar PostgreSQL

### Windows/Mac/Linux
Baixe em: https://www.postgresql.org/download/

### Ou use Docker (mais rápido)
```bash
docker run -d \
  --name erp-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=erp_db \
  -p 5432:5432 \
  postgres:15-alpine
```

## 2. Clonar o Repositório

```bash
cd /caminho/para/seu/projeto
git clone <seu-repo>
cd gerenciador-nfe
```

## 3. Instalar Dependências

### Backend
```bash
cd erp-server
npm install
cp .env.example .env
```

**Editar `.erp-server/.env` com seus dados:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=erp_db
COMPANY_CNPJ=39.830.505/0001-19
COMPANY_NAME=BEM BARATO COMÉRCIO DE VARIEDADES LTDA
```

### UI
```bash
cd ../erp-ui
npm install
```

## 4. Inicializar Banco de Dados

```bash
# Terminal 1 - Backend
cd erp-server

# Criar banco (se não existir)
psql -U postgres -c "CREATE DATABASE erp_db;"

# Rodar migrações (cria tabelas)
npm run dev
# Ou se preferir manualmente:
npm run migrate:latest
```

## 5. Rodar o Projeto

### Terminal 1 - Backend
```bash
cd erp-server
npm run dev
# Servidor rodará em http://localhost:3000
```

### Terminal 2 - UI (Web)
```bash
cd erp-ui
npm run dev
# Abrirá em http://localhost:3000 (React dev server)
```

## Próximas Features

- [ ] Integração com SEFAZ (assinatura digital)
- [ ] Exportação de NF-e em PDF
- [ ] Relatórios financeiros
- [ ] Sistema de usuários e autenticação
- [ ] Multi-empresa
- [ ] Integração com bancos

## Troubleshooting

### PostgreSQL não conecta
```bash
# Testar conexão
psql -U postgres -h localhost -d erp_db

# Se não funcionar, resetar password:
# Windows: C:\Program Files\PostgreSQL\14\bin\psql.exe
# Mac: /Library/PostgreSQL/14/bin/psql
# Linux: psql

# Mudar senha postgres
psql -U postgres
ALTER USER postgres WITH PASSWORD 'postgres';
```

### Porta 5432 já em uso
```bash
# Mudar em .env para outra porta
DB_PORT=5433
```

### Dependências faltando
```bash
cd erp-server
npm install
cd ../erp-ui
npm install
```

## Suporte

Para problemas ou dúvidas, verifique os logs do servidor em:
- Backend: http://localhost:3000/api/health
- UI: Console do navegador (F12)

---

**BEM BARATO COMÉRCIO** - Sistema de Faturamento v1.0
