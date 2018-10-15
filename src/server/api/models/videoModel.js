const mongoose = require('mongoose');

const { Schema } = mongoose;

const VideoSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  filePaths: {
    type: [String]
  },
  videoPath: {
    type: String
  },
  songId: {
    type: Schema.Types.ObjectId,
    ref: 'Songs'
  }
});

module.exports = mongoose.model('Video', VideoSchema);
