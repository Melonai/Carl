const {Command, Verification} = require('../command.js');

module.exports = new Command({
    name: 'Sleep',
    description: 'I go to sleep for a while! ^^',
    handles: ['sleep'],
    execute: main,
    verify: Verification.trusted,
    tags: ['hidden']
});

async function main(command, message) {
    await command.client.send('Good night! ^^', message.channel);
    message.client.destroy();
}