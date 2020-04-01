const Verification = require('../verification.js');

module.exports = {
    name: 'Ping',
    description: 'Pong.',
    handles: ['ping'],
    args: [],
    verify: Verification.everyone,
    execute: main
};

async function main(message, args) {
    message.channel.send('Pong.');
}