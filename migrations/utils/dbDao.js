class DbDao {
    constructor(db) {
        this.db = db;
    }

    async create(image) {
        return this.db.query("INSERT INTO uploads(description, type, size) VALUES(?,?,?);", [image.description, image.type, image.size]);
    }

    async dropTable() {
        return this.db.query(`DROP TABLE IF EXISTS uploads;`)
    }

    async createTable() {
        return this.db.query('CREATE TABLE IF NOT EXISTS uploads(id int NOT NULL AUTO_INCREMENT, description varchar(256), type varchar(30), size int, PRIMARY KEY(id));')
    }
}

module.exports = DbDao;