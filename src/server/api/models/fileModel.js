const mongoose = require('mongoose');

const { Schema } = mongoose;

const FileSchema = new Schema({
  src: {
    type: String
  },
  dataType: {
    type: String
  }
});

module.exports = mongoose.model('File', FileSchema);
