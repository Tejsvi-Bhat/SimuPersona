import { useState, useCallback } from 'react';
import { personaAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

export function usePersonas() {
  const { state, actions } = useApp();
  const [localLoading, setLocalLoading] = useState(false);

  // Fetch all personas for the current user
  const fetchPersonas = useCallback(async (filters = {}) => {
    try {
      setLocalLoading(true);
      actions.setError(null);
      
      const params = {
        userId: state.user.id,
        ...filters
      };
      
      const response = await personaAPI.getUserPersonas(params);
      actions.setPersonas(response.data);
      
      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch personas';
      actions.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [state.user.id, actions]);

  // Create a new persona
  const createPersona = useCallback(async (personaData) => {
    try {
      setLocalLoading(true);
      actions.setError(null);
      
      const dataWithUserId = {
        ...personaData,
        userId: state.user.id
      };
      
      const response = await personaAPI.create(dataWithUserId);
      actions.addPersona(response.data);
      
      toast.success('Persona created successfully!');
      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'Failed to create persona';
      actions.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [state.user.id, actions]);

  // Update an existing persona
  const updatePersona = useCallback(async (personaId, updateData) => {
    try {
      setLocalLoading(true);
      actions.setError(null);
      
      const dataWithUserId = {
        ...updateData,
        userId: state.user.id
      };
      
      const response = await personaAPI.update(personaId, dataWithUserId);
      actions.updatePersona(response.data);
      
      toast.success('Persona updated successfully!');
      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'Failed to update persona';
      actions.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [state.user.id, actions]);

  // Delete a persona
  const deletePersona = useCallback(async (personaId) => {
    try {
      setLocalLoading(true);
      actions.setError(null);
      
      await personaAPI.delete(personaId, state.user.id);
      actions.deletePersona(personaId);
      
      toast.success('Persona deleted successfully!');
      return true;
    } catch (error) {
      const errorMessage = error.message || 'Failed to delete persona';
      actions.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [state.user.id, actions]);

  // Clone a persona
  const clonePersona = useCallback(async (personaId, name) => {
    try {
      setLocalLoading(true);
      actions.setError(null);
      
      const cloneData = {
        userId: state.user.id,
        name: name
      };
      
      const response = await personaAPI.clone(personaId, cloneData);
      actions.addPersona(response.data);
      
      toast.success('Persona cloned successfully!');
      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'Failed to clone persona';
      actions.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [state.user.id, actions]);

  // Get conversation starters for a persona
  const getConversationStarters = useCallback(async (personaId) => {
    try {
      setLocalLoading(true);
      actions.setError(null);
      
      const response = await personaAPI.getStarters(personaId, state.user.id);
      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'Failed to get conversation starters';
      actions.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [state.user.id, actions]);

  // Get persona statistics
  const getPersonaStats = useCallback(async () => {
    try {
      setLocalLoading(true);
      actions.setError(null);
      
      const response = await personaAPI.getStats();
      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'Failed to get persona statistics';
      actions.setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [actions]);

  return {
    personas: state.personas,
    selectedPersona: state.selectedPersona,
    loading: localLoading || state.loading,
    error: state.error,
    fetchPersonas,
    createPersona,
    updatePersona,
    deletePersona,
    clonePersona,
    getConversationStarters,
    getPersonaStats,
    selectPersona: actions.selectPersona,
    clearError: actions.clearError
  };
}
