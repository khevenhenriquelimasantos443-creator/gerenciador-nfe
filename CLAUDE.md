# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ERP Faturador Empresarial** - A robust, production-grade billing and invoicing system for high-volume operations.

### Requirements
- **Scale**: 500,000+ orders/month (~7 orders/sec peak)
- **Users**: 15 concurrent users with role-based access
- **Platform**: Desktop application (Electron)
- **Core Feature**: Order → Invoice (NF-e) automated workflow
- **Critical**: Zero data loss, multi-user sync, real-time consistency

## Architecture

### Stack
- **Backend**: Node.js + Express + TypeScript
- **Desktop UI**: Electron + React + TypeScript
- **Database**: PostgreSQL (optimized for high throughput)
- **NF-e Integration**: XML generation + SEFAZ communication
- **State Management**: Redux (client) + PostgreSQL (server)

### Project Structure
```
/erp-server/                 # Backend (Electron main process + REST API)
  ├── src/
  │   ├── database/          # PostgreSQL schema, migrations, connection pools
  │   ├── models/            # Data layer (Customers, Orders, Invoices, Products)
  │   ├── controllers/       # Business logic (order creation, invoice generation)
  │   ├── routes/            # REST API endpoints
  │   ├── services/          # Domain services (NF-e generation, tax calculation)
  │   ├── middleware/        # Auth, validation, error handling
  │   ├── utils/             # Helpers, formatters, validators
  │   └── index.ts           # Express server + Electron main
  ├── migrations/            # Database schema versions
  ├── package.json
  └── tsconfig.json

/erp-ui/                     # React Electron renderer
  ├── src/
  │   ├── components/        # React components (OrderForm, InvoiceList, etc)
  │   ├── pages/             # Full-page views
  │   ├── hooks/             # Custom React hooks
  │   ├── store/             # Redux store (customers, orders, user, sync)
  │   ├── services/          # IPC calls to backend, HTTP calls
  │   └── App.tsx
  ├── package.json
  └── tsconfig.json

/shared/                     # Shared types, constants (both apps depend on this)
  ├── types.ts               # TypeScript interfaces (Order, Customer, Invoice, etc)
  ├── constants.ts           # Enums, status codes, tax tables
  └── validators.ts          # Shared validation functions
```

## Key Design Decisions

### Database Schema
- **Partitioned by month** for Orders (500k/month throughput)
- **Connection pooling** (PgBouncer or built-in) to handle 15 concurrent users
- **Foreign keys + indexes** on frequently queried columns (customer_id, status, created_at)
- **Audit table** for compliance and debugging (who created/modified what, when)

### Multi-User Sync
- **Optimistic locking** (version field on mutable entities) prevents conflicts
- **WebSocket** for real-time order status updates across clients
- **Conflict resolution**: Server wins (last-write-wins for orders, merge for inventory)

### NF-e Generation
- **Background queue** (Bull or Node job queue) to prevent UI blocking
- **Async status updates** sent via WebSocket to all clients
- **Retry logic** for SEFAZ communication failures
- **Stored as XML** in database for audit trail

### Performance Considerations
- **Batch inserts** for bulk operations (import CSV, etc)
- **Caching** of product catalog in client (invalidate on change)
- **Pagination** (cursor-based for orders) — no skip/limit beyond 10k rows
- **Computed fields** (totals, taxes) calculated at insert time, not query time

## Common Commands

### Development Setup
```bash
# Install dependencies
cd erp-server && npm install && cd ..
cd erp-ui && npm install && cd ..

# Configure environment
cp erp-server/.env.example erp-server/.env
# Edit erp-server/.env with your database credentials

# Initialize PostgreSQL (if needed)
createdb erp_db  # or docker run ... postgres:15

# Start development mode (two terminals)
# Terminal 1: Backend
cd erp-server && npm run dev    # Runs on http://localhost:3000/api

# Terminal 2: Frontend
cd erp-ui && npm run dev        # Runs on http://localhost:3000 (React)

# Build for production
npm run --prefix erp-server build
npm run --prefix erp-ui build
npm run package                 # Create Electron app
```

### Database
```bash
# Fresh database (local development only)
npm run --prefix erp-server migrate:reset

# Create migration
npm run --prefix erp-server migrate:create <name>

# Current schema
npm run --prefix erp-server migrate:status
```

### Testing
```bash
# Backend unit tests
npm run --prefix erp-server test

# Run single test file
npm run --prefix erp-server test -- src/services/nfe.test.ts

# E2E tests (full Electron app)
npm run --prefix erp-ui test:e2e
```

## Critical Paths (Do Not Refactor Without Approval)

1. **Order creation to NF-e generation** (`/erp-server/src/controllers/orders.ts` → `/services/nfe.ts`)
   - Calculates taxes, validates CNPJ, queues async job, updates status
   - Multi-user conflict possible; optimistic locking required

2. **Database connection pooling** (`/erp-server/src/database/connection.ts`)
   - Handles 15 concurrent users; misconfiguration causes deadlocks
   - Do not change pool size without load testing

3. **Redux sync state** (`/erp-ui/src/store/syncSlice.ts`)
   - Tracks order/invoice state per client; conflicts with server state if out-of-sync
   - WebSocket message order must be preserved (use channels)

## Known Limitations & Debt

- NF-e SEFAZ contingency mode (paper backup) not yet implemented
- Multi-company support (single company hardcoded)
- Inventory forecasting not included in MVP
- No API for third-party integrations yet

## Notes for Future Development

- **Auth**: Implement SSO (LDAP/AD) for enterprise when needed; currently username/password
- **Reporting**: Heavy reports (annual summaries) should run async, not block UI
- **Mobile**: Electron Desktop first; React Native app deferred to Phase 2
- **Scaling**: If order volume exceeds 1M/month, consider read replicas + Redis cache layer
