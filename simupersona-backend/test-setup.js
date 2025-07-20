const dotenv = require('dotenv');
dotenv.config();

console.log('Testing backend setup...');
console.log('PORT:', process.env.PORT);
console.log('AZURE_OPENAI_ENDPOINT:', process.env.AZURE_OPENAI_ENDPOINT);
console.log('DEFAULT_AI_PROVIDER:', process.env.DEFAULT_AI_PROVIDER);

// Test persona creation
const Persona = require('./src/models/Persona');

const testPersona = new Persona({
  name: 'Test Persona',
  profession: 'Software Engineer',
  tone: 'friendly',
  goals: 'Help with coding questions',
  personality_traits: 'patient, analytical, helpful',
  background: 'Years of experience in software development',
  communication_style: 'Clear and concise',
  expertise: 'JavaScript, React, Node.js',
  interests: 'Technology, gaming, reading',
  userId: 'test-user-123'
});

console.log('\nTest Persona Created:');
console.log('Name:', testPersona.name);
console.log('Personality Traits:', testPersona.personality_traits);
console.log('Expertise Areas:', testPersona.expertise_areas);
console.log('Speaking Style:', testPersona.speaking_style);

console.log('\nSystem Prompt:');
console.log(testPersona.generateSystemPrompt());

console.log('\nBackend setup test completed successfully! ✅');
