const Discord = require('discord.js');

module.exports = {
    PERMISSION_ERROR: makePermissionError,
    BOT_PERMISSION_ERROR: makeBotPermissionError,
    NO_SUCH_COMMAND_ERROR: makeNoSuchCommandError,
    GENERAL_ERROR: makeGeneralError,
    ARGUMENT_ERROR: makeArgumentError
};

const defaultTitle = 'Oh no...';
const defaultColor = '#ff0030';

function makePermissionError(command) {
    if (!command.isHidden()) {
        const description = `You do not have enough permissions to use "${command.name}".
        Make sure you have these permissions ["${command.userPermissions.join('/')}"]`;

        return new Discord.MessageEmbed().setTitle(defaultTitle).setDescription(description).setColor(defaultColor);
    } else {
        return makeNoSuchCommandError(command.handles[0]);
    }
}

function makeBotPermissionError(command) {
    if (!command.isHidden()) {
        const description = `I don't have enough permissions to execute "${command.name}" for you.
        Make sure I have these permissions: ["${command.botPermissions.join('/')}"]`;

        return new Discord.MessageEmbed().setTitle(defaultTitle).setDescription(description).setColor(defaultColor);
    } else {
        return makeNoSuchCommandError();
    }
}

function makeNoSuchCommandError(cmd) {
    const description = `A command named "${cmd}" was not found.`;

    return new Discord.MessageEmbed().setTitle(defaultTitle).setDescription(description).setColor(defaultColor);
}

function makeGeneralError() {
    const description = 'An error occurred.';

    return new Discord.MessageEmbed().setTitle(defaultTitle).setDescription(description).setColor(defaultColor);
}

function makeArgumentError(command) {
    const description = `The usage for this command is "${command.getUsage()}".`;

    return new Discord.MessageEmbed().setTitle(defaultTitle).setDescription(description).setColor(defaultColor);
}