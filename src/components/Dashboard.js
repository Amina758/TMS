import React, { useEffect } from 'react';
import { testConnection } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import TaskList from './TaskList';
import MobileMenu from './MobileMenu';
import '../styles/Dashboard.css';

const Dashboard = () => {
  useEffect(() => {
    const testBackend = async () => {
      try {
        await testConnection();
        console.log('Backend connection successful');
      } catch (error) {
        console.error('Backend connection failed:', error);
      }
    };
    testBackend();
  }, []);
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <MobileMenu />
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
      <div className="responsive-test">
        <p>This text should be red on desktop, blue on tablet, and green on mobile</p>
      </div>
      <TaskList />
    </div>
  );
};

export default Dashboard;