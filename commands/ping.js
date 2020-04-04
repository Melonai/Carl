const {Command} = require('../command.js');

module.exports = new Command({
    name: 'Ping',
    description: 'Pong.',
    handles: ['ping'],
    execute: main
});

async function main(command, message, args) {
    message.channel.send('Pong.');
}