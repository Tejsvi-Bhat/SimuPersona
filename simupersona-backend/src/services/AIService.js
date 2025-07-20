const OpenAI = require('openai');
const { AzureOpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.initializeClients();
    this.validateDefaultProvider();
  }

  initializeClients() {
    // Initialize OpenAI client
    if (process.env.OPENAI_API_KEY) {
      console.log('Initializing OpenAI client...');
      try {
        this.openaiClient = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: 'https://api.openai.com/v1',  // Explicitly set base URL
          timeout: 60000,  // 60 second timeout
        });
        console.log('OpenAI client initialized successfully');
      } catch (error) {
        console.error('Error initializing OpenAI client:', error);
      }
    } else {
      console.log('OpenAI API key not found');
    }

    // Initialize Azure OpenAI client
    if (process.env.AZURE_OPENAI_ENDPOINT && 
        process.env.AZURE_OPENAI_API_KEY && 
        process.env.AZURE_OPENAI_ENDPOINT !== 'your_azure_openai_endpoint_here' &&
        process.env.AZURE_OPENAI_API_KEY !== 'your_azure_openai_api_key_here') {
      console.log('Initializing Azure OpenAI client...');
      try {
        this.azureClient = new AzureOpenAI({
          endpoint: process.env.AZURE_OPENAI_ENDPOINT,
          apiKey: process.env.AZURE_OPENAI_API_KEY,
          apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview',
        });
        console.log('Azure OpenAI client initialized successfully');
      } catch (error) {
        console.error('Error initializing Azure OpenAI client:', error);
      }
    } else {
      console.log('Azure OpenAI configuration not found or using placeholder values');
    }

    // Initialize Google Gemini client
    if (process.env.GOOGLE_API_KEY && 
        process.env.GOOGLE_API_KEY !== 'your_google_api_key_here') {
      console.log('Initializing Google Gemini client...');
      try {
        this.geminiClient = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        this.geminiModel = this.geminiClient.getGenerativeModel({ 
          model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' 
        });
        console.log('Google Gemini client initialized successfully');
      } catch (error) {
        console.error('Error initializing Google Gemini client:', error);
      }
    } else {
      console.log('Google API key not found or using placeholder value');
    }

    this.defaultProvider = process.env.DEFAULT_AI_PROVIDER || 'openai';
    console.log('Default AI provider set to:', this.defaultProvider);
  }

  // Method to ensure default provider is available
  validateDefaultProvider() {
    const available = this.getAvailableProviders();
    if (available.length > 0 && !available.includes(this.defaultProvider)) {
      console.warn(`Default provider '${this.defaultProvider}' not available. Using '${available[0]}' instead.`);
      this.defaultProvider = available[0];
    }
  }

  async generateResponse(persona, userMessage, provider = null, conversationHistory = []) {
    const selectedProvider = provider || this.defaultProvider;
    
    try {
      switch (selectedProvider) {
        case 'openai':
          return await this.generateOpenAIResponse(persona, userMessage, conversationHistory);
        case 'azure':
          return await this.generateAzureResponse(persona, userMessage, conversationHistory);
        case 'gemini':
          return await this.generateGeminiResponse(persona, userMessage, conversationHistory);
        default:
          throw new Error(`Unsupported AI provider: ${selectedProvider}`);
      }
    } catch (error) {
      console.error(`Error generating response with ${selectedProvider}:`, error);
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  async generateOpenAIResponse(persona, userMessage, conversationHistory) {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized. Please check your OPENAI_API_KEY.');
    }

    console.log('Generating OpenAI response...');
    console.log('User message:', userMessage);

    const messages = [
      {
        role: 'system',
        content: persona.generateSystemPrompt()
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    try {
      console.log('Calling OpenAI API...');
      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      console.log('OpenAI API response received successfully');
      return {
        response: response.choices[0].message.content,
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        tokens_used: response.usage.total_tokens,
        persona_id: persona.id,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        status: error.status,
        code: error.code
      });
      throw error;
    }
  }

  async generateAzureResponse(persona, userMessage, conversationHistory) {
    if (!this.azureClient) {
      throw new Error('Azure OpenAI client not initialized. Please check your Azure configuration.');
    }

    const messages = [
      {
        role: 'system',
        content: persona.generateSystemPrompt()
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    const response = await this.azureClient.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    return {
      response: response.choices[0].message.content,
      provider: 'azure',
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      tokens_used: response.usage.total_tokens,
      persona_id: persona.id,
      timestamp: new Date().toISOString()
    };
  }

  async generateGeminiResponse(persona, userMessage, conversationHistory) {
    if (!this.geminiClient || !this.geminiModel) {
      throw new Error('Google Gemini client not initialized. Please check your GOOGLE_API_KEY.');
    }

    console.log('Generating Gemini response...');
    console.log('User message:', userMessage);

    // Build conversation context for Gemini
    const systemPrompt = persona.generateSystemPrompt();
    let prompt = systemPrompt + '\n\n';
    
    // Add conversation history
    if (conversationHistory.length > 0) {
      prompt += 'Previous conversation:\n';
      conversationHistory.forEach(msg => {
        prompt += `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}\n`;
      });
      prompt += '\n';
    }
    
    // Add current user message
    prompt += `Human: ${userMessage}\nAssistant:`;

    try {
      console.log('Calling Gemini API...');
      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('Gemini API response received successfully');
      return {
        response: text,
        provider: 'gemini',
        model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
        tokens_used: response.usageMetadata?.totalTokenCount || 0,
        persona_id: persona.id,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        status: error.status,
        code: error.code
      });
      throw error;
    }
  }

  async testConnection(provider = null) {
    const selectedProvider = provider || this.defaultProvider;
    
    try {
      switch (selectedProvider) {
        case 'openai':
          return await this.testOpenAIConnection();
        case 'azure':
          return await this.testAzureConnection();
        case 'gemini':
          return await this.testGeminiConnection();
        default:
          throw new Error(`Unsupported AI provider: ${selectedProvider}`);
      }
    } catch (error) {
      return {
        success: false,
        provider: selectedProvider,
        error: error.message
      };
    }
  }

  async testOpenAIConnection() {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

    const response = await this.openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Test connection' }],
      max_tokens: 10
    });

    return {
      success: true,
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      test_response: response.choices[0].message.content
    };
  }

  async testAzureConnection() {
    if (!this.azureClient) {
      throw new Error('Azure OpenAI client not initialized');
    }

    const response = await this.azureClient.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      messages: [{ role: 'user', content: 'Test connection' }],
      max_tokens: 10
    });

    return {
      success: true,
      provider: 'azure',
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      test_response: response.choices[0].message.content
    };
  }

  async testGeminiConnection() {
    if (!this.geminiClient || !this.geminiModel) {
      throw new Error('Google Gemini client not initialized');
    }

    const result = await this.geminiModel.generateContent('Test connection');
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      provider: 'gemini',
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      test_response: text
    };
  }

  getAvailableProviders() {
    const providers = [];
    
    if (this.openaiClient) {
      providers.push('openai');
    }
    
    if (this.azureClient) {
      providers.push('azure');
    }
    
    if (this.geminiClient && this.geminiModel) {
      providers.push('gemini');
    }
    
    return providers;
  }

  getCurrentProvider() {
    return this.defaultProvider;
  }

  setDefaultProvider(provider) {
    const availableProviders = this.getAvailableProviders();
    if (!availableProviders.includes(provider)) {
      throw new Error(`Provider ${provider} is not available. Available providers: ${availableProviders.join(', ')}`);
    }
    
    this.defaultProvider = provider;
    return this.defaultProvider;
  }
}

module.exports = AIService;
