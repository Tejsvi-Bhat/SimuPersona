import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait before trying again.');
    }
    
    if (error.response?.status === 503) {
      throw new Error('AI service is currently unavailable. Please try again later.');
    }
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    throw new Error(error.message || 'An unexpected error occurred');
  }
);

// Persona API functions
export const personaAPI = {
  // Create a new persona
  async create(personaData) {
    const response = await api.post('/persona', personaData);
    return response.data;
  },

  // Get a specific persona
  async getById(id, userId) {
    const response = await api.get(`/persona/${id}`, {
      data: { userId }
    });
    return response.data;
  },

  // Update a persona
  async update(id, personaData) {
    const response = await api.put(`/persona/${id}`, personaData);
    return response.data;
  },

  // Delete a persona
  async delete(id, userId) {
    const response = await api.delete(`/persona/${id}`, {
      data: { userId }
    });
    return response.data;
  },

  // Get all personas for a user
  async getUserPersonas(params = {}) {
    const response = await api.get('/persona', { params });
    return response.data;
  },

  // Clone a persona
  async clone(id, cloneData) {
    const response = await api.post(`/persona/${id}/clone`, cloneData);
    return response.data;
  },

  // Get conversation starters
  async getStarters(id, userId = null) {
    const params = userId ? { userId } : {};
    const response = await api.get(`/persona/${id}/starters`, { params });
    return response.data;
  },

  // Get persona statistics
  async getStats() {
    const response = await api.get('/persona/stats/overview');
    return response.data;
  }
};

// Chat API functions
export const chatAPI = {
  // Send a chat message
  async sendMessage(messageData) {
    const response = await api.post('/chat', messageData);
    return response.data;
  },

  // Preview a conversation
  async previewChat(previewData) {
    const response = await api.post('/chat/preview', previewData);
    return response.data;
  },

  // Generate conversation starters
  async generateStarters(starterData) {
    const response = await api.post('/chat/starters', starterData);
    return response.data;
  },

  // Get available AI providers
  async getProviders() {
    const response = await api.get('/chat/providers');
    return response.data;
  },

  // Set default AI provider
  async setDefaultProvider(provider) {
    const response = await api.post('/chat/providers/default', { provider });
    return response.data;
  },

  // Test AI provider connection
  async testProvider(provider) {
    const response = await api.get(`/chat/providers/${provider}/test`);
    return response.data;
  },

  // Health check for AI services
  async healthCheck() {
    const response = await api.get('/chat/health');
    return response.data;
  }
};

// General API functions
export const generalAPI = {
  // Health check
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  },

  // Get API documentation
  async getDocs() {
    const response = await api.get('/docs');
    return response.data;
  }
};

// Export the configured axios instance for custom requests
export default api;
