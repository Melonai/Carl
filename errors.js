const Discord = require('discord.js');

module.exports = {
    PERMISSION_ERROR: makePermissionError,
    NO_SUCH_COMMAND_ERROR: makeNoSuchCommandError,
    GENERAL_ERROR: makeGeneralError,
    ARGUMENT_ERROR: makeArgumentError
};

const defaultTitle = 'Oh no...';
const defaultColor = '#ff1996';

function makePermissionError(command) {
    const description = `You do not have enough permissions to use "${command.name}".
        To use this command you need at least a permission level of "${command.verify.name}"`;

    return new Discord.MessageEmbed().setTitle(defaultTitle).setDescription(description).setColor(defaultColor);
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
    const description = `The usage for this command is "carl ${command.handles[0]}".`;

    return new Discord.MessageEmbed().setTitle(defaultTitle).setDescription(description).setColor(defaultColor);
}