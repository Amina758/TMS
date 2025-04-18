import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const aiService = {
  async generateTaskDescription(title) {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/generate-description`, {
        title
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.data || !response.data.description) {
        throw new Error('Invalid response from AI service');
      }

      return response.data.description;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate description');
    }
  }
};