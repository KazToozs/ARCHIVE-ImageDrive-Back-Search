const path = require('path');

// import .env variables
require('dotenv-safe').config({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.NODE_ENV === 'test' ? process.env.TEST_APP_PORT : process.env.APP_PORT,
  origin: process.env.ORIGIN,
  esConfig: {
    es_host: process.env.NODE_ENV === 'test' ? process.env.TEST_ES_HOST : process.env.AWS_ES_HOST,
    es_user: process.env.NODE_ENV === 'test' ? process.env.TEST_ES_USER : process.env.AWS_ES_USER,
    es_pass: process.env.NODE_ENV === 'test' ? process.env.TEST_ES_PASSWORD : process.env.AWS_ES_PASSWORD,
    es_port: process.env.TEST_ES_PORT,
    es_index: process.env.ES_INDEX
  }
};