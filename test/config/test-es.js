/* eslint-env mocha */

const elasticsearch = require('elasticsearch');
const config = require('./test-config');

// local testing config

// const client = new Client({ host: config.aws_es_host });

exports.useInTest = function() {
    before(async function connectToTestES() {
        const node = `https://${config.es_user}:${config.es_pass}@${config.es_host}:${config.es_port}`

        const client = new elasticsearch.Client({ node: node });

        // Test ES cluster
        client.ping({}, function(error) {
            if (error) {
                console.log('ES Cluster is down', error);
            } else {
                console.log('ES Cluster is up!');
            }
        });

        try {
            let res = await client.indices.create({
                index: 'images',
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
            return;
        }
        this.esClient = client;
    })
    beforeEach(async function dropTestES() {
        try {
            let delRes = await client.indices.delete({ index: 'images' })
            console.log(JSON.stringify(delRes, null, 4));
        } catch (err) {
            console.log("Delete ES error:" + err)
        }
    })
    after(function disconnectTestES() {
        try {
            let delRes = await client.indices.delete({ index: 'images' })
            console.log(JSON.stringify(delRes, null, 4));
        } catch (err) {
            console.log("Delete ES error:" + err)
        }
    })
}