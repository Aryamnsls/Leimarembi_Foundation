# LFDGCDP — PostgreSQL Database Migration Strategy

**Current Engine**: SQLite (`file:./dev.db`)  
**Target Production Engine**: PostgreSQL v16+ (AWS RDS / Supabase / Render PostgreSQL)

---

## 1. Migration Rationale

While SQLite is lightweight for local testing, production requirements for an enterprise foundation platform require:
- **Concurrent Write Operations**: Financial transactions, audit logging, and public registrations require row-level locking.
- **Connection Pooling**: PgBouncer / Prisma Accelerate support.
- **Robust Backup & PITR**: Point-in-Time Recovery for financial audit compliance.

---

## 2. Schema Translation Matrix

| SQLite Construct | PostgreSQL Equivalent | Notes |
| :--- | :--- | :--- |
| `provider = "sqlite"` | `provider = "postgresql"` | In `schema.prisma` |
| `@default(uuid())` | `@default(uuid())` or `@default(dbgenerated("gen_random_uuid()"))` | Fully supported by Prisma |
| `DateTime` | `TIMESTAMP WITH TIME ZONE` | PostgreSQL preserves UTC offsets |
| `Float` | `DOUBLE PRECISION` or `DECIMAL(12, 2)` | Recommended `DECIMAL(12, 2)` for currency |
| `Boolean` | `BOOLEAN` | Native PostgreSQL boolean |
| `String` | `VARCHAR` / `TEXT` | Prisma maps appropriately |

---

## 3. Step-by-Step Migration Process

### Step 1: Update Environment & Prisma Datasource
In `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
In `backend/.env`:
```env
DATABASE_URL="postgresql://lfdgcdp_user:SecurePassword2026!@localhost:5432/lfdgcdp_prod?schema=public"
```

### Step 2: Generate Migration SQL
```bash
npx prisma migrate dev --name init_postgresql
```

### Step 3: Data Export / Import (pgloader)
Use `pgloader` for zero-loss automated data transfer from SQLite to PostgreSQL:
```bash
pgloader sqlite:///path/to/backend/prisma/dev.db postgresql://lfdgcdp_user:Password@localhost:5432/lfdgcdp_prod
```

### Step 4: Verification & Seed Validation
```bash
npx prisma db seed
npm test
```

---

## 4. Rollback Plan

If PostgreSQL deployment fails:
1. Revert `datasource provider` in `schema.prisma` back to `"sqlite"`.
2. Restore SQLite file backup `dev.db.bak`.
3. Restart Express backend server.
