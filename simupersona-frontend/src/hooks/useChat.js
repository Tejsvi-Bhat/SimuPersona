import { useState, useCallback } from 'react';
import { chatAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

export function useChat() {
  const { state, actions, utils } = useApp();
  const [localLoading, setLocalLoading] = useState(false);

  // Send a chat message
  const sendMessage = useCallback(async (personaId, message, provider = null) => {
    try {
      setLocalLoading(true);
      actions.setError(null);

      // Get conversation history
      const conversationHistory = utils.getConversation(personaId);
      
      // Prepare message data
      const messageData = {
        personaId,
        message,
        userId: state.user.id,
        provider: provider || state.aiProviders.current,
        conversationHistory: conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      };

      // Add user message to conversation
      const userMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      actions.addMessage(personaId, userMessage);

      // Send message to API
      const response = await chatAPI.sendMessage(messageData);

      // Add AI response to conversation
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.ai_response,
        timestamp: new Date().toISOString(),
        metadata: response.data.metadata
      };
      actions.addMessage(personaId, aiMessage);

      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'Failed to send message';
      actions.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [state.user.id, state.aiProviders.current, actions, utils]);

  // Preview a conversation without storing it
  const previewChat = useCallback(async (personaId, message, provider = null) => {
    try {
      setLocalLoading(true);
      actions.setError(null);

      const previewData = {
        personaId,
        message,
        provider: provider || state.aiProviders.current
      };

      const response = await chatAPI.previewChat(previewData);
      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'Failed to preview chat';
      actions.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [state.aiProviders.current, actions]);

  // Generate conversation starters
  const generateStarters = useCallback(async (personaId, count = 3) => {
    try {
      setLocalLoading(true);
      actions.setError(null);

      const starterData = {
        personaId,
        count
      };

      const response = await chatAPI.generateStarters(starterData);
      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'Failed to generate conversation starters';
      actions.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [actions]);

  // Get available AI providers
  const fetchProviders = useCallback(async () => {
    try {
      setLocalLoading(true);
      actions.setError(null);

      const response = await chatAPI.getProviders();
      actions.setAiProviders(response.data.available_providers);
      actions.setCurrentProvider(response.data.current_default);
      
      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch AI providers';
      actions.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [actions]);

  // Set default AI provider
  const setDefaultProvider = useCallback(async (provider) => {
    try {
      setLocalLoading(true);
      actions.setError(null);

      const response = await chatAPI.setDefaultProvider(provider);
      actions.setCurrentProvider(response.data.default_provider);
      
      toast.success(`Default AI provider set to ${provider}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'Failed to set default provider';
      actions.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [actions]);

  // Test AI provider connection
  const testProvider = useCallback(async (provider) => {
    try {
      setLocalLoading(true);
      actions.setError(null);

      const response = await chatAPI.testProvider(provider);
      
      if (response.data.success) {
        toast.success(`${provider} connection successful!`);
      } else {
        toast.error(`${provider} connection failed`);
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error.message || `Failed to test ${provider} connection`;
      actions.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [actions]);

  // Health check for AI services
  const healthCheck = useCallback(async () => {
    try {
      setLocalLoading(true);
      actions.setError(null);

      const response = await chatAPI.healthCheck();
      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'Health check failed';
      actions.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [actions]);

  // Clear conversation history
  const clearConversation = useCallback((personaId) => {
    actions.clearConversation(personaId);
    toast.success('Conversation cleared');
  }, [actions]);

  // Export conversation as JSON
  const exportConversation = useCallback((personaId) => {
    const conversation = utils.getConversation(personaId);
    const persona = utils.getPersonaById(personaId);
    
    if (!conversation.length) {
      toast.error('No conversation to export');
      return;
    }

    const exportData = {
      persona: {
        id: persona.id,
        name: persona.name,
        profession: persona.profession
      },
      conversation,
      exported_at: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `conversation_${persona.name}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Conversation exported successfully');
  }, [utils]);

  return {
    conversations: state.conversations,
    availableProviders: state.aiProviders.available,
    currentProvider: state.aiProviders.current,
    loading: localLoading || state.loading,
    error: state.error,
    sendMessage,
    previewChat,
    generateStarters,
    fetchProviders,
    setDefaultProvider,
    testProvider,
    healthCheck,
    clearConversation,
    exportConversation,
    getConversation: utils.getConversation,
    hasConversation: utils.hasConversation,
    getConversationCount: utils.getConversationCount,
    clearError: actions.clearError
  };
}
