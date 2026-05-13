import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import consultationRouter from './routes/consultation';
import reportRouter from './routes/report';
import authRouter from './routes/auth';

const app = express();
const PORT = process.env.PORT ?? 5000;

// Connect to Database
connectDB();

app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:3000',
      /^https:\/\/nana-.*\.vercel\.app$/,
    ];
    if (!origin || allowed.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/consultations', consultationRouter);
app.use('/api/report', reportRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Global Error]', err.stack);
  res.status(500).json({ error: err.message ?? 'Internal server error' });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏥 Health Assistant Backend running on http://localhost:${PORT}`);
});

export default app;
