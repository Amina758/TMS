import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const aiService = {
  async generateTaskDescription(title) {
    try {
      console.log('Generating description for title:', title);
      console.log('Sending request to:', `${API_BASE_URL}/ai/generate-description`);

      const response = await axios.post(`${API_BASE_URL}/ai/generate-description`, {
        title
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response received:', response.data);

      if (!response.data || !response.data.description) {
        console.error('Invalid response structure:', response.data);
        throw new Error('Invalid response from AI service');
      }

      return response.data.description;
    } catch (error) {
      console.error('AI Service Error:', error);

      // Fallback description generation if the API call fails
      console.log('Using fallback description generation');
      return generateFallbackDescription(title);
    }
  }
};

// Fallback description generator that works entirely on the frontend
function generateFallbackDescription(title) {
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