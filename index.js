// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // MongoDB Connection
// mongoose.connect('mongodb+srv://aab258025:fKzaDAccjrrvSH4r@cluster0clu.rqounwe.mongodb.net/', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('MongoDB Connected'))
//   .catch(err => console.error(err));

// // Routes
// const postRoutes = require('./routes/postRoutes');
// app.use('/api/posts', postRoutes);

// // Start server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://aab258025:fKzaDAccjrrvSH4r@cluster0clu.rqounwe.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Routes
const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
