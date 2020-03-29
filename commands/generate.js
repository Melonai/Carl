const Verification = require('../verification.js');

module.exports = {
    name: 'Generate',
    description: 'I\'ll give you a number between the two numbers you picked.',
    handles: ['generate'],
    verify: Verification.everyone,
    execute: main
};

async function main(message, args) {
    const lowercase_args = args.map(a => a.toLowerCase());
    const low = parseInt(lowercase_args.indexOf('from') + 1);
    const high = parseInt(lowercase_args.indexOf('to') + 1);
    message.channel.send(Math.round(Math.random() * (high - low) + low).toString());
}