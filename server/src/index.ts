import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import extractRoutes from './routes/extract.routes.js';
import opportunityRoutes from './routes/opportunity.routes.js';
import statsRoutes from './routes/stats.routes.js';
import notificationRoutes, { settingsRouter } from './routes/notification.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { startDeadlineMonitor } from './jobs/deadlineMonitor.js';
import { env } from './config/env.js';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8' });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8' });
const extractionLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 60, standardHeaders: 'draft-8' });

app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/extract', extractionLimiter, extractRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRouter);

app.use(errorHandler);

startDeadlineMonitor();

app.listen(env.port, () => {
  console.log(`OpportunityVault API running on http://localhost:${env.port}`);
});

export default app;
