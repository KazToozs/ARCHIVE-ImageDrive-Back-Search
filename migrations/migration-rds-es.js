require('dotenv').config()
const EsDriver = require('../src/config/esConfig')
const EsDao = require('../src/api/services/elasticsearch')
const mysql = require('mysql')

async function migrateRDSToES() {
    const pool = mysql.createPool({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        port     : process.env.DB_PORT,
        database : 'main'
        });
    
    let esDriver = new EsDriver()
    esDriver.connect()
    /*
      Schema
      id: number = AutoIncrement [PrimaryKey]
      description: string = null
      type: string
      size: number
    */

    pool.getConnection((err, con) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Connected to database.');

        con.query('SELECT * FROM main.uploads;', async function (error, result, fields) {
            console.log(result);
            try {
                let delRes = await esDriver.client.indices.delete({ index: 'images' })
                console.log(JSON.stringify(delRes, null, 4));
            } catch (err) {
                console.log("Delete error:" + err)
            }
            try {
                let res = await esDriver.client.indices.create({
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

            const body = result.flatMap(doc => [{ index: { _index: 'images'}}, doc])
            try {
                const resp = await esDriver.client.bulk({ refresh: true, body })
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

            try {
                const count = await esDriver.client.count({ index: 'images' })
                console.log(count)
            } catch (err) {
                console.log("Count error: " + err)
                return;
            }

            try {
                let esDao = new EsDao(esDriver.client, 'images')
                const result = await esDao.search(0, 0, 500000, null, null);
                const data = result.hits.hits
                
                // TODO remove log
                console.log(data)
            } catch (err) {
                console.log("Count error: " + err)
                return;
            }

        });
        con.release()
        pool.end()
    })


    // const result = await esconfig.esClient.search({
    //     index: 'images'
    //   })
    //   console.log(result);




}

migrateRDSToES();