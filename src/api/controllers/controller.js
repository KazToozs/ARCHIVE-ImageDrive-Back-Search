const ESDao = require('../services/elasticsearch')
const EsDriver = require('../../config/esConfig')
const { esConfig, env } = require('../../config/vars')

exports.search = async (req, res) => {
  const offset = req.query.p * 20;
  const min = req.query.mn;
  const max = req.query.mx;
  const description = decodeURIComponent(req.query.d);
  const fileType = decodeURIComponent(req.query.t);
  const es = new EsDriver(env)

  try {
    await es.connect()
    let esDao = new ESDao(es.client, esConfig.es_index)
    const result = await esDao.search(offset, min, max, description, fileType);
    const data = result.hits.hits
    console.log(data)
    if (data.length == 0) {
      res.sendStatus(204)
      es.disconnect()
      return;
    }
    res.status(200).send(data)
    es.disconnect()
  } catch (err) {
    res.status(500).send(err)
    es.disconnect()
  }
}