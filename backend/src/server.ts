import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sendSuccess } from './utils/response.js';

const app = express();

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS — Explicit Allowlist (never use origin: true in production) ─────────
const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (curl, mobile apps, Postman) and listed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin '${origin}' is not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ─── HTTP Logging (suppress in test) ─────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

import { apiLimiter } from './middleware/rateLimit.js';

// Apply general limiter to all API routes
app.use('/api', apiLimiter);

// ─── Health & Readiness Checks ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  return sendSuccess(res, 'Leimarembi Foundation API service is online', {
    status: 'ONLINE',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health-check', (req, res) => {
  return sendSuccess(res, 'Leimarembi Foundation API service is online and healthy', {
    status: 'ONLINE',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/readiness', async (req, res) => {
  try {
    const { prisma } = await import('./utils/prisma.js');
    await prisma.$queryRaw`SELECT 1`;
    return sendSuccess(res, 'Application and database are ready', {
      status: 'READY',
      database: 'CONNECTED',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(503).json({
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Database readiness check failed',
      },
    });
  }
});

// ─── Primary API Routes ───────────────────────────────────────────────────────
app.use('/api', apiRoutes);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Startup ──────────────────────────────────────────────────────────────────
const PORT = Number(env.PORT) || 5000;

if (env.JWT_SECRET === 'DEV_ONLY_INSECURE_SECRET_REPLACE_IN_PRODUCTION') {
  console.warn('\n⚠️  WARNING: Using insecure dev JWT_SECRET. Set JWT_SECRET in .env for production!\n');
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Leimarembi Foundation API Server — port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health-check`);
    console.log(`🔒 CORS origins: ${allowedOrigins.join(', ')}`);
    console.log(`⚡ Rate limit: ${env.RATE_LIMIT_AUTH_MAX} auth / ${env.RATE_LIMIT_API_MAX} API per ${env.RATE_LIMIT_WINDOW_MS / 60000} min`);
    console.log(`====================================================`);
  });
}

export default app;

