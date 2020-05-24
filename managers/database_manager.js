const pg = require('pg');

class DatabaseManager {
    constructor(url, client) {
        this.client = client;
        this.connection = new pg.Client({
            connectionString: url,
            ssl: {rejectUnauthorized: false}
        });
        this.connection.connect().catch(() => {
            this.connection = undefined;
            this.client.logger.error('No database connection could be established.')
        });
    }

    async getUser(user, callback) {
        if (this.connection) {
            let query = 'SELECT * FROM users WHERE id = $1';
            this.connection.query(query, [user.id], (err, res) => {
                if (err) {
                    this.client.logger.error(`Failed to get user ${user.id} due to: ${err.stack}`);
                    return undefined;
                }
                return callback(res.rows[0]);
            });
        } else {
            return undefined;
        }
    }

    async getTopUsers(callback) {
        if (this.connection) {
            let query = 'SELECT * FROM users ORDER BY points DESC;';
            this.connection.query(query, [], (err, res) => {
                if (err) {
                    this.client.logger.error(`Failed to get top users due to: ${err.stack}`);
                    return undefined;
                }
                return callback(res.rows);
            });
        } else {
            return undefined;
        }
    }

    async addUser(user) {
        if (this.connection) {
            let query = 'INSERT INTO users(id, points) VALUES ($1, 0)';
            this.connection.query(query, [user.id]).catch(err => {
                if (err) this.client.logger.error(`Failed to add user ${user.id} due to: ${err.stack}`);
            });
        }
    }

    async addPoints(user, points, callback) {
        if (this.connection) {
            let query = 'UPDATE users SET points = points + $1 WHERE id = $2';
            this.connection.query(query, [points, user.id], (err, res) => {
                if (err) this.client.logger.error(`Failed to add ${points} points to user ${user.id} due to: ${err.stack}`);
                callback(res.rowCount);
            });
        }
    }

    close() {
        if (this.connection) {
            this.connection.end();
        }
    }

    connectionExists() {
        return typeof this.connection !== 'undefined';
    }
}

module.exports = DatabaseManager;