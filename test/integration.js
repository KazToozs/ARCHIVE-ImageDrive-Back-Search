/* eslint-env mocha */
const testServer = require('./test-server')
const testES = require('./test-server')
const fs = require('fs');
const path = require('path');

describe('POST /upload', function() {
    testServer.useInTest()
    testES.useInTest()

    it('responds with 200 when values found', async function() {
        const api = this.api;
        const client = this.esClient;

        const rawdata = fs.readFileSync(path.join(__dirname, './mocks/request-data.json'));
        const result = JSON.parse(rawdata);
        const body = result.flatMap(doc => [{ index: { _index: 'images'}}, doc])
        try {
            const resp = await client.bulk({ refresh: true, body })
            console.log(resp)
            if (resp.errors) {
                const erroredDocuments = []
                // The items array has the same order of the dataset we just indexed.
                // The presence of the `error` key indicates that the operation
                // that we did for the document has failed.
                resp.items.forEach((action, i) => {
                    const operation = Object.keys(action)[0]
                    if (action[operation].error) {
                        erroredDocuments.push({
                            // If the status is 429 it means that you can retry the document,
                            // otherwise it's very likely a mapping error, and you should
                            // fix the document before to try it again.
                            status: action[operation].status,
                            error: action[operation].error,
                            operation: body[i * 2],
                            document: body[i * 2 + 1]
                        })
                    }
                })
                console.log(erroredDocuments)
            }
        } catch (err) {
            console.log("Insert error: " + err)
            return;
        }


        api
        .get('/search')
        .expect(200)
    })

    it('responds with 204 when no values found', async function() {
        const api = this.api;

        api
        .get('/search')
        .expect(204)
    })

})