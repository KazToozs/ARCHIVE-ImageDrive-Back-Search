/* eslint-env mocha */
const testServer = require('./test-server')
const testES = require('./config/test-es')
const fs = require('fs');
const path = require('path');
const EsDriver = require('../src/config/esConfig')
const { esConfig, env } = require('../src/config/vars')
const serv = require('../main')
const request = require('supertest');

describe('POST /upload', function() {
    const api = request(serv)
    let es;

    before(async function () {
        es = new EsDriver(env);
        es.connect()
        if (!(await es.client.indices.exists({index: esConfig.es_index}))) {
            await es.client.indices.create({
                index: esConfig.es_index,
                body: {
                  mappings: {
                    properties: {
                      id: { type: 'integer' },
                      description: { type: 'text' },
                      type: { type: 'keyword' },
                      size: { type: 'integer' }
                    }
                  }
                }
              })
        }
        es.disconnect()
    }); 
    it ('responds with 200 to basic get', () => {
        return api
        .get('/')
        .expect(200)
    })
    it('responds with 204 when no values found', function() {
        return api
        .get('/search')
        .expect(204)
    })
    it('responds with 200 when values found', function() {        
        // create values
        const rawdata = fs.readFileSync(path.join(__dirname, './mocks/request-data.json'));
        const result = JSON.parse(rawdata);
        const body = result.flatMap(doc => [{ index: { _index: 'images'}}, doc])
        es = new EsDriver(env);
        es.connect()
        es.client.bulk({ refresh: true, body }, function (err, response) {
            if (err) {
              console.log("Failed Bulk operation", err)
            } else {
              console.log("Successfully imported bulk");
              return api
                .get('/search')
                .expect(200)
            }
          })
        es.disconnect()

        
    })
    it('responds with 204 if search values are invalid', async function() {
        return api
        .get('/search?p=&mn=&mx=&d=&t=')
        .expect(204)
    })
    it('responds with 200 if search values are valid', async function() {
        const rawdata = fs.readFileSync(path.join(__dirname, './mocks/request-data.json'));
        const result = JSON.parse(rawdata);
        const body = result.flatMap(doc => [{ index: { _index: 'images'}}, doc])
        es = new EsDriver(env);
        es.connect()
        es.client.bulk({ refresh: true, body }, function (err, response) {
            if (err) {
              console.log("Failed Bulk operation", err)
            } else {
              console.log("Successfully imported bulk");
              return api
              .get('/search?p=0&mn=0&mx=500000')
              .expect(200)
            }
          })
     
    })
    after(async function (){
        es = new EsDriver(env);
        es.connect()
        await es.client.indices.delete({ index: esConfig.es_index })
        es.disconnect()
        serv.close()
    })
})