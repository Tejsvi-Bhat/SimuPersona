import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';

import { AppProvider } from './context/AppContext';
import { GlobalStyles, theme } from './styles/GlobalStyles';

// Components
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Dashboard from './pages/Dashboard';
import PersonaList from './pages/PersonaList';
import PersonaForm from './pages/PersonaForm';
import ChatPage from './pages/ChatPage';
import Settings from './pages/Settings';

function App() {
  useEffect(() => {
    // Set page title
    document.title = 'SimuPersona - AI Persona Chat';
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <AppProvider>
          <GlobalStyles />
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/personas" element={<PersonaList />} />
                <Route path="/personas/new" element={<PersonaForm />} />
                <Route path="/personas/:id/edit" element={<PersonaForm />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chat/:personaId" element={<ChatPage />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#1e293b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif'
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#ffffff'
                  }
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff'
                  }
                }
              }}
            />
          </Router>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
