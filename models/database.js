const pg = require('pg');

class Database {
    constructor(url, client) {
        this.connection = new pg.Client({
            connectionString: url,
            ssl: { rejectUnauthorized: false }
        });
        this.client = client;
        this.connection.connect();
    }

    async getUser(user, callback) {
        let query = 'SELECT * FROM users WHERE id = $1';
        this.connection.query(query, [user.id], (err, res) => {
            if (err) {
                this.client.logger.error(`Failed to get user ${user.id} due to: ${err.stack}`)
                return undefined
            }
            return callback(res.rows[0]);
        });
    }

    async addUser(user) {
        let query = 'INSERT INTO users(id, points) VALUES ($1, 0)';
        this.connection.query(query, [user.id]).catch(err => {
            if (err) this.client.logger.error(`Failed to add user ${user.id} due to: ${err.stack}`);
        });
    }

    async addPoints(user, points, callback) {
        let query = 'UPDATE users SET points = points + $1 WHERE id = $2';
        this.connection.query(query, [points, user.id], (err, res) => {
            if (err) this.client.logger.error(`Failed to add ${points} points to user ${user.id} due to: ${err.stack}`);
            callback(res.rowCount);
        });
    }

    close() {
        this.connection.end();
    }
}

module.exports = Database;