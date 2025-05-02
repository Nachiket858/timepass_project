

const express = require('express');
const multer = require('multer');
const router = express.Router();

const Post = require('../models/Post');
const Visitor = require('../models/Visitor');

// Use memory storage for base64 encoding
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
router.post('/api/posts', upload.single('image'), async (req, res) => {
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

router.get('/api/posts', async (req, res) => {
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

router.post('/api/visits', async (req, res) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    await Visitor.create({ ipAddress: ip });
    const count = await Visitor.countDocuments();
    res.json({ totalVisitors: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
