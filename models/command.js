const Verification = require('../verification.js');
const Arguments = require('../arguments.js');
const Errors = require('../errors.js');
const Discord = require('discord.js');

class Command {
    constructor({name, description, handles, execute, verify = Verification.everyone, args = [], flags = []}) {
        let args_array = args instanceof Array ? args : [args];
        Object.assign(this, {name, description, handles, execute, verify, args: args_array, flags});
        this.client = undefined;
    }

    run(message, args) {
        if (!this.verify(message.member)) {
            this.client.send(Errors.PERMISSION_ERROR(this), message.channel);
            this.client.logger.warn(`${message.author.tag} does not have the permission to execute "${this.name}".`);
            return;
        }
        let checkedArguments = this.formatArguments(args, {guild: message.guild});
        if (!checkedArguments) {
            this.client.send(Errors.ARGUMENT_ERROR(this), message.channel);
            this.client.logger.info(`${message.author.tag} used the wrong arguments for "${this.name}".`);
            return;
        }
        this.execute(this, message, ...checkedArguments).then(() => this.client.logger.info(`${message.author.tag} successfully executed "${this.name}".`))
            .catch((r) => {
                this.client.send(Errors.GENERAL_ERROR(this), message.channel);
                this.client.logger.error(`"${this.name}" threw an error on execution: ${r}`);
            });
    }

    formatArguments(givenArguments, context) {
        let formattedArguments = [];
        for (let position = 0; position < this.args.length; position++) {
            let commandArgument = this.args[position];
            let checkType = Arguments.get(commandArgument.type);
            context.arg = commandArgument;

            if (commandArgument.type === 'text') {
                let text = checkType(givenArguments.join(' '), context);
                if (text) {
                    return [text];
                } else {
                    return false;
                }
            }

            let userArgument = givenArguments[position];
            let arg = checkType(userArgument, context);
            if (arg) {
                formattedArguments.push(arg);
            } else {
                if (!commandArgument.optional) {
                    return false;
                } else {
                    formattedArguments.push(commandArgument.default);
                }
            }
        }
        return formattedArguments;
    }

    getUsage() {
        let usage =  `${this.client.config.prefixes[0]} ${this.handles.join('/')} `;
        this.args.forEach(arg => usage += `[${arg.key}] `);
        return usage;
    }

    isHidden() {
        return this.flags.includes('hidden');
    }
}

module.exports = {
    Command: Command,
    Verification: Verification,
    Discord: Discord
};