# SimuPersona - AI Persona Chat System

A comprehensive full-stack application for creating and interacting with AI personas using OpenAI or Azure OpenAI services. Build character-driven AI conversations with customizable personality traits, professional backgrounds, and expertise areas.

## 🚀 Project Overview

SimuPersona enables users to:
- **Create AI Personas**: Define unique characters with specific traits, tones, and expertise
- **Chat with Personas**: Engage in character-consistent conversations
- **Manage Conversations**: Track and export chat histories
- **Multi-Provider Support**: Use OpenAI or Azure OpenAI services
- **Scalable Architecture**: Designed for multi-user scenarios

## 📁 Project Structure

```
TejsviBhat/
├── simupersona-backend/     # Node.js/Express API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic & AI integration
│   │   ├── models/          # Data models
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Custom middleware
│   │   └── utils/           # Utilities & validation
│   ├── data/               # JSON data storage
│   └── package.json
└── simupersona-frontend/    # React web application
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/          # Page components
    │   ├── hooks/          # Custom React hooks
    │   ├── context/        # State management
    │   ├── services/       # API integration
    │   └── styles/         # Global styles & theme
    └── package.json
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **OpenAI API** - GPT models for AI responses
- **Azure OpenAI** - Alternative AI provider
- **JSON Storage** - File-based data persistence (easily replaceable)
- **Joi** - Input validation
- **Rate Limiting** - API protection

### Frontend
- **React 18** - Modern React with hooks
- **React Router 6** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client
- **Context API** - State management
- **React Hot Toast** - Notifications

## 🚦 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- OpenAI API key OR Azure OpenAI credentials

### 1. Clone & Setup
```bash
# Clone the repository
git clone <repository-url>
cd TejsviBhat
```

### 2. Backend Setup
```bash
cd simupersona-backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start backend server
npm run dev
```

Backend runs on `http://localhost:3001`

### 3. Frontend Setup
```bash
cd simupersona-frontend

# Install dependencies
npm install

# Start frontend development server
npm start
```

Frontend runs on `http://localhost:3000`

### 4. Configure AI Provider

Edit `simupersona-backend/.env`:

**For OpenAI:**
```env
OPENAI_API_KEY=your_openai_api_key_here
DEFAULT_AI_PROVIDER=openai
```

**For Azure OpenAI:**
```env
AZURE_OPENAI_ENDPOINT=your_azure_endpoint_here
AZURE_OPENAI_API_KEY=your_azure_key_here
AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name_here
DEFAULT_AI_PROVIDER=azure
```

## 📋 API Endpoints

### Persona Management
- `POST /api/persona` - Create persona
- `GET /api/persona/:id` - Get persona
- `PUT /api/persona/:id` - Update persona
- `DELETE /api/persona/:id` - Delete persona
- `GET /api/persona` - List user personas

### Chat System
- `POST /api/chat` - Send message to persona
- `POST /api/chat/preview` - Preview conversation
- `GET /api/chat/providers` - List AI providers
- `GET /api/chat/health` - Check AI service status

### Documentation
- `GET /api/docs` - API documentation
- `GET /api/health` - System health check

## 🎭 Creating Your First Persona

1. **Navigate to Dashboard** - `http://localhost:3000`
2. **Click "Create New Persona"**
3. **Fill in Details:**
   - **Name**: Dr. Sarah Chen
   - **Profession**: Data Scientist
   - **Tone**: Professional yet friendly
   - **Goals**: Help people understand complex data concepts
   - **Personality Traits**: analytical, patient, curious
   - **Background**: PhD in Statistics, 10 years experience
   - **Expertise**: machine learning, statistics, data visualization

4. **Save & Start Chatting!**

## 💬 Chat Features

- **Character Consistency**: AI maintains persona traits throughout conversations
- **Conversation History**: Full chat history with timestamp tracking
- **Multiple Providers**: Switch between OpenAI and Azure OpenAI
- **Export Conversations**: Download chat history as JSON
- **Preview Mode**: Test persona responses without saving

## 🔧 Configuration

### Environment Variables

**Backend** (`.env`):
```env
# Server
PORT=3001
NODE_ENV=development

# AI Providers
OPENAI_API_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=your_endpoint_here
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_here
DEFAULT_AI_PROVIDER=openai

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGINS=http://localhost:3000
```

**Frontend** (`.env`):
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 🏗️ Architecture Features

### Backend Architecture
- **Modular Design**: Clean separation of concerns
- **Error Handling**: Comprehensive error management
- **Input Validation**: Joi schema validation
- **Rate Limiting**: Multiple rate limit tiers
- **Security**: CORS, Helmet, input sanitization
- **Scalability**: Designed for multi-user scenarios

### Frontend Architecture
- **Component-Based**: Reusable UI components
- **State Management**: Context API with custom hooks
- **Responsive Design**: Mobile-first approach
- **Error Boundaries**: Graceful error handling
- **Professional UI**: Modern, clean interface

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Configure production database (replace JSON storage)
3. Set up proper logging service
4. Configure SSL/HTTPS
5. Set up monitoring

### Frontend Deployment
1. Run `npm run build`
2. Deploy to static hosting (Vercel, Netlify, S3)
3. Configure environment variables
4. Set up CDN for performance

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Protects against malicious input
- **CORS Protection**: Configurable origins
- **Error Handling**: No sensitive data exposure
- **API Key Security**: Environment variable protection

## 📊 Monitoring & Analytics

- Health check endpoints
- Error logging and tracking
- Usage statistics
- Performance monitoring
- AI provider status monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check individual README files in backend/frontend directories
- **Issues**: Open a GitHub issue for bugs or feature requests
- **API Docs**: Visit `http://localhost:3001/api/docs` when backend is running

## 🎯 Roadmap

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication & authorization  
- [ ] Real-time chat with WebSockets
- [ ] Persona sharing & marketplace
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Voice chat integration
- [ ] Custom AI model fine-tuning

---

**Built with ❤️ for creating engaging AI conversations**
