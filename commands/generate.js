const Verification = require('../verification.js');
const Arguments = require('../arguments.js');

module.exports = {
    name: 'Generate',
    description: 'I\'ll give you a number between the two numbers you picked.',
    handles: ['generate'],
    args: [Arguments.Number, Arguments.Number],
    verify: Verification.everyone,
    execute: main
};

async function main(message, args) {
    const low = parseInt(args[0]);
    const high = parseInt(args[1]);
    message.channel.send(Math.round(Math.random() * (high - low) + low).toString());
}