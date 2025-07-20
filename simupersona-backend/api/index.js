// Vercel serverless function entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const routes = require('../src/routes');
const { errorHandler, notFound } = require('../src/middleware/errorHandler');
const { generalLimiter } = require('../src/middleware/rateLimiter');

// Create Express app
const app = express();

// Trust proxy (important for rate limiting behind reverse proxies)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration - Updated for Vercel deployment
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    /^https:\/\/.*\.vercel\.app$/,
    /^https:\/\/simupersona-frontend.*\.vercel\.app$/
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Request logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SimuPersona API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Export the Express app for Vercel
module.exports = app;
