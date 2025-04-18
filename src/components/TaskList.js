import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import '../styles/TaskList.css';
import { useTaskContext } from '../context/TaskContext';
import { aiService } from '../services/aiService';

const TaskList = () => {
  const navigate = useNavigate();
  const { tasks, loading, error, deleteTask } = useTaskContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all'
  });
  const [expandedTask, setExpandedTask] = useState(null);
  const [taskSummary, setTaskSummary] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  if (loading) return (
    <div className="loading-state">
      <p>Loading tasks...</p>
    </div>
  );

  if (error) return (
    <div className="error-state">
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="retry-btn">
        Retry
      </button>
    </div>
  );

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleTaskClick = async (taskId) => {
    if (expandedTask === taskId) {
      // If clicking the same task, collapse it
      setExpandedTask(null);
      setTaskSummary('');
      return;
    }

    // Expand the task
    setExpandedTask(taskId);
    const task = tasks.find(t => t.id === taskId);

    if (task) {
      setIsLoadingAI(true);
      try {
        const summary = await aiService.generateTaskSummary(task);
        setTaskSummary(summary);
      } catch (error) {
        console.error('Failed to get AI summary:', error);
        setTaskSummary('Unable to generate AI summary at this time.');
      } finally {
        setIsLoadingAI(false);
      }
    }
  };

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>My Tasks</h2>
        <div className="filters">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="tasks-grid">
        {filteredTasks.length === 0 ? (
          <p className="no-tasks">
            {searchTerm ? 'No tasks match your search' : 'No tasks available'}
          </p>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`task-card ${expandedTask === task.id ? 'expanded' : ''}`}
              onClick={() => handleTaskClick(task.id)}
            >
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <span className={`task-priority priority-${task.priority}`}>
                  {task.priority}
                </span>
              </div>

              <div className="task-meta">
                <span className="task-status">{task.status}</span>
                <span className="task-due-date">Due: {task.dueDate}</span>
              </div>

              <p className="task-description">{task.description}</p>

              <div className="task-categories">
                {task.categories.map(category => (
                  <span key={category} className="task-category">
                    {category}
                  </span>
                ))}
              </div>

              {expandedTask === task.id && (
                <div className="task-ai-summary">
                  <h4>AI Task Summary</h4>
                  {isLoadingAI ? (
                    <p className="loading-summary">Generating AI summary...</p>
                  ) : (
                    <p>{taskSummary}</p>
                  )}
                </div>
              )}

              <div className="task-footer">
                <div className="task-members">
                  {task.assignedTo.map(member => (
                    <span key={member} className="member-avatar">
                      {member.charAt(0)}
                    </span>
                  ))}
                </div>

                <div className="task-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit/${task.id}`);
                    }}
                    className="task-action-btn edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task.id);
                    }}
                    className="task-action-btn delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;