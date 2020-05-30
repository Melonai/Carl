const {Command} = require('../models/command.js');

module.exports = new Command({
    name: 'Sleep',
    description: 'I go to sleep for a while! ^^',
    handles: ['sleep'],
    execute: main,
    flags: ['hidden', 'trusted']
});

async function main(command, message) {
    command.client.send('Good night! ^^', message.channel).then(() => message.client.destroy());
}