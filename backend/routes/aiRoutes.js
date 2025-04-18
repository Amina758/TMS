const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Test route to verify AI routes are working
router.get('/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'AI routes are working'
  });
});

// Generate task description based on title
router.post('/generate-description', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const description = await aiService.generateTaskDescription(title);
    res.json({ description });
  } catch (error) {
    console.error('Error generating description:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
