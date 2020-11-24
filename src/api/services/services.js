const { esClient, index } = require('../../config/esConfig');

exports.search = async (offset, min, max, description, fileType) => {
    if (isNaN(offset) || offset < 0) {
      offset = 0;
    }
    if (isNaN(min) || offset < 0) {
      min = 0;
    }
    if (isNaN(max) || offset < 0) {
      max = 500000
    }
    let request = {
      from: offset,
      size: 20,
      index: index,
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

    if (description && description !== 'undefined') {
      request.body.query.bool.must.unshift({
        match: { 
          description: { 
            query: description // value: description || query: description
          }
        }
      })
    }
    if (fileType && fileType !== 'undefined') {
      console.log('wut: '+ fileType)
      request.body.query.bool = {
        ...request.body.query.bool,
        filter: {
          term: {
            type: fileType
          }
        }
      }
    }

    console.log(request)
    return esClient.search(request);
  }