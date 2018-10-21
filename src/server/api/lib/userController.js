const db = require('../db');

exports.add_user = function addUser(email, accountSource) {
  const { rows } = db.query('INSERT INTO account(email, accountsource) values($1, $2);', [
    email,
    accountSource
  ]);
  return rows[0];
};

exports.get_account = function getAccount(email) {
  const { rows } = db.query('SELECT * FROM account WHERE account.email = $1;', [email]);
  return rows[0];
};
