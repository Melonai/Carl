const {Command, Discord} = require('../models/command.js');

module.exports = new Command({
    name: 'Help',
    description: 'I\'ll help you with a command!',
    handles: ['help'],
    execute: main,
    args: {key: 'command', type: 'some'}
});

async function main(command, message, cmd) {
    const commandToCheck = command.client.commands.getCommand(cmd);
    if (typeof commandToCheck !== 'undefined' && !commandToCheck.isHidden()) {
        const title = commandToCheck.name;
        const description = commandToCheck.description;

        const embed = new Discord.MessageEmbed();
        embed.setTitle(title).setDescription(description);
        embed.addField('Usage', commandToCheck.getUsage());
        embed.addField('Permissions', command.userPermissions.join('/') || "None");

        await command.client.send(embed, message.channel);
    } else {
        await command.client.send('No such command found.', message.channel);
    }
}