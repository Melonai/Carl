const Verification = require('../verification.js');

module.exports = {
    name: 'Reload Commands',
    description: 'Reloads existing commands and checks for new ones.',
    handles: ['reload-commands', 'reload'],
    verify: Verification.trusted,
    execute: main
};

function main(message, args) {
    message.client.loadCommands();
    message.channel.send(`${message.client.commands.length} commands were successfully loaded!`);
}