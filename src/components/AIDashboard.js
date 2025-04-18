import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import { aiService } from '../services/aiService';
import '../styles/AIDashboard.css';

const AIDashboard = () => {
  const navigate = useNavigate();
  const { tasks } = useTaskContext();
  const [isLoading, setIsLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [prompt, setPrompt] = useState('');

  const generateTaskInsights = async () => {
    if (tasks.length === 0) {
      alert('You need to have tasks to generate insights');
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, we would call the AI service with the tasks data
      // For demonstration purposes, we'll use a combination of local calculations and simulated AI response

      // Calculate task distributions locally
      const priorityDistribution = {
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length,
      };

      const statusDistribution = {
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
      };

      const mostCommonCategories = getMostCommonCategories(tasks);

      // Use the AI service to generate recommendations based on task data
      const taskSummary = tasks.map(t => `${t.title}: ${t.priority} priority, status: ${t.status}`).join('\n');

      try {
        // Call the AI service for recommendations
        const aiResponse = await aiService.generateTaskSummary({
          taskCount: tasks.length,
          priorityDistribution,
          statusDistribution,
          categories: mostCommonCategories.map(c => c.category),
          summary: taskSummary
        });

        // Parse recommendations from AI response or use fallback
        let recommendations = [
          'Consider breaking down high-priority tasks into smaller subtasks',
          'You have several overdue tasks that need attention',
          'Try to balance your workload by redistributing tasks across team members'
        ];

        if (aiResponse) {
          // Try to extract recommendations from AI response
          const aiRecommendations = aiResponse.split('\n').filter(line => line.trim().length > 0).slice(0, 3);
          if (aiRecommendations.length > 0) {
            recommendations = aiRecommendations;
          }
        }

        setAiInsights({
          priorityDistribution,
          statusDistribution,
          recommendations,
          mostCommonCategories,
        });
      } catch (aiError) {
        console.error('AI service error:', aiError);
        // Fallback to local insights if AI service fails
        setAiInsights({
          priorityDistribution,
          statusDistribution,
          recommendations: [
            'Consider breaking down high-priority tasks into smaller subtasks',
            'You have several overdue tasks that need attention',
            'Try to balance your workload by redistributing tasks across team members'
          ],
          mostCommonCategories,
        });
      }
    } catch (error) {
      console.error('Failed to generate insights:', error);
      alert('Failed to generate AI insights');
    } finally {
      setIsLoading(false);
    }
  };

  const getMostCommonCategories = (tasks) => {
    const categoryCount = {};
    tasks.forEach(task => {
      task.categories.forEach(category => {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });

    return Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, count]) => ({ category, count }));
  };

  const handleCustomPrompt = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    try {
      // Use the AI service to process the custom prompt
      const taskData = {
        taskCount: tasks.length,
        taskSummary: tasks.map(t => `${t.title} (${t.priority})`).join(', '),
        userPrompt: prompt
      };

      try {
        // Call the AI service with the custom prompt
        const aiResponse = await aiService.generateTaskSummary(taskData);

        setAiInsights({
          customResponse: aiResponse || `Here's my analysis based on your prompt: "${prompt}"\n\nBased on your current tasks, I recommend focusing on completing the high-priority items first. You should also consider delegating some of the less critical tasks to team members who have capacity.`
        });
      } catch (aiError) {
        console.error('AI service error:', aiError);
        // Fallback response if AI service fails
        setAiInsights({
          customResponse: `Here's my analysis based on your prompt: "${prompt}"\n\nBased on your current tasks, I recommend focusing on completing the high-priority items first. You should also consider delegating some of the less critical tasks to team members who have capacity.`
        });
      }
    } catch (error) {
      console.error('Failed to process custom prompt:', error);
      alert('Failed to process your prompt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-dashboard-container">
      <div className="ai-dashboard-header">
        <h1>AI Task Assistant</h1>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Dashboard
        </button>
      </div>

      <div className="ai-dashboard-content">
        <div className="ai-actions">
          <div className="ai-card">
            <h2>Task Insights</h2>
            <p>Generate AI-powered insights about your tasks to improve productivity</p>
            <button
              onClick={generateTaskInsights}
              disabled={isLoading}
              className="ai-button"
            >
              {isLoading ? 'Generating...' : 'Generate Insights'}
            </button>
          </div>

          <div className="ai-card">
            <h2>Custom Analysis</h2>
            <p>Ask the AI assistant anything about your tasks</p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., What are my highest priority tasks this week?"
              className="ai-prompt-input"
            />
            <button
              onClick={handleCustomPrompt}
              disabled={isLoading || !prompt.trim()}
              className="ai-button"
            >
              {isLoading ? 'Processing...' : 'Get Analysis'}
            </button>
          </div>
        </div>

        {aiInsights && (
          <div className="ai-insights">
            <h2>AI Insights</h2>

            {aiInsights.customResponse ? (
              <div className="custom-response">
                <p>{aiInsights.customResponse}</p>
              </div>
            ) : (
              <>
                <div className="insights-grid">
                  <div className="insight-card">
                    <h3>Priority Distribution</h3>
                    <div className="distribution">
                      <div className="distribution-item">
                        <span className="label">High</span>
                        <div className="bar">
                          <div
                            className="bar-fill high"
                            style={{ width: `${(aiInsights.priorityDistribution.high / tasks.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="count">{aiInsights.priorityDistribution.high}</span>
                      </div>
                      <div className="distribution-item">
                        <span className="label">Medium</span>
                        <div className="bar">
                          <div
                            className="bar-fill medium"
                            style={{ width: `${(aiInsights.priorityDistribution.medium / tasks.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="count">{aiInsights.priorityDistribution.medium}</span>
                      </div>
                      <div className="distribution-item">
                        <span className="label">Low</span>
                        <div className="bar">
                          <div
                            className="bar-fill low"
                            style={{ width: `${(aiInsights.priorityDistribution.low / tasks.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="count">{aiInsights.priorityDistribution.low}</span>
                      </div>
                    </div>
                  </div>

                  <div className="insight-card">
                    <h3>Status Distribution</h3>
                    <div className="distribution">
                      <div className="distribution-item">
                        <span className="label">Pending</span>
                        <div className="bar">
                          <div
                            className="bar-fill pending"
                            style={{ width: `${(aiInsights.statusDistribution.pending / tasks.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="count">{aiInsights.statusDistribution.pending}</span>
                      </div>
                      <div className="distribution-item">
                        <span className="label">In Progress</span>
                        <div className="bar">
                          <div
                            className="bar-fill in-progress"
                            style={{ width: `${(aiInsights.statusDistribution.inProgress / tasks.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="count">{aiInsights.statusDistribution.inProgress}</span>
                      </div>
                      <div className="distribution-item">
                        <span className="label">Completed</span>
                        <div className="bar">
                          <div
                            className="bar-fill completed"
                            style={{ width: `${(aiInsights.statusDistribution.completed / tasks.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="count">{aiInsights.statusDistribution.completed}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="insight-card">
                  <h3>AI Recommendations</h3>
                  <ul className="recommendations-list">
                    {aiInsights.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="insight-card">
                  <h3>Most Common Categories</h3>
                  <div className="categories-list">
                    {aiInsights.mostCommonCategories.map((item, index) => (
                      <div key={index} className="category-item">
                        <span className="category-name">{item.category}</span>
                        <span className="category-count">{item.count} tasks</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDashboard;
