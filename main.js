const { port, env } = require('./src/config/vars');
const app = require('./src/config/express');


main()
// listen to requests
async function main() {
    app.listen(app.get('port'), () => console.log(`server started on port ${port} (${env})`));
}

// /**
// * Exports express
// * @public
// */
module.exports = app;
