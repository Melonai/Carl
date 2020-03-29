const Discord = require('discord.js');

module.exports = {
    PERMISSION_ERROR: makePermissionError,
    NO_SUCH_COMMAND_ERROR: makeNoSuchCommandError,
    GENERAL_ERROR: makeGeneralError
};

const defaultTitle = 'Oh no...';
const defaultColor = '#ff1996';

function makePermissionError(command) {
    const description = `You do not have enough permissions to use "${command.name}".
        To use this command you need at least a permission level of "${command.verify.name.toUpperCase()}"`;

    return new Discord.MessageEmbed().setTitle(defaultTitle).setDescription(description).setColor(defaultColor);
}

function makeNoSuchCommandError(command) {
    const description = `A command named "${command}" was not found.`;

    return new Discord.MessageEmbed().setTitle(defaultTitle).setDescription(description).setColor(defaultColor);
}

function makeGeneralError() {
    const description = 'An error occurred.';

    return new Discord.MessageEmbed().setTitle(defaultTitle).setDescription(description).setColor(defaultColor);
}