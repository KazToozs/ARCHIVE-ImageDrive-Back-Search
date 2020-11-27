const { env, esConfig } = require('../src/config/vars');
const EsDriver = require('../src/config/esConfig')
const DbDriver = require('./utils/dbConfig')

/*
    Schema
    id: number = AutoIncrement [PrimaryKey]
    description: string = null
    type: string
    size: number
*/

async function migrateRDSToES() {
    const db = new DbDriver();
    const es = new EsDriver(env);

    console.log("Please wait, migration can take a few seconds...")
    try {
        // Data pickup from RDS and prep
        await db.connect();
        let result = await db.query('SELECT * FROM main.uploads;')
        const body = result.flatMap(doc => [{ index: { _index: esConfig.es_index }}, doc])

        // ES init
        await es.connect()
        if ((await es.client.indices.exists({index: esConfig.es_index}))) {
            await es.client.indices.delete({ index: esConfig.es_index})
        }
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
        es.client.bulk({ refresh: true, body }, async function (err) {
            if (err) {
              console.log("Failed Bulk operation", err)
            } else {
              console.log("SUCCESSFULLY MIGRATED RDS TO ES");
              console.log(await es.client.count({ index: esConfig.es_index }))
              es.disconnect()
            }
          })
    } catch (err) {
        console.log("MIGRATION FROM RDS TO AWS-ES FAILED:")
        console.log(err)
        es.disconnect()
    }
    db.disconnect()
}

migrateRDSToES();