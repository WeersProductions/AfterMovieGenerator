const nconf = require('nconf');

module.exports = nconf;
const path = require('path');

nconf
  // 1. Command-line arguments
  .argv()
  // 2. Enviroment variables
  .env([
    'CLOUD_BUCKET',
    'DATA_BACKEND',
    'GCLOUD_PROJECT',
    'INSTANCE_CONNECTION_NAME',
    'SQL_USER',
    'SQL_PASSWORD',
    'NODE_ENV',
    'PORT',
    'SECRET',
    'OAUTH2_CLIENT_ID',
    'OAUTH2_CLIENT_SECRET',
    'OAUTH2_CLIENT_CALLBACK',
    'DATABASE_URL',
    'DATABASE_NAME'
  ])
  // 3. Config file
  .file({ file: path.join(__dirname, 'config.json') })
  // 4. Defaults
  .defaults({
    // Typically you will create a bucket with the same name as your project ID.
    CLOUD_BUCKET: 'aftermoviegenerator',

    DATA_BACKEND: 'postgresql',

    OAUTH2_CLIENT_ID: '',
    OAUTH2_CLIENT_SECRET: '',
    OAUTH2_CALLBACK: 'http://localhost:5000/auth/google/callback',

    // Id of the project in the Google Cloud Developers console.
    GCLOUD_PROJECT: 'aftermoviegenerator',
    PORT: 5000,

    SECRET: 'keyboardcat',

    // DATABASE_URL: 'postgresql://localhost:27017',
    DATABASE_NAME: 'aftermovie'
  });

// CHeck for required settings
checkConfig('GCLOUD_PROJECT');
checkConfig('CLOUD_BUCKET');
checkConfig('OAUTH2_CLIENT_ID');
checkConfig('OAUTH2_CLIENT_SECRET');
// checkConfig('DATABASE_URL');

if (nconf.get('DATA_BACKEND') === 'postgresql') {
  checkConfig('SQL_USER');
  checkConfig('SQL_PASSWORD');
  checkConfig('DATABASE_NAME');
  if (nconf.get('NODE_ENV') === 'production') {
    checkConfig('INSTANCE_CONNECTION_NAME');
  }
}

function checkConfig(setting) {
  if (!nconf.get(setting)) {
    throw new Error(`You must set ${setting} as an environment variable or in config.json!`);
  }
}
