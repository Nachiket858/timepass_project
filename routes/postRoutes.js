

// const express = require('express');
// const multer = require('multer');
// const router = express.Router();

// const Post = require('../models/Post');
// const Visitor = require('../models/Visitor');

// // Use memory storage for base64 encoding
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Unified route for both text and/or image
// router.post('/', upload.single('image'), async (req, res) => {
//   try {
    
//     const { content } = req.body;
//     let imageData = null;

//     if (req.file) {
//       imageData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
//     }

//     const post = new Post({
//       text: content || null,
//       image: imageData || null
//     });

//     await post.save();
//     res.status(201).json(post);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all posts (latest first)
// router.get('/', async (req, res) => {
//   try {
//     const posts = await Post.find().sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Track visitors
// router.post('/visit', async (req, res) => {
//   try {
//     const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     await Visitor.create({ ipAddress: ip });
//     const count = await Visitor.countDocuments();
//     res.json({ totalVisitors: count });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;



const express = require('express');
const multer = require('multer');
const router = express.Router();

const Post = require('../models/Post');
const Visitor = require('../models/Visitor');

// Use memory storage for base64 encoding
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Unified route for both text and/or image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body; // <-- this is the fix (was 'content' before)
    let imageData = null;

    if (req.file) {
      imageData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const post = new Post({
      text: text || null,
      image: imageData || null
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts (latest first)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Track visitors
router.post('/visit', async (req, res) => {
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
