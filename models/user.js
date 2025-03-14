const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
const User = require('./user'); 

const userSchema = new mongoose.Schema({
  username: String,
  fullname: String,
  email: String,
  password: String,
  profileImage: String,
  contact: Number,
  boards: {
    type: Array,
    default: [],
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);