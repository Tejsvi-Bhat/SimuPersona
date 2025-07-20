# SimuPersona Backend API

A modular and scalable backend API for creating and managing AI personas that can engage in character-based conversations using OpenAI or Azure OpenAI services.

## Features

- 🎭 **Persona Management**: Create, update, delete, and manage AI personas with custom traits
- 🤖 **Dual AI Support**: Compatible with both OpenAI and Azure OpenAI services
- 💬 **Chat System**: Send messages and receive responses from personas
- 🔄 **Conversation History**: Support for maintaining conversation context
- 🛡️ **Security**: Rate limiting, input validation, and error handling
- 📊 **Analytics**: Persona statistics and usage tracking
- 🚀 **Scalable**: Clean architecture designed for multi-user scenarios

## API Endpoints

### Persona Management
- `POST /api/persona` - Create a new persona
- `GET /api/persona/:id` - Get a specific persona
- `PUT /api/persona/:id` - Update a persona
- `DELETE /api/persona/:id` - Delete a persona
- `GET /api/persona` - Get all personas for a user
- `POST /api/persona/:id/clone` - Clone a persona
- `GET /api/persona/stats/overview` - Get persona statistics

### Chat System
- `POST /api/chat` - Send a message to a persona
- `POST /api/chat/preview` - Preview conversation without storing
- `GET /api/chat/providers` - Get available AI providers
- `POST /api/chat/providers/default` - Set default AI provider
- `GET /api/chat/providers/:provider/test` - Test AI provider connection

### Documentation
- `GET /api/docs` - API documentation
- `GET /api/health` - Health check

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd simupersona-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Azure OpenAI Configuration (optional)
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint_here
AZURE_OPENAI_API_KEY=your_azure_openai_api_key_here
AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name_here

# Choose default provider
DEFAULT_AI_PROVIDER=openai
```

4. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3001 |
| `NODE_ENV` | Environment mode | No | development |
| `OPENAI_API_KEY` | OpenAI API key | Yes* | - |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint | Yes* | - |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key | Yes* | - |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Azure deployment name | Yes* | - |
| `DEFAULT_AI_PROVIDER` | Default AI provider | No | openai |
| `CORS_ORIGINS` | Allowed CORS origins | No | http://localhost:3000 |

*At least one AI provider must be configured

### AI Providers

The system supports two AI providers:

1. **OpenAI**: Direct integration with OpenAI's API
2. **Azure OpenAI**: Integration with Azure OpenAI Service

You can configure one or both providers. The system will automatically detect which providers are available based on your environment variables.

## API Usage Examples

### Creating a Persona

```bash
curl -X POST http://localhost:3001/api/persona \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Sarah Chen",
    "tone": "Professional yet friendly",
    "profession": "Data Scientist",
    "goals": "Help people understand complex data concepts",
    "personality_traits": ["analytical", "patient", "curious"],
    "background": "PhD in Statistics, 10 years industry experience",
    "speaking_style": "Clear explanations with real-world examples",
    "expertise_areas": ["machine learning", "statistics", "data visualization"],
    "userId": "user123"
  }'
```

### Sending a Chat Message

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "personaId": "persona-uuid",
    "message": "Can you explain machine learning in simple terms?",
    "provider": "openai",
    "userId": "user123"
  }'
```

### Testing AI Provider Connection

```bash
curl http://localhost:3001/api/chat/providers/openai/test
```

## Data Storage

The system uses JSON file storage by default (`data/personas.json`). This is designed to be easily replaceable with a database in production:

- PostgreSQL
- MongoDB
- MySQL
- Any other database of choice

The storage layer is abstracted in `src/services/PersonaStorage.js` for easy migration.

## Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Joi schema validation
- **CORS Protection**: Configurable CORS origins
- **Helmet Security**: Security headers
- **Error Handling**: Comprehensive error management
- **Input Sanitization**: XSS protection

## Development

### Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── models/          # Data models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Utilities and validation
└── index.js         # Main application file
```

### Adding New Features

1. **Models**: Define data structures in `src/models/`
2. **Services**: Implement business logic in `src/services/`
3. **Controllers**: Handle HTTP requests in `src/controllers/`
4. **Routes**: Define API endpoints in `src/routes/`
5. **Validation**: Add validation schemas in `src/utils/validation.js`

### Testing

```bash
npm test
```

## Production Deployment

1. **Environment**: Set `NODE_ENV=production`
2. **Database**: Replace JSON storage with a proper database
3. **Logging**: Configure proper logging service
4. **Monitoring**: Add application monitoring
5. **Load Balancing**: Use a load balancer for multiple instances
6. **SSL**: Ensure HTTPS in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue in the repository.
