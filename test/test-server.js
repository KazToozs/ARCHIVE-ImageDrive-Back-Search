/* eslint-env mocha */
const request = require('supertest')
const serv = require('../main')

exports.useInTest = function() {
    before(async function startTestServer() {
        // Use our utility function that we created above to spawn the test server
        const testServer = serv
        const api = request(testServer)
        this.testServer = testServer
        this.api = api
    })
    after(function stopTestServer() {
       this.testServer.close()
    })
}