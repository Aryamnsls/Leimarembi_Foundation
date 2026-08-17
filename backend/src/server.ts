import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sendSuccess } from './utils/response.js';

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health Check Endpoint
app.get('/api/health-check', (req, res) => {
  return sendSuccess(res, 'Leimarembi Foundation API service is online and healthy', {
    status: 'ONLINE',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Primary API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = Number(env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Leimarembi Foundation API Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health-check`);
  console.log(`====================================================`);
});

export default app;
