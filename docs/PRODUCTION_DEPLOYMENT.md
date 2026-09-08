# LFDGCDP — Production Deployment Architecture & Guide

**Target Architecture**: Next.js Frontend (Vercel / Cloudflare Pages) + Express API Backend (Render / Railway / AWS ECS) + PostgreSQL Database (Supabase / AWS RDS)

---

## 1. System Topology Diagram

```mermaid
graph LR
    User[Client Browser / Mobile] --> Cloudflare[Cloudflare CDN & WAF]
    Cloudflare --> Frontend[Next.js Frontend Website]
    Cloudflare --> Backend[Express Node.js API Backend]
    Backend --> DB[(PostgreSQL Database)]
    Backend --> S3[Cloudflare R2 / S3 File Storage]
```

---

## 2. Mandatory Environment Variables

### Backend (`backend/.env`)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL="postgresql://user:password@db-host:5432/lfdgcdp?sslmode=require"
JWT_SECRET="GENERATE_64_CHAR_RANDOM_HEX_SECRET_KEY"
JWT_EXPIRES_IN="7d"
CORS_ORIGINS="https://leimarembifoundation.org,https://www.leimarembifoundation.org"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_API_MAX=100
RATE_LIMIT_AUTH_MAX=5
WEBHOOK_SECRET="RAZORPAY_WEBHOOK_SIGNING_SECRET"
```

### Frontend (`website/.env`)
```env
NEXT_PUBLIC_API_URL="https://api.leimarembifoundation.org/api"
```

---

## 3. Build & Launch Process

### Backend Deployment Commands
```bash
cd backend
npm install --production=false
npx prisma generate
npx tsc
npm prune --production
npm start
```

### Frontend Deployment Commands
```bash
cd website
npm install
npm run build
npm start
```

---

## 4. SSL/TLS & Domain Configuration

- Primary Domain: `leimarembifoundation.org`
- API Domain: `api.leimarembifoundation.org`
- Full Strict SSL/TLS enabled via Cloudflare.
- HSTS enabled with 1-year max-age.
