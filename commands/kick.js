const Verification = require('../verification.js');
const Arguments = require('../arguments.js');

module.exports = {
    name: 'Kick',
    description: 'Kicks the user mentioned.',
    handles: ['kick'],
    args: [Arguments.User],
    verify: Verification.admin,
    execute: main
};

async function main(message, args) {
    const memberToKick = message.mentions.members.first();
    memberToKick.kick();
    message.channel.send(`Successfully kicked ${memberToKick.user.tag}.`);
}