import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import net from 'node:net';
import { connectDatabase } from './config/database.js';
import { authRouter } from './routes/authRoutes.js';
import { sessionRouter } from './routes/sessionRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = new Set(
  Array.from({ length: 11 }, (_, index) => 3000 + index).flatMap((port) => [
    `http://localhost:${port}`,
    `http://127.0.0.1:${port}`
  ])
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed: ${origin}`));
    }
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'revealu-auth-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/sessions', sessionRouter);

app.use((error, _req, res, _next) => {
  res.status(500).json({ message: error.message || 'Server error.' });
});

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

if (await isPortInUse(PORT)) {
  console.log(`Backend already running on http://localhost:${PORT}`);
} else {
  connectDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`RevealU auth API running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start backend:', error.message);
      process.exit(1);
    });
}

function isPortInUse(port) {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once('error', (error) => {
        resolve(error.code === 'EADDRINUSE');
      })
      .once('listening', () => {
        tester.close(() => resolve(false));
      })
      .listen(port);
  });
}
