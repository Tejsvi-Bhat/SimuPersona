# 🚀 Quick Start Guide

## Prerequisites
- Node.js 16+ installed
- OpenAI API key OR Azure OpenAI credentials

## 1. Get API Keys

### Option A: OpenAI
1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)

### Option B: Azure OpenAI
1. Go to [Azure Portal](https://portal.azure.com)
2. Create or access your Azure OpenAI resource
3. Get endpoint URL and API key from "Keys and Endpoint"

## 2. Setup Project

### Windows Users:
```bash
# Run the setup script
setup.bat
```

### Mac/Linux Users:
```bash
# Make script executable and run
chmod +x setup.sh
./setup.sh
```

### Manual Setup:
```bash
# Install backend dependencies
cd simupersona-backend
npm install

# Install frontend dependencies  
cd ../simupersona-frontend
npm install
```

## 3. Configure Environment

Copy and edit the environment file:
```bash
cd simupersona-backend
cp .env.example .env
```

Edit `.env` with your credentials:

**For OpenAI:**
```env
OPENAI_API_KEY=sk-your-openai-key-here
DEFAULT_AI_PROVIDER=openai
```

**For Azure OpenAI:**
```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-azure-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
DEFAULT_AI_PROVIDER=azure
```

## 4. Start the Application

### Terminal 1 - Backend:
```bash
cd simupersona-backend
npm run dev
```
✅ Backend running at `http://localhost:3001`

### Terminal 2 - Frontend:
```bash
cd simupersona-frontend
npm start
```
✅ Frontend running at `http://localhost:3000`

## 5. Create Your First Persona

1. Open `http://localhost:3000`
2. Click "Create New Persona"
3. Fill in the details:
   - **Name**: Dr. Alex Thompson
   - **Profession**: Software Engineer
   - **Tone**: Friendly and helpful
   - **Goals**: Help people learn programming
   - **Personality**: patient, analytical, encouraging
4. Save and start chatting!

## 🔗 Useful URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **API Documentation**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/api/health

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Verify your API keys in `.env` file
- Check `npm install` completed successfully

### Frontend won't start  
- Check if port 3000 is available
- Verify backend is running first
- Clear browser cache

### AI responses not working
- Verify API keys are correct
- Check network connection
- Test provider connection at `/api/chat/health`

### Common Issues
- **Rate limiting**: Wait a few minutes if you hit rate limits
- **CORS errors**: Make sure backend is running on port 3001
- **API errors**: Check backend logs for detailed error messages

## 📚 Next Steps

- Read the full README files in each directory
- Explore the API documentation
- Create multiple personas with different personalities
- Try switching between OpenAI and Azure providers
- Export your conversations

## 🎭 Example Personas to Try

1. **Sherlock Holmes** - Detective, analytical, Victorian era
2. **Marie Curie** - Scientist, passionate about research, inspiring
3. **Tony Stark** - Engineer, confident, innovative
4. **Bob Ross** - Artist, calm, encouraging, nature-loving

Happy building! 🚀
