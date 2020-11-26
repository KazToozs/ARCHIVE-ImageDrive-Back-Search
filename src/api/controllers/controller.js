const { ESsearch } = require('../services/services')

exports.search = async (req, res) => {
  const offset = req.query.p * 20;
  const min = req.query.mn;
  const max = req.query.mx;
  const description = decodeURIComponent(req.query.d);
  const fileType = decodeURIComponent(req.query.t);

  try {
    const result = await ESsearch(offset, min, max, description, fileType);
    const data = result.hits.hits
    if (data.length == 0) {
      res.sendStatus(204)
      return;
    }
    res.status(200).send(data)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}