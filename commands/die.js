const Verification = require('../verification.js');

module.exports = {
    name: 'Die',
    description: 'This kills me...',
    handles: ['die'],
    args: [],
    verify: Verification.trusted,
    execute: main
};

async function main(message, args) {
    message.channel.send('Goodbye... :C').then(() => message.client.destroy());
}