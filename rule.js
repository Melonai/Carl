const Discord = require('discord.js');

class Rule {
    constructor({name, triggers = [], condition = () => {return false}, action, flags = []}) {
        Object.assign(this, {name, triggers, condition, action, flags});
        this.client = undefined;
    }

    trigger(message) {
        this.client.logger.info(`${message.author.tag} triggered the "${this.name}" rule.`);
        if (!this.action) {
            message.delete();
        } else if (typeof this.action === 'string') {
            this.client.send(this.action, message.channel);
        } else if (typeof this.action === 'function') {
            if (message.deleted) return;
            this.action(message);
        }
    }

    check(message) {
        return this.triggers.some(t => message.content.toLowerCase().includes(t)) || this.condition(message);
    }

    blocksCommands() {
        return this.flags.includes('blocks_commands') || !this.action;
    }
}

module.exports = {
    Rule: Rule,
    Discord: Discord
};