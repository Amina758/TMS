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

// Basic test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Mount AI routes
app.use('/api/ai', aiRoutes);

// Log all requests
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// Error handling middleware - must be last
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /test');
  console.log('- GET /api/ai/test');
  console.log('- POST /api/ai/generate-description');
});