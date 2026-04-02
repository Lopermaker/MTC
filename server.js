import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(path.join(dbDir, 'users.db'));
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    avatar TEXT
  )
`);
try {
  db.exec(`ALTER TABLE users ADD COLUMN avatar TEXT`);
} catch (e) {}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const SECRET = 'lexicon-super-secret-key-2026'; // In production, use process.env.JWT_SECRET

// Validator Functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// JWT Middleware for Route Protection
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Register
app.post('/api/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format' });
  if (!isValidPassword(password)) return res.status(400).json({ error: 'Password must be at least 6 characters long' });

  try {
    const hash = bcrypt.hashSync(password, 10);
    const userName = name || email.split('@')[0];
    const defaultAvatar = `https://api.dicebear.com/9.x/bottts/svg?seed=${userName}`;
    
    const stmt = db.prepare('INSERT INTO users (email, password, name, avatar) VALUES (?, ?, ?, ?)');
    const info = stmt.run(email, hash, userName, defaultAvatar);
    
    const token = jwt.sign({ id: info.lastInsertRowid, email, name: userName }, SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: userName, email, avatar: defaultAvatar } });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'An account with this email already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);
    
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });
    
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid email or password' });
    
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Current User
app.get('/api/me', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare('SELECT name, email, avatar FROM users WHERE id = ?');
    const user = stmt.get(req.user.id);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Avatar
app.put('/api/me/avatar', authenticateToken, (req, res) => {
  const { avatar } = req.body;
  if (!avatar) return res.status(400).json({ error: 'Avatar is required' });
  
  try {
    const stmt = db.prepare('UPDATE users SET avatar = ? WHERE id = ?');
    stmt.run(avatar, req.user.id);
    res.json({ success: true, avatar });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`User Auth Server running on port ${PORT}`);
});
