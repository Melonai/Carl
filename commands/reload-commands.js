const {Command, Verification} = require('../models/command.js');

module.exports = new Command({
    name: 'Reload Commands',
    description: 'Reloads existing commands and checks for new ones.',
    handles: ['reload-commands', 'reload'],
    execute: main,
    verify: Verification.trusted,
    flags: ['hidden']
});

async function main(command, message) {
    message.client.loadCommands();
    await command.client.send('`${message.client.commands.length} commands were successfully loaded!`', message.channel);
}