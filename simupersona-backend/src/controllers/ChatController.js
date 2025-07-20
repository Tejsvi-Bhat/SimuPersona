const PersonaStorage = require('../services/PersonaStorage');
const AIService = require('../services/AIService');
const { asyncHandler } = require('../middleware/errorHandler');
const { validatePersonaOwnership, validatePersonaAccess, sanitizeInput, validateProvider } = require('../utils/validation');

class ChatController {
  constructor() {
    this.storage = new PersonaStorage();
    this.aiService = new AIService();
  }

  // Send a chat message to a persona
  sendMessage = asyncHandler(async (req, res) => {
    const { personaId, message, provider, conversationHistory = [], userId } = req.body;
    
    // Get the persona
    const persona = await this.storage.findById(personaId);
    if (!persona) {
      return res.status(404).json({
        success: false,
        error: 'Persona not found'
      });
    }

    // Check access (owner or public persona)
    validatePersonaAccess(persona, userId);

    // Validate provider
    const availableProviders = this.aiService.getAvailableProviders();
    if (availableProviders.length === 0) {
      return res.status(503).json({
        success: false,
        error: 'No AI providers are configured. Please check your environment variables.'
      });
    }

    // Use default provider if requested provider is not available
    let selectedProvider = provider;
    if (!availableProviders.includes(provider)) {
      selectedProvider = this.aiService.getCurrentProvider();
      console.warn(`Provider '${provider}' not available. Using default provider '${selectedProvider}'.`);
    }

    // Sanitize the message
    const sanitizedMessage = sanitizeInput(message);
    
    // Sanitize conversation history
    const sanitizedHistory = conversationHistory.map(msg => ({
      role: msg.role,
      content: sanitizeInput(msg.content)
    }));

    // Generate AI response
    const response = await this.aiService.generateResponse(
      persona,
      sanitizedMessage,
      selectedProvider,
      sanitizedHistory
    );

    res.json({
      success: true,
      data: {
        user_message: sanitizedMessage,
        ai_response: response.response,
        persona: {
          id: persona.id,
          name: persona.name
        },
        metadata: {
          provider: response.provider,
          model: response.model,
          tokens_used: response.tokens_used,
          timestamp: response.timestamp
        }
      }
    });
  });

  // Get available AI providers
  getProviders = asyncHandler(async (req, res) => {
    const availableProviders = this.aiService.getAvailableProviders();
    const currentProvider = this.aiService.getCurrentProvider();

    res.json({
      success: true,
      data: {
        available_providers: availableProviders,
        current_default: currentProvider,
        provider_info: {
          openai: {
            name: 'OpenAI',
            description: 'OpenAI GPT models',
            available: availableProviders.includes('openai')
          },
          azure: {
            name: 'Azure OpenAI',
            description: 'Azure OpenAI Service',
            available: availableProviders.includes('azure')
          }
        }
      }
    });
  });

  // Test AI provider connection
  testProvider = asyncHandler(async (req, res) => {
    const { provider } = req.params;

    const availableProviders = this.aiService.getAvailableProviders();
    validateProvider(provider, availableProviders);

    const testResult = await this.aiService.testConnection(provider);

    res.json({
      success: testResult.success,
      data: testResult
    });
  });

  // Set default AI provider
  setDefaultProvider = asyncHandler(async (req, res) => {
    const { provider } = req.body;

    const newDefault = this.aiService.setDefaultProvider(provider);

    res.json({
      success: true,
      message: `Default AI provider set to ${newDefault}`,
      data: {
        default_provider: newDefault,
        available_providers: this.aiService.getAvailableProviders()
      }
    });
  });

  // Get a conversation preview (simulate chat without storing)
  previewConversation = asyncHandler(async (req, res) => {
    const { personaId, message, provider } = req.body;
    
    // Get the persona
    const persona = await this.storage.findById(personaId);
    if (!persona) {
      return res.status(404).json({
        success: false,
        error: 'Persona not found'
      });
    }

    // Note: No ownership check for preview - allows testing personas

    // Validate provider
    const availableProviders = this.aiService.getAvailableProviders();
    validateProvider(provider, availableProviders);

    // Sanitize the message
    const sanitizedMessage = sanitizeInput(message);

    // Generate AI response with minimal conversation history
    const response = await this.aiService.generateResponse(
      persona,
      sanitizedMessage,
      provider,
      [] // No conversation history for preview
    );

    res.json({
      success: true,
      data: {
        preview: true,
        user_message: sanitizedMessage,
        ai_response: response.response,
        persona: {
          id: persona.id,
          name: persona.name,
          tone: persona.tone,
          profession: persona.profession
        },
        metadata: {
          provider: response.provider,
          model: response.model,
          timestamp: response.timestamp
        }
      }
    });
  });

  // Generate conversation starters based on persona
  generateStarters = asyncHandler(async (req, res) => {
    const { personaId, count = 3 } = req.body;
    
    // Get the persona
    const persona = await this.storage.findById(personaId);
    if (!persona) {
      return res.status(404).json({
        success: false,
        error: 'Persona not found'
      });
    }

    // If persona already has conversation starters, return them
    if (persona.conversation_starters && persona.conversation_starters.length > 0) {
      return res.json({
        success: true,
        data: {
          conversation_starters: persona.conversation_starters.slice(0, count),
          source: 'existing'
        }
      });
    }

    // Generate new conversation starters using AI
    const starterPrompt = `Generate ${count} conversation starter questions that someone might ask ${persona.name}, a ${persona.profession}. 
    Consider their tone (${persona.tone}), goals (${persona.goals}), and expertise areas (${persona.expertise_areas.join(', ')}). 
    Return only the questions, one per line, without numbering or additional text.`;

    const response = await this.aiService.generateResponse(
      persona,
      starterPrompt,
      null, // Use default provider
      []
    );

    // Parse the generated starters
    const generatedStarters = response.response
      .split('\n')
      .map(starter => starter.trim())
      .filter(starter => starter.length > 0)
      .slice(0, count);

    res.json({
      success: true,
      data: {
        conversation_starters: generatedStarters,
        source: 'generated',
        metadata: {
          provider: response.provider,
          model: response.model
        }
      }
    });
  });

  // Health check for AI services
  healthCheck = asyncHandler(async (req, res) => {
    const availableProviders = this.aiService.getAvailableProviders();
    const healthStatus = {
      timestamp: new Date().toISOString(),
      providers: {}
    };

    // Test each available provider
    for (const provider of availableProviders) {
      try {
        const testResult = await this.aiService.testConnection(provider);
        healthStatus.providers[provider] = {
          status: testResult.success ? 'healthy' : 'unhealthy',
          ...testResult
        };
      } catch (error) {
        healthStatus.providers[provider] = {
          status: 'unhealthy',
          error: error.message
        };
      }
    }

    const allHealthy = Object.values(healthStatus.providers).every(p => p.status === 'healthy');

    res.status(allHealthy ? 200 : 503).json({
      success: allHealthy,
      data: healthStatus
    });
  });
}

module.exports = ChatController;
