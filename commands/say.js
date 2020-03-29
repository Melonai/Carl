const Verification = require('../verification.js');

module.exports = {
    name: 'Say',
    description: 'I\'ll say whatever you want me to say!',
    handles: ['say'],
    verify: Verification.everyone,
    execute: main
};

async function main(message, args) {
    message.delete();
    message.channel.send(args.join(" "));
}