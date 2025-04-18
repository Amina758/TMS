export const taskService = {
  getAllTasks: async () => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    return tasks;
  },

  createTask: async (task) => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const newTask = { ...task, id: Date.now() };
    const updatedTasks = [...tasks, newTask];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    return newTask;
  },

  updateTask: async (id, taskData) => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, ...taskData } : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    return taskData;
  },

  deleteTask: async (id) => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const filteredTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
  }
};