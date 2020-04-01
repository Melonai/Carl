const Verification = require('../verification.js');
const Arguments = require('../arguments.js');

module.exports = {
    name: 'Say',
    description: 'I\'ll say whatever you want me to say!',
    handles: ['say'],
    arguments: [Arguments.Any],
    verify: Verification.everyone,
    execute: main
};

async function main(message, args) {
    message.delete();
    message.channel.send(args.join(" "));
}