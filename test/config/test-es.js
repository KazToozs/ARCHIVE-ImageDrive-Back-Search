/* eslint-env mocha */

const elasticsearch = require('elasticsearch');
const { esConfig } = require('../../src/config/vars');


// local testing config

exports.useInTest = function () {
    before(async function connectToTestES() {
        const node = `https://${esConfig.es_user}:${esConfig.es_pass}@${esConfig.es_host}:${esConfig.es_port}`

        const client = new elasticsearch.Client({ node: node });

        // Test ES cluster
        client.ping({}, function (error) {
            if (error) {
                console.log('ES Cluster is down', error);
            } else {
                console.log('ES Cluster is up (test)!');
            }
        });
        if (await client.indices.exists({ index: esConfig.es_index })) {
            console.log("azdazdazdazdazd")
            try {
                let delRes = await this.esClient.indices.delete({ index: esConfig.es_index })
                console.log(JSON.stringify(delRes, null, 4));
            } catch (err) {
                console.log("Delete ES error:" + err)
            }
        }
        this.esClient = client;

    })
    beforeEach(async function createTestES() {
        try {
            let res = await this.esClient.indices.create({
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
            }, { ignore: [400] })
            console.log(res)
        } catch (err) {
            console.log("Create error: " + err)
        }
    })
    afterEach(async function dropTestES() {
        if (await this.esClient.indices.exists({ index: esConfig.es_index })) {
            try {
                let delRes = await this.esClient.indices.delete({ index: esConfig.es_index })
                console.log("swiggity swooty" + JSON.stringify(delRes, null, 4));
            } catch (err) {
                console.log("Delete ES error:" + err)
            }
        }
    })
    after(function closeTestES() {
        this.esClient.close()
    })
}