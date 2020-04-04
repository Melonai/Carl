const {Command, Arguments} = require('../command.js');

module.exports = new Command({
    name: 'Generate',
    description: 'I\'ll give you a number between the two numbers you picked.',
    handles: ['generate'],
    execute: main,
    args: [Arguments.Number, Arguments.Number],
});

async function main(command, message, args) {
    const low = parseInt(args[0]);
    const high = parseInt(args[1]);
    message.channel.send(Math.round(Math.random() * (high - low) + low).toString());
}