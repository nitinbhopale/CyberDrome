const mongoose = require('mongoose');
var passwordLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
});

UserSchema.plugin(passwordLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
