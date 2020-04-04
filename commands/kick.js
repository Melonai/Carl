const {Command, Verification, Arguments} = require('../command.js');

module.exports = new Command({
    name: 'Kick',
    description: 'Kicks the user mentioned.',
    handles: ['kick'],
    execute: main,
    args: [Arguments.User],
    verify: Verification.admin
});

async function main(command, message, args) {
    const memberToKick = message.mentions.members.first();
    memberToKick.kick();
    message.channel.send(`Successfully kicked ${memberToKick.user.tag}.`);
}