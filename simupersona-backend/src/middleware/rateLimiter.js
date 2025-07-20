const rateLimit = require('express-rate-limit');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiter for AI chat endpoints
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 chat requests per minute
  message: {
    success: false,
    error: 'Too many chat requests, please wait before sending another message.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for persona creation/updates
const personaLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Limit each IP to 20 persona operations per 5 minutes
  message: {
    success: false,
    error: 'Too many persona operations, please wait before creating or updating personas.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for testing AI connections
const testLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 test requests per minute
  message: {
    success: false,
    error: 'Too many test requests, please wait before testing again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  chatLimiter,
  personaLimiter,
  testLimiter
};
