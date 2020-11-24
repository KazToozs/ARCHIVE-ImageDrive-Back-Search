const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const router = require('../api/routes');
const { port, origin } = require('./vars');

/**
* Express instance
* @public
*/
const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// secure apps by setting various HTTP headers
app.use(helmet.hidePoweredBy());

// enable CORS - Cross Origin Resource Sharing
const corsOptions = {
    origin: origin // Compliant
  };
app.use(cors(corsOptions));

// mount api v1 routes
app.use('/', router);

app.set('port', port || 8080);

app.get('/', function(req, res, next) {
  res.status(200).json({ name: 'backend-search' })
})

module.exports = app;
