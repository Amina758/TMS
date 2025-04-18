const express = require('express');
const router = express.Router();

// Basic test route
router.get('/test', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Routes working'
  });
});

module.exports = router;