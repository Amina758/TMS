require('dotenv').config();
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Present (first few chars: ' + process.env.OPENAI_API_KEY.substring(0, 5) + '...)' : 'Missing');
console.log('PORT:', process.env.PORT || 'Not set');
