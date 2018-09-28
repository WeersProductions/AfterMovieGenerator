require('@babel/register');

const express = require('express');

const app = express();

const port = process.env.PORT || 5000;

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

require('./api/models/audioModel');
require('./api/models/videoModel');

mongoose.Promise = global.Promise;
mongoose.connect(
  'mongodb://localhost:27017/Songdb',
  { useNewUrlParser: true }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(function(req, res){
//     res.status(404).send({url: req.originalUrl + " not found"})
// });

const audioRoutes = require('./api/routes/audioRoutes');
// importing route
audioRoutes(app); // register the route
const videoRoutes = require('./api/routes/videoRoutes');

videoRoutes(app);

app.listen(port);

console.log(`audio RESTful API server started on: ${port}`);
