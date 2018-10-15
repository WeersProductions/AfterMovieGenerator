const mongoose = require('mongoose');

const User = mongoose.model('Users');

exports.add_user = function addUser(email, accountSource) {
  const newUser = new User({
    email,
    accountSource
  });

  newUser.save((err) => {
    if (err) {
      console.log(err);
    }
  });

  return newUser;
};

exports.get_user = function getUser(email) {
  User.findOne({ email }, (err, user) => {
    if (err) {
      console.log(err);
    }
    console.log(user);
    return user;
  });
};
