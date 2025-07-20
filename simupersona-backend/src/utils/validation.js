const Joi = require('joi');

// Persona validation schema
const personaSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 1 character',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required'
  }),
  
  tone: Joi.string().min(1).max(50).required().messages({
    'string.empty': 'Tone cannot be empty',
    'string.min': 'Tone must be at least 1 character',
    'string.max': 'Tone cannot exceed 50 characters',
    'any.required': 'Tone is required'
  }),
  
  profession: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Profession cannot be empty',
    'string.min': 'Profession must be at least 1 character',
    'string.max': 'Profession cannot exceed 100 characters',
    'any.required': 'Profession is required'
  }),
  
  goals: Joi.string().min(1).max(500).required().messages({
    'string.empty': 'Goals cannot be empty',
    'string.min': 'Goals must be at least 1 character',
    'string.max': 'Goals cannot exceed 500 characters',
    'any.required': 'Goals are required'
  }),
  
  personality_traits: Joi.alternatives().try(
    // Accept array of strings
    Joi.array().items(Joi.string().max(50)).max(10),
    // Accept string and convert to array
    Joi.string().max(1000).custom((value, helpers) => {
      if (!value || value.trim() === '') return [];
      // Split by common delimiters: comma, semicolon, newline
      return value.split(/[,;\n]+/).map(trait => trait.trim()).filter(trait => trait.length > 0);
    })
  ).default([]).messages({
    'array.max': 'Cannot have more than 10 personality traits',
    'string.max': 'Personality traits cannot exceed 1000 characters'
  }),
  
  background: Joi.string().max(1000).allow('').default('').messages({
    'string.max': 'Background cannot exceed 1000 characters'
  }),
  
  speaking_style: Joi.string().max(200).allow('').default('').messages({
    'string.max': 'Speaking style cannot exceed 200 characters'
  }),
  
  // Accept both communication_style (frontend) and speaking_style (backend)
  communication_style: Joi.string().max(200).allow('').default('').messages({
    'string.max': 'Communication style cannot exceed 200 characters'
  }),
  
  expertise_areas: Joi.alternatives().try(
    // Accept array of strings
    Joi.array().items(Joi.string().max(50)).max(10),
    // Accept string and convert to array
    Joi.string().max(1000).custom((value, helpers) => {
      if (!value || value.trim() === '') return [];
      return value.split(/[,;\n]+/).map(area => area.trim()).filter(area => area.length > 0);
    })
  ).default([]).messages({
    'array.max': 'Cannot have more than 10 expertise areas',
    'string.max': 'Expertise areas cannot exceed 1000 characters'
  }),
  
  // Accept both expertise (frontend) and expertise_areas (backend)
  expertise: Joi.alternatives().try(
    // Accept array of strings
    Joi.array().items(Joi.string().max(50)).max(10),
    // Accept string and convert to array
    Joi.string().max(1000).custom((value, helpers) => {
      if (!value || value.trim() === '') return [];
      return value.split(/[,;\n]+/).map(area => area.trim()).filter(area => area.length > 0);
    })
  ).default([]).messages({
    'array.max': 'Cannot have more than 10 expertise areas',
    'string.max': 'Expertise cannot exceed 1000 characters'
  }),
  
  interests: Joi.string().max(500).allow('').default('').messages({
    'string.max': 'Interests cannot exceed 500 characters'
  }),
  
  conversation_starters: Joi.array().items(Joi.string().max(200)).max(5).default([]).messages({
    'array.max': 'Cannot have more than 5 conversation starters',
    'string.max': 'Each conversation starter cannot exceed 200 characters'
  }),
  
  isPublic: Joi.boolean().default(false).messages({
    'boolean.base': 'isPublic must be a boolean value'
  }),
  
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required'
  })
});

// Chat request validation schema
const chatSchema = Joi.object({
  personaId: Joi.string().required().messages({
    'any.required': 'Persona ID is required'
  }),
  
  message: Joi.string().min(1).max(2000).required().messages({
    'string.empty': 'Message cannot be empty',
    'string.min': 'Message must be at least 1 character',
    'string.max': 'Message cannot exceed 2000 characters',
    'any.required': 'Message is required'
  }),
  
  provider: Joi.string().valid('openai', 'azure').optional().messages({
    'any.only': 'Provider must be either "openai" or "azure"'
  }),
  
  conversationHistory: Joi.array().items(
    Joi.object({
      role: Joi.string().valid('user', 'assistant').required(),
      content: Joi.string().required()
    })
  ).max(20).default([]).messages({
    'array.max': 'Conversation history cannot exceed 20 messages'
  }),
  
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required'
  })
});

// ID parameter validation
const idSchema = Joi.string().uuid().required().messages({
  'string.guid': 'Invalid ID format',
  'any.required': 'ID is required'
});

// Query parameters validation
const querySchema = Joi.object({
  userId: Joi.string().optional(),
  profession: Joi.string().max(100).optional(),
  tone: Joi.string().max(50).optional(),
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0)
});

// Validation middleware function
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errorMessages
      });
    }

    req[property] = value;
    next();
  };
};

// Custom validation functions
const validatePersonaOwnership = (personaUserId, requestUserId) => {
  if (personaUserId !== requestUserId) {
    throw new Error('You do not have permission to access this persona');
  }
};

const validatePersonaAccess = (persona, requestUserId) => {
  // Allow access if user owns the persona OR if the persona is public
  if (persona.userId !== requestUserId && !persona.isPublic) {
    throw new Error('You do not have permission to access this persona');
  }
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially harmful characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

const validateProvider = (provider, availableProviders) => {
  if (provider && !availableProviders.includes(provider)) {
    throw new Error(`Provider '${provider}' is not available. Available providers: ${availableProviders.join(', ')}`);
  }
};

module.exports = {
  personaSchema,
  chatSchema,
  idSchema,
  querySchema,
  validate,
  validatePersonaOwnership,
  validatePersonaAccess,
  sanitizeInput,
  validateProvider
};
