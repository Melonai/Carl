const {Command} = require('../command.js');

module.exports = new Command({
    name: 'Say',
    description: 'I\'ll say whatever you want me to say!',
    handles: ['say'],
    execute: main,
    args: {key: 'text', type: 'text'}
});

async function main(command, message, text) {
    message.delete();
    await command.client.send(text, message.channel);
}