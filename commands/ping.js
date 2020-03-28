const Verification = require('../verification.js');

module.exports = {
    name: 'Ping',
    description: 'Pong.',
    handles: ['ping'],
    verify: Verification.everyone,
    execute: main
};

function main(message, args) {
    message.channel.send('Pong.');
}