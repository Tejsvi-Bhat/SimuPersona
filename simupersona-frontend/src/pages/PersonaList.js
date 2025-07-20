import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiUsers,
  FiMessageCircle,
  FiGlobe
} from 'react-icons/fi';

import { usePersonas } from '../hooks/usePersonas';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const CreateButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  svg {
    font-size: 16px;
  }
`;

const PersonaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const PersonaCard = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PublicBadge = styled.span`
  background: ${({ theme }) => theme.colors.success[100]};
  color: ${({ theme }) => theme.colors.success[700]};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  svg {
    font-size: 12px;
  }
`;

const PersonaName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PersonaProfession = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const CardBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PersonaDetails = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const DetailItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  strong {
    color: ${({ theme }) => theme.colors.gray[700]};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  }
  
  span {
    color: ${({ theme }) => theme.colors.gray[600]};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: all 0.2s ease;
  background: white;
  color: ${({ theme }) => theme.colors.gray[700]};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
  }

  &.primary {
    background: ${({ theme }) => theme.colors.primary[500]};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary[500]};

    &:hover {
      background: ${({ theme }) => theme.colors.primary[600]};
      border-color: ${({ theme }) => theme.colors.primary[600]};
    }
  }

  &.danger {
    color: ${({ theme }) => theme.colors.error[600]};
    border-color: ${({ theme }) => theme.colors.error[300]};

    &:hover {
      background: ${({ theme }) => theme.colors.error[50]};
      border-color: ${({ theme }) => theme.colors.error[400]};
    }
  }

  svg {
    font-size: 14px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  p {
    color: ${({ theme }) => theme.colors.gray[600]};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

function PersonaList() {
  const { personas, fetchPersonas, deletePersona, loading } = usePersonas();

  useEffect(() => {
    fetchPersonas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (personaId) => {
    if (window.confirm('Are you sure you want to delete this persona? This action cannot be undone.')) {
      await deletePersona(personaId);
    }
  };

  if (loading && personas.length === 0) {
    return (
      <Container>
        <LoadingState>Loading personas...</LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>My Personas</Title>
        <CreateButton to="/personas/new">
          <FiPlus />
          Create New Persona
        </CreateButton>
      </Header>

      {personas.length === 0 ? (
        <EmptyState>
          <h3>No personas yet</h3>
          <p>Create your first AI persona to get started with SimuPersona.</p>
          <CreateButton to="/personas/new">
            <FiPlus />
            Create Your First Persona
          </CreateButton>
        </EmptyState>
      ) : (
        <PersonaGrid>
          {personas.map((persona) => (
            <PersonaCard key={persona.id}>
              <CardHeader>
                <HeaderTop>
                  <div>
                    <PersonaName>{persona.name}</PersonaName>
                  </div>
                  {persona.isPublic && (
                    <PublicBadge>
                      <FiGlobe />
                      Public
                    </PublicBadge>
                  )}
                </HeaderTop>
                <PersonaProfession>{persona.profession}</PersonaProfession>
              </CardHeader>
              
              <CardBody>
                <PersonaDetails>
                  <DetailItem>
                    <strong>Tone:</strong> <span>{persona.tone}</span>
                  </DetailItem>
                  <DetailItem>
                    <strong>Goals:</strong> <span>{persona.goals}</span>
                  </DetailItem>
                  {persona.expertise_areas.length > 0 && (
                    <DetailItem>
                      <strong>Expertise:</strong> <span>{persona.expertise_areas.join(', ')}</span>
                    </DetailItem>
                  )}
                </PersonaDetails>

                <CardActions>
                  <ActionButton 
                    as={Link} 
                    to={`/chat/${persona.id}`}
                    className="primary"
                  >
                    <FiMessageCircle />
                    Chat
                  </ActionButton>
                  
                  <ActionButton as={Link} to={`/personas/${persona.id}/edit`}>
                    <FiEdit3 />
                    Edit
                  </ActionButton>
                  
                  <ActionButton 
                    className="danger"
                    onClick={() => handleDelete(persona.id)}
                  >
                    <FiTrash2 />
                    Delete
                  </ActionButton>
                </CardActions>
              </CardBody>
            </PersonaCard>
          ))}
        </PersonaGrid>
      )}
    </Container>
  );
}

export default PersonaList;
