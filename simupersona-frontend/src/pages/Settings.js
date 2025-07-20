import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Placeholder = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  
  p {
    color: ${({ theme }) => theme.colors.gray[600]};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

function Settings() {
  return (
    <Container>
      <Title>Settings</Title>
      <Placeholder>
        <p>Settings page will be implemented here.</p>
        <p>This will include AI provider configuration, user preferences, etc.</p>
      </Placeholder>
    </Container>
  );
}

export default Settings;
