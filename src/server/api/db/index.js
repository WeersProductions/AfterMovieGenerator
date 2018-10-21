const { Pool } = require('pg');

// TODO: set username and password.
const pool = new Pool();

module.exports = {
  query: (text, params) => {
    const start = Date.now();
    const result = pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: result.rowCount });
    return result;
  },
  getClient: (callback) => {
    pool.connect((err, client, done) => {
      const query = client.query.bind(client);

      // monkey patch the query method to keep track of the last query executed
      client.query = () => {
        client.lastQuery = arguments;
        client.query(...arguments);
      };

      // set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!');
        console.error(`The last executed query on this client was: ${client.lastQuery}`);
      }, 5000);

      const release = (err) => {
        // call the actual 'done' method, returning this client to the pool
        done(err);

        // clear our timeout
        clearTimeout(timeout);

        // set the query method back to its old un-monkey-patched version
        client.query = query;
      };

      callback(err, client, done);
    });
  }
};
