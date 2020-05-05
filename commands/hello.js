const {Command} = require('../command.js');

module.exports = new Command({
    name: 'Hello!',
    description: 'Mutual greeting!',
    handles: ['hello', 'hello!', 'hai', 'hi'],
    execute: main
});

async function main(command, message) {
    await command.client.send('Hiiii ^^', message.channel);
}