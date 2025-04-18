import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/CreateTask.css';
// Add to imports at the top
import { aiService } from '../services/aiService';

const CreateTask = () => {
  const { addTask, deleteTask, editTask, tasks } = useTaskContext();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Keep only one set of state declarations
  const [task, setTask] = useState({
    id: Date.now(),
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending',
    categories: [],
    tags: [],
    attachments: [],
    assignedTo: [],
    teamMembers: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'],
    comments: []
  });
  
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newComment, setNewComment] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState('');

  const predefinedCategories = [
    'Work', 'Personal', 'Study', 'Health', 'Shopping', 'Home'
  ];

  // Effects
  useEffect(() => {
    if (id) {
      const taskToEdit = tasks.find(task => task.id === parseInt(id));
      if (taskToEdit) {
        setTask(taskToEdit);
      }
    }
  }, [id, tasks]);

  // AI-related handlers
  const handleAISuggestions = async () => {
    if (!task.title || !task.description) {
      alert('Please enter title and description first');
      return;
    }

    setIsLoadingAI(true);
    try {
      const suggestions = await aiService.generateTaskSuggestions(
        task.title,
        task.description
      );
      setAiSuggestions(suggestions);
      
      if (window.confirm('Would you like to apply these AI suggestions to your task?')) {
        setTask(prev => ({
          ...prev,
          categories: suggestions.categories || prev.categories,
          tags: [...new Set([...prev.tags, ...(suggestions.tags || [])])],
          priority: suggestions.priority || prev.priority
        }));
      }
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      alert('Failed to get AI suggestions. Please try again.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!task.title) {
      alert('Please enter a task title first');
      return;
    }

    setIsLoadingAI(true);
    try {
      const description = await aiService.generateTaskDescription(task.title);
      if (!description) {
        throw new Error('No description generated');
      }
      setTask(prev => ({
        ...prev,
        description
      }));
    } catch (error) {
      console.error('Failed to generate description:', error);
      alert(error.message || 'Failed to generate description. Please try again.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.title.trim() || !task.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }
  
    try {
      if (id) {
        await editTask(parseInt(id), task);
        alert('Task updated successfully!');
      } else {
        await addTask(task);
        alert('Task created successfully!');
      }
      navigate('/');
    } catch (error) {
      console.error('Failed to save task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  // Remove these duplicate declarations (around line 124-150):
  // const [task, setTask] = useState({ ... });
  // const [newTag, setNewTag] = useState('');
  // const [newComment, setNewComment] = useState('');
  // const [dragOver, setDragOver] = useState(false);
  // const [fileError, setFileError] = useState('');
  // const predefinedCategories = [ ... ];

  // Continue with handleChange and other functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleReset = () => {
    setTask({
      id: Date.now(),
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending',
      categories: [],
      tags: [],
      attachments: [],
      assignedTo: [],
      teamMembers: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'],
      comments: []
    });
    setNewTag('');
    setNewComment(''); // Add this line
    setFileError('');
    setDragOver(false);
  };
  
  const handleTagAdd = (e) => {
    e.preventDefault();
    if (newTag.trim() && !task.tags.includes(newTag.trim())) {
      setTask(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };
  
  const removeTag = (tagToRemove) => {
    setTask(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const toggleCategory = (category) => {
    setTask(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };
  
  // Remove the handleFileUpload function since we're using handleFiles
  
  const removeAttachment = (fileName) => {
    setTask(prev => ({
      ...prev,
      attachments: prev.attachments.filter(file => file.name !== fileName)
    }));
  };
  
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
  
  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name} is too large. Maximum size is 5MB.`;
    }
    return null;
  };
  
  const handleFiles = (files) => {
    const fileList = Array.from(files);
    setFileError('');
  
    const validFiles = fileList.filter(file => {
      const error = validateFile(file);
      if (error) {
        setFileError(error);
        return false;
      }
      return true;
    });
  
    const filePromises = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            data: reader.result
          });
        };
        reader.readAsDataURL(file);
      });
    });
  
    Promise.all(filePromises).then(fileData => {
      setTask(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...fileData]
      }));
    });
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };
  
  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setTask(prev => ({
        ...prev,
        comments: [...prev.comments, {
          id: Date.now(),
          text: newComment.trim(),
          timestamp: new Date().toISOString(),
          author: 'Current User'
        }]
      }));
      setNewComment('');
    }
  };
  const handleEditComment = (commentId, newText) => {
    setTask(prev => ({
      ...prev,
      comments: prev.comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, text: newText }
          : comment
      )
    }));
  };
  
  const removeComment = (commentId) => {
    setTask(prev => ({
      ...prev,
      comments: prev.comments.filter(comment => comment.id !== commentId)
    }));
  };
  
  const toggleTeamMember = (member) => {
    setTask(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(member)
        ? prev.assignedTo.filter(m => m !== member)
        : [...prev.assignedTo, member]
    }));
  };
  
  const handleDelete = async () => {
    try {
      await deleteTask(task.id);  // Use deleteTask directly instead of removeTask
      alert('Task deleted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };
  
  return (
    <div className="create-task-container">
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit} className="create-task-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Enter task title"
          />
        </div>
  
        <div className="form-group">
          <label>Description</label>
          <div className="description-container">
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter task description"
              rows="4"
            />
            <div className="ai-buttons">
              <button
                type="button"
                onClick={handleGenerateDescription}
                className="ai-generate-btn"
                disabled={isLoadingAI || !task.title}
              >
                {isLoadingAI ? 'Generating...' : 'Generate Description'}
              </button>
              <button
                type="button"
                onClick={handleAISuggestions}
                className="ai-suggest-btn"
                disabled={isLoadingAI || !task.title || !task.description}
              >
                {isLoadingAI ? 'Analyzing...' : 'Get AI Suggestions'}
              </button>
            </div>
          </div>
          {aiSuggestions && (
            <div className="ai-suggestions">
              <h4>AI Suggestions</h4>
              <div className="suggestions-content">
                <p><strong>Categories:</strong> {aiSuggestions.categories?.join(', ')}</p>
                <p><strong>Tags:</strong> {aiSuggestions.tags?.join(', ')}</p>
                <p><strong>Priority:</strong> {aiSuggestions.priority}</p>
                <p><strong>Estimated Time:</strong> {aiSuggestions.estimatedTime}</p>
                <div className="task-breakdown">
                  <strong>Task Breakdown:</strong>
                  <ul>
                    {aiSuggestions.taskBreakdown?.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
                {aiSuggestions.recommendations && (
                  <div className="recommendations">
                    <strong>Additional Recommendations:</strong>
                    <p>{aiSuggestions.recommendations}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
  
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
  
        <div className="form-group">
          <label>Priority</label>
          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="form-control"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
  
        <div className="form-group">
          <label>Categories</label>
          <div className="categories-container">
            {predefinedCategories.map(category => (
              <button
                type="button"
                key={category}
                onClick={() => toggleCategory(category)}
                className={`category-btn ${task.categories.includes(category) ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
  
        <div className="form-group">
          <label>Tags</label>
          <div className="tags-input-container">
            <div className="tags-display">
              {task.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="tag-remove">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="tag-input-wrapper">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="tag-input"
              />
              <button type="button" onClick={handleTagAdd} className="tag-add-btn">
                Add
              </button>
            </div>
          </div>
        </div>
  
        <div className="form-group">
          <label>Attachments</label>
          <div 
            className={`file-upload-container ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={(e) => handleFiles(e.target.files)}
              multiple
              className="file-input"
              id="file-input"
            />
            <label htmlFor="file-input" className="file-upload-label">
              Choose Files
            </label>
            <p className="drop-zone-text">
              or drag and drop files here (max 5MB per file)
            </p>
            {fileError && <p className="file-error">{fileError}</p>}
          </div>
          <div className="attachments-list">
            {task.attachments.map((file, index) => (
              <div key={index} className="attachment-item">
                <span className="file-name">{file.name}</span>
                <span className="file-size">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(file.name)}
                  className="remove-file"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
  
        <div className="form-group">
          <label>Assign Team Members</label>
          <div className="team-members-container">
            {task.teamMembers.map(member => (
              <button
                type="button"
                key={member}
                onClick={() => toggleTeamMember(member)}
                className={`team-member-btn ${task.assignedTo.includes(member) ? 'active' : ''}`}
              >
                <span className="member-avatar">{member.charAt(0)}</span>
                <span className="member-name">{member}</span>
              </button>
            ))}
          </div>
        </div>
  
        <div className="form-group">
          <label>Comments</label>
          <div className="comments-container">
            <div className="comments-list">
              {task.comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author}</span>
                    <span className="comment-time">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-actions">
                    <button
                      type="button"
                      onClick={() => removeComment(comment.id)}
                      className="comment-remove"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newText = prompt('Edit comment:', comment.text);
                        if (newText && newText.trim()) {
                          handleEditComment(comment.id, newText.trim());
                        }
                      }}
                      className="comment-edit"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="comment-input-wrapper">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-input"
                rows="3"
              />
              <button
                type="button"
                onClick={handleAddComment}
                className="comment-add-btn"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
  
        <div className="form-actions">
          <button type="button" onClick={handleReset} className="btn-reset">
            Reset
          </button>
          <button type="button" onClick={() => navigate('/')} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            {id ? 'Update Task' : 'Create Task'}
          </button>
          {id && (
            <button type="button" onClick={handleDelete} className="btn-delete">
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
} // End of CreateTask component

export default CreateTask;