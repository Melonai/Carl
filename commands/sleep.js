const {Command, Verification} = require('../models/command.js');

module.exports = new Command({
    name: 'Sleep',
    description: 'I go to sleep for a while! ^^',
    handles: ['sleep'],
    execute: main,
    verify: Verification.trusted,
    flags: ['hidden']
});

async function main(command, message) {
    await command.client.send('Good night! ^^', message.channel);
    message.client.destroy();
}