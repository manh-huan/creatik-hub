import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Trust proxy if behind reverse proxy (Heroku, Railway, etc.)
app.set('trust proxy', 1);

// Enhanced security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // Allow embedding for development
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }),
);

// Environment-based CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? [process.env.FRONTEND_URL || 'https://your-domain.com'] : [process.env.FRONTEND_URL || 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200, // Support legacy browsers
  }),
);

// Smart logging based on environment
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Cookie parsing middleware
app.use(cookieParser());

// Body parsing middleware with security considerations
app.use(
  express.json({
    limit: process.env.JSON_LIMIT || '10mb', // Reduced from 50mb
    type: 'application/json',
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.URL_ENCODED_LIMIT || '10mb',
  }),
);

// Enhanced health check
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  };

  res.json(health);
});

// API versioning
app.use('/api/v1/auth', authRoutes);

// Fallback for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Enhanced error handling
app.use(errorHandler);

export default app;
