import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiSave, FiArrowLeft, FiUser, FiBriefcase, FiTarget, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

import { usePersonas } from '../hooks/usePersonas';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
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

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const Form = styled.form`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  overflow: hidden;
`;

const Section = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[600]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 16px;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const CheckboxText = styled.div`
  flex: 1;
`;

const CheckboxDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.gray[50]};
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${({ variant, theme }) => {
    if (variant === 'primary') {
      return `
        background: ${theme.colors.primary[600]};
        color: white;
        
        &:hover:not(:disabled) {
          background: ${theme.colors.primary[700]};
        }
        
        &:disabled {
          background: ${theme.colors.gray[300]};
          cursor: not-allowed;
        }
      `;
    }
    
    return `
      background: white;
      color: ${theme.colors.gray[700]};
      border: 1px solid ${theme.colors.gray[300]};
      
      &:hover {
        background: ${theme.colors.gray[50]};
      }
    `;
  }}
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

function PersonaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { personas, createPersona, updatePersona, loading } = usePersonas();
  
  const isEditing = Boolean(id);
  const existingPersona = isEditing ? personas.find(p => p.id === id) : null;

  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    tone: 'friendly',
    goals: '',
    personality_traits: '',
    background: '',
    expertise: '',
    communication_style: '',
    interests: '',
    isPublic: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingPersona) {
      setFormData({
        name: existingPersona.name || '',
        profession: existingPersona.profession || '',
        tone: existingPersona.tone || 'friendly',
        goals: existingPersona.goals || '',
        personality_traits: existingPersona.personality_traits || '',
        background: existingPersona.background || '',
        expertise: existingPersona.expertise || '',
        communication_style: existingPersona.communication_style || '',
        interests: existingPersona.interests || '',
        isPublic: existingPersona.isPublic || false
      });
    }
  }, [existingPersona]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a persona name');
      return;
    }

    if (!formData.profession.trim()) {
      toast.error('Please enter a profession');
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditing) {
        await updatePersona(id, formData);
        toast.success('Persona updated successfully!');
      } else {
        await createPersona(formData);
        toast.success('Persona created successfully!');
      }

      navigate('/personas');
    } catch (error) {
      toast.error(error.message || 'Failed to save persona');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/personas');
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleCancel}>
          <FiArrowLeft />
          Back
        </BackButton>
        <Title>{isEditing ? 'Edit Persona' : 'Create New Persona'}</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionHeader>
            <SectionIcon>
              <FiUser />
            </SectionIcon>
            <SectionTitle>Basic Information</SectionTitle>
          </SectionHeader>
          
          <FormGrid>
            <FormGroup>
              <Label htmlFor="name">Persona Name *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Dr. Sarah Johnson"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="profession">Profession *</Label>
              <Input
                type="text"
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                placeholder="e.g., Clinical Psychologist"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="tone">Communication Tone</Label>
              <Select
                id="tone"
                name="tone"
                value={formData.tone}
                onChange={handleInputChange}
              >
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="empathetic">Empathetic</option>
                <option value="authoritative">Authoritative</option>
              </Select>
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionHeader>
            <SectionIcon>
              <FiBriefcase />
            </SectionIcon>
            <SectionTitle>Professional Background</SectionTitle>
          </SectionHeader>
          
          <FormGrid>
            <FormGroup>
              <Label htmlFor="background">Background & Experience</Label>
              <TextArea
                id="background"
                name="background"
                value={formData.background}
                onChange={handleInputChange}
                placeholder="Describe the persona's professional background, education, and experience..."
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="expertise">Areas of Expertise</Label>
              <TextArea
                id="expertise"
                name="expertise"
                value={formData.expertise}
                onChange={handleInputChange}
                placeholder="List key areas of expertise, specializations, and skills..."
              />
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionHeader>
            <SectionIcon>
              <FiTarget />
            </SectionIcon>
            <SectionTitle>Goals & Objectives</SectionTitle>
          </SectionHeader>
          
          <FormGroup>
            <Label htmlFor="goals">Primary Goals</Label>
            <TextArea
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleInputChange}
              placeholder="What does this persona aim to achieve in conversations? What are their objectives?"
            />
          </FormGroup>
        </Section>

        <Section>
          <SectionHeader>
            <SectionIcon>
              <FiHeart />
            </SectionIcon>
            <SectionTitle>Personality & Style</SectionTitle>
          </SectionHeader>
          
          <FormGrid>
            <FormGroup>
              <Label htmlFor="personality_traits">Personality Traits</Label>
              <TextArea
                id="personality_traits"
                name="personality_traits"
                value={formData.personality_traits}
                onChange={handleInputChange}
                placeholder="Describe key personality traits, characteristics, and behavioral patterns..."
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="communication_style">Communication Style</Label>
              <TextArea
                id="communication_style"
                name="communication_style"
                value={formData.communication_style}
                onChange={handleInputChange}
                placeholder="How does this persona communicate? What's their speaking/writing style?"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="interests">Interests & Hobbies</Label>
              <TextArea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                placeholder="What are this persona's interests, hobbies, and personal preferences?"
              />
            </FormGroup>

            <FormGroup>
              <CheckboxGroup>
                <CheckboxLabel htmlFor="isPublic">
                  <CheckboxInput
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                  />
                  <CheckboxText>
                    <div>Make this persona public</div>
                    <CheckboxDescription>
                      Public personas are accessible to all users and appear in everyone's persona list
                    </CheckboxDescription>
                  </CheckboxText>
                </CheckboxLabel>
              </CheckboxGroup>
            </FormGroup>
          </FormGrid>
        </Section>

        <ButtonGroup>
          <Button type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <FiSave />
                {isEditing ? 'Update Persona' : 'Create Persona'}
              </>
            )}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
}

export default PersonaForm;
