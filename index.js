const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const projectRoutes = require('./routes/projects');
const goalRoutes = require('./routes/goals');
const aiRoutes = require('./routes/ai');
const kanbanRoutes = require('./routes/kanban');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://devboard-frontend-chi.vercel.app/'  // replace with your actual Vercel URL
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/kanban', kanbanRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'DevBoard API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});