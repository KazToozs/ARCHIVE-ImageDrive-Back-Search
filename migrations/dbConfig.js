const mysql      = require('mysql');
const util       = require('util');
const { dbConfig } = require('./vars');

class DbDriver {
   constructor() {
       this.config = {
        host     : dbConfig.db_host,
        user     : dbConfig.db_user,
        password : dbConfig.db_password,
        port     : dbConfig.db_port,
        database : dbConfig.db_db
        };
       this.connection = undefined;
       this.rollback = undefined;
   }

   async connect() {
       this.connection = mysql.createConnection(this.config);

       this.connection.connectPromise = (await util.promisify(this.connection.connect)).bind(this.connection);

       await this.connection.connectPromise();

       Object.keys(this.connection.__proto__).forEach(async key => {
           if(typeof this.connection.__proto__[key] === 'function')
               this.connection[`${key}Promise`] = (await util.promisify(this.connection[key])).bind(this.connection);   
       });
   }

   async query(query, params = []) {
       if(!this.connection || this.connection.state === 'disconnected') {
           await this.connect();
       }
       return this.connection.queryPromise(query, params);
   }

   disconnect() {
     if (this.connection !== undefined) {
       this.connection.end()
       this.connection = undefined
     }
   }
}

module.exports = DbDriver;
