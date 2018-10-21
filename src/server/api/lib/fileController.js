const UserController = require('./userController');

const db = require('../db');

exports.add_file = function addFile(email, fileSrc) {
  const { rows } = db.query(
    'with new_file as (insert into file (src, datatype) values ($1, $2) returning file_id) insert into fileowner (file_id) values((select file_id from new_file), (select account.account_id from account where account.email=$3));',
    [email, 'TODO:insert file type', fileSrc]
  );
  return rows[0];
};

exports.get_files = async function getFiles(email) {
  const { rows } = db.query(
    'SELECT file.* FROM file, account, fileowner WHERE account.email=$1 AND fileowner.account_id=account.account_id AND file.file_id=fileowner.file_id;',
    [email]
  );
  console.log('Get_files result:');
  console.log(rows);
  return rows;
};
