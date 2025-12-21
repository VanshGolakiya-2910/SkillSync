import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'

import { globalErrorHandler } from './middleware/error.middleware.js'

import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import projectRouter from './routes/project.routes.js'
import mediaRouter from './routes/media.routes.js'
import socialRouter from './routes/social.routes.js'
import searchRouter from './routes/search.routes.js'


const app = express();

// ───────────────────────────────
// Middleware
// ───────────────────────────────
app.use(
  cors({
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cookieParser());

// Logger only in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ───────────────────────────────
// Health check
// ───────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running smoothly 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// ───────────────────────────────
// Routes
// ───────────────────────────────
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/media', mediaRouter)
app.use('/api/v1/project', projectRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/search', searchRouter)
app.use('/api/v1/social' , socialRouter)


// ───────────────────────────────
// Global Error Handler (must be last)
// ───────────────────────────────
app.use(globalErrorHandler);
// ───────────────────────────────
export default app;
