const EsDriver = require('../src/config/esConfig')
require('chai').use(require('chai-as-promised'))
const expect = require('chai').expect
const AWS = require('aws-sdk')

describe('AWS service', () => {

    it('should based on credentials', async function () {
        let esDriver = new EsDriver()
        AWS.config.getCredentials(()=>{})

        expect(esDriver.getAwsConfig()).to.eventually.be.deep.equal(AWS.config.credentials)
    })
})