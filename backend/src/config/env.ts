import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Fail hard in production if JWT_SECRET is not explicitly set
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('FATAL: JWT_SECRET environment variable is not set. Server cannot start in production without it.');
  process.exit(1);
}

export const env = {
  PORT: process.env.PORT || '5000',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: JWT_SECRET || 'DEV_ONLY_INSECURE_SECRET_REPLACE_IN_PRODUCTION',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  // CORS: comma-separated list of allowed origins, e.g. "http://localhost:3000,https://yourdomain.com"
  CORS_ORIGINS: process.env.CORS_ORIGINS || 'http://localhost:3000',
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_AUTH_MAX: Number(process.env.RATE_LIMIT_AUTH_MAX) || 10, // max attempts in window
  RATE_LIMIT_API_MAX: Number(process.env.RATE_LIMIT_API_MAX) || 200, // general API rate limit
  // Webhook
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || '',
  FRONTEND_URL: process.env.FRONTEND_URL || process.env.APP_URL || 'https://leimarembifoundation.org',
};
