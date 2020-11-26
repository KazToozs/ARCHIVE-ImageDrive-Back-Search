'use strict'

const AWS = require('aws-sdk');
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const {esConfig, env} = require('./vars');

let client;
if (env === 'test') {
  const node = `https://${esConfig.es_user}:${esConfig.es_pass}@${esConfig.es_host}:${esConfig.es_port}`
  client = new elasticsearch.Client({ node: node });
}
else {
  AWS.config.getCredentials(function (err) {
    if (err) {console.log(err.stack); throw(err);}
    else {
      console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
  });

  client = new elasticsearch.Client({  
      host: esConfig.es_host,
      log: 'error',
      connectionClass: connectionClass,
      amazonES: {
        credentials: AWS.config.credentials
      }
  });
}

// Test ES cluster
client.ping({}, function(error) {
  if (error) {
      console.log('ES Cluster is down', error);
  } else {
      console.log('ES Cluster is up!');
  }
});

module.exports = { esClient: client, index: esConfig.es_index };

