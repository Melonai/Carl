const Verification = require('./verification.js');
const Arguments = require('./arguments.js');
const Errors = require('./errors.js');
const Discord = require('discord.js');

class Command {
    constructor({name, description, handles, execute, verify = Verification.everyone, args = []}) {
        Object.assign(this, {name, description, handles, execute, verify, args});
        this.client = undefined;
    }

    run(message, args) {
        if (!this.verify(message.member)) {
            message.channel.send(Errors.PERMISSION_ERROR(this));
            this.client.logger.warn(`${message.author.tag} does not have the permission to execute "${this.name}".`);
            return;
        }
        if (!this.checkArguments(args)) {
            message.channel.send(Errors.ARGUMENT_ERROR(this));
            this.client.logger.info(`${message.author.tag} used the wrong arguments for "${this.name}".`);
            return;
        }
        this.execute(this, message, args).then(() => this.client.logger.info(`${message.author.tag} successfully executed "${this.name}".`))
            .catch((r) => {
                message.channel.send(Errors.GENERAL_ERROR(this));
                this.client.logger.error(`"${this.name}" threw an error on execution: ${r}`);
            });
    }

    checkArguments(givenArguments) {
        if (this.args.length <= givenArguments.length) {
            for (let position = 0; position < this.args.length; position++) {
                if (!this.args[position].check(givenArguments[position])) {
                    return false;
                }
            }
        } else {
            return false;
        }
        return true;
    }

    getUsage() {
        let usage =  `${this.client.config.prefixes[0]} ${this.handles[0]} `;
        this.args.forEach(arg => usage += arg.getName() + " ");
        return usage;
    }
}

module.exports = {
    Command: Command,
    Verification: Verification,
    Arguments: Arguments,
    Discord: Discord
};