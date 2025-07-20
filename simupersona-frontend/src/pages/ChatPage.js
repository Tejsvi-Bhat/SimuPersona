import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiSend, 
  FiUser, 
  FiMessageCircle, 
  FiArrowLeft,
  FiMoreVertical,
  FiTrash2,
  FiDownload,
  FiUsers
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import { usePersonas } from '../hooks/usePersonas';
import { useChat } from '../hooks/useChat';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  background: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[700]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
  }
`;

const PersonaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PersonaAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[600]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

const PersonaDetails = styled.div`
  h2 {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin: 0;
  }
  
  p {
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    color: ${({ theme }) => theme.colors.gray[600]};
    margin: 0;
  }
`;

const PersonaSelector = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const SelectorLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PersonaSelect = styled.select`
  width: 100%;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.gray[50]};
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};
  scroll-behavior: smooth;
`;

const Message = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  ${({ isUser }) => isUser && `
    flex-direction: row-reverse;
  `}
`;

const MessageAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  flex-shrink: 0;
  border: 2px solid;
  
  ${({ isUser, theme }) => isUser ? `
    background: ${theme.colors.success[600]};
    color: white;
    border-color: ${theme.colors.success[700]};
    
    svg {
      font-size: 18px;
    }
  ` : `
    background: linear-gradient(135deg, ${theme.colors.purple[100]}, ${theme.colors.blue[100]});
    color: ${theme.colors.gray[800]};
    border-color: ${theme.colors.gray[300]};
    font-size: 12px;
    letter-spacing: 0.5px;
  `}
`;

const MessageContent = styled.div`
  max-width: 70%;
  
  ${({ isUser }) => isUser && `
    align-items: flex-end;
  `}
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  ${({ isUser }) => isUser && `
    justify-content: flex-end;
  `}
`;

const SenderName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
  
  ${({ isUser, theme }) => isUser && `
    color: ${theme.colors.success[600]};
  `}
`;

const MessageBubble = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: 1.5;
  position: relative;
  
  ${({ isUser, theme }) => isUser ? `
    background: linear-gradient(135deg, ${theme.colors.success[600]}, ${theme.colors.success[700]});
    color: white;
    border-bottom-right-radius: ${theme.borderRadius.md};
    box-shadow: 0 2px 8px rgba(34, 197, 94, 0.15);
  ` : `
    background: white;
    color: ${theme.colors.gray[900]};
    border: 1px solid ${theme.colors.gray[200]};
    border-bottom-left-radius: ${theme.borderRadius.md};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    &:before {
      content: '';
      position: absolute;
      left: -1px;
      top: 0;
      bottom: 0;
      width: 3px;
      background: linear-gradient(135deg, ${theme.colors.purple[400]}, ${theme.colors.blue[400]});
      border-radius: ${theme.borderRadius.sm};
    }
  `}
`;

const MessageTime = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing.xs};
  
  ${({ isUser }) => isUser && `
    text-align: right;
  `}
`;

const InputContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: white;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const InputForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  min-height: 44px;
  max-height: 120px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-family: inherit;
  resize: none;
  line-height: 1.4;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: ${({ theme }) => theme.colors.primary[600]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[700]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[300]};
    cursor: not-allowed;
  }

  svg {
    font-size: 18px;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  
  svg {
    font-size: 48px;
    color: ${({ theme }) => theme.colors.gray[400]};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.gray[700]};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  p {
    color: ${({ theme }) => theme.colors.gray[500]};
    max-width: 400px;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

function ChatPage() {
  const { personaId } = useParams();
  const navigate = useNavigate();
  const { personas } = usePersonas();
  const { sendMessage, getConversation, clearConversation } = useChat();
  
  const [selectedPersonaId, setSelectedPersonaId] = useState(personaId || '');
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState([]);
  
  const messagesEndRef = useRef(null);
  
  const selectedPersona = personas.find(p => p.id === selectedPersonaId);

  useEffect(() => {
    if (selectedPersonaId) {
      const conv = getConversation(selectedPersonaId);
      setConversation(conv);
    }
  }, [selectedPersonaId, getConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handlePersonaChange = (e) => {
    const newPersonaId = e.target.value;
    setSelectedPersonaId(newPersonaId);
    
    if (newPersonaId) {
      navigate(`/chat/${newPersonaId}`);
    } else {
      navigate('/chat');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedPersonaId || isTyping) {
      return;
    }

    if (!selectedPersona) {
      toast.error('Please select a persona to chat with');
      return;
    }

    try {
      setIsTyping(true);
      const userMessage = {
        id: Date.now(),
        content: message.trim(),
        sender: 'user',
        timestamp: new Date().toISOString()
      };

      // Add user message immediately
      setConversation(prev => [...prev, userMessage]);
      setMessage('');

      // Send message and get response
      const response = await sendMessage(selectedPersonaId, message.trim());
      
      const aiMessage = {
        id: Date.now() + 1,
        content: response.message,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      // Add AI response
      setConversation(prev => [...prev, aiMessage]);
      
    } catch (error) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  const getPersonaInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={handleBack}>
            <FiArrowLeft />
            Dashboard
          </BackButton>
          
          {selectedPersona && (
            <PersonaInfo>
              <PersonaAvatar>
                {getPersonaInitials(selectedPersona.name)}
              </PersonaAvatar>
              <PersonaDetails>
                <h2>{selectedPersona.name}</h2>
                <p>{selectedPersona.profession}</p>
              </PersonaDetails>
            </PersonaInfo>
          )}
        </HeaderLeft>
      </Header>

      {!selectedPersonaId && (
        <PersonaSelector>
          <SelectorLabel htmlFor="persona-select">
            Choose a persona to start chatting:
          </SelectorLabel>
          <PersonaSelect
            id="persona-select"
            value={selectedPersonaId}
            onChange={handlePersonaChange}
          >
            <option value="">Select a persona...</option>
            {personas.map(persona => (
              <option key={persona.id} value={persona.id}>
                {persona.name} - {persona.profession}
              </option>
            ))}
          </PersonaSelect>
        </PersonaSelector>
      )}

      <ChatContainer>
        {!selectedPersonaId ? (
          <EmptyState>
            <FiMessageCircle />
            <h3>Welcome to SimuPersona Chat</h3>
            <p>
              Select a persona from the dropdown above to start a conversation. 
              Each persona has unique characteristics and expertise.
            </p>
          </EmptyState>
        ) : conversation.length === 0 ? (
          <EmptyState>
            <FiMessageCircle />
            <h3>Start a conversation with {selectedPersona?.name}</h3>
            <p>
              Say hello, ask a question, or start a conversation. 
              {selectedPersona?.name} is ready to chat about {selectedPersona?.profession}.
            </p>
          </EmptyState>
        ) : (
          <MessagesContainer>
            {conversation.map((msg) => (
              <Message key={msg.id} isUser={msg.role === 'user'}>
                <MessageAvatar isUser={msg.role === 'user'}>
                  {msg.role === 'user' ? (
                    <FiUser />
                  ) : (
                    getPersonaInitials(selectedPersona?.name || 'AI')
                  )}
                </MessageAvatar>
                <MessageContent isUser={msg.role === 'user'}>
                  <MessageHeader isUser={msg.role === 'user'}>
                    <SenderName isUser={msg.role === 'user'}>
                      {msg.role === 'user' ? 'You' : selectedPersona?.name || 'AI Assistant'}
                    </SenderName>
                  </MessageHeader>
                  <MessageBubble isUser={msg.role === 'user'}>
                    {msg.content}
                  </MessageBubble>
                  <MessageTime isUser={msg.role === 'user'}>
                    {formatTime(msg.timestamp)}
                  </MessageTime>
                </MessageContent>
              </Message>
            ))}
            
            {isTyping && (
              <Message isUser={false}>
                <MessageAvatar isUser={false}>
                  {getPersonaInitials(selectedPersona?.name || 'AI')}
                </MessageAvatar>
                <MessageContent isUser={false}>
                  <MessageHeader isUser={false}>
                    <SenderName isUser={false}>
                      {selectedPersona?.name || 'AI Assistant'}
                    </SenderName>
                  </MessageHeader>
                  <MessageBubble isUser={false}>
                    <LoadingSpinner />
                    {selectedPersona?.name} is typing...
                  </MessageBubble>
                </MessageContent>
              </Message>
            )}
            
            <div ref={messagesEndRef} />
          </MessagesContainer>
        )}

        {selectedPersonaId && (
          <InputContainer>
            <InputForm onSubmit={handleSubmit}>
              <MessageInput
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${selectedPersona?.name}...`}
                disabled={isTyping}
                rows={1}
              />
              <SendButton 
                type="submit" 
                disabled={!message.trim() || isTyping}
              >
                {isTyping ? <LoadingSpinner /> : <FiSend />}
              </SendButton>
            </InputForm>
          </InputContainer>
        )}
      </ChatContainer>
    </Container>
  );
}

export default ChatPage;
