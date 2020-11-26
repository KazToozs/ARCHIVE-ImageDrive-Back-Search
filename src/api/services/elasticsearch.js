class ESDao {
  constructor(es, index) {
    this.es = es;
    this.index = index
  }

  async search(offset, min, max, description, fileType) {
    if (isNaN(offset) || offset < 0 || offset == undefined) {
      offset = 0;
    }
    if (isNaN(min) || min < 0 || min == undefined || !min) {
      min = 0;
    }
    if (isNaN(max) || max < 0 || max == undefined || !max) {
      max = 500000;
    }

    let request = {
      from: offset,
      size: 20,
      index: this.index,
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  size: {
                    from: min,
                    to: max
                  }
                }
              }
            ],
          }

        }
      }
    }

    if (description && description !== 'undefined' && description != undefined && description != '') {
      console.log('here')
      request.body.query.bool.must.unshift({
        match: {
          description: {
            query: description // value: description || query: description
          }
        }
      })
    }
    if (fileType && fileType !== 'undefined' && description != undefined  && description != '') {
      request.body.query.bool = {
        ...request.body.query.bool,
        filter: {
          term: {
            type: fileType
          }
        }
      }
    }

    return this.es.search(request);
  }
}

module.exports = ESDao;