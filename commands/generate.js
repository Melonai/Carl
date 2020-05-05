const {Command} = require('../command.js');

module.exports = new Command({
    name: 'Generate',
    description: 'I\'ll give you a number between the two numbers you picked.',
    handles: ['generate'],
    execute: main,
    args: [{key: 'from', type: 'number'}, {key: 'to', type: 'number'}],
});

async function main(command, message, from, to) {
    await command.client.send(Math.round(Math.random() * (to - from) + from).toString(), message.channel);
}