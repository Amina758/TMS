require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
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
app.post('/api/ai/generate-description', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates detailed task descriptions based on titles. Provide a comprehensive but concise description that explains what the task involves."
          },
          {
            role: "user",
            content: `Generate a detailed description for a task with the title: "${title}"`
          }
        ],
        max_tokens: 250,
        temperature: 0.7,
      });

      const description = response.choices[0].message.content.trim();
      res.json({ description });
    } catch (aiError) {
      console.error('OpenAI API Error:', aiError);

      // Check if it's a rate limit error
      if (aiError.status === 429 || (aiError.error && aiError.error.type === 'insufficient_quota')) {
        // Provide a fallback description
        const fallbackDescription = generateFallbackDescription(title);
        res.json({
          description: fallbackDescription,
          note: "This description was generated locally due to API limits. For better results, please check your OpenAI API quota."
        });
      } else {
        throw aiError; // Re-throw other errors
      }
    }
  } catch (error) {
    console.error('Error generating description:', error);
    res.status(500).json({ error: error.message });
  }
});

// Function to generate a fallback description when the API is unavailable
function generateFallbackDescription(title) {
  // Simple template-based description generator
  const templates = [
    `This task involves creating a comprehensive ${title.toLowerCase()} with clear objectives and measurable outcomes.`,
    `For the ${title.toLowerCase()}, you will need to outline the key steps, identify resources needed, and set a timeline for completion.`,
    `The ${title.toLowerCase()} requires careful planning and execution to ensure all requirements are met efficiently.`,
    `When working on this ${title.toLowerCase()}, focus on prioritizing the most important elements first and breaking down complex parts into manageable steps.`
  ];

  // Select a random template
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template;
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`AI Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /api/ai/test');
  console.log('- POST /api/ai/generate-description');
  console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
});
