# SimuPersona Frontend

A modern React application for creating and interacting with AI personas. Built with React 18, styled-components, and a professional UI design.

## Features

- 🎨 **Modern UI**: Clean, professional interface with responsive design
- 🎭 **Persona Management**: Create, edit, and manage AI personas
- 💬 **Chat Interface**: Real-time conversations with AI personas
- 🔄 **State Management**: Efficient global state with Context API
- 📱 **Responsive**: Works seamlessly on desktop and mobile
- 🎯 **User Experience**: Intuitive navigation and user-friendly interactions

## Tech Stack

- **React 18** - Modern React with hooks and context
- **React Router 6** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful notifications
- **React Icons** - Comprehensive icon library

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- SimuPersona Backend running (see backend README)

### Installation

1. **Navigate to frontend directory**
```bash
cd simupersona-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` if needed:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

4. **Start the development server**
```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (not recommended)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.js       # Main layout wrapper
│   └── ErrorBoundary.js # Error handling
├── pages/              # Page components
│   ├── Dashboard.js    # Main dashboard
│   ├── PersonaList.js  # Persona management
│   ├── PersonaForm.js  # Persona creation/editing
│   ├── ChatPage.js     # Chat interface
│   └── Settings.js     # Application settings
├── hooks/              # Custom React hooks
│   ├── usePersonas.js  # Persona management
│   └── useChat.js      # Chat functionality
├── context/            # React Context providers
│   └── AppContext.js   # Global application state
├── services/           # API and external services
│   └── api.js          # HTTP client and API calls
├── styles/             # Global styles and themes
│   └── GlobalStyles.js # Styled-components theme
├── App.js              # Root component
└── index.js            # Application entry point
```

## Features Overview

### Dashboard
- Overview of all personas
- Quick stats and recent activity
- Quick action buttons for common tasks

### Persona Management
- Create new personas with detailed traits
- Edit existing personas
- Delete personas with confirmation
- Clone personas for variations

### Chat Interface
- Real-time messaging with AI personas
- Conversation history
- Multiple AI provider support (OpenAI/Azure)
- Export conversations

### Settings
- AI provider configuration
- User preferences
- System status monitoring

## API Integration

The frontend communicates with the SimuPersona backend API:

- **Personas**: CRUD operations for persona management
- **Chat**: Real-time messaging with AI models
- **Providers**: AI service configuration and testing

## Styling & Theme

The app uses a consistent design system with:

- **Colors**: Primary blue theme with semantic color variants
- **Typography**: Inter font family with consistent sizing
- **Spacing**: Standardized spacing scale
- **Components**: Reusable styled components
- **Responsive**: Mobile-first responsive design

## Development

### Adding New Components

1. Create component in appropriate directory
2. Follow naming conventions (PascalCase)
3. Use styled-components for styling
4. Implement proper error handling
5. Add to relevant route if needed

### State Management

The app uses React Context for global state:

- **AppContext**: Global application state
- **Custom Hooks**: Feature-specific state logic
- **Local State**: Component-specific state

### API Calls

All API interactions go through the `services/api.js` module:

- Centralized HTTP client configuration
- Error handling and retry logic
- Request/response interceptors
- Type-safe API methods

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` directory.

## Deployment

The app can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Connect GitHub repo
- **AWS S3**: Upload build directory
- **Docker**: Use provided Dockerfile

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:3001/api` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
