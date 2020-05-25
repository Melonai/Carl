const {Command} = require('../models/command.js');

module.exports = new Command({
    name: 'Reload Commands',
    description: 'Reloads existing commands and checks for new ones.',
    handles: ['reload-commands', 'reload'],
    execute: main,
    flags: ['hidden', 'trusted']
});

async function main(command, message) {
    command.client.commands.loadCommands();
    await command.client.send(`${command.client.commands.getCommandAmount()} commands were successfully loaded!`, message.channel);
}