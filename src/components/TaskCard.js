import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TaskCard.css';

const TaskCard = ({ task, onStatusChange, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/task/${task.id}`);
  };

  return (
    <div className="task-card">
      <div className="task-card-content" onClick={handleClick}>
        <h3>{task.title}</h3>
        <p className="task-description">{task.description}</p>
        <div className="task-meta">
          <span className={`priority ${task.priority}`}>
            {task.priority}
          </span>
          <span className={`status ${task.status}`}>
            {task.status}
          </span>
        </div>
        <p className="due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
      <div className="task-actions">
        <select 
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="status-select"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="delete-btn"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;