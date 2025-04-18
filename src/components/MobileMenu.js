import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MobileMenu.css';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="mobile-menu-container">
      <button 
        className={`hamburger-button ${isOpen ? 'open' : ''}`} 
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h2>Task Management System</h2>
          <button 
            className="close-button" 
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>
        
        <nav className="mobile-nav">
          <ul>
            <li>
              <button onClick={() => navigateTo('/')}>Dashboard</button>
            </li>
            <li>
              <button onClick={() => navigateTo('/create')}>Create Task</button>
            </li>
          </ul>
        </nav>
      </div>
      
      {isOpen && <div className="mobile-menu-overlay" onClick={toggleMenu}></div>}
    </div>
  );
};

export default MobileMenu;
