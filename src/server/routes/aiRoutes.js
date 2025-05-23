const express = require('express');
const router = express.Router();
const localAiService = require('../services/localAiService');

// Basic test route
router.get('/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'AI routes are working'
  });
});

// Generate task description based on title
router.post('/generate-description', (req, res) => {
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

module.exports = router;