// const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema({
//   text: {
//     type: String,
//     default: null
//   },
//   image: {
//     type: String,
//     default: null
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Post', postSchema);




const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  text: { type: String, default: null },
  image: { type: String, default: null }, // base64 encoded string
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);
