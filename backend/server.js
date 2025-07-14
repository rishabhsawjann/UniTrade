const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({path: './config.env'});
const path = require('path');
const multer = require('multer');
const Item = require('./models/Item');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://uni-trade-chi.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-marketplace';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// JWT auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Student Marketplace API is running!' });
});

// Placeholder routes (we'll implement these next)
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find({ sold: { $ne: true } }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Error type:', typeof err, err);
    console.error(err.stack || JSON.stringify(err, null, 2) || err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/items', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, location, whatsapp } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const item = new Item({
      title,
      description,
      price,
      category,
      location,
      imageUrl,
      whatsapp,
      user: req.user.id
    });
    await item.save();
    res.status(201).json({ message: 'Item created', item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create item', details: err.message });
  }
});

app.get('/api/users', (req, res) => {
  res.json({ message: 'Get all users' });
});

// Get single item by ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('Error type:', typeof err, err);
    console.error(err.stack || JSON.stringify(err, null, 2) || err);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// User registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, university } = req.body;
    if (!name || !email || !password || !university) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      university
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error type:', typeof err, err);
    console.error(err.stack || JSON.stringify(err, null, 2) || err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, university: user.university } });
});

// Delete item by ID (owner only)
app.delete('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.user.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error type:', typeof err, err);
    console.error(err.stack || JSON.stringify(err, null, 2) || err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Mark item as sold
app.patch('/api/items/:id/sold', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.user.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    item.sold = true;
    await item.save();
    res.json({ message: 'Item marked as sold' });
  } catch (err) {
    console.error('Error type:', typeof err, err);
    console.error(err.stack || JSON.stringify(err, null, 2) || err);
    res.status(500).json({ error: 'Failed to mark as sold' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 