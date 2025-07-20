import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Initial state
const initialState = {
  user: {
    id: localStorage.getItem('simupersona_user_id') || 'demo-user-001',
    name: localStorage.getItem('simupersona_user_name') || 'Demo User'
  },
  personas: [],
  selectedPersona: null,
  conversations: {},
  aiProviders: {
    available: [],
    current: 'azure'
  },
  loading: false,
  error: null
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
  SET_PERSONAS: 'SET_PERSONAS',
  ADD_PERSONA: 'ADD_PERSONA',
  UPDATE_PERSONA: 'UPDATE_PERSONA',
  DELETE_PERSONA: 'DELETE_PERSONA',
  SELECT_PERSONA: 'SELECT_PERSONA',
  SET_AI_PROVIDERS: 'SET_AI_PROVIDERS',
  SET_CURRENT_PROVIDER: 'SET_CURRENT_PROVIDER',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_CONVERSATION: 'SET_CONVERSATION',
  CLEAR_CONVERSATION: 'CLEAR_CONVERSATION'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };

    case ActionTypes.SET_USER:
      return { ...state, user: action.payload };

    case ActionTypes.SET_PERSONAS:
      return { ...state, personas: action.payload };

    case ActionTypes.ADD_PERSONA:
      return { 
        ...state, 
        personas: [...state.personas, action.payload] 
      };

    case ActionTypes.UPDATE_PERSONA:
      return {
        ...state,
        personas: state.personas.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
        selectedPersona: state.selectedPersona?.id === action.payload.id 
          ? action.payload 
          : state.selectedPersona
      };

    case ActionTypes.DELETE_PERSONA:
      return {
        ...state,
        personas: state.personas.filter(p => p.id !== action.payload),
        selectedPersona: state.selectedPersona?.id === action.payload 
          ? null 
          : state.selectedPersona
      };

    case ActionTypes.SELECT_PERSONA:
      return { ...state, selectedPersona: action.payload };

    case ActionTypes.SET_AI_PROVIDERS:
      return {
        ...state,
        aiProviders: {
          ...state.aiProviders,
          available: action.payload
        }
      };

    case ActionTypes.SET_CURRENT_PROVIDER:
      return {
        ...state,
        aiProviders: {
          ...state.aiProviders,
          current: action.payload
        }
      };

    case ActionTypes.ADD_MESSAGE:
      const { personaId, message } = action.payload;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [personaId]: [
            ...(state.conversations[personaId] || []),
            message
          ]
        }
      };

    case ActionTypes.SET_CONVERSATION:
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.payload.personaId]: action.payload.messages
        }
      };

    case ActionTypes.CLEAR_CONVERSATION:
      const { [action.payload]: removed, ...remainingConversations } = state.conversations;
      return {
        ...state,
        conversations: remainingConversations
      };

    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Context provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Save user ID to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('simupersona_user_id', state.user.id);
    localStorage.setItem('simupersona_user_name', state.user.name);
  }, [state.user]);

  // Action creators
  const actions = useMemo(() => ({
    setLoading: (loading) => 
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),

    setError: (error) => 
      dispatch({ type: ActionTypes.SET_ERROR, payload: error }),

    clearError: () => 
      dispatch({ type: ActionTypes.CLEAR_ERROR }),

    setUser: (user) => 
      dispatch({ type: ActionTypes.SET_USER, payload: user }),

    setPersonas: (personas) => 
      dispatch({ type: ActionTypes.SET_PERSONAS, payload: personas }),

    addPersona: (persona) => 
      dispatch({ type: ActionTypes.ADD_PERSONA, payload: persona }),

    updatePersona: (persona) => 
      dispatch({ type: ActionTypes.UPDATE_PERSONA, payload: persona }),

    deletePersona: (personaId) => 
      dispatch({ type: ActionTypes.DELETE_PERSONA, payload: personaId }),

    selectPersona: (persona) => 
      dispatch({ type: ActionTypes.SELECT_PERSONA, payload: persona }),

    setAiProviders: (providers) => 
      dispatch({ type: ActionTypes.SET_AI_PROVIDERS, payload: providers }),

    setCurrentProvider: (provider) => 
      dispatch({ type: ActionTypes.SET_CURRENT_PROVIDER, payload: provider }),

    addMessage: (personaId, message) => 
      dispatch({ 
        type: ActionTypes.ADD_MESSAGE, 
        payload: { personaId, message } 
      }),

    setConversation: (personaId, messages) => 
      dispatch({ 
        type: ActionTypes.SET_CONVERSATION, 
        payload: { personaId, messages } 
      }),

    clearConversation: (personaId) => 
      dispatch({ type: ActionTypes.CLEAR_CONVERSATION, payload: personaId })
  }), [dispatch]);

  // Utility functions
  const utils = useMemo(() => ({
    getConversation: (personaId) => state.conversations[personaId] || [],
    
    getPersonaById: (personaId) => 
      state.personas.find(p => p.id === personaId),
    
    isPersonaSelected: (personaId) => 
      state.selectedPersona?.id === personaId,
    
    hasConversation: (personaId) => 
      Boolean(state.conversations[personaId]?.length),
    
    getConversationCount: (personaId) => 
      state.conversations[personaId]?.length || 0,
    
    generateUserId: () => {
      const newId = uuidv4();
      actions.setUser({ ...state.user, id: newId });
      return newId;
    }
  }), [state, actions]);

  const contextValue = useMemo(() => ({
    state,
    actions,
    utils
  }), [state, actions, utils]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
