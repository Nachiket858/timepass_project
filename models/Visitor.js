// const mongoose = require('mongoose');

// const visitorSchema = new mongoose.Schema({
//   ipAddress: String,
//   visitedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Visitor', visitorSchema);



const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ipAddress: String,
  visitedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Visitor', visitorSchema);
