const CONFIG = require('../common/inc.config');
module.exports = class dbconn {
    constructor() {
        this.mongo_client = require('mongodb').MongoClient;
        this.client = new this.mongo_client(CONFIG.DB_ENDPOINT, { useNewUrlParser: true, useUnifiedTopology: true });
        this.connection = this.client.connect();
        this.db = this.client.db(CONFIG.DB_NAME);
        this.cgdb = this.client.db(CONFIG.CGDB_NAME);
        this.mrdb = this.client.db(CONFIG.MRDB_NAME);
        //this.dbName = 'mr_racer';
    }

    async dbclose() {
        await (await this.connection).close();
    }
}