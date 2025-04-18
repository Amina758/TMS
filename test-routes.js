require('dotenv').config();
const express = require('express');
const app = express();
const aiRoutes = require('./src/server/routes/aiRoutes');

app.use(express.json());
app.use('/api/ai', aiRoutes);

// Print out the registered routes
console.log('Registered routes:');

// List the routes from aiRoutes
console.log('AI Routes:');
aiRoutes.stack.forEach(layer => {
  if (layer.route) {
    const path = layer.route.path;
    const methods = Object.keys(layer.route.methods).join(',');
    console.log(`${methods} /api/ai${path}`);
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
