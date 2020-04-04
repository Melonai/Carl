const {Command, Verification} = require('../command.js');

module.exports = new Command({
    name: 'Sleep',
    description: 'I go to sleep for a while! ^^',
    handles: ['sleep'],
    execute: main,
    verify: Verification.trusted
});

async function main(command, message, args) {
    message.channel.send('Good night! ^^').then(() => message.client.destroy());
}