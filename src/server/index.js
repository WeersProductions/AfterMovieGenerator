require('@babel/register');

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const session = require('express-session');
const MemcachedStore = require('connect-memjs')(session);
const passport = require('passport');
const config = require('./config');

// Get database models.
require('./api/models/audioModel');
require('./api/models/videoModel');

mongoose.Promise = global.Promise;
mongoose.connect(
  config.get('DATABASE_URL'),
  { useNewUrlParser: true }
);

// [START session]
// Configure the session and session storage
const sessionConfig = {
  resave: false,
  saveUninitialized: false,
  secret: config.get('SECRET'),
  signed: true
};

// In production use the Memcache instance to store session data,
// otherwise fallback to the default MemoryStore in development.
if (config.get('NODE_ENV') === 'production' && config.get('MEMCACHE_URL')) {
  if (config.get('MEMCACHE_USERNAME') && config.get('MEMCACHE_PASSWORD')) {
    sessionConfig.store = new MemcachedStore({
      servers: [config.get('MEMCACHE_URL')],
      username: config.get('MEMCACHE_USERNAME'),
      password: config.get('MEMCACHE_PASSWORD')
    });
  } else {
    sessionConfig.store = new MemcachedStore({
      servers: [config.get('MEMCACHE_URL')]
    });
  }
}

app.use(session(sessionConfig));
// [END session]

// OAuth2
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./api/lib/oauth2').router);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(function(req, res){
//     res.status(404).send({url: req.originalUrl + " not found"})
// });

// Get routes.
const audioRoutes = require('./api/routes/audioRoutes');

audioRoutes(app); // register the route
const videoRoutes = require('./api/routes/videoRoutes');

videoRoutes(app);

const server = app.listen(config.get('PORT'), () => {
  const { port } = server.address();
  console.log(`audio RESTful API server started on: ${port}`);
});
