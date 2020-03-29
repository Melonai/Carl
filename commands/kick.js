const Verification = require('../verification.js');

module.exports = {
    name: 'Kick',
    description: 'Kicks the user mentioned.',
    handles: ['kick'],
    verify: Verification.admin,
    execute: main
};

async function main(message, args) {
    const memberToKick = message.mentions.members.first();
    memberToKick.kick();
    message.channel.send(`Successfully kicked ${memberToKick.user.tag}.`);
}