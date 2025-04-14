import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateTask.css';

const CreateTask = () => {
  const navigate = useNavigate();
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
    comments: []  // Add comma here
  });
  const [newTag, setNewTag] = useState('');
  const [newComment, setNewComment] = useState('');

  const predefinedCategories = [
    'Work', 'Personal', 'Study', 'Health', 'Shopping', 'Home'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title.trim() || !task.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = [...savedTasks, task];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    // Show success message
    alert('Task created successfully!');
    navigate('/');
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

  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState('');
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
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Enter task description"
            rows="4"
          />
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
                  <button
                    type="button"
                    onClick={() => removeComment(comment.id)}
                    className="comment-remove"
                  >
                    Delete
                  </button>
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
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;