const mongoose = require('mongoose');

const { Schema } = mongoose;

const SongSchema = new Schema({
  name: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  bpm: {
    type: Number,
    default: 120
  },
  beats: {
    type: [Number]
  },
  interestingPoints: {
    type: [Number]
  },
  totalMax: {
    type: Number
  },
  peaks: {
    type: [Number]
  },
  duration: {
    type: Number
  },
  rawSong: Buffer
});

module.exports = mongoose.model('Songs', SongSchema);
