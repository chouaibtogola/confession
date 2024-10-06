import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-secret-key';

// In-memory storage (replace with a database in production)
let users = [];
let confessions = [];
let comments = [];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword, tier: 'free', lastConfession: null };
    users.push(user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ username: user.username }, JWT_SECRET);
      res.json({ token, user: { username: user.username, tier: user.tier, lastConfession: user.lastConfession } });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Get all confessions
app.get('/api/confessions', (req, res) => {
  res.json(confessions);
});

// Create a new confession
app.post('/api/confessions', authenticateToken, (req, res) => {
  const { content } = req.body;
  const user = users.find(u => u.username === req.user.username);
  
  const now = new Date();
  const lastConfessionDate = user.lastConfession ? new Date(user.lastConfession) : null;
  
  if (user.tier === 'free' && lastConfessionDate && now.getTime() - lastConfessionDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return res.status(403).json({ message: 'Free users can only confess once a week' });
  }
  
  if (user.tier === 'premium' && lastConfessionDate && now.getTime() - lastConfessionDate.getTime() < 24 * 60 * 60 * 1000) {
    return res.status(403).json({ message: 'Premium users can only confess once a day' });
  }
  
  const confession = { id: confessions.length + 1, content, likes: 0 };
  confessions.push(confession);
  user.lastConfession = now.toISOString();
  res.status(201).json(confession);
});

// Like a confession
app.post('/api/confessions/:id/like', authenticateToken, (req, res) => {
  const confession = confessions.find(c => c.id === parseInt(req.params.id));
  if (confession) {
    confession.likes++;
    res.json({ likes: confession.likes });
  } else {
    res.status(404).json({ message: 'Confession not found' });
  }
});

// Comment on a confession
app.post('/api/confessions/:id/comment', authenticateToken, (req, res) => {
  const { content } = req.body;
  const comment = { id: comments.length + 1, confessionId: parseInt(req.params.id), content };
  comments.push(comment);
  res.status(201).json(comment);
});

// Upgrade to premium
app.post('/api/upgrade', authenticateToken, (req, res) => {
  const user = users.find(u => u.username === req.user.username);
  if (user) {
    user.tier = 'premium';
    res.json({ user: { username: user.username, tier: user.tier, lastConfession: user.lastConfession } });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));