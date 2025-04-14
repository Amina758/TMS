import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/TaskDetails.css';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(null);

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const foundTask = tasks.find(t => t.id === parseInt(id));
    setTask(foundTask);
    setEditedTask(foundTask);
  }, [id]);

  const handleSave = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = tasks.map(t => 
      t.id === parseInt(id) ? editedTask : t
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTask(editedTask);
    setIsEditing(false);
  };

  if (!task) return <div>Task not found</div>;

  return (
    <div className="task-details">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Tasks
      </button>
      
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
            className="edit-input"
          />
          <textarea
            value={editedTask.description}
            onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
            className="edit-textarea"
          />
          <input
            type="date"
            value={editedTask.dueDate}
            onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
            className="edit-input"
          />
          <select
            value={editedTask.priority}
            onChange={(e) => setEditedTask({...editedTask, priority: e.target.value})}
            className="edit-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="edit-actions">
            <button onClick={() => setIsEditing(false)} className="cancel-btn">
              Cancel
            </button>
            <button onClick={handleSave} className="save-btn">
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="task-info">
          <div className="task-header">
            <h2>{task.title}</h2>
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit Task
            </button>
          </div>
          <p className="task-description">{task.description}</p>
          <div className="task-meta">
            <span className={`priority ${task.priority}`}>
              Priority: {task.priority}
            </span>
            <span className={`status ${task.status}`}>
              Status: {task.status}
            </span>
          </div>
          <p className="due-date">
            Due Date: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;