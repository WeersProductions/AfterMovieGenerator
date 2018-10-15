const mongoose = require('mongoose');

const { Schema } = mongoose;

const FileOwnerSchema = new Schema({
  fileId: {
    type: Schema.Types.ObjectId,
    ref: 'Files'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  }
});

module.exports = mongoose.model('FileOwner', FileOwnerSchema);
