const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
  firstname: String,
  secondname: String,
  aboutme: String,
  userId: { type: mongoose.Schema.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Profile', ProfileSchema)