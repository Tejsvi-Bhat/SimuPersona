@echo off
echo.
echo 🚀 Starting SimuPersona Project...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo.

REM Check if we're in the right directory
if not exist "simupersona-backend" (
    echo ❌ Please run this script from the TejsviBhat directory
    pause
    exit /b 1
)
if not exist "simupersona-frontend" (
    echo ❌ Please run this script from the TejsviBhat directory
    pause
    exit /b 1
)

REM Install backend dependencies
if not exist "simupersona-backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd simupersona-backend
    npm install
    cd ..
) else (
    echo ✅ Backend dependencies already installed
)

REM Install frontend dependencies
if not exist "simupersona-frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd simupersona-frontend
    npm install
    cd ..
) else (
    echo ✅ Frontend dependencies already installed
)

echo.
echo 🎯 Next Steps:
echo.
echo 1. Configure your AI provider:
echo    - Copy simupersona-backend\.env.example to simupersona-backend\.env
echo    - Add your OpenAI API key or Azure OpenAI credentials
echo.
echo 2. Start the backend server:
echo    cd simupersona-backend
echo    npm run dev
echo.
echo 3. In a new terminal, start the frontend:
echo    cd simupersona-frontend
echo    npm start
echo.
echo 4. Open your browser to http://localhost:3000
echo.
echo 🔗 Useful URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:3001/api
echo    API Docs: http://localhost:3001/api/docs
echo    Health Check: http://localhost:3001/api/health
echo.
echo 📚 For more information, see the README files in each directory.
echo.
echo Happy chatting with your AI personas! 🎭✨
echo.
pause
