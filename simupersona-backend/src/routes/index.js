const express = require('express');
const personaRoutes = require('./personaRoutes');
const chatRoutes = require('./chatRoutes');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SimuPersona API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    success: true,
    message: 'SimuPersona API Documentation',
    endpoints: {
      personas: {
        'POST /api/persona': 'Create a new persona',
        'GET /api/persona/:id': 'Get a specific persona',
        'PUT /api/persona/:id': 'Update a persona',
        'DELETE /api/persona/:id': 'Delete a persona',
        'GET /api/persona': 'Get all personas for a user',
        'GET /api/persona/:id/starters': 'Get conversation starters',
        'POST /api/persona/:id/clone': 'Clone a persona',
        'GET /api/persona/stats/overview': 'Get persona statistics'
      },
      chat: {
        'POST /api/chat': 'Send a message to a persona',
        'POST /api/chat/preview': 'Preview conversation',
        'POST /api/chat/starters': 'Generate conversation starters',
        'GET /api/chat/providers': 'Get available AI providers',
        'POST /api/chat/providers/default': 'Set default AI provider',
        'GET /api/chat/providers/:provider/test': 'Test AI provider',
        'GET /api/chat/health': 'AI services health check'
      }
    },
    example_requests: {
      create_persona: {
        method: 'POST',
        url: '/api/persona',
        body: {
          name: 'Dr. Sarah Chen',
          tone: 'Professional yet friendly',
          profession: 'Data Scientist',
          goals: 'Help people understand complex data concepts',
          personality_traits: ['analytical', 'patient', 'curious'],
          background: 'PhD in Statistics, 10 years industry experience',
          speaking_style: 'Clear explanations with real-world examples',
          expertise_areas: ['machine learning', 'statistics', 'data visualization'],
          userId: 'user123'
        }
      },
      send_chat: {
        method: 'POST',
        url: '/api/chat',
        body: {
          personaId: 'persona-uuid',
          message: 'Can you explain machine learning?',
          provider: 'openai',
          userId: 'user123'
        }
      }
    }
  });
});

// Mount route modules
router.use('/persona', personaRoutes);
router.use('/chat', chatRoutes);

module.exports = router;
