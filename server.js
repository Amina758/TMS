require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const aiRoutes = require('./src/server/routes/aiRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Debug middleware with more detailed logging
app.use((req, res, next) => {
  console.log('=== Incoming Request ===');
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

// Mount AI routes with error catching
app.use('/api/ai', async (req, res, next) => {
  try {
    console.log('AI route accessed:', req.path);
    await next();
  } catch (error) {
    console.error('AI Route Error:', error);
    res.status(500).json({ 
      error: 'AI service error', 
      details: error.message 
    });
  }
}, aiRoutes);

// Basic test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /test');
  console.log('- GET /api/ai/test');
  console.log('- POST /api/ai/generate-description');
});