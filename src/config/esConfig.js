const { esConfig } = require('./vars');
const elasticsearch = require("elasticsearch")
const AWS = require('aws-sdk')
const connectionClass = require('http-aws-es');

class EsDriver {
  constructor(env) {
    this.client = undefined;
    this.env = env;
  }

  async getAwsConfig() {
    return new Promise(function (resolve, reject) {
      AWS.config.getCredentials(async function (err) {
        if (err) {
          return reject(err);
        } else {
          resolve(
            AWS.config.credentials
          );
        }
      });
    });
  }

  async connect() {
    let params
    if (this.env === 'test') {
      params = { node: `https://${esConfig.es_user}:${esConfig.es_pass}@${esConfig.es_host}:${esConfig.es_port}` }
    }
    else {
      const creds = await this.getAwsConfig()
      params = {
        host: esConfig.es_host,
        log: 'error',
        connectionClass: connectionClass,
        amazonES: {
          credentials: creds
        }
      }
    }
    this.client = new elasticsearch.Client(params);
  }

  disconnect() {
    if (this.client !== undefined) {
      this.client.close()
      this.client = undefined
    }
  }
}

module.exports = EsDriver;
