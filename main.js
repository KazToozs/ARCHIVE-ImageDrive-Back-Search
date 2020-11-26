const { port, env } = require('./src/config/vars');
const app = require('./src/config/express');


// listen to requests
const server = app.listen(app.get('port'), () => console.log(`server started on port ${port} (${env})`));

// /**
// * Exports express
// * @public
// */
module.exports = server;
