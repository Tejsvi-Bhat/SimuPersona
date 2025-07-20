const express = require('express');
const PersonaController = require('../controllers/PersonaController');
const { validate, personaSchema, idSchema, querySchema } = require('../utils/validation');
const { personaLimiter } = require('../middleware/rateLimiter');

const router = express.Router();
const personaController = new PersonaController();

// Apply rate limiting to all persona routes
router.use(personaLimiter);

// GET /api/persona/stats/overview - Get persona statistics (must come before general GET /persona)
router.get(
  '/stats/overview',
  personaController.getPersonaStats
);

// POST /api/persona - Create a new persona
router.post(
  '/',
  validate(personaSchema),
  personaController.createPersona
);

// GET /api/persona - Get all personas for a user (with filters)
router.get(
  '/',
  validate(querySchema, 'query'),
  personaController.getUserPersonas
);

// GET /api/persona/:id - Get a specific persona
router.get(
  '/:id',
  validate(idSchema, 'params'),
  personaController.getPersona
);

// PUT /api/persona/:id - Update a persona
router.put(
  '/:id',
  validate(idSchema, 'params'),
  validate(personaSchema),
  personaController.updatePersona
);

// DELETE /api/persona/:id - Delete a persona
router.delete(
  '/:id',
  validate(idSchema, 'params'),
  personaController.deletePersona
);

// GET /api/persona/:id/starters - Get conversation starters for a persona
router.get(
  '/:id/starters',
  validate(idSchema, 'params'),
  personaController.getConversationStarters
);

// POST /api/persona/:id/clone - Clone a persona
router.post(
  '/:id/clone',
  validate(idSchema, 'params'),
  personaController.clonePersona
);

module.exports = router;
