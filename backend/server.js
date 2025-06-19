const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const multer = require('multer');
const Item = require('./models/Item');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
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

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Student Marketplace API is running!' });
});

// Placeholder routes (we'll implement these next)
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/items', upload.single('image'), async (req, res) => {
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
      whatsapp
    });
    await item.save();
    res.status(201).json({ message: 'Item created', item });
  } catch (err) {
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
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 