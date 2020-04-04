const {Command, Arguments} = require('../command.js');

module.exports = new Command({
    name: 'Say',
    description: 'I\'ll say whatever you want me to say!',
    handles: ['say'],
    execute: main,
    args: [Arguments.Any]
});

async function main(command, message, args) {
    message.delete();
    message.channel.send(args.join(" "));
}