import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiUsers, 
  FiMessageCircle, 
  FiPlus, 
  FiActivity,
  FiTrendingUp,
  FiZap,
  FiArrowRight
} from 'react-icons/fi';

import { usePersonas } from '../hooks/usePersonas';
import { useChat } from '../hooks/useChat';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const StatCard = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ color, theme }) => color || theme.colors.primary[100]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ iconColor, theme }) => iconColor || theme.colors.primary[600]};

  svg {
    font-size: 24px;
  }
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatTrend = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme, positive }) => 
    positive ? theme.colors.success[600] : theme.colors.gray[500]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const ActionCard = styled(Link)`
  background: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  transition: all 0.2s ease;
  color: inherit;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div`
  width: 56px;
  height: 56px;
  background: ${({ color, theme }) => color || theme.colors.primary[100]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ iconColor, theme }) => iconColor || theme.colors.primary[600]};
  flex-shrink: 0;

  svg {
    font-size: 28px;
  }
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ActionDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: 1.5;
`;

const ActionArrow = styled.div`
  color: ${({ theme }) => theme.colors.gray[400]};
  flex-shrink: 0;

  svg {
    font-size: 20px;
  }
`;

const RecentSection = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const PersonaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const PersonaCard = styled(Link)`
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: all 0.2s ease;
  color: inherit;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
    border-color: ${({ theme }) => theme.colors.primary[200]};
  }
`;

const PersonaName = styled.h3`
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PersonaProfession = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PersonaStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

function Dashboard() {
  const { personas, fetchPersonas, loading } = usePersonas();
  const { getConversationCount } = useChat();
  const [stats, setStats] = useState({
    totalPersonas: 0,
    totalConversations: 0,
    recentlyCreated: 0
  });

  useEffect(() => {
    fetchPersonas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (personas.length > 0) {
      const totalConversations = personas.reduce((total, persona) => {
        return total + getConversationCount(persona.id);
      }, 0);

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentlyCreated = personas.filter(persona => 
        new Date(persona.created_at) > oneWeekAgo
      ).length;

      setStats({
        totalPersonas: personas.length,
        totalConversations,
        recentlyCreated
      });
    }
  }, [personas, getConversationCount]);

  const recentPersonas = personas
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 6);

  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>
          Welcome back! Here's what's happening with your AI personas.
        </Subtitle>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatIcon 
              color="#dbeafe" 
              iconColor="#2563eb"
            >
              <FiUsers />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.totalPersonas}</StatValue>
          <StatLabel>Total Personas</StatLabel>
          <StatTrend positive={stats.recentlyCreated > 0}>
            <FiTrendingUp />
            {stats.recentlyCreated} created this week
          </StatTrend>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon 
              color="#dcfce7" 
              iconColor="#16a34a"
            >
              <FiMessageCircle />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.totalConversations}</StatValue>
          <StatLabel>Total Conversations</StatLabel>
          <StatTrend positive>
            <FiActivity />
            Active personas
          </StatTrend>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon 
              color="#fef3c7" 
              iconColor="#d97706"
            >
              <FiZap />
            </StatIcon>
          </StatHeader>
          <StatValue>AI Ready</StatValue>
          <StatLabel>System Status</StatLabel>
          <StatTrend positive>
            <FiActivity />
            All services operational
          </StatTrend>
        </StatCard>
      </StatsGrid>

      <QuickActions>
        <ActionCard to="/personas/new">
          <ActionIcon color="#dbeafe" iconColor="#2563eb">
            <FiPlus />
          </ActionIcon>
          <ActionContent>
            <ActionTitle>Create New Persona</ActionTitle>
            <ActionDescription>
              Build a new AI character with unique traits, personality, and expertise.
            </ActionDescription>
          </ActionContent>
          <ActionArrow>
            <FiArrowRight />
          </ActionArrow>
        </ActionCard>

        <ActionCard to="/chat">
          <ActionIcon color="#dcfce7" iconColor="#16a34a">
            <FiMessageCircle />
          </ActionIcon>
          <ActionContent>
            <ActionTitle>Start Chatting</ActionTitle>
            <ActionDescription>
              Begin a conversation with one of your existing personas.
            </ActionDescription>
          </ActionContent>
          <ActionArrow>
            <FiArrowRight />
          </ActionArrow>
        </ActionCard>
      </QuickActions>

      <RecentSection>
        <SectionHeader>
          <SectionTitle>Recent Personas</SectionTitle>
        </SectionHeader>
        
        {loading ? (
          <EmptyState>Loading personas...</EmptyState>
        ) : recentPersonas.length > 0 ? (
          <PersonaGrid>
            {recentPersonas.map((persona) => (
              <PersonaCard key={persona.id} to={`/chat/${persona.id}`}>
                <PersonaName>{persona.name}</PersonaName>
                <PersonaProfession>{persona.profession}</PersonaProfession>
                <PersonaStats>
                  <span>{getConversationCount(persona.id)} messages</span>
                  <span>•</span>
                  <span>{persona.tone}</span>
                </PersonaStats>
              </PersonaCard>
            ))}
          </PersonaGrid>
        ) : (
          <EmptyState>
            <p>No personas created yet.</p>
            <Link to="/personas/new" style={{ color: '#2563eb' }}>
              Create your first persona →
            </Link>
          </EmptyState>
        )}
      </RecentSection>
    </DashboardContainer>
  );
}

export default Dashboard;
