const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier'); // Required to stream buffer to Cloudinary

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
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

// Cloudinary config
cloudinary.config({
  cloud_name: 'df2cnr6vm',
  api_key: '759156692943927',
  api_secret: '4KnweOR_kfs88VPHS8Tv-CvN08c'
});

// Multer configuration to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 } }); // 1MB

// Helper: upload image buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'posts' }, (error, result) => {
      if (result) resolve(result.secure_url);
      else reject(error);
    });
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// Routes
app.post('/api/posts', upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const post = new Post({
      text: text || null,
      image: imageUrl || null
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
