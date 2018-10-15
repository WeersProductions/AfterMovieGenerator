const mongoose = require('mongoose');

const UserController = require('./userController');

// Load models.
const File = mongoose.model('Files');
const FileOwner = mongoose.model('FileOwners');

exports.add_file = function addFile(email, fileSrc) {
  const newFile = new File({
    fileSrc
  });

  newFile.save((err) => {
    if (err) {
      console.log(err);
    }

    const newFileOwner = new FileOwner({
      fileId: newFile._id,
      userId: UserController.get_user(email)._id
    });
    console.log(newFileOwner);

    newFileOwner.save((fileOwnerError) => {
      if (fileOwnerError) {
        console.log(fileOwnerError);
      }
      return newFile;
    });
  });
};

exports.get_files = function getFiles(email) {
  User.find({ userId: UserController.get_user(email)._id }, (err, fileOwner) => {
    if (err) {
      console.log(err);
    }
    console.log(user);
    return user;
  });
};
