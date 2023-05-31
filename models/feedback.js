const mongoose = require('mongoose');

var feedbackSchema = mongoose.Schema({
  email: String,
  message: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
});

module.exports = mongoose.model('Feedback', feedbackSchema);
