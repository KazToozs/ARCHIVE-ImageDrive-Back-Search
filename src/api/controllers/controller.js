const { search } = require('../services/services')

exports.search = async (req, res) => {
  const offset = req.query.p * 20;
  const min = req.query.mn;
  const max = req.query.mx;
  const description = decodeURIComponent(req.query.d);
  const fileType = decodeURIComponent(req.query.t);

  // TODO remove log
  console.log(offset)
  console.log(min)
  console.log(max)
  console.log(description)
  console.log(fileType)

  try {
    const result = await search(offset, min, max, description, fileType);
    const data = result.hits.hits
    // TODO remove log
    console.log(data)
    if (data.length == 0) {
      res.sendStatus(204)
      return;
    }
    res.status(200).send(data)
  } catch (err) {
    // TODO remove log
    console.log(err)
    res.status(500).send(err)
  }
}