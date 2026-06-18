import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import extractRoutes from './routes/extract.routes.js';
import opportunityRoutes from './routes/opportunity.routes.js';
import statsRoutes from './routes/stats.routes.js';
import notificationRoutes, { settingsRouter } from './routes/notification.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { startDeadlineMonitor } from './jobs/deadlineMonitor.js';
import { env } from './config/env.js';

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/extract', extractRoutes);
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
