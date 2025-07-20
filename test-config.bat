@echo off
echo Testing SimuPersona Backend Configuration...
echo.

cd simupersona-backend

echo Checking environment variables...
echo AZURE_OPENAI_ENDPOINT=%AZURE_OPENAI_ENDPOINT%
echo DEFAULT_AI_PROVIDER=%DEFAULT_AI_PROVIDER%
echo.

echo Starting server test...
node -e "
const dotenv = require('dotenv');
dotenv.config();

const AIService = require('./src/services/AIService');
const service = new AIService();

console.log('Available providers:', service.getAvailableProviders());
console.log('Default provider:', service.getCurrentProvider());
console.log('Test completed successfully!');
"

pause
