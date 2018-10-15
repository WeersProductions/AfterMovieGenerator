const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserShema = new Schema({
  email: {
    type: String
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  accountSource: {
    type: String
  }
});

module.exports = mongoose.model('User', UserShema);
