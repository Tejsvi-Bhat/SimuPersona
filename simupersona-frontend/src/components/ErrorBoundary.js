import React from 'react';
import styled from 'styled-components';
import { FiAlertTriangle, FiRefreshCcw } from 'react-icons/fi';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ErrorCard = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['3xl']};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const ErrorIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${({ theme }) => theme.colors.error[100]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.error[600]};

  svg {
    font-size: 32px;
  }
`;

const ErrorTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  text-align: left;
  margin: ${({ theme }) => theme.spacing.lg} 0;
  
  summary {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.gray[600]};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const ErrorStack = styled.pre`
  background: ${({ theme }) => theme.colors.gray[100]};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[700]};
  overflow: auto;
  max-height: 200px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const ReloadButton = styled.button`
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

const HomeButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[600]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // In a real app, you would log this to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    // Reset error state and reload the page
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    // Reset error state and navigate to home
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorIcon>
              <FiAlertTriangle />
            </ErrorIcon>
            
            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            
            <ErrorMessage>
              We're sorry, but something unexpected happened. This error has been logged 
              and we'll look into it. You can try reloading the page or go back to the homepage.
            </ErrorMessage>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <ErrorDetails>
                <summary>Error Details (Development Mode)</summary>
                <ErrorStack>
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </ErrorStack>
              </ErrorDetails>
            )}

            <ActionButtons>
              <ReloadButton onClick={this.handleReload}>
                <FiRefreshCcw />
                Reload Page
              </ReloadButton>
              
              <HomeButton onClick={this.handleGoHome}>
                Go to Homepage
              </HomeButton>
            </ActionButtons>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
