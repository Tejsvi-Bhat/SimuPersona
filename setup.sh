#!/bin/bash

# SimuPersona Project Startup Script
# This script helps you start both backend and frontend servers

echo "🚀 Starting SimuPersona Project..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if we're in the right directory
if [ ! -d "simupersona-backend" ] || [ ! -d "simupersona-frontend" ]; then
    echo "❌ Please run this script from the TejsviBhat directory"
    exit 1
fi

# Function to check if dependencies are installed
check_dependencies() {
    local dir=$1
    if [ ! -d "$dir/node_modules" ]; then
        echo "📦 Installing dependencies for $dir..."
        cd "$dir"
        npm install
        cd ..
    else
        echo "✅ Dependencies already installed for $dir"
    fi
}

# Install dependencies
check_dependencies "simupersona-backend"
check_dependencies "simupersona-frontend"

echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Configure your AI provider:"
echo "   - Copy simupersona-backend/.env.example to simupersona-backend/.env"
echo "   - Add your OpenAI API key or Azure OpenAI credentials"
echo ""
echo "2. Start the backend server:"
echo "   cd simupersona-backend"
echo "   npm run dev"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd simupersona-frontend"
echo "   npm start"
echo ""
echo "4. Open your browser to http://localhost:3000"
echo ""
echo "🔗 Useful URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001/api"
echo "   API Docs: http://localhost:3001/api/docs"
echo "   Health Check: http://localhost:3001/api/health"
echo ""
echo "📚 For more information, see the README files in each directory."
echo ""
echo "Happy chatting with your AI personas! 🎭✨"
