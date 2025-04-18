const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * AI Service for task-related operations
 */
const aiService = {
  /**
   * Generate a task description based on a title
   * @param {string} title - The task title
   * @returns {Promise<string>} - The generated description
   */
  async generateTaskDescription(title) {
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

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate task description');
    }
  }
};

module.exports = aiService;
