import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, 
  FiUsers, 
  FiMessageCircle, 
  FiSettings, 
  FiMenu, 
  FiX,
  FiPlus
} from 'react-icons/fi';

import { useApp } from '../context/AppContext';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

const Sidebar = styled.aside`
  width: 280px;
  background-color: white;
  border-right: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  transform: translateX(${({ isOpen }) => isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;
  z-index: 40;

  @media (min-width: 768px) {
    position: static;
    transform: none;
  }
`;

const SidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.primary[600]});
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;

const Navigation = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const NavSectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[400]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NavList = styled.ul`
  list-style: none;
`;

const NavItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const NavLink = styled(Link).withConfig({
  shouldForwardProp: (prop) => prop !== 'isActive'
})`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary[600] : theme.colors.gray[600]};
  background-color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary[50] : 'transparent'};
  font-weight: ${({ theme, isActive }) => 
    isActive ? theme.typography.fontWeights.medium : theme.typography.fontWeights.normal};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[900]};
  }

  svg {
    font-size: 18px;
  }
`;

const QuickAction = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: background-color 0.2s ease;
  margin-top: ${({ theme }) => theme.spacing.lg};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  svg {
    font-size: 16px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 0;
  min-height: 100vh;

  @media (min-width: 768px) {
    margin-left: 280px;
  }
`;

const TopBar = styled.header`
  background-color: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 30;

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }

  svg {
    font-size: 20px;
  }
`;

const UserInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const UserName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const UserId = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-family: monospace;
`;

const ContentArea = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 30;
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  visibility: ${({ $isVisible }) => $isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    display: none;
  }
`;

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { state } = useApp();

  const navigation = [
    {
      section: 'Main',
      items: [
        { name: 'Dashboard', href: '/', icon: FiHome },
        { name: 'Personas', href: '/personas', icon: FiUsers },
        { name: 'Chat', href: '/chat', icon: FiMessageCircle },
      ]
    },
    {
      section: 'System',
      items: [
        { name: 'Settings', href: '/settings', icon: FiSettings },
      ]
    }
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <LayoutContainer>
      {/* Mobile Overlay */}
      <Overlay $isVisible={sidebarOpen} onClick={closeSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen}>
        <SidebarHeader>
          <Logo>
            <LogoIcon>S</LogoIcon>
            SimuPersona
          </Logo>
        </SidebarHeader>

        <Navigation>
          {navigation.map((section) => (
            <NavSection key={section.section}>
              <NavSectionTitle>{section.section}</NavSectionTitle>
              <NavList>
                {section.items.map((item) => (
                  <NavItem key={item.name}>
                    <NavLink
                      to={item.href}
                      isActive={location.pathname === item.href}
                      onClick={closeSidebar}
                    >
                      <item.icon />
                      {item.name}
                    </NavLink>
                  </NavItem>
                ))}
              </NavList>
            </NavSection>
          ))}

          <QuickAction as={Link} to="/personas/new" onClick={closeSidebar}>
            <FiPlus />
            Create Persona
          </QuickAction>
        </Navigation>

        <UserInfo>
          <UserName>{state.user.name}</UserName>
          <UserId>ID: {state.user.id.slice(0, 8)}...</UserId>
        </UserInfo>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        {/* Mobile Top Bar */}
        <TopBar>
          <MobileMenuButton onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </MobileMenuButton>
          <Logo>
            <LogoIcon>S</LogoIcon>
            SimuPersona
          </Logo>
          <div style={{ width: 40 }} /> {/* Spacer for centering */}
        </TopBar>

        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
}

export default Layout;
