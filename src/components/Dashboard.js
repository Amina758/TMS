import React from 'react';
import { useNavigate } from 'react-router-dom';
import TaskList from './TaskList';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Task Management System</h1>
        <div className="dashboard-actions">
          <button 
            onClick={() => navigate('/create')} 
            className="dashboard-btn btn-create"
          >
            Create New Task
          </button>
        </div>
      </div>
      <TaskList />
    </div>
  );
};

export default Dashboard;