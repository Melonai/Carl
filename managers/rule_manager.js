const fs = require('fs');

class CommandManager {
    constructor(client) {
        this.client = client;
        this.rules = [];
        this.loadRules();
    }

    addRule(path) {
        const rule = require('../rules/' + path);
        this.rules.push(rule);
        rule.client = this.client;
    }

    loadRules() {
        this.rules = [];
        fs.readdirSync('./rules').forEach(file => {
            if (file.endsWith('.js')) {
                const fullPath = __dirname + '/rules/' + file;
                if (typeof require.cache[fullPath] !== 'undefined') {
                    delete require.cache[fullPath];
                }
                this.addRule(file);
            }
        });
        this.client.logger.info(`${this.rules.length} rules loaded!`);
    }

    getRules() {
        return this.rules;
    }
}

module.exports = CommandManager;