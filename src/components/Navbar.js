import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Task Management System</Link>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/">Tasks</Link>
        </li>
        <li className="nav-item">
          <Link to="/create">Create Task</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;