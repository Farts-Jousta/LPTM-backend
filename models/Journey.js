const mongoose = require('mongoose');

const JourneySchema = mongoose.Schema({
  startId: String,
  endId: String,
  userId: { type: mongoose.Schema.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Journey', JourneySchema)