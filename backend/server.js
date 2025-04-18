const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// Updated CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Add test route
// Add this test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'success', message: 'Backend is connected!' });
});

// Data storage path
const dataPath = path.join(__dirname, 'data', 'tasks.json');

// Ensure data directory exists
const ensureDataFile = async () => {
  try {
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
    try {
      await fs.access(dataPath);
    } catch {
      await fs.writeFile(dataPath, '[]');
    }
  } catch (error) {
    console.error('Error initializing data file:', error);
  }
};

ensureDataFile();

// Routes
app.get('/api/tasks', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ message: 'Error reading tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const tasks = JSON.parse(data);
    const newTask = { ...req.body, id: Date.now() };
    tasks.push(newTask);
    await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2));
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});