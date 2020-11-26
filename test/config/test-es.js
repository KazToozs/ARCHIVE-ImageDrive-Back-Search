/* eslint-env mocha */

const { env, esConfig } = require('../../src/config/vars');
const EsDriver = require('../../src/config/esConfig')
const EsDao = require('../../src/api/services/elasticsearch')
// local testing config

exports.useInTest = function () {
    
    beforeEach(function connectToTestES(done) {
            this.es = new EsDriver(env);
            this.es.connect()
    })
    afterEach(function closeTestES(done) {
            const esDao = new EsDao(this.es.client, esConfig.es_index)
            esDao.dropIndex()
            this.es.disconnect()
    })
}