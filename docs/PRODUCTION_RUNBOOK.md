# LFDGCDP — Production Runbook & Operations Manual

**Platform:** Leimarembi Foundation Digital Governance & Community Development Platform  
**Target Architecture:** Cloudflare → Next.js Frontend → Express API → Managed PostgreSQL (Supabase/Neon/RDS) + Cloudflare R2  

---

## 1. Environment Configuration

Ensure production environment variables are configured in the deployment platform (e.g. Vercel, Railway, Render, VPS):

### Backend (`.env`)
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@db-host:5432/lfdgcdp?schema=public&sslmode=require
JWT_SECRET=super-secure-random-64-char-string
JWT_EXPIRES_IN=24h
CORS_ORIGINS=https://leimarembifoundation.org,https://www.leimarembifoundation.org
WEBHOOK_SECRET=razorpay-webhook-secret-string
R2_ACCOUNT_ID=cloudflare-account-id
R2_ACCESS_KEY_ID=r2-access-key-id
R2_SECRET_ACCESS_KEY=r2-secret-access-key
R2_BUCKET_NAME=lfa-production-documents
```

---

## 2. PostgreSQL Deployment & Migration

1. Set `DATABASE_URL` to point to the production PostgreSQL cluster.
2. Update `prisma/schema.prisma` datasource provider from `"sqlite"` to `"postgresql"`.
3. Apply migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Seed essential roles and permissions (without default admin passwords in production):
   ```bash
   npx prisma db seed
   ```

---

## 3. Storage Provisioning (Cloudflare R2 / AWS S3)

1. Create a private bucket in Cloudflare R2: `lfa-production-documents`.
2. Configure bucket lifecycle rules and disable public listing/read.
3. Provide R2 API credentials to the backend environment variables.

---

## 4. Disaster Recovery & Backup

1. **Daily Automated Snapshots:** Managed database provider daily backups with 30-day retention.
2. **Point-in-Time Recovery (PITR):** Enabled on PostgreSQL instance for transactional rollbacks.
3. **Manual Backup Command:**
   ```bash
   pg_dump -h $DB_HOST -U $DB_USER -d lfdgcdp -F c -b -v -f lfdgcdp_backup_$(date +%Y%m%d).dump
   ```
