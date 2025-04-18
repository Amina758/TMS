const express = require('express');
const cors = require('cors');
const localAiService = require('./src/server/services/localAiService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Body:', JSON.stringify(req.body));
  next();
});

// Test route
app.get('/api/ai/test', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'AI routes are working'
  });
});

// Generate task description based on title
app.post('/api/ai/generate-description', (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Generate description using local AI service
    const description = localAiService.generateTaskDescription(title);
    
    res.json({ 
      description,
      source: 'local-ai'
    });
  } catch (error) {
    console.error('Error generating description:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test AI Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /api/ai/test');
  console.log('- POST /api/ai/generate-description');
});
