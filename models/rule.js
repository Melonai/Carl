const Discord = require('discord.js');

class Rule {
    constructor({name, triggers = [], condition = () => {return false}, action, flags = []}) {
        Object.assign(this, {name, triggers, condition, action, flags});
        this.client = undefined;
    }

    trigger(message) {
        if (!this.noLogs()) this.client.logger.info(`${message.author.tag} triggered the "${this.name}" rule.`);
        if (!message.deleted) {
            if (!this.action) {
                message.deleted = true;
                message.delete()
                    .catch(() => this.client.logger.error(`"${this.name}" couldn't delete a message.`));
            } else if (typeof this.action === 'string') {
                this.client.send(this.action, message.channel);
            } else if (typeof this.action === 'function') {
                this.action(this, message)
                    .catch(() => this.client.logger.error(`Couldn't trigger the "${this.name}" rule.`));
            }
        }
    }

    check(message) {
        return !message.author.bot && (this.triggers.some(t => message.content.toLowerCase().includes(t)) || this.condition(message));
    }

    blocksCommands() {
        return this.flags.includes('blocks_commands') || !this.action;
    }

    noLogs() {
        return this.flags.includes('no_logs');
    }
}

module.exports = {
    Rule: Rule,
    Discord: Discord
};