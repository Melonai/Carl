const {Command, Verification} = require('../command.js');

module.exports = new Command({
    name: 'Reload Commands',
    description: 'Reloads existing commands and checks for new ones.',
    handles: ['reload-commands', 'reload'],
    execute: main,
    verify: Verification.trusted,
});

async function main(command, message, args) {
    message.client.loadCommands();
    message.channel.send(`${message.client.commands.length} commands were successfully loaded!`);
}