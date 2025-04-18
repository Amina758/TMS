import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CreateTask from './components/CreateTask';
import './styles/App.css';
import './styles/responsive.css';
import { TaskProvider } from './context/TaskContext';

function App() {
  return (
    <TaskProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateTask />} />
            <Route path="/edit/:id" element={<CreateTask />} />
          </Routes>
        </div>
      </Router>
    </TaskProvider>
  );
}

export default App;
