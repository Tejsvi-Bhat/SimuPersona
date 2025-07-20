const express = require('express');
const ChatController = require('../controllers/ChatController');
const { validate, chatSchema } = require('../utils/validation');
const { chatLimiter, testLimiter } = require('../middleware/rateLimiter');

const router = express.Router();
const chatController = new ChatController();

// POST /api/chat - Send a message to a persona
router.post(
  '/',
  chatLimiter,
  validate(chatSchema),
  chatController.sendMessage
);

// POST /api/chat/preview - Preview a conversation without storing
router.post(
  '/preview',
  chatLimiter,
  chatController.previewConversation
);

// POST /api/chat/starters - Generate conversation starters
router.post(
  '/starters',
  chatController.generateStarters
);

// GET /api/chat/providers - Get available AI providers
router.get(
  '/providers',
  chatController.getProviders
);

// POST /api/chat/providers/default - Set default AI provider
router.post(
  '/providers/default',
  chatController.setDefaultProvider
);

// GET /api/chat/providers/:provider/test - Test AI provider connection
router.get(
  '/providers/:provider/test',
  testLimiter,
  chatController.testProvider
);

// GET /api/chat/health - Health check for AI services
router.get(
  '/health',
  testLimiter,
  chatController.healthCheck
);

module.exports = router;
