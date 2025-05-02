

  const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect('mongodb+srv://aab258025:fKzaDAccjrrvSH4r@cluster0clu.rqounwe.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Models
const Post = mongoose.model('Post', {
  text: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const Visitor = mongoose.model('Visitor', {
  ipAddress: String,
  visitedAt: { type: Date, default: Date.now }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 } // 1MB limit
});

// Routes
app.post('/api/posts', upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    let imagePath = null;

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const post = new Post({
      text: text || null,
      image: imagePath || null
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/visits', async (req, res) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    await Visitor.create({ ipAddress: ip });
    const count = await Visitor.countDocuments();
    res.json({ totalVisitors: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});