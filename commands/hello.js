const Verification = require('../verification.js');

module.exports = {
    name: 'Hello!',
    description: 'Mutual greeting!',
    handles: ['hello', 'hello!', 'hai', 'hi'],
    verify: Verification.everyone,
    execute: main
};

function main(message, args) {
    message.channel.send('Hiiii ^^');
}