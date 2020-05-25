const Arguments = require('../arguments.js');
const Errors = require('../errors.js');
const Discord = require('discord.js');

class Command {
    constructor({name, description, handles, execute, userPermissions = [], botPermissions = [], args = [], flags = []}) {
        let args_array = args instanceof Array ? args : [args];
        Object.assign(this, {name, description, handles, execute, userPermissions, botPermissions, args: args_array, flags});
        this.client = undefined;
    }

    run(message, args) {
        if (this.getLackingPermissions(message.member, this.userPermissions).length !== 0 || (this.isTrustedOnly() && !this.client.config.trusted.includes(message.author.id))) {
            console.log(this.getLackingPermissions(message.member, this.userPermissions).length);
            console.log(this.getLackingPermissions(message.member, this.userPermissions).length !== 0);
            this.client.send(Errors.PERMISSION_ERROR(this), message.channel);
            this.client.logger.warn(`${message.author.tag} does not have the permission to execute "${this.name}".`);
            return;
        }
        if (this.getLackingPermissions(message.member, this.botPermissions).length !== 0) {
            this.client.send(Errors.BOT_PERMISSION_ERROR(this), message.channel);
            this.client.logger.warn(`${message.author.tag} does not have the permission to execute "${this.name}".`);
            return;
        }

        let checkedArguments = this.formatArguments(args, {guild: message.guild});
        if (!checkedArguments) {
            this.client.send(Errors.ARGUMENT_ERROR(this), message.channel);
            this.client.logger.info(`${message.author.tag} used the wrong arguments for "${this.name}".`);
            return;
        }

        this.execute(this, message, ...checkedArguments)
            .then(() => this.client.logger.info(`${message.author.tag} successfully executed "${this.name}".`))
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
                    if (!commandArgument.optional) {
                        return false;
                    } else {
                        return [];
                    }
                }
            }

            let userArgument = givenArguments[position];
            let arg = checkType(userArgument, context);
            if (typeof arg !== 'undefined') {
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

    getLackingPermissions(member, permissions) {
        return permissions.filter((permission) => !member.hasPermission(permission));
    }

    getUsage() {
        let usage =  `${this.client.config.prefixes[0]} ${this.handles.join('/')} `;
        this.args.forEach(arg => usage += `[${arg.key}] `);
        return usage;
    }

    isHidden() {
        return this.flags.includes('hidden');
    }

    isTrustedOnly() {
        return this.flags.includes('trusted');
    }
}

module.exports = {
    Command: Command,
    Discord: Discord
};